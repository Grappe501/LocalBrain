# CF-014 — Workstation Certification Harness + Evidence Import
Status: IMPLEMENTED / NOT YET EXECUTED ON WORKSTATION

## Purpose
Convert the CF-012N/CF-013 doctrine into machine evidence. CF-014 does not add Academy features. It runs the actual LocalBrain verification commands on the workstation, records their stdout/stderr, creates a durable evidence packet, and imports failures into the existing dry-run defect/repair pipeline.

## Command
From the LocalBrain repository root:

`npm run foundry:certify:workstation`

The runner executes root TypeScript typecheck, production build, backend test suite, and a compiled Academy smoke import. It writes:

`reports/CF_014_WORKSTATION_CERTIFICATION.json`

A failing check makes the command exit non-zero. A warning contributes half-credit. Output is bounded so the evidence file remains usable.

## Evidence import
With the LocalBrain backend running, submit the generated packet's `checks` array to:

`POST /api/foundry/academy/workstation-certifications`

The importer persists the workstation run and each check. It also creates a synthetic CF-012N dry-run record. FAIL checks become blocker defects; WARN checks become warning defects. The returned payload includes the dry-run ID and the CF-013 stabilization import endpoint, allowing workstation failures to enter the existing repair queue without a parallel defect system.

## APIs
- GET `/api/foundry/academy/workstation-certifications`
- POST `/api/foundry/academy/workstation-certifications`
- GET `/api/foundry/academy/workstation-certifications/:id`

## Persistence
- `foundry_workstation_certification_runs`
- `foundry_workstation_evidence`

The importer bridges into existing `foundry_academy_dry_runs`, `foundry_academy_defects`, and CF-013 repair items rather than duplicating repair governance.

## Doctrine
A GitHub commit is implementation evidence, not workstation certification. A workstation PASS requires commands to actually execute successfully. Failed typecheck/build/test/smoke checks are launch blockers until repaired and re-proven. CF-014 cannot approve production, graduation, Capstones, funding, payroll, equity, residual settlement, or money movement.

## First execution sequence
1. Pull latest `master` onto the LocalBrain workstation.
2. Run `npm install` if dependencies changed or are missing.
3. Run `npm run foundry:certify:workstation`.
4. Inspect `reports/CF_014_WORKSTATION_CERTIFICATION.json`.
5. Start LocalBrain if it is not running.
6. Import the evidence through the workstation-certification API.
7. Import the returned dry-run ID into CF-013 stabilization.
8. Repair P0/P1 failures.
9. Re-run CF-014 until machine evidence passes.
10. Re-run CF-012N launch certification after stabilization.

## Next slice
CF-015 is intentionally undefined until the first CF-014 workstation run exists. It must be generated from the highest-priority real failure, or, if CF-014 passes cleanly, from the remaining human/browser/mobile/provider certification evidence rather than speculative feature work.
