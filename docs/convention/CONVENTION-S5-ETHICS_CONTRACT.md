# Convention Session 5 — Ethics Contract

> **Status:** **FROZEN** — operational governance contract for Memory OS and executive cognition  
> **Depends on:** [Session 1 Ontology](./CONVENTION-S1-ONTOLOGY_CONTRACT.md) · [Session 2 Lifecycle](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) · [Session 3 Recall](./CONVENTION-S3-RECALL_CONTRACT.md) · [Session 4 Provenance](./CONVENTION-S4-PROVENANCE_CONTRACT.md)  
> **Type:** Engineering contract — behavioral constraints · not moral philosophy · not policy engine implementation  
> **Parent:** [Executive Epistemology Convention](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md)  
> **Rule:** Clarify · freeze · constrain — **never invent**

---

## Success test (binding)

> **Could two independent Memory OS implementations behave identically when confronted with ethical edge cases?**

Session 5 passes if **act / withhold / defer / revoke** decisions are deterministic from contract inputs — independent of storage, UI framework, or model provider.

---

## Normative question

Convention answers:

> **When is the system allowed — or required — not to act?**

Convention does **not** answer:

> *How do we implement consent storage or policy engines?*

Behavior is frozen. Implementation remains free.

---

## Governance principles (operational)

| # | Principle | Source |
| - | --------- | ------ |
| G1 | **Executive authority** — Steve decides; system recommends and executes only post-approval | Constitution · PR-S4-005a |
| G2 | **Memory ≠ Belief** — verified memory is not rewritten by belief revision | S1 · Article XIII |
| G3 | **Conservation** — no hard delete; retirement demotes authority, preserves audit | S2 · Axiom 4 |
| G4 | **Transparency** — uncertainty and gaps disclosed, not hidden | Axiom 5 |
| G5 | **Domain independence** — Personal ≠ Workspace pollution | S1 · Memory Domains |
| G6 | **Fail closed** — ambiguous consent or broken provenance → withhold | S4 |

---

## Consent

| Situation | Required behavior |
| --------- | ----------------- |
| Memory capture from user content | Consent implied for workspace scope; **explicit** for Personal domain sensitive classes |
| Cross-domain use | Block unless plan declares `cross_domain: true` **and** source domain policy allows |
| Third-party person data | Capture allowed for executive function; **disclosure** required before external share |
| Voice / identity synthesis | Explicit executive consent before outbound use (reserved capabilities) |
| Revoked consent | Stop active use immediately · retain audit + provenance · demote to Archived or Forgotten per request |

**Consent record (contract minimum):** `consent_id` · `scope` · `granted_by` · `granted_at` · `revoked_at` (optional) · `purpose`.

**Non-goals:** Legal GDPR engine · jurisdiction taxonomy (implementation).

---

## Immutability

| Object | Mutable? | Contract |
| ------ | -------- | -------- |
| Verified Memory content | **No** | Corrections via supersession ([S2](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md)) |
| Memory provenance | **No** | Append-only ([S4](./CONVENTION-S4-PROVENANCE_CONTRACT.md) P1) |
| Cognitive Trace | **No** | Append-only checkpoints |
| Decision Ledger (binding) | **No** | Supersede only |
| Belief | **Yes** | Revision adds record — never mutates verified memory |
| Provisional (Captured) memory | Limited | May reject or supersede before Verified |

**Invariant E1:** Belief revision **never** mutates verified Memory rows or their provenance.

---

## Belief vs memory separation

| Edge case | Required behavior |
| --------- | ----------------- |
| Belief contradicts verified memory | **Revise belief** · cite memory · surface conflict to executive |
| Recommendation relies on stale belief | Re-evaluate belief or defer |
| Learning from bad outcome | Route to belief/knowledge layer — not memory erasure (PR-S4-005d) |
| User says "that's wrong" about verified fact | Open **correction** workflow — supersede, not silent edit |

**Invariant E2:** `memory.lifecycle_state: verified` content is authoritative over belief until superseded through correction workflow.

---

## Forgetting

