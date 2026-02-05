import { ButtonIcon, type ButtonIconProps } from "./ButtonIcon";
import type { ComponentDoc } from "@/types/component-doc.types";

export const buttonIconDoc: ComponentDoc<ButtonIconProps> = {
  id: "button-icon",
  name: "ButtonIcon",
  description: "A button component that renders an icon.",
  component: ButtonIcon,
  args: {
    icon: "close",
    color: "primary",
    noBorder: false,
    disabled: false,
  },
  argTypes: {
    icon: {
      type: "select",
      options: ["close", "menu", "search", "loading", "codeFrontend", "sort", "sortAsc", "sortDesc"], // Simplified list
    },
    color: {
      type: "select",
      options: ["primary", "error"],
    },
    noBorder: {
      type: "boolean",
    },
    disabled: {
      type: "boolean",
    },
  },
};
