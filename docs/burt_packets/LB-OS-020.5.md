# LB-OS-020.5 — Phase 1 Integration Pass

> **Depends on:** LB-OS-020  
> **Spec:** [Phase 1 Integration Pass](../LOCALBRAIN_PHASE1_INTEGRATION_PASS.md)  
> **Next:** LB-OS-021

---

## Goal

One cohesion sprint — **no new features**. Make the Executive OS feel like **one product**: cross-links, drill-downs, CoS deep links, EPO metric sources, consistent shell on priority routes.

---

## Checklist

```txt
[ ] Run integration audit — list gaps from spec checklist
[ ] Workspace ↔ asset ↔ decision cross-links on live data
[ ] Department → related workspace links
[ ] EPO metrics drill to underlying data (build state, consolidation, health)
[ ] CoS recommendations → actionable route deep links
[ ] Priority routes: Executive Office chrome + LiveSurfaceBanner consistency
[ ] Close or defer every audit gap with note in checklist
[ ] Smoke tests for critical navigation paths
```

---

## Do not build

- LB-OS-021+ migration features
- New departments or engines
- System Evolution / ELS (Phase 2)
- Auto-consolidation or file mutations

---

## Commit

```txt
fix: phase 1 integration pass — executive OS cohesion
```
