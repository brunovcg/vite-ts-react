import type { InputHTMLAttributes } from "react";
import "./Checkbox.css";
import type { Css } from "@/runtime/css.types";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  css?: Css;
  inputCss?: Css;
  className?: string;
  inputClassName?: string;
  label?: string;
  type?: "checkbox" | "radio";
  labelSide?: "left" | "right";
};

export function Checkbox({ label, css, className, inputClassName, id, type = "checkbox", inputCss, labelSide = "right", ...rest }: CheckboxProps) {
  return (
    <label data-component='Checkbox' className={className} css={css} htmlFor={id} style={{ flexDirection: labelSide === "right" ? "row-reverse" : "row" }}>
      {label && <span className='label-text'>{label}</span>}
      <input type={type} css={inputCss} className={inputClassName} id={id} {...rest} />
    </label>
  );
}
