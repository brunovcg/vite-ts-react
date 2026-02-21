import { Icon } from "./Icon.component";
import type { ComponentDoc } from "@/types/component-doc.types";
import type { IconProps } from "./Icon.component.types";
import { icons } from "./Icon.component.register";

export const iconDoc: ComponentDoc<IconProps> = {
  id: "icon",
  name: "Icon",
  description: "Renders an SVG icon from the system library.",
  component: Icon,
  args: {
    icon: "codeFrontend",
    size: "md",
    color: "primary",
    mirrored: false,
    hide: false,
  },
  argTypes: {
    icon: {
      type: "select",
      options: Object.keys(icons),
    },
    size: {
      type: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    color: {
      type: "select",
      options: ["primary", "error", "warning", "success", "white", "black"],
    },
    mirrored: {
      type: "boolean",
    },
    hide: {
      type: "boolean",
    },
  },
};
