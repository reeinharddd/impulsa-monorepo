---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "adr"
module: "frontend"
status: "accepted"
version: "1.0.0"
last_updated: "2026-01-27"
author: "@Frontend"

# Keywords for semantic search
keywords:
  - "adr"
  - "icons"
  - "lucide"
  - "frontend"
  - "components"
  - "design-system"
  - "svg"
  - "ui"

# Related documentation
related_docs:
  database_schema: ""
  api_design: ""
  feature_design: "docs/technical/frontend/UI-DESIGN-SYSTEM.md"
  previous_adr: ""
  superseded_by: ""

# ADR-specific metadata
adr_metadata:
  adr_number: 3
  decision_date: "2026-01-27"
  impact_level: "medium"
  affected_modules: ["frontend", "ui"]
  stakeholders: ["@Frontend", "@Architect"]
---

<!-- AI-INSTRUCTION: START -->
<!--
  This ADR mandates the use of Lucide icons library.
  AI Agents MUST NOT use string-based icon names.
  AI Agents MUST import icons from 'lucide-angular'.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">ADR-003: Lucide Icons System</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Architecture Decision Record</p>
    </td>
  </tr>
</table>

<div align="center">

  <!-- METADATA BADGES -->
  <img src="https://img.shields.io/badge/Status-Accepted-green?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Impact-Medium-yellow?style=flat-square" alt="Impact" />
  <img src="https://img.shields.io/badge/Date-2026--01--27-lightgrey?style=flat-square" alt="Date" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                                       |
| :------------- | :-------------------------------------------------------------------------------- |
| **Context**    | Icons MUST use the Lucide library. No string-based icon names.                    |
| **Constraint** | NEVER use `name="icon-name"` string syntax. ALWAYS use `[name]="IconObject"`.     |
| **Pattern**    | Import icons from `lucide-angular`, expose as class properties, bind to `[name]`. |
| **Related**    | `docs/technical/frontend/UI-DESIGN-SYSTEM.md`                                     |

---

## 1. Context & Problem Statement

The application needed an icon system for UI components. The initial implementation used inline SVG paths with a switch statement, resulting in:

- **308 lines of code** for 29 icons with hardcoded SVG paths
- **String-based API** (`name="home"`) that was not type-safe
- **No tree-shaking** - all icons bundled regardless of usage
- **Manual maintenance** - adding icons required editing component source
- **No IDE support** - typos in icon names not caught until runtime

## 2. Decision Drivers

1. **Maintainability** - Icon system should not require source code changes
2. **Type Safety** - Invalid icon usage should be caught at compile time
3. **Bundle Size** - Only used icons should be included in production build
4. **Developer Experience** - IDE autocomplete and go-to-definition support
5. **Icon Variety** - Access to comprehensive icon library (2000+ icons)
6. **Consistency** - Single source of truth for icon design

## 3. Considered Options

### Option 1: Inline SVG with Switch Statement (Rejected)

```typescript
// ❌ REJECTED - The old approach
@switch (name()) {
  @case ('home') { <path d="M3 12l2-2m0 0l7-7..." /> }
  @case ('menu') { <path d="M4 6h16M4 12h16..." /> }
  // 27 more cases...
}
```

**Pros:** No external dependencies
**Cons:** Not maintainable, not type-safe, no tree-shaking, limited icons

### Option 2: Icon Font (e.g., Font Awesome) (Rejected)

```html
<!-- ❌ REJECTED -->
<i class="fa fa-home"></i>
```

**Pros:** Easy to use, widely adopted
**Cons:** No tree-shaking, string-based, accessibility issues, font loading

### Option 3: Lucide Angular Library (Accepted)

```typescript
// ✅ ACCEPTED
import { Home, Settings } from "lucide-angular";

@Component({
  template: `<ui-icon [name]="Home" size="md" />`,
})
export class MyComponent {
  protected readonly Home = Home;
}
```

