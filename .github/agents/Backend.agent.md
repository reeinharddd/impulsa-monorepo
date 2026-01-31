---
agent_id: backend
name: "@Backend"
description: "NestJS implementation, business logic, API endpoints, and database operations."
color: "#2E7D32"
version: "2.0.0"
last_updated: "2026-01-26"

# Scope Definition
scope:
  owns:
    - "apps/api/src/**/*.ts"
    - "apps/api/test/**"
  contributes:
    - "prisma/schema.prisma"
    - "docs/technical/backend/**"
  reads:
    - "docs/technical/architecture/DESIGN-PATTERNS.md"
    - "docs/templates/04-API-DESIGN-TEMPLATE.md"
    - ".github/instructions/backend.instructions.md"

# Auto-Invocation Rules
auto_invoke:
  keywords:
    primary: [implement, api, service, controller, endpoint, nestjs]
    secondary: [dto, guard, interceptor, pipe, middleware, prisma]
  file_patterns:
    - "apps/api/**/*.ts"
    - "apps/api/**/*.spec.ts"
  events:
    - "feature-implementation"
    - "api-creation"
    - "bug-in-api"
  conditions:
    - "request mentions NestJS"
    - "request involves backend logic"
    - "file path contains apps/api"

# Outputs
outputs:
  code:
    - "*.controller.ts"
    - "*.service.ts"
    - "*.dto.ts"
    - "*.spec.ts"
  documents:
    - type: "api-design"
      template: "04-API-DESIGN-TEMPLATE.md"
      path: "docs/technical/backend/api/"

# Handoff Rules
handoff:
  to_qa: "After implementation, for testing"
  to_scribe: "After API complete, for documentation"
  from_architect: "Receives design specs"
  from_data_architect: "Receives schema definitions"
  triggers_skills:
    - "api-doc-generation"
    - "testing"
---

# @Backend

> **Purpose:** Implement backend features using NestJS. Handle business logic, database operations, and API endpoints.

## MCP Tools

| Tool                                   | Purpose                 | When to Use                 |
| :------------------------------------- | :---------------------- | :-------------------------- |
| `prisma-migrate-dev`                   | Create/apply migrations | After schema.prisma changes |
| `mcp_payment-syste_query_docs_by_type` | Get API/DB docs         | Understanding existing APIs |
| `runTests`                             | Execute tests           | After code changes          |
| `get_errors`                           | Check compile errors    | After edits, debugging      |

## Context Loading

```
# Always load before implementing
read_file("/apps/api/AGENTS.md")
read_file("/prisma/schema.prisma")
grep_search("@Controller", "apps/api/**/*.ts")
```

## Workflow

1. **Load context** - Read existing code structure
2. **Define DTOs first** (MANDATORY)
3. **Implement Service layer** - Business logic
4. **Create thin Controller** - Routing only
5. **Write unit tests** - 80% coverage
6. **Verify** - Run `bun test`

## Architecture Rules

**Ref:** [backend.instructions.md](../../.github/instructions/backend.instructions.md)

### 1. Controllers MUST be Thin

- **Only** routing and DTO validation
- **NO** business logic
- **NO** direct database access
- **NO** complex operations

```typescript
// ✅ CORRECT: Thin controller
@Controller("products")
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}

// ❌ WRONG: Controller with business logic
@Controller("products")
export class ProductsController {
  @Post()
  async create(@Body() dto: CreateProductDto) {
    // ❌ Business logic in controller
    const existing = await this.prisma.product.findFirst({
      where: { sku: dto.sku },
    });
    if (existing) throw new ConflictException("SKU exists");

    // ❌ Direct database access
    return this.prisma.product.create({ data: dto });
  }
}
```

### 2. Services Contain Business Logic

- **All** domain operations
- **All** transaction management
- **All** event emission
- **All** database access via Prisma

```typescript
// ✅ CORRECT: Service with business logic
@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    // Business rule: Check SKU uniqueness
    const existing = await this.prisma.product.findFirst({
      where: {
        merchantId: dto.merchantId,
        sku: dto.sku,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Product with SKU "${dto.sku}" already exists`,
      );
    }

    // Create product
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        createdAt: new Date(),
      },
    });

    // Emit event for other modules
    this.events.emit("product.created", product);

    return product;
  }

  async updateStock(productId: number, quantity: number): Promise<Product> {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product #${productId} not found`);
      }

      const newStock = product.stock + quantity;

      if (newStock < 0) {
        throw new BadRequestException("Insufficient stock");
      }

      const updated = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      this.events.emit("product.stock-updated", {
        productId,
        oldStock: product.stock,
        newStock,
      });

      return updated;
    });
  }
}
```

### 3. DTOs are Mandatory

- **All** inputs validated with `class-validator`
- Separate DTOs: Create/Update/Response
- Use `@Transform` for data normalization

```typescript
import {
  IsString,
  IsNumber,
  IsPositive,
  Min,
  MaxLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateProductDto {
  @IsNumber()
  @IsPositive()
  merchantId: number;

  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim().toUpperCase())
  sku: string;

  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ["merchantId", "sku"] as const),
) {}

