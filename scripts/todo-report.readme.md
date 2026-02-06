# TODO Report Generator

This script scans the project for TODO comments and generates a report.

## Usage

Run the following command to generate a TODO report:

```bash
npm run todo:report
```

## What It Does

1. **Scans Files**: Recursively scans all files in the `src` directory with the following extensions:
   - `.ts` (TypeScript)
   - `.tsx` (TypeScript React)
   - `.js` (JavaScript)
   - `.jsx` (JavaScript React)
   - `.css` (CSS)
   - `.html` (HTML)

2. **Finds TODO Comments**: Identifies comments that start with `TODO` in various formats:
   - `// TODO: description`
   - `/* TODO: description */`
   - `<!-- TODO: description -->` (for HTML)

3. **Generates Report**: Creates a markdown file at `.reports/todo-report.md` with:
   - Timestamp when the report was generated
   - Total count of TODOs found
   - List of all TODOs in the format: `file_path:line_number => comment`

## Output Format

The report lists each TODO in the following format:

```
src/path/to/file.ts:42 => TODO: Fix this bug
src/path/to/component.tsx:120 => TODO: Add error handling
```

## Excluded Directories

The script automatically excludes the following directories from scanning:

- `node_modules`
- `.git`
- `dist`
- `.reports`

## Report Location

The generated report is saved to:

```
.reports/todo-report.md
```
