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
| 2 | Cognitive scientist | ✅ Passed (research obligations) | [PR-S2 below](#peer-review-session-2-cognitive-scientist) |
| 3 | Systems engineer | ✅ Passed (engineering obligations) | [PR-S3 below](#peer-review-session-3-systems-engineer) |
| 4 | Executive practitioner | 📋 Ready — frozen packet `7b6ab71` | [PR-S4 — Session 4 opens](#peer-review-session-4-executive-practitioner) |
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

### Peer Review Session 2 (Cognitive Scientist)

| Field | Value |
| ----- | ----- |
| Date | 2026-06-28 (Session 2 open) |
| Reviewer | Independent (Cognitive Scientist) |
| Submission | Frozen at `7b6ab71` — Session 1 findings not incorporated |
| Rules | [Session 2 rules](./LOCALBRAIN_EXECUTIVE_COGNITION_PEER_REVIEW.md#session-2--cognitive-scientist-rules-binding) |
| Outcome | **Passed with research obligations** — 0 empirical contradictions · 2 clarifications · 3 open questions · 0 Amendment Candidates |

#### Findings log

| ID | Finding | Empirical read | Outcome | Notes |
| -- | ------- | -------------- | ------- | ----- |
| PR-S2-001 | Memory → Knowledge → Belief | Normative separation, not descriptive of unaided cognition; reconstructive memory diverges | **Clarification** | Test via H-*: explicit separation ↑ JQ vs blended recall |
| PR-S2-002 | Executive Questions | Model B (activated information need) plausible; diagram may place Question too early vs emergent path | **Open Question** | Convention Session 1 — Question as primitive vs interface vs attentional manifestation |
| PR-S2-003 | Mission Stack / MCP | Mission-oriented cognition plausible; MCP may be instrument not destination | **Open Question** | Convention — MCP as operational metric under equilibrium/principles |
| PR-S2-004 | World Model | Empirically plausible; WMA must be measurable; preserve plural partial models | **Clarification** | Research: WMA predicts JQ · MCP · surprise · avoidable failures |
| PR-S2-005 | Judgment Quality | Theoretically plausible; measurement · Goodhart · trace-vs-judgment risks | **Open Question** | Research — inter-rater reliability · predictive validity · outcome-independent stability · structured profile |

#### Session 2 summary

| Category | Count |
| -------- | ----: |
| Resolved | 0 |
| Clarification | 2 |
| Open Question | 3 |
| Amendment Candidate | 0 |
| Empirical contradictions | **0** |

**Cognitive scientist conclusion:** Failed to discover empirical evidence falsifying Theory v1.0 at conceptual-architecture level. Theory is normative engineering — not cognitive mimicry. Vulnerability is measurement · operationalization · validation · calibration — where a scientific theory should be vulnerable.

**Session 2 meta-observations:**
- Theory makes **descriptive** and **normative** claims — H-* should tag which is under test.
- Pressure points reduce to *"Will reality support this normative design?"* not internal inconsistency.

#### Research obligations (from Session 2 — high priority)

| ID | Obligation | Validation criterion |
| -- | ---------- | -------------------- |
| RO-S2-001 | JQ measurement | Inter-rater reliability on identical Cognitive Traces |
| RO-S2-002 | JQ predictive validity | Historical JQ predicts future decisions better than outcome history alone |
| RO-S2-003 | JQ stability | JQ stable when outcomes fluctuate from luck |
| RO-S2-004 | JQ vs documentation | Score reasoning quality, not trace completeness alone |
| RO-S2-005 | Goodhart resistance | JQ resists gaming when used as target |
| RO-S2-006 | WMA accountability | WMA predicts JQ · surprise · avoidable failures — not decorative |
| RO-S2-007 | Descriptive/normative tags | Every H-* declares claim type under test |

#### Session 2 gate

- [x] No unresolved **Amendment Candidate** without evidence plan
- [x] All **Clarification** / **Open Question** items deferred (Convention or research — not Theory edit)
- [x] Success criterion met: failed to find empirical contradiction falsifying conceptual architecture

---

### Peer Review Session 3 (Systems Engineer)

| Field | Value |
| ----- | ----- |
| Date | 2026-06-28 (Session 3 open) |
| Reviewer | Independent (Systems Engineer) |
| Submission | Frozen at `7b6ab71` |
| Overarching question | Could this architecture work at millions of memories · thousands of workspaces · multiple organizations · decades of knowledge? |
| Rules | [Session 3 rules](./LOCALBRAIN_EXECUTIVE_COGNITION_PEER_REVIEW.md#session-3--systems-engineer-rules-binding) |
| Outcome | **Passed with engineering obligations** — 0 engineering contradictions · 1 clarification · 4 open questions · 0 Amendment Candidates |

#### Findings log

| ID | Finding | Engineering read | Outcome | Notes |
| -- | ------- | ---------------- | ------- | ----- |
| PR-S3-001 | Cognitive Trace scalability | Recoverable explainability · not full recursive reconstruction; Model C (DAG + checkpoints) | **Clarification** | Engineering: bounded-depth lineage · stable checkpoints · compressed ancestry |
| PR-S3-002 | World Model incremental evolution | Federated submodels · locality · sync semantics · temporal versioning | **Open Question** | Engineering: incremental compose · versioned submodels · historical replay without full snapshots |
| PR-S3-003 | Memory Recall latency | Sufficient memory before reasoning · not complete; streaming/tiered recall | **Open Question** | Engineering: tiered · streaming · interruptible recall · confidence thresholds · relevance ownership |
| PR-S3-004 | Reasoning while reality changes | Versioned decision context · material change detection · recommendation freshness | **Open Question** | Engineering: event-aware cognition · dependency invalidation · concurrent decision coordination |
| PR-S3-005 | Runtime self-observation | Epistemic vs infrastructure uncertainty · runtime health model | **Open Question** | Engineering: provider reliability · degradation detection · dual confidence (judgment vs runtime) |

#### Session 3 summary

| Category | Count |
| -------- | ----: |
| Clarification | 1 |
| Open Question | 4 |
| Amendment Candidate | 0 |
| Engineering contradictions | **0** |

**Systems engineer conclusion:** Failed to find engineering constraints requiring Theory v1.1. Theory constrains implementation without forcing reinterpretation. Emergent style: **local · incremental · versioned · event-aware · self-observing**.

#### Engineering obligations (from Session 3)

| ID | Obligation |
| -- | ---------- |
| RO-S3-001 | Bounded-depth default explainability · drill-down to full ancestry |
| RO-S3-002 | Cognitive Trace checkpoints at decision + reflection close |
| RO-S3-003 | Graph depth grows sublinearly vs graph size |
| RO-S3-004 | Federated World Model — local update boundaries |
| RO-S3-005 | Submodel synchronization semantics · staleness · conflict surfacing |
| RO-S3-006 | Point-in-time World Model replay without full snapshots |
| RO-S3-007 | Locality — unrelated updates do not invalidate distant understanding |
| RO-S3-008 | Tiered/streaming recall with confidence-gated reasoning entry |
| RO-S3-009 | Interruptible recall on question change |
| RO-S3-010 | Recall latency — executive-time decisions (5-second test) |
| RO-S3-011 | Relevance ranking owned by platform — not model context stuffing |
| RO-S3-012 | Versioned Decision Context bound to Cognitive Trace |
| RO-S3-013 | Material change detection · dependency-aware invalidation |
| RO-S3-014 | Recommendation freshness driven by World Model delta |
| RO-S3-015 | Concurrent decision coordination across workspaces |
| RO-S3-016 | Trustworthy recommendations while reality continues changing |
| RO-S3-017 | Distinguish information uncertainty vs infrastructure uncertainty |
| RO-S3-018 | Runtime health model — provider reliability · degradation detection |
| RO-S3-019 | Graceful self-limitation when Runtime Confidence falls |
| RO-S3-020 | Detect silent degradation — slow recall · stale WM · partial indexing |

#### Session 3 gate

- [x] No unresolved **Amendment Candidate** without evidence plan
- [x] All **Clarification** / **Open Question** items deferred (engineering — not Theory edit)
- [x] Success criterion met: failed to find engineering contradiction requiring Theory v1.1

#### Session 3 planned review areas (complete)

| ID | Topic | Status |
| -- | ----- | ------ |
| PR-S3-001 | Cognitive Trace scalability | ✅ |
| PR-S3-002 | World Model incremental evolution | ✅ |
| PR-S3-003 | Memory Recall latency | ✅ |
| PR-S3-004 | Reasoning while reality changes | ✅ |
| PR-S3-005 | Runtime self-observation | ✅ |

---

### Peer Review Session 4 (Executive Practitioner)

| Field | Value |
| ----- | ----- |
| Date | ▶ Open 2026-06-30 — post Executive Office certification (`3bfd4da`) |
| Reviewer | Independent (Executive Practitioner) |
| Submission | Frozen at `7b6ab71` |
| Overarching question | Does this architecture help a real executive make better decisions under real constraints? |
| Outcome | **In progress** — [Burt packet](./burt_packets/MILESTONE-PR-S4.md) |

#### Findings log

| ID | Finding | Practical read | Outcome | Notes |
| -- | ------- | -------------- | ------- | ----- |
| PR-S4-001a | Cognitive Leverage primitive | Theory explicitly optimizes judgment **per unit of attention spent**; ECL sits in the denominator of the leverage law · Cognitive Equilibrium forbids maximizing MCP at the cost of doubling load | **Resolved** | Attention scarcity is constitutional, not incidental |
| PR-S4-001b | Agency quiet discipline | Executive Cognition + Constitution: value from knowing when **not** to interrupt · Tension gating surfaces only when high tension + MCP opportunity + acceptable ECL | **Resolved** | Strong practitioner fit — "protect attention" is a first-class optimization target |
| PR-S4-001c | Attention Budget + ECL engines | Adaptive Attention Budget (ENG-AB-001) and ECL (ENG-ECL-001) are **Phase 2** · Mission Stack filter: items advancing no mission should almost never interrupt | **Open Question** | Theory protects attention by design · operational enforcement waits on Mission Stack + AB + ECL — not a Theory v1.1 issue |
| PR-S4-001d | Emergent observation risk | Unprompted surfacing could increase noise if tension scoring is miscalibrated | **Open Question** | Already falsifiable (Falsification Charter: Agency ↑ ECL without MCP/JQ) · Kelly Sandbox must prove net leverage |
| PR-S4-001e | Phase 1 projection vs Phase 2 intent | V1 Executive Office routes many Executive Questions before Mission Stack ships — practitioner risk of **ceremony** (many surfaces) vs **protection** (few synthesized items) | **Clarification** | Implementation posture: CoS narrative synthesis + deferral lists are the attention-protection UX · not a doctrine gap |
| PR-S4-002a | Axiom 3 + Five Gates Gate 4 | Cognition begins with **questions**, not data/prompts · no capability without an Executive Question · explicit shift from feature navigation to question routing | **Resolved** | Architecture rejects feature-first UX at the governance layer |
| PR-S4-002b | Agency → Decision → Action pipeline | Executive Cognition pipeline terminates in **Decision** and **Action** (approval-gated) · `Decision` is a foundational object with Decision Ledger · Decision Half-Life models when choices expire | **Resolved** | Constructs anchor to decisions, not screens |
| PR-S4-002c | Three question classes | Operational · Executive · Epistemic — Phase 1 registry skews operational/state ("where is file", "system health") alongside true decision questions ("what should I consolidate", "what needs approval") | **Clarification** | Practitioner: "inventory" EQs support decisions but are not decisions themselves — theory allows this; CoS must synthesize into decision items at briefing |
| PR-S4-002d | Theory implementation gate | Four questions for any feature include "measurably improve executive judgment" · Gate 5 requires Executive Leverage | **Resolved** | Anti-feature discipline is repeated at theory + constitution layers |
| PR-S4-002e | Phase 2 epistemic + emergent questions | Epistemic class and emergent system questions not yet live · PR-S2-002 open on Question as primitive vs interface | **Open Question** | Convention Session 1 — does not block beta · Mission Stack will filter decision relevance |
| PR-S4-002f | Studio partial EQs (writing/data/engineering) | EQ-010–012 read as **pipeline visibility** more than executive decision — practitioner risk of tool dashboards masquerading as decisions | **Open Question** | Kelly validation: each studio route must answer a decision Steve actually makes weekly, or defer to V2/link-only |
| PR-S4-003a | Single executive authority | Institution model: **Steve decides** · departments **recommend/draft/synthesize** · capabilities **execute only with approval** · Council lenses have **no independent authority to act** | **Resolved** | Wrong or political input cannot become action without executive gate |
| PR-S4-003b | CoS conflict synthesis | CoS coordinates departments · surfaces cross-department conflicts · Cognitive Diversity audit asks whether disagreement was surfaced · recommendation chain shows council perspectives before merge | **Resolved** | Conflicting department views are institutional inputs, not competing executives |
| PR-S4-003c | Incomplete / wrong information | Axiom 1 (reality sovereign) · Axiom 4 (ancestry) · Unknowns (known / known-unknown / unknown-unknown) · Intellectual Humility · **Competing hypotheses** + falsification pass before convergence | **Resolved** | Platform designed to hold contradictory evidence, not collapse to first narrative |
| PR-S4-003d | Escalation vs suppression | Department escalation policies (interrupt / notify CoS / monitor / silent) · CoS standing order to protect attention while elevating synthesis gaps · Skeptic + Risk Officer lenses in Council | **Clarification** | Escalation doctrine exists in office structure projection; operational tuning at Convention + Kelly |
| PR-S4-003e | Trust gradients | `Person` is foundational · **Department trust score** and relationship-weighted escalation are Phase 2+ operational discipline — not specified in frozen theory prose | **Open Question** | Practitioner need: weight recommendations by source reliability · implement via Mission Memory / trust surfaces — not Theory v1.1 |
| PR-S4-003f | Organizational politics | **Organization Digital Twin** (teams · roles · communication patterns · bottlenecks) deferred to Phase 3+ · V1 models single primary executive | **Open Question** | Theory honest about scope limit · multi-stakeholder politics not fully modeled until org twin · Kelly/Chris beta is empirical test |
| PR-S4-003g | Delayed / stale information | Axiom 6 (time changes truth) · Decision Half-Life · Strategic Clock horizons · material-change / recommendation freshness (RO-S3-004 engineering obligation) | **Resolved** | Late information triggers revisit, not silent staleness |
| PR-S4-003h | Accountability after bad recommendation | Action pipeline: Verification → Learning · outcomes feed belief revision without corrupting verified memory · JQ/WMA evaluate **process** not luck · Cognitive Trace preserves who recommended what | **Resolved** | Bad recommendations become learning artifacts, not hidden failures |
| PR-S4-003i | Adversarial / intentional misinformation | No dedicated adversarial-source construct in v1.0 · handled via provenance break detection · falsification · Ethicist/Policy Guardian lens · approval gates | **Clarification** | Theory treats bad input as epistemic failure mode, not security model — sufficient for practitioner V1; hostile actor modeling → V2 if needed |

---

#### Session 2 planned review areas (complete)

| ID | Topic | Status |
| -- | ----- | ------ |
| PR-S2-001 | Memory → Knowledge → Belief | ✅ |
| PR-S2-002 | Executive Questions | ✅ |
| PR-S2-003 | Mission Stack / MCP | ✅ |
| PR-S2-004 | World Model | ✅ |
| PR-S2-005 | Judgment Quality | ✅ |

---

## Peer review record (aggregate)

| Review | Date | Outcome | Record |
| ------ | ---- | ------- | ------ |
| PR-S1 Philosopher | 2026-06-28 | **Passed** — 0 contradictions · 3 clarifications · 2 open questions | [PR-S1](#peer-review-session-1-philosopher) |
| PR-S2 Cognitive Scientist | 2026-06-28 | **Passed (research obligations)** — 0 empirical contradictions · 2 clarifications · 3 open questions | [PR-S2](#peer-review-session-2-cognitive-scientist) |
| PR-S3 Systems Engineer | 2026-06-28 | **Passed (engineering obligations)** — 0 engineering contradictions · RO-S3-001–020 | [PR-S3](#peer-review-session-3-systems-engineer) |
| Executive Cognition Peer Review (aggregate) | 📋 In progress | Sessions 4–5 pending · five gate questions open | [Peer Review doc](./LOCALBRAIN_EXECUTIVE_COGNITION_PEER_REVIEW.md) |

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
| E-PR-S2-2026 | adversarial review | 2026-06-28 | Cognitive Scientist Session 2 — 5 attack surfaces · 0 empirical contradictions · research obligations RO-S2-001–007 | None — empirical plausibility supported; H-* validation agenda defined |
| E-PR-S3-2026 | adversarial review | 2026-06-28 | Systems Engineer Session 3 — 5 attack surfaces · 0 engineering contradictions · obligations RO-S3-001–020 | None — engineering feasibility supported; implementation style emergent |
| E-META-PR-2026 | meta-evidence | 2026-06-28 | Sessions 1–3 pattern: claim-type separation · emergent implementation style (local · incremental · versioned · event-aware · self-observing) | Review method taxonomy — not evidence theory is correct |

### Peer review progress (institutional memory)

| Session | Focus | Result |
| ------- | ----- | ------ |
| 1 Philosopher | Internal logical consistency | Passed — 0 contradictions; boundary-definition questions |
| 2 Cognitive Scientist | Empirical plausibility | Passed (research obligations) — 0 contradictions; measurement/validation obligations |
| 3 Systems Engineer | Engineering feasibility | Passed (engineering obligations) — 0 contradictions; RO-S3-001–020 |
| 4 Executive Practitioner | Decision utility | ▶ In progress |
| 5 Skeptic | Assume theory wrong | ⬜ Pending |

**Confidence after S1–S3 (reviewer assessment, not certification):** Theory coherence strong · scientific plausibility sufficient to justify experimentation · engineering feasibility supported with obligations — not yet validated in implementation.

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
