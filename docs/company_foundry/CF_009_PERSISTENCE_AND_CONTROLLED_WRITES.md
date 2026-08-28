# CF-009 — Persistence + Controlled Write Preparation

**Status:** IMPLEMENTED — build/typecheck proof still required on LocalBrain workstation
**Date:** 2026-08-28

## Purpose

Move Company Foundry governance state out of transient UI-only interactions and into durable SQLite-backed records while preserving a strict boundary between **governance writes** and **financial/ownership effects**.

CF-009 does not enable payroll, equity issuance, residual settlement, product mutation, builder admission, or money movement.

## Durable records added

SQLite tables:

- `foundry_proposals`
- `foundry_evidence`
- `foundry_acceptance_reviews`
- `foundry_audit_log`

They are migrated during normal LocalBrain bootstrap through `migrateCompanyFoundryTables()`.

## Proposal classes

The governed proposal system supports:

1. `product_change`
2. `builder_application`
3. `phase_submission`
4. `capstone_application`
5. `registry_change`

Proposal lifecycle:

`draft → submitted → under_review / accepted / rejected / withdrawn`

Rework keeps the proposal in review rather than manufacturing a second paid phase.

## Evidence bundles

Evidence can be attached to a proposal with:

- evidence type;
- human-readable label;
- URI/path reference;
- optional content hash;
- notes;
- immutable creation timestamp.

Future phase submissions should attach build/test/deployment/documentation evidence appropriate to the phase acceptance criteria.

## Independent acceptance

A proposal submitter **cannot review/accept their own proposal**.

The API returns `403 self_acceptance_forbidden` when a reviewer ID matches the proposal submitter.

Acceptance creates a review record and an audit event. It does not trigger payroll, equity, residual rights, product-registry mutation, or cash movement.

## Append-only audit trail

Material governance events write to `foundry_audit_log` with:

- event type;
- subject type/id;
- actor;
- JSON details;
- timestamp.

CF-009 creates audit events for proposal creation, submission, evidence attachment, and review.

## API surface

Existing read API remains available under `/api/foundry/*`.

New governance endpoints:

- `GET /api/foundry/proposals`
- `GET /api/foundry/proposals/:proposalId`
- `POST /api/foundry/proposals`
- `POST /api/foundry/proposals/:proposalId/submit`
- `POST /api/foundry/proposals/:proposalId/evidence`
- `POST /api/foundry/proposals/:proposalId/review`
- `GET /api/foundry/audit`
- `GET /api/foundry/write-capabilities`

## Write capability boundary

CF-009 deliberately reports:

```json
{
  "governanceWritesEnabled": true,
  "productMutationEnabled": false,
  "builderAdmissionEnabled": false,
  "phaseAcceptanceEffectsEnabled": false,
  "payrollEnabled": false,
  "equityIssuanceEnabled": false,
  "residualSettlementEnabled": false,
  "moneyMovementEnabled": false
}
```

This distinction is foundational. A reviewer may approve that a phase submission meets its acceptance standard without automatically causing a payment. A builder application may be approved in governance without silently creating an employee, contractor, shareholder, or residual participant.

## Persistence architecture

The current product/master-plan/phase baseline remains the version-controlled canonical seed in the CF-008 registry.

CF-009 persists **workflow state around that canon** first. This is safer than immediately allowing database edits to rewrite canonical product economics or legal doctrine.

A later migration can move selected canonical records into database-backed truth only after validation, backup, amendment, and audit rules are proven.

## Required acceptance proof

Run on the LocalBrain workstation:

```bash
npm run typecheck --workspace=@localbrain/backend
npm run build --workspace=@localbrain/backend
npm run typecheck --workspace=@localbrain/frontend
npm run build --workspace=@localbrain/frontend
```

Then exercise:

1. bootstrap and confirm four CF-009 tables exist;
2. create a draft proposal;
3. submit it;
4. attach evidence;
5. prove same submitter cannot accept it;
6. accept/reject/rework using a distinct reviewer;
7. verify audit history;
8. restart LocalBrain and prove records persist;
9. verify `/api/foundry/write-capabilities` keeps every financial flag false.

Do not mark CF-009 certified until those checks pass.

## Next slice — CF-010

**CF-010 — Governance Workbench + Builder Intake UI**

Recommended build:

1. proposal inbox inside `/foundry`;
2. builder application intake form;
3. phase submission/evidence form;
4. reviewer acceptance queue;
5. audit timeline;
6. role/authorization policy for submitter vs reviewer;
7. Phase Value scoring form;
8. Master Plan proposal workflow;
9. Capstone application workflow;
10. no financial effects until a separate explicit activation slice.
