# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Active lane:** V1 OS Shell — Workspace Registry  
**Slice:** LB-OS-004  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-003 ✅  
**Architecture:** [Living Workspace Model](../LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) — **read before any code**

---

## Mission

Implement the **Workspace Registry** — `LivingWorkspace` as the core OS object (not "Project Registry"). Seed **`localbrain`** with the full dashboard template. Sync `filesystem_roots` to the permission engine. Graph-ready links table (empty OK).

**This is one of the most important slices in the system.** Design the object correctly now so Explorer, studios, CFO, Novel, Research, CoS, and memory share one foundation.

---

## Steve architectural decisions (binding)

```txt
Project Registry → Workspace Registry
LivingWorkspace = base object; workspace_type specializes
Chief of Staff thinks in workspaces, not folders
Every workspace: avatar, color, icon (visual recognition)
Flags: pinned, recent, favorite, archived, hidden, ai_recommended, needs_attention
workspace_links: graph-ready edges (empty OK)
executive_context: plain-language strategic context for CoS
localbrain workspace = reference template for all future workspaces
```

---

## Executive domain / matrix

```txt
Executive domain(s): Executive + System
Matrix cell(s): System × Memory, Executive × Intelligence
Four mode(s): Remember (registry), Think (executive_context), Run (active workspace)
```

---

## Hard boundaries

**Do not:**

```txt
Build Explorer or file indexing (LB-OS-005)
Register module manifests (LB-OS-106)
OpenAI calls · file read/write tools · folder scanning
Force everything into a "projects" table name — use living_workspaces
Skip executive_context on localbrain seed
```

**Do:**

```txt
Validate filesystem_roots via permission engine before save
Sync roots to allowed_folders
Redirect /project/:id → /workspace/:id
Keep LB-OS-002 shell layout — upgrade Living Workspace view to data-driven dashboard
```

---

## Files to read first

```txt
docs/LOCALBRAIN_LIVING_WORKSPACE_MODEL.md          ← AUTHORITATIVE for this slice
docs/LOCALBRAIN_SAFETY_MODEL.md
docs/LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md
docs/LOCALBRAIN_STUDIO_BLUEPRINT.md
docs/LOCALBRAIN_MODULAR_ARCHITECTURE.md
docs/burt_packets/LB-OS-003.md
```

---

## Data model

### Table: `living_workspaces`

Core columns (SQLite):

```txt
workspace_id TEXT PRIMARY KEY
workspace_type TEXT NOT NULL
title TEXT NOT NULL
description TEXT
status TEXT DEFAULT 'active'
priority INTEGER DEFAULT 50
owner TEXT DEFAULT 'steve'
parent_workspace_id TEXT
executive_context TEXT NOT NULL DEFAULT ''
workspace_avatar TEXT
workspace_color TEXT
workspace_icon TEXT
filesystem_roots_json TEXT NOT NULL DEFAULT '[]'
profile_json TEXT NOT NULL DEFAULT '{}'   -- mission, phase, slices, CoS blocks, stubs
flags_json TEXT NOT NULL DEFAULT '{}'     -- pinned, recent, favorite, ...
health_score REAL
risk_score REAL
created_at TEXT
updated_at TEXT
```

`profile_json` for 004 includes at minimum on **localbrain**:

```json
{
  "mission": "Build Steve's Executive Operating System",
  "current_phase": "Core Infrastructure",
  "completed_slices": ["LB-OS-001", "LB-OS-002", "LB-OS-003"],
  "active_slice": "LB-OS-004",
  "next_slices": ["LB-OS-106", "LB-OS-005"],
  "recent_decisions": ["PSP approved", "localbrain home", "CFO briefing-only", "MODULARITY GATE after 004"],
  "chief_of_staff_summary": "...",
  "recommended_next_action": "Ship LB-OS-004 registry, then LB-OS-106 modularity gate.",
  "repositories": [],
  "contacts": [],
  "calendar_links": [],
  "documents": [],
  "data_sources": [],
  "ai_memory": [],
  "knowledge_graph_nodes": [],
  "goals": [],
  "kpis": [],
  "next_actions": []
}
```

### Table: `workspace_links` (graph-ready stub)

```txt
id INTEGER PRIMARY KEY
from_workspace_id TEXT NOT NULL
to_entity_type TEXT NOT NULL    -- workspace|person|organization|...
to_entity_id TEXT NOT NULL
relationship_type TEXT
metadata_json TEXT DEFAULT '{}'
created_at TEXT
```

No required seed rows — API returns `[]`.

### Table: `active_workspace` (settings)

```txt
key TEXT PRIMARY KEY   -- 'active_workspace_id'
value TEXT               -- 'localbrain'
```

---

## Seed workspaces

