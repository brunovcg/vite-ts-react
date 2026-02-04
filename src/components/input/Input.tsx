import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
}

export function Input({ id, name, label, ...props }: InputProps) {
  return (
    <div className='container-input' data-component='Input'>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} {...props} />
    </div>
  );
}
