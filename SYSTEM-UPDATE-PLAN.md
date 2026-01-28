# Plan de Actualización del Sistema de Agentes y Skills

> **Fecha:** 2026-01-27
> **Objetivo:** Transformar toda la información en docs/ en agentes y skills funcionales y completos

## Problema Identificado

Actualmente, los agentes y skills NO contienen toda la información necesaria de la documentación, causando:

- Documentación incompleta o incorrecta
- Violaciones de separation of concerns
- YAML frontmatter incompleto o faltante
- Falta de reglas específicas por dominio

## Análisis Completado

Se revisaron los siguientes documentos fuente:

- `docs/process/standards/DOCUMENTATION-WORKFLOW.md` (825 líneas)
- `docs/process/standards/STANDARDS.md` (680 líneas)
- `docs/process/workflow/AI-DEVELOPMENT-STANDARD.md` (222 líneas)
- `docs/process/workflow/DEVELOPMENT-RULES.md`
- `.github/instructions/*.instructions.md` (7 archivos)

## Actualizaciones Necesarias

### FASE 1 - CRÍTICO (Máximo impacto)

#### 1.1. documentation.SKILL.md

**Archivo:** `.github/skills/documentation/SKILL.md`
**Acción:** Reemplazar completamente
**Información a agregar:**

- Template Selection Decision Tree completo (10 templates)
- Separation of Concerns Matrix completa (tabla con ✅❌🔗)
- Complete YAML Frontmatter Requirements (por cada tipo de documento)
- Document-Specific Metadata (database, api, adr, ux, sync)
- Template-Specific Mandatory Sections
- PlantUML Standards (ER, Sequence, Architecture diagrams)
- Change Log Requirements (version bumping rules)
- Documentation Creation Workflow (8 pasos)
- Common Violations & How to Fix (3 ejemplos completos)
- Document Review Checklist (6 categorías, 35+ items)
- Output Format specification
- Chaining con otros skills

**Fuente:**

- `DOCUMENTATION-WORKFLOW.md` (Secciones 2-10)
- `STANDARDS.md` (Sección 3.3 PlantUML)
- `docs.instructions.md`

**Impacto:** Resolverá el 60% del caos en documentación

---

#### 1.2. frontmatter-validation.SKILL.md

**Archivo:** `.github/skills/frontmatter-validation/SKILL.md`
**Acción:** Expandir con checklist completo
**Información a agregar:**

- Required fields por tipo de documento (universal + específicos)
- document_type valid values (10 templates)
- status valid values (draft | in-review | approved | deprecated | superseded)
- Version format validation (semantic versioning)
- Date format validation (YYYY-MM-DD)
- Keywords validation (5-10 keywords)
- related_docs structure y paths válidos
- Document-specific metadata por template:
  - database: engine, prisma_version, rls_enabled, schema_stats
  - api_metadata: base_path, auth_required, rate_limit, versioning
  - adr_metadata: adr_number, decision_date, impact_level, affected_modules
  - ux_metadata: platform, user_roles, complexity
  - sync_metadata: sync_type, conflict_strategy, offline_duration
- Error messages claros para cada tipo de falta
- Validation success criteria

**Fuente:**

- `DOCUMENTATION-WORKFLOW.md` (Sección 4, 6, 7)
- Templates 00-09 (YAML frontmatter de cada uno)

**Impacto:** Previene errores en metadatos, asegura calidad

---

#### 1.3. @Scribe Agent

**Archivo:** `.github/agents/Scribe.agent.md`
**Acción:** Agregar conocimiento completo de documentación
**Información a agregar:**

- Knowledge Hierarchy (Internal > External)
  - Internal Context (Primary): docs/ via MCP tools
  - External Context (Secondary): Web search
  - Authority rules
- Scribe Loop (Codification Protocol):
  1. Search Internal
  2. Search External (if null)
  3. Execute
  4. Codify (create doc from template)
- Template knowledge completo (10 templates)
- Migration guide para fixing violations
- Conventional Commits estándares
- Cross-referencing strategy
- Documentation versioning
- Prompting Standard integration

**Fuente:**

- `AI-DEVELOPMENT-STANDARD.md` (Secciones 4, 5, 6)
- `DOCUMENTATION-WORKFLOW.md` completo
- `STANDARDS.md`

**Impacto:** @Scribe podrá generar documentación completa y correcta

---

### FASE 2 - ALTO (Resolver separation of concerns)

#### 2.1. schema-doc-sync.SKILL.md

**Archivo:** `.github/skills/schema-doc-sync/SKILL.md`
**Acción:** Agregar separation of concerns completo
**Información a agregar:**

