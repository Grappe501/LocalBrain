# LocalBrain Evidence-Based Consolidation Planner v2.0

> **Slice:** LB-OS-020 · **Internal name:** Consolidation Planner (not "Duplicate Planner")  
> **Reframe:** **First Executive Intelligence slice** — LocalBrain begins *reasoning* about Steve's environment  
> **Depends on:** LB-OS-019 (filesystem mapping audit)  
> **Doctrine:** [Executive Intelligence Cards](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md) · [Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md) · [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md) · Safety: [Safety Model § Migration](./LOCALBRAIN_SAFETY_MODEL.md) · [Constitution](./LOCALBRAIN_CONSTITUTION.md)

---

## Phase shift: collect → reason

Up to LB-OS-019, LocalBrain **collected and organized** information (inventory, registry, audit). LB-OS-020 is where it begins **reasoning** about the environment — prioritizing, assessing risk, estimating review time, and explaining **decision friction**, not just listing candidates.

```txt
Before 020:  "427 duplicate candidates"
After 020:   Executive Consolidation Briefing — opportunity, priorities, risk, friction
```

**Primary deliverable:** an **Executive Consolidation Briefing** — a scored stack of **[Executive Intelligence Cards](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md)** with summary header, not a utility report.

**Permanent concepts introduced in 020:** EIC presentation model · universal seven-score standard · Simulation as first-class pipeline stage ([Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md)).

---

## Executive Consolidation Briefing (primary surface)

Route: `/migration/consolidation` · also feeds Executive Briefing + CoS narrative.

```txt
Executive Consolidation Briefing
Overall Opportunity
──────────────────
Storage reclaim:           387 GB
Workspace simplification:  High
Duplicate confidence:      98%
Estimated review time:     24 minutes
Decision friction:         Medium → Low after consolidation

Top Priorities (Executive Intelligence Cards)
──────────────
┌─ Consolidate ContactListSOS Versions ─────────────┐
│ Category: Version Chain · Priority: High          │
│ Confidence 98% · Friction reduction: High         │
│ Impact: Reduces "which folder is current?"        │
│ Time: 3 min · Benefit: 7 decision points removed  │
│ Simulation: Available · Proposal: Not generated   │
└───────────────────────────────────────────────────┘
1. Three version chains in ContactListSOS
2. Five duplicate media folders
3. Two inactive workspace roots
4. Old Node installations (planned category — stub)
5. Archive candidates (>18 months)

Risk Assessment
───────────────
High-risk items:   0
Medium-risk:      12
Low-risk:        186

Nothing has been changed.
```

| Block | Purpose |
| ----- | ------- |
| **Overall Opportunity** | Quantified upside + confidence + time to review |
| **Top Priorities** | Ranked actions with **decision-friction** narrative |
| **Risk Assessment** | Evidence-grounded safety bands |
| **Footer** | Binding safety reminder — zero mutations in 020 |

Detail tabs (Duplicates · Versions · Folders · …) are **drill-down**, not the primary experience.

---

## Decision friction (north star for copy)

The long-term value is not reclaiming disk space. It is **reducing decision friction**.

| Utility framing (avoid) | Executive framing (required) |
| ----------------------- | ---------------------------- |
| "You have 4 copies." | "Every time you search for this project, you decide which folder is current. Consolidating reduces future decision overhead." |
| "412 GB reclaimable." | "387 GB reclaimable · 24 min review · High workspace simplification." |
| "112 version chains." | "Three version chains in ContactListSOS — probable keeper identified with 98% evidence." |

Every priority row includes `decision_friction` (short narrative) when the engine can infer it.

---

## Consolidation Score (ENG-CNS-001)

Alongside Operational Health, Engineering Score, and Relationship Health — introduce a **digital environment health** metric:

```txt
Consolidation Score
92 / 100
Healthy
Trend ↑ +4 this month
```

| Component | Weight (draft) | Meaning |
| --------- | -------------- | ------- |
| Duplicate density | 20% | Hash-identical groups per GB indexed |
| Version fragmentation | 15% | Probable chains without clear keeper |
| Workspace fragmentation | 20% | Sibling folders / orphan roots |
| Orphan assets | 15% | Assets without workspace linkage |
| Archive opportunities | 10% | Stale assets (>18 mo) with low reference count |
| Naming consistency | 10% | Pattern variance within workspace |
| Storage efficiency | 10% | Reclaimable bytes / total indexed |

**Surfaces:** Consolidation Briefing header · Executive Briefing **Consolidation Opportunity** block · optional Program Office drill-down (read-only).

Score is **computed from evidence**, stored with timestamp for trend (↑/↓ vs prior run).

---

## Pipeline architecture (single responsibility per stage)

```txt
Registry (digital_assets + LB-OS-019 inventory)
        ↓
Evidence Engine          — evidence providers → scored signals
        ↓
Consolidation Engine     — categories, grouping, ranking, friction narrative
        ↓
Simulation Engine        — if-approved projection (in-memory only) [shared]
        ↓
Executive Briefing       — EIC stack + opportunity · risk · Consolidation Score
        ↓
Proposal Generator       — Steve-initiated only → LB-OS-010 shape
        ↓
Actions Queue            — Approval → Execution → Verification → Learning
```

Binding pipeline: [Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md) — **Simulation is first-class** before Proposal.

**LB-OS-020 implements:** Recommendation → Simulation → Briefing (EIC). Proposal+ via LB-OS-010; Learning stubbed until Phase 2.

---

## Evidence providers (extensible plug-ins)

Even when only duplicates and version chains ship in v1, the Evidence Engine is **provider-based** — new evidence types are plug-ins, not monolith edits.

