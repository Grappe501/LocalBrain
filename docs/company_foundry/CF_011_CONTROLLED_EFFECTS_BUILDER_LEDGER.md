# CF-011 — Controlled Effects + Builder Capability Ledger

**Status:** IMPLEMENTED — workstation certification pending
**Date:** 2026-08-28

## Purpose

Convert accepted Foundry governance records into durable operational state through an explicit second-step effect application. Review acceptance alone does not mutate builder, Master Plan, or capability records.

## Implemented

- SQLite tables for builders, capability events, cohorts, admitted Master Build Plans, and effect applications.
- Explicit `apply-effect` endpoint for accepted proposals.
- Idempotency: one operational effect per proposal.
- Builder applications can create an L0 apprentice Builder record only after independent acceptance and a separate effect action.
- Accepted Master Build Plan proposals can create durable admitted Master Plan records only after the separate effect action.
- Accepted phase submissions can add Phase Value Points and accepted-phase counts to an existing Builder only after the separate effect action.
- Every effect is written to the existing Foundry audit log.
- Frontend API helpers expose builders, capability events, cohorts, admitted Master Plans, and effect application.

## Hard controls

- Proposal must already be independently accepted.
- Effect cannot be applied twice.
- Phase capability credit requires an existing Builder.
- Governance acceptance does not itself trigger an effect.
- Product mutation remains disabled.
- Payroll remains disabled.
- Equity issuance remains disabled.
- Residual settlement remains disabled.
- Money movement remains disabled.

## Effect matrix

| Accepted proposal | Controlled effect |
|---|---|
| `builder_application` | Admit Builder at L0 / apprentice |
| `master_plan_proposal` | Create durable accepted Master Build Plan |
| `phase_submission` | Add accepted-phase capability event and PVP |
| `capstone_application` | No effect yet; future slice |
| `product_change` | No effect yet |
| `registry_change` | No effect yet |

## Why two steps

The Foundry separates **judgment** from **execution**. A reviewer decides whether evidence satisfies the proposal. A separate authorized operator applies the operational effect. This preserves an audit boundary and reduces accidental or self-executing state changes.

## New API

- `POST /api/foundry/proposals/:proposalId/apply-effect`
- `GET /api/foundry/builders`
- `GET /api/foundry/capability-events`
- `GET /api/foundry/capability-events?builderId=...`
- `GET /api/foundry/cohorts`
- `GET /api/foundry/admitted-master-plans`

`/api/foundry/write-capabilities` now reports controlled operational effects separately from financial rails.

## Certification gates

CF-011 is not certified until the LocalBrain workstation proves:

1. backend typecheck;
2. frontend typecheck;
3. backend build;
4. frontend build;
5. migration on a clean/test SQLite database;
6. accepted builder proposal does not create a Builder before `apply-effect`;
7. `apply-effect` creates exactly one Builder and a second call fails idempotently;
8. accepted phase submission increases PVP/accepted phase count once;
9. accepted Master Plan becomes a durable admitted record once;
10. restart preserves all records;
11. payroll/equity/residual/money flags remain false.

## Next slice — CF-012

**Cohort Operations + Capability Promotion Engine**

Build cohort creation/admission, 12-week progression checkpoints, mentor/reviewer assignment, capability-dimension scoring, governed L0→L5 promotion proposals, 90-day proof-period tracking, and dashboard views for Academy throughput and builder readiness. No financial rails are enabled by CF-012.
