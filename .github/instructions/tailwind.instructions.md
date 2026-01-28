---
applyTo: "apps/web/**/*.ts,apps/web/**/*.html,apps/web/**/*.css"
excludeAgent: "code-review"
---

# Tailwind CSS & Styling Instructions

These instructions apply to all styling in the web application.

## Tailwind CSS v4 Configuration

Theme is defined in `apps/web/src/styles.css` using `@theme` directive:

```css
@theme {
  --font-sans: "Inter", sans-serif;
  --color-brand-base: #cbc3e3;
  --color-brand-primary: #4c1d95;
  --color-brand-secondary: #10b981;
  --color-brand-accent: #f97316;
  --color-brand-gold: #fcc242;
  --color-brand-surface: #f3f0ff;
}
```

## Brand Colors (MUST USE)

| Purpose   | Class                | Hex       | Use Case                   |
| :-------- | :------------------- | :-------- | :------------------------- |
| Primary   | `bg-brand-primary`   | `#4c1d95` | CTAs, primary buttons      |
| Secondary | `bg-brand-secondary` | `#10b981` | Success, secondary actions |
| Accent    | `bg-brand-accent`    | `#f97316` | Highlights, warnings       |
| Gold      | `bg-brand-gold`      | `#fcc242` | Premium, special features  |
| Surface   | `bg-brand-surface`   | `#f3f0ff` | Backgrounds, cards         |
| Base      | `bg-brand-base`      | `#cbc3e3` | Subtle backgrounds         |

## Domain Colors (For Context)

| Domain        | Tailwind Class | Use Case          |
| :------------ | :------------- | :---------------- |
| Auth          | `bg-blue-50`   | Login, security   |
| Sales         | `bg-green-50`  | POS, transactions |
| Inventory     | `bg-orange-50` | Stock, products   |
| Billing       | `bg-red-50`    | Invoices, fiscal  |
| Communication | `bg-purple-50` | Messages, notifs  |
| Payments      | `bg-cyan-50`   | Payment flows     |

## Status Colors

| Status  | Background     | Text/Border       | Use Case       |
| :------ | :------------- | :---------------- | :------------- |
| Success | `bg-green-50`  | `text-green-700`  | Confirmations  |
| Warning | `bg-yellow-50` | `text-yellow-700` | Caution states |
| Error   | `bg-red-50`    | `text-red-700`    | Errors, danger |
| Info    | `bg-blue-50`   | `text-blue-700`   | Informational  |
| Neutral | `bg-gray-50`   | `text-gray-700`   | Default states |

## Component Styling Patterns

### Buttons

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
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
};
```

### Cards

```html
<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
  <!-- Card content -->
</div>
```

### Form Fields

```html
<input
  class="w-full px-4 py-3 rounded-xl border border-gray-300
  focus:ring-2 focus:ring-brand-primary focus:border-brand-primary
  disabled:bg-gray-100 disabled:cursor-not-allowed
  transition-colors duration-200"
/>
```

### Hover/Focus States

```css
/* Standard transition */
transition-all duration-200

/* Focus ring */
focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary

/* Hover opacity */
hover:bg-brand-primary/90

/* Hover scale (subtle) */
hover:scale-[1.02] active:scale-[0.98]
```

## Spacing Conventions

| Element     | Padding       | Gap         |
| :---------- | :------------ | :---------- |
| Button sm   | `px-3 py-1.5` | `gap-1.5`   |
| Button md   | `px-4 py-2.5` | `gap-2`     |
| Button lg   | `px-6 py-3`   | `gap-2.5`   |
| Card        | `p-6`         | -           |
| Modal       | `p-6`         | `space-y-4` |
| Form fields | `px-4 py-3`   | -           |
| Section     | `py-12`       | `space-y-8` |

## Border Radius

| Element | Class          |
| :------ | :------------- |
| Buttons | `rounded-xl`   |
| Cards   | `rounded-2xl`  |
| Inputs  | `rounded-xl`   |
| Badges  | `rounded-full` |
| Modals  | `rounded-2xl`  |
| Avatars | `rounded-full` |

## Typography

| Element    | Classes                               |
| :--------- | :------------------------------------ |
| Page title | `text-2xl font-bold text-gray-900`    |
| Section    | `text-xl font-semibold text-gray-900` |
| Card title | `text-lg font-semibold text-gray-900` |
| Body       | `text-base text-gray-700`             |
| Small      | `text-sm text-gray-600`               |
| Muted      | `text-sm text-gray-500`               |
| Error      | `text-sm text-red-600`                |

## Forbidden Patterns

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

## Responsive Design

```html
<!-- Mobile-first approach -->
<div class="px-4 md:px-6 lg:px-8">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Content -->
  </div>
</div>
```

## Dark Mode (Future)

Prepare components for dark mode with semantic colors:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <!-- Content -->
</div>
```

## Animation

```css
/* Preferred duration */
duration-200  /* Interactions */
duration-300  /* Modals, transitions */
duration-500  /* Page transitions */

/* Easing */
ease-out      /* Enter animations */
ease-in       /* Exit animations */
ease-in-out   /* Continuous animations */
```
