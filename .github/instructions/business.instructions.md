---
applyTo: "docs/business/**/*.md"
---

# Business Documentation Instructions

These instructions apply to all Markdown files in the business documentation directory.

## Purpose

Business documentation covers non-technical aspects: brand identity, business strategy, market analysis, and positioning. These docs guide product decisions but do NOT include implementation details.

## Directory Structure

```
docs/business/
├── brand/                 # Brand identity, visual guidelines
│   └── BRAND-IDENTITY.md
└── strategy/              # Business model, market analysis
    ├── BUSINESS-MODEL-ANALYSIS.md
    └── NO-CUSTOMER-APP-ADVANTAGE.md
```

## Document Types

| Type     | Purpose                            | Audience            |
| :------- | :--------------------------------- | :------------------ |
| Brand    | Visual identity, tone, messaging   | Marketing, Design   |
| Strategy | Business model, positioning        | Leadership, Product |
| Market   | Competitor analysis, opportunities | Product, Sales      |

## YAML Frontmatter (REQUIRED)

```yaml
---
document_type: "business-strategy" # or "brand-identity", "market-analysis"
module: "business"
status: "draft"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
author: "@username"

keywords:
  - "keyword1"
  - "keyword2"

stakeholders:
  - "role1"
  - "role2"
---
```

## Content Guidelines

### DO

- Use clear, non-technical language
- Include market data with sources
- Define business terms in GLOSSARY.md
- Reference competitive landscape
- Include actionable recommendations

### DO NOT

- Include implementation details (that's technical docs)
- Use developer jargon
- Mix technical architecture with business strategy
- Include code snippets

## Linking

Business docs can LINK to technical docs for implementation:

```markdown
For technical implementation, see:

- [PRELIMINARY-DESIGN.md](/docs/technical/architecture/PRELIMINARY-DESIGN.md)
```

## Change Control

Business docs require stakeholder review before approval:

```yaml
status: "draft"      # Work in progress
status: "in-review"  # Under stakeholder review
status: "approved"   # Ready for use
status: "superseded" # Replaced by newer version
```

## Reference

- [GLOSSARY.md](/docs/GLOSSARY.md) - Business term definitions
- [BRAND-IDENTITY.md](/docs/business/brand/BRAND-IDENTITY.md) - Brand guidelines
