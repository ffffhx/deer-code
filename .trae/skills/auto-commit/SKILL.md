---
name: "auto-commit"
description: "Analyzes code changes and generates conventional commit messages. Invoke when user wants to commit changes or asks for help with git commit."
---

# Auto Commit

This skill analyzes your code changes and automatically generates a commit message following the conventional commits specification, then commits the changes.

## When to Use

- When user says "commit", "帮我提交", "commit my changes", "auto commit"
- When user asks to commit their recent changes
- After completing a coding task and user wants to save their work

## Workflow

1. **Check for changes**: Run `git status` to see what files have been modified
2. **Review the diff**: Run `git diff` and `git diff --staged` to understand the changes
3. **Analyze changes**: Determine the type and scope of changes
4. **Generate commit message**: Create a message following conventional commits format
5. **Stage changes**: Run `git add` for relevant files (ask user if unsure)
6. **Commit**: Execute `git commit -m "<message>"`

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Allowed Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring without feature or bug changes |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration changes |
| `chore` | Other changes (maintenance, tooling, etc.) |
| `revert` | Reverting a previous commit |

### Rules

- Type must be lowercase
- Type and subject are required
- Subject should not end with a period
- Header (type + scope + subject) max 100 characters
- Use imperative mood in subject (e.g., "add" not "added")

## Examples

### Single Feature
```bash
git diff
# Shows: Added new login component

git commit -m "feat(auth): add login component"
```

### Bug Fix with Scope
```bash
git diff
# Shows: Fixed null pointer in user service

git commit -m "fix(user): handle null pointer in getUser method"
```

### Multiple Changes
If changes span multiple types, consider:
1. Making separate commits for each type
2. Using the most significant type if changes are related

### With Body
```bash
git commit -m "feat(api): add rate limiting

Implement token bucket algorithm for API rate limiting.
Default limit is 100 requests per minute per user.

Closes #123"
```

## Step-by-Step Instructions

1. First, check the current git status:
   ```bash
   git status
   ```

2. Review the changes:
   ```bash
   git diff
   git diff --staged
   ```

3. Based on the changes, determine:
   - **Type**: What kind of change is this? (feat/fix/docs/etc.)
   - **Scope**: What part of the codebase is affected? (optional)
   - **Subject**: Brief description of the change

4. Stage the files (if not already staged):
   ```bash
   git add <files>
   # or
   git add .
   ```

5. Commit with the generated message:
   ```bash
   git commit -m "<type>(<scope>): <subject>"
   ```

6. Verify the commit:
   ```bash
   git log -1
   ```

## Notes

- Always review the diff carefully before generating a commit message
- If changes are complex, consider breaking them into multiple commits
- Ask the user for confirmation before committing if the changes are significant
- If the commit message doesn't pass commitlint validation, adjust accordingly
