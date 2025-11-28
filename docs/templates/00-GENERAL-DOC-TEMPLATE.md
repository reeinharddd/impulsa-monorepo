---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "general"  # REQUIRED: Type identifier for MCP/RAG
module: "[module-name]"  # REQUIRED: e.g., "onboarding", "architecture", "business"
status: "approved"  # REQUIRED: draft | in-review | approved | deprecated
version: "1.0.0"  # REQUIRED: Semantic versioning (Major.Minor.Patch)
last_updated: "YYYY-MM-DD"  # REQUIRED: ISO date format
author: "@username"  # REQUIRED: GitHub username or team

# Keywords for semantic search (5-10 keywords)
keywords:
  - "[topic-1]"  # e.g., "getting-started", "architecture"
  - "[topic-2]"  # e.g., "guide", "tutorial"
  - "[topic-3]"  # Add relevant search terms
  - "documentation"

# Related documentation
related_docs:
  database_schema: ""  # Path to related DB schema (if applicable)
  api_design: ""  # Path to related API design (if applicable)
  feature_design: ""  # Path to related feature design (if applicable)
  ux_flow: ""  # Path to related UX flow (if applicable)

# Document-specific metadata (optional, customize as needed)
doc_metadata:
  audience: "developers"  # "developers" | "architects" | "business" | "all"
  complexity: "beginner"  # "beginner" | "intermediate" | "advanced"
  estimated_read_time: "5 min"  # e.g., "5 min", "15 min"
---

<!-- AI-INSTRUCTION: START -->
<!--
  This document is a TEMPLATE. When creating new docs:
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
      <h1 style="margin: 0; border-bottom: none;">[Document Title]</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">[Subtitle or Document Type]</p>
    </td>
  </tr>
</table>

<div align="center">

  <!-- METADATA BADGES -->
  <img src="https://img.shields.io/badge/Status-Approved-green?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Audience-Developers-blue?style=flat-square" alt="Audience" />
  <img src="https://img.shields.io/badge/Last%20Updated-YYYY--MM--DD-lightgrey?style=flat-square" alt="Date" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                                  |
| :------------- | :--------------------------------------------------------------------------- |
| **Context**    | [e.g. This file defines the Single Source of Truth for Payment Calculations] |
| **Constraint** | [e.g. Do NOT modify formulas without explicit approval from @Architect]      |
| **Pattern**    | [e.g. Follow the 'Factory Pattern' defined in DESIGN-PATTERNS.md]            |
| **Related**    | `apps/backend/src/modules/payments/`                                         |

---

## 1. Executive Summary

High-level overview of the document purpose and scope.

**Purpose:** [Brief description of what this document covers]

**Target Audience:** [Who should read this document]

**Key Takeaways:**

- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]

---

## 2. Context and Motivation

**Problem Statement:** [What problem are we addressing?]

**Background:** [Relevant context and history]

**Goals:** [What we aim to achieve]

---

## 3. Core Content

### 3.1. [Section Title]

[Section content]

### 3.2. [Section Title]

[Section content]

---

## 4. Implementation Details

[Technical details, code examples, or procedures]

---

## 5. References and Related Documentation

- [Link 1: Description]
- [Link 2: Description]

---

## Appendix A: Change Log

| Date       | Version | Author     | Changes          |
| :--------- | :------ | :--------- | :--------------- |
| YYYY-MM-DD | 1.0.0   | @username  | Initial creation |
