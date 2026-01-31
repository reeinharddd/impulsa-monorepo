# AGENTS.md - Frontend Web Application

> **Scope:** `apps/web/` | **Primary Agent:** @Frontend

This AGENTS.md provides frontend-specific context for the Angular merchant web application.

---

## Quick Commands

```bash
# Start development server
bun run --filter @impulsa/web dev

# Build for production
bun run --filter @impulsa/web build

# Run tests
bun run --filter @impulsa/web test

# Lint
bun run --filter @impulsa/web lint
```

---

## Critical Rules (MUST FOLLOW)

### 1. Zoneless Change Detection

The app uses `provideZonelessChangeDetection()`. NEVER use browser APIs in constructors:

```typescript
// ✅ DO: Use afterNextRender for browser APIs
import { afterNextRender, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

export class MyComponent {
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      fromEvent(window, 'scroll')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(this.handleScroll.bind(this));
    });
  }
}

// ❌ DON'T: Browser APIs in constructor
constructor() {
  window.addEventListener('scroll', this.handleScroll);  // Breaks SSR/zoneless
}
```

### 2. Separate Templates (Large Components)

For complex components (50+ lines of HTML), use separate template files:

```typescript
// ✅ DO: External template for complex UI
@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// ✅ DO: Inline template for simple components (< 50 lines)
@Component({
  selector: 'ui-button',
  template: `<button [class]="classes()"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

### 3. ALWAYS Check Shared Components First & Use Icon System

Before creating ANY button, input, card, etc., check `@shared/components/`.

**Icon System (ADR-003):** Icons MUST use `lucide-angular` and the `ui-icon` component. NEVER use string names.

````typescript
// ✅ DO: Use existing shared components
import { ButtonComponent } from '@shared/components/atoms/button/button.component';
import { LoadingButtonComponent } from '@shared/components/molecules/loading-button/loading-button.component';
import { Home } from 'lucide-angular'; // Import icon object

@Component({ ... })
export class MyComponent {
  protected readonly Home = Home; // Expose for template
}

// In template:
<ui-button variant="primary" (clicked)="save()">{{ 'SAVE' | translate }}</ui-button>
<ui-icon [name]="Home" />

// ❌ DON'T: Create inline buttons or use string icons
<button class="bg-blue-500 px-4 py-2" (click)="save()">Save</button>
<ui-icon name="home" />

### 4. Localized Page Titles (ADR-004)

Routes MUST use translation keys for the `title` property. Never use static strings.

```typescript
// ✅ DO: Use translation key
{ path: 'dashboard', component: DashboardComponent, title: 'PAGES.DASHBOARD.TITLE' }

// ❌ DON'T: Static string
{ path: 'dashboard', component: DashboardComponent, title: 'Dashboard' }
````

### 5. Asset Management (ADR-005)

**Angular Assets Configuration:**

The web app uses a **two-folder strategy** for static assets:

```json
// angular.json
"assets": [
  {
    "glob": "**/*",
    "input": "public"           // Root-level files (favicon, manifest)
  },
  {
    "glob": "**/*",
    "input": "public_override"  // App-specific overrides
  }
]
```

**Folder Structure:**

```
apps/web/
├── public/                     # Root-level static files
│   ├── favicon.svg             # Browser tab icon → /favicon.svg
│   └── manifest.json           # PWA manifest → /manifest.json
├── public_override/            # App-specific assets (override libs/assets)
│   └── assets/
│       ├── images/             # Logo variants, icons → /assets/images/
│       └── i18n/               # Translations → /assets/i18n/
```

**Using the LogoComponent:**

```typescript
import { LogoComponent } from '@shared/components/atoms/logo/logo.component';

