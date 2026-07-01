# Volume 1 — Memory Constitution

> **Milestone:** MEM-001  
> **Status:** Draft — **MAR-1 reviewed**  
> **Glossary:** [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md)  
> **Principle:** Memory records what happened. Intelligence interprets what happened. Policy decides what should happen.  
> **Parent:** [Memory OS Design Package](./README.md)  
> **Implements:** [Convention S1 Ontology](../convention/CONVENTION-S1-ONTOLOGY_CONTRACT.md) · [S2 Lifecycle](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) · [S5 Ethics](../convention/CONVENTION-S5-ETHICS_CONTRACT.md)

---

## Success test (binding)

> **Could two independent teams implement Memory OS and produce interoperable memory records that respect the same ownership, privacy, and lifecycle boundaries?**

---

## Article I — What memory is

**Memory** is the durable record of what the institution observed, captured, and attested — not what it concluded, recommended, or decided.

| Memory is | Memory is not |
| --------- | ------------- |
| Observed and captured facts | Beliefs or interpretations |
| Domain-scoped and attributable | Undifferentiated blob storage |
| Lifecycle-governed | Silent deletion |
| Provenance-backed | Authoritative without source |
| Recallable under policy | Always visible |

Memory answers: **"What do we have on record?"**  
Intelligence answers: **"What does it mean?"**  
Policy answers: **"What should we do?"**

---

## Article II — Memory philosophy

LocalBrain follows **memory before reasoning** ([Constitution Article XIII](../LOCALBRAIN_CONSTITUTION.md)):

```txt
Observation → Capture → Memory → Recall → Knowledge → Belief → Understanding → Reasoning
```

Memory OS owns everything from **Capture** through **Recall**. Downstream cognition consumes memory — it does not rewrite it.

### Remembered vs concluded

```txt
Remembered:  Kelly spoke with Chris on Monday.        (Memory)
Concluded:   Campaign planning is accelerating.       (Intelligence)
Decided:     Schedule strategy session Friday.        (Policy / Executive action)
```

Conclusions must cite supporting memories. Memories must never be retroactively altered to match conclusions.

---

## Article III — Ownership

| Owner | Scope | Authority |
| ----- | ----- | --------- |
| **Executive** | Personal + Executive domains | Full consent over personal capture |
| **Institution** | Workspace + Relationship + Operational | Governed by department policy |
| **System** | System domain | Machine health — not personal content |
| **Factory** | None | Factory never owns memory post-install |

**Rule:** Memory OS captures; Agency and tension engines surface ownership conflicts — Memory OS does not resolve them silently ([S1 Ownership](../convention/CONVENTION-S1-ONTOLOGY_CONTRACT.md)).

---

## Article IV — Privacy model

| Tier | Description | Default recall |
| ---- | ----------- | -------------- |
| **Sovereign** | Owner-only — personal preferences, health, private notes | Owner context only |
| **Institutional** | Shared within institution boundaries | Department-scoped |
| **Delegated** | Shared with explicit delegation grant | Grant-scoped |
| **Public reference** | Documentation, manuals, APIs | Unrestricted within institution |

Privacy tier is declared at capture — not inferred at recall. [S5 Ethics](../convention/CONVENTION-S5-ETHICS_CONTRACT.md) governs consent boundaries.

---

## Article V — Identity boundaries

Memory is **about** identities — it is not identity itself.

| Concept | Layer |
| ------- | ----- |
| Executive identity | [Volume 4 — Identity Layer](./VOLUME-4-IDENTITY_LAYER.md) |
| Memory records | This volume — attributed to identity, not identical |
| Passport / authority | Factory birth certificate — pre-Memory OS |
| Persona / assistant voice | Intelligence layer — not memory storage |

A memory record references `subject_id` and `actor_id` — it does not define who the executive is.

---

## Article VI — Lifecycle

Every memory record follows [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md):

```txt
Observed → Captured → Verified → Referenced → Strengthened → Dormant → Archived → Forgotten (rare)
```

**Binding rules:**

- **Forgotten** means explicit retirement with reason — never silent erasure
- **Dismissed** observations never become memory
- **Superseded** memories retain history — authority transfers to successor
- **Expired** demotes authority — record retained

Memory OS must emit lifecycle transition events for audit ([Volume 7](./VOLUME-7-GOVERNANCE_AND_SAFETY.md)).

---

## Article VII — Retention

| Domain | Default retention | Override |
| ------ | ----------------- | -------- |
| Executive | Session + mission horizon | Owner policy |
| Workspace | Project lifetime + archive period | Workspace policy |
| Relationship | Indefinite while relationship active | Explicit forget |
| Learning | Curriculum lifetime | Academy policy |
| System | Rolling window (health snapshots) | System policy |
| Personal | Owner-controlled | Sovereign tier |

Retention policy **demotes** — it does not delete without explicit Forgotten transition.

---

## Article VIII — Forgetting

Forgetting is **rare, explicit, and auditable**.

| Requirement | Rule |
| ----------- | ---- |
| Trigger | Human-initiated or policy-mandated with reason code |
| Record | Original memory immutable — Forgotten state appended |
| Recall | Excluded from default recall — available in audit export |
| Reversal | Cannot un-forget — must re-capture as new memory |

"Delete" in user language maps to Forgotten + export exclusion — not physical erasure of audit trail.

---

## Article IX — Trust levels

Frozen trust enum: [TRUST_PROVENANCE_MODEL](./TRUST_PROVENANCE_MODEL.md)

Memory Confidence ([ENG-MC-001](../LOCALBRAIN_EXECUTIVE_MEMORY_OS.md)) is independent of lifecycle state:

| Dimension | Meaning |
| --------- | ------- |
| **Trust level** | Seven-level provenance enum — `system` through `hypothesis` |
| **Recency** | How fresh is the authority — [TIME_MODEL](./TIME_MODEL.md) |
| **Corroboration** | How many independent `supports` edges exist |

Trust levels affect **recall ranking** — not whether a memory exists.

---

## Article X — Provenance

Every memory carries a [Convention S4](../convention/CONVENTION-S4-PROVENANCE_CONTRACT.md) provenance envelope:

```txt
who captured · when · from what source · under what consent · with what method
```

Provenance is immutable after capture. Corrections create new memories that supersede — they do not edit provenance.

---

## Article XI — Auditability

| Event | Required fields |
| ----- | --------------- |
| `memory.captured` | `memory_id` · domain · actor · source_ref |
| `memory.verified` | `memory_id` · verifier · method |
| `memory.recalled` | `memory_id` · recall_context · rank_position |
| `memory.superseded` | `old_id` · `new_id` · reason |
| `memory.forgotten` | `memory_id` · reason · authorizer |

Audit logs are append-only. Memory OS writes them; Governance layer enforces retention ([Volume 7](./VOLUME-7-GOVERNANCE_AND_SAFETY.md)).

---

## MAR-1 resolutions

| ID | Resolution | Document |
| -- | ---------- | -------- |
| Q1 | Trust enum finalized | [TRUST_PROVENANCE_MODEL](./TRUST_PROVENANCE_MODEL.md) |
| Q2 | Cross-domain refs via graph edges only | [CANONICAL_OBJECT_REGISTRY](./CANONICAL_OBJECT_REGISTRY.md) |
| Q3 | Delegation schema finalized | [DELEGATION_MODEL](./DELEGATION_MODEL.md) |

Review: [MAR-1 Architecture Review](./MAR-1-ARCHITECTURE_REVIEW.md) · Freeze gate: [MEM-008](./MEM-008-EXIT_CRITERIA.md)

---

*Volume 1 · Memory Constitution · MEM-001*
