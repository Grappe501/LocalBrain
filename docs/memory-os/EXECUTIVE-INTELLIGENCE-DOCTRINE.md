# Executive Intelligence Doctrine

> **Status:** **FROZEN** — **Version 1** · `ei-doctrine-v1.0` · [EI-001](./EI-001-DOCTRINE-FREEZE.md) · [ENG-PMO-006](./ENG-PMO-006-EI-DOCTRINE-FREEZE.md) · [ENG-PMO-007](./ENG-PMO-007-EI-GOVERNANCE-REFINEMENTS.md)  
> **Prerequisite:** [ENG-PMO-005](./ENG-PMO-005-CONSTITUTIONAL-COMPLETION.md) · [Deterministic Foundation Doctrine](./DETERMINISTIC-FOUNDATION-DOCTRINE.md) · [The Five Constitutional Substrates](./THE-FIVE-CONSTITUTIONAL-SUBSTRATES.md)  
> **Design review:** [MAR-3](./MAR-3-EXECUTIVE-INTELLIGENCE-ARCHITECTURE_REVIEW.md) — **COMPLETE**  
> **Lock:** [ei-doctrine-lock.json](./certification/ei-doctrine-lock.json)  
> **First implementation:** [ENG-EI-001 Constitutional Retrieval](./ENG-EI-001-CHARTER.md) — **AUTHORIZED**  
> **Constitutional design phase:** **COMPLETE** · `ei-doctrine-v1.0` · [ENG-PMO-006](./ENG-PMO-006-EI-DOCTRINE-FREEZE.md)

**Engineering metric:** **Doctrine Fidelity** — see [ENG-EI-001](./ENG-EI-001-CHARTER.md)

> **Engineering specification:** [Volume 6 — Executive Intelligence](./VOLUME-6-EXECUTIVE_INTELLIGENCE.md) (implements frozen doctrine — does not redefine it)  
> **Amendments:** Executive Intelligence v2+ may amend this doctrine — never implicit behavior change · same discipline as Factory Constitution and Memory Specification

---

## Preamble

Executive Intelligence exists to assist institutional leadership by reasoning over constitutional records.

It does not replace institutional memory, exercise institutional authority, or mutate constitutional truth.

It produces advisory work products whose reasoning is grounded in and traceable to the Constitutional Foundation.

---

## The architectural pivot

> **Wave 1 established constitutional certainty so that Wave 2 can safely introduce probabilistic reasoning.**

| Era | Question |
| --- | -------- |
| Institutional Cognition Foundation (Wave 1 · CLOSED) | What should the institution preserve? |
| Executive Intelligence Era (Wave 2+ · AUTHORIZED) | Given what is preserved, what should leadership consider next? |

Wave 1 proved that an institution can preserve trustworthy records. Wave 2 will prove that those records can support trustworthy advice. Those are distinct claims — treating them separately is a strength, not a delay.

| Era | Claim |
| --- | ----- |
| Institutional Cognition Foundation (Wave 1 · CLOSED) | Institutions can preserve trustworthy records |
| Executive Intelligence Era (Wave 2+ · AUTHORIZED) | Those records can support trustworthy advice |

---

## Constitutional placement

Executive Intelligence does not sit directly on the institution. It sits **on the Constitution**.

```text
Institution
      ↓
Constitutional Foundation          ← deterministic · Wave 1 CLOSED
      ↓
Executive Intelligence             ← probabilistic · advisory · replaceable
      ↓
Policy                             ← authoritative · action
      ↓
Action
```

Intelligence reads constitutional substrates. Policy authorizes action. The substrates are never bypassed.

---

## Constitutional stack (platform)

Each layer answers a different question:

| Layer | Question |
| ----- | -------- |
| **Vision** | Why are we building this? |
| **Factory Constitution** | What is an institution? |
| **Convention** | What rules govern institutions? |
| **Memory Specification** | How are constitutional records represented? |
| **Deterministic Foundation Doctrine** | Why must memory remain deterministic? |
| **Executive Intelligence Doctrine** | How may probabilistic reasoning interact with deterministic memory? |
| **Engineering Specifications** | What must be implemented? |
| **Implementation** | How is it implemented? |

