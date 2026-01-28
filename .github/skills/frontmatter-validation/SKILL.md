---
name: frontmatter-validation
description: "Validate YAML frontmatter in documentation against template requirements. Use when creating or editing docs, or when the user asks to check frontmatter."
event: doc-save
auto_trigger: true
version: "3.0.0"
last_updated: "2026-01-27"

# Inputs/Outputs
inputs:
  - document_path
  - document_content
  - expected_template
output: validation_report
output_format: "Pass/Fail with error details"

# Auto-Trigger Rules
auto_invoke:
  events:
    - "doc-save"
    - "doc-creation"
  file_patterns:
    - "docs/**/*.md"
  conditions:
    - "markdown file saved in docs/"

# Validation
validation_rules:
  - "document_type must be valid"
  - "last_updated must be ISO date"
  - "version must be semver"
  - "at least 5 keywords required"
  - "author must start with @"

# Chaining
chain_after: [documentation]
chain_before: [related-docs-sync]

# Agent Association
called_by: ["@Scribe"]
mcp_tools:
  - mcp_payment-syste_query_docs_by_type
  - read_file
---

# Frontmatter Validation Skill

> **Purpose:** Validate YAML frontmatter in documentation against template requirements. Ensures consistency across all docs.

## Trigger

**When:** Any `.md` file in `docs/` is saved or created
**Context Needed:** Document content, template for document_type
**MCP Tools:** `mcp_payment-syste_query_docs_by_type`, `read_file`

## Universal Required Fields

All documents MUST have these base fields:

```yaml
---
document_type: "[type]" # REQUIRED - See valid values below
module: "[module]" # REQUIRED - Feature/domain name
status: "[status]" # REQUIRED - See valid values below
version: "X.Y.Z" # REQUIRED - Semantic versioning
last_updated: "YYYY-MM-DD" # REQUIRED - ISO date format
author: "@username" # REQUIRED - GitHub username or agent

keywords: # REQUIRED - 5-10 keywords for search
  - "[keyword1]"
  - "[keyword2]"
  - "[keyword3]"
  - "[keyword4]"
  - "[keyword5]"

related_docs: # REQUIRED - Can be empty if no relations
  database_schema: ""
  api_design: ""
  ux_flow: ""
  feature_design: ""
---
```

## Valid document_type Values

| document_type        | Template      | Description                     |
| :------------------- | :------------ | :------------------------------ |
| `general`            | 00-GENERAL    | Guides, overviews, tutorials    |
| `feature-design`     | 01-FEATURE    | Complete feature specifications |
| `adr`                | 02-ADR        | Architecture decision records   |
| `database-schema`    | 03-DATABASE   | Database structure              |
| `api-design`         | 04-API        | REST API endpoints              |
| `sync-strategy`      | 05-SYNC       | Offline/sync mechanisms         |
| `ux-flow`            | 06-UX         | User experience flows           |
| `testing-strategy`   | 07-TESTING    | QA plans and strategies         |
| `deployment-runbook` | 08-DEPLOYMENT | Deployment procedures           |
| `security-audit`     | 09-SECURITY   | Security reviews                |
| `business-strategy`  | N/A           | Business documentation          |
| `brand-identity`     | N/A           | Brand guidelines                |
| `market-analysis`    | N/A           | Market research                 |

## Valid status Values

```yaml
status: "draft"       # Work in progress
status: "in-review"   # Under review
status: "approved"    # Ready for use
status: "deprecated"  # No longer valid
status: "superseded"  # Replaced by newer version
```

## Field Format Validation

### Version Format

- MUST follow semantic versioning: `MAJOR.MINOR.PATCH`
- Example: `1.2.3`
- Major: Breaking changes
- Minor: Additive changes
- Patch: Documentation fixes

### Date Format

- MUST be ISO date: `YYYY-MM-DD`
- Example: `2026-01-27`
- Must be valid calendar date

### Keywords

- MINIMUM 5 keywords
- MAXIMUM 10 keywords
- Use lowercase
- Specific to document content
- Include technical terms, domain names

### Author

- MUST start with `@`
- Examples: `@Architect`, `@erikcampobadal`, `@team-backend`

## Document-Specific Metadata

### Database Schema (`database-schema`)

Required additional fields:

```yaml
database:
  engine: "postgresql" # REQUIRED
  prisma_version: "5.x" # REQUIRED
  rls_enabled: false # REQUIRED
  multi_tenant: false # REQUIRED

schema_stats: # REQUIRED
  table_count: 5
  entity_count: 5
  relationship_count: 8
```

### API Design (`api-design`)

Required additional fields:

```yaml
api_metadata:
  base_path: "/api/v1/resource" # REQUIRED
  auth_required: true # REQUIRED
  rate_limit: "100 requests/minute" # OPTIONAL
  versioning: "v1" # REQUIRED
```

### ADR (`adr`)

Required additional fields:

```yaml
adr_metadata:
  adr_number: "001" # REQUIRED - 3 digits
  decision_date: "YYYY-MM-DD" # REQUIRED
  impact_level: "high" # REQUIRED - low | medium | high
  affected_modules: # REQUIRED - List of modules
    - "authentication"
    - "payments"
```

