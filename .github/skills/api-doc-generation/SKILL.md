---
name: api-doc-generation
description: "Generate and update API documentation from NestJS controllers. Use when modifying controllers, adding endpoints, or when the user asks about API documentation."
event: controller-change
auto_trigger: true
version: "3.0.0"
last_updated: "2026-01-27"

# Inputs/Outputs
inputs:
  - controller_files
  - existing_api_docs
  - dto_files
output: updated_api_docs
output_format: "Markdown API doc (04-API-DESIGN-TEMPLATE.md)"
output_path: "docs/technical/backend/api/"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "controller-change"
    - "api-endpoint-added"
  file_patterns:
    - "apps/api/**/*.controller.ts"
    - "apps/api/**/*.dto.ts"
  conditions:
    - "controller file modified"
    - "new endpoint added"

# Validation
validation_rules:
  - "all endpoints documented"
  - "request/response DTOs included"
  - "status codes listed"

# Chaining
chain_after: []
chain_before: [doc-index-update]

# Agent Association
called_by: ["@Backend"]
mcp_tools:
  - grep_search
  - read_file
  - mcp_payment-syste_query_docs_by_type
---

# API Documentation Generation Skill

> **Purpose:** Generate and update API documentation from NestJS controllers. Keeps API docs in sync with implementation.

## Trigger

**When:** Controller files (`*.controller.ts`) are modified
**Context Needed:** Controller code, DTOs, existing API docs
**MCP Tools:** `grep_search`, `read_file`, `mcp_payment-syste_query_docs_by_type`

## Controller → Doc Mapping

Parse NestJS decorators to extract:

```typescript
@Controller('products')          // Base path: /api/v1/products
@Get(':id')                      // GET /api/v1/products/:id
@Post()                          // POST /api/v1/products
@UseGuards(JwtAuthGuard)         // Auth required
@ApiOperation({ summary: '...'}) // Description
```

## Extraction Rules

| Decorator                 | Extracted Info |
| :------------------------ | :------------- |
| `@Controller(path)`       | Base path      |
| `@Get/@Post/@Put/@Delete` | HTTP method    |
| `@Param/@Query/@Body`     | Parameters     |
| `@UseGuards`              | Authentication |
| `@ApiOperation`           | Description    |
| `@ApiResponse`            | Response codes |

## API Doc Format

````markdown
### GET /api/v1/products/:id

**Description:** Get product by ID

**Authentication:** Required (JWT)

**Parameters:**

| Name | In   | Type   | Required | Description |
| :--- | :--- | :----- | :------- | :---------- |
| id   | path | string | Yes      | Product ID  |

**Responses:**

| Code | Description | Schema             |
| :--- | :---------- | :----------------- |
| 200  | Success     | ProductResponseDto |
| 404  | Not found   | ErrorDto           |

**Example Request:**

```bash
curl -X GET /api/v1/products/abc123 \
  -H "Authorization: Bearer {token}"
```
````

````

## Frontmatter Template

```yaml
---
document_type: "api-design"
module: "[module]"
status: "approved"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
author: "@Backend"

keywords:
  - "api"
  - "rest"
  - "[module]"

api_metadata:
  base_path: "/api/v1/[resource]"
  auth_required: true
  rate_limited: true
---
````

## Workflow

1. **Detect changes** - Which controllers changed?
2. **Parse decorators** - Extract API metadata
3. **Load DTOs** - Get request/response types
4. **Find existing doc** - Match by module
5. **Update endpoints** - Add/modify/remove
6. **Bump version** - If endpoints changed
7. **Update date** - Set last_updated

## DTO Extraction

```typescript
// From DTO class
export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}

