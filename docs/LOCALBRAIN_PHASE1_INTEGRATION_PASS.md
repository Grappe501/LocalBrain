# Phase 1 Integration Pass

> **Slice:** LB-OS-020.5  
> **Depends on:** LB-OS-020 (Executive Consolidation Intelligence)  
> **Precedes:** LB-OS-021–026 (migration arc completion)  
> **Parent:** [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md) · [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md)

---

## Milestone context

**LB-OS-020** marks the transition from an **information system** to a **reasoning system** (Executive Intelligence Cards, Simulation, Consolidation Score).

**LB-OS-020.5** marks the transition from **features** to **Executive Questions** — one authoritative answer per question, one cohesive Executive OS.

```txt
020   = first reasoning slice
020.5 = first cohesion slice (Question Registry + measurable integration)
021–026 = migration completion on unified shell — do not rush past 020.5
```

---

## Binding objective

> **Every Executive Question has exactly one authoritative answer.**

Not three dashboards that partially overlap. See [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md).

Examples:

| Steve asks | Authoritative route | Not also |
| ---------- | ------------------- | -------- |
| What should I work on next? | `/` (Briefing) | Three partial dashboards |
| How healthy is my **system**? | `/system` | Program Office |
| How healthy is my **engineering** work? | `/studio/engineering` | System, EPO |
| What should I consolidate? | `/migration/consolidation` | Full duplicate on Briefing (summary + link only) |

---

## Success question

> **Does every Executive Question have exactly one authoritative answer?**

Secondary: Does the system feel like one product, not a collection of modules?

---

## Measurable cohesion (gate metrics)

Audit at **start** and **end** of slice. Targets are binding exit criteria.

| Metric | Target |
| ------ | ------ |
| Cross-route links | **90+** |
| Orphan pages (priority routes) | **0** |
| Duplicate executive summaries | **0** |
| EIC on executive answer surfaces | **All** (where recommendations exist) |
| Consistent shell (banner, crumbs, guardrails) | **100%** priority routes |
| Phase 1 questions with single authoritative route | **100%** per registry |

Store baseline counts in integration audit artifact (`docs/integration_audit_020.5.md` or checklist gate line).

---

## Integration checklist (binding targets)

| Integration | Target |
| ----------- | ------ |
| **Question Registry** | Every priority route maps to EQ-*; duplicates resolved |
| **Departments ↔ workspaces** | Every department links to related Living Workspaces |
| **Workspaces ↔ assets** | Every workspace surfaces relevant digital assets |
| **Assets ↔ context** | Every asset links back to workspace + decisions |
| **Program Office ↔ data** | EPO metrics drill to build/evidence data — not system health |
| **System ↔ machine** | System health owns machine/ops — not build progress |
| **CoS ↔ questions** | Recommendations deep-link to **primary_route** for that question |
| **EIC adoption** | All executive recommendation surfaces use EIC component |
| **Briefing ↔ scoreboards** | Summary + link only; full answer on authoritative route |
| **Routes ↔ Executive Office** | Consistent shell on all priority routes |

---

## Scope boundaries

```txt
IN:  Question Registry, cross-links, drill-downs, dedupe summaries, nav consistency
IN:  LiveSurfaceBanner + question subtitle on priority routes
IN:  Integration audit with before/after metrics
IN:  CoS → primary_route deep links

OUT: new departments, new engines, migration execution (021+)
OUT: System Evolution / ELS full implementation (Phase 2)
OUT: Auto-consolidation or file mutations
```

---

## Deliverables

| # | Deliverable |
|---|-------------|
| 1 | Integration audit — baseline metrics + gap list |
| 2 | [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md) wired in code (`questionRegistry.ts`) |
| 3 | Cross-link pass: workspace ↔ asset ↔ decision |
| 4 | Remove or link duplicate summaries (0 duplicates at exit) |
| 5 | EPO / System / Briefing boundary enforcement per EQ map |
| 6 | EIC spread to all executive pages with recommendations |
| 7 | Shell consistency pass (100% priority routes) |
| 8 | Smoke / integration tests for critical navigation paths |
| 9 | Final audit — all metric targets met |

---

## Exit criteria

```txt
[ ] Integration audit: baseline recorded, final meets all metric targets
[ ] Question Registry: 100% Phase 1 questions have one primary_route
[ ] 0 orphan priority routes · 0 duplicate executive summaries
[ ] 90+ cross-route links · 100% shell consistency on priority routes
[ ] EIC on all executive recommendation surfaces
[ ] CoS / Briefing link to authoritative routes (not duplicate full answers)
[ ] PHASE_CHECKLIST gate updated — 021 unblocked only after metrics pass
```

**Commit:** `fix: phase 1 integration pass — executive question registry and cohesion`

---

## Strategic note

Do **not** rush into LB-OS-021 because it is next numerically. Complete 020.5 until the system **genuinely feels like one Executive OS**. Every future department (Finance, Photography, Calendar, Gmail, CRM, GPU, multi-user) inherits this coherence.

At this maturity, **cohesion is as valuable as another capability**.

---

## Slice ordering (binding)

```txt
LB-OS-020   → Executive Intelligence (reasoning)
LB-OS-020.5 → Integration Pass (questions + cohesion) ← you are here
LB-OS-021–026 → Migration arc · Personal OS launch
```

---

*Phase 1 Integration Pass · LB-OS-020.5 · 2026-06-29*
