<!-- AI-INSTRUCTION: START -->
<!--
  This document defines the INVENTORY SCHEMA.
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
      <h1 style="margin: 0; border-bottom: none;">Inventory Schema</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Products, Stock, and Supply Chain</p>
    </td>
  </tr>
</table>

<div align="center">

  <!-- METADATA BADGES -->
  <img src="https://img.shields.io/badge/Status-Ready-success?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Audience-Backend-blue?style=flat-square" alt="Audience" />
  <img src="https://img.shields.io/badge/Last%20Updated-2025--11--27-lightgrey?style=flat-square" alt="Date" />

</div>

---

## 🤖 Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                                                        |
| :------------- | :------------------------------------------------------------------------------------------------- |
| **Context**    | Manages the catalog, stock levels, and movements of goods.                                         |
| **Constraint** | **Offline-First:** All entities must support version-based syncing.                                |
| **Pattern**    | **Optimistic UI:** Stock changes are applied locally first, then synced as `StockMovement` deltas. |
| **Rule**       | **Variants:** Use `JSONB` for flexible attributes (e.g., Size, Color) instead of EAV tables.       |
| **Related**    | `apps/backend/src/modules/inventory/`                                                              |

---

## 1. Executive Summary

The **Inventory Schema** manages the core catalog and stock tracking. It is designed to handle both **Simple Products** and **Variable Products** (e.g., Apparel) with a flexible attribute system. It supports **Multi-Location** inventory tracking, allowing a merchant to manage stock across multiple stores or warehouses.

Key capabilities:

1.  **Flexible Variants:** JSONB-based attributes allow for unlimited variation types without schema migration.
2.  **Multi-Location:** Stock is tracked per `Location` (Store/Warehouse).
3.  **Audit Trail:** Immutable `StockMovement` log for every inventory change (Sale, Restock, Loss).
4.  **Offline Sync:** Designed to handle conflict resolution via delta-based updates.

---

## 2. Entity-Relationship Diagram

```plantuml
@startuml

!theme plain
hide circle
skinparam linetype ortho

entity "Category" as Category {
  *id : UUID
  *businessId : UUID
  parentId : UUID
  --
  *name : VARCHAR
  description : TEXT
  icon : VARCHAR
  sortOrder : INTEGER
  *isActive : BOOLEAN
  --
  *createdAt : TIMESTAMP
  *updatedAt : TIMESTAMP
  deletedAt : TIMESTAMP
  version : BIGINT
}

entity "Product" as Product {
  *id : UUID
  *businessId : UUID
  categoryId : UUID
  taxProfileId : UUID
  --
  *name : VARCHAR
  description : TEXT
  *sku : VARCHAR
  barcode : VARCHAR
  images : JSONB
  --
  *price : DECIMAL(19,4)
  costPrice : DECIMAL(19,4)
  --
  *productType : ENUM (SIMPLE, VARIABLE, COMPOSITE, RAW_MATERIAL)
  *trackStock : BOOLEAN
  *status : ENUM (ACTIVE, DRAFT, ARCHIVED)
  --
  baseUnit : VARCHAR
  lowStockThreshold : INTEGER
  metadata : JSONB
  --
  *createdAt : TIMESTAMP
  *updatedAt : TIMESTAMP
  deletedAt : TIMESTAMP
  version : BIGINT
}

entity "ProductVariant" as Variant {
  *id : UUID
  *productId : UUID
  --
  *name : VARCHAR
  sku : VARCHAR
  barcode : VARCHAR
  images : JSONB
  --
  price : DECIMAL(19,4)
  costPrice : DECIMAL(19,4)
  --
  *attributes : JSONB
  *status : ENUM (ACTIVE, ARCHIVED)
  sortOrder : INTEGER
  --
  *createdAt : TIMESTAMP
  *updatedAt : TIMESTAMP
  deletedAt : TIMESTAMP
  version : BIGINT
}

entity "UnitConversion" as UnitConv {
  *id : UUID
  *productId : UUID
  --
  *fromUnit : VARCHAR
  *toUnit : VARCHAR
  *conversionFactor : DECIMAL(10,4)
  --
  isDefault : BOOLEAN
  *createdAt : TIMESTAMP
}

entity "ProductRecipe" as Recipe {
  *id : UUID
  *finishedProductId : UUID
  *finishedVariantId : UUID
  --
  *name : VARCHAR
  description : TEXT
  *yieldsQuantity : DECIMAL(10,2)
  yieldsUnit : VARCHAR
  --
  isActive : BOOLEAN
  *createdAt : TIMESTAMP
  *updatedAt : TIMESTAMP
}

entity "RecipeIngredient" as Ingredient {
  *id : UUID
  *recipeId : UUID
  *ingredientProductId : UUID
  *ingredientVariantId : UUID
  --
  *quantityNeeded : DECIMAL(10,4)
  *unit : VARCHAR
  --
  notes : TEXT
  sortOrder : INTEGER
}

entity "InventoryLevel" as Stock {
  *id : UUID
  *businessId : UUID
  *branchId : UUID
  *productId : UUID
  variantId : UUID
  --
  *quantity : DECIMAL(10,4)
  reserved : DECIMAL(10,4)
  available : DECIMAL(10,4)
  reorderPoint : DECIMAL(10,4)
  reorderQuantity : DECIMAL(10,4)
  --
  lastCountedAt : TIMESTAMP
  version : BIGINT
  *createdAt : TIMESTAMP
  *updatedAt : TIMESTAMP
}

entity "StockBatch" as Batch {
  *id : UUID
  *inventoryLevelId : UUID
  --
  *batchNumber : VARCHAR
  *quantity : DECIMAL(10,4)
  expiryDate : DATE
  receivedDate : DATE
  supplierLotNumber : VARCHAR
  --
  metadata : JSONB
  *createdAt : TIMESTAMP
}

entity "StockMovement" as Movement {
  *id : UUID
  *businessId : UUID
  *inventoryLevelId : UUID
  batchId : UUID
  --
  *type : ENUM
  *quantityChange : DECIMAL(10,4)
  quantityAfter : DECIMAL(10,4)
  unit : VARCHAR
  --
  reason : VARCHAR
  referenceType : VARCHAR
  referenceId : UUID
  metadata : JSONB
  --
  *createdAt : TIMESTAMP
  createdBy : UUID
}

Category ||..o{ Category : "children"
Category ||..o{ Product : "products"
Product ||..o{ Variant : "variants"
Product ||..o{ UnitConv : "conversions"
Product ||..o{ Recipe : "as finished"
Product ||..o{ Ingredient : "as raw material"
Recipe ||..o{ Ingredient : "requires"
Product ||..o{ Stock : "stock"
Variant ||..o{ Stock : "stock"
Stock ||..o{ Batch : "batches"
Stock ||..o{ Movement : "history"
Batch ||..o{ Movement : "traces"

@enduml
```

