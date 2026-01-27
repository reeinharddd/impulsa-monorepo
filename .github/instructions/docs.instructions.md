---
applyTo: "docs/**/*.md"
---

# Documentation Instructions

These instructions apply to all Markdown documentation files.

## Template Requirement

ALL documentation MUST use approved templates from `docs/templates/`:

| Template | Use For |
|:---------|:--------|
| 00-GENERAL | Guides, overviews |
| 01-FEATURE-DESIGN | Feature specs |
| 02-ADR | Architecture decisions |
| 03-DATABASE-SCHEMA | DB structure |
| 04-API-DESIGN | REST endpoints |
| 05-SYNC-STRATEGY | Offline/sync |
| 06-UX-FLOW | User journeys |
| 07-TESTING-STRATEGY | QA plans |
| 08-DEPLOYMENT-RUNBOOK | Deploy procedures |
| 09-SECURITY-AUDIT | Security reviews |

## YAML Frontmatter (REQUIRED)

```yaml
---
document_type: "[type]"
module: "[module-name]"
status: "draft"
version: "1.0.0"
last_updated: "YYYY-MM-DD"
author: "@username"

keywords:
  - "keyword1"
  - "keyword2"

related_docs:
  database_schema: ""
  api_design: ""
---
```

## Separation of Concerns

- **Database docs:** ONLY tables, columns, indexes
- **API docs:** ONLY endpoints, DTOs, status codes
- **UX docs:** ONLY screens, user flows
- **Feature docs:** Business logic, can LINK to above

## Change Log (REQUIRED)

Every document needs:

```markdown
## Appendix A: Change Log

| Date | Version | Author | Changes |
|:-----|:--------|:-------|:--------|
| YYYY-MM-DD | 1.0.0 | @author | Initial |
```

## Markdown Standards

- Use CommonMark spec
- Fenced code blocks with language
- Tables with alignment
- Relative links for internal docs
- No emojis in technical docs
- No trailing whitespace

## MCP Integration

Documents are indexed by MCP server. To improve searchability:
- Use clear section headings
- Include relevant keywords
- Link related documents in frontmatter
