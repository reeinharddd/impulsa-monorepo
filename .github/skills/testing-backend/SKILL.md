---
name: testing-backend
description: "Backend testing standards (NestJS, Jest). Use when writing unit or integration tests for API."
event: file-change
auto_trigger: false
version: "1.0.0"
last_updated: "2026-01-30"

# Inputs/Outputs
inputs:
  - source_code
output: test_code
output_format: "Jest test file"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "file-change"
  file_patterns:
    - "apps/api/**/*.ts"

# Agent Association
called_by: ["@QA", "@Backend"]
mcp_tools:
  - runTests
---

# Backend Testing Skill

> **Purpose:** Ensure API reliability via Unit and Integration tests using Jest.

## File Naming

- **Unit:** `[name].spec.ts` (alongside source).
- **Integration:** `test/[feature].e2e-spec.ts`.

## Coverage Targets

- **Services:** 80%
- **Controllers:** 70%
- **Critical Path:** 95%

## Mocking Prisma

Use `jest-mock-extended`.

```typescript
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prisma = mockDeep<PrismaClient>();
prisma.model.findMany.mockResolvedValue([]);
```

## AAA Pattern

```typescript
it("should create resource", async () => {
  // Arrange
  const dto = { name: "Test" };
  prisma.resource.create.mockResolvedValue(result);

  // Act
  const res = await service.create(dto);

  // Assert
  expect(res).toEqual(result);
});
```
