# Graph Relationship Vocabulary

> **Status:** **MAR-1 reviewed** — frozen controlled vocabulary for v1  
> **Parent:** [MAR-1 §1.6](./MAR-1-ARCHITECTURE_REVIEW.md) · [Volume 5](./VOLUME-5-KNOWLEDGE_GRAPH.md)

---

## Rule

**Only these 14 edge types are permitted in v1.** No arbitrary relationship labels. Proposed edges below confidence threshold remain in `proposed_edges` queue — not in canonical graph until committed.

New types require MEM-008 amendment or Memory OS spec v1.1 cycle.

---

## Frozen vocabulary

| # | Edge type | Direction | Meaning | Example |
| - | --------- | --------- | ------- | ------- |
| 1 | `contains` | parent → child | Structural containment | Episode contains Fact |
| 2 | `references` | source → target | Non-semantic pointer | Task references Artifact |
| 3 | `supports` | evidence → claim | Evidential support | Fact supports Goal |
| 4 | `contradicts` | A ↔ B | Conflict — symmetric | Fact contradicts Fact |
| 5 | `derived_from` | child → parent | Provenance derivation | Summary derived_from Episode |
| 6 | `implemented_by` | plan → execution | Execution link | Goal implemented_by Task |
| 7 | `owned_by` | resource → identity | Ownership / authority | Project owned_by Identity |
| 8 | `depends_on` | dependent → prerequisite | Dependency | Project depends_on Goal |
| 9 | `replaces` | new → old | Version succession | Artifact replaces Artifact |
| 10 | `supersedes` | new → old | Authority transfer | Fact supersedes Fact |
| 11 | `observed_in` | fact → context | Situational context | Fact observed_in Episode |
| 12 | `explains` | cause → effect | Causal explanation | Fact explains DecisionCitation |
| 13 | `related_to` | A ↔ B | Weak association — lowest rank | Organization related_to Organization |
| 14 | `attributed_to` | memory → identity | Actor/subject attribution | Fact attributed_to Identity |

---

## Edge metadata (required on every edge)

| Field | Purpose |
| ----- | ------- |
| `edge_id` | Stable identifier |
| `edge_type` | One of 14 above |
| `from_ref` | Node reference |
| `to_ref` | Node reference |
| `created_at` | Capture time |
| `created_by` | `identity_ref` |
| `provenance_ref` | S4 link |
| `confidence` | 0–1 for inferred edges |
| `cross_domain` | Boolean — triggers policy check |

---

## Mutual exclusion rules

| Pair | Rule |
| ---- | ---- |
| `supersedes` / `replaces` | Mutually exclusive for same pair — choose one semantic |
| `contradicts` | Symmetric — store once, query both directions |
| `derived_from` | Acyclic except through `episode` root |
| `related_to` | Use only when no specific type applies |

---

## Creation authority

| Edge | Created by |
| ---- | ---------- |
| `contains` · `observed_in` · `attributed_to` · `derived_from` | Write pipeline |
| `supersedes` · `replaces` | Consolidation |
| `contradicts` | Conflict detection |
| `supports` · `explains` | Consolidation or Intelligence proposal → write pipeline commit |
| `depends_on` · `implemented_by` · `owned_by` | Capture or manual curation |
| `references` · `related_to` | Capture — `related_to` requires justification field |

Intelligence may **propose** `supports` and `explains` — Memory Engine **commits** after validation.

---

## Deprecated aliases (do not use)

| Alias | Use instead |
| ----- | ----------- |
| `decided_by` | `attributed_to` + DecisionCitation object |
| `relates_to` | `related_to` |

MAR-1 harmonized vocabulary — Vol 5 updated accordingly.

---

*Graph Relationship Vocabulary · MAR-1 · Memory OS spec v1 draft*