// Generate table
| Field | Type   | Required | Validation   |
| :---- | :----- | :------- | :----------- |
| name  | string | Yes      | MinLength(1) |
| price | number | No       | -            |
```

## What to Include in API Docs

### ✅ INCLUDE (API Design Docs)

1. **Endpoints**
   - HTTP method (GET, POST, PUT, DELETE, PATCH)
   - Full path with base URL
   - Authentication requirement
2. **Request DTOs**
   - Field name
   - Data type
   - Required/Optional
   - Validation rules (class-validator decorators)
   - Examples
3. **Response DTOs**
   - Field name
   - Data type
   - Description
   - Examples
4. **Query Parameters**
   - Name
   - Type
   - Required/Optional
   - Default values
   - Examples
5. **Path Parameters**
   - Name
   - Type
   - Description
6. **Headers**
   - Required headers (Authorization, Content-Type)
   - Optional headers
7. **Status Codes**
   - Success codes (200, 201, 204)
   - Error codes (400, 401, 403, 404, 500)
   - Description for each
8. **Error Responses**
   - Standard error format
   - Error codes
   - Error messages
   - Examples
9. **Rate Limiting**
   - Requests per minute/hour
   - Rate limit headers
10. **Versioning**
    - API version (v1, v2)
    - Deprecation notices
11. **Authentication/Authorization**
    - Auth type (JWT, API Key)
    - Required roles/permissions
    - Token format
12. **Examples**
    - Request examples (curl, HTTP)
    - Response examples (JSON)

### ❌ DO NOT INCLUDE (Belongs Elsewhere)

1. **Business Logic** → Move to `docs/technical/backend/features/`
   - Calculation algorithms
   - Decision trees
   - Processing workflows
   - State machines
2. **UI Implementation** → Move to `docs/technical/frontend/ux-flows/`
   - Screen mockups
   - User interactions
   - Navigation flows
   - Form validation (UI-level)
3. **Database Structure** → Move to `docs/technical/backend/database/`
   - Table definitions
   - Column types
   - Indexes
   - Foreign keys
4. **Service Layer Code** → Keep in code, not docs
   - Internal method implementations
   - Helper functions
   - Utility classes

## NestJS Patterns

### Controller Pattern

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";

@Controller("products")
@UseGuards(JwtAuthGuard) // Auth required for all endpoints
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @ApiResponse({ status: 400, description: "Validation error" })
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 404, description: "Product not found" })
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }
}
```

**Extract to Docs:**

```markdown
### POST /api/v1/products

**Description:** Create a new product

**Authentication:** Required (JWT)

**Request Body:** CreateProductDto

**Responses:**

| Code | Description      |
| :--- | :--------------- |
| 201  | Created          |
| 400  | Validation error |
| 401  | Unauthorized     |

---

### GET /api/v1/products/:id

**Description:** Get product by ID

**Authentication:** Required (JWT)

**Path Parameters:**

| Name | Type   | Description |
| :--- | :----- | :---------- |
| id   | string | Product ID  |

**Responses:**

| Code | Description       |
| :--- | :---------------- |
| 200  | Success           |
| 404  | Product not found |
| 401  | Unauthorized      |
```

### Guards (Authentication/Authorization)

```typescript
// Detect from decorators
@UseGuards(JwtAuthGuard)  // JWT authentication required
@UseGuards(RolesGuard)    // Role-based authorization
@Roles('admin', 'owner')  // Specific roles required
```

**Document as:**

```markdown
**Authentication:** Required (JWT)
**Authorization:** Roles: `admin`, `owner`
```

### Interceptors (Logging, Transform)

```typescript
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(TransformInterceptor)
```

**Document if affects response:**

```markdown
**Response Format:** All responses wrapped in standard format

\`\`\`json
{
"data": { ... },
"meta": {
"timestamp": "2026-01-27T10:00:00Z"
}
}
\`\`\`
```

### Pipes (Validation)

```typescript
@Post()
create(@Body(ValidationPipe) dto: CreateProductDto) { }
```

**Document validation in DTO table:**

| Field | Type   | Required | Validation         |
| :---- | :----- | :------- | :----------------- |
| name  | string | Yes      | MinLength(1)       |
| email | string | Yes      | IsEmail            |
| price | number | No       | Min(0), IsPositive |

### Decorators to Extract

| Decorator         | Document As            |
| :---------------- | :--------------------- |
| `@Get()`          | GET endpoint           |
| `@Post()`         | POST endpoint          |
| `@Put()`          | PUT endpoint           |
| `@Delete()`       | DELETE endpoint        |
| `@Patch()`        | PATCH endpoint         |
| `@Param()`        | Path parameter         |
| `@Query()`        | Query parameter        |
| `@Body()`         | Request body           |
| `@Headers()`      | Required headers       |
| `@UseGuards()`    | Authentication/Auth    |
| `@ApiOperation()` | Endpoint description   |
| `@ApiResponse()`  | Response codes/schemas |
| `@ApiTags()`      | API grouping           |

## OpenAPI/Swagger Integration

If using `@nestjs/swagger`, extract:

```typescript
@ApiTags("products")
@Controller("products")
export class ProductsController {
  @Post()
  @ApiOperation({ summary: "Create product" })
  @ApiResponse({
    status: 201,
    description: "Created",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  create(@Body() dto: CreateProductDto) {}
}
```

**Generate:**

```markdown
## Products

### POST /api/v1/products

**Description:** Create product

**Request:** CreateProductDto

**Responses:**

| Code | Description |
| :--- | :---------- |
| 201  | Created     |
| 400  | Bad Request |
```

## Testing Examples

Include request/response examples for each endpoint:

````markdown
### Example: Create Product

**Request:**

```bash
curl -X POST /api/v1/products \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP-001",
    "price": 999.99
  }'
```

**Response (201):**

