---
# YAML Frontmatter - Metadata for Copilot Auto-Discovery
skill_name: "diagram-creation"
description: "Generate PlantUML diagrams for database schemas, API flows, and architecture. Use when creating ER diagrams, sequence diagrams, or when the user asks for visual documentation."
version: "1.0.0"
last_updated: "2026-01-27"
author: "@Scribe"

# Skill Execution Context
scope: "documentation"
auto_invoke:
  when:
    - "User requests a diagram (ER, sequence, architecture)"
    - "Database schema documentation needs visual representation"
    - "API flow documentation requires sequence diagram"
    - "Architecture documentation needs component diagram"
  conditions:
    - file_patterns:
        ["docs/**/*SCHEMA*.md", "docs/**/*API*.md", "docs/**/*ARCHITECTURE*.md"]
    - keywords:
        [
          "diagram",
          "visual",
          "erd",
          "sequence",
          "plantUML",
          "architecture diagram",
        ]

# Related Skills & Agents
chains_with: ["documentation", "schema-doc-sync", "api-doc-generation"]
invoked_by: ["@Scribe", "@DataArchitect", "@Architect"]
agents: ["@Scribe", "@DataArchitect", "@Architect"]

# Key Topics & Patterns
keywords:
  - "plantUML"
  - "ER diagram"
  - "sequence diagram"
  - "architecture diagram"
  - "database visualization"
  - "API flow visualization"
  - "component diagram"
---

# Skill: diagram-creation

**Purpose:** Generate PlantUML diagrams for database schemas, API flows, and system architecture.

## When to Invoke

| Trigger                        | Use Case                               |
| :----------------------------- | :------------------------------------- |
| Database schema documentation  | Generate ER diagram                    |
| API endpoint documentation     | Generate sequence diagram for flow     |
| Architecture documentation     | Generate component/deployment diagrams |
| User requests "create diagram" | Interactive diagram generation         |
| System integration docs        | Generate interaction diagrams          |

## PlantUML Standards (MANDATORY)

**Ref:** [STANDARDS.md](../../../docs/process/standards/STANDARDS.md)

### Universal Rules

1. **Theme:** ALWAYS use `!theme plain`
2. **Format:** All diagrams MUST be in fenced code blocks with `plantuml` language tag
3. **Placement:** Diagrams go in their own section AFTER text description
4. **Legend:** Include legend for complex diagrams

`````markdown
## Database Schema

<!-- Text description -->

The `users` table stores user authentication data...

````plantuml
!theme plain
@startuml
entity users {
  * id : bigint <<PK>>
  --
  * email : varchar(255) <<unique>>
  * password_hash : varchar(255)
  created_at : timestamp
}
@enduml
\```
````
`````

````

## Diagram Types

### 1. Entity-Relationship (ER) Diagrams

**Use For:** Database schemas, table relationships, data models

**Template:**

```plantuml
!theme plain
@startuml
!define primary_key(x) <color:#B8860B><&key></color> <b>x</b>
!define foreign_key(x) <color:#8B4513><&arrow-right></color> x
!define not_null(x) <color:#DC143C><&asterisk></color> x

entity users {
  * id : bigint <<PK>>
  --
  * email : varchar(255) <<unique>>
  * password_hash : varchar(255)
  * created_at : timestamp
  updated_at : timestamp
  deleted_at : timestamp
}

entity merchants {
  * id : bigint <<PK>>
  --
  * user_id : bigint <<FK>> <<unique>>
  * business_name : varchar(255)
  * created_at : timestamp
}

entity products {
  * id : bigint <<PK>>
  --
  * merchant_id : bigint <<FK>>
  * sku : varchar(100)
  * name : varchar(255)
  * price : decimal(10,2)
  * stock : int
}

users ||--|| merchants : "owns"
merchants ||--o{ products : "has many"
@enduml
```

**ER Diagram Rules:**

| Element           | Notation                            | Example                  |
| :---------------- | :---------------------------------- | :----------------------- | ----- | ---------- | --- | -------------- | --- | --- | --- | ---------- |
| Primary Key       | `* id : bigint <<PK>>`              | `* id : bigint <<PK>>`   |
| Foreign Key       | `* table_id : bigint <<FK>>`        | `* merchant_id : bigint` |
| Unique Constraint | `* email : varchar(255) <<unique>>` | `* email : varchar(255)` |
| Not Null          | `* column : type`                   | `* name : varchar(255)`  |
| Nullable          | `column : type` (no asterisk)       | `deleted_at : timestamp` |
| Index             | Add `<<index>>` tag                 | `sku : varchar(100)`     |
| Enum              | `status : enum` + legend            | `status : enum`          |
| One-to-One        | `                                   |                          | --    |            | `   | `users         |     | --  |     | merchants` |
| One-to-Many       | `                                   |                          | --o{` | `merchants |     | --o{ products` |
| Many-to-Many      | `}o--o{` (with junction table)      | `products }o--o{ tags`   |

