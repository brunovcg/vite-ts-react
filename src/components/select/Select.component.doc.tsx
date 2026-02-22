import { Select } from "./Select.component";
import type { ComponentDoc } from "@/types/component-doc.types";
import type { ComponentProps } from "react";

export const selectDoc: ComponentDoc<ComponentProps<typeof Select>> = {
  id: "select",
  name: "Select",
  description: "A dropdown selection component with custom option rendering, multiselect, search, and edge-aware positioning.",
  component: Select,
  args: {
    id: "select-demo",
    name: "select-demo",
    label: "Role",
    placeholder: "Select a role...",
    css: ["width-200px"],
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Guest", value: "guest" },
    ],
    loading: false,
    disabled: false,
    clearable: true,
    searchable: false,
    multiple: false,
    required: false,
  },
  argTypes: {
    loading: {
      type: "boolean",
    },
    disabled: {
      type: "boolean",
    },
    clearable: {
      type: "boolean",
    },
    searchable: {
      type: "boolean",
    },
    required: {
      type: "boolean",
    },
    multiple: {
      type: "boolean",
    },
  },
};
