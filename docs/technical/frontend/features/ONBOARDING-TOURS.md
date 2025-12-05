---
# YAML Frontmatter - Metadata for Semantic Search & RAG
document_type: "feature-design"
module: "frontend"
status: "approved"
version: "1.0.1"
last_updated: "2025-12-05"
author: "@Frontend"

# Keywords for semantic search
keywords:
  - "onboarding"
  - "tour"
  - "driver.js"
  - "tutorial"
  - "guide"
  - "ux"

# Related documentation
related_docs:
  database_schema: ""
  api_design: ""
  ux_flow: "docs/technical/frontend/ux-flows/ONBOARDING-FLOW.md"
  sync_strategy: ""
  adr: ""

# Feature-specific metadata
feature_metadata:
  priority: "medium"
  complexity: "low"
  estimated_effort: "2 days"
  dependencies: []
  target_release: "v1.1.0"
---

<!-- AI-INSTRUCTION: START -->
<!--
  This document defines the technical specification for the User Onboarding Tours feature.
  It mandates the use of driver.js and specific implementation patterns.
-->
<!-- AI-INSTRUCTION: END -->

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="120" align="center" valign="middle">
      <img src="../../../../libs/assets/src/images/logo.png" width="80" alt="Project Logo" />
    </td>
    <td align="left" valign="middle">
      <h1 style="margin: 0; border-bottom: none;">FEAT-ONB: User Onboarding Tours</h1>
      <p style="margin: 0; color: #6e7681; font-size: 1.1em;">Feature Design Document</p>
    </td>
  </tr>
</table>

<div align="center">

  <!-- METADATA BADGES -->
  <img src="https://img.shields.io/badge/Status-Approved-green?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Priority-Medium-blue?style=flat-square" alt="Priority" />
  <img src="https://img.shields.io/badge/Owner-@Frontend-lightgrey?style=flat-square" alt="Owner" />

</div>

---

## Agent Directives (System Prompt)

_This section contains mandatory instructions for AI Agents (Copilot, Cursor, etc.) interacting with this document._

| Directive      | Instruction                                                                                   |
| :------------- | :-------------------------------------------------------------------------------------------- |
| **Context**    | This document defines the standard for guided user tours in the frontend applications.        |
| **Constraint** | MUST use `driver.js` (lightweight, MIT). MUST NOT use `intro.js` (commercial license issues). |
| **Pattern**    | Use a dedicated `TourService` to manage state and steps. Decouple tour logic from components. |
| **Related**    | `docs/process/standards/TOOLING-STYLE-GUIDE.md`                                               |

---

## 1. Overview

To improve user adoption and reduce support requests, we will implement **Guided Tours** (Onboarding) for key features of the application. These tours will highlight UI elements and explain their function in a step-by-step manner.

We have selected **Driver.js** as the standard library due to its lightweight nature (~5kb), MIT license, and framework-agnostic design which fits our Angular + Signals architecture.

## 2. User Stories / Requirements

- **US-01:** As a new user, I want to see a quick tour of the dashboard upon my first login, so that I understand the main KPIs.
- **US-02:** As a user, I want to be able to close/skip the tour at any time, so that it doesn't block my work.
- **US-03:** As a user, I want the application to remember that I have completed the tour, so that I don't see it again.
- **US-04:** As a user, I want to be able to restart the tour from a "Help" menu if I need a refresher.

## 3. Technical Architecture

### 3.1. Database Changes (Prisma)

N/A - This feature is frontend-only and uses `localStorage` for persistence.

### 3.2. API Endpoints (Backend)

N/A - No new backend endpoints required.

### 3.3. UI Components (Frontend)

**Library Selection:**

- **Driver.js** (Selected): Lightweight (5kb), MIT License.
- **Rejected:** Shepherd.js (Heavy), Intro.js (Commercial).

**Components & Services:**

- `TourService` (Singleton): Manages `driver.js` instance, step definitions, and persistence.
- `DashboardComponent`: Triggers the tour via `TourService` on `ngAfterViewInit`.

**UX/UI Guidelines:**

- **Scope Limit:** Keep tours short (3-5 steps max).
- **Stable Selectors:** Use specific IDs (e.g., `id="tour-step-1"`).
- **Non-Blocking:** Always allow exit via ESC.

## 4. Implementation Plan

1. [ ] Install `driver.js` (`bun add driver.js`).
2. [ ] Create `TourService` in `libs/core` or `apps/web/src/app/core`.
3. [ ] Implement `startDashboardTour()` method with steps.
4. [ ] Add `localStorage` logic to prevent re-showing.
5. [ ] Integrate into `DashboardComponent`.
6. [ ] Add E2E tests with Playwright.

## 5. Open Questions and Risks

**Open Questions:**

- Should we sync tour completion status to the backend user profile in the future? (Currently local-only).

**Risks:**

- DOM changes might break tour steps if IDs are not maintained. Mitigation: Use strict E2E tests.

---

## Appendix A: Change Log

| Date       | Version | Author    | Changes                             |
| :--------- | :------ | :-------- | :---------------------------------- |
| 2025-12-05 | 1.0.1   | @Frontend | Fixed template structure compliance |
| 2025-12-05 | 1.0.0   | @Frontend | Initial creation                    |

---

## Appendix B: Reference Implementation

```typescript
import { Injectable } from "@angular/core";
import { driver, DriveStep, Driver } from "driver.js";
import "driver.js/dist/driver.css";

@Injectable({
  providedIn: "root",
})
export class TourService {
  private driverObj: Driver;

  constructor() {
    this.driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: "Listo",
      nextBtnText: "Siguiente",
      prevBtnText: "Anterior",
      onDestroyed: () => {
        this.markAsCompleted();
      },
    });
  }

  startDashboardTour() {
    if (this.isCompleted("dashboard_tour")) return;

    const steps: DriveStep[] = [
      {
        element: "#header-logo",
        popover: {
          title: "Bienvenido a Impulsa",
          description: "Esta es tu nueva plataforma de gestión.",
          side: "bottom",
        },
      },
    ];

    this.driverObj.setSteps(steps);
    this.driverObj.drive();
  }

  private markAsCompleted(tourId: string = "dashboard_tour") {
    localStorage.setItem(`tour_completed_${tourId}`, "true");
  }

  private isCompleted(tourId: string): boolean {
    return !!localStorage.getItem(`tour_completed_${tourId}`);
  }
}
```
