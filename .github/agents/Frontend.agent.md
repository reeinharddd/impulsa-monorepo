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

## Angular 21+ Rules

**Ref:** [frontend.instructions.md](../../.github/instructions/frontend.instructions.md)

### 1. Standalone Components ONLY

- ❌ **NO NgModules**
- ✅ Import dependencies directly
- ✅ Do NOT set `standalone: true` (it's the default)

```typescript
// ✅ CORRECT: Standalone component (Angular 21)
@Component({
  selector: "app-product-list",
  imports: [ButtonComponent, CardComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
})
export class ProductListComponent {}

// ❌ WRONG: Using NgModule
@NgModule({
  declarations: [ProductListComponent],
  imports: [CommonModule],
})
export class ProductsModule {}
```

### 2. Signals First

- ✅ Use `input()` and `output()` functions
- ✅ Use `computed()` for derived state
- ✅ Use `signal()` for local state
- ⚠️ Avoid complex RxJS when signals work

```typescript
import { Component, input, output, computed, signal } from "@angular/core";

@Component({
  selector: "app-product-card",
  template: `
    <div>
      <h3>{{ product().name }}</h3>
      <p>{{ formattedPrice() }}</p>
      <button (click)="handleClick()">
        {{ "PRODUCTS.ADD_TO_CART" | translate }}
      </button>
    </div>
  `,
})
export class ProductCardComponent {
  // Inputs
  product = input.required<Product>();
  currency = input("MXN");

  // Outputs
  addToCart = output<Product>();

  // Computed (derived state)
  formattedPrice = computed(() => {
    const price = this.product().price;
    return `$${price.toFixed(2)} ${this.currency()}`;
  });

  // Local state
  isLoading = signal(false);

  handleClick(): void {
    if (this.isLoading()) return; // Guard clause
    this.addToCart.emit(this.product());
  }
}
```

### 3. Change Detection

- ✅ **ALWAYS** use `OnPush`
- ❌ **NEVER** mutate inputs directly

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush, // MANDATORY
})
export class MyComponent {}
```

## Import Rules (CRITICAL - NO BARREL FILES)

**Use direct, explicit imports only. Never create or use `index.ts` barrel files.**

```typescript
// ✅ DO: Direct component imports
import { ButtonComponent } from "@shared/components/atoms/button/button.component";
import { CardComponent } from "@shared/components/molecules/card/card.component";
import { SidebarComponent } from "@shared/components/organisms/sidebar/sidebar.component";
import type { ButtonVariant } from "@shared/components/atoms/button/button.component";

// ❌ DON'T: Barrel imports
import { ButtonComponent } from "@shared/components";
import { ButtonComponent, CardComponent } from "@shared";
import * as Components from "@shared/components";
```

**Why no barrels?**

- Prevents circular dependencies
- Predictable tree-shaking
- Clear IDE navigation (go-to-definition)
- Explicit dependency graph

## Shared Components (Atomic Design)

```
@shared/components/
├── atoms/          # Independent, NO dependencies on other atoms
│   ├── button/
│   ├── icon/
│   ├── spinner/
│   ├── badge/
│   └── avatar/
├── molecules/      # Combinations of atoms
│   ├── loading-button/  (button + spinner)
│   ├── search-bar/      (input + icon)
│   └── form-field/      (input + label + error)
├── organisms/      # Complex UI sections
│   ├── sidebar/
│   ├── header/
│   └── data-table/
└── layouts/        # Page-level layouts
    ├── dashboard-layout/
    └── auth-layout/
```

### Atomic Design Rules (CRITICAL)

**Atoms MUST be independent** - No atom can import another atom.

```typescript
// ✅ Atom: Pure, independent
@Component({ selector: "ui-button" })
export class ButtonComponent {
  /* No imports from other atoms */
}

// ✅ Molecule: Combines atoms
@Component({
  selector: "ui-loading-button",
  imports: [ButtonComponent, SpinnerComponent], // Combines 2 atoms
})
export class LoadingButtonComponent {}

