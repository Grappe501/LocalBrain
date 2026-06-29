# LocalBrain System Optimization Doctrine v1.0

> **Pillar 10:** System Optimization & Performance Command Center.  
> North star: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Queue: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md)

---

## North Star Language

```txt
LocalBrain is the control layer that helps Steve keep his machine organized, fast, lean,
backed up, and purpose-built around C:/ as the program drive and H:/ as the work/data drive.
```

---

## Four Layers

LocalBrain manages optimization as **one command center**, not scattered tools:

```txt
1. Folder/file cleanup
2. Drive architecture: C:/ programs, H:/ work/data/storage
3. Storage optimization: duplicates, stale files, bloated folders, archives
4. Performance optimization: CPU, RAM, disk pressure, startup/load issues
```

| Layer | Doc | Bootstrap slices | Full slices |
|-------|-----|------------------|-------------|
| 1. Folder/file cleanup | [Storage Cleanup Blueprint](./LOCALBRAIN_STORAGE_CLEANUP_BLUEPRINT.md) | 006, 010 | 031–034, 037 |
| 2. Drive architecture | [Drive Architecture Plan](./LOCALBRAIN_DRIVE_ARCHITECTURE_PLAN.md) | 003, 016 | 032 |
| 3. Storage optimization | [Storage Cleanup Blueprint](./LOCALBRAIN_STORAGE_CLEANUP_BLUEPRINT.md) | 006, 018 | 033–034 |
| 4. Performance | [Performance Monitor Blueprint](./LOCALBRAIN_PERFORMANCE_MONITOR_BLUEPRINT.md) | 007, 014 | 035–036, 038 |

---

## What LocalBrain Does First (Never Clean First)

```txt
Read-only system map
↓
Storage report
↓
Duplicate/version report
↓
Large folder report
↓
C:/ vs H:/ placement report
↓
RAM/CPU/disk health report
↓
Optimization plan
↓
Approval-gated cleanup actions
```

**Critical rule:** LocalBrain **never** starts by cleaning.

It starts by producing:

```txt
Inventory
Map
Diagnosis
Recommendations
Risk level
Approval checklist
Backup/quarantine plan
```

Only then does it act (LB-OS-010 + LB-OS-037).

Binding: [Safety Model §15](./LOCALBRAIN_SAFETY_MODEL.md#15-migration--reorganization-safety) · [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md)

---

## Practical Capabilities (V1 → Full)

LocalBrain eventually shows:

```txt
C:/ free space · H:/ free space
Largest folders · Duplicate candidates
Multiple versions of same project
Old builds / dist / node_modules bloat
Recent heavy files
RAM usage · CPU usage · Disk usage
System uptime · High-load processes
Suggested cleanup actions (proposals only until approved)
```

---

## OS Shell Integration (From LB-OS-002)

Right panel / dashboard **placeholders** designed day one:

```txt
Storage Health
Performance Health
Drive Architecture
Cleanup Recommendations
API Performance          ← Pillar 11 (key status, Direct API, planned features)
```

Stub data OK in 002 — live data wires in 006/007/032–038 (Pillar 10) and 008/040–046 (Pillar 11).

```txt
Pillar 10 = machine performance (CPU, RAM, disk, storage)
Pillar 11 = API performance (tokens, cache, queue, streaming)
```

---

## Queue Arc (LB-OS-031–038)

| Slice | Focus |
|-------|-------|
| 031 | Optimization doctrine embedded |
| 032 | C:/ and H:/ drive architecture mapper |
| 033 | Storage cleanup intelligence |
| 034 | Duplicate and version resolution planner |
| 035 | CPU/RAM/disk performance monitor (full) |
| 036 | Process and startup advisor |
| 037 | Safe cleanup execution center |
| 038 | System efficiency dashboard |

**Depends on:** LB-OS-015 minimum; full value after LB-OS-024 migration context.

**Gate:** **OPTIMIZATION COMMAND** = LB-OS-038

---

## Later (Post–038)

```txt
Startup app review · Service monitoring · Cache cleanup
Automated backup strategy · Local model management · Dev environment repair
```

Not V1 — advise and monitor first.

---

## Foundation Rule (Before LB-OS-002)

```txt
This doctrine + Drive Architecture Plan + Storage Cleanup Blueprint +
Performance Monitor Blueprint must exist before LB-OS-002 code.
LB-OS-002 includes dashboard placeholders for all four optimization cards.
```

---

*System optimization doctrine version 1.0 · 2026-06-28*
