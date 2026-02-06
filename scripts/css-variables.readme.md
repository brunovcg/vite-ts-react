# CSS Variables Generator

This script automatically generates a TypeScript file (`src/runtime/cssVariables.ts`) from CSS custom properties (variables) defined in `src/styles/config/variables.css`.

## How It Works

The script parses CSS variables following this naming convention:

```css
--<key_name>-<value_name>: <value>;
```

And generates a nested TypeScript object structure:

```typescript
CSS_VARIABLES = {
  <key_name>: {
    <value_name>: "<value>"
  }
}
```

### Example

**Input (`variables.css`):**

```css
:root {
  --color-primary: #038fc6;
  --color-primary_light: #e5f7ff;
  --background-dark: #afafaf;
  --background-light: #d3d3d3;
}
```

**Output (`cssVariables.ts`):**

```typescript
export const CSS_VARIABLES = {
  color: {
    primary: "#038fc6",
    primary_light: "#e5f7ff",
  },
  background: {
    dark: "#afafaf",
    light: "#d3d3d3",
  },
} as const;
```

## Automatic Updates

The generated file is automatically updated in three scenarios:

### 1. Manual Script Execution

```bash
npm run register:variables
```

### 2. During Git Commits

When you commit changes to `src/styles/config/variables.css`, the `lint-staged` hook will automatically run the script.

### 3. During Development (Hot Reload)

When running `npm run dev`, the Vite plugin `watchConfigVariables` watches for changes to `variables.css` and automatically regenerates the TypeScript file.

## Usage in Code

```typescript
import { CSS_VARIABLES } from "@/runtime/cssVariables";

const primaryColor = CSS_VARIABLES.color.primary; // "#038fc6"
const darkBackground = CSS_VARIABLES.background.dark; // "#afafaf"
```

## Files

- **Script**: `scripts/generate-css-variables.js`
- **Source**: `src/styles/config/variables.css`
- **Generated**: `src/runtime/cssVariables.ts`
- **Vite Plugin**: `vite.config.ts` (watchConfigVariables)
- **Package Script**: `package.json` (register:variables)
