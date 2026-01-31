---
# YAML Frontmatter - Metadata for Copilot Auto-Discovery
skill_name: "doc-refactoring"
description: "Fix documentation violations by extracting mixed concerns into separate documents. Use when docs have incorrect content, violations detected, or when the user asks to fix documentation structure."
version: "1.0.0"
last_updated: "2026-01-27"
author: "@Scribe"

# Skill Execution Context
scope: "documentation"
auto_invoke:
  when:
    - "Documentation has mixed concerns (UI in DB docs, DB in UX docs, etc.)"
    - "Separation of concerns violations detected"
    - "User reports documentation is confusing/incorrect"
    - "frontmatter-validation skill reports violations"
  conditions:
    - file_patterns: ["docs/**/*.md"]
    - keywords:
        [
          "fix docs",
          "refactor documentation",
          "extract content",
          "separation of concerns",
          "violation",
        ]

# Related Skills & Agents
chains_with:
  [
    "frontmatter-validation",
    "documentation",
    "related-docs-sync",
    "doc-index-update",
  ]
invoked_by: ["@Scribe"]
agents: ["@Scribe"]

# Key Topics & Patterns
keywords:
  - "documentation refactoring"
  - "separation of concerns"
  - "content extraction"
  - "violation fixes"
  - "cross-references"
---

# Skill: doc-refactoring

**Purpose:** Fix documentation by extracting incorrectly mixed concerns into separate, correctly-structured documents.

## Problem: Mixed Concerns

**Ref:** [DOCUMENTATION-WORKFLOW.md](../../../docs/process/standards/DOCUMENTATION-WORKFLOW.md)

Violations occur when:

- Database docs contain UI flows
- API docs contain database schemas
- UX docs contain business logic
- Feature docs duplicate database/API/UX content

**Result:** Confusion, duplication, maintenance nightmares.

## Separation of Concerns Matrix

**MANDATORY:** Each document type has PRIMARY content + allowed REFERENCES.

| Doc Type       | ✅ PRIMARY Content                      | 🔗 REF (Link Only)                  | ❌ FORBIDDEN                                   |
| :------------- | :-------------------------------------- | :---------------------------------- | :--------------------------------------------- |
| **DATABASE**   | Tables, columns, indexes, FKs, triggers | Related APIs                        | UI flows, API endpoints, UX screens            |
| **API**        | Endpoints, DTOs, status codes, auth     | Related database tables, UX flows   | Database schemas, UI components                |
| **FEATURE**    | Business logic, use cases, acceptance   | DB tables, API endpoints, UX flows  | Implementation details (duplicating DB/API/UX) |
| **ADR**        | Decision, context, consequences         | Related features, APIs, schemas     | Complete implementations                       |
| **UX**         | Screens, user flows, interactions       | Related APIs, database entities     | Database schemas, API implementation           |
| **SYNC**       | Conflict resolution, offline logic      | Related DB tables, APIs             | UI implementation, full schemas                |
| **TESTING**    | Test strategies, coverage targets       | Features, APIs, DB schemas          | Complete test code                             |
| **DEPLOYMENT** | Deploy steps, rollback procedures       | Architecture, infrastructure        | Feature specs, API details                     |
| **SECURITY**   | Threats, mitigations, compliance        | Features, APIs, DB, architecture    | Complete implementation code                   |
| **BUSINESS**   | Strategy, brand, market analysis        | Technical docs (for implementation) | Technical details, code, schemas               |

**Rule:** If content is ✅ PRIMARY in another doc type, it MUST NOT be duplicated.

## Refactoring Process

### Step 1: Detect Violations

**Use:** `frontmatter-validation` skill + manual review

**Common Violations:**

1. **Database doc with UI flows**

   ```markdown
   <!-- ❌ WRONG: In DATABASE-SCHEMA.md -->

   ## User Registration Flow

   1. User fills form with email/password
   2. Frontend validates email format
   3. Submit button sends POST to /api/auth/register
   ```

2. **API doc with database schema details**

   `````markdown
   <!-- ❌ WRONG: In API-DESIGN.md -->

   ## POST /api/products

   ### Database Schema

   ````sql
   CREATE TABLE products (
     id BIGSERIAL PRIMARY KEY,
     merchant_id BIGINT REFERENCES merchants(id),
     ...
   );
   \```
   ````
   `````

   ```

   ```

