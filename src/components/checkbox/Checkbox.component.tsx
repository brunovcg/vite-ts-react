import type { InputHTMLAttributes } from "react";
import "./Checkbox.component.css";
import type { Css } from "@/runtime/css.types";

type CheckboxBaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  css?: Css;
  inputCss?: Css;
  className?: string;
  inputClassName?: string;
  type?: "checkbox" | "radio";
  labelSide?: "left" | "right";
};

type CheckboxProps = CheckboxBaseProps & ({ label: string; "aria-label"?: string } | { label?: never; "aria-label": string });

export function Checkbox({ label, css, className, inputClassName, id, type = "checkbox", inputCss, labelSide = "right", ...rest }: CheckboxProps) {
  return (
    <label data-component='Checkbox' data-css='Checkbox' className={className} css={css} htmlFor={id} style={{ flexDirection: labelSide === "right" ? "row-reverse" : "row" }}>
      {label && <span className='label-text'>{label}</span>}
      <input type={type} css={inputCss} className={inputClassName} id={id} {...rest} />
    </label>
  );
}
