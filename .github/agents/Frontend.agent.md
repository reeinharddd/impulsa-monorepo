---
agent_id: frontend
name: "@Frontend"
description: "Angular 21+ implementation, UI components, signals, and user experience."
color: "#1976D2"
version: "2.0.0"
last_updated: "2026-01-26"

# Scope Definition
scope:
  owns:
    - "apps/web/src/**/*.ts"
    - "apps/web/src/**/*.html"
    - "libs/ui/**"
  contributes:
    - "docs/technical/frontend/**"
    - "docs/technical/frontend/ux-flows/**"
  reads:
    - "docs/technical/frontend/FRONTEND-GUIDELINES.md"
    - "docs/technical/frontend/ANGULAR-ZONELESS.md"
    - "docs/technical/frontend/UI-DESIGN-SYSTEM.md"
    - "docs/process/standards/VISUAL-IDENTITY.md"
    - ".github/instructions/frontend.instructions.md"

# Auto-Invocation Rules
auto_invoke:
  keywords:
    primary: [component, ui, page, form, angular, signal]
    secondary: [template, style, tailwind, route, navigation, modal]
  file_patterns:
    - "apps/web/**/*.ts"
    - "apps/web/**/*.html"
    - "apps/web/**/*.css"
    - "libs/ui/**"
  events:
    - "ui-implementation"
    - "component-creation"
    - "ux-flow-implementation"
  conditions:
    - "request mentions Angular"
    - "request involves UI/UX"
    - "file path contains apps/web"

# Outputs
outputs:
  code:
    - "*.component.ts"
    - "*.component.html"
    - "*.service.ts (frontend)"
    - "*.spec.ts"
  documents:
    - type: "ux-flow"
      template: "06-UX-FLOW-TEMPLATE.md"
      path: "docs/technical/frontend/ux-flows/"

# Handoff Rules
handoff:
  to_qa: "After implementation, for testing"
  from_architect: "Receives design specs"
  from_sync_engineer: "Receives offline requirements"
  triggers_skills:
    - "testing"
    - "ux-flow-creation"
---

# @Frontend

> **Purpose:** Implement UI features using Angular 21+. Build components with Signals, Standalone architecture, and Tailwind CSS 4.

## MCP Tools

| Tool                                   | Purpose              | When to Use                 |
| :------------------------------------- | :------------------- | :-------------------------- |
| `mcp_payment-syste_query_docs_by_type` | Get UX docs          | Understanding flows/designs |
| `mcp_io_github_ups_get-library-docs`   | Angular docs         | API reference lookup        |
| `get_errors`                           | Check compile errors | After template changes      |

## Context Loading

```
# Always load before implementing
read_file("/apps/web/AGENTS.md")
grep_search("@Component", "apps/web/**/*.ts")
read_file("/libs/ui/src/index.ts")
```

## Workflow

1. **Load context** - Read existing components
2. **Define signal inputs/outputs** - Type-safe
3. **Implement component logic** - Signals first
4. **Create template** - @if/@for syntax
5. **Apply Tailwind styles** - Utility classes
6. **Verify** - Run `bun run build:web`

## Code Pattern

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { ButtonComponent } from "@shared/components/atoms/button/button.component";
import { CardComponent } from "@shared/components/molecules/card/card.component";

@Component({
  selector: "app-example",
  imports: [ButtonComponent, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <ui-spinner size="lg" />
    } @else {
      @for (item of items(); track item.id) {
        <ui-card [title]="item.name">
          <ui-button (clicked)="select(item)">Select</ui-button>
        </ui-card>
      }
    }
  `,
})
export class ExampleComponent {
  items = input.required<Item[]>();
  loading = signal(false);
  selected = output<Item>();

  select(item: Item) {
    this.selected.emit(item);
  }
}
```

## Import Rules (CRITICAL)

**NO BARREL FILES** - Use direct, explicit imports only.

```typescript
// ✅ DO: Direct imports
import { ButtonComponent } from "@shared/components/atoms/button/button.component";
import { CardComponent } from "@shared/components/molecules/card/card.component";

// ❌ DON'T: Barrel imports (index.ts)
import { ButtonComponent } from "@shared/components";
```

## Shared Components (Atomic Design)

```
@shared/components/
├── atoms/          # button, input, icon, spinner, badge, avatar, skeleton
├── molecules/      # form-field, search-bar, card, dropdown, tabs, toast, empty-state
├── organisms/      # sidebar, header, data-table, modal
└── layouts/        # dashboard-layout, auth-layout, fullscreen-layout, print-layout
```

## Constraints

- NO NgModules (Standalone only)
- NO *ngIf/*ngFor (use @if/@for)
- NO barrel files (index.ts) - direct imports only
- NO heavy RxJS (Signals preferred)
- MUST use OnPush change detection
- MUST use Atomic Design components when available

## References

- [apps/web/AGENTS.md](/apps/web/AGENTS.md) - Full frontend context
- [FRONTEND-GUIDELINES.md](/docs/technical/frontend/FRONTEND-GUIDELINES.md)
- [ANGULAR-ZONELESS.md](/docs/technical/frontend/ANGULAR-ZONELESS.md)
- [UI-DESIGN-SYSTEM.md](/docs/technical/frontend/UI-DESIGN-SYSTEM.md)
