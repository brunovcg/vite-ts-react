/* eslint-disable no-undef */
/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "../src");

// ─── Helpers ────────────────────────────────────────────────────────

const SECONDARY_SUFFIXES = [
  ".locales.ts",
  ".types.ts",
  ".types.tsx",
  ".doc.tsx",
  ".test.ts",
  ".test.tsx",
  ".context.tsx",
  ".context.ts",
  ".provider.tsx",
  ".controller.ts",
  ".controller.test.ts",
  ".register.ts",
  ".routes.tsx",
  ".routes.locales.ts",
  ".layout.locales.ts",
  ".layout.css",
  ".dialog.locales.ts",
];

const KEBAB_CASE_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const PASCAL_CASE_RE = /^[A-Z][a-zA-Z0-9]*$/;

function hasSecondarySuffix(filename) {
  return SECONDARY_SUFFIXES.some((suffix) => filename.endsWith(suffix));
}

function isSourceFile(filename) {
  return filename.endsWith(".ts") || filename.endsWith(".tsx");
}

function isInNestedComponents(filePath) {
  const parts = filePath.split(path.sep);
  const srcIndex = parts.indexOf("src");
  if (srcIndex === -1) return false;

  const afterSrc = parts.slice(srcIndex + 1);
  // Look for a "components" dir that is NOT the top-level src/components
  // e.g. src/pages/design-system/components/ or src/components/table/cells/components/
  for (let i = 1; i < afterSrc.length - 1; i++) {
    if (afterSrc[i] === "components") return true;
  }
  return false;
}

function isInAssetsDir(filePath) {
  return filePath.split(path.sep).includes("assets");
}

function getRelativePath(filePath) {
  return path.relative(path.resolve(__dirname, ".."), filePath);
}

// ─── Checks ─────────────────────────────────────────────────────────

const errors = [];

function error(filePath, message) {
  errors.push(`  ${getRelativePath(filePath)}: ${message}`);
}

// ─── 1. Directory Naming (kebab-case) ───────────────────────────────

function checkDirectoryNaming(filePath) {
  const rel = path.relative(srcDir, filePath);
  const dirs = path.dirname(rel).split(path.sep);

  for (const dir of dirs) {
    if (dir === "." || dir === "src") continue;
    if (!KEBAB_CASE_RE.test(dir)) {
      error(filePath, `Directory "${dir}" is not kebab-case`);
      return;
    }
  }
}

// ─── 2. File Naming ─────────────────────────────────────────────────

function checkFileNaming(filePath) {
  const rel = path.relative(srcDir, filePath);
  const filename = path.basename(filePath);
  const segments = rel.split(path.sep);
  const topDir = segments[0];

  // Only check convention directories
  const checkedDirs = ["components", "pages", "hooks", "utils", "layouts", "dialogs"];
  if (!checkedDirs.includes(topDir)) return;

  // Skip non-source files (SVGs, images, etc.)
  if (!isSourceFile(filename) && !filename.endsWith(".css")) return;

  // Skip CSS files (validated by data-css check)
  if (filename.endsWith(".css")) return;

  // Skip files with recognized secondary suffixes
  if (hasSecondarySuffix(filename)) return;

  // Skip index files
  if (filename === "index.ts" || filename === "index.tsx") return;

  // Skip files inside assets/ directories
  if (isInAssetsDir(filePath)) return;

  // ── Pages ──
  if (topDir === "pages") {
    if (isInNestedComponents(filePath)) return; // sub-components are free-form
    if (!filename.endsWith(".page.tsx")) {
      error(filePath, `Page file should end with .page.tsx (e.g. Login.page.tsx)`);
    }
    return;
  }

  // ── Layouts ──
  if (topDir === "layouts") {
    // Allow .layout.tsx for layout components and recognized secondary suffixes
    if (!filename.endsWith(".layout.tsx")) {
      error(filePath, `Layout file should end with .layout.tsx (e.g. Header.layout.tsx)`);
    }
    return;
  }

  // ── Hooks ──
  if (topDir === "hooks") {
    if (!filename.match(/^use[A-Z].*\.hook\.tsx?$/)) {
      error(filePath, `Hook file should match use<Name>.hook.ts(x) (e.g. useDebounce.hook.ts)`);
    }
    return;
  }

  // ── Utils ──
  if (topDir === "utils") {
    if (!filename.endsWith(".util.ts")) {
      error(filePath, `Utility file should end with .util.ts (e.g. Date.util.ts)`);
    }
    return;
  }

  // ── Dialogs ──
  if (topDir === "dialogs") {
    // Files in dialog subdirectories should be .dialog.tsx (unless sub-component)
    if (isInNestedComponents(filePath)) return; // sub-components are free-form
    if (segments.length > 2 && !filename.endsWith(".dialog.tsx")) {
      error(filePath, `Dialog file should end with .dialog.tsx (e.g. UserPreferences.dialog.tsx)`);
    }
    return;
  }

  // ── Components ──
  if (topDir === "components") {
    // Sub-components are free-form
    if (isInNestedComponents(filePath)) return;
    // Only .tsx files must be PascalCase (allow .ts helpers like useUploadFile.ts, createTabs.ts)
    if (filename.endsWith(".tsx")) {
      const name = filename.replace(/\.tsx$/, "");
      if (!PASCAL_CASE_RE.test(name)) {
        error(filePath, `Component .tsx file should be PascalCase (e.g. Button.tsx)`);
      }
    }
    return;
  }
}

