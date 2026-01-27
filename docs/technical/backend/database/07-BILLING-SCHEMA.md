---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "database-schema"
module: "billing"
status: "approved"
version: "1.0.0"
last_updated: "2025-11-27"
author: "@Architect"

# Keywords for semantic search
keywords:
  - "database"
  - "schema"
  - "billing"
  - "invoices"
  - "receipts"
  - "cfdi"
  - "tax"
  - "accounting"

# Related documentation
related_docs:
  api_design: ""
  feature_design: ""
  ux_flow: ""
  sync_strategy: ""

# Database metadata
database:
  engine: "PostgreSQL"
  min_version: "16.0"
  prisma_version: "5.0+"

# Schema statistics
schema_stats:
  total_tables: 7
  total_indexes: 12
  total_constraints: 14
  estimated_rows: "100K-10M"
---

<!-- AI-INSTRUCTION: START -->
<!--
  This document defines the BILLING SCHEMA.
  1. Preserve the Header Table and Metadata block.
  2. Fill in the "Agent Directives" to guide future AI interactions.
  3. Keep the structure strict for RAG (Retrieval Augmented Generation) efficiency.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">Billing Schema (Fiscal)</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Invoicing, Taxes, and Compliance (SAT/DIAN)</p>
    </td>
  </tr>
</table>

<div align="center">

  <!-- METADATA BADGES -->
  <img src="https://img.shields.io/badge/Status-Draft-lightgrey?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Audience-Backend-blue?style=flat-square" alt="Audience" />
  <img src="https://img.shields.io/badge/Last%20Updated-2025--11--27-lightgrey?style=flat-square" alt="Date" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                                                     |
| :------------- | :---------------------------------------------------------------------------------------------- |
| **Context**    | Handles legal invoicing and tax reporting for different countries (MX, CO, AR, CL).             |
| **Constraint** | **Immutability:** Once an invoice is `STAMPED`, it cannot be modified. Only cancelled.          |
| **Pattern**    | **Adapter:** Uses the same Strategy pattern as Payments to handle different fiscal authorities. |
| **Rule**       | **PDF/XML:** The database stores the _URL_ to the files (S3), not the files themselves.         |
| **Related**    | `apps/backend/src/modules/billing/`                                                             |

---

## 1. Executive Summary

The **Billing Schema** ensures legal compliance. It generates valid fiscal documents (CFDI in Mexico, Factura Electrónica in Colombia) based on sales data.

Key capabilities:

1.  **Multi-Country:** Supports SAT (Mexico), DIAN (Colombia), AFIP (Argentina).
2.  **Async Stamping:** Invoicing is an async process that can take seconds or minutes.
3.  **Tax Profiles:** Configurable tax rates per product/branch.

---

## 2. Entity-Relationship Diagram

```plantuml
@startuml
!theme plain
hide circle
skinparam linetype ortho

package "billing" #FFEBEE {
  entity "Invoice" as invoice {
    *id : UUID <<PK>>
    --
    *saleId : UUID <<FK>>
    *businessId : UUID <<FK>>
    fiscalId : VARCHAR(255)
    status : ENUM (DRAFT, PENDING, STAMPED, CANCELLED)
    provider : ENUM (SAT, DIAN, AFIP)
    xmlUrl : VARCHAR(255)
    pdfUrl : VARCHAR(255)
    fiscalData : JSONB
    createdAt : TIMESTAMP
  }

  entity "TaxProfile" as tax {
    *id : UUID <<PK>>
    --
    *businessId : UUID <<FK>>
    name : VARCHAR(50)
    rate : DECIMAL(5,2)
    code : VARCHAR(20)
    type : ENUM (VAT, RETENTION)
  }

  entity "FiscalData" as fiscal {
    *id : UUID <<PK>>
    --
    *businessId : UUID <<FK>>
    taxId : VARCHAR(50)
    legalName : VARCHAR(255)
    address : JSONB
    regime : VARCHAR(50)
  }
}

invoice ||..o{ fiscal : "uses"
tax ||..o{ invoice : "applies to"
@enduml
```

