import type { IconProps } from "./Icon.types";
import { forwardRef, type ForwardedRef } from "react";

import { icons } from "./Icons";

import "./Icon.css";
import { ClassNames } from "@/utils/class-names/ClassNames.util";
import { CSS_VARIABLES } from "@/runtime/cssVariables";

function IconComponent(
  { icon, size = "sm", color, margin = "0", className = "", mirrored, hide, dataTestId, title, decorative = true, "aria-label": ariaLabel, "aria-hidden": ariaHidden, ...rest }: IconProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const iconWrapperClasses = ClassNames.merge("im-icon", className, {
    [`im-icon-${icon}`]: true,
    ["display-none"]: !!hide,
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

  const isDecorative = ariaHidden === "true" || (decorative && !ariaLabel);

  return (
    <span
      ref={ref}
      className={iconWrapperClasses}
      data-testid={dataTestId}
      style={{
        margin,
        color: color ? CSS_VARIABLES.color[color] : undefined,
        width: iconSize,
        height: iconSize,
        minWidth: iconSize,
        minHeight: iconSize,
        transform: mirrored ? "scaleX(-1)" : undefined,
      }}
      title={title}
      role={!isDecorative ? "img" : undefined}
      aria-hidden={isDecorative ? "true" : undefined}
      aria-label={!isDecorative ? ariaLabel : undefined}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      data-icon={icon}
      data-component='Icon'
      {...rest}
    />
  );
}

export const Icon = forwardRef(IconComponent);
