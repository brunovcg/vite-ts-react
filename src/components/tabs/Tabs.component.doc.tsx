import type { ComponentType } from "react";
import { Tabs } from "./Tabs.component";
import type { ComponentDoc } from "@/types/component-doc.types";

interface DemoTab {
  id: string;
  label: string;
  disabled?: boolean;
}

export const tabsDoc: ComponentDoc<{ id: string; tabs: DemoTab[]; children: React.ReactNode }> = {
  id: "tabs",
  name: "Tabs",
  description: "A tabbed interface for switching content.",
  component: Tabs as unknown as ComponentType<{ id: string; tabs: DemoTab[]; children: React.ReactNode }>,
  args: {
    id: "demo-tabs",
    tabs: [
      { id: "tab1", label: "Overview" },
      { id: "tab2", label: "Details" },
      { id: "tab3", label: "Settings", disabled: false },
    ],
    children: null,
  },
  argTypes: {
    tabs: { type: "object" },
  },
};

// Start Over: Cleaner approach for Tabs which requires compound components
// We need to export a specific wrapper that uses the props.

function TabsDemo({ id, tabs }: { id: string; tabs: DemoTab[] }) {
  return (
    <Tabs id={id} tabs={tabs}>
      <Tabs.Nav />
      <div css={["padding-lg", "border", "border-none", "border-top", "background-white"]}>
        {tabs.map((t) => (
          <Tabs.Item key={t.id} id={t.id}>
            <h3 css={["margin-bottom-sm"]}>{t.label} Content</h3>
            <p>This is the content for the {t.label} tab.</p>
          </Tabs.Item>
        ))}
      </div>
    </Tabs>
  );
}

// Re-assign the component to the wrapper
tabsDoc.component = TabsDemo as unknown as ComponentType<{ id: string; tabs: DemoTab[]; children: React.ReactNode }>;