---

## 3. Detailed Entity Definitions

### 3.1. Category

Organizes products into a hierarchical tree structure for better catalog organization and navigation.

| Attribute     | Type         | Description         | Rules & Constraints                                                  |
| :------------ | :----------- | :------------------ | :------------------------------------------------------------------- |
| `id`          | UUID         | Unique identifier.  | Primary Key.                                                         |
| `businessId`  | UUID         | Tenant owner.       | Foreign Key to `business.Business`. All queries MUST filter by this. |
| `parentId`    | UUID         | Parent category.    | Foreign Key to `Category`. NULL for root categories.                 |
| `name`        | VARCHAR(100) | Category name.      | e.g., "Beverages", "Electronics". Displayed in POS navigation.       |
| `description` | TEXT         | Optional details.   | Markdown supported for rich formatting.                              |
| `icon`        | VARCHAR(100) | Icon identifier.    | e.g., `food`, `shirt`, `tool`. Used in UI for visual navigation.     |
| `sortOrder`   | INTEGER      | Display order.      | Lower numbers appear first. Default: 0.                              |
| `isActive`    | BOOLEAN      | Visibility flag.    | If `false`, hidden from POS but still accessible in admin.           |
| `version`     | BIGINT       | Optimistic lock.    | Incremented on every update. Used for offline conflict resolution.   |
| `createdAt`   | TIMESTAMP    | Creation time.      | Auto-generated. UTC timezone.                                        |
| `updatedAt`   | TIMESTAMP    | Last modification.  | Auto-updated on change.                                              |
| `deletedAt`   | TIMESTAMP    | Soft delete marker. | If set, category is archived.                                        |

**Business Rules:**

- **Self-Referential:** `parentId` allows infinite nesting (e.g., Food > Beverages > Soft Drinks).
- **Constraint:** Cannot delete a category with active products. Must reassign or archive products first.
- **Sync:** Full sync to device on login. Incremental updates via `version` field.

### 3.2. Product

The core catalog item representing goods or services sold by the business.

