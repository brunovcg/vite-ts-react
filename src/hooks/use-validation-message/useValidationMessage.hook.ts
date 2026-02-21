import { useState, useCallback } from "react";
import { useDictionary } from "@/locales/locales.hooks";
import { validationLocale } from "./useValidationMessage.locales";

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

function getValidationMessage(target: FormElement, dictionary: Record<string, string>): string {
  const { validity } = target;

  if (validity.customError) return target.validationMessage;
  if (validity.valueMissing) return dictionary.valueMissing;
  if (validity.typeMismatch) {
    if (target.type === "email") return dictionary.typeMismatchEmail;
    if (target.type === "url") return dictionary.typeMismatchUrl;
    return target.validationMessage;
  }
  if (validity.patternMismatch) return dictionary.patternMismatch;
  if (validity.tooShort) {
    const minLength = "minLength" in target ? target.minLength : 0;
    return dictionary.tooShort.replace("{{minLength}}", String(minLength));
  }
  if (validity.tooLong) {
    const maxLength = "maxLength" in target ? target.maxLength : 0;
    return dictionary.tooLong.replace("{{maxLength}}", String(maxLength));
  }
  if (validity.rangeUnderflow) {
    const min = "min" in target ? (target as HTMLInputElement).min : "";
    return dictionary.rangeUnderflow.replace("{{min}}", min);
  }
  if (validity.rangeOverflow) {
    const max = "max" in target ? (target as HTMLInputElement).max : "";
    return dictionary.rangeOverflow.replace("{{max}}", max);
  }
  if (validity.stepMismatch) return dictionary.stepMismatch;
  if (validity.badInput) return dictionary.badInput;

  return target.validationMessage;
}

export function useValidationMessage() {
  const [validationMessage, setValidationMessage] = useState("");
  const dictionary = useDictionary(validationLocale);

  const setInvalid = useCallback(
    (e: { preventDefault: () => void; currentTarget: FormElement }, rules?: ValidationRule[]) => {
      e.preventDefault();
      runCustomValidation(e.currentTarget, rules);
      setValidationMessage(getValidationMessage(e.currentTarget, dictionary));
    },
    [dictionary],
  );

  const checkValidity = useCallback((target: FormElement, rules?: ValidationRule[]) => {
    runCustomValidation(target, rules);
    if (target.validity.valid) {
      setValidationMessage("");
    }
  }, []);

  return { validationMessage, setInvalid, checkValidity };
}
