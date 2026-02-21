import type { Css } from "@/runtime/css.types";
import type { ProgressHTMLAttributes } from "react";
import "./Progress.component.css";

interface ProgressProps extends ProgressHTMLAttributes<HTMLProgressElement> {
  css?: Css;
  className?: string;
  label?: string;
}

export function Progress({ label, ...props }: ProgressProps) {
  const valueNow = props.value !== undefined ? Number(props.value) : undefined;
  const valueMax = props.max !== undefined ? Number(props.max) : 100;
  const valueMin = 0;
  const percentage = valueNow !== undefined ? Math.round((valueNow / valueMax) * 100) : undefined;

  return (
    <progress
      {...props}
      className={props.className}
      css={props.css}
      data-css='Progress'
      data-component='Progress'
      aria-valuenow={valueNow}
      aria-valuemin={valueMin}
      aria-valuemax={valueMax}
      aria-label={label || props["aria-label"] || (percentage !== undefined ? `${percentage}% complete` : "Progress")}
      role='progressbar'
    />
  );
}