| Attribute           | Type          | Description           | Rules & Constraints                                                          |
| :------------------ | :------------ | :-------------------- | :--------------------------------------------------------------------------- |
| `id`                | UUID          | Unique identifier.    | Primary Key.                                                                 |
| `businessId`        | UUID          | Tenant owner.         | Foreign Key to `business.Business`.                                          |
| `categoryId`        | UUID          | Product category.     | Foreign Key to `Category`.                                                   |
| `taxProfileId`      | UUID          | Tax configuration.    | Foreign Key to `billing.TaxProfile`.                                         |
| `name`              | VARCHAR(200)  | Product name.         | e.g., "Coca-Cola 355ml". Displayed on receipts.                              |
| `description`       | TEXT          | Product details.      | Rich text supported. Used for staff training notes.                          |
| `sku`               | VARCHAR(50)   | Stock Keeping Unit.   | Internal code. Unique per business.                                          |
| `barcode`           | VARCHAR(50)   | Barcode/EAN.          | Can be NULL for non-retail items.                                            |
| `images`            | JSONB         | Product images.       | Array of URLs: `[{"url": "...", "isPrimary": true}]`.                        |
| `price`             | DECIMAL(19,4) | Base selling price.   | **MUST use DECIMAL** for financial precision.                                |
| `costPrice`         | DECIMAL(19,4) | Acquisition cost.     | Used for profit margin calculations. **Sensitive data**.                     |
| `productType`       | ENUM          | Product type.         | `SIMPLE`, `VARIABLE`, `COMPOSITE` (has recipe), `RAW_MATERIAL` (ingredient). |
| `trackStock`        | BOOLEAN       | Inventory tracking.   | If `false`, assumes infinite stock (useful for services).                    |
| `baseUnit`          | VARCHAR(20)   | Base unit of measure. | e.g., `kg`, `L`, `pcs`, `box`. Used for conversions.                         |
| `lowStockThreshold` | INTEGER       | Alert level.          | When stock falls below this, trigger `LOW_STOCK` notification.               |
| `status`            | ENUM          | Product state.        | `ACTIVE` (visible), `DRAFT` (hidden), `ARCHIVED` (discontinued).             |
| `metadata`          | JSONB         | Custom fields.        | Flexible storage for business-specific attributes.                           |
| `version`           | BIGINT        | Optimistic lock.      | Incremented on every update.                                                 |
| `createdAt`         | TIMESTAMP     | Creation time.        | UTC timezone.                                                                |
| `updatedAt`         | TIMESTAMP     | Last modification.    | Auto-updated.                                                                |
| `deletedAt`         | TIMESTAMP     | Soft delete marker.   | Products are never hard-deleted.                                             |

**Business Rules:**

- **Product Type Logic:**
  - `SIMPLE`: Regular product. Stock tracked at product level. No variants.
  - `VARIABLE`: Product with variants (e.g., sizes, colors). Stock tracked per variant.
  - `COMPOSITE`: Finished product made from other products (has recipe). Stock auto-calculated from ingredients.
  - `RAW_MATERIAL`: Ingredient/component not sold directly. Used in recipes. Examples: tomatoes, flour, screws.
- **Pricing:**
  - `RAW_MATERIAL` products have `costPrice` but may have `price = 0` (not sold directly).
  - `COMPOSITE` products cost is auto-calculated from recipe ingredients.
- **Base Unit:** Required for `RAW_MATERIAL` and `COMPOSITE` products for recipe calculations.
- **Security:** `costPrice` visibility restricted by `COST_VIEW` permission.
- **Uniqueness:** `(businessId, sku)` must be unique.

### 3.3. ProductVariant

Specific variations of a variable product (e.g., size, color, material combinations).

| Attribute    | Type          | Description           | Rules & Constraints                                                                          |
| :----------- | :------------ | :-------------------- | :------------------------------------------------------------------------------------------- |
| `id`         | UUID          | Unique identifier.    | Primary Key.                                                                                 |
| `productId`  | UUID          | Parent product.       | Foreign Key to `Product`.                                                                    |
| `name`       | VARCHAR(200)  | Variant display name. | e.g., "Medium / Red / Cotton". Auto-generated from attributes.                               |
| `sku`        | VARCHAR(50)   | Unique SKU.           | Optional override. If NULL, inherits product SKU with suffix.                                |
| `barcode`    | VARCHAR(50)   | Unique barcode.       | Optional. Useful for pre-printed labels.                                                     |
| `images`     | JSONB         | Variant images.       | Overrides product images.                                                                    |
| `price`      | DECIMAL(19,4) | Price override.       | If NULL, uses parent Product price.                                                          |
| `costPrice`  | DECIMAL(19,4) | Cost override.        | If NULL, uses parent Product costPrice.                                                      |
| `attributes` | JSONB         | Variant attributes.   | **Flexible Schema**: `{"Size": "M", "Color": "Red"}`. No predefined attribute tables needed. |
| `status`     | ENUM          | Variant state.        | `ACTIVE` or `ARCHIVED`.                                                                      |
| `sortOrder`  | INTEGER       | Display order.        | For UI sorting.                                                                              |
| `version`    | BIGINT        | Optimistic lock.      | Conflict resolution.                                                                         |
| `createdAt`  | TIMESTAMP     | Creation time.        | UTC.                                                                                         |
| `updatedAt`  | TIMESTAMP     | Last modification.    | Auto-updated.                                                                                |
| `deletedAt`  | TIMESTAMP     | Soft delete.          | Archived variants remain for historical sales data.                                          |

**Business Rules:**

- **Flexible Attributes:** The `attributes` JSONB field allows unlimited variation types without schema migration.
- **Example Use Case:** Fashion store can add "Size", "Color", "Material" without altering the database schema.
- **Pricing Logic:** If variant `price` is NULL, display logic uses parent product price.
- **Stock Tracking:** Stock is tracked at the variant level, not the parent product.

---

### 3.4. UnitConversion

Defines how to convert between different units of measure for the same product.

