import { useState } from "react";
import type { Control, ControlType } from "@/types/component-doc.types";
import { Input } from "@/components/input/Input";
import { Select } from "@/components/select/Select";
import { JsonEditor } from "./JsonEditor";
import { InputFunction } from "./InputFunction";

interface ControlsPanelProps {
  args: Record<string, unknown>;
  argTypes: Record<string, Control>;
  onChange: (key: string, value: unknown) => void;
}

export function ControlsPanel({ args, argTypes, onChange }: ControlsPanelProps) {
  // Helper to determine control type if not explicitly defined
  const getControlType = (key: string, value: unknown): ControlType => {
    if (argTypes[key]?.type) return argTypes[key].type;
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "object" && value !== null) return "object";
    if (typeof value === "function") return "function";
    return "text";
  };

  return (
    <div css={["display-flex", "flex-column", "gap-md", "padding-lg", "border-left", "background-white", "width-300px", "overflow-y-auto"]}>
      <h3>Controls</h3>
      {Object.entries(args).map(([key, value]) => {
        const type = getControlType(key, value);
        const options = argTypes[key]?.options;
        const isFunction = typeof value === "function";

        return (
          <div key={key} css={["display-flex", "flex-column", "gap-xs"]}>
            {type === "function" || isFunction ? (
              <div css={["display-flex", "flex-column", "gap-xs"]}>
                <span css={["font-size-sm", "text-bold"]}>{key} (Function)</span>
                <FunctionControl initialValue={value} onChange={(newValue) => onChange(key, newValue)} />
              </div>
            ) : type === "object" ? (
              <div css={["display-flex", "flex-column", "gap-xs"]}>
                <span css={["font-size-sm", "text-bold"]}>{key}</span>
                <ObjectControl initialValue={value} onChange={(newValue) => onChange(key, newValue)} />
              </div>
            ) : type === "boolean" ? (
              <label css={["display-flex", "align-center", "gap-sm", "cursor-pointer"]}>
                <input type='checkbox' checked={!!value} onChange={(e) => onChange(key, e.target.checked)} />
                <span css={["font-size-sm", "text-bold"]}>{key}</span>
              </label>
            ) : type === "select" && options ? (
              <Select
                id={`control-${key}`}
                name={key}
                label={key}
                value={String(value)}
                options={options.map((opt) => ({ label: String(opt), value: String(opt) }))}
                onChange={(e) => onChange(key, e.target.value)}
              />
            ) : (
              <Input id={`control-${key}`} name={key} label={key} value={String(value)} onChange={(e) => onChange(key, type === "number" ? Number(e.target.value) : e.target.value)} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ObjectControl({ initialValue, onChange }: { initialValue: unknown; onChange: (val: unknown) => void }) {
  const [jsonString, setJsonString] = useState(() => JSON.stringify(initialValue, null, 2));

  const handleChange = (val: string) => {
    setJsonString(val);
    try {
      const parsed = JSON.parse(val);
      onChange(parsed);
    } catch {
      // invalid json, don't propagate to parent component yet
    }
  };

  return <JsonEditor value={jsonString} onChange={handleChange} />;
}

function FunctionControl({ initialValue, onChange }: { initialValue: unknown; onChange: (val: unknown) => void }) {
  const [codeString, setCodeString] = useState(() => (typeof initialValue === "function" ? initialValue.toString() : "() => {}"));

  const handleChange = (val: string) => {
    setCodeString(val);
    try {
      // Create function from string safely-ish
      // We assume it returns an arrow function or function declaration expression
      const func: unknown = new Function(`return ${val}`)();
      if (typeof func === "function") {
        onChange(func);
      }
    } catch {
      // invalid code, allow typing
    }
  };

  return <InputFunction value={codeString} onChange={handleChange} />;
}
