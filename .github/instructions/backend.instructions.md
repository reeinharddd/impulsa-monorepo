---
applyTo: "apps/api/**/*.ts"
excludeAgent: "code-review"
---

# Backend Instructions

These instructions apply to all TypeScript files in the API application.

## Architecture Rules

1. **Controllers MUST be thin**
   - Only routing and DTO validation
   - No business logic
   - No direct database access

2. **Services contain business logic**
   - All domain operations
   - Transaction management
   - Event emission

3. **DTOs are mandatory**
   - All inputs validated with `class-validator`
   - Separate Create/Update/Response DTOs
   - Use transforms for data normalization

## Code Patterns

### Controller Pattern

```typescript
@Controller("resource")
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Post()
  create(@Body() dto: CreateResourceDto) {
    return this.service.create(dto);
  }
}
```

### Service Pattern

```typescript
@Injectable()
export class ResourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  async create(dto: CreateResourceDto): Promise<Resource> {
    const resource = await this.prisma.resource.create({ data: dto });
    this.events.emit("resource.created", resource);
    return resource;
  }
}
```

## Testing

- Unit tests in same directory as source: `*.spec.ts`
- Integration tests in `test/` directory
- Mock Prisma with `jest-mock-extended`
- Target 80% coverage for services

## Error Handling

- Use NestJS built-in exceptions
- Log errors with context
- Return consistent error responses
