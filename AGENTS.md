# AGENTS.md - Impulsa AI Orchestrator

> **Version:** 6.0.0 | **Standard:** AGENTS.md v1 + Agent Skills v2

## Purpose

This is the **root orchestrator** for AI agent interactions. It routes tasks to specialized subagents and invokes skills automatically.

**Skills** (`.github/skills/*/SKILL.md`) are **auto-discovered** by Copilot based on the `description` field.

## Quick Reference

| Component         | Location                                    | Purpose                              |
| :---------------- | :------------------------------------------ | :----------------------------------- |
| **Skills (25+)**  | [.github/skills/](.github/skills/README.md) | Auto-discovered specialized tasks    |
| **Subagents (9)** | [.github/agents/](.github/agents/README.md) | Domain specialists (via runSubagent) |
| **Standards**     | [docs/process/](docs/process/)              | Development rules                    |

## Available Skills

Use these skills for detailed patterns on-demand:

### Development Skills

| Skill              | Description                            | URL                                                                                  |
| :----------------- | :------------------------------------- | :----------------------------------------------------------------------------------- |
| `angular`          | Angular 19+ (Signals, Standalone)      | [.github/skills/angular/SKILL.md](.github/skills/angular/SKILL.md)                   |
| `tailwind`         | Tailwind CSS v4 patterns               | [.github/skills/tailwind/SKILL.md](.github/skills/tailwind/SKILL.md)                 |
| `nestjs`           | NestJS Architecture (Thin Controllers) | [.github/skills/nestjs/SKILL.md](.github/skills/nestjs/SKILL.md)                     |
| `prisma`           | Database schema & migrations           | [.github/skills/prisma/SKILL.md](.github/skills/prisma/SKILL.md)                     |
| `i18n-translation` | Translation handling                   | [.github/skills/i18n-translation/SKILL.md](.github/skills/i18n-translation/SKILL.md) |

### Testing Skills

| Skill              | Description                  | URL                                                                                                    |
| :----------------- | :--------------------------- | :----------------------------------------------------------------------------------------------------- |
| `testing-backend`  | Jest/NestJS testing patterns | [.github/skills/testing-backend/SKILL.md](.github/skills/testing-backend/SKILL.md)                     |
| `testing-frontend` | Component/Signal testing     | [.github/skills/testing-frontend/SKILL.md](.github/skills/testing-frontend/SKILL.md)                   |
| `testing-strategy` | Test plans & coverage        | [.github/skills/testing-strategy-creation/SKILL.md](.github/skills/testing-strategy-creation/SKILL.md) |

### Workflow & DevOps

| Skill          | Description          | URL                                                                                                        |
| :------------- | :------------------- | :--------------------------------------------------------------------------------------------------------- |
| `commit`       | Conventional Commits | [.github/skills/commit/SKILL.md](.github/skills/commit/SKILL.md)                                           |
| `pull-request` | PR Descriptions      | [.github/skills/pull-request/SKILL.md](.github/skills/pull-request/SKILL.md)                               |
| `code-review`  | Automated Review     | [.github/skills/code-review/SKILL.md](.github/skills/code-review/SKILL.md)                                 |
| `migration`    | Migration validation | [.github/skills/migration/SKILL.md](.github/skills/migration/SKILL.md)                                     |
| `deployment`   | Runbook creation     | [.github/skills/deployment-runbook-creation/SKILL.md](.github/skills/deployment-runbook-creation/SKILL.md) |

### Meta-Skills

| Skill           | Description          | URL                                                                            |
| :-------------- | :------------------- | :----------------------------------------------------------------------------- |
| `skill-creator` | Create new skills    | [.github/skills/skill-creator/SKILL.md](.github/skills/skill-creator/SKILL.md) |
| `skill-sync`    | Update AGENTS.md     | [.github/skills/skill-sync/SKILL.md](.github/skills/skill-sync/SKILL.md)       |
| `self-update`   | Update Agents system | [.github/skills/self-update/SKILL.md](.github/skills/self-update/SKILL.md)     |

## Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                                  | Skill                    |
| :-------------------------------------- | :----------------------- |
| **Backend Development**                 |                          |
| Create/Modify NestJS Controller/Service | `nestjs`                 |
| Modify `schema.prisma`                  | `prisma`, `migration`    |
| Write Backend Tests                     | `testing-backend`        |
| Add API Endpoint                        | `api-doc-generation`     |
| **Frontend Development**                |                          |
| Create/Modify Angular Component         | `angular`, `tailwind`    |
| Add new UI Text                         | `i18n-translation`       |
| Write Frontend Tests                    | `testing-frontend`       |
| Design UX Flow                          | `ux-flow-creation`       |
| **Workflow**                            |                          |
| Create Git Commit                       | `commit`                 |
| Create Pull Request                     | `pull-request`           |
| Request Code Review                     | `code-review`            |
| Create ADR                              | `adr-creation`           |
| **System**                              |                          |
| Add/Modify Skill                        | `skill-sync`             |
| Create new Documentation                | `frontmatter-validation` |

## MCP Tools (Quick Ref)

| Tool                                   | Use For                 |
| :------------------------------------- | :---------------------- |
| `mcp_payment-syste_search_full_text`   | Search documentation    |
| `mcp_payment-syste_query_docs_by_type` | Filter by doc type      |
| `mcp_payment-syste_get_doc_context`    | Load doc with relations |
| `mcp_sequentialthi_sequentialthinking` | Complex planning        |
| `prisma-migrate-dev`                   | Database migrations     |
| `container-tools_get-config`           | Docker configuration    |
| `runTests` / `get_errors`              | Verification            |

## Project Context

**Impulsa** - Business management platform for LATAM merchants.

