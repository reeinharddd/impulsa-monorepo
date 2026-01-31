---
# YAML Frontmatter - Metadata for Copilot Auto-Discovery
skill_name: "business-documentation"
description: "Generate business strategy, brand identity, and market analysis documentation. Use when creating non-technical docs, business plans, or when the user asks about business documentation."
version: "1.0.0"
last_updated: "2026-01-27"
author: "@Scribe"

# Skill Execution Context
scope: "documentation"
auto_invoke:
  when:
    - "User requests business documentation (strategy, brand, market)"
    - "Creating docs in docs/business/**"
    - "Non-technical stakeholder documentation needed"
    - "Brand guidelines or visual identity docs"
  conditions:
    - file_patterns: ["docs/business/**/*.md"]
    - keywords:
        [
          "business strategy",
          "brand identity",
          "market analysis",
          "business model",
          "competitive analysis",
          "stakeholders",
        ]

# Related Skills & Agents
chains_with: ["documentation", "frontmatter-validation"]
invoked_by: ["@Scribe", "@Architect"]
agents: ["@Scribe", "@Architect"]

# Key Topics & Patterns
keywords:
  - "business strategy"
  - "brand identity"
  - "market analysis"
  - "business model"
  - "competitive landscape"
  - "stakeholders"
  - "non-technical documentation"
---

# Skill: business-documentation

**Purpose:** Generate business-focused documentation (strategy, brand, market analysis) for non-technical stakeholders.

## Scope: Business vs Technical Documentation

**Ref:** [business.instructions.md](../../../.github/instructions/business.instructions.md)

### Business Documentation (THIS SKILL)

| Type     | Purpose                            | Audience            | Examples                     |
| :------- | :--------------------------------- | :------------------ | :--------------------------- |
| Brand    | Visual identity, tone, messaging   | Marketing, Design   | BRAND-IDENTITY.md            |
| Strategy | Business model, positioning        | Leadership, Product | BUSINESS-MODEL-ANALYSIS.md   |
| Market   | Competitor analysis, opportunities | Product, Sales      | NO-CUSTOMER-APP-ADVANTAGE.md |

**Content Characteristics:**

- ✅ Clear, non-technical language
- ✅ Market data with sources
- ✅ Business terms defined in GLOSSARY.md
- ✅ Competitive landscape references
- ✅ Actionable recommendations
- ❌ NO implementation details
- ❌ NO developer jargon
- ❌ NO code snippets

### Technical Documentation (NOT THIS SKILL)

| Type         | Purpose                           | Audience           | Examples           |
| :----------- | :-------------------------------- | :----------------- | :----------------- |
| Database     | Schema, tables, indexes           | Backend, DevOps    | DATABASE-SCHEMA.md |
| API          | Endpoints, DTOs, status codes     | Backend, Frontend  | API-DESIGN.md      |
| UX           | User flows, screens, interactions | Frontend, Design   | UX-FLOW.md         |
| Architecture | System design, patterns           | Architect, Backend | ADR-\*.md          |

**Separation of Concerns:**

- Business docs CAN LINK to technical docs for implementation
- Technical docs DO NOT include business strategy
- Each document has ONE clear purpose

## Document Types

### 1. Brand Identity

**Template:** `docs/templates/00-GENERAL-DOC-TEMPLATE.md`

**YAML Frontmatter:**

```yaml
---
document_type: "brand-identity"
module: "business"
status: "approved"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
author: "@username"

keywords:
  - "brand identity"
  - "visual identity"
  - "messaging"
  - "tone of voice"

stakeholders:
  - "marketing"
  - "design"
  - "product"
---
```

**Required Sections:**

1. **Brand Overview**
   - Mission statement
   - Vision statement
   - Brand values

2. **Visual Identity**
   - Logo usage guidelines
   - Color palette (with hex codes)
   - Typography
   - Imagery style

3. **Tone & Voice**
   - Brand personality traits
   - Writing style guidelines
   - Examples: DO vs DON'T

4. **Messaging Framework**
   - Key messages
   - Target audience descriptions
   - Positioning statement

**Example:**

```markdown
## Brand Overview

**Mission:** Empoderar a comerciantes mexicanos con herramientas simples y poderosas para crecer su negocio.

**Vision:** Ser la plataforma #1 de gestión empresarial para comercios en México.

**Brand Values:**

- **Simplicidad:** Herramientas fáciles de usar sin curva de aprendizaje
- **Confianza:** Datos seguros, plataforma estable
- **Empoderamiento:** Damos control total al comerciante

## Visual Identity

### Logo Usage

El logo debe mantener un espacio libre de 20px alrededor en todos lados.

**DO:**

- Use el logo en fondo blanco o brand-surface (#f3f0ff)
- Mantenga proporciones originales

**DON'T:**

- Distorsione o rote el logo
- Cambie colores del logo
- Use sobre fondos con bajo contraste

### Color Palette

| Color             | Hex       | Use Case                            |
| :---------------- | :-------- | :---------------------------------- |
| Primary (Purple)  | `#4c1d95` | CTAs, botones primarios             |
| Secondary (Green) | `#10b981` | Éxito, confirmaciones               |
| Accent (Orange)   | `#f97316` | Resaltar, advertencias              |
| Gold              | `#fcc242` | Premium, características especiales |

