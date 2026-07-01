# ENG-MEM-001.4 — Conversation (Slice 4)

> **Status:** **COMPLETE** — PMO accepted 2026-07-01 · **Reference Slice 004** (interpretation engineering)  
> **Wave:** 1 · Canonical Storage  
> **Designation:** **Reference Slice 004** — follow Conversation for all future **interpretation engineering**  
> **Objects:** Conversation · ConversationTurn (child)  
> **Closeout:** [ENG-MEM-001.4-SLICE_CLOSEOUT.md](./ENG-MEM-001.4-SLICE_CLOSEOUT.md)  
> **Ceremony:** [ENG-PMO-003](../ENG-PMO-003-CONVERSATION-CEREMONY.md)  
> **Unblocks:** [ENG-MEM-001.5 DecisionCitation](./ENG-MEM-001.5-DECISIONCITATION.md) — **AUTHORIZED**

```text
Reference Implementation (engineering discipline)
ENG-MEM-001.1 Episode — Reference Slice 001

Reference Implementation (knowledge engineering — where applicable)
ENG-MEM-001.2 Fact — Reference Slice 002

Reference Implementation (evidence engineering — where applicable)
ENG-MEM-001.3 Artifact — Reference Slice 003

Reference Implementation (interpretation engineering)
ENG-MEM-001.4 Conversation — Reference Slice 004

Specification Fidelity
Required (100% or Not Accepted)
```

---

## PMO Authorization

```text
ENG-MEM-001.4
Conversation
STATUS:
AUTHORIZED
```

## PMO Acceptance

```text
ENG-MEM-001.4
Conversation
STATUS:
COMPLETE
Reference Slice 004
Interpretation Engineering
STATUS:
COMPLETE
Tests:                  16/16 PASS
Specification Fidelity: 100%
Architectural Drift:    NONE
```

Architecture shift at this slice: Wave 1 moves from preserving **information** to preserving **meaning** — context at a point in time, not institutional history, evidence, or knowledge.

---

## The Conversation Principle (binding)

**Constitutional statement:**

> **Conversations preserve interpretation at a point in time. They do not revise institutional history, evidence, or knowledge.**

**Permanent invariant:**

```text
Interpretation preserves context.
```

| Object | Preserves |
| ------ | --------- |
| Episode | events |
| Artifact | evidence |
| Fact | knowledge |
| Conversation | **context** |

Context is subtly different from preserving words alone. A Conversation must retain enough conversational structure — participants, chronology, attribution, references — to reconstruct *what context produced this interpretation*.

---

## Original wording is canonical (binding)

```text
Original wording is canonical.
```

ConversationTurn content must **never** be:

- cleaned,
- summarized,
- corrected,
- rewritten.

If later Intelligence wants to summarize a conversation, that output is a **separate** Artifact or derived object — not a modification of the Conversation itself.

Vol 2 optional `summary_ref` may point at such a separate object. It must **never** replace or mutate authoritative turn content.

---

## Reference relationship (binding)

```text
Conversation  →  may reference  →  Episode · Artifact · Fact
Conversation  →  never owns     →  Episode · Artifact · Fact
```

Conversation is a **consumer** of substrates — not their owner. Same independence discipline as Fact ↔ Artifact:

```text
Fact does not belong to Artifact.
Artifact does not belong to Fact.
Substrates do not belong to Conversation.
```

Conversations must **never modify** Episodes, Facts, or Artifacts.

---

## Interpretation never becomes knowledge (binding)

```text
Interpretation never becomes knowledge without institutional acceptance.
```

```text
Conversation  →  may inform  →  Fact
```

Conversation is never a Fact — discussion does not become knowledge automatically.

---

## Substrate progression (complete set)

```text
Episode          → History
Artifact         → Evidence
Fact             → Knowledge
Conversation     → Context
DecisionCitation → Authority
```

Each substrate owns one kind of institutional truth.

### Executive cognition sequence

```text
I remember.                    → Episode
I can show evidence.           → Artifact
I know.                        → Fact
I understand the discussion.   → Conversation
I can justify the decision.    → DecisionCitation
Chief of Staff                 → I can help decide what comes next.
```

Chief of Staff synthesizes — it does not own any substrate.

### Executive question (Conversation)

| Concern | Executive question |
| ------- | ------------------ |
| **Conversation** | **What were people saying?** |
| Fact | What do we know? |

Those are fundamentally different questions.

---

## Mission

Implement **Conversation** and **ConversationTurn** canonical persistence — schema, validation, serialization, lifecycle, provenance, trust envelope, participant attribution, turn chronology, and audit hooks.