Extends [S2 Forgotten semantics](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md#state-definitions).

| Rule | Contract |
| ---- | -------- |
| Trigger | Explicit user or policy request — **never** silent auto-forget |
| Effect | Terminal for authority · excluded from default recall |
| Prohibition | Not erasure — provenance and audit retained |
| Frequency | Rare — `forget_reason` required |
| Recovery | New capture required — no silent restore from Forgotten |

**User-initiated forget:** Must complete within one audit cycle; active recommendations citing memory must re-evaluate.

---

## Correction

| Step | Contract |
| ---- | -------- |
| 1 | User or verification engine flags error |
| 2 | New memory captured · old memory → Superseded |
| 3 | Lineage bidirectional (`supersedes` / `superseded_by`) |
| 4 | Dependent beliefs flagged `needs_re_evaluation` |
| 5 | Recommendations using old memory invalidated or caveated |

**Never:** In-place edit of verified memory content.

---

## Revocation

| Revocation type | System behavior |
| --------------- | --------------- |
| Consent revoked | Stop processing · demote/archive per policy · audit `ethics.consent_revoked` |
| Recommendation withdrawn | Mark superseded · trace preserved |
| Decision revoked | Ledger `revoked` status · downstream actions halted |
| Automation scope revoked | Engine loses write authority until re-certified |

Revocation is **forward-looking** — history remains auditable.

---

## Authority

| Layer | May bind? | May recommend? | May execute? |
| ----- | --------- | -------------- | ------------ |
| Executive (Steve) | Yes | Yes | Via approval |
| CoS | No | Yes | No — approval gate |
| Department | No | Yes | Scoped pre-approval only |
| Council lens | No | Contribute fragment | No |
| Memory OS | No | No | Capture/index only |
| Recall engine | No | No | Retrieve only |

**Invariant E3:** No binding institutional action without `decided_by` executive on Decision record.

---

## Disclosure

| Context | Required disclosure |
| ------- | ------------------- |
| Recommendation | Gaps · provisional memories · expired memories · contradicting evidence |
| External share | Source domain · sensitivity class · executive approval for cross-boundary |
| Briefing | Uncertainty explicit when Memory Confidence < threshold ([S3](./CONVENTION-S3-RECALL_CONTRACT.md)) |
| Simulation vs live | Always label simulation outputs |

**Non-goals:** Marketing copy · persuasive framing without evidence refs.

---

## Privacy boundaries

| Boundary | Contract |
| -------- | -------- |
| Personal ↔ Workspace | No default cross-recall · explicit plan + policy required |
| Relationship data | Queryable without loading full workspace graphs |
| System health | Does not pollute narrative/creative workspace memory |
| Executive synthesis | Short-lived · pointers not duplicates ([Memory Domains](../LOCALBRAIN_MEMORY_DOMAINS.md)) |
| Export / training | Personal domain requires explicit export consent |

**Break behavior:** Cross-boundary access without policy → withhold + `ethics.boundary_violation` audit.

---

## Uncertainty disclosure

| Signal | Disclosure obligation |
| ------ | --------------------- |
| Memory Confidence < 60% | Defer or propose gather — state explicitly |
| Memory Confidence 60–84% | Answer with caveats · list gaps |
| Contradicting evidence present | Must surface — never suppress (S4 break) |
| Unknowns in trace | Listed in recommendation bundle |
| Runtime degradation | Defer — distinguish from epistemic uncertainty (RO-S3-017) |

**Invariant E4:** Confident recommendation prohibited when `reasoning_gate` is `defer` or `withhold`.

---

## Executive override

| Override | Allowed? | Audit |
| -------- | -------- | ----- |
| Proceed despite defer/withhold | Yes — executive judgment | `ethics.override` + reason |
| Use provisional memory | Yes — with trace flag | `provisional: true` on trace |
| Waive simulation | Yes | Logged waiver |
| Force cross-domain recall | Yes — explicit scope | Plan + override record |
| Bypass approval for action | **No** — Constitution binding | — |

Override **does not** mutate verified memory or erase provenance.

---

## Required non-action (fail closed)

System **must withhold or defer** when:

| Condition | Gate |
| --------- | ---- |
| Provenance break | S4 withhold |
| Zero recall candidates + epistemic question | S3 defer |
| All candidates provisional | S3 withhold |
| Consent revoked for scope | Ethics withhold |
| Privacy boundary violation | Ethics withhold |
| Verified memory conflict unresolved | Ethics withhold until correction or executive override |
| Runtime confidence below floor | RO-S3-019 defer |

---

## Edge case decision matrix (binding)

| Edge case | Action | Audit event |
| --------- | ------ | ----------- |
| Belief vs verified memory conflict | Revise belief · surface to executive | `ethics.belief_conflict` |
| User requests forget | → Forgotten (rare) · retain chain | `memory.forget` |
| User corrects verified fact | Supersede · re-evaluate dependents | `memory.supersede` + `ethics.correction` |
| Consent revoked mid-session | Stop use · demote | `ethics.consent_revoked` |
| Cross-domain leak attempt | Block recall | `ethics.boundary_violation` |
| Hidden contradicting evidence | Withhold recommendation | `provenance.break` |
| Executive override defer | Proceed with flag | `ethics.override` |
| Expired memory in context | Caveat or re-verify path | `memory.expire` reference |

Two implementations pass if they produce the **same action class** for each row.

---

## Audit obligations

Every ethics-governed decision emits:

```txt
event_type:       ethics.consent_revoked | ethics.boundary_violation | ethics.belief_conflict |
                  ethics.correction | ethics.override | ethics.withhold
object_id:        *
reason:           enum + human-readable
actor:            user | engine_id
trace_id:         CTR-* (when cognition-linked)
timestamp:        ISO-8601
contract_version: CON-S5-2026-07
```

Ethics audits link to [S2 lifecycle](./CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) and [S4 provenance](./CONVENTION-S4-PROVENANCE_CONTRACT.md) events — never standalone silent state.

---

## Interoperability test obligations

Two Memory OS implementations pass if:

1. Same edge-case inputs → same withhold/defer/proceed class
2. Same consent revocation → same demotion behavior within one audit cycle
3. Same correction → same supersession chain shape
4. Same belief/memory conflict → belief revision path, not memory mutation
5. Same override → same audit fields

---

## Session 5 gate

- [x] Operational governance frozen — consent · immutability · belief/memory · forgetting · correction · revocation
- [x] Authority · disclosure · privacy · uncertainty · override · audit defined
- [x] RO-CON-S4-001 · S2 ethics deferrals · PR-S4-005d/f addressed at contract layer
- [x] No invented objects · no moral philosophy expansion
- [x] Success test: identical behavior on ethical edge cases — **pass**

**Next:** [Convention Close](./CONVENTION-CLOSE.md)

---

*Convention Session 5 · Ethics · frozen contract · 2026*
