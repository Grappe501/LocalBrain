# CF-012L — Academy Operator Console + Cohort Launch Readiness
Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Purpose
Give Company Foundry the operating side of the self-guided Academy: cohort health, learner risk, remediation, consequential human-review workload, curriculum QA, Capstone pipeline, Production Lab activity, pilot budget exposure and explicit launch gates.

## Operator console
New route: `/foundry/academy/operator`.
New API: `GET /api/foundry/academy/operator-console`.

## Learner risk
Green: progressing without open remediation. Amber: one remediation item or very early progress. Red: two or more open remediation packets. This is an operational signal, not a disciplinary or graduation decision.

## Launch readiness
The initial deterministic readiness score checks structured curriculum coverage, minimum deep-authored coverage, rejected curriculum content, human-review queue capacity, cohort red-risk concentration, and continued financial lock. It is advisory and designed to expose blockers rather than manufacture a launch claim.

## Operating views
- enrollment/active/graduated counts
- learner progress, average assisted score and risk
- open remediation
- human review queue
- curriculum deep-authoring and QA feedback
- Capstone status pipeline
- Production Lab aggregation
- pilot authorization/budget exposure

## Boundaries
Operator analytics cannot graduate learners, approve production, select Capstones, authorize funding, settle residuals, issue equity, run payroll or move money. Human review remains authoritative where required. Pilot budget exposure is ledger state only.

## Certification
Run backend/frontend typecheck and build; smoke-test API and route with empty and populated DB; verify learner risk calculations; verify readiness gates; visually review desktop/mobile; confirm no operator endpoint mutates consequential or financial state.

## Next
CF-012M — Cohort Launch + Scheduling Engine: create cohorts, enrollment invitations, target start/end dates, weekly pacing, review-capacity planning, attendance/activity signals, nudges, launch checklist sign-off, Cohort 1 dry run, and operator launch/hold decision. No automatic learner dismissal or consequential approval.
