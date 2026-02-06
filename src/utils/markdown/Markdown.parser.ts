export interface MarkdownNode {
  type: string;
  content?: string;
  children?: MarkdownNode[];
  level?: number;
  language?: string;
  href?: string;
  alt?: string;
  ordered?: boolean;
}

export function parseMarkdown(markdown: string): MarkdownNode[] {
  const lines = markdown.split("\n");
  const nodes: MarkdownNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push({
        type: "code",
        content: codeLines.join("\n"),
        language: language || "text",
      });
      i++;
      continue;
    }

    if (line.match(/^#{1,6}\s/)) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const content = line.replace(/^#+\s*/, "").trim();
      nodes.push({ type: "heading", level, content });
      i++;
      continue;
    }

    if (line.match(/^[-*]\s/)) {
      const items: MarkdownNode[] = [];
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        const content = lines[i].replace(/^[-*]\s*/, "");
        items.push({ type: "list-item", content });
        i++;
      }
      nodes.push({ type: "list", children: items, ordered: false });
      continue;
    }

    if (line.match(/^\d+\.\s/)) {
      const items: MarkdownNode[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        const content = lines[i].replace(/^\d+\.\s*/, "");
        items.push({ type: "list-item", content });
        i++;
      }
      nodes.push({ type: "list", children: items, ordered: true });
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push({ type: "table", content: tableLines.join("\n") });
      continue;
    }

    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      nodes.push({ type: "blockquote", content: quoteLines.join("\n") });
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.startsWith("---") || line.startsWith("***")) {
      nodes.push({ type: "hr" });
      i++;
      continue;
    }

    nodes.push({ type: "paragraph", content: line });
    i++;
  }

  return nodes;
}

export function parseInlineMarkdown(text: string): (string | { type: string; content: string; href?: string; alt?: string })[] {
  const parts: (string | { type: string; content: string; href?: string; alt?: string })[] = [];
  let current = "";
  let i = 0;

  while (i < text.length) {
    if (text[i] === "`" && text[i + 1] !== "`") {
      if (current) {
        parts.push(current);
        current = "";
      }
      i++;
      let code = "";
      while (i < text.length && text[i] !== "`") {
        code += text[i];
        i++;
      }
      parts.push({ type: "code", content: code });
      i++;
      continue;
    }

    if (text.slice(i, i + 2) === "**") {
      if (current) {
        parts.push(current);
        current = "";
      }
      i += 2;
      let bold = "";
      while (i < text.length && text.slice(i, i + 2) !== "**") {
        bold += text[i];
        i++;
      }
      parts.push({ type: "bold", content: bold });
      i += 2;
      continue;
    }

    if (text[i] === "*" && text[i + 1] !== "*") {
      if (current) {
        parts.push(current);
        current = "";
      }
      i++;
      let italic = "";
      while (i < text.length && text[i] !== "*") {
        italic += text[i];
        i++;
      }
      parts.push({ type: "italic", content: italic });
      i++;
      continue;
    }

    if (text[i] === "[") {
      const badgeMatch = text.slice(i).match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/);
      if (badgeMatch) {
        if (current) {
          parts.push(current);
          current = "";
        }
        parts.push({ type: "badge", content: badgeMatch[1], href: badgeMatch[3], alt: badgeMatch[2] });
        i += badgeMatch[0].length;
        continue;
      }

      const linkMatch = text.slice(i).match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        if (current) {
          parts.push(current);
          current = "";
        }
        parts.push({ type: "link", content: linkMatch[1], href: linkMatch[2] });
        i += linkMatch[0].length;
        continue;
      }
    }

    current += text[i];
    i++;
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}