// ❌ DON'T: Atom importing another atom
@Component({
  selector: "ui-button",
  imports: [SpinnerComponent], // WRONG - atoms must be independent
})
```

**Choose the right level:**

- Need loading state? → Use `ui-loading-button` (molecule)
- Need simple button? → Use `ui-button` (atom)

## Icon System Rules (MANDATORY)

**Ref:** [ADR-003](../../../docs/technical/architecture/adr/003-ICON-SYSTEM.md)

1. **Library:** Use `lucide-angular`.
2. **Import:** Import icons directly from the library.
3. **Usage:** Bind the icon object to `[name]`. NEVER use string names.
4. **Expose:** Expose icons as `protected readonly` properties in your class.

```typescript
// ✅ CORRECT PATTERN
import { Home, Settings, Search, X } from "lucide-angular";

@Component({
  template: `
    <ui-icon [name]="Home" size="md" />
    <ui-icon [name]="Settings" size="lg" class="text-brand-primary" />
  `,
})
export class MyComponent {
  protected readonly Home = Home;
  protected readonly Settings = Settings;
}

// ❌ FORBIDDEN: String-based names (COMPILE ERROR)
<ui-icon name="home" />
<ui-icon [name]="'settings'" />

// ❌ NEVER: Inline SVGs
<svg><path d="..."></svg>

// ❌ NEVER: Icon fonts
<i class="fa fa-home"></i>
```

**Icon sizes:** `xs` (12px), `sm` (16px), `md` (20px), `lg` (24px), `xl` (32px)

**Browse icons:** https://lucide.dev/icons/

## Template Rules

### Control Flow (Use These)

```html
@if (condition) {
<element />
} @else {
<other />
} @for (item of items(); track item.id) {
<element />
} @switch (value) { @case ('a') { <a-element /> } @default {
<default-element /> } }
```

### Do NOT Use (Deprecated)

```html
<!-- FORBIDDEN -->
<div *ngIf="condition">...</div>
<div *ngFor="let item of items">...</div>
<div [ngClass]="{'active': isActive}">...</div>
<div [ngStyle]="{'color': 'red'}">...</div>
```

## Guard Clauses (MUST USE)

Use guard clauses with negated conditions to avoid nested if/else:

```typescript
// ✅ DO: Guard clause with early return
handleClick(event: MouseEvent): void {
  if (this.disabled() || this.loading()) return;

  this.clicked.emit(event);
}

// ✅ DO: Multiple guards
processData(): void {
  if (!this.data()) return;
  if (!this.isValid()) return;

  // Main logic here
  this.doSomething();
}

// ❌ DON'T: Nested conditions
handleClick(event: MouseEvent): void {
  if (!this.disabled()) {
    if (!this.loading()) {
      this.clicked.emit(event);
    }
  }
}

// ❌ DON'T: Positive condition wrapping main logic
processData(): void {
  if (this.data() && this.isValid()) {
    this.doSomething();
  }
}
```

## Internationalization (i18n)

**ALL user-facing text MUST use translations:**

```typescript
// Import TranslateModule
import { TranslateModule } from "@ngx-translate/core";

@Component({
  imports: [TranslateModule],
  template: `
    <!-- ✅ DO: Use translate pipe -->
    <button>{{ "COMMON.BUTTONS.SAVE" | translate }}</button>
    <p>{{ "MESSAGE.WELCOME" | translate: { name: userName() } }}</p>

    <!-- ❌ DON'T: Hardcoded text -->
    <button>Save</button>
    <button>Guardar</button>
  `,
})
export class MyComponent {}
```

**Translation files:** `public_override/assets/i18n/{es,en}.json`

## Tailwind CSS Styling

**Ref:** [tailwind.instructions.md](../../.github/instructions/tailwind.instructions.md)

### Brand Colors (MUST USE)

| Purpose   | Class                | Hex       | Use Case                   |
| :-------- | :------------------- | :-------- | :------------------------- |
| Primary   | `bg-brand-primary`   | `#4c1d95` | CTAs, primary buttons      |
| Secondary | `bg-brand-secondary` | `#10b981` | Success, secondary actions |
| Accent    | `bg-brand-accent`    | `#f97316` | Highlights, warnings       |
| Gold      | `bg-brand-gold`      | `#fcc242` | Premium, special features  |
| Surface   | `bg-brand-surface`   | `#f3f0ff` | Backgrounds, cards         |
| Base      | `bg-brand-base`      | `#cbc3e3` | Subtle backgrounds         |

