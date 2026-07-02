# ENG-EI — Engineering Discipline

> **Status:** Binding for all Executive Intelligence Era implementation commits · [ENG-EI-DOC-001](./ENG-EI-DOC-001-ENGINEERING-DISCIPLINE.md)  
> **Parent:** [ENG-EI-001 Charter](./ENG-EI-001-CHARTER.md) · `ei-doctrine-v1.0`  
> **Philosophy:** Implementation is an exercise in **Doctrine Fidelity, not invention**.

> **Principle:** Every evidence package must be valuable before reasoning touches it — read-only, cited, traceable, auditable, and reconstructable even if the reasoning layer were completely disabled.

> **Production line:** Charter → Doctrine → Implementation → Verification → PMO Acceptance → Closeout

```text
──────── Governance complete ────────
ENG-PMO-006  Executive Intelligence Doctrine Freeze
ENG-PMO-007  Governance refinements
OPS-004      Platform synchronized to doctrine
ENG-EI-DOC-001  Engineering discipline frozen
──────── Engineering begins here ────────
ENG-EI-001.1 Constitutional Retrieval
```

Every implementation commit after this line must trace back to the frozen doctrine.

---

## Rule 1 — Doctrine-traceable commits (binding)

**Every ENG-EI commit must begin with a Doctrine Fidelity block.**

This is the Executive Intelligence equivalent of **specification traceability** enforced throughout the Institutional Cognition Foundation.

Do not use opaque messages:

```text
Add retrieval service
fix citation bug
```

Use structured messages:

```text
ENG-EI-001.1
Constitutional Retrieval — substrate read path

Doctrine Fidelity
Article I   PASS
Article II  PASS
Article III N/A
Article IV  PASS
Article V   PASS
Article VI  N/A
Article VII N/A
Article VIII PASS
Article IX  PASS

Implements
ENG-EI-001.1
Constitutional Retrieval

Doctrine:
Articles II
IV
VIII
IX

Verification:
Lane 1

Specification:
ENG-EI-001 Charter
```

### Commit message template

```text
ENG-EI-<slice>
<One-line summary>

Doctrine Fidelity
Article I   PASS|N/A|FAIL
Article II  PASS|N/A|FAIL
...
Article IX  PASS|N/A|FAIL

Implements
ENG-EI-<slice>
<Slice name>

Doctrine:
Articles <list>

Verification:
Lane <1|2|3>

Specification:
<Charter or slice doc>
```

### Article reporting rules

| Value | Meaning |
| ----- | ------- |
| **PASS** | Slice behavior satisfies this article at its boundary |
| **N/A** | Article not applicable to this slice (must be justified in slice charter) |
| **FAIL** | **Never ship** — fix before commit |

**PMO acceptance requires 100% Doctrine Fidelity** — all applicable articles PASS, no unexplained N/A on binding articles for the slice.

Optional body lines: `Tests:`, `Acceptance:`, `Blocks:`, `Negative guards:`.

---

## Rule 2 — Infrastructure before intelligence

Executive Intelligence engineering proceeds in layers. Do not skip layers.

```text
Constitutional Substrates
        │
        ▼
Retrieval                    ← ENG-EI-001 (deterministic)
        │
        ▼
Citation Assembly            ← ENG-EI-001 (deterministic)
        │
        ▼
Evidence Package             ← ENG-EI-001 (deterministic)
        │
        ▼
Reasoning Engine             ← later ENG-EI slices (probabilistic)
        │
        ▼
Executive Work Product       ← later ENG-EI slices
```

**ENG-EI-001 tests remain almost entirely deterministic.** Probabilistic behavior belongs after the evidence package exists.

---

## Rule 3 — Product boundary at retrieval

By the end of Constitutional Retrieval, the platform answers:

> **Prepare everything relevant to this issue.**

Not:

> **Tell me what to do.**

The output is a **constitutional evidence package**:

* Episodes
* Facts
* Artifacts
* Conversations
* DecisionCitations

…ordered, cited, packaged, and ready. Only after that exists does Executive Assessment become possible.

---

## Rule 4 — Verification lane assignment

Every ENG-EI commit declares which verification lane it primarily protects:

| Lane | Protects | Typical ENG-EI scope |
| ---- | -------- | -------------------- |
| **1 Constitutional** | The institution | Read-only · no mutation · citation integrity |
| **2 Behavioral** | Leadership | Work product boundaries · recommendation vs decision |
| **3 Operational** | Availability | Runtime · degradation · observability |

See [Verification Lanes](./VERIFICATION-LANES.md). Never average lanes into a single score.

### Retrieval completeness (early EI standard)

Lane 1 eventually measures two distinct qualities:

| Measure | Question |
| ------- | -------- |
| **Citation accuracy** | Is everything cited correct? |
| **Retrieval completeness** | Was everything constitutionally relevant included? |

Missing relevant constitutional material is a different failure than citing incorrectly. Both belong in Lane 1 as the corpus grows — not necessarily in ENG-EI-001.1, but early in the Executive Intelligence Era.

---

## Rule 5 — ENG / OPS / ENG-PMO separation

Same discipline as the Institutional Cognition Foundation:

| Prefix | When |
| ------ | ---- |
| **ENG-EI** | Implementation against frozen doctrine |
| **OPS** | Dashboards · metrics · observability |
| **ENG-PMO** | Acceptance · ceremony · governance (rare post–007) |

Do not mix governance refinements into ENG-EI implementation commits.

---

## Defining sentences

> **Constitutional Retrieval reads and cites. It does not reason or recommend.**

> **DecisionCitation records authority. It does not perform authority.**

Companion for later slices:

> **Executive Intelligence recommends. Policy decides. The Ledger records.**

---

## Authorized sequence

```text
ENG-EI-001 Constitutional Retrieval
        ↓
ENG-EI-001.x implementation slices (doctrine-traceable commits)
        ↓
PMO acceptance
        ↓
Later ENG-EI slices (reasoning · work products)
```

---

*ENG-EI Engineering Discipline · LocalBrain V1 · Executive Intelligence Era · 2026*
