# CF-012J — Academy Content Depth + Assessment Engine
Status: IMPLEMENTED / NOT WORKSTATION-CERTIFIED

## Purpose
Deepen the Academy from lesson scaffolds into a teachable, evidence-driven learning system with rubric assistance, remediation packets, learner evidence submission, and operator analytics.

## Content model
All canonical modules continue to generate lesson experiences. Each lesson carries: why it matters; core concepts; guided example; exercise; evidence expectations; reflection; Capstone connection; rubric. This remains structured authored scaffolding, not a claim that every lesson has final video/screenshots/long-form editorial production.

## Evidence submission
Learners can submit a plain-English explanation, evidence items, validation results, and reflection for the current module. Submissions are versioned by module/enrollment rather than overwritten.

## Rubric assistance
The engine scores four dimensions: understanding 25%; bounded execution 25%; evidence 30%; explanation/judgment 20%. The current implementation is deterministic coaching assistance using evidence-presence and explanation signals. It is not authoritative acceptance.

Production, assessment, and Capstone lesson types always remain human-review-required. No assessment score can pass a stage gate, accept production, graduate a learner, select/fund a Capstone, issue equity, run payroll, settle residuals, or move money.

## Remediation
Scores below the ready-for-review threshold create a durable remediation packet identifying weak rubric dimensions and concrete resubmission steps. The learner can revise and submit another evidence package without destroying prior history.

## Persistence
- foundry_academy_evidence_submissions
- foundry_academy_assessments
- foundry_academy_remediation_packets

## APIs
POST `/api/foundry/academy/enrollments/:enrollmentId/modules/:moduleId/evidence`
POST `/api/foundry/academy/submissions/:submissionId/assess`
GET `/api/foundry/academy/enrollments/:enrollmentId/assessment-history`
GET `/api/foundry/academy/curriculum-coverage`
GET `/api/foundry/academy/analytics`

## Learner UI
`/foundry/academy` now contains a Prove Your Work surface beside the lesson and grounded tutor. Learners submit explanation/evidence/validation/reflection and receive a rubric-based coaching result plus explicit notice when human review remains required.

## Operator analytics
Coverage reports expose total modules/stages, structured coverage, an editorial-depth proxy, rubric/evidence coverage per module. Cohort analytics expose enrollments, assessment count, average assisted score, and open remediation count.

## Certification gates
Backend/frontend typecheck and build; clean/existing SQLite migration; multiple evidence submissions; assessment idempotence; remediation creation; analytics correctness; mobile/desktop visual review; verify assessment cannot mutate learner completion or consequential governance state.

## Next
CF-012K — Deep Curriculum Authoring + Academy QA: replace generic stage-derived bodies with module-specific beginner lessons and worked examples, build answer exemplars and repository lab packs, curriculum editorial-status workflow, accessibility/readability QA, cohort testing instrumentation, and operator content approval/versioning.
