---
skill_id: code-review
name: "Automated Code Review"
description: "Perform automated code review against project standards and patterns."
event: review-request
auto_trigger: false
version: "2.0.0"
last_updated: "2026-01-26"

# Inputs/Outputs
inputs:
  - changed_files
  - diff
  - pr_description
  - file_paths
output: review_comments
output_format: "GitHub review comments with severity levels"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "review-request"
    - "pr-updated"
  conditions:
    - "user requests review"
    - "PR marked ready for review"

# Validation
validation_rules:
  - "no any types in TypeScript"
  - "controllers must be thin"
  - "tests required for new code"
  - "documentation updated if needed"

# Chaining
chain_after: [pull-request]
chain_before: []

# Agent Association
called_by: ["@QA"]
mcp_tools:
  - get_errors
  - grep_search
  - read_file
  - runTests
---

# Code Review Skill

> **Purpose:** Perform automated code review against project standards.

## Trigger

**When:** PR review requested OR user asks for review
**Context Needed:** Changed files, diff content, PR description
**MCP Tools:** `get_errors`, `grep_search`, `read_file`

## Checks

### TypeScript

- [ ] No `any` types
- [ ] Explicit return types on public methods
- [ ] No unused imports
- [ ] Proper error handling

### Architecture

- [ ] Controllers are thin
- [ ] Business logic in services
- [ ] DTOs for all inputs

### Angular (if frontend)

- [ ] Standalone components
- [ ] OnPush change detection
- [ ] Signals for state
- [ ] @if/@for control flow

### Testing

- [ ] Tests for new code
- [ ] No skipped tests
- [ ] Coverage maintained

### Documentation

- [ ] Updated if needed
- [ ] Correct template used

## Severity

| Level      | Action     |
| :--------- | :--------- |
| 🔴 Error   | Must fix   |
| 🟡 Warning | Should fix |
| 🔵 Info    | Consider   |

## Reference

- [CONSTRUCTION-CHECKLIST.md](/docs/process/workflow/CONSTRUCTION-CHECKLIST.md)
