---
name: prisma
description: "Prisma schema and migration standards. Use when modifying schema.prisma or creating migrations."
event: file-change
auto_trigger: false
version: "1.0.0"
last_updated: "2026-01-30"

# Inputs/Outputs
inputs:
  - schema.prisma
output: migration_sql
output_format: "Prisma schema changes"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "file-change"
  file_patterns:
    - "prisma/schema.prisma"
    - "**/schema.prisma"

# Agent Association
called_by: ["@DataArchitect", "@Backend"]
mcp_tools:
  - prisma-migrate-dev
  - read_file
---

# Prisma Skill

> **Purpose:** Maintain database schema integrity and migration safety.

## Schema Conventions

- **Models:** PascalCase, Singular (e.g., `Product`, `Customer`).
- **Fields:** camelCase (e.g., `createdAt`, `totalAmount`).
- **Required Fields:** `id`, `createdAt`, `updatedAt` on ALL models.

```prisma
model Example {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime? // Soft delete recommended
}
```

## Relations

- Always index foreign keys.
- One-to-Many example:

```prisma
model Product {
  id         String   @id
  merchant   Merchant @relation(fields: [merchantId], references: [id])
  merchantId String
  @@index([merchantId])
}
```

## Migration Rules

1.  **Descriptive Names:** `bunx prisma migrate dev --name add_loyalty_points`
2.  **No Edits:** Never edit existing migration files. Create new ones.
3.  **Review:** Dangerous changes (drops, type changes) require manual review.

## Commands

- `bunx prisma migrate dev --name <desc>`
- `bunx prisma generate`
- `bunx prisma studio`
