# ENG-PMO-002 — Conversation Authorization

> **Type:** PMO authorization ceremony — not implementation · not observability  
> **Governance:** [ENG / OPS / ENG-PMO](./ENG-PMO-GOVERNANCE.md)

## Authorization

```text
ENG-MEM-001.4
Conversation
STATUS:
AUTHORIZED
```

## Reference Slice designation

| Slice | Object | Engineering philosophy |
| ----- | ------ | ---------------------- |
| 001 | Episode | Engineering discipline |
| 002 | Fact | Knowledge engineering |
| 003 | Artifact | Evidence engineering |
| **004** | **Conversation** | **Interpretation engineering** |

## Binding principles locked at authorization

| Principle | Statement |
| --------- | --------- |
| Constitutional | Conversations preserve interpretation at a point in time. They do not revise institutional history, evidence, or knowledge. |
| Conversation Principle | Interpretation preserves context. |
| A14 | Every Conversation must answer *What context produced this interpretation?* from stored data alone — without Intelligence. |
| Original wording | Turn content is canonical — never cleaned, summarized, corrected, or rewritten. |
| Reference relationship | Conversation may reference Episode · Artifact · Fact — never owns them. |

## Substrate class

```text
Episode          → History      (complete · Ref 001)
Artifact         → Evidence     (complete · Ref 003)
Fact             → Knowledge    (complete · Ref 002)
Conversation     → Context      (authorized · Ref 004)
DecisionCitation → Authority    (blocked on 001.4)
```

## Charter

[ENG-MEM-001.4 Conversation](./slices/ENG-MEM-001.4-CONVERSATION.md)

## PMO closing note

The first three reference slices established independent foundations for **history**, **evidence**, and **knowledge**. Conversation introduces **context** without taking ownership of those substrates. If Conversation maintains the same discipline, it completes the set of information-preserving substrates needed before the platform begins preserving exercised authority in DecisionCitation.

---

*ENG-PMO-002 · LocalBrain V1 · 2026*