| Attribute          | Type          | Description         | Rules & Constraints                   |
| :----------------- | :------------ | :------------------ | :------------------------------------ |
| `id`               | UUID          | Unique identifier.  | Primary Key.                          |
| `productId`        | UUID          | Product reference.  | Foreign Key to `Product`.             |
| `fromUnit`         | VARCHAR(20)   | Source unit.        | e.g., `box`, `case`, `pallet`.        |
| `toUnit`           | VARCHAR(20)   | Target unit.        | e.g., `pcs` (pieces), `kg`, `L`.      |
| `conversionFactor` | DECIMAL(10,4) | Multiplier.         | e.g., `1 box = 24 pcs` → factor = 24. |
| `isDefault`        | BOOLEAN       | Primary conversion. | Used in POS when scanning.            |
| `createdAt`        | TIMESTAMP     | Creation time.      | UTC.                                  |

**Business Rules:**

- **Use Case:** A store receives "Coca-Cola in boxes of 24", but sells individual bottles.
- **Example:** `fromUnit = 'box'`, `toUnit = 'pcs'`, `conversionFactor = 24`.
- **Bidirectional:** If `box → pcs = 24`, then `pcs → box = 1/24 = 0.0417`.
- **Multiple Conversions:** A product can have multiple conversions (e.g., box→pcs, case→box, pallet→case).

**Implementation Example:**

```typescript
// Receiving inventory: "5 boxes" of Coca-Cola
const boxToPcs = await getConversion(productId, "box", "pcs"); // factor = 24
const totalPieces = 5 * boxToPcs.conversionFactor; // 120 pieces
// Update InventoryLevel.quantity += 120
```

---

### 3.5. ProductRecipe (Bill of Materials)

Defines how a finished product is assembled from raw materials or components.

| Attribute           | Type          | Description            | Rules & Constraints                                        |
| :------------------ | :------------ | :--------------------- | :--------------------------------------------------------- |
| `id`                | UUID          | Unique identifier.     | Primary Key.                                               |
| `finishedProductId` | UUID          | Finished product.      | Foreign Key to `Product` (type = `COMPOSITE`).             |
| `finishedVariantId` | UUID          | Variant if applicable. | Foreign Key to `ProductVariant`. NULL for simple products. |
| `name`              | VARCHAR(200)  | Recipe name.           | e.g., "Taco de Asada - Standard", "Burger Recipe v2".      |
| `description`       | TEXT          | Preparation notes.     | Instructions for kitchen staff.                            |
| `yieldsQuantity`    | DECIMAL(10,2) | Output amount.         | How many units this recipe produces.                       |
| `yieldsUnit`        | VARCHAR(20)   | Output unit.           | e.g., `pcs`, `servings`, `kg`.                             |
| `isActive`          | BOOLEAN       | Active recipe.         | Allows versioning (multiple recipes per product).          |
| `createdAt`         | TIMESTAMP     | Creation time.         | UTC.                                                       |
| `updatedAt`         | TIMESTAMP     | Last modification.     | Updated when ingredients change.                           |

**Business Rules:**

- **One Active Recipe:** Only one recipe per `(finishedProductId, finishedVariantId)` can be `isActive = true`.
- **Versioning:** Old recipes are kept (`isActive = false`) for historical cost analysis.
- **Use Cases:**
  - **Restaurant:** "Taco de Asada" recipe requires: 150g meat, 2 tortillas, 30g onion, 20g cilantro.
  - **Retail Pack:** "Gift Basket" recipe requires: 1 wine bottle, 2 chocolate bars, 1 basket.

---

### 3.6. RecipeIngredient

Defines the individual components (raw materials) needed for a recipe.

| Attribute             | Type          | Description           | Rules & Constraints                                              |
| :-------------------- | :------------ | :-------------------- | :--------------------------------------------------------------- |
| `id`                  | UUID          | Unique identifier.    | Primary Key.                                                     |
| `recipeId`            | UUID          | Parent recipe.        | Foreign Key to `ProductRecipe`.                                  |
| `ingredientProductId` | UUID          | Raw material.         | Foreign Key to `Product` (type = `RAW_MATERIAL` or `SIMPLE`).    |
| `ingredientVariantId` | UUID          | Variant if needed.    | Foreign Key to `ProductVariant`. NULL if simple product.         |
| `quantityNeeded`      | DECIMAL(10,4) | Amount required.      | High precision for fractional quantities (e.g., 0.0025 kg).      |
| `unit`                | VARCHAR(20)   | Unit of measure.      | Must match ingredient product's `baseUnit` or have a conversion. |
| `notes`               | TEXT          | Special instructions. | e.g., "Chopped", "Diced", "Pre-cooked".                          |
| `sortOrder`           | INTEGER       | Display order.        | For recipe display in kitchen.                                   |

**Business Rules:**

- **Stock Deduction:** When a `COMPOSITE` product is sold, the system automatically creates `StockMovement` entries for each ingredient.
- **Example:** Selling 1 "Taco de Asada" deducts:
  - 150g from "Carne Asada" inventory
  - 2 pieces from "Tortillas" inventory
  - 30g from "Onion" inventory
  - 20g from "Cilantro" inventory

**Stock Availability Check:**

