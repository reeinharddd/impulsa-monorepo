---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "adr"
module: "frontend"
status: "accepted"
version: "1.0.0"
last_updated: "2026-01-30"
author: "@Architect"

# Keywords for semantic search
keywords:
  - "adr"
  - "frontend"
  - "assets"
  - "angular"
  - "favicon"
  - "pwa"
  - "manifest"
  - "configuration"

# Related documentation
related_docs:
  database_schema: ""
  api_design: ""
  feature_design: ""
  previous_adr: ""
  superseded_by: ""

# ADR-specific metadata
adr_metadata:
  adr_number: 5
  decision_date: "2026-01-30"
  impact_level: "medium"
  affected_modules: ["frontend", "assets", "pwa"]
  stakeholders: ["@Architect", "@Frontend"]
---

<!-- AI-INSTRUCTION: START -->
<!--
  This ADR defines the frontend assets configuration strategy.
  AI Agents MUST use the two-folder strategy: public + public_override.
  AI Agents MUST use LogoComponent instead of hardcoded elements.
  AI Agents MUST document favicon caching requirements for users.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">ADR-005: Frontend Assets Configuration</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Architecture Decision Record</p>
    </td>
  </tr>
</table>

<div align="center">

  <!-- METADATA BADGES -->
  <img src="https://img.shields.io/badge/Status-Accepted-green?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Impact-Medium-yellow?style=flat-square" alt="Impact" />
  <img src="https://img.shields.io/badge/Date-2026--01--30-lightgrey?style=flat-square" alt="Date" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                              |
| :------------- | :----------------------------------------------------------------------- |
| **Context**    | Frontend assets use two-folder strategy: `public` and `public_override`. |
| **Constraint** | NEVER hardcode logos as divs with initials. ALWAYS use LogoComponent.    |
| **Pattern**    | Root files in `public/`, app overrides in `public_override/assets/`.     |
| **Related**    | `docs/business/brand/LOGO-USAGE-GUIDE.md`, `apps/web/AGENTS.md`          |

---

## 1. Context & Problem Statement

The Angular frontend application (`apps/web`) needed to serve static assets including brand logos, favicons, PWA manifest, and internationalization files. The initial implementation had several issues:

- **Favicons not displaying** - Missing configuration in `angular.json`
- **Logos hardcoded as initials** - Public layout used `<div>I</div>` instead of proper logo component
- **No PWA support** - Missing manifest.json and app icons
- **Unclear asset organization** - No separation between shared and app-specific assets
- **No override mechanism** - Couldn't customize shared assets for specific apps

The problem required:

1. Proper Angular build configuration for static assets
2. Correct favicon and manifest setup for browsers and PWA
3. Integration of LogoComponent in layouts
4. Clear separation between shared brand assets and app-specific overrides

## 2. Decision Drivers

1. **Browser Compatibility** - Favicons must display correctly across all browsers
2. **PWA Support** - App icons and manifest for progressive web app installation
3. **Build Efficiency** - Minimize duplicate asset copying during builds
4. **Override Flexibility** - Allow per-app customization without modifying shared assets
5. **Developer Experience** - Clear, predictable asset resolution paths
6. **Brand Consistency** - Use official LogoComponent instead of fallback elements

## 3. Considered Options

### Option 1: Two-Folder Strategy (public + public_override)

```json
"assets": [
  { "glob": "**/*", "input": "public" },
  { "glob": "**/*", "input": "public_override" }
]
```

- `public/` - Root-level files (favicon.svg, manifest.json)
- `public_override/` - App-specific assets that override `libs/assets/`

### Option 2: Single assets Folder

```json
"assets": [
  { "glob": "**/*", "input": "libs/assets/src", "output": "/assets" }
]
```

- All assets in shared library
- No app-specific customization

### Option 3: Symlinks to Shared Assets

- Use symlinks from `public_override/` to `libs/assets/src/images/`
- Angular build follows symlinks

## 4. Decision Outcome

Chosen option: **Option 1 (Two-Folder Strategy)**, because:

