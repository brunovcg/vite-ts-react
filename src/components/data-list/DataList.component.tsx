import type { InputHTMLAttributes } from "react";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner.component";
import type { Css } from "@/runtime/css.types";
import { mergeClass } from "@/utils/class-names/ClassNames.util";
import { useValidationMessage, type ValidationRule } from "@/hooks/use-validation-message/useValidationMessage.hook";
import { Icon } from "../icon/Icon.component";
import { Tooltip } from "../tooltip/Tooltip.component";

export interface DataListProps<Option extends string> extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
  validate?: ValidationRule[];
  options: { label: string; value: Option; disabled?: boolean }[];
  children?: never;
  allowOutOfList?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  css?: Css;
  inputCss?: Css;
  inputClassName?: string;
}

export function DataList<Option extends string>({
  id,
  name,
  label,
  validate,
  options,
  onChange,
  onBlur,
  css,
  inputCss,
  inputClassName,
  allowOutOfList = false,
  loading,
  disabled,
  className,
  ...props
}: DataListProps<Option>) {
  const listId = `${id}-list`;
  const { validationMessage, setInvalid, checkValidity } = useValidationMessage();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowOutOfList && !options.some((option) => option.value === event.target.value)) {
      event.target.setCustomValidity("Please select a valid option");
    } else {
      event.target.setCustomValidity("");
    }
    checkValidity(event.target, validate);
    onChange?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!allowOutOfList && !options.some((option) => option.value === event.target.value)) {
      event.target.value = "";
      event.target.setCustomValidity("");
      onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>);
    } else {
      event.target.setCustomValidity("");
    }
    onBlur?.(event);
  };

  return (
    <label htmlFor={id} css={css} className={mergeClass("container-input", className)} data-component='DataList'>
      <span className='label-text'>{label}</span> {loading && <LoadingSpinner />}
      <input
        id={id}
        name={name}
        list={listId}
        onChange={handleChange}
        onBlur={handleBlur}
        onInvalid={(e) => {
          setInvalid(e, validate);
          props.onInvalid?.(e);
        }}
        css={inputCss}
        {...props}
        className={mergeClass("input-element", inputClassName)}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-required={props.required}
        aria-invalid={props["aria-invalid"]}
        aria-autocomplete='list'
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </datalist>
      {validationMessage && (
        <Tooltip content={<span className='error-text'>{validationMessage}</span>} position='left'>
          <Icon icon='warning' size='sm' className='error-icon' />
        </Tooltip>
      )}
    </label>
  );
}