### UX Flow (`ux-flow`)

Required additional fields:

```yaml
ux_metadata:
  platform: "web" # REQUIRED - web | mobile | both
  user_roles: # REQUIRED
    - "merchant"
    - "admin"
  complexity: "medium" # REQUIRED - low | medium | high
```

### Sync Strategy (`sync-strategy`)

Required additional fields:

```yaml
sync_metadata:
  sync_type: "bidirectional" # REQUIRED - unidirectional | bidirectional
  conflict_strategy: "last-write-wins" # REQUIRED
  offline_duration: "7 days" # REQUIRED
```

### Testing Strategy (`testing-strategy`)

Required additional fields:

```yaml
testing_metadata:
  test_types: # REQUIRED
    - "unit"
    - "integration"
    - "e2e"
  coverage_target: 80 # REQUIRED - percentage
  automation_level: "high" # REQUIRED - low | medium | high
```

### Deployment Runbook (`deployment-runbook`)

Required additional fields:

```yaml
deployment_metadata:
  environment: "production" # REQUIRED - dev | staging | production
  deployment_type: "rolling" # REQUIRED - blue-green | rolling | canary
  rollback_strategy: "automatic" # REQUIRED
```

### Security Audit (`security-audit`)

Required additional fields:

```yaml
security_metadata:
  audit_date: "YYYY-MM-DD" # REQUIRED
  severity: "critical" # REQUIRED - low | medium | high | critical
  compliance_framework: "OWASP" # OPTIONAL
  remediation_status: "pending" # REQUIRED - pending | in-progress | completed
```

### Business Documentation (`business-strategy`, `brand-identity`, `market-analysis`)

Required additional fields:

```yaml
stakeholders: # REQUIRED - Non-technical roles
  - "CEO"
  - "Product Manager"
  - "Marketing Lead"
```

## Validation Process

1. **Check YAML exists** - Document MUST have frontmatter
2. **Parse YAML** - Must be valid YAML syntax
3. **Validate universal fields** - All base fields present
4. **Validate formats** - Version, date, author formats
5. **Check document-specific** - Additional fields for document_type
6. **Validate keywords** - 5-10 keywords present
7. **Validate related_docs** - Valid paths or empty

## Error Messages

| Error                           | Message                                                     |
| :------------------------------ | :---------------------------------------------------------- |
| Missing YAML frontmatter        | "YAML frontmatter not found. Add --- block at top of file." |
| Invalid document_type           | "Invalid document_type '[value]'. See valid values list."   |
| Invalid status                  | "Invalid status '[value]'. Use: draft \| in-review \| etc." |
| Invalid version format          | "Version must be semantic (X.Y.Z), got '[value]'."          |
| Invalid date format             | "Date must be YYYY-MM-DD, got '[value]'."                   |
| Insufficient keywords           | "Minimum 5 keywords required, found [count]."               |
| Missing database metadata       | "database-schema requires 'database' and 'schema_stats'."   |
| Missing api_metadata            | "api-design requires 'api_metadata' with base_path, etc."   |
| Missing adr_metadata            | "adr requires 'adr_metadata' with adr_number, etc."         |
| Invalid ADR number              | "ADR number must be 3 digits (001-999), got '[value]'."     |
| Missing author @                | "Author must start with @ (e.g., @username)."               |
| related_docs invalid path       | "Path '[path]' in related_docs does not exist."             |
| Document-specific field missing | "[field] is required for document_type '[type]'."           |

## Validation Success Criteria

Document passes validation when:

- [ ] YAML frontmatter exists and parses correctly
- [ ] All universal required fields present
- [ ] `document_type` is valid value
- [ ] `status` is valid value
- [ ] `version` follows semantic versioning
- [ ] `last_updated` is valid ISO date
- [ ] `author` starts with @
- [ ] 5-10 keywords present
- [ ] Document-specific metadata complete (if applicable)
- [ ] `related_docs` paths exist or are empty
- [ ] No YAML syntax errors

## Validation Rules

1. **Type Check:** `document_type` must match valid types
2. **Date Format:** `last_updated` must be ISO date (YYYY-MM-DD)
3. **Version Format:** `version` must be semver (X.Y.Z)
4. **Keywords:** At least 5 keywords required
5. **Author:** Must start with `@`
6. **Related Docs:** Paths must exist or be empty string

## Auto-Fix Suggestions

When validation fails, suggest:

- Missing fields with defaults
- Date format corrections
- Path corrections for related_docs

## Example Output

```json
{
  "valid": false,
  "errors": [
    {
      "field": "last_updated",
      "message": "Invalid date format",
      "suggestion": "2026-01-27"
    }
  ],
  "warnings": [
    { "field": "keywords", "message": "Only 3 keywords, recommend 5-10" }
  ]
}
```

## References

- [DOCUMENTATION-WORKFLOW.md](/docs/process/standards/DOCUMENTATION-WORKFLOW.md)
- [docs/templates/](/docs/templates/) - All template files with frontmatter examples

```

## Reference

- [DOCUMENTATION-WORKFLOW.md](/docs/process/standards/DOCUMENTATION-WORKFLOW.md)
- [docs/templates/](/docs/templates/)
```
