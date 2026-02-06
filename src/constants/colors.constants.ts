export const KEYBOARD = {
  KEYS: ["Enter", " ", "Tab", "Shift", "Escape", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Control"],
} as const;

export type KeyboardKey = (typeof KEYBOARD.KEYS)[number];
