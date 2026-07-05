# Operational Evidence Register

> **Prime Directive:** [**Protect the evidence.**](./PRIME-DIRECTIVE.md)  
> **Purpose:** Capture observations from operator walkthroughs that inform iteration — **not** premature bug filing or architecture redesign.  
> **Phase:** [Evidence-Driven Development](./EVIDENCE-DRIVEN-DEVELOPMENT.md)

Entries here are **Operational Evidence Candidates (OECs)**. An OEC is **not a bug** until replicated, analyzed, and dispositioned through governance.

---

## OEC lifecycle

Every OEC moves through five standard states:

```text
Observed → Replicated → Analyzed → Dispositioned → Closed
```

| State | Meaning | Entry action |
| ----- | ------- | ------------ |
| **1. Observed** | Seen during a walkthrough (automated or operator) | Log in register; do not implement |
| **2. Replicated** | Confirmed by additional operators | Record operator count and consistency |
| **3. Analyzed** | Root cause understood | Document cause; link evidence packages |
| **4. Dispositioned** | Governance decision recorded | Choose outcome (below) |
| **5. Closed** | Resolution verified | Confirm fix, training, or no-change holds |

**Rule:** Observations do **not** become engineering work until **Dispositioned** with an `implementation_change` or `architecture_review` outcome.

### Disposition outcomes

| Outcome | Meaning |
| ------- | ------- |
| `no_change` | Accept current behavior; update training/docs if needed |
| `training_change` | Operator workflow or documentation adjustment |
| `implementation_change` | Bounded engineering work (doctrine-preserving) |
| `architecture_review` | Route to ADR — rare during EDD |
| `rejected` | Observation not supported by evidence |
| `deferred` | Insufficient evidence; revisit at next PRL gate |

---

## Active candidates

### OEC-001 — Jane Smith double identity review

| Field | Value |
| ----- | ----- |
| **ID** | OEC-001 |
| **Lifecycle** | **Observed** |
| **Source** | OPERATOR-WALKTHROUGH-001 automated acceptance run |
| **Observed** | 2026-07-05 |
| **Subsystem** | UCIE — Work Marketplace / Identity Resolution |

**Observation**

Jane Smith's OCR row (name-only intake) may receive **two identity-review work items**:

1. On initial OCR resolve — `review_required` creates `identity_review`.
2. After voter attachment — re-resolve still yields `review_required`, creating a second `identity_review`.

**Governance question**

Should identity review and voter verification collapse into one work item after voter attachment?

**Lifecycle log**

| Date | State | Notes |
| ---- | ----- | ----- |
| 2026-07-05 | Observed | Automated CPAT v1.0 run |
| — | Replicated | Pending PRL-4 operators |
| — | Analyzed | — |
| — | Dispositioned | — |
| — | Closed | — |

**Related:** [CPAT v1.0](./CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md) · [Walkthrough Phase 3](./WALKTHROUGH-001-SCENARIO.md#phase-3--voter-verification)

---

## Closed / resolved

### OEC-002 — PSA missing Volunteer Workspace and Manager Dashboard surfaces

| Field | Value |
| ----- | ----- |
| **ID** | OEC-002 |
| **Lifecycle** | **Closed** |
| **Source** | PSA-001 Platform State Audit · Layer 3 Dashboard Surfaces |
| **Observed** | 2026-07-05 (pre-VOP) |
| **Subsystem** | Platform coherence / operator discovery |

**Observation**

PSA-001 reported missing dedicated routes for Volunteer Workspace and Manager Dashboard. Operators could not discover coordinated volunteer execution surfaces.

**Disposition**

`implementation_change` — **VOP-001 Volunteer Work Marketplace** ([Governance Review](../vop/VOP-GOVERNANCE-REVIEW.md))

**Resolution**

- Route `/studio/volunteer` · CAP-VOP-001 · Supervisor tab
- PSA-001 regenerated: Layer 3 missing surfaces **0** · coherence **100%**

| Date | State | Notes |
| ---- | ----- | ----- |
| 2026-07-05 | Observed | PSA-001 initial crawl |
| 2026-07-05 | Dispositioned | VOP-001 scoped |
| 2026-07-05 | Closed | Operator pass + governance review APPROVE |

**Related:** [VOP-001 Operator Pass](../vop/VOP-001-OPERATOR-PASS.md) · [PSA-001 Report](./PSA-001-PLATFORM-STATE-REPORT.md)

---

## Entry template

```markdown
### OEC-NNN — Title

| Field | Value |
| ----- | ----- |
| **ID** | OEC-NNN |
| **Lifecycle** | Observed |
| **Source** | Walkthrough ID |
| **Observed** | YYYY-MM-DD |
| **Subsystem** | UCIE / Contact v3 / Intelligence |

**Observation** — what happened

**Governance question** — what we need to learn

**Lifecycle log**

| Date | State | Notes |
| ---- | ----- | ----- |
| YYYY-MM-DD | Observed | |
```

---

## Shared contract

```typescript
OEC_LIFECYCLE_STATES
OEC_DISPOSITION_OUTCOMES
OperationalEvidenceCandidate
```

---

*Operational Evidence Register · LocalBrain · 2026*
