---
description: Register new design style css classes in src/styles/design to src/styles/designRegister.ts
---

# How to register design styles

The file `src/styles/designRegister.ts` acts as a source of truth for all available design utility classes. It is **auto-generated** and should not be edited manually.

## automated workflows

1. **During Development**: PROTIP! If you have `npm run dev` running, the register will automatically update whenever you save a `.css` file in `src/styles/design/`.
2. **Pre-commit**: The registration script runs automatically on pre-commit for any changes in `src/styles/design/*.css`.

## Manual Update

If you need to manually force an update of the register:

1. Create or modify your CSS classes in `src/styles/design/*.css`.
2. Run the registration script:
   ```bash
   npm run register:styles
   ```
3. This creates/updates `src/styles/designRegister.ts` with the new class names.