**Follow Reference Slice 001** for file layout, validator strictness, audit pattern, tests, and commit format.

**Follow Reference Slice 003** where immutability and append-only preservation apply — Conversation uses **A14 context preservation**, not A13 authenticity.

**Excluded from this slice:** summarization · normalization · LLM cleanup · retrieval · ranking · intelligence · cross-substrate mutation.

---

## Specification anchors

| Anchor | Document |
| ------ | -------- |
| `Vol2-Conversation` | [Volume 2 § Conversations](../VOLUME-2-MEMORY_DATA_MODEL.md) |
| `Registry-Conversation` | [Object Registry — Conversation](../CANONICAL_OBJECT_REGISTRY.md) |
| `Registry-ConversationTurn` | [Object Registry — ConversationTurn](../CANONICAL_OBJECT_REGISTRY.md) |
| `S2-Lifecycle` | [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) |
| `S4-Provenance` | [Convention S4](../convention/CONVENTION-S4-PROVENANCE_CONTRACT.md) |
| `TIME_MODEL` | [Time Model § Conversation · ConversationTurn](../TIME_MODEL.md) |
| `TRUST` | [Trust & Provenance Model](../TRUST_PROVENANCE_MODEL.md) |
| `Vol3-WritePipeline` | [Volume 3](../VOLUME-3-MEMORY_ENGINE.md) — write path (persistence only) |

---

## Required fields (Vol 2 — Conversation)

| Field | Required |
| ----- | -------- |
| `conversation_id` | Yes |
| `schema_version` | Yes |
| `channel` | Yes |
| `participants` | Yes |
| `started_at` | Yes |
| `turn_refs` | Yes |
| `summary_ref` | No — if present, must reference separate object; never replaces turns |
| `lifecycle_state` | Yes |

ConversationTurn is a **child object** (not a graph node). Per-turn `event_at` binds per [TIME_MODEL](../TIME_MODEL.md). Field parity for turns is recorded in EDR at slice open if Vol 2 requires expansion.

---

## A14 — Context Preservation (binding)

Just as Fact introduced **A12 Explainability** and Artifact introduced **A13 Authenticity**, Conversation introduces **A14 Context Preservation** as a permanent acceptance criterion.

Every Conversation must answer:

> **What context produced this interpretation?**

using only stored conversation data.

**Not:**

- Was this interpretation correct?
- Which participant won?

**Simply:**

> What was the conversational context?

That must be reconstructable **without Intelligence** — participants, turn order, attribution, timestamps, and optional substrate references only.

### A14 test evidence (required in `conversation.test.ts`)

- Reconstruct conversational context from stored Conversation + ConversationTurn records alone
- Verify original turn wording unchanged after create
- Verify referenced Episodes · Artifacts · Facts are not mutated by Conversation writes
- Verify no normalization path exists on turn content

---

## Engineering invariants (Conversation)

| Invariant | Rule |
| --------- | ---- |
| Context only | Preserve interpretation at a point in time — not conclusions · not institutional knowledge |
| Original wording | Turn content immutable after capture — no cleanup · no rewrite |
| Reference only | May reference Episode · Artifact · Fact — never own or mutate them |
| Provenance immutable | S4 envelope at create |
| Append-only | Authoritative turn body immutable; lifecycle transitions only |
| No normalization | No summarization · correction · or Intelligence rewrite in Wave 1 |
| Child turns | ConversationTurn stored under Conversation — not independent graph node |

---

## Three integrities (+ interpretive)

| Object | Integrity protected |
| ------ | ------------------- |
| Episode | Historical integrity |
| Artifact | Evidentiary integrity |
| Fact | Knowledge integrity |
| Conversation | **Interpretive integrity** (context + sequence) |

---

## Sequence invariant (binding)

```text
Meaning depends on order.
```

A conversation is not just a collection of turns. It is an **ordered interaction**. Turn `sequence` and `turn_refs` ordering are part of the canonical substrate — not derived at read time.

---

## A15 — Sequence Integrity (binding)

Complements A14: context preserved · chronology preserved within context.

Every Conversation must answer:

> **Can we reconstruct the conversation exactly as it occurred?**

**Not:** Can we summarize it? Can we infer intent?

Acceptance verifies:

- original order
- original timestamps
- original wording
- original attribution
- no inserted turns
- no deleted turns

### A15 test evidence (required in `conversation.test.ts`)

- `verifyConversationSequenceIntegrity()` from stored Conversation + ConversationTurn
- Reject non-contiguous `sequence` at capture (gaps in 1..n)
- `turn_refs` order matches sequence order

---

## Interpretation Independence (binding)

```text
Interpretation survives disagreement.
```

