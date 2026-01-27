---
skill_id: documentation
name: "Documentation Generation"
description: "Generate documentation using approved templates with proper structure and frontmatter."
event: doc-creation
auto_trigger: false
version: "2.0.0"
last_updated: "2026-01-26"

# Inputs/Outputs
inputs:
  - document_type
  - module
  - content_outline
  - related_docs
output: document_file
output_format: "Markdown with YAML frontmatter"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "doc-creation"
    - "doc-request"
  conditions:
    - "user requests documentation"
    - "new feature needs docs"

# Validation
validation_rules:
  - "must use approved template"
  - "frontmatter must be complete"
  - "related_docs must be linked"

# Chaining
chain_after: []
chain_before: [frontmatter-validation, doc-index-update]

# Agent Association
called_by: ["@Scribe"]
mcp_tools:
  - mcp_payment-syste_search_full_text
  - mcp_payment-syste_query_docs_by_type
  - mcp_payment-syste_get_doc_context
---

# Documentation Skill

> **Purpose:** Generate documentation using approved templates with proper structure.

## Trigger

**When:** User requests documentation creation OR code changes require doc updates
**Context Needed:** Document type, target module, related docs
**MCP Tools:** `mcp_payment-syste_search_full_text`, `mcp_payment-syste_query_docs_by_type`, `mcp_payment-syste_get_doc_context`

## Template Selection

| Type     | Template              | Path                                |
| :------- | :-------------------- | :---------------------------------- |
| General  | 00-GENERAL            | `docs/process/**`                   |
| Feature  | 01-FEATURE-DESIGN     | `docs/technical/**/features/`       |
| ADR      | 02-ADR                | `docs/technical/architecture/adr/`  |
| Database | 03-DATABASE-SCHEMA    | `docs/technical/backend/database/`  |
| API      | 04-API-DESIGN         | `docs/technical/backend/api/`       |
| Sync     | 05-SYNC-STRATEGY      | `docs/technical/architecture/`      |
| UX       | 06-UX-FLOW            | `docs/technical/frontend/ux-flows/` |
| Testing  | 07-TESTING-STRATEGY   | `docs/technical/*/testing/`         |
| Deploy   | 08-DEPLOYMENT-RUNBOOK | `docs/technical/infrastructure/`    |
| Security | 09-SECURITY-AUDIT     | `docs/technical/security/`          |

## Required YAML

```yaml
---
document_type: "[type]"
module: "[module]"
status: "draft"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
author: "@username"
---
```

## Separation Rules

- Database docs → ONLY tables, indexes
- API docs → ONLY endpoints, DTOs
- UX docs → ONLY flows, screens
- Feature docs → CAN link to others

## Reference

- [DOCUMENTATION-WORKFLOW.md](/docs/process/standards/DOCUMENTATION-WORKFLOW.md)
- [docs/templates/](/docs/templates/)
