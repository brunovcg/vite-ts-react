import type { TextareaHTMLAttributes } from "react";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";
import type { Css } from "@/runtime/css.types";
import { mergeClass } from "@/utils/class-names/ClassNames.util";

export interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  label?: string;
  loading?: boolean;
  className?: string;
  css?: Css;
  inputCss?: Css;
  inputClassName?: string;
}

export function TextArea({ id, name, label, loading, disabled, className, css, inputCss, inputClassName, ...props }: InputProps) {
  return (
    <label htmlFor={id} css={css} className={mergeClass("container-input", className)} data-component='TextArea'>
      <span className='label-text'>{label}</span> {loading && <LoadingSpinner />}
      <textarea
        id={id}
        className={mergeClass("input-element", inputClassName)}
        css={inputCss}
        name={name}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-required={props.required}
        aria-invalid={props["aria-invalid"]}
        {...props}
      />
    </label>
  );
}
