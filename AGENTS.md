# AGENTS.md - Impulsa AI Orchestrator

> **Version:** 5.2.0 | **Standard:** AGENTS.md v1 + Agent Skills

## Purpose

This is the **root orchestrator** for AI agent interactions. It routes tasks to specialized subagents and invokes skills automatically.

**Skills** (`.github/skills/*/SKILL.md`) are **auto-discovered** by Copilot based on the `description` field.

## Quick Reference

| Component            | Location                                                | Purpose                              |
| :------------------- | :------------------------------------------------------ | :----------------------------------- |
| **Skills (18)**      | [.github/skills/](.github/skills/README.md)             | Auto-discovered specialized tasks    |
| **Subagents (9)**    | [.github/agents/](.github/agents/README.md)             | Domain specialists (via runSubagent) |
| **Instructions (7)** | [.github/instructions/](.github/instructions/README.md) | Path-specific rules                  |
| **Standards**        | [docs/process/](docs/process/)                          | Development rules                    |

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

## Skill Auto-Triggers

| Event                      | Skill(s) Invoked                 |
| :------------------------- | :------------------------------- |
| `schema.prisma` modified   | migration → schema-doc-sync      |
| `*.controller.ts` modified | api-doc-generation               |
| `docs/**/*.md` saved       | frontmatter-validation           |
| `docs/**/*.md` created     | documentation → doc-index-update |
| `related_docs` modified    | related-docs-sync                |
| Agent/Skill modified       | self-update                      |
| Security review requested  | security-audit-creation          |
| Deployment planned         | deployment-runbook-creation      |

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

**ALWAYS:**

- Run `bun install` after pull
- Use Conventional Commits
- Write tests (80% coverage)
- Update docs with code changes

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
| 5.2.0   | 2026-01-27 | Skills use SKILL.md convention; Auto-discovery via description field; Updated skill count to 18                             |
| 5.1.0   | 2026-01-27 | Added NO barrel files constraint; Updated import rules across all documentation                                             |
| 5.0.0   | 2026-01-26 | Complete YAML frontmatter (scope, triggers, auto_invoke); 4 new template skills; business.instructions.md                   |
| 4.0.0   | 2026-01-26 | Added @Security, @DataArchitect, @SyncEngineer, @DevOps agents; Added 7 new skills for doc automation; Self-updating system |
| 3.0.0   | 2026-01-26 | Modular architecture with component READMEs                                                                                 |
| 2.0.0   | 2026-01-26 | Initial AGENTS.md v1 implementation                                                                                         |

---

_Context is loaded on-demand. See component READMEs for details._
