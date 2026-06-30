# Executive Epistemology Convention

> **Status:** Required before LB-OS-027 implementation  
> **Type:** Architecture only — no code  
> **Scope:** Systems 2 (Memory) · 3 (Intelligence) · 4 (Evolution) — the rules by which the platform distinguishes observation, memory, knowledge, belief, understanding, and reasoning  
> **Doctrine:** [Article XIII — Executive Principle](./LOCALBRAIN_CONSTITUTION.md#article-xiii--executive-principle)  
> **Parent:** [Executive Memory OS](./LOCALBRAIN_EXECUTIVE_MEMORY_OS.md) · [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md) · [Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) · [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md) · [Phase 2 sequence](./LOCALBRAIN_PHASE1_CERTIFICATION.md#recommended-phase-2-sequence)

---

## Purpose

Phase 1 taught LocalBrain **where everything is**.  
Phase 2 must teach it **what everything means**.

Before writing a line of Phase 2 code, define **executive epistemology** — how knowledge is acquired, validated, organized, interpreted, questioned, and used in decision-making. This is not a design meeting, not merely software architecture, and not a storage schema.

```txt
Teach LocalBrain to remember before it learns to reason.
```

**Discipline:** Lock ontology before implementation. Phase 2 quality depends less on model APIs or retrieval algorithms than on getting these conceptual boundaries right.

---

## Governing sentence (Convention closes with this)

> **The purpose of the platform is not to accumulate answers. It is to continuously improve the quality of the questions it can ask and answer.**

Executive Questions · Memory · Knowledge · Beliefs · Understanding · [Executive Cognition](./LOCALBRAIN_EXECUTIVE_COGNITION.md) · Mission Stack · Executive Intelligence · Executive Evolution all fit beneath this principle.

---

## Executive Cognition (Phase 2+ doctrine)

Epistemology defines **what can be known**. [Executive Cognition](./LOCALBRAIN_EXECUTIVE_COGNITION.md) defines **what should happen** — including when nothing should.

Extended pipeline (capabilities inside Four Systems — not new pillars):

```txt
Question → Memory → Understanding → Prediction → Agency → Decision → Action
```

Key concepts for Convention Session 1 awareness · detailed spec in Executive Cognition doc:

| Concept | Role |
| ------- | ---- |
| **Agency** | Should anything happen at all? (initiative · emergent observation) |
| **Tension** | Unresolved domain pressure — brain reduces total tension |
| **Trajectories** | Direction over time (not snapshots) |
| **Momentum** | State + velocity + direction |
| **Mental Models** | Tested patterns about how Steve works (not memories) |
| **Counterfactuals** | Alternate futures before deciding |

**Emergent question:** *What happens if Steve does nothing?* — not only *What should I do today?*

---

## Platform philosophy (binding context)

> **LocalBrain is an executive operating platform that separates work, knowledge, decisions, and improvement into distinct systems. It organizes the user's digital world through deterministic structure, remembers with provenance, reasons only after memory is assembled, and continuously evolves through verified outcomes rather than opaque model behavior.**

LocalBrain specifies **executive epistemology in software**. Every conclusion must be traceable to the **question** that prompted it, the **evidence** that supports it, the **memories** recalled, the **beliefs** evaluated, and the **understanding** applied.

---

## Questions are first-class

Most systems are answer-oriented. Executives create **questions**. The platform must never ask only *"What do I know?"* It must ask:

> **"What question am I trying to answer?"**

Everything downstream becomes contextual: memory recall · knowledge assembly · belief evaluation · reasoning · Mission Stack.

### Three classes of questions

Broadens [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md) (ENG-EQ-001):

| Class | Examples |
| ----- | -------- |
| **Operational** | Where is this file? · How much disk space? · Which workspace owns this? |
| **Executive** | What should I work on today? · Why is this project blocked? · Should I approve this migration? |
| **Epistemic** | What do we actually know? · What assumptions are we making? · What evidence contradicts this? · What are we missing? |

Epistemic questions are the foundation of Executive Intelligence. [Curiosity Engine](./LOCALBRAIN_COGNITIVE_GOVERNANCE.md#curiosity-engine) surfaces questions whose answers materially improve decisions.

### Goals vs Commitments

| Type | Example |
| ---- | ------- |
| **Goal** (intent) | Launch ContactListSOS. |
| **Commitment** (obligation) | Deliver beta to campaign by September 1. |

CoS reasons differently about each. See [Cognitive Governance](./LOCALBRAIN_COGNITIVE_GOVERNANCE.md#goals-vs-commitments).

### Requested vs Emergent

| Kind | Source | Example |
| ---- | ------ | ------- |
| **Requested** | Steve asks | "Where are my RedDirt documents?" |
| **Emergent** | System asks | "Why are three workspaces referencing the same archive?" |

Fundamentally different. Emergent questions are where Executive Intelligence eventually creates leverage.

---

## Master epistemology diagram (Convention closing deliverable)

Not code. Every future slice can be checked against it — each stage has a distinct responsibility; nothing overlaps.

```txt
Physical World
        │
Question
        │
Observation
        │
Data
        │
Information
        │
Memory
        │
Knowledge
        │
Beliefs
        │
Understanding
        │
Prediction
        │
Agency
        │
Mission
        │
Reasoning
        │
Decision
        │
Action
        │
Outcome
        │
Learning
        │
New Questions
        │
Executive Evolution
```

See [Executive Cognition](./LOCALBRAIN_EXECUTIVE_COGNITION.md) for Agency · Tension · Trajectories · Mental Models · full Observe→Evolve loop.

| Stage | Responsibility |
| ----- | -------------- |
| **Question** | Frame what is being asked (requested or emergent) |
| Observation → Information | Situate raw facts in question context |
| Memory | Recall verified retention |
| Knowledge | Organize durable judgment |
| Beliefs | Hold revisable interpretation |
| Understanding | Stable network of validated conclusions |
| Mission → Reasoning → Decision | Executive Intelligence (System 3) |
| Action → Outcome → Learning | Closed loop |
| **New Questions** | Every answer generates new questions — recursive executive thinking |
| Executive Evolution | Organizes improvement (System 4) |

Executive OS (System 1) organizes work across this stack without collapsing epistemic layers.

### Recursive reasoning loop

```txt
Question → Recall → Assemble → Understand → Reason → Answer → New Questions
```

---

## Transparent recommendation chain

Every recommendation carries its **originating question** — not recommendation alone:

```txt
Question
  ↓
Evidence
  ↓
Memory
  ↓
Knowledge
  ↓
Beliefs considered
  ↓
Understanding applied
  ↓
Recommendation
```

---

## Cognitive layers (below the question)

**Understanding** is not merely accumulated knowledge:

> **A stable network of validated conclusions supported by knowledge and memory.**

Understanding evolves more slowly than beliefs.

```txt
Observation → Data → Information → Memory → Knowledge → Belief → Understanding → Reasoning
```

### Memory is not Belief

```txt
Observed Fact → Memory → Knowledge → Belief → Reasoning → Decision
```

| Stage | Example |
| ----- | ------- |
| **Observed** | Kelly met Chris. |
| **Memory** | Kelly and Chris met repeatedly during campaign planning. |
| **Knowledge** | Chris is involved in strategic planning. |
| **Belief** | Chris is likely to be a reliable strategic partner. |
| **Decision** | Recommend involving Chris in the next planning session. |

**Belief is revisable. Memory should not be** (once verified — Session 2).

### Remembered vs Concluded

```txt
Remembered:  Kelly spoke with Chris on Monday.
Concluded:   Campaign planning is accelerating.
```

Memories are **recalled**. Conclusions are **derived**. Reasoning never silently rewrites them.

### Knowledge Strength vs Certainty

Independent dimensions — not one confidence score:

| Dimension | Question |
| --------- | -------- |
| **Knowledge Strength** | How much evidence supports this? |
| **Certainty** | How confident are we that our current understanding is correct? |

Historical (17 projects: high strength, high certainty) vs forecast (campaign manager: moderate strength, low certainty) must not share one axis.

---

## Three kinds of truth

**Objective** (temperature, date, file path) · **Relational** (Kelly works with Chris; dependencies) · **Interpretive** (best person to ask; project appears stalled) — interpretive claims must never masquerade as objective fact.

---

## Beliefs (healthy cognitive structures)

> **Can the platform believe something that later proves false?** — **Yes**, with structure:

```txt
knowledge strength · certainty · supporting evidence · contradicting evidence
last evaluated · why the belief exists
```

---

## Executive Intelligence pipeline (Phase 2+)

```txt
Question
  ↓
Memory → Knowledge → Beliefs
  ↓
Mission
  ↓
Reasoning → Decision
```

---

## Executive Evolution — question maturity metrics

Instead of measuring only recommendations accepted:

```txt
Questions answered
Questions eliminated
Questions discovered
Questions deferred
Recurring questions
```

A measure of organizational maturity — not just model performance.

---

## Five sessions

### Session 1 — What is Memory? (Ontology)

| Question |
| -------- |
| What qualifies as a memory? · What is merely data? · What becomes knowledge? |
| Memory vs Belief · Remembered vs Concluded |
| Knowledge Strength vs Certainty · three truth kinds |
| **What is a question in this ontology — and how does it frame observation?** |

**Output:** Ontology contract — questions + six layers + truth kinds.

---

### Session 2 — Memory Lifecycle

```txt
Observed → Captured → Verified → Referenced → Strengthened → Dormant → Archived → Forgotten (rare)
```

**Output:** Lifecycle state machine · transition rules · audit hooks.

---

### Session 3 — Recall

Every recall answers: why retrieved · what question · strength · certainty · evidence · ignored · near-misses.

**Output:** Recall explainability contract · ENG-MEM-001 · tie to Executive Question Registry.

---

### Session 4 — Memory Provenance

Source classes · lineage · knowledge strength · certainty · supporting/contradicting evidence.

**Output:** Provenance schema · ENG-MC-001 direction · recommendation citation requirements.

---

### Session 5 — Memory Ethics

Consent · decay · immutability · memory and belief conflict · belief revision without corrupting verified memory.

**Output:** Ethics policy · conflict resolution rules.

---

## Convention deliverables

```txt
Master epistemology diagram (Question-first pipeline + Agency · Prediction)
Cognitive Governance layer (World Model · Council · meta-cognition)
Executive Cognition capability map (engines inside Four Systems)
Question taxonomy (Operational · Executive · Epistemic · Requested · Emergent)
Unknowns model (Known · Known Unknown · Unknown Unknown Indicator)
Memory ontology · Belief contract · Strength + Certainty model
Transparent recommendation chain + Council lens outputs
Memory lifecycle · Recall · Provenance · Ethics policies
Executive Evolution question-maturity + institutional memory direction
LB-OS-027 Burt packet — Executive Memory Bootstrap
```

---

## Gate

```txt
All five sessions complete → LB-OS-027 may enter spec lock
No Convention → no Phase 2 memory substrate code
```

System 1 remains frozen per [Executive OS v1.0 Freeze](./LOCALBRAIN_EXECUTIVE_OS_V1_FREEZE.md).

---

*Executive Epistemology Convention · Systems 2–4 · 2026*
