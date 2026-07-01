# Convention Session 2 — Memory Lifecycle Contract

> **Status:** **FROZEN** — state machine and transition rules for Memory OS  
> **Depends on:** [Session 1 Ontology](./CONVENTION-S1-ONTOLOGY_CONTRACT.md)  
> **Type:** Engineering contract — not storage schema · not UI  
> **Parent:** [Executive Epistemology Convention](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md)  
> **Rule:** Convention may clarify · constrain · define — **may NOT invent**

---

## Success test (binding)

> **Could two independent teams implement the same Memory lifecycle transitions and produce interoperable `memory_id` records?**

Session 2 passes if every Memory record declares a lifecycle state, every transition is auditable, and **Forgotten** never means silent erasure.

---

## Scope

| In scope | Out of scope |
| -------- | ------------ |
| Memory object lifecycle states | Knowledge / Belief lifecycle (S1 ontology only) |
| Observation → Memory capture gate | Recall ranking (Session 3) |
| Transition rules + audit hooks | Provenance schema depth (Session 4) |
| Expiry = demotion/supersession | Ethics / consent policy (Session 5) |
| Required record fields at each state | Physical table design |

---

## Normative state machine

```txt
Observed → Captured → Verified → Referenced → Strengthened → Dormant → Archived → Forgotten (rare)
```

**Parallel paths (not bypassing capture):**

```txt
Observed → Dismissed          (never becomes Memory)
Captured → Rejected           (capture failed validation)
Verified → Superseded         (newer verified memory replaces authority)
Any active state → Expired    (authority demoted — record retained)
```

---

## State definitions

