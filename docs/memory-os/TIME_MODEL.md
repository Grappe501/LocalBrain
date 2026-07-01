# Memory OS — Time Model

> **Status:** **MAR-1 reviewed** — binding for all canonical objects  
> **Parent:** [MAR-1 §1.3](./MAR-1-ARCHITECTURE_REVIEW.md) · [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md)

---

## Principle

Time is **explicit on every record** — never inferred from file mtime or implicit ordering. Historical reconstruction and auditability depend on distinguishing *when something happened* from *when we recorded it*.

---

## Time dimensions

| Dimension | Field | Required | Definition |
| --------- | ----- | -------- | ---------- |
| **Event time** | `event_at` | When known | When the described event occurred in reality |
| **Observation time** | `observed_at` | Pre-capture | When the system first detected the signal |
| **Capture time** | `created_at` | Captured+ | When the record was persisted (S2) |
| **Verification time** | `verified_at` | Verified+ | When attestation completed (S2) |
| **Last reference** | `last_referenced_at` | Referenced+ | Last recall in cognition pass (S2) |
| **Validity start** | `valid_from` | Facts, Relationships | When authority begins |
| **Validity end** | `valid_until` | Optional | When authority ends — `null` = open-ended |
| **Trust evaluation** | `trust_evaluated_at` | When trust changes | Last trust level assessment |
| **Supersession** | `superseded_at` | Superseded | When authority transferred |
| **Expiry** | `expired_at` | Expired | When temporal demotion occurred (S2) |
| **Retirement** | `forgotten_at` | Forgotten | When explicit retirement completed |

---

## Rules

| Rule | Description |
| ---- | ----------- |
| T1 | `event_at` ≤ `created_at` — cannot record before observation (tolerance: clock skew config) |
| T2 | `created_at` is immutable after capture |
| T3 | No `updated_at` on memory content — changes create new records or lifecycle transitions |
| T4 | `valid_from` / `valid_until` define fact authority — independent of lifecycle |
| T5 | Point-in-time query uses `event_at` + supersession chain + validity interval |
| T6 | `trust_evaluated_at` may update without mutating memory body |

---

## Confidence over time

Trust level ([TRUST_PROVENANCE_MODEL](./TRUST_PROVENANCE_MODEL.md)) may be re-evaluated:

```txt
memory body (immutable)
    └── trust_history[]: { level, evaluated_at, evaluator_ref, reason }
```

Current trust = latest entry. History preserved for audit.

Lifecycle demotion (Expired, Dormant) is **orthogonal** to trust re-evaluation.

---

## Supersession rules

| Scenario | Behavior |
| -------- | -------- |
| Correction | New record with `supersedes` → old record → Superseded |
| Authority window | Old `valid_until` set; new `valid_from` ≥ old `valid_from` |
| Point-in-time | Query at T returns record valid at T per interval + supersession chain |
| Chain integrity | No gaps in accountability — every supersede has `reason` |

---

## Historical reconstruction

**"What did we know at time T?"** algorithm (normative):

1. Filter records where `created_at` ≤ T
2. Exclude Forgotten, Rejected, Dismissed
3. Apply supersession chain as of T
4. Apply validity intervals as of T
5. Apply lifecycle state as of T (from transition log)
6. Return bundle with provenance — not synthesized narrative

Implemented by Memory Engine snapshot API ([Vol 3](./VOLUME-3-MEMORY_ENGINE.md)) — consumed by Intelligence for context reconstruction.

---

## Episode and conversation time

| Object | Primary time |
| ------ | ------------ |
| Episode | `started_at` / `ended_at` = event window |
| Conversation | `started_at` + per-turn `event_at` |
| ConversationTurn | `event_at` per utterance |
| Task | `due_at` = policy deadline; `event_at` = creation |

---

## Audit event time

`AuditEvent` uses single `occurred_at` — always system clock at append. Not recallable as memory.

---

*Time Model · MAR-1 · Memory OS spec v1 draft*
