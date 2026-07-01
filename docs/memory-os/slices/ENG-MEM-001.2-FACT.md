# ENG-MEM-001.2 — Fact (Slice 2)

> **Status:** **COMPLETE** — PMO accepted 2026-07-01 · **Reference Slice 002**  
> **Wave:** 1 · Canonical Storage  
> **Designation:** **Reference Slice 002** — follow Fact for all future **knowledge engineering**  
> **Object:** Fact — atomic unit of institutional knowledge  
> **Closeout:** [ENG-MEM-001.2-SLICE_CLOSEOUT.md](./ENG-MEM-001.2-SLICE_CLOSEOUT.md)  
> **Unblocks:** [ENG-MEM-001.3 Artifact](./ENG-MEM-001.3-ARTIFACT.md) — authorized

```text
Reference Implementation
ENG-MEM-001.1 Episode

Specification Fidelity
Required (100% or Not Accepted)
```

---

## The Fact Principle (binding)

Episode has:

> Something **happened**.

Fact has:

> The institution **currently accepts this as knowledge**.

Not:

> This is objectively true.

Instead:

> This is what the institution currently knows.

```text
Episode
records reality.
Fact
records institutional knowledge.
```

Episode is the atomic unit of **memory**. Fact is the atomic unit of **institutional knowledge**.

**Invariant:** Every canonical Fact must remain explainable from its provenance and lineage — knowledge never detached from evidence.

Keep validity (authority window) separate from lifecycle (institutional relationship to the record).

---

## Distinction (binding)

| Object | Records |
| ------ | ------- |
| **Episode** | Something **happened** (time-bounded event) |
| **Fact** | Something the institution **currently knows** (attestable statement) |

Episode taught the platform how to **remember events**.  
Fact teaches the platform how to **preserve institutional knowledge** — including the ability to supersede when the institution learns it was wrong.

---

## The Executive Test

Imagine the Chief of Staff says:

> The organization knows that volunteer training is complete.

An executive asks:

> Why?

The system must respond by walking the **substrate** — not by inventing an explanation:

```text
Fact
  ↓ derived_from
Episode
  ↓ supported_by
Artifacts
  ↓ validated_on
Date
  ↓ authority
DelegationGrant / DecisionCitation (when present)
```

No LLM creativity. No invented explanation. Just traceability. That is institutional trust.

Wave 1 stores the fields and relationships that make this walk possible. Wave 2+ may expose it as product behavior (see § Reserved).

---

## Mission

Implement **Fact** canonical persistence — schema, validation, serialization, lifecycle, provenance, trust envelope, **validity interval**, **supersession chain**, and audit hooks.

**Follow Reference Slice 001** (`ENG-MEM-001.1`) for file layout, validator strictness, audit pattern, tests, and commit format.

**Excluded:** graph persistence (Wave 1 slice 1 pattern) · retrieval · intelligence · in-place correction · **Explain This Fact** UI/API (reserved)

---

## Implementation priorities

### 1. Validity (authority — not lifecycle)

```text
valid_from
valid_until
```

Per [TIME_MODEL](../TIME_MODEL.md) T4: define **fact authority window** — independent of S2 lifecycle state.

### 2. Provenance (A12 substrate)

Every Fact must answer *Why does this Fact exist?* from stored provenance, lineage, authority, and timestamps alone — **no Intelligence required**.

### 3. Supersession

Facts are never edited into correctness.

```text
Fact A  ──superseded_by──►  Fact B
```

Per Vol 2: *Facts supersede — they do not update in place.*  
Per TIME_MODEL: new record + old → `Superseded` + `superseded_at` + chain integrity with reason.

When the institution was wrong, supersession preserves history while recording the correction.

### 4. Append-only

Same discipline as Episode — authoritative body immutable; corrections create new Facts.

---

## Slice structure (copy Reference Slice 001)

| Artifact | Location |
| -------- | -------- |
| Charter | This document |
| EDR | [ENG-MEM-001.2-EDR.md](./ENG-MEM-001.2-EDR.md) (on open) |
| Implementation | `backend/src/memory/` · `shared/src/memoryOs/` |
| Tests | `backend/src/memory/fact.test.ts` |
| Close-out | [ENG-MEM-001.2-SLICE_CLOSEOUT.md](./ENG-MEM-001.2-SLICE_CLOSEOUT.md) |

---

## Specification anchors

