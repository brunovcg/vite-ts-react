---
description: Generate a commit message based on branch name and staged changes
---

1. Get the current branch name using `git branch --show-current`.
2. Parse the branch name to find a pattern like `VIDA-<number>`.
   - Example 1: `feature/VIDA-123-add-login` -> `VIDA-123`
   - Example 2: `VIDA-456-fix-bug` -> `ENG-456`
   - Example 3: `fix/typo` -> (no tag)
3. Get the staged changes using `git diff --cached`.
   - If there are no staged changes, ask the user to stage something first.
4. Generate a commit message.
   - Summarize the changes in `git diff --cached` into a concise, imperative sentence (e.g., "Fix typography types", "Add generic button").
   - If a tag was found, format as: `[VIDA-123] - <Summary>`
   - If no tag was found, format as: `<Summary>`
5. Run the commit command:
   `git commit -m "<Generated Message>"`
   // turbo