---

## 3. Detailed Entity Definitions

### 3.1. Invoice

The legal document representing a sale for tax purposes.

| Attribute    | Type         | Description                     | Rules & Constraints                                 |
| :----------- | :----------- | :------------------------------ | :-------------------------------------------------- |
| `id`         | UUID         | Unique identifier.              | Primary Key.                                        |
| `saleId`     | UUID         | The sale being invoiced.        | Foreign Key to `sales.Sale`.                        |
| `businessId` | UUID         | The issuer.                     | Foreign Key to `business.Business`.                 |
| `fiscalId`   | VARCHAR(255) | The official government ID.     | UUID (Mexico), CUFE (Colombia).                     |
| `status`     | ENUM         | Lifecycle state.                | `DRAFT`, `PENDING`, `STAMPED`, `CANCELLED`.         |
| `provider`   | ENUM         | The PAC/Authority used.         | `SAT`, `DIAN`, `AFIP`.                              |
| `xmlUrl`     | VARCHAR(255) | Link to the signed XML.         | Stored in S3.                                       |
| `pdfUrl`     | VARCHAR(255) | Link to the PDF representation. | Stored in S3.                                       |
| `fiscalData` | JSONB        | Snapshot of receiver's data.    | Stores the customer's tax info at time of stamping. |
| `createdAt`  | TIMESTAMP    | Creation date.                  |                                                     |

### 3.2. TaxProfile

Configuration for taxes applicable to products or services.

| Attribute    | Type         | Description          | Rules & Constraints                        |
| :----------- | :----------- | :------------------- | :----------------------------------------- |
| `id`         | UUID         | Unique identifier.   | Primary Key.                               |
| `businessId` | UUID         | The owner.           | Foreign Key to `business.Business`.        |
| `name`       | VARCHAR(50)  | Internal name.       | e.g., "IVA 16%", "Exento".                 |
| `rate`       | DECIMAL(5,2) | The percentage.      | e.g., `16.00`.                             |
| `code`       | VARCHAR(20)  | Government tax code. | e.g., `002` for IVA in Mexico.             |
| `type`       | ENUM         | Tax category.        | `VAT` (Traslado), `RETENTION` (Retención). |

### 3.3. FiscalData

Stores the tax information of the business (Issuer) or Customer (Receiver).

| Attribute    | Type         | Description               | Rules & Constraints                    |
| :----------- | :----------- | :------------------------ | :------------------------------------- |
| `id`         | UUID         | Unique identifier.        | Primary Key.                           |
| `businessId` | UUID         | The owner.                | Foreign Key to `business.Business`.    |
| `taxId`      | VARCHAR(50)  | RFC / NIT / CUIT.         | Must match country format regex.       |
| `legalName`  | VARCHAR(255) | Official registered name. | Must match government records exactly. |
| `address`    | JSONB        | Fiscal address.           | `{ "zip": "06600", "street": "..." }`. |
| `regime`     | VARCHAR(50)  | Tax regime code.          | e.g., "601" (General de Ley).          |

---

## 6. Example Data & Usage Scenarios

### 6.1. Invoice (Factura)

```json
{
  "id": "inv_2023_001",
  "businessId": "bus_123",
  "saleId": "sale_1024",
  "customerId": "cust_555",
  "fiscalId": "A123456789",
  "series": "F",
  "number": 1001,
  "status": "ISSUED",
  "total": 116.0,
  "xmlUrl": "https://s3.aws.com/invoices/F-1001.xml",
  "pdfUrl": "https://s3.aws.com/invoices/F-1001.pdf",
  "issuedAt": "2023-10-27T14:10:00Z"
}
```

### 6.2. TaxProfile (Fiscal Config)

```json
{
  "id": "tax_prof_1",
  "businessId": "bus_123",
  "taxId": "XAXX010101000",
  "legalName": "Tacos El Paisa SA de CV",
  "regime": "601 - General de Ley Personas Morales",
  "zipCode": "06600",
  "certificateNumber": "30001000000400002434",
  "isActive": true
}
```
