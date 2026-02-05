import type { Css } from "./css.types";

export function cssReducer(...classNames: Css[]) {
  const result: string[] = [];

  classNames.forEach((item) => {
    if (!item) return;

    if (Array.isArray(item)) {
      const merged = cssReducer(...item);
      if (merged) {
        result.push(merged);
      }
    } else if (typeof item === "string") {
      result.push(item);
    } else if (typeof item === "object") {
      Object.entries(item).forEach(([key, value]) => {
        if (value) {
          result.push(key);
        }
      });
    }
  });

  return result.join(" ");
}
