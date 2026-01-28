---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "general"
module: "frontend"
status: "approved"
version: "3.0.0"
last_updated: "2026-01-27"
author: "@Frontend"

# Keywords for semantic search
keywords:
  - "ui"
  - "design-system"
  - "atomic-design"
  - "tailwind"
  - "components"
  - "atoms"
  - "molecules"
  - "organisms"
  - "accessibility"
  - "lucide"
  - "icons"

# Related documentation
related_docs:
  database_schema: ""
  api_design: ""
  feature_design: ""
  ux_flow: ""
  adr: "docs/technical/architecture/adr/003-ICON-SYSTEM.md"

# Document-specific metadata
doc_metadata:
  audience: "developers"
  complexity: "medium"
  estimated_read_time: "35 min"
---

<!-- AI-INSTRUCTION: START -->
<!--
  This document defines the UI DESIGN SYSTEM.
  1. Preserve the Header Table and Metadata block.
  2. Fill in the "Agent Directives" to guide future AI interactions.
  3. Keep the structure strict for RAG (Retrieval Augmented Generation) efficiency.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">UI Design System (Atomic Design)</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Component library and design tokens</p>
    </td>
  </tr>
</table>

<div align="center">

  <!-- METADATA BADGES -->
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Audience-Frontend-blue?style=flat-square" alt="Audience" />
  <img src="https://img.shields.io/badge/Last%20Updated-2025--11--25-lightgrey?style=flat-square" alt="Date" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                           |
| :------------- | :-------------------------------------------------------------------- |
| **Context**    | This document defines the Atomic Design system for the UI.            |
| **Constraint** | All new components MUST be classified as Atom, Molecule, or Organism. |
| **Pattern**    | Use Tailwind CSS for styling and Angular Signals for state.           |
| **Related**    | `docs/technical/frontend/ANGULAR-ZONELESS.md`                         |

---

## Methodology

We break down interfaces into five distinct levels:

1. **Atoms:** Basic building blocks (Buttons, Inputs, Icons). **MUST be independent - no imports from other atoms.**
2. **Molecules:** Groups of atoms functioning together (Loading Button, Search Bar, Form Field).
3. **Organisms:** Complex UI sections (Header, Product Card, Sidebar).
4. **Templates:** Page-level layout structure without content.
5. **Pages:** Specific instances of templates with real content.

### Atomic Independence Rule

**Atoms cannot depend on other atoms.** If you need to combine atoms, create a molecule.

```typescript
// ✅ Atom: Pure, independent - no atom imports
@Component({ selector: "ui-button" })
export class ButtonComponent {
  /* Simple button */
}

// ✅ Molecule: Combines atoms
@Component({
  selector: "ui-loading-button",
  imports: [ButtonComponent, SpinnerComponent],
})
export class LoadingButtonComponent {
  /* Button with loading state */
}
```

## Component Library Structure

All shared components reside in `apps/web/src/app/shared/components/`.

**CRITICAL:** Use direct imports only. NO barrel files (index.ts).

```typescript
// ✅ DO: Direct imports
import { ButtonComponent } from "@shared/components/atoms/button/button.component";
import { CardComponent } from "@shared/components/molecules/card/card.component";

// ❌ DON'T: Barrel imports
import { ButtonComponent } from "@shared/components";
```

### 1. Atoms (`apps/web/src/app/shared/components/atoms/`)

**Rule:** Atoms are independent - they cannot import other atoms.

| Component | Selector      | Purpose                                      |
| :-------- | :------------ | :------------------------------------------- |
| Button    | `ui-button`   | Pure button (no loading - use LoadingButton) |
| Input     | `ui-input`    | Text input with validation states            |
| Icon      | `ui-icon`     | Lucide icons (2000+ available)               |
| Spinner   | `ui-spinner`  | Loading indicator (sm/md/lg/xl)              |
| Badge     | `ui-badge`    | Status indicators with variants              |
| Avatar    | `ui-avatar`   | User avatar with image/initials              |
| Skeleton  | `ui-skeleton` | Loading placeholder                          |

#### Icon Component (Lucide Icons)

Icons use the [Lucide](https://lucide.dev/icons/) library via `lucide-angular`. Import icons directly and pass them to the component:

```typescript
import { Home, Settings, User, Search } from "lucide-angular";

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
```

Available sizes: `xs` (12px), `sm` (16px), `md` (20px), `lg` (24px), `xl` (32px)

### 2. Molecules (`apps/web/src/app/shared/components/molecules/`)

**Rule:** Molecules combine atoms. They can import atoms but not other molecules.

| Component     | Selector            | Combines         | Purpose                      |
| :------------ | :------------------ | :--------------- | :--------------------------- |
| LoadingButton | `ui-loading-button` | Button + Spinner | Button with loading state    |
| FormField     | `ui-form-field`     | Input + Icon     | Label + Input + Error        |
| SearchBar     | `ui-search-bar`     | Input + Icon     | Input + Icon with debounce   |
| Card          | `ui-card`           | -                | Container with header/footer |
| Dropdown      | `ui-dropdown`       | Button + Icon    | Select with options          |
| Tabs          | `ui-tabs`           | Button           | Tab navigation (3 variants)  |
| Toast         | `ui-toast`          | Icon             | Notification messages        |
| EmptyState    | `ui-empty-state`    | Icon + Button    | No content placeholder       |

### 3. Organisms (`apps/web/src/app/shared/components/organisms/`)

| Component | Selector        | Purpose                          |
| :-------- | :-------------- | :------------------------------- |
| Sidebar   | `ui-sidebar`    | Collapsible side navigation      |
| Header    | `ui-header`     | App header with search/actions   |
| DataTable | `ui-data-table` | Table with pagination/sorting    |
| Modal     | `ui-modal`      | Dialog with configurable actions |

### 4. Layouts (`apps/web/src/app/shared/components/layouts/`)

| Component        | Selector            | Purpose               |
| :--------------- | :------------------ | :-------------------- |
| DashboardLayout  | `layout-dashboard`  | Main app layout       |
| AuthLayout       | `layout-auth`       | Login/register pages  |
| FullscreenLayout | `layout-fullscreen` | POS/kiosk mode        |
| PrintLayout      | `layout-print`      | Print-optimized pages |

## Design Tokens (Tailwind CSS v4)

We use Tailwind CSS v4 with native CSS variables for styling. Configuration is centrally managed in `src/styles.css` using the `@theme` directive.

### Colors

Defined as CSS variables (e.g., `--color-brand-primary`):

- **Primary:** `#4c1d95` (Deep Purple)
- **Secondary:** `#10b981` (Emerald Green)
- **Base:** `#cbc3e3` (Light Lavender)
- **Accent:** `#f97316` (Orange)
- **Surface:** `#f3f0ff` (Very Light Purple)

### Typography

- **Font Family:** `Inter` (sans-serif)
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

## Internationalization (i18n)

We use `@ngx-translate/core` for dynamic runtime translations.

- **Stack:** `@ngx-translate/core` + `@ngx-translate/http-loader`
- **Asset Location:** `public/assets/i18n/*.json`
- **Pattern:** Use the `translate` pipe: `{{ 'MODULE.KEY' | translate }}`

## Workflow for New UI Features

1.  **Identify Atoms:** What basic elements are needed?
2.  **Compose Molecules:** How do they combine?
3.  **Build Organisms:** Create the functional section.
4.  **Assemble Page:** Place organisms in the layout.
