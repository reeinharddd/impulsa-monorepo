---
applyTo: "prisma/**,**/schema.prisma"
---

# Prisma Instructions

These instructions apply to Prisma schema and migration files.

## Schema Conventions

### Model Names

- PascalCase for model names
- Singular form (not plural)
- Examples: `Product`, `Customer`, `OrderItem`

### Field Names

- camelCase for field names
- Descriptive and consistent
- Examples: `createdAt`, `merchantId`, `totalAmount`

### Required Fields (All Models)

```prisma
model Example {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Soft delete (optional but recommended)
  deletedAt DateTime?
}
```

### Relations

```prisma
// One-to-Many
model Merchant {
  id       String    @id
  products Product[]
}

model Product {
  id         String   @id
  merchant   Merchant @relation(fields: [merchantId], references: [id])
  merchantId String

  @@index([merchantId]) // Always index foreign keys
}
```

### Enums

```prisma
enum PaymentStatus {
  PENDING
  AUTHORIZED
  CAPTURED
  REFUNDED
  FAILED
}
```

## Migration Rules

1. **Always use descriptive names**

   ```bash
   bunx prisma migrate dev --name add_loyalty_points_to_customer
   ```

2. **Never edit existing migrations**
   - Create new migration to fix issues
   - Or reset dev database

3. **Dangerous operations require review**
   - Dropping tables/columns
   - Changing column types
   - Making nullable → required

## Index Strategy

```prisma
model Product {
  id         String @id
  merchantId String
  sku        String
  name       String

  // Foreign key index
  @@index([merchantId])

  // Composite unique
  @@unique([merchantId, sku])

  // Search index
  @@index([name])
}
```

## Commands Reference

```bash
# Generate migration
bunx prisma migrate dev --name description

# Apply migrations (production)
bunx prisma migrate deploy

# Reset database (dev only!)
bunx prisma migrate reset

# Generate client
bunx prisma generate

# Open Prisma Studio
bunx prisma studio
```
