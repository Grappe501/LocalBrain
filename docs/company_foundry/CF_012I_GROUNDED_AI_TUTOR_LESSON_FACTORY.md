# CF-012I — Grounded AI Tutor + Lesson Content Factory
Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Purpose
Convert the 55-module Academy curriculum registry into teachable lesson experiences and connect configured LocalBrain AI providers as a learner-safe contextual tutor.

## Lesson factory
Every registered module now produces a structured lesson with: why it matters; concepts; guided example; exercise; required evidence; reflection; Capstone connection; weighted rubric. The common pedagogy is inspect → plan → build → validate → report, with stage-specific practice.

## Grounded tutor
The tutor receives only the current generated lesson plus the learner's Academy/Capstone/Production context. It routes through the first enabled configured LocalBrain provider. If no provider is configured, the API returns a deterministic lesson/next-action fallback rather than pretending AI is available.

## Tutor boundaries
Advisory only. It cannot claim tests/actions occurred without context evidence and cannot approve production, stage gates, Capstones, graduation, funding, equity, payroll, residuals, or money movement. Independent review remains required.

## API
GET `/api/foundry/academy/lessons`
GET `/api/foundry/academy/lessons/:moduleId/experience`
POST `/api/foundry/academy/enrollments/:id/tutor`

## Learner experience
`/foundry/academy` now renders the current lesson body, exercise, proof requirement and Capstone connection beside an interactive grounded tutor. Suggested questions can be sent directly to the tutor.

## Important content note
This slice creates complete structured lesson scaffolds for all modules from the canonical curriculum objectives. Deep editorial lesson bodies, videos, screenshots, curated readings, repository-specific labs and human-reviewed answer exemplars remain a content-production program rather than being falsely labeled complete.

## Certification
Run backend/frontend typecheck and build; verify all curriculum modules generate lessons; test configured-provider and no-provider tutor paths; test grounding boundaries; visually review desktop/mobile Academy; verify no tutor path can mutate acceptance/graduation/financial state.

## Next
CF-012J — Academy Content Depth + Assessment Engine: authored beginner lesson bodies, progressive labs, answer exemplars, deterministic rubric scoring assistance, evidence submission UX, remediation packets, cohort/operator analytics, and curriculum quality coverage dashboard. Human review remains authoritative for production and consequential gates.
