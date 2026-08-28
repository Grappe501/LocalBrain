# CF-005 — Builder Academy + Phase Value System

**Status:** COMPLETE — operating blueprint; legal/employment/payroll review required before cohort launch
**Date:** 2026-08-28
**Parent:** CF-004 Founder Capitalization + Economic Engine

## 1. Purpose

Turn the Foundry's development method into a finite, teachable, auditable production system that can take a motivated nontraditional builder from beginner to independently accountable venture builder while producing real company assets.

The Builder Academy is not a generic coding bootcamp. It is a paid apprenticeship and production system built around accepted company work, disciplined AI-assisted development, master build plans, review gates, and measurable capability.

## 2. Academy thesis

The company does not primarily train people to memorize syntax. It trains people to:

- understand a business problem;
- translate it into an executable master build plan;
- work safely inside a real codebase;
- use AI tools effectively without surrendering judgment;
- verify work rather than trusting generated output;
- ship production-grade increments;
- document decisions and handoffs;
- work as part of a team;
- estimate and own outcomes;
- build products that can make money.

The Academy measures **accepted production capability**, not classroom attendance.

## 3. Finite apprenticeship architecture

The initial apprenticeship is deliberately finite. The default operating model is a maximum **12-week core program**, followed by graduation, extension-by-exception, or exit.

This is a product/operating assumption, not a legal classification decision. Actual schedules, employment status, overtime, benefits, and wage rules require counsel/payroll review.

### Week 0 — Admission + orientation

Goals:
- culture and team expectations;
- confidentiality/IP/security obligations;
- Git/GitHub basics;
- LocalBrain / Foundry navigation;
- how master plans work;
- acceptance versus completion;
- AI-use policy;
- safe handling of secrets and customer data.

Required outputs:
- environment setup proof;
- successful branch/commit/pull workflow;
- small documentation correction or safe starter task;
- security/provenance acknowledgement.

### Weeks 1–2 — Method foundations

Learn:
- repo reconnaissance;
- reading before writing;
- product context and user stories;
- issue decomposition;
- build phases and gates;
- prompt specification;
- AI-generated code review;
- tests/build/typecheck/lint where applicable;
- error diagnosis;
- rollback thinking;
- documentation discipline.

Required outputs:
- guided low-risk phases;
- written implementation notes;
- validation evidence;
- no unsupervised production access.

### Weeks 3–4 — Guided production

Builder works on real projects with review before merge.

Required capabilities:
- modify existing components safely;
- add small features;
- update tests;
- trace data flow;
- use logs/errors productively;
- explain the code they submit;
- produce a clean handoff.

### Weeks 5–6 — Independent phases

Builder receives bounded phases with clear acceptance criteria and is responsible for execution strategy.

Required capabilities:
- plan implementation;
- identify dependencies/risks;
- keep scope controlled;
- use AI as a tool rather than authority;
- validate before submission;
- respond to review/rework.

### Weeks 7–8 — Cross-functional production

Builder works across more than one layer or collaborates with other builders.

Examples:
- frontend + API;
- data ingestion + review UI;
- authentication + permissions;
- analytics + product UI;
- infrastructure + application integration.

### Weeks 9–10 — Ownership and leadership

Builder must demonstrate:
- estimation;
- task decomposition;
- team coordination;
- review of another person's work;
- communication of blockers;
- business-value awareness;
- quality/security judgment.

### Weeks 11–12 — Graduation build

Builder completes an independent, accepted production package proving readiness for phase-priced work.

This is **not automatically the Capstone venture**. The venture Capstone comes only after graduation and a Master Build Plan is separately admitted.

## 4. Admission standard

The Academy may recruit people without traditional developer backgrounds. Admission is based on evidence of learning ability, persistence, judgment, team behavior, communication, and ability to follow structured instructions.

Admissions should test:
- problem-solving;
- willingness to investigate before acting;
- ability to explain reasoning;
- response to correction;
- attention to detail;
- basic digital fluency;
- teamwork and reliability;
- motivation for building, not merely speculative ownership.

The Academy should avoid using pedigree as a proxy for capability.

## 5. Apprentice pay

Working doctrine remains **$20/hour** during apprenticeship, subject to legal/wage/payroll review.