3. **Feature doc duplicating API + DB + UX**

   ```markdown
   <!-- ❌ WRONG: In FEATURE-LOYALTY-POINTS.md -->

   ## Implementation

   ### Database

   [50 lines of SQL schema]

   ### API

   [100 lines of endpoint specs]

   ### UI

   [80 lines of screen descriptions]
   ```

### Step 2: Extract Content

**Principle:** Move content to its PRIMARY document, leave REFERENCES in original.

#### Pattern A: Extract Database Content

**Before:** `FEATURE-LOYALTY-POINTS.md` has database schema

`````markdown
## Database Schema

````sql
CREATE TABLE loyalty_points (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id),
  merchant_id BIGINT REFERENCES merchants(id),
  points INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
\```

CREATE INDEX idx_loyalty_customer ON loyalty_points(customer_id);
CREATE INDEX idx_loyalty_merchant ON loyalty_points(merchant_id);
````
`````

`````

**After (Step 1):** Create `docs/technical/backend/database/LOYALTY-POINTS-SCHEMA.md`

````markdown
---
document_type: "database"
module: "loyalty"
status: "draft"
version: "1.0.0"
last_updated: "2026-01-27"
author: "@DataArchitect"

keywords:
  - "loyalty points"
  - "database schema"
  - "customer rewards"

related_docs:
  feature_design: "docs/technical/features/FEATURE-LOYALTY-POINTS.md"
  api_design: "docs/technical/backend/api/LOYALTY-API.md"
---

# Database Schema: Loyalty Points

## Tables

### loyalty_points

Stores customer loyalty points for rewards program.

| Column      | Type      | Constraints             | Description              |
| :---------- | :-------- | :---------------------- | :----------------------- |
| id          | BIGSERIAL | PRIMARY KEY             | Unique identifier        |
| customer_id | BIGINT    | REFERENCES, NOT NULL    | Foreign key to customers |
| merchant_id | BIGINT    | REFERENCES, NOT NULL    | Foreign key to merchants |
| points      | INT       | NOT NULL, DEFAULT 0     | Current point balance    |
| created_at  | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation time     |

## Indexes

| Index Name           | Columns     | Purpose           |
| :------------------- | :---------- | :---------------- |
| idx_loyalty_customer | customer_id | Query by customer |
| idx_loyalty_merchant | merchant_id | Query by merchant |
| idx_loyalty_created  | created_at  | Sort by date      |

## Relationships

````plantuml
!theme plain
@startuml
entity customers {
  * id : bigint <<PK>>
}
entity merchants {
  * id : bigint <<PK>>
}
entity loyalty_points {
  * id : bigint <<PK>>
  --
  * customer_id : bigint <<FK>>
  * merchant_id : bigint <<FK>>
  * points : int
  * created_at : timestamp
}

customers ||--o{ loyalty_points : "earns"
merchants ||--o{ loyalty_points : "manages"
@enduml
\```

For business logic and use cases, see [FEATURE-LOYALTY-POINTS.md](../../features/FEATURE-LOYALTY-POINTS.md)
`````

`````

**After (Step 2):** Update `FEATURE-LOYALTY-POINTS.md` to REFERENCE

```markdown
## Database Schema

For the complete database schema, see [LOYALTY-POINTS-SCHEMA.md](../../technical/backend/database/LOYALTY-POINTS-SCHEMA.md)

**Key Tables:**

- `loyalty_points`: Stores point balances
- Foreign keys: `customer_id`, `merchant_id`
```

#### Pattern B: Extract API Content

**Before:** `FEATURE-USER-AUTH.md` has API endpoint details

````markdown
## API Endpoints

### POST /api/auth/register

**Request Body:**

````json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "businessName": "My Store"
}
\```

**Response 201 Created:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGc..."
}
\```

[30 more lines of endpoint specs]
`````