- QUÉ incluir en schema docs:
  - Table definitions (schema.TableName)
  - Column types, nullability, defaults
  - Indexes con SQL
  - Foreign Keys con SQL
  - Triggers, constraints
  - RLS policies
  - Example records (INSERT)
  - Performance & indexing strategy
  - Migration strategy
- QUÉ NO incluir (FORBIDDEN):
  - ❌ UI/UX flows → Move to ux-flows/
  - ❌ Business logic algorithms → Move to features/
  - ❌ API endpoint definitions → Move to api/
  - ❌ Sync strategies → Move to ADR
  - ❌ User stories → Move to features/
- Common violation patterns con ejemplos
- How to refactor violations (extraction process)
- Cross-reference format correcto
- PlantUML ER diagram standards

**Fuente:**

- `DOCUMENTATION-WORKFLOW.md` (Sección 3, 4.1, 10)
- `04-INVENTORY-SCHEMA.md` (ejemplo de violaciones)

**Impacto:** Elimina mezcla de concerns en DB docs

---

#### 2.2. @DataArchitect Agent

**Archivo:** `.github/agents/DataArchitect.agent.md`
**Acción:** Agregar todas las reglas de Prisma + DB
**Información a agregar:**

- Prisma Schema Conventions:
  - Model naming (PascalCase, singular)
  - Field naming (camelCase)
  - Required fields (id, createdAt, updatedAt, deletedAt)
  - Relations (One-to-Many, Many-to-Many)
  - Enums (UPPERCASE)
- Index Strategy:
  - Foreign key indexes
  - Composite unique
  - Search indexes
- Migration Rules:
  - Descriptive names
  - Never edit existing
  - Dangerous operations
- Separation of Concerns COMPLETO (columna Database del matrix)
- Documentation structure para schemas
- Anti-patterns (qué NO documentar)
- PlantUML para ER diagrams (standards)
- Prisma commands reference

**Fuente:**

- `prisma.instructions.md` completo
- `DOCUMENTATION-WORKFLOW.md` (Sección 3, 4.1)
- `DATABASE-DESIGN.md`

**Impacto:** @DataArchitect generará schemas y docs correctamente

---

#### 2.3. api-doc-generation.SKILL.md

**Archivo:** `.github/skills/api-doc-generation/SKILL.md`
**Acción:** Agregar NestJS patterns completos
**Información a agregar:**

- QUÉ incluir en API docs:
  - Endpoints (método, path, auth)
  - Request DTOs (class-validator)
  - Response DTOs
  - Query parameters
  - Path parameters
  - Headers requeridos
  - Status codes
  - Error responses (formato estándar)
  - Rate limiting
  - Versioning
  - Authentication/Authorization
  - Examples (request/response)
- QUÉ NO incluir:
  - ❌ Business logic → Move to features/
  - ❌ UI implementation → Move to ux-flows/
  - ❌ Database structure → Move to database/
- NestJS Patterns:
  - Controller structure
  - Guards (authentication, authorization)
  - Interceptors (logging, transform)
  - Pipes (validation)
  - Decorators (@Get, @Post, @Body, @Param)
- OpenAPI/Swagger integration
- Testing examples (request/response)

**Fuente:**

- `backend.instructions.md` (Controller/Service patterns)
- `DOCUMENTATION-WORKFLOW.md` (Sección 3)
- `04-API-DESIGN-TEMPLATE.md`

**Impacto:** API docs serán completos y consistentes

---

### FASE 3 - MEDIO (Nuevas capacidades)

#### 3.1. diagram-creation.SKILL.md (NUEVO)

**Archivo:** `.github/skills/diagram-creation/SKILL.md`
**Acción:** Crear desde cero
**Contenido:**

- PlantUML Syntax completo
- Diagram Types soportados:
  1. ER Diagrams (Database) - entity, relationship
  2. Sequence Diagrams (Flows) - actor, participant, arrows
  3. Architecture Diagrams - node, component, interface
  4. Class Diagrams - class, interface, relationship
  5. Component Diagrams - component, package
- Theme standards (!theme plain)
- Naming conventions para entities/nodes
- Layout best practices (left to right, top to bottom)
- Color coding (si aplica)
- Legend creation
- Examples para cada tipo
- When to use cada tipo de diagrama
- Integration con documentation
- Anti-patterns (no Mermaid, no draw.io, no external tools)

**Fuente:**

- `STANDARDS.md` (Sección 3.3 PlantUML)
- Diagramas existentes en `docs/`

**Impacto:** Diagramas consistentes y renderizables

