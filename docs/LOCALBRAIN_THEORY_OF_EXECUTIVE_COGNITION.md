# A Theory of Executive Cognition

> **Status:** **Theory v1.0** — frozen after [Peer Review](./LOCALBRAIN_EXECUTIVE_COGNITION_PEER_REVIEW.md) passes five gate questions · amendments only via documented process  
> **Layer:** Beside [Executive Cognitive Science](./LOCALBRAIN_EXECUTIVE_COGNITIVE_SCIENCE.md) — not above it · not a sixth platform system  
> **Science asks:** *Does this work?* **Theory asks:** *Why should this work?*  
> **Parent:** [Executive Cognition Axioms](./LOCALBRAIN_EXECUTIVE_COGNITION_AXIOMS.md) · [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Evidence Base](./LOCALBRAIN_COGNITIVE_EVIDENCE_BASE.md)

---

## Scope (explicit boundary)

> **This theory models executive cognition:** the processes involved in directing work, allocating attention, making decisions under uncertainty, preserving institutional knowledge, and improving judgment over time.

> **It does not claim to model** the full breadth of human cognition, consciousness, emotion, or creativity.

Explicit scope is a strength. Good theories state what they explain and what they do not.

---

## Theory v1.0

```txt
Theory of Executive Cognition
  v1.0
  Frozen (pending peer review sign-off)
```

Future changes are **amendments** — like the Constitution. Record in [Cognitive Evidence Base](./LOCALBRAIN_COGNITIVE_EVIDENCE_BASE.md).

| Change type | Frequency |
| ----------- | --------- |
| Theory | Rare (years) |
| Science | Occasionally (months) |
| Software | Frequently (days) |

Software must not change theory every sprint.

---

## Concept freeze (binding)

**Stop adding new architectural concepts after this document.**

Further work is **implementation**, **Convention sessions**, and **hypothesis tests** — not doctrine expansion. Adding concepts now likely decreases coherence rather than increases capability.

Every implementation must answer four questions:

1. **Which axiom does this depend on?**
2. **Which hypothesis is it testing?**
3. **Which theory prediction does it support or challenge?**
4. **How does it measurably improve executive judgment?**

If a feature cannot answer these, it does not belong in the core platform.

---

## Document stack (complete)

```txt
Laws                    (Axioms)
  ↓
Ontology                (Epistemology Convention)
  ↓
Governance              (World Model · Council)
  ↓
Cognition               (Agency · Tension · Time)
  ↓
Meta-Cognition          (Trace · JQ · Wisdom)
  ↓
Experimental Science  ←→  Theory (this document)
  ↓
Implementation        (engines · UI — projections only)
```

---

## Core thesis

> **Executive performance is constrained less by intelligence than by the quality, organization, timing, and governance of cognition.**

This is **falsifiable**. It is not:

> Better AI → better executives.

LocalBrain exists to improve cognition's quality, organization, timing, and governance — with AI as one accelerant, not the thesis itself.

---

## The primitive: Cognitive Leverage

Not memory. Not reasoning. Not agency alone.

The primitive is **Cognitive Leverage** — how much executive judgment improves per unit of attention spent.

Conceptual law (not literal arithmetic):

```txt
         Judgment Quality
       × World Model Accuracy
       × Mission Alignment
       × Action Quality
       ─────────────────────
         Executive Cognitive Load
```

Everything in the platform exists to **improve the numerator** or **reduce the denominator**. [Executive Leverage Score](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md) operationalizes outcomes; this expression states *why* the architecture is structured as it is.

---

## Cognitive Equilibrium

Executives optimize across **competing objectives**. The platform must not maximize MCP, ELS, JQ, WMA, or ECL independently.

It must maintain **healthy balance** among them:

* +1% MCP may not be worth doubling ECL.
* Lowering risk may destroy opportunity.
* Higher WMA may require temporary ECL investment (gathering evidence).

