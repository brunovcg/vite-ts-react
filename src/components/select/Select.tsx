import { useState, type SelectHTMLAttributes } from "react";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";
import { mergeClass } from "@/utils/class-names/ClassNames.util";
import type { Css } from "@/runtime/css.types";

interface SelectProps<Option extends string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "name" | "id" | "onChange" | "onBlur"> {
  name: string;
  id: string;
  label: string;
  options: { label: string; value: Option; disabled?: boolean }[];
  loading?: boolean;
  placeholder?: string;
  allowClear?: boolean;
  allowSearch?: boolean;
  value?: Option;
  className?: string;
  css?: Css;
  inputCss?: Css;
  inputClassName?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement> & { target: { value: Option } & React.ChangeEvent<HTMLSelectElement>["target"] }) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement> & { target: { value: Option } & React.FocusEvent<HTMLSelectElement>["target"] }) => void;
}

export function Select<Option extends string>({
  label,
  options,
  id,
  onChange,
  onBlur,
  loading,
  disabled,
  className,
  css,
  inputCss,
  inputClassName,
  placeholder,
  allowClear,
  name,
  ...props
}: SelectProps<Option>) {
  const [currentValue, setCurrentValue] = useState<Option | null>("" as Option);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as Option;
    setCurrentValue(newValue);
    onChange?.(event as React.ChangeEvent<HTMLSelectElement> & { target: { value: Option } });
  };

  const handleBlur = (event: React.FocusEvent<HTMLSelectElement>) => {
    onBlur?.(event as React.FocusEvent<HTMLSelectElement> & { target: { value: Option } });
  };

  const isPlaceholder = currentValue === "";

  return (
    <label htmlFor={id} css={css} className={mergeClass("container-input", className)} data-component='Select'>
      <span className='label-text'>{label}</span> {loading && <LoadingSpinner />}
      <select
        id={id}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
        aria-busy={loading}
        aria-required={props.required}
        aria-invalid={props["aria-invalid"]}
        disabled={disabled || loading}
        className={mergeClass("input-element", inputClassName, { placeholder: isPlaceholder })}
        style={{ color: isPlaceholder ? "var(--color-placeholder)" : "var(--text-color)" }}
        css={inputCss}
      >
        {placeholder && (
          <option value='' disabled={!allowClear}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
