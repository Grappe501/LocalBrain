# LB-OS-020 — Evidence-Based Consolidation Planner

> **LOCALBRAIN V1 ROADMAP** · Architecture FROZEN · Implementation mode
>
> ```txt
> □ Executive Office Certification
> □ Session 4
> □ Session 5
> □ Theory Freeze
> □ Convention
> □ Empty Brain Factory
> □ Memory OS
> □ Communications Office
> □ Commercial Beta
>
> Everything else → VERSION2_BACKLOG.md
> ```


> **Reframe:** First **Executive Intelligence** slice — introduces **Executive Intelligence Cards** (ENG-EIC-001)  
> **Internal name:** Consolidation Planner (not Duplicate Planner)  
> **Depends on:** LB-OS-019  
> **Spec:** [Consolidation Planner](../LOCALBRAIN_CONSOLIDATION_PLANNER.md) · [EIC](../LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md) · [Action Pipeline](../LOCALBRAIN_ACTION_PIPELINE.md)

---

## Goal

LocalBrain begins **reasoning** about Steve's environment. Primary output: **Executive Consolidation Briefing** = summary header + stack of **Executive Intelligence Cards** (universal seven-score standard). Includes Consolidation Score (ENG-CNS-001), evidence providers, **Simulation as first-class** stage, Executive Briefing hook. **Never executes.**

---

## Permanent concepts (first introduction)

| Concept | Doc |
| ------- | --- |
| Executive Intelligence Cards | [EIC](../LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md) |
| Universal 7 scores | Importance · Confidence · Urgency · Effort · Benefit · Friction · Risk |
| Action Pipeline | Recommendation → **Simulation** → Proposal → Approval → Execution → Verification → Learning |

---

## Pipeline (build in this order)

```txt
Registry → Evidence Engine → Consolidation Engine → Simulation Engine (shared)
         → Briefing (EIC[]) → Proposal Generator → Actions Queue (010+)
```

020 ships: Recommendation + Simulation + EIC briefing. Proposals only on explicit Steve action.

---

## Evidence providers (v1)

| Provider | Status |
| -------- | ------ |
| `DuplicateEvidenceProvider` | ✅ Implement |
| `VersionEvidenceProvider` | ✅ Implement |
| `FolderEvidenceProvider` | ✅ Implement |
| `ProgramEvidenceProvider` | 🔜 Stub |
| `KnowledgeEvidenceProvider` | 🔜 Stub |

---

## Core deliverables

| # | Deliverable |
|---|-------------|
| 1 | `shared/src/executiveIntelligenceCard.ts` — EIC + universal scores (ENG-EIC-001) |
| 2 | `shared/src/consolidation.ts` — consolidation + Consolidation Score types |
| 3 | `backend/src/intelligence/cardComposer.ts` — normalize → EIC |
| 4 | `backend/src/simulation/simulationEngine.ts` — shared dry-run contract |
| 5 | `backend/src/consolidation/providers/*` + engines + `briefingComposer.ts` → EIC[] |
| 6 | `GET /api/consolidation/briefing` — cards + summary |
| 7 | `GET /api/consolidation/:category` · `POST /api/consolidation/simulate` |
| 8 | UI `/migration/consolidation` — **EIC stack** hero + drill-down tabs |
| 9 | Consolidation Opportunity on Executive Briefing (top card summary) |
| 10 | Proposals → Actions only after Steve approval |

---

## Executive Intelligence Card (required per priority)

```txt
Title · Category · Priority
Scores: Importance · Confidence · Urgency · Effort · Benefit · Friction · Risk
Evidence % · Executive Impact · Estimated Time · Estimated Benefit
Pipeline: Recommendation ✓ · Simulation Available · Proposal Not generated
Actions: Review · Simulate · Generate Proposal · Dismiss
```

---

## Do not build

- Table-row priorities without EIC component
- Per-department custom scoring UI
- Auto-merge/delete · monolithic engine · list-first utility report
- Skip Simulation before Proposal (Steve may waive with ack)

---

## After this slice

**LB-OS-020.5** — adopt EIC cross-links on existing surfaces where data exists.

---

## Commit

```txt
feat: add evidence-based consolidation planner
```
