import { Chip } from "./Chip.component";
import type { ComponentDoc } from "@/types/component-doc.types";

export const chipDoc: ComponentDoc<React.ComponentProps<typeof Chip>> = {
  id: "chip",
  name: "Chip",
  description: "A small component to display status or category.",
  component: Chip,
  args: {
    children: "Active",
    color: "success",
  },
  argTypes: {
    color: {
      type: "select",
      options: ["primary", "error", "warning", "success"],
    },
  },
};