| workspace_id | type | title | roots (if known) | notes |
|--------------|------|-------|------------------|-------|
| **localbrain** | meta | LocalBrain | `{repoRoot}` | **Full template** — see Living Workspace Model |
| reddirt | campaign | RedDirt | `H:/RedDirt` if exists else `[]` | Stub profile OK |
| acu | engineering | ACU | stub | hidden until path confirmed |
| countyworkbench | campaign | CountyWorkbench | stub | |
| votematch | research | VoteMatch | stub | |
| general | personal | General Files | stub | |

**localbrain** must have:

```txt
workspace_avatar: 🧠 (or equivalent)
workspace_color: #3b82f6
workspace_icon: meta
flags: { pinned: true, favorite: true, recent: true }
health_score: 95
executive_context: (full paragraph per model doc)
```

Register `filesystem_roots` → `allowed_folders` via permission engine bootstrap refresh.

---

## Backend

```txt
shared/src/workspace.ts              — LivingWorkspace types (shared FE/BE)
backend/src/db/migrations/002_workspaces.sql
backend/src/workspaces/workspaceRegistry.ts
backend/src/workspaces/workspaceLinks.ts
backend/src/routes/workspaces.ts
backend/src/bootstrap.ts             — extend: seed workspaces + sync allowed folders
backend/src/workspaces/workspaceRegistry.test.ts
```

### API

```txt
GET    /api/workspaces              — list (filter query: ?flag=pinned)
GET    /api/workspaces/:id          — full LivingWorkspace
POST   /api/workspaces              — create (validate roots) — admin/minimal in 004
PATCH  /api/workspaces/:id          — update profile/flags (not required for exit if read-only OK)
POST   /api/workspaces/:id/select   — set active workspace
GET    /api/workspaces/:id/links    — [] stub
```

POST create must call `permissionEngine.checkPath` for each root (`list` action).

---

## Frontend

Replace mock-only view with **Living Workspace Dashboard** driven by API.

```txt
frontend/src/views/LivingWorkspaceDashboard.tsx   — template layout
frontend/src/components/WorkspaceHeader.tsx       — avatar, color, title, health
frontend/src/components/WorkspacePhaseCard.tsx    — mission, phase, slices
frontend/src/components/WorkspaceCoSBlock.tsx     — summary, next action, decisions
frontend/src/api/workspaces.ts
frontend/src/context/ActiveWorkspaceContext.tsx   — pill + select
frontend/src/router.tsx                           — /workspace/:id, redirect /project/:id
frontend/src/shell/CommandBar.tsx                 — load active workspace from context/API
```

### Dashboard sections (localbrain template)

```txt
Workspace header     — avatar, color, title, type, health/risk
Mission & phase
Build progress       — completed / active / next slices
Recent decisions
Chief of Staff summary
Recommended next action
executive_context    — displayed as "Why this workspace exists"
Flags badges         — pinned, needs attention, etc.
Placeholder strips   — links, repos, contacts (empty state — "Coming in later slices")
```

---

## Local visual test (required)

```bash
npm run dev
```

| Route / check | Expected |
|---------------|----------|
| http://localhost:5174/workspace/localbrain | Full LocalBrain template from API/DB |
| http://localhost:5174/project/localbrain | Redirects to /workspace/localbrain |
| `/` | Briefing still works; pill shows LocalBrain |
| Command bar pill | Title + workspace_id from registry |
| GET /api/workspaces | Includes localbrain + seeds |
| POST select | Changes active workspace pill |
| Settings / Safety | Still works — no regression |
| Add forbidden root via API | Rejected with permission reason |

---

## Validation

```bash
npm run check
npm run test
```

Unit tests:

```txt
[ ] Seed localbrain has executive_context
[ ] filesystem_root sync adds allowed_folders row
[ ] Forbidden path rejected on workspace create/update
[ ] workspace_links returns empty array
```

---

## Exit criteria

```txt
[ ] living_workspaces + workspace_links tables exist
[ ] LivingWorkspace type in shared/
[ ] localbrain seed matches template in Living Workspace Model doc
[ ] executive_context populated on localbrain
[ ] avatar, color, icon on localbrain
[ ] flags_json supports all seven flag keys (stored, UI shows subset OK)
[ ] filesystem_roots sync to permission engine
[ ] /workspace/:id dashboard data-driven
[ ] /project/:id redirects to /workspace/:id
[ ] Command bar pill uses active workspace from registry
[ ] No explorer, OpenAI, modules, or file tools
[ ] Local visual test passed
```

---

## Commit message

```txt
feat: add workspace registry and LivingWorkspace foundation
```

---

## Engines touched

```txt
ENG-WR-001 — Workspace registry (LivingWorkspace)
ENG-KP-001 — Workspace intelligence / dashboard
ENG-PM-001 — Root validation
ENG-CF-001 — Active workspace
```

---

## Next slice

**LB-OS-106** — MODULARITY GATE (before LB-OS-005 Explorer).

---

## OJT note (Teach Me ON)

LivingWorkspace is the **single object** Novel Studio, CFO, and Campaign OS attach to — like a company org chart node that owns files, people, and goals, not just a folder path.
