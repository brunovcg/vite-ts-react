import { Button, type ButtonProps } from "./Button.component";
import type { ComponentDoc } from "@/types/component-doc.types";

export const buttonDoc: ComponentDoc<ButtonProps> = {
  id: "button",
  name: "Button",
  description: "A versatile button component used for actions.",
  component: Button,
  args: {
    children: "Button Text",
    variant: "regular",
    color: "primary",
    disabled: false,
    loading: false,
    loadingMessage: "Loading...",
  },
  argTypes: {
    variant: {
      type: "select",
      options: ["regular", "filled", "outlined"],
    },
    color: {
      type: "select",
      options: ["primary", "error"],
    },
    loading: {
      type: "boolean",
    },
    disabled: {
      type: "boolean",
    },
  },
};
