import type { ComponentDoc } from "@/types/component-doc.types";

export function useComponentDocs() {
  // Eagerly load all .doc.tsx files
  const modules = import.meta.glob<Record<string, ComponentDoc>>("/src/components/**/*.doc.tsx", { eager: true });

  const docs = Object.values(modules).map((mod) => {
    // Assuming the doc is the default export or a named export matching the file pattern
    // based on our example `export const buttonDoc`, we need to find the export that matches the type.
    // For simplicity, let's assume the user exports exactly one const that matches the signature or we look for specific naming convention.
    // In our example: export const buttonDoc
    const doc = Object.values(mod).find((exportItem) => exportItem && typeof exportItem === "object" && "component" in exportItem && "name" in exportItem) as ComponentDoc;
    return doc;
  });

  return docs.filter(Boolean);
}