```typescript
// Before selling 5 tacos, check if ingredients are available
const canMake = await checkRecipeAvailability(recipeId, quantity: 5);
// Returns: { available: true, maxQuantity: 8, limiting: "Tortillas" }
```

---

### 3.7. InventoryLevel

The current stock quantity state for a product/variant at a specific location.

| Attribute         | Type          | Description        | Rules & Constraints                                                         |
| :---------------- | :------------ | :----------------- | :-------------------------------------------------------------------------- |
| `id`              | UUID          | Unique identifier. | Primary Key.                                                                |
| `businessId`      | UUID          | Tenant owner.      | Foreign Key to `business.Business`.                                         |
| `branchId`        | UUID          | Physical location. | Foreign Key to `business.Branch`.                                           |
| `productId`       | UUID          | Product reference. | Foreign Key to `Product`.                                                   |
| `variantId`       | UUID          | Variant reference. | Foreign Key to `ProductVariant`. NULL for simple products.                  |
| `quantity`        | DECIMAL(10,4) | Current stock.     | High precision for fractional units (kg, L). Can be negative (backorder).   |
| `reserved`        | DECIMAL(10,4) | Reserved quantity. | Items in pending orders not yet paid.                                       |
| `available`       | DECIMAL(10,4) | Available stock.   | **Computed**: `quantity - reserved`. Used for POS availability checks.      |
| `reorderPoint`    | DECIMAL(10,4) | Minimum threshold. | When `quantity <= reorderPoint`, trigger `LOW_STOCK` alert.                 |
| `reorderQuantity` | DECIMAL(10,4) | Suggested reorder. | How many units to reorder.                                                  |
| `version`         | BIGINT        | Optimistic lock.   | **Critical**: Prevents race conditions when two devices sell the last item. |
| `lastCountedAt`   | TIMESTAMP     | Last stocktake.    | When physical count was last verified.                                      |
| `createdAt`       | TIMESTAMP     | Creation time.     | UTC.                                                                        |
| `updatedAt`       | TIMESTAMP     | Last stock change. | Updated on every `StockMovement`.                                           |

**Business Rules:**

- **Uniqueness:** `(branchId, productId, variantId)` must be unique.
- **Simple Products:** `variantId` is NULL.
- **Variable Products:** One row per variant.
- **Overselling:** If `quantity` goes negative, system can either block the sale or allow backorders (configurable).
- **Reserved Stock:** Used for online orders or layaway systems to prevent double-selling.
- **Fractional Quantities:** Using DECIMAL allows tracking weight-based products (e.g., 2.5 kg of cheese).

---

### 3.8. StockBatch (Lot Tracking)

Tracks individual batches/lots of inventory, especially for perishable goods with expiry dates.

| Attribute           | Type          | Description        | Rules & Constraints                                     |
| :------------------ | :------------ | :----------------- | :------------------------------------------------------ |
| `id`                | UUID          | Unique identifier. | Primary Key.                                            |
| `inventoryLevelId`  | UUID          | Stock record.      | Foreign Key to `InventoryLevel`.                        |
| `batchNumber`       | VARCHAR(100)  | Internal batch ID. | Auto-generated or manual.                               |
| `quantity`          | DECIMAL(10,4) | Quantity in batch. | Decreases as items are sold (FIFO/FEFO).                |
| `expiryDate`        | DATE          | Expiration date.   | For perishables. Triggers alerts before expiry.         |
| `receivedDate`      | DATE          | Receipt date.      | When batch entered inventory.                           |
| `supplierLotNumber` | VARCHAR(100)  | Supplier's lot ID. | For traceability/recalls.                               |
| `metadata`          | JSONB         | Additional info.   | e.g., `{"temperature": "2-8°C", "inspectedBy": "..."}`. |
| `createdAt`         | TIMESTAMP     | Creation time.     | UTC.                                                    |

**Business Rules:**

- **FEFO (First Expired, First Out):** System prioritizes selling batches closest to expiry.
- **Expiry Alerts:**
  - **7 days before:** `WARNING` notification.
  - **3 days before:** `URGENT` notification.
  - **After expiry:** Batch auto-marked for `LOSS` movement.
- **Use Cases:**
  - **Restaurant:** Track meat batches with expiry dates.
  - **Pharmacy:** Legal requirement for drug lot tracking.
  - **Recall Management:** If supplier issues recall, query by `supplierLotNumber`.

**Example:**

```typescript
// Receive 50 kg of chicken (2 batches)
await createBatch({
  inventoryLevelId: chickenInventoryId,
  batchNumber: "BCH-2025-001",
  quantity: 30,
  expiryDate: "2025-12-15",
  supplierLotNumber: "SUPP-LOT-456",
});

await createBatch({
  inventoryLevelId: chickenInventoryId,
  batchNumber: "BCH-2025-002",
  quantity: 20,
  expiryDate: "2025-12-20",
  supplierLotNumber: "SUPP-LOT-789",
});

// When selling 25 kg, system uses FEFO:
// - Deduct 25 kg from BCH-2025-001 (expires first)
// - Link StockMovement to batchId
```

---

