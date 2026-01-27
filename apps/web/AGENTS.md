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
│   ├── shared/                 # Shared components, pipes
│   │   ├── components/
│   │   └── pipes/
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

## Angular 21+ Rules

### Standalone Components (ONLY)

```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,  // Actually optional in Angular 21+ (default)
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card p-4 rounded-lg shadow">
      <h3 class="text-lg font-bold">{{ product().name }}</h3>
      <p class="text-gray-600">{{ product().price | currency }}</p>
    </div>
  `
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
} @else {
  @for (product of products(); track product.id) {
    <app-product-card [product]="product" />
  } @empty {
    <p>No products found</p>
  }
}

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
<div class="
  flex flex-col gap-4
  md:flex-row md:gap-6
  lg:gap-8
">
  <div class="w-full md:w-1/3">Sidebar</div>
  <div class="w-full md:w-2/3">Content</div>
</div>

<!-- State variants -->
<button class="
  bg-blue-600 text-white px-4 py-2 rounded
  hover:bg-blue-700
  focus:ring-2 focus:ring-blue-500
  disabled:opacity-50 disabled:cursor-not-allowed
">
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
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes')
      .then(m => m.PRODUCT_ROUTES),
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

| DO | DON'T |
|:---|:------|
| Use `input()`, `output()` | Use `@Input()`, `@Output()` |
| Use `signal()`, `computed()` | Use complex RxJS |
| Use `@if`, `@for`, `@switch` | Use `*ngIf`, `*ngFor` |
| Use `inject()` | Use constructor injection |
| Use `OnPush` change detection | Use default change detection |
| Use class bindings | Use `ngClass` |
| Use Tailwind utilities | Use inline styles |
