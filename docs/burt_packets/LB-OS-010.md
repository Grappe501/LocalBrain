# BURT / CURSOR EXECUTION SCRIPT

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


**Project:** LocalBrain  
**Slice:** LB-OS-010  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-003, LB-OS-009  

---

## Mission

**Approval-gated file management** — AI proposes, user approves, backend executes with backup + quarantine.

---

## Hard boundaries

```txt
No silent writes · no permanent deletes
Dry-run before batch execution
Permission engine before every path
Backup before edit/move/quarantine
Quarantine-only delete · restore required
```

---

## Exit criteria

```txt
[x] proposed_actions + action_log + backup_records
[x] create/edit/move/quarantine proposals with diff preview
[x] approve → dry-run → execute workflow
[x] restore from backup
[x] Actions UI at /actions
[x] npm run check && npm run test pass
```

---

## Commit

`feat: add approval-gated file management and quarantine`

---

*LB-OS-010 · Approval-Gated File Management · ✅ Complete*
