# Subagents System

> **Version:** 2.0.0 | **Standard:** AGENTS.md v1 + Agent Skills

This directory contains specialized AI subagents that handle domain-specific tasks.

## Purpose

Subagents are **domain specialists** that handle complex, multi-step work. Use them via the `runSubagent` tool with the agent name (e.g., `@Backend`, `@Frontend`).

**Note:** Skills (`.github/skills/*/SKILL.md`) are auto-discovered by Copilot. Subagents require explicit invocation via `runSubagent`.

## How Subagents Work

```
User Request → Root AGENTS.md (Orchestrator)
                    ↓
              Intent Analysis
                    ↓
              Route to Subagent
                    ↓
         @Architect | @Backend | @Frontend | @QA | @Scribe
```

## Available Subagents

| Agent            | File                                             | Domain                      | Color     | Primary MCP Tools                                           |
| :--------------- | :----------------------------------------------- | :-------------------------- | :-------- | :---------------------------------------------------------- |
| `@Architect`     | [Architect.agent.md](Architect.agent.md)         | System design, schemas      | `#9C27B0` | `sequentialthinking`, `search_full_text`, `get_doc_context` |
| `@Backend`       | [Backend.agent.md](Backend.agent.md)             | NestJS, services, DB        | `#2E7D32` | `prisma-migrate-dev`, `runTests`, `query_docs_by_type`      |
| `@Frontend`      | [Frontend.agent.md](Frontend.agent.md)           | Angular, UI, signals        | `#1976D2` | `read_file`, `grep_search`, `get-library-docs`              |
| `@QA`            | [QA.agent.md](QA.agent.md)                       | Testing, debugging          | `#D32F2F` | `runTests`, `get_errors`, `sequentialthinking`              |
| `@Scribe`        | [Scribe.agent.md](Scribe.agent.md)               | Documentation, commits      | `#FFB300` | `search_full_text`, `query_docs_by_type`                    |
| `@Security`      | [Security.agent.md](Security.agent.md)           | Security audits, compliance | `#E91E63` | `search_full_text`, `sequentialthinking`                    |
| `@DataArchitect` | [DataArchitect.agent.md](DataArchitect.agent.md) | Database schemas            | `#795548` | `prisma-migrate-dev`, `query_docs_by_type`                  |
| `@SyncEngineer`  | [SyncEngineer.agent.md](SyncEngineer.agent.md)   | Offline/sync                | `#00BCD4` | `query_docs_by_type`, `get-library-docs`                    |
| `@DevOps`        | [DevOps.agent.md](DevOps.agent.md)               | Infrastructure, deploy      | `#607D8B` | `container-tools_get-config`, `run_in_terminal`             |

## MCP Tools by Agent

### @Architect

```yaml
tools:
  - mcp_sequentialthi_sequentialthinking # Planning complex designs
  - mcp_payment-syste_search_full_text # Find existing patterns
  - mcp_payment-syste_get_doc_context # Load related docs
  - read_file # Read schemas, interfaces
```

### @Backend

```yaml
tools:
  - prisma-migrate-dev # Database migrations
  - mcp_payment-syste_query_docs_by_type # Find API/DB docs
  - runTests # Verify implementations
  - read_file, grep_search # Code navigation
```

### @Frontend

```yaml
tools:
  - read_file, grep_search # Find components
  - mcp_io_github_ups_get-library-docs # Angular/library docs
  - run_in_terminal # Build verification
```

### @QA

```yaml
tools:
  - runTests # Execute tests
  - get_errors # Check for issues
  - mcp_sequentialthi_sequentialthinking # Root cause analysis
  - test_failure # Get failure details
```

### @Scribe

```yaml
tools:
  - mcp_payment-syste_search_full_text # Search all docs
  - mcp_payment-syste_query_docs_by_type # Find by type
  - mcp_payment-syste_get_doc_context # Load with relations
```

### @Security

```yaml
tools:
  - mcp_payment-syste_search_full_text # Find security patterns
  - mcp_sequentialthi_sequentialthinking # Threat modeling
  - grep_search # Find vulnerabilities
```

### @DataArchitect

```yaml
tools:
  - prisma-migrate-dev # Create migrations
  - mcp_payment-syste_query_docs_by_type # Get schema docs
  - mcp_payment-syste_get_doc_context # Load related schemas
```

### @SyncEngineer

```yaml
tools:
  - mcp_payment-syste_query_docs_by_type # Get sync strategies
  - mcp_io_github_ups_get-library-docs # Dexie.js docs
  - mcp_sequentialthi_sequentialthinking # Conflict resolution
```

### @DevOps

```yaml
tools:
  - container-tools_get-config # Docker configuration
  - run_in_terminal # Execute commands
  - read_file # Read configs
```

- mcp_payment-syste_search_full_text # Search all docs
- mcp_payment-syste_query_docs_by_type # Find by type
- read_file # Read templates
- create_file, replace_string_in_file # Write docs

````

## Auto-Invocation Rules

Subagents are invoked automatically based on:

### 1. Keywords in User Request

```yaml
@Architect: design, architecture, schema, pattern, model, plan
@Backend:   implement, api, service, controller, nestjs, prisma
@Frontend:  component, ui, page, form, angular, signal
@QA:        test, fix, debug, bug, error, coverage
@Scribe:    document, adr, changelog, commit, readme
````

### 2. File Patterns Being Edited

```yaml
apps/api/**/*.ts      → @Backend
apps/web/**/*.ts      → @Frontend
prisma/**             → @Architect + @Backend
docs/**/*.md          → @Scribe
**/*.spec.ts          → @QA
```

### 3. Events

```yaml
error_detected        → @QA
multi_file_change     → @Architect (planning first)
schema_change         → @Architect (review)
```

## Handoff Protocol

When a subagent completes its work, it provides a handoff summary:

```markdown
## Handoff Summary for @[NextAgent]

- **Completed:** [what was done]
- **Artifacts:** [files created/modified]
- **Next steps:** [specific tasks for next agent]
```

## Creating a New Subagent

1. Create `[Name].agent.md` in this directory
2. Include YAML frontmatter with:
   - `agent_id`: unique identifier
   - `auto_invoke.keywords`: trigger keywords
   - `auto_invoke.file_patterns`: file globs
   - `tools`: allowed MCP tools
3. Define Prime Directives
4. Define Workflow steps
5. Define Constraints

## Integration with Skills

Subagents can invoke skills when needed:

| Agent          | Triggers Skills                              |
| :------------- | :------------------------------------------- |
| @Backend       | `migration`, `api-doc-generation`, `testing` |
| @Frontend      | `i18n-translation`, `ux-flow-creation`       |
| @DataArchitect | `migration`, `schema-doc-sync`               |
| @Scribe        | `documentation`, `adr-creation`, `commit`    |
| @QA            | `testing`, `testing-strategy-creation`       |
| @Security      | `security-audit-creation`                    |
| @DevOps        | `deployment-runbook-creation`                |

Skills are loaded automatically based on their `description` field. See [Skills System](../skills/README.md).

## Related Documentation

- [Skills System](../skills/README.md)
- [Path Instructions](../instructions/README.md)
- [Root Orchestrator](/AGENTS.md)

---

_Use `runSubagent` tool with agent name (e.g., `@Backend`) for complex domain tasks._
