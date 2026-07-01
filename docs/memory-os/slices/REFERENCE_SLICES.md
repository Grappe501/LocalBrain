# Reference Slices — Exemplar Implementations

> **Purpose:** Engineering library — exemplar implementations and constitutional responsibilities for institutional cognition. Not just specification; the engineering philosophy behind each class of canonical object.

## Constitutional responsibilities

| Reference | Object | Constitutional responsibility | Engineering philosophy | Status |
| --------- | ------ | ----------------------------- | ---------------------- | ------ |
| **001** | [Episode](./ENG-MEM-001.1-EPISODE.md) | **Preserve history** | Engineering discipline | COMPLETE |
| **002** | [Fact](./ENG-MEM-001.2-FACT.md) | **Preserve institutional knowledge** | Knowledge engineering | COMPLETE |
| **003** | [Artifact](./ENG-MEM-001.3-ARTIFACT.md) | **Preserve evidence** | Evidence engineering | COMPLETE |
| **004** | [Conversation](./ENG-MEM-001.4-CONVERSATION.md) | **Preserve interpretation** | Interpretation engineering | **COMPLETE** |
| **005** | [DecisionCitation](./slices/ENG-MEM-001.5-DECISIONCITATION.md) | **Preserve exercised authority** | Governance engineering | **AUTHORIZED** |

Later intelligence layers consume these responsibilities — they do not redefine them.

## Substrate progression (one truth per object)

```text
Episode          → History
Artifact         → Evidence
Fact             → Knowledge
Conversation     → Context
DecisionCitation → Authority
```

## Executive ontology (five questions)

```text
What happened?              → Episode
What evidence exists?       → Artifact
What do we know?            → Fact
What were people saying?    → Conversation
Why did we decide?          → DecisionCitation
```

Future Executive Office briefing naturally separates along these lines — one substrate per question.

## Integrity protected

| Object | Integrity protected |
| ------ | ------------------- |
| Episode | **Historical integrity** |
| Artifact | **Evidentiary integrity** (authenticity + stewardship) |
| Fact | **Knowledge integrity** |
| Conversation | **Interpretive integrity** |

## Artifact dual guarantees (permanent)

| Concern | Question |
| ------- | -------- |
| **A13 Authenticity** | Can we still show exactly what we preserved? |
| **Stewardship** | Who has been responsible for preserving it? |

Separate forever.

## The Conversation Principle (binding — Reference Slice 004)

**Constitutional statement:**

> **Conversations preserve interpretation at a point in time. They do not revise institutional history, evidence, or knowledge.**

```text
Interpretation preserves context.
```

| Object | Preserves |
| ------ | --------- |
| Episode | events |
| Artifact | evidence |
| Fact | knowledge |
| Conversation | context |

Context is subtly different from preserving words alone.

### Sequence invariant (binding)

```text
Meaning depends on order.
```

A conversation is not a collection of turns — it is an **ordered interaction**. Turn `sequence` and `turn_refs` are canonical substrate.

### Original wording is canonical (binding)

Turn content must never be cleaned, summarized, corrected, or rewritten. Intelligence summaries are separate Artifacts or derived objects — not Conversation mutations.

### Reference relationship (binding)

```text
Conversation  →  may reference  →  Episode · Artifact · Fact
Conversation  →  never owns     →  Episode · Artifact · Fact
```

### A14 — Context Preservation (binding)

Every Conversation must answer *What context produced this interpretation?* using only stored conversation data — reconstructable without Intelligence.

### Interpretation Independence (binding)

```text
Interpretation survives disagreement.
```

Multiple participants may hold contradictory interpretations. Conversation preserves all of them — it does **not** reconcile. Reconciliation belongs to Facts, Decisions, and Executive Intelligence — never Conversation.

### A15 — Sequence Integrity (binding)

Every Conversation must answer *Can we reconstruct the conversation exactly as it occurred?* — original order · timestamps · wording · attribution · no inserted or deleted turns.

### A16 — Attribution Integrity (binding)

Executive question: *Who expressed this interpretation?*

Verify: attribution preserved · speaker identity preserved · turn ownership immutable · attribution not inferred by AI.

### Interpretation never becomes knowledge (binding)

```text
Interpretation never becomes knowledge without institutional acceptance.
```

```text
Conversation  →  may inform  →  Fact
```

Conversation is never a Fact — discussion does not become knowledge automatically.

---

## The Authority Principle (binding — Reference Slice 005 AUTHORIZED)

> **Authority is exercised. It is never inferred.**

## The Recording Principle (binding — MAR-2)

> **Authority is recorded. It is never reconstructed.**

## The Governance Principle (binding — MAR-2)

> **Authority creates responsibility. It does not create truth.**

DecisionCitation cites the Decision Ledger — binding authority remains in the ledger (MAR-1).

Design review: [MAR-2 Authority Architecture Review](./MAR-2-AUTHORITY-ARCHITECTURE_REVIEW.md) · Completion: [ENG-PMO-005](./ENG-PMO-005-CONSTITUTIONAL-COMPLETION.md) (reserved)

### A17 — Authority Integrity (binding — reserved at authorization)

Executive question: *Who exercised institutional authority?*

Verify: authority explicit · delegation traceable · ledger citation immutable · supporting refs intact · no inferred authority.

---

*Reference Slices · LocalBrain V1 · ENG-MEM-001*
