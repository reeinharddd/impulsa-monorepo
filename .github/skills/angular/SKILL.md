---
name: angular
description: "Angular 19+ development standards. Use when working on frontend components, services, or pages."
event: file-change
auto_trigger: false
version: "1.0.0"
last_updated: "2026-01-30"

# Inputs/Outputs
inputs:
  - source_code
output: angular_code
output_format: "Angular component/service/directive"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "file-change"
  file_patterns:
    - "apps/web/**/*.ts"
    - "apps/web/**/*.html"

# Agent Association
called_by: ["@Frontend"]
mcp_tools:
  - read_file
  - replace_string_in_file
---

# Angular Skill

> **Purpose:** Enforce Angular 19+ best practices, Signals, and Standalone Components.

## Core Rules

1.  **Standalone Components ONLY**
    - No NgModules.
    - Import dependencies directly in `@Component({ imports: [] })`.
    - Do NOT set `standalone: true` (it is the default in v19+).

2.  **Signals FIRST**
    - Use `input()` and `output()` instead of `@Input()` and `@Output()`.
    - Use `computed()` for derived state.
    - Use `signal()` for local state.
    - Avoid complex RxJS when signals work.

3.  **Change Detection**
    - Always use `ChangeDetectionStrategy.OnPush`.
    - Never mutate inputs directly.

4.  **Separation of Concerns (Strict)**
    - **NO Inline Templates**: Always use `templateUrl`.
    - **NO Inline Styles**: Always use `styleUrl` (or `styleUrls`).
    - Keep HTML, TS, and CSS in separate files.

5.  **Naming Conventions**
    - **Shared Components**: Use `ui-` prefix (e.g., `ui-button`, `ui-navbar`).
    - **Feature Components**: Use `app-` prefix (e.g., `app-landing`).
    - **Selectors**: Must match the file name (e.g., `navbar.component.ts` -> `ui-navbar`).

## Import Rules (CRITICAL - NO BARREL FILES)

- **Direct Imports Only**: `import { Comp } from '@shared/components/atoms/comp/comp.component';`
- **No Barrels**: Never import from index.ts files.

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
  templateUrl: "./feature.component.html",
  styleUrl: "./feature.component.css",
})
export class FeatureComponent {
  // Inputs & Outputs
  data = input.required<DataType>();
  action = output<ActionType>();

  // State
  isOpen = signal(false);
  label = computed(() => this.data().name);

  onAction() {
    this.action.emit(this.data());
  }
}
```

## Control Flow

- Use `@if`, `@for`, `@switch`.
- Do NOT use `*ngIf`, `*ngFor`.

## Layout & Design

- **Mobile First**: Design classes for mobile first, then add `sm:`, `md:`, `lg:` overlays.
- **Dumb Layouts**: Layout components (e.g., `PublicLayout`) should only orchestrate Dumb UI components (`ui-navbar`, `ui-footer`).
- **Composition**: Break large pages into `molecules` or `organisms`.

## Routing

- Use `TitleStrategy` with translation keys: `title: 'PAGES.Home.TITLE'`.
- No static string titles.

## Icon System

- **Library:** `lucide-angular`
- **Usage:** Bind object to `[name]`. Expose icon as `protected readonly`.

```typescript
import { Home } from "lucide-angular";
@Component({ template: `<ui-icon [name]="Home" />` })
export class MyComp {
  protected readonly Home = Home;
}
```