| Aspect       | Stack                                |
| :----------- | :----------------------------------- |
| Runtime      | Bun 1.3+                             |
| Backend      | NestJS 10+, Prisma 5+, PostgreSQL    |
| Frontend     | Angular 21+, Signals, Tailwind CSS 4 |
| Architecture | Modular Monolith                     |
| Countries    | MX, CO, AR, CL                       |

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start all services
bun run dev:api      # Backend only (:3000)
bun run dev:web      # Frontend only (:4200)
bun run db:migrate   # Run migrations
bun run test         # Run tests
bun run lint         # Lint code
```

## Agent Routing

| Keywords                                           | Route To                                                |
| :------------------------------------------------- | :------------------------------------------------------ |
| design, architecture, pattern, scalability         | [@Architect](.github/agents/Architect.agent.md)         |
| implement, api, service, controller, nestjs        | [@Backend](.github/agents/Backend.agent.md)             |
| component, ui, page, form, angular, signal         | [@Frontend](.github/agents/Frontend.agent.md)           |
| test, fix, debug, bug, error, coverage             | [@QA](.github/agents/QA.agent.md)                       |
| document, adr, changelog, commit, readme           | [@Scribe](.github/agents/Scribe.agent.md)               |
| security, audit, vulnerability, compliance, owasp  | [@Security](.github/agents/Security.agent.md)           |
| schema, database, table, entity, migration, prisma | [@DataArchitect](.github/agents/DataArchitect.agent.md) |
| offline, sync, conflict, indexeddb, dexie, pwa     | [@SyncEngineer](.github/agents/SyncEngineer.agent.md)   |
| deploy, docker, kubernetes, ci, cd, infrastructure | [@DevOps](.github/agents/DevOps.agent.md)               |

## File Pattern Triggers

| Pattern                              | Agent(s)                             |
| :----------------------------------- | :----------------------------------- |
| `apps/api/**/*.ts`                   | @Backend                             |
| `apps/web/**/*.ts`                   | @Frontend                            |
| `prisma/**`                          | @DataArchitect → @Backend            |
| `docs/**/*.md`                       | @Scribe                              |
| `docs/business/**/*.md`              | @Scribe (with business.instructions) |
| `**/*.spec.ts`                       | @QA                                  |
| `**/SECURITY-*.md`                   | @Security                            |
| `**/*SYNC*.md`                       | @SyncEngineer                        |
| `docker/**`, `Dockerfile*`           | @DevOps                              |
| `.github/workflows/**`               | @DevOps                              |
| `docs/technical/backend/database/**` | @DataArchitect                       |

## Nested AGENTS.md

| Path                                     | Context           |
| :--------------------------------------- | :---------------- |
| [apps/api/AGENTS.md](apps/api/AGENTS.md) | Backend-specific  |
| [apps/web/AGENTS.md](apps/web/AGENTS.md) | Frontend-specific |

**Rule:** Nearest AGENTS.md takes precedence.

## Critical Constraints

**DO NOT:**

- Use npm/yarn/pnpm (use `bun`)
- Use raw SQL (use Prisma)
- Put logic in controllers
- Use `any` type
- Use NgModules (standalone only)
- Use barrel files (index.ts) - use direct imports
- **Use `git commit --no-verify`** (always run pre-commit hooks)
- **Use `git push --force`** (never force push)
- **Bypass quality gates** (pre-commit, pre-push hooks)

**ALWAYS:**

- Run `bun install` after pull
- Use Conventional Commits
- Write tests (80% coverage)
- Update docs with code changes
- Run and pass all pre-commit hooks (format, lint, commitlint)
- Run and pass all pre-push hooks (lint, typecheck, test, build)
- Fix formatting: `bun run format`
- Fix linting: `bun run lint:fix`
- Investigate and fix hook failures (never bypass)

## Documentation

| Topic             | Location                                                                       |
| :---------------- | :----------------------------------------------------------------------------- |
| Development Rules | [DEVELOPMENT-RULES.md](docs/process/workflow/DEVELOPMENT-RULES.md)             |
| AI Standard       | [AI-DEVELOPMENT-STANDARD.md](docs/process/workflow/AI-DEVELOPMENT-STANDARD.md) |
| Design Patterns   | [DESIGN-PATTERNS.md](docs/technical/architecture/DESIGN-PATTERNS.md)           |
| Doc Templates     | [docs/templates/](docs/templates/)                                             |

## Change Log

| Version | Date       | Changes                                                                                                                     |
| :------ | :--------- | :-------------------------------------------------------------------------------------------------------------------------- |
| 6.0.0   | 2026-01-30 | **Architecture Shift:** Adopted Granular Skills (vs Instructions); Action-Oriented Auto-invoke; Added Meta-Skills           |
| 5.2.1   | 2026-01-30 | ADR-005 Frontend Assets Configuration; Fixed favicon/logo display; Updated LOGO-USAGE-GUIDE.md; Asset management docs       |
| 5.2.0   | 2026-01-27 | Skills use SKILL.md convention; Auto-discovery via description field; Updated skill count to 18                             |
| 5.1.0   | 2026-01-27 | Added NO barrel files constraint; Updated import rules across all documentation                                             |
| 5.0.0   | 2026-01-26 | Complete YAML frontmatter (scope, triggers, auto_invoke); 4 new template skills; business.instructions.md                   |
| 4.0.0   | 2026-01-26 | Added @Security, @DataArchitect, @SyncEngineer, @DevOps agents; Added 7 new skills for doc automation; Self-updating system |
| 3.0.0   | 2026-01-26 | Modular architecture with component READMEs                                                                                 |
| 2.0.0   | 2026-01-26 | Initial AGENTS.md v1 implementation                                                                                         |

---

_Context is loaded on-demand. See component READMEs for details._
