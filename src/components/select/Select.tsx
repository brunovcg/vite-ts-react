import { useState, type SelectHTMLAttributes } from "react";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";
import { mergeClass } from "@/utils/class-names/ClassNames.util";

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
  onChange?: (event: React.ChangeEvent<HTMLSelectElement> & { target: { value: Option } & React.ChangeEvent<HTMLSelectElement>["target"] }) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement> & { target: { value: Option } & React.FocusEvent<HTMLSelectElement>["target"] }) => void;
}

export function Select<Option extends string>({ label, options, id, onChange, onBlur, loading, disabled, placeholder, allowClear, name, ...props }: SelectProps<Option>) {
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
    <>
      <label htmlFor={id}>
        {label} {loading && <LoadingSpinner />}
      </label>

      <select
        id={id}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
        data-component='Select'
        aria-busy={loading}
        disabled={disabled || loading}
        className={mergeClass("container-input", props.className, { placeholder: isPlaceholder })}
        style={{ color: isPlaceholder ? "var(--placeholder-color)" : "var(--text-color)" }}
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
    </>
  );
}