```text
Vision
      ↓
Factory Constitution
      ↓
Convention
      ↓
Memory Specification
      ↓
Deterministic Foundation Doctrine
      ↓
Executive Intelligence Doctrine      ← this document
      ↓
Engineering Specifications
      ↓
Implementation
```

Doctrine explains the philosophy that specifications implement — the same role the Architecture Book plays for design intent.

---

## The Executive Office

The Executive Office is not an AI assistant. It is not a dashboard.

```text
Constitutional Foundation
        +
Executive Intelligence
        +
Policy
        =
Executive Office
```

The Executive Office is the operating environment in which constitutional records, advisory intelligence, and authorized action meet — without collapsing them into one layer.

---

## Governance loop

Wave 1 closed at authority **recording**. Wave 2 closes the loop at authority **transition**:

```text
Memory preserves.
      ↓
Executive Intelligence recommends.
      ↓
Policy decides.
      ↓
Decision Ledger records.
```

Wave 1 ended with:

> **Authority is exercised. It is never inferred.**

Wave 2 completes the chain with Article VII.

---

## Defining sentences

> **Intelligence reasons over institutional memory. It does not replace it.**

> **Executive Intelligence recommends. Policy decides.**

> **Executive Intelligence must degrade safely.**

> **Executive Intelligence bears the burden of proof.**

> **Executive Intelligence is a constitutional consumer, not a constitutional source.**

Companion to Wave 1:

> AI should not be the memory of an institution. AI should reason over the institution's deterministic memory.

Together they define both sides of the relationship:

```text
Memory is the constitutional source.
Executive Intelligence is the constitutional consumer.
```

There is no box labeled LLM in this architecture. The model is an implementation detail — replaceable at the Intelligence layer (Article V), not the center of the system.

---

## Immutable articles

These nine articles are binding for Executive Intelligence. They may not be weakened without an explicit doctrine amendment cycle.

### Article I — Advisory

> **Executive Intelligence is advisory. Never authoritative.**

Recommendations, assessments, and options do not bind the institution. Binding authority flows only through Policy and the Decision Ledger — never through Intelligence output alone.

### Article II — Consumption

> **Executive Intelligence consumes constitutional substrates. It never owns them.**

Episode, Artifact, Fact, Conversation, and DecisionCitation remain the sole owners of institutional record types. Intelligence may reference them. It may not duplicate, supersede, or embed authoritative state in advisory artifacts.

### Article III — Alternatives, not truth

> **Executive Intelligence may generate alternatives. It never creates institutional truth.**

Interpretation does not become knowledge without institutional acceptance. Assessment does not become authority without exercised governance. Intelligence proposes — substrates preserve.

### Article IV — Explainability

> **Executive Intelligence explains every recommendation by citing constitutional substrates.**

Every advisory work product must be reconstructable: which substrates informed the output, in what role, and without requiring the current model to re-derive institutional record. Citation is the explainability contract.

### Article V — Replaceability

> **Executive Intelligence remains replaceable.**

When the reasoning engine changes, constitutional substrates do not change. Episode, Fact, Artifact, Conversation, and DecisionCitation do not change. Policy gates do not change. Only the advisory layer changes. That is intentional.

```text
GPT-7 · future model · local engine · specialized planner
        ↓
All interchangeable at the Intelligence layer
        ↓
Institution endures
```

### Article VI — Uncertainty

> **Executive Intelligence must distinguish institutional record from probabilistic judgment.**

Every output must make obvious which parts are:

```text
Institutional Record     ← constitutional substrates · deterministic
```

versus

```text
Executive Assessment     ← probabilistic judgment · advisory
```

These must never be visually or conceptually blended. Uncertainty is a feature of intelligence — not a defect to hide.

### Article VII — Separation of recommendation and decision

> **Executive Intelligence recommends. Policy decides.**

Executive Intelligence may recommend a course of action, analyze alternatives, estimate risks, and explain reasoning. It never constitutes institutional approval, authorization, or execution.

Decisions become institutional only through Policy and the Decision Ledger.

This article closes the gap between "advisory" and "authoritative" — the same precision Wave 1 applied to exercised vs inferred authority.

### Article VIII — Safe degradation

> **Executive Intelligence must degrade safely.**

