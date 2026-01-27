---
skill_id: pull-request
name: "Pull Request Generation"
description: "Generate comprehensive PR descriptions from commits and changes."
event: pr-creation
auto_trigger: true
version: "2.0.0"
last_updated: "2026-01-26"

# Inputs/Outputs
inputs:
  - commits
  - changed_files
  - related_issues
  - diff_summary
output: pr_description
output_format: "markdown (GitHub PR template)"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "pr-creation"
    - "branch-push"
  conditions:
    - "branch ready for review"
    - "commits exist on branch"

# Validation
validation_rules:
  - "description must summarize all changes"
  - "testing checkboxes required"
  - "related issues must be linked"

# Chaining
chain_after: [commit]
chain_before: [code-review]

# Agent Association
called_by: ["@Scribe"]
mcp_tools:
  - mcp_gitkraken_git_add_or_commit
  - activate_git_pull_request_and_issue_tools
---

# Pull Request Skill

> **Purpose:** Generate comprehensive PR descriptions from commits and changes.

## Trigger

**When:** User creates a new pull request
**Context Needed:** Commit history, changed files list, issue references
**MCP Tools:** `mcp_gitkraken_git_add_or_commit`, `activate_git_pull_request_and_issue_tools`

## Template

```markdown
## Description

[Summary of changes]

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- [Change 1]
- [Change 2]

## Testing

- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing done

## Related Issues

Closes #[issue]
```

## Auto-Detection

| Commit Type | PR Type       |
| :---------- | :------------ |
| `feat`      | New feature   |
| `fix`       | Bug fix       |
| `docs`      | Documentation |
| `refactor`  | Refactor      |

## Reference

- [.github/pull_request_template.md](../pull_request_template.md)
