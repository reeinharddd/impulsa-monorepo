# AGENTS.md - Backend API

> **Scope:** `apps/api/` | **Primary Agent:** @Backend

This AGENTS.md provides backend-specific context for the NestJS API.

---

## Quick Commands

```bash
# Start development server
bun run --filter @impulsa/api dev

# Run tests
bun run --filter @impulsa/api test

# Generate Prisma client
bunx prisma generate

# Run migration
bunx prisma migrate dev --name [description]

# Open Prisma Studio
bunx prisma studio
```

---

## Module Structure

```
apps/api/src/
├── main.ts                 # App bootstrap
├── app.module.ts           # Root module
├── config/                 # Configuration (env validation)
├── modules/
│   ├── auth/              # Authentication
│   ├── merchants/         # Merchant management
│   ├── products/          # Product catalog
│   ├── inventory/         # Stock management
│   ├── sales/             # POS transactions
│   ├── payments/          # Payment processing
│   └── [feature]/         # Each feature module
│       ├── [feature].module.ts
│       ├── [feature].controller.ts
│       ├── [feature].service.ts
│       ├── [feature].service.spec.ts
│       ├── dto/
│       │   ├── create-[feature].dto.ts
│       │   ├── update-[feature].dto.ts
│       │   └── [feature]-response.dto.ts
│       └── entities/
│           └── [feature].entity.ts
└── prisma/
    ├── schema.prisma
    └── migrations/
```

---

## Architecture Rules

### Controllers (Thin Layer)

```typescript
@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'List products' })
  findAll(
    @Query() query: ListProductsDto,
  ): Promise<PaginatedResponse<Product>> {
    return this.productService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.create(dto);
  }
}
```

### Services (Business Logic)

```typescript
@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    // Business logic here
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        sku: this.generateSku(dto),
      },
    });

    this.eventEmitter.emit('product.created', product);
    return product;
  }
}
```

### DTOs (Validation)

```typescript
export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Math.round(value * 100) / 100)
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}
```

---

## Payment Provider Pattern

For multi-country payment support, use the Strategy + Factory pattern:

```typescript
// Factory selects provider
const provider = this.providerFactory.getProvider(payment.country);

// All providers implement same interface
interface IPaymentProvider {
  authorize(payment: Payment): Promise<AuthorizationResult>;
  capture(authId: string, amount: Money): Promise<CaptureResult>;
  refund(captureId: string, amount?: Money): Promise<RefundResult>;
}
```

**Supported Countries:**

- 🇲🇽 Mexico: Conekta
- 🇨🇴 Colombia: PayU
- 🇦🇷 Argentina: MercadoPago
- 🇨🇱 Chile: Khipu

---

## Database Access

```typescript
// ✅ Use Prisma with proper includes
const product = await this.prisma.product.findUnique({
  where: { id },
  include: {
    category: true,
    merchant: true,
  },
});

// ✅ Use transactions for multiple operations
await this.prisma.$transaction(async (tx) => {
  await tx.order.create({ data: orderData });
  await tx.inventory.decrement({ ... });
});

// ❌ NEVER use raw SQL
await this.prisma.$queryRaw`...`; // Forbidden
```

---

## Testing

```bash
# Unit tests for a specific module
bun test apps/api/src/modules/products/

# With coverage
bun test --coverage apps/api/src/modules/products/

# Integration tests
bun run --filter @impulsa/api test:e2e
```

**Coverage targets:**

- Services: 80%
- Controllers: 70%
- Critical paths: 95%

---

## Environment Variables

See `.env.example` for required variables. Key ones:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
CONEKTA_API_KEY=...
PAYU_API_KEY=...
```
