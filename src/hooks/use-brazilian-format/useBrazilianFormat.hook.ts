import { useMemo } from "react";
import { useDictionary } from "@/locales";
import type { ValidationRule } from "@/hooks/use-validation-message/useValidationMessage.hook";
import { Regex } from "@/utils/regex/Regex.util";
import { brazilianFormatLocale } from "./useBrazilianFormat.locales";

// ── Mask functions ──────────────────────────────────────────────────────────

function maskCEP(value: string): string {
  return value.replace(Regex.nonDigit, "").slice(0, 8).replace(Regex.cepMask, "$1-$2");
}

function maskCPF(value: string): string {
  return value.replace(Regex.nonDigit, "").slice(0, 11).replace(Regex.cpfDotSeparator, "$1.$2").replace(Regex.cpfDotSeparator, "$1.$2").replace(Regex.cpfDashSeparator, "$1-$2");
}

function maskCNPJ(value: string): string {
  return value.replace(Regex.nonDigit, "").slice(0, 14).replace(Regex.cnpjFirstDot, "$1.$2").replace(Regex.cnpjSlash, "$1.$2").replace(Regex.cnpjSlash, "$1/$2").replace(Regex.cnpjDash, "$1-$2");
}

function maskCPFOrCNPJ(value: string): string {
  const digits = value.replace(Regex.nonDigit, "");
  if (digits.length <= 11) {
    return maskCPF(value);
  }
  return maskCNPJ(value);
}

function maskPhone(value: string): string {
  const digits = value.replace(Regex.nonDigit, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(Regex.phoneAreaCode, "($1) $2").replace(Regex.phoneSeparator8, "$1-$2");
  }
  return digits.replace(Regex.phoneAreaCode, "($1) $2").replace(Regex.phoneSeparator9, "$1-$2");
}

// ── Validation patterns ─────────────────────────────────────────────────────

function isValidCPF(value: string): boolean {
  const digits = value.replace(Regex.nonDigit, "");
  if (digits.length !== 11) return false;
  if (Regex.allRepeatedDigits.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === Number(digits[10]);
}

function isValidCNPJ(value: string): boolean {
  const digits = value.replace(Regex.nonDigit, "");
  if (digits.length !== 14) return false;
  if (Regex.allRepeatedDigits.test(digits)) return false;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(digits[i]) * weights1[i];
  let remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;
  if (remainder !== Number(digits[12])) return false;
  sum = 0;
  for (let i = 0; i < 13; i++) sum += Number(digits[i]) * weights2[i];
  remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;
  return remainder === Number(digits[13]);
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useBrazilianFormat() {
  const t = useDictionary(brazilianFormatLocale);

  const validateCEP: ValidationRule = useMemo(() => ({ pattern: Regex.cepValidation, message: t.invalidCEP }), [t.invalidCEP]);
  const validateCPF: ValidationRule = useMemo(() => ({ pattern: isValidCPF, message: t.invalidCPF }), [t.invalidCPF]);
  const validateCNPJ: ValidationRule = useMemo(() => ({ pattern: isValidCNPJ, message: t.invalidCNPJ }), [t.invalidCNPJ]);
  const validateCPFOrCNPJ: ValidationRule = useMemo(
    () => ({
      pattern: (value: string) => {
        const digits = value.replace(Regex.nonDigit, "");
        return digits.length <= 11 ? isValidCPF(value) : isValidCNPJ(value);
      },
      message: t.invalidCPFOrCNPJ,
    }),
    [t.invalidCPFOrCNPJ],
  );
  const validatePhone: ValidationRule = useMemo(() => ({ pattern: Regex.phoneValidation, message: t.invalidPhone }), [t.invalidPhone]);

  const inputRegisterCEP = {
    maskFn: maskCEP,
    validate: validateCEP,
  };

  const inputRegisterCPF = {
    maskFn: maskCPF,
    validate: validateCPF,
  };

  const inputRegisterCNPJ = {
    maskFn: maskCNPJ,
    validate: validateCNPJ,
  };

  const inputRegisterCPFOrCNPJ = {
    maskFn: maskCPFOrCNPJ,
    validate: validateCPFOrCNPJ,
  };

  const inputRegisterPhone = {
    maskFn: maskPhone,
    validate: validatePhone,
  };

  return {
    maskCEP,
    maskCPF,
    maskCNPJ,
    maskCPFOrCNPJ,
    maskPhone,
    validateCEP,
    validateCPF,
    validateCNPJ,
    validateCPFOrCNPJ,
    validatePhone,
    inputRegisterCEP,
    inputRegisterCPF,
    inputRegisterCNPJ,
    inputRegisterCPFOrCNPJ,
    inputRegisterPhone,
  };
}
