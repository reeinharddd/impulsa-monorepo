---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "general"
module: "brand"
status: "approved"
version: "1.0.1"
last_updated: "2026-01-30"
author: "@Scribe"

# Keywords for semantic search
keywords:
  - "brand-assets"
  - "changelog"
  - "logo-versions"
  - "design-history"
  - "visual-updates"

# Related documentation
related_docs:
  brand_identity: "docs/business/brand/BRAND-IDENTITY.md"
  logo_usage: "docs/business/brand/LOGO-USAGE-GUIDE.md"
  visual_identity: "docs/process/standards/VISUAL-IDENTITY.md"

# Document-specific metadata
doc_metadata:
  audience: "designers, developers, marketing"
  complexity: "low"
  estimated_read_time: "5 min"
---

<!-- AI-INSTRUCTION: START -->
<!--
  This document tracks changes to brand assets over time.
  CRITICAL: Always update this file when modifying logo, icons, or other brand assets.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">Brand Assets Changelog</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">History of changes to logos, icons, and visual assets</p>
    </td>
  </tr>
</table>

<div align="center">

  <img src="https://img.shields.io/badge/Status-Approved-green?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Type-Changelog-blue?style=flat-square" alt="Type" />
  <img src="https://img.shields.io/badge/Last%20Updated-2026--01--30-lightgrey?style=flat-square" alt="Date" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                                |
| :------------- | :------------------------------------------------------------------------- |
| **Context**    | This document tracks all changes to brand visual assets.                   |
| **Constraint** | ALWAYS update this file when modifying logos, icons, or brand colors.      |
| **Pattern**    | Add new entries at the top with date, version, files affected, and reason. |
| **Related**    | `BRAND-IDENTITY.md`, `LOGO-USAGE-GUIDE.md`                                 |

---

## 1. Purpose

This document maintains a historical record of all changes to Impulsa's brand visual assets. It serves as:

- **Audit trail** for design decisions
- **Version control** for brand assets
- **Context** for why changes were made
- **Reference** for future design work

---

## 2. Changelog

### Version 1.0.1 - 2026-01-30

**Type:** Update - Frontend Assets Configuration

**Author:** @Frontend, @Architect

**Reason for Change:**
Fixed favicon and logo display issues in the web application. Implemented proper Angular assets configuration and integrated LogoComponent in the public layout to replace hardcoded initial letters.

**Files Created:**

| File                   | Description                       | Location                                   |
| :--------------------- | :-------------------------------- | :----------------------------------------- |
| `favicon.svg`          | Simplified 32x32px browser icon   | `/apps/web/public/`                        |
| `manifest.json`        | PWA manifest with icon references | `/apps/web/public/`                        |
| `apple-touch-icon.svg` | iOS app icon (180x180px)          | `/apps/web/public_override/assets/images/` |

**Files Modified:**

| File                           | Change                                      |
| :----------------------------- | :------------------------------------------ |
| `apps/web/angular.json`        | Added `public` and `public_override` assets |
| `apps/web/src/index.html`      | Updated favicon links with proper fallbacks |
| `public-layout.component.ts`   | Added LogoComponent import                  |
| `public-layout.component.html` | Replaced `<div>I</div>` with `<app-logo />` |

**Technical Changes:**

1. **Assets Configuration:** Implemented two-folder strategy in `angular.json`:
   - `public/` for root-level files (favicon, manifest)
   - `public_override/` for app-specific assets

2. **LogoComponent Integration:**

   ```typescript
   <app-logo
     [variantInput]="'light'"
     [typeInput]="'icon'"
     [classInput]="'h-9 w-9'"
   />
   ```

3. **Favicon Configuration:**
   - Primary: `/favicon.svg` (simplified for browser tabs)
   - Fallback: `/assets/images/icon-light.svg` (full quality)
   - Apple: `/assets/images/apple-touch-icon.svg` (iOS devices)

**Documentation Created:**

- [ADR-005: Frontend Assets Configuration](../../technical/architecture/adr/005-FRONTEND-ASSETS-CONFIGURATION.md)
- Updated [LOGO-USAGE-GUIDE.md](./LOGO-USAGE-GUIDE.md) with correct file locations and implementation details
- Updated [apps/web/AGENTS.md](../../../apps/web/AGENTS.md) with asset management section

**Impact:**

- ✅ Favicons now display correctly in browser tabs
- ✅ Logo renders using official SVG assets instead of fallback text
- ✅ PWA manifest properly configured for app installation
- ✅ Clear separation between shared and app-specific assets

**Migration Notes:**

- Developers must clear browser cache (`Ctrl + Shift + Delete`) to see favicon changes
- Hard refresh (`Ctrl + F5`) recommended after asset updates
- Test in incognito mode to verify without cache interference

---

### Version 1.0.0 - 2026-01-27

**Type:** Major Release - New Logo System

**Author:** @Scribe

**Reason for Change:**
Replaced provisional logo with the official Impulsa brand identity system. The new logo better represents the brand values of "growth without limits" and follows the "Radical Clarity" design philosophy.

**Files Created:**

