# CF-006B — Company Foundry Control Plane Implementation

**Status:** IMPLEMENTED — read-first V1 surface; runtime validation still required
**Date:** 2026-08-28
**Route:** `/foundry`

## Purpose

Expose the Company Foundry as a first-class LocalBrain executive surface rather than leaving the venture-studio architecture only in planning documents.

The control plane is intentionally **read-first**. It does not issue payroll, securities, equity, residual settlements, contracts, or money transfers.

## Implemented surface

### Executive navigation

`Company Foundry` is now a permanent LocalBrain navigation item pointing to `/foundry`.

### Portfolio view

Shows modeled product projects with:

- product name;
- software / platform / book type;
- readiness estimate;
- disposition;
- conservative 50%-haircut annual revenue-capacity range;
- training-project status;
- Capstone-candidate status.

The control plane preserves the finance doctrine that modeled market capacity is **not cash forecast**. Until customers pay, forecast revenue remains $0.

### Builder Academy view

Shows:

- 12-week finite Builder Academy concept;
- $20/hour working apprentice rate subject to legal/payroll review;
- six-level capability ladder;
- 90-day post-graduation ownership-track proof period;
- explicit separation between graduation, ownership, and residual rights.

### Phase Board

Seeds Cohort 1 with SousChef launch-completion phases and a $12,000 maximum completion budget:

- $7,200 apprentice labor;
- $2,400 lead/reviewer model;
- $1,200 tools/testing;
- $1,200 contingency.

Ten planned accepted phases total $10,800 before contingency.

### Capstone view

Shows the admission gates that must be satisfied before the special Capstone residual system applies, plus a candidate bench drawn from the audited portfolio.

Existing company products do not become a builder Capstone merely because the builder contributes work to them.

### Economics / residual simulator

Provides a read-only interactive simulator for monthly Distributable Product Residual (DPR):

- company percentage has a UI minimum of 25%;
- Capstone lead has a UI maximum of 51%;
- team receives the remainder;
- output shows dollar allocation for company, lead, and team.

The simulator states that residuals are not ownership and that gross revenue is not DPR.

### Doctrine view

Surfaces the four-ledger architecture:

1. Parent Ownership
2. Production Compensation
3. Product Residual
4. Capital / Property Contribution

It also displays the CF-006 safety posture.

## Files

- `frontend/src/views/CompanyFoundryView.tsx`
- `frontend/src/styles/company-foundry.css`
- `frontend/src/data/companyFoundry.ts`
- `frontend/src/router.tsx`
- `frontend/src/shell/DepartmentNav.tsx`
- `docs/company_foundry/*` planning/audit/economic doctrine

## Current implementation posture

### Live in source

- `/foundry` route
- Foundry navigation entry
- portfolio dashboard
- Academy dashboard
- SousChef Cohort 1 phase board
- Capstone gate
- DPR simulator
- doctrine panel

### Static / read-first in this slice

- product registry is frontend-seeded rather than database-backed;
- builder roster/capability records are not yet persisted;
- phase acceptance is display-only;
- Capstone admission is display-only;
- economic ledgers are conceptual/display-only;
- market estimates are planning values, not live sales data;
- no product revenue APIs are connected;
- no GitHub automatic portfolio refresh is connected;
- no payroll/equity/residual disbursement actions exist.

## Hard controls

CF-006B must not add:

- payroll execution;
- bank transfers;
- equity or securities issuance;
- automatic residual settlement;
- contract execution;
- self-acceptance of paid production phases;
- automatic promotion/ownership decisions;
- conversion of planning revenue estimates into booked revenue.

## Validation required

Before declaring runtime certification, run the repository's normal frontend/package validation from the LocalBrain workspace and verify at minimum:

1. TypeScript/typecheck passes.
2. Frontend production build passes.
3. `/foundry` renders through the LocalBrain shell.
4. Company Foundry navigation link is visible and active-state styling works.
5. All six control-plane tabs render.
6. Residual simulator cannot drive the company below 25% through normal UI controls.
7. Lead slider cannot exceed 51% through normal UI controls.
8. Mobile layout remains usable.
9. Existing LocalBrain routes remain unaffected.

## Closeout assessment

**Source implementation: PASS.**

**Runtime/build certification: PENDING operator/CI proof.**

## Recommended next slice

**CF-007 — Foundry Data Spine + Live Registries**

Move the control plane from frontend-seeded state to governed registries while staying read-first:

- canonical Product Project registry;
- repository-to-product-family mapping;
- books as first-class Product Projects;
- builder/capability ledger schema;
- Master Build Plan registry;
- Phase Value Record registry;
- acceptance evidence registry;
- Capstone registry;
- residual agreement metadata;
- portfolio market/audit evidence links;
- dashboard aggregation from canonical data rather than hardcoded UI arrays.

No financial execution should be introduced in CF-007.
