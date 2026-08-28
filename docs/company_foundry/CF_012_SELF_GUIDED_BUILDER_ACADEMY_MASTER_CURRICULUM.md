# CF-012 — Self-Guided Builder Academy Master Curriculum

**Status:** MASTER TRAINING DESIGN — implementation-ready curriculum architecture; employment, wage, securities, tax, and Capstone-repayment terms require professional review before live cohort launch
**Date:** 2026-08-28
**Supersedes:** CF-005 sections that treated the venture Capstone as post-graduation/optional

## 1. Purpose

Build a zero-live-instructor training system that teaches the Company Foundry development method from first contact with AI-assisted coding through independent Master Build Plan construction and Capstone defense.

A cohort member should be able to log in with little or no traditional software-development background and be guided through:

**Idea → product thinking → AI tool use → prompting → Cursor → Git/GitHub → deployment → repo reconnaissance → problem decomposition → Master Build Plans → accepted production phases → Capstone engineering → Capstone application → graduation → pilot selection or phase-project placement.**

The Academy is not designed to create people who can merely make AI produce code. It is designed to create builders who can use multiple AI systems as a coordinated engineering workforce while retaining human responsibility for product judgment, architecture, verification, safety, and business outcomes.

---

# 2. What must be understood to build in the Foundry style

The Foundry method has eight intertwined skill systems.

## 2.1 Product imagination

The builder learns to answer:

- What problem are we solving?
- Who experiences it?
- Why does the problem matter enough to solve?
- What does the user need to be able to do?
- What should happen automatically?
- What should always require human approval?
- What is V1?
- What is explicitly not V1?
- How will we know the product works?
- How could the product make money?

Coding begins only after the desired human outcome is understood.

## 2.2 System decomposition

The builder learns to turn a large idea into a machine:

- frontend/user experience;
- backend/business logic;
- data model;
- authentication/authorization;
- integrations;
- AI layer;
- files/storage;
- deployment;
- observability;
- security/privacy;
- testing/acceptance;
- documentation/handoff;
- commercialization.

This is the transition from **concept to construction**.

## 2.3 AI orchestration

The Foundry style does not treat one AI as the developer. Different AI surfaces are used for different work.

Typical roles:

- **ChatGPT / strategic AI:** product thinking, research, architecture, Master Plans, critique, requirements, business modeling, legal/commercial questions, second opinions.
- **Cursor / repository AI:** reads the actual codebase, performs implementation, traces bugs, writes/refactors code, runs local commands, tests, and produces implementation reports.
- **Additional AI reviewers:** independent critique, alternate architecture, code review, security review, copy review, or specialized domain analysis where useful.

Core principle:

> One AI proposes. Another AI can inspect. The human decides. The repository proves.

The builder learns not to ask multiple AIs to blindly edit the same files simultaneously. Parallel AI work is divided by lane, question, artifact, or review function.

## 2.4 Prompt engineering as specification writing

Prompts are not magic words. A good Foundry prompt functions like an engineering brief.

A strong build prompt usually includes:

1. **Mission** — what outcome must exist when finished.
2. **Context** — repository, product, user, current state.
3. **Read-first instructions** — what files/docs must be inspected before changing code.
4. **Scope** — allowed paths and work.
5. **Boundaries** — what must not change.
6. **Functional requirements** — exact behavior.
7. **UX requirements** — what the operator/user should experience.
8. **Data/security requirements** — auth, privacy, secrets, migrations.
9. **Acceptance criteria** — what proves the work is complete.
10. **Validation commands** — typecheck, test, build, domain-specific checks.
11. **Git discipline** — commit/push expectations.
12. **Return report** — changed files, proof, blockers, next slice.

The Academy teaches progressive prompting from a two-sentence task to a full Master Build Plan execution packet.

## 2.5 Repository literacy

Before builders modify code, they learn to identify:

- repository root;
- package manager;
- framework;
- frontend/backend boundaries;
- package.json scripts;
- environment-variable examples;
- database/schema/migration locations;
- tests;
- deployment configuration;
- documentation and canonical architecture notes;
- generated files versus source files;
- secrets that must never be committed;
- branch and commit state.

The Foundry maxim is:

> **Read the room before moving the furniture.**

## 2.6 Git/GitHub discipline

