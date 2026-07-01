# ENG-MEM-001.5 — DecisionCitation (Slice 5)

> **Status:** **AUTHORIZED** — PMO 2026-07-01 · **Reference Slice 005** (governance engineering)  
> **Wave:** 1 · Institutional Cognition Foundation (constitutional completion)  
> **Designation:** **Reference Slice 005** — follow DecisionCitation for all future **governance engineering**  
> **Object:** DecisionCitation — cites Decision Ledger; does not duplicate binding authority  
> **Ceremony:** [ENG-PMO-004](../ENG-PMO-004-DECISIONCITATION-AUTHORIZATION.md)  
> **Completes:** Institutional Cognition Foundation (Wave 1 substrate set)

```text
Reference Implementation (engineering discipline)
ENG-MEM-001.1 Episode — Reference Slice 001

Reference Implementation (knowledge engineering — where applicable)
ENG-MEM-001.2 Fact — Reference Slice 002

Reference Implementation (evidence engineering — where applicable)
ENG-MEM-001.3 Artifact — Reference Slice 003

Reference Implementation (interpretation engineering — where applicable)
ENG-MEM-001.4 Conversation — Reference Slice 004

Reference Implementation (governance engineering)
ENG-MEM-001.5 DecisionCitation — Reference Slice 005

Specification Fidelity
Required (100% or Not Accepted)
```

---

## PMO Authorization

```text
ENG-MEM-001.5
DecisionCitation
STATUS:
AUTHORIZED
```

Architecture shift at this slice: Wave 1 completes the transition from preserving **information and interpretation** to preserving **institutional authority** — what the institution formally decided, not what Intelligence believes was decided.

---

## The Authority Principle (binding)

**Constitutional statement:**

> **Authority is exercised. It is never inferred.**

If a model thinks *"They probably approved this"* — that is **not** a DecisionCitation.

Authority exists only because someone exercised it — never because Intelligence believes they did.

---

## Ledger boundary (binding — MAR-1)

```text
Decision Ledger     →  binding decision authority
DecisionCitation    →  memory record citing ledger entry
```

Memory OS stores **DecisionCitation** only. The binding `Decision` lives in [Decision Ledger](../../LOCALBRAIN_DECISION_LEDGER.md).

DecisionCitation must include valid `decision_id` and `ledger_ref` foreign keys. It must **never** become a second authority store.

---

## Reference relationship (binding)

```text
DecisionCitation  →  may reference  →  Episode · Artifact · Fact · Conversation
DecisionCitation  →  never owns     →  Episode · Artifact · Fact · Conversation
```

The authority object remains small. Its power comes from references — not from duplicating substrates.

---

## Substrate progression (complete at acceptance)

```text
Episode          → History
Artifact         → Evidence
Fact             → Knowledge
Conversation     → Interpretation
DecisionCitation → Authority
```

### Executive questions

| Object | Question |
| ------ | -------- |
| Episode | What happened? |
| Artifact | What evidence exists? |
| Fact | What do we know? |
| Conversation | What are people saying? |
| DecisionCitation | What decisions were exercised? |

---

## Five institutional integrities

| Object | Integrity |
| ------ | --------- |
| Episode | Historical integrity |
| Artifact | Evidentiary integrity |
| Fact | Knowledge integrity |
| Conversation | Interpretive integrity |
| DecisionCitation | **Governance integrity** |

---

## Mission

Implement **DecisionCitation** canonical persistence — schema, validation, serialization, lifecycle, provenance, ledger citation, decider attribution, supporting memory refs, and audit hooks.

**Follow Reference Slice 001** for file layout, validator strictness, audit pattern, tests, and commit format.

**Follow Reference Slice 002** where provenance attachment applies.

**Excluded from Wave 1:** inference of authority · LLM decision detection · reconciliation · policy enforcement UI · ledger mutation from Memory OS write path beyond citation.

---

## Specification anchors

