---
name: testing
description: "Suggest appropriate tests for code changes and verify coverage targets. Use when writing tests, suggesting test cases, or when the user asks about testing."
event: code-change
auto_trigger: false
version: "2.0.0"
last_updated: "2026-01-26"

# Inputs/Outputs
inputs:
  - changed_files
  - existing_tests
  - coverage_report
output: test_suggestions
output_format: "Test file templates + coverage gaps"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "code-change"
    - "test-request"
  file_patterns:
    - "apps/**/*.ts"
    - "libs/**/*.ts"
  conditions:
    - "source code modified"
    - "user requests test suggestions"

# Validation
validation_rules:
  - "services minimum 80% coverage"
  - "controllers minimum 70% coverage"
  - "no skipped tests without reason"

# Chaining
chain_after: [code-review]
chain_before: []

# Agent Association
called_by: ["@QA"]
mcp_tools:
  - runTests
  - get_errors
  - test_failure
---

# Testing Skill

> **Purpose:** Suggest appropriate tests for code changes and verify coverage targets.

## Trigger

**When:** Code files modified OR user requests test suggestions
**Context Needed:** Changed source files, existing test files
**MCP Tools:** `runTests`, `get_errors`, `test_failure`

## Coverage Targets

| Type        | Min | Target |
| :---------- | :-- | :----- |
| Services    | 80% | 90%    |
| Controllers | 70% | 80%    |
| Utils       | 90% | 95%    |
| Critical    | 95% | 100%   |

## Test Selection

| Code Change    | Test Type      |
| :------------- | :------------- |
| Service method | Unit test      |
| Controller     | Integration    |
| Component      | Component test |
| User flow      | E2E            |

## Test Structure

```typescript
describe("Unit", () => {
  it("should [behavior] when [condition]", () => {
    // Arrange → Act → Assert
  });
});
```

## Commands

```bash
bun test                    # All tests
bun test path/to/file       # Specific file
bun test --coverage         # With coverage
```

## Reference

- [.github/instructions/testing.instructions.md](../instructions/testing.instructions.md)
