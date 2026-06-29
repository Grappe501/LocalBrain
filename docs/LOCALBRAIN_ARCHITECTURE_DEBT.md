# Architecture Debt Score

> **Engine:** ENG-ADS-001 (planned)  
> **System:** [Executive OS](./LOCALBRAIN_FOUR_SYSTEMS.md) — Engineering Department scoreboard  
> **Phase:** 1+ (instrumentation grows with Engineering Studio)  
> **Parent:** [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md) · [Engineering Department](./LOCALBRAIN_ENGINEERING_DEPARTMENT.md)

---

## Principle

Steve tracks executive and operational health. Engineering needs a **quantitative view of the platform itself** — when the codebase needs attention before features accumulate debt.

**Architecture Debt Score (ADS)** complements Operational Health and Engineering Score: those measure machine and repo; ADS measures **architectural integrity**.

---

## Example surface

```txt
Architecture Debt
  92 — Excellent
───────────────────────
Kernel Size           Excellent
Coupling              Excellent
Duplicate Logic       Good
Module Boundaries     Excellent
Documentation         Excellent
Tests                 Good
Object Purity         Excellent
```

Engineering Studio surfaces ADS alongside repo scan and checklist — not on Executive Briefing headline (construction metric, not executive leverage).

---

## Definition

Composite index (0–100) of **platform structural health** — how well the codebase honors Four Systems, Five Gates, module boundaries, and foundational objects.

| Band | Score | Meaning |
| ---- | ----- | ------- |
| Excellent | 85–100 | Ship features confidently |
| Good | 70–84 | Minor tightening recommended |
| Fair | 55–69 | Schedule architecture slice |
| Poor | <55 | Stop feature creep · fix platform |

---

## Components (draft weights)

| Component | Weight | Signal |
| --------- | ------ | ------ |
| Kernel size | 15% | LOC / exports in kernel vs modules |
| Coupling | 15% | Cross-module imports without shared contracts |
| Duplicate logic | 15% | Overlapping executive summaries · duplicate EQ answers |
| Module boundaries | 15% | Manifest compliance · no business logic in kernel |
| Documentation | 10% | Burt packet · checklist · architecture doc linkage |
| Tests | 15% | Coverage on spine routes · integration audit pass |
| Object purity | 10% | New types only in `@localbrain/shared` frozen set |

Weights tunable; formula **inspectable** in Engineering Studio.

---

## Data sources (Phase 1 feasible)

| Source | Component |
| ------ | --------- |
| `integration/audit` | Duplicate summaries · orphan routes · shell consistency |
| Module loader registry | Module boundaries |
| `buildState` · git metrics | Documentation · test file counts |
| Static heuristics | Kernel import graph (future) |
| [Five Gates](./LOCALBRAIN_FIVE_GATES_RULE.md) checklist in Burt packets | Documentation gate |

---

## Relationship to other metrics

| Metric | Measures |
| ------ | -------- |
| Operational Health | Machine + ops |
| Engineering Score | Repo · tests · checklist per project |
| **Architecture Debt** | **Platform structural integrity** |
| Integration audit (020.5) | Executive cohesion subset of ADS |

ADS **duplicate logic** component feeds from integration audit `duplicate_executive_summaries` and orphan counts.

---

## Surfaces

```txt
Engineering Studio        — primary ADS dashboard
Program Office            — optional link when ADS < Good (platform risk)
Not Executive Briefing    — not an executive leverage metric
```

---

## Contract (planned)

```txt
ArchitectureDebtReport {
  score                    — 0–100
  band_label               — excellent | good | fair | poor
  components[]             — { id, label, score, band, detail }
  integration_audit_ref    — optional link to ENG-EQ-001 audit
  observed_at
  recommendations[]      — "tighten module X boundary"
}
```

---

## Honesty rules

- Heuristic scores — labeled as estimates where not machine-verifiable
- ADS drop triggers **architecture work**, not shame
- Feature slices must not lower ADS below Fair without explicit Decision + Assumption review

---

*Architecture Debt Score · ENG-ADS-001 · 2026-06-29*
