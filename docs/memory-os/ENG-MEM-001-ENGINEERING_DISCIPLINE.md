# ENG-MEM-001 — Engineering Discipline

> **Status:** Binding for all MEM-009 implementation commits  
> **Parent:** [Wave 1 Charter](./ENG-MEM-001-WAVE1-CHARTER.md) · `memory-spec-v1.0`  
> **Philosophy:** Implementation is an exercise in **fidelity, not invention**.

> **Principle:** Every object must be valuable before intelligence touches it — valid, traceable, explainable, auditable, and reconstructable even if the Intelligence layer were completely disabled.

> **Gold standard:** [Reference Slices](./slices/REFERENCE_SLICES.md) — **001** [Episode](./slices/ENG-MEM-001.1-EPISODE.md) (engineering discipline) · **002** [Fact](./slices/ENG-MEM-001.2-FACT.md) (knowledge engineering) · **003** [Artifact](./slices/ENG-MEM-001.3-ARTIFACT.md) (evidence engineering)

> **Atomic units (binding):**
> ```text
> Episode
> records reality.
> Artifact
> preserves evidence — exactly as received.
> Fact
> records institutional knowledge — constructed by the institution.
> ```

> **Production line:** Charter → Specification → Implementation → Acceptance → Closeout → Engineering Debt Review → Authorization

> **Every engineering kickoff must state:**
> ```text
> Reference Implementation (discipline)
> ENG-MEM-001.1 Episode
>
> Reference Implementation (knowledge engineering — when applicable)
> ENG-MEM-001.2 Fact
> ```
> Episode is the quality bar for slice structure · traceability · acceptance · closeout. Fact is the quality bar for lineage · provenance attachment · explainability · append-only knowledge corrections.

---

## Engineering invariants (per object)

| Slice | Establishes |
| ----- | ----------- |
| **ENG-MEM-001.1 Episode** | **Time** — explicit temporal bounds on what happened |
| **ENG-MEM-001.2 Fact** | **Knowledge must never become detached from evidence** · **institutional acceptance, not objective truth** · **Reference Slice 002** |
| **ENG-MEM-001.3 Artifact** | **Evidence only — never conclusions** · **Authenticity — never correction** · **A13 binding** · **Reference Slice 003** |

---

## The Fact Principle (binding)

Episode has:

> Something **happened**.

Fact has:

> The institution **currently accepts this as knowledge**.

Notice what is **missing**:

> This is objectively true.

Instead:

> This is what the institution currently knows.

That distinction is a defining characteristic of LocalBrain. Institutions can learn. Institutions can be wrong. Institutions can correct themselves. The architecture supports correction through **supersession** — never in-place erasure of history.

### Fact invariant (binding)

> **Every canonical Fact must remain explainable from its provenance and lineage.**

A future Chief of Staff must answer — **without LLM invention**:

- Why do we know this?
- Where did it come from?
- When did it become authoritative?
- What replaced the previous understanding?

### Institutional progression (Wave 1 → platform)

```text
Episode          → I remember.
Fact             → I know.
Artifact         → I can prove it.
Conversation     → I can explain it.
DecisionCitation → I can justify why we acted.
Chief of Staff   → I can help you decide what to do next.   (Executive Intelligence — later wave)
```

### Canonical progression (epistemic order)

Implementation slice order (001.1 → 001.5) differs from epistemic layering. Institutional knowledge sits **between** evidence and discussion:

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

That is exactly where institutional knowledge belongs — grounded in history, supported by evidence, distinct from discussion and action justification.

### Executive questions (one substrate per question)

Each canonical object naturally answers one executive question. The Chief of Staff does not answer one generic prompt — it orchestrates distinct institutional substrates:

| Object | Executive question |
| ------ | ------------------ |
| Episode | What happened? |
| Artifact | What evidence do we have? |
| Fact | What do we know? |
| Conversation | What did people think? |
| DecisionCitation | Why did we act? |

The Chief of Staff does not replace memory, knowledge, evidence, explanation, or governance. It builds on all of them. That boundary is non-negotiable.

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

### Evidence Independence (binding)

```text
Evidence remains valuable
even if no Facts are ever derived from it.
```

An Artifact does not exist to support a Fact. Later: zero Facts may reference it, one may, fifty may — the Artifact never changes purpose.

### Reference relationship (binding)

```text
Artifact does not belong to Fact.
Fact may reference Artifact.
```

### Governing verbs (canonical objects)

```text
Episode          records
Artifact         preserves
Fact             accepts
Conversation     captures
DecisionCitation justifies
```

Verbs do not overlap — each object has a unique responsibility.

An email is an Artifact. A PDF is an Artifact. A photograph is an Artifact. A meeting recording is an Artifact. None of those are institutional knowledge — they are evidence. A Fact may later be derived from them, but the Artifact itself remains an authentic record of what was received or created.

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

A13 (below) makes this verifiable at acceptance.

