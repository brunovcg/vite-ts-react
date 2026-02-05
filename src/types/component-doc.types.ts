import type { ComponentType } from "react";

export type ControlType = "text" | "number" | "boolean" | "select" | "color" | "object" | "function";

export interface Control<T = unknown> {
  type: ControlType;
  options?: string[] | number[]; // For select type
  label?: string;
  min?: number;
  max?: number;
  defaultValue?: T;
}

export interface ComponentDoc<P = Record<string, unknown>> {
  id: string;
  name: string;
  description?: string;
  component: ComponentType<P>;
  args?: Partial<P>; // Default values
  argTypes?: Partial<Record<keyof P, Control>>; // Explicit control definitions
}
