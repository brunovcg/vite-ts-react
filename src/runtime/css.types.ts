import type { cssRegister } from "./cssRegister";

export type CssClass = (typeof cssRegister)[keyof typeof cssRegister][number];

export type Css = CssClass[];

export type PropsWithCss<T = Record<never, never>> = T & {
  css?: Css;
};