Builders must understand:

- repository versus local working directory;
- clone;
- branch;
- status;
- diff;
- add/stage;
- commit;
- push;
- pull/fetch;
- merge/rebase at a conceptual level;
- pull requests where used;
- commit SHAs;
- reverting/recovery;
- `.gitignore`;
- why secrets never belong in Git;
- why each accepted phase needs a durable change record.

GitHub is treated as the permanent engineering history and collaboration layer, not merely a backup folder.

## 2.7 Deployment literacy

The builder learns the Foundry deployment pattern, beginning with Netlify where applicable:

- repo-connected deployment;
- production versus preview deploy;
- build command;
- publish/output directory;
- environment variables;
- serverless/functions architecture;
- deployment logs;
- build failures;
- domain/DNS basics;
- rollback and previous deploys;
- production database connectivity;
- why a local success does not prove a production success.

Netlify is taught as a concrete deployment system, but the underlying concepts must transfer to other hosts.

## 2.8 Verification and acceptance

The builder must learn the difference between:

**“AI says it changed it”** and **“the phase is accepted.”**

Proof can include:

- tests;
- typecheck;
- lint;
- build;
- screenshots;
- browser walkthrough;
- API response proof;
- migration proof;
- database state;
- deployment result;
- logs;
- security checks;
- regression review;
- documentation update;
- independent reviewer acceptance.

---

# 3. Academy operating model

## 3.1 No live instructor required

The Academy itself acts as:

- instructor;
- lesson sequencer;
- lab environment;
- project manager;
- rubric;
- checkpoint system;
- evaluator;
- Capstone development coach;
- evidence recorder;
- progression gate.

Humans remain necessary as authorized reviewers for high-stakes acceptance, conduct issues, employment decisions, and final Capstone selection. The system should not require a teacher to lecture or manually guide daily lessons.

## 3.2 Learning loop

Every lesson uses the same six-part pattern:

1. **Learn** — concise explanation.
2. **Watch/Inspect** — annotated example or real repository inspection.
3. **Try** — sandboxed exercise.
4. **Build** — real Foundry production task when level allows.
5. **Prove** — submit evidence.
6. **Reflect** — explain what happened, what failed, and what was learned.

No learner advances solely by clicking “complete.”

## 3.3 AI tutor behavior

The Academy tutor should:

- explain terminology in plain language;
- diagnose misunderstandings;
- ask the learner to predict before revealing answers;
- generate safe practice tasks;
- critique prompts;
- compare weak versus strong prompts;
- ask for explanations of code changes;
- refuse to mark production work accepted without required evidence;
- detect copy/paste without comprehension through oral/written defense questions;
- personalize remediation;
- continuously connect lessons back to the learner's Capstone idea.

---

# 4. Capstone begins on Day 1

Every cohort member must complete a Capstone design and application to graduate.

**Capstone design is mandatory. Capstone implementation is competitive.**

The learner begins a **Capstone Notebook** during onboarding. It evolves throughout the Academy.

At the end of training:

- every trainee presents a complete Capstone Master Build Plan;
- every trainee receives a graduation decision;
- the Foundry separately decides which Capstones receive pilot funding and implementation authorization;
- graduates whose Capstones are not selected can be placed onto accepted phase projects;
- rejected pilot selection is not failure to graduate if the learner demonstrated required product/build capability.

This replaces the earlier doctrine that Capstone design happened only after graduation.

---

# 5. Academy progression — beginner to Master Plan

The curriculum is organized into **8 stages / 48 core modules**. The default delivery target remains approximately 12 weeks, but progression is evidence-based rather than purely calendar-based.

---

## STAGE 0 — Welcome to Building
### Goal: remove fear and establish vocabulary

### Module 0.1 — What vibe coding actually is
Learn:
- describing desired outcomes to AI;
- why AI can write code without making the human an engineer automatically;
- difference between prototype and production;
- Foundry definition of responsible vibe coding.

Exercise: describe a simple app in everyday language.

Capstone checkpoint: write 10 problems you would enjoy solving.

### Module 0.2 — How software fits together
Learn:
- browser;
- frontend;
- backend;
- API;
- database;
- server;
- domain;
- hosting;
- authentication;
- source code.

