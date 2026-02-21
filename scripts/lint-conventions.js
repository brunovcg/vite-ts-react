/* eslint-disable no-undef */
/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "../src");

// ─── Helpers ────────────────────────────────────────────────────────

// Allowed primary type suffixes (e.g. Button.component.tsx, Header.layout.tsx)
const TYPES = ["component", "layout", "page", "context", "dialog", "controller", "routes"];

// Allowed secondary variations (appended after a type or used standalone)
const VARIATIONS = [
  ".ts",
  ".tsx",
  ".css",
  ".doc.tsx",
  ".locales.ts",
  ".types.ts",
  ".utils.ts",
  ".test.ts",
  ".test.tsx",
  ".provider.tsx",
  ".register.ts",
];

// Generate all valid secondary suffixes: standalone variations + type×variation combos
const SECONDARY_SUFFIXES = [
  ...VARIATIONS,
  ...TYPES.flatMap((type) => VARIATIONS.map((v) => `.${type}${v}`)),
];

const KEBAB_CASE_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

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
  const checkedDirs = ["components", "pages", "hooks", "utils", "layouts", "dialogs", "context", "overlays"];
  if (!checkedDirs.includes(topDir)) return;

  // Skip non-source files (SVGs, images, etc.)
  if (!isSourceFile(filename) && !filename.endsWith(".css")) return;

  // Skip CSS files (validated by data-css check + component suffix check)
  if (filename.endsWith(".css")) return;

  // Skip files with recognized secondary suffixes
  if (hasSecondarySuffix(filename)) return;

  // Skip index files
  if (filename === "index.ts" || filename === "index.tsx") return;

  // Skip files inside assets/ directories
  if (isInAssetsDir(filePath)) return;

  // ── Pages ──
  if (topDir === "pages") {
    if (isInNestedComponents(filePath)) return;
    if (!filename.endsWith(".page.tsx")) {
      error(filePath, `Page file should end with .page.tsx (e.g. Login.page.tsx)`);
    }
    return;
  }

  // ── Layouts ──
  if (topDir === "layouts") {
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
    if (isInNestedComponents(filePath)) return;
    if (segments.length > 2 && !filename.endsWith(".dialog.tsx")) {
      error(filePath, `Dialog file should end with .dialog.tsx (e.g. UserPreferences.dialog.tsx)`);
    }
    return;
  }

  // ── Context ──
  if (topDir === "context") {
    // Allow hooks (useSession.ts)
    if (filename.match(/^use[A-Z]/)) return;
    // Main context files should end with .context.tsx
    if (filename.endsWith(".tsx") && !filename.endsWith(".context.tsx")) {
      error(filePath, `Context file should end with .context.tsx (e.g. Session.context.tsx)`);
    }
    return;
  }

  // ── Components ──
  if (topDir === "components") {
    if (isInNestedComponents(filePath)) return;

    // Skip hooks (useXxx.ts) and helper .ts files (camelCase like createTabs.ts)
    if (filename.match(/^use[A-Z]/)) return;
    if (filename.match(/^[a-z]/) && filename.endsWith(".ts")) return;

    // .tsx component files must have .component.tsx suffix
    if (filename.endsWith(".tsx")) {
      if (!filename.endsWith(".component.tsx")) {
        error(filePath, `Component file should end with .component.tsx (e.g. Button.component.tsx)`);
      }
      return;
    }

    // .ts files (non-helper, non-hook) — no strict rule, just allow PascalCase
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
  const checkedDirs = ["components", "pages", "dialogs", "layouts", "overlays"];
  if (!checkedDirs.includes(topDir)) return;

  // Skip sub-components in nested components/ directories
  if (isInNestedComponents(filePath)) return;

  // Skip files in assets/ directories
  if (isInAssetsDir(filePath)) return;

  const content = fs.readFileSync(filePath, "utf-8");

  // Skip files that don't return JSX (pure re-export files, object exports, etc.)
  if (!content.includes("<")) return;

  // Skip components that return createPortal directly
  if (content.includes("createPortal(")) return;

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
  const checkedDirs = ["components", "pages", "dialogs", "layouts", "overlays"];
  if (!checkedDirs.includes(topDir)) return;

  const content = fs.readFileSync(filePath, "utf-8");

  if (!content.includes("[data-css=")) {
    error(filePath, `CSS file should use [data-css="ComponentName"] selectors`);
  }

  // Check that data-css value matches the component name from filename
  // Button.component.css → expect data-css="Button"
  const expectedName = filename.replace(".component.css", "").replace(".layout.css", "").replace(".css", "");
  const dataCssMatch = content.match(/\[data-css=["'](\w+)["']\]/);
  if (dataCssMatch && dataCssMatch[1] !== expectedName) {
    error(filePath, `data-css value "${dataCssMatch[1]}" doesn't match expected "${expectedName}"`);
  }
}

// ─── 4b. data-css attribute on TSX files (only when CSS exists) ─────

function checkDataCssAttribute(filePath) {
  const filename = path.basename(filePath);

  // Only check .tsx files
  if (!filename.endsWith(".tsx")) return;

  // Skip non-component files
  if (hasSecondarySuffix(filename)) return;

  // Only check known component directories
  const rel = path.relative(srcDir, filePath);
  const topDir = rel.split(path.sep)[0];
  const checkedDirs = ["components", "pages", "dialogs", "layouts", "overlays"];
  if (!checkedDirs.includes(topDir)) return;

  // Skip sub-components in nested components/ directories
  if (isInNestedComponents(filePath)) return;

  // Skip files in assets/ directories
  if (isInAssetsDir(filePath)) return;

  // Check if there's a CSS file in the same directory
  const dir = path.dirname(filePath);
  const dirEntries = fs.readdirSync(dir);
  const hasCssFile = dirEntries.some((entry) => entry.endsWith(".css"));

  if (!hasCssFile) return;

  const content = fs.readFileSync(filePath, "utf-8");

  // Skip files that don't return JSX
  if (!content.includes("<")) return;

  if (!content.includes("data-css=")) {
    error(filePath, `Missing data-css attribute (CSS file exists in folder)`);
  }
}

// ─── 5. Component CSS file naming ───────────────────────────────────

function checkComponentCssNaming(filePath) {
  const filename = path.basename(filePath);

  if (!filename.endsWith(".css")) return;

  const rel = path.relative(srcDir, filePath);
  const topDir = rel.split(path.sep)[0];

  // Only check CSS files in components/ directory
  if (topDir !== "components") return;

  if (!filename.endsWith(".component.css")) {
    error(filePath, `Component CSS file should end with .component.css (e.g. Button.component.css)`);
  }
}

// ─── 6. Restricted imports ───────────────────────────────────────────

function checkRestrictedImports(filePath) {
  const filename = path.basename(filePath);

  if (!isSourceFile(filename)) return;

  // Allow the file where useTypedNavigate wraps useNavigate
  const rel = path.relative(srcDir, filePath);
  if (rel === path.join("router", "Router.utils.ts")) return;

  const content = fs.readFileSync(filePath, "utf-8");

  if (content.match(/\buseNavigate\b/)) {
    error(filePath, `Use useTypedNavigate instead of useNavigate (import from "@/router/Router.utils")`);
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
    checkDataCssAttribute(filePath);
    checkComponentCssNaming(filePath);
    checkRestrictedImports(filePath);
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
