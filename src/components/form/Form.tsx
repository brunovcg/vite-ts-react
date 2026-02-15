import { type SubmitEvent, type FormHTMLAttributes, type ReactNode } from "react";

export type SubmitFormArgs<Data extends object> = { event: SubmitEvent<HTMLFormElement>; data: Data };

export interface FormProps<Data extends object> extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  children: ReactNode;
  onSubmit: (args: SubmitFormArgs<Data>) => void;
}

export function Form<Data extends object>({ children, onSubmit, ...props }: FormProps<Data>) {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Data;
    onSubmit?.({ event, data });
  };

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
}