@Component({
  imports: [LogoComponent],
  template: `
    <app-logo
      [variantInput]="'light'"    // 'light' | 'dark' | 'mono'
      [typeInput]="'icon'"        // 'full' | 'icon'
      [classInput]="'h-9 w-9'"    // Tailwind sizing
    />
  `,
})
```

**Asset Sync Process:**

When updating shared assets in `libs/assets/src/`:

```bash
# Copy images to web app override
cp libs/assets/src/images/*.svg apps/web/public_override/assets/images/

# Copy translations
cp libs/assets/src/i18n/es.json apps/web/public_override/assets/i18n/es.json
```

**Important:**

- `bun run dev` syncs automatically on start, but NOT during runtime
- Restart dev server after asset changes
- Clear browser cache for favicon updates: `Ctrl + Shift + Delete` or `Ctrl + F5`

_See: [ADR-005: Frontend Assets Configuration](../../docs/technical/architecture/adr/005-FRONTEND-ASSETS-CONFIGURATION.md)_

--- 4. Domain-Based File Organization

Organize models and services by business domain:

```

core/
├── models/
│ ├── auth/ # User, enums, roles
│ │ ├── enums.ts
│ │ ├── user.model.ts
│ │ └── user-role.model.ts
│ ├── navigation/ # Nav items, menus
│ │ └── navigation.model.ts
│ ├── payment/ # Payments, sales
│ │ ├── payment-intent.model.ts
│ │ └── sale.model.ts
│ └── product/ # Products, inventory
│ └── product.model.ts
├── services/
│ ├── auth/ # Auth-related services
│ │ └── mock-api.service.ts
│ ├── navigation/ # Navigation services
│ │ └── navigation.service.ts
│ ├── payment/ # Payment services
│ │ └── payment-state.service.ts
│ └── device/ # Device services
│ └── device-detection.service.ts
└── guards/
└── auth.guard.ts

```

### 5. No Unnecessary Comments

Remove obvious or redundant comments. Code should be self-documenting:

```typescript
// ✅ DO: Self-documenting code (no comment needed)
const isActive = computed(() => this.status() === 'active');

// ✅ DO: Comment only non-obvious logic
// Debounce scroll events to prevent excessive change detection cycles
fromEvent(window, 'scroll').pipe(debounceTime(16));

// ❌ DON'T: Obvious comments
// Check if item is active
const isActive = computed(() => this.status() === 'active');

// ❌ DON'T: Section markers
// =========================================
// COMPUTED PROPERTIES
// =========================================
```

### 6. ALL Text Must Use Translations

Every user-facing string must use ngx-translate:

```typescript
// ✅ DO: Use translate pipe
<button>{{ 'COMMON.BUTTONS.SAVE' | translate }}</button>
<p>{{ 'NAV.HOME' | translate }}</p>

// ❌ DON'T: Hardcoded strings
<button>Save</button>
<p>Home</p>
```

---

## Application Structure

```
apps/web/src/
├── main.ts                     # Bootstrap
├── index.html                  # Entry HTML
├── styles.css                  # Global styles (Tailwind)
├── app/
│   ├── app.component.ts        # Root component
│   ├── app.config.ts           # App configuration
│   ├── app.routes.ts           # Route definitions
│   ├── core/                   # Core services, guards
│   │   ├── auth/
│   │   └── api/
│   ├── shared/                 # Shared UI components (Atomic Design)
│   │   └── components/
│   │       ├── atoms/          # Independent, no dependencies on other atoms
│   │       │   ├── button/     # Pure button (no loading state)
│   │       │   ├── input/
│   │       │   ├── badge/
│   │       │   ├── icon/
│   │       │   ├── spinner/
│   │       │   ├── avatar/
│   │       │   └── skeleton/
│   │       ├── molecules/      # Combinations of atoms
│   │       │   ├── loading-button/  # Button + Spinner (for loading states)
│   │       │   ├── form-field/
│   │       │   ├── search-bar/
│   │       │   ├── card/
│   │       │   ├── dropdown/
│   │       │   ├── tabs/
│   │       │   ├── toast/
│   │       │   └── empty-state/
│   │       ├── organisms/      # Complex UI sections
│   │       │   ├── sidebar/
│   │       │   ├── header/
│   │       │   ├── data-table/
│   │       │   └── modal/
│   │       └── layouts/        # Page-level layouts
│   │           ├── dashboard-layout/
│   │           ├── auth-layout/
│   │           ├── fullscreen-layout/
│   │           └── print-layout/
│   ├── features/               # Feature modules (lazy loaded)
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── sales/
│   │   └── [feature]/
│   │       ├── [feature].routes.ts
│   │       ├── pages/
│   │       ├── components/
│   │       └── stores/
│   └── stores/                 # Global signal stores
└── environments/               # Environment configs
```

---

## Import Rules (NO Barrel Files)

**CRITICAL:** Do NOT use barrel files (`index.ts`). Use direct, explicit imports.

```typescript
// ✅ DO: Direct imports - explicit and predictable
import { ButtonComponent } from '@shared/components/atoms/button/button.component';
import { CardComponent } from '@shared/components/molecules/card/card.component';
import { SidebarComponent } from '@shared/components/organisms/sidebar/sidebar.component';

// ❌ DON'T: Barrel imports - causes circular deps and opaque builds
import { ButtonComponent, CardComponent } from '@shared/components';
import { ButtonComponent } from '@shared';
```

**Why no barrels?**

- Prevents circular dependency issues
- Tree-shaking works reliably
- IDE navigation is clear
- Build output is predictable
- Dependencies are explicit

**Path aliases available:**

- `@shared/*` → `src/app/shared/*`
- `@core/*` → `src/app/core/*`
- `@features/*` → `src/app/features/*`
- `@env/*` → `src/environments/*`

---

## Angular 21+ Rules

### Standalone Components (ONLY)

```typescript
@Component({
  selector: 'app-product-card',
  standalone: true, // Actually optional in Angular 21+ (default)
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4 rounded-lg shadow">
      <h3 class="text-lg font-bold">{{ product().name }}</h3>
      <p class="text-gray-600">{{ product().price | currency }}</p>
    </div>
  `,
})
export class ProductCardComponent {
  product = input.required<Product>();
  selected = output<Product>();
}
```

### Signals First

```typescript
// ✅ DO: Use signals
export class ProductListComponent {
  products = input.required<Product[]>();
  searchTerm = signal('');

  filteredProducts = computed(() =>
    this.products().filter(p =>
      p.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );
}

// ❌ DON'T: Complex RxJS when signals work
products$ = this.store.select(selectProducts).pipe(
  switchMap(...),
  filter(...),
  map(...)
);
```

### Template Control Flow

```html
<!-- ✅ DO: Native control flow -->
@if (loading()) {
<app-spinner />
} @else { @for (product of products(); track product.id) {
<app-product-card [product]="product" />
} @empty {
<p>No products found</p>
} }

<!-- ❌ DON'T: Structural directives -->
<div *ngIf="loading">...</div>
<div *ngFor="let p of products">...</div>
```

---

## State Management (NgRx Signal Store)

```typescript
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState<ProductState>({
    products: [],
    loading: false,
    error: null,
  }),
  withComputed((state) => ({
    productCount: computed(() => state.products().length),
    isEmpty: computed(() => state.products().length === 0),
  })),
  withMethods((store, api = inject(ProductApiService)) => ({
    async loadProducts() {
      patchState(store, { loading: true });
      try {
        const products = await api.getAll();
        patchState(store, { products, loading: false });
      } catch (error) {
        patchState(store, { error: error.message, loading: false });
      }
    },
  })),
);
```

---

## Styling (Tailwind CSS 4)

```html
<!-- Mobile-first responsive design -->
<div
  class="
  flex flex-col gap-4
  md:flex-row md:gap-6
  lg:gap-8
"
>
  <div class="w-full md:w-1/3">Sidebar</div>
  <div class="w-full md:w-2/3">Content</div>
</div>

<!-- State variants -->
<button
  class="
  bg-blue-600 text-white px-4 py-2 rounded
  hover:bg-blue-700
  focus:ring-2 focus:ring-blue-500
  disabled:opacity-50 disabled:cursor-not-allowed
"
>
  Submit
</button>
```

---

## Images (NgOptimizedImage)

```html
<!-- ✅ DO: Use NgOptimizedImage -->
<img
  ngSrc="/assets/product.jpg"
  width="300"
  height="200"
  [priority]="isAboveFold"
  alt="Product image"
/>

<!-- ❌ DON'T: Regular img for static assets -->
<img src="/assets/product.jpg" />
```

---

## Routing (Lazy Loading)

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then((m) => m.PRODUCT_ROUTES),
  },
];
```

---

## Testing

```typescript
describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
  });

  it('should display product name', () => {
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(mockProduct.name);
  });
});
```

---

## Best Practices Summary

| DO                            | DON'T                        |
| :---------------------------- | :--------------------------- |
| Use `input()`, `output()`     | Use `@Input()`, `@Output()`  |
| Use `signal()`, `computed()`  | Use complex RxJS             |
| Use `@if`, `@for`, `@switch`  | Use `*ngIf`, `*ngFor`        |
| Use `inject()`                | Use constructor injection    |
| Use `OnPush` change detection | Use default change detection |
| Use class bindings            | Use `ngClass`                |
| Use Tailwind utilities        | Use inline styles            |

---

## Change Log

| Version | Date       | Changes                                                                                                                                     |
| :------ | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1.0   | 2026-01-30 | Added Asset Management section (ADR-005); Documented favicon/logo configuration; LogoComponent integration in layouts                       |
| 2.0.0   | 2026-01-27 | Added Critical Rules section: zoneless, templates, shared components, domain folders, comments, translations; Reorganized models & services |
| 1.0.0   | 2026-01-01 | Initial AGENTS.md for frontend app                                                                                                          |

---

_This file provides frontend-specific context. See root [AGENTS.md](/AGENTS.md) for project-wide rules._
