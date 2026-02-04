import type { CssRegister } from "@/styles/designRegister";

export type ClassNameArg = string | undefined | null | Record<string, boolean> | string[];
export type CssArg = CssRegister | Record<CssRegister, boolean> | CssRegister[];

export class ClassNames {
  static merge(...classNames: ClassNameArg[]) {
    const result: string[] = [];

    classNames.forEach((item) => {
      if (!item) return;

      if (Array.isArray(item)) {
        const merged = ClassNames.merge(...item);
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

  static css(...classNames: CssArg[]) {
    return ClassNames.merge(...classNames);
  }
}

export const css = ClassNames.css;
