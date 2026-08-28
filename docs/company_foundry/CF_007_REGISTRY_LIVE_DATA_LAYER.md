# CF-007 — Foundry Registry + Live Data Layer

**Status:** IMPLEMENTED — read-first canonical registry layer
**Date:** 2026-08-28
**Parent:** CF-006 Company Foundry Control Plane

## Purpose

Move Company Foundry operational truth out of hardcoded React view data and into a canonical typed registry layer that can later be backed by APIs/database storage without changing Foundry doctrine.

## Implemented

### Canonical frontend registry

Created:

`frontend/src/data/companyFoundryRegistry.ts`

The registry now owns typed records for:

- Product Projects
- software/platform/book product kinds
- readiness
- disposition
- conservative 50%-haircut revenue-capacity ranges
- training eligibility
- Capstone candidacy
- source repository mapping
- accepted-phase records
- Builder records
- Capstone records
- Foundry economic controls
- registry metadata

### Product registry expansion

The control plane now includes a broader canonical product set rather than the smaller hardcoded CF-006 sample, including:

- SousChef / HomeChef AI
- LocalBrain
- CampaignOS
- VoteMatch
- Bid Assembly
- CanonForge
- PeopleBase / ContactList
- Event Operations
- FieldSpark / Field Command
- Writers Dashboard / Book Foundry
- Constitutional Capitalism
- The Mercy Protocol
- Campti / Grappe Historical Novel
- Arkansas Political History
- Arkansas Galaxy
- Elvestribal
- County Intelligence / Workbench
- Civic University Technology
- Block Street
- Signal / News Command Center
- Campaign Compliance

Books remain first-class Product Projects.

### Source provenance

Each canonical product can map to one or more GitHub repositories through `sourceRepos`. This begins the transition from repository inventory to product-family truth.

### Phase registry

SousChef Cohort 1's ten planned phases now live in the registry rather than inside the UI component.

The UI derives:

- phase table
- phase budget
- remaining contingency
- current status

from those canonical records.

### Builder registry

A typed Builder registry now exists with:

- builder ID
- display name
- L0–L5 capability level
- program/production status
- Phase Value Points
- accepted-phase count
- optional Capstone assignment

**Current canonical roster is intentionally empty.** CF-007 does not invent trainees or owners before admission.

### Capstone registry

A typed Capstone registry now exists with:

- Capstone ID
- product linkage
- lead builder linkage
- lifecycle state
- company residual %
- lead residual %
- team residual %

**Current admitted Capstone registry is intentionally empty.** Product candidacy and formal Capstone admission remain distinct.

### Economic rule registry

The machine-readable control layer now carries:

- Company DPR floor: 25%
- Capstone lead DPR ceiling: 51%
- apprentice working rate: $20/hour
- default settlement doctrine: monthly
- equity issuance enabled: false
- payroll enabled: false
- money movement enabled: false

The DPR simulator reads the company floor and lead ceiling from canonical rules rather than hardcoding them in the view.

## UI changes

`CompanyFoundryView.tsx` now imports the Foundry registry and derives the control-plane state from it.

Added a first-class **Builders** tab.

The interface now shows:

- canonical product/repository mapping
- dynamic portfolio counts
- dynamic training and Capstone-candidate counts
- empty canonical Builder roster until admission
- empty admitted-Capstone roster until approval
- registry-driven SousChef phase board
- registry-driven residual guardrails
- explicit safety switches for payroll/equity/money movement

## Safety posture

CF-007 remains read-first.

It cannot:

- create employment records
- issue wages
- make payroll transfers
- issue or transfer equity
- admit a real Capstone through a signed agreement
- settle residuals
- move money
- change legal ownership

Those functions require later authenticated write surfaces, audit logging, legal/entity configuration, and explicit operator authorization.

## Architecture direction

The current typed registry is an intermediate canonical layer.

The intended progression is:

`typed registry → validation schemas → read API → persistent database → authenticated write workflow → audit trail`

The UI should continue reading a stable Foundry data contract even as persistence changes underneath it.

## Acceptance status

### Completed

- [x] canonical typed Product registry
- [x] book Product Projects retained separately
- [x] source repo mapping
- [x] Phase registry
- [x] Builder registry schema
- [x] Capstone registry schema
- [x] economic rule registry
- [x] Company Foundry view reads registry
- [x] Builders tab
- [x] no invented participant records
- [x] read-first economic safety flags

### Still requires local/CI proof

- [ ] frontend TypeScript typecheck
- [ ] frontend production build
- [ ] visual browser review of `/foundry`
- [ ] accessibility pass
- [ ] responsive/mobile pass

## Next slice — CF-008

**CF-008 — Foundry Validation + Read API + Persistent Registry Preparation**

Recommended deliverables:

1. schema validation for Product, Phase, Builder, Capstone, and economic records;
2. server/read API exposing canonical Foundry state;
3. frontend fetch layer with loading/error states instead of direct registry imports;
4. product detail drill-down;
5. Master Build Plan registry and detail view;
6. competitor/market-evidence registry;
7. formal phase-value record schema;
8. acceptance-evidence record schema;
9. doctrine/doc links from dashboard;
10. persistence design for later authenticated writes;
11. local/CI typecheck + build gate for Foundry changes.

CF-008 remains non-transactional unless separately authorized.
