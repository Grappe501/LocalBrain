# CF-012B — Learner Progress Engine

**Status:** IMPLEMENTED — workstation certification required
**Date:** 2026-08-28
**Parent:** CF-012 Self-Guided Builder Academy

## Purpose

Turn the Builder Academy curriculum into durable learner state that can run without a daily live instructor.

CF-012B does not yet deliver lesson content, the Capstone Notebook, Production Lab assignment engine, Master Plan Builder, or Pilot Funding ledger. It provides the state machine those later surfaces depend on.

## What is now durable

Each admitted learner can receive one Academy enrollment with:

- builder ID;
- optional cohort ID;
- active/remediation/graduation status;
- current stage;
- current module;
- start/completion timestamps.

Every curriculum module receives a durable progress record containing:

- locked / available / in-progress / complete / remediation state;
- attempt count;
- best score;
- submitted evidence;
- feedback;
- completion timestamps.

Every attempt is retained separately so failed attempts are not overwritten by later success.

Every stage receives a gate record with:

- not-ready / ready / passed / remediation state;
- evaluator type;
- evaluator ID;
- rationale;
- pass timestamp.

## Progression rules

1. Enrollment seeds all Academy modules.
2. Only the first module begins available.
3. Modules advance in curriculum order.
4. Completing the final module in a stage marks that stage gate **ready**.
5. The next stage remains locked until its previous stage gate is passed.
6. Failed module attempts place that module and enrollment into remediation.
7. Remediation can be retried without creating a new enrollment.
8. Failed stage gates place the learner into remediation.
9. A passed stage gate allows progression into the next stage.
10. Graduation readiness requires all curriculum modules completed and all stage gates passed.

## Instructorless versus human-governed

The Academy is designed to teach without a daily instructor, but not to remove human accountability from consequential gates.

Self-guided/system functions include:

- curriculum sequencing;
- module locking/unlocking;
- attempt storage;
- completion metrics;
- remediation state;
- dashboard state;
- detection that a stage is ready for gate review.

Human-governed functions currently include stage-gate decisions. Later slices may allow automated low-risk knowledge checks, but production acceptance, Capstone defense, and other consequential decisions remain independently governed.

## API surface

### Enrollment

- `GET /api/foundry/academy/enrollments`
- `POST /api/foundry/academy/enrollments`
- `GET /api/foundry/academy/enrollments/:enrollmentId`
- `GET /api/foundry/academy/enrollments/:enrollmentId/dashboard`

### Module progression

- `POST /api/foundry/academy/enrollments/:enrollmentId/modules/:moduleId/start`
- `POST /api/foundry/academy/enrollments/:enrollmentId/modules/:moduleId/attempt`

### Stage gates

- `POST /api/foundry/academy/enrollments/:enrollmentId/stages/:stageId/gate`

## Learner dashboard payload

The dashboard returns:

- enrollment;
- current stage;
- current module;
- complete module-progress ledger;
- complete gate ledger;
- modules completed / total;
- percent complete;
- remediation count;
- stages passed / total;
- Capstone-required flag;
- graduation-ready flag.

## Safety/economic posture

CF-012B does not enable:

- payroll;
- wage calculation;
- equity issuance;
- residual settlement;
- money movement;
- Capstone pilot funding;
- Foundry Advance Balance recovery.

Academy progression is an educational/capability record only.

## Certification gates

Before CF-012B is certified on the workstation:

1. backend typecheck passes;
2. backend tests/build pass;
3. frontend typecheck/build pass;
4. migration creates Academy tables in a fresh database;
5. enrolling a test builder creates exactly one enrollment and all curriculum progress rows;
6. first module is available and later modules are locked;
7. failed attempt enters remediation and can be retried;
8. passing a module advances correctly;
9. final module of a stage marks its gate ready;
10. next-stage module remains locked until the stage gate is passed;
11. failed gate enters remediation;
12. passed gate unlocks the next stage;
13. restart preserves enrollment, attempts, evidence, feedback and gates;
14. all modules + all gates are required for graduation_ready.

## Next slice

**CF-012C — Capstone Notebook**

Build the persistent product-idea workspace that begins at enrollment and evolves through every Academy stage:

- problem inventory;
- top-three problems;
- provisional product idea;
- user/customer;
- solution thesis;
- V1/non-goals;
- technical layers;
- data/security/integration map;
- competitor research;
- Foundry reuse map;
- phase decomposition;
- budget;
- market/revenue model;
- risk/kill criteria;
- Master Build Plan sections;
- revision history;
- evidence links;
- readiness score for final Capstone application.
