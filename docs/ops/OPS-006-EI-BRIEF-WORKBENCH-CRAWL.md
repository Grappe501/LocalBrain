# OPS-006 — Representation Sync (PMO-009)

> **Type:** Operations — institutional truth fidelity · not implementation  
> **Status:** **COMPLETE** — 2026-07-02  
> **Prerequisite:** [ENG-PMO-009](../memory-os/ENG-PMO-009-EXECUTIVE-BRIEF-ACCEPTANCE.md) · deterministic pipeline closed  
> **Next:** Communications Office charter (controlled experiment)

---

## Purpose

Synchronize every operational surface to **post–ENG-PMO-009 engineering truth** — deterministic executive pipeline closed · Reference Consumer 001 · Communications Office next.

```text
Engineering truth     commits · contracts · PMO · tests
Operational truth     dashboards · checklists · workbench · briefings
OPS-006 gate          no contradiction between the two
```

---

## Acceptance gate

> **Can every operational surface that communicates project state derive the same phase, milestone, and next action from the authoritative engineering record without contradiction?**

---

## Authoritative posture

```text
phase:           Execution · deterministic EI closed
milestone:       ENG-PMO-009 · ENG-EI-002 COMPLETE · Reference Consumer 001
contract:        Work Product Contract ENG-EI-002.2 · 7/7 brief tests
pipeline:        Memory → Retrieval → Evidence Package → Executive Brief — CLOSED
building_today:  ENG-EI-002 COMPLETE · Reference Consumer 001 · deterministic pipeline closed
next:            Communications Office — bounded probabilistic language generation
```

---

## Surfaces synchronized

| Area | Change |
| ---- | ------ |
| **EI era metrics** | `work_product_complete` · `reference_consumer_id` · PMO-009 detection |
| **Command Center** | Communications blocker → `Communications Office pending` |
| **Workspace seed + projection** | PMO-009 posture · Communications next |
| **Live surfaces** | surface registry · workspace projection |
| **Briefing & cards** | Executive Intelligence **complete** · Communications **active** |
| **Launch snapshot** | critical path · finishability · Burt mission |
| **Phase checklist gate** | Communications next · EI complete |

---

## Verification

```bash
cd backend && node --import tsx --test src/buildState/buildState.test.ts
cd backend && node --import tsx --test src/liveSurface/liveSurface.test.ts
```

Do **not** use full `npm test` for gate verification — see [OPS-TEST-004](./OPS-TEST-004-BACKEND-NPM-SCOPE-OVERRUN.md).

---

*OPS-006 · LocalBrain V1 · Execution phase · 2026*