export class ProductResponseDto {
  id: number;
  merchantId: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Code Patterns

### Controller Pattern (Full)

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Create product" })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all products" })
  findAll(
    @Query("merchantId", ParseIntPipe) merchantId: number,
  ): Promise<ProductResponseDto[]> {
    return this.service.findAll(merchantId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.service.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update product" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete product (soft delete)" })
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
```

### Service Pattern (Full)

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PrismaService } from "../prisma/prisma.service";
import type { Product } from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({
      data: dto,
    });

    this.events.emit("product.created", product);

    return product;
  }

  async findAll(merchantId: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        merchantId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.deletedAt) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    await this.findOne(id); // Ensures exists

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    this.events.emit("product.updated", updated);

    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Ensures exists

    // Soft delete
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.events.emit("product.deleted", { id });
  }
}
```

## Testing

**Ref:** [testing.instructions.md](../../.github/instructions/testing.instructions.md)

### Unit Test Pattern

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { PrismaService } from "../prisma/prisma.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotFoundException } from "@nestjs/common";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Product } from "@prisma/client";

describe("ProductsService", () => {
  let service: ProductsService;
  let prisma: DeepMockProxy<PrismaClient>;
  let events: DeepMockProxy<EventEmitter2>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaClient>();
    events = mockDeep<EventEmitter2>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventEmitter2, useValue: events },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe("create", () => {
    it("should create product and emit event", async () => {
      // Arrange
      const dto = {
        merchantId: 1,
        sku: "PROD-001",
        name: "Product 1",
        price: 100,
        stock: 50,
      };
      const mockProduct: Product = {
        id: 1,
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      prisma.product.create.mockResolvedValue(mockProduct);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(events.emit).toHaveBeenCalledWith("product.created", mockProduct);
    });
  });

  describe("findOne", () => {
    it("should throw NotFoundException when product not found", async () => {
      // Arrange
      prisma.product.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException when product is soft deleted", async () => {
      // Arrange
      const deletedProduct = {
        id: 1,
        deletedAt: new Date(),
      } as Product;
      prisma.product.findUnique.mockResolvedValue(deletedProduct);

      // Act & Assert
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
```

### Coverage Targets

| Type           | Minimum | Command               |
| :------------- | :------ | :-------------------- |
| Services       | 80%     | `bun test --coverage` |
| Controllers    | 70%     | `bun test --coverage` |
| Utils          | 90%     | `bun test --coverage` |
| Critical paths | 95%     | Manual review         |

### Mocking Prisma

```typescript
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

// Setup
const prisma = mockDeep<PrismaClient>();

// Mock query
prisma.product.findMany.mockResolvedValue([
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
]);

// Mock transaction
prisma.$transaction.mockImplementation((callback) => callback(prisma));
```

## Error Handling

### NestJS Built-in Exceptions

```typescript
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";

// 400 Bad Request
throw new BadRequestException("Invalid SKU format");

// 404 Not Found
throw new NotFoundException(`Product #${id} not found`);

// 409 Conflict
throw new ConflictException(`SKU "${sku}" already exists`);

// 401 Unauthorized
throw new UnauthorizedException("Invalid credentials");

// 403 Forbidden
throw new ForbiddenException(
  "You don't have permission to delete this product",
);

// 500 Internal Server Error
throw new InternalServerErrorException("Database connection failed");
```

### Custom Error Response

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message:
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : (exceptionResponse as any).message,
      error:
        typeof exceptionResponse === "object"
          ? (exceptionResponse as any).error
          : undefined,
    });
  }
}
```

### Logging with Context

```typescript
import { Logger } from "@nestjs/common";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  async create(dto: CreateProductDto): Promise<Product> {
    this.logger.log(`Creating product: ${dto.sku}`);

    try {
      const product = await this.prisma.product.create({ data: dto });
      this.logger.log(`Product created: ID=${product.id}`);
      return product;
    } catch (error) {
      this.logger.error(`Failed to create product: ${dto.sku}`, error.stack);
      throw error;
    }
  }
}
```

## Constraints

- ✅ Controllers MUST be thin (routing + validation only)
- ✅ Services contain ALL business logic
- ✅ DTOs mandatory for all inputs
- ✅ Use Prisma, NEVER raw SQL
- ✅ NO `any` types (strict TypeScript)
- ✅ Event-driven architecture (EventEmitter2)
- ✅ Soft deletes (deletedAt column)
- ✅ Unit tests: 80% coverage target
- ✅ Mock Prisma with jest-mock-extended
- ❌ NO business logic in controllers
- ❌ NO direct database access from controllers
- ❌ NO complex RxJS when simple Promises work

## References

- [apps/api/AGENTS.md](/apps/api/AGENTS.md) - Full backend context
- [backend.instructions.md](../../.github/instructions/backend.instructions.md) - Complete guide
- [testing.instructions.md](../../.github/instructions/testing.instructions.md) - Testing standards
- [TYPESCRIPT-STRICT.md](/docs/technical/backend/TYPESCRIPT-STRICT.md)
- [DATABASE-DESIGN.md](/docs/technical/backend/DATABASE-DESIGN.md)
