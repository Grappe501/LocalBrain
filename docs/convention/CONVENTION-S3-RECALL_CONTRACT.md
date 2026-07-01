# Convention Session 3 — Recall Contract

> **Status:** **FROZEN** — recall pipeline contract for Memory OS, CoS, and Intelligence  
> **Depends on:** [Session 1 Ontology](./CONVENTION-S1-ONTOLOGY_CONTRACT.md) · [Session 2 Lifecycle](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md)  
> **Type:** Engineering contract — not algorithm · not embeddings · not SQL  
> **Parent:** [Executive Epistemology Convention](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md)  
> **Rule:** Clarify · freeze · constrain — **never invent**

---

## Success test (binding)

> **Could three different recall engines satisfy this contract and produce compatible executive behavior?**

Session 3 passes if recall is **question-scoped**, **lifecycle-aware**, **explainable**, and **confidence-gated** — independent of vector store, graph library, or model provider.

---

## Normative pipeline (contract only)

```txt
Executive Question
      ↓
Recall Plan              ← domains · scopes · budget · stop rules
      ↓
Candidate Memories       ← lifecycle-filtered · domain-routed
      ↓
Ranking                  ← invariants fixed · algorithm free
      ↓
Memory Confidence        ← system-derived · not model self-report
      ↓
Context Assembly         ← bounded bundle for reasoning entry
      ↓
Reasoning                ← gated · only after steps 1–5 complete
```

**Axiom 2:** No reasoning step until Recall Plan executed and Memory Confidence computed (or explicit defer/withhold issued).

---

## Recall entry point

| Field | Contract |
| ----- | -------- |
| **Definition** | Single API surface: `recall(request) → RecallResult` — all cognition paths use it. |
| **Callers** | CoS · departments · command layer · simulation (read-only) |
| **Trigger** | Active Executive Question (`question_id` required unless `emergency_bypass` with trace) |
| **Preconditions** | Question registered or emergent question logged · mission context if available |
| **Non-goals** | Ad-hoc filesystem grep as recall · raw LLM context stuffing |

---

## Required inputs (`RecallRequest`)

| Field | Required | Purpose |
| ----- | -------- | ------- |
| `question_id` | Yes* | EQ registry anchor (*emergent: `emergent_question_text` + trace) |
| `question_class` | Yes | operational · executive · epistemic |
| `mission_ids[]` | No | Mission Stack filter |
| `workspace_ids[]` | No | Scope limit |
| `domain_allowlist[]` | No | Default: infer from question + mission |
| `recall_budget` | Yes | max_items · max_bytes · max_latency_ms |
| `min_lifecycle_state` | Default `verified` | See lifecycle table below |
| `include_provisional` | Default `false` | Allow Captured-not-Verified only with trace flag |
| `interrupt_token` | No | For cancel/replace on question change |

---

## Required outputs (`RecallResult`)

| Field | Required | Purpose |
| ----- | -------- | ------- |
| `recall_id` | Yes | Stable audit id |
| `question_id` | Yes | Question served |
| `plan` | Yes | Domains queried · queries issued · budget consumed |
| `candidates[]` | Yes | All memory_ids considered |
| `selected[]` | Yes | Ranked subset entering context |
| `ignored[]` | Yes | Rejected with reason enum |
| `near_misses[]` | Yes | High-scoring excluded (explainability) |
| `memory_confidence` | Yes | 0–100 system score + component breakdown |
| `reasoning_gate` | Yes | `proceed` · `proceed_with_caveats` · `defer` · `withhold` |
| `context_bundle` | If gate ≠ withhold | Bounded assembly for reasoning |
| `provenance_refs[]` | Yes | memory_id + lifecycle_state at recall time |
| `latency_ms` | Yes | Observability |
| `contract_version` | Yes | `CON-S3-2026-07` |

Every recall must answer: **why retrieved · what question · strength · certainty · evidence · ignored · near-misses**.

---

## Recall plan contract

| Field | Contract |
| ----- | -------- |
| **Definition** | Declarative plan before retrieval — not implicit search. |
| **Contents** | `domains[]` · per-domain `query_spec` · `stop_rules` · `expected_coverage` |
| **Ownership** | Recall engine produces; CoS may narrow domains, not skip plan. |
| **Lifecycle filter** | Exclude Archived/Forgotten from default · Dormant deprioritized · Expired requires re-verify flag |
| **Stop rules** | Budget exhausted · confidence threshold met · diminishing returns (engine-defined, must log) |

---

## Ranking invariants (binding — algorithm free)

Implementations may use vectors, graphs, keywords, or hybrids. **Must** satisfy:

| # | Invariant |
| - | --------- |
| R1 | **Question relevance** dominates generic recency |
| R2 | **Verified** ranks above **Dormant** above **Expired** at equal relevance |
| R3 | **Provisional** (unverified) never ranks into `selected[]` unless `include_provisional=true` and trace marks it |
| R4 | **Mission-linked** memories rank above unlinked at equal relevance |
| R5 | **Domain routing** — only domains in plan may supply `selected[]` |
| R6 | **Conservation** — same `memory_id` appears once in `selected[]` |
| R7 | **Superseded** memories excluded unless explicitly historical query |
| R8 | **Deterministic tie-break** — `memory_id` lexicographic (reproducible audits) |

Ranking **algorithm** is not specified. Ranking **invariants** are.

