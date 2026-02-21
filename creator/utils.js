/* eslint-disable no-undef */
/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT = path.resolve(__dirname, "..");
export const SRC = path.resolve(ROOT, "src");

export function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

export function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeFile(filePath, content) {
  if (fs.existsSync(filePath)) {
    console.log(`  Skipped (already exists): ${path.relative(ROOT, filePath)}`);
    return false;
  }
  fs.writeFileSync(filePath, content);
  console.log(`  Created: ${path.relative(ROOT, filePath)}`);
  return true;
}

export function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}
