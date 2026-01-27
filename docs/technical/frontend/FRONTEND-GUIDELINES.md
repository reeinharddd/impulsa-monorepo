---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "general"
module: "frontend"
status: "approved"
version: "1.0.0"
last_updated: "2026-01-22"
author: "@Architect"

# Keywords for semantic search
keywords:
  - "frontend-architecture"
  - "angular-standards"
  - "tailwind-4"
  - "i18n"
  - "component-structure"

# Related documentation
related_docs:
  visual_identity: "docs/process/standards/VISUAL-IDENTITY.md"
  ui_design: "docs/technical/frontend/UI-DESIGN-SYSTEM.md"
  routing: "docs/technical/frontend/ROUTING-STRATEGY.md"

# Document-specific metadata
doc_metadata:
  audience: "developers"
  complexity: "medium"
  estimated_read_time: "10 min"
---

<!-- AI-INSTRUCTION: START -->
<!--
  This document defines the FRONTEND ARCHITECTURE and DEVELOPMENT STANDARDS for Impulsa.
  It codifies the decisions regarding Component Structure, Internationalization, and Styling.
  All frontend development must adhere to these rules.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">Frontend Architecture & Guidelines</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Standardizing codebase structure, styling, and internationalization.</p>
    </td>
  </tr>
</table>

## 1. Architectural Decisions

### 1.1 Separation of Concerns (File Structure)
**Decision:** All Angular components must be split into three distinct files:
- `*.component.ts`: Business logic, state (Signals), and dependency injection.
- `*.component.html`: Template structure and bindings.
- `*.component.css`: Component-specific styles (if necessary).

**Why:**
- **Maintainability:** Large inline templates become unreadable.
- **Tooling:** Better support for Tailwind IntelliSense, syntax highlighting, and formatting in dedicated HTML files.
- **Clarity:** Distinct separation between layout (View) and logic (ViewModel).

### 1.2 Internationalization (i18n)
**Decision:** Mandated usage of `@ngx-translate/core` with JSON-based assets.
**Standard:**
- Usage of `TranslateHttpLoader` via InjectionToken `TRANSLATE_HTTP_LOADER_CONFIG`.
- Translation keys grouped by Feature (e.g., `LANDING.HERO.TITLE`).
- Absolute paths for assets: `/assets/i18n/`.

**Why:**
- **Requirement:** System must support multiple languages (ES/EN) from day one.
- **Scalability:** JSON files allow external translators to work without touching code.
- **Flexibility:** Dynamic loading preferred over Angular's compile-time i18n for this specific use case (SaaS).

### 1.3 Translation Workflow (Source of Truth)
**Decision:** `es.json` (Spanish) is the Single Source of Truth (SSOT).
**Standard:**
- All new translation keys must be added to `es.json` first.
- The `en.json` (and future languages) will be treated as downstream artifacts.
- Development does not wait for English translations; keys are added to Spanish to ensure functional completeness.

**Why:**
- **Velocity:** Prevents "blank screen" issues if a translation is missing in secondary languages.
- **Consistency:** Ensures 100% coverage in the primary market language before expansion.

### 1.4 Styling Strategy (Tailwind CSS 4)
**Decision:** Use Tailwind CSS v4 with native CSS variables for theming.
**Standard:**
- Configuration in `src/styles.css` using `@theme`.
- No separate `tailwind.config.js` (v4 pattern).
- Use of `@apply` is discouraged; prefer utility classes in HTML.

**Why:**
- **Performance:** v4 is significantly faster and requires less configuration.
- **Consistency:** Centralized design tokens in CSS variables (`--color-brand-primary`).

### 1.4 State Management
**Decision:** Signal-based inputs and local state.
**Why:** simplifies change detection and aligns with Angular's "Zoneless" roadmap.

## 2. Implementation Rules

### 2.1 Component Scaffold
```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'
})
export class FeatureComponent {}
```

### 2.2 build System
- **Bun:** Used for package management and script execution.
- **Angular CLI:** Used for building, with `provideHttpClient(withFetch)` enabled.

## Appendix A: Change Log

| Date       | Version | Author      | Changes |
| :--------- | :------ | :---------- | :------ |
| 2026-01-22 | 1.0.0   | @Architect  | Initial standardization of Component Structure and i18n |
