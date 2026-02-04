import { ClassNames } from "@/utils/class-names/ClassNames.util";
import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  color: "primary" | "error" | "warning" | "success";
}

export function Chip({ children, color }: ChipProps) {
  return (
    <div
      data-component='Chip'
      className={ClassNames.merge(
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
        "padding-block-sm padding-inline-md typography size-sm bold display-flex align-center gap-xs justify-center width-fit border-radius-sm",
      )}
    >
      {children}
    </div>
  );
}
