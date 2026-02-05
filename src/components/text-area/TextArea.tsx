import type { TextareaHTMLAttributes } from "react";
import { LoadingSpinner } from "../loading-spinner/LoadingSpinner";

export interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  label?: string;
  loading?: boolean;
}

export function TextArea({ id, name, label, loading, disabled, ...props }: InputProps) {
  return (
    <>
      <label htmlFor={id}>
        {label} {loading && <LoadingSpinner />}
      </label>
      <textarea id={id} className='container-input' name={name} disabled={disabled || loading} aria-busy={loading} {...props} data-component='TextArea' />
    </>
  );
}