| File                         | Description                            | Location                          |
| :--------------------------- | :------------------------------------- | :-------------------------------- |
| `logo-light.svg`             | Full logo with text - Light theme      | `/libs/assets/src/images/`        |
| `logo-dark.svg`              | Full logo with text - Dark theme       | `/libs/assets/src/images/`        |
| `icon-light.svg`             | Icon only (no text) - Light theme      | `/libs/assets/src/images/`        |
| `icon-dark.svg`              | Icon only (no text) - Dark theme       | `/libs/assets/src/images/`        |
| `icon-mono.svg`              | Monochrome icon (black on transparent) | `/libs/assets/src/images/`        |
| `favicon.svg`                | Simplified favicon for 16x16px         | `/apps/web/public/`               |
| `apple-touch-icon.svg`       | Apple Touch Icon 180x180px             | `/apps/web/public/assets/images/` |
| `android-chrome-192x192.svg` | Android Chrome 192x192px               | `/apps/web/public/assets/images/` |
| `android-chrome-512x512.svg` | Android Chrome 512x512px               | `/apps/web/public/assets/images/` |

**Design Specifications:**

- **Symbol:** Expanding concentric waves (NFC/contactless payment style)
- **Central element:** Growth Green (#10B981) pulse representing the merchant
- **Waves:** 3 levels radiating outward
  - Light theme: Deep Violet (#4C1D95) on Soft Lavender (#CBC3E3)
  - Dark theme: Soft Lavender (#CBC3E3) on Deep Violet (#4C1D95)
- **Container:** Squircle with 120px radius (23.4% of 512x512 canvas)
- **Typography:** Inter Bold 700 for "Impulsa" text in full logo

**Documentation Created:**

- [LOGO-USAGE-GUIDE.md](./LOGO-USAGE-GUIDE.md) - Complete usage guidelines
- [BRAND-ASSETS-CHANGELOG.md](./BRAND-ASSETS-CHANGELOG.md) - This file

**Impact:**

- All new favicons and app icons across web application
- Consistent brand identity across light/dark themes
- Accessibility-compliant (WCAG AA)
- Scalable from 16px to any size

**Migration Notes:**

- Old provisional logo files (`logo.svg`, `logo.png`) should be deprecated
- Update all references in codebase to use new LogoComponent
- Regenerate any marketing materials with new assets

---

## 3. Asset Versioning Guidelines

When updating brand assets, follow these rules:

### 3.1. Semantic Versioning

Use semantic versioning for major asset changes:

- **Major (X.0.0):** Complete redesign, new concept
- **Minor (1.X.0):** Refinements, new variants, color adjustments
- **Patch (1.0.X):** Bug fixes, export corrections, optimization

### 3.2. What to Document

Every changelog entry MUST include:

1. **Version number** and **date**
2. **Type of change** (New, Update, Deprecation, Removal)
3. **Author** (who made/approved the change)
4. **Reason** (why the change was necessary)
5. **Files affected** (list all created/modified/deleted files)
6. **Impact** (what this affects in the system)
7. **Migration notes** (if applicable)

### 3.3. File Naming Convention

All brand assets follow this naming:

```
[asset-type]-[variant].[extension]

Examples:
- logo-light.svg
- icon-dark.svg
- icon-mono.svg
- favicon.svg
```

**Rules:**

- Use lowercase with hyphens
- Include variant when multiple versions exist
- Prefer SVG for scalable assets
- Include size in filename for fixed-size PNGs (e.g., `icon-192x192.png`)

---

## 4. Deprecation Policy

When assets are replaced:

1. **Mark as deprecated** in this changelog
2. **Keep old files** for 2 release cycles minimum
3. **Update all references** to new assets
4. **Add deprecation notice** in code comments
5. **Remove after grace period** and document removal here

Example deprecation entry:

```markdown
### Version 1.1.0 - 2026-03-15

**Type:** Deprecation

**Files Deprecated:**

- `/libs/assets/src/images/logo.png` - Replaced by logo-light.svg
- `/libs/assets/src/images/logo.svg` - Replaced by new logo system

**Removal scheduled:** Version 2.0.0 (2026-06-01)
```

---

## 5. Color Palette History

### Current Palette (v1.0.0 - 2026-01-27)

| Color Name    | Hex       | Tailwind      | Usage                   |
| :------------ | :-------- | :------------ | :---------------------- |
| Soft Lavender | `#CBC3E3` | `custom`      | Brand base, backgrounds |
| Deep Violet   | `#4C1D95` | `violet-900`  | Text, actions, contrast |
| Growth Green  | `#10B981` | `emerald-500` | Success, money, pulse   |
| Alert Orange  | `#F97316` | `orange-500`  | Actions, attention      |
| Clean White   | `#FFFFFF` | `white`       | Backgrounds, clarity    |
| Lavender Mist | `#F3F0FF` | `violet-50`   | Subtle tint for cards   |

---

## 6. Typography History

### Current Typography (v1.0.0 - 2026-01-27)

- **Primary font:** Inter (Google Fonts)
- **Weights used:**
  - Regular (400) for body text
  - Bold (700) for headings and logo text
- **Minimum size:** 16px for body text
- **Special features:** `tabular-nums` for financial data

---

## 7. References

- **Design guidelines:** [BRAND-IDENTITY.md](./BRAND-IDENTITY.md)
- **Usage rules:** [LOGO-USAGE-GUIDE.md](./LOGO-USAGE-GUIDE.md)
- **Visual standards:** [VISUAL-IDENTITY.md](../../process/standards/VISUAL-IDENTITY.md)

---

_This changelog must be updated whenever brand assets are modified, added, or removed._
