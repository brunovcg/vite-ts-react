import { TextArea } from "./TextArea.component";
import type { ComponentDoc } from "@/types/component-doc.types";
import type { ComponentProps } from "react";

export const textAreaDoc: ComponentDoc<ComponentProps<typeof TextArea>> = {
  id: "text-area",
  name: "TextArea",
  description: "A multi-line text input field.",
  component: TextArea,
  args: {
    id: "textarea-demo",
    name: "textarea-demo",
    label: "Description",
    placeholder: "Enter details here...",
    rows: 4,
    loading: false,
    disabled: false,
  },
  argTypes: {
    loading: {
      type: "boolean",
    },
    disabled: {
      type: "boolean",
    },
    rows: {
      type: "number",
    },
  },
};
