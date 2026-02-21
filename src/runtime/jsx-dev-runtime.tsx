/* eslint-disable react-refresh/only-export-components */
import type { ElementType, Key, ReactElement } from "react";
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import type { JSX as ReactJSX, JSXSource } from "react/jsx-dev-runtime";
import type { Css } from "./css.types";
import { cssReducer } from "./cssReducer";

export const Fragment = _Fragment;
export type { ReactJSX as JSX };

export function jsxDEV(type: ElementType, props: Record<string, unknown>, key: Key | undefined, isStaticChildren: boolean, source?: JSXSource, self?: unknown): ReactElement {
  if (!props || !Object.prototype.hasOwnProperty.call(props, "css")) {
    return _jsxDEV(type, props, key, isStaticChildren, source, self);
  }

  if (typeof type !== "string") {
    return _jsxDEV(type, props, key, isStaticChildren, source, self);
  }

  const { css, className, ...otherProps } = props;
  const newClassName = cssReducer(className as Css, css as Css);

  return _jsxDEV(type, { ...otherProps, className: newClassName }, key, isStaticChildren, source, self);
}
