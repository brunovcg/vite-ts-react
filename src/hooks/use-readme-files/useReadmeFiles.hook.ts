interface ReadmeFile {
  name: string;
  path: string;
  content: string;
}

export function useReadmeFiles(): ReadmeFile[] {
  const modules = import.meta.glob<string>(["/docs/**/*.readme.md", "/scripts/**/*.readme.md", "/*.md"], {
    query: "?raw",
    eager: true,
  });

  const readmes: ReadmeFile[] = [];

  for (const [path, content] of Object.entries(modules)) {
    const fileName = path.split("/").pop() || "";
    const name = fileName
      .replace(".readme.md", "")
      .replace(".md", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    readmes.push({
      name,
      path,
      content: typeof content === "string" ? content : (content as { default: string }).default || "",
    });
  }

  return readmes.sort((a, b) => a.name.localeCompare(b.name));
}
