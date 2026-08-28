# CF-012F — Capstone Application + Defense

Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Purpose
Make the Capstone mandatory graduation proof while keeping graduation and venture funding as separate decisions.

## Flow
Master Plan red-team pass → Capstone application → independent four-axis red team → defense → graduation decision → separate pilot-selection decision.

## Four-axis red team
- market
- technical
- economic
- execution

The applicant cannot red-team or decide their own application.

## Outcomes
Graduation: graduate / remediation / not_graduated.
Pilot: selected / phase_track / hold.
A pilot cannot be selected unless the learner graduates.

A graduate whose pilot is not selected can enter the normal Foundry phase-production track. Pilot selection is not ownership and does not itself authorize funding.

## Persistence
- foundry_capstone_applications
- foundry_capstone_red_team
- foundry_capstone_defenses
- foundry_capstone_decisions

## Financial locks
CF-012F does not create a Foundry Advance Balance, authorize a build budget, run payroll, issue equity, settle residuals, or move money. Those remain later governed effects.

## Certification gates
Run backend typecheck/build; migrate a clean and existing SQLite DB; complete application → red team → defense → decision; prove self-review/self-decision rejection; prove pilot_requires_graduation; restart and verify persistence.

## Next slice
CF-012G — Pilot Funding + Recovery Ledger: selected-pilot authorization, approved budget, Foundry Advance Balance, project cost attribution, 50% eligible-revenue recovery ledger, recovery-complete transition, and post-recovery residual formula preparation. Financial execution remains gated until legal/accounting/operator approval.
