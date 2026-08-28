# CF-008 — Validated Read API + Product Drill-Down

**Status:** IMPLEMENTED — local typecheck/build proof still required
**Date:** 2026-08-28

## What changed

CF-008 moves Company Foundry from an in-frontend registry toward a backend-owned read model.

Implemented:

1. `backend/src/companyFoundry/companyFoundryRegistry.ts`
   - backend product registry
   - competitor-evidence records
   - Master Build Plan records
   - Phase Value Records
   - acceptance criteria and evidence requirements
   - economic safety rules
   - runtime validation

2. `backend/src/routes/companyFoundry.ts`
   - `GET /api/foundry/snapshot`
   - `GET /api/foundry/products`
   - `GET /api/foundry/products/:productId`
   - `GET /api/foundry/master-plans`
   - `GET /api/foundry/phases`
   - `GET /api/foundry/validation`

3. `backend/src/server.ts`
   - mounts the Company Foundry read router under `/api`

4. `frontend/src/api/companyFoundry.ts`
   - typed frontend fetch layer using LocalBrain's existing `fetchLiveJson` transport

5. `frontend/src/views/CompanyFoundryLiveView.tsx`
   - live API-backed Foundry control plane
   - portfolio overview
   - clickable product drill-down
   - competitors/substitutes
   - advantages/disadvantages
   - source repository provenance
   - Master Build Plans
   - Phase Value Records
   - acceptance/evidence requirements
   - DPR simulator
   - validation/financial safety status

6. `frontend/src/router.tsx`
   - `/foundry` now routes to the live API-backed view

## Canonical records added

### Master Build Plan
`MBP-SOUSCHEF-V1` is the first accepted training Master Plan.

- Product: SousChef
- Remaining readiness: 10%
- Budget: $12,000
- Capstone eligible: **No**
- Purpose: prove that Cohort 1 can convert a near-finished company product into a revenue-capable paid beta under the Academy production system.

### Phase Value Records
SC-01 through SC-10 now contain explicit acceptance criteria and required evidence. Accepted evidence arrays remain empty until actual work is performed and independently accepted.

## Validation controls

Runtime validation checks:

- unique product IDs;
- readiness between 0–100;
- non-negative and ordered revenue bands;
- Master Plans reference known products;
- phases reference known products;
- non-negative phase budgets;
- Company residual floor is not below 25%;
- Capstone lead ceiling is not above 51%;
- payroll, equity issuance, and money movement remain disabled in CF-008.

An invalid registry causes `/api/foundry/snapshot` to fail closed with a 500 response and validation errors.

## Competitor evidence posture

Competitor entries have evidence states:

- `market_anchor` — captured in prior Foundry market research;
- `needs_refresh` — named competitor/substitute requiring current pricing/product refresh before investment or sales claims;
- `internal_substitute` — internal/manual alternative where applicable.

The system does not pretend stale competitor data is current.

## Safety posture

CF-008 remains read-only. It cannot:

- create builders;
- approve phases;
- accept evidence;
- alter Master Plans;
- issue equity;
- run payroll;
- settle residuals;
- transfer money.

## Acceptance gates still outstanding

Run locally from the LocalBrain repo:

- backend typecheck
- backend build/tests as appropriate
- frontend typecheck
- frontend build
- launch backend + frontend and verify `/foundry`
- verify `/api/foundry/validation` returns `valid: true`
- visually inspect product drill-down, Master Plans, Phase Value table, and DPR simulator

No command is marked passed until executed in the local environment.

## Next slice — CF-009

**Persistence + controlled write preparation**

Recommended scope:

- move canonical Foundry records from TypeScript constants into durable JSON/SQLite-backed persistence;
- audit log for every proposed mutation;
- proposal/approval workflow for product and Master Plan changes;
- builder application/roster records;
- Phase submission + evidence bundle records;
- independent acceptance queue;
- PVS calculator as stored Phase Value Record data;
- competitor source-refresh timestamps;
- no payroll/equity/money movement yet.
