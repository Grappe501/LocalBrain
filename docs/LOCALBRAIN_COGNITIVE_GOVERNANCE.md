# Cognitive Governance

> **Status:** Doctrine — internal governance layer · Phase 2+ · no code until Epistemology Convention completes  
> **Layer:** Inside [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md) · **above** individual engines · **below** system boundaries  
> **Parent:** [Executive Cognition](./LOCALBRAIN_EXECUTIVE_COGNITION.md) · [Executive Epistemology Convention](./LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md) · [Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md)

---

## Governing principle

> **The platform should continuously improve the quality of executive judgment, not merely increase the quantity of executive activity.**

Everything in Phase 1 — Four Systems, Executive Questions, Memory, Proof, Planning, Program Office — already points here. [Executive Meta-Cognition](./LOCALBRAIN_EXECUTIVE_METACOGNITION.md) (System 4) implements **how the brain changes itself** — critique · trace · calibration · wisdom.

Meta-cognitive questions the platform must eventually ask itself:

```txt
How complete is our understanding?
Which assumptions matter most?
What evidence would change this recommendation?
What are we least certain about?
Which recommendation has the highest expected leverage?
Should we act now, wait, or deliberately gather more information first?
```

---

## Architecture stack

Cognition never operates on raw data. It operates on a shared representation of reality.

```txt
Reality
  ↓
World Model
  ↓
Executive Cognition
  ↓
Actions
```

| Layer | Role |
| ----- | ---- |
| **Reality** | Physical world · files · events · commitments in time |
| **World Model** | Platform's best current representation of reality — shared by all engines |
| **Executive Cognition** | Observe · remember · understand · predict · agency · decide |
| **Actions** | Approval-gated execution · outcomes · learning |

For Steve Brain (single-user), [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md) is the primary composed World Model — extended over Phase 2+ with unknowns, organizational structure, and institutional memory.

---

## Governance layer (above engines)

```txt
Four Platform Systems
  └── Cognitive Governance Layer     (World Model · Council · lenses)
        └── Executive Meta-Cognition (System 4 — trace · JQ · wisdom)
        └── Individual engines (ENG-*)
```

**Not a fifth system.** Not separate chatbots. Deterministic provenance where possible. Explicit separation: observation · interpretation · judgment · action.

---

## World Model

The platform's best current representation of reality. Every engine reads the same model — no siloed reconstructions per request.

**Contains:**

```txt
Workspaces · Relationships · Projects · Time · Resources · Constraints
Open questions · Commitments · Provenance · Unknowns
```

**Planned engine:** ENG-WM-001 · System 2 (Executive Memory OS) — composes from registry, memory, ledger, trajectories.

### Unknowns

Exceptional systems track what they **don't** know. Every mission carries:

| Class | Meaning | Example |
| ----- | ------- | ------- |
| **Known** | Verified fact | Debate is Friday. |
| **Known Unknown** | Explicit gap | Venue schedule not confirmed. |
| **Unknown Unknown Indicator** | Pattern suggesting hidden risk | Similar debates changed format at the last minute. |

Tells CoS where **investigation** is valuable before recommendation.

---

## Executive Cognitive Council

Not one monolithic intelligence. Specialized **reasoning lenses** — no independent authority to act. [Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md) **synthesizes** perspectives into recommendations auditable by Steve.

| Council member | Primary question | Lens |
| -------------- | ---------------- | ---- |
| **Strategist** | Does this advance the mission? | Mission alignment |
| **Skeptic** | What evidence is missing? | Epistemic gaps |
| **Risk Officer** | What could go wrong? | Downside · failure modes |
| **Operator** | Can this actually be executed? | Feasibility · capacity |
| **Historian** | What happened in similar situations? | Institutional memory · precedents |
| **Economist** | Is this the best use of scarce resources? | Decision economics |
| **Ethicist / Policy Guardian** | Does this comply with Constitution and Five Gates? | Safety · doctrine |

**Planned engine:** ENG-CCL-001 · System 3 (Executive Intelligence) — lens outputs are structured artifacts, not parallel LLM chats.

### Recommendation transparency chain

```txt
Originating Question
  ↓
Council perspectives (structured)
  ↓
Evidence · Memory · Knowledge · Beliefs
  ↓
Understanding applied
  ↓
Recommendation (with Strategic Clock horizon)
```

---

## Curiosity Engine

