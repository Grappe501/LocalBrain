# CF-012G — Pilot Funding + Recovery Ledger
Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Doctrine
Only a graduated learner whose Capstone decision is `selected` can enter pilot funding. Pilot selection itself does not authorize money. A separate non-self funding authorization creates the approved pilot budget and Foundry Advance Balance (FAB).

## Ledger model
Authorization establishes FAB. Approved additional project costs increase FAB. Revenue periods use defined Eligible Recovery Revenue (ERR). While FAB > 0, 50% of ERR is allocated to recovery, capped at the remaining FAB; the rest is recorded as operating amount. When FAB reaches zero, authorization status becomes recovered.

This is an accounting/model ledger only. It does not charge customers, transfer cash, run payroll, reimburse builders, or settle residuals.

## Residual formula
A prepared post-recovery formula must total 100%, retain at least 25% for Company Foundry, cap the Capstone lead at 51%, and leave the remainder for the team. A formula is eligible only after FAB = 0. Eligibility still does not execute payment.

## Tables
foundry_pilot_funding_authorizations; foundry_advance_ledger; foundry_revenue_recovery_ledger; foundry_residual_formulas.

## Safety
Self funding authorization forbidden. Duplicate authorization forbidden. Revenue period keys are idempotent. Financial execution, payroll, equity issuance, residual settlement, and money movement remain false.

## Certification
Typecheck/build; clean/existing DB migration; selected-graduate gate; self-authorization rejection; cost attribution; duplicate-period rejection; exact 50% recovery with final-period cap; FAB zero transition; residual 100%/25%/51% constraints; restart persistence.

## Next
CF-012H — Academy Experience + Autonomous Coach: learner-facing dashboard, lesson delivery, contextual AI coach, terminology help, progress/capstone/production/master-plan surfaces, notifications and self-guided next-action orchestration.
