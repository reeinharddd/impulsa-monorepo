---
name: nestjs
description: "NestJS backend development standards. Use when working on API controllers, services, and modules."
event: file-change
auto_trigger: false
version: "1.0.0"
last_updated: "2026-01-30"

# Inputs/Outputs
inputs:
  - source_code
output: nestjs_code
output_format: "NestJS classes"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "file-change"
  file_patterns:
    - "apps/api/**/*.ts"

# Agent Association
called_by: ["@Backend"]
mcp_tools:
  - read_file
---

# NestJS Skill

> **Purpose:** Enforce NestJS architecture: Thin Controllers, Rich Services, DTO Validation.

## Architecture

1.  **Controllers are THIN**
    - Routing and DTO validation ONLY.
    - NO business logic.
    - NO direct DB access.

2.  **Services are RICH**
    - Contain all business logic.
    - Handle transactions.
    - Emit events.

3.  **DTOs are MANDATORY**
    - Validate all inputs with `class-validator`.
    - Separate Create/Update/Response DTOs.

## Patterns

### Controller

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

### Service

```typescript
@Injectable()
export class ResourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  async create(dto: CreateResourceDto) {
    const resource = await this.prisma.resource.create({ data: dto });
    this.events.emit("resource.created", resource);
    return resource;
  }
}
```

## Error Handling

- Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`).
- Log errors with context.