**Prediction:** Systems that explicitly reason about tradeoffs outperform single-metric optimizers on long-horizon [Judgment Quality](./LOCALBRAIN_EXECUTIVE_METACOGNITION.md) and [Cognitive Capital](#cognitive-capital).

---

## Decision Half-Life

Decisions decay at different rates. The platform should know expected **lifespan**:

| Decision class | Typical half-life |
| -------------- | ----------------- |
| Meeting time | Hours |
| Campaign itinerary | Weeks |
| Organizational structure | Years |
| Constitutional axiom | Decades |

Influences when to revisit conclusions · memory expiry · [Strategic Clock](./LOCALBRAIN_COGNITIVE_GOVERNANCE.md#strategic-clock) alignment · Axiom 6 (time changes truth).

---

## Cognitive Entropy

Organizations naturally accumulate disorder:

```txt
Duplicate knowledge · Outdated assumptions · Contradictory plans
Forgotten commitments · Fragmented documentation
```

The platform's job is not merely to organize — it is to **continuously reduce cognitive entropy**.

**Prediction:** Measurable entropy reduction correlates with rising World Model Accuracy and falling Evidence Debt. [Tension](./LOCALBRAIN_EXECUTIVE_COGNITION.md) is partly unresolved entropy in mission space.

---

## Cognitive Capital

Knowledge is an asset. Lasting value accumulates through:

```txt
Institutional memory · Executive judgment · Reusable understanding · Organizational wisdom
```

**Cognitive capital** compounds unlike raw productivity. [Wisdom](./LOCALBRAIN_EXECUTIVE_METACOGNITION.md#wisdom-accumulation) and [Institutional Memory](./LOCALBRAIN_COGNITIVE_GOVERNANCE.md#institutional-memory) are capital formation; cognitive entropy is capital erosion.

---

## Executive Optionality

Organizations preserving **high-quality options** are more resilient. Elevates [Executive Principles](./LOCALBRAIN_EXECUTIVE_METACOGNITION.md#executive-principles) — *preserve optionality* — from rule to theory.

**Prediction:** Recommendations that unnecessarily collapse future choices reduce long-run Cognitive Capital even when short-run MCP rises. Agency and CoS should flag optionality destruction.

---

## Cognitive Compound Interest

One excellent decision rarely changes an organization. **Ten thousand slightly better decisions do.**

> Small improvements in executive judgment compound over years into large organizational advantages.

Same intuition as financial compound interest, applied to cognition. Justifies investment in meta-cognition, trace, and calibration even when per-decision gains look small.

---

## Conservation of Understanding

The deepest principle. **Understanding cannot simply be generated.**

It must **emerge** from disciplined interaction between:

```txt
Reality · Evidence · Memory · Knowledge · Judgment · Reflection
```

LLMs can **accelerate** that process. They **cannot replace** it.

Protects the architecture from every future hype cycle. Aligns with [Cognitive Conservation](./LOCALBRAIN_EXECUTIVE_COGNITION_AXIOMS.md#cognitive-conservation) and Axioms 1–2.

---

## Purpose of executive cognition (theory statement)

> **The purpose of executive cognition is not to maximize activity, certainty, or information. Its purpose is to continually improve the quality of judgment while preserving truth, optionality, institutional memory, and human agency under conditions of uncertainty.**

Intellectual destination of the entire stack. Complements [Constitution Article XIII](./LOCALBRAIN_CONSTITUTION.md#article-xiii--executive-principle) operational principles.

---

## Theory predictions (testable via Cognitive Science)

| Prediction | Test |
| ---------- | ---- |
| Cognition quality beats raw intelligence | JQ ↑ with stable model tier vs. JQ flat with larger model alone |
| Cognitive Leverage improves with WMA | WMA ↑ correlates with JQ and MCP |
| Equilibrium beats single-metric max | Explicit tradeoff reasoning beats MCP-only scheduling on 90-day outcomes |
| Entropy reduction matters | Entropy ↓ correlates with Coherence ↑ |
| Optionality preservation pays off | Optionality-preserving recommendations outperform on crisis scenarios |
| Compound interest is real | Small JQ gains compound in Cognitive Capital over quarters |
| Conservation holds | Compression and wisdom promotion never reduce traceable ancestry |

Each maps to H-* hypotheses in [Research Agenda](./LOCALBRAIN_RESEARCH_AGENDA.md).

---

## Relationship to LocalBrain

LocalBrain is an **instance** of this theory — a governed executive cognition platform implementing axioms, testing hypotheses, and measuring whether predictions hold.

The theory is **portable**: another implementation could adopt the same laws and science while differing in engines and UI.

---

## What comes next

Not more concepts.

1. **Executive Epistemology Convention** — Session 1–5 (ontology from axioms).
2. **Hypothesis H-027** — Executive Memory Bootstrap.
3. **Implementation** — four questions per slice.
4. **Science** — accept, refine, or reject hypotheses; update theory only when predictions fail systematically.

---

*A Theory of Executive Cognition · concept freeze · 2026*
