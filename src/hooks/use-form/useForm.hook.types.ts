import type { RefObject } from "react";

export type FormValue = string | boolean | File | null;

export type FormValues = Record<string, FormValue>;

export type FieldValidator<Values extends FormValues, Key extends keyof Values = keyof Values> = (value: Values[Key], values: Values) => string | null;

export type FormValidators<Values extends FormValues> = {
  [Key in keyof Values]?: FieldValidator<Values, Key>;
};

export type FieldState = {
  touched: boolean;
  dirty: boolean;
  error: string | null;
};

export type FormFieldStates<Values extends FormValues> = Record<keyof Values, FieldState>;

export type ValidateOn = "change" | "blur" | "submit";

export interface UseFormProps<Values extends FormValues> {
  initialValues: Values;
  validators?: FormValidators<Values>;
  onSubmit?: (values: Values) => void | Promise<void>;
  validateOn?: ValidateOn[];
}

export interface UseFormReturn<Values extends FormValues> {
  ref: RefObject<HTMLFormElement | null>;
  values: Values;
  fields: FormFieldStates<Values>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  submitCount: number;
  setFieldValue: <Key extends keyof Values>(field: Key, value: Values[Key]) => void;
  setFieldError: (field: keyof Values, error: string | null) => void;
  validate: () => boolean;
  reset: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
