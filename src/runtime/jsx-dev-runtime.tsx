/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";

import type { JSX as ReactJSX } from "react/jsx-runtime";
import { cssReducer } from "./cssReducer";
import type { Css } from "./css.types";

export const Fragment = _Fragment;
export type { ReactJSX as JSX };

export function jsxDEV(type: any, props: any, key: any, isStaticChildren: any, source: any, self: any) {
  if (!props || !Object.prototype.hasOwnProperty.call(props, "css")) {
    return _jsxDEV(type, props, key, isStaticChildren, source, self);
  }

  const { css, className, ...otherProps } = props;
  const newClassName = cssReducer(className, css as Css);

  return _jsxDEV(type, { ...otherProps, className: newClassName }, key, isStaticChildren, source, self);
}
