import { highlightCode } from "@/utils/syntax-highlighter/SyntaxHighlighter.util";
import { parseInlineMarkdown, parseMarkdown, type MarkdownNode } from "./MarkdownRenderer.component.util";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const nodes = parseMarkdown(content);

  return (
    <div data-component='MarkdownRenderer' css={["padding-2xl"]}>
      {nodes.map((node, i) => (
        <Node key={i} node={node} />
      ))}
    </div>
  );
}

function Node({ node }: { node: MarkdownNode }) {
  switch (node.type) {
    case "heading":
      return <Heading level={node.level || 1} content={node.content || ""} />;
    case "paragraph":
      return <Paragraph content={node.content || ""} />;
    case "code":
      return <CodeBlock content={node.content || ""} language={node.language} />;
    case "list":
      return <List items={node.children || []} ordered={node.ordered} />;
    case "table":
      return <Table content={node.content || ""} />;
    case "blockquote":
      return <Blockquote content={node.content || ""} />;
    case "hr":
      return <hr css={["border-top", "margin-block-2xl"]} />;
    default:
      return null;
  }
}

function Blockquote({ content }: { content: string }) {
  return (
    <blockquote css={["border-left", "border-primary", "padding-left-lg", "margin-block-lg", "color-typeface-medium"]}>
      {content.split("\n").map((line, i) => (
        <p key={i} css={["margin-block-sm"]}>
          <InlineContent content={line} />
        </p>
      ))}
    </blockquote>
  );
}

function List({ items, ordered }: { items: MarkdownNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag css={["margin-block-md", "padding-left-xl"]} style={{ listStyle: ordered ? "decimal" : "disc" }}>
      {items.map((item, i) => (
        <li key={i} css={["margin-block-sm"]}>
          <InlineContent content={item.content || ""} />
        </li>
      ))}
    </Tag>
  );
}

function generateHeadingId(content: string): string {
  return content
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/\*/g, "")
    .replace(/_/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function Heading({ level, content }: { level: number; content: string }) {
  const id = generateHeadingId(content);

  if (level === 1) {
    return (
      <h1 id={id} css={["font-size-3xl", "text-bold", "margin-top-xl", "margin-bottom-lg"]}>
        <InlineContent content={content} />
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2 id={id} css={["font-size-2xl", "text-bold", "margin-top-xl", "margin-bottom-md"]}>
        <InlineContent content={content} />
      </h2>
    );
  }

  if (level === 3) {
    return (
      <h3 id={id} css={["font-size-xl", "text-bold", "margin-top-lg", "margin-bottom-md"]}>
        <InlineContent content={content} />
      </h3>
    );
  }

  if (level === 4) {
    return (
      <h4 id={id} css={["font-size-lg", "text-bold", "margin-top-md", "margin-bottom-sm"]}>
        <InlineContent content={content} />
      </h4>
    );
  }

  if (level === 5) {
    return (
      <h5 id={id} css={["font-size-md", "text-bold", "margin-top-md", "margin-bottom-sm"]}>
        <InlineContent content={content} />
      </h5>
    );
  }

  return (
    <h6 id={id} css={["font-size-sm", "text-bold", "margin-top-sm", "margin-bottom-sm"]}>
      <InlineContent content={content} />
    </h6>
  );
}

function Paragraph({ content }: { content: string }) {
  return (
    <p css={["margin-block-md", "font-size-md"]}>
      <InlineContent content={content} />
    </p>
  );
}

function CodeBlock({ content, language }: { content: string; language?: string }) {
  const tokens = language ? highlightCode(content, language) : null;

  function getTokenColor(tokenType: string): string {
    switch (tokenType) {
      case "keyword":
        return "#FF79C6";
      case "string":
        return "#F1FA8C";
      case "number":
        return "#BD93F9";
      case "comment":
        return "#6272A4";
      case "function":
        return "#50FA7B";
      case "type":
        return "#8BE9FD";
      case "operator":
        return "#F8F8F2";
      default:
        return "#F8F8F2";
    }
  }

  return (
    <div style={{ marginTop: "16px", marginBottom: "16px" }}>
      {language && (
        <div
          style={{
            background: "#21222C",
            color: "#F8F8F2",
            padding: "8px 12px",
            fontSize: "12px",
            fontWeight: "bold",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        >
          {language}
        </div>
      )}
      <pre
        style={{
          background: "#282A36",
          color: "#F8F8F2",
          borderRadius: language ? "0 0 4px 4px" : "4px",
          margin: 0,
          padding: "16px",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      >
        {tokens ? (
          tokens.map((token, i) => (
            <span key={i} style={{ color: getTokenColor(token.type) }}>
              {token.content}
            </span>
          ))
        ) : (
          <span style={{ color: "#F8F8F2" }}>{content}</span>
        )}
      </pre>
    </div>
  );
}

function Table({ content }: { content: string }) {
  const lines = content.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return null;

  const headers = lines[0]
    .split("|")
    .filter((cell) => cell.trim())
    .map((cell) => cell.trim());
  const rows = lines.slice(2).map((line) =>
    line
      .split("|")
      .filter((cell) => cell.trim())
      .map((cell) => cell.trim()),
  );

  return (
    <div css={["margin-block-lg", "overflow-x-auto"]}>
      <table css={["width-full", "border"]}>
        <thead css={["background-light"]}>
          <tr>
            {headers.map((header, i) => (
              <th key={i} css={["padding-md", "text-left", "border-bottom", "text-bold"]}>
                <InlineContent content={header} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} css={["border-bottom"]}>
              {row.map((cell, j) => (
                <td key={j} css={["padding-md", "border-bottom"]}>
                  <InlineContent content={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineContent({ content }: { content: string }) {
  const parts = parseInlineMarkdown(content);

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === "string") {
          return <span key={i}>{part}</span>;
        }

        switch (part.type) {
          case "badge":
            return (
              <a key={i} href={part.href} target='_blank' rel='noopener noreferrer'>
                <img src={part.alt} alt={part.content} css={["display-inline-block"]} style={{ verticalAlign: "middle" }} />
              </a>
            );
          case "code":
            return (
              <code key={i} css={["background-light", "color-typeface-dark", "padding-xs", "border-radius-sm", "font-family-monospace", "font-size-sm", "border"]}>
                {part.content}
              </code>
            );
          case "bold":
            return (
              <strong key={i} css={["text-bold"]}>
                {part.content}
              </strong>
            );
          case "italic":
            return (
              <em key={i} css={["text-italic"]}>
                {part.content}
              </em>
            );
          case "link": {
            const isHashLink = part.href?.startsWith("#");
            return (
              <a key={i} href={part.href} css={["color-primary", "text-underline"]} target={isHashLink ? undefined : "_blank"} rel={isHashLink ? undefined : "noopener noreferrer"}>
                {part.content}
              </a>
            );
          }
          default:
            return <span key={i}>{part.content}</span>;
        }
      })}
    </>
  );
}
