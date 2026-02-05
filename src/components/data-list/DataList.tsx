import type { InputHTMLAttributes } from "react";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";

export interface DataListProps<Option extends string> extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
  options: { label: string; value: Option; disabled?: boolean }[];
  children?: never;
  allowOutOfList?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export function DataList<Option extends string>({ id, name, label, options, onChange, onBlur, allowOutOfList = false, loading, disabled, ...props }: DataListProps<Option>) {
  const listId = `${id}-list`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowOutOfList && !options.some((option) => option.value === event.target.value)) {
      event.target.setCustomValidity("Please select a valid option");
    } else {
      event.target.setCustomValidity("");
    }
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
    <>
      <label htmlFor={id} css={["text-ellipsis", "width-150px"]}>
        {label} {loading && <LoadingSpinner />}
      </label>
      <input id={id} name={name} list={listId} onChange={handleChange} onBlur={handleBlur} {...props} className='container-input' disabled={disabled || loading} aria-busy={loading} />
      <datalist data-component='DataList' id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </datalist>
    </>
  );
}
