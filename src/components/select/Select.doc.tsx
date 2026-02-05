import { Select } from "./Select";
import type { ComponentDoc } from "@/types/component-doc.types";
import type { ComponentProps } from "react";

export const selectDoc: ComponentDoc<ComponentProps<typeof Select>> = {
  id: "select",
  name: "Select",
  description: "A dropdown selection component.",
  component: Select,
  args: {
    id: "select-demo",
    name: "select-demo",
    label: "Role",
    placeholder: "Select a role...",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Guest", value: "guest" },
    ],
    loading: false,
    disabled: false,
    allowClear: true,
  },
  argTypes: {
    loading: {
      type: "boolean",
    },
    disabled: {
      type: "boolean",
    },
    allowClear: {
      type: "boolean",
    },
  },
};
