# ENG-EI-001 — Constitutional Retrieval

> **Status:** **IN PROGRESS** — quality phase · `ENG-EI-001.1`–`ENG-EI-001.2` **COMPLETE** · `ei-doctrine-v1.0` frozen  
> **Milestone name:** **Constitutional Retrieval**  
> **Prerequisite:** [EI-001 Doctrine Freeze](./EI-001-DOCTRINE-FREEZE.md) · [ENG-PMO-006](./ENG-PMO-006-EI-DOCTRINE-FREEZE.md) · `ei-doctrine-v1.0`  
> **Specification:** Frozen [Executive Intelligence Doctrine](./EXECUTIVE-INTELLIGENCE-DOCTRINE.md) — fidelity-first  
> **Engineering discipline:** [ENG-EI Engineering Discipline](./ENG-EI-ENGINEERING-DISCIPLINE.md) · [ENG-EI-DOC-001](./ENG-EI-DOC-001-ENGINEERING-DISCIPLINE.md)  
> **Governance:** [ENG / OPS / ENG-PMO commit histories](./ENG-PMO-GOVERNANCE.md)

---

## Engineering philosophy

> **Prove the plumbing before introducing intelligence.**

> **Fidelity-first:** Did we implement the doctrine faithfully? — not "Is the doctrine still correct?"

The **Institutional Cognition Foundation** was architecture-first (**Specification Fidelity**). The **Executive Intelligence Era** is fidelity-first (**Doctrine Fidelity**). The doctrine is frozen at `ei-doctrine-v1.0`.

This is not "build the Chief of Staff." It is the same progression that served the Institutional Cognition Foundation: constitutional fidelity first, probabilistic capability later.

**Binding discipline:** Same ENG / OPS / ENG-PMO separation. No advisory behavior ships in this slice.

---

## Doctrine Fidelity (binding)

Every ENG-EI slice — including this one — must report **Doctrine Fidelity** against Articles I–IX:

```text
Article I      PASS
Article II     PASS
...
Article IX     PASS
Doctrine Fidelity:
100%
```

This is the Executive Intelligence Era equivalent of **Specification Fidelity** during the Institutional Cognition Foundation.

ENG-EI-001 applies Articles II · IV · VIII · IX at the retrieval boundary (read · cite · withhold · no mutation). Full article matrix applies to later slices that emit work products.

**Commit discipline:** Every ENG-EI commit begins with the Doctrine Fidelity block — see [ENG-EI Engineering Discipline](./ENG-EI-ENGINEERING-DISCIPLINE.md) · Rule 1.

---

## Product outcome (binding)

By slice closeout, the platform must answer:

> **Prepare everything relevant to this issue.**

The output is a **constitutional evidence package** — Episodes · Facts · Artifacts · Conversations · DecisionCitations — ordered, cited, packaged, and ready. No recommendations. No reasoning. No course of action.

Only after evidence packaging exists does Executive Assessment become possible.

## Mission

> Implement read-only constitutional substrate access with citation assembly and evidence packaging — exactly as frozen in `ei-doctrine-v1.0`.

ENG-EI-001 delivers the **retrieval substrate** on which Executive Intelligence will later reason. It does not deliver Executive Intelligence.

---

## Scope (binding)

| In scope | Out of scope |
| -------- | ------------ |
| Read-only constitutional substrate access | Reasoning · synthesis · inference · prioritization |
| Citation assembly over Episode · Artifact · Fact · Conversation · DecisionCitation | Recommendations · Executive Options · planning |
| Evidence packaging for downstream advisory layer | LLM calls · probabilistic judgment · work products |
| Citation integrity validation | Work product generation |
| Safe empty states (insufficient evidence reporting) | Substrate mutation · Policy gates |
| Traceability metadata on assembled evidence bundles | Auto-approval · Decision Ledger writes |

```text
Constitutional Retrieval
        ↓
Read-only substrate access
        ↓
Citation assembly
        ↓
Evidence packaging
        ↓
(No synthesis · No prioritization · No reasoning · No recommendations · No planning)
```

---

## Engineering constraints (binding)

