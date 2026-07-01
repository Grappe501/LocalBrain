# MAR-2 — Authority Architecture Review

> **Status:** **COMPLETE** — constitutional design review before ENG-MEM-001.5.1  
> **Scope:** DecisionCitation only · governance substrate · Reference Slice 005  
> **Prerequisite:** MAR-1 complete · `memory-spec-v1.0` frozen · ENG-PMO-004 authorization  
> **Gate:** Implementation of **ENG-MEM-001.5.1** may proceed after this review  
> **Analog:** Final substrate design review before fabrication — narrower than MAR-1 by design

---

## Purpose

Validate the **last constitutional substrate** against questions that are hardest to change after implementation.

MAR-1 validated the full Memory OS specification. MAR-2 validates **authority preservation only** — the bridge between deterministic understanding and institutional action.

**Guiding principle (binding throughout MAR-2):**

> **Authority creates responsibility. It does not create truth.**

A governing body can approve something. That approval does not make it factually correct. Facts do not automatically create authority. Authority does not automatically create facts. They remain independent substrates.

---

## Constitutional bridge (context)

```text
Reality → History → Evidence → Knowledge → Interpretation
══════════════════════════════════════════════════════════
Authority → Executive Intelligence → Policy → Action
```

DecisionCitation is not “another memory object.” It is the **constitutional bridge** — what allows an institution to move from *understanding* to *acting* without letting Intelligence become the ledger.

---

## Review questions

| Question | Verdict | Finding |
| -------- | ------- | ------- |
| Is every field on `DecisionCitation` strictly necessary? | **PASS** | See §1 — no field duplicates ledger authority; each supports citation, reconstruction, or substrate discipline |
| Is any field accidentally duplicating the Decision Ledger? | **PASS** | `decision_id` + `ledger_ref` are foreign keys only; binding decision body and authority state remain in [Decision Ledger](../LOCALBRAIN_DECISION_LEDGER.md) (MAR-1 MAR-V01) |
| Is there any path by which authority could be inferred instead of explicitly exercised? | **PASS** (with implementation guard) | **Authority Principle:** exercised, never inferred. Wave 1 excludes LLM decision detection · “probably approved” semantics · inferred decider fields. Validator must reject inference-shaped fields at capture |
| Does every reference point outward rather than creating ownership? | **PASS** | `supporting_memory_refs` are identifier refs only — Episode · Artifact · Fact · Conversation. DecisionCitation never owns substrates |
| Does delegation remain the only path by which authority can be exercised? | **PASS** | `decider_ref` + provenance + optional grant refs in supporting refs trace delegation per [Delegation Model](./DELEGATION_MODEL.md). Memory OS records citation; delegation grants and ledger binding remain external |

---

## §1 Field necessity (Vol 2)

| Field | Necessary? | Role | Ledger duplication? |
| ----- | ---------- | ---- | ------------------- |
| `citation_id` | Yes | Canonical identity | No |
| `schema_version` | Yes | Spec fidelity | No |
| `decision_id` | Yes | Ledger FK — which decision was exercised | Pointer only |
| `question` | Yes | What authority was exercised *about* | Citation context — not binding ledger body |
| `outcome_summary` | Yes | Human-readable outcome record for substrate reconstruction (A17) | Summary for memory walkthrough — **not** binding authority text; ledger retains authoritative decision record |
| `decided_at` | Yes | Event time of exercise | No |
| `decider_ref` | Yes | Who exercised authority | Attribution — ledger may hold broader roster; this is the exercised actor ref |
| `supporting_memory_refs` | Yes | Outward references to substrates that informed the decision | No ownership |
| `ledger_ref` | Yes | Stable pointer to ledger entry | Pointer only |
| `lifecycle_state` | Yes | S2 lifecycle (Convention) | No |
| `provenance` | Yes | S4 envelope — how citation entered memory | No |
| `event_at` | Yes | Time model binding | No |
| `created_at` | Yes | Persistence audit | No |

