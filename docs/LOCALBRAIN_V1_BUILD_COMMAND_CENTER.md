# V1 Live Build Command Center

> **Surface:** Program Office (`/program-office`) · **Engine:** `ENG-BLD-001-V1CC`  
> **Mode:** [Implementation Mode](./LOCALBRAIN_V1_IMPLEMENTATION_MODE.md) — construction is observable

---

## Purpose

Replace vague "progress" with **live build observability**. The development home answers:

```txt
What version am I?
What is being built today?
What is blocked?
What finished yesterday?
How long until V1?
```

Refreshes from git + checklist + build state — **no manual dashboard updates**.

---

## Module lifecycle table

Every V1 module uses the same columns:

| Module | Version | % | Status | ETA | Owner | Blockers | Tests |

Statuses: `complete` · `in_progress` · `waiting` · `not_started` · `blocked`

---

## Critical path only

V1 estimates and launch score use the **critical path**, not total backlog:

```txt
Executive Office polish → Session 4 → Session 5 → Theory freeze
  → Convention → Empty Brain Factory → Memory OS
  → Communications Office → Commercial beta
```

Anything off the path must not delay launch.

---

## V1 launch score (weighted)

| Area | Weight |
| ---- | -----: |
| Executive Office | 10% |
| Theory & Convention | 15% |
| Factory | 20% |
| Memory OS | 30% |
| Communications | 20% |
| Documentation & Beta | 5% |

Single answer: **How close are we to shipping V1?**

---

## Environments & Kelly sandbox

```txt
Development → Integration → Beta → Production
```

Kelly:

```txt
Production Brain · Sandbox Brain · Factory Brain
```

**Never** use Kelly production data directly in development:

```txt
Kelly Production → Sanitized Snapshot → Kelly Sandbox → Development Testing
```

Isolated: different database, provider keys, storage, communication credentials. No real outbound email/SMS/calendar/social from dev.

---

## Module completeness rule

> No module is complete until demonstrably testable in isolation.

Each major module needs: demo screen · test suite · readiness indicator · pass/fail certification.

Commercial beta tests an **integrated product of certified modules** — not debugging the whole system at once.

---

## Version 2 discipline

New ideas → [VERSION2_BACKLOG.md](./VERSION2_BACKLOG.md). Do not interrupt V1 unless required for [launch criteria](./LOCALBRAIN_V1_LAUNCH_CRITERIA.md).

---

## API

`GET /api/epo/overview` → `project_state` + `v1_command_center` on `EpoOverview` (auto-refreshed with build state on each request / 15s live refresh in UI).

`GET /api/epo/project-state` → canonical `ProjectState` object — **single source of truth** for all dashboards.

Every launch metric (`launch_score_percent`, `overall_eta_days`, module progress) must come from `project_state`, not independent calculations.

---

## Launch Countdown

Executive summary panel at top of Program Office:

- LOCALBRAIN V1 · Implementation phase · weighted launch score
- Critical path remaining · modules remaining/certified · architecture FROZEN
- Target: Commercial Beta

---

## Build history

Git commits + Phase Checklist changelog grouped by day (`Today`, `Yesterday`, dates). Becomes the historical record of product evolution.

---

## Factory environments (Factory phase)

```txt
Factory Template
        │
        ├── Steve Sandbox
        ├── Kelly Sandbox
        ├── Chris Sandbox
        ├── Future Customer Sandboxes
        │
Production Brains
        │
        ├── Steve Production
        ├── Kelly Production
        └── Chris Production
```

Sandboxes are disposable. Production brains are protected.

---

## CEO mode (default Program Office view)

Stop measuring documents. Measure **modules shipped**.

Morning view — five questions only:

1. What is the one module we are finishing today?
2. What blocks V1 the most?
3. What can wait until V2?
4. What was completed since yesterday?
5. Is launch closer than yesterday?

**Days to Beta** is the project heartbeat. **Kelly Sandbox** is the golden integration test for module certification.

---

## Adaptive Completion Forecast (ENG-BLD-001-FCST)

**Estimated** = expert burn-down (human). **Predicted** = LocalBrain from git velocity + forecast history.

Each Program Office pass updates predicted launch date, confidence %, yesterday vs today comparison, critical path velocity, schedule drift sparkline, PMO reasoning, and department velocity bars.

Model tiers: `engineering_estimate` → `historical_average` → `predictive_model` as build history accumulates.
