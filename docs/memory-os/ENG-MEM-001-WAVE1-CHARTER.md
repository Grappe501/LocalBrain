# ENG-MEM-001 — Wave 1: Institutional Cognition Foundation

> **Milestone name:** **Institutional Cognition Foundation**  
> **Status:** **COMPLETE** — Wave 1 · 5/5 substrates · [ENG-PMO-005](./ENG-PMO-005-CONSTITUTIONAL-COMPLETION.md)  
> **Engine:** ENG-MEM-001 · **Milestone:** MEM-009 Implementation Pass 1 · Wave 1  
> **Specification:** `memory-spec-v1.0` · tag `memory-spec-v1.0`  
> **Governance:** [ENG / OPS / ENG-PMO commit histories](./ENG-PMO-GOVERNANCE.md)  
> **Unblocks:** Executive Intelligence Era · Wave 2 (Retrieval) · Wave 3 (Intelligence) · Wave 4 (Organizational Intelligence)

---

## Engineering philosophy

> **Implementation is now an exercise in fidelity, not invention.**

Every line of Wave 1 code must conform to the frozen specification. Ambiguity is resolved by reading the spec and Convention — not by improvising in pull requests.

**Binding discipline:** [ENG-MEM-001 Engineering Discipline](./ENG-MEM-001-ENGINEERING_DISCIPLINE.md) — spec-traceable commits · slice acceptance · one type at a time.

---

## Institutional cognition (Wave 1)

```text
Episode          → I remember.     (time · something happened)
Fact             → I know.         (institutional knowledge — not objective truth)
Artifact         → I can prove it. (evidence)
Conversation     → I can explain it.
DecisionCitation → I can justify why we acted.
Chief of Staff   → I can help you decide what to do next.   (Executive Intelligence — Wave 3+)
```

The progression is deliberate. Each layer adds capability without blurring the layer below. Executive Intelligence culminates the stack — it does not replace memory, knowledge, evidence, explanation, or governance.

**All five substrates complete:** Episode · Artifact · Fact · Conversation · DecisionCitation — history · evidence · knowledge · interpretation · authority.

**Constitutional doctrine:** [The Five Constitutional Substrates](./THE-FIVE-CONSTITUTIONAL-SUBSTRATES.md)

**Post-foundation:** Executive Intelligence Era authorized at [ENG-PMO-005](./ENG-PMO-005-CONSTITUTIONAL-COMPLETION.md).

**Fact Principle:** [Engineering Discipline § The Fact Principle](./ENG-MEM-001-ENGINEERING_DISCIPLINE.md#the-fact-principle-binding)

---

## Engineering kickoff (every slice)

```text
Reference Implementation
ENG-MEM-001.1 Episode

Specification Fidelity
Required (100% or Not Accepted)
```

---

## Mission

> Implement the Memory Specification exactly as frozen in `memory-spec-v1.0`.

Wave 1 delivers **canonical storage only** — the durable substrate on which recall, intelligence, and organizational behavior will later run.

---

## Engineering constraints (binding)

| Constraint | Rule |
| ---------- | ---- |
| Factory | Remains immutable — no Factory code · no `structural_hash` mutation · no birth certificate writes |
| Convention | Remains authoritative — implements S1–S5 · does not amend |
| Architecture | No architectural discovery — decisions are already frozen |
| Semantics | No semantic expansion — no new object types · no new edge types · no trust enum changes |
| Ontology | No ontology changes — S1 vocabulary is fixed |
| Reasoning | No reasoning — no inference · no synthesis · no planning |
| Retrieval | No retrieval intelligence — no ranking · no recall API · no context assembly |
| AI | No AI behavior — no LLM calls · no embeddings as product behavior |

If a pull request introduces behavior outside this table, it belongs in a later wave or a specification amendment cycle — not in Wave 1.

---

## Deliverables (Wave 1 only)

Build **only**:

| Deliverable | Spec anchor |
| ----------- | ----------- |
| Canonical object persistence | [Volume 2](./VOLUME-2-MEMORY_DATA_MODEL.md) · [Object Registry](./CANONICAL_OBJECT_REGISTRY.md) |
| Schema validation | Vol 2 · registry schemas |
| Lifecycle transitions | [Lifecycle Map](./MEMORY_LIFECYCLE_MAP.md) · [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) |
| Provenance envelope | [Trust & Provenance](./TRUST_PROVENANCE_MODEL.md) · [Convention S4](../convention/CONVENTION-S4-PROVENANCE_CONTRACT.md) |
| Immutable append semantics | Vol 3 write pipeline (persistence layer only) |
| Time model | [TIME_MODEL](./TIME_MODEL.md) |
| Trust metadata | TRUST_PROVENANCE_MODEL · frozen trust enum |
| Serialization | Vol 2 · domain-scoped storage |

**Explicitly excluded from Wave 1:**

- Recall engine · ranking · context assembly  
- Graph traversal · semantic query  
- Intelligence proposals · briefing generation  
- Policy enforcement UI (consent flows may stub refs only where schema requires)  
- Ingestion pipelines · connector import  
- Executive Discovery bootstrap flows  

---

## Success criterion

> Every canonical memory object can be stored, validated, reconstructed, and audited exactly as defined by the frozen specification.

Wave 1 passes when:

1. Each registry object type persists with required fields and validation errors are deterministic  
2. Lifecycle transitions enforce S2 — forbidden transitions reject with audit  
3. Provenance envelope is present on every persisted memory object  
4. Time fields bind per TIME_MODEL  
5. Trust metadata uses the frozen enum only  
6. No Factory artifact is modified  
7. No Wave 2+ behavior ships under Wave 1 PRs  

---

## Implementation guides

| Guide | Role |
| ----- | ---- |
| [Convention](../convention/CONVENTION-CLOSE.md) | Constitutional law |
| [Memory OS specification](./README.md) | What to build |
| [Architecture Book v1.0](../LOCALBRAIN_ARCHITECTURE_BOOK_v1.0.md) | Why it is built this way |
| [Engineering discipline](./ENG-MEM-001-ENGINEERING_DISCIPLINE.md) | How to commit · slice order · acceptance |
| [Wave 1 slices](./slices/README.md) | Per-object implementation charters |
| [Platform engineering debt](../engineering/ENGINEERING_DEBT.md) | Unrelated defects — not Memory OS |

---

## Wave sequence (do not skip)

```txt
Wave 1 — Canonical Storage          ← this charter
Wave 2 — Retrieval
Wave 3 — Executive Intelligence
Wave 4 — Organizational Intelligence
```

---

## Authorization chain

```txt
Factory certified (v1.0.0-factory-certified)
        ↓
MEM-008 freeze (memory-spec-v1.0) · 107/107 PASS
        ↓
Architecture Book v1.0 (interpretive canon)
        ↓
ENG-MEM-001 Wave 1 — first implementation code
```

---

*ENG-MEM-001 Wave 1 · Canonical Storage · LocalBrain V1 · 2026*