Exercise: map a familiar website into these pieces.

Capstone checkpoint: identify which pieces your favorite three ideas might need.

### Module 0.3 — Files, folders, terminals and paths
Learn:
- files/folders;
- absolute versus relative path;
- command line;
- current directory;
- Windows drive/path concepts;
- opening a project correctly.

Lab: navigate a training repo without changing it.

### Module 0.4 — Foundry terminology I
Core vocabulary:
repo, local, remote, branch, commit, push, pull, dependency, package, framework, runtime, build, deploy, environment variable, secret, database, migration, API, endpoint, component, state, schema.

Assessment: terminology matching + explain five terms in your own words.

### Module 0.5 — Meet your AI team
Learn strategic AI versus repository AI versus reviewer AI.

Lab: ask the same question three ways and compare results.

### Module 0.6 — Your Capstone Notebook
Create:
- problem list;
- curiosity list;
- industries/communities known personally;
- recurring frustrations;
- skills/access/network advantages;
- initial ideas.

Gate 0: learner can explain what software components are and how AI fits into the build process.

---

## STAGE 1 — Talking to AI Like a Builder
### Goal: turn natural language into useful specifications

### Module 1.1 — Prompt anatomy
Context, outcome, constraints, acceptance.

### Module 1.2 — Weak prompts versus strong prompts
Learner repairs vague prompts.

### Module 1.3 — Ask AI to inspect before acting
Read-first prompting and why assumptions create bugs.

### Module 1.4 — Give AI boundaries
Allowed paths, forbidden changes, secrets, migration gates, production safeguards.

### Module 1.5 — Asking for proof
Tests, typecheck, build, screenshots, output summaries.

### Module 1.6 — Multi-AI orchestration
Teach:
- strategic conversation in ChatGPT;
- implementation in Cursor;
- return report to strategic AI;
- strategic critique/next script;
- independent reviewer role;
- avoiding conflicting simultaneous edits.

Lab: learner produces a tiny two-AI build loop.

Capstone checkpoint:
- choose top three ideas;
- write a one-paragraph problem statement for each;
- use AI to challenge whether the problem is real.

Gate 1: learner can produce a bounded, verifiable implementation prompt.

---

## STAGE 2 — Cursor Fundamentals
### Goal: safely operate an AI-native code workspace

### Module 2.1 — Cursor interface
Explorer, editor, terminal, AI chat/agent surfaces, context, diffs.

### Module 2.2 — Opening the correct repository
Never run commands from the wrong lane/repo.

### Module 2.3 — Let Cursor inspect
Prompt Cursor to identify stack, routes, data model, scripts, deployment and risks before coding.

### Module 2.4 — Small safe edits
Documentation, copy, UI text, simple bounded component change.

### Module 2.5 — Diffs are your truth
Read additions/deletions before accepting.

### Module 2.6 — Cursor return reports
Every completed task reports:
- what changed;
- files changed;
- validation run;
- failures/blockers;
- commit SHA when applicable;
- next recommendation.

Capstone checkpoint:
- select one provisional Capstone idea;
- have Cursor/AI simulate what a repo for it might contain;
- identify likely technical layers.

Gate 2: learner completes a bounded repository change and can explain every material change.

---

## STAGE 3 — GitHub + Deployment
### Goal: understand durable software delivery

### Module 3.1 — Git mental model
Working tree → staged change → commit → remote.

### Module 3.2 — Essential commands
status, diff, add, commit, push, pull/fetch, log.

### Module 3.3 — Branches and recovery
Why isolated changes matter; revert versus deleting history.

### Module 3.4 — GitHub as institutional memory
Commits, PRs, issues, README, audit trail.

### Module 3.5 — Netlify fundamentals
Repo connection, build settings, deploy log, preview, production.

### Module 3.6 — Environment variables and secrets
Local `.env`, production env, `.env.example`, never commit secrets.

### Module 3.7 — Diagnose a failed deploy
Read log → isolate failing stage → reproduce locally → fix → validate → redeploy.

Capstone checkpoint:
- define likely hosting model;
- list required secrets/integrations;
- identify data sensitivity.

Gate 3: learner pushes a safe change and can trace it through deployment or a simulated deployment pipeline.

---

## STAGE 4 — Concept to Construction
### Goal: learn product engineering before large coding

