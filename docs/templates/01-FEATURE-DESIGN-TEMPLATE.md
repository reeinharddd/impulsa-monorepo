---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "feature-design"  # REQUIRED: Type identifier for MCP/RAG
module: "[module-name]"  # REQUIRED: e.g., "inventory", "sales", "payments"
status: "approved"  # REQUIRED: draft | in-review | approved | deprecated
version: "1.0.0"  # REQUIRED: Semantic versioning (Major.Minor.Patch)
last_updated: "YYYY-MM-DD"  # REQUIRED: ISO date format
author: "@username"  # REQUIRED: GitHub username or team

# Keywords for semantic search (5-10 keywords)
keywords:
  - "feature"
  - "implementation"
  - "[feature-name]"  # e.g., "barcode-scanning", "loyalty-points"
  - "[technology]"  # e.g., "angular", "nestjs", "prisma"
  - "[domain]"  # e.g., "inventory", "sales"

# Related documentation
related_docs:
  database_schema: ""  # Path to related DB schema doc
  api_design: ""  # Path to related API design doc
  ux_flow: ""  # Path to related UX flow doc
  sync_strategy: ""  # Path to related sync strategy doc
  adr: ""  # Path to related ADR (if major architectural decision)

# Feature-specific metadata
feature_metadata:
  priority: "medium"  # "low" | "medium" | "high" | "critical"
  complexity: "medium"  # "low" | "medium" | "high"
  estimated_effort: "TBD"  # e.g., "2 days", "1 week", "1 sprint"
  dependencies: []  # List of dependent features/modules
  target_release: "TBD"  # e.g., "v1.2.0", "Q1 2026"
---

<!-- AI-INSTRUCTION: START -->
<!--
  This document is a TEMPLATE for Feature Designs.
  1. Preserve the Header Table and Metadata block.
  2. Fill in the "Agent Directives" to guide future AI interactions.
  3. Keep the structure strict for RAG (Retrieval Augmented Generation) efficiency.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">FEAT-XXX: [Feature Name]</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Feature Design Document</p>
    </td>
  </tr>
</table>

<div align="center">

  <!-- METADATA BADGES -->
  <img src="https://img.shields.io/badge/Status-Approved-green?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Priority-Medium-blue?style=flat-square" alt="Priority" />
  <img src="https://img.shields.io/badge/Owner-@Team-lightgrey?style=flat-square" alt="Owner" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                           |
| :------------- | :-------------------------------------------------------------------- |
| **Context**    | This document defines the technical specification for [Feature Name]. |
| **Constraint** | [e.g. Must use Signals for state management]                          |
| **Pattern**    | [e.g. Follow the 'Repository Pattern' for data access]                |
| **Related**    | [Related Files or Docs]                                               |

---

## 1. Overview

_What is this feature? What value does it provide to the user?_

## 2. User Stories / Requirements

- **US-01:** As a [role], I want to [action], so that [benefit].
- **US-02:** ...

## 3. Technical Architecture

### 3.1. Database Changes (Prisma)

```prisma
// Copy relevant schema changes here
model Example {
  id String @id @default(uuid())
}
```

```

### 3.2. API Endpoints (Backend)

| Method | Endpoint           | Description            |
| :----- | :----------------- | :--------------------- |
| POST   | `/api/v1/resource` | Creates a new resource |

### 3.3. UI Components (Frontend)

- `FeatureContainerComponent` (Standalone)
- `FeatureStore` (SignalStore)

## 4. Implementation Plan

1. [ ] Database Migration
2. [ ] Backend Service & Controller
3. [ ] Frontend Store & UI
4. [ ] E2E Tests

## 5. Open Questions and Risks

**Open Questions:**

- [Question 1: e.g., "How do we handle concurrent stock updates?"]
- [Question 2: e.g., "Should we implement rate limiting?"]

**Risks:**

- [Risk 1: Impact and mitigation strategy]
- [Risk 2: Impact and mitigation strategy]

---

## Appendix A: Change Log

| Date       | Version | Author     | Changes          |
| :--------- | :------ | :--------- | :--------------- |
| YYYY-MM-DD | 1.0.0   | @username  | Initial creation |

```
