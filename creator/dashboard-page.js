/* eslint-disable no-undef */
/* eslint-env node */
import fs from "fs";
import path from "path";
import { SRC, toPascalCase, toCamelCase, toKebabCase, createDir, writeFile, ask } from "./utils.js";

export async function createDashboardPage(rl) {
  const rawName = await ask(rl, "Page name: ");

  if (!rawName.trim()) {
    console.log("Name is required.");
    return;
  }

  const Name = toPascalCase(rawName);
  const camelName = toCamelCase(rawName);
  const kebabName = toKebabCase(Name);

  const dir = path.join(SRC, "pages", "dashboard", kebabName);
  createDir(dir);

  console.log(`\nCreating dashboard page: ${Name}\n`);

  // <Name>.page.tsx
  writeFile(
    path.join(dir, `${Name}.page.tsx`),
    `import "./${Name}.css";
import { ${camelName}PageLocale } from "./${Name}.page.locales";
import { useDictionary } from "@/locales";

export function ${Name}Page() {
  const text = useDictionary(${camelName}PageLocale);

  return (
    <div data-component="${Name}Page" data-css="${Name}Page" css={["padding-2xl"]}>
      <h1 css={["font-size-2xl", "text-bold", "margin-bottom-lg"]}>{text.title}</h1>
    </div>
  );
}
`,
  );

  // <Name>.page.locales.ts
  writeFile(
    path.join(dir, `${Name}.page.locales.ts`),
    `import { locales } from "@/locales";

export const ${camelName}PageLocale = locales.create({
  enUS: {
    title: "${Name}",
  },
  ptBR: {
    title: "${Name}",
  },
});
`,
  );

  // <Name>.css
  writeFile(
    path.join(dir, `${Name}.css`),
    `[data-css="${Name}Page"] {
}
`,
  );

  // Update dashboard.routes.locales.ts
  updateRoutesLocales(camelName, Name);

  // Update dashboard.routes.tsx
  updateRoutes(Name, camelName, kebabName);

  console.log(`\nDashboard page ${Name} created successfully!`);
}

function updateRoutesLocales(camelName, Name) {
  const filePath = path.join(SRC, "router", "routes", "dashboard-routes", "dashboard.routes.locales.ts");
  let content = fs.readFileSync(filePath, "utf-8");

  // Check if key already exists
  if (content.includes(`${camelName}:`)) {
    console.log(`  Skipped locales update (key "${camelName}" already exists)`);
    return;
  }

  // Add new key to ptBR
  content = content.replace(
    /ptBR:\s*\{([^}]*)}/,
    (match, inner) => `ptBR: {${inner.trimEnd()}, ${camelName}: "${Name}" }`,
  );

  // Add new key to enUS
  content = content.replace(
    /enUS:\s*\{([^}]*)}/,
    (match, inner) => `enUS: {${inner.trimEnd()}, ${camelName}: "${Name}" }`,
  );

  fs.writeFileSync(filePath, content);
  console.log(`  Updated: src/router/routes/dashboard-routes/dashboard.routes.locales.ts`);
}

function updateRoutes(Name, camelName, kebabName) {
  const filePath = path.join(SRC, "router", "routes", "dashboard-routes", "dashboard.routes.tsx");
  let content = fs.readFileSync(filePath, "utf-8");

  // Check if route already exists
  if (content.includes(`path: "${kebabName}"`)) {
    console.log(`  Skipped routes update (path "${kebabName}" already exists)`);
    return;
  }

  // Add lazy import after the last existing lazy import (lines starting with "const ... = lazy(")
  const lazyImportLine = `const ${Name}Page = lazy(() => import("@/pages/dashboard/${kebabName}/${Name}.page").then((module) => ({ default: module.${Name}Page })));`;

  const lazyImportRegex = /^const .+ = lazy\(/gm;
  let lastMatch;
  let match;
  while ((match = lazyImportRegex.exec(content)) !== null) {
    lastMatch = match;
  }

  if (lastMatch) {
    const lineEnd = content.indexOf("\n", lastMatch.index);
    content = content.slice(0, lineEnd + 1) + lazyImportLine + "\n" + content.slice(lineEnd + 1);
  } else {
    // No lazy imports yet, add after the last regular import
    const lastImportIndex = content.lastIndexOf("import ");
    const lineEnd = content.indexOf("\n", lastImportIndex);
    content = content.slice(0, lineEnd + 1) + "\n" + lazyImportLine + "\n" + content.slice(lineEnd + 1);
  }

  // Add route entry before the closing ] of DASHBOARD_ROUTES
  const newRoute = `        {
          path: "${kebabName}",
          element: (
            <RouterPageLoading>
              <${Name}Page />
            </RouterPageLoading>
          ),
          handle: {
            hide: false,
            title: dictionary.${camelName},
            icon: "file",
            fullPath: "/dashboard/${kebabName}",
            fallbackPath: "/dashboard/overview",
          },
        },`;

  content = content.replace(
    /(\s*)\] as const satisfies AppRoute\[\]/,
    `\n${newRoute}\n      ] as const satisfies AppRoute[]`,
  );

  fs.writeFileSync(filePath, content);
  console.log(`  Updated: src/router/routes/dashboard-routes/dashboard.routes.tsx`);
}
