import { Tooltip } from "./Tooltip";
import type { ComponentDoc } from "@/types/component-doc.types";
import { Button } from "../button/Button";

export const tooltipDoc: ComponentDoc<React.ComponentProps<typeof Tooltip>> = {
  id: "tooltip",
  name: "Tooltip",
  description: "A floating label that appears on hover or focus to provide additional context.",
  component: Tooltip,
  args: {
    content: "Tooltip text",
    position: "top",
    delay: 300,
    disabled: false,
    children: <Button>Hover me</Button>,
  },
  argTypes: {
    position: {
      type: "select",
      options: ["top", "bottom", "left", "right"],
    },
    delay: {
      type: "number",
      min: 0,
      max: 2000,
      defaultValue: 300,
    },
    disabled: {
      type: "boolean",
    },
    content: {
      type: "text",
    },
  },
};
