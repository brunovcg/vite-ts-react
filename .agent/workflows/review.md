---
description: Review current changes against project rules and best practices
---

1. **Identify Scope**:
   - Check for staged changes: `git diff --cached --name-only`
   - Check for unstaged changes: `git diff --name-only`
   - If user provided specific files, use those instead.

2. **Fetch Rules**:
   - List rules in `.agent/rules/` to understand current enforcement policy.
   - Common rules to check for:
     - `no-any-types.md`: Strict type safety.
     - `no-code-comments.md`: Self-documenting code.
     - `no-console-logs.md`: Production-ready code.

3. **Analyze Code**:
   - Read the content of the target files.
   - **Rule Compliance**: Check against fetched rules.
   - **Quality Checks**:
     - **Bugs/Logic**: Potential runtime errors, off-by-one, etc.
     - **Security**: XSS, unvalidated inputs, sensitive data exposure.
     - **Performance**: Unnecessary re-renders, heavy computations in render path.
     - **Maintainability**: Variable naming, code duplication, component size.

4. **Report Findings**:
   - Group findings by file.
   - Severity levels:
     - 🔴 **CRITICAL**: Breaks build, runtime error, security flaw, or strictly forbidden by rules (e.g. `any`).
     - 🟡 **WARNING**: Code smell, performance concern, minor rule violation.
     - 🟢 **SUGGESTION**: Refactoring tip, cleaner syntax.
   - If no issues found, explicitly state "No issues found - LGTM".

5. **Auto-correct (Optional)**:
   - If simple rule violations are found (e.g. a forgotten `console.log`), offer to fix them.
