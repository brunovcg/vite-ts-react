const JS_KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "new",
  "class",
  "extends",
  "import",
  "export",
  "from",
  "default",
  "async",
  "await",
  "typeof",
  "instanceof",
  "in",
  "of",
  "yield",
  "static",
  "this",
  "super",
  "null",
  "undefined",
  "true",
  "false",
]);

const TS_KEYWORDS = new Set([
  ...JS_KEYWORDS,
  "interface",
  "type",
  "enum",
  "namespace",
  "module",
  "declare",
  "public",
  "private",
  "protected",
  "readonly",
  "implements",
  "keyof",
  "never",
  "unknown",
  "any",
  "void",
  "as",
  "satisfies",
]);

export interface SyntaxToken {
  type: "keyword" | "string" | "number" | "comment" | "function" | "type" | "operator" | "text";
  content: string;
}

export function highlightCode(code: string, language: string): SyntaxToken[] {
  const lang = language.toLowerCase();

  if (lang === "typescript" || lang === "ts" || lang === "tsx") {
    return highlightTypeScript(code);
  }

  if (lang === "javascript" || lang === "js" || lang === "jsx") {
    return highlightJavaScript(code);
  }

  if (lang === "json") {
    return highlightJSON(code);
  }

  if (lang === "css") {
    return highlightCSS(code);
  }

  return [{ type: "text", content: code }];
}

function highlightTypeScript(code: string): SyntaxToken[] {
  return tokenize(code, TS_KEYWORDS);
}

function highlightJavaScript(code: string): SyntaxToken[] {
  return tokenize(code, JS_KEYWORDS);
}

function highlightJSON(code: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  let i = 0;

  while (i < code.length) {
    if (code[i] === '"') {
      let str = '"';
      i++;
      while (i < code.length && code[i] !== '"') {
        if (code[i] === "\\") {
          str += code[i] + (code[i + 1] || "");
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      str += '"';
      i++;
      tokens.push({ type: "string", content: str });
      continue;
    }

    if (code[i].match(/[0-9]/)) {
      let num = "";
      while (i < code.length && code[i].match(/[0-9.\-eE]/)) {
        num += code[i];
        i++;
      }
      tokens.push({ type: "number", content: num });
      continue;
    }

    if (code.slice(i, i + 4) === "true" || code.slice(i, i + 5) === "false" || code.slice(i, i + 4) === "null") {
      const len = code.slice(i, i + 5) === "false" ? 5 : 4;
      tokens.push({ type: "keyword", content: code.slice(i, i + len) });
      i += len;
      continue;
    }

    tokens.push({ type: "text", content: code[i] });
    i++;
  }

  return tokens;
}

function highlightCSS(code: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  let i = 0;

  while (i < code.length) {
    if (code.slice(i, i + 2) === "/*") {
      let comment = "";
      while (i < code.length && code.slice(i, i + 2) !== "*/") {
        comment += code[i];
        i++;
      }
      comment += "*/";
      i += 2;
      tokens.push({ type: "comment", content: comment });
      continue;
    }

    if (code[i] === ".") {
      let cls = ".";
      i++;
      while (i < code.length && code[i].match(/[a-zA-Z0-9_-]/)) {
        cls += code[i];
        i++;
      }
      tokens.push({ type: "type", content: cls });
      continue;
    }

    if (code[i] === "#") {
      let id = "#";
      i++;
      while (i < code.length && code[i].match(/[a-zA-Z0-9_-]/)) {
        id += code[i];
        i++;
      }
      tokens.push({ type: "number", content: id });
      continue;
    }

    tokens.push({ type: "text", content: code[i] });
    i++;
  }

  return tokens;
}

function tokenize(code: string, keywords: Set<string>): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  let i = 0;

  while (i < code.length) {
    if (code.slice(i, i + 2) === "//") {
      let comment = "";
      while (i < code.length && code[i] !== "\n") {
        comment += code[i];
        i++;
      }
      tokens.push({ type: "comment", content: comment });
      continue;
    }

    if (code.slice(i, i + 2) === "/*") {
      let comment = "";
      while (i < code.length && code.slice(i, i + 2) !== "*/") {
        comment += code[i];
        i++;
      }
      comment += "*/";
      i += 2;
      tokens.push({ type: "comment", content: comment });
      continue;
    }

    if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
      const quote = code[i];
      let str = quote;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === "\\") {
          str += code[i] + (code[i + 1] || "");
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      str += quote;
      i++;
      tokens.push({ type: "string", content: str });
      continue;
    }

    if (code[i].match(/[a-zA-Z_]/)) {
      let word = "";
      while (i < code.length && code[i].match(/[a-zA-Z0-9_]/)) {
        word += code[i];
        i++;
      }

      if (keywords.has(word)) {
        tokens.push({ type: "keyword", content: word });
      } else if (code[i] === "(") {
        tokens.push({ type: "function", content: word });
      } else if (word[0] === word[0].toUpperCase() && word.length > 1) {
        tokens.push({ type: "type", content: word });
      } else {
        tokens.push({ type: "text", content: word });
      }
      continue;
    }

    if (code[i].match(/[0-9]/)) {
      let num = "";
      while (i < code.length && code[i].match(/[0-9.]/)) {
        num += code[i];
        i++;
      }
      tokens.push({ type: "number", content: num });
      continue;
    }

    if (code[i].match(/[+\-*/%=<>!&|^~?:]/)) {
      tokens.push({ type: "operator", content: code[i] });
      i++;
      continue;
    }

    tokens.push({ type: "text", content: code[i] });
    i++;
  }

  return tokens;
}
