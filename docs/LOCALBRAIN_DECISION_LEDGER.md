# LocalBrain Decision Ledger v1.0

> **First-class record of binding choices** — so CoS can say *"we chose this because…"* years later.  
> Foundational object: **Decision** · Parent: [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md)

---

## Why it exists

Architecture and business decisions today live in docs and chat. The Decision Ledger makes them **queryable, versioned, and binding** for the Chief of Staff and future agents.

```txt
"We chose LivingWorkspace over Project Registry because…"
→ Decision record · status: Binding · date: 2026-06-28
```

When CoS recommends a redesign, it checks the ledger before suggesting reversal.

---

## Decision object (frozen)

| Field | Purpose |
|-------|---------|
| `decision_id` | Stable slug — `DEC-WR-001-living-workspace` |
| `title` | Short label |
| `summary` | One-paragraph decision statement |
| `reason` | Plain-language rationale |
| `status` | proposed · accepted · binding · superseded · revoked |
| `decided_at` | ISO date |
| `decided_by` | Default `steve` |
| `supersedes` | Optional `decision_id` chain |
| `superseded_by` | Optional reverse link |
| `tags` | architecture · product · safety · workspace · … |
| `related_workspace_ids` | Optional scope |
| `evidence_links` | Doc paths, slice IDs, PR refs |

**Distinct from WorkspaceEvent:** Events are *what happened* in a workspace timeline. Decisions are *binding choices* that govern the OS.

---

## Example records (seed when implemented)

### DEC-WR-001 — LivingWorkspace replaces Project Registry

```txt
Title:     LivingWorkspace replaces Project Registry
Reason:    One object model supports campaigns, novels, finance, research,
           and engineering without parallel registries.
Date:      2026-06-28
Status:    Binding
Supersedes: Project Registry (pre-004)
Doc:       LOCALBRAIN_LIVING_WORKSPACE_MODEL.md
Slice:     LB-OS-004
```

### DEC-KE-001 — Knowledge Explorer replaces Explorer

```txt
Title:     LB-OS-005 builds Knowledge Explorer, not a file manager clone
Reason:    Windows Explorer handles folders; LocalBrain's advantage is meaning —
           six lenses, workspace mapping, typed search, Explain this folder.
           Internal chain: Filesystem → KnowledgeSource → Workspace → executive_context.
Date:      2026-06-28
Status:    Binding
Supersedes: Explorer-as-primary-object framing (pre-005)
Doc:       LOCALBRAIN_KNOWLEDGE_EXPLORER.md
Slice:     LB-OS-005
```

### DEC-PL-001 — Host Platform (Layer 0)

```txt
Title:     Layer 0 is Host Platform, not "Windows only"
Reason:    Portability for Windows, Linux, macOS, GPU server, and cloud nodes
           over the next decade.
Date:      2026-06-28
Status:    Binding
Doc:       LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md
```

### DEC-PL-002 — Foundational object freeze (ten objects)

```txt
Title:     Ten foundational objects frozen before module acceleration
Reason:    Coherence at scale — millions of LOC without architectural drift.
Date:      2026-06-28
Status:    Binding
Objects:   LivingWorkspace, WorkspaceEvent, WorkspaceLink, KnowledgeSource,
           Decision, Memory, Agent, Capability, Module, Engine
```

### DEC-KN-001 — Knowledge Source abstraction

```txt
Title:     User-facing "Knowledge Source" replaces "database"
Reason:    CoS and studios query one engine; adapters hide storage mechanics.
Date:      2026-06-28
Status:    Binding
Engine:    ENG-KN-001 (planned)
```

### DEC-MEM-001 — Memory split into six domains

```txt
Title:     Memory evolves in six independent domains
Reason:    Personal, workspace, and system recall must not collide in one blob.
Date:      2026-06-28
Status:    Binding
Doc:       LOCALBRAIN_MEMORY_DOMAINS.md
```

### DEC-DT-001 — Digital Twin as composed apex

```txt
Title:     Digital Twin is composed view, not eleventh foundation object
Reason:    CoS consults twin built from workspaces, memory, sources, decisions,
           and health — not a monolithic duplicate store.
Date:      2026-06-28
Status:    Binding
Doc:       LOCALBRAIN_DIGITAL_TWIN.md
```

### DEC-PL-003 — Windows desktop + Linux GPU server

```txt
Title:     Daily machine Windows; heavy AI on Linux GPU server later
Reason:    Familiar desktop shell + dedicated inference/backend power.
Date:      2026-06-28
Status:    Binding
Doc:       LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md
```

---

## Chief of Staff usage

```txt
Before recommending architecture change → query Decision Ledger
Executive Briefing "Recent Decisions" → surface binding decisions + workspace events
"What did we decide about X?" → ledger search, not doc grep
```

---

## Implementation (planned)

```txt
Table: decisions (SQLite in local_data/localbrain.db)
API:  GET /api/decisions · GET /api/decisions/:id · POST (Steve-only, gated)
Seed: binding decisions above on first migrate
Link: WorkspaceEvent type decision_accepted mirrors ledger entries
```

Target slice: early post-106 kernel work — before major module expansion.

---

## Related docs

| Doc | Role |
|-----|------|
| [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md) | Decisions feed "why" |
| [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) | WorkspaceEvent timeline |
| [Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) | Executive memory holds decision context |

---

*Decision Ledger v1.0 · 2026-06-28*
