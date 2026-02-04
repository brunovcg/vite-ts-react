import { type ChangeEvent, type InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/use-debounce/useDebounce.hook";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
  debounce?: number;
}

export function Input({
  id,
  name,
  label,
  debounce,
  value,
  onChange,
  defaultValue,
  ...props
}: InputProps) {
  const isDebounced = typeof debounce === "number" && debounce > 0;

  const [localValue, setLocalValue] = useState<string | number | readonly string[] | undefined>(
    value !== undefined ? value : defaultValue !== undefined ? defaultValue : "",
  );

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isDebounced) {
      e.persist();
      lastChangeEvent.current = e;
      setLocalValue(e.target.value);
    } else {
      onChange?.(e);
    }
  };

  const inputProps = { ...props };
  const passedValue = isDebounced ? localValue : value;
  const passedDefaultValue = !isDebounced ? defaultValue : undefined;

  return (
    <div className='container-input' data-component='Input'>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        value={passedValue}
        defaultValue={passedDefaultValue}
        onChange={handleChange}
        {...inputProps}
      />
    </div>
  );
}
