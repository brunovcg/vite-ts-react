import { useState } from "react";
import type { ComponentDoc, Control } from "@/types/component-doc.types";
import { ControlsPanel } from "./ControlsPanel";

interface ComponentViewerProps {
  doc: ComponentDoc;
}

export function ComponentViewer({ doc }: ComponentViewerProps) {
  const [args, setArgs] = useState(doc.args || {});

  const handleChange = (key: string, value: unknown) => {
    setArgs((prev) => ({ ...prev, [key]: value }));
  };

  const Component = doc.component;

  return (
    <div css={["display-flex", "height-full", "width-full", "overflow-hidden"]} data-component='ComponentViewer'>
      <div css={["flex-1", "display-flex", "flex-column", "gap-lg", "padding-2xl", "background-light", "overflow-y-auto"]}>
        <div css={["border-bottom", "padding-bottom-md"]}>
          <h2 css={["margin-bottom-sm"]}>{doc.name}</h2>
          {doc.description && <p css={["color-typeface-light"]}>{doc.description}</p>}
        </div>

        <div css={["display-flex", "flex-center", "background-white", "border-radius-md", "padding-2xl"]} style={{ minHeight: "300px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {/* The component being previewed */}
          <div css={["margin-auto"]}>
            <Component {...args} />
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <h3>Code Snippet</h3>
          <pre css={["background-dark", "color-white", "padding-md", "border-radius-sm", "overflow-x-auto"]}>
            {`<${doc.name}
${Object.entries(args)
  .map(([key, value]) => {
    if (value === true) return `  ${key}`;
    if (value === false) return null;
    if (typeof value === "string") return `  ${key}="${value}"`;
    if (typeof value === "object") return `  ${key}={${JSON.stringify(value)}}`;
    return `  ${key}={${value}}`;
  })
  .filter(Boolean)
  .join("\n")}
/>`}
          </pre>
        </div>
      </div>

      <ControlsPanel args={args} argTypes={(doc.argTypes as Record<string, Control>) || {}} onChange={handleChange} />
    </div>
  );
}
