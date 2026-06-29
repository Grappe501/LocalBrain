# Phase 1 Integration Pass

> **Slice:** LB-OS-020.5  
> **Depends on:** LB-OS-020 (Consolidation Planner — first Executive Intelligence)  
> **Precedes:** LB-OS-021–026 (migration arc completion)  
> **Parent:** [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md) · [Constitution](./LOCALBRAIN_CONSTITUTION.md)

---

## Purpose

After LB-OS-020 ships, **pause feature expansion** for one short sprint. The objective is **not** new capabilities — it is making everything already built feel like **one cohesive Executive Operating System**.

Standalone excellent components ≠ an Executive OS. Integration eliminates friction and compounds day-to-day value faster than several additional features.

```txt
020 = first reasoning slice
020.5 = first cohesion slice
021–026 = migration completion on a unified shell
```

---

## Success question

> **Does the system feel like one product, or a collection of modules?**

---

## Integration checklist (binding targets)

| Integration | Target |
| ----------- | ------ |
| **Departments ↔ workspaces** | Every department links naturally to related Living Workspaces |
| **Workspaces ↔ assets** | Every workspace surfaces relevant digital assets |
| **Assets ↔ context** | Every asset links back to workspace + related decisions |
| **Program Office ↔ data** | Every EPO metric drills into underlying build/evidence data |
| **CoS ↔ action surfaces** | Every CoS recommendation renders as EIC with deep link + Simulation available |
| **EIC adoption** | Departments with live recommendations use Executive Intelligence Card component |
| **Routes ↔ Executive Office** | Consistent look, navigation, and interaction model on priority routes |
| **Briefing ↔ scoreboards** | EPO construction · Consolidation Score · (future) System Evolution / ELS hooks visible and linked |

---

## Scope boundaries

```txt
IN:  cross-links, drill-downs, empty states, nav consistency, maturity badges audit
IN:  LiveSurfaceBanner / workspace projection gaps on priority routes
IN:  CoS recommendation → deep-link wiring where data already exists

OUT: new departments, new engines, new migration execution, cloud sync
OUT: Phase 2 intelligence (System Evolution, ELS instrumentation)
OUT: LB-OS-021+ filing, import, reorg, cutover features
```

---

## Deliverables

| # | Deliverable |
|---|-------------|
| 1 | Integration audit doc (gaps list → closed or explicitly deferred) |
| 2 | Cross-link pass: workspace ↔ asset ↔ decision on priority entities |
| 3 | EPO metric drill-downs where stubbed |
| 4 | CoS → route deep links for open recommendations |
| 5 | Executive shell consistency pass (priority routes from ENG-SRF-001 registry) |
| 6 | Smoke / integration tests for critical navigation paths |

---

## Exit criteria

```txt
[ ] Integration audit complete — no orphan priority routes without cross-links plan
[ ] Department pages link to related workspaces (where registry data exists)
[ ] Workspace detail surfaces linked assets
[ ] Asset detail links workspace + decisions (when present)
[ ] EPO panels drill to source (build state, consolidation score, health)
[ ] CoS recommendations include actionable deep links
[ ] Priority routes pass Live Surface audit + consistent Executive Office chrome
[ ] PHASE_CHECKLIST gate updated — 021 unblocked
```

**Commit:** `fix: phase 1 integration pass — executive OS cohesion`

---

## Slice ordering (binding)

```txt
LB-OS-020  → Consolidation Planner (Executive Intelligence)
LB-OS-020.5 → Phase 1 Integration Pass (this doc)
LB-OS-021–026 → Migration arc · Personal OS launch
```

---

*Phase 1 Integration Pass · LB-OS-020.5 · 2026-06-29*
