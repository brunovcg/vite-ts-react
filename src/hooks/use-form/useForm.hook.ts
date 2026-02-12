import { useCallback, useEffect, useRef, useState } from "react";
import type { FieldState, FormFieldStates, FormValue, FormValues, UseFormProps, UseFormReturn } from "./useForm.hook.types";

function readFieldValue(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): FormValue {
  if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox" || element.type === "radio") return element.checked;
    if (element.type === "file") return element.files?.[0] ?? null;
    return element.value;
  }
  return element.value;
}

function setNativeFieldValue(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, value: FormValue) {
  if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
    element.checked = Boolean(value);
  } else if (element instanceof HTMLInputElement && element.type === "file") {
    return;
  } else {
    element.value = String(value ?? "");
  }
}

function buildInitialFieldStates<Values extends FormValues>(initialValues: Values): FormFieldStates<Values> {
  const fields = {} as FormFieldStates<Values>;
  for (const key of Object.keys(initialValues) as (keyof Values)[]) {
    fields[key] = { touched: false, dirty: false, error: null };
  }
  return fields;
}

function getFormElement(form: HTMLFormElement, name: string): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  return form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
}

export function useForm<Values extends FormValues>({ initialValues, validators, onSubmit, validateOn = ["submit"] }: UseFormProps<Values>): UseFormReturn<Values> {
  const ref = useRef<HTMLFormElement | null>(null);
  const [values, setValues] = useState<Values>(initialValues);
  const [fields, setFields] = useState<FormFieldStates<Values>>(() => buildInitialFieldStates(initialValues));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const initialValuesRef = useRef(initialValues);
  const validatorsRef = useRef(validators);
  validatorsRef.current = validators;

  const readAllValues = useCallback(() => {
    if (!ref.current) return initialValuesRef.current;
    const result = { ...initialValuesRef.current };
    for (const key of Object.keys(result) as (keyof Values)[]) {
      const element = getFormElement(ref.current, key as string);
      if (element) {
        result[key] = readFieldValue(element) as Values[keyof Values];
      }
    }
    return result;
  }, []);

  const validateField = useCallback((fieldName: keyof Values, currentValues: Values): string | null => {
    const validator = validatorsRef.current?.[fieldName];
    if (!validator) return null;
    return validator(currentValues[fieldName], currentValues);
  }, []);

  const validateAll = useCallback((): { isValid: boolean; nextFields: FormFieldStates<Values> } => {
    const currentValues = readAllValues();
    const nextFields = { ...fields };
    let isValid = true;

    for (const key of Object.keys(initialValuesRef.current) as (keyof Values)[]) {
      const error = validateField(key, currentValues);
      nextFields[key] = { ...nextFields[key], error };
      if (error) isValid = false;
    }

    return { isValid, nextFields };
  }, [fields, readAllValues, validateField]);

  const handleFieldEvent = useCallback(
    (event: Event, triggers: ("change" | "blur")[]) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const name = target.name as keyof Values;
      if (!name || !(name in initialValuesRef.current)) return;

      const currentValues = readAllValues();
      setValues(currentValues);

      setFields((prev) => {
        const fieldUpdate: FieldState = { ...prev[name] };

        if (triggers.includes("blur")) {
          fieldUpdate.touched = true;
        }

        if (triggers.includes("change")) {
          fieldUpdate.dirty = currentValues[name] !== initialValuesRef.current[name];
        }

        const shouldValidateChange = triggers.includes("change") && validateOn.includes("change");
        const shouldValidateBlur = triggers.includes("blur") && validateOn.includes("blur");

        if (shouldValidateChange || shouldValidateBlur) {
          fieldUpdate.error = validateField(name, currentValues);
        }

        return { ...prev, [name]: fieldUpdate };
      });
    },
    [readAllValues, validateField, validateOn],
  );

  useEffect(() => {
    const form = ref.current;
    if (!form) return;

    const onChange = (e: Event) => handleFieldEvent(e, ["change"]);
    const onBlur = (e: Event) => handleFieldEvent(e, ["blur"]);

    form.addEventListener("input", onChange);
    form.addEventListener("change", onChange);
    form.addEventListener("focusout", onBlur);

    return () => {
      form.removeEventListener("input", onChange);
      form.removeEventListener("change", onChange);
      form.removeEventListener("focusout", onBlur);
    };
  }, [handleFieldEvent]);

  const validate = useCallback((): boolean => {
    const { isValid, nextFields } = validateAll();
    setFields(nextFields);
    return isValid;
  }, [validateAll]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitCount((prev) => prev + 1);

      const currentValues = readAllValues();
      setValues(currentValues);

      const { isValid, nextFields } = validateAll();

      const touchedFields = { ...nextFields };
      for (const key of Object.keys(touchedFields) as (keyof Values)[]) {
        touchedFields[key] = { ...touchedFields[key], touched: true };
      }
      setFields(touchedFields);

      if (!isValid || !onSubmit) return;

      const result = onSubmit(currentValues);
      if (result instanceof Promise) {
        setIsSubmitting(true);
        result.finally(() => setIsSubmitting(false));
      }
    },
    [readAllValues, validateAll, onSubmit],
  );

  const reset = useCallback(() => {
    setValues(initialValuesRef.current);
    setFields(buildInitialFieldStates(initialValuesRef.current));
    setIsSubmitting(false);

    if (ref.current) {
      for (const key of Object.keys(initialValuesRef.current) as (keyof Values)[]) {
        const element = getFormElement(ref.current, key as string);
        if (element) {
          setNativeFieldValue(element, initialValuesRef.current[key]);
        }
      }
    }
  }, []);

  const setFieldValue = useCallback(<Key extends keyof Values>(field: Key, value: Values[Key]) => {
    if (ref.current) {
      const element = getFormElement(ref.current, field as string);
      if (element) {
        setNativeFieldValue(element, value);
      }
    }

    setValues((prev) => ({ ...prev, [field]: value }));
    setFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], dirty: value !== initialValuesRef.current[field] },
    }));
  }, []);

  const setFieldError = useCallback((field: keyof Values, error: string | null) => {
    setFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], error },
    }));
  }, []);

  const isValid = Object.values<FieldState>(fields).every((f) => f.error === null);
  const isDirty = Object.values<FieldState>(fields).some((f) => f.dirty);

  return {
    ref,
    values,
    fields,
    isValid,
    isDirty,
    isSubmitting,
    submitCount,
    setFieldValue,
    setFieldError,
    validate,
    reset,
    handleSubmit,
  };
}