| Anchor | Document |
| ------ | -------- |
| `Vol2-Fact` | [Volume 2 § Facts](../VOLUME-2-MEMORY_DATA_MODEL.md) |
| `Registry-Fact` | [Object Registry — Fact](../CANONICAL_OBJECT_REGISTRY.md) |
| `S2-Lifecycle` | [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) |
| `S4-Provenance` | [Convention S4](../convention/CONVENTION-S4-PROVENANCE_CONTRACT.md) |
| `TIME_MODEL` | [Time Model § Validity · Supersession](../TIME_MODEL.md) |
| `TRUST` | [Trust & Provenance Model](../TRUST_PROVENANCE_MODEL.md) |
| `Ref-Slice-001` | [ENG-MEM-001.1 Episode](./ENG-MEM-001.1-EPISODE.md) |
| `Fact-Principle` | [Engineering Discipline § Fact Principle](../ENG-MEM-001-ENGINEERING_DISCIPLINE.md#the-fact-principle-binding) |

---

## Required fields (Vol 2)

| Field | Required |
| ----- | -------- |
| `fact_id` | Yes |
| `schema_version` | Yes |
| `domain` | Yes |
| `statement` | Yes |
| `subject_ref` | Yes |
| `predicate` | Yes |
| `object_ref` | No |
| `confidence` | Yes (trust envelope) |
| `valid_from` | No |
| `valid_until` | No |
| `lifecycle_state` | Yes |
| `provenance` | Yes |
| `event_at` | Yes |
| `created_at` | Yes |

---

## Deliverables

- [ ] Fact schema (`shared/src/memoryOs/fact.ts`)  
- [ ] Validator — reject unknown fields · trust envelope on `confidence`  
- [ ] Validity interval validation (`valid_from` / `valid_until` rules)  
- [ ] Supersession operation — new Fact + old → Superseded + audit  
- [ ] S2 lifecycle + S4 provenance (same patterns as Episode)  
- [ ] Persistence + append-only invariant  
- [ ] Tests including supersession chain · validity · **A12 explainability walk**  
- [ ] Closeout with **Specification Fidelity: 100%**

---

## Engineering acceptance

| # | Check | Result | Notes |
| - | ----- | ------ | ----- |
| A1 | Schema matches Volume 2 | Pending | |
| A2 | Registry fields complete | Pending | |
| A3 | S2 lifecycle implemented | Pending | |
| A4 | S4 provenance envelope | Pending | |
| A5 | Time model (event · created · valid_from/until · superseded_at) | Pending | |
| A6 | Trust metadata (`confidence` envelope) | Pending | |
| A7 | Serialization round-trip passes | Pending | |
| A8 | Append-only invariant holds | Pending | |
| A9 | Factory boundary respected | Pending | |
| A10 | No retrieval logic | Pending | |
| A11 | No intelligence logic | Pending | |
| A12 | **Explainability** | Pending | See below |

**Slice result:** Pending

---

## A12 — Explainability (binding)

Every Fact must be capable of answering:

```text
Why does this Fact exist?
```

**without using Intelligence.**

Only from:

- provenance,
- lineage,
- authority,
- timestamps,
- supporting artifact references (when present on provenance envelope).

If it cannot answer that question from stored substrate alone, it is **not** a canonical Fact.

### A12 test evidence (required in `fact.test.ts`)

At minimum one test that:

1. Creates a Fact with a complete provenance envelope and optional lineage refs.  
2. Invokes an **explain-from-substrate** helper (no LLM · no inference engine).  
3. Asserts the response cites only stored fields — provenance · authority · timestamps · supersession chain · linked Episode/Artifact refs.  
4. Asserts the response would satisfy the Executive Test walk (Fact → derived_from → Episode → …).

This is not purely technical — it is the trust bar for institutional knowledge.

---

## Reserved (not Wave 1)

| Capability | Intent |
| ---------- | ------ |
| **Explain This Fact** | Product action: click → reconstruct chain from evidence. Wave 2+ retrieval/explain surface. Wave 1 only stores what makes the walk possible. |
| **Confidence vs Freshness** | Independent dimensions — something can be very confident and very old, or new and poorly supported. Trust · lifecycle · validity · provenance already separate; do not add Freshness field in Wave 1. |

---

## Example commit message

```text
ENG-MEM-001.2
Canonical Fact storage with supersession

Implements:
Vol2-Fact
Registry-Fact
S2-Lifecycle
S4-Provenance
TIME_MODEL
TRUST
Ref-Slice-001
Fact-Principle
```

---

*ENG-MEM-001.2 Fact · Wave 1 Slice 2 · LocalBrain V1*
