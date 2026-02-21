/* eslint-disable no-undef */
/* eslint-env node */
import path from "path";
import { SRC, toPascalCase, toCamelCase, toKebabCase, createDir, writeFile, ask } from "./utils.js";

export async function createComponent(rl) {
  const rawName = await ask(rl, "Component name: ");

  if (!rawName.trim()) {
    console.log("Name is required.");
    return;
  }

  const Name = toPascalCase(rawName);
  const camelName = toCamelCase(rawName);
  const kebabName = toKebabCase(Name);

  const dir = path.join(SRC, "components", kebabName);
  createDir(dir);

  console.log(`\nCreating component: ${Name}\n`);

  // <Name>.tsx
  writeFile(
    path.join(dir, `${Name}.tsx`),
    `import "./${Name}.css";
import { ${camelName}Locale } from "./${Name}.locales";
import { useDictionary } from "@/locales";

export function ${Name}() {
  const text = useDictionary(${camelName}Locale);

  return <div data-component="${Name}" data-css="${Name}"></div>;
}
`,
  );

  // <Name>.locales.ts
  writeFile(
    path.join(dir, `${Name}.locales.ts`),
    `import { locales } from "@/locales";

export const ${camelName}Locale = locales.create({
  enUS: {},
  ptBR: {},
});
`,
  );

  // <Name>.css
  writeFile(
    path.join(dir, `${Name}.css`),
    `[data-css="${Name}"] {
}
`,
  );

  // <Name>.doc.tsx
  writeFile(
    path.join(dir, `${Name}.doc.tsx`),
    `import { ${Name} } from "./${Name}";
import type { ComponentDoc } from "@/types/component-doc.types";

export const ${camelName}Doc: ComponentDoc<React.ComponentProps<typeof ${Name}>> = {
  id: "${kebabName}",
  name: "${Name}",
  description: "",
  component: ${Name},
  args: {},
  argTypes: {},
};
`,
  );

  console.log(`\nComponent ${Name} created successfully!`);
}
