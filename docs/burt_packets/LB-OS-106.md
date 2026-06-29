# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Slice:** LB-OS-106  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-004 ✅  
**Blocks:** LB-OS-005+ Explorer · LB-OS-011+ all department modules

---

## Mission

**MODULARITY GATE** — prove the kernel stays thin, departments register by manifest, routes lazy-load, and foundational objects are reused — not expanded.

---

## Exit criteria (must all pass)

```txt
[ ] backend/src/core/ vs engines/ vs modules/ layout in repo
[ ] Module manifest schema in shared/
[ ] Module loader registers stubs; lazy route load on nav
[ ] Shell nav reads manifests — not hard-coded studio list
[ ] Capabilities declare dependencies in every seed manifest
[ ] Agents, tools, data_sources scoped per manifest
[ ] No domain logic in permissionEngine or commandRouter
[ ] LB-OS-005+ blocked without manifest registration
```

---

## What shipped

```txt
shared/src/moduleManifest.ts     — schema + validateModuleRegistry
backend/src/core/moduleLoader.ts — load JSON manifests at boot
backend/src/modules/manifests/   — 7 department stubs
GET /api/modules                 — registry API
frontend ModuleRegistryProvider  — manifest-driven nav + lazy ModuleStubPage
```

---

## Commit

`feat: add core kernel boundaries and module loader stub`

**Next:** LB-OS-005 Explorer tree + file metadata

---

*LB-OS-106 · MODULARITY GATE · 2026-06-28*