---

#### 3.2. business-documentation.SKILL.md (NUEVO)

**Archivo:** `.github/skills/business-documentation/SKILL.md`
**Acción:** Crear desde cero
**Contenido:**

- Business docs vs Technical docs (diferencias)
- Directory structure: `docs/business/`
  - `brand/` - Brand identity, visual guidelines
  - `strategy/` - Business model, market analysis
- Non-technical language requirements
- Business-specific YAML frontmatter:
  - document_type: "business-strategy" | "brand-identity" | "market-analysis"
  - stakeholders (roles, not technical personas)
  - keywords (business terms, not technical)
- Do's:
  - Clear, non-technical language
  - Market data with sources
  - Business terms in GLOSSARY.md
  - Competitive landscape
  - Actionable recommendations
- Don'ts:
  - ❌ NO implementation details
  - ❌ NO developer jargon
  - ❌ NO mixing with technical architecture
  - ❌ NO code snippets
- Linking to technical docs (one-way: business → technical)
- Change Control:
  - status: draft | in-review | approved | superseded
  - Stakeholder review required
- Review process específico para business

**Fuente:**

- `business.instructions.md` completo
- `docs/business/**/*.md` (ejemplos existentes)
- `GLOSSARY.md` (business terms)

**Impacto:** Docs de negocio separados correctamente

---

#### 3.3. doc-refactoring.SKILL.md (NUEVO)

**Archivo:** `.github/skills/doc-refactoring/SKILL.md`
**Acción:** Crear desde cero
**Contenido:**

- Migration Guide completo de DOCUMENTATION-WORKFLOW
- How to identify violations:
  - Read through document
  - Check against Separation of Concerns Matrix
  - Note sections that don't belong
- How to extract content to correct template:
  1. Identify violating sections
  2. Copy content
  3. Create new doc from template
  4. Fill YAML frontmatter
  5. Adapt content to new template
