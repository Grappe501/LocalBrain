# Digital Land Survey

> **Slice:** LB-OS-022  
> **Depends on:** LB-OS-021 ✅  
> **Engine:** ENG-DLS-001  
> **System:** [Executive OS](./LOCALBRAIN_FOUR_SYSTEMS.md) (System 1)  
> **Parent:** [Three Worlds & Projection](./LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md) · [Executive Workspace Architecture](./LOCALBRAIN_EXECUTIVE_WORKSPACE_ARCHITECTURE.md) · [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md)

---

## Core rule

```txt
Map the estate.
Do not change the estate.
```

Read-only geographic survey of Steve's Physical World before any migration simulation (023) or proposal (024).

---

## Question shift

| Slice | Question |
| ----- | -------- |
| LB-OS-019 | What exists? (inventory) |
| **LB-OS-022** | **What does this physical world actually look like?** (geography) |

---

## Five Gates (022)

| Gate | Answer |
| ---- | ------ |
| **System** | Executive OS |
| **Object** | LivingWorkspace + Projection + Location |
| **Module** | Migration / digital land survey |
| **Executive Question** | EQ-014 · EQ-015 |
| **Leverage** | Evidence-backed migration complexity before dry-run |

**Not** a new foundational object — survey report is a read-only module artifact.

---

## Binding stack (Location-aware)

```txt
Living Workspace     (Logical — identity)
        ↓
Projection           (kind · status)
        ↓
Location             (semantic slot — Primary Development · Documentation · …)
        ↓
Storage Provider     (stub in Phase 1)
        ↓
Physical Path        (H: · C: · future NAS/cloud)
```

---

## Deliverables

### `DigitalLandSurveyReport`

Single executive-readable geographic map:

| Section | Purpose |
| ------- | ------- |
| **Physical storage topology** | Volumes · scanned roots · H: top-level structure |
| **Drive utilization** | Used/free · indexed footprint · headroom |
| **Folder ownership confidence** | Workspace claim strength per significant folder |
| **Workspace coverage** | Logical workspaces vs indexed physical bindings |
| **Orphaned data** | Unclaimed folders · orphan workspaces · C: misplaced |
| **Duplicate storage regions** | Overlapping workspace roots |
| **Empty folder chains** | Dead namespace · expansion capacity |
| **Oversized media collections** | Heavy photo/video/audio folders |
| **Archive candidates** | Stale · dormant · doctrine-mismatch trees |
| **Growth/activity signals** | Recent vs dormant activity (index-derived) |
| **Migration complexity** | Per-workspace + overall score from blueprints |
| **Projection coverage** | Bound locations vs standard role slots |

---

## Data sources (read-only)

```txt
LB-OS-019 FilesystemMappingAudit
LB-OS-021 Workspace blueprints + projection coverage
System Health disk metrics (C: · H:)
digital_assets index (metadata only)
Workspace registry
```

---

## Explicit non-goals (022)

```txt
OUT: mkdir · mv · rename · delete · cleanup execution
OUT: StorageProvider runtime · cloud sync · NAS mount
OUT: new foundational objects
OUT: collapsing Three Worlds into folder-first UX
```

Mutations remain: **023 simulate → 024 propose → approve → execute**.

---

## API & route

```txt
GET /api/migration/digital-land-survey
/migration/digital-land-survey
```

Optional `?refresh=1` re-runs LB-OS-019 audit before survey (still read-only on disk).

---

## Exit criteria

```txt
[ ] DigitalLandSurveyReport contract in shared
[ ] All 12 survey sections populated from read-only sources
[ ] Links to workspace architecture blueprints
[ ] Zero moves · zero provider runtime
[ ] Tests for survey read paths
[ ] EQ-014/EQ-015 executive shell on route
```

---

## Phase 1 arc position

```txt
021  Executive Workspace Architecture + Location contract  ✅
022  Digital Land Survey                                   ← this slice
023  Migration Simulation
024  Migration Proposal Builder
025  Cutover Planner
026  Personal OS Launch
```

---

*Architecture lock · LB-OS-022 · ENG-DLS-001*