Apprentices are paid for their time under the approved employment arrangement. Phase scoring during apprenticeship measures capability and progression; it does not replace legally required wages.

## 6. Builder capability ladder

### L0 — Apprentice

Can execute highly bounded tasks with direct guidance.

Promotion evidence:
- setup and Git competence;
- safe AI/tool use;
- follows instructions;
- validates work;
- accepts feedback;
- no repeated security/process violations.

### L1 — Guided Builder

Can execute small production phases with review.

Promotion evidence:
- repeated accepted changes;
- explains code/data flow;
- writes useful implementation notes;
- handles routine rework;
- low regression rate.

### L2 — Independent Builder

Can own bounded phases end-to-end.

Promotion evidence:
- plans before coding;
- independently resolves ordinary blockers;
- appropriate test/build evidence;
- understands product impact;
- reliable estimates within governed tolerance;
- can work without continuous supervision.

### L3 — Venture Builder

Can own complex phases, work across systems, and mentor others.

Promotion evidence:
- architectural judgment;
- multi-layer work;
- review capability;
- team contribution;
- repeated high-value accepted output;
- identifies hidden risks before they become incidents.

### L4 — Product Lead

Can own a Master Build Plan and product outcome.

Evidence:
- translates market/user need into roadmap;
- estimates phases and staffing;
- runs acceptance rhythm;
- manages product quality and economics;
- can recruit/build a team;
- can maintain product after launch.

### L5 — Foundry Architect / Executive Technical Leader

Creates reusable systems across ventures, improves the Foundry itself, establishes technical doctrine, and multiplies team capacity.

## 7. Capability dimensions

Every builder receives scores in independent dimensions rather than one vague rating:

1. Product comprehension
2. Technical execution
3. AI/tool leverage
4. Debugging/problem solving
5. Validation/testing
6. Security/privacy discipline
7. Documentation/handoff
8. Estimation/scope control
9. Teamwork/communication
10. Review/mentoring
11. Architecture/system thinking
12. Business-value judgment
13. Reliability/ownership
14. Learning velocity

Each dimension uses a governed 0–5 scale with evidence links.

## 8. Phase Value System

The Phase Value Score (PVS) measures the value and difficulty of a phase before assignment.

### Factors

Each primary factor is scored 0–5:

- **Complexity (C):** technical/system difficulty.
- **Business Value (B):** contribution to revenue, retention, launch, risk reduction, or strategic capability.
- **Risk (R):** security, data, compliance, migration, production blast radius.
- **Scarcity (S):** rarity of capability required.
- **Outcome Ownership (O):** degree of independent responsibility.
- **Urgency (U):** cost of delay / time sensitivity.
- **Reuse Discount (D):** amount already solved by Foundry primitives/templates.

Initial formula:

`PVS = (2C + 3B + 2R + S + 2O + U) - 2D`

Minimum score floor: 1.

The weights are intentionally configurable and should be empirically recalibrated after the first cohorts.

## 9. Phase bands

Initial planning bands:

- **P0 — Starter:** PVS 1–8
- **P1 — Basic:** 9–16
- **P2 — Standard:** 17–24
- **P3 — Advanced:** 25–32
- **P4 — Critical:** 33–40
- **P5 — Venture-defining:** 41+

The band determines who may lead the phase, required review depth, and the approved compensation range after graduation.

No automatic dollar-per-point rate is locked in CF-005. CF-006/finance can calibrate pricing using actual throughput, market compensation, cash availability, and product economics.

## 10. Builder eligibility by phase band

- L0: P0 only, supervised
- L1: P0–P1, reviewed
- L2: P0–P2; selected P3 with oversight
- L3: P0–P4
- L4: P0–P5 plus Master Plan leadership
- L5: unrestricted within authorization; responsible for system-level review

This is a default policy; high-risk security/migration/compliance phases may require specialist approval regardless of level.

## 11. Acceptance workflow

A phase is not earned merely because code was written.

States:

`draft → approved → assigned → in_progress → submitted → validation → accepted | rework | rejected → settled`

### Acceptance packet

A submitted phase includes, as appropriate:
- summary of what changed;
- scope deviations;
- commits/PRs;
- tests/typecheck/build/lint results;
- screenshots/demo evidence;
- migration/data proof;
- security considerations;
- known limitations;
- rollback/recovery note for risky changes;
- documentation updates;
- next dependencies.

