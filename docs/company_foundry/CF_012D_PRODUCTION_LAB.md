# CF-012D — Production Lab

**Status:** IMPLEMENTED — workstation certification pending
**Date:** 2026-08-28
**Parent:** CF-012 Self-Guided Builder Academy

## Purpose

Connect Academy learning to real Company Foundry production without turning training exercises into fake work. Builders receive bounded phases from actual Foundry Master Build Plans, execute them through the same inspect/plan/build/verify/report method taught in the Academy, submit evidence, receive independent review, and earn capability credit only after acceptance.

## Production loop

`eligible phase → assignment → start → implementation → evidence submission → independent review → accepted | rework | rejected`

Rework remains the same assignment. It does not create a new paid phase merely because the first submission was inadequate.

## Level eligibility

Default phase leadership limits:

- **L0 Apprentice:** P0 only
- **L1 Guided Builder:** P0–P1
- **L2 Independent Builder:** P0–P2
- **L3 Venture Builder:** P0–P4
- **L4 Product Lead:** P0–P5
- **L5 Foundry Architect:** P0–P5

High-risk phases may later add security/compliance specialist gates even when a builder's level otherwise permits the band.

## Production packet

Every assignment snapshots the phase contract at assignment time:

- product and Master Plan;
- phase ID/title/class;
- acceptance criteria;
- evidence required;
- PVS;
- builder contribution share;
- planned project-budget attribution;
- compensation note if applicable;
- standard Foundry execution instructions.

The packet tells the builder to inspect first, stay within scope, use AI aggressively but verify the result, run repository validation, and submit evidence plus known limitations.

## Evidence submission

A submission requires:

- implementation summary;
- evidence bundle;
- validation bundle;
- known limitations where applicable.

Empty evidence or validation cannot be submitted as a completed production phase.

## Independent acceptance

The assigned builder cannot review their own submission. `self_acceptance_forbidden` is enforced by the backend.

Review decisions:

- `accepted`
- `rework`
- `rejected`

An acceptance records reviewer rationale and a quality multiplier bounded to the governed range of 0.75–1.25.

## PVP

Accepted Production Lab work awards capability credit using the CF-005 model:

`PVP = PVS × contribution share × quality multiplier`

PVP is not wages, equity, ownership, or product residual participation.

Acceptance writes a capability event and updates the builder's accumulated PVP and accepted-phase count.

## Project budget attribution

CF-012D records planned budget attribution by:

- product;
- Master Plan;
- phase;
- assignment;
- builder;
- attributed USD amount.

This lets the Foundry later measure what each product and cohort actually consumes.

**Financial execution is explicitly disabled.** Budget attribution is accounting/planning metadata only. It does not initiate payroll, contractor payment, equity, residual settlement, reimbursement, or money movement.

## Persistence

New SQLite tables:

- `foundry_production_assignments`
- `foundry_production_submissions`
- `foundry_production_reviews`
- `foundry_project_budget_attribution`

They are migrated during normal LocalBrain bootstrap.

## API

Read:

- `GET /api/foundry/production-lab/metrics`
- `GET /api/foundry/production-lab/assignments`
- `GET /api/foundry/production-lab/assignments/:assignmentId`
- `GET /api/foundry/production-lab/eligible/:builderId`

Controlled writes:

- `POST /api/foundry/production-lab/assignments`
- `POST /api/foundry/production-lab/assignments/:assignmentId/start`
- `POST /api/foundry/production-lab/assignments/:assignmentId/submit`
- `POST /api/foundry/production-lab/assignments/:assignmentId/review`

## Foundry safety posture after CF-012D

Enabled:

- production assignment;
- level eligibility enforcement;
- production evidence submission;
- independent review;
- rework workflow;
- PVP/capability credit after acceptance;
- planned project-budget attribution.

Disabled:

- automatic phase payment;
- payroll;
- contractor payment;
- equity issuance;
- Capstone residual settlement;
- reimbursement;
- money movement.

## Certification gates

CF-012D is implemented but not workstation-certified until the LocalBrain machine proves:

1. backend typecheck/build;
2. frontend typecheck/build;
3. migrations on a clean/reused SQLite DB;
4. L0 cannot receive P1+ work;
5. authorized level receives an eligible phase;
6. assignment packet contains correct criteria/evidence;
7. assigned builder can start and submit;
8. empty evidence/validation is rejected;
9. submitter cannot self-accept;
10. rework returns the same assignment to rework state;
11. independent acceptance awards PVP exactly once;
12. builder ledger increments exactly once;
13. budget attribution persists across restart;
14. no financial execution occurs.

## Next slice

**CF-012E — Master Plan Builder**

Turn the Capstone Notebook into a guided, structured Master Build Plan constructor that assembles validated notebook sections into an executable plan, checks completeness and contradictions, estimates phase/PVS/budget structure, and prepares the final Capstone application without letting AI silently invent missing assumptions.