---

## Memory Confidence contract

| Field | Contract |
| ----- | -------- |
| **Definition** | System-derived coverage score — **not** LLM self-report · not Reasoning Confidence |
| **Inputs** | domain coverage · recency · source diversity · mission linkage · index completeness · lifecycle mix |
| **Output** | 0–100 + `components{}` breakdown |
| **Thresholds** | ≥85 proceed · 60–84 proceed_with_caveats · <60 defer (propose gather) |
| **Gate** | `reasoning_gate` derived from confidence + question class (epistemic may require higher bar) |
| **Non-goals** | Model saying "I'm confident" |

**Reasoning Confidence** is a separate signal computed after reasoning — never substitutes for Memory Confidence.

---

## Progressive recall behavior

| Tier | Contract |
| ---- | -------- |
| **Tier 0 — Plan** | Emit plan only (dry-run / simulation) |
| **Tier 1 — Fast** | Index metadata + summaries · target < executive-interaction budget (RO-S3-010: 5s class) |
| **Tier 2 — Deep** | Full chunk/graph expansion if Tier 1 confidence < threshold |
| **Streaming** | May emit `selected[]` incrementally · must finalize `RecallResult` with complete audit fields |

Progressive tiers are **contract stages** — implementation may parallelize internally.

---

## Interruptibility (RO-S3-009)

| Event | Contract |
| ----- | -------- |
| Question change | Cancel in-flight recall via `interrupt_token` · emit `recall.interrupted` audit |
| New recall | Supersedes prior partial result — no merge without new `recall_id` |
| Reasoning start | Recall locked — no mutation of `selected[]` mid-reasoning |

---

## Domain routing

| Rule | Contract |
| ---- | -------- |
| Default route | Infer from `question_id` registry + active mission |
| Explicit override | `domain_allowlist[]` on request |
| Cross-domain | Allowed only when plan declares `cross_domain: true` with reason |
| Executive domain | Short TTL memories — prefer fresh synthesis ([S2 TTL](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md#domain-ttl-defaults-normative--overridable-per-domain-policy)) |
| Independence | Personal ≠ Workspace pollution ([Memory Domains](../LOCALBRAIN_MEMORY_DOMAINS.md)) |

---

## Provenance requirements (recall layer)

Session 4 deepens schema. Session 3 requires:

| Field | On each `selected[]` item |
| ----- | ------------------------- |
| `memory_id` | Yes |
| `domain` | Yes |
| `lifecycle_state` | At recall moment |
| `source_ref` | Yes |
| `strength` | Knowledge strength if derived |
| `certainty` | Separate axis |
| `truth_kind` | objective · relational · interpretive |

Recall without provenance refs **fails** certification.

---

## Failure behavior

| Condition | `reasoning_gate` | CoS behavior |
| --------- | ---------------- | ------------ |
| Zero candidates | `defer` | Propose gather · cite missing domains |
| Confidence < threshold | `defer` or `proceed_with_caveats` | Per threshold table |
| Budget timeout | `proceed_with_caveats` | Use partial `selected[]` · log `near_misses` |
| All candidates provisional | `withhold` | No recommendation without verification path |
| Domain unavailable | `proceed_with_caveats` | Explicit gap in context bundle |
| Runtime degradation | `defer` | Graceful self-limitation (RO-S3-019) |

**Never:** silent empty context · confident answer on failed recall.

---

## Recall audit events

```txt
event_type:       recall.complete | recall.interrupted | recall.deferred
recall_id:        RCL-*
question_id:      EQ-*
memory_confidence: 0-100
reasoning_gate:   proceed | proceed_with_caveats | defer | withhold
selected_count:   n
ignored_count:    n
latency_ms:       n
trace_id:         CTR-* (when cognition-linked)
contract_version: CON-S3-2026-07
```

Lifecycle transitions from [S2](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md): first reference emits `memory.reference`.

---

## Context assembly contract

| Field | Contract |
| ----- | -------- |
| **Definition** | Bounded bundle passed to reasoning — not unbounded prompt stuffing |
| **Contents** | `selected[]` ordered · `provenance_refs[]` · `gaps[]` · `estimated_bytes` |
| **Budget** | Must respect `recall_budget.max_bytes` |
| **UI projection** | [Executive Context Window](../LOCALBRAIN_EXECUTIVE_MEMORY_OS.md#executive-context-window) — inspectable |
| **Non-goals** | Hidden context · untraceable injections |

---

## Interoperability test obligations

Three engines pass if:

1. Same `RecallRequest` / `RecallResult` schema version
2. Same ranking invariants R1–R8 produce compatible `selected[]` ordering given identical index
3. Same confidence thresholds produce same `reasoning_gate` class
4. Audit events use identical enums
5. H-027 test harness can swap engines without CoS code change

---

## Session 3 gate

- [x] Recall pipeline contract frozen (Question → Reasoning gate)
- [x] Inputs · outputs · ranking invariants · Memory Confidence defined
- [x] Progressive · interruptible · domain routing · failure behavior specified
- [x] RO-CON-S2-001 · RO-S3-008–010 addressed at contract layer
- [x] No invented objects
- [x] Success test: three-engine interoperability — **pass**

**Next:** [Convention Session 4 — Provenance](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md#session-4--memory-provenance)

---

*Convention Session 3 · Recall · frozen contract · 2026*