**Pros:** Type-safe, tree-shakeable, 2000+ icons, MIT license, consistent design
**Cons:** Requires import pattern (minor learning curve)

## 4. Decision Outcome

**Chosen option: Lucide Angular Library**, because:

1. **Type Safety**: TypeScript catches invalid icon usage at compile time
2. **Tree Shaking**: Only imported icons are bundled (reduces bundle size)
3. **2000+ Icons**: Comprehensive library covers all use cases
4. **Consistent Design**: All icons share same visual style and stroke width
5. **Active Maintenance**: Lucide is actively maintained fork of Feather Icons
6. **MIT License**: No licensing concerns for commercial use

## 5. Implementation

### IconComponent API

```typescript
// apps/web/src/app/shared/components/atoms/icon/icon.component.ts
import { type LucideIconData, LucideAngularModule } from "lucide-angular";

@Component({
  selector: "ui-icon",
  template: `<lucide-icon [img]="name()" [size]="sizeInPixels()" />`,
})
export class IconComponent {
  name = input.required<LucideIconData>(); // Type-safe icon input
  size = input<IconSize>("md"); // xs|sm|md|lg|xl
}
```

### Usage Pattern (MANDATORY)

```typescript
// 1. Import icons from lucide-angular
import { Home, Settings, User, Search, X } from "lucide-angular";

@Component({
  template: `
    <!-- 2. Bind icon object to [name] -->
    <ui-icon [name]="Home" size="md" />
    <ui-icon [name]="Settings" size="lg" class="text-brand-primary" />
  `,
})
export class MyComponent {
  // 3. Expose icons as protected readonly properties
  protected readonly Home = Home;
  protected readonly Settings = Settings;
}
```

### Icon Sizes

| Size | Pixels | Use Case                    |
| :--- | :----- | :-------------------------- |
| xs   | 12px   | Inline with small text      |
| sm   | 16px   | Buttons, inputs             |
| md   | 20px   | Default, navigation items   |
| lg   | 24px   | Headers, prominent actions  |
| xl   | 32px   | Empty states, hero sections |

## 6. Consequences

### Positive

- ✅ **Type-safe**: Invalid icons caught at compile time
- ✅ **Tree-shakeable**: Bundle only includes used icons
- ✅ **Comprehensive**: 2000+ icons available
- ✅ **Consistent**: Unified visual style across app
- ✅ **IDE Support**: Autocomplete and navigation work

### Negative

- ⚠️ **Import pattern**: Requires explicit imports per icon
- ⚠️ **Class properties**: Icons must be exposed as component properties

### Neutral

- Icons are SVG-based (same as before, but from library)
- Stroke width is configurable (default: 2)

## 7. Anti-Patterns (FORBIDDEN)

```typescript
// ❌ NEVER: String-based icon names
<ui-icon name="home" />           // Compile error - type mismatch
<ui-icon [name]="'home'" />       // Compile error - string not LucideIconData

// ❌ NEVER: Inline SVG paths
<svg><path d="M3 12..."></svg>    // Use ui-icon component instead

// ❌ NEVER: Icon fonts
<i class="fa fa-home"></i>        // No icon fonts allowed

// ❌ NEVER: Dynamic string mapping
const iconName = 'home';
<ui-icon [name]="iconMap[iconName]" />  // Avoid - prefer explicit imports
```

## 8. Compliance

All components using icons MUST:

1. Import icons from `lucide-angular`
2. Use `[name]="IconObject"` binding (not `name="string"`)
3. Expose icons as `protected readonly` class properties
4. Use the `ui-icon` component (not raw `lucide-icon`)

**Enforcement**: TypeScript compiler will reject string-based icon names.

---

## References

- [Lucide Icons](https://lucide.dev/icons/) - Browse available icons
- [lucide-angular](https://www.npmjs.com/package/lucide-angular) - npm package
- [UI Design System](../../../technical/frontend/UI-DESIGN-SYSTEM.md) - Component documentation
