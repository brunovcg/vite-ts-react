import { mergeClass } from "@/utils/class-names/ClassNames.util";
import type { ButtonHTMLAttributes } from "react";
import type { IconName, IconProps } from "../icon/Icon.types";
import { Icon } from "../icon/Icon";
import "./ButtonIcon.css";

export interface ButtonIconProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  className?: string;
  icon: IconName;
  color?: "primary" | "error";
  iconProps?: Omit<IconProps, "icon">;
  noBorder?: boolean;
  "aria-label": string;
}

export function ButtonIcon({ className, icon, color = "primary", iconProps, noBorder, css, "aria-label": ariaLabel, ...rest }: ButtonIconProps) {
  return (
    <button
      data-css='ButtonIcon'
      className={mergeClass(className)}
      css={[
        "border-radius-circle",
        "padding-sm",
        "cursor-pointer",
        "background-white",
        css,
        {
          "border-none": !!noBorder,
          "border-primary": !noBorder && color === "primary",
          "border-error": !noBorder && color === "error",
          "color-primary": color === "primary",
          "color-error": color === "error",
        },
      ]}
      data-component='ButtonIcon'
      aria-label={ariaLabel}
      {...rest}
    >
      <Icon icon={icon} color={color} aria-hidden='true' {...iconProps} />
    </button>
  );
}