| State | Definition | Current authority? |
| ----- | ---------- | ------------------ |
| **Observed** | Pre-memory signal — candidate for capture ([S1 Observation](./CONVENTION-S1-ONTOLOGY_CONTRACT.md#observation-boundary-term)) | No |
| **Captured** | Persisted Memory with provenance — not yet attested | Provisional |
| **Verified** | Attested accurate for its scope (user, system, or outcome confirmation) | Yes |
| **Referenced** | Used in at least one cognition pass (recall, recommendation, trace) | Yes |
| **Strengthened** | Re-confirmed by new evidence or successful outcome | Yes |
| **Dormant** | Valid but not recently referenced — eligible for deprioritized recall | Yes (low rank) |
| **Archived** | Retained for audit/history — excluded from default recall | Historical only |
| **Forgotten** | **Rare** — explicit retirement with reason; record immutable, not deleted | No |
| **Dismissed** | Observation rejected — not Memory | No |
| **Rejected** | Capture failed validation | No |
| **Superseded** | Replaced by newer memory; lineage link required | No |
| **Expired** | Temporal demotion — authority reduced, provenance preserved ([PR-S1-001](../LOCALBRAIN_COGNITIVE_EVIDENCE_BASE.md#peer-review-session-1-philosopher)) | Demoted |

---

## Transition rules (binding)

| From | To | Trigger | Actor | Audit event |
| ---- | -- | ------- | ----- | ----------- |
| Observed | Captured | Salience threshold met + capture policy allows | Memory OS | `memory.capture` |
| Observed | Dismissed | Below threshold or user/system dismiss | Agency / user | `observation.dismiss` |
| Captured | Verified | Attestation (user confirm · outcome match · trusted source) | User / verification engine | `memory.verify` |
| Captured | Rejected | Provenance break · validation fail | Memory OS | `memory.reject` |
| Verified | Referenced | First use in cognition pass | Recall / CoS | `memory.reference` |
| Referenced | Strengthened | Re-confirmation event | Outcome / user | `memory.strengthen` |
| Referenced | Dormant | No reference within domain TTL | Memory OS scheduler | `memory.dormant` |
| Strengthened | Dormant | No reference within extended TTL | Memory OS scheduler | `memory.dormant` |
| Dormant | Referenced | Re-use in cognition | Recall | `memory.reactivate` |
| Dormant | Archived | Domain archive policy | Memory OS / user | `memory.archive` |
| Archived | Forgotten | Explicit retirement (rare) + reason | User / policy | `memory.forget` |
| Verified+ | Superseded | Newer memory supersedes | Memory OS | `memory.supersede` |
| Any active | Expired | Decision half-life / domain TTL | Memory OS scheduler | `memory.expire` |
| Expired | Referenced | Explicit re-validation | User / verification | `memory.reverify` |

**Forbidden transitions:**

- Captured → Referenced without Verified (no use of unverified memory in recommendations unless marked `provisional: true` in trace)
- Any → delete (hard delete prohibited — Axiom 4 conservation)
- Forgotten → any active state without new capture (retirement is terminal for authority)

---

## Observation salience gate (CON-S1-002 resolution)

Between **Observed** and **Captured**:

| Input | Rule |
| ----- | ---- |
| Tension score | High tension + mission relevance → lower capture threshold |
| Executive Question active | Capture scoped to question domain |
| Attention mode | Deep Focus → higher threshold (fewer captures) |
| Duplicate fingerprint | Merge to existing Captured/Verified — do not fork |

**Output:** `capture_decision`: capture · dismiss · defer · merge  
**Audit:** Every defer/dismiss records `reason` + `question_id` if known.

---

## Expiry semantics (PR-S1-001 resolution)

> **Expiry = loss of current authority, not erasure.**

| Field | Contract |
| ----- | -------- |
| **Definition** | Temporal demotion when truth may have changed (Axiom 6) |
| **Effect** | State → Expired or Dormant · recall rank reduced · recommendations must re-verify |
| **Provenance** | Full chain preserved · `expired_at` + `expiry_reason` required |
| **Recovery** | Re-verify path restores Verified — never silent auto-restore |

---

## Required Memory record fields (lifecycle extension)

Extends [S1 Memory](./CONVENTION-S1-ONTOLOGY_CONTRACT.md#memory) minimum fields:

| Field | Required when | Purpose |
| ----- | ------------- | ------- |
| `memory_id` | Always | Stable identifier |
| `domain` | Always | Six-domain partition |
| `kind` | Always | chunk · summary · pattern · … |
| `source_ref` | Captured+ | Provenance anchor |
| `lifecycle_state` | Captured+ | Current state from machine above |
| `created_at` | Captured+ | Capture time |
| `verified_at` | Verified+ | Attestation time |
| `last_referenced_at` | Referenced+ | Activity tracking |
| `superseded_by` | Superseded | Lineage |
| `supersedes` | When replacing | Reverse lineage |
| `expired_at` | Expired | Demotion time |
| `forget_reason` | Forgotten | Rare retirement justification |
| `provisional` | Captured not Verified | Marks pre-attestation use ban |

---

## Domain TTL defaults (normative — overridable per domain policy)

| Domain | Dormant after | Archive after | Notes |
| ------ | ------------- | ------------- | ----- |
| Personal | 180 days idle | 2 years | Preferences long-lived |
| Workspace | 90 days idle | 18 months | Project-scoped |
| System | 30 days idle | 1 year | Health snapshots rotate |
| Relationship | 120 days idle | Never auto-archive | Contacts persist |
| Learning | 60 days idle | 1 year | OJT progress |
| Executive | 7 days idle | 90 days | Briefing synthesis — short-lived |

TTL triggers **Dormant**, not delete. Domain policy is configuration — state names are frozen.

---

## Audit hooks (binding)

Every transition emits a **WorkspaceEvent** or kernel audit row:

```txt
event_type:     memory.lifecycle
memory_id:      MEM-*
from_state:     captured
to_state:       verified
actor:          user | system | engine_id
question_id:    EQ-* (optional)
trace_id:       CTR-* (when cognition-linked)
timestamp:      ISO-8601
reason:         human-readable or enum
```

Cognitive Trace must link `memory_id[]` used at decision time with lifecycle state at reference moment.

---

## Interoperability test obligations

Two teams pass Session 2 if:

1. Same `memory_id` + `lifecycle_state` enum values in shared contract version `CON-S2-2026-07`
2. Transition audit events use identical `event_type` and state names
3. Expired/Superseded/Forgotten records remain queryable by ID
4. Unverified memory cannot appear in recommendation evidence without `provisional: true` flag in trace
5. Observation dismiss without audit event fails certification

---

## Session 2 gate

- [x] Full Memory lifecycle state machine frozen
- [x] Transition rules + forbidden transitions defined
- [x] CON-S1-010 / RO-CON-S1-001 closed
- [x] PR-S1-001 expiry demotion · PR-S1-002 salience gate resolved
- [x] No new foundational objects
- [x] Success test: interoperable lifecycle — **pass**

**Next:** [Convention Session 3 — Recall](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md#session-3--recall)

---

*Convention Session 2 · Memory Lifecycle · frozen contract · 2026*
