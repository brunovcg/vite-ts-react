import type { Css, PropsWithCss } from "@/runtime/css.types";

import { createContext, useContext, useMemo, useCallback, useRef, type PropsWithChildren } from "react";
import "./Tabs.css";
import { useSearchParams } from "react-router-dom";

type Tab<TabId extends string | number> = { label: string; id: TabId; disabled?: boolean; hidden?: boolean };

interface TabsContextProps<TabId extends string | number> {
  activeTab: TabId | null;
  setActiveTab: (tabId: TabId) => void;
  tabs: Tab<TabId>[];
  baseId: string;
  orientation: "vertical" | "horizontal";
}

interface TabsProps<TabId extends string | number> {
  children: React.ReactNode;
  tabs: Tab<TabId>[];
  id: string;
  orientation?: "vertical" | "horizontal";
}

interface TabsItemProps<TabId extends string | number> {
  id: TabId;
  children: React.ReactNode;
  css?: Css;
  className?: string;
}

const TabsContext = createContext<TabsContextProps<string | number> | null>(null);

const useTabContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabContext must be used within a Tabs");
  }
  return context;
};

export function Tabs<TabId extends string | number>({ children, tabs, id, orientation = "horizontal" }: TabsProps<TabId>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramKey = `tab:id=${id}-active`;

  const activeTab = useMemo(() => {
    const urlValue = searchParams.get(paramKey);
    if (urlValue) {
      const found = tabs.find((t) => String(t.id) === urlValue);
      if (found) return found.id;
    }
    return tabs[0].id;
  }, [searchParams, paramKey, tabs]);

  const setActiveTab = useCallback(
    (value: string | number) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set(paramKey, String(value));
          return newParams;
        },
        { replace: true },
      );
    },
    [paramKey, setSearchParams],
  );

  return <TabsContext.Provider value={useMemo(() => ({ activeTab, setActiveTab, tabs, baseId: id, orientation }), [activeTab, setActiveTab, tabs, id, orientation])}>{children}</TabsContext.Provider>;
}

function TabItem<TabId extends string | number>({ children, id, css, className }: TabsItemProps<TabId>) {
  const { activeTab, baseId } = useTabContext();
  const isActive = activeTab === id;
  const panelId = `${baseId}-panel-${id}`;
  const tabId = `${baseId}-tab-${id}`;

  if (!isActive) return null;

  return (
    <section role='tabpanel' id={panelId} aria-labelledby={tabId} tabIndex={0} css={css} className={className} data-component='TabItem'>
      {children}
    </section>
  );
}

function TabNav({ css }: PropsWithCss) {
  const { setActiveTab, tabs, activeTab, baseId, orientation } = useTabContext();

  const visibleTabs = useMemo(() => tabs.filter((t) => !t.hidden && !t.disabled), [tabs]);
  const tabRefs = useRef<Map<string | number, HTMLButtonElement>>(new Map());

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      let nextIndex = currentIndex;
      let shouldPreventDefault = false;

      const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
      const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

      switch (e.key) {
        case nextKey:
          shouldPreventDefault = true;
          nextIndex = (currentIndex + 1) % visibleTabs.length;
          break;
        case prevKey:
          shouldPreventDefault = true;
          nextIndex = (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
          break;
        case "Home":
          shouldPreventDefault = true;
          nextIndex = 0;
          break;
        case "End":
          shouldPreventDefault = true;
          nextIndex = visibleTabs.length - 1;
          break;
      }

      if (shouldPreventDefault) {
        e.preventDefault();
        const nextTab = visibleTabs[nextIndex];
        setActiveTab(nextTab.id);
        setTimeout(() => {
          tabRefs.current.get(nextTab.id)?.focus();
        }, 0);
      }
    },
    [visibleTabs, setActiveTab, orientation],
  );

  return (
    <nav css={[orientation === "vertical" ? "border-right" : "border-bottom", orientation === "horizontal" && "width-fit", "padding-inline-sm", css]} data-component='TabNav'>
      <ul role='tablist' aria-orientation={orientation} css={["display-flex", { "flex-column": orientation === "vertical" }, "gap-md"]}>
        {tabs.filterMap(
          (tab) => !tab.hidden,
          (tab) => {
            const isActive = tab.id === activeTab;
            const tabId = `${baseId}-tab-${tab.id}`;
            const panelId = `${baseId}-panel-${tab.id}`;
            const visibleIndex = visibleTabs.findIndex((t) => t.id === tab.id);

            return (
              <li role='presentation' key={tab.id}>
                <button
                  ref={(el) => {
                    if (el) {
                      tabRefs.current.set(tab.id, el);
                    } else {
                      tabRefs.current.delete(tab.id);
                    }
                  }}
                  role='tab'
                  id={tabId}
                  aria-selected={isActive}
                  aria-controls={panelId}
                  tabIndex={isActive ? 0 : -1}
                  disabled={tab.disabled}
                  css={[
                    "cursor-pointer",
                    "border-none",
                    "padding-md",
                    "text-bold",
                    orientation === "vertical" && "width-full",
                    orientation === "vertical" && "text-left",
                    "border-radius-sm",
                    {
                      "background-primary": isActive,
                      "color-white": isActive,
                      "background-white": !isActive,
                      "color-primary": !isActive,
                    },
                  ]}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, visibleIndex)}
                >
                  {tab.label}
                </button>
              </li>
            );
          },
        )}
      </ul>
    </nav>
  );
}

function TabNoData({ children }: PropsWithChildren) {
  const { activeTab } = useTabContext();

  if (activeTab === null) {
    return <section data-component='TabNoData'>{children}</section>;
  }
  return null;
}

Tabs.Item = TabItem;
Tabs.Nav = TabNav;
Tabs.NoData = TabNoData;
