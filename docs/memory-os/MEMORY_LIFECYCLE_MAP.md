# Memory Lifecycle Map

> **Status:** **MAR-1 reviewed**  
> **Authority:** [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) — **normative**  
> **Parent:** [MAR-1 §1.7](./MAR-1-ARCHITECTURE_REVIEW.md)

---

## Principle

Memory OS **implements Convention S2** — it does not invent a parallel lifecycle. This document maps **review shorthand** (for executives and MAR sessions) to **S2 normative states** (for engineers).

---

## Executive shorthand → S2 mapping

| Review shorthand | S2 normative state(s) | Current authority? |
| ---------------- | --------------------- | ------------------ |
| **Observed** | `observed` | No — pre-memory |
| **Validated** | `verified` | Yes |
| **Canonical** | `verified` · `strengthened` | Yes — high confidence |
| **Referenced** | `referenced` | Yes |
| **Archived** | `dormant` · `archived` | Low / historical only |
| **Retired** | `forgotten` | No — explicit retirement |

---

## Full S2 state machine (normative)

```txt
                    ┌─────────────┐
                    │  Observed   │ (pre-memory)
                    └──────┬──────┘
              dismiss │    │ capture
                    ▼    ▼
              Dismissed  Captured ──reject──► Rejected
                           │
                      verify
                           ▼
                       Verified ◄──reverify── Expired
                           │
                      reference
                           ▼
                      Referenced
                           │
                    strengthen │ dormant
                           ▼    ▼
                    Strengthened  Dormant
                           │         │
                           │      archive
                           │         ▼
                           │     Archived
                           │         │
                           └────┬────┘
                            supersede
                                │
                                ▼
                           Superseded

Archived ──forget (rare)──► Forgotten
```

---

## Parallel paths

| Path | States | Meaning |
| ---- | ------ | ------- |
| Observation rejection | Observed → Dismissed | Never becomes memory |
| Capture failure | Captured → Rejected | Validation failed |
| Authority transfer | Verified+ → Superseded | Newer record takes authority |
| Temporal demotion | Active → Expired | Authority reduced — record kept |
| Explicit retirement | Archived → Forgotten | Rare — audited |

---

## Transition discipline

Every transition requires:

1. **Trigger** — from S2 transition table
2. **Actor** — identity or system component
3. **Audit event** — append-only
4. **Timestamp** — per [TIME_MODEL](./TIME_MODEL.md)

**Forbidden:** hard delete · Captured → Referenced without Verified (unless `provisional: true` in trace) · Forgotten → active without new capture

---

## Lifecycle vs trust

Lifecycle governs **authority to recall**. Trust governs **rank when recalled**. See [TRUST_PROVENANCE_MODEL](./TRUST_PROVENANCE_MODEL.md).

---

## Implementation obligation (MEM-009)

Memory Engine must:

- Persist `lifecycle_state` on every memory object
- Emit audit event on every transition
- Reject forbidden transitions at write pipeline
- Expose point-in-time lifecycle via transition log

---

*Memory Lifecycle Map · MAR-1 · S2 authoritative*
