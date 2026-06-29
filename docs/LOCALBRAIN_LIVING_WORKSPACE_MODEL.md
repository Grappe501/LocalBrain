# LocalBrain Living Workspace Model v1.0

> **Core object of the OS** — not "projects." Every capability builds on `LivingWorkspace`.  
> Slice: **LB-OS-004** · Studio: [Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md) · CoS: [Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md)

---

## Architectural shift (LB-OS-004)

**Old (superseded for 004+):**

```txt
Project Registry — everything forced into "projects"
```

**New:**

```txt
Workspace Registry — LivingWorkspace is the foundation object
A project is only one kind of workspace.
```

The Chief of Staff **thinks in workspaces**, not folders:

```txt
Open the Kelly Campaign workspace.
Show me today's Novel workspace.
Switch to Database Studio.
Summarize RedDirt.
Prepare the Executive workspace.
```

---

## Type hierarchy

```txt
LivingWorkspace (base)
│
├── engineering      — Code, Burt, repos, builds
├── campaign         — RedDirt, field, compliance ops
├── novel            — Canon, chapters, continuity
├── photography      — Sessions, deliverables, metadata
├── podcast          — Episodes, production pipeline
├── research         — Voters, census, GIS, data sources
├── database         — ETL, SQL, Database Studio context
├── finance          — Books, CFO, compliance calendars
├── learning         — OJT, skill map, certifications
├── personal         — Household, life admin
├── executive        — CoS default / cross-cutting
└── meta             — LocalBrain self-build (localbrain)
```

Specialization is **`workspace_type`** + type-specific **`profile_json`** — not separate object models per domain.

---

## LivingWorkspace — full field model

Every workspace **eventually** knows (004 implements core + stubs; links may be empty arrays):

| Field | Type | Purpose |
|-------|------|---------|
| `workspace_id` | string | Stable slug — `localbrain`, `reddirt` |
| `workspace_type` | enum | See hierarchy above |
| `title` | string | Display name |
| `description` | string | Short summary |
| `status` | string | active · paused · archived · planning |
| `priority` | number | CoS sort order |
| `owner` | string | Default `steve` |
| `parent_workspace_id` | string? | Nested workspaces |
| `child_workspace_ids` | string[] | Graph-ready tree |
| `filesystem_roots` | string[] | **Real H:/ paths** — ties to permission engine |
| `repositories` | object[] | Git remotes, paths (stub) |
| `contacts` | string[] | Relationship intel IDs (stub) |
| `calendar_links` | object[] | Stub |
| `documents` | object[] | Stub |
| `data_sources` | object[] | Data platform catalog refs (stub) |
| `ai_memory` | object[] | Memory chunk refs (stub) |
| `knowledge_graph_nodes` | string[] | Stub |
| `goals` | object[] | Stub |
| `kpis` | object[] | Stub |
| `next_actions` | object[] | CoS + user |
| `health_score` | number? | 0–100 |
| `risk_score` | number? | 0–100 |
| **`executive_context`** | string | **Plain-language strategic context** — why this exists, what success looks like, what matters now, how it fits Steve's goals |
| `workspace_avatar` | string | Visual recognition — emoji or avatar key |
| `workspace_color` | string | Hex — nav/shell accent |
| `workspace_icon` | string | Icon id for shell |
| **Flags** | object | See below |
| `mission` | string | In profile or top-level for dashboard |
| `current_phase` | string | e.g. Core Infrastructure |
| `completed_slices` | string[] | LB-OS-### |
| `active_slice` | string? | Current build slice |
| `next_slices` | string[] | Queue hints |
| `recent_decisions` | string[] | Plain language |
| `chief_of_staff_summary` | string | CoS voice block |
| `recommended_next_action` | string | Single highest-leverage action |

### Workspace flags (filters across OS)

```txt
pinned
recent
favorite
archived
hidden
ai_recommended
needs_attention
```

Used in workspace picker, CoS routing, and future command layer — even before Explorer exists.

### Relationship graph (graph-ready, not graph DB required)

`workspace_links` table — edges from workspace to:

```txt
workspace · person · organization · project · contact · document
repository · database · media · task
```

Empty links OK in 004 — schema exists so Novel/CFO/Research plug in later without redesign.

---

## LocalBrain workspace template (reference)

When Steve opens **`localbrain`**:

```txt
Workspace: LocalBrain
Health: Excellent
Mission:
  Build Steve's Executive Operating System
Current Phase:
  Core Infrastructure
Completed:
  LB-OS-001 · LB-OS-002 · LB-OS-003
Active:
  LB-OS-004
Next:
  LB-OS-106
Recent Decisions:
  PSP approved · localbrain home · CFO briefing-only · MODULARITY GATE after 004
Chief of Staff Summary:
  Shell and permission engine are live. Workspace registry is the spine —
  design LivingWorkspace correctly before explorer and modules expand.
Recommended Next Action:
  Ship LB-OS-004 registry, then LB-OS-106 modularity gate.
executive_context:
  LocalBrain is Steve's second brain and operating company — not a chatbot.
  Success = meaningful work compounds weekly. Current priority: thin core,
  safe permissions, workspace-first navigation, modules after 106.
```

This layout is the **template for every future workspace** (campaign, novel, finance, etc.).

---

## Permission engine integration

```txt
filesystem_roots[] → sync to allowed_folders (permission engine)
New root must pass permissionEngine.checkPath before save
Cannot register forbidden paths
```

One registry — explorer (005+) scopes to active workspace roots.

---

## Routes (004)

```txt
/workspace/:workspaceId     Living Workspace dashboard (primary)
/project/:workspaceId     301 → /workspace/:workspaceId (compat from 002)
GET  /api/workspaces
GET  /api/workspaces/:id
POST /api/workspaces/:id/select   — active workspace for shell pill
GET  /api/workspaces/:id/links    — stub empty array OK
```

---

## Engines

| ID | Role in 004 |
|----|-------------|
| **ENG-WR-001** | Workspace registry (new ID — was project registry) |
| **ENG-KP-001** | Living Workspace intelligence / dashboard signals |
| **ENG-PM-001** | Path validation on filesystem_roots |
| **ENG-CF-001** | Active workspace preference |

Update [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md) when 004 ships.

---

## What 004 does NOT build

```txt
Explorer tree · file indexing · module manifests (106)
OpenAI · graph DB · populated contact/calendar links
Full studio implementations
```

---

## Related docs

| Doc | Role |
|-----|------|
| [Build Slice Queue v2](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) | LB-OS-004 execution |
| [Burt packet LB-OS-004](./burt_packets/LB-OS-004.md) | Implementation spec |
| [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) | 004 before 106 |
| [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) | workspace_type ↔ domain |

---

*Living Workspace Model v1.0 · LB-OS-004 foundation · 2026-06-28*