### 3.9. StockMovement

The immutable audit trail of all stock changes. This is the "Ledger" that explains every quantity change.

| Attribute          | Type          | Description           | Rules & Constraints                                                                                               |
| :----------------- | :------------ | :-------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `id`               | UUID          | Unique identifier.    | Primary Key.                                                                                                      |
| `businessId`       | UUID          | Tenant owner.         | Foreign Key to `business.Business`.                                                                               |
| `inventoryLevelId` | UUID          | Stock record.         | Foreign Key to `InventoryLevel`.                                                                                  |
| `batchId`          | UUID          | Batch reference.      | Foreign Key to `StockBatch`. NULL if not using batch tracking.                                                    |
| `type`             | ENUM          | Movement type.        | `SALE`, `RESTOCK`, `ADJUSTMENT`, `RETURN`, `LOSS`, `TRANSFER_IN`, `TRANSFER_OUT`, `RECIPE_CONSUMPTION`, `EXPIRY`. |
| `quantityChange`   | DECIMAL(10,4) | Delta amount.         | **Signed decimal**: Positive for increases, negative for decreases.                                               |
| `unit`             | VARCHAR(20)   | Unit of measure.      | e.g., `pcs`, `kg`, `L`. Records what unit was used in the transaction.                                            |
| `quantityAfter`    | INTEGER       | Snapshot of quantity. | The `InventoryLevel.quantity` after this movement. Used for audit verification.                                   |
| `reason`           | VARCHAR(255)  | Human explanation.    | e.g., "Damaged during shipping", "Customer return".                                                               |
| `referenceType`    | VARCHAR(50)   | Related entity.       | e.g., `Sale`, `PurchaseOrder`, `StockTransfer`.                                                                   |
| `referenceId`      | UUID          | Related entity ID.    | Foreign Key to the related transaction.                                                                           |
| `metadata`         | JSONB         | Additional context.   | e.g., `{"employeeId": "...", "device": "POS-1"}`.                                                                 |
| `createdAt`        | TIMESTAMP     | Movement time.        | **Immutable**. UTC.                                                                                               |
| `createdBy`        | UUID          | Responsible user.     | Foreign Key to `auth.User`.                                                                                       |

**Business Rules:**

- **Immutability:** StockMovements are **NEVER** updated or deleted. They are append-only.
- **Audit Trail:** Every change must have a reason and responsible party.
- **Types:**
  - `SALE`: Triggered by POS transaction. Negative delta.
  - `RESTOCK`: Supplier delivery. Positive delta. Links to `PurchaseOrder`.
  - `ADJUSTMENT`: Manual correction after physical count. Can be positive or negative.
  - `RETURN`: Customer returns product. Positive delta.
  - `LOSS`: Theft, damage, expiration. Negative delta.
  - `TRANSFER_IN/OUT`: Inter-branch transfers.
  - `RECIPE_CONSUMPTION`: Auto-created when selling composite products. Deducts raw materials.
  - `EXPIRY`: Auto-created when batch passes expiry date. Negative delta.
- **Verification:** Sum of all `quantityChange` for an `inventoryLevelId` MUST equal current `InventoryLevel.quantity`.

---

## 4. Security & Data Protection

### 4.1. Cost Price Visibility

- **Sensitive Field:** `Product.costPrice` and `ProductVariant.costPrice` are **HIGH SENSITIVITY**.
- **Access Control:** Only users with `COST_VIEW` permission can see these fields.
- **Implementation:** Use `@Exclude()` decorator in DTOs. Filter in queries based on user role.

### 4.2. Stock Manipulation Prevention

- **Risk:** Malicious employee inflates stock to hide theft.
- **Controls:**
  - All `ADJUSTMENT` movements require supervisor approval (future feature).
  - Stocktake reports show discrepancies prominently.
  - Audit logs track all manual adjustments with employee ID.

---

## 5. Performance & Indexing Strategy

To ensure high performance for catalog searches and stock lookups:

| Table            | Index Columns                                  | Type            | Purpose                                  |
| :--------------- | :--------------------------------------------- | :-------------- | :--------------------------------------- |
| `Category`       | `(businessId, parentId)`                       | B-Tree          | Fast hierarchy traversal.                |
| `Category`       | `(businessId, isActive)`                       | B-Tree          | Filter active categories in POS.         |
| `Product`        | `(businessId, categoryId)`                     | B-Tree          | List products by category.               |
| `Product`        | `(businessId, sku)`                            | Unique          | Enforce uniqueness and fast SKU lookups. |
| `Product`        | `(businessId, barcode)`                        | B-Tree          | Barcode scanning in POS.                 |
| `Product`        | `name`                                         | GIN (Full-Text) | Product search by name.                  |
| `ProductVariant` | `(productId, status)`                          | B-Tree          | List active variants.                    |
| `InventoryLevel` | `(businessId, branchId, productId, variantId)` | Unique          | Prevent duplicate stock records.         |
| `InventoryLevel` | `(branchId, quantity)`                         | B-Tree          | Low stock alerts.                        |
| `StockMovement`  | `(inventoryLevelId, createdAt DESC)`           | B-Tree          | Audit trail history queries.             |
| `StockMovement`  | `(businessId, createdAt DESC)`                 | B-Tree          | Recent activity dashboard.               |
| `StockMovement`  | `(referenceType, referenceId)`                 | B-Tree          | Trace movements from sales/purchases.    |