- How to add cross-references:
  - Replace violating section with link
  - Format: [Link Text](path/to/doc.md#section)
- How to update change logs:
  - Original doc: version bump + "Refactor: moved X to Y"
  - New doc: v1.0.0 + "Extracted from [original]"
- Commit message para refactors:

  ```
  docs(module): refactor X to separate document

  Moved [content] from [original] to [new doc]
  for proper separation of concerns.

  - [Original] now contains only [concern]
  - [Content] moved to docs/path/new-doc.md
  ```

- Checklist de validation post-refactor:
  - [ ] Original doc has no violations
  - [ ] New doc follows template
  - [ ] Cross-references work
  - [ ] Both change logs updated
  - [ ] Both YAML frontmatter complete
- Common violation patterns:
  1. UI flow in DB doc
  2. DB schema in feature doc
  3. API endpoints in UX doc
  4. Business logic in DB doc

**Fuente:**

- `DOCUMENTATION-WORKFLOW.md` (Sección 8: Migration Guide)
- Violation examples de sección 10

**Impacto:** Poder fixing existing docs con violations

---

### FASE 4 - ACTUALIZACIONES DE AGENTES (Incluir instructions)

#### 4.1. @Backend Agent

**Archivo:** `.github/agents/Backend.agent.md`
**Acción:** Agregar todo de backend.instructions.md
**Información a agregar:**

- Architecture Rules:
  - Controllers MUST be thin (routing + validation only)
  - Services contain business logic
  - DTOs mandatory (class-validator)
- Code Patterns:
  - Controller pattern (ejemplo completo)
  - Service pattern (ejemplo completo)
  - Dependency injection
- Testing:
  - Unit tests (\*.spec.ts)
  - Integration tests (test/\*.e2e-spec.ts)
  - Mock Prisma (jest-mock-extended)
  - Target 80% coverage
- Error Handling:
  - NestJS built-in exceptions
  - Log errors with context
  - Consistent error responses
- TypeScript strict mode rules
- Conventional Commits

**Fuente:**

- `backend.instructions.md` completo
- `TYPESCRIPT-STRICT.md`

---

#### 4.2. @Frontend Agent

**Archivo:** `.github/agents/Frontend.agent.md`
**Acción:** Agregar todo de frontend + tailwind instructions
**Información a agregar:**

- Angular 21+ Rules:
  - Standalone components ONLY (NO NgModules)
  - Signals first (input(), output(), computed(), signal())
  - Change detection: OnPush always
- Import Rules (CRITICAL):
  - Direct, explicit imports ONLY
  - NO barrel files (index.ts)
  - Examples de imports correctos/incorrectos
- Shared Components (Atomic Design):
  - atoms/ - Independent, NO dependencies
  - molecules/ - Combinations of atoms
  - organisms/ - Complex UI sections
  - layouts/ - Page-level
- Atomic Design Rules:
  - Atoms MUST be independent
  - Choose the right level
- Icon System Rules (ADR-003):
  - Library: lucide-angular
  - Import: direct from library
  - Usage: [name]="IconObject" (NOT strings)
  - Expose: protected readonly properties
- Routing & Page Titles (ADR-004):
  - Strict localization via TitleStrategy
  - Route pattern: title: 'PAGES.DOMAIN.TITLE'
  - FORBIDDEN: static strings
- Template Rules:
  - Control flow (@if, @for, @switch)
  - DO NOT USE: *ngIf, *ngFor, [ngClass]
- Component Pattern (ejemplo completo)
- Guard Clauses (MUST USE):
  - Negated conditions
  - Early returns
  - Examples
- Internationalization (i18n):
  - TranslateModule
  - {{ 'KEY' | translate }}
  - NO hardcoded text
- Styling (Tailwind):
  - Brand colors
  - Component patterns
  - Forbidden patterns
  - Responsive design

**Fuente:**

- `frontend.instructions.md` completo
- `tailwind.instructions.md` completo
- `ADR-003-ICON-SYSTEM.md`
- `ADR-004-LOCALIZED-TITLES.md`

---

#### 4.3. @QA Agent

**Archivo:** `.github/agents/QA.agent.md`
**Acción:** Agregar todo de testing.instructions.md
**Información a agregar:**

- Test File Naming:
  - Unit: `[name].spec.ts`
  - Integration: `test/[feature].e2e-spec.ts`
  - Component: `[component].component.spec.ts`
- Test Structure (AAA Pattern):
  - Arrange
  - Act
  - Assert
  - Example completo
- Coverage Requirements:
  - Services: 80%
  - Controllers: 70%
  - Utils: 90%
  - Components: 70%
  - Critical paths: 95%
- Mocking:
  - Prisma (jest-mock-extended)
  - Angular (ComponentRef.setInput)
- Test Commands
- Rules:
  - NO skipped tests
  - NO flaky tests
  - Every bug fix MUST have test

**Fuente:**

- `testing.instructions.md` completo

---

## Resumen de Impacto

| Fase   | Archivos | Impacto Esperado                               |
| :----- | :------- | :--------------------------------------------- |
| FASE 1 | 3        | 60% - Documentación completa y correcta        |
| FASE 2 | 3        | 25% - Separation of concerns respetada         |
| FASE 3 | 3        | 10% - Nuevas capacidades (diagramas, business) |
| FASE 4 | 3        | 5% - Agentes con conocimiento domain completo  |
| TOTAL  | 12       | 100% - Sistema completamente funcional         |

## Siguiente Paso

1. **Revisar este plan** y aprobar fases
2. **Ejecutar FASE 1** primero (máximo impacto)
3. **Validar** con generación de documentación real
4. **Continuar** con FASE 2-4

## Archivos a Actualizar

```
.github/skills/
├── documentation/SKILL.md                 [FASE 1.1] ✏️ Reemplazar
├── frontmatter-validation/SKILL.md        [FASE 1.2] ✏️ Expandir
├── schema-doc-sync/SKILL.md               [FASE 2.1] ✏️ Expandir
├── api-doc-generation/SKILL.md            [FASE 2.2] ✏️ Expandir
├── diagram-creation/                      [FASE 3.1] ➕ Crear
│   └── SKILL.md
├── business-documentation/                [FASE 3.2] ➕ Crear
│   └── SKILL.md
└── doc-refactoring/                       [FASE 3.3] ➕ Crear
    └── SKILL.md

.github/agents/
├── Scribe.agent.md                        [FASE 1.3] ✏️ Expandir
├── DataArchitect.agent.md                 [FASE 2.2] ✏️ Expandir
├── Backend.agent.md                       [FASE 4.1] ✏️ Expandir
├── Frontend.agent.md                      [FASE 4.2] ✏️ Expandir
└── QA.agent.md                            [FASE 4.3] ✏️ Expandir
```

## Método de Ejecución Recomendado

Debido a la cantidad masiva de contenido, se recomienda:

1. Usar `runSubagent` con este plan como contexto
2. Ejecutar fase por fase
3. Validar cada fase antes de continuar
4. Usar `mcp_sequentialthi_sequentialthinking` para planificar cada actualización

---

**Preparado por:** GitHub Copilot
**Fecha:** 2026-01-27
**Versión:** 1.0.0