### Module 4.1 — Start with the human problem
Jobs-to-be-done style thinking without jargon dependence.

### Module 4.2 — User journeys
What happens from arrival to successful outcome?

### Module 4.3 — Functional requirements
Turn wishes into observable behavior.

### Module 4.4 — Non-functional requirements
Security, speed, reliability, accessibility, privacy, maintainability.

### Module 4.5 — Data design
Entities, relationships, source of truth, retention.

### Module 4.6 — Human approval boundaries
What AI may suggest versus what requires a person.

### Module 4.7 — V1 versus dream product
Cut scope without destroying product value.

### Module 4.8 — Build versus buy versus integrate
Do not recreate commodity infrastructure unnecessarily.

Capstone checkpoint:
- final problem statement;
- target user;
- desired outcome;
- V1 feature list;
- non-goals;
- data classification;
- initial architecture map.

Gate 4: product concept passes a **Problem/Solution Clarity Review**.

---

## STAGE 5 — Phase-Based Production
### Goal: learn the Foundry build rhythm on real projects

Learners now work on existing Foundry products before their Capstone implementation can begin.

### Module 5.1 — What a phase is
A phase is a bounded business/technical outcome with acceptance evidence.

### Module 5.2 — Phase Value Score
Teach PVS factors and why code volume is irrelevant.

### Module 5.3 — Acceptance criteria
Define finish before starting.

### Module 5.4 — Production packet
Mission, context, paths, boundaries, requirements, validation, return report.

### Module 5.5 — Real Phase Lab I
P0 bounded existing-project task.

### Module 5.6 — Rework
Treat reviewer feedback as part of production rather than failure.

### Module 5.7 — Real Phase Lab II
P1/P2 task depending on capability.

### Module 5.8 — Team phase
Coordinate a bounded multi-builder task.

### Module 5.9 — Review someone else's work
Learn independent acceptance mindset.

Capstone checkpoint:
- decompose Capstone V1 into candidate phases;
- assign preliminary dependencies;
- identify Foundry primitives that can be reused.

Gate 5: minimum accepted real production evidence required before Master Plan stage.

---

## STAGE 6 — Master Build Plan Engineering
### Goal: convert a product idea into an executable company asset plan

### Module 6.1 — Master Plan anatomy
A Master Build Plan is the contract between vision and construction.

### Module 6.2 — Why → How → What
State why the product matters, how it works, and what will be built.

### Module 6.3 — Product architecture
Frontend, backend, data, auth, integrations, AI, deployment, security.

### Module 6.4 — Build phases
Sequence dependencies so every phase leaves the product coherent.

### Module 6.5 — Acceptance gates
Every phase must be independently testable.

### Module 6.6 — Build budget
Labor assumptions, infrastructure, tooling, contingency, lead/reviewer cost.

### Module 6.7 — Commercial model
Customer, price, competitors, route to first revenue, conservative revenue cases.

### Module 6.8 — Risk register
Technical, legal, privacy, market, funding, execution.

### Module 6.9 — Kill criteria
Define what evidence causes the Foundry to stop investing.

### Module 6.10 — Master Plan red-team
AI and peer reviewers attack assumptions.

Capstone checkpoint: complete Draft 1 of Capstone Master Build Plan.

Gate 6: Master Plan must be buildable by a team that did not invent the idea.

---

## STAGE 7 — Capstone Application + Graduation
### Goal: prove ability to think and operate as a product builder

### Module 7.1 — Capstone application
Required application:
- founder/problem story;
- target customer/user;
- evidence of need;
- competitive landscape;
- product promise;
- V1 scope;
- architecture;
- Master Build Plan;
- budget;
- team roles;
- commercialization hypothesis;
- risks;
- phase sequence;
- acceptance gates;
- proposed pilot timeline;
- Foundry primitives reused;
- requested Foundry investment;
- proposed residual team structure within doctrine.

### Module 7.2 — Capstone defense
Learner must explain the product without AI speaking for them.

Panel challenges:
- why this problem;
- why this solution;
- why now;
- why you;
- what could kill it;
- what is technically hardest;
- what can be removed;
- where money comes from;
- what the first customer experiences;
- how the company gets paid back.

