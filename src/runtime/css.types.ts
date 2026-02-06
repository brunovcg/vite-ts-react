import { CSS_REGISTER } from "./cssRegister";
import { CSS_VARIABLES } from "./cssVariables";

export type CssClass = (typeof CSS_REGISTER)[keyof typeof CSS_REGISTER][number];

export type Css = CssClass[];

export type PropsWithCss<T = Record<never, never>> = T & {
  css?: Css;
};

export type CssVariable = typeof CSS_VARIABLES;
