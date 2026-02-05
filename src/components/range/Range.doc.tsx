import { Range } from "./Range";
import type { ComponentDoc } from "@/types/component-doc.types";
import type { InputHTMLAttributes } from "react";
import type { Css } from "@/runtime/css.types";

interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  css?: Css;
  className?: string;
  inputCss?: Css;
  inputClassName?: string;
  label?: string;
  labelSide?: "left" | "right" | "top" | "bottom";
}

export const rangeDoc: ComponentDoc<RangeProps> = {
  id: "range",
  name: "Range",
  description: "A range slider input for selecting numeric values.",
  component: Range,
  args: {
    label: "Volume",
    labelSide: "left",
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    disabled: false,
  },
  argTypes: {
    label: {
      type: "text",
    },
    labelSide: {
      type: "select",
      options: ["left", "right", "top", "bottom"],
      defaultValue: "left",
    },
    min: {
      type: "number",
    },
    max: {
      type: "number",
    },
    step: {
      type: "number",
    },
    value: {
      type: "number",
    },
    disabled: {
      type: "boolean",
    },
  },
};