### Module 7.3 — Graduation decision
Graduation requires:
- core curriculum complete;
- required production phases accepted;
- capability floors met;
- teamwork/ethics/security standards met;
- complete Capstone Master Build Plan;
- successful Capstone defense.

Graduation outcomes:

1. **Graduate — Capstone Pilot Selected**
2. **Graduate — Phase Production Track**
3. **Extension / remediation**
4. **Program complete — not invited to continue**

A Capstone application is mandatory to graduate. Pilot selection is not.

---

# 6. Capstone Pilot operating model

## 6.1 Foundry-funded build

For selected Capstones, Company Foundry fronts the approved pilot build cost.

The budget may include:

- $20/hour trainee/apprentice labor where legally appropriate;
- qualified builder phase compensation;
- reviewer/lead cost;
- compute/API/tooling;
- hosting;
- design/testing;
- approved market validation;
- contingency.

The Capstone pilot lead may recruit potential coders/builders into the Foundry pipeline for their team. Recruits must still pass Foundry admission and employment/contracting controls. Recruiting alone does not create economic rights.

## 6.2 Build-cost recovery waterfall — founder doctrine draft

The selected Capstone receives a recorded **Foundry Advance Balance (FAB)** equal to approved build costs actually funded by Company Foundry.

Until FAB reaches $0, the proposed operating rule is:

> **50% of eligible product revenue is applied to Foundry cost recovery each settlement period; the remaining 50% proceeds through the normal approved product operating waterfall.**

Because “revenue” can include taxes, refunds, payment processing, and pass-through items, counsel/accounting must define **Eligible Recovery Revenue (ERR)** before launch. The safest implementation is likely collected revenue net of sales taxes, refunds/chargebacks, and processor pass-through amounts.

Weekly recovery accounting may be displayed and posted, while cash settlement frequency must remain consistent with accounting/payroll/tax controls.

### Illustrative recovery

Foundry-funded pilot cost: **$20,000**

Weekly ERR: **$2,000**

50% recovery allocation: **$1,000/week**

At constant revenue, Foundry advance is recovered in approximately **20 weeks**.

## 6.3 After recovery

Once the Foundry Advance Balance reaches $0, the temporary 50% cost-recovery allocation stops.

The standard Capstone DPR formula then governs:

- calculate Distributable Product Residual under approved product waterfall;
- Company Foundry receives at least 25% of DPR;
- Capstone lead receives no more than 51% of DPR;
- named team members receive defined residual percentages;
- total = 100%.

The pre-recovery split does not convey ownership and does not permanently replace the residual formula.

## 6.4 What “top 50% is taken” means in system terms

To avoid ambiguity, the software should represent the recovery layer explicitly:

`Collected Revenue`
`- excluded pass-throughs/refunds/taxes per policy`
`= Eligible Recovery Revenue (ERR)`

While FAB > 0:

`50% ERR → Foundry Advance Recovery`
`50% ERR → product operating waterfall`

After FAB = 0:

`100% ERR → product operating waterfall → DPR allocation`

This remains planning doctrine until legal/accounting approval.

---

# 7. Master Build Plan template taught by the Academy

Every trainee learns to produce this structure.

## A. Executive thesis
What are we building and why should it exist?

## B. Customer/problem
Who pays or benefits? What is painful, expensive, slow, confusing, risky, or underserved?

## C. Evidence
What proves this is more than an interesting idea?

## D. Product promise
What becomes possible for the user?

## E. V1 boundary
Must-have capabilities and explicit non-goals.

## F. User journeys
Step-by-step experiences.

## G. System architecture
Frontend, backend, database, auth, storage, integrations, AI, hosting, observability.

## H. Security/privacy/legal
Data classification, secrets, permissions, retention, regulatory concerns.

## I. Build phases
Each with:
- phase ID;
- mission;
- dependencies;
- allowed scope;
- requirements;
- acceptance criteria;
- evidence;
- PVS;
- budget;
- assigned capability level.

## J. Commercial model
Competitors, advantage/disadvantage, price, first customer route, conservative revenue scenarios.

## K. Financial model
Build cost, operating cost, Foundry Advance Balance, 50% recovery model, post-recovery residual proposal.

## L. Team model
Roles, recruitment needs, mentor/reviewer needs, residual-bearing versus phase-paid responsibilities.

