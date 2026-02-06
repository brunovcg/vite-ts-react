# Vida Frontend

> A **production-grade React application** featuring a custom JSX runtime, type-safe CSS system, and zero-dependency architecture.

[TypeScript](https://www.typescriptlang.org/)
[React](https://reactjs.org/)
[Vite](https://vitejs.dev/)

> **📚 [View Full Documentation →](./docs/INDEX.md)**

## 🌟 What Makes This Project Special

This isn't just another React app. It features **custom-built infrastructure** that rivals enterprise-level frameworks:

### 🎨 **Custom JSX Runtime with Type-Safe CSS**

- Custom JSX transformation intercepts all React elements
- Type-safe CSS classes auto-generated from design tokens
- Zero runtime overhead with compile-time validation
- [Learn more →](#custom-jsx-runtime)

### 🎭 **Custom Storybook Alternative**

- Built-in component documentation system
- Auto-discovery via Vite's `import.meta.glob`
- Interactive playground with live code generation
- Zero external dependencies (no 2MB Storybook bundle)
- [Learn more →](#design-system--documentation)

### 🌐 **Custom Internationalization**

- No i18n libraries - built from scratch
- Template string interpolation
- React 19 `useSyncExternalStore` integration
- [Learn more →](#internationalization-i18n)

### 🏗️ **Zero-Dependency Philosophy**

- No Tailwind, no Storybook, no i18n libraries
- Every core feature implemented in-house
- Full control over the codebase
- Minimal production bundle size

---

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Core Innovations](#core-innovations)
  - [Custom JSX Runtime](#custom-jsx-runtime)
  - [Type-Safe CSS System](#type-safe-css-system)
  - [Design System & Documentation](#design-system--documentation)
  - [URL-Driven State Management](#url-driven-state-management)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Build-Time Code Generation](#build-time-code-generation)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [Quality Control](#quality-control)
- [AI Agent Rules](#ai-agent-rules)
- [Advanced Documentation](#advanced-documentation)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (Latest LTS recommended)
- **npm** 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vida-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173` (or the next available port).

### Available Scripts

```bash
npm run dev              # Start dev server with HMR
npm run build            # Production build
npm run build:analyze    # Build with bundle analysis
npm run preview          # Preview production build
npm run typecheck        # Type checking without emit
npm run lint             # ESLint code checking
npm run format           # Format code with Prettier
npm run cloc             # Generate code statistics
```

---

## 🔥 Core Innovations

### 🎨 Custom JSX Runtime

**We've extended React's JSX transformation** to add a custom `css` prop to all intrinsic elements.

#### How It Works

```typescript
// Instead of className strings:
<div className="display-flex flex-center gap-md background-primary" />

// Use type-safe CSS arrays:
<div css={["display-flex", "flex-center", "gap-md", "background-primary"]} />

// Or conditional CSS objects:
<div css={[
  "display-flex",
  { "background-primary": isActive, "background-error": hasError }
]} />
```

#### Implementation

Our custom runtime (`src/runtime/jsx-runtime.tsx`) intercepts JSX transformation:

```typescript
// tsconfig.json
{
  "jsxImportSource": "@/runtime"  // Points to our custom runtime
}

// vite.config.ts
react({ jsxImportSource: "@/runtime" })
```

**Benefits:**

- ✅ Autocomplete for all CSS classes
- ✅ Compile-time validation (typos = TypeScript errors)
- ✅ No runtime overhead (transforms to className)
- ✅ Works with both DOM elements and React components

---

### 🎯 Type-Safe CSS System

**Every CSS class is auto-generated and type-checked.**

#### Architecture

```
src/styles/design/
  ├── colors.css         → Auto-scanned
  ├── spacing.css        → Auto-scanned
  ├── typography.css     → Auto-scanned
  └── ...
         ↓
scripts/generate-css-register.js  ← Runs on file change
         ↓
src/runtime/cssRegister.ts  ← Auto-generated TypeScript
         ↓
Type: CssClass = "color-primary" | "padding-md" | ...
```

#### Type Safety

```typescript
// This works ✅
<div css={["color-primary", "padding-md"]} />

// This fails at compile time ❌
<div css={["color-primaryyyy", "padding-md"]} />
//          ^^^^^^^^^^^^^^^^ Type error: not in CssClass union
```

#### Auto-Updates

The system watches for CSS changes and regenerates types automatically:

1. **During development** - Vite HMR regenerates on CSS file save
2. **On git commit** - lint-staged hook regenerates before commit
3. **Manual trigger** - `npm run register:styles`

**📖 [Full CSS Documentation →](./scripts/README-CSS-VARIABLES.md)**

---

### 📖 Design System & Documentation

**A complete Storybook alternative built in-house.**

#### Features

- 🔍 **Auto-discovery** - Just create a `.doc.tsx` file
- 🎮 **Interactive playground** - Live component preview
- 📝 **Code generation** - Auto-generates JSX snippets
- 🎨 **Style browser** - All design tokens in one place
- 🔎 **Search** - Find components instantly
- 📱 **Responsive** - Works on all screen sizes

#### Usage

Visit `/design-system` in development mode to access:

**Components Tab:**

- Searchable component list
- Live preview with editable props
- Auto-generated code examples

**Styles Tab:**

- Icon catalog (117+ SVG icons)
- Color palette
- Typography specimens
- Spacing scale
- Animation previews

#### Creating Documentation

```typescript
// src/components/button/Button.doc.tsx
import { Button, type ButtonProps } from "./Button";
import type { ComponentDoc } from "@/types/component-doc.types";

export const buttonDoc: ComponentDoc<ButtonProps> = {
  id: "button",
  name: "Button",
  description: "A versatile button component",
  component: Button,
  args: {
    children: "Click Me",
    variant: "filled",
    color: "primary",
  },
  argTypes: {
    variant: {
      type: "select",
      options: ["regular", "filled", "outlined"],
    },
    color: {
      type: "select",
      options: ["primary", "error"],
    },
  },
};
```

That's it! The component automatically appears in the design system.

**Comparison to Storybook:**

| Feature      | Storybook     | Our System     |
| ------------ | ------------- | -------------- |
| Bundle Size  | ~2MB          | 0KB (dev-only) |
| Setup        | Complex       | Zero config    |
| Dependencies | 100+ packages | **0**          |
| Type Safety  | Weak          | Strong         |
| Integration  | External      | Native         |

---

### 🔗 URL-Driven State Management

**Dialog and component state synced to URL for deep linking.**

#### Dialog System

Dialogs automatically sync to `?dialog=id:prop1=val1&prop2=val2`:

```typescript
// Open a dialog
dialogController.open("editUser", {
  props: { userId: 123 },
});

// URL becomes: ?dialog=editUser:userId=123
// Shareable link! Refresh-safe!
```

**Features:**

- ✅ **Deep linking** - Share exact app state
- ✅ **Browser back/forward** - Navigates through dialog history
- ✅ **Refresh-safe** - State preserved on reload
- ✅ **Type-safe** - Full TypeScript support

#### Implementation

```typescript
// src/dialogs/Dialog.controller.ts
class DialogController {
  open<T>(id: DialogId, options: { props: T }) {
    // Update in-memory state
    this.openedDialogs.push({ id, ...options });

    // Sync to URL
    this.syncUrl();

    // Notify subscribers
    this.notify();
  }
}
```

**Similar pattern used for:**

- Tabs (`?tab=components`)
- Filters (`?status=active&sort=date`)
- Search (`?q=button`)

---

### 🌐 Internationalization (i18n)

**Custom-built i18n with zero dependencies.**

#### Features

- 🌍 Multi-language support
- 📝 Template string interpolation
- 🔄 Format transformations (capitalize, uppercase, etc.)
- ⚡ React 19 `useSyncExternalStore` integration

#### Usage

```typescript
// Define translations
const locale = {
  enUS: {
    welcome: "Welcome, {{name}}!",
    itemCount: "You have {{count}} items",
  },
  ptBR: {
    welcome: "Bem-vindo, {{name}}!",
    itemCount: "Você tem {{count}} itens",
  },
};

// Use in components
function MyComponent() {
  const text = useText(locale);

  return <h1>{text("welcome", { templates: { name: "Bruno" } })}</h1>;
  // → "Welcome, Bruno!" or "Bem-vindo, Bruno!"
}
```

#### Format Transformations

```typescript
text("title", { format: "uppercase" }); // → "WELCOME, BRUNO!"
text("title", { format: "capitalize" }); // → "Welcome, bruno!"
text("title", { format: "title" }); // → "Welcome, Bruno!"
```

---

### ⚙️ Build-Time Code Generation

**Multiple code generation systems ensure type safety.**

#### 1. CSS Class Registry

Extracts all CSS classes and generates TypeScript types:

```bash
npm run register:styles
```

```typescript
// Auto-generated src/runtime/cssRegister.ts
export const CSS_REGISTER = {
  colors: ['color-primary', 'color-error', ...],
  spacing: ['padding-md', 'margin-lg', ...],
  // ... 330+ classes
} as const satisfies Record<string, string[]>;
```

#### 2. CSS Variables

Converts CSS custom properties to TypeScript:

```bash
npm run register:variables
```

```css
/* src/styles/config/variables.css */
:root {
  --color-primary: #038fc6;
  --spacing-md: 16px;
}
```

```typescript
// Auto-generated src/runtime/cssVariables.ts
export const CSS_VARIABLES = {
  color: {
    primary: "#038fc6",
  },
  spacing: {
    md: "16px",
  },
} as const;
```

**📖 [CSS Variables Guide →](./scripts/README-CSS-VARIABLES.md)**

#### 3. Component Documentation

Auto-discovers `.doc.tsx` files via Vite:

```typescript
// src/hooks/use-component-docs/useComponentDocs.hook.ts
export function useComponentDocs() {
  const modules = import.meta.glob<Record<string, ComponentDoc>>("/src/components/**/*.doc.tsx", { eager: true });
  // Returns all component documentation
}
```

---

## 📁 Project Structure

```
vida-frontend/
├── .agent/                    # AI agent configuration
│   ├── rules/                 # Code generation rules
│   └── workflows/             # Development workflows
├── scripts/                   # Build-time code generation
│   ├── generate-css-register.js
│   ├── generate-css-variables.js
│   └── README-CSS-VARIABLES.md
├── src/
│   ├── api/                   # API layer
│   ├── components/            # UI components (21 components)
│   │   └── button/
│   │       ├── Button.tsx
│   │       ├── Button.css
│   │       ├── Button.doc.tsx         # Auto-discovered
│   │       └── Button.locales.ts
│   ├── dialogs/               # Centralized dialog system
│   │   ├── Dialog.controller.ts       # URL-synced state
│   │   ├── Dialog.provider.tsx
│   │   └── dialog.register.ts
│   ├── hooks/                 # Custom React hooks
│   │   └── use-component-docs/        # Auto-discovery system
│   ├── layouts/               # Layout components
│   ├── locales/               # Custom i18n system
│   │   ├── Locales.ts                 # Core i18n logic
│   │   ├── LocaleProvider.tsx
│   │   └── locales.hooks.tsx
│   ├── pages/                 # Route pages
│   │   └── design-system/             # Documentation UI
│   ├── proto/                 # JavaScript prototype extensions
│   │   └── proto.ts                   # Array.prototype.filterMap
│   ├── router/                # Routing configuration
│   ├── runtime/               # 🔥 Custom JSX runtime
│   │   ├── jsx-runtime.tsx            # Custom JSX transform
│   │   ├── cssReducer.ts              # CSS prop handler
│   │   ├── css.types.ts               # Type definitions
│   │   ├── cssRegister.ts             # Auto-generated
│   │   └── cssVariables.ts            # Auto-generated
│   ├── styles/                # Design system
│   │   ├── config/
│   │   │   └── variables.css          # CSS custom properties
│   │   └── design/                    # Atomic CSS modules
│   │       ├── colors.css
│   │       ├── spacing.css
│   │       ├── typography.css
│   │       └── ...
│   ├── types/                 # TypeScript definitions
│   │   ├── component-doc.types.ts
│   │   └── global.d.ts
│   └── utils/                 # Shared utilities
│       ├── http-client/
│       ├── class-names/
│       └── url/
├── vite.config.ts             # Vite with custom plugins
├── tsconfig.json              # TypeScript configuration
└── package.json
```

### Key Directories Explained

| Directory      | Purpose                                                   |
| -------------- | --------------------------------------------------------- |
| `src/runtime/` | **Custom JSX runtime** - Extends React with type-safe CSS |
| `src/dialogs/` | **URL-driven dialogs** - Deep linkable modal system       |
| `src/locales/` | **Custom i18n** - Zero-dependency internationalization    |
| `src/proto/`   | **JS extensions** - Safe prototype augmentation           |
| `scripts/`     | **Code generation** - Build-time type extraction          |
| `.agent/`      | **AI rules** - Enforces code quality standards            |

---

## 🛠️ Development Guide

### Adding a New Component

1. **Create component file:**

```typescript
// src/components/my-component/MyComponent.tsx
export function MyComponent({ variant }: { variant: "small" | "large" }) {
  return <div css={["padding-md", "background-primary"]}>Hello</div>;
}
```

2. **Add CSS (optional):**

```css
/* src/components/my-component/MyComponent.css */
[data-component="MyComponent"] {
  /* Component-specific styles */
}
```

3. **Create documentation:**

```typescript
// src/components/my-component/MyComponent.doc.tsx
import type { ComponentDoc } from "@/types/component-doc.types";

export const myComponentDoc: ComponentDoc = {
  id: "my-component",
  name: "MyComponent",
  component: MyComponent,
  args: { variant: "small" },
  argTypes: {
    variant: { type: "select", options: ["small", "large"] },
  },
};
```

✅ Component automatically appears in `/design-system`!

### Adding Design Tokens

1. **Edit CSS file:**

```css
/* src/styles/design/colors.css */
.color-brand-new {
  color: var(--color-brand-new);
}
```

2. **Types auto-generate:**

The `watchDesignStyles` Vite plugin detects changes and regenerates `cssRegister.ts`.

3. **Use with autocomplete:**

```typescript
<div css={["color-brand-new"]} />  // ✅ Type-safe!
```

### Working with Dialogs

```typescript
// 1. Create dialog component
function EditUserDialog({ userId }: { userId: number }) {
  return <div>Editing user {userId}</div>;
}

// 2. Register dialog
// src/dialogs/dialog.register.ts
export const DIALOG_COMPONENTS = {
  editUser: EditUserDialog,
} as const;

// 3. Open programmatically
dialogController.open("editUser", { props: { userId: 123 } });

// 4. URL updates automatically
// → ?dialog=editUser:userId=123
```

---

## 🛡️ Quality Control

### Automated Checks

Every commit triggers:

1. ✅ **Type checking** (`tsc --noEmit`)
2. ✅ **Linting** (ESLint with auto-fix)
3. ✅ **Formatting** (Prettier)
4. ✅ **CSS regeneration** (if design files changed)

### Manual Commands

```bash
npm run typecheck        # Type check without build
npm run lint             # ESLint check
npm run format           # Format all files
npm run format:check     # Check formatting (CI)
```

### Pre-commit Hooks (Husky)

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,html,css}": ["prettier --write"],
    "src/styles/design/*.css": ["npm run register:styles"],
    "src/styles/config/variables.css": ["npm run register:variables"]
  }
}
```

---

## 🤖 AI Agent Rules

This project enforces **strict quality standards** for AI-generated code:

### Core Rules

| Rule                    | Description                        |
| ----------------------- | ---------------------------------- |
| **No `any` types**      | All code must be strictly typed    |
| **No console logs**     | Use proper error handling          |
| **No third-party libs** | Build features in-house            |
| **Function components** | No class components                |
| **Raw CSS only**        | No Tailwind or CSS-in-JS libraries |
| **No comments**         | Code must be self-documenting      |

### Implementation

Rules are defined in `.agent/rules/*.md` and enforced by:

- TypeScript compiler
- ESLint
- Pre-commit hooks
- AI agent (Antigravity)

**Why these rules?**

- **Full control** over dependencies
- **Type safety** catches bugs early
- **Performance** - minimal bundle size
- **Maintainability** - consistent patterns

---

## 📚 Advanced Documentation

### Additional Guides

- 📘 [CSS Variables System](./scripts/README-CSS-VARIABLES.md) - Deep dive into CSS code generation
- 🎨 Design System - Visit `/design-system` in development mode
- 🔧 AI Agent Workflows - See `.agent/workflows/` for reusable commands

### Architecture Patterns

**Custom JSX Runtime:**

- Input: `<div css={["color-primary"]} />`
- Transform: `jsxImportSource: "@/runtime"`
- Output: `<div className="color-primary" />`

**URL State Management:**

- Dialogs: `?dialog=id:prop=value`
- Tabs: `?tab=components&active=button`
- Filters: `?status=active&sort=date`

**Code Generation Pipeline:**

```
CSS files → Script → TypeScript → Type checking → Autocomplete
```

---

## 📊 Project Stats

```
Language     | Files | Code
-------------|-------|------
TypeScript   |  130  | 5,247
CSS          |   38  | 2,025
Total        |  315  | 8,278
```

- **Components:** 21 fully documented
- **CSS Classes:** 330+ type-safe
- **Icons:** 117 SVG icons
- **Dependencies:** Minimal (React, Vite, TypeScript)
- **Bundle Size:** Optimized with code splitting

---

## 🤝 Contributing

This is a private project, but contributions follow these guidelines:

1. ✅ All code must pass TypeScript strict mode
2. ✅ Follow `.agent/rules/*.md` conventions
3. ✅ Add `.doc.tsx` for new components
4. ✅ Update CSS design tokens, not inline styles
5. ✅ No external dependencies without discussion

---

## 📄 License

Private - All rights reserved

---

## 🎯 Why This Architecture?

**Traditional Stack:**

```
React + Tailwind + Storybook + i18next + Redux
= 2.5MB bundle + Complex setup + 50+ dependencies
```

**Our Stack:**

```
React + Custom Runtime + Custom Docs + Custom i18n + URL State
= <500KB bundle + Zero config + <10 dependencies
```

**Benefits:**

- 🚀 **Faster** - Smaller bundle, faster loads
- 🔧 **Flexible** - Full control over features
- 📚 **Learning** - Deepens team's understanding
- 💰 **Cost** - No license fees or vendor lock-in

---

**Built with ❤️ using React, TypeScript, and Vite**