### Component Styling Patterns

**Buttons:**

```typescript
const buttonBase =
  "inline-flex items-center justify-center font-medium rounded-xl " +
  "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const buttonVariants = {
  primary:
    "bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary shadow-sm",
  secondary:
    "bg-brand-secondary text-white hover:bg-brand-secondary/90 focus:ring-brand-secondary shadow-sm",
  outline:
    "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
};
```

**Cards:**

```html
<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
  <!-- Card content -->
</div>
```

**Form Fields:**

```html
<input
  class="w-full px-4 py-3 rounded-xl border border-gray-300
  focus:ring-2 focus:ring-brand-primary focus:border-brand-primary
  disabled:bg-gray-100 disabled:cursor-not-allowed
  transition-colors duration-200"
/>
```

### Forbidden Patterns

```html
<!-- ❌ DON'T: Inline styles -->
<div style="color: red;">...</div>

<!-- ❌ DON'T: ngStyle directive -->
<div [ngStyle]="{'color': 'red'}">...</div>

<!-- ❌ DON'T: ngClass with objects -->
<div [ngClass]="{'active': isActive}">...</div>

<!-- ✅ DO: Class binding -->
<div [class.active]="isActive()">...</div>

<!-- ✅ DO: Conditional classes in component -->
<div [class]="computedClasses()">...</div>
```

### Border Radius

| Element | Class          |
| :------ | :------------- |
| Buttons | `rounded-xl`   |
| Cards   | `rounded-2xl`  |
| Inputs  | `rounded-xl`   |
| Badges  | `rounded-full` |
| Modals  | `rounded-2xl`  |
| Avatars | `rounded-full` |

### Typography

| Element    | Classes                               |
| :--------- | :------------------------------------ |
| Page title | `text-2xl font-bold text-gray-900`    |
| Section    | `text-xl font-semibold text-gray-900` |
| Card title | `text-lg font-semibold text-gray-900` |
| Body       | `text-base text-gray-700`             |
| Small      | `text-sm text-gray-600`               |
| Muted      | `text-sm text-gray-500`               |
| Error      | `text-sm text-red-600`                |

## Routing & Page Titles (ADR-004)

1. **Strict Localization**: Use `TitleStrategy` with translation keys in `app.routes.ts`.
2. **Route Pattern**: `title: 'PAGES.DOMAIN.TITLE'`.
3. **Strictly Forbidden**: Static strings for titles (e.g. `title: 'Dashboard'`).

## Images

- Use `NgOptimizedImage` for all static images
- Provide `width` and `height` attributes
- Use `priority` for above-the-fold images

## Constraints

- ✅ Standalone components ONLY (NO NgModules)
- ✅ Signals first (input/output/computed/signal)
- ✅ OnPush change detection MANDATORY
- ✅ Direct imports ONLY (NO barrel files/index.ts)
- ✅ Atoms MUST be independent (no atom-to-atom imports)
- ✅ Icon System: Lucide + object binding (ADR-003)
- ✅ Guard clauses (early returns)
- ✅ i18n for ALL user text (TranslateModule)
- ✅ Tailwind utility classes (brand colors)
- ✅ @if/@for control flow
- ❌ NO *ngIf/*ngFor/*ngClass/*ngStyle
- ❌ NO inline styles or ngStyle
- ❌ NO string-based icon names
- ❌ NO hardcoded text
- ❌ NO complex RxJS when signals work

## References

- [apps/web/AGENTS.md](/apps/web/AGENTS.md) - Full frontend context
- [frontend.instructions.md](../../.github/instructions/frontend.instructions.md) - Complete guide
- [tailwind.instructions.md](../../.github/instructions/tailwind.instructions.md) - Styling guide
- [ADR-003](../../../docs/technical/architecture/adr/003-ICON-SYSTEM.md) - Icon System
- [FRONTEND-GUIDELINES.md](/docs/technical/frontend/FRONTEND-GUIDELINES.md)
- [ANGULAR-ZONELESS.md](/docs/technical/frontend/ANGULAR-ZONELESS.md)
- [UI-DESIGN-SYSTEM.md](/docs/technical/frontend/UI-DESIGN-SYSTEM.md)
