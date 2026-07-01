# MAR-1 — Memory Architecture Review

> **Status:** **COMPLETE** — PMO signoff recorded · MEM-008 freeze authorized  
> **Scope:** MEM-001 through MEM-007 · Volumes 1–7  
> **Rule:** Specification frozen at `memory-spec-v1.0` · MEM-009 implementation authorized  
> **Analog:** Engineering design review before hardware fabrication

---

## Purpose

Validate the Memory OS specification against questions that are **hardest to change after implementation** — the same discipline applied to Factory before certification.

**Guiding principle (binding throughout MAR-1):**

> Memory records what happened. Intelligence interprets what happened. Policy decides what should happen.

---

## Review artifacts

| Artifact | MAR section | Document |
| -------- | ----------- | -------- |
| Conceptual integrity findings | MAR-1.1 | This document §1 |
| Canonical object registry | MAR-1.2 | [CANONICAL_OBJECT_REGISTRY](./CANONICAL_OBJECT_REGISTRY.md) |
| Time model | MAR-1.3 | [TIME_MODEL](./TIME_MODEL.md) |
| Trust & provenance | MAR-1.4 | [TRUST_PROVENANCE_MODEL](./TRUST_PROVENANCE_MODEL.md) |
| Delegation model | MAR-1.5 | [DELEGATION_MODEL](./DELEGATION_MODEL.md) |
| Graph relationship vocabulary | MAR-1.6 | [GRAPH_RELATIONSHIP_VOCABULARY](./GRAPH_RELATIONSHIP_VOCABULARY.md) |
| Lifecycle mapping | MAR-1.7 | [MEMORY_LIFECYCLE_MAP](./MEMORY_LIFECYCLE_MAP.md) |
| Shared terminology | All | [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md) |
| Freeze gate | Exit | [MEM-008-EXIT_CRITERIA](./MEM-008-EXIT_CRITERIA.md) |
| Success test matrix | E9 | [MEM-008-SUCCESS_TEST_MATRIX](./MEM-008-SUCCESS_TEST_MATRIX.md) |

---

## §1 MAR-1.1 — Conceptual integrity

### Review questions

| Question | Verdict | Finding |
| -------- | ------- | ------- |
| Does any component mix memory with reasoning? | **PASS** (after fix) | Vol 6 correctly consumes recall; Vol 3 conflict resolution routes adjudication to Intelligence |
| Does any component embed policy into storage? | **PASS** (after fix) | Policy fields are references (`consent_ref`, `policy_ref`) — rules live in Vol 7, not schema defaults |
| Is every responsibility assigned to exactly one layer? | **PASS** (after fix) | See layer assignment table below |

### Layer assignment (normative)

| Responsibility | Owner | Must not |
| -------------- | ----- | -------- |
| Durable capture | Memory Engine (Vol 3) | Interpret or decide |
| Canonical object schemas | Memory Data Model (Vol 2) | Store beliefs or knowledge conclusions |
| Identity definition | Identity Layer (Vol 4) | Store episodic content |
| Graph edges | Knowledge Graph (Vol 5) | Execute reasoning |
| Planning / recommendations | Executive Intelligence (Vol 6) | Write memory without write pipeline |
| Consent / approval / audit | Governance (Vol 7) | Mutate memory content |
| Binding decisions | Decision Ledger (external) | Duplicate in memory as authority |
| Capabilities | Capability Registry (external) | Redefine in memory store |

### Violations found and resolved

| ID | Violation | Resolution |
| -- | --------- | ---------- |
| MAR-V01 | Vol 2 `Decision` object appeared to duplicate [Decision Ledger](../LOCALBRAIN_DECISION_LEDGER.md) | Renamed concept: **`DecisionCitation`** — memory artifact that *cites* `decision_id`; ledger retains binding authority |
| MAR-V02 | Knowledge / Belief / Understanding absent from layer boundaries in Vol 2 | Clarified: **Intelligence-layer objects** — Memory OS stores `derivation_link` edges only, not conclusion bodies |
| MAR-V03 | Vol 5 allowed "manual curation: any" edge | Restricted to [frozen vocabulary](./GRAPH_RELATIONSHIP_VOCABULARY.md) only |
| MAR-V04 | `Observation` listed alongside memory objects | Reclassified: **pre-memory boundary term** (S1) — not a persisted canonical object |
| MAR-V05 | `Event` undefined | Defined: **`AuditEvent`** (Vol 7) vs **`Episode`** (Vol 2) — see object registry |

### Separation diagram

```txt
┌─────────────────────────────────────────────────────────┐
│ Policy (Vol 7) — consent · approval · access · audit    │
└───────────────────────────┬─────────────────────────────┘
                            │ gates
┌───────────────────────────▼─────────────────────────────┐
│ Intelligence (Vol 6) — interpret · plan · recommend     │
└───────────────────────────┬─────────────────────────────┘
                            │ recall API (read-only)
┌───────────────────────────▼─────────────────────────────┐
│ Memory OS (Vol 1–5) — capture · store · retrieve · graph│
└─────────────────────────────────────────────────────────┘
```

**MAR-1.1 verdict:** **PASS** — pending MEM-008 signoff.

---

## §2 MAR-1.2 — Canonical object review

Full registry: [CANONICAL_OBJECT_REGISTRY](./CANONICAL_OBJECT_REGISTRY.md)

### Summary

