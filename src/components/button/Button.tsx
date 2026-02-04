import { ClassNames } from "@/utils/class-names/ClassNames.util";
import type { ButtonHTMLAttributes } from "react";
import "./Button.css";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  color?: "primary" | "error";
  variant?: "filled" | "outlined" | "regular";
  loading?: boolean;
  loadingMessage?: string;
}

export function Button({
  className,
  color = "primary",
  variant = "regular",
  loadingMessage,
  children,
  loading,
  ...rest
}: ButtonProps) {
  return (
    <button
      data-component='Button'
      className={ClassNames.merge(
        `variant-${variant}`,
        {
          "border-none": variant !== "outlined",
          "border-primary": color === "primary" && variant !== "regular",
          "border-error": color === "error" && variant !== "regular",
          "color-white": variant === "filled",
          "color-primary": color === "primary" && variant !== "filled",
          "color-error": color === "error" && variant !== "filled",
          "background-primary": color === "primary" && variant === "filled",
          "background-error": color === "error" && variant === "filled",
        },
        "border-radius-md padding-md cursor-pointer background-white typography bold size-sm",
        className,
      )}
      {...rest}
    >
      {loading && (
        <div className='display-flex align-center gap-sm'>
          <LoadingSpinner />
          {loadingMessage && <span>{loadingMessage}</span>}
        </div>
      )}
      {!loading && children}
    </button>
  );
}
