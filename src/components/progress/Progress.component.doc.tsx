import { Progress } from "./Progress.component";
import type { ComponentDoc } from "@/types/component-doc.types";
import type { ProgressHTMLAttributes } from "react";
import type { Css } from "@/runtime/css.types";

interface ProgressProps extends ProgressHTMLAttributes<HTMLProgressElement> {
  css?: Css;
  className?: string;
  label?: string;
}

export const progressDoc: ComponentDoc<ProgressProps> = {
  id: "progress",
  name: "Progress",
  description: "A progress bar to indicate task completion status.",
  component: Progress,
  args: {
    label: "Upload Progress",
    value: 50,
    max: 100,
  },
  argTypes: {
    label: {
      type: "text",
    },
    value: {
      type: "number",
    },
    max: {
      type: "number",
    },
  },
};
