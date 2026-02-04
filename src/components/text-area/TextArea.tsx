import type { TextareaHTMLAttributes } from "react";

export interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  label?: string;
}

export function TextArea({ id, name, label, ...props }: InputProps) {
  return (
    <div className='container-input' data-component='TextArea'>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} name={name} {...props} />
    </div>
  );
}
