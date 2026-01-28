---
applyTo: "apps/web/**/*.ts,apps/web/**/*.html"
excludeAgent: "code-review"
---

# Frontend Instructions

These instructions apply to all TypeScript and HTML files in the web application.

## Angular 21+ Rules

1. **Standalone components ONLY**
   - No NgModules
   - Import dependencies directly
   - Do NOT set `standalone: true` (it's the default)

2. **Signals first**
   - Use `input()` and `output()` functions
   - Use `computed()` for derived state
   - Use `signal()` for local state
   - Avoid complex RxJS when signals work

3. **Change detection**
   - Always use `OnPush`
   - Never mutate inputs directly

## Import Rules (CRITICAL - NO BARREL FILES)

Use direct, explicit imports only. Never create or use `index.ts` barrel files.

```typescript
// ✅ DO: Direct component imports
import { ButtonComponent } from "@shared/components/atoms/button/button.component";
import { CardComponent } from "@shared/components/molecules/card/card.component";
import { SidebarComponent } from "@shared/components/organisms/sidebar/sidebar.component";
import type { ButtonVariant } from "@shared/components/atoms/button/button.component";

// ❌ DON'T: Barrel imports
import { ButtonComponent } from "@shared/components";
import { ButtonComponent, CardComponent } from "@shared";
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
├── molecules/      # Combinations of atoms (e.g., loading-button = button + spinner)
├── organisms/      # Complex UI sections using atoms + molecules
└── layouts/        # Page-level layouts
```

### Atomic Design Rules (CRITICAL)

**Atoms MUST be independent** - No atom can import another atom.

```typescript
// ✅ Atom: Pure, independent
@Component({ selector: 'ui-button' })
export class ButtonComponent { /* No imports from other atoms */ }

// ✅ Molecule: Combines atoms
@Component({
  selector: 'ui-loading-button',
  imports: [ButtonComponent, SpinnerComponent]  // Combines 2 atoms
})
export class LoadingButtonComponent { }

// ❌ DON'T: Atom importing another atom
@Component({
  selector: 'ui-button',
  imports: [SpinnerComponent]  // WRONG - atoms must be independent
})
```

**Choose the right level:**

- Need loading state? → Use `ui-loading-button` (molecule)
- Need simple button? → Use `ui-button` (atom)

## Icon System Rules (MANDATORY)

**Ref: [ADR-003](../../docs/technical/architecture/adr/003-ICON-SYSTEM.md)**

1. **Library:** Use `lucide-angular`.
2. **Import:** Import icons directly from the library.
3. **Usage:** Bind the icon object to `[name]`. NEVER use string names.
4. **Expose:** Expose icons as `protected readonly` properties in your class.

```typescript
// ✅ CORRECT PATTERN
import { Home, Settings } from 'lucide-angular';

@Component({
  template: \`<ui-icon [name]="Home" size="md" />\`
})
export class MyComponent {
  protected readonly Home = Home;
}

// ❌ FORBIDDEN
<ui-icon name="home" />
```

## Template Rules

### Control Flow (Use These)

```html
@if (condition) {
<element />
} @for (item of items(); track item.id) {
<element />
} @switch (value) { @case ('a') { <a-element /> } @default {
<default-element /> } }
```

### Do NOT Use

```html
<!-- FORBIDDEN -->
<div *ngIf="condition">...</div>
<div *ngFor="let item of items">...</div>
<div [ngClass]="{'active': isActive}">...</div>
```

## Component Pattern

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonComponent } from "@shared/components/atoms/button/button.component";

@Component({
  selector: "app-feature",
  imports: [ButtonComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-button variant="primary" (clicked)="onAction()">
      {{ "FEATURE.BUTTON_LABEL" | translate }}
    </ui-button>
  `,
})
export class FeatureComponent {
  // Inputs (required or with default)
  data = input.required<DataType>();
  enabled = input(true);

  // Outputs
  action = output<ActionType>();

  // Computed (derived from inputs)
  label = computed(() => this.data().name);

  // Local state
  isOpen = signal(false);

  onAction(): void {
    // Guard clause: exit early if cannot proceed
    if (!this.enabled()) return;

    this.action.emit(this.data());
  }
}
```

## Icons (CRITICAL - Lucide Only)

Icons MUST use the Lucide library. See [ADR-003](docs/technical/architecture/adr/003-ICON-SYSTEM.md).

```typescript
// ✅ DO: Import and bind icon objects
import { Home, Settings, Search, X } from 'lucide-angular';

@Component({
  template: `
    <ui-icon [name]="Home" size="md" />
    <ui-icon [name]="Settings" size="lg" class="text-brand-primary" />
  `
})
export class MyComponent {
  protected readonly Home = Home;
  protected readonly Settings = Settings;
}

// ❌ NEVER: String-based icon names (COMPILE ERROR)
<ui-icon name="home" />
<ui-icon [name]="'settings'" />

// ❌ NEVER: Inline SVGs
<svg><path d="..."></svg>

// ❌ NEVER: Icon fonts
<i class="fa fa-home"></i>
```

**Icon sizes:** `xs` (12px), `sm` (16px), `md` (20px), `lg` (24px), `xl` (32px)

**Browse icons:** https://lucide.dev/icons/

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

ALL user-facing text MUST use translations:

```typescript
// Import TranslateModule
import { TranslateModule } from '@ngx-translate/core';

@Component({
  imports: [TranslateModule],
  template: `
    <!-- ✅ DO: Use translate pipe -->
    <button>{{ 'COMMON.BUTTONS.SAVE' | translate }}</button>
    <p>{{ 'MESSAGE.WELCOME' | translate:{ name: userName() } }}</p>

    <!-- ❌ DON'T: Hardcoded text -->
    <button>Save</button>
    <button>Guardar</button>
  `
})
```

Translation files: `public_override/assets/i18n/{es,en}.json`

## Styling

- Use Tailwind utility classes
- No inline styles via `ngStyle`
- Use class bindings: `[class.active]="isActive()"`
- Brand colors: `brand-primary`, `brand-secondary`, `brand-surface`
- See `tailwind.instructions.md` for complete styling guide

## Images

- Use `NgOptimizedImage` for all static images
- Provide `width` and `height` attributes
- Use `priority` for above-the-fold images
