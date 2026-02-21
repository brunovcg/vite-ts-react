import { type ChangeEvent, type InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/use-debounce/useDebounce.hook";
import { mergeClass } from "@/utils/class-names/ClassNames.util";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner.component";
import { useValidationMessage, type ValidationRule } from "@/hooks/use-validation-message/useValidationMessage.hook";
import { Icon } from "../icon/Icon.component";
import { Tooltip } from "../tooltip/Tooltip.component";
import type { Css } from "@/runtime/css.types";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
  validate?: ValidationRule[];
  debounce?: number;
  loading?: boolean;
  inputCss?: Css;
  inputClassName?: string;
  className?: string;
}

export function Input({ id, name, label, validate, debounce, value, onChange, defaultValue, className, disabled, loading, inputCss, css, inputClassName, ...inputProps }: InputProps) {
  const isDebounced = typeof debounce === "number" && debounce > 0;

  const [localValue, setLocalValue] = useState<string | number | readonly string[] | undefined>(value !== undefined ? value : defaultValue !== undefined ? defaultValue : "");

  const lastChangeEvent = useRef<ChangeEvent<HTMLInputElement> | null>(null);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== undefined && value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  useEffect(() => {
    if (value !== undefined) {
      lastChangeEvent.current = null;
    }
  }, [value]);

  useDebounce({
    value: localValue,
    delay: debounce || 0,
    active: isDebounced,
    onDebounceChange: () => {
      if (lastChangeEvent.current && onChange) {
        onChange(lastChangeEvent.current);
      }
    },
  });

  const { validationMessage, setInvalid, checkValidity } = useValidationMessage();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    checkValidity(e.target, validate);
    if (isDebounced) {
      e.persist();
      lastChangeEvent.current = e;
      setLocalValue(e.target.value);
    } else {
      onChange?.(e);
    }
  };

  const passedValue = isDebounced ? localValue : value;
  const passedDefaultValue = !isDebounced ? defaultValue : undefined;

  return (
    <label htmlFor={id} css={css} className={mergeClass("container-input", className)} data-component='Input'>
      {label && <span className='label-text'>{label}</span>} {loading && <LoadingSpinner />}
      <input
        id={id}
        name={name}
        value={passedValue}
        defaultValue={passedDefaultValue}
        onChange={handleChange}
        onInvalid={(e) => {
          setInvalid(e.currentTarget, validate);
          inputProps.onInvalid?.(e);
        }}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-required={inputProps.required}
        aria-invalid={inputProps["aria-invalid"]}
        css={inputCss}
        className={mergeClass("input-element", inputClassName)}
        {...inputProps}
      />
      {validationMessage && (
        <Tooltip content={<span className='error-text'>{validationMessage}</span>} position='left'>
          <Icon icon='warning' size='xs' className='error-icon' />
        </Tooltip>
      )}
    </label>
  );
}
