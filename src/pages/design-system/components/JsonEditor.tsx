import { useState } from "react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const COLORS = {
  key: "#038fc6", // primary
  string: "#179b03", // success
  number: "#e12f26", // error (just for distinction)
  boolean: "#be9c00", // warning
  null: "#777777", // typeface-light
  bracket: "#1c1c1c", // typeface-dark
  error: "#ffeaea", // error-light background
};

export function JsonEditor({ value, onChange, readOnly }: JsonEditorProps) {
  const [error, setError] = useState<string | null>(null);

  // Syntax highlighting logic
  // Matches strings, numbers, booleans, nulls, and delimiters
  const syntaxHighlight = (json: string) => {
    if (!json) return "";

    const escaped = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][-+]?\d+)?|([{},:[\]]))/g, (match) => {
      let style = `color: ${COLORS.number}`;

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          style = `color: ${COLORS.key}`;
        } else {
          style = `color: ${COLORS.string}`;
        }
      } else if (/true|false/.test(match)) {
        style = `color: ${COLORS.boolean}`;
      } else if (/null/.test(match)) {
        style = `color: ${COLORS.null}`;
      } else if (/[{},:[\]]/.test(match)) {
        style = `color: ${COLORS.bracket}`;
      }
      return `<span style="${style}">${match}</span>`;
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    onChange(newVal);
    try {
      if (newVal.trim()) {
        JSON.parse(newVal);
      }
      setError(null);
    } catch {
      setError("Invalid JSON format");
    }
  };

  // Shared styles for strict alignment
  const commonStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "var(--font-size-sm)",
    lineHeight: "1.5",
    padding: "18px 4px 4px 10px", // Matches standard Input styling
    margin: 0,
    border: 0,
    background: "transparent",
    whiteSpace: "pre-wrap", // Allows wrapping so it grows vertically
    wordBreak: "break-all", // exact wrapping behavior
    gridArea: "1 / 1", // Both elements occupy the same grid cell
  };

  return (
    <div
      className='container-input'
      css={["display-grid", "position-relative", "height-auto", "width-full"]}
      style={{
        padding: 0,
        minHeight: "200px",
        height: "auto", // Override .container-input fixed height
        alignItems: "stretch",
      }}
    >
      {/* 
        Layer 1: Syntax Highlighted Output
        This layer dictates the height of the grid container as it grows.
      */}
      <pre
        aria-hidden='true'
        style={{
          ...commonStyle,
          color: COLORS.bracket,
          pointerEvents: "none",
          zIndex: 0,
          // Extra newline ensures space for the cursor at the end
          visibility: "visible",
        }}
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(value) + "<br>" }}
      />

      {/* 
        Layer 2: Editable Textarea
        This layer is transparent but interactive. It fills the grid cell defined by the pre.
      */}
      <textarea
        value={value}
        onChange={handleInput}
        readOnly={readOnly}
        spellCheck={false}
        style={{
          ...commonStyle,
          color: "transparent",
          caretColor: "black",
          zIndex: 1,
          resize: "none", // Size is controlled by grid content
          outline: "none",
          overflow: "hidden", // No scrollbars, grows with content
        }}
      />

      {error && (
        <div css={["padding-xs", "font-size-xs", "color-error", "background-error-light", "border-top", "position-absolute", "width-full"]} style={{ bottom: 0, left: 0, zIndex: 2 }}>
          {error}
        </div>
      )}
    </div>
  );
}
