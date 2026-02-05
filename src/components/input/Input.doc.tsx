import { Input, type InputProps } from "./Input";
import type { ComponentDoc } from "@/types/component-doc.types";

export const inputDoc: ComponentDoc<InputProps> = {
  id: "input",
  name: "Input",
  description: "A standard text input field.",
  component: Input,
  args: {
    id: "input-demo",
    name: "input-demo",
    type: "text",
    label: "Username",
    placeholder: "Enter username...",
    disabled: false,
    loading: false,
    debounce: 0,
  },
  argTypes: {
    type: {
      type: "select",
      options: ["text", "number", "email", "password", "color", "date", "datetime-local", "month", "time", "week", "tel", "url", "search", "file", "checkbox", "radio", "range"],
      defaultValue: "text",
    },
    id: {
      type: "text",
    },
    name: {
      type: "text",
    },
    label: {
      type: "text",
    },
    placeholder: {
      type: "text",
    },
    disabled: {
      type: "boolean",
    },
    loading: {
      type: "boolean",
    },
    debounce: {
      type: "number",
    },
  },
};