For technical implementation, see [BRAND-IDENTITY.md](../../docs/business/brand/BRAND-IDENTITY.md)
```

### 2. Business Strategy

**Template:** `docs/templates/00-GENERAL-DOC-TEMPLATE.md`

**YAML Frontmatter:**

```yaml
---
document_type: "business-strategy"
module: "business"
status: "draft"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
author: "@username"

keywords:
  - "business strategy"
  - "business model"
  - "market positioning"
  - "competitive advantage"

stakeholders:
  - "leadership"
  - "product"
  - "sales"

related_docs:
  market_analysis: "docs/business/strategy/MARKET-ANALYSIS.md"
  feature_design: ""
---
```

**Required Sections:**

1. **Business Model**
   - Revenue streams
   - Cost structure
   - Key partners
   - Value proposition

2. **Market Positioning**
   - Target market segments
   - Unique selling proposition (USP)
   - Competitive differentiation

3. **Strategic Goals**
   - Short-term objectives (3-6 months)
   - Long-term vision (1-3 years)
   - Key performance indicators (KPIs)

4. **Competitive Advantage**
   - What makes us different?
   - Market gaps we fill
   - Barriers to entry we create

**Example:**

```markdown
## Business Model

### Revenue Streams

1. **Subscription Tiers**
   - Basic (Gratis): Hasta 100 ventas/mes
   - Pro ($299 MXN/mes): Ventas ilimitadas, reportes avanzados
   - Enterprise ($999 MXN/mes): Multi-sucursal, API, soporte prioritario

2. **Transaction Fees**
   - 2.9% + $3 MXN por transacción con tarjeta
   - Reducimos a 2.5% para clientes Pro

### Value Proposition

**For:** Comerciantes mexicanos con 1-5 empleados
**Who:** Necesitan control de inventario y ventas sin complicaciones
**Our product:** Es una plataforma todo-en-uno de gestión empresarial
**That:** Funciona offline, sincroniza automáticamente, y no requiere capacitación
**Unlike:** Sistemas complejos que requieren TI o contador
**We:** Diseñamos específicamente para México (facturación SAT, OXXO Pay, etc.)

## Market Positioning

### Target Segments

1. **Primary:** Tiendas de abarrotes (50,000+ en México)
   - 1-3 empleados
   - Ventas: $50k-$200k MXN/mes
   - No tienen sistema digital

2. **Secondary:** Cafeterías/Restaurantes pequeños
   - 3-8 empleados
   - Necesitan control de inventario perecedero

3. **Tertiary:** Servicios (salones, talleres)
   - Citas y pagos recurrentes

### Competitive Advantage

**WHY WE WIN:**

1. **Offline-First:** Competidores requieren internet constante
2. **No Customer App:** Reducimos fricción vs. plataformas que obligan al cliente a descargar app
3. **México-Specific:** Facturación SAT integrada, OXXO Pay, Mercado Pago
4. **Precio:** $299 vs $599+ de competencia

See [NO-CUSTOMER-APP-ADVANTAGE.md](../../docs/business/strategy/NO-CUSTOMER-APP-ADVANTAGE.md) for detailed analysis.
```

### 3. Market Analysis

**Template:** `docs/templates/00-GENERAL-DOC-TEMPLATE.md`

**YAML Frontmatter:**

```yaml
---
document_type: "market-analysis"
module: "business"
status: "in-review"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
author: "@username"

keywords:
  - "market analysis"
  - "competitive landscape"
  - "market opportunities"
  - "competitor research"

stakeholders:
  - "product"
  - "sales"
  - "marketing"

related_docs:
  business_strategy: "docs/business/strategy/BUSINESS-MODEL-ANALYSIS.md"
---
```

**Required Sections:**

1. **Market Size & Trends**
   - Total addressable market (TAM)
   - Serviceable available market (SAM)
   - Market growth trends
   - Sources for all data

2. **Competitive Landscape**
   - Direct competitors
   - Indirect competitors
   - Competitive positioning matrix

3. **Market Opportunities**
   - Unmet needs
   - Market gaps
   - Emerging trends

4. **Threats & Challenges**
   - Competitive threats
   - Market barriers
   - Regulatory challenges

**Example:**

```markdown
## Market Size & Trends

### Total Addressable Market (TAM)

**Source:** INEGI Censo Económico 2020

- **5.2 millones** de micro-empresas en México
- **87%** son comercios minoristas o servicios
- **4.5 millones** de negocios objetivo (retail + services)

### Serviceable Available Market (SAM)

Filtering by:

