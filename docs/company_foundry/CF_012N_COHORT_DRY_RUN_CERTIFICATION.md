# CF-012N — Cohort 1 Dry Run + Launch Certification
Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Purpose
Stop adding features long enough to test whether the Academy machine is coherent. CF-012N adds a persistent structural dry-run, defect ledger, certification packet and explicit human LAUNCH / NO-LAUNCH decision.

## Dry-run coverage
The harness checks persistence tables across learner progress, Capstone Notebook, Production Lab, Master Plan Builder, Capstone application/defense, pilot funding, cohort launch and assessment. It verifies curriculum module resolution, eight-stage progression, curriculum QA state, operator console resolution, cohort launch controls, Capstone/graduation decision separation, FAB/revenue-recovery ledger presence, and continued financial locks.

It deliberately records workstation/runtime proof as a warning because GitHub implementation cannot prove the local TypeScript build, SQLite migration on the real workstation, browser rendering, AI-provider connectivity or restart persistence.

## Status model
PASS = check satisfied.
WARN = non-blocking evidence still required.
FAIL = blocking defect.
A score is generated for triage, but the defect ledger and human decision govern launch.

## Defect ledger
Every failed or warning check becomes a persistent defect record with area, severity, detail, status, owner and resolution timestamp. Blockers must be resolved before a LAUNCH certification can be recorded.

## Certification
A human operator may certify LAUNCH or NO-LAUNCH against a specific dry-run packet. LAUNCH is rejected while blocking defects remain open. Certification itself does not activate a cohort; CF-012M still requires the separate cohort launch decision and checklist.

## UI/API
Route: `/foundry/academy/certification`.
API: GET/POST `/api/foundry/academy/dry-runs`; GET `/api/foundry/academy/dry-runs/:id`; POST `/api/foundry/academy/dry-runs/:id/certify`; POST `/api/foundry/academy/defects/:id/resolve`.

## Persistence
- foundry_academy_dry_runs
- foundry_academy_defects
- foundry_academy_launch_certifications

## Safety
No automatic launch, graduation, Capstone approval, production acceptance, funding authorization, payroll, equity issuance, residual settlement or money movement.

## Workstation certification gates
1. backend typecheck/build;
2. frontend typecheck/build;
3. clean and existing SQLite migrations;
4. start backend and render `/foundry/academy`, `/operator`, `/cohorts`, `/certification`;
5. configured-provider and no-provider tutor tests;
6. learner enrollment → lesson → evidence → remediation → stage-gate test;
7. Production Lab assignment → evidence → independent acceptance → exact-once PVP;
8. Capstone Notebook → Master Plan → red-team → application → defense → graduation/pilot decision;
9. pilot authorization → FAB → 50% recovery → zero-balance transition → residual eligibility;
10. cohort launch blockers and reviewer capacity;
11. restart and verify durable state;
12. mobile/iPad visual review;
13. rerun CF-012N and resolve every blocker;
14. human LAUNCH / NO-LAUNCH certification.

## Next
CF-013 should be defect-driven rather than feature-driven. Do not open a new major Academy feature lane until the first workstation dry-run has produced its defect ledger and the highest-severity defects have been repaired.