## M. Launch plan
Beta, customer feedback, support, instrumentation.

## N. Kill/hold/accelerate gates
Evidence-based continuation decisions.

---

# 8. Terminology curriculum

The Academy glossary must be contextual and searchable. Minimum categories:

### AI
LLM, context window, token, prompt, system instruction, hallucination, agent, tool call, model, inference, embedding, RAG, structured output.

### Code
source code, function, variable, component, module, package, dependency, framework, runtime, compile, typecheck, lint, test, build, bug, regression, refactor.

### Web
frontend, backend, client, server, request, response, HTTP, API, endpoint, route, JSON, authentication, authorization, session, cookie, domain, DNS, SSL/TLS.

### Data
schema, table, row, column, primary key, foreign key, query, SQL, migration, index, transaction, backup.

### Git
repository, clone, branch, commit, SHA, remote, origin, stage, diff, push, pull, fetch, merge, conflict, revert, PR.

### Deployment
hosting, CI/CD, environment variable, production, staging, preview deploy, serverless function, build log, rollback.

### Foundry
Master Build Plan, slice, phase, acceptance gate, Phase Value Score, Phase Value Points, evidence bundle, Capstone, Capstone Pilot, Foundry Advance Balance, Eligible Recovery Revenue, DPR, residual, product registry, controlled effect.

---

# 9. Self-guided assessment system

Assessments must measure doing, not memorization alone.

Types:

- terminology quizzes;
- prompt repair exercises;
- repo reconnaissance reports;
- identify-the-risk exercises;
- Git simulations;
- failed-deploy diagnosis;
- requirements decomposition;
- acceptance-criteria writing;
- Cursor execution labs;
- phase submissions;
- oral/written explain-your-change defenses;
- product teardown;
- Master Plan red-team;
- Capstone defense.

The AI tutor may grade low-risk formative work. Real production phases and graduation/Capstone decisions require governed human-authorized acceptance under Foundry rules.

---

# 10. Anti-dependency design

The Academy must specifically prevent “I can only build when somebody tells me what prompt to type.”

Progressively remove scaffolding:

### Beginner
System supplies prompt templates and exact commands.

### Developing
System supplies mission and boundaries; learner writes prompt.

### Independent
System supplies business outcome; learner inspects repo, designs plan and prompt.

### Venture
Learner identifies problem, designs product, builds Master Plan, recruits team, estimates budget and defends assumptions.

The end goal is not prompt-following. It is **product ownership and engineering judgment**.

---

# 11. Cohort automation requirements

A cohort operating system should track:

- enrollment;
- module progress;
- lesson attempts;
- assessment scores;
- remediation;
- AI tutor conversations or summarized learning evidence;
- Capstone Notebook versions;
- real phase assignments;
- phase submissions;
- reviewer outcomes;
- PVS/PVP;
- skill dimensions;
- teamwork/behavior signals;
- Master Plan readiness;
- Capstone application;
- defense results;
- graduation outcome;
- pilot-selection outcome;
- phase-project placement;
- pilot team recruitment;
- Foundry-funded budget;
- Foundry Advance Balance;
- weekly recovery ledger;
- post-recovery residual status.

The learner dashboard should always answer:

1. Where am I?
2. What am I learning now?
3. What do I need to prove?
4. What is my next production task?
5. How is my Capstone evolving?
6. What blocks graduation?

---

# 12. Recommended 12-week cadence

The system is evidence-driven, but a default cohort cadence helps planning.

| Week | Primary focus | Capstone evolution |
|---|---|---|
| 1 | Software basics + AI team | problem inventory |
| 2 | Prompting + Cursor | top 3 ideas |
| 3 | Git/GitHub | provisional idea |
| 4 | Netlify/deployment | hosting/data map |
| 5 | Product engineering | problem/user/V1 |
| 6 | Real phase I | architecture + feature map |
| 7 | Real phase II | phase decomposition |
| 8 | Team phase + review | team/skill needs |
| 9 | Master Plan I | full build sequence |
| 10 | Master Plan II | budget/commercial model |
| 11 | Red-team + revision | final application |
| 12 | Capstone defense | graduation + pilot decision |

---

# 13. Graduation standard — new controlling doctrine

