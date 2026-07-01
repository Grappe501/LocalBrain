# Convention Session 4 — Provenance Contract

> **Status:** **FROZEN** — provenance contract for Memory OS, CoS, Intelligence, and Meta-Cognition  
> **Depends on:** [Session 1 Ontology](./CONVENTION-S1-ONTOLOGY_CONTRACT.md) · [Session 2 Lifecycle](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) · [Session 3 Recall](./CONVENTION-S3-RECALL_CONTRACT.md)  
> **Type:** Engineering contract — not storage engine · not schema DDL · not graph library  
> **Parent:** [Executive Epistemology Convention](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md)  
> **Rule:** Clarify · freeze · constrain — **never invent**

---

## Success test (binding)

> **Could an executive click "Why?" on any recommendation and deterministically arrive at its supporting chain?**

Not necessarily instantly. Not necessarily fully expanded at first render. But **deterministically** — same recommendation + same contract version ⇒ same chain identifiers and hop order.

Session 4 passes if provenance is **always present**, **pointer-resolvable**, and **checkpoint-bounded** — independent of SQLite, Postgres, event log, or document store.

---

## Normative question

Convention answers:

> **What provenance must always exist?**

Convention does **not** answer:

> *How do we store provenance?*

The storage engine remains free to evolve.

---

## Universal provenance envelope (`ProvenanceRecord`)

Every cognitive object that influences executive judgment exports a **ProvenanceRecord** — a contract envelope, not a physical table.

