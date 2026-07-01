# ENG-MEM-001 — Engineering Discipline

> **Status:** Binding for all MEM-009 implementation commits  
> **Parent:** [Wave 1 Charter](./ENG-MEM-001-WAVE1-CHARTER.md) · `memory-spec-v1.0`  
> **Philosophy:** Implementation is an exercise in **fidelity, not invention**.

> **Principle:** Every object must be valuable before intelligence touches it — valid, traceable, explainable, auditable, and reconstructable even if the Intelligence layer were completely disabled.

> **Gold standard:** [ENG-MEM-001.1 Episode](./slices/ENG-MEM-001.1-EPISODE.md) — optimize for being the example every future slice copies, not for speed.

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
| 1 | ENG-MEM-001.1 | **Episode** | [Slice 1](./slices/ENG-MEM-001.1-EPISODE.md) |
| 2 | ENG-MEM-001.2 | **Fact** | validity · supersession · append-only corrections |
| 3 | ENG-MEM-001.3 | **Artifact** | external refs · provenance preserved |
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
├── Acceptance Checklist       A1–A11 in charter
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

Record results in the slice document before opening the next slice.

**Close-out required:** Every slice must publish an [implementation summary](./slices/SLICE_CLOSEOUT_TEMPLATE.md#implementation-summary-required) in its `SLICE_CLOSEOUT` before the next slice begins.

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