Conversation preserves human meaning over time — sequence, attribution, context, wording, timing. A transcript is one representation; the conversation is the ordered, attributed substrate.

Multiple participants may hold contradictory interpretations. Conversation preserves all of them. It does **not** reconcile. Reconciliation belongs to Facts, Decisions, and Executive Intelligence — never Conversation.

---

## A16 — Attribution Integrity (binding)

Executive question:

> **Who expressed this interpretation?**

Acceptance verifies:

- attribution preserved
- speaker identity preserved
- turn ownership immutable
- attribution not inferred by AI

No Intelligence · no reconciliation · no normalization.

### A16 test evidence (required in `conversation.test.ts`)

- `verifyConversationAttributionIntegrity()` from stored Conversation + ConversationTurn
- Reject reconciliation / inference fields at validation
- Reject turns whose `speaker_ref` is not a declared participant

---

## Recommended commit sequence

| Commit | Scope |
| ------ | ----- |
| **001.4.1** | Canonical Conversation + ConversationTurn storage — **COMPLETE** (`7ceed38`) |
| **001.4.2** | Sequence integrity — invariant · A15 · contiguous order · `turn_refs` alignment — **COMPLETE** (`af8dc13`) |
| **001.4.3** | Attribution integrity — Interpretation Independence · A16 · explicit speaker attribution — **COMPLETE** (`de6c04b`) |

Keep each commit substrate-only — same discipline as Artifact 001.3.1–001.3.2.

> **Reference Slice 004** designation follows **ENG-PMO-003** acceptance — not per sub-commit.

### 001.4.3 scope (binding)

**Deliver only:**

- Interpretation Independence invariant
- A16 `verifyConversationAttributionIntegrity()`
- Explicit `speaker_ref` must match declared participant
- Reject reconciliation / inference fields

**Explicitly exclude:** reconciliation · consensus · inferred attribution · Intelligence

---

### 001.4.2 scope (binding)

**Deliver only:**

- Sequence invariant — `Meaning depends on order.`
- Contiguous `sequence` 1..n at capture
- `turn_refs` ordered by sequence
- A15 `verifyConversationSequenceIntegrity()` — no inserted/deleted turns

**Explicitly exclude:** summarization · inference · participant inference · search · recall

---

### 001.4.1 scope (binding)

**Deliver only:**

- Canonical Conversation schema
- ConversationTurn child schema
- Validation (context-only · original wording · reference-not-ownership)
- Storage + append-only turn preservation
- Provenance envelope
- Participant attribution · per-turn `event_at`
- Optional `memory_ref` links to Episode · Artifact · Fact (reference only)

**Explicitly exclude:**

- Summarization · normalization · rewrite · cleanup
- LLM · embeddings · search · ranking
- Cross-substrate mutation
- Intelligence-derived summaries stored as turn replacements

---

## Deliverables

- [x] Conversation schema (`shared/src/memoryOs/conversation.ts`)
- [x] ConversationTurn schema (`shared/src/memoryOs/conversationTurn.ts`)
- [x] Validator — reject unknown fields · context-only · original wording
- [x] S2 lifecycle + S4 provenance (Episode/Fact/Artifact patterns)
- [x] Persistence + append-only + reference-not-ownership invariants
- [x] Tests — 16/16 PASS (`conversation.test.ts` — A14 · A15 · A16)
- [x] Slice closeout — **Specification Fidelity: 100%** · Reference Slice 004

---

## Engineering acceptance (preview)

| # | Check | Status |
| - | ----- | ------ |
| A1 | Schema matches Volume 2 | PASS |
| A2 | Registry fields complete | PASS |
| A3 | S2 lifecycle implemented | PASS |
| A4 | S4 provenance envelope | PASS |
| A5 | Time model implemented | PASS |
| A6 | Trust metadata implemented | PASS |
| A7 | Serialization round-trip | PASS |
| A8 | Append-only invariant | PASS |
| A9 | Factory boundary respected | PASS |
| A10 | No retrieval logic | PASS |
| A11 | No intelligence logic | PASS |
| A12 | Explainability | N/A — knowledge objects |
| A13 | Authenticity | N/A — evidence objects |
| A14 | **Context Preservation** | PASS — 001.4.1 |
| A15 | **Sequence Integrity** | PASS — 001.4.2 |
| A16 | **Attribution Integrity** | PASS — 001.4.3 |

**Slice result:** **COMPLETE** — Reference Slice 004 · 16/16 tests · PMO accepted 2026-07-01

---

*ENG-MEM-001.4 · Reference Slice 004 · Interpretation Engineering · LocalBrain V1 · 2026*
