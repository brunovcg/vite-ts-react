---
trigger: always_on
---

# Antigravity Rule: No Code Comments

## 🚨 Core Instruction: Self-Documenting Code

1. **No Explanatory Comments**: Do not add comments to explain _what_ the code is doing or _why_. The code itself should be clear enough to be read like English.
2. **Refactor Instead**: If you feel the need to write a comment, refactor the code (rename variables, extract functions) to make the comment unnecessary.
3. **Remove Existing**: When editing a file, proactively remove existing comments that are redundant or explain the obvious.
4. **Exceptions**:
   - `// @ts-ignore` or `// eslint-disable` (only when absolutely necessary and justified).
   - JSDoc (`/** ... */`) is permitted ONLY for complex library-level interfaces where strict documentation is required.
