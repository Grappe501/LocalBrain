# LocalBrain Constitution v1.0

> **Version 2 Constitution (planned canonical index)** — June 2026  
> **Status:** Index + governing principles; detailed law lives in linked doctrine  
> **Rule:** Every planning document is an **implementation guide beneath this Constitution**, not an independent authority.

When documents conflict, **Constitution wins** → then Architecture lock → then Phase Checklist gate line.

---

## Article I — Mission

**Product:** [Executive Operating System](./LOCALBRAIN_EXECUTIVE_OFFICE.md) — Steve's AI Executive Operating System.

**Engine:** [LocalBrain](./LOCALBRAIN_PRODUCT_NAMING.md) — [Executive Cognition](./LOCALBRAIN_EXECUTIVE_COGNITION.md), not a chat assistant. LLMs are one subsystem.

**North star (weekly):**

```txt
Did Steve accomplish more meaningful work this week
than he would have without LocalBrain?
```

**North star (10–20 years):**

> **How do we build an executive cognitive system that can outperform today's assistants over the next 10–20 years?**

**Philosophy:**

> LocalBrain is an executive operating platform that separates work, knowledge, decisions, and improvement into distinct systems. It organizes the user's digital world through deterministic structure, remembers with provenance, reasons only after memory is assembled, and continuously evolves through verified outcomes rather than opaque model behavior.

Most AI systems wait for prompts. Executive cognition continuously observes, detects tension, predicts futures, and proposes the smallest high-leverage intervention that increases [Mission Completion Probability](./LOCALBRAIN_EXECUTIVE_INTENT.md) while minimizing [Executive Cognitive Load](./LOCALBRAIN_EXECUTIVE_COGNITIVE_LOAD.md).

**Measured by:** [Executive Leverage Score](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md) · [Effectiveness Metrics](./LOCALBRAIN_EFFECTIVENESS_METRICS.md) · MCP · ECL

**Development phases:** [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md)

---

## Article II — Foundational Objects

Ten frozen objects — [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md)

```txt
LivingWorkspace · DigitalAsset · Decision · Memory · KnowledgeSource
Module · Engine · Action · Person · Organization
```

No new core object types without Constitution amendment.

**Projection Layer:** Permanent interface (logical → physical) — **not** an eleventh object. See [Three Worlds & Projection](./LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md).

---

## Article III — Layer Architecture

[Operating System Doctrine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) · [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md)

```txt
Layer 0 — Host platform
Kernel — module loader (LB-OS-106)
Platform — sellable engines and shell
Brain — Steve's private data and workspaces
```

### Four Platform Systems (binding)

[Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md) — architecture lock through Phase 4.

[Three Worlds & Projection](./LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md) — Executive · Logical · Physical worlds; Projection Layer between Logical and Physical. **Durable endpoint** — storage backends change; executive and logical models do not.

```txt
Executive OS           — Where am I working? (surfaces)
Executive Intelligence — What should I do? (Executive World)
Logical World          — Workspaces · assets · memory (no drive letters)
Projection Layer       — Logical object → physical representation
Physical World         — Bytes (H: · C: · future providers)
```

Four cooperating platform systems — see [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md). No vendor dependencies in business logic (LB-OS-017).

---

## Article IV — Executive Office

[Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) sits **above** all departments.

| Surface | Role | Doc |
| ------- | ---- | --- |
| Executive Briefing | Morning **Executive Intelligence Cards** · ELS headline (Phase 2) | [EIC](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md) · CoS |
| Program Office | Construction scoreboard | [EPO](./LOCALBRAIN_EXECUTIVE_PROGRAM_OFFICE.md) |
| System Evolution | Intelligence scoreboard | [Evolution](./LOCALBRAIN_SYSTEM_EVOLUTION.md) |
| System Health | Machine + ops | LB-OS-011 |
| Decisions | Decision Ledger | [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) |
| Assumptions | Premises behind design | [Assumption Ledger](./LOCALBRAIN_ASSUMPTION_LEDGER.md) |

---

## Article V — Chief of Staff

[AI Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md) · [Command Layer](./LOCALBRAIN_COMMAND_LAYER.md)

```txt
CoS → Capability Router → departments / providers → Executive Intelligence Cards
No direct vendor SDK calls from business logic (LB-OS-017)
[Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md):
  Recommendation → Simulation → Proposal → Approval → Execution → Verification → Learning
```

Phase 2 success: CoS **improves decisions**, not only describes state — guided by [Executive Mission Stack](./LOCALBRAIN_EXECUTIVE_INTENT.md) and **Mission Completion Probability** (Phase 2; not Phase 1).

**LB-OS-020** introduced **Executive Intelligence Cards** (ENG-EIC-001) and **Simulation as first-class**. **LB-OS-020.5** wired the **Executive Question Registry** (ENG-EQ-001). **Phase 2 (reserved):** Mission Stack + Adaptive Attention Budget + MCP — do not build until after 026.

---

## Article VI — Departments

[Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md) · [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md)

Departments are modules with shared spine: types → service → routes → UI → docs → checklist.

