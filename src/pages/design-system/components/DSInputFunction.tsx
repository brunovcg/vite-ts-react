import { useState, useCallback } from "react";
import { Icon } from "@/components/icon/Icon.component";
import type { Css } from "@/runtime/css.types";
import { TextArea } from "@/components/text-area/TextArea.component";

interface InputFunctionProps {
  value: string;
  onChange: (value: string) => void;
  css?: Css;
  label?: string;
  error?: string;
}

export function DSInputFunction({ value, onChange, css, label, error: paramsError }: InputFunctionProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const validateFunction = useCallback((val: string) => {
    if (!val.trim()) return null;
    try {
      // Check if it looks like a function
      // This is a loose check, mainly for syntax
      const fn = new Function(`return ${val}`);
      if (typeof fn() !== "function") {
        return "Input must be a valid javascript function";
      }
      return null;
    } catch {
      return "Invalid javascript function syntax";
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    setLocalError(validateFunction(val));
  };

  const errorMessage = paramsError || localError;

  return (
    <div data-component='DSInputFunction' css={["position-relative", "height-auto", "width-full", "display-flex", "flex-column", css]} style={{ minHeight: "100px", padding: 0 }}>
      <TextArea
        label={label}
        value={value}
        onChange={handleChange}
        spellCheck={false}
        css={["width-full", "background-transparent", "font-family-monospace", "font-size-sm"]}
        style={{ minHeight: "100px", resize: "vertical" }}
        id={""}
        name={""}
      />
      {errorMessage && (
        <div css={["padding-xs", "font-size-xs", "color-error", "background-error-light", "border-top", "display-flex", "align-center", "gap-xs"]}>
          <Icon icon='warning' size='xs' />
          {errorMessage}
        </div>
      )}
    </div>
  );
}
