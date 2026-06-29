# Four Platform Systems

> **Status:** Architecture lock — feature-complete through Phase 4  
> **Rule:** Every new capability fits into **one** of these systems. No new top-level pillars without Constitution amendment.  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md) · [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md)

---

## Declaration

LocalBrain is not one monolith. It is **four cooperating platform systems** (plus a fifth, much later) that remain **independent** even though they work together.

```txt
SYSTEM 1 — Executive OS              (Run the work)
SYSTEM 2 — Executive Memory OS       (Remember everything)
SYSTEM 3 — Executive Intelligence    (Think)
SYSTEM 4 — Executive Evolution       (Get smarter)
SYSTEM 5 — Executive Organization OS (Run an organization)  ← Phase 4+, not yet
```

**Architecture is feature-complete through Phase 4.** From here, expansion means modules, engines, providers, and workflows inside these systems — not new foundational pillars.

---

## Independence rule

| System | Must NOT depend on |
| ------ | ------------------ |
| Executive OS | OpenAI · Claude · Ollama · any vendor |
| Executive Memory OS | Specific LLM · UI layout |
| Executive Intelligence | Direct vendor SDK calls |
| Executive Evolution | Business logic in departments |

Vendors are **implementation details** behind [AI Provider Management](./LOCALBRAIN_AI_PROVIDER_MANAGEMENT.md) and the capability router.

---

## System 1 — Executive OS

**Question:** *Where am I working?*

**Owns:**

- UI shell · navigation · Live Surface · Experience Maturity badges
- Living Workspaces · departments · studios
- Digital Assets · Knowledge Explorer (browse UX)
- Permissions · safety · approval workflow · Actions queue
- Executive Program Office (construction scoreboard)
- System Health (machine + ops)

**Does not own:** Mission prioritization · memory recall plans · model training · org-wide delegation.

**Key engines:** ENG-SRF-001 · ENG-EXP-001 · ENG-BLD-001 · ENG-TL-001 · ENG-HL-001 · module loader (LB-OS-106).

