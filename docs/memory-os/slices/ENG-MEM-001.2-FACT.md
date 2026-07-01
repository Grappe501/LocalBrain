# ENG-MEM-001.2 — Fact (Slice 2)

> **Status:** **Authorized** — PMO accepted 2026-07-01  
> **Wave:** 1 · Canonical Storage  
> **Object:** Fact — atomic attestable statement  
> **Blocks:** ENG-MEM-001.3 (Artifact)

```text
Reference Implementation
ENG-MEM-001.1 Episode

Specification Fidelity
Required (100% or Not Accepted)
```

---

## Distinction (binding)

| Object | Records |
| ------ | ------- |
| **Episode** | Something **happened** (time-bounded event) |
| **Fact** | Something **is known** (attestable statement) |

Episode taught the platform how to **remember events**.  
Fact teaches the platform how to **preserve knowledge**.

**Invariant:** Every canonical Fact must remain explainable from its provenance and lineage — knowledge never detached from evidence.

Keep validity (authority window) separate from lifecycle (institutional relationship to the record).

---

## Mission

Implement **Fact** canonical persistence — schema, validation, serialization, lifecycle, provenance, trust envelope, **validity interval**, **supersession chain**, and audit hooks.

**Follow Reference Slice 001** (`ENG-MEM-001.1`) for file layout, validator strictness, audit pattern, tests, and commit format.

**Excluded:** graph persistence (Wave 1 slice 1 pattern) · retrieval · intelligence · in-place correction

---

## Implementation priorities

### 1. Validity (authority — not lifecycle)

```text
valid_from
valid_until
```

Per [TIME_MODEL](../TIME_MODEL.md) T4: define **fact authority window** — independent of S2 lifecycle state.

### 2. Provenance

Every Fact must answer *why does this exist?* from stored provenance alone — no Intelligence required.

### 3. Supersession

Facts are never edited into correctness.

```text
Fact A  ──superseded_by──►  Fact B
```

Per Vol 2: *Facts supersede — they do not update in place.*  
Per TIME_MODEL: new record + old → `Superseded` + `superseded_at` + chain integrity with reason.

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
- [ ] Tests including supersession chain + validity  
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

**Slice result:** Pending

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
```

---

*ENG-MEM-001.2 Fact · Wave 1 Slice 2 · LocalBrain V1*
