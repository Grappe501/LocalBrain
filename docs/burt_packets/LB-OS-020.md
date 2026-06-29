# LB-OS-020 — Evidence-Based Consolidation Planner

> **Internal name:** Consolidation Planner (not Duplicate Planner)  
> **Depends on:** LB-OS-019  
> **Spec:** [Consolidation Planner](../LOCALBRAIN_CONSOLIDATION_PLANNER.md)

---

## Goal

Long-lived **evidence-based consolidation** capability: duplicates, version chains, folder consolidation, with stubs for program/knowledge — executive summary, simulate, and Consolidation Opportunity briefing metric. **Never executes.**

---

## Categories (tabs)

```txt
Duplicates · Versions · Folders · Programs (stub) · Knowledge (stub) · Ignored
```

---

## Core deliverables

| # | Deliverable |
|---|-------------|
| 1 | `shared/src/consolidation.ts` — types, evidence score, categories |
| 2 | `backend/src/consolidation/` — duplicate, version, folder intelligence + stubs |
| 3 | Evidence scorer — hash, filename, modified, workspace, references |
| 4 | `GET /api/consolidation/overview` — CoS executive summary |
| 5 | `GET /api/consolidation/:category` — tab data |
| 6 | `POST /api/consolidation/simulate` — if-approved projection (no writes) |
| 7 | UI `/migration/consolidation` — tabs + simulate panel |
| 8 | Executive Briefing: **Consolidation Opportunity** section |
| 9 | Proposals → Actions queue only after Steve approval |

---

## Flow

```txt
Recommendation → Proposal → Approval → Execution → Verification
```

020 stops at **Recommendation** and **Simulate**. Proposals created only when Steve explicitly requests.

---

## Guardrails

```txt
No moves · No deletes · No cleanup execution · No bulk actions · No cloud sync
Read-only analysis · Evidence on every row
```

---

## Commit

```txt
feat: add evidence-based consolidation planner
```

---

## Do not build

- Auto-merge, auto-delete, or background consolidation
- Whole-drive scans beyond LB-OS-019 inventory scope
- Program/knowledge execution (stubs + copy only in 020)