**Docs:** [Operating System Doctrine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · [Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md) · [EPO](./LOCALBRAIN_EXECUTIVE_PROGRAM_OFFICE.md).

---

## System 2 — Executive Memory OS

**Question:** *What do we know?*

**Owns:**

- Memory domains · recall · provenance
- Knowledge Sources · indexing · registry
- Decision Ledger (binding decisions)
- Executive Context Window · Memory Confidence · Context Efficiency
- Historical · Reference · Creative memory partitions

**Does not own:** Recommendations · mission ranking · UI chrome · provider selection.

**Key engines:** ENG-MEM-001 · ENG-MC-001 · ENG-CE-001 · ENG-KP-001 · ENG-DAI-001.

**Binding rule:** **Memory before reasoning** — recall and confidence gates precede CoS inference.

**Docs:** [Executive Memory OS](./LOCALBRAIN_EXECUTIVE_MEMORY_OS.md) · [Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) · [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md).

---

## System 3 — Executive Intelligence

**Question:** *What should I do?*

**Owns:**

- Mission Stack · Mission Completion Probability (MCP)
- Executive Question Registry · mission-scoped routing
- Executive Intelligence Cards · consolidation · simulations
- Chief of Staff orchestration · recommendations · Attention Budget
- Executive Leverage Score · [Executive Cognitive Load](./LOCALBRAIN_EXECUTIVE_COGNITIVE_LOAD.md) (ECL)
- Adaptive prioritization · intentional deferrals

**Does not own:** Raw storage · permission enforcement · model fine-tuning · team RBAC.

**Key engines:** ENG-EMS-001 · ENG-EI-001 · ENG-MCP-001 · ENG-EQ-001 · ENG-EIC-001 · ENG-CNS-001 · ENG-CS-003 · ENG-ELS-001 · ENG-AB-001 · ENG-ECL-001.

**Docs:** [Executive Mission Stack](./LOCALBRAIN_EXECUTIVE_INTENT.md) · [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md) · [EIC](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md) · [Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md) · [CoS](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md).

---

## System 4 — Executive Evolution

**Question:** *How do we improve?*

**Owns:**

- Learning loops · outcome tracking (`cos_outcomes`)
- OJT · Academy · skill mastery
- Style adaptation · prompt optimization
- Provider optimization · model benchmarking
- System Evolution scoreboard (intelligence growth)
- Future LoRA · fine-tuning · training data pipelines

**Does not own:** Day-to-day workspace UI · primary briefing layout · permission gates.

**Key engines:** ENG-EVO-001 · ENG-OJ-001 · ENG-LP-002 · training/runtime slices (LB-OS-066+).

**Docs:** [System Evolution](./LOCALBRAIN_SYSTEM_EVOLUTION.md) · OJT slices · GPU / Neural Lab arc.

**Sibling scoreboards (do not merge):**

| Scoreboard | System | Question |
| ---------- | ------ | -------- |
| Program Office | Executive OS | What did we build? |
| System Evolution | Executive Evolution | What did the system learn? |
| Executive Leverage | Executive Intelligence | How much more effective am I? |

---

## System 5 — Executive Organization OS (Phase 4+, reserved)

**Question:** *How do we run an organization?*

**Not built for a long time.** Reserved for multi-user · server brain · shared workspaces.

**Will own:**

- Team members · roles · delegation
- Shared Memory · org-wide missions
- Multi-company · multi-department coordination
- Organizational Mission Stack

**Docs (future):** [Team Workspace Model](./LOCALBRAIN_TEAM_WORKSPACE_MODEL.md) · [Multi-Machine Network](./LOCALBRAIN_MULTI_MACHINE_NETWORK_PLAN.md) · [Shared Server Brain](./LOCALBRAIN_SHARED_SERVER_BRAIN.md).

---

## How systems cooperate (CoS path)

```txt
Steve
  ↓
Executive OS          — route · workspace · permissions
  ↓
Executive Intelligence — Mission Stack · Executive Question
  ↓
Executive Memory OS   — recall plan · Memory Confidence · Context Window
  ↓
Executive Intelligence — reasoning · Mission Alignment · EIC · recommendation
  ↓
Executive OS          — Simulation · Proposal · Approval · Execution
  ↓
Executive Evolution   — outcome · learning · Evolution scoreboard
```

---

## CPU vs GPU topology

GPU is not "AI acceleration" at the center — it is a **specialized service provider** for Evolution and heavy inference.

```txt
CPU Machine (day-to-day)
  Executive OS
  Executive Memory OS
  Executive Intelligence
  ────────────────────
GPU Server (scale workloads)
  Executive Evolution
  Model Runtime
  Training · Embeddings · Vector Search · Fine-tuning
```

Keeps the executive experience responsive; scales heavy AI independently. See [GPU Migration](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md) · [Dual-Track Roadmap](./LOCALBRAIN_DUAL_TRACK_ROADMAP.md).

---

## Metric map (top-level)

| Metric | System | Measures |
| ------ | ------ | -------- |
| Operational Health | Executive OS | Machine + ops |
| Engineering Score | Executive OS (dept) | Repo health |
| Consolidation Score | Executive Intelligence | Reclaim opportunity |
| Mission Completion Probability | Executive Intelligence | Primary mission odds |
| Mission Alignment | Executive Intelligence | Recommendation ↔ mission |
| Memory Confidence | Executive Memory OS | Information sufficiency |
| Context Efficiency | Executive Memory OS | Token / retrieval payoff |
| Executive Leverage Score | Executive Intelligence | Real-world impact |
| **Executive Cognitive Load** | Executive Intelligence | **Steve's attention load** |
| System Evolution index | Executive Evolution | Learning growth |

See [Executive Cognitive Load](./LOCALBRAIN_EXECUTIVE_COGNITIVE_LOAD.md) for ECL.

---

## Adding new capabilities (binding checklist)

Before any slice or feature:

1. **Which system owns it?** (exactly one primary owner)
2. **Which question does it answer?**
3. **Does it introduce a vendor dependency outside Evolution providers?** (forbidden)
4. **Does it duplicate a scoreboard?** (forbidden — link instead)
5. **Does it require a new foundational object?** (Constitution amendment)

If none of the four systems fit, the feature is **mis-scoped** — refactor before building.

---

## Phase mapping

| Phase | Primary systems activated |
| ----- | --------------------------- |
| **Phase 1** | Executive OS (+ Intelligence seeds: EIC, EQ) |
| **Phase 2** | Executive Intelligence (+ Memory OS v1, Evolution loops) |
| **Phase 3** | Memory OS full · Knowledge Platform · Evolution maturity |
| **Phase 4** | Executive Organization OS |

See [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md) · long-term [platform evolution](./LOCALBRAIN_THREE_PHASE_ROADMAP.md#long-term-platform-evolution).

---

## Amendment

New top-level system or cross-system merger requires:

1. Constitution amendment (Article II or new Article)
2. Update this document
3. Phase Checklist change log entry

---

*Four Platform Systems · architecture lock · 2026-06-29*