**Query Patterns:**

- **POS Product Search:** `WHERE businessId = ? AND name ILIKE ? AND status = 'ACTIVE'` (Uses full-text index).
- **Barcode Scan:** `WHERE businessId = ? AND barcode = ?` (Direct index hit).
- **Low Stock Report:** `WHERE branchId = ? AND quantity <= reorderPoint` (Index on quantity).
- **Movement History:** `WHERE inventoryLevelId = ? ORDER BY createdAt DESC LIMIT 50` (Index on createdAt).

---

## 6. Offline Sync Strategy

### 6.1. Catalog Sync (Read-Heavy)

- **Strategy:** "Pull" model with versioning.
- **Mechanism:** Device requests `GET /products?since={lastVersion}`.
- **Optimization:**
  - Soft deletes (`deletedAt`) ensure devices remove items locally.
  - Only changed records are transmitted (delta sync).
- **Initial Sync:** On first login, download full catalog for the branch.

### 6.2. Stock Sync (Write-Heavy)

- **Challenge:** Race conditions (Two devices selling the last item).
- **Strategy:** Delta-based writes with optimistic locking.
  - Device does **not** send "New Quantity = 5".
  - Device sends "Movement: SALE, Quantity = -1, Version = 42".
- **Server Logic:**
  1. Receive Movement request.
  2. Check `InventoryLevel.version` matches request version.
  3. If match: Apply delta, create `StockMovement`, increment version.
  4. If mismatch: Reject with `409 Conflict`. Client must refresh and retry.
  5. Broadcast new `InventoryLevel` to all connected devices via WebSocket.

### 6.3. Conflict Resolution

**Scenario:** Two cashiers sell the last item simultaneously while offline.

- **Device A:** `quantity = 1 -> 0` (version 10 -> 11)
- **Device B:** `quantity = 1 -> 0` (version 10 -> 11)
- **Server receives A first:**
  - Applies: `quantity = 0, version = 11`
- **Server receives B:**
  - Rejects: "Version mismatch. Expected 11, got 10."
- **Device B:** Receives rejection, shows "Item sold out. Stock refreshed."

---

## 7. Business Logic Examples

### 7.1. Low Stock Alert

**Trigger:** When `InventoryLevel.quantity <= reorderPoint`

**Action:**

1. Create `LOW_STOCK` notification for business owner.
2. Suggest reorder quantity based on sales velocity (future feature).

### 7.2. Negative Stock (Overselling)

**Configurable Behavior:**

- **Strict Mode:** Block sale if `InventoryLevel.available <= 0`.
- **Flexible Mode:** Allow negative stock (indicates backorder). Generate `OVERSOLD` alert.

### 7.3. Stock Transfer Between Branches

**Process:**

1. Create `StockMovement` with `type = TRANSFER_OUT` at source branch (negative delta).
2. Create `StockMovement` with `type = TRANSFER_IN` at destination branch (positive delta).
3. Link both movements via `metadata: {"transferId": "..."}` for audit trail.

---

## 8. Stock Analytics & Intelligence

### 8.1. Slow-Moving & Dead Stock Detection

**Problem:** Products that don't sell tie up capital and warehouse space.

**Query Logic:**

```sql
-- Products with no sales in last 90 days
SELECT
  p.name,
  il.quantity,
  p.costPrice * il.quantity AS tied_capital,
  MAX(sm.createdAt) AS last_sale_date,
  CURRENT_DATE - MAX(sm.createdAt) AS days_since_sale
FROM inventory.InventoryLevel il
JOIN inventory.Product p ON il.productId = p.id
LEFT JOIN inventory.StockMovement sm ON il.id = sm.inventoryLevelId AND sm.type = 'SALE'
WHERE il.businessId = ?
  AND il.quantity > 0
GROUP BY p.id, il.id
HAVING MAX(sm.createdAt) < CURRENT_DATE - INTERVAL '90 days'
   OR MAX(sm.createdAt) IS NULL
ORDER BY days_since_sale DESC;
```

**Actions:**

- **Alert:** Notify owner of dead stock.
- **Suggestion:** "Consider discount or liquidation sale."
- **Dashboard Widget:** Show total capital tied in slow movers.

### 8.2. Sales Velocity & Reorder Prediction

**Problem:** Manually setting reorder points is error-prone.

**Solution:** Auto-calculate based on sales velocity.

**Algorithm:**

```typescript
// Calculate average daily sales over last 30 days
const avgDailySales = await db.raw(`
  SELECT AVG(daily_sales) AS avg
  FROM (
    SELECT DATE(createdAt) AS date, SUM(ABS(quantityChange)) AS daily_sales
    FROM inventory.StockMovement
    WHERE inventoryLevelId = ? AND type = 'SALE'
      AND createdAt > CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(createdAt)
  ) AS daily
