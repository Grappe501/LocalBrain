# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Slice:** LB-OS-011  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-010, LB-OS-010.5  

---

## Mission

**System Health & Operations Center** — read-only observe/display with always-on status dock.

---

## Hard boundaries

```txt
Read-only · no process killing · no cleanup · no auto-optimization
Observe · display · log (command_log for AI usage)
```

---

## Exit criteria

```txt
[x] GET /api/system/health · GET /api/system/usage
[x] SystemStatusDock (bottom-right, expandable → /system)
[x] Machine · Storage · AI · Operations panels
[x] Operational Health Score stub
[x] npm run check && npm run test pass
```

---

## Commit

`feat: add system health monitor and status dock`

---

*LB-OS-011 · System Health & Operations Center · ✅ Complete*
