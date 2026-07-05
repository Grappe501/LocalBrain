# Platform Health Score

> **Prime Directive:** [Protect the evidence.](./PRIME-DIRECTIVE.md)  
> **Primary dashboard:** [Operator Evidence Scoreboard](./OPERATOR-EVIDENCE-SCOREBOARD.md)  
> **Status:** First-class governance metric · Accepted · 2026-07-05  
> **Scope:** Every operator walkthrough — not walkthrough #1 alone

The Platform Health Score measures **operational readiness**: whether real campaign staff can accomplish the platform's governing mission under realistic conditions.

This is not code coverage. It is not test coverage. It is **evidence that the platform works as a system**.

---

## Two score layers

Every walkthrough capture produces **two complementary score layers**:

### 1. Scenario scores (walkthrough-specific)

Measure UX and workflow quality for the scenario's phases.  
For walkthrough #1, seven categories:

| Category | Phases |
| -------- | ------ |
| Intake Experience | Phase 1 |
| Identity Resolution | Phase 2 (+ commit blend) |
| Voter Verification | Phase 3 |
| Queue Workflow | Phases 1–3 (work marketplace) |
| Relationship Assignment | Phase 5 |
| AI Brief Accuracy | Phase 6 |
| Manager Visibility | Phase 7 |

Automated baseline: `computeTechnicalPlatformHealth()`

### 2. Readiness dimensions (longitudinal governance)

Roll up scenario scores into **eight governance dimensions** tracked across all walkthroughs over time:

| Dimension | What it measures |
| --------- | ---------------- |
| **Operator Readiness** | Can staff complete workflows without engineering intervention? |
| **Technical Readiness** | Do engines behave correctly under real inputs? |
| **Performance Readiness** | Are phase durations acceptable at operator scale? |
| **Training Readiness** | Can new staff learn the workflow from documentation? |
| **Operational Readiness** | Do queues, resolution, and commit paths scale? |
| **Data Quality Readiness** | Is imported data trustworthy after governance? |
| **Volunteer Readiness** | Can volunteers execute voter/OCR/queue workflows? |
| **Manager Readiness** | Do analytics reflect reality for decision-makers? |

Automated baseline: `computePlatformReadinessSnapshot()`  
Operator walkthroughs **adjust** dimension scores based on observed hesitation, questions, and recovery paths.

---

## Capture on every walkthrough

Each evidence package must include:

```text
Platform Health Score
├── Scenario scores (walkthrough-specific categories)
├── Readiness dimensions (8 longitudinal metrics)
├── Overall operator readiness (scenario average)
├── Overall readiness (dimension average)
└── Platform Readiness Level at time of capture (e.g. PRL-3)
```

Use the [evidence template](./WALKTHROUGH-001-EVIDENCE-TEMPLATE.md) — extended sections apply to all future walkthroughs.

---

## Launch thresholds (PRL-6 guidance)

| Metric | Target |
| ------ | ------ |
| Overall readiness (dimensions) | ≥ 90% |
| No single dimension | < 85% |
| Canonical acceptance test | Passing |
| Operational evidence blockers | None unresolved at PRL-5 |

Thresholds are **governance guidelines** — adjustable only via ADR or explicit readiness policy revision.

---

## Longitudinal use

Over time, dimension scores become **trend lines**, not one-time snapshots:

```text
2026-Q3  Walkthrough #1 (internal)  → baseline
2026-Q4  Walkthrough #1 (repeat)    → training + queue iteration
2027-Q1  Walkthrough #2 (TBD)       → connector hardening evidence
```

Compare:

- Operator vs automated baselines (where did humans hesitate?)
- Repeat walkthroughs (did iteration improve dimensions?)
- Internal (PRL-4) vs external pilot (PRL-5) gaps

---

## Automated vs operator scores

| Source | Role |
| ------ | ---- |
| **Automated** (`walkthrough001.test.ts`) | PRL-3 gate; regression benchmark; technical floor |
| **Operator** (evidence template) | PRL-4+ gate; UX friction; training gaps; authoritative for launch |

Operator scores **supersede** automated scores for governance decisions at PRL-4 and above. Automated scores remain the **permanent regression floor**.

---

## Shared contracts

| Symbol | Location |
| ------ | -------- |
| `PLATFORM_HEALTH_CATEGORIES` | `shared/src/operatorReadiness/walkthrough001.ts` |
| `READINESS_DIMENSIONS` | `shared/src/operatorReadiness/platformReadiness.ts` |
| `computeTechnicalPlatformHealth` | `shared/src/operatorReadiness/scoring.ts` |
| `computePlatformReadinessSnapshot` | `shared/src/operatorReadiness/readinessScoring.ts` |

---

*Platform Health Score · LocalBrain Governance · 2026*