// ─── 3. data-component attribute ────────────────────────────────────

function checkDataComponent(filePath) {
  const filename = path.basename(filePath);

  // Only check .tsx files
  if (!filename.endsWith(".tsx")) return;

  // Skip non-component files
  if (hasSecondarySuffix(filename)) return;

  // Only check known component directories
  const rel = path.relative(srcDir, filePath);
  const topDir = rel.split(path.sep)[0];
  const checkedDirs = ["components", "pages", "dialogs", "layouts"];
  if (!checkedDirs.includes(topDir)) return;

  // Skip sub-components in nested components/ directories
  if (isInNestedComponents(filePath)) return;

  // Skip files in assets/ directories
  if (isInAssetsDir(filePath)) return;

  const content = fs.readFileSync(filePath, "utf-8");

  // Skip files that don't return JSX (pure re-export files, object exports, etc.)
  if (!content.includes("<")) return;

  if (!content.includes("data-component=")) {
    error(filePath, `Missing data-component attribute on root JSX element`);
  }
}

// ─── 4. data-css in CSS files ───────────────────────────────────────

function checkDataCss(filePath) {
  const filename = path.basename(filePath);

  if (!filename.endsWith(".css")) return;

  // Only check component directories
  const rel = path.relative(srcDir, filePath);
  const topDir = rel.split(path.sep)[0];
  const checkedDirs = ["components", "pages", "dialogs", "layouts"];
  if (!checkedDirs.includes(topDir)) return;

  const content = fs.readFileSync(filePath, "utf-8");

  if (!content.includes("[data-css=")) {
    error(filePath, `CSS file should use [data-css="ComponentName"] selectors`);
  }

  // Check that data-css value matches filename
  const expectedName = filename.replace(".layout.css", "").replace(".css", "");
  const dataCssMatch = content.match(/\[data-css=["'](\w+)["']\]/);
  if (dataCssMatch && dataCssMatch[1] !== expectedName) {
    error(filePath, `data-css value "${dataCssMatch[1]}" doesn't match filename "${expectedName}"`);
  }
}

// ─── Runner ─────────────────────────────────────────────────────────

function collectFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function main() {
  // Accept file list from argv (lint-staged) or scan all src/
  let files = process.argv.slice(2);

  if (files.length === 0) {
    console.log("Checking all src/ files...\n");
    files = collectFiles(srcDir);
  }

  // Normalize and filter to src/ files only
  files = files.map((f) => path.resolve(f)).filter((f) => f.startsWith(srcDir));

  for (const filePath of files) {
    checkDirectoryNaming(filePath);
    checkFileNaming(filePath);
    checkDataComponent(filePath);
    checkDataCss(filePath);
  }

  if (errors.length > 0) {
    console.error(`\x1b[31m✖ Convention violations found (${errors.length}):\x1b[0m\n`);
    for (const err of errors) {
      console.error(`\x1b[31m${err}\x1b[0m`);
    }
    console.error("");
    process.exit(1);
  }

  console.log("\x1b[32m✔ All convention checks passed\x1b[0m");
}

main();