Phase 3 adds departments only on an **intelligent** executive layer (Phase 2 gate).

---

## Article VII — Knowledge Model

[Knowledge Sources](./LOCALBRAIN_KNOWLEDGE_SOURCES.md) · [Digital Asset Model](./LOCALBRAIN_DIGITAL_ASSET_MODEL.md) · [Knowledge Taxonomy](./LOCALBRAIN_KNOWLEDGE_TAXONOMY.md) · Knowledge Explorer (LB-OS-005)

```txt
Three knowledge classes (binding): Operational · Executive · Domain
Index · explain · permission-gated read
Registry · intelligence · recommend-only cleanup
```

Operational knowledge ships with Platform; Executive and Domain knowledge are per-user Brain data.

---

## Article VIII — Memory Model

[Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) · [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md)

Six domains + apex Digital Twin compose Steve's world for CoS context.

---

## Article IX — Safety Model

[Permission engine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) (LB-OS-003) · Approval workflow (LB-OS-010) · [Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md)

```txt
Read tools gated · Write/move/quarantine require approval
No silent writes · No auto-delete · Quarantine before destroy
Simulation before proposal (Steve may waive) · Verification after execution · Learning (Phase 2)
```

---

## Article X — Development Doctrine

[Build Slice Queue v2](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) · [Phase Checklist](./PHASE_CHECKLIST.md) · [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md)

```txt
Slice order is law · Burt packet per slice · Checklist gate line is authoritative
EPO = construction (ENG-BLD-001) · Evolution = intelligence (ENG-EVO-001)
Experience Maturity L0–L5 on every route · Dev mode shows badges; production hides
```

**Workspace modes:** [Adaptive Workspace Modes](./LOCALBRAIN_WORKSPACE_MODES.md) (future LB-OS-03X)

---

## Article XI — Five Gates Rule

[Five Gates Rule](./LOCALBRAIN_FIVE_GATES_RULE.md) — **binding admission checklist** before any new capability:

```txt
1. System (Four Systems owner)
2. Object (foundational object — no new without Article II amendment)
3. Module (never kernel)
4. Executive Question (EQ-* — if none, don't build)
5. Executive Leverage (increases Steve's effectiveness)
```

**Phase 1 discipline:** No new top-level concepts until LB-OS-026. Complete 021–026 (Executive Workspace Architecture arc) · GPU prep without architecture churn.

---

## Article XII — Assumption Ledger

[Assumption Ledger](./LOCALBRAIN_ASSUMPTION_LEDGER.md) — constitutional peer to Decision Ledger. Records **premises** behind design (single-user, SQLite, client platform) even when choices are reversible. Review on declared triggers (Phase 4, multi-user, GPU migration).

---

## Article XIII — Executive Principle

**Remember before you reason. Distinguish what you remember from what you conclude. Improve the questions.**

```txt
The platform shall remember before it reasons.

The platform shall distinguish what it remembers from what it concludes.

The purpose of the platform is not to accumulate answers.
It is to continuously improve the quality of the questions it can ask and answer.

Every recommendation must be traceable to the question that prompted it,
memory,
provenance,
or deterministic evidence.

Reasoning augments memory.
It never replaces it.

Memory and belief are distinct.
Verified memory is not conflated with revisable belief.

Memories are recalled.
Conclusions are derived.
Beliefs are revisable.
Understanding is accumulated.
Reasoning operates on all of them — but never silently rewrites them.

The platform shall continuously improve the quality of executive judgment,
not merely increase the quantity of executive activity.

The platform exists not to replace executive judgment,
but to continuously refine it through disciplined observation,
traceable memory,
transparent reasoning,
principled governance,
measurable outcomes,
and deliberate reflection.
```

Binding for Phase 2+ intelligence work (LB-OS-027–035). See [Executive Cognition Axioms](./LOCALBRAIN_EXECUTIVE_COGNITION_AXIOMS.md) · [Executive Memory OS](./LOCALBRAIN_EXECUTIVE_MEMORY_OS.md) · [Executive Epistemology Convention](./LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md) · [Cognitive Governance](./LOCALBRAIN_COGNITIVE_GOVERNANCE.md) · [Executive Cognition](./LOCALBRAIN_EXECUTIVE_COGNITION.md) · [Executive Meta-Cognition](./LOCALBRAIN_EXECUTIVE_METACOGNITION.md).

---

## Article XIV — Executive Cognition Axioms

Non-negotiable **laws** for Phase 2+. Every engine, API, prompt, and workflow must be provably consistent. Full text: [Executive Cognition Axioms](./LOCALBRAIN_EXECUTIVE_COGNITION_AXIOMS.md).

```txt
1. Reality is sovereign — the platform models reality; it never substitutes for it.
2. Memory precedes reasoning — no reasoning until relevant memory is considered.
3. Questions govern cognition — everything begins with a question, not data or prompts.
4. Every conclusion has ancestry — question, memories, evidence, assumptions, lenses, unknowns.
5. Uncertainty is information — unknowns are not failures; self-doubt is a feature.
6. Time changes truth — knowledge has a temporal dimension the World Model must honor.
7. Decisions change reality — action alters the world; downstream must recognize that.
```