**MAR-2 finding:** Field set is minimal. No recommended additions. No recommended removals. Optional fields deferred to post–Wave 1 (e.g. explicit `delegation_grant_ref`) — may appear in `supporting_memory_refs` without schema expansion.

---

## §2 Ledger boundary (MAR-1 continuity)

```text
Decision Ledger     →  binding decision authority
DecisionCitation    →  memory record citing ledger entry
```

Memory OS **must not**:

- create binding decisions in the write path,
- mutate ledger state,
- store authoritative decision bodies as if Memory were the ledger.

Memory OS **must**:

- require valid `decision_id` and `ledger_ref` at capture,
- treat citation body as immutable after capture,
- preserve ledger pointers through lifecycle transitions.

**MAR-2 verdict:** **PASS** — MAR-V01 split remains correct for Wave 1 implementation.

---

## §3 Authority principles (binding — locked at MAR-2)

### Authority Principle (from ENG-PMO-004)

> **Authority is exercised. It is never inferred.**

### Recording Principle (new — binding)

> **Authority is recorded. It is never reconstructed.**

Even if every surrounding Episode, Fact, Artifact, and Conversation strongly suggests a decision occurred, there is **no** DecisionCitation unless one was actually recorded at capture. Intelligence must not synthesize governance from context.

### Governance Principle (new — binding)

> **Authority creates responsibility. It does not create truth.**

Approval creates accountability for the decision — not epistemic correctness. Knowledge substrates and governance substrates remain independent.

---

## §4 Reference-not-ownership

```text
DecisionCitation  →  may reference  →  Episode · Artifact · Fact · Conversation
DecisionCitation  →  never owns     →  Episode · Artifact · Fact · Conversation
```

DecisionCitation writes must not mutate referenced substrates. Authority record stays small; power comes from references.

**MAR-2 verdict:** **PASS**

---

## §5 Implementation sequence (authorized)

MAR-2 does not implement. It authorizes the established rhythm:

```text
ENG-MEM-001.5.1   Canonical storage
        ↓
ENG-MEM-001.5.2   Authority integrity (A17 — exercised authority)
        ↓
ENG-MEM-001.5.3   Governance guarantees (recorded not reconstructed · ledger boundary)
        ↓
ENG-PMO-005       Constitutional Completion Milestone
        ↓
Reference Slice 005 COMPLETE
```

Charter: [ENG-MEM-001.5 DecisionCitation](./slices/ENG-MEM-001.5-DECISIONCITATION.md)

---

## §6 What MAR-2 explicitly excludes from Wave 1

- Inferred authority · LLM decision detection
- Reconstructed DecisionCitation from substrate patterns
- Ledger mutation from Memory write pipeline
- Policy enforcement UI
- Cross-substrate ownership or mutation
- Publication of [The Five Constitutional Substrates](./THE-FIVE-CONSTITUTIONAL-SUBSTRATES.md) — reserved for **ENG-PMO-005** acceptance (timeless doctrine, no caveats)

---

## MAR-2 overall status

| Section | Status |
| ------- | ------ |
| Field necessity | ✅ Pass |
| Ledger boundary | ✅ Pass |
| Inference prevention | ✅ Pass |
| Reference-not-ownership | ✅ Pass |
| Delegation path | ✅ Pass |
| Governance principles locked | ✅ Pass |

**MAR-2 recommendation:** **COMPLETE** — ENG-MEM-001.5.1 canonical storage **authorized to proceed**.

### PMO record

| Field | Value |
| ----- | ----- |
| Review date | 2026-07-01 |
| Scope | DecisionCitation · governance substrate only |
| Unresolved findings | 0 |
| Principles locked | Authority · Recording · Governance |
| Evidence | MAR-2 review record · ENG-PMO-004 authorization |

---

*MAR-2 Authority Architecture Review · LocalBrain V1 · Final substrate · 2026*
