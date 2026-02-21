import type { HTMLAttributes } from "react";
import { icons } from "./Icon.component.register";
import type { CssVariable } from "@/runtime/css.types";

export const iconSizes = ["xs", "sm", "md", "lg", "xl"] as const;

export type IconSize = (typeof iconSizes)[number];

export type IconName = keyof typeof icons;

export type IconProps = {
  size?: IconSize;
  icon: IconName;
  color?: keyof CssVariable["color"];
  className?: string;
  mirrored?: boolean;
  title?: string;
  hide?: boolean;
  margin?: string;
  dataTestId?: string;
  decorative?: boolean;
  "aria-label"?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "aria-label">;
