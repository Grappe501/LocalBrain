# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Slice:** LB-OS-012  
**Status:** 📋 SPEC LOCKED — ready for implementation  
**Depends on:** LB-OS-010, LB-OS-010.5, LB-OS-011, LB-OS-106  
**Authoritative spec:** [Engineering Department](../LOCALBRAIN_ENGINEERING_DEPARTMENT.md)

---

## Mission

Build the **Engineering Department** — not a code editor. **Code Studio** is one workspace inside it.

---

## Rename rule

```txt
Internal name:  Engineering Department
Workspace name: Code Studio (one tab inside department)
Route:          /studio/engineering/*
Chief:          engineering_chief
```

---

## Hard boundaries

```txt
Read-only where not explicitly approved
No shell · no git writes · no auto-execution
Burt packets: generate → preview → approve → export only
OJT hooks: optional stubs (full teach mode later)
```

---

## Build checklist

```txt
[ ] Engineering Department view (dashboard + workspace panels)
[ ] Engineering Chief — Explain this project
[ ] Engineering Score stub (9 factors, weighted)
[ ] Code Studio workspace tab (repo read context, not IDE)
[ ] Burt packet: generate + preview + export proposal
[ ] GET /api/engineering/overview
[ ] GET /api/engineering/explain?workspace_id=
[ ] GET /api/engineering/score
[ ] Module manifest: engineering-studio updated
[ ] npm run check && npm run test pass
```

---

## Explain this project — response sections

```txt
Mission · Architecture · Health · Current sprint
Major risks · Dependencies · Open decisions
Technical debt · Recommended next step
```

Each recommendation: What / Why / Confidence / If approved.

---

## Specialists (stub registry in 012)

```txt
architecture · code_generation · code_review · testing
documentation · security · performance · deployment
database · devops · build_planning · burt_script_writer
```

Routing table only in 012 — full agent behavior in later slices.

---

## Commit (when complete)

`feat: add Engineering Department foundation`

---

*LB-OS-012 · Engineering Department · Spec locked · ⬜ Not started*