**Complete Example with Relationships:**

```plantuml
!theme plain
@startuml
entity users {
  * id : bigint <<PK>>
  --
  * email : varchar(255) <<unique>>
  * password_hash : varchar(255)
  * role : enum('ADMIN','MERCHANT')
  * created_at : timestamp
  updated_at : timestamp
  deleted_at : timestamp
}

entity merchants {
  * id : bigint <<PK>>
  --
  * user_id : bigint <<FK>> <<unique>>
  * business_name : varchar(255)
  * tax_id : varchar(50) <<unique>>
  * created_at : timestamp
}

entity products {
  * id : bigint <<PK>>
  --
  * merchant_id : bigint <<FK>>
  * sku : varchar(100) <<index>>
  * name : varchar(255)
  * price : decimal(10,2)
  * stock : int
  * created_at : timestamp
}

entity sales {
  * id : bigint <<PK>>
  --
  * merchant_id : bigint <<FK>>
  * total : decimal(10,2)
  * status : enum('PENDING','PAID','REFUNDED')
  * created_at : timestamp
}

entity sale_items {
  * id : bigint <<PK>>
  --
  * sale_id : bigint <<FK>>
  * product_id : bigint <<FK>>
  * quantity : int
  * unit_price : decimal(10,2)
  * subtotal : decimal(10,2)
}

users ||--|| merchants : "owns"
merchants ||--o{ products : "has many"
merchants ||--o{ sales : "has many"
sales ||--o{ sale_items : "contains"
products ||--o{ sale_items : "sold in"
@enduml
```

### 2. Sequence Diagrams

**Use For:** API flows, authentication flows, synchronization processes

**Template:**

```plantuml
!theme plain
@startuml
actor User
participant "Web App" as Web
participant "API Server" as API
participant "Auth Service" as Auth
database "PostgreSQL" as DB

User -> Web : Click "Login"
activate Web
Web -> API : POST /api/auth/login\n{email, password}
activate API
API -> Auth : validateCredentials(email, password)
activate Auth
Auth -> DB : SELECT * FROM users\nWHERE email = ?
activate DB
DB --> Auth : user record
deactivate DB
Auth -> Auth : bcrypt.compare(password, hash)
Auth --> API : JWT token
deactivate Auth
API --> Web : 200 OK\n{token, user}
deactivate API
Web -> Web : store token in localStorage
Web --> User : Redirect to Dashboard
deactivate Web
@enduml
```

**Sequence Diagram Rules:**

| Element             | Notation                       | Example                           |
| :------------------ | :----------------------------- | :-------------------------------- |
| Actor               | `actor Name`                   | `actor User`                      |
| Participant         | `participant "Label" as Alias` | `participant "API" as API`        |
| Database            | `database "Label" as Alias`    | `database "PostgreSQL" as DB`     |
| Synchronous Call    | `->`                           | `Web -> API : request`            |
| Async Call          | `->>`                          | `API ->> Queue : publish event`   |
| Return              | `-->`                          | `API --> Web : response`          |
| Activate/Deactivate | `activate`/`deactivate`        | `activate API`                    |
| Note                | `note left/right/over : text`  | `note over API : Validates input` |
| Alt/Else            | `alt` / `else` / `end`         | `alt success`                     |
| Loop                | `loop` / `end`                 | `loop for each item`              |

**Complete Example with Error Handling:**

