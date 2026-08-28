# CF-013 — Defect-Driven Stabilization
Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Purpose
Freeze feature expansion after CF-012N and convert certification findings into an evidence-backed repair queue. CF-013 exists to make the Academy safer and more launchable, not larger.

## Repair priority
- P0 — blocking defect; no launch.
- P1 — governance, finance, persistence, or certification defect; hold for repair.
- P2 — curriculum, operations, cohort, Capstone, or economics defect.
- P3 — lower-risk polish or usability defect.

## Flow
Dry Run defect → import to repair queue → assign owner → in progress → verification → close with evidence → defect marked resolved → stabilization assessment → re-run certification.

Import is idempotent by defect ID.

## Closure doctrine
No repair item can close without evidence. A blocker additionally requires closure evidence containing explicit PASS proof. Repair closure writes an event history and resolves the source dry-run defect.

## Stabilization rules
P0 open => `NO_LAUNCH`.
P1 open => `HOLD_FOR_REPAIR`.
Only P2/P3 open => `CONDITIONAL`.
No open repairs => `READY_FOR_CERTIFICATION`.

These are advisory readiness states; they do not launch a cohort.

## Feature freeze
During CF-013, new Academy feature work should be justified by a defect, certification gap, or launch-critical requirement. Feature ideas that do not repair launch readiness remain deferred.

## Persistence
- foundry_academy_repair_items
- foundry_academy_repair_events
- foundry_academy_stabilization_runs

## API
- GET `/api/foundry/academy/stabilization`
- GET `/api/foundry/academy/repairs`
- GET `/api/foundry/academy/repairs/:id`
- POST `/api/foundry/academy/dry-runs/:id/import-repairs`
- PATCH `/api/foundry/academy/repairs/:id`
- POST `/api/foundry/academy/stabilization/runs`

## UI
New operator route: `/foundry/academy/stabilization`.
It shows launch rule, P0/P1/P2/P3 queue counts, repair ownership/state, dry-run import, evidence-backed closure, and latest stabilization assessment.

## Boundaries
CF-013 cannot approve production, graduate learners, launch a cohort, authorize pilot funding, issue equity, execute payroll, settle residuals, or move money.

## Certification gates
Run backend/frontend typecheck and build; migrate clean/existing SQLite; run a 12N dry run; import defects; verify idempotent import; verify P0/P1 priority assignment; verify blocker cannot close without PASS evidence; verify repair event history; re-run stabilization assessment; restart and prove persistence; then re-run 12N certification.

## Next
CF-014 must be selected from the real CF-013 defect queue. If there is no workstation defect evidence yet, the correct next action is workstation certification—not another speculative feature slice.
