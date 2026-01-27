---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "general"
module: "frontend"
status: "approved"
version: "1.0.0"
last_updated: "2025-11-27"
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

# Related documentation
related_docs:
  database_schema: ""
  api_design: ""
  feature_design: ""
  ux_flow: ""

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

1.  **Atoms:** Basic building blocks (Buttons, Inputs, Icons).
2.  **Molecules:** Groups of atoms functioning together (Search Bar, Form Field).
3.  **Organisms:** Complex UI sections (Header, Product Card, Sidebar).
4.  **Templates:** Page-level layout structure without content.
5.  **Pages:** Specific instances of templates with real content.

## Component Library Structure

All shared components reside in `libs/ui/src/lib/`.

### 1. Atoms (`libs/ui/src/lib/atoms/`)

- `ui-button`: Standard button with variants (primary, secondary, outline).
- `ui-icon`: SVG icon wrapper.
- `ui-input`: Base input field.
- `ui-badge`: Status indicators.

### 2. Molecules (`libs/ui/src/lib/molecules/`)

- `ui-form-field`: Label + Input + Error Message.
- `ui-search-bar`: Input + Search Icon + Button.
- `ui-user-avatar`: Image + Name + Role.

### 3. Organisms (`libs/ui/src/lib/organisms/`)

- `ui-navbar`: Logo + Navigation Links + User Menu.
- `ui-sidebar`: Collapsible side navigation.
- `ui-data-table`: Complex table with pagination and sorting.

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
