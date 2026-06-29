# LocalBrain Executive Program Office (EPO) v1.0

> **Executive Office core feature** — mission control for the entire LocalBrain build.  
> **Not** an Engineering Department page. **Not** a simple checklist.  
> Parent: [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) · Decisions: [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) · Checklist: [Phase Checklist](./PHASE_CHECKLIST.md)

---

## Principle

```txt
The Executive Program Office is the master control room.
Steve sees progress, blockers, docs, decisions, and metrics in one place.
The Chief of Staff explains why — not just what.
```

EPO answers:

```txt
Where are we?
What is next?
Why isn't that done yet?
What did we decide?
What documents matter?
What is under-documented?
```

---

## Placement

**Executive Office** — same tier as Executive Briefing, not inside any department.

```txt
Executive Office
    Executive Briefing      ← morning narrative
    Program Office (EPO)    ← build mission control  ★ this doc
    System Health           ← machine + ops (LB-OS-011)
    Decisions               ← decision ledger + timeline
    Documentation Library   ← searchable doc portal
    Operational Metrics     ← live build + cost metrics
```

Route (planned): `/executive/program` or `/program-office`

---

## Dashboard (top strip)

Always visible when EPO opens:

```txt
Overall Progress          ██████████░░░░░░░░░░░░░ 34%
Current Phase             Core Executive OS
Current Slice             LB-OS-012 Engineering Department
Next Slice                LB-OS-013 Writing Department
Operational Health        94
Engineering Score         87
```

| Metric | Source (auto) |
|--------|----------------|
| Overall Progress | Completed slices ÷ planned V1 slices |
| Current Phase | `PHASE_CHECKLIST.md` + phase navigator model |
| Current / Next Slice | Checklist gate + build queue |
| Operational Health | `GET /api/system/health` → operational_health_score |
| Engineering Score | `GET /api/engineering/score` (when LB-OS-012 ships) |

No manual updates for live metrics.

---

## Phase Navigator

Phases group slices into executive milestones (not 1:1 with checklist phase numbers):

| Phase | Label | Example slices |
|-------|-------|----------------|
| 1 | Foundation | 001–004, 106 |
| 2 | Chief of Staff | 008, 010.5 |
| 3 | Departments | 012–015 |
| 4 | Knowledge Platform | 005–007, Explorer, Registry |
| 5 | Executive OS V1 | 016 |

UI: progress bar per phase. Click drills into:

```txt
Objectives
Completed slices
Current slice
Remaining slices
Dependencies
Estimated effort
Architecture notes
```

---

## Slice detail page

Every `LB-OS-###` gets a dedicated page. Example **LB-OS-012**:

```txt
Status
Mission
Objectives
Architecture
Dependencies
Files changed
Commits
Tests
Lessons learned
Open decisions
Related docs
Burt packet
Completion report
```

### Documentation coverage (per slice)

```txt
Implementation    ██████████ 100%
Tests             █████████░  90%
Documentation     ██████████ 100%
User Guide        ██████░░░░  60%
OJT Lesson        ██████████ 100%
```

Highlights under-documented areas across the program.

### Data sources

| Field | Source |
|-------|--------|
| Status | `PHASE_CHECKLIST.md` + burt packet frontmatter |
| Mission / objectives | Burt packet + slice spec |
| Dependencies | `LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md` |
| Files / commits | `git log` scoped to slice completion |
| Tests | `npm test` result + test file grep |
| Burt packet | `docs/burt_packets/LB-OS-###.md` |
| Completion report | `docs/burt_packets/` or closeout artifacts |
| Lessons learned | workspace events + cos_outcomes (future) |

---

## Build graph

Interactive dependency graph — not only a flat list:

```txt
002 → 003 → 004 → 106 → 005 → 006 → 007 → 008 → …
```

Node states:

```txt
complete · in_progress · blocked · waiting · not_started · superseded
```

Click node → slice detail page.

Parsed from build slice queue dependency column + checklist status.

---

## "Why aren't we here yet?"

Chief of Staff feature — when a slice is blocked or not started, CoS explains in plain language:

```txt
"Waiting on GPU server."
"Depends on Relationship Intelligence (LB-OS-015)."
"Blocked by Database Department."
"Prerequisite LB-OS-010 not complete."
```