| Object | Owner | Persisted by Memory OS? |
| ------ | ----- | ----------------------- |
| Memory (umbrella) | ENG-MEM-001 | Yes — all Vol 2 types are `kind` variants |
| Episode, Fact, … | ENG-MEM-001 | Yes |
| Observation | Agency / tension engines | **No** — capture candidate only |
| Knowledge, Belief, Understanding | Executive Intelligence | **No** — links only in graph |
| Decision (binding) | Decision Ledger | **No** — `DecisionCitation` only |
| Capability | Capability Registry | **No** — graph node reference |
| Identity | Identity Layer | Yes — separate store |
| AuditEvent | Governance | Yes — append-only, not recall index |

**MAR-1.2 verdict:** **PASS** — no duplicate owners after MAR-V01–V05 resolutions.

---

## §3 MAR-1.3 — Time model

Full specification: [TIME_MODEL](./TIME_MODEL.md)

### Required time dimensions (resolved)

| Dimension | Field(s) | Purpose |
| --------- | -------- | ------- |
| Event time | `event_at` | When the thing happened in reality |
| Observation time | `observed_at` | When the system detected the signal |
| Record creation | `created_at` | When capture persisted |
| Modification | `superseded_at` · transition timestamps | Lifecycle transitions only — no in-place edit |
| Validity interval | `valid_from` · `valid_until` | Fact authority window |
| Confidence over time | `trust_level` + `trust_evaluated_at` | Trust may be re-evaluated; memory immutable |
| Supersession | `supersedes` · `superseded_by` | Authority chain |

**MAR-1.3 verdict:** **PASS** — time model specified.

---

## §4 MAR-1.4 — Trust & provenance

Full specification: [TRUST_PROVENANCE_MODEL](./TRUST_PROVENANCE_MODEL.md)

### Frozen trust level enum

| Level | Code | Meaning |
| ----- | ---- | ------- |
| System | `system` | Generated by certified system logic |
| Verified | `verified` | Confirmed by authoritative source |
| User Confirmed | `user_confirmed` | Explicitly accepted by operator |
| Observed | `observed` | Recorded but not independently verified |
| Imported | `imported` | External source awaiting validation |
| Derived | `derived` | Inferred from other memories |
| Hypothesis | `hypothesis` | Candidate — not yet accepted for default recall |

Trust level is **independent** of lifecycle state ([Vol 1](./VOLUME-1-MEMORY_CONSTITUTION.md) Article IX).

**MAR-1.4 verdict:** **PASS** — enum finalized; Q1 from Vol 1 closed.

---

## §5 MAR-1.5 — Delegation model

Full specification: [DELEGATION_MODEL](./DELEGATION_MODEL.md)

| Question | Answer |
| -------- | ------ |
| Can an identity delegate authority? | **Yes** — via `DelegationGrant` |
| Can authority be partial? | **Yes** — scope dimensions: domain · object · action class |
| Can delegation expire? | **Yes** — `valid_until` required |
| Is delegation auditable? | **Yes** — grant · use · revoke events |
| Can it be revoked? | **Yes** — immediate effect on new actions |
| Can delegation chain? | **Yes** — max depth 3; no circular grants |

**MAR-1.5 verdict:** **PASS** — Q3 from Vol 1 closed.

---

## §6 MAR-1.6 — Knowledge graph semantics

Full vocabulary: [GRAPH_RELATIONSHIP_VOCABULARY](./GRAPH_RELATIONSHIP_VOCABULARY.md)

**14 controlled edge types** — no arbitrary relationship labels in v1.

New types require MEM-008 amendment or v1.1 spec cycle.

**MAR-1.6 verdict:** **PASS** — vocabulary frozen for v1.

---

## §7 MAR-1.7 — Memory lifecycle

**Authority:** [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) — Memory OS spec **implements** S2; it does not replace it.

Conceptual map for executives: [MEMORY_LIFECYCLE_MAP](./MEMORY_LIFECYCLE_MAP.md)

```txt
Review shorthand          Convention S2 (normative)
─────────────────         ───────────────────────────
Observed                  Observed (pre-memory)
Validated                 Verified
Canonical                 Verified · Strengthened
Referenced                Referenced
Archived                  Archived · Dormant
Retired                   Forgotten
```

Plus parallel paths: Dismissed · Rejected · Superseded · Expired — all defined in S2.

**MAR-1.7 verdict:** **PASS** — lifecycle fully defined via S2 + map document.

---

## MAR-1 overall status

| Section | Status |
| ------- | ------ |
| MAR-1.1 Conceptual integrity | ✅ Pass |
| MAR-1.2 Canonical objects | ✅ Pass |
| MAR-1.3 Time model | ✅ Pass |
| MAR-1.4 Trust & provenance | ✅ Pass |
| MAR-1.5 Delegation | ✅ Pass |
| MAR-1.6 Graph vocabulary | ✅ Pass |
| MAR-1.7 Lifecycle | ✅ Pass |

**MAR-1 recommendation:** **COMPLETE** — PMO signoff recorded 2026-07-01 · MEM-008 freeze declared.

**Authorized at freeze:** Commit · `memory-spec-v1.0` tag · MEM-009 Implementation Pass 1.

### PMO signoff

| Field | Value |
| ----- | ----- |
| Signoff date | 2026-07-01 |
| Walkthrough | MEM-008 Success Test Matrix — 107/107 PASS |
| Unresolved findings | 0 |
| Corrective actions | All closed (T2.1 volume headers · DecisionCitation split) |
| Evidence | `E-MEM-FREEZE-2026` |

---

*MAR-1 Memory Architecture Review · LocalBrain V1 · 2026*
