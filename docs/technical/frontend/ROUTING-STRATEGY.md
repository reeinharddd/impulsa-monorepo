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
  - "routing"
  - "url-structure"
  - "navigation"
  - "seo"
  - "i18n"
  - "angular-router"

# Related documentation
related_docs:
  visual_identity: "docs/process/standards/VISUAL-IDENTITY.md"
  ux_flow: "docs/technical/frontend/ux-flows/ONBOARDING-FLOW.md"

# Document-specific metadata
doc_metadata:
  audience: "developers"
  complexity: "medium"
  estimated_read_time: "15 min"
---

<!-- AI-INSTRUCTION: START -->
<!--
  This document defines the ROUTING STRATEGY and URL STANDARDS.
  1. Follow these patterns for all new modules.
  2. Use Angular's Router features (Lazy Loading, Guards, Resolvers).
  3. Keep URLs clean, semantic, and simple.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">Routing Strategy & URL Standards</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Directives for a predictable, SEO-friendly, and multi-language navigation structure.</p>
    </td>
  </tr>
</table>

<div align="center">

  <img src="https://img.shields.io/badge/Status-Approved-green?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Stack-Angular_21-red?style=flat-square" alt="Stack" />
  <img src="https://img.shields.io/badge/Type-Standard-blue?style=flat-square" alt="Type" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                                         |
| :------------- | :---------------------------------------------------------------------------------- |
| **Context**    | Defines the URL structure and navigation behavior for the frontend.                 |
| **Constraint** | URLs MUST be semantic, lowercase, and hyphenated (`kebab-case`). No IDs in root.    |
| **Pattern**    | `/:module/:resource/:action` (e.g., `/inventory/products/create`).                  |
| **Rule**       | All modules MUST be lazy-loaded. No leaky abstractions in URLs.                     |

---

## 1. Core Philosophy

**"The URL is the Truth."**

1.  **Predictability:** A user should be able to guess the URL.
2.  **Permanence:** URLs should not change frequently.
3.  **Simplicity:** Avoid deep nesting (max 3 levels deep preferred).
4.  **Localization:** First-class citizen via path prefixes (handled by build consistency).

## 2. URL Structure

### 2.1. Top-Level Segments

We distinguish between Public and Private areas.

| Segment | Purpose | Example | Guard |
| :--- | :--- | :--- | :--- |
| `/` | Landing Page (Marketing) | `impulsa.com/` | None |
| `/auth` | Authentication (Login/Register) | `impulsa.com/auth/login` | PublicGuard |
| `/onboarding` | New User Setup | `impulsa.com/onboarding/welcome` | AuthGuard |
| `/*` (App) | Main Application Modules | `impulsa.com/dashboard` | AuthGuard |

*Note: We avoid the `/app` prefix to keep URLs shorter and cleaner for the main usage, unless technical constraints require it.*

### 2.2. Localization Strategy (i18n)

We use **URL-based Localization**. Angular builds separate apps for each locale.

- **English (Default):** `domain.com/...`
- **Spanish:** `domain.com/es/...` (or subdomains `es.domain.com`)

*Decision:* Use path prefixes (`/es/`) for easiest infrastructure setup and SEO consolidation.

### 2.3. Route Patterns

| Pattern | Description | Example |
| :--- | :--- | :--- |
| `/` | Dashboard / Overview | `domain.com/dashboard` |
| `/:module` | Module Root (List/Summary) | `domain.com/inventory` |
| `/:module/:resource` | Specific Resource List | `domain.com/inventory/products` |
| `/:module/:resource/:id` | Resource Detail | `domain.com/inventory/products/prod-123` |
| `/:module/:resource/:id/edit` | Resource Edit | `domain.com/inventory/products/prod-123/edit` |
| `/:module/:resource/new` | Resource Creation | `domain.com/inventory/products/new` |

## 3. Module Routing Map

### 3.1. Dashboard (`/dashboard`)
- **Main View:** High-level metrics, alerts, quick actions.

### 3.2. Point of Sale (`/pos`)
- **Focus:** Distraction-free interface.
- **Sub-routes:**
  - `/pos` (The Terminal)
  - `/pos/history` (Recent transactions)
  - `/pos/close` (Shift closing)

### 3.3. Inventory (`/inventory`)
- **Main View:** Stock alerts and summary.
- **Resources:**
  - `/inventory/products` (Catalog)
  - `/inventory/stock` (Adjustments)
  - `/inventory/suppliers` (Providers)

### 3.4. Orders (`/orders`)
- **Focus:** Order management status pipeline.
- `/orders` (Kanban/List)
- `/orders/:id` (Detail)

### 3.5. Settings (`/settings`)
- `/settings/profile`
- `/settings/business`
- `/settings/team`
- `/settings/billing`

## 4. Technical Implementation

### 4.1. Router Configuration

Use **Standalone Components** and `loadComponent` / `loadChildren`.

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
  },
  {
    path: '',
    component: MainLayoutComponent, // Shell
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventory/inventory.routes')
      }
    ]
  }
];
```

### 4.2. Navigation UX

- **Active State:** Use `routerLinkActive` with design system classes.
- **Scroll Restoration:** Enabled globally for 'top' position on navigation.
- **View Transitions:** Enabled via `withViewTransitions()` in `app.config.ts`.