```plantuml
!theme plain
@startuml
actor Merchant
participant "POS App" as POS
participant "API Server" as API
participant "Payment Gateway" as Payment
database "PostgreSQL" as DB

Merchant -> POS : Scan Product
activate POS
POS -> API : GET /api/products/{sku}
activate API
API -> DB : SELECT * FROM products\nWHERE sku = ? AND deleted_at IS NULL
activate DB
DB --> API : product
deactivate DB

alt Product Found
  API --> POS : 200 OK {product}
  POS -> POS : Add to cart
  POS --> Merchant : Show cart
else Product Not Found
  API --> POS : 404 Not Found
  deactivate API
  POS --> Merchant : Error: Product not found
  deactivate POS
end

Merchant -> POS : Checkout
activate POS
POS -> API : POST /api/sales\n{items, total}
activate API
API -> DB : BEGIN TRANSACTION
activate DB
API -> DB : INSERT INTO sales
API -> DB : INSERT INTO sale_items
API -> Payment : POST /charge\n{amount, card_token}
activate Payment

alt Payment Success
  Payment --> API : 200 OK {transaction_id}
  deactivate Payment
  API -> DB : UPDATE sales SET status = 'PAID'
  API -> DB : COMMIT
  DB --> API : success
  deactivate DB
  API --> POS : 201 Created {sale}
  deactivate API
  POS -> POS : Print receipt
  POS --> Merchant : Sale completed
else Payment Failed
  Payment --> API : 402 Payment Failed
  deactivate Payment
  API -> DB : ROLLBACK
  DB --> API : rolled back
  deactivate DB
  API --> POS : 402 Payment Failed
  deactivate API
  POS --> Merchant : Error: Payment declined
end
deactivate POS
@enduml
```

### 3. Architecture Diagrams

**Use For:** System components, deployment diagrams, microservices

**Component Diagram Template:**

```plantuml
!theme plain
@startuml
package "Frontend" {
  component [Angular App] as Web
  component [PWA Service Worker] as SW
}

package "Backend" {
  component [NestJS API] as API
  component [Auth Module] as Auth
  component [Sales Module] as Sales
}

package "Data Layer" {
  database "PostgreSQL" as DB
  database "Redis Cache" as Redis
  component [Prisma ORM] as ORM
}

package "External Services" {
  component [Payment Gateway] as Payment
  component [SMS Provider] as SMS
}

Web --> SW : offline support
Web --> API : REST API
API --> Auth : validates
API --> Sales : manages
API --> ORM : queries
ORM --> DB : SQL
ORM --> Redis : caching
Sales --> Payment : processes payments
Auth --> SMS : 2FA codes
@enduml
```

**Deployment Diagram Template:**

```plantuml
!theme plain
@startuml
node "User Device" {
  component [Browser] as Browser
  component [PWA] as PWA
}

node "Load Balancer" {
  component [Nginx] as LB
}

node "Application Servers" {
  node "Server 1" {
    component [API Instance 1] as API1
  }
  node "Server 2" {
    component [API Instance 2] as API2
  }
}

node "Database Cluster" {
  database "Primary DB" as DBPrimary
  database "Replica DB" as DBReplica
}

node "Cache Layer" {
  database "Redis Master" as RedisMaster
  database "Redis Replica" as RedisReplica
}

Browser --> LB : HTTPS
PWA --> LB : HTTPS
LB --> API1 : HTTP
LB --> API2 : HTTP
API1 --> DBPrimary : Read/Write
API2 --> DBPrimary : Read/Write
API1 --> DBReplica : Read
API2 --> DBReplica : Read
API1 --> RedisMaster : Cache
API2 --> RedisMaster : Cache
DBPrimary --> DBReplica : Replication
RedisMaster --> RedisReplica : Replication
@enduml
```

## Anti-Patterns (FORBIDDEN)

```plantuml
<!-- ❌ NEVER: Missing theme -->
@startuml
entity users {
  id : bigint
}
@enduml

<!-- ❌ NEVER: No primary key indicator -->
entity users {
  id : bigint
  email : varchar(255)
}

<!-- ❌ NEVER: Unclear relationships -->
users -- products

<!-- ❌ NEVER: Missing cardinality -->
users --> products : has

<!-- ✅ CORRECT: Complete ER diagram -->
!theme plain
@startuml
entity users {
  * id : bigint <<PK>>
  --
  * email : varchar(255) <<unique>>
}
entity products {
  * id : bigint <<PK>>
  --
  * user_id : bigint <<FK>>
}
users ||--o{ products : "owns"
@enduml
```

## Diagram Decision Tree

```
User requests diagram?
├─ Database/Schema?
│  └─ Use ER Diagram (entity-relationship)
│     - Show tables, columns, keys
│     - Show relationships with cardinality
│     - Include constraints (PK, FK, unique, index)
│
├─ API/Flow/Process?
│  └─ Use Sequence Diagram
│     - Show request/response flow
│     - Include auth steps
│     - Show error handling (alt/else)
│     - Activate/deactivate participants
│
├─ System/Components?
│  └─ Use Component Diagram
│     - Show modules/services
│     - Show dependencies
│     - Group by layers
│
└─ Deployment/Infrastructure?
   └─ Use Deployment Diagram
      - Show servers/nodes
      - Show load balancers
      - Show replication
```

