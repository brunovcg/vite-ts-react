import "react";
import type { Css } from "@/runtime/css.types";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DOMAttributes<T> {
    css?: Css;
  }
}
