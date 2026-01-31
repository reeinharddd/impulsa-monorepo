---
name: tailwind
description: "Tailwind CSS v4 styling rules. Use when applying styles to frontend components."
event: file-change
auto_trigger: false
version: "1.0.0"
last_updated: "2026-01-30"

# Inputs/Outputs
inputs:
  - source_code
output: styled_code
output_format: "Tailwind CSS classes"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "file-change"
  file_patterns:
    - "apps/web/**/*.html"
    - "apps/web/**/*.ts"

# Agent Association
called_by: ["@Frontend"]
mcp_tools:
  - read_file
---

# Tailwind Skill

> **Purpose:** Consistently apply Tailwind CSS v4 styling and brand guidelines.

## Brand Colors

| Class                | Hex       | Use Case                   |
| :------------------- | :-------- | :------------------------- |
| `bg-brand-primary`   | `#4c1d95` | CTAs, Primary Actions      |
| `bg-brand-secondary` | `#10b981` | Success, Secondary Actions |
| `bg-brand-accent`    | `#f97316` | Highlights                 |
| `bg-brand-surface`   | `#f3f0ff` | Backgrounds, Cards         |

## Component Patterns

### Buttons

```typescript
const btn =
  "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200";
const primary =
  "bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary";
```

### Cards

```html
<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
  Content
</div>
```

### Inputs

```html
<input
  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary"
/>
```

## Spacing

- **Card Padding**: `p-6`
- **Section Vertical**: `py-12`
- **Stack Gap**: `space-y-4` or `space-y-8`

## Forbidden Patterns

- ❌ Inline styles: `style="color: red"`
- ❌ `ngStyle` or `ngClass` with objects.
- ✅ Use class binding: `[class.active]="isActive()"`
- ✅ Use computed strings: `[class]="computedClasses()"`

## Responsive

- Mobile-first: `<div class="p-4 md:p-6 lg:p-8">`