When Executive Intelligence cannot responsibly advise, it must say so — explicitly, visibly, and without substituting inference for institutional record.

| Condition | Required behavior |
| --------- | ----------------- |
| Retrieval fails | Report **insufficient evidence** — do not synthesize from absence |
| Citations incomplete | **Withhold recommendations** — partial traceability is not traceability |
| Confidence low | State uncertainty **explicitly** — never present low-confidence judgment as settled assessment |
| Required substrate unavailable | **Do not fabricate continuity** — absence of record is not permission to invent context |

Safe degradation complements Article VI (uncertainty discipline) and Article VII (recommendation vs decision). It answers: *What does Executive Intelligence do when it cannot responsibly advise?*

**The answer is never:** silently proceed · infer missing substrates · present assessment as record · recommend without citations · imply institutional approval.

### Article IX — Burden of proof

> **Executive Intelligence bears the burden of proof.**

Recommendations are presumed **unsupported** until sufficient constitutional evidence is assembled. The absence of evidence is not evidence of support.

Wave 1 established that records must justify themselves (A12–A17). Executive Intelligence inherits that philosophy. The default posture is restraint:

```text
Not:  "Can I make a recommendation?"
But:  "Have I earned the right to make one?"
```

Burden of proof pairs with Article VIII (safe degradation): when evidence is insufficient, Intelligence withholds — it does not infer support from silence.

---

## Constitutional work products

Executive Intelligence does not produce arbitrary free-form AI responses. It produces a **small, fixed set** of constitutional work products:

| Work product | Role |
| ------------ | ---- |
| **Executive Brief** | Situational synthesis over constitutional records |
| **Executive Assessment** | Probabilistic judgment — explicitly labeled as assessment |
| **Executive Options** | Competing courses of action — alternatives required · no premature convergence |
| **Executive Recommendation** | Proposed course of action — advisory only |
| **Executive Risk Assessment** | Downside and exposure analysis grounded in cited substrates |

**Options** is constitutional, not optional. Intelligence must surface alternatives rather than collapse toward a single answer.

No other output types are constitutional work products unless added by explicit doctrine amendment.

---

## Evidence threshold model

Before implementation, each work product requires a **minimum constitutional basis** — structural expectations, not numerical scores. Exact thresholds may evolve in engineering specifications; the principle is frozen here.

| Work product | Minimum constitutional basis |
| ------------ | ---------------------------- |
| **Executive Brief** | One or more constitutional substrates with citations |
| **Executive Assessment** | Multiple cited substrates **plus** explicit uncertainty |
| **Executive Options** | Multiple viable alternatives — each with cited support |
| **Executive Recommendation** | Sufficient cited evidence to justify a recommendation; **otherwise withheld** |
| **Executive Risk Assessment** | Cited evidence supporting each identified risk **and** any stated uncertainty |

**Burden of proof applies to every row.** If the minimum basis is not met, the work product is not emitted — Article IX · Article VIII.

Evidence packaging (ENG-EI-001) assembles the substrate citations on which later slices must satisfy these thresholds. Constitutional Retrieval does not produce work products; it prepares the evidence they require.

---

## What Executive Intelligence may do

| Permitted | Description |
| --------- | ----------- |
| Read | Consume constitutional substrates and Decision Ledger citations |
| Synthesize | Combine records into situational understanding |
| Prioritize | Rank attention, urgency, and leadership focus |
| Recommend | Propose courses of action — advisory only |
| Explain | Trace reasoning to substrate citations |
| Present options | Surface alternatives — Executive Options is mandatory |
| Hypothesize | Generate scenarios — labeled as assessment |
| Summarize | Compress context for leadership — without mutating source records |
| Plan | Propose sequences of consideration — not authorized execution |

---

## What Executive Intelligence must never do

