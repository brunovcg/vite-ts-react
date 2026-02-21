import { DropdownMenu } from "./DropdownMenu";
import type { ComponentDoc } from "@/types/component-doc.types";

type DropdownMenuProps = React.ComponentProps<typeof DropdownMenu>;

export const dropdownMenuDoc: ComponentDoc<DropdownMenuProps> = {
  id: "dropdown-menu",
  name: "DropdownMenu",
  description: "A toggleable dropdown menu with configurable trigger and action options.",
  component: DropdownMenu,
  args: {
    trigger: {
      label: "Actions",
      icon: "menu",
    },
    options: [
      { label: "Edit", onClick: () => console.log("Edit"), icon: "edit" },
      { label: "Duplicate", onClick: () => console.log("Duplicate"), icon: "copy" },
      { label: "Delete", onClick: () => console.log("Delete"), icon: "trash", color: "error" },
    ],
  },
  argTypes: {
    trigger: { type: "object" },
    options: { type: "object" },
  },
};