**Cognitive Invariants** (vendor-independent): traceability · provenance · explainability · reversibility · separation of observation / interpretation / memory / belief / judgment.

**Cognitive Conservation:** observation → memory → knowledge → understanding → wisdom — earlier forms are never overwritten.

**Long-term ambition:**

> Build a governed executive cognition platform whose reasoning remains traceable, whose judgment continuously improves through experience, whose understanding stays coherent as reality changes, and whose architecture remains independent of any particular AI model.

Evolution is **experimental** — see [Executive Cognitive Science](./LOCALBRAIN_EXECUTIVE_COGNITIVE_SCIENCE.md) · [Research Agenda](./LOCALBRAIN_RESEARCH_AGENDA.md). **Why** it should work: [Theory of Executive Cognition](./LOCALBRAIN_THEORY_OF_EXECUTIVE_COGNITION.md).

**Concept freeze:** No new doctrine after Theory v1.0. **[Peer Review](./LOCALBRAIN_EXECUTIVE_COGNITION_PEER_REVIEW.md)** required before H-027. Evidence → [Cognitive Evidence Base](./LOCALBRAIN_COGNITIVE_EVIDENCE_BASE.md).

---

## Amendment process

1. Propose change in Decision Ledger or Assumption Ledger + Phase Checklist change log  
2. Update Constitution index if principle changes  
3. Update downstream implementation guides  
4. Never silently contradict Article II objects or Article IX safety

---

## Document hierarchy

```text
LOCALBRAIN_CONSTITUTION.md          ← you are here
├── LOCALBRAIN_FOUR_SYSTEMS.md      ← architecture lock (4+1 systems · Phase 4 complete)
├── LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md (Executive · Logical · Physical · Projection)
├── LOCALBRAIN_EXECUTIVE_WORKSPACE_ARCHITECTURE.md (LB-OS-021 · Workspace DNA · blueprints)
├── LOCALBRAIN_FIVE_GATES_RULE.md   ← admission checklist (Article XI)
├── LOCALBRAIN_ASSUMPTION_LEDGER.md ← premises ledger (Article XII)
├── LOCALBRAIN_KNOWLEDGE_TAXONOMY.md (Operational · Executive · Domain)
├── LOCALBRAIN_ARCHITECTURE_DEBT.md (ENG-ADS-001 · Engineering scoreboard)
├── LOCALBRAIN_THREE_PHASE_ROADMAP.md
├── LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md (ENG-EIC-001 · LB-OS-020)
├── LOCALBRAIN_ACTION_PIPELINE.md
├── LOCALBRAIN_CONSOLIDATION_PLANNER.md   (LB-OS-020 Executive Intelligence)
├── LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md (ENG-EQ-001 · LB-OS-020.5)
├── LOCALBRAIN_EXECUTIVE_INTENT.md (Executive Mission Stack · ENG-EMS-001 · MCP · Phase 2)
├── LOCALBRAIN_EXECUTIVE_MEMORY_OS.md (Memory OS · Memory Confidence · Phase 2–3)
├── LOCALBRAIN_EXECUTIVE_COGNITION_AXIOMS.md (Article XIV — seven laws · invariants · conservation)
├── LOCALBRAIN_EXECUTIVE_COGNITIVE_SCIENCE.md (hypotheses · falsification · WMA)
├── LOCALBRAIN_THEORY_OF_EXECUTIVE_COGNITION.md (v1.0 · scope · concept freeze)
├── LOCALBRAIN_EXECUTIVE_COGNITION_PEER_REVIEW.md (gate before H-027 · not a design meeting)
├── LOCALBRAIN_COGNITIVE_EVIDENCE_BASE.md (living · hypotheses · bibliography)
├── LOCALBRAIN_RESEARCH_AGENDA.md (open research questions · H-* registry)
├── LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md (gate before LB-OS-027)
├── LOCALBRAIN_EXECUTIVE_COGNITION.md (agency · tension · trajectories · Phase 2+ capabilities)
├── LOCALBRAIN_COGNITIVE_GOVERNANCE.md (World Model · Council · judgment structure)
├── LOCALBRAIN_EXECUTIVE_METACOGNITION.md (Cognitive Trace · JQ · wisdom · System 4 apex)
├── LOCALBRAIN_MEMORY_SUMMIT.md (redirect → Epistemology Convention)
├── LOCALBRAIN_MEMORY_DOMAINS.md (Memory foundational object · six domains)
├── LOCALBRAIN_EXECUTIVE_COGNITIVE_LOAD.md (ENG-ECL-001 · System 3 · Phase 2)
├── LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md (ENG-ELS-001)
├── LOCALBRAIN_PHASE1_INTEGRATION_PASS.md (LB-OS-020.5)
├── LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md
├── LOCALBRAIN_*_DEPARTMENT.md
├── LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md
├── PHASE_CHECKLIST.md
└── docs/burt_packets/LB-OS-*.md
```

---

*Constitution v1.0 · Articles XIII–XIV · Executive Cognition Axioms · Phase 1 complete · 2026-06-29*
