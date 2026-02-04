/* eslint-disable no-undef */
/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const designDir = path.resolve(__dirname, "../src/styles/design");
const outputFile = path.resolve(__dirname, "../src/styles/designRegister.ts");

const toCamelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const main = () => {
  if (!fs.existsSync(designDir)) {
    console.error(`Directory not found: ${designDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(designDir).filter((file) => file.endsWith(".css"));
  const register = {};

  files.forEach((file) => {
    const filePath = path.join(designDir, file);
    let content = fs.readFileSync(filePath, "utf-8");

    // Remove comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, "");

    const name = file.replace(".css", "");
    const key = toCamelCase(name);

    // Regex to find class names starting with .
    // Matches .className followed by non-identifier character or end of string
    const classRegex = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;

    const classes = new Set();
    let match;
    while ((match = classRegex.exec(content)) !== null) {
      classes.add(match[1]);
    }

    register[key] = Array.from(classes).sort();
  });

  const fileContent = `export const cssRegister = {
${Object.entries(register)
  .map(([key, classes]) => `  ${key}: ${JSON.stringify(classes).replace(/"/g, "'")},`)
  .join("\n")}
} as const satisfies Record<string, string[]>;

export type CssRegister = (typeof cssRegister)[keyof typeof cssRegister][number];
`;

  fs.writeFileSync(outputFile, fileContent);
  console.log(`Generated ${outputFile}`);
};

main();