```txt
backend/src/consolidation/
  providers/
    DuplicateEvidenceProvider.ts    ✅ v1
    VersionEvidenceProvider.ts      ✅ v1
    FolderEvidenceProvider.ts       ✅ v1
    ProgramEvidenceProvider.ts      🔜 stub
    KnowledgeEvidenceProvider.ts    🔜 stub
  evidenceEngine.ts                 — register providers, merge signals
  consolidationEngine.ts            — group, rank, friction narrative
  simulationEngine.ts               — dry-run projection
  briefingComposer.ts               — EIC[] + Executive Consolidation Briefing summary
  proposalGenerator.ts              — explicit Steve action only
  consolidationService.ts           — API facade
  consolidation.test.ts
shared/src/consolidation.ts
shared/src/executiveIntelligenceCard.ts   — EIC types + universal scores (ENG-EIC-001)
backend/src/intelligence/cardComposer.ts  — normalize → EIC
backend/src/simulation/simulationEngine.ts — shared dry-run contract
```

Provider contract:

```txt
EvidenceProvider {
  id, category
  collect(context) → EvidenceSignal[]
  explain(signals) → string   // human "why"
  frictionNarrative(group) → string | null
}
```

Future backends (Google Drive, NAS, network share) add providers — same interface as AI provider adapters.

---

## Five consolidation categories

| # | Category | LB-OS-020 scope | Provider |
|---|----------|-----------------|----------|
| 1 | **Duplicate files** | ✅ Live | `DuplicateEvidenceProvider` |
| 2 | **Version chains** | ✅ Live | `VersionEvidenceProvider` |
| 3 | **Folder consolidation** | ✅ Live | `FolderEvidenceProvider` |
| 4 | **Program consolidation** | 🔜 Stub tab | `ProgramEvidenceProvider` |
| 5 | **Knowledge consolidation** | 🔜 Stub tab | `KnowledgeEvidenceProvider` |

### Version chains (example)

```txt
Report.docx · Report_v2.docx · Report_v3 FINAL.docx · Report_FINAL2.docx
→ probable chain · suggested keeper · decision-friction narrative
```

### Folder consolidation (example)

```txt
Campaign · Campaign Old · Campaign Backup · Campaign Copy
→ one logical workspace hypothesis · friction: "which folder is current?"
```

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

**UI:** score + signal breakdown per drill-down row. No recommendation without `reason`, `evidence_signals[]`, and `decision_friction` when inferable.

---

## UI: briefing-first, tabs as drill-down

```txt
[ Executive Consolidation Briefing — hero ]
Consolidation Score · Overall Opportunity · Top Priorities · Risk

Tabs: Duplicates | Versions | Folders | Programs | Knowledge | Ignored
```

- **Ignored** — Steve-dismissed recommendations (persist dismiss, never auto-act)
- **Programs / Knowledge** — placeholder + "coming later" copy

---

## Simulate (dry-run preview)

```txt
If approved…
  387 GB recovered
  231 duplicate files removed
  14 folders merged
  27 workspaces cleaned
  0 files deleted without approval path
  Everything reversible
```

**Simulate** runs Simulation Engine only — feeds approval checklist, does not enqueue actions.

---

## Executive Briefing hook

[Executive Briefing Model](./LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md#consolidation-opportunity-lb-os-020):

```txt
CONSOLIDATION OPPORTUNITY
  consolidation_score          — 92/100 Healthy (↑4)
  reclaimable_storage_bytes
  workspace_simplification     — High | Medium | Low
  duplicate_confidence         — aggregate evidence %
  estimated_review_minutes
  risk_band                    — high / medium / low counts
  executive_summary            — "Nothing has been changed."
```

Links to `/migration/consolidation`. **No auto-consolidation** from briefing.

---

## Binding flow

```txt
Recommendation → Simulation → Proposal → Approval → Execution → Verification → Learning
```

**LB-OS-020 never executes.** Through Simulation only until Steve generates a Proposal.

---

## Guardrails

```txt
Read-only analysis · Recommendations only · No moves · No deletes
No cleanup execution · No bulk actions · No cloud sync in 020
Simulate and propose → Approval queue → later execution (021–026)
```

---

## After 020: Phase 1 Integration Pass (LB-OS-020.5)

Before expanding into 021–026, pause for one sprint: [Phase 1 Integration Pass](./LOCALBRAIN_PHASE1_INTEGRATION_PASS.md).

**Objective:** make everything already built feel like **one Executive OS** — cross-links, drill-downs, consistent shell — not new capabilities.

---

## LB-OS-034 relationship

Phase 5 **LB-OS-034** duplicate/version resolution **deepens** this engine (optimization command center), not a separate tool. Consolidation Planner is canonical from 020 onward.

---

## Exit criteria

```txt
[ ] ExecutiveIntelligenceCard types + universal seven-score standard (ENG-EIC-001)
[ ] Pipeline stages: evidence → consolidation → simulation → EIC briefing (providers extensible)
[ ] Each priority renders as Executive Intelligence Card (not table row)
[ ] Consolidation Score (ENG-CNS-001) with component breakdown + trend
[ ] Decision-friction narrative + scores on every card
[ ] Simulation first-class on cards before Proposal
[ ] Tabs: Duplicates, Versions, Folders (+ Programs/Knowledge stubs) — drill-down to same EIC model
[ ] Consolidation Opportunity on Executive Briefing (read-only card summary)
[ ] Zero file mutations · proposals route to Actions only when Steve approves
```

**Commit:** `feat: add evidence-based consolidation planner`

---

*Evidence-Based Consolidation Planner · LB-OS-020 · Executive Intelligence v1 · 2026-06-29*
