# Executive Leverage Score (ELS)

> **Engine:** ENG-ELS-001 (planned)  
> **Phase:** 2 — Teach the Brain (instrumentation begins; headline by Phase 2 gate)  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md) · [Effectiveness Metrics](./LOCALBRAIN_EFFECTIVENESS_METRICS.md)

---

## Principle

```txt
Wrong question:  "How many features does LocalBrain have?"
Right question:  "How much more effective am I because LocalBrain exists?"
```

The **Executive Leverage Score** is the most important number in the system — the top line of the **Executive Briefing** each morning.

**Phase 2:** ELS measures outcomes **against [Executive Intent](./LOCALBRAIN_EXECUTIVE_INTENT.md)**, not activity alone:

```txt
Intent Completed % → Leverage → Time Saved → Recommendations Accepted → Friction Removed
```

| Scoreboard | Measures |
| ---------- | -------- |
| Program Office | Build progress |
| System Evolution | Intelligence growth |
| **Executive Leverage Score** | **Real-world impact** |

---

## Definition

ELS is a composite index (0–100) of **executive effectiveness attributable to LocalBrain**, built from measurable components. It complements (and may subsume over time) the [Meaningful Work Index](./LOCALBRAIN_EFFECTIVENESS_METRICS.md) with clearer leverage framing.

---

## Component metrics (v1 model)

| Component | Weight (draft) | Source |
| --------- | -------------- | ------ |
| Hours saved | 15% | Actions log, self-report, inferred from automation |
| High-value decisions assisted | 15% | CoS recommendations accepted + outcome positive |
| Context recalled automatically | 10% | Explorer/CoS context hits without manual search |
| Manual tasks eliminated | 10% | Approval workflows completed vs would-have-been-manual |
| Writing acceleration | 10% | Draft previews, approved writing actions |
| Engineering acceleration | 10% | Burt/engineering loop time saved |
| Research acceleration | 10% | Data/query plans shortening path to answer |
| Organizational follow-through | 10% | Relationship/actions follow-ups completed |
| Cost efficiency | 5% | $ per deliverable vs baseline |
| Error reduction | 5% | Failed actions, rollbacks, permission blocks avoided |

Weights are tunable; formula must stay **inspectable** (Steve can see inputs).

---

## Surfaces

```text
Executive Briefing header     ← "ELS: 68 (↑4 this week)"  ★ primary
/system/effectiveness         ← trends + drill-down (links to ELS)
System Evolution              ← ELS delta as impact outcome of learning
Program Office                ← does NOT own ELS (construction only)
```

---

## Honesty rules

- Label estimates as estimates
- Steve can dispute/adjust inputs ([Effectiveness Metrics](./LOCALBRAIN_EFFECTIVENESS_METRICS.md) privacy rule)
- Trend over perfection — no gamification shame
- Local only until commercial packaging defines otherwise

---

## Relationship to phases

| Phase | ELS role |
| ----- | -------- |
| Phase 1 | Baseline instrumentation; ELS may be partial until world is represented |
| Phase 2 | **ELS becomes headline metric** — proves "helps you think" |
| Phase 3 | ELS includes cross-department and org-scale components |

---

## Deliverables (planned)

- [ ] `ENG-ELS-001` — leverage projection engine
- [ ] Shared types in `@localbrain/shared`
- [ ] `GET /api/effectiveness/leverage` or extend effectiveness API
- [ ] Executive Briefing header wired to ELS
- [ ] System Evolution panel: ELS month-over-month delta

**Suggested slice:** LB-OS-036 (after System Evolution LB-OS-035) or combined Phase 2 arc.

---

## North star (unchanged)

```txt
Did Steve accomplish more meaningful work this week
than he would have without LocalBrain?
```

ELS is how we **number** that answer.
