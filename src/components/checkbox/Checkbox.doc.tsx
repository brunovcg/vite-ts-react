import { Checkbox } from "./Checkbox";
import type { ComponentDoc } from "@/types/component-doc.types";
import type { InputHTMLAttributes } from "react";
import type { Css } from "@/runtime/css.types";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  css?: Css;
  inputCss?: Css;
  className?: string;
  inputClassName?: string;
  label?: string;
  type?: "checkbox" | "radio";
  labelSide?: "left" | "right";
};

export const checkboxDoc: ComponentDoc<CheckboxProps> = {
  id: "checkbox",
  name: "Checkbox",
  description: "A checkbox or radio input with customizable label positioning.",
  component: Checkbox,
  args: {
    label: "Accept Terms",
    type: "checkbox",
    labelSide: "right",
    disabled: false,
    required: false,
    checked: false,
  },
  argTypes: {
    label: {
      type: "text",
    },
    type: {
      type: "select",
      options: ["checkbox", "radio"],
      defaultValue: "checkbox",
    },
    labelSide: {
      type: "select",
      options: ["left", "right"],
      defaultValue: "right",
    },
    disabled: {
      type: "boolean",
    },
    required: {
      type: "boolean",
    },
    checked: {
      type: "boolean",
    },
  },
};
