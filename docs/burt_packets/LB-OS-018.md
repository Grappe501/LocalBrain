# LB-OS-018 — Drive Architecture & Migration Planner

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


> **Type:** Migration phase entry — **read-only planning**  
> **Depends on:** LB-OS-017  
> **Doctrine:** [Migration & Drive Doctrine](../LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md)

---

## Goal

C:/H: doctrine dashboard, placement audit, migration plan preview, structure proposal, archive draft, risk levels, and approval checklist — **zero file mutations**.

---

## Guardrails

```txt
Read-only planning · No file moves · No deletes · No cleanup execution
No drive reorganization · No cloud sync · No Google Drive · No bulk operations
```

---

## Core rule

```txt
Inventory → Map → Diagnosis → Recommendations → Approval checklist → later action
```

---

## Build map

### Shared

- `shared/src/migrationPlanner.ts`

### Backend

```txt
backend/src/migration/
  driveDoctrine.ts      — C/H classification, program vs work data
  placementAudit.ts     — indexed asset + allowed-folder audit
  planGenerator.ts      — arc, structure, archive, checklist
  migrationService.ts   — overview assembler
backend/src/routes/migration.ts
```

### Permission

- `validateNewFilesystemRoot` blocks C: project roots (override: `LOCALBRAIN_ALLOW_C_PROJECT_ROOT=1`)

### Frontend

```txt
/migration — MigrationPlannerView
GET /api/migration/planner
```

---

## Exit criteria

```txt
[ ] Doctrine dashboard live
[ ] Placement audit from indexed assets (read-only)
[ ] Misplaced candidates with risk levels
[ ] Migration arc 018–026 visible
[ ] H: structure proposal + archive draft
[ ] Approval checklist generated
[ ] C: project root registration blocked without override
[ ] Zero file mutations in slice
```

---

## Commit

```txt
feat: add drive architecture and migration planner
```
