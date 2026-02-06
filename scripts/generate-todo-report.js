/* eslint-disable no-undef */
/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "../src");
const rootDir = path.resolve(__dirname, "..");
const reportsDir = path.resolve(__dirname, "../.reports");
const outputFile = path.resolve(reportsDir, "todo-report.md");

const targetExtensions = [".ts", ".tsx", ".js", ".jsx", ".css", ".html"];

const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      if (
        file === "node_modules" ||
        file === ".git" ||
        file === "dist" ||
        file === ".reports"
      ) {
        return;
      }
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      if (targetExtensions.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
};

const extractTodos = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const todos = [];
  const relativePath = path.relative(rootDir, filePath);

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (
      /\/\/\s*TODO/i.test(trimmedLine) ||
      /\/\*\s*TODO/i.test(trimmedLine) ||
      /<!--\s*TODO/i.test(trimmedLine)
    ) {
      let todoComment = "";

      if (/\/\/\s*TODO/i.test(trimmedLine)) {
        const match = trimmedLine.match(/\/\/\s*(TODO.*)/i);
        todoComment = match ? match[1] : "";
      } else if (/\/\*\s*TODO/i.test(trimmedLine)) {
        const match = trimmedLine.match(/\/\*\s*(TODO.*?)\s*\*\//i);
        if (match) {
          todoComment = match[1];
        } else {
          todoComment = trimmedLine.replace(/\/\*\s*/i, "").replace(/\s*\*\//i, "");
        }
      } else if (/<!--\s*TODO/i.test(trimmedLine)) {
        const match = trimmedLine.match(/<!--\s*(TODO.*?)\s*-->/i);
        if (match) {
          todoComment = match[1];
        } else {
          todoComment = trimmedLine.replace(/<!--\s*/i, "").replace(/\s*-->/i, "");
        }
      }

      if (todoComment) {
        todos.push({
          file: relativePath,
          line: index + 1,
          comment: todoComment,
        });
      }
    }
  });

  return todos;
};

const main = () => {
  const colors = {
    reset: "\x1b[0m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
  };

  console.log(`${colors.cyan}Scanning for TODO comments...${colors.reset}`);

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const allFiles = getAllFiles(srcDir);
  const allTodos = [];

  allFiles.forEach((file) => {
    const todos = extractTodos(file);
    allTodos.push(...todos);
  });

  if (allTodos.length === 0) {
    console.log(`${colors.green}No TODOs found!${colors.reset}`);
    const reportContent = `# TODO Report\n\nGenerated: ${new Date().toISOString()}\n\n**No TODOs found in the project.**\n`;
    fs.writeFileSync(outputFile, reportContent);
    console.log(`${colors.cyan}Report saved to ${outputFile}${colors.reset}`);
    return;
  }

  let reportContent = `# TODO Report\n\nGenerated: ${new Date().toISOString()}\n\nTotal TODOs found: ${allTodos.length}\n\n---\n\n`;

  allTodos.forEach((todo) => {
    const absolutePath = path.join(rootDir, todo.file);
    const fileLink = `[${todo.file}:${todo.line}](file://${absolutePath})`;
    reportContent += `${fileLink} => ${todo.comment}\n`;
  });

  fs.writeFileSync(outputFile, reportContent);
  console.log(`${colors.yellow}⚠️  Warning: Found ${allTodos.length} TODO(s) in the codebase${colors.reset}`);
  console.log(`${colors.cyan}Report saved to ${outputFile}${colors.reset}`);
};

main();
