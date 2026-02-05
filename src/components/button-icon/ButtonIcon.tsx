import { mergeClass } from "@/utils/class-names/ClassNames.util";
import type { ButtonHTMLAttributes } from "react";
import type { IconName, IconProps } from "../icon/Icon.types";
import { Icon } from "../icon/Icon";
import "./ButtonIcon.css";

export interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  icon: IconName;
  color?: "primary" | "error";
  iconProps?: Omit<IconProps, "icon">;
  noBorder?: boolean;
}

export function ButtonIcon({
  className,
  icon,
  color = "primary",
  iconProps,
  noBorder,

  ...rest
}: ButtonIconProps) {
  return (
    <button
      className={mergeClass("button-icon", className)}
      css={[
        "border-radius-circle",
        "padding-sm",
        "cursor-pointer",
        "background-white",
        {
          "border-none": !!noBorder,
          "border-primary": !noBorder && color === "primary",
          "border-error": !noBorder && color === "error",
          "color-primary": color === "primary",
          "color-error": color === "error",
        },
      ]}
      data-component='ButtonIcon'
      {...rest}
    >
      <Icon icon={icon} color={color} {...iconProps} />
    </button>
  );
}
