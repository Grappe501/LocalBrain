# LocalBrain Drive Architecture Plan v1.0

> **Pillar 10 · Layer 2:** C:/ programs, H:/ work/data/storage.  
> Doctrine: [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md) · Drive rules: [Migration & Drive Doctrine §1](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md#1-drive-doctrine) · Queue: [LB-OS-032](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md#lb-os-032--c-and-h-drive-architecture-mapper)

---

## Purpose

LocalBrain must **map, explain, and enforce** Steve's two-drive layout — not treat all disks as one bucket.

```txt
C:/ = operating programs only
H:/ = work projects, data, archives, documents, repos, media, storage
```

---

## What the Mapper Produces (Read-Only First)

```txt
C:/ free space · H:/ free space
C:/ vs H:/ usage breakdown
Largest consumers per drive
Misplaced work files on C: (repos, docs, media, archives)
Program installs that could be reviewed (advisory only)
Placement report: "what belongs where"
Risk level per finding
```

**Never** auto-move or auto-delete. Placement changes are **proposals** → approval → backup → log.

---

## Scan Scope

| Drive | Scan depth | Purpose |
|-------|------------|---------|
| **C:** | Shallow + known bloat paths | Disk pressure, cache advisories, misplaced-work detection |
| **H:** | Full approved roots | Project workspace, storage intelligence, migration targets |

**Forbidden:** Index C: as project workspace · register C: roots as project folders · silent moves to C:

Enforced from LB-OS-003 (`pathValidator`) · UI badges from LB-OS-016 · full mapper LB-OS-032.

---

## Misplacement Heuristics (Advisory)

Flag paths on C: that look like work data:

```txt
git repos (.git) · node_modules under user profile
Documents/Downloads project folders · large media archives
codebases · databases · VM images · backup dumps
```

Each flag includes: path · size · suggested H: target · risk · reason.

---

## UI Surfaces

| Surface | Slice | Content |
|---------|-------|---------|
| **Drive Architecture** card (right panel) | 002 stub · 016 badges · 032 live | C:/H: gauges, misplaced count |
| Drive detail view | 032 | Full placement report |
| Explorer path badge | 016 | `C:` vs `H:` on every path |
| System efficiency dashboard | 038 | Unified drive + storage + perf |

**LB-OS-002 placeholder:** card titled **Drive Architecture** — status "Not connected" until LB-OS-032.

---

## Workflow Position

```txt
Read-only system map
↓
Storage report
↓
…
C:/ vs H:/ placement report   ← this plan
↓
RAM/CPU/disk health report
↓
Optimization plan
↓
Approval-gated actions
```

---

## API / Backend (LB-OS-032)

```txt
backend/src/system/driveMapper.ts
GET /api/system/drives          — C:/H: summary
GET /api/system/drives/placement — misplaced-work report
```

Persist snapshots in `local_data/indexes/drive_snapshots/` for trend comparison.

---

## Safety

Binding: [Safety Model §6](./LOCALBRAIN_SAFETY_MODEL.md) path rules · [§15](./LOCALBRAIN_SAFETY_MODEL.md#15-migration--reorganization-safety) dry-run before reorg.

```txt
Inventory → Map → Diagnosis → Recommendations → Risk → Approval checklist → Backup/quarantine plan → Act
```

---

*Drive architecture plan v1.0 · prerequisite for LB-OS-002 · 2026-06-28*