Every graduate must demonstrate both:

### Production competence
- required curriculum;
- required accepted Foundry phases;
- minimum capability dimensions;
- Git/AI/deployment competency;
- security and teamwork standards;
- ability to independently plan and verify work.

### Product-builder competence
- completed Capstone Notebook;
- complete Master Build Plan;
- competitor/revenue analysis;
- build budget;
- phase map;
- Capstone application;
- successful defense.

**No Capstone application = no graduation.**

**No Capstone pilot selection does not automatically mean no graduation.**

---

# 14. Pilot selection standard

The Foundry selects Capstones to implement based on portfolio economics and execution confidence, including:

- problem quality;
- buyer/user evidence;
- product differentiation;
- market accessibility;
- technical feasibility;
- build cost;
- time to beta;
- time to first revenue;
- regulatory/legal risk;
- reuse of Foundry primitives;
- team readiness;
- pilot lead performance;
- conservative revenue-to-build-cost ratio;
- strategic portfolio fit.

Selection is capital allocation, not a popularity contest.

---

# 15. Capstone pilot team formation

Selected pilot lead may propose team roles and recruit candidates.

The Foundry controls:

- admission;
- worker classification;
- $20/hour apprenticeship eligibility;
- project staffing ceilings;
- scarce senior/reviewer allocation;
- security access;
- phase acceptance authorities.

The Capstone lead learns leadership by helping form the team but cannot promise employment, equity, or residuals independently.

---

# 16. Training product strategy

Before a cohort is allowed to implement selected Capstones, members must complete accepted phases on existing Foundry products.

Purpose:

- learn on code where architecture already exists;
- produce business value while training;
- prove the Academy methodology;
- measure true phase cost;
- establish reviewer calibration;
- expose learners to production standards;
- prevent Capstone budgets from becoming the first time a learner touches real systems.

SousChef remains the recommended Cohort 1 training environment unless a later portfolio decision changes it.

---

# 17. What the Academy is actually selling internally

The Academy transforms a learner through four identities:

**AI User → AI-Assisted Builder → Independent Phase Builder → Product Architect.**

A successful graduate should not merely say:

> “I learned Cursor.”

They should be able to say:

> “I can take a business problem, engineer the product, create the Master Build Plan, coordinate AI tools, build and verify production phases, deploy safely, explain the economics, and lead a team through launch.”

---

# 18. CF-012 implementation sequence

The curriculum should be built into the product in these software slices:

### CF-012A — Curriculum Registry
- stages/modules/lessons;
- prerequisites;
- assessments;
- glossary;
- evidence requirements;
- Capstone checkpoints.

### CF-012B — Learner Progress Engine
- enroll cohort;
- per-module state;
- attempts/remediation;
- gates;
- skill scores;
- AI tutor context.

### CF-012C — Capstone Notebook
- idea inventory;
- problem statement;
- market evidence;
- product definition;
- architecture;
- phase map;
- economics;
- versions.

### CF-012D — Production Lab Integration
- assign existing-product phase;
- submission/evidence;
- independent review;
- PVS/PVP;
- learning reflection.

### CF-012E — Master Plan Builder
- guided templates;
- dependency mapping;
- budget builder;
- competitor/revenue model;
- validation gates.

### CF-012F — Capstone Application + Defense
- submission;
- reviewer scoring;
- defense questions;
- graduation decision;
- pilot selection.

### CF-012G — Pilot Funding + Recovery Ledger
- approved build budget;
- actual funded cost;
- Foundry Advance Balance;
- ERR ledger;
- 50% recovery allocation;
- recovery completion gate;
- post-recovery residual activation.

No real money movement is enabled until a later finance/legal production gate.

---

# 19. Closeout

CF-012 establishes the full educational doctrine for a self-guided Company Foundry Builder Academy.

The Academy starts with **“What is software?”**, teaches the exact AI/Cursor/GitHub/Netlify/Master Plan workflow used by the Foundry, gives learners real accepted phase work, and requires every learner to engineer and defend a Capstone Master Build Plan before graduation.

The Academy does not require a standing instructor. It requires a strong curriculum engine, AI tutor, governed production acceptance, and human authority only at the points where company risk, employment, graduation, or capital allocation demand it.
