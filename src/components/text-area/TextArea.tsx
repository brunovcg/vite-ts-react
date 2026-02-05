import type { TextareaHTMLAttributes } from "react";

export interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  label?: string;
}

export function TextArea({ id, name, label, ...props }: InputProps) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} className='container-input' name={name} {...props} data-component='TextArea' />
    </>
  );
}
