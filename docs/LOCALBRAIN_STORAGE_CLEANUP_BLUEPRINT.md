# LocalBrain Storage Cleanup Blueprint v1.0

> **Capability of ENG-DAI-001** (Digital Asset Intelligence) — not a separate product.  
> **Parent:** [Digital Asset Model](./LOCALBRAIN_DIGITAL_ASSET_MODEL.md) · Doctrine: [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md)

---

## Purpose

LocalBrain turns storage chaos into **actionable, approval-gated plans** — never silent deletes.

```txt
Duplicates · stale files · bloated folders · archives · old builds · node_modules bloat
```

Primary scan target: **H:** approved project roots. C: observed for pressure only.

---

## Reports (Read-Only First)

| Report | Description | Slice |
|--------|-------------|-------|
| **Storage report** | Total / free / used per drive | 007 via DAI · 033 full |
| **Large folder report** | Top N folders by size on H: | 006 · 033 |
| **Duplicate candidates** | Hash + fuzzy name clusters | 006 stub · 034 full |
| **Version clusters** | Multiple copies of same project/doc | 018 migration · 034 full |
| **Stale files** | Untouched > N days (configurable) | 033 |
| **Bloat flags** | `node_modules`, `dist`, `build`, `.next`, caches | 033 |
| **Recent heavy files** | Large files modified recently | 033 |
| **Archive candidates** | Compress/move proposals | 033 · 037 |

---

## Never Clean First

LocalBrain **never** starts by cleaning. Every cleanup session produces:

```txt
Inventory
Map
Diagnosis
Recommendations
Risk level
Approval checklist
Backup/quarantine plan
```

Only **LB-OS-010** (proposed actions) and **LB-OS-037** (execution center) may act — after explicit approval.

---

## Duplicate & Version Resolution (LB-OS-034)

```txt
Detect clusters → rank "canonical" copy (newest, in correct project, on H:)
→ present side-by-side summary
→ user picks keep / merge / quarantine
→ zero auto-delete
```

**Latest-version recommendation** is advisory. Steve approves every resolution.

---

## Bloat Patterns (H:)

```txt
**/node_modules
**/dist · **/build · **/.next · **/out
**/__pycache__ · **/.venv
**/target (Rust/Java)
old installer dumps · duplicate ZIP exports
```

Each hit: path · size · project guess · "safe to remove?" risk tier · rebuild note.

---

## UI Surfaces

| Surface | Slice | Content |
|---------|-------|---------|
| **Storage Health** card | 002 stub · 006 partial · 033 live | Free space, largest folder teaser |
| **Cleanup Recommendations** card | 002 stub · 014 advise · 033–034 live | Top proposals, risk badges |
| Storage detail | 033 | Full reports + export |
| Actions cockpit | 010 | Approve quarantine / delete / move |
| Execution center | 037 | Batch approved cleanup |

**LB-OS-002 placeholders:** **Storage Health** + **Cleanup Recommendations** — mock status until wired.

---

## Workflow Position

```txt
Read-only system map
↓
Storage report              ← this blueprint
↓
Duplicate/version report    ← this blueprint
↓
Large folder report         ← this blueprint
↓
C:/ vs H:/ placement report
↓
…
```

---

## API / Backend

```txt
backend/src/storage/storageScanner.ts    — bootstrap LB-OS-006
backend/src/storage/duplicateDetector.ts — LB-OS-034
backend/src/storage/cleanupPlanner.ts    — recommendations only
backend/src/storage/cleanupExecutor.ts   — LB-OS-037, gated
```

Quarantine target: `local_data/quarantine/` · pre-write backups: `local_data/backups/`

---

## V1 Early Capabilities (Eventual)

```txt
C:/ free space · H:/ free space
Largest folders · Duplicate candidates
Multiple versions of same project
Old builds/dist/node_modules bloat
Recent heavy files
Suggested cleanup actions (proposals only)
```

---

*Storage cleanup blueprint v1.0 · prerequisite for LB-OS-002 · 2026-06-28*
