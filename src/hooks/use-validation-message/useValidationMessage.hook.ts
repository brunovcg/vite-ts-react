import { useState, useCallback } from "react";

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export type ValidationRule = {
  pattern: RegExp | ((value: string) => boolean);
  message: string;
};

function runCustomValidation(target: FormElement, rules?: ValidationRule[]) {
  if (!rules?.length) return;
  const value = target.value;
  for (const rule of rules) {
    const isValid = typeof rule.pattern === "function" ? rule.pattern(value) : rule.pattern.test(value);
    if (!isValid) {
      target.setCustomValidity(rule.message);
      return;
    }
  }
  target.setCustomValidity("");
}

export function useValidationMessage() {
  const [validationMessage, setValidationMessage] = useState("");

  const setInvalid = useCallback((e: { preventDefault: () => void; currentTarget: FormElement }, rules?: ValidationRule[]) => {
    e.preventDefault();
    runCustomValidation(e.currentTarget, rules);
    setValidationMessage(e.currentTarget.validationMessage);
  }, []);

  const checkValidity = useCallback((target: FormElement, rules?: ValidationRule[]) => {
    runCustomValidation(target, rules);
    if (target.validity.valid) {
      setValidationMessage("");
    }
  }, []);

  return { validationMessage, setInvalid, checkValidity };
}
