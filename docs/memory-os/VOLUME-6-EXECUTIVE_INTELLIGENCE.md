# Volume 6 — Executive Intelligence

> **Milestone:** MEM-006  
> **Status:** Draft — **MAR-1 reviewed**  
> **Glossary:** [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md)  
> **Principle:** Memory records what happened. Intelligence interprets what happened. Policy decides what should happen.

---

## Success test (binding)

> **Could Executive Intelligence produce recommendations and plans while leaving memory records unchanged and fully auditable?**

---

## Boundary (binding)

> **Intelligence interprets what happened. Memory records what happened.**

Executive Intelligence **uses** memory — it is not a memory store.

| Intelligence may | Intelligence may not |
| ---------------- | -------------------- |
| Read via recall API | Write memory directly |
| Propose captures | Bypass capture gate |
| Surface contradictions | Resolve by deleting memory |
| Generate plans | Store plans as memory without pipeline |
| Recommend actions | Execute without policy approval |

---

## Layer placement

```txt
Memory OS (Vol 1–5)
    ↓ recall API
Executive Intelligence (this volume)
    ↓ proposals
Policy / Governance (Vol 7)
    ↓ approved actions
Executive Office / CoS
```

---

## Capabilities

### Planning

| Input | Output |
| ----- | ------ |
| Active goals + memory context | Plan proposal with cited memories |
| Constraints from policy | Bounded plan — not executable until approved |

Plans are **proposals** — persisted as decisions only after human or policy approval.

### Prioritization

Ranks executive attention using:

- Goal alignment (graph traversal)
- Urgency signals (temporal + operational memory)
- Memory confidence weights
- Outstanding decisions

Prioritization output is ephemeral synthesis — pointers to memories, not new memory.

### Prediction

Forecasts outcomes from historical patterns:

- Explicitly labeled **interpretive** — not verified memory
- Must cite supporting memory refs
- Confidence separate from memory trust

Predictions become beliefs ([Epistemology Convention](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md)) — not facts.

### Recommendations

```txt
Recall context → Reasoning → Recommendation + evidence chain + confidence
```

Every recommendation carries [S4 provenance](../convention/CONVENTION-S4-PROVENANCE_CONTRACT.md) — "Why?" answerable deterministically.

### Strategy

Long-horizon synthesis across goals, relationships, and institutional memory:

- Strategy documents are **derived artifacts** — stored via capture pipeline if persisted
- Living strategy = graph of goals + supporting memories — not hidden state

### Context reconstruction

Rebuilds "what the executive knew at time T" using:

- Temporal index
- Snapshot API ([Vol 3](./VOLUME-3-MEMORY_ENGINE.md))
- Supersession chains

Used for decision review — not for rewriting history.

### Institutional continuity

Ensures new executives or sessions inherit institutional context:

- Recall institutional memory (not personal sovereign)
- Onboard via Executive Discovery — not Factory reinstall
- Continuity report cites memory refs — not narrative without evidence

---

## Modularity rules

| Rule | Rationale |
| ---- | --------- |
| Intelligence engines are stateless over memory | Memory is single source of truth |
| No hidden state between sessions | All persistence through Memory OS |
| Belief revision ≠ memory edit | Epistemology separation |
| CoS is a consumer | Not a memory layer |
| Department agents consume scoped recall | Not full graph by default |

---

## Integration points

| Consumer | API |
| -------- | --- |
| Chief of Staff | `recall(intent)` → context window |
| Executive Office | Goal + decision context |
| Department agents | Scoped `recall(department, intent)` |
| Planning engine | `recall(goals)` + graph traversal |
| Communications | Capture proposals from outbound actions |

---

## Factory compatibility

Intelligence operates on **post-install** institution only:

- No intelligence code in Factory
- No intelligence state in birth certificate
- First intelligence run after Executive Discovery + Memory OS bootstrap

---

*Volume 6 · Executive Intelligence · MEM-006*
