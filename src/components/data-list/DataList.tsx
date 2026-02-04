import type { InputHTMLAttributes } from "react";

export interface DataListProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
}

export function DataList({ id, name, label, children, ...props }: DataListProps) {
  const listId = `${id}-list`;

  return (
    <div className='container-input' data-component='DataList'>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} list={listId} {...props} />
      <datalist id={listId}>{children}</datalist>
    </div>
  );
}
