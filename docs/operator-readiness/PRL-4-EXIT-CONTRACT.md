# PRL-4 Exit Contract v1.0

> **Status:** Accepted · 2026-07-05  
> **Applies to:** [PRL-4 — Internal Operator Validated](./PLATFORM-READINESS-LEVELS.md)  
> **Phase:** [Evidence-Driven Development](./EVIDENCE-DRIVEN-DEVELOPMENT.md)

PRL advancement is **evidence-based**, not subjective. This contract defines objective completion criteria for exiting PRL-4.

Guidelines below are **governance targets** — adjustable only via explicit readiness policy revision or ADR.

---

## Exit criteria

| # | Criterion | Guideline | Required |
| - | --------- | --------- | -------- |
| 1 | **Canonical walkthroughs completed** | All canonical walkthroughs completed by internal operators with signed evidence packages | ✅ |
| 2 | **Minimum internal operators** | ≥ **3** distinct internal operators complete each canonical walkthrough | ✅ |
| 3 | **Platform Readiness Score** | Overall readiness ≥ **90%** (readiness dimension average) | ✅ |
| 4 | **Readiness dimension floor** | No dimension below **85%** in any signed operator package | ✅ |
| 5 | **OECs dispositioned** | All [Operational Evidence Candidates](./OPERATIONAL-EVIDENCE-REGISTER.md) reviewed and dispositioned | ✅ |
| 6 | **No operator blockers** | No open Severity-1 or Severity-2 operator blockers | ✅ |
| 7 | **Training completion** | Internal operator training completed and recorded | ✅ |
| 8 | **Session integrity** | Facilitator card followed · dedicated Evidence Scribe · contamination logged if P0/P1 assistance given | ✅ |
| 9 | **Walkthrough #1 frozen** | OPERATOR-WALKTHROUGH-001 unchanged after exit · registered as permanent operator regression | ✅ |

**Canonical walkthroughs (v1.0):**

| Walkthrough | Evidence template |
| ----------- | ----------------- |
| [OPERATOR-WALKTHROUGH-001](./WALKTHROUGH-001-SCENARIO.md) | [Template](./WALKTHROUGH-001-EVIDENCE-TEMPLATE.md) |

---

## Severity definitions (operator blockers)

| Severity | Definition | PRL-4 impact |
| -------- | ---------- | ------------ |
| **S1** | Operator cannot complete canonical walkthrough | Blocks exit |
| **S2** | Operator completes walkthrough but with data loss, wrong merge, or trust violation | Blocks exit |
| **S3** | Friction, confusion, recoverable errors — captured as OEC | Does not block if dispositioned |
| **S4** | Cosmetic, documentation, nice-to-have | Does not block |

S3 observations should become **OECs**, not bug tickets, until replicated and analyzed.

---

## Sign-off package

To approve PRL-4 exit, governance receives:

1. **Evidence packages** — one per operator per canonical walkthrough (minimum 3 operators × 1 walkthrough = 3 packages for v1.0)
2. **Session role record** — facilitator, Evidence Scribe, and contamination log per [Facilitator Card](./OPERATOR-SESSION-FACILITATOR-CARD.md)
3. **Platform Readiness Snapshots** — dimension scores from each package
4. **PRL-4 Exit Contract Assessment** — criteria checklist with evidence refs
5. **OEC disposition log** — all candidates at `dispositioned` or `closed`
6. **Training completion record**
7. **CPAT v1.0** — still passing in CI

---

## Assessment template

| Criterion | Met | Evidence ref | Notes |
| --------- | --- | ------------ | ----- |
| Canonical walkthroughs completed | ☐ | | |
| ≥ 3 internal operators | ☐ | | |
| Overall readiness ≥ 90% | ☐ | | |
| No dimension < 85% | ☐ | | |
| All OECs dispositioned | ☐ | | |
| No S1/S2 blockers | ☐ | | |
| Training complete | ☐ | | |
| Session integrity (facilitator + scribe + contamination log) | ☐ | | |
| Walkthrough #1 frozen post-exit | ☐ | | |

**Exit approved:** ☐ Yes · ☐ No  
**Assessor:** _______________ **Date:** _______________

---

## Shared contract

```typescript
PRL4_EXIT_CONTRACT_ID
PRL4_EXIT_CRITERIA
PRL4_READINESS_SCORE_TARGET      // 90
PRL4_READINESS_DIMENSION_FLOOR   // 85
PRL4_MINIMUM_INTERNAL_OPERATORS  // 3
Prl4ExitContractAssessment
```

---

*PRL-4 Exit Contract v1.0 · LocalBrain · 2026*