| Anchor | Document |
| ------ | -------- |
| `Vol2-DecisionCitation` | [Volume 2 § DecisionCitation](../VOLUME-2-MEMORY_DATA_MODEL.md) |
| `Registry-DecisionCitation` | [Object Registry — DecisionCitation](../CANONICAL_OBJECT_REGISTRY.md) |
| `MAR-V01` | [MAR-1 DecisionCitation split](../MAR-1-ARCHITECTURE_REVIEW.md) |
| `S2-Lifecycle` | [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) |
| `S4-Provenance` | [Convention S4](../convention/CONVENTION-S4-PROVENANCE_CONTRACT.md) |
| `TIME_MODEL` | [Time Model](../TIME_MODEL.md) |
| `TRUST` | [Trust & Provenance Model](../TRUST_PROVENANCE_MODEL.md) |
| `DELEGATION` | [Delegation Model](../DELEGATION_MODEL.md) |
| `Vol3-WritePipeline` | [Volume 3](../VOLUME-3-MEMORY_ENGINE.md) — write path (persistence only) |
| `Decision-Ledger` | [Decision Ledger](../../LOCALBRAIN_DECISION_LEDGER.md) |

---

## Required fields (Vol 2)

| Field | Required |
| ----- | -------- |
| `citation_id` | Yes |
| `schema_version` | Yes |
| `decision_id` | Yes — ledger FK |
| `question` | Yes |
| `outcome_summary` | Yes |
| `decided_at` | Yes — event time |
| `decider_ref` | Yes |
| `supporting_memory_refs` | Yes |
| `ledger_ref` | Yes |
| `lifecycle_state` | Yes |
| `provenance` | Yes |
| `event_at` | Yes |
| `created_at` | Yes |

---

## A17 — Authority Integrity (binding)

DecisionCitation introduces **A17 Authority Integrity** as a permanent acceptance criterion — the governance counterpart to A12 (knowledge), A13 (evidence), A14–A16 (interpretation).

Executive question:

> **Who exercised institutional authority?**

Acceptance verifies:

- authority explicitly identified (`decider_ref`)
- delegation traceable (via provenance · `decider_ref` · optional grant refs in supporting refs)
- governing authority preserved (`decision_id` + `ledger_ref` immutable)
- decision body immutable after capture
- supporting references intact (identifier refs only — no substrate mutation)

**Not:** Was this the right decision? Did Intelligence agree?

### A17 test evidence (required in `decisionCitation.test.ts`)

- Reconstruct authority chain from stored DecisionCitation fields alone
- Verify ledger citation immutable after create
- Verify referenced substrates not mutated by DecisionCitation writes
- Reject inferred-authority fields at validation

---

## Engineering invariants (DecisionCitation)

| Invariant | Rule |
| --------- | ---- |
| Authority exercised | Never inferred — explicit decider and ledger citation only |
| Ledger boundary | Cites ledger — never duplicates binding decision |
| Reference only | May reference Episode · Artifact · Fact · Conversation — never own |
| Small object | Authority record stays minimal — power from references |
| Provenance immutable | S4 envelope at create |
| Append-only | Authoritative body immutable; lifecycle transitions only |
| No inference | No LLM authority detection · no "probably approved" semantics |

---

## Recommended commit sequence

| Commit | Scope |
| ------ | ----- |
| **001.5.1** | Canonical DecisionCitation storage — schema · validation · persistence · S4 · lifecycle · ledger citation · decider · supporting refs |

> **Reference Slice 005** follows **ENG-PMO-005** acceptance after full 001.5 completion.

### 001.5.1 scope (binding)

**Deliver only:**

- Canonical DecisionCitation schema
- Validation (authority-only · ledger FK · reference-not-ownership)
- Storage + append-only body preservation
- Provenance envelope
- `decider_ref` · `decided_at` · `supporting_memory_refs`
- A17 authority reconstruction walk

**Explicitly exclude:**

- Binding decision creation in Memory OS (ledger owns authority)
- Inferred authority · LLM decision detection
- Cross-substrate mutation
- Policy enforcement · approval workflows (cite refs only)

---

## Deliverables

- [ ] DecisionCitation schema (`shared/src/memoryOs/decisionCitation.ts`)
- [ ] Validator — reject unknown fields · authority-only · ledger boundary
- [ ] S2 lifecycle + S4 provenance (Reference Slice patterns)
- [ ] Persistence + append-only + reference-not-ownership invariants
- [ ] Tests including A17 authority reconstruction walk
- [ ] Slice closeout — **Specification Fidelity: 100%** · Reference Slice 005

---

## Deterministic foundation

DecisionCitation completes the deterministic institutional substrate. See [Deterministic Foundation Doctrine](../DETERMINISTIC-FOUNDATION-DOCTRINE.md).

> AI should not be the memory of an institution. AI should reason over the institution's deterministic memory.

---

*ENG-MEM-001.5 · Reference Slice 005 · Governance Engineering · LocalBrain V1 · 2026*
