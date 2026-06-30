# Cognitive Evidence Base

> **Status:** Living artifact — evidence · not doctrine  
> **Purpose:** Bibliography linking hypotheses to experiments, data, outcomes, revisions  
> **Parent:** [Executive Cognitive Science](./LOCALBRAIN_EXECUTIVE_COGNITIVE_SCIENCE.md) · [Research Agenda](./LOCALBRAIN_RESEARCH_AGENDA.md) · [Peer Review](./LOCALBRAIN_EXECUTIVE_COGNITION_PEER_REVIEW.md)

---

## Hypothesis status (theory evidence)

Not code metrics. **Theory evidence** over years.

### Three independent statuses (never collapse)

| Status | Question |
| ------ | -------- |
| **Implemented** | Has it been built? |
| **Tested** | Has it been evaluated? |
| **Supported** | Does the evidence currently support it? |

A feature is **not validated** because it exists. Built ≠ tested ≠ supported.

| Hypothesis | Slice | Implemented | Tested | Supported | Summary |
| ---------- | ----- | :---------: | :----: | :-------: | ------- |
| H-027 | LB-OS-027 | ❌ | ❌ | Unknown | EQ-organized recall ↑ MCP, ↓ ECL |

**Supported values:** `Unknown` · `Yes` · `No` · `Inconclusive` · `Falsified`

### Outcome status (after testing)

| Hypothesis | Outcome | Statistical | Practical | Theoretical | Replication |
| ---------- | ------- | ----------- | --------- | ----------- | ----------- |
| H-027 | Untested | — | — | — | — |

**Outcome values:** `Untested` · `In progress` · `Provisional` · `Confirmed` · `Falsified` · `Inconclusive` · `Superseded`