### Independent acceptance

Builders do not self-accept paid phases. An authorized reviewer/product lead accepts or sends to rework.

## 12. Rework rules

Normal review/rework is part of building and is not automatically a new paid phase.

A phase may be re-scoped/repriced only when:
- requirements materially change after approval;
- previously unknown dependency is validated;
- company adds significant scope;
- product risk classification changes;
- approved design is replaced by company direction.

Poor-quality execution is rework, not new compensation.

## 13. Quality score

Acceptance also creates a Quality Score using:

- correctness;
- maintainability;
- test/validation completeness;
- security/privacy;
- scope discipline;
- documentation;
- regression impact;
- review burden.

Repeated acceptance with heavy reviewer repair will not produce the same capability progression as clean independent delivery.

## 14. Phase Value Points

After acceptance, the builder receives Phase Value Points (PVP) based on the approved PVS adjusted for contribution and quality.

Illustrative formula:

`PVP = PVS × contribution_share × quality_multiplier`

Where quality multiplier might initially range from 0.75–1.25 under governed rules.

PVP is a capability/productivity metric, not currency and not an automatic right to equity or residuals.

## 15. Team phases

For multi-builder phases:
- one person is accountable lead;
- contribution shares are set before settlement;
- reviewers may adjust only through documented evidence;
- total contribution share = 100%;
- PVP is apportioned accordingly.

The system must prevent a manager from claiming most production credit merely because they supervised a team.

## 16. Graduation gate

Graduation from apprenticeship requires all of the following:

1. minimum attendance/participation required by program policy;
2. required curriculum completed;
3. minimum number of accepted real-production phases;
4. at least one independently owned accepted phase;
5. no unresolved serious security/IP/conduct violations;
6. capability floor in all mandatory dimensions;
7. demonstrated teamwork;
8. clean graduation build;
9. review panel approval.

Graduation means **eligible to continue**, not guaranteed ownership or employment.

Possible outcomes:
- Graduate — Venture Track
- Graduate — Production Contractor/Employee Track
- Extended Apprenticeship by exception
- Program completed / not invited to continue

## 17. 90-day post-graduation production standard

A graduate invited into the ownership/venture pathway enters a 90-day proof period.

The goal is to demonstrate sustained production after intensive training.

Required measures should include:
- accepted PVP threshold set by level/role;
- acceptance rate;
- rework burden;
- quality score;
- reliability and deadline performance;
- teamwork/mentoring;
- documented business impact;
- no major process/security violations.

### Profitability principle

The founder goal of "profitable code" is preserved but measured at the product/phase level, not by pretending every commit has a directly attributable profit number.

The 90-day dashboard should track:
- accepted production value;
- direct compensation cost;
- attributable product/revenue impact where defensible;
- reusable Foundry capability created;
- avoided vendor/development cost where defensible;
- support/rework cost.

## 18. Ownership invitation gate

Completion of the Academy does not automatically award parent equity.

An ownership invitation can consider:
- 90-day performance;
- company-wide value creation;
- leadership/team behavior;
- long-term commitment;
- strategic skill scarcity;
- contribution to reusable Foundry systems;
- recruiting/mentoring quality;
- integrity/security record.

Parent equity remains selective because product residuals provide a broader ownership-like upside mechanism without unlimited cap-table dilution.

## 19. Capstone Master Build Plan

Only L4-qualified builders or a builder under an approved L4/L5 sponsor may submit a Capstone Master Build Plan.

Required sections:

### Problem
- target user/customer;
- painful/valuable job;
- evidence/problem validation;
- alternatives/competition.

### Product
- proposed solution;
- V1 boundary;
- non-goals;
- moat/reuse advantage;
- shared Foundry primitives reused.

### Commercial
- payer;
- pricing hypothesis;
- route to first customers;
- unit economics assumptions;
- launch/beta metric;
- kill criteria.

### Build
- architecture;
- data/security classification;
- phase sequence;
- dependencies;
- staffing;
- estimated PVS by phase;
- beta definition;
- production hardening.

### Economics
- budget;
- capital requested;
- projected infrastructure/API cost;
- proposed DPR waterfall;
- company residual % (>=25%);
- capstone lead residual % (<=51%);
- named team residual allocations;
- reserve for later team contributors if any;
- sale/spinout proposal for counsel review.

