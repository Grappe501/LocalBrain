# ENG-EI — Evidence Package Contract

> **Status:** Binding engineering contract · not constitutional governance  
> **Parent:** [ENG-EI-001 Charter](./ENG-EI-001-CHARTER.md) · [Engineering Discipline](./ENG-EI-ENGINEERING-DISCIPLINE.md)  
> **Canonical types:** `shared/src/memoryOs/constitutionalRetrieval.ts`  
> **Version:** `ENG-EI-001.1` (initial)

---

## Purpose

Executive Intelligence must not depend on *how* retrieval is implemented. It consumes a **stable, versioned Evidence Package Contract**.

This is the same decoupling between Retrieval and Executive Intelligence that Memory already provides between substrates and retrieval.

```text
Request
    ↓
Constitutional Retrieval
    ↓
Evidence Package Contract
    ├── Coverage Report
    ├── Citation Set
    ├── Ordering
    ├── Provenance (substrate records)
    ├── Retrieval Metadata
    └── Deterministic Version
```

---

## Contract surface

| Field | Contract obligation |
| ----- | ------------------- |
| `package_id` · `request_id` · `scope_label` | Request traceability |
| `status` · `status_reason` | Deterministic outcome — complete · withheld · insufficient_evidence |
| `retrieval_version` · `assembled_at` | Versioned, auditable assembly |
| `episodes` · `facts` · `artifacts` · `conversations` · `decision_citations` | Constitutional substrate records — read-only |
| `citations` | Citation set — every included record cited |
| `coverage_report` | Coverage transparency — searched · retrieved · excluded |

**Out of contract:** ranking · summarization · recommendations · prioritization · synthesis · probabilistic confidence.

---

## Three phases of Constitutional Retrieval

| Phase | Question | Status |
| ----- | -------- | ------ |
| **Correctness** | Is the evidence package constitutionally valid? | ✅ Proven by ENG-EI-001.1 |
| **Quality** | Is it complete, organized, and transparent? | **Current focus** |
| **Performance** | Can it be produced efficiently at scale without changing constitutional properties? | Later |

**Order is binding:** Performance must never compromise correctness or quality. Frozen doctrine makes that testable.

---

## Constitutional metrics (not model metrics)

| Metric | Question |
| ------ | ---------- |
| **Retrieval completeness** | Did we retrieve everything required by the charter? |
| **Citation integrity** | Is every returned item correctly cited and traceable? |
| **Coverage transparency** | Can we explain what was searched, returned, and deterministically excluded? |

---

## Lane 1 verification split

Both classes remain **deterministic** — they answer different questions.

### Correctness

* No invalid citations
* No missing provenance
* Deterministic ordering
* Constitutional boundaries respected (read-only · no mutation)

### Quality

* Retrieval completeness
* Coverage transparency
* Deterministic exclusion reporting
* Stable package format across versions

---

## Engineering heuristic (binding)

> **Does this make the constitutional evidence package better without making it smarter?**

| Proposal | Layer |
| -------- | ----- |
| Richer coverage report · clearer exclusion reasons | Constitutional Retrieval ✅ |
| Faster domain scan · same output shape | Performance (later) ✅ |
| Rank by likely relevance | Executive Intelligence ❌ wrong layer |

---

## Four execution layers

```text
Constitutional Memory
        ↓
Constitutional Retrieval          ← this contract
        ↓
Executive Intelligence
        ↓
Policy
```

Retrieval is not Memory. It is not Intelligence. It is the **constitutional bridge** between them.

---

## Consumer rule

Downstream Executive Intelligence slices **must** accept `ConstitutionalEvidencePackage` as input. They must not re-fetch substrates ad hoc or mutate package contents. Replaceability (Article V) depends on this boundary.

---

*ENG-EI Evidence Package Contract · LocalBrain V1 · Executive Intelligence Era · 2026*