- 1-10 employees
- Annual revenue $600k-$5M MXN
- Currently NO digital system

**Result:** ~1.2 millones de negocios

### Market Trends

1. **Digitalization:** COVID-19 aceleró adopción digital
   - 45% de comercios adoptaron algún sistema digital en 2020-2022
   - Fuente: [Estudio AMVO 2022]

2. **Regulatory:** SAT mandó facturación electrónica obligatoria
   - 100% de negocios formales DEBEN facturar digitalmente desde 2023
   - Oportunidad: Ofrecer facturación integrada

## Competitive Landscape

| Competitor       | Price/Month | Offline?   | SAT?   | Market Share | Weakness                   |
| :--------------- | :---------- | :--------- | :----- | :----------- | :------------------------- |
| Inventium        | $599 MXN    | ❌ No      | ✅ Yes | ~15%         | Requiere internet          |
| QuickPOS         | $399 MXN    | ⚠️ Limited | ❌ No  | ~10%         | No facturación SAT         |
| **Impulsa** (US) | $299 MXN    | ✅ Yes     | ✅ Yes | Target 5%    | **Offline + SAT + Precio** |

### Competitive Positioning Matrix
```

High Price
↑
│ Inventium ●
│
│ QuickPOS ●
│
│ Impulsa ●
│
└─────────────────────────→ Feature Richness
Low Price

```

## Market Opportunities

### 1. Unmet Needs

**Problem:** Comerciantes pierden ventas cuando internet falla

- 70% de tiendas en México reportan fallas de internet semanales
- Competidores NO funcionan offline
- **Our Solution:** Offline-first architecture

### 2. Market Gaps

**Gap:** No hay solución barata + completa para México

- Opciones baratas ($200-$300): Sin facturación SAT, sin soporte
- Opciones completas ($500+): Muy caras para micro-empresas
- **Our Positioning:** $299 con facturación SAT incluida
```

## Language & Tone

**CRITICAL:** Business documentation is for NON-TECHNICAL stakeholders.

### DO ✅

- Use plain language
- Define acronyms first time: "SAT (Servicio de Administración Tributaria)"
- Use business metrics: "Increase revenue by 20%"
- Include market sources: "Source: INEGI 2022"
- Use tables for comparisons
- Use bullet points for clarity

### DON'T ❌

```markdown
<!-- ❌ WRONG: Technical jargon -->

We implemented a REST API with JWT auth to handle...

<!-- ✅ CORRECT: Business language -->

The system authenticates users securely using industry-standard methods.

<!-- ❌ WRONG: Code references -->

The `authService.login()` method validates credentials...

<!-- ✅ CORRECT: Feature description -->

The login system validates user credentials before granting access.

<!-- ❌ WRONG: Database details -->

The `users` table has a foreign key to `merchants`...

<!-- ✅ CORRECT: Business relationship -->

Each merchant is linked to a user account for authentication.
```

## Linking to Technical Docs

Business docs CAN link to technical docs for implementation:

```markdown
## Implementation

For technical details on how offline synchronization works, see:

- [SYNC-STRATEGY.md](../../technical/backend/sync/SYNC-STRATEGY.md)
- [OFFLINE-ARCHITECTURE.md](../../technical/architecture/OFFLINE-ARCHITECTURE.md)
```

## Validation

Use `frontmatter-validation` skill to ensure:

```yaml
# Business-specific frontmatter
document_type: "business-strategy" | "brand-identity" | "market-analysis"
module: "business"
stakeholders: ["leadership", "product", "sales", "marketing", "design"]
keywords: ["business strategy", "brand", "market", ...] # NO technical keywords
```

## Common Mistakes

| Mistake                             | Fix                                      |
| :---------------------------------- | :--------------------------------------- |
| Technical jargon in business doc    | Use plain language, define acronyms      |
| Missing market data sources         | ALWAYS cite sources                      |
| Mixing business + technical content | Separate docs, use links                 |
| No stakeholder identification       | Add to frontmatter                       |
| Using code examples                 | Remove code, describe functionality only |
| Database/API details                | Link to technical docs instead           |

## Workflow

1. **Identify audience:** Leadership? Marketing? Product?
2. **Select document type:** Brand, Strategy, or Market Analysis
3. **Use plain language:** NO technical terms
4. **Include sources:** Market data MUST be cited
5. **Define acronyms:** First use of any acronym
6. **Add stakeholders to frontmatter**
7. **Link to technical docs** for implementation details

## Integration with Other Skills

| Skill                    | When to Chain                                |
| :----------------------- | :------------------------------------------- |
| `documentation`          | When creating any business documentation     |
| `frontmatter-validation` | After creating doc to validate YAML          |
| `related-docs-sync`      | When linking business docs to technical docs |

---

**Version:** 1.0.0
**Last Updated:** 2026-01-27
**Author:** @Scribe
**Related Skills:** documentation, frontmatter-validation, related-docs-sync