| Field | Required | Purpose |
| ----- | -------- | ------- |
| `provenance_id` | Yes | Stable identifier — `PRV-*` |
| `object_type` | Yes | memory · knowledge · belief · understanding · decision · recommendation · trace_checkpoint |
| `object_id` | Yes | Target object id |
| `origin` | Yes | How the object entered cognition — see [Source classes](#source-classes-normative) |
| `source_ref` | Yes | Anchor to KnowledgeSource, capture event, or synthesis parent |
| `created_at` | Yes | First provenance moment (ISO-8601) |
| `recorded_at` | Yes | When this provenance snapshot was written |
| `version` | Yes | Object version at record time — monotonic per `object_id` |
| `ownership` | Yes | Actor / office / engine that authored or attested |
| `parent_refs[]` | When derived | Direct ancestry pointers — not embedded copies |
| `supporting_evidence[]` | When assertive | Refs to memories, sources, or observations |
| `contradicting_evidence[]` | When assertive | Required or explicit `none_declared` |
| `confidence_source` | When scored | Which signal produced the score — see [Confidence sources](#confidence-sources-separate-contracts) |
| `supersession` | When applicable | `supersedes` · `superseded_by` · reason |
| `trace_linkage` | When cognition-linked | `trace_id` · `checkpoint_id` · `question_id` · `recall_id` |
| `lifecycle_state` | Memory only | State at reference moment ([S2](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md)) |
| `truth_kind` | Knowledge/Belief | objective · relational · interpretive |
| `strength` | Knowledge/Belief | Evidence volume axis |
| `certainty` | Knowledge/Belief | Correctness axis — independent of strength |
| `contract_version` | Yes | `CON-S4-2026-07` |

**Invariant P1:** Provenance is **append-only**. Corrections add records; they do not mutate prior provenance rows.

**Invariant P2:** Ancestry is **by reference** (`parent_refs[]`, `supporting_evidence[]`) — never require synchronous reconstruction of full history to satisfy default "Why?" view.

---

## Source classes (normative)

| Class | Meaning | Example |
| ----- | ------- | ------- |
| `knowledge_source_read` | Read from registered [KnowledgeSource](../LOCALBRAIN_KNOWLEDGE_SOURCES.md) | Filesystem path · SQL query · API response |
| `user_attestation` | Executive or authorized user verified content | "This is correct" |
| `observation_capture` | Observation promoted to Memory ([S2](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md)) | Salience gate capture |
| `action_outcome` | Verified result from Action Pipeline | Task completion · metric delta |
| `synthesis` | Engine-derived combination | CoS merge · department report |
| `council_lens` | Judgment lens contribution — auditable, non-binding | Risk · ethics · finance lens |
| `decision_ledger` | Binding or proposed decision reference | `DEC-*` |
| `inference` | Derived Knowledge from memories | Structured conclusion |

**Non-goals:** Hostile-actor taxonomy · security classification model (PR-S4-003i — handled via break detection, not new object).

---

## Per-object provenance requirements

### Memory

Extends [S2 required fields](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md#required-memory-record-fields-lifecycle-extension).

| Must always exist | Contract |
| ----------------- | -------- |
| Origin | `source_class` + `source_ref` |
| Ancestry | `parent_refs[]` when merged or derived |
| Supersession | `supersedes` / `superseded_by` when replaced |
| Version | Content or metadata version increments on material change |
| Timestamp | `created_at` · `verified_at` when applicable |
| Ownership | Capturing engine or user |
| Trace linkage | When referenced in cognition — `trace_id` + lifecycle at reference |

Verified memory: provenance chain **immutable**; belief revision does not mutate Memory provenance ([S1 Belief](./CONVENTION-S1-ONTOLOGY_CONTRACT.md#belief)).

### Knowledge

| Must always exist | Contract |
| ----------------- | -------- |
| Supporting evidence | `supporting_evidence[]` — min one ref or explicit capture-from-observation path |
| Contradicting evidence | `contradicting_evidence[]` or `none_declared` with reason |
| Ancestry | `parent_refs[]` → memories and/or sources |
| Confidence source | `strength` + `certainty` separately sourced |
| Truth kind | objective · relational · interpretive |
| Supersession | Superseded knowledge retains chain — never silent delete |

### Belief

All Knowledge fields, plus:

| Must always exist | Contract |
| ----------------- | -------- |
| `last_evaluated` | Required — stale belief fails certification |
| Why held | Human-readable or enum `belief_basis` |
| Revision lineage | Belief revision adds provenance record — does not rewrite verified memory |

### Understanding

| Must always exist | Contract |
| ----------------- | -------- |
| `source_memory_ids[]` | Conservation ([Axiom 7](../LOCALBRAIN_EXECUTIVE_COGNITION_AXIOMS.md)) |
| Compression lineage | Pointer to compression engine + input set hash |
| Invalidation | When invalidated, provenance preserved; sources remain addressable |

### Decision

| Must always exist | Contract |
| ----------------- | -------- |
| `decided_by` | Executive authority for binding status |
| Trace linkage | `trace_id` mandatory for binding decisions |
| Rationale refs | Pointers to memories, knowledge, beliefs cited |
| Supersession | Ledger supersede chain — bidirectional |

### Recommendation (CoS / department output)

| Must always exist | Contract |
| ----------------- | -------- |
| `question_id` | Active Executive Question |
| `recall_id` | Recall that supplied context ([S3](./CONVENTION-S3-RECALL_CONTRACT.md)) |
| `provenance_bundle_id` | Aggregate chain entry point for "Why?" |
| Attribution | Dept → CoS → council lenses before executive merge (PR-S4-005e) |
| Citation minimum | Every recommendation cites ≥1 `memory_id` or declares explicit gap |

---

## Confidence sources (separate contracts)

| Signal | Source of score | Must not substitute for |
| ------ | --------------- | ------------------------ |
| **Memory Confidence** | Recall coverage · domain completeness · lifecycle mix ([S3](./CONVENTION-S3-RECALL_CONTRACT.md)) | Reasoning Confidence |
| **Knowledge strength** | Count/weight of supporting evidence | Certainty |
| **Certainty** | Calibration · recency · conflict state | Strength |
| **Reasoning Confidence** | Post-reasoning model/platform signal | Memory Confidence |
| **Runtime Confidence** | Infrastructure health (RO-S3-018) | Epistemic confidence |

Every scored object records **which** signal produced the number in `confidence_source`.

---

## Ancestry model (Axiom 4)

Every conclusion must be able to answer ([Axiom 4](../LOCALBRAIN_EXECUTIVE_COGNITION_AXIOMS.md)):

```txt
Which question?
Which memories?
Which evidence?
Which assumptions?
Which judgment lenses?
Which unknowns?
```

**Contract:** Ancestry is stored as **stable pointers** + **checkpoints**, not as inlined narrative.

| Mechanism | Contract |
| --------- | -------- |
| `parent_refs[]` | Direct hop — one synchronous fetch per drill-down level |
| `checkpoint_id` | Materialized bounded summary (RO-S3-001 · PR-S3-001 Model C) |
| Default depth | Checkpoint summary only — no full tree walk |
| Full depth | Lazy expansion on "Why?" drill-down |

**Invariant P3:** Default "Why?" render ≤ bounded depth — full ancestry available on demand, not required upfront.

---

## Supersession history

| Rule | Contract |
| ---- | -------- |
| Chain | `supersedes` / `superseded_by` bidirectional when object replaced |
| Expiry | Expiry demotes authority — provenance preserved ([S2 PR-S1-001](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md#expiry-semantics-pr-s1-001-resolution)) |
| Forgotten | Terminal for authority — provenance retained |
| Recommendations | Superseded recommendation retains `provenance_bundle_id` for audit |

---

## Version and timestamp semantics

| Field | Semantics |
| ----- | --------- |
| `version` | Monotonic integer or content hash per `object_id` — increments on material change |
| `created_at` | Origin time |
| `recorded_at` | Provenance write time |
| `verified_at` | Attestation time (Memory) |
| `last_evaluated` | Belief freshness |
| Point-in-time | Recall and Decision Context bind provenance **at decision moment** — not latest state silently |

---

## Ownership and attribution

| Layer | Contract |
| ----- | -------- |
| Department | Recommends — provenance records `department_id` + engine |
| Council lens | Contributes auditable fragment — non-binding |
| CoS | Synthesizes — provenance records merge inputs additively |
| Executive | Decides — `decided_by` on binding outcomes |

Synthesis is **additive** (Cognitive Conservation) — department provenance survives CoS merge.

---

## Trace linkage

| Link | When required |
| ---- | ------------- |
| `trace_id` | Binding decisions · high-stakes recommendations |
| `checkpoint_id` | Default "Why?" entry on trace |
| `question_id` | All recommendations and recalls |
| `recall_id` | All recommendations using memory context |
| `memory_id[]` | Cognitive Trace genome — lifecycle state at reference |

Checkpoints at: decision open · decision close · reflection close (RO-S3-002).

---

## "Why?" resolution contract

Entry point: `why(object_type, object_id, depth?) → ProvenanceChain`

| Field | Required output |
| ----- | --------------- |
| `chain_id` | Stable for object + version |
| `hops[]` | Ordered `{ provenance_id, object_type, object_id, summary, child_refs[] }` |
| `depth_returned` | Actual depth materialized |
| `truncated` | true if more hops exist |
| `next_hop_refs[]` | Deterministic pointers for drill-down |

| Depth | Behavior |
| ----- | -------- |
| 0 (default) | Checkpoint summary — question · top citations · confidence sources |
| 1+ | Expand one hop per request — lazy, not bulk reconstruction |

**Determinism:** Same inputs ⇒ same `chain_id` and hop order.

---

## Provenance break detection

| Condition | System behavior |
| --------- | --------------- |
| Missing `source_ref` on cited memory | Break — withhold or defer recommendation |
| `parent_refs[]` target not found | Break — surface gap in "Why?" |
| Verified memory mutation attempted | Break — reject write |
| Contradicting evidence suppressed | Break — fail certification |
| Attribution chain incomplete (Dept→CoS) | Break — CoS withhold until repaired |

Audit: `provenance.break` event with `object_id` · `break_reason` enum.

---

## Recall layer integration (deepens S3)

[S3 `provenance_refs[]`](./CONVENTION-S3-RECALL_CONTRACT.md#provenance-requirements-recall-layer) expands to:

| S3 field | S4 requirement |
| -------- | -------------- |
| `memory_id` | + full `ProvenanceRecord` retrievable by id |
| `lifecycle_state` | + point-in-time binding |
| `source_ref` | + `source_class` |
| `strength` / `certainty` | + `confidence_source` |
| — | + `provenance_id` on each selected item |

Recall without resolvable provenance **fails** certification (unchanged from S3).

---

## Recommendation citation requirements

Every executive-facing recommendation exports:

```txt
provenance_bundle_id:   PBND-*
question_id:            EQ-*
recall_id:              RCL-* (or explicit no-recall reason)
citations[]:            { object_type, object_id, provenance_id, role: supporting | contradicting | assumption | lens }
attribution[]:          { layer: department | cos | council | executive, actor_id }
confidence_sources[]:   { signal, value, provenance_id }
gaps[]:                 declared missing evidence
contract_version:       CON-S4-2026-07
```

**UI projection:** "Why?" uses `provenance_bundle_id` — not raw model text.

---

## Provenance audit events

```txt
event_type:       provenance.record | provenance.break | provenance.supersede
provenance_id:    PRV-*
object_type:      memory | knowledge | belief | ...
object_id:        *
trace_id:         CTR-* (optional)
actor:            user | engine_id | office_id
timestamp:        ISO-8601
contract_version: CON-S4-2026-07
```

---

## Failure behavior

| Condition | Behavior |
| --------- | -------- |
| Incomplete provenance on recommendation | Withhold — do not present as actionable |
| Break detected mid-synthesis | Degrade to provenance + Intellectual Humility (PR-S5-003a) |
| Checkpoint missing | Fall back to `parent_refs[]` one hop — log degradation |
| Storage unavailable | Defer — never fabricate citations |

---

## Interoperability test obligations

Two provenance resolvers pass if:

1. Same `ProvenanceRecord` schema version
2. Same `why()` inputs produce identical `chain_id` and hop order
3. Same break enums and withhold behavior
4. S3 recall `provenance_refs[]` resolve through S4 records
5. Recommendation bundles cite identically given same cognition inputs

---

## Session 4 gate

- [x] Universal provenance envelope frozen for all cognitive objects
- [x] Origin · evidence · ancestry · confidence source · supersession · version · timestamp · ownership · trace linkage defined
- [x] Recoverable without synchronous full reconstruction (checkpoints + lazy drill-down)
- [x] RO-CON-S3-001 · RO-S3-001 · RO-S4-010 · PR-S4-005e addressed at contract layer
- [x] S3 recall provenance refs deepened
- [x] No invented objects
- [x] Success test: deterministic "Why?" chain — **pass**

**Next:** [Convention Session 5 — Ethics](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md#session-5--memory-ethics)

---

*Convention Session 4 · Provenance · frozen contract · 2026*