### Governance
- product lead;
- acceptance authorities;
- legal/compliance gates;
- reporting cadence;
- continuation/shutdown triggers.

## 20. Capstone admission panel

Recommended panel:
- Founder/Product & Foundry Architect;
- CEO or delegated commercial executive;
- technical/architecture reviewer;
- finance representative;
- legal/compliance reviewer when product requires it.

Admission requires explicit PASS/CONDITIONAL PASS/REJECT with reasons.

## 21. Capstone team formation

The accepted product lead may recruit builders from inside the Foundry subject to staffing approval.

Principles:
- no builder is "owned" by a project;
- company allocates scarce capacity;
- residual percentages must be disclosed before a person accepts residual-bearing responsibility;
- ordinary paid phase work can coexist with residual-bearing team membership;
- recruiting rewards do not substitute for production contribution;
- team changes require a controlled amendment process.

## 22. Internal recruiting flywheel

Builders should be encouraged to identify talented future builders, but the Foundry pays for productive outcomes, not recruitment chains.

Approved mechanisms may include:
- referral cash bonus after successful hire/probation;
- mentoring PVP/leadership credit;
- team-lead compensation;
- product residual allocated for actual product contribution.

No compensation is paid merely for recruiting investors or for building a downline.

## 23. Builder Performance Ledger

Each builder receives a durable record with:

- builder_id;
- admission date;
- current level;
- capability dimension scores;
- training modules completed;
- phase assignments;
- submitted/accepted/reworked/rejected phases;
- PVS and PVP;
- quality scores;
- review burden;
- technologies/domains demonstrated;
- production incidents caused/resolved;
- security/compliance record;
- mentorship/review contributions;
- products launched;
- attributable business impact where defensible;
- residual products/percentages if authorized;
- ownership awards if authorized;
- graduation and 90-day status.

The ledger is evidence, not a social popularity score.

## 24. Builder capability credential

A graduate should eventually be able to present a verified internal credential such as:

- capability level;
- accepted PVP;
- number and band of accepted phases;
- production deployments;
- systems worked on;
- products launched;
- mentoring/review record.

Sensitive company/customer details are omitted from any external credential.

## 25. AI-assisted development method

The Academy's method should be taught as a repeatable loop:

**Understand → Inspect → Plan → Specify → Build → Verify → Explain → Commit → Review → Learn.**

### Understand
Know the user/business problem and acceptance criteria.

### Inspect
Read the repo, existing patterns, docs, types, schemas, tests, and constraints before editing.

### Plan
Break work into coherent steps; identify dependencies and risks.

### Specify
Give AI tools clear bounded instructions with relevant context and explicit constraints.

### Build
Use AI/code tools aggressively where useful, but keep human control over architecture and acceptance.

### Verify
Run appropriate tests/checks, inspect behavior, and challenge generated assumptions.

### Explain
Builder must be able to explain material code they submit.

### Commit
Create clean, traceable units of change.

### Review
Accept critique; fix root causes rather than patch symptoms.

### Learn
Record reusable patterns, mistakes, and improvements for the next phase.

## 26. Anti-vibe failure rules

The Foundry embraces AI-assisted/vibe coding speed but rejects careless AI dependence.

Automatic failure/rework triggers include:
- cannot explain submitted code;
- fabricated APIs/functions/data;
- secrets committed/exposed;
- bypassing auth/security controls;
- copied proprietary code without rights;
- fake tests or fabricated command results;
- silently deleting functionality to make tests pass;
- migrations without required gate/backup plan;
- disabling validation merely to achieve a green build;
- knowingly hiding material defects from reviewer.

## 27. Security progression

Production permissions expand with demonstrated capability.

- L0: local/sandbox only where possible.
- L1: protected branches, review required.
- L2: standard production workflows, no unilateral high-risk operations.
- L3: expanded operational access based on product.
- L4/L5: approval authority only for domains explicitly authorized.

Least privilege applies regardless of seniority.

## 28. Mentor model

Every apprentice has an accountable mentor or mentor pool.

Mentors are measured on:
- apprentice progression;
- quality of feedback;
- avoiding dependency/hand-holding;
- security/process compliance;
- graduation quality;
- successful transition to independent production.

Mentoring can earn compensation/PVP/leadership credit under future policy.

