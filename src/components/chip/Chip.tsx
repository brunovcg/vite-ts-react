import type { Css } from "@/runtime/css.types";

import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  color: "primary" | "error" | "warning" | "success";
  css?: Css;
}

export function Chip({ children, color, css }: ChipProps) {
  return (
    <p
      data-component='Chip'
      css={[
        {
          "background-primary-light": color === "primary",
          "background-error-light": color === "error",
          "background-warning-light": color === "warning",
          "background-success-light": color === "success",
          "color-primary": color === "primary",
          "color-error": color === "error",
          "color-warning": color === "warning",
          "color-success": color === "success",
        },
        "padding-block-sm",
        "padding-inline-md",
        "font-size-sm",
        "text-bold",
        "display-flex",
        "align-center",
        "gap-xs",
        "width-fit",
        "border-radius-sm",
        css,
      ]}
    >
      {children}
    </p>
  );
}