`````

**After (Step 1):** Create `docs/technical/backend/api/AUTH-API.md`

````markdown
---
document_type: "api"
module: "auth"
status: "draft"
version: "1.0.0"
last_updated: "2026-01-27"
author: "@Backend"

keywords:
  - "authentication API"
  - "user registration"
  - "JWT tokens"

related_docs:
  feature_design: "docs/technical/features/FEATURE-USER-AUTH.md"
  database_schema: "docs/technical/backend/database/USERS-SCHEMA.md"
---

# API Design: Authentication

## Endpoints

### POST /api/auth/register

User registration with email/password.

**Request:**

| Field        | Type   | Required | Constraints                        |
| :----------- | :----- | :------- | :--------------------------------- |
| email        | string | Yes      | Valid email format                 |
| password     | string | Yes      | Min 8 chars, 1 uppercase, 1 number |
| businessName | string | Yes      | 3-255 characters                   |

**Example Request:**

````json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "businessName": "My Store"
}
\```

**Responses:**

| Status | Description         | Body                          |
| :----- | :------------------ | :---------------------------- |
| 201    | Created             | User object + JWT token       |
| 400    | Invalid input       | Error details                 |
| 409    | Email already exists| Error message                 |

For feature requirements, see [FEATURE-USER-AUTH.md](../../features/FEATURE-USER-AUTH.md)
`````

````

**After (Step 2):** Update `FEATURE-USER-AUTH.md` to REFERENCE

```markdown
## API Implementation

For complete API specifications, see [AUTH-API.md](../../technical/backend/api/AUTH-API.md)

**Key Endpoints:**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Authentication
- `POST /api/auth/refresh` - Token renewal
```

#### Pattern C: Extract UX Content

**Before:** `FEATURE-PRODUCT-CATALOG.md` has UI screen details

```markdown
## User Interface

### Product List Screen

**Layout:**

- Header: "Products" title + search bar + filter button
- Body: Grid of product cards (2 columns on mobile, 4 on desktop)
- Each card shows: image, name, price, stock, edit button

**Interactions:**

- Tap card: Navigate to product detail
- Tap edit: Open edit modal
- Pull to refresh: Reload product list
- Search bar: Filter products by name/SKU

[50 more lines of UI details]
```

**After (Step 1):** Create `docs/technical/frontend/ux/UX-PRODUCT-CATALOG.md`

```markdown
---
document_type: "ux"
module: "products"
status: "draft"
version: "1.0.0"
last_updated: "2026-01-27"
author: "@Frontend"

keywords:
  - "product catalog"
  - "product list"
  - "UX flow"
  - "user interface"

related_docs:
  feature_design: "docs/technical/features/FEATURE-PRODUCT-CATALOG.md"
  api_design: "docs/technical/backend/api/PRODUCTS-API.md"
---

# UX Flow: Product Catalog

## Screens

### 1. Product List

**Purpose:** Display all products for the merchant with search/filter capabilities.

**Layout:**

- **Header:** "Products" title, search bar, filter button
- **Body:** Grid (2 cols mobile, 4 cols desktop)
- **Card:** Product image, name, price, stock, edit button

**Interactions:**

- Tap card → Navigate to product detail
- Tap edit → Open edit modal
- Pull to refresh → Reload list
- Search bar → Filter by name/SKU
- Filter button → Open filter sheet

**States:**

- Empty state: "No products yet. Tap + to add."
- Loading: Skeleton cards
- Error: "Failed to load. Tap to retry."

For business requirements, see [FEATURE-PRODUCT-CATALOG.md](../../features/FEATURE-PRODUCT-CATALOG.md)
```

**After (Step 2):** Update `FEATURE-PRODUCT-CATALOG.md` to REFERENCE

```markdown
## User Experience

For complete UX flows and screen designs, see [UX-PRODUCT-CATALOG.md](../../technical/frontend/ux/UX-PRODUCT-CATALOG.md)

**Key Screens:**

- Product List: Grid view with search/filter
- Product Detail: Full product info + edit
- Add/Edit Product: Form with validation
```

### Step 3: Update Cross-References

**Use:** `related-docs-sync` skill

**Pattern:** Update `related_docs` in YAML frontmatter of ALL affected documents.

**Example:**

`FEATURE-LOYALTY-POINTS.md`:

```yaml
related_docs:
  database_schema: "docs/technical/backend/database/LOYALTY-POINTS-SCHEMA.md"
  api_design: "docs/technical/backend/api/LOYALTY-API.md"
  ux_flow: "docs/technical/frontend/ux/UX-LOYALTY.md"
```

`LOYALTY-POINTS-SCHEMA.md`:

```yaml
related_docs:
  feature_design: "docs/technical/features/FEATURE-LOYALTY-POINTS.md"
  api_design: "docs/technical/backend/api/LOYALTY-API.md"
```

`LOYALTY-API.md`:

```yaml
related_docs:
  feature_design: "docs/technical/features/FEATURE-LOYALTY-POINTS.md"
  database_schema: "docs/technical/backend/database/LOYALTY-POINTS-SCHEMA.md"
```