## Integration with Other Skills

| Skill                | When to Chain                                      |
| :------------------- | :------------------------------------------------- |
| `schema-doc-sync`    | After generating ER diagram for database schema    |
| `api-doc-generation` | After generating sequence diagram for API flow     |
| `documentation`      | When creating complete documentation with diagrams |

## Workflow

1. **Identify diagram type:** ER, Sequence, Component, or Deployment
2. **Gather context:**
   - For ER: Read `schema.prisma` or database schema docs
   - For Sequence: Read API endpoints, controllers, services
   - For Architecture: Read system design docs
3. **Generate PlantUML code** following standards
4. **Include in documentation** with proper markdown fencing
5. **Add text description** before diagram
6. **Test rendering** (optional): Preview with PlantUML viewer

## Common Patterns

### Pattern 1: Database Schema with Soft Deletes

```plantuml
!theme plain
@startuml
entity users {
  * id : bigint <<PK>>
  --
  * email : varchar(255) <<unique>>
  * created_at : timestamp
  updated_at : timestamp
  deleted_at : timestamp <<soft delete>>
}

note right of users
  Soft delete pattern:
  - deleted_at NULL = active
  - deleted_at NOT NULL = deleted
  - All queries MUST filter by deleted_at
end note
@enduml
```

### Pattern 2: Authentication Flow

```plantuml
!theme plain
@startuml
actor User
participant "Web App" as Web
participant "API" as API
participant "Auth Service" as Auth
database "DB" as DB

User -> Web : Login
Web -> API : POST /auth/login
API -> Auth : validateCredentials()
Auth -> DB : findUser(email)
DB --> Auth : user
Auth -> Auth : bcrypt.compare()
alt Valid Credentials
  Auth --> API : JWT token
  API --> Web : 200 OK {token}
  Web --> User : Redirect to Dashboard
else Invalid Credentials
  Auth --> API : 401 Unauthorized
  API --> Web : 401 Unauthorized
  Web --> User : Show error
end
@enduml
```

### Pattern 3: Microservices Architecture

```plantuml
!theme plain
@startuml
package "Frontend" {
  [Web App] as Web
}

package "API Gateway" {
  [Nginx] as Gateway
}

package "Services" {
  [Auth Service] as Auth
  [Sales Service] as Sales
  [Inventory Service] as Inventory
}

package "Data" {
  database "Auth DB" as AuthDB
  database "Sales DB" as SalesDB
  database "Inventory DB" as InventoryDB
}

Web --> Gateway : HTTPS
Gateway --> Auth : /api/auth/*
Gateway --> Sales : /api/sales/*
Gateway --> Inventory : /api/inventory/*
Auth --> AuthDB
Sales --> SalesDB
Inventory --> InventoryDB
@enduml
```

## Error Prevention

| Error                              | Prevention                               |
| :--------------------------------- | :--------------------------------------- | --- | -------- | --- | --- | --- | --- |
| Diagram doesn't render             | ALWAYS start with `!theme plain`         |
| Unclear relationships              | Use cardinality symbols: `               |     | --o{`, ` |     | --  |     | `   |
| Missing foreign keys               | Mark with `<<FK>>` tag                   |
| Unreadable diagrams                | Group entities, use notes, add legends   |
| Sequence diagram activation issues | Match every `activate` with `deactivate` |
| Too complex                        | Split into multiple diagrams by concern  |

## Appendix A: PlantUML Quick Reference

### ER Diagram Symbols

| Symbol | Meaning      | Example Usage                   |
| :----- | :----------- | :------------------------------ | ------- | ----------------------- | --- | --- | --- | ------------------- |
| `      |              | `                               | One (1) | `users                  |     | --  |     | merchants` (1-to-1) |
| `}o`   | Zero or Many | `products }o--o{ tags` (M-to-M) |
| `o{`   | Many         | `merchants                      |         | --o{ products` (1-to-M) |
| `--`   | Relation     | Connects entities               |

### Sequence Diagram Symbols

| Symbol | Meaning    | Example Usage            |
| :----- | :--------- | :----------------------- | --------------- | ----------------------- |
| `->`   | Sync call  | `Web -> API : request`   |
| `-->>` | Async call | `API ->> Queue : event`  |
| `-->`  | Return     | `API --> Web : response` |
| `      |            | `                        | Synchronization | Used for parallel flows |

---

**Version:** 1.0.0
**Last Updated:** 2026-01-27
**Author:** @Scribe
**Related Skills:** documentation, schema-doc-sync, api-doc-generation
````
