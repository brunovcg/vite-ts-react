import type { Css, PropsWithCss } from "@/runtime/css.types";
import type { PropsWithChildren } from "react";
import { Tabs } from "./Tabs";

interface TabsProps<TabId extends string | number> {
  children: React.ReactNode;
  tabs: { label: string; id: TabId; disabled?: boolean; hidden?: boolean }[];
  id: string;
  orientation?: "vertical" | "horizontal";
}

interface TabsItemProps<TabId extends string | number> {
  id: TabId;
  children: React.ReactNode;
  css?: Css;
  className?: string;
}

export function createTabs<TabId extends string | number>() {
  return Tabs as unknown as {
    (props: TabsProps<TabId>): React.ReactElement;
    Item: (props: TabsItemProps<TabId>) => React.ReactElement | null;
    Nav: (props: PropsWithCss) => React.ReactElement;
    NoData: (props: PropsWithChildren) => React.ReactElement | null;
  };
}
