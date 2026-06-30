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

`GET /api/epo/overview` → `v1_command_center` on `EpoOverview` (auto-refreshed with build state on each request / 15s live refresh in UI).