`);

// Reorder point = (Avg Daily Sales × Lead Time Days) + Safety Stock
const leadTimeDays = 7; // Time from order to delivery
const safetyStockDays = 3; // Buffer
const reorderPoint = avgDailySales * (leadTimeDays + safetyStockDays);

// Auto-update InventoryLevel
await updateInventoryLevel(inventoryLevelId, { reorderPoint });
```

### 8.3. Overselling & Negative Stock Report

**Problem:** Selling more than available causes fulfillment issues.

**Query:**

```sql
SELECT
  p.name,
  il.quantity,
  b.name AS branch,
  sm.createdAt AS oversold_at,
  sm.createdBy AS employee
FROM inventory.InventoryLevel il
JOIN inventory.Product p ON il.productId = p.id
JOIN business.Branch b ON il.branchId = b.id
JOIN inventory.StockMovement sm ON il.id = sm.inventoryLevelId
WHERE il.quantity < 0
  AND sm.type = 'SALE'
ORDER BY sm.createdAt DESC;
```

**Actions:**

- **Alert:** Real-time notification to manager.
- **Process:** Initiate emergency restock or inter-branch transfer.

### 8.4. Expiry Management Dashboard

**Problem:** Food waste due to expired products.

**Solution:** Proactive expiry tracking.

**Query:**

```sql
-- Products expiring in next 7 days
SELECT
  p.name,
  sb.batchNumber,
  sb.quantity,
  sb.expiryDate,
  (sb.expiryDate - CURRENT_DATE) AS days_until_expiry,
  p.price * sb.quantity AS potential_loss
FROM inventory.StockBatch sb
JOIN inventory.InventoryLevel il ON sb.inventoryLevelId = il.id
JOIN inventory.Product p ON il.productId = p.id
WHERE sb.expiryDate BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  AND sb.quantity > 0
ORDER BY sb.expiryDate ASC;
```

**Actions:**

- **Urgent Discount:** Auto-apply 30-50% discount in POS.
- **Donation:** Generate "Donate" list for food banks.
- **Loss Prevention:** Prioritize FEFO (First Expired, First Out).

### 8.5. Recipe Cost Calculation

**Problem:** Not knowing true cost of composite products.

**Solution:** Auto-calculate from current ingredient costs.

**Algorithm:**

```typescript
async function calculateRecipeCost(recipeId: string) {
  const recipe = await db.productRecipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: {
        include: {
          ingredientProduct: true,
          ingredientVariant: true,
        },
      },
    },
  });

  let totalCost = 0;

  for (const ingredient of recipe.ingredients) {
    const costPerUnit =
      ingredient.ingredientVariant?.costPrice ??
      ingredient.ingredientProduct.costPrice;

    totalCost += costPerUnit * ingredient.quantityNeeded;
  }

  // Cost per unit of finished product
  const costPerUnit = totalCost / recipe.yieldsQuantity;

  // Update product cost
  await db.product.update({
    where: { id: recipe.finishedProductId },
    data: { costPrice: costPerUnit },
  });

  return { totalCost, costPerUnit };
}
```

**Use Case:**

- **Restaurant:** "Taco de Asada" cost:
  - Meat (150g @ $12/kg) = $1.80
  - Tortillas (2 @ $0.50 each) = $1.00
  - Onion (30g @ $3/kg) = $0.09
  - Cilantro (20g @ $5/kg) = $0.10
  - **Total Cost:** $2.99
  - **Selling Price:** $8.00
  - **Profit Margin:** 62.6%

### 8.6. Stock Turnover Ratio

**Formula:** `Turnover = COGS / Average Inventory Value`

**High Turnover (>5):** Products sell quickly. Good cash flow.
**Low Turnover (<2):** Capital tied in inventory. Risk of obsolescence.

**Query:**

```sql
WITH cogs AS (
  SELECT
    p.id,
    SUM(ABS(sm.quantityChange) * p.costPrice) AS cost_of_goods_sold
  FROM inventory.StockMovement sm
  JOIN inventory.InventoryLevel il ON sm.inventoryLevelId = il.id
  JOIN inventory.Product p ON il.productId = p.id
  WHERE sm.type = 'SALE'
    AND sm.createdAt > CURRENT_DATE - INTERVAL '365 days'
  GROUP BY p.id
),
avg_inventory AS (
  SELECT
    p.id,
    AVG(il.quantity * p.costPrice) AS avg_value
  FROM inventory.InventoryLevel il
  JOIN inventory.Product p ON il.productId = p.id
  GROUP BY p.id
)
SELECT
  p.name,
  cogs.cost_of_goods_sold,
  avg_inventory.avg_value,
  (cogs.cost_of_goods_sold / NULLIF(avg_inventory.avg_value, 0)) AS turnover_ratio
FROM inventory.Product p
JOIN cogs ON p.id = cogs.id
JOIN avg_inventory ON p.id = avg_inventory.id
ORDER BY turnover_ratio DESC;
```
