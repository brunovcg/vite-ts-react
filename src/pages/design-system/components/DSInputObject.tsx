import { TextArea } from "@/components/text-area/TextArea";
import { useState, useEffect } from "react";

interface ObjectInputProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  format?: "object" | "array";
  label?: string;
}

export function DSInputObject({ value, onChange, readOnly, format = "object", label }: ObjectInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // When external value changes (and is valid), sync to local
    setLocalValue(value);
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setLocalValue(newVal);

    if (!newVal.trim()) {
      setError(null);
      return;
    }

    try {
      // Use Function constructor to allow loose JS syntax (e.g. {a:1} instead of {"a":1})
      // as requested "type like =JS not json"
      const parsed = new Function(`return ${newVal}`)();

      if (parsed === null) {
        setError("Input cannot be null");
        return;
      }

      if (format === "array") {
        if (!Array.isArray(parsed)) {
          setError("Input must be a valid JS array");
          return;
        }
      } else {
        if (typeof parsed !== "object" || Array.isArray(parsed)) {
          setError("Input must be a valid JS object");
          return;
        }
      }

      setError(null);
      // Only call onChange if valid
      onChange(newVal);
    } catch {
      setError("Invalid JS syntax");
    }
  };

  return (
    <div
      data-component='DSInputObject'
      css={["position-relative", "height-auto", "width-full", "display-flex", "flex-column"]}
      style={{
        padding: 0,
        minHeight: "200px",
      }}
    >
      <TextArea
        value={localValue}
        onChange={handleInput}
        readOnly={readOnly}
        spellCheck={false}
        css={["flex-1", "width-full", "background-transparent"]}
        style={{
          fontFamily: "monospace",
          fontSize: "var(--font_size-sm)",
          lineHeight: "1.5",
          resize: "vertical",
          minHeight: "200px",
        }}
        id={""}
        name={""}
        label={label}
      />

      {error && <div css={["padding-xs", "font-size-xs", "color-error", "background-error-light", "border-top", "width-full"]}>{error}</div>}
    </div>
  );
}
