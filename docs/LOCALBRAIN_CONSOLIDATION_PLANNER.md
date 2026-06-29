# LocalBrain Evidence-Based Consolidation Planner v1.0

> **Slice:** LB-OS-020 · **Internal name:** Consolidation Planner (not "Duplicate Planner")  
> **Depends on:** LB-OS-019 (filesystem mapping audit)  
> **Doctrine:** [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md) · Safety: [Safety Model § Migration](./LOCALBRAIN_SAFETY_MODEL.md)

---

## Why "Consolidation" not "Duplicates"

Duplicates are **one** consolidation type. This slice builds a **long-lived executive capability** — evidence-based recommendations across files, versions, folders, and (later) programs and knowledge — reusable on H:, Google Drive, NAS, GPU server, and network shares without rewriting the engine.

```txt
Duplicate Planner        →  one-off cleanup tool
Consolidation Planner    →  executive capability for years
```

---

## Binding flow (unchanged)

```txt
Recommendation → Proposal → Approval → Execution → Verification
```

**LB-OS-020 never executes.** Dry-run, simulate, and propose only. Execution stays behind LB-OS-010 approval queue and later migration slices.

---

## Five consolidation categories

| # | Category | LB-OS-020 scope | Detection basis |
|---|----------|-----------------|-----------------|
| 1 | **Duplicate files** | ✅ Live | Same hash / same content — high confidence |
| 2 | **Version chains** | ✅ Live | Filename patterns, modified dates, workspace — *probable chain*, not "duplicate" |
| 3 | **Folder consolidation** | ✅ Live | Sibling folders (Campaign / Campaign Old / Campaign Backup…) — one logical workspace |
| 4 | **Program consolidation** | 🔜 Stub tab | Node/Python/VS/SDK sprawl on C: — later slice |
| 5 | **Knowledge consolidation** | 🔜 Stub tab | Multiple markdown/decision/meeting docs → canonical merge — much later |

### Version chains (example)

```txt
Report.docx
Report_v2.docx
Report_v3 FINAL.docx
Report_FINAL2.docx
Report_NEW.docx
```

Output: **probable version chain** with recommended keeper — not flattened into duplicate groups.

### Folder consolidation (example)

```txt
Campaign
Campaign Old
Campaign Backup
Campaign Copy
Campaign 2025
```

Output: **folder consolidation opportunity** — one logical workspace hypothesis.

---

## Evidence score model

Every recommendation explains **why**.

```txt
Evidence Score  98%
Signals: hash · filename · modified · workspace · references · size
```

| Signal | Weight (initial) | Notes |
|--------|------------------|-------|
| Hash match | High | Duplicate files |
| Filename similarity | Medium | Versions + folders |
| Modified date ordering | Medium | Version chains |
| Workspace linkage | Medium | Orphan vs claimed |
| Registry references | Low–medium | Intelligence engine |
| Path proximity | Medium | Folder consolidation |

**UI:** show score + signal breakdown per row. No recommendation without `reason` and `evidence_signals[]`.

---

## UI: recommendation tabs

```txt
Duplicates  |  Versions  |  Folders  |  Programs  |  Knowledge  |  Ignored
```

- **Duplicates** — hash-identical groups (extends ENG-ST / asset intelligence)
- **Versions** — probable chains + suggested keeper
- **Folders** — logical workspace merge candidates
- **Programs** — placeholder / "coming later" (category 4)
- **Knowledge** — placeholder / "coming later" (category 5)
- **Ignored** — Steve-dismissed recommendations (persist dismiss, never auto-act)

Route: `/migration/consolidation` (or tab under `/migration`)

---

## Chief of Staff executive summary

CoS briefing block (read-only):

```txt
We found:
  • 427 duplicate candidates
  • 112 version chains
  • 14 folder consolidation opportunities
  • 8 orphan workspaces
  • Estimated reclaim: 412 GB

Nothing has changed.
```

Generated from consolidation overview API — no mutations.

---

## Simulate (dry-run preview)

```txt
If approved…
  412 GB recovered
  231 duplicate files removed
  14 folders merged
  27 workspaces cleaned
  0 files deleted
  Everything reversible
```

**Simulate** button runs in-memory projection only — feeds approval checklist, does not enqueue actions.

---

## Consolidation Opportunity metric (Executive Briefing)

New briefing section introduced in LB-OS-020 (read-only until Steve acts):

```txt
CONSOLIDATION OPPORTUNITY
  Reclaimable storage:     412 GB (estimated)
  Workspace simplification: 14 folder merges · 8 orphans
  Knowledge consolidation:  (future)
  Risk score:              low–medium (evidence-grounded)
```

| Field | Source |
|-------|--------|
| `reclaimable_storage_bytes` | Sum of duplicate + superseded version bytes (deduped estimate) |
| `workspace_simplification_count` | Folder + orphan workspace opportunities |
| `knowledge_opportunities` | Stub 0 until category 5 |
| `risk_score` | Max risk across open recommendations |

Spec hook: [Executive Briefing Model](./LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md#consolidation-opportunity-lb-os-020)

---

## Architecture (reusable engine)

```txt
backend/src/consolidation/
  evidenceScorer.ts       — signal weights + explanation
  duplicateIntelligence.ts
  versionIntelligence.ts
  folderIntelligence.ts
  programIntelligence.ts  — stub
  knowledgeIntelligence.ts — stub
  consolidationService.ts — overview + tabs + simulate
  consolidation.test.ts
shared/src/consolidation.ts
GET /api/consolidation/overview
GET /api/consolidation/:category
POST /api/consolidation/simulate  — dry-run only, no writes
```

Builds on:

- `digital_assets` registry + hashes (LB-OS-006/007)
- Filesystem mapping audit (LB-OS-019)
- Placement / orphan signals from migration audit

Future providers: Google Drive, NAS, network share — same **adapter interface** as AI providers (evidence in, recommendations out).

---

## Guardrails (unchanged from migration phase)

```txt
Read-only analysis · Recommendations only · No moves · No deletes
No cleanup execution · No bulk actions · No cloud sync in 020
Simulate and propose → Approval queue → later execution
```

---

## LB-OS-034 relationship

Phase 5 **LB-OS-034** duplicate/version resolution becomes a **deepening** of this engine (optimization command center), not a separate one-off tool. Consolidation Planner is canonical from 020 onward.

---

## Exit criteria

```txt
[ ] Consolidation overview API with executive summary
[ ] Tabs: Duplicates, Versions, Folders (+ Programs/Knowledge stubs)
[ ] Evidence score + why on every recommendation
[ ] Simulate dry-run panel
[ ] Consolidation Opportunity on Executive Briefing (read-only)
[ ] Zero file mutations · proposals route to Actions when Steve approves
```

**Commit:** `feat: add evidence-based consolidation planner`

---

*Evidence-Based Consolidation Planner · LB-OS-020 · 2026-06-29*