---

### Reserved (not Wave 1)

| Capability | Rule |
| ---------- | ---- |
| **Explain This Fact** | Reconstruct provenance chain from substrate only — no reasoning. Target: Wave 2+ retrieval/explain API. |
| **Confidence vs Freshness** | Independent dimensions on Facts (trust · lifecycle · validity · provenance already separate). Design room exists; do not implement in Wave 1. |
| **Confidence ladder** | Future executive answers may walk provenance downward: DecisionCitation → Fact → Artifacts → Episodes — not a score, a chain to preserved evidence. Well beyond Wave 1. |

## Executive substrates (directional — consolidated)

See [Executive questions](#executive-questions-one-substrate-per-question) above. Substrate map for recall design:

| Question | Substrate |
| -------- | --------- |
| What happened? | Episodes |
| What evidence do we have? | Artifacts |
| What do we know? | Facts |
| What did people think? | Conversations |
| Why did we act? | DecisionCitation + Decision Ledger |

---

## The Interpretation Principle (binding — Conversation, reserved)

```text
Conversations preserve interpretation.
They do not rewrite history.
```

Conversations must never modify Episodes, Facts, or Artifacts. They preserve how humans interpreted those things at that moment.

**Executive question:** What did people think? — not what happened, what is true, or what evidence exists.

### Interpretation never becomes knowledge (binding)

```text
Interpretation never becomes knowledge without institutional acceptance.
```

```text
Conversation  →  may inform  →  Fact
```

Conversation is never a Fact — analogous to Artifact → may support → Fact. Discussion does not become knowledge automatically.

See [Reference Slices](./slices/REFERENCE_SLICES.md) for constitutional responsibilities.

---

## Historical boundary

```text
8951745  MEM-008 specification freeze — memory-spec-v1.0
99e14ac  ARCH-001: LocalBrain Architecture Book v1.0
352411f  MEM-009: ENG-MEM-001 Wave 1 Canonical Storage charter
──────── Engineering begins here ────────
```

Every implementation commit after this line must trace back to the frozen specification.

---

## Rule 1 — Spec-traceable commits

**Every implementation commit must cite the specification it implements.**

Do not use opaque messages:

```text
Add Episode persistence
fix validation
```

Use structured messages:

```text
ENG-MEM-001.1
Canonical Episode storage

Implements:
Vol2-Episode
Registry-Episode
S2-Lifecycle
S4-Provenance
TIME_MODEL
```

### Commit message template

```text
ENG-MEM-001.<slice>
<One-line summary>

Implements:
<spec anchors — one per line>
```

### Spec anchor vocabulary

| Anchor | Meaning |
| ------ | ------- |
| `Vol2-<Type>` | [Volume 2](./VOLUME-2-MEMORY_DATA_MODEL.md) object section |
| `Registry-<Type>` | [Canonical Object Registry](./CANONICAL_OBJECT_REGISTRY.md) row |
| `S1-Ontology` | [Convention S1](../convention/CONVENTION-S1-ONTOLOGY_CONTRACT.md) |
| `S2-Lifecycle` | [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) |
| `S4-Provenance` | [Convention S4](../convention/CONVENTION-S4-PROVENANCE_CONTRACT.md) |
| `TIME_MODEL` | [Time Model](./TIME_MODEL.md) |
| `TRUST` | [Trust & Provenance Model](./TRUST_PROVENANCE_MODEL.md) |
| `Vol3-WritePipeline` | [Volume 3](./VOLUME-3-MEMORY_ENGINE.md) write path (persistence only in Wave 1) |

Optional body lines: `Tests:`, `Slice acceptance:`, `Blocks:`.

---

## Rule 2 — One canonical type at a time

Do not implement all object types simultaneously. Complete **one slice** — schema through audit — before starting the next.

### Wave 1 slice order

| Slice | ID | Object | Charter |
| ----- | -- | ------ | ------- |
| 1 | ENG-MEM-001.1 | **Episode** | [Slice 1](./slices/ENG-MEM-001.1-EPISODE.md) | **Reference Slice 001** · COMPLETE |
| 2 | ENG-MEM-001.2 | **Fact** | [Slice 2](./slices/ENG-MEM-001.2-FACT.md) | **Reference Slice 002** · COMPLETE |
| 3 | ENG-MEM-001.3 | **Artifact** | [Slice 3](./slices/ENG-MEM-001.3-ARTIFACT.md) | **Reference Slice 003** · COMPLETE |
| 4 | ENG-MEM-001.4 | **Conversation** + **ConversationTurn** | attribution · chronology |
| 5 | ENG-MEM-001.5 | **DecisionCitation** | Decision Ledger boundary · no duplicated authority |

Remaining registry types (Skill, Relationship, Preference, Project, Organization, Task, Goal, Identity, DelegationGrant) follow in subsequent slices or Wave 1 extensions — **only after** slices 1–5 pass acceptance.

Each slice document lives under [slices/](./slices/).

### Gold standard slice structure

Every slice follows the same structure. Episode (001.1) is the template:

```text
Slice
│
├── Charter                    slices/ENG-MEM-001.N-*.md
├── Specification References   anchors in charter
├── Engineering Decision Record  slices/ENG-MEM-001.N-EDR.md (when needed)
├── Acceptance Checklist       A1–A11 universal · A12 knowledge objects · A13 Artifact
├── Implementation             backend/src/memory/ …
├── Tests                      *.test.ts colocated
├── Close-out Report           slices/ENG-MEM-001.N-SLICE_CLOSEOUT.md
└── Lessons Learned            close-out § what next slice inherits
```

Close-out template: [SLICE_CLOSEOUT_TEMPLATE.md](./slices/SLICE_CLOSEOUT_TEMPLATE.md)

---

## Rule 3 — Engineering acceptance before next slice

Mirror PMO discipline: **binary pass/fail**. A slice does not start until the prior slice acceptance checklist is fully PASS.

### Universal acceptance checklist (every slice)

| # | Check | Evidence |
| - | ----- | -------- |
| A1 | Schema matches Volume 2 | Field table parity |
| A2 | Registry fields complete | Registry row + required fields |
| A3 | S2 lifecycle implemented | Allowed/forbidden transitions enforced |
| A4 | S4 provenance envelope | Required on every persisted object |
| A5 | Time model implemented | `event_at` · `created_at` · type-specific times |
| A6 | Trust metadata implemented | Frozen trust enum only |
| A7 | Serialization round-trip | Encode → decode → equivalent |
| A8 | Append-only invariant | No silent in-place mutation of authoritative fields |
| A9 | Factory boundary respected | No Factory artifact mutation |
| A10 | No retrieval logic | No recall · ranking · context assembly |
| A11 | No intelligence logic | No inference · planning · LLM |
| A12 | **Explainability** | Substrate reconstruction — **not interpretation**. **Permanent acceptance philosophy** for institutional-knowledge objects: answer *Why do you exist?* from stored state · provenance · lineage · authority · lifecycle — **no AI**. Fact implemented A12 in Wave 1; future knowledge objects follow Reference Slice 002. See [Fact A12](./slices/ENG-MEM-001.2-FACT.md#a12--explainability-binding). |
| A13 | **Authenticity** | **Required for Artifact.** Every Artifact must answer *Can this still be shown exactly as it was originally preserved?* without requiring transformation. Verify: original identity retained · provenance retained · timestamps retained · content hash retained (where applicable) · chain of custody retained. **No AI · no reconstruction · no interpretation** — simply preservation. See [Artifact A13](./slices/ENG-MEM-001.3-ARTIFACT.md#a13--authenticity-binding). |

A12 is **binding platform philosophy** for knowledge — reconstruction, not interpretation. Fact implemented it in Wave 1 (`explainFactFromSubstrate`).

A13 is **binding platform philosophy** for evidence — preservation, not correction. Artifact implements it in Wave 1.

### Custody vs authenticity (Artifact — binding)

> **Custody records stewardship — not authenticity.**

```text
Authenticity survives custody.
```

Custody events are append-only stewardship records. They never mutate Artifact body fields (`uri`, `content_ref`, `content_hash`, provenance).

Record results in the slice document before opening the next slice.

**Close-out required:** Every slice must publish an [implementation summary](./slices/SLICE_CLOSEOUT_TEMPLATE.md#implementation-summary-required) and **Specification Fidelity** statement before the next slice begins.

### Specification Fidelity (headline metric)

Binary — not subjective. Not 97%. Not 92%. Only:

```text
Specification Fidelity: 100%
or
Not Accepted
```

Every closeout must state:

```text
Specification Fidelity: 100%
Implemented exactly as specified.
No architectural deviations.
No specification amendments.
```

If fidelity is not **100%**, the slice does **not** close — resolve via spec amendment cycle or corrective implementation.

---

## Rule 4 — Substrate before experience

Wave 1 is almost invisible to end users. That is correct.

Users will not see canonical storage or provenance envelopes. They will eventually notice that the system **remembers, explains, traces, and justifies** — because Wave 1 built the foundation of trust.

Later waves add capability. They stand on substrate whose behavior was specified, reviewed, frozen, and implemented with traceable fidelity.

---

## Rule 5 — No architectural discovery in code

If implementation reveals ambiguity:

1. Stop the slice.  
2. Document the question.  
3. Resolve via specification amendment cycle — not via code comment or prompt.  

Wave 1 does not amend `memory-spec-v1.0`.

---

## Traceability chain

```text
Commit message (ENG-MEM-001.N)
        ↓
Slice acceptance checklist
        ↓
Volume 2 + Registry + Convention
        ↓
memory-spec-v1.0
```

---

*ENG-MEM-001 Engineering Discipline · LocalBrain V1 · 2026*
