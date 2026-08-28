# CF-012H — Academy Experience + Autonomous Coach
Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Goal
Turn the CF-012 backend machine into a learner experience that can run a cohort without a traditional instructor. The interface must always answer: What do I do next? Why? How do I prove it? How does it connect to my Capstone?

## Experience orchestrator
`autonomousCoach.ts` combines learner progress, current stage/module, remediation/gate state, Capstone state, and Production Lab assignments into one Today payload. Priority: remediation → ready gate → graduation/Capstone → current lesson.

## Lesson pattern
Why this matters → plain-English concept → watch/read → guided example → do it yourself → prove it → reflect → connect to Capstone.

## Coach doctrine
Explain before assuming knowledge; one unmistakable next action; teach reasons rather than clicks; inspect first; bounded changes; validation evidence over AI claims; independent review for production acceptance and major gates.

## Terminology
Initial contextual glossary includes repository, commit, branch, deploy, API, database, frontend, backend, prompt, diff, phase, PVS, Capstone, and FAB.

## Learner UI
New `/foundry/academy` route provides a learner build room with Academy progress, next action, current lesson, AI Coach prompts, Capstone status, and Production Lab status. Enrollment ID is retained locally for the workstation experience.

## AI boundary
This slice builds the deterministic coach/orchestration contract and prompt surfaces. It does not yet call a model autonomously, grade production work, approve gates, or replace independent reviewers. A later slice can connect LocalBrain's provider layer with grounded curriculum/notebook context.

## Certification gates
Backend/frontend typecheck and build; route smoke test; learner experience payload for active/remediation/gate/graduation-ready states; glossary and lesson endpoints; mobile visual review; restart persistence through existing Academy state.

## Next
CF-012I — Grounded AI Tutor + Lesson Content Factory: curriculum lesson bodies, exercises, rubrics, contextual retrieval from Academy doctrine, learner-safe AI tutoring through configured providers, evidence-aware feedback, and operator curriculum analytics. No autonomous production acceptance.
