# Volume 5 — Knowledge Graph

> **Milestone:** MEM-004  
> **Status:** Draft — **MAR-1 reviewed**  
> **Vocabulary:** [GRAPH_RELATIONSHIP_VOCABULARY](./GRAPH_RELATIONSHIP_VOCABULARY.md) — **14 edge types only**  
> **Glossary:** [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md)  
> **Principle:** Memory records what happened. Intelligence interprets what happened. Policy decides what should happen.  
> **Parent:** [Memory OS Design Package](./README.md) · [Volume 2](./VOLUME-2-MEMORY_DATA_MODEL.md) · [Volume 3](./VOLUME-3-MEMORY_ENGINE.md)

---

## Success test (binding)

> **Could two independent teams traverse the same memory graph and reconstruct equivalent institutional context for any executive question?**

---

## Purpose

The Knowledge Graph is the **semantic backbone** connecting memory objects — not a replacement for memory storage.

```txt
Memory objects (Vol 2)  →  nodes
Relationships (edges)   →  institutional reasoning substrate
Recall (Vol 3)          →  traverses graph + indexes
Intelligence (Vol 6)    →  interprets traversals — does not own edges
```

---

## Node types

| Node | Source object |
| ---- | ------------- |
| `memory` | Any Vol 2 canonical object |
| `identity` | [Volume 4](./VOLUME-4-IDENTITY_LAYER.md) identity |
| `capability` | Capability Registry entry (reference) |
| `goal` | Goal object |
| `project` | Project object |
| `episode` | Episode object |
| `artifact` | Artifact object |

Nodes are **references** — canonical data lives in primary store.

---

## Edge types (frozen v1)

**Authority:** [GRAPH_RELATIONSHIP_VOCABULARY](./GRAPH_RELATIONSHIP_VOCABULARY.md)

| Edge | Meaning |
| ---- | ------- |
| `contains` | Structural containment |
| `references` | Non-semantic pointer |
| `supports` | Evidential support |
| `contradicts` | Conflict (symmetric) |
| `derived_from` | Provenance derivation |
| `implemented_by` | Plan → execution |
| `owned_by` | Ownership / authority |
| `depends_on` | Prerequisite dependency |
| `replaces` | Version succession |
| `supersedes` | Authority transfer |
| `observed_in` | Situational context |
| `explains` | Causal explanation |
| `related_to` | Weak association |
| `attributed_to` | Actor/subject attribution |

No other edge types in v1. Manual curation uses this vocabulary only.

---

## Edge metadata (required)

`edge_id` · `edge_type` · `from_ref` · `to_ref` · `created_at` · `created_by` · `provenance_ref` · `confidence` · `cross_domain`

Cross-domain edges require policy check at recall ([CANONICAL_OBJECT_REGISTRY](./CANONICAL_OBJECT_REGISTRY.md)).

---

## Graph construction

| Source | Edges created |
| ------ | ------------- |
| Write pipeline | `contains` · `observed_in` · `attributed_to` · `derived_from` |
| Consolidation | `supersedes` · `replaces` · `supports` |
| Conflict resolution | `contradicts` |
| Decision capture | `explains` · `references` (DecisionCitation) |
| Project linking | `depends_on` · `implemented_by` · `owned_by` |
| Intelligence proposal | `supports` · `explains` — committed by write pipeline only |

Automatic edge inference below confidence threshold → `proposed_edges` queue — not canonical graph.

---

## Traversal policies

| Traversal | Use case |
| --------- | -------- |
| **Evidence chain** | Follow `supports` + `derived_from` backward |
| **Conflict surface** | Follow `contradicts` from candidate |
| **Accountability** | Follow `owned_by` + `explains` + DecisionCitation |
| **Goal alignment** | Follow `depends_on` toward active goals |
| **Temporal path** | Episode `observed_in` ordering |

Traversals respect domain and privacy policy — edges do not bypass permission boundaries.

---

## Retrieval integration

Recall pipeline ([Vol 3](./VOLUME-3-MEMORY_ENGINE.md)) uses graph in candidate generation:

```txt
Intent classification
    → Seed nodes (capability · goal · identity)
    → Graph expansion (bounded depth)
    → Vector similarity (parallel)
    → Merge + salience rank
    → Context assembly
```

---

## Factory baseline

At Factory install, graph contains institutional structure nodes (departments, capabilities — empty shells). No personal edges. Personalization populates — never modifies Factory structural nodes.

---

*Volume 5 · Knowledge Graph · MEM-004*
