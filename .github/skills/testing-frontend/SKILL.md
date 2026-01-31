---
name: testing-frontend
description: "Frontend testing standards (Angular). Use when writing component or service tests for Web."
event: file-change
auto_trigger: false
version: "1.0.0"
last_updated: "2026-01-30"

# Inputs/Outputs
inputs:
  - source_code
output: test_code
output_format: "Jasmine/Karma test file"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "file-change"
  file_patterns:
    - "apps/web/**/*.ts"
    - "apps/web/**/*.html"

# Agent Association
called_by: ["@QA", "@Frontend"]
mcp_tools:
  - runTests
---

# Frontend Testing Skill

> **Purpose:** Ensure UI stability via Component and Service tests.

## File Naming

- **Component:** `[name].component.spec.ts` (alongside source).
- **Service:** `[name].service.spec.ts`.

## Testing Signals

```typescript
it("should update signal", () => {
  fixture.componentRef.setInput("inputName", value);
  fixture.detectChanges();
  expect(component.computedValue()).toBe(expected);
});
```

## Rules

- **No Flaky Tests**: Must be deterministic.
- **Edge Cases**: Test empty states, error states, loading states.
- **Coverage**: 70% minimum for components.