| Constraint | Rule |
| ---------- | ---- |
| Doctrine | Implements Articles II · IV · VIII · IX — read · cite · burden of proof at retrieval boundary |
| Substrates | Read-only — no write path to Episode · Artifact · Fact · Conversation · DecisionCitation |
| Reasoning | No reasoning — no inference · no synthesis · no ranking · no prioritization |
| Recommendations | No recommendations — no Executive Brief · Assessment · Options · Recommendation · Risk Assessment |
| Planning | No planning — no sequence proposals · no course-of-action generation |
| AI | No LLM calls as product behavior in this slice |
| Safe degradation | Retrieval failure → insufficient evidence report · incomplete citations → withhold bundle · Article VIII |
| Replaceability | No model coupling in stored artifacts — Article V |

If a pull request introduces advisory behavior, it belongs in a later ENG-EI slice — not in ENG-EI-001.

---

## Relationship to Wave 1

ENG-EI-001 consumes Wave 1 outputs. It does not extend substrate semantics.

| Substrate | ENG-EI-001 role |
| --------- | --------------- |
| Episode | Read · cite · assemble evidence |
| Artifact | Read · cite · assemble evidence |
| Fact | Read · cite · assemble evidence |
| Conversation | Read · cite · assemble evidence |
| DecisionCitation | Read · cite · assemble evidence |

All Institutional Cognition Foundation integrity classes (A12–A17) remain enforced. Constitutional Retrieval inherits them — it does not relax them.

---

## Acceptance criteria (planned)

| # | Criterion | Status |
| - | --------- | ------ |
| A1 | Read-only access to all five constitutional substrates | ⬜ |
| A2 | Citation assembly produces valid substrate reference sets | ⬜ |
| A3 | Evidence packaging includes traceability metadata | ⬜ |
| A4 | No code path mutates constitutional substrates (MAR-3 Q1 negative) | ⬜ |
| A5 | No uncited evidence bundle emitted (MAR-3 Q3 negative) | ⬜ |
| A6 | Retrieval failure reports insufficient evidence — no fabrication (MAR-3 Q6 negative) | ⬜ |
| A7 | Evidence bundle withheld when citation set below minimum (Article IX · burden of proof) | ⬜ |
| A8 | Doctrine Fidelity — applicable articles PASS at retrieval boundary | ⬜ |
| A9 | PMO slice acceptance | ⬜ |

---

## Authorized sequence

```text
EI-001 doctrine freeze (ei-doctrine-v1.0)
        ↓
ENG-EI-001 Constitutional Retrieval     ← this charter
        ↓
Implementation slices
        ↓
PMO acceptance
        ↓
Later ENG-EI slices (reasoning · work products · advisory layer)
```

No Executive Intelligence implementation code ships before EI-001 freeze.

---

## Defining sentence (effective at authorization)

> **Constitutional Retrieval assembles constitutional records. It does not evaluate them.**

Layer progression:

* **Memory preserves constitutional records.**
* **Constitutional Retrieval assembles constitutional records.**
* **Executive Intelligence reasons over constitutional records.**
* **Policy decides.**
* **Decision Ledger records authority.**

Companion to the Institutional Cognition Foundation:

> **DecisionCitation records authority. It does not perform authority.**

---

## Implementation slices

| Slice | Scope | Status |
| ----- | ----- | ------ |
| [ENG-EI-001.1](./slices/ENG-EI-001.1-CONSTITUTIONAL-RETRIEVAL.md) | Substrate read path · evidence package · coverage report | ✅ **COMPLETE** |
| [ENG-EI-001.2](./slices/ENG-EI-001.2-RETRIEVAL-COMPLETENESS.md) | Completeness · rule-level exclusions · citation integrity | ✅ **COMPLETE** |
| [ENG-EI-001.3](./slices/ENG-EI-001.3-RETRIEVAL-ORDERING-AUDIT.md) | Ordering · request/package fingerprints · retrieval audit | ✅ **COMPLETE** |

---

*ENG-EI-001 · Constitutional Retrieval · IN PROGRESS · quality phase · LocalBrain V1 · Executive Intelligence Era · 2026*
