# Memory OS — Canonical Glossary

> **Status:** **MAR-1 reviewed** — binding terminology for Volumes 1–7  
> **Authority:** [Convention S1](../convention/CONVENTION-S1-ONTOLOGY_CONTRACT.md) where terms overlap — this glossary extends for Memory OS spec  
> **Rule:** All volumes MUST use these terms consistently · amendment requires MEM-008 cycle

---

## Layer terms

| Term | Definition | Layer |
| ---- | ---------- | ----- |
| **Memory** | Durable record of what was captured from reality, with provenance | Memory OS |
| **Intelligence** | Interpretation, planning, recommendation — consumes recall | Vol 6 |
| **Policy** | Consent, approval, access control, audit enforcement | Vol 7 |
| **Observation** | Pre-memory signal — not persisted as memory until capture | Agency (pre-Memory) |
| **Recall** | Retrieval of memory under policy — auditable | Memory Engine |

---

## Epistemic terms (S1 — not Memory OS storage)

| Term | Definition | Owner |
| ---- | ---------- | ----- |
| **Knowledge** | Structured conclusion with evidence | Intelligence |
| **Belief** | Actionable stance with confidence | Intelligence |
| **Understanding** | Compressed relational model — sources preserved | Intelligence |
| **World Model** | Composed best-current reality representation | Cognitive Governance |

Memory OS stores **derivation links** to these — not conclusion bodies.

---

## Trust terms

| Term | Definition |
| ---- | ---------- |
| **Trust level** | Provenance classification enum — see [TRUST_PROVENANCE_MODEL](./TRUST_PROVENANCE_MODEL.md) |
| **Memory Confidence** | Recall ranking score — composite of trust, recency, corroboration |
| **Provenance envelope** | S4 required fields on every memory object |

---

## Time terms

| Term | Field | Definition |
| ---- | ----- | ---------- |
| **Event time** | `event_at` | When it happened in reality |
| **Observation time** | `observed_at` | When system detected signal |
| **Capture time** | `created_at` | When persisted to memory store |
| **Validity start** | `valid_from` | When fact authority begins |
| **Validity end** | `valid_until` | When fact authority ends (null = open) |

Full model: [TIME_MODEL](./TIME_MODEL.md)

---

## Lifecycle terms (S2 normative)

| Term | Definition |
| ---- | ---------- |
| **Captured** | Persisted with provenance — provisional authority |
| **Verified** | Attested accurate |
| **Referenced** | Used in cognition pass |
| **Superseded** | Replaced — lineage preserved |
| **Forgotten** | Retired — rare, explicit, auditable |

Review shorthand map: [MEMORY_LIFECYCLE_MAP](./MEMORY_LIFECYCLE_MAP.md)

---

## Object terms

| Term | Definition |
| ---- | ---------- |
| **Canonical object** | Versioned schema type in [CANONICAL_OBJECT_REGISTRY](./CANONICAL_OBJECT_REGISTRY.md) |
| **Episode** | Time-bounded memory container |
| **Fact** | Atomic attestable memory unit |
| **Artifact** | File or structured deliverable referenced by memory |
| **DecisionCitation** | Memory record citing Decision Ledger entry — not binding decision |
| **AuditEvent** | Append-only governance event — not recallable memory |

---

## Graph terms

| Term | Definition |
| ---- | ---------- |
| **Edge** | Typed relationship — [frozen vocabulary](./GRAPH_RELATIONSHIP_VOCABULARY.md) only |
| **Node** | Reference to canonical object or external registry entry |
| **Traversal** | Bounded graph walk for recall — not reasoning |

---

## Identity terms

| Term | Definition |
| ---- | ---------- |
| **Identity** | Stable `identity_id` — who exists |
| **Persona** | Assistant actor under delegation |
| **DelegationGrant** | Time-bounded authority transfer — [DELEGATION_MODEL](./DELEGATION_MODEL.md) |

---

## Domain terms (six domains)

`personal` · `workspace` · `system` · `relationship` · `learning` · `executive`

Per [Memory Domains v1.0](../LOCALBRAIN_MEMORY_DOMAINS.md) — domains never merge storage.

---

*Canonical Glossary · Memory OS spec v1 draft · MAR-1*