| Prohibited | Rationale |
| ---------- | --------- |
| Rewrite canonical substrates | Deterministic Foundation · append-only constitutional rule |
| Infer exercised authority | Authority Principle · A17 |
| Reconstruct governance from context | Recording Principle |
| Convert interpretation into knowledge silently | Interpretation Independence · Fact acceptance required |
| Convert assessment into authority | Governance Principle · Article VII |
| Auto-approve or auto-execute recommendations | Article VII · Policy decides |
| Mutate deterministic memory directly | Article II · substrates own truth types |
| Blend record and assessment without distinction | Article VI |
| Execute policy or binding action | Policy layer owns action |
| Present advisory output as institutional truth | Article I · Article III |
| Proceed when evidence is insufficient without explicit disclosure | Article VIII · safe degradation |
| Recommend with incomplete substrate citations | Article IV · Article VIII |
| Fabricate continuity when substrates are unavailable | Article VIII |
| Emit work product below evidence threshold | Article IX · Evidence threshold model |
| Treat absence of evidence as support | Article IX · burden of proof |

```text
Memory preserves.
Intelligence recommends.
Policy decides.
Ledger records.
Action executes.
```

---

## Relationship to Wave 1 integrity

Executive Intelligence inherits the integrity classes of the substrates it consumes — it does not replace them.

| Substrate | Integrity | Intelligence role |
| --------- | --------- | ----------------- |
| Episode | Historical fidelity | Read · cite · never revise history |
| Artifact | Authenticity (A13) | Read · cite · never reconstruct evidence |
| Fact | Explainability (A12) | Read · cite · never invent knowledge |
| Conversation | Context · Sequence · Attribution (A14–A16) | Read · cite · never reconcile interpretation |
| DecisionCitation | Authority (A17) | Read · cite · never infer or exercise authority |

Executive Intelligence inherits Wave 1's epistemic discipline: records justify themselves. Advisory outputs must do the same — Article IX.

---

## Platform contrast

Most AI products:

```text
LLM → Everything
(memory · knowledge · authority · action)
```

LocalBrain:

```text
Institution
      ↓
Constitutional Foundation   (deterministic)
      ↓
Executive Intelligence    (probabilistic · advisory)
      ↓
Policy → Action
```

---

## Three responsibilities

The platform's rhythm is deliberate — each layer answers a different question and may evolve independently:

| Layer | Responsibility |
| ----- | -------------- |
| **Constitutional Foundation** | What the institution preserves |
| **Executive Intelligence** | How advice is generated from preserved records |
| **Policy** | How the institution chooses to act |

New AI models · retrieval systems · and planning algorithms can be absorbed at the Intelligence layer without disturbing constitutional record — because the separation is constitutional, not incidental.

---

## Authorized sequence (Executive Intelligence Era)

```text
Executive Intelligence Doctrine        ← this document
      ↓
MAR-3 architecture review COMPLETE
      ↓
EI-001 doctrine freeze (ei-doctrine-v1.0)
      ↓
[ENG-EI-001 Constitutional Retrieval](./ENG-EI-001-CHARTER.md) — read-only · cite · package
      ↓
Later ENG-EI slices (reasoning · work products)
      ↓
PMO acceptance
```

No Executive Intelligence implementation code ships before EI-001 freeze.

---

## Philosophical conclusion

At the beginning, the project asked: *How do we build an AI Chief of Staff?*

Today it answers a deeper question:

> **How should institutions safely use probabilistic intelligence without compromising deterministic truth?**

Whether the first deployment serves campaigns, executives, nonprofits, or governments, the architectural answer is the same.

---

## Amendment discipline

This doctrine is intentionally brief and intentionally difficult to amend.

| Rule | Meaning |
| ---- | ------- |
| Pre-freeze review | [MAR-3](./MAR-3-EXECUTIVE-INTELLIGENCE-ARCHITECTURE_REVIEW.md) must PASS before [EI-001](./EI-001-DOCTRINE-FREEZE.md) |
| Pre-implementation freeze | No Executive Intelligence code ships before `ei-doctrine-v1.0` |
| Explicit amendment only | Weakening an article requires a documented doctrine revision — not a pull request convention |
| Specification follows doctrine | Volume 6 and downstream ENG-EI slices implement this document — they do not redefine it |
| OPS reflects · PMO certifies | Same ENG / OPS / ENG-PMO separation as Wave 1 |
| Verification lanes | [Three Correctness Model](./VERIFICATION-LANES.md) — constitutional · behavioral · operational |

---

*Executive Intelligence Doctrine · LocalBrain V1 · Executive Intelligence Era · 2026*
