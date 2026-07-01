# Canonical Object Registry

> **Status:** **MAR-1 reviewed** — single owner per object  
> **Parent:** [MAR-1 Architecture Review](./MAR-1-ARCHITECTURE_REVIEW.md) · [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md)

---

## Registry rules

1. Every persisted type has exactly **one owner**.
2. Every memory object carries `schema_version`, `domain`, `lifecycle_state`, `provenance`.
3. External registries are **referenced**, not redefined.
4. Observation is **not** a registry entry — pre-memory boundary only.

---

## Master registry

| Object | Owner | Schema doc | Lifecycle | Graph node? |
| ------ | ----- | ---------- | --------- | ----------- |
| **Memory** (umbrella) | ENG-MEM-001 | S1 + S2 | S2 state machine | — |
| **Episode** | ENG-MEM-001 | [Vol 2](./VOLUME-2-MEMORY_DATA_MODEL.md) | S2 | Yes |
| **Fact** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **Skill** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **Relationship** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **Preference** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **Project** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **Organization** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **Conversation** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **ConversationTurn** | ENG-MEM-001 | Vol 2 | S2 | No (child of Conversation) |
| **Task** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **Goal** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **Artifact** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **DecisionCitation** | ENG-MEM-001 | Vol 2 | S2 | Yes |
| **Identity** | Identity Layer | [Vol 4](./VOLUME-4-IDENTITY_LAYER.md) | Identity lifecycle | Yes |
| **DelegationGrant** | Identity Layer | [DELEGATION_MODEL](./DELEGATION_MODEL.md) | Grant lifecycle | Yes |
| **GraphEdge** | Knowledge Graph | [GRAPH_RELATIONSHIP_VOCABULARY](./GRAPH_RELATIONSHIP_VOCABULARY.md) | Immutable append | — |
| **AuditEvent** | Governance | [Vol 7](./VOLUME-7-GOVERNANCE_AND_SAFETY.md) | Append-only | No |
| **DerivationLink** | Knowledge Graph | Vol 5 | Immutable | Yes (`derived_from`) |

---

## External references (not owned by Memory OS)

| Object | Owner | Memory OS relationship |
| ------ | ----- | ---------------------- |
| **Observation** | Agency / tension engines | Capture input only — not stored |
| **Knowledge** | Executive Intelligence | `derivation_link` edge only |
| **Belief** | Executive Intelligence | `derivation_link` edge only |
| **Understanding** | Executive Intelligence | `derivation_link` edge only |
| **Decision** (binding) | Decision Ledger | `DecisionCitation` cites `decision_id` |
| **Capability** | Capability Registry | Graph node by `capability_id` |
| **Executive Question** | Question Registry | Recall scope anchor — not memory |
| **Cognitive Trace** | Executive Evolution | Post-decision — cites memories |

---

## Object relationships (summary)

```txt
Observation ──capture──► Episode / Fact / …
Episode ──contains──► Fact · ConversationTurn · Artifact
Fact ──attributed_to──► Identity
Fact ──observed_in──► Episode
Fact ──supersedes──► Fact (older)
DecisionCitation ──references──► Decision (ledger)
DecisionCitation ──explains──► Goal · Task
Project ──depends_on──► Goal
Task ──implemented_by──► Project
Knowledge ──derived_from──► Fact (link only — Intelligence owns body)
```

---

## Identity lifecycle (Vol 4)

| State | Meaning |
| ----- | ------- |
| `provisioned` | Factory template instantiated |
| `discovered` | Executive Discovery completed |
| `active` | Normal operation |
| `suspended` | Access frozen — memory retained |
| `retired` | Identity closed — memory archived |

---

## DelegationGrant lifecycle

| State | Meaning |
| ----- | ------- |
| `proposed` | Awaiting grantor approval |
| `active` | In force |
| `expired` | `valid_until` passed |
| `revoked` | Terminated early |

---

## Artifact (MAR-1 addition)

Files and structured deliverables referenced by workspace memory.

| Field | Required |
| ----- | -------- |
| `artifact_id` | Yes |
| `schema_version` | Yes |
| `domain` | Yes — typically `workspace` |
| `uri` or `content_ref` | Yes |
| `mime_type` | Yes |
| `project_ref` | No |
| `lifecycle_state` | Yes |
| `provenance` | Yes |
| `event_at` | Yes |

---

## DecisionCitation (MAR-1 rename)

Replaces ambiguous "Decision" in Vol 2. The **binding decision** lives in Decision Ledger.

| Field | Required |
| ----- | -------- |
| `citation_id` | Yes |
| `decision_id` | Yes — ledger foreign key |
| `question` | Yes — copy for recall |
| `outcome_summary` | Yes |
| `decided_at` | Yes — event time |
| `decider_ref` | Yes |
| `supporting_memory_refs` | Yes |
| `lifecycle_state` | Yes |
| `provenance` | Yes |

---

## Cross-domain references (MAR-1 resolution)

Cross-domain links are permitted **only via graph edges** with explicit `cross_domain: true` flag:

- Edge must declare both domain endpoints
- Policy checks both domains at recall
- Personal → institutional requires sovereign consent ([S5](../convention/CONVENTION-S5-ETHICS_CONTRACT.md))

No foreign-key pointers across domain partitions in primary store.

---

*Canonical Object Registry · MAR-1 · Memory OS spec v1 draft*
