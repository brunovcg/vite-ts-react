import { ClassNames } from "@/utils/class-names/ClassNames.util";
import type { ButtonHTMLAttributes } from "react";
import type { IconName, IconProps } from "../icon/Icon.types";
import { Icon } from "../icon/Icon";
import "./ButtonIcon.css";

export interface ButtonIconProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  className?: string;
  icon: IconName;
  iconProps?: Omit<IconProps, "icon">;
  noBorder?: boolean;
}

export function ButtonIcon({ className, icon, iconProps, noBorder, ...rest }: ButtonIconProps) {
  const iconColor = iconProps?.color || "primary";

  return (
    <button
      className={ClassNames.merge(
        "button-icon border-radius-circle padding-sm background-white cursor-pointer",
        {
          "border-none": !!noBorder,
          "border-primary": !noBorder && iconColor === "primary",
          "border-error": !noBorder && iconColor === "error",
        },
        className,
      )}
      data-component='ButtonIcon'
      {...rest}
    >
      <Icon icon={icon} color='primary' {...iconProps} />
    </button>
  );
}