## 29. Cohort sizing

Cohort size is governed by **productive training capacity**, not recruiting demand.

Maximum cohort size should be constrained by:
- available cash/payroll;
- number of appropriate real phases;
- mentor/reviewer capacity;
- compute/dev-environment capacity;
- product need;
- expected graduation placement.

If the Foundry cannot provide meaningful supervised production, it should not add apprentices merely to increase headcount.

## 30. Product staffing marketplace

Post-graduation, LocalBrain/FoundryOS should expose an internal opportunity board showing:
- open phases;
- product;
- PVS/band;
- required level/capabilities;
- compensation package options;
- residual-bearing status if any;
- estimated window/dependencies;
- assigned reviewer.

Qualified builders can express interest; product leads select subject to company capacity rules.

## 31. Team health / culture gate

Technical output alone is insufficient for ownership-track graduation.

Disqualifying or delaying behaviors can include:
- hiding mistakes;
- repeated unreliability;
- destructive competition;
- credit theft;
- refusal to document;
- security negligence;
- abusive team behavior;
- intentionally gaming PVP/phase structure.

The Foundry explicitly values people who increase the capability of the team around them.

## 32. Kill and remediation paths

A builder can be:
- coached;
- placed on a remediation plan;
- moved to a narrower production role;
- removed from a high-risk product;
- exited from the program/company under applicable agreement/law.

Residual/equity treatment follows signed agreements; performance systems cannot simply confiscate already-earned compensation.

## 33. Dashboard requirements

### Apprentice dashboard
- current week/module;
- capability scores;
- assigned tasks;
- accepted/rework history;
- mentor feedback;
- graduation requirements;
- safety/security reminders.

### Builder dashboard
- level;
- accepted PVP;
- open eligible phases;
- phase earnings;
- quality trend;
- capability gaps;
- residual products;
- next-level requirements.

### Product lead dashboard
- master plan;
- team roster;
- phase board;
- PVS budget;
- acceptance queue;
- velocity;
- rework burden;
- product economics;
- DPR/residual allocations;
- staffing needs.

### Foundry management dashboard
- cohort funnel;
- graduation rate;
- PVP output;
- payroll per accepted PVP;
- mentor load;
- product staffing pressure;
- quality/security incidents;
- builder retention;
- product revenue per builder/team;
- time-to-independence;
- time-to-Capstone readiness.

## 34. Initial success metrics

After the first cohort, measure:
- % reaching L1/L2/L3;
- median time to first accepted real phase;
- median rework cycles;
- accepted PVP per paid training hour;
- defect/regression rate;
- mentor hours per apprentice;
- graduation rate;
- 90-day retention/performance;
- % of graduates leading teams;
- number of admitted Capstones;
- first-dollar time for Capstones;
- company residual generated per cohort.

Do not optimize graduation rate at the expense of standards.

## 35. CF-005 controls

The Academy may not:
- promise ownership for enrollment or graduation;
- use PVP as unapproved currency/equity;
- replace required wages with speculative residuals;
- let builders self-accept paid work;
- award credit based on LOC;
- admit a Capstone without a Master Build Plan;
- assign less than 25% company residual in a Capstone;
- assign more than 51% lead residual;
- hide team residual allocations;
- use recruiting as the primary compensation mechanism;
- expose secrets/customer data as training material without authorization.

## 36. CF-005 closeout

**PASS.**

Company Foundry now has a finite paid apprenticeship, evidence-based capability ladder, Phase Value System, acceptance workflow, 90-day post-graduation proof period, Capstone Master Plan standard, team formation doctrine, anti-gaming rules, and a durable Builder Performance Ledger specification.

## 37. Next slice — CF-006

**CF-006 — Company Foundry Control Plane + LocalBrain Dashboard**

Build the actual software/control surface for:

1. Company Foundry navigation entry;
2. portfolio registry view;
3. master-plan registry;
4. Builder Academy roster and capability ledger;
5. Phase Value calculator;
6. phase board + acceptance queue;
7. Capstone admission/status view;
8. residual allocation/waterfall simulator;
9. ownership/capital/production/residual ledger separation;
10. Foundry metrics dashboard;
11. document/doctrine navigation;
12. read-first architecture with no real payroll/equity issuance until legal gates are implemented.
