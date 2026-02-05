import type { IconProps } from "./Icon.types";
import { forwardRef, type ForwardedRef } from "react";

import { icons } from "./Icons";

import "./Icon.css";
import { ClassNames } from "@/utils/class-names/ClassNames.util";
import { COLORS } from "@/constants/colors.constants";

function IconComponent({ icon, size = "sm", color, margin = "0", className = "", mirrored, hide, dataTestId, title, ...rest }: IconProps, ref: ForwardedRef<HTMLSpanElement>) {
  const iconWrapperClasses = ClassNames.merge("im-icon", {
    [`im-icon-${icon}`]: true,
    ["display-none"]: !!hide,
    [`${className}`]: !!className,
  });

  const sizes = {
    xs: "12px",
    sm: "18px",
    md: "22px",
    lg: "30px",
    xl: "50px",
  };

  const iconSize = sizes[size] || sizes.md;
  const svgContent = icons[icon];

  if (!svgContent) {
    return null;
  }

  return (
    <span
      ref={ref}
      className={iconWrapperClasses}
      data-testid={dataTestId}
      style={{
        margin,
        color: color ? COLORS[color] : undefined,
        width: iconSize,
        height: iconSize,
        minWidth: iconSize,
        minHeight: iconSize,
        transform: mirrored ? "scaleX(-1)" : undefined,
      }}
      title={title}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      data-icon={icon}
      data-component='Icon'
      {...rest}
    />
  );
}

export const Icon = forwardRef(IconComponent);