1. ✅ **Clear separation** - Root files vs. nested assets vs. overrides
2. ✅ **Flexibility** - Apps can override shared assets without modifying source
3. ✅ **Predictability** - Explicit folder mapping in `angular.json`
4. ✅ **No symlink issues** - Works consistently across Windows/Mac/Linux
5. ✅ **Angular native** - Uses built-in asset management, no custom scripts

### 4.1. Positive Consequences

- **Favicons work correctly** - Proper configuration and file placement
- **Logo renders properly** - LogoComponent replaces hardcoded initials
- **PWA ready** - Manifest and app icons configured
- **Clear override path** - `public_override` takes precedence over `libs/assets`
- **Build output clarity** - Developers understand asset resolution
- **Type-safe logos** - LogoComponent provides compile-time safety

### 4.2. Negative Consequences

- **Asset duplication** - Logos exist in both `libs/assets` and `public_override`
- **Manual sync required** - Changes to shared assets need manual copy
- **Cache complexity** - Developers must understand browser favicon caching
- **Potential inconsistency** - Apps can drift from shared brand assets

## 5. Pros and Cons of the Options

### Option 1: Two-Folder Strategy

**Pros:**

- ✅ Clear separation of concerns (root vs. nested vs. overrides)
- ✅ Per-app customization without touching shared assets
- ✅ Works across all operating systems reliably
- ✅ Uses Angular's native asset management
- ✅ Explicit, predictable behavior

**Cons:**

- ❌ Asset duplication between `libs/assets` and `public_override`
- ❌ Manual sync required for brand asset updates
- ❌ Potential for apps to diverge from brand guidelines

### Option 2: Single assets Folder

**Pros:**

- ✅ No duplication - single source of truth
- ✅ Simpler configuration
- ✅ Automatic sync with shared library

**Cons:**

- ❌ Cannot add app-specific files (favicon, manifest)
- ❌ No override mechanism for per-app customization
- ❌ Root-level files (favicon.svg) can't be in shared lib

### Option 3: Symlinks

**Pros:**

- ✅ No file duplication
- ✅ Automatic sync with shared assets

**Cons:**

- ❌ Symlinks unreliable across Windows/Mac/Linux
- ❌ Build tools may not follow symlinks correctly
- ❌ Adds complexity to repository setup
- ❌ Git may not handle symlinks consistently

## 6. Related Links

- **Angular Assets Configuration:** https://angular.dev/tools/cli/build#assets
- **PWA Manifest Spec:** https://developer.mozilla.org/en-US/docs/Web/Manifest
- **Favicon Best Practices:** https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
- **LogoComponent:** `apps/web/src/app/shared/components/atoms/logo/logo.component.ts`
- **Brand Guidelines:** `docs/business/brand/LOGO-USAGE-GUIDE.md`

---

## Appendix A: Implementation Details

### Folder Structure

```
apps/web/
├── public/                     # Root-level static files
│   ├── favicon.svg             # Browser tab icon (copied to /)
│   └── manifest.json           # PWA manifest (copied to /)
├── public_override/            # App-specific assets that override shared ones
│   └── assets/
│       ├── images/
│       │   ├── apple-touch-icon.svg
│       │   ├── logo-light.svg  # Overrides libs/assets version
│       │   ├── logo-dark.svg
│       │   ├── icon-light.svg
│       │   ├── icon-dark.svg
│       │   └── icon-mono.svg
│       └── i18n/
│           └── es.json
└── src/
    └── index.html              # References /favicon.svg and /manifest.json
```

### Build Output Mapping

| Source                                | Build Output         | URL Path                        |
| :------------------------------------ | :------------------- | :------------------------------ |
| `public/favicon.svg`                  | `dist/favicon.svg`   | `/favicon.svg`                  |
| `public/manifest.json`                | `dist/manifest.json` | `/manifest.json`                |
| `public_override/assets/images/*.svg` | `dist/assets/images` | `/assets/images/*.svg`          |
| `public_override/assets/i18n/*.json`  | `dist/assets/i18n`   | `/assets/i18n/*.json`           |
| `libs/assets/src/images/*.svg`        | Not copied           | (overridden by public_override) |

