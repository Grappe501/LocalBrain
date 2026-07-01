# ENG-MEM-001.3 — Artifact (Slice 3)

> **Status:** **COMPLETE** — PMO accepted 2026-07-01 · **Reference Slice 003** (evidence engineering)  
> **Wave:** 1 · Canonical Storage  
> **Designation:** **Reference Slice 003** — follow Artifact for all future **evidence engineering**  
> **Object:** Artifact — canonical evidence record  
> **Index:** [Reference Slices](./REFERENCE_SLICES.md)  
> **Unblocks:** ENG-MEM-001.5 DecisionCitation — awaiting PMO authorization

```text
Reference Implementation (engineering discipline)
ENG-MEM-001.1 Episode — Reference Slice 001

Reference Implementation (knowledge engineering — where applicable)
ENG-MEM-001.2 Fact — Reference Slice 002

Reference Implementation (evidence engineering)
ENG-MEM-001.3 Artifact — Reference Slice 003

Specification Fidelity
Required (100% or Not Accepted)
```

---

## The Artifact Principle (binding)

```text
Artifacts preserve evidence.
They do not preserve conclusions.
```

Artifacts are documents, images, recordings, emails, PDFs, videos, files, and external references.

They must **never** state institutional knowledge — no *therefore*, no attested conclusions, no synthesized judgment. That belongs to **Facts**.

Artifacts preserve:

> Here is the evidence.

Evidence supports knowledge. Evidence is not knowledge.

The Artifact Principle is **necessary but not sufficient**. Artifact is fundamentally different from Fact:

> **Artifacts are preserved exactly as received. Facts are constructed by the institution.**

An email, PDF, photograph, or meeting recording is an Artifact — evidence, not institutional knowledge. A Fact may later be derived from Artifacts; the Artifact itself remains an authentic record of what was received or created.

---

## The Authenticity Principle (binding)

```text
Artifacts preserve authenticity.
Facts preserve institutional understanding.
```

An Artifact should **never** be "corrected."

| Situation | Rule |
| --------- | ---- |
| Better scan arrives | New Artifact |
| Revised document arrives | New Artifact |
| Metadata changes | Modeled explicitly — never silent mutation of original evidence |

### Evidence Independence (binding)

```text
Evidence remains valuable
even if no Facts are ever derived from it.
```

An Artifact does **not** exist to support a Fact. It exists because the institution chose to preserve evidence. Zero, one, or fifty Facts may reference it — the Artifact itself never changes purpose.

### Reference relationship (binding)

```text
Artifact does not belong to Fact.
Fact may reference Artifact.
```

Evidence stays independent of institutional conclusions.

### Identity (binding)

Canonical identity is **`artifact_id`** — not filename, storage path, or URI. The ID survives migration across local storage, cloud, archives, and filesystem moves.

### Content hash (A13 authenticity anchor)

When stored bytes are available at capture (`content_ref`), `content_hash` is the authenticity anchor — not storage path:

```text
Artifact → content_hash → Authenticity
```

---

## Canonical progression (epistemic order)

```text
Reality
      ↓
Episode          Something happened.
      ↓
Artifact         Evidence exists.
      ↓
Fact             The institution accepts this as knowledge.
      ↓
Conversation     People interpreted the knowledge.
      ↓
DecisionCitation The institution exercised authority.
```

Fact sits **between** evidence and discussion — institutional knowledge grounded in history and proof.

Wave 1 **implementation** order (001.1 → 001.5) remains binding; the progression above is the **epistemic** model.

### Executive questions (Artifact)

| Concern | Executive question |
| ------- | ------------------ |
| **A13 Authenticity** | Can we still show exactly what we preserved? |
| **Chain of custody** | Who has been responsible for preserving it? |

One concerns the evidence itself. The other concerns stewardship.

| Object | Executive question |
| ------ | ------------------ |
| Episode | What happened? |
| Artifact | What evidence do we have? |
| Fact | What do we know? |
| Conversation | What were people saying? |
| DecisionCitation | Why did we act? |

---

## Mission

Implement **Artifact** canonical persistence — schema, validation, serialization, lifecycle, provenance envelope, identity, content hash (where applicable), immutable external reference preservation (`uri` / `content_ref`), and audit hooks.

**Establishes institutional evidence** — the third trustworthy substrate alongside temporal truth (Episode) and institutional knowledge (Fact).

**Follow Reference Slice 001** for engineering discipline (file layout, validator strictness, audit pattern, tests, commit format).

**Follow Reference Slice 002** where provenance and append-only patterns apply — not A12 explainability reconstruction (Artifact uses **A13 authenticity** instead).

