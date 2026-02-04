# Vida Frontend

This is the frontend application for the Vida project, built with React, TypeScript, and Vite.

## 🚀 Project Setup

This project uses a standard Vite setup with additional quality control tools.

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Build the project for production:

```bash
npm run build
```

## 🛡️ Quality Control

We enforce strict code quality rules using ESLint, Prettier, and TypeScript. these checks run automatically on commit.

### Pre-commit Hooks

This project uses `husky` to run checks before every commit:

1.  **Type Check**: Runs `tsc --noEmit` to ensure no TypeScript errors.
2.  **Lint & Format**: Runs `lint-staged` to auto-fix linting issues and format code with Prettier.

You can manually run these checks:

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run formatting
npm run format
```

## 🤖 AI Agent Rules

This project includes specific rules for AI agents (like Antigravity) in `.agent/rules`. These rules ensure generated code follows our standards:

- **Strict Typing**: No `any` types allowed.
- **No Console Logs**: Console logs are forbidden in production code.
- **No Third-Party Libs**: Use existing utils/hooks instead of installing new libs.
- **Component Structure**: Functional components, custom hooks for logic.
- **CSS**: Raw CSS with nested classes, no `!important`.
- **Icons**: Centralized icon management.

## 📁 Folder Structure In-Depth

### `src/router/` - Navigation & Routing

Handles all application routing.

- **`Router.tsx`**: Main router configuration using `createBrowserRouter`.
- **`AuthGuard.tsx`**: Protects routes that require authentication.
- **`dashboard.routes.tsx`**: Defines routes visible in the dashboard/drawer.
  - **Logic**: Exports `useDashboardRoutes` which returns route objects.
  - **Drawer Integration**: Routes have a `handle` property with `title`, `icon`, and `hide` flags. The **Drawer** reads this to automatically generate the navigation menu.

### `src/layouts/drawer/` - Main Navigation UI

The side navigation menu.

- **`Drawer.layout.tsx`**: Renders the sidebar.
  - **Dynamic Menu**: Iterates over `dashboardRoutes` to create `Button` links.
  - **Mobile Support**: Uses CSS (`Drawer.layout.css`) and `drawer.utils.ts` to toggle visibility.
- **`drawer.utils.ts`**: Helper to toggle the drawer programmatically (e.g., from the Header).

### `src/locales/` - Internationalization

Custom i18n implementation (no third-party libs).

- **`Locales.ts`**: Core logic for managing language state and string interpolation.
- **`LocaleProvider.tsx`**: React Context Provider wrapping the app.
- **`locales.hooks.tsx`**:
  - `useText(locale)`: Hook to get a translated string.
  - `useDictionary(locale)`: Hook to get the full dictionary object.
- **Structure**: Translations are often localized in the component file (e.g., `const locale = { enUS: {...}, esES: {...} }`).

### `src/dialogs/` - Modal/Dialog System

Centralized, programmatic dialog management.

- **URL-Driven**: Dialog state is synced to the URL query param `?dialog=...`. This allows deep-linking to opened dialogs.
- **`Dialog.controller.ts`**: Singleton managing open/closed state.
- **`Dialog.provider.tsx`**: Renders the currently open dialogs into a React Portal (`#dialog-root`).
- **`dialog.register.ts`**: Maps dialog IDs to their actual React components.

### `src/utils/` - Shared Utilities

Helper functions organized by domain.

- **`http-client`**: `HttpClient.util.ts` wrapper around `fetch` for API calls.
- **`date`**: `Date.util.ts` for date formatting (custom implementation).
- **`url`**: `Url.utils.ts` for manipulating URL search params.
- **`class-names`**: Utility for conditionally joining class names.
- **`environment`**: Helpers to check `isProduction`, `isDevelopment`, etc.

### `src/proto/` - Prototypes

Global JavaScript prototype extensions.

- **`proto.ts`**: Adds custom methods to built-in types (e.g., `Array.prototype.filterMap`).
  - _Note_: `filterMap` is a combined filter+map operation for efficiency.
