import type { ButtonHTMLAttributes } from "react";
import "./Button.component.css";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner.component";
import { mergeClass } from "@/utils/class-names/ClassNames.util";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  color?: "primary" | "error" | "warning" | "success";
  variant?: "filled" | "outlined" | "regular";
  loading?: boolean;
  loadingMessage?: string;
}

import { buttonLocale } from "./Button.component.locales";
import { useDictionary } from "@/locales";

export function Button({ className, color = "primary", variant = "regular", loadingMessage, css, children, loading, ...rest }: ButtonProps) {
  const dictionary = useDictionary(buttonLocale);

  return (
    <button
      data-css='Button'
      data-component='Button'
      className={mergeClass(className, `variant-${variant}`)}
      disabled={loading || rest.disabled}
      aria-busy={loading}
      aria-disabled={loading || rest.disabled}
      css={[
        "display-flex",
        "flex-center",
        "gap-sm",
        "border-radius-md",
        "padding-md",
        "cursor-pointer",
        "background-white",
        "text-bold",
        "font-size-sm",
        {
          "border-none": variant !== "outlined",
          "border-primary": color === "primary" && variant !== "regular",
          "border-success": color === "success" && variant !== "regular",
          "border-error": color === "error" && variant !== "regular",
          "border-warning": color === "warning" && variant !== "regular",
          "color-white": variant === "filled",
          "color-primary": color === "primary" && variant !== "filled",
          "color-success": color === "success" && variant !== "filled",
          "color-error": color === "error" && variant !== "filled",
          "color-warning": color === "warning" && variant !== "filled",
          "background-primary": color === "primary" && variant === "filled",
          "background-success": color === "success" && variant === "filled",
          "background-error": color === "error" && variant === "filled",
          "background-warning": color === "warning" && variant === "filled",
        },
        css,
      ]}
      {...rest}
    >
      {loading && (
        <div className='display-flex align-center gap-sm' css={["display-flex", "align-center", "gap-sm"]}>
          <LoadingSpinner />
          <span>{loadingMessage || dictionary.loading}</span>
        </div>
      )}
      {!loading && children}
    </button>
  );
}