**Excluded from Wave 1 Artifact slice:** graph persistence · recall · intelligence · **OCR · indexing · extraction · search · AI summaries · metadata inference · cross-linking · evidence evaluation** · content ingestion pipelines · file download/resolution · Fact/DecisionCitation coupling beyond identifier refs in provenance

Those are future **consumers** of Artifacts, not part of Artifact itself.

---

## Slice structure

| Artifact | Location |
| -------- | -------- |
| Charter | This document |
| EDR | [ENG-MEM-001.3-EDR.md](./ENG-MEM-001.3-EDR.md) (on open) |
| Implementation | `backend/src/memory/` · `shared/src/memoryOs/` |
| Tests | `backend/src/memory/artifact.test.ts` |
| Close-out | [ENG-MEM-001.3-SLICE_CLOSEOUT.md](./ENG-MEM-001.3-SLICE_CLOSEOUT.md) |

---

## Specification anchors

| Anchor | Document |
| ------ | -------- |
| `Vol2-Artifact` | [Volume 2 § Artifacts](../VOLUME-2-MEMORY_DATA_MODEL.md) |
| `Registry-Artifact` | [Object Registry — Artifact](../CANONICAL_OBJECT_REGISTRY.md) |
| `S2-Lifecycle` | [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) |
| `S4-Provenance` | [Convention S4](../convention/CONVENTION-S4-PROVENANCE_CONTRACT.md) |
| `TIME_MODEL` | [Time Model](../TIME_MODEL.md) |
| `TRUST` | [Trust & Provenance Model](../TRUST_PROVENANCE_MODEL.md) |
| `Ref-Slice-001` | [ENG-MEM-001.1 Episode](./ENG-MEM-001.1-EPISODE.md) |
| `Ref-Slice-002` | [ENG-MEM-001.2 Fact](./ENG-MEM-001.2-FACT.md) |
| `Artifact-Principle` | [Engineering Discipline § Artifact Principle](../ENG-MEM-001-ENGINEERING_DISCIPLINE.md#the-artifact-principle-binding) |
| `Authenticity-Principle` | [Engineering Discipline § Authenticity Principle](../ENG-MEM-001-ENGINEERING_DISCIPLINE.md#the-authenticity-principle-binding) |

---

## Required fields (Vol 2)

| Field | Required |
| ----- | -------- |
| `artifact_id` | Yes |
| `schema_version` | Yes |
| `domain` | Yes |
| `uri` **or** `content_ref` | Yes (exactly one primary external anchor) |
| `mime_type` | Yes |
| `project_ref` | No |
| `lifecycle_state` | Yes |
| `provenance` | Yes |
| `event_at` | Yes |
| `created_at` | Yes |
| `content_hash` | When applicable — required when content bytes are available at capture (A13) |

> **Note:** Vol 2 core fields are binding for A1. `content_hash` satisfies A13 Authenticity when bytes are available at capture — record in EDR at slice open if storage location differs from Vol 2 field table.

---

## A13 — Authenticity (binding)

Just as Fact introduced **A12 Explainability**, Artifact introduces **A13 Authenticity** as a permanent acceptance criterion.

Every Artifact must answer:

> **Can this still be shown exactly as it was originally preserved?**

without requiring transformation.

Acceptance verifies:

| Check | Rule |
| ----- | ---- |
| Original identity | `artifact_id` immutable |
| Provenance | S4 envelope retained unchanged after capture |
| Timestamps | `event_at` · `created_at` retained |
| Content hash | Retained where content bytes were available at capture |
| Chain of custody | Provenance + append-only — no silent mutation |

**No AI. No reconstruction. No interpretation. Simply preservation.**

Executive summary:

> **Can we still show exactly what we preserved?**

Not: *Can we recreate it?* · *Can AI summarize it?* · *Can we infer what it meant?*

A13 is the evidence counterpart to A12: Facts reconstruct understanding; Artifacts preserve what was received.

---

## Chain of Custody (binding — 001.3.2)

> **Custody records stewardship — not authenticity.**

| Concern | Question |
| ------- | -------- |
| **Authenticity (A13)** | Is this the preserved evidence? |
| **Custody** | Who has been responsible for it over time? |

### Authenticity survives custody (binding)

```text
Authenticity survives custody.
```

An Artifact can change custodians one hundred times. Its authenticity does not change. Custody events are append-only and never mutate the Artifact body.

### Custody records only

| Field | Rule |
| ----- | ---- |
| `actor` | Who recorded the custody event |
| `event_at` | When the stewardship change occurred |
| `recorded_at` | When the event was persisted |
| `custody_event` | `initial_custody` · `transfer` · `release` |
| `previous_custodian` | Prior steward (null on initial) |
| `new_custodian` | Successor steward (null on release) |
| `reason` | Optional — when applicable |

No interpretation · no evaluation · no evidence scoring.

---

## Engineering invariants (Artifact)

| Invariant | Rule |
| --------- | ---- |
| Evidence only | No conclusion fields · no `statement` · no institutional acceptance semantics |
| Authenticity | Preserved exactly as received — corrections create **new** Artifact records |
| External ref preserved | `uri` or `content_ref` immutable after capture |
| Provenance immutable | S4 envelope at create |
| Append-only | Authoritative body immutable; lifecycle transitions only |
| No resolution | Store refs — do not fetch, parse, OCR, index, or summarize content in Wave 1 |

---

## Recommended commit sequence

| Commit | Scope |
| ------ | ----- |
| **001.3.1** | Canonical Artifact storage — schema · validation · persistence · S4 · lifecycle · identity · content hash · immutable preservation · **COMPLETE** (`72d376d`) |
| **001.3.2** | Chain of custody — append-only custody events · actor · timestamps · transfer validation · authenticity invariant |

Keep each commit substrate-only — same discipline as Fact 001.2.1–001.2.4.

### 001.3.2 scope (binding)

**Deliver only:**

- Append-only custody event substrate (`ArtifactCustodyEvent`)
- Initial custody on capture
- Transfer custody with previous/new custodian validation
- Actor attribution · timestamps · optional reason
- `Authenticity survives custody` invariant enforced in service layer

**Explicitly exclude:**

- OCR · indexing · extraction · search · AI
- Evidence scoring · evaluation · interpretation

---

### 001.3.1 scope (binding)

**Deliver only:**

- Canonical Artifact schema
- Validation (evidence-only · uri xor content_ref)
- Storage
- Provenance envelope
- Identity
- Content hash (where applicable)
- Immutable preservation

**Explicitly exclude:**

- OCR · indexing · extraction · search
- AI summaries · metadata inference
- Cross-linking · evidence evaluation

---

## Deliverables

- [x] Artifact schema (`shared/src/memoryOs/artifact.ts`)  
- [x] Validator — reject unknown fields · evidence-only (no conclusion fields)  
- [x] `uri` xor `content_ref` validation · `mime_type` required  
- [x] `content_hash` when `content_ref` present (A13)  
- [x] S2 lifecycle + S4 provenance (Episode/Fact patterns)  
- [x] Persistence + append-only + authenticity invariants  
- [x] Tests — 17/17 PASS (`artifact.test.ts` — 001.3.1 + 001.3.2)  
- [x] Slice closeout — **Specification Fidelity: 100%** · Reference Slice 003

### PMO acceptance — 001.3.2

```text
ENG-MEM-001.3.2 Artifact Chain of Custody
Tests:                  17/17 PASS
Specification Fidelity: 100%
Architectural Drift:    NONE
STATUS:                 COMPLETE
```

**Slice result:** **COMPLETE** — Reference Slice 003 · 17/17 tests · PMO accepted 2026-07-01

---

## Engineering acceptance

| # | Check | Result | Notes |
| - | ----- | ------ | ----- |
| A1 | Schema matches Volume 2 | PASS | Vol2 core + `content_hash` when `content_ref` (A13) |
| A2 | Registry fields complete | PASS | |
| A3 | S2 lifecycle implemented | PASS | |
| A4 | S4 provenance envelope | PASS | |
| A5 | Time model (`event_at` · `created_at`) | PASS | |
| A6 | Trust metadata (provenance envelope) | PASS | |
| A7 | Serialization round-trip | PASS | |
| A8 | Append-only invariant | PASS | |
| A9 | Factory boundary respected | PASS | |
| A10 | No retrieval logic | PASS | |
| A11 | No intelligence logic | PASS | |
| A12 | Explainability | N/A | Knowledge objects — Artifact uses A13 |
| A13 | **Authenticity** | PASS | 001.3.1 — identity · hash · immutability |
| Custody | **Stewardship** | PASS | 001.3.2 — chain of custody · authenticity survives custody |

**Slice result:** **COMPLETE** — Reference Slice 003 · PMO accepted · 17/17 tests

---

## Example commit message (001.3.1)

```text
ENG-MEM-001.3.1
Canonical Artifact storage

Implements:
Vol2-Artifact
Registry-Artifact
S2-Lifecycle
S4-Provenance
TIME_MODEL
Artifact-Principle
Authenticity-Principle
A13
Ref-Slice-001
```

---

*ENG-MEM-001.3 Artifact · Wave 1 Slice 3 · LocalBrain V1*
