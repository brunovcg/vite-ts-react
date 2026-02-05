import type { cssRegister } from "./cssRegister";

export type CssRegister = (typeof cssRegister)[keyof typeof cssRegister][number];

export type Css = CssRegister | Partial<Record<CssRegister, boolean | undefined | null>> | Css[] | undefined | null | false;
