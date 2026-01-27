---
skill_id: commit
name: "Commit Message Generation"
description: "Generate consistent Conventional Commit messages from staged changes."
event: pre-commit
auto_trigger: true
version: "2.0.0"
last_updated: "2026-01-26"

# Inputs/Outputs
inputs:
  - staged_files
  - diff_summary
  - file_paths
output: commit_message
output_format: "type(scope): description"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "git-add"
    - "pre-commit"
  conditions:
    - "files staged for commit"

# Validation
validation_rules:
  - "type must be valid (feat, fix, docs, etc.)"
  - "scope must match path pattern"
  - "description must be lowercase"
  - "max 72 characters"

# Chaining
chain_after: []
chain_before: [pull-request]

# Agent Association
called_by: ["@Scribe", "@Backend", "@Frontend"]
mcp_tools:
  - mcp_gitkraken_git_add_or_commit
---

# Commit Message Skill

> **Purpose:** Generate consistent Conventional Commit messages from staged changes.

## Trigger

**When:** User stages files and requests commit
**Context Needed:** `git diff --staged`, file paths
**MCP Tools:** `mcp_gitkraken_git_add_or_commit`

## Format

```
type(scope): description
```

## Types

| Change        | Type       |
| :------------ | :--------- |
| New feature   | `feat`     |
| Bug fix       | `fix`      |
| Documentation | `docs`     |
| Refactor      | `refactor` |
| Tests         | `test`     |
| Build/deps    | `chore`    |

## Scope Detection

| Path          | Scope  |
| :------------ | :----- |
| `apps/api/**` | `api`  |
| `apps/web/**` | `web`  |
| `prisma/**`   | `db`   |
| `docs/**`     | `docs` |
| `libs/ui/**`  | `ui`   |

## Examples

```
feat(api): add payment webhook endpoint
fix(web): resolve signal update in product list
docs(api): update authentication API documentation
chore(db): add index for merchant lookup
```

## Reference

- [TOOLING-STYLE-GUIDE.md](/docs/process/standards/TOOLING-STYLE-GUIDE.md)
