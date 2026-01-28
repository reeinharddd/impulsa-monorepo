# Shared Components

This directory contains the Atomic Design component library.

**Documentation:** [UI DESIGN SYSTEM](../../../../../../docs/technical/frontend/UI-DESIGN-SYSTEM.md)

## Structure

- **atoms/**: Base elements (Button, Input, Icon) - No dependencies on other atoms.
- **molecules/**: Groups of atoms (FormField, SearchBar).
- **organisms/**: Complex sections (Sidebar, Header).
- **layouts/**: Page-level layouts.

## Rules

1. **Direct Imports Only**: Import from the specific file, e.g., `@shared/components/atoms/button/button.component`.
2. **No Barrel Files**: Do not use `index.ts`.
3. **Icon System**: Use `lucide-angular` and `ui-icon`. See [ADR-003](../../../../../../docs/technical/architecture/adr/003-ICON-SYSTEM.md).
