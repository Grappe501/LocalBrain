# CF-006 — Company Foundry Control Plane Implementation

**Status:** IMPLEMENTED — read-first UI; local build validation still required
**Date:** 2026-08-28

## Delivered

- First-class LocalBrain navigation entry: **Company Foundry**
- Route: `/foundry`
- Read-first Company Foundry dashboard
- Portfolio view with software/platform/book projects, readiness, dispositions, training use, Capstone candidacy, and 50%-haircut annual revenue-capacity bands
- Academy view with the 12-week paid apprenticeship model and L0–L5 capability ladder
- Cohort 1 SousChef Phase Board with the approved $12,000 completion-budget model
- Capstone admission-gate view and current candidate bench
- Interactive DPR simulator enforcing a 25% company floor and 51% lead ceiling, with the remainder shown as the team pool
- Doctrine view showing the four independent economic ledgers and CF-006 read-first safety posture
- Dedicated responsive stylesheet

## Safety posture

CF-006 is deliberately advisory/read-first. It cannot:

- issue equity or securities;
- create payroll payments;
- settle residuals;
- move money;
- approve a Capstone;
- accept paid phases;
- alter legal agreements.

## Data posture

The initial control plane is intentionally seeded from the canonical Company Foundry planning/audit records rather than connected to a write-capable finance or HR backend. Future slices should migrate the seeded product records into shared machine-readable registries/API contracts instead of duplicating them indefinitely in the view.

## Known integration note

The pre-existing `frontend/src/router.tsx` references `LazyModuleRoute` in the dynamic department-route section without a definition visible in that file at the pre-CF-006 baseline. CF-006 preserves that existing dynamic-route pattern and does not attempt to redesign the LocalBrain module loader as part of the Company Foundry slice.

This means CF-006 should be locally validated with the repository's normal frontend typecheck/build before deployment; any pre-existing `LazyModuleRoute` resolution issue belongs to the LocalBrain shell and should be corrected in a dedicated shell-hardening patch if the build exposes it.

## Acceptance checklist

- [x] Company Foundry visible as first-class navigation target
- [x] `/foundry` route added
- [x] Portfolio dashboard
- [x] Books represented as independent Product Projects
- [x] Academy/capability view
- [x] SousChef Cohort 1 real-dollar Phase Board
- [x] Capstone gate
- [x] DPR simulator with company floor and lead ceiling
- [x] Four-ledger doctrine view
- [x] No financial/equity write actions
- [ ] Local frontend typecheck/build proof
- [ ] Visual review in running LocalBrain instance
- [ ] Replace seeded view data with canonical registry/API ingestion

## Recommended next slice

**CF-007 — Foundry Registry + Live Data Layer**

Move the portfolio, books, phases, builder roster, Capstone plans, and economic scenarios into canonical shared schemas/data with read APIs consumed by `/foundry`. Add filtering, product drill-down, repository links, competitor evidence, phase details, and audit timestamps. Keep payroll/equity/money movement disabled.
