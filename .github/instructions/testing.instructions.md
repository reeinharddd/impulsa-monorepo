---
applyTo: "**/*.spec.ts,**/test/**,**/e2e/**"
---

# Testing Instructions

These instructions apply to all test files.

## Test File Naming

- Unit tests: `[name].spec.ts` (same directory as source)
- Integration tests: `test/[feature].e2e-spec.ts`
- Component tests: `[component].component.spec.ts`

## Test Structure (AAA Pattern)

```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should [expected behavior] when [condition]', async () => {
      // Arrange
      const input = { ... };
      mockDependency.method.mockResolvedValue(...);

      // Act
      const result = await service.methodName(input);

      // Assert
      expect(result).toEqual(...);
      expect(mockDependency.method).toHaveBeenCalledWith(...);
    });
  });
});
```

## Coverage Requirements

| Type           | Minimum |
| :------------- | :------ |
| Services       | 80%     |
| Controllers    | 70%     |
| Utils          | 90%     |
| Components     | 70%     |
| Critical paths | 95%     |

## Mocking

### Prisma (Backend)

```typescript
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

const prisma = mockDeep<PrismaClient>();
prisma.model.findMany.mockResolvedValue([...]);
```

### Angular (Frontend)

```typescript
fixture.componentRef.setInput("inputName", value);
fixture.detectChanges();
```

## Test Commands

```bash
# All tests
bun run test

# Specific file
bun test path/to/file.spec.ts

# With coverage
bun run test:cov

# Watch mode
bun run test:watch

# E2E
bun run test:e2e
```

## Rules

- NO skipped tests without documented reason
- NO flaky tests (must be deterministic)
- Every bug fix MUST have a test
- Test edge cases, not just happy path