### Favicon Configuration

**File:** `apps/web/src/index.html`

```html
<!-- Favicons -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link
  rel="icon"
  href="/assets/images/icon-light.svg"
  type="image/svg+xml"
  sizes="any"
/>
<link
  rel="apple-touch-icon"
  sizes="180x180"
  href="/assets/images/apple-touch-icon.svg"
/>
<link rel="manifest" href="/manifest.json" />
```

**Rationale:**

- Primary favicon: `/favicon.svg` - simplified 32x32px version for browser tabs
- Fallback: `/assets/images/icon-light.svg` - full-quality icon
- Apple devices: `/assets/images/apple-touch-icon.svg` - 180x180px for iOS
- PWA manifest: `/manifest.json` - references icons for app installation

### LogoComponent Integration

The `LogoComponent` (`apps/web/src/app/shared/components/atoms/logo/`) resolves logo paths dynamically:

```typescript
logoSrc = computed(() => {
  const variant = this.variant(); // 'light' | 'dark' | 'mono'
  const type = this.type(); // 'full' | 'icon'
  const prefix = type === "full" ? "logo" : "icon";
  return `/assets/images/${prefix}-${variant}.svg`;
});
```

**Usage in layouts:**

```typescript
<app-logo
  [variantInput]="'light'"
  [typeInput]="'icon'"
  [classInput]="'h-9 w-9'"
/>
```

This replaced hardcoded initial letters (e.g., `<div>I</div>`) with proper brand assets.

## Appendix B: Testing & Verification

### Testing Steps

1. **Verify assets in build output:**

   ```bash
   bun run build
   ls -R dist/browser/
   # Should see: favicon.svg, manifest.json, assets/images/*.svg
   ```

2. **Clear browser cache:**
   - `Ctrl + Shift + Delete` → Clear cached images
   - `Ctrl + F5` for hard refresh
   - Test in incognito mode

3. **Check favicon:**
   - Navigate to `http://localhost:4200`
   - Verify favicon in browser tab
   - Check browser DevTools → Network → favicon.svg (200 OK)

4. **Verify logo rendering:**
   - Logo appears in navigation (top-left)
   - Uses SVG asset, not fallback text
   - Correct variant for theme

### Common Issues & Solutions

| Issue                    | Solution                                          |
| :----------------------- | :------------------------------------------------ |
| Favicon not showing      | Clear browser cache (`Ctrl + Shift + Delete`)     |
| Logo shows as letter "I" | Ensure LogoComponent imported in layout component |
| Assets 404 error         | Check `angular.json` assets configuration         |
| Wrong logo variant       | Verify `variantInput` and `typeInput` props       |
| Manifest not loading     | Ensure `manifest.json` in `public/` folder        |

## Appendix C: Migration Notes

### For Developers

When updating shared brand assets in `libs/assets/src/`:

```bash
# Copy images to web app override
cp libs/assets/src/images/*.svg apps/web/public_override/assets/images/

# Copy translations
cp libs/assets/src/i18n/es.json apps/web/public_override/assets/i18n/es.json
```

**Important:**

- `bun run dev` syncs automatically on start, but NOT during runtime
- Restart dev server after asset changes
- Clear browser cache for favicon updates: `Ctrl + Shift + Delete` or `Ctrl + F5`

### For Other Apps

Future apps (e.g., `apps/admin`) should follow the same pattern:

1. Create `apps/{app}/public/` for root-level files
2. Create `apps/{app}/public_override/assets/` for overrides
3. Configure `angular.json` with both folders
4. Import and use LogoComponent instead of hardcoded elements

---

## Appendix D: Change Log

| Date       | Version | Author     | Changes                          |
| :--------- | :------ | :--------- | :------------------------------- |
| 2026-01-30 | 1.0.0   | @Architect | Initial ADR documenting decision |
