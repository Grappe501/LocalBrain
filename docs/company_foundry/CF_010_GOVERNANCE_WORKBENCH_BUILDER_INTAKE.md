# CF-010 — Governance Workbench + Builder Intake UI

**Status:** IMPLEMENTED — workstation certification still required
**Date:** 2026-08-28

## Purpose

Turn CF-009 durable governance persistence into an operator-facing Company Foundry workbench inside `/foundry`.

CF-010 enables governed proposal creation, builder intake, phase submissions, Master Build Plan proposals, Capstone applications, evidence bundles, independent review, audit history, and Phase Value Score modeling while preserving all financial hard locks.

## Delivered

### Governance tab

The Company Foundry control plane now includes a first-class **Governance** tab.

The workbench supports:

- builder applications;
- phase submissions;
- Master Build Plan proposals;
- Capstone applications;
- product-change proposals;
- registry-change proposals;
- draft creation;
- submission for review;
- evidence attachment;
- independent accept/rework/reject review;
- audit timeline;
- write-capability visibility.

### Master Build Plan proposal type

CF-010 adds `master_plan_proposal` to the governed proposal type system instead of hiding Master Plans inside an untyped registry-change payload.

### Builder intake

A prospective builder can be represented by a `builder_application` proposal with a structured JSON payload containing applicant data, prior experience, availability, desired track, portfolio evidence, or later intake fields.

**Important:** accepting a builder application does **not** yet create an admitted Builder record. Builder admission effects remain disabled until a later explicitly controlled slice.

### Phase submission

A builder can submit a `phase_submission` proposal against a phase ID and attach evidence such as:

- Git commits;
- pull requests;
- test/build output;
- screenshots;
- deployment evidence;
- security checks;
- documentation;
- acceptance artifacts.

Acceptance records governance state only. It does not trigger payment.

### Evidence bundle

Each proposal can receive multiple persistent evidence records with:

- evidence type;
- label;
- URI / commit / artifact reference;
- optional content hash;
- notes;
- timestamp.

### Independent review

CF-009's hard control remains active: the proposal submitter cannot accept their own proposal.

The Governance UI exposes accept, rework and reject decisions with mandatory rationale.

### PVS calculator

CF-010 operationalizes the CF-005 Phase Value Score formula:

`PVS = (2C + 3B + 2R + S + 2O + U) - 2D`

where:

- C = complexity;
- B = business value;
- R = risk;
- S = scarcity;
- O = ownership of outcome;
- U = urgency;
- D = reuse discount.

Each dimension is scored 1–5 in the first UI implementation.

The interface maps the resulting score into planning bands P0–P5.

PVS remains explicitly **not money, equity, residual rights, or a security**.

## Safety posture

CF-010 intentionally permits only governance writes.

Still disabled:

- direct product mutation;
- automatic Builder admission;
- automatic phase-status mutation from review;
- phase-payment execution;
- payroll;
- parent-equity issuance;
- residual settlement;
- securities transfer;
- money movement.

An accepted governance proposal is evidence that an authorized reviewer approved a proposal. It is not itself authority to move money or issue ownership.

## Files

Backend:

- `backend/src/companyFoundry/persistence.ts`
- `backend/src/routes/companyFoundry.ts`

Frontend:

- `frontend/src/api/companyFoundry.ts`
- `frontend/src/components/FoundryGovernanceWorkbench.tsx`
- `frontend/src/views/CompanyFoundryView.tsx`

## Acceptance gates not yet certified

The GitHub connector cannot execute LocalBrain's workstation runtime. Before CF-010 is certified, run locally:

1. backend typecheck;
2. backend build;
3. frontend typecheck;
4. frontend build;
5. start LocalBrain;
6. open `/foundry` → Governance;
7. create a Builder Application draft;
8. submit it;
9. attach evidence;
10. verify same submitter cannot review it;
11. review using a distinct reviewer ID;
12. restart LocalBrain;
13. verify proposal/evidence/review/audit history persists;
14. create a Master Build Plan proposal and confirm it persists;
15. verify `/api/foundry/write-capabilities` still reports all financial effects disabled.

## CF-010 result

**IMPLEMENTED / NOT YET CERTIFIED.**

The Foundry now has the beginning of a genuine human governance workflow rather than just portfolio dashboards and backend tables.

## Next slice — CF-011

**Controlled Effects + Builder Capability Ledger**

Recommended scope:

1. approved Builder Application → separately authorized Builder admission effect;
2. durable Builder profile and capability ledger;
3. cohort enrollment and 12-week progression state;
4. phase assignment;
5. PVS stored on Phase Value Records;
6. accepted phase evidence → capability/PVP update after independent authorization;
7. Master Build Plan proposal → approved durable plan record;
8. Capstone application → admission gate checklist, without residual activation;
9. role-based reviewer authority;
10. idempotent effect log so accepted proposals cannot execute twice;
11. keep payroll/equity/residual/money effects disabled.
