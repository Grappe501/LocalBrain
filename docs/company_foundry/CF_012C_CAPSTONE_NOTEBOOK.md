# CF-012C — Capstone Notebook

**Status:** IMPLEMENTED — workstation certification pending
**Date:** 2026-08-28
**Purpose:** Give every Academy learner a durable Capstone workspace from Day 1 that evolves alongside training into a complete Master Build Plan and Capstone application.

## Core rule

Every learner creates a Capstone Notebook during Academy enrollment. The notebook is not a final-week assignment. It grows throughout the curriculum.

## Section progression

The notebook contains 24 governed sections tied to Academy stages:

1. Problem Inventory
2. Top Problem Statements
3. Provisional Product + Technical Layers
4. Hosting, Security, Secrets + Data Map
5. Customer + Painful Job
6. Product Promise
7. V1 Scope + Non-Goals
8. User Journeys
9. Product Architecture
10. Foundry Reuse + Build/Buy/Integrate
11. Build Phases + Dependencies
12. Acceptance Criteria + Evidence
13. Market + Competitors
14. Advantages + Disadvantages
15. Pricing + Route to First Revenue
16. Conservative Revenue Model
17. Build Budget + Staffing
18. Risk Register
19. Kill Criteria
20. Pilot Funding + Recovery Model
21. Post-Recovery Residual Proposal
22. Master Build Plan
23. Capstone Application
24. Capstone Defense Notes

## Persistence and revision history

Every material section update is written to SQLite and creates a revision record containing prior content, new content, actor, note, and timestamp. This lets the Academy measure how the learner's thinking develops instead of preserving only the final polished answer.

## Stage checkpoints

Notebook sections are linked to Academy stages. A learner can mark a stage checkpoint ready only after all notebook sections assigned to that stage contain draft content.

An independent reviewer can then:

- accept the checkpoint, moving those sections to reviewed; or
- return it for rework.

The notebook owner cannot self-review a stage checkpoint.

## Graduation relationship

The Notebook supports the doctrine that every learner must design and submit a Capstone to graduate. Graduation does not require the product to be selected for Foundry funding.

A selected Capstone Pilot may later convert the notebook's Master Build Plan, budget, staffing, pilot funding/recovery model, and residual proposal into governed operating records.

## API

- `POST /api/foundry/academy/enrollments/:enrollmentId/capstone-notebook`
- `GET /api/foundry/academy/enrollments/:enrollmentId/capstone-notebook`
- `GET /api/foundry/capstone-notebooks/:notebookId`
- `PATCH /api/foundry/capstone-notebooks/:notebookId`
- `PUT /api/foundry/capstone-notebooks/:notebookId/sections/:sectionKey`
- `POST /api/foundry/capstone-notebooks/:notebookId/stages/:stageId/ready`
- `POST /api/foundry/capstone-notebooks/:notebookId/stages/:stageId/review`
- `GET /api/foundry/capstone-notebooks/:notebookId/revisions`

## Safety

CF-012C does not:

- select a Capstone Pilot;
- authorize a build budget;
- move money;
- issue equity;
- settle residuals;
- create ownership rights;
- allow self-review.

## Acceptance gates still pending

Local workstation must prove:

1. backend typecheck/build;
2. migration creation on clean DB;
3. notebook creation per enrollment;
4. exactly 24 seeded sections;
5. revision history survives restart;
6. empty sections block checkpoint-ready;
7. checkpoint rework returns sections to draft;
8. self-review is rejected;
9. reviewed checkpoint state survives restart.

## Next slice

**CF-012D — Production Lab**

Connect Academy learners to real Foundry Phase Value Records and production assignments, with level eligibility, phase packets, evidence submission, independent acceptance, rework, PVP credit, and project budget attribution.
