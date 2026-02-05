import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type Tab<TabId extends string | number> = { label: string; id: TabId; disabled?: boolean; hidden?: boolean };

interface TabsContextProps<TabId extends string | number> {
  activeTab: TabId;
  setActiveTab: (tabId: TabId) => void;
  tabs: Tab<TabId>[];
}

interface TabsProps<TabId extends string | number> {
  children: React.ReactNode;
  tabs: Tab<TabId>[];
  id: string;
}

interface TabsItemProps {
  id: string | number;
  children: React.ReactNode;
}

const TabsContext = createContext<TabsContextProps<string | number> | null>(null);

const useTabContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabContext must be used within a Tabs");
  }
  return context;
};

export function Tabs<TabId extends string | number>({ children, tabs, id }: TabsProps<TabId>) {
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

  return <TabsContext.Provider value={useMemo(() => ({ activeTab, setActiveTab, tabs }), [activeTab, setActiveTab, tabs])}>{children}</TabsContext.Provider>;
}

function TabItem({ children, id }: TabsItemProps) {
  const { activeTab } = useTabContext();
  return (
    <div css={[{ "display-none": activeTab !== id }]} data-component='TabItem'>
      {children}
    </div>
  );
}

function TabNav() {
  const { setActiveTab, tabs, activeTab } = useTabContext();
  return (
    <nav css={["border-bottom", "width-fit", "padding-inline-sm"]} data-component='TabNav'>
      <ul css={["display-flex", "gap-md"]}>
        {tabs.filterMap(
          (tab) => !tab.hidden,
          (tab) => (
            <li>
              <button
                css={[
                  "cursor-pointer",
                  "border-none",
                  "padding-md",
                  "border-top-radius-sm",
                  "text-bold",
                  { "background-primary": tab.id === activeTab, "color-white": tab.id === activeTab, "background-white": tab.id !== activeTab, "color-primary": tab.id !== activeTab },
                ]}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

Tabs.Item = TabItem;
Tabs.Nav = TabNav;
