# LocalBrain Engineering Department v1.0

> **Slice:** LB-OS-012 · **Not a code editor** — a full **department** with Chief, specialists, workspace, and scores.  
> **Code Studio** is one **workspace** inside this department.  
> Doctrine: [Operating System Doctrine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Departments: [Department Organization](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md) · Legacy code-studio detail: [Code Engineering Studio](./LOCALBRAIN_CODE_ENGINEERING_STUDIO.md)

---

## Principle

```txt
Stop thinking: code editor
Start thinking: Engineering Department
```

Steve talks to the **Engineering Chief**. The Chief routes to specialists. Work flows through the same operational loop as the rest of LocalBrain:

```txt
Observe → Understand → Plan → Recommend → Approve → Execute → Verify → Learn
```

CoS may delegate engineering intents here without Steve opening a specific workspace first.

---

## Chief

| Role | Agent ID | Responsibility |
|------|----------|----------------|
| **Engineering Chief** | `engineering_chief` | Triage, routing, synthesis, Engineering Score, "Explain this project" |

---

## Specialists

Each specialist is an agent the Engineering Chief can route work to:

| Specialist | Agent ID (planned) | Focus |
|------------|-------------------|--------|
| Architecture | `eng_architecture` | Structure, boundaries, module graph |
| Code Generation | `eng_code_generation` | Drafts, patches (proposal-only until approved) |
| Code Review | `eng_code_review` | Diff review, standards, risk |
| Testing | `eng_testing` | Test plans, coverage gaps |
| Documentation | `eng_documentation` | README, ADRs, inline docs |
| Security | `eng_security` | Secrets, permissions, threat surface |
| Performance | `eng_performance` | Hot paths, complexity, benchmarks |
| Deployment | `eng_deployment` | Release readiness, deploy checklists |
| Database | `eng_database` | Schema, migrations, query review |
| DevOps | `eng_devops` | CI, env, infra proposals |
| Build Planning | `eng_build_planning` | Slices, MRIDs, sprint breakdown |
| Burt Packet Generator | `burt_script_writer` | Generate → preview → approve → export |

V1 bootstrap: Chief + stub specialists + Burt packet flow (read/propose). Full agent implementations roll out incrementally inside the department module.

---

## Workspaces inside the department

| Workspace | Purpose |
|-----------|---------|
| **Code Studio** | Repo-scoped plan → code → validate → repair loop |
| **Architecture** | Module graph, API graph, dependency views |
| **Build & Slices** | MRID progress, Burt packets, build history |
| **Quality** | Tests, coverage, technical debt, Engineering Score |

Code Studio is **one lens** — not the department.

---

## Engineering workspace model

Every engineering workspace (LivingWorkspace type `engineering` or linked project) exposes:

```txt
Mission
Current sprint
Repositories
Modules
Open decisions
Technical debt
Health
Build history
Deployments
Tests
Architecture
Recent Burt packets
Next recommendation
```

Data sources: workspace registry, module loader, digital asset registry, decision ledger (when live), `command_log`, actions queue, future build/test artifacts.

---

## Code understanding (department scope)

The department understands **systems**, not just files:

```txt
Architecture
Dependencies
Module graph
Database schema
API graph
Component graph
Technical debt
Dead code
Duplicate code
Build history
```

LB-OS-012 bootstrap: module graph from manifests + repo tree + package boundaries. Full graphs and Digital Twin integration are later slices inside the department.

---

## Explain this project

One primary action — **Explain this project** — routed to Engineering Chief.

Response envelope (same four-question discipline as CoS):

| Section | Content |
|---------|---------|
| **Mission** | Workspace executive context + success definition |
| **Architecture** | Module graph summary, key boundaries |
| **Health** | Engineering Score + Operational Health cross-link |
| **Current sprint** | Focus, open slice, build status |
| **Major risks** | Debt, failing tests, security flags (when available) |
| **Dependencies** | Internal + external |
| **Open decisions** | Decision ledger + binding decisions |
| **Technical debt** | Registry + heuristics |
| **Recommended next step** | What / Why / Confidence / If approved |

Read-only in V1 bootstrap — no writes, no shell, no git mutations.

---

## Burt as internal capability

LocalBrain remains source of truth for slice execution:

```txt
Generate Burt packet
↓
Preview (diff / outline)
↓
Approve (Actions queue or department approve)
↓
Export to Cursor
↓
(later) Execute locally under approval gates
```

Packets stored in department memory + linked from workspace **Recent Burt packets**.

---

## Engineering Score

Composite 0–100 — engineering counterpart to **Operational Health Score** (LB-OS-011).

| Factor | Weight (stub) | Signals |
|--------|---------------|---------|
| Architecture | 0.15 | Module boundaries, circular deps (future) |
| Tests | 0.15 | Test file presence, last run (future) |
| Coverage | 0.10 | Coverage reports when available |
| Documentation | 0.10 | README, ADRs, doc coverage heuristics |
| Technical debt | 0.15 | Registry flags, TODO density (future) |
| Complexity | 0.10 | File size, dependency depth (future) |
| Performance | 0.10 | Perf budget flags (future) |
| Security | 0.10 | Permission engine alignment, secret scan |
| Deployment readiness | 0.05 | Build pass, manifest status |

V1: **stub score** from available signals (module manifest health, test script presence, docs files, pending approvals on repo). Factors expand as tooling ships.

Displayed on Engineering Department home. **Program-wide** engineering status lives in **Executive Program Office** (EPO), not Engineering nav.

---

## OJT integration

Optional on every engineering action (when Learn mode ON):

```txt
Concept learned
Why this pattern was chosen
Alternative approach
Tradeoffs
Tiny challenge
```

Target: **≤ 1–2 minutes** unless Steve asks for depth. Reuses OJT Academy infrastructure (LB-OS-026+).

---

## Long-term vision

Engineering Department eventually answers:

> **"If I change this API, what breaks?"**

Requires:

- Digital Twin + Knowledge Graph (impact analysis)
- API graph + consumer index
- Verify step after every approved change

Not in LB-OS-012 bootstrap — designed now, built incrementally.

---

## Safety (unchanged)

```txt
Read-only bootstrap in 012 where specified
No shell execution
No git write actions
All file changes via LB-OS-010 approval queue
Repo scope: permission engine allowed roots only
```

---

## LB-OS-012 bootstrap scope

**Build:**

```txt
Engineering Department module shell (/studio/engineering)
Engineering Chief routing stub (intent → specialist placeholder)
Engineering workspace dashboard (mission, sprint, repos, score stub)
Code Studio workspace tab (chat + repo context read-only)
Explain this project (Engineering Chief response)
Engineering Score stub
Burt packet generate + preview (propose export path)
GET /api/engineering/* read APIs
```

**Do not build in 012:**

```txt
In-browser IDE / Monaco editor
Auto-commit / auto-push
Shell / test runner execution
Full API impact graph
```

---

## V1 sequence context

```txt
012 Engineering Department
013 Writing Department
014 Database Department
015 Relationship Intelligence
016 Executive OS V1 milestone
```

---

## Related docs

| Doc | Role |
|-----|------|
| [Code Engineering Studio](./LOCALBRAIN_CODE_ENGINEERING_STUDIO.md) | Code Studio workspace detail (legacy name) |
| [Burt Script Generator](./LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md) | Packet format |
| [Agent Registry](./LOCALBRAIN_AGENT_REGISTRY.md) | `engineering_chief`, specialists |
| [Cursor Replacement Roadmap](./LOCALBRAIN_CURSOR_REPLACEMENT_ROADMAP.md) | Long-term editor path |

---

*Engineering Department v1.0 · LB-OS-012 · 2026-06-28*
