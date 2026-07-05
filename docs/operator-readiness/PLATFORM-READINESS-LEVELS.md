# Platform Readiness Levels (PRL)

> **Status:** Accepted · 2026-07-05  
> **Purpose:** Measurable path to deployment — replaces subjective labels like "beta" or "release candidate"

Platform Readiness Levels describe **where the governed platform is in its journey to production**, not how many features exist.

---

## Levels

| Level | Name | Meaning | Entry criteria |
| ----- | ---- | ------- | -------------- |
| **PRL-1** | Architecture Complete | Governing contracts frozen; subsystems defined | Constitution, architecture v1.0, ADRs accepted |
| **PRL-2** | Certified Core Implemented | Reference-pattern vertical slices complete | UCIE + Contact v3 certified engines implemented |
| **PRL-3** | Automated Acceptance Passing | Canonical acceptance test passes in CI | [CPAT v1.0](./CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md) green |
| **PRL-4** | Internal Operator Validated | Real campaign staff complete walkthroughs with evidence | [PRL-4 Exit Contract](./PRL-4-EXIT-CONTRACT.md) satisfied |
| **PRL-5** | External Pilot Validated | Selected external campaign teams operate successfully | Pilot evidence; no PRL-4 blockers unresolved |
| **PRL-6** | Production Ready | Governed launch authorized | All readiness dimensions meet launch thresholds |

---

## Current status (2026-07-05)

**Phase:** [Evidence-Driven Development](./EVIDENCE-DRIVEN-DEVELOPMENT.md)

```text
✅ PRL-1  Architecture Complete
✅ PRL-2  Certified Core Implemented
✅ PRL-3  Automated Acceptance Passing
⏳ PRL-4  Internal Operator Validated        ← current gate ([exit contract](./PRL-4-EXIT-CONTRACT.md))
⏳ PRL-5  External Pilot Validated
⏳ PRL-6  Production Ready
```

**PRL-4 gate:** Kelly, Chris, and internal operators run [OPERATOR-WALKTHROUGH-001](./WALKTHROUGH-001-SCENARIO.md) using the [evidence template](./WALKTHROUGH-001-EVIDENCE-TEMPLATE.md).

---

## What PRL is not

| Not this | Because |
| -------- | ------- |
| Code coverage | Measures implementation, not operational readiness |
| Feature count | Platform maturity ≠ feature sprawl |
| "Beta" label | Subjective; not tied to trust boundaries |
| Single deploy flag | PRL is longitudinal; may differ by subsystem over time |

---

## Relationship to acceptance tests

| PRL | Primary evidence |
| --- | ---------------- |
| PRL-3 | Automated `walkthrough001.test.ts` |
| PRL-4 | Operator evidence packages + Platform Health Score |
| PRL-5 | External pilot evidence packages |
| PRL-6 | Sustained dimension scores + governance sign-off |

The [Canonical Platform Acceptance Test v1.0](./CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md) is the **permanent benchmark** from PRL-3 onward. Higher levels add **human operational proof**, not different tests.

---

## Advancing a level

1. **Demonstrate** entry criteria with evidence (automated or operator).
2. **Record** Platform Readiness Snapshot with dimension scores.
3. **Review** at governance — no self-promotion without sign-off.
4. **Document** blockers in [Operational Evidence Register](./OPERATIONAL-EVIDENCE-REGISTER.md) if advancing with known friction.

---

## Shared contract

```typescript
// shared/src/operatorReadiness/platformReadiness.ts
PLATFORM_READINESS_LEVELS
PLATFORM_READINESS_LEVEL_LABELS
PlatformReadinessSnapshot
```

---

*Platform Readiness Levels · LocalBrain · 2026*
