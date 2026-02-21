import type { Css } from "@/runtime/css.types";
import type { InputHTMLAttributes } from "react";
import "./Range.component.css";

interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "required"> {
  css?: Css;
  className?: string;
  inputCss?: Css;
  inputClassName?: string;
  label?: string;
  labelSide?: "left" | "right" | "top" | "bottom";
  id?: string;
}

export function Range({ css, className, inputCss, inputClassName, label, labelSide = "left", id, ...rest }: RangeProps) {
  const getFlexDirection = () => {
    switch (labelSide) {
      case "left":
        return "row";
      case "right":
        return "row-reverse";
      case "top":
        return "column";
      case "bottom":
        return "column-reverse";
      default:
        return "row";
    }
  };

  return (
    <label data-css='Range' data-component='Range' css={css} className={className} htmlFor={id} style={{ flexDirection: getFlexDirection() }}>
      {label && <span className='label-text'>{label}</span>}
      <input
        type='range'
        css={inputCss}
        className={inputClassName}
        id={id}
        aria-valuenow={rest.value !== undefined ? Number(rest.value) : rest.defaultValue !== undefined ? Number(rest.defaultValue) : undefined}
        aria-valuemin={rest.min !== undefined ? Number(rest.min) : undefined}
        aria-valuemax={rest.max !== undefined ? Number(rest.max) : undefined}
        aria-orientation={labelSide === "top" || labelSide === "bottom" ? "vertical" : "horizontal"}
        aria-label={label || rest["aria-label"]}
        {...rest}
      />
    </label>
  );
}
