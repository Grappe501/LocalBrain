# Volume 3 — Memory Engine

> **Milestone:** MEM-003 (+ MEM-004 retrieval portions)  
> **Status:** Draft — **MAR-1 reviewed**  
> **Glossary:** [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md)  
> **Principle:** Memory records what happened. Intelligence interprets what happened. Policy decides what should happen.  
> **Time model:** [TIME_MODEL](./TIME_MODEL.md)  
> **Lifecycle:** [MEMORY_LIFECYCLE_MAP](./MEMORY_LIFECYCLE_MAP.md)  
> **Implements:** [Convention S2 Lifecycle](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) · [S3 Recall](../convention/CONVENTION-S3-RECALL_CONTRACT.md)

---

## Success test (binding)

> **Could two independent teams implement the write and consolidation pipelines and produce identical lifecycle transitions and recall rankings for the same input stream?**

---

## Engine boundary

The Memory Engine **stores and retrieves**. It does not interpret, recommend, or decide.

```txt
Write Pipeline    → Capture · validate · persist · index
Consolidation     → Dedupe · merge · strengthen · archive
Retrieval         → Rank · filter · return · audit
```

Intelligence consumes retrieval results — never writes memory directly without passing through the write pipeline.

---

## Write pipeline

```txt
Observation
    → Capture Gate (ethics · consent · domain)
    → Schema Validation (Vol 2)
    → Provenance Envelope (S4)
    → Lifecycle: Captured
    → Index (vector + graph + temporal)
    → Audit Event
```

### Capture gate

| Check | Fail behavior |
| ----- | ------------- |
| Consent ([S5](../convention/CONVENTION-S5-ETHICS_CONTRACT.md)) | Dismissed — not captured |
| Domain policy | Rejected with reason |
| Duplicate candidate | Route to deduplication |
| Privacy tier | Stamp at capture |

### Write invariants

- Every write is append-first — corrections supersede
- No write without `actor_id` and `source_ref`
- Batch writes are atomic per episode boundary

---

## Consolidation

Runs asynchronously — never blocks interactive capture.

| Operation | Trigger | Outcome |
| --------- | ------- | ------- |
| **Deduplication** | Similarity above threshold | Merge or link — weaker duplicate archived |
| **Strengthening** | Corroborating evidence | Lifecycle → Strengthened |
| **Summarization** | Episode complete | Episode → summary fact — episode archived |
| **Demotion** | Retention policy | Lifecycle → Dormant / Archived |
| **Expiration** | TTL reached | Authority demoted — record retained |

Consolidation emits audit events. It never deletes — only transitions lifecycle.

---

## Retrieval

Implements [Convention S3 Recall](../convention/CONVENTION-S3-RECALL_CONTRACT.md):

```txt
Intent → Domain Selection → Pre-flight → Candidate Generation
    → Salience Scoring → Ranking → Context Assembly → Audit
```

### Salience scoring

| Signal | Weight domain |
| ------ | ------------- |
| Recency | Temporal |
| Verification level | Trust |
| Reference frequency | Usage |
| Goal alignment | Executive intent |
| Domain policy | Privacy / scope |

Salience affects **order** — not inclusion without policy permission.

### Retrieval invariants

- Recall is auditable (`memory.recalled` event)
- Default recall excludes Archived and Forgotten
- Cross-domain recall requires explicit intent classification
- Maximum context window enforced before handoff to Intelligence

---

## Conflict resolution

When two verified memories contradict:

| Step | Action |
| ---- | ------ |
| 1 | Both retained — neither silently dropped |
| 2 | Newer or higher-trust memory gets rank boost |
| 3 | `contradicts` edge in knowledge graph ([Vol 5](./VOLUME-5-KNOWLEDGE_GRAPH.md)) |
| 4 | Intelligence layer surfaces conflict — Memory Engine does not resolve |
| 5 | Human verification may supersede |

Memory Engine records conflict — Intelligence adjudicates.

---

## Temporal reasoning

| Capability | Scope |
| ---------- | ----- |
| **Point-in-time query** | "What did we know on date X?" |
| **Validity intervals** | Facts with `valid_from` / `valid_until` |
| **Sequence ordering** | Episode and conversation ordering |
| **Decay curves** | Salience reduction for dormant memories |

Temporal index is separate from vector index — both consulted at retrieval.

---

## Archiving

| Trigger | Behavior |
| ------- | -------- |
| Retention policy | Lifecycle → Archived |
| Project closed | Workspace memories archived en masse |
| Manual archive | Owner-initiated with reason |

Archived memories: excluded from default recall · included in audit export · recoverable to Dormant on explicit request.

---

## Expiration

Expiration **demotes authority** — distinct from Forgotten:

```txt
Expired: still exists · low rank · audit visible · may be re-strengthened
Forgotten: explicit retirement · excluded from export default · immutable
```

---

## Snapshotting

| Snapshot type | Purpose |
| ------------- | ------- |
| **Instance snapshot** | Point-in-time export for backup |
| **Domain snapshot** | Workspace or personal export |
| **Recall snapshot** | What was returned to Intelligence at time T |

Snapshots are immutable once written. Used for recovery and compliance ([Volume 7](./VOLUME-7-GOVERNANCE_AND_SAFETY.md)).

---

## Persistence model

| Store | Contents |
| ----- | -------- |
| **Primary** | Canonical objects (Vol 2) — SQLite or equivalent |
| **Vector index** | Embedding pointers — rebuildable from primary |
| **Graph index** | Relationship edges ([Vol 5](./VOLUME-5-KNOWLEDGE_GRAPH.md)) |
| **Temporal index** | Validity intervals and ordering |
| **Audit log** | Append-only transition and recall events |

Vector and graph indexes are **derived** — loss is recoverable from primary + replay.

---

## Factory compatibility

Memory Engine initializes against Factory-delivered empty framework:

- Vault paths from birth certificate
- Convention manifest validation on startup
- No migration until Memory OS spec freeze (MEM-008)

---

*Volume 3 · Memory Engine · MEM-003*
