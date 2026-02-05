import type { Css, CssClass } from "@/runtime/css.types";

export type ClassNameArg = string | undefined | null | Record<string, boolean | undefined | null> | string[];
export type ClassNameCssArg = CssClass | undefined | null | Partial<Record<CssClass, boolean | undefined | null>> | ClassNameCssArg[];

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

  static mergeCss(...css: ClassNameCssArg[]): Css {
    const result: CssClass[] = [];

    css.forEach((item) => {
      if (!item) return;

      if (Array.isArray(item)) {
        const merged = ClassNames.mergeCss(...item);
        if (merged) {
          result.push(...merged);
        }
      } else if (typeof item === "string") {
        result.push(item);
      } else if (typeof item === "object") {
        Object.entries(item).forEach(([key, value]) => {
          if (value) {
            result.push(key as CssClass);
          }
        });
      }
    });

    return result;
  }
}

export const mergeClass = ClassNames.merge;
export const mergeCss = ClassNames.mergeCss;
