# Path-Specific Instructions

> **Version:** 2.0.0 | **Standard:** AGENTS.md v1

This directory contains context-specific instructions that apply based on file paths.

## How Instructions Work

```
File Being Edited → Check applyTo Pattern → Load Instructions
       ↓                    ↓                      ↓
 apps/api/foo.ts    apps/api/**/*.ts     backend.instructions.md
```

## Available Instructions (7)

| File                                                 | ApplyTo Pattern              | Focus            |
| :--------------------------------------------------- | :--------------------------- | :--------------- |
| [backend.instructions.md](backend.instructions.md)   | `apps/api/**/*.ts`           | NestJS patterns  |
| [frontend.instructions.md](frontend.instructions.md) | `apps/web/**/*.ts,html`      | Angular 21+      |
| [tailwind.instructions.md](tailwind.instructions.md) | `apps/web/**/*.ts,html,css`  | Styling/Tailwind |
| [prisma.instructions.md](prisma.instructions.md)     | `prisma/**,**/schema.prisma` | Database         |
| [docs.instructions.md](docs.instructions.md)         | `docs/**/*.md`               | Documentation    |
| [testing.instructions.md](testing.instructions.md)   | `**/*.spec.ts,**/test/**`    | Testing          |
| [business.instructions.md](business.instructions.md) | `docs/business/**/*.md`      | Business docs    |

## Instructions vs Subagents vs Skills

| Aspect  | Instructions           | Subagents        | Skills      |
| :------ | :--------------------- | :--------------- | :---------- |
| Trigger | File path match        | User intent      | Events      |
| Scope   | Path-specific rules    | Domain expertise | Single task |
| Purpose | Enforce patterns       | Complex work     | Automation  |
| Context | Always loaded for path | On-demand        | On-demand   |

## Instruction File Structure

Each instruction file has YAML frontmatter:

```yaml
---
applyTo: "apps/api/**/*.ts"
excludeAgent: "code-review" # Optional: skip for certain agents
---
# Backend Instructions

Rules and patterns for this path...
```

## Resolution Order

When working on a file, instructions are resolved:

1. **Nearest AGENTS.md** - Check current dir, walk up to root
2. **Path Instructions** - Match `applyTo` patterns (this directory)
3. **Root AGENTS.md** - Global orchestrator
4. **copilot-instructions.md** - System baseline

## Creating New Instructions

1. Create `[name].instructions.md` in this directory
2. Add YAML frontmatter with `applyTo` pattern
3. Keep instructions focused on that path's concerns
4. Reference existing docs (don't duplicate)
5. Include code patterns and examples

## Pattern Matching

```yaml
# Single directory
applyTo: "apps/api/**/*.ts"

# Multiple patterns (comma-separated)
applyTo: "apps/web/**/*.ts,apps/web/**/*.html"

# Specific file types
applyTo: "**/*.spec.ts,**/test/**,**/e2e/**"

# Multiple directories
applyTo: "prisma/**,**/schema.prisma"
```

## Best Practices

- **Keep focused:** Only include rules for the specific path
- **Reference docs:** Link to detailed docs instead of copying
- **No overlap:** Don't duplicate rules from other instructions
- **Examples:** Include code snippets for clarity

## Related Documentation

- [Subagents System](../agents/README.md)
- [Skills System](../skills/README.md)
- [Development Rules](/docs/process/workflow/DEVELOPMENT-RULES.md)
- [Code Style](/docs/process/standards/TOOLING-STYLE-GUIDE.md)

---

_Instructions are loaded automatically based on the file being edited._
