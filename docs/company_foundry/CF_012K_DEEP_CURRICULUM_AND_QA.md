# CF-012K — Deep Curriculum Authoring + Academy QA
Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Purpose
Move the Academy from generated lesson scaffolds toward a serious beginner curriculum with module-specific teaching, worked examples, answer exemplars, safe repository lab packs, content versioning/review signals, accessibility/readability checks, and cohort feedback instrumentation.

## Deep curriculum
Every module now resolves to a versioned DeepLesson with lesson body, worked example, strong-answer exemplar, lab objective/steps/evidence, safe boundaries and QA metadata. Eight strategically important modules have first-pass hand-authored bodies spanning vibe coding, prompt anatomy, diff review, Netlify, V1 scope, acceptance criteria, Master Plans and Capstone defense. Remaining modules retain explicit draft status and structured generic bodies rather than being misrepresented as fully authored.

## QA
Curriculum QA tracks module status/version, plain-language target, accessibility checklist, terminology definition, mobile friendliness, content reviews, and learner test events: helpful, confusing, too easy, too hard, completion minutes and accessibility issue.

## API
GET `/api/foundry/academy/deep-lessons/:moduleId`
GET `/api/foundry/academy/curriculum-quality`
POST `/api/foundry/academy/curriculum-reviews`
POST `/api/foundry/academy/curriculum-tests`

## Learner experience
`/foundry/academy` now surfaces deep lesson paragraphs, worked example, answer exemplar, lab steps, safety boundaries, content version/status and direct helpful/confusing/too-hard feedback controls.

## Boundaries
Curriculum content review is separate from learner assessment and production acceptance. Nothing here can pass Academy gates, accept production, graduate a learner, select/fund a Capstone, issue equity, run payroll, settle residuals or move money.

## Certification
Run backend/frontend typecheck/build; migrate existing/clean DB; verify every module returns a DeepLesson; verify authored vs draft coverage; review learner feedback persistence; mobile/accessibility visual QA; ensure content-review endpoints cannot alter learner/financial state.

## Next
CF-012L — Academy Operator Console + Cohort Launch Readiness: cohort creation, learner roster, curriculum QA heatmap, remediation queue, human review workload, Capstone health, Production Lab readiness, pilot economics visibility, launch checklist and first-cohort simulation.
