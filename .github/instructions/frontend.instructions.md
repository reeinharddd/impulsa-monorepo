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
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class FeatureComponent {
  // Inputs
  data = input.required<DataType>();

  // Outputs
  action = output<ActionType>();

  // Computed
  processedData = computed(() => this.data().map(...));

  // Local state
  isOpen = signal(false);
}
```

## Styling

- Use Tailwind utility classes
- No inline styles via `ngStyle`
- Use class bindings: `[class.active]="isActive()"`

## Images

- Use `NgOptimizedImage` for all static images
- Provide `width` and `height` attributes
- Use `priority` for above-the-fold images
