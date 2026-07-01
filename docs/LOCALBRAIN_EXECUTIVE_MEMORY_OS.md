# Executive Memory OS

> **Phase:** 2–3 — Memory before reasoning (not Phase 1)  
> **System:** [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md) — **System 2: Executive Memory OS**  
> **Engine:** ENG-MEM-001 (active — Wave 1) · **Metrics:** Memory Confidence (ENG-MC-001) · Context Efficiency (ENG-CE-001)  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) · [Executive Mission Stack](./LOCALBRAIN_EXECUTIVE_INTENT.md) · [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md)

---

## Principle

[Article XIII — Executive Principle](./LOCALBRAIN_CONSTITUTION.md#article-xiii--executive-principle):

```txt
The platform shall remember before it reasons.
The platform shall distinguish what it remembers from what it concludes.
The purpose of the platform is not to accumulate answers —
  it is to continuously improve the quality of the questions it can ask and answer.
```

Phase 1 builds a trustworthy **Executive Operating System**.  
Phase 2+ specifies **executive epistemology** — question-first cognition, not answer-oriented retrieval.

**Gate before LB-OS-027:** [Executive Epistemology Convention](./LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md) — five sessions; architecture only, no code.

**Specification package (2026):** [Memory OS Design Package](./memory-os/README.md) — MEM-001–MEM-008 before implementation.

```txt
Today (Phase 1):
  Steve → Question → Chief of Staff → Answer

Phase 2+:
  Question → Observation → Memory → Knowledge → Beliefs → Understanding
    → Mission → Reasoning → Decision → Outcome → Learning → New Questions
```

**Memory sits before reasoning.** **Belief is revisable; verified memory is not.** **Understanding** is a stable network of validated conclusions supported by knowledge and memory — it evolves more slowly than beliefs.

### Remembered vs Concluded

```txt
Remembered:  Kelly spoke with Chris on Monday.
Concluded:   Campaign planning is accelerating.
```

Conclusions point back to supporting memories. Memories are recalled; conclusions are derived.

### Knowledge Strength vs Certainty

Independent dimensions — not a single confidence score. Historical collaboration (high strength, high certainty) vs forecast (moderate strength, low certainty) must not share one axis.

### Six cognitive layers

```txt
Data → Information → Memory → Knowledge → Belief → Understanding → Reasoning
```

| Stage | Example |
| ----- | ------- |
| Observed | Kelly met Chris. |
| Memory | Kelly and Chris met repeatedly during campaign planning. |
| Knowledge | Chris is involved in strategic planning. |
| Belief | Chris is likely to be a reliable strategic partner. |
| Decision | Recommend involving Chris in the next planning session. |

### Three truth kinds

**Objective** (temperature, date, file path) · **Relational** (Kelly works with Chris; workspace dependencies) · **Interpretive** (best person to ask; project appears stalled) — interpretive claims must never masquerade as objective fact.

Beliefs require: knowledge strength · certainty · supporting evidence · contradicting evidence · last evaluated · why the belief exists.

Full specification: [Executive Epistemology Convention](./LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md) · master epistemology diagram.

**Do not build Memory OS in Phase 1.** Foundation exists (registry, workspaces, Decision Ledger spec, Memory Domains v1). Full Memory OS layer ships in Phase 2–3.

---

## Memory OS (operating layer)

Not one undifferentiated search. An **actual memory operating system** with domain-scoped recall policies:

```txt
Memory OS
──────────────────────────
Executive Memory
    priorities · decisions · mission history
Workspace Memory
    projects · files · assets
Relationship Memory
    people · meetings · commitments
Learning Memory
    OJT · concepts · mastery
Creative Memory
    novels · photography · podcast
Operational Memory
    builds · deployments · failures
Historical Memory
    why decisions were made
Reference Memory
    documentation · APIs · manuals
```

Every AI interaction consults **appropriate memory domains** — never searches everything indiscriminately.

### Relationship to Memory Domains v1

[Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) defines the **foundational object model** (six domains, record shape, independence rules). **Memory OS** is the **runtime layer** that:

- Routes recall by mission + question + department
- Enforces domain boundaries at query time
- Surfaces provenance for every retrieved item
- Computes Memory Confidence before reasoning

Creative, Operational, Historical, and Reference memory extend the v1 domain map as **logical partitions** — may share storage engines, never share undifferentiated recall.

---

## CoS reasoning pipeline (Phase 2+)

```txt
1. Mission Stack         — which missions are active?
2. Executive Question    — which question is being answered?
3. Memory recall plan    — which domains · which queries?
4. Memory Confidence     — enough relevant information?
5. Context assembly      — Executive Context Window
6. Reasoning             — model inference (with reasoning confidence)
7. Mission Alignment     — which mission does this advance?
8. Recommendation        — EIC / briefing / proposal
9. Outcome               — approve · reject · defer
10. Learning             — Mission Memory · cos_outcomes · Decision Ledger
```

If step 4 fails threshold, CoS **asks before answering**:

```txt
"I don't think I have enough history on this project.
 Before I answer, I'd like to scan these three documents."
```

That is more useful than a confident incomplete answer.

---

## Memory Confidence (ENG-MC-001)

System-derived metric — **not model confidence**.

```txt
Memory Confidence
  98%

Meaning: How confident are we that we have enough relevant
         information to answer this well?
```

Displayed alongside other confidence signals:

```txt
Mission Alignment       96%
Memory Confidence       84%
Reasoning Confidence    92%
```

| Memory Confidence | CoS behavior |
| ----------------- | ------------ |
| High (≥85%) | Answer with full recommendation |
| Medium (60–84%) | Answer with caveats · cite gaps |
| Low (<60%) | Propose scan/index · defer strong recommendation |

Inputs: domain coverage · recency · source diversity · mission linkage · index completeness for scoped assets.

---

## Executive Context Window

Transparency feature: **why CoS knows what it knows** — shown for every recommendation.

```txt
Context Used
──────────────────────────
Mission:              ContactListSOS
Workspace:            Engineering
Recent Decisions:     4
Relevant Documents:   12
Relevant Conversations: 8
Relevant Assets:      27
Relevant Relationships: Chris · Kelly
Estimated Context Size: 18 KB
```

Makes reasoning inspectable. Steve can drill into any line → source refs in Memory OS.

Extends Phase 1 `context_used` on CoS responses into a first-class UI surface.

---

## Context Efficiency Score (ENG-CE-001)

Token efficiency payoff from local indexing and domain-scoped recall:

```txt
Context Efficiency
  18 KB retrieved
  2.1 MB avoided
  99.2% reduction
```

Surfaces on System Health / effectiveness views. Proves value of Memory OS over naive full-corpus RAG.

```txt
ContextEfficiency {
  bytes_retrieved
  bytes_avoided_estimate
  reduction_percent
  domains_consulted[]
  domains_skipped[]
}
```

---

## Long-term platform evolution

LocalBrain evolves beyond Executive OS toward an **Executive Knowledge Platform**:

```txt
Phase 1 — Executive OS
  Trustworthy shell · objects · approval gates · EQ registry · EIC

Phase 2 — Executive Intelligence
  Mission Stack · MCP · adaptive Attention Budget · Mission Memory

Phase 3 — Executive Knowledge Platform
  Memory OS · provenance · durable organizational knowledge · Context Efficiency

Phase 4 — Executive Organization Platform
  Teams · departments · multi-business · multi-machine coordination
```

Phase 3 in the [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md) ("Build the Company") **includes** Organization Platform capabilities; Knowledge Platform is the **memory and knowledge substrate** that Phase 3 departments require. Both names describe the same arc from different angles — OS → Intelligence → Knowledge → Organization.

---

## Build order (Memory arc)

```txt
Phase 2 (after 026):
  Mission Stack + MCP
  Domain-scoped recall v1 (Executive + Workspace)
  Memory Confidence on CoS responses
  Executive Context Window (basic)

Phase 3:
  Full Memory OS domain map
  Historical + Reference memory integration
  Context Efficiency Score
  Learning loop → Mission Memory → predictive recall
```

**Prerequisites:** Digital Asset Registry · Decision Ledger (binding) · Memory Domains v1 · Mission Stack · EQ registry.

---

## Contracts (planned)

```txt
MemoryRecallPlan {
  plan_id
  mission_ids[]
  question_id
  domains[]              — executive · workspace · relationship · …
  queries[]              — scoped retrieval specs
  max_bytes
  provenance_required    — true
}

MemoryConfidenceReport {
  confidence_percent     — 0–100
  domains_consulted[]
  gaps[]                 — "no recent decisions on OAuth"
  suggested_scans[]      — paths or sources to index
}

ExecutiveContextWindow {
  mission_label
  workspace_ids[]
  decision_count
  document_count
  conversation_count
  asset_count
  relationship_labels[]
  estimated_bytes
  source_refs[]          — drill-down
}
```

---

## Honesty rules

- Memory Confidence is computed from **retrieval coverage**, not LLM self-report
- Low confidence → propose action (scan, index, link workspace) — never bluff
- Context Window lists **actual sources** retrieved, not inferred
- Context Efficiency estimates labeled as estimates when heuristic

---

## Related docs

| Doc | Role |
| --- | ---- |
| [Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) | Foundational six-domain model |
| [Memory Recall Architecture](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md) | Layered pipeline |
| [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) | Binding decisions · Historical Memory source |
| [Executive Mission Stack](./LOCALBRAIN_EXECUTIVE_INTENT.md) | Mission-scoped recall filter |
| [Knowledge Sources](./LOCALBRAIN_KNOWLEDGE_SOURCES.md) | Ingestion into Reference Memory |

---

*Executive Memory OS · ENG-MEM-001 · Phase 2–3 cornerstone · 2026-06-29*
