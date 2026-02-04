export const COLORS = {
  primary: "var(--primary)",
  error: "var(--error)",
  success: "var(--success)",
  warning: "var(--warning)",
  dark: "var(--typeface-dark)",
  light: "var(--typeface-light)",
  white: "var(--typeface-white)",
  medium: "var( --typeface-medium)",
} as const;

export type Color = keyof typeof COLORS;

export const KEYBOARD = {
  KEYS: [
    "Enter",
    " ",
    "Tab",
    "Shift",
    "Escape",
    "ArrowDown",
    "ArrowUp",
    "ArrowLeft",
    "ArrowRight",
    "Control",
  ],
} as const;

export type KeyboardKey = (typeof KEYBOARD.KEYS)[number];