### Step 4: Update Index

**Use:** `doc-index-update` skill

Add new documents to relevant index files:

- `docs/technical/backend/database/README.md`
- `docs/technical/backend/api/README.md`
- `docs/technical/frontend/ux/README.md`

### Step 5: Commit Changes

**Pattern:** Atomic commits per extraction

```bash
git add docs/technical/backend/database/LOYALTY-POINTS-SCHEMA.md
git add docs/technical/features/FEATURE-LOYALTY-POINTS.md
git commit -m "docs(loyalty): extract database schema from feature doc

- Created LOYALTY-POINTS-SCHEMA.md with complete schema
- Updated FEATURE-LOYALTY-POINTS.md to reference schema
- Added cross-references in frontmatter

Fixes separation of concerns violation"
```

## Common Refactoring Scenarios

### Scenario 1: Feature Doc Has Everything

**Problem:** `FEATURE-X.md` contains:

- 100 lines of database schema
- 150 lines of API specs
- 80 lines of UX flows

**Solution:**

1. Extract schema → Create `X-SCHEMA.md`
2. Extract API → Create `X-API.md`
3. Extract UX → Create `UX-X.md`
4. Update `FEATURE-X.md` to reference all 3
5. Update cross-references
6. 3 separate commits

### Scenario 2: Database Doc Has UI Flows

**Problem:** `DATABASE-SCHEMA.md` contains:

- Correct: Table definitions
- ❌ WRONG: "User clicks button, then API calls DB..."

**Solution:**

1. Extract UI flow → Move to `UX-X.md`
2. Remove from `DATABASE-SCHEMA.md`
3. Add reference: "For user flow, see [UX-X.md]"
4. 1 commit

### Scenario 3: API Doc Has Database Details

**Problem:** `API-DESIGN.md` contains:

- Correct: Endpoint specs
- ❌ WRONG: Complete SQL schemas

**Solution:**

1. Extract SQL → Move to `X-SCHEMA.md`
2. Update `API-DESIGN.md`: "Uses `products` table (see [PRODUCTS-SCHEMA.md])"
3. 1 commit

## Validation Checklist

After refactoring:

- [ ] Each document has ONLY its PRIMARY content
- [ ] Cross-references use Markdown links
- [ ] `related_docs` frontmatter is bidirectional
- [ ] No content duplication across docs
- [ ] Index files updated
- [ ] Frontmatter validation passes
- [ ] Commit messages explain extraction

## Anti-Patterns (NEVER DO)

```markdown
<!-- ❌ NEVER: Copy-paste content -->

In FEATURE-X.md:
"See PRODUCTS-SCHEMA.md for schema"
[Then copy entire schema anyway]

<!-- ✅ CORRECT: Reference only -->

For the complete database schema, see [PRODUCTS-SCHEMA.md](...)

**Key Tables:**

- `products`: Stores product catalog
- `categories`: Product categories

<!-- ❌ NEVER: Partial extraction -->

Move 50% of schema to SCHEMA.md, leave 50% in FEATURE.md

<!-- ✅ CORRECT: Complete extraction -->

Move 100% of schema, leave summary + reference

<!-- ❌ NEVER: Forget cross-references -->

Create new doc but don't update related_docs

<!-- ✅ CORRECT: Bidirectional references -->

Update related_docs in ALL affected docs
```

## Integration with Other Skills

| Skill                    | When to Chain                               |
| :----------------------- | :------------------------------------------ |
| `frontmatter-validation` | BEFORE refactoring to detect violations     |
| `documentation`          | When creating extracted documents           |
| `related-docs-sync`      | AFTER extraction to update cross-references |
| `doc-index-update`       | AFTER creating new docs to update indexes   |

## Workflow Summary

```
1. Detect violation (frontmatter-validation)
   ↓
2. Identify PRIMARY document type for content
   ↓
3. Create new document (use documentation skill)
   ↓
4. Move content 100% to new document
   ↓
5. Replace with reference + summary in original
   ↓
6. Update related_docs frontmatter (related-docs-sync)
   ↓
7. Update indexes (doc-index-update)
   ↓
8. Commit with descriptive message
```

---

**Version:** 1.0.0
**Last Updated:** 2026-01-27
**Author:** @Scribe
**Related Skills:** documentation, frontmatter-validation, related-docs-sync, doc-index-update
````
