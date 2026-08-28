# CF-012M — Cohort Launch + Scheduling Engine
Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Purpose
Move the Academy from a self-guided learning system into an operable 12-week cohort program with explicit planning, pacing, review-capacity protection, launch gates, nudges and operator LAUNCH/HOLD control.

## Cohort lifecycle
Plan cohort → set start/end dates → define capacity → seed 12-week pacing → create invitations → enroll builders → monitor activity/remediation → queue nudges → clear launch checklist → explicit operator LAUNCH or HOLD.

## 12-week pacing
A cohort launch plan establishes an 84-day operating window and maps the Academy stages into weekly targets. Later-stage production/Master Plan work carries higher review-slot assumptions than introductory stages.

## Review-capacity planning
Each week records expected independent-review demand. The launch dashboard compares required review slots with operator-configured weekly reviewer capacity across the 12-week run. A cohort cannot LAUNCH through this engine unless reviewer capacity and all required launch checks pass.

## Launch checklist
Initial required checks: curriculum ready; reviewer capacity assigned; training product ready; employment/IP agreements reviewed; payroll process ready; AI provider configured; dry run passed. Each check requires an operator sign-off and may be BLOCKED.

The checklist records readiness only. It does not itself configure payroll, legal agreements, AI credentials or production infrastructure.

## Invitations
Invitation records and unique invite codes are persisted. Delivery is intentionally not automated in this slice; email/SMS integration remains a later communications feature.

## Nudges
The engine can queue non-consequential reminders for active learners who have been inactive for several days or are in remediation. Nudges do not dismiss, penalize, pass or fail a learner.

## Launch control
`LAUNCH` requires every checklist item to be passed and reviewer capacity to be adequate. `HOLD` can be selected at any time with rationale. Launch changes cohort operating status only; it does not approve learner work, create employment status, authorize payments or move money.

## Persistence
- foundry_cohort_launch_plans
- foundry_cohort_invitations
- foundry_cohort_week_plan
- foundry_cohort_activity
- foundry_cohort_nudges
- foundry_cohort_launch_checks

## UI + API
Learner/operator launch room: `/foundry/academy/cohorts`.
APIs under `/api/foundry/academy/cohort-launch` support list/create/detail, invitations, checklist decisions, nudge queueing and explicit launch/hold decisions.

## Safety boundaries
No automatic learner dismissal. No automatic stage/production/Capstone approval. No automatic launch. No email delivery. No payroll execution, equity issuance, residual settlement or money movement.

## Certification gates
Run backend/frontend typecheck and build; migrate clean/existing SQLite databases; create a cohort and verify 12-week schedule; test invite persistence; test reviewer-capacity blocker; prove incomplete checklist rejects LAUNCH; test HOLD; queue inactivity/remediation nudges; restart and confirm persistence; mobile/desktop visual review.

## Next
CF-012N — Cohort 1 Dry Run + Launch Certification: seed a non-production mock cohort, execute every learner/operator path end-to-end, validate curriculum/navigation/evidence/remediation/review/Capstone/phase/economic handoffs, build defect ledger, and produce a launch/no-launch certification packet. No real trainees or financial execution until operator approval.