Not random curiosity. **Executive curiosity** — questions whose answers would materially improve decision quality.

```txt
We haven't validated this assumption in six months.
This project has no success metric.
Three plans depend on an outdated document.
No owner is assigned to this critical dependency.
```

**Planned engine:** ENG-CUR-001 · System 3 (Executive Intelligence) — feeds Known Unknowns and Agency.

---

## Decision Economics

Every recommendation estimates four costs — richer than a single priority score:

```txt
Cost of Action
Cost of Delay
Cost of Inaction
Cost of Wrong Action
```

**Planned engine:** ENG-DEC-001 · System 3 · Economist lens input.

---

## Goals vs Commitments

| Type | Nature | Example |
| ---- | ------ | ------- |
| **Goal** | Intent | Launch ContactListSOS. |
| **Commitment** | Obligation | Deliver beta to campaign by September 1. |

CoS reasons differently about each. Commitments create tension; goals express direction. World Model tracks both explicitly.

---

## Strategic Clock

Every recommendation declares its **time horizon**:

| Horizon | Scope |
| ------- | ----- |
| **Immediate** | Today |
| **Tactical** | This week |
| **Operational** | This month |
| **Strategic** | This quarter |
| **Transformational** | This year or beyond |

Prevents short-term urgency from crowding out long-term value. **Planned engine:** ENG-SCL-001 · System 3.

---

## Institutional Memory

Not personal memory. **Organizational experience** — for every major initiative:

```txt
Why it started
Alternatives rejected
Assumptions that existed
What succeeded · what failed · what surprised everyone
What should be done differently next time
```

How organizations develop experience instead of relearning the same lessons. **Planned engine:** ENG-IM-001 · System 4 (Executive Evolution) · Historian lens input.

---

## Learning from outcomes (not thumbs)

Learn from **reality**, not only feedback signals.

```txt
Recommendation: Visit Benton County before Pulaski County.
Outcome: Volunteer recruitment +22% · media exceeded forecast · donations up.
→ Strengthen or weaken future similar recommendations with evidence.
```

Ties to [Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md) Verification → Learning · System Evolution · belief revision without corrupting verified memory.

---

## Organization Digital Twin (Phase 3+)

Extend [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md) beyond files and projects — model the **organization itself**:

```txt
Teams · Roles · Dependencies · Communication patterns
Capacity · Decision flows · Bottlenecks
```

Simulations include organizational effects, not only technical ones. Single-user Phase 2 seeds structure; full org twin Phase 3+.

---

## Cognitive governance capability map

All modules **inside** Four Systems:

| Capability | Engine (planned) | System |
| ---------- | ---------------- | ------ |
| World Model | ENG-WM-001 | Executive Memory OS |
| Unknowns registry | (part of World Model) | Executive Memory OS |
| Cognitive Council | ENG-CCL-001 | Executive Intelligence |
| Curiosity | ENG-CUR-001 | Executive Intelligence |
| Decision Economics | ENG-DEC-001 | Executive Intelligence |
| Strategic Clock | ENG-SCL-001 | Executive Intelligence |
| Institutional Memory | ENG-IM-001 | Executive Evolution |
| Meta-cognition audit | ENG-MCG-001 | Executive Intelligence → Evolution |

See [Executive Meta-Cognition](./LOCALBRAIN_EXECUTIVE_METACOGNITION.md) for full capability map (Cognitive Trace · JQ · Bias · Wisdom · Self-Doubt).

Existing: [MCP](./LOCALBRAIN_EXECUTIVE_INTENT.md) · [ECL](./LOCALBRAIN_EXECUTIVE_COGNITIVE_LOAD.md) · [ELS](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md) · [Tension](./LOCALBRAIN_EXECUTIVE_COGNITION.md) · Agency · Proof · Five Gates.

---

## Relationship to other doctrine

| Doc | Focus |
| --- | ----- |
| [Executive Epistemology Convention](./LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md) | What can be known · remembered · believed |
| [Executive Cognition](./LOCALBRAIN_EXECUTIVE_COGNITION.md) | Agency · tension · time · initiative |
| **Cognitive Governance** (this doc) | World Model · Council · judgment quality · meta-cognition |

---

## Gate

No governance-layer code before Epistemology Convention completes and World Model contract is spec-locked. Layered onto existing architecture without new platform pillars.

---

*Cognitive Governance · internal layer above engines · 2026*
