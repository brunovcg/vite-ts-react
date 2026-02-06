# CSS Class Register System

This system automatically generates TypeScript types from all CSS classes in the design system, ensuring type-safe styling throughout the application.

## How It Works

The CSS Register scans all CSS files in `src/styles/design/` and extracts class names to create a type-safe registry.

### Pipeline

```
CSS Files (src/styles/design/)
         ↓
Extract class names (.className patterns)
         ↓
Generate TypeScript registry (src/runtime/cssRegister.ts)
         ↓
Export type-safe union (CssClass type)
         ↓
Use with autocomplete & type checking
```

## Example

### Input (colors.css)

```css
.color-primary {
  color: var(--color-primary);
}

.color-error {
  color: var(--color-error);
}

.background-primary {
  background-color: var(--color-primary);
}
```

### Output (cssRegister.ts)

```typescript
export const CSS_REGISTER = {
  colors: ['color-primary', 'color-error', 'background-primary'],
  // ... other categories
} as const satisfies Record<string, string[]>;

export type CssClass =
  | 'color-primary'
  | 'color-error'
  | 'background-primary'
  | ... // 330+ more classes
```

### Usage

```typescript
// ✅ Type-safe
<div css={["color-primary", "background-light"]} />

// ❌ Compile error
<div css={["color-primaryyyy"]} />
//          ^^^^^^^^^^^^^^^^ Type error
```

## Automatic Updates

The register updates automatically in three scenarios:

### 1. Development (HMR)

When you edit CSS files in `src/styles/design/`, the Vite plugin `watchDesignStyles` detects changes and regenerates the register.

```bash
# Edit src/styles/design/colors.css
# → Vite HMR triggers
# → generate-css-register.js runs
# → cssRegister.ts updates
# → Types refresh in IDE
```

### 2. Git Commit

The `lint-staged` hook regenerates the register before committing changes to design CSS files.

```bash
git add src/styles/design/colors.css
git commit -m "Add new color"
# → Husky runs lint-staged
# → generate-css-register.js executes
# → Updated cssRegister.ts is staged
# → Commit includes updated types
```

### 3. Manual Trigger

```bash
npm run register:styles
```

## Files

| File                               | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| `src/styles/design/*.css`          | Source CSS files with class definitions |
| `scripts/generate-css-register.js` | Extraction script (regex-based parser)  |
| `src/runtime/cssRegister.ts`       | Auto-generated TypeScript registry      |
| `src/runtime/css.types.ts`         | Type definitions for `Css` prop         |
| `vite.config.ts`                   | Vite plugin for HMR integration         |

## Extraction Algorithm

The script uses a simple regex to extract class names:

```javascript
const classRegex = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;

while ((match = classRegex.exec(content)) !== null) {
  classes.add(match[1]); // Captures "className" from ".className"
}
```

### Supported Patterns

```css
/* ✅ Extracted */
.simple-class {
}
.kebab-case-name {
}
._private-class {
}
.MixedCase123 {
}

/* ❌ Not extracted */
div.qualified {
} /* Element qualifier */
.class1.class2 {
} /* Multiple classes */
[class="dynamic"] {
} /* Attribute selector */
```

## Integration with JSX Runtime

The CSS Register powers the custom `css` prop:

```typescript
// src/runtime/jsx-runtime.tsx
export function jsx(type: any, props: any, key: any) {
  const { css, className, ...rest } = props;

  // cssReducer validates against CSS_REGISTER types
  const newClassName = cssReducer(className, css);

  return _jsx(type, { ...rest, className: newClassName }, key);
}
```

## Benefits

### Type Safety

- **Autocomplete**: IDE suggests all available classes
- **Error Prevention**: Typos caught at compile time
- **Refactoring**: Rename detection across codebase
- **Dead Code**: Unused classes highlighted

### Developer Experience

- **Fast Feedback**: Instant type checking
- **No Documentation**: Types are the documentation
- **Consistency**: Enforced design system usage
- **Confidence**: Safe refactoring

### Performance

- **Zero Runtime**: Types erased at build time
- **No Overhead**: Transforms to regular `className`
- **Tree Shaking**: Unused CSS can be detected

## Current Stats

The register currently contains:

- **330+ CSS classes**
- **10+ categories** (colors, spacing, typography, etc.)
- **100% type coverage** - no `any` types allowed

## Adding New Classes

1. Create or edit a CSS file in `src/styles/design/`:

```css
/* src/styles/design/my-styles.css */
.my-new-class {
  /* styles */
}
```

2. Save the file (HMR runs automatically in dev)

3. Use with full type safety:

```tsx
<div css={["my-new-class"]} />
```

That's it! The system handles the rest.

## Troubleshooting

### Classes not appearing?

- Check file is in `src/styles/design/`
- Verify class name matches regex pattern
- Run `npm run register:styles` manually
- Check terminal for generation errors

### Type errors after adding class?

- Wait for TypeScript server to refresh
- Restart TypeScript server (VS Code: `Cmd+Shift+P` → "Restart TS Server")
- Check `cssRegister.ts` was regenerated

### HMR not working?

- Verify Vite dev server is running
- Check `vite.config.ts` has `watchDesignStyles` plugin
- Look for errors in Vite console

---

**Related Documentation:**

- [CSS Variables System](./css-variables.readme.md)
- [Custom JSX Runtime](../docs/ARCHITECTURE.md#custom-jsx-runtime)
- [Type-Safe CSS](../docs/ARCHITECTURE.md#type-safe-css-system)
