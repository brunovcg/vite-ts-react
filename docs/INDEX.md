# Documentation Index

Welcome to the Vida Frontend documentation. This project features extensive documentation covering architecture, patterns, and systems.

## 📚 Main Documentation

### [README.md](../README.md)

**Main project documentation** - Start here for an overview of the project, quick start guide, and feature highlights.

### [ARCHITECTURE.md](./ARCHITECTURE.md)

**Architecture deep dive** - Detailed explanation of custom JSX runtime, type-safe CSS system, state management patterns, and build pipeline.

## 🔧 System-Specific Documentation

### [CSS Variables System](../scripts/css-variables.readme.md)

Learn about the auto-generated CSS variables system that converts CSS custom properties to TypeScript types.

**Topics covered:**

- How the naming convention works
- Automatic updates in dev, git commits, and manual runs
- Usage examples
- File structure

## 🎨 Design System

Access the interactive design system by visiting `/design-system` in development mode.

**Features:**

- **Components Tab**: Interactive component playground with live preview and code generation
- **Styles Tab**: Browse all design tokens (colors, typography, spacing, etc.)
- **Readmes Tab**: View all project documentation in-app

## 📂 Documentation Files

All documentation follows these patterns:

### File Naming Conventions

- `README.md` - Main project documentation at root
- `*.readme.md` - System-specific documentation (lowercase, dash-separated)
- `docs/ARCHITECTURE.md` - Architecture and patterns (uppercase)
- `.agent/workflows/*.md` - Development workflows

### Creating New Documentation

1. **For system documentation**: Create `<system-name>.readme.md` in the relevant directory
2. **For architectural docs**: Add to `docs/` directory
3. **For workflows**: Add to `.agent/workflows/`

All `.readme.md` files are automatically discovered and displayed in the Design System's Readmes tab.

## 🤖 AI Agent Documentation

- **Rules**: `.agent/rules/*.md` - Code quality enforcement rules
- **Workflows**: `.agent/workflows/*.md` - Reusable development workflows

## 🔍 Finding Documentation

### In Development

Visit `/design-system` and click the **Readmes** tab to browse all documentation with a live markdown renderer.

### In Code

Documentation is co-located with the code it describes:

- Component docs: `src/components/*/Component.doc.tsx`
- System docs: `<system-directory>/*.readme.md`
- Architecture: `docs/ARCHITECTURE.md`

## 📖 Additional Resources

- **Component Documentation**: Each component has a `.doc.tsx` file for the design system
- **Code Comments**: Minimal by design - code should be self-documenting
- **Type Definitions**: Check `.d.ts` files for type documentation

---

**Need help?** Check the Design System or contact the development team.