**Confirmed** requires replication record per [Falsification Charter](./LOCALBRAIN_FALSIFICATION_CHARTER.md#replication-culture). First pass alone → `Provisional`.

**Falsification conditions:** [Charter table](./LOCALBRAIN_FALSIFICATION_CHARTER.md#what-would-prove-the-theory-wrong).

---

## Evidence entries (template)

```txt
Evidence ID:     E-2026-001
Hypothesis:      H-027
Date:            YYYY-MM-DD
Type:            experiment | observation | adversarial review | outcome trace
Slice tag:       theory-bearing | product-only | both

Statistical:     Did the metric improve?
Practical:       Did it meaningfully help the executive?
Theoretical:     Strengthened | Weakened | Neutral | Falsified claim

Generalizability:
  Individual executive:  High | Medium | Low | Unknown
  Small team:            …
  Large organization:    …
  Domain (campaigns etc.): …

Replication:     None | Attempted | Replicated | Failed to replicate
Summary:         One paragraph
Data:            Cognitive Trace ID · EPO metrics · decision outcomes
Falsification:   Which charter row would this challenge, if any?
Theory impact:   None | Minor note | Amendment candidate (Theory v1.x)
Links:           docs · commits · trace IDs
```

---

## Peer review sessions

| Session | Role | Status | Record |
| ------- | ---- | ------ | ------ |
| 1 | Philosopher — logical consistency | ✅ Passed | [PR-S1 below](#peer-review-session-1-philosopher) |
| 2 | Cognitive scientist | 📋 Ready — frozen packet `7b6ab71` | — |
| 3 | Systems engineer | ⬜ Pending | — |
| 4 | Executive practitioner | ⬜ Pending | — |
| 5 | Skeptic | ⬜ Pending | — |

**Submission packet:** Frozen at `7b6ab71`. Findings only in this document until Sessions 1–5 complete → then Convention Agenda.

### Peer Review Session 1 (Philosopher)

| Field | Value |
| ----- | ----- |
| Date | 2026-06-28 |
| Reviewer | Independent (Philosopher) |
| Scope | Axioms · Theory v1.0 · epistemology boundaries · document-stack coherence |
| Rules | [Session 1 rules](./LOCALBRAIN_EXECUTIVE_COGNITION_PEER_REVIEW.md#session-1--philosopher-rules-binding) |
| Outcome | **Passed** — no logical contradiction found; 0 Amendment Candidates |

#### Findings log

| ID | Finding | Charity interpretation | Outcome | Notes |
| -- | ------- | ---------------------- | ------- | ----- |
| PR-S1-001 | AS-1: Conservation vs temporal expiry | Expiry = loss of current authority, not erasure; provenance preserved | **Clarification** | Convention Session 2 — define expiry as status demotion / temporal supersession |
| PR-S1-002 | AS-2: Memory precedes reasoning vs continuous observation | Observation ≠ interpretation; recognition boundary unstated | **Open Question** | Convention Session 1 — locate pattern/anomaly detection relative to observation · memory · reasoning |
| PR-S1-003 | AS-3: Belief / Knowledge / Understanding | Categories independently definable; derivation into Understanding under-specified | **Open Question** | Convention Session 1 — transformation into Understanding; discriminant Knowledge vs Understanding |
| PR-S1-004 | AS-4: Wisdom absent from master epistemology diagram | Wisdom = post-action reflective product, not epistemic stage | **Clarification** | Convention — diagram scope ends before reflective accumulation; Wisdom in Meta-Cognition / Evolution |
| PR-S1-005 | AS-7: Theory ↔ Science relationship | Option C supported; amendment evidence threshold unspecified | **Clarification** | Research governance — define epistemic threshold for Theory amendment (future) |

#### Session 1 summary

| Category | Count |
| -------- | ----: |
| Resolved | 0 |
| Clarification | 3 |
| Open Question | 2 |
| Amendment Candidate | 0 |
| Logical contradictions | **0** |

**Philosopher conclusion:** Failed to discover an internal logical contradiction in Theory v1.0 after adversarial review under stated scope and charity rules. Does not certify truth — certifies internal coherence pending Convention boundary work.

**Meta-observation:** No attack surface required a new architectural concept. Issues resolved by *"Where does this already belong?"* — boundary clarifications, not missing pillars. Conceptual structure stable under philosophical scrutiny; not evidence the theory is empirically correct.

#### Convention carry-forward (deferred until all five peer reviews complete)

| Source | Item | Owner |
| ------ | ---- | ----- |
| PR-S1-001 | Expiry = demotion/supersession, not deletion | Convention Session 2 |
| PR-S1-002 | Observation vs salience/threshold before emergent question | Convention Session 1 |
| PR-S1-003 | Transformation into Understanding; Knowledge vs Understanding discriminant | Convention Session 1 |
| PR-S1-004 | Epistemology diagram scope ends before Wisdom | Convention (Session 1 scope note) |
| PR-S1-005 | Evidence threshold for Theory amendment | Research governance (future) |

#### Session 1 gate

- [x] No unresolved **Amendment Candidate** without evidence plan
- [x] All **Clarification** items deferred to Convention (not Theory edit)
- [x] Success criterion met: failed to find logical contradiction after adversarial review

---

## Peer review record (aggregate)

| Review | Date | Outcome | Record |
| ------ | ---- | ------- | ------ |
| PR-S1 Philosopher | 2026-06-28 | **Passed** — 0 contradictions · 3 clarifications · 2 open questions | [PR-S1](#peer-review-session-1-philosopher) |
| Executive Cognition Peer Review (aggregate) | 📋 In progress | Sessions 2–5 pending · five gate questions open | [Peer Review doc](./LOCALBRAIN_EXECUTIVE_COGNITION_PEER_REVIEW.md) |

---

## Theory amendments (rare — never edit v1.0 in place)

| Version | Date | Change | Rationale | Evidence |
| ------- | ---- | ------ | --------- | -------- |
| v1.0 | 2026-06 | Initial freeze | Peer review + Falsification Charter | E-peer-review-001 |

Amendments publish as v1.1, v1.2, … v1.0 text remains immutable. See [Falsification Charter](./LOCALBRAIN_FALSIFICATION_CHARTER.md#canon-preservation).

---

## Adversarial review evidence

| Evidence ID | Type | Date | Summary | Theory impact |
| ----------- | ---- | ---- | ------- | ------------- |
| E-PR-S1-2026 | adversarial review | 2026-06-28 | Philosopher Session 1 — 5 attack surfaces · 0 contradictions · 3 clarifications · 2 open questions | None — internal coherence supported; Convention agenda deferred |

---

## Bibliography (growing)

Links doctrine to empirical work — internal first, field references as accumulated.

| Ref | Title | Relevance |
| --- | ----- | --------- |
| — | [Theory of Executive Cognition v1.0](./LOCALBRAIN_THEORY_OF_EXECUTIVE_COGNITION.md) | Core framework |
| — | [Executive Cognition Axioms](./LOCALBRAIN_EXECUTIVE_COGNITION_AXIOMS.md) | Laws |
| — | [Research Agenda](./LOCALBRAIN_RESEARCH_AGENDA.md) | Open questions |

Add external citations as experiments cite prior art.

---

*Cognitive Evidence Base · living · updated by science, not sprints · 2026*
