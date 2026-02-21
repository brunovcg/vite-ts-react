import { Portal } from "./Portal.component";
import type { ComponentDoc } from "@/types/component-doc.types";

function PortalDemo(props: React.ComponentProps<typeof Portal>) {
  return (
    <div css={["display-flex", "flex-column", "gap-lg"]}>
      <div css={["padding-md", "border", "border-radius-md", "background-warning-light"]}>
        <div css={["text-bold", "margin-bottom-sm"]}>Source Container (where Portal is declared)</div>
        <p css={["font-size-sm", "color-typeface-light", "margin-bottom-md"]}>The Portal component is declared here in the React tree.</p>
        <Portal {...props} />
      </div>

      <div css={["padding-md", "border", "border-radius-md", "background-light"]} id='portal-target-demo'>
        <div css={["text-bold", "margin-bottom-sm"]}>Target Container (id="portal-target-demo")</div>
        <p css={["font-size-sm", "color-typeface-light", "margin-bottom-md"]}>This is where the Portal content actually appears in the DOM.</p>
      </div>
    </div>
  );
}

export const portalDoc: ComponentDoc<React.ComponentProps<typeof Portal>> = {
  id: "portal",
  name: "Portal",
  description: "Renders children into a DOM node that exists outside the DOM hierarchy of the parent component.",
  component: PortalDemo,
  args: {
    children: (
      <div css={["padding-md", "background-success-light", "border-radius-md", "border", "color-success"]} style={{ borderColor: "var(--color-success)" }}>
        <strong>Portal Content:</strong> This is rendered inside the target div (below), even though it is declared inside the source div (above).
      </div>
    ),
    targetId: "portal-target-demo",
  },
  argTypes: {
    targetId: {
      type: "text",
    },
  },
};
