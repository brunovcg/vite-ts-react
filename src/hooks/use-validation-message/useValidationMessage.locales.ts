import { locales } from "@/locales/Locales";

export const validationLocale = locales.create({
  ptBR: {
    valueMissing: "Por favor, preencha este campo.",
    typeMismatchEmail: "Por favor, inclua um '@' no endereço de e-mail.",
    typeMismatchUrl: "Por favor, insira uma URL válida.",
    patternMismatch: "Por favor, corresponda ao formato solicitado.",
    tooShort: "Este campo deve ter pelo menos {{minLength}} caracteres.",
    tooLong: "Este campo deve ter no máximo {{maxLength}} caracteres.",
    rangeUnderflow: "O valor deve ser maior ou igual a {{min}}.",
    rangeOverflow: "O valor deve ser menor ou igual a {{max}}.",
    stepMismatch: "Por favor, insira um valor válido.",
    badInput: "Por favor, insira um valor válido.",
  },
  enUS: {
    valueMissing: "Please fill out this field.",
    typeMismatchEmail: "Please include an '@' in the email address.",
    typeMismatchUrl: "Please enter a valid URL.",
    patternMismatch: "Please match the requested format.",
    tooShort: "This field must have at least {{minLength}} characters.",
    tooLong: "This field must have no more than {{maxLength}} characters.",
    rangeUnderflow: "Value must be greater than or equal to {{min}}.",
    rangeOverflow: "Value must be less than or equal to {{max}}.",
    stepMismatch: "Please enter a valid value.",
    badInput: "Please enter a valid value.",
  },
});
