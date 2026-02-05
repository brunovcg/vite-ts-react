/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import type { JSX as ReactJSX } from "react/jsx-runtime";
import type { Css } from "./css.types";
import { cssReducer } from "./cssReducer";

export const Fragment = _Fragment;

export type { ReactJSX as JSX };

export function jsx(type: any, props: any, key: any) {
  if (!props || !Object.prototype.hasOwnProperty.call(props, "css")) {
    return _jsx(type, props, key);
  }

  const { css, className, ...otherProps } = props;
  const newClassName = cssReducer(className, css as Css);

  return _jsx(type, { ...otherProps, className: newClassName }, key);
}

export function jsxs(type: any, props: any, key: any) {
  if (!props || !Object.prototype.hasOwnProperty.call(props, "css")) {
    return _jsxs(type, props, key);
  }

  const { css, className, ...otherProps } = props;
  const newClassName = cssReducer(className, css as Css);

  return _jsxs(type, { ...otherProps, className: newClassName }, key);
}
