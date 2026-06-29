# Executive Workspace Architecture

> **Slice:** LB-OS-021  
> **Depends on:** LB-OS-020.5 (integration gate passed)  
> **Engine:** ENG-EWA-001 (planned)  
> **System:** [Executive OS](./LOCALBRAIN_FOUR_SYSTEMS.md) (System 1)  
> **Parent:** [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md) · [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) · [Five Gates](./LOCALBRAIN_FIVE_GATES_RULE.md)

---

## Principle

LB-OS-021 is **not** a folder builder. It is the **Executive Workspace Architecture Builder** — the physical manifestation of the Executive OS on disk.

```txt
Wrong framing:  Where should this folder go?
Right framing:  Which Living Workspace owns this?
```

**Folders are an implementation detail.** The workspace owns the folder — never the reverse.

---

## Binding hierarchy

Filesystem is the **last** layer, not the first:

```txt
Executive Mission          (Phase 2 — Mission Stack; stub links in 021)
        ↓
Living Workspace           (owns identity · Workspace DNA)
        ↓
Knowledge Sources          (ingest · index · catalog)
        ↓
Digital Assets             (registry · intelligence)
        ↓
Filesystem                 (projection · filesystem_root)
```

This preserves months of architecture: the Executive OS owns the logical world; H: is one projection.

---

## Five Gates (021)

| Gate | Answer |
| ---- | ------ |
| **System** | Executive OS |
| **Object** | LivingWorkspace (+ KnowledgeSource · DigitalAsset links) |
| **Module** | Migration / workspace architecture module (not kernel) |
| **Executive Question** | EQ-014 — *How should I migrate my world?* · EQ-015 — *What is on my H: drive?* |
| **Leverage** | Safe Personal OS cutover; workspace-first migration traceability |

---

## Deliverables (021)

### 1. Workspace DNA

Every workspace gets **immutable identity** — everything else derives from it:

```txt
Workspace ID
Mission                    (link · label · Phase 2 mission_id stub)
Owner
Created
Purpose
Success Definition
Filesystem Root            (current + recommended)
Knowledge Sources[]
Primary Department
Mission Category
Lifecycle
Health
```

Extends [LivingWorkspace](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) — no new foundational object.

Example:

```txt
H:\Projects\ContactListSOS\   ← projection

Living Workspace: ContactListSOS
filesystem_roots: [ H:\Projects\ContactListSOS ]
```

### 2. Workspace Blueprint (before touching disk)

Per workspace — **read-only** · **simulation-ready** · **zero moves**:

```txt
Workspace:        RedDirt
Current Root:     H:\OldProjects\Campaigns\RedDirt
Recommended Root: H:\Projects\Campaigns\RedDirt
Confidence:       98%
Why:              Matches drive doctrine · org tree · audit evidence
Migration Impact: 12 folders · 241 files · 0 broken workspace refs
Simulation:       Available
```

Blueprints compose from LB-OS-019 audit + LB-OS-020 consolidation + workspace registry.

### 3. Organization Tree (not folder tree)

Executive structure — each node maps to **Living Workspace**, **Collection**, or **Archive**:

```txt
Steve
├── Projects
│   ├── Campaigns
│   ├── Creative
│   ├── Research
│   └── Business
├── Education
├── Archives
├── Shared
└── System
```

Rendered in UI as **organization tree**; filesystem paths are derived labels on nodes.

### 4. Digital Land Survey (foundation for 022)

021 ships the **survey contract** and initial pass; **022** completes full Digital Land Survey engine.

Survey maps before any move:

```txt
Existing folders
Existing workspace ownership
Orphans (folder without workspace · workspace without folder)
Boundary conflicts
Naming inconsistencies
Empty lots (unused namespace)
Future expansion capacity
```

Like surveying land before building a house.

---

## Explicit non-goals (021)

```txt
OUT: folder creation on disk
OUT: folder moves · renames · deletes
OUT: auto-migration execution
OUT: ChatGPT import (deferred — Phase 2 import arc)
OUT: new foundational objects
```

All mutations remain **023+ simulation → 024 proposals → approval → execution**.

---

## Commercialization

Customers never receive `H:\Projects\`. They receive an **Executive Workspace Blueprint** installer flow:

```txt
Where do you keep Projects? Archives? Media? Documents? Backups?
        ↓
Generate physical layout from Organization Tree + Workspace DNA
        ↓
Platform grows with them
```

See [Knowledge Taxonomy](./LOCALBRAIN_KNOWLEDGE_TAXONOMY.md) · [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md).

---

## Phase 1 finish arc (revised binding)

```txt
021  Executive Workspace Architecture     ← blueprints · org tree · Workspace DNA
022  Digital Land Survey                   ← full survey · orphans · boundaries
023  Migration Simulation                  ← dry-run batches · impact · rollback preview
024  Migration Proposal Builder            ← proposed_actions from approved simulations
025  Cutover Planner                       ← sign-off · domain replacements · rollback
026  Personal OS Launch                    ← LocalBrain primary for Steve's work world
```

Every proposed change traceable to **workspace → mission → executive purpose** before any file moves.

**Deferred from old arc (Phase 2 import arc, slice TBD):** ChatGPT knowledge import · project memory transfer — not blocking Personal OS launch.

---

## Exit criteria (021)

```txt
[ ] Workspace DNA schema extended in shared + registry
[ ] Organization Tree model + Steve canonical tree seeded
[ ] Workspace Blueprint generator (read-only) per registered workspace
[ ] Blueprint UI route · EQ-014/EQ-015 shell · LiveSurfaceBanner
[ ] Digital Land Survey contract + initial survey report API
[ ] Zero filesystem mutations in 021 code paths
[ ] Integration with LB-OS-019 audit + LB-OS-020 consolidation evidence
[ ] Five Gates checklist in Burt packet
[ ] PHASE_CHECKLIST updated
```

**Commit:** `feat: add executive workspace architecture builder`

---

## Related docs

| Doc | Role |
| --- | ---- |
| [Migration Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md) | C:/H: rules |
| [Consolidation Planner](./LOCALBRAIN_CONSOLIDATION_PLANNER.md) | Evidence for blueprints |
| [Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md) | 024+ proposal flow |

---

*Executive Workspace Architecture · LB-OS-021 · ENG-EWA-001 · 2026-06-29*