```json
{
  "id": "prod_abc123",
  "name": "Laptop",
  "sku": "LAP-001",
  "price": 999.99,
  "createdAt": "2026-01-27T10:00:00Z"
}
```

**Response (400):**

```json
{
  "statusCode": 400,
  "message": ["name should not be empty", "price must be a positive number"],
  "error": "Bad Request"
}
```
````

## Separation of Concerns Example

### ❌ WRONG: Business Logic in API Doc

```markdown
### POST /api/v1/orders

**Business Logic:**

1. Calculate subtotal: sum(item.price \* item.quantity)
2. Apply discounts:
   - VIP: 15% off
   - First order: 10% off
3. Calculate tax: subtotal \* 0.16
4. Calculate total: subtotal - discount + tax
```

**FIX:** Move to `docs/technical/backend/features/ORDER-CALCULATION.md`

In API doc, just reference:

```markdown
**Note:** Order total calculation follows [Order Calculation Logic](../features/ORDER-CALCULATION.md)
```

---

### ❌ WRONG: UI Flow in API Doc

```markdown
### POST /api/v1/products

**User Flow:**

1. User clicks "Add Product" button
2. Form appears with fields
3. User fills in name, SKU, price
4. User clicks "Save"
5. API call is made
```

**FIX:** Move to `docs/technical/frontend/ux-flows/PRODUCT-CREATION.md`

---

### ❌ WRONG: Database Schema in API Doc

```markdown
### POST /api/v1/products

**Database:**

CREATE TABLE products (
id String PRIMARY KEY,
name String NOT NULL,
sku String NOT NULL,
...
);
```

**FIX:** Move to `docs/technical/backend/database/INVENTORY-SCHEMA.md`

## API Doc Format Template

````markdown
## [Resource Name]

### [METHOD] /api/v1/[path]

**Description:** [Brief description]

**Authentication:** Required (JWT) | Not required

**Authorization:** [Roles if applicable]

**Path Parameters:**

| Name | Type   | Description |
| :--- | :----- | :---------- |
| id   | string | Resource ID |

**Query Parameters:**

| Name  | Type   | Required | Default | Description    |
| :---- | :----- | :------- | :------ | :------------- |
| page  | number | No       | 1       | Page number    |
| limit | number | No       | 10      | Items per page |

**Request Body:** [DTO Name]

| Field | Type   | Required | Validation | Description |
| :---- | :----- | :------- | :--------- | :---------- |
| name  | string | Yes      | MinLength  | Item name   |

**Responses:**

| Code | Description      | Schema      |
| :--- | :--------------- | :---------- |
| 200  | Success          | ResponseDto |
| 400  | Validation error | ErrorDto    |
| 401  | Unauthorized     | ErrorDto    |
| 404  | Not found        | ErrorDto    |

**Example Request:**

```bash
curl -X POST /api/v1/resource \
  -H "Authorization: Bearer {token}" \
  -d '{ "name": "Example" }'
```

**Example Response (200):**

```json
{
  "id": "abc123",
  "name": "Example",
  "createdAt": "2026-01-27T10:00:00Z"
}
```
````

## Frontmatter Template

```yaml
---
document_type: "api-design"
module: "[module]"
status: "approved"
version: "1.0.0"
last_updated: "2026-01-27"
author: "@Backend"

keywords:
  - "api"
  - "rest"
  - "[module]"
  - "[resource]"

related_docs:
  database_schema: "docs/technical/backend/database/SCHEMA.md"
  feature_design: "docs/technical/backend/features/FEATURE.md"
  ux_flow: ""

api_metadata:
  base_path: "/api/v1/[resource]"
  auth_required: true
  rate_limit: "100 requests/minute"
  versioning: "v1"
---
```

## Workflow

1. **Detect changes** - Which controllers changed?
2. **Parse decorators** - Extract API metadata
3. **Load DTOs** - Get request/response types
4. **Find existing doc** - Match by module
5. **Update endpoints** - Add/modify/remove
6. **Bump version** - If endpoints changed
7. **Update date** - Set last_updated
8. **Validate** - No business logic, UI, or DB in doc

## Validation Checklist

After generating API docs:

- [ ] All endpoints documented
- [ ] Request/Response DTOs complete
- [ ] Status codes listed
- [ ] Examples provided
- [ ] Authentication/Authorization clear
- [ ] NO business logic in doc
- [ ] NO UI flows in doc
- [ ] NO database schema in doc
- [ ] Cross-references to related docs
- [ ] Frontmatter complete

## Reference

- [04-API-DESIGN-TEMPLATE.md](/docs/templates/04-API-DESIGN-TEMPLATE.md)
- [backend.instructions.md](../instructions/backend.instructions.md)
- [DOCUMENTATION-WORKFLOW.md](/docs/process/standards/DOCUMENTATION-WORKFLOW.md)
