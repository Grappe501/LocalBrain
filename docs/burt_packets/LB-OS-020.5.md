# LB-OS-020.5 — Phase 1 Integration Pass

> **LOCALBRAIN V1 ROADMAP** · Architecture FROZEN · Implementation mode
>
> ```txt
> □ Executive Office Certification
> □ Session 4
> □ Session 5
> □ Theory Freeze
> □ Convention
> □ Empty Brain Factory
> □ Memory OS
> □ Communications Office
> □ Commercial Beta
>
> Everything else → VERSION2_BACKLOG.md
> ```


> **Depends on:** LB-OS-020  
> **Spec:** [Phase 1 Integration Pass](../LOCALBRAIN_PHASE1_INTEGRATION_PASS.md) · [Executive Question Registry](../LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md)  
> **Next:** LB-OS-021 (only after metric gate passes)

---

## Goal

**Every Executive Question has exactly one authoritative answer.**

Measurable cohesion sprint — no new features. Wire [Question Registry](../LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md), eliminate duplicate summaries, spread EIC, 100% shell consistency.

---

## Binding metrics (audit before → after)

| Metric | Target |
| ------ | ------ |
| Cross-route links | 90+ |
| Orphan priority pages | 0 |
| Duplicate executive summaries | 0 |
| EIC on executive surfaces | All with recommendations |
| Shell consistency | 100% priority routes |

---

## Checklist

```txt
[ ] Run integration audit — record baseline metrics
[ ] Implement questionRegistry.ts + shared types (optional)
[ ] Map every priority route to EQ-* — resolve duplicates
[ ] Workspace ↔ asset ↔ decision cross-links
[ ] EPO drills build data only · System owns machine health · Briefing links not duplicates
[ ] CoS recommendations → primary_route deep links
[ ] EIC on all executive recommendation surfaces
[ ] LiveSurfaceBanner + crumbs on 100% priority routes
[ ] Final audit — all targets met
[ ] Do NOT start LB-OS-021 until gate passes
```

---

## Do not build

- LB-OS-021+ migration features
- New departments or engines
- Full System Evolution / ELS (Phase 2)
- File mutations

---

## Commit

```txt
fix: phase 1 integration pass — executive question registry and cohesion
```
