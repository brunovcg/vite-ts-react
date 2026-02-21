import type { TextareaHTMLAttributes } from "react";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner.component";
import type { Css } from "@/runtime/css.types";
import { mergeClass } from "@/utils/class-names/ClassNames.util";
import { useValidationMessage, type ValidationRule } from "@/hooks/use-validation-message/useValidationMessage.hook";
import { Icon } from "../icon/Icon.component";
import { Tooltip } from "../tooltip/Tooltip.component";

export interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  label?: string;
  validate?: ValidationRule[];
  loading?: boolean;
  className?: string;
  css?: Css;
  inputCss?: Css;
  inputClassName?: string;
}

export function TextArea({ id, name, label, validate, loading, disabled, className, css, inputCss, inputClassName, onChange, onInvalid: onInvalidProp, ...props }: InputProps) {
  const { validationMessage, setInvalid, checkValidity } = useValidationMessage();

  return (
    <label htmlFor={id} css={css} className={mergeClass("container-input", className)} data-component='TextArea'>
      {label && <span className='label-text'>{label}</span>} {loading && <LoadingSpinner />}
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
        onChange={(e) => {
          checkValidity(e.target, validate);
          onChange?.(e);
        }}
        onInvalid={(e) => {
          setInvalid(e.currentTarget, validate);
          onInvalidProp?.(e);
        }}
      />
      {validationMessage && (
        <Tooltip content={<span className='error-text'>{validationMessage}</span>} position='left'>
          <Icon icon='warning' size='xs' className='error-icon' />
        </Tooltip>
      )}
    </label>
  );
}
