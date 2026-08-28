# CF-012E — Master Plan Builder

**Status:** IMPLEMENTED — workstation certification pending
**Date:** 2026-08-28
**Parent:** CF-012C Capstone Notebook + CF-012D Production Lab

## Purpose

Convert a learner's evolving Capstone Notebook into a structured, executable Master Build Plan that another competent team could build without relying on the inventor's unstated assumptions.

## Implemented capabilities

### Notebook-to-plan assembly
The builder engine snapshots required Capstone Notebook sections into a durable Master Plan Build. It tracks section completeness and notebook revision counts so the plan retains provenance back to the learner's development process.

### Phase engineering
Master Plan phases include:
- stable phase key;
- title;
- sequence;
- dependencies;
- acceptance criteria;
- PVS;
- budget;
- staffing model.

### Dependency validation
The engine verifies that named phase dependencies exist inside the plan and produces a dependency score. Invalid references block red-team readiness.

### Budget rollup
Phase budgets roll into the Master Plan total automatically. A zero-dollar plan is explicitly blocked from red-team readiness because it has not yet modeled required resources.

### Completeness scoring
The engine requires populated product, customer, V1, architecture, reuse, phase, acceptance, market, competition, pricing, revenue, budget, risk, kill-criteria, pilot-economics, residual, and Master Plan sections.

### Red-team gate
A plan cannot be red-teamed until:
- required sections are populated;
- at least one build phase exists;
- dependencies are valid;
- a positive build budget exists.

The red-team record captures reviewer, score, findings, decision, and rationale.

### Export
The plan can be exported as a structured snapshot containing the assembled sections, phases, blockers, scoring, budget, and readiness state. Export explicitly records `financialExecutionEnabled: false`.

## Persistence

CF-012E adds:
- `foundry_master_plan_builds`
- `foundry_master_plan_sections`
- `foundry_master_plan_phases`
- `foundry_master_plan_red_team`

The migrations run during LocalBrain bootstrap.

## API

Dedicated routes are mounted under `/api/foundry/master-plan-builder`:
- ensure plan from notebook;
- fetch by notebook/build ID;
- reassemble from notebook revisions;
- create/update phases;
- run red-team review;
- export structured plan.

## Safety boundary

CF-012E does **not**:
- admit a Capstone pilot;
- authorize Foundry funding;
- create a Foundry Advance Balance;
- issue equity;
- execute payroll;
- settle residuals;
- move money.

It creates the technical/commercial plan that later governance can evaluate.

## Acceptance gates still required

Workstation certification must prove:
1. backend typecheck/build;
2. frontend typecheck/build;
3. SQLite migrations;
4. notebook assembly persists across restart;
5. completeness score changes correctly with section content;
6. invalid phase dependencies block readiness;
7. phase budgets roll up exactly;
8. red-team cannot run before all blockers clear;
9. export contains no financial execution capability.

## Next slice

**CF-012F — Capstone Application + Defense**

Build the governed final application package, automated red-team/market critique, human defense panel, graduation decision, pilot selection decision, and phase-track placement for graduates whose Capstones are not selected for implementation.
