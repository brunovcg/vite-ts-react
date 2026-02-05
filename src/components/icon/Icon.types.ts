import type { HTMLAttributes } from "react";
import { icons } from "./Icons";

import type { Color } from "@/constants/colors.constants";

export const iconSizes = ["xs", "sm", "md", "lg", "xl"] as const;

export type IconSize = (typeof iconSizes)[number];

export type IconName = keyof typeof icons;

export type IconProps = {
  size?: IconSize;
  icon: IconName;
  color?: Color;
  className?: string;
  mirrored?: boolean;
  title?: string;
  hide?: boolean;
  margin?: string;
  dataTestId?: string;
} & HTMLAttributes<HTMLSpanElement>;
