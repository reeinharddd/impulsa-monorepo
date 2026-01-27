---
skill_id: migration
name: "Migration Safety Validation"
description: "Validate Prisma schema changes for safety and generate migration reports."
event: schema-change
auto_trigger: true
version: "2.0.0"
last_updated: "2026-01-26"

# Inputs/Outputs
inputs:
  - schema_diff
  - existing_data
  - migration_history
output: migration_report
output_format: "Risk assessment + migration commands"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "schema-change"
    - "prisma-schema-save"
  file_patterns:
    - "prisma/schema.prisma"
  conditions:
    - "schema.prisma modified"

# Validation
validation_rules:
  - "destructive changes require approval"
  - "required columns need defaults"
  - "data migration plan for type changes"

# Chaining
chain_after: []
chain_before: [schema-doc-sync]

# Agent Association
called_by: ["@DataArchitect", "@Backend"]
mcp_tools:
  - prisma-migrate-dev
  - activate_prisma_migration_tools
---

# Migration Safety Skill

> **Purpose:** Validate Prisma schema changes for safety and generate migration reports.

## Trigger

**When:** `prisma/schema.prisma` is modified
**Context Needed:** Schema diff, current database state
**MCP Tools:** `prisma-migrate-dev`, `activate_prisma_migration_tools`

## Risk Levels

| Change                 | Risk        | Action            |
| :--------------------- | :---------- | :---------------- |
| Drop table             | 🔴 Critical | Backup + approval |
| Drop column            | 🔴 Critical | Backup + approval |
| Remove enum value      | 🔴 Critical | Check usage       |
| Change column type     | 🟠 High     | Validate data     |
| Make nullable→required | 🟠 High     | Check nulls       |
| Add required column    | 🟡 Medium   | Default needed    |
| Add optional column    | 🟢 Low      | Safe              |
| Add index              | 🟢 Low      | Safe              |

## Migration Checklist

- [ ] Descriptive migration name
- [ ] Backup before destructive changes
- [ ] Test on staging first
- [ ] Update related documentation

## Commands

```bash
# Generate migration
bunx prisma migrate dev --name [description]

# Check status
bunx prisma migrate status

# Apply to production
bunx prisma migrate deploy
```

## Reference

- [DATABASE-DESIGN.md](/docs/technical/backend/DATABASE-DESIGN.md)
- [.github/instructions/prisma.instructions.md](../instructions/prisma.instructions.md)
