export class Regex {
  // ── General ───────────────────────────────────────────────────────────────
  static nonDigit = /\D/g;
  static allRepeatedDigits = /^(\d)\1+$/;

  // ── CEP ───────────────────────────────────────────────────────────────────
  static cepMask = /(\d{5})(\d)/;
  static cepValidation = /^\d{5}-?\d{3}$/;

  // ── CPF ───────────────────────────────────────────────────────────────────
  static cpfDotSeparator = /(\d{3})(\d)/;
  static cpfDashSeparator = /(\d{3})(\d{1,2})$/;

  // ── CNPJ ──────────────────────────────────────────────────────────────────
  static cnpjFirstDot = /(\d{2})(\d)/;
  static cnpjSlash = /(\d{3})(\d)/;
  static cnpjDash = /(\d{4})(\d{1,2})$/;

  // ── Phone ─────────────────────────────────────────────────────────────────
  static phoneAreaCode = /(\d{2})(\d)/;
  static phoneSeparator8 = /(\d{4})(\d)/;
  static phoneSeparator9 = /(\d{5})(\d)/;
  static phoneValidation = /^\(\d{2}\) \d{4,5}-\d{4}$/;
}
