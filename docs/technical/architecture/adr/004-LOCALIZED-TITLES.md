---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "adr"
module: "frontend"
status: "accepted"
version: "1.0.0"
last_updated: "2026-01-27"
author: "@Architect"

# Keywords for semantic search
keywords:
  - "adr"
  - "routing"
  - "localization"
  - "i18n"
  - "titles"
  - "angular"

# Related documentation
related_docs:
  feature_design: "docs/technical/frontend/UI-DESIGN-SYSTEM.md"

# ADR-specific metadata
adr_metadata:
  adr_number: 004
  decision_date: "2026-01-27"
  impact_level: "low"
  affected_modules: ["frontend"]
  stakeholders: ["@Frontend", "@Architect"]
---

<!-- AI-INSTRUCTION: START -->
<!--
  This document is a TEMPLATE for Architecture Decision Records (ADR).
  1. Preserve the Header Table and Metadata block.
  2. Fill in the "Agent Directives" to guide future AI interactions.
  3. Keep the structure strict for RAG (Retrieval Augmented Generation) efficiency.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">ADR-004: Localized Page Titles Strategy</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Architecture Decision Record</p>
    </td>
  </tr>
</table>

<div align="center">

  <!-- METADATA BADGES -->
  <img src="https://img.shields.io/badge/Status-Accepted-green?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Impact-Low-blue?style=flat-square" alt="Impact" />
  <img src="https://img.shields.io/badge/Date-2026--01--27-lightgrey?style=flat-square" alt="Date" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                                           |
| :------------- | :------------------------------------------------------------------------------------ |
| **Context**    | This document records the standard for handling localized page titles in Angular.     |
| **Constraint** | Routes MUST use translation keys for the `title` property. Do NOT use static strings. |
| **Pattern**    | `title: 'PAGES.DOMAIN.TITLE'`                                                         |
| **Related**    | `apps/web/src/app/core/strategies/localized-title.strategy.ts`                        |

---

## 1. Context & Problem Statement

The Impulsa Web Client (`apps/web`) requires page titles that update dynamically based on the user's selected language. The default Angular `title` property accepts static strings, which forces a specific language (usually English or Spanish) regardless of user preference.

We need a standardized mechanism to handling page titles that is:

1.  **Declarative**: Defined in the route config.
2.  **Reactive**: Updates when language changes.
3.  **Consistent**: Applied globally to all pages.

## 2. Decision Drivers

- **Localization**: Titles must match the user's selected language.
- **Maintainability**: Avoid repeating title logic in every component.
- **Standards**: Adhere to Angular routing standards (using `title` property).
- **Consistency**: Ensure all pages have the standard suffix " | Impulsa".

## 3. Considered Options

- **Option 1: `Resolve<string>` per route**
  - Define a resolver for every route that fetches the translation.
  - _Pros_: Standard Angular API.
  - _Cons_: Verbose. Requires adding `resolve: { title: TitleResolver }` to every single route.

- **Option 2: Component-level `TitleService`**
  - Inject `Title` service in every page component and set it on init.
  - _Pros_: Explicit control.
  - _Cons_: Repetitive boilerplate code. Easy to forget. Logic spread across UI components.

- **Option 3: Custom `TitleStrategy`**
  - Extend Angular's `TitleStrategy` to intercept navigation events globally.
  - _Pros_: Centralized logic. DRY (Don't Repeat Yourself). Route config remains clean (just passing keys).
  - _Cons_: Requires one-time setup in `app.config.ts`.

## 4. Decision Outcome

Chosen option: **Option 3: Custom `TitleStrategy`**, because it provides the cleanest developer experience and centralized control over title formatting.

### Implementation Standard

1.  **Route Definition**: The `title` property MUST be the **translation key**, not the literal text.

    ```typescript
    // ✅ CORRECT
    {
      path: 'dashboard',
      component: DashboardComponent,
      title: 'PAGES.DASHBOARD.TITLE'
    }

    // ❌ INCORRECT (Hardcoded)
    {
      path: 'dashboard',
      title: 'Tablero de Control'
    }
    ```

2.  **Key Structure**: Title keys should be grouped under `PAGES` or `TITLES` in `en.json` / `es.json`.

3.  **Formatting**: The strategy will automatically append the app name.
    - Format: `"{TranslatedPageTitle} | Impulsa"`

## 5. Consequences

- **Positive**:
  - All titles are automatically localized.
  - No boilerplate code in components.
  - Centralized title formatting (easier if we rebrand).

- **Negative**:
  - Developers must remember `title` is a key, not a string (though it will just show the key if they forget, which is an obvious bug).