Uses dependency graph + checklist + workspace context — not a static "Not Started" label.

Response envelope: **What / Why / Confidence / If approved** (same as CoS recommendations).

---

## Decision timeline

Chronological binding decisions — feeds Decision Ledger when implemented; bootstrap from `bindingDecisions` + checklist changelog + architecture lock dates.

```txt
June 28 — LivingWorkspace adopted
June 28 — Host Platform adopted
June 28 — Knowledge Explorer adopted
June 28 — Digital Asset Registry adopted
June 28 — Engineering Department adopted
```

Click decision → why · what it replaced · downstream impact · related slices.

---

## Documentation library

Searchable internal documentation portal.

### Categories

```txt
Doctrine
Architecture
Build Plans
Burt Packets
Decision Ledger
Workspaces
Departments
Engineering
Database
Research
Future Plans
```

### Per-document card

```txt
Title
Version
Last Updated
Status (binding · spec · draft · superseded)
Supersedes
Related Documents
Referenced By
Quick Summary
```

Indexed from `docs/` tree + frontmatter (future) + git mtime. Search: full-text over markdown (Knowledge Explorer pattern).

---

## Build library

Every generated artifact — nothing lost:

```txt
Architecture
Doctrine
Specifications
Build packets (Burt)
Closeout reports
Commits
Lessons learned
Design history
```

Links slice detail ↔ git ↔ `docs/burt_packets/` ↔ workspace events.

---

## Live metrics panel

Auto-pulled — no manual spreadsheet:

```txt
Completed slices · Remaining slices
LOC (git)
Tests passing · Coverage (when CI wired)
Engines · Modules (manifest loader)
Documents (docs count)
Decisions · Workspaces · Knowledge Sources
Providers · API cost today (command_log + system usage)
```

Sources: `PHASE_CHECKLIST`, `GET /api/system/usage`, module registry, `command_log`, digital asset registry stats.

---

## Relationship to other surfaces

| Surface | Role |
|---------|------|
| **Executive Briefing** | Narrative morning brief — outcomes and priorities |
| **EPO** | Structural build truth — progress, graph, docs, blockers |
| **System Health** | Machine and operations telemetry |
| **Engineering Department** | Does engineering work — EPO *reports* Engineering Score, does not replace it |
| **Knowledge Explorer** | Filesystem + assets — EPO indexes *program docs* |

CoS orchestration (010.5) can answer EPO questions from chat: *"What's blocking LB-OS-018?"*

---

## LB-OS-012.5 bootstrap scope

**Slice:** LB-OS-012.5 — Executive Program Office (read-only v1)

**Depends on:** 011 (health metrics), 010.5 (CoS explain), 106 (modules), `PHASE_CHECKLIST.md`

**Does not depend on:** Engineering Department code (012) — EPO is Executive Office, not Engineering.

**Build:**

```txt
EPO route + Executive Office nav
Dashboard strip (progress, phase, slices, health scores)
Phase navigator (read from checklist)
Slice list + slice detail (markdown + git metadata)
Build graph (static parse of queue dependencies)
Documentation library (search docs/)
Decision timeline (bootstrap from changelog + binding decisions)
Live metrics panel (API aggregation)
"Why aren't we here yet?" — CoS intent for blocked slices
Documentation coverage bars (heuristic v1)
```

**Not in 012.5:**

```txt
Editable checklist · auto slice execution · write to decision ledger DB
Full git blame per slice · coverage CI integration
```

**Commit:** `feat: add Executive Program Office mission control`

---

## V1 navigation target

```txt
Executive Office
    Executive Briefing
    Program Office          ← EPO
    System Health           → /system
    Decisions               → ledger (when live)
    Documentation Library   → EPO tab or /executive/docs
    Operational Metrics     → EPO metrics panel
```

---

## Long-term

- EPO becomes default **second** screen after Briefing during active build phases
- Build graph feeds Digital Twin / knowledge graph
- Documentation coverage gates V1 ship (016)
- Team mode: EPO shows per-user assignments (LB-OS-112+)

---

*Executive Program Office v1.0 · LB-OS-012.5 · Executive Office · 2026-06-28*
