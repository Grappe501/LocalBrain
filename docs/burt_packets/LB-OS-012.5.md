# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Slice:** LB-OS-012.5  
**Status:** 📋 SPEC LOCKED — build after or parallel to LB-OS-012  
**Depends on:** LB-OS-011, LB-OS-010.5, LB-OS-106  
**Authoritative spec:** [Executive Program Office](../LOCALBRAIN_EXECUTIVE_PROGRAM_OFFICE.md)

---

## Mission

**Executive Program Office (EPO)** — mission control for the entire LocalBrain build. Executive Office core feature. **Not** Engineering Department.

---

## Hard boundaries

```txt
Read-only v1 — no editable checklist, no auto-execution
Aggregate from checklist, docs/, git, APIs
CoS explains blockers — not static "Not Started"
```

---

## Build checklist

```txt
[ ] Route /executive/program (or /program-office)
[ ] Executive Office nav: Briefing · Program Office · System Health · …
[ ] Dashboard strip: progress, phase, current/next slice, health scores
[ ] Phase navigator with drill-down
[ ] Slice detail pages (LB-OS-###)
[ ] Build dependency graph
[ ] Documentation library (searchable docs/)
[ ] Decision timeline (bootstrap)
[ ] Live metrics panel
[ ] Documentation coverage bars per slice
[ ] "Why aren't we here yet?" CoS intent
[ ] GET /api/epo/overview · /slices · /docs
```

---

## Commit (when complete)

`feat: add Executive Program Office mission control`

---

*LB-OS-012.5 · Executive Program Office · Spec locked · ⬜ Not started*
