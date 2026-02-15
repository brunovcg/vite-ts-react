import { DropdownMenu } from "./DropdownMenu";
import type { ComponentDoc } from "@/types/component-doc.types";

type DropdownMenuProps = React.ComponentProps<typeof DropdownMenu>;

export const dropdownMenuDoc: ComponentDoc<DropdownMenuProps> = {
  id: "dropdown-menu",
  name: "DropdownMenu",
  description: "A toggleable dropdown menu with configurable trigger and action options.",
  component: DropdownMenu,
  args: {
    label: "Actions",
    icon: "ellipsis-vertical",
    options: [
      { label: "Edit", onClick: () => console.log("Edit"), icon: "pen" },
      { label: "Duplicate", onClick: () => console.log("Duplicate"), icon: "copy" },
      { label: "Delete", onClick: () => console.log("Delete"), icon: "trash", color: "error" },
    ],
  },
  argTypes: {
    label: { type: "text" },
    icon: { type: "text" },
  },
};
