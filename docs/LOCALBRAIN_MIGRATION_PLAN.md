# Migration Plan

> **Slice:** LB-OS-024 (Planning) · **Engine:** ENG-MPL-001  
> **Depends on:** LB-OS-023 Proof Certificate  
> **Parent:** [Proof & Certification](./LOCALBRAIN_PROOF_AND_CERTIFICATION.md) · [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md)

---

## Three distinct artifacts

```txt
Proof Certificate   →  "This is safe."
Migration Plan      →  "This is the sequence."
Proposal (025)      →  "Please approve these specific actions."
```

**024 does not generate proposals from certificates directly.**

```txt
Proof Certificate
        ↓
Migration Plan
        ↓
Proposal Generator (025)
```

---

## Core rule

```txt
If we execute this, what exactly happens?
```

No approval in 024. No execution. Planning only.

---

## Example plan

```txt
PLAN-000031
Workspace:           RedDirt
Certificate:         CERT-000184
Estimated Duration:  12 minutes
Rollback Time:       4 minutes
Total Operations:    143

Execution Order (dependency graph):
  1. Create new folder structure
  2. Copy documentation        (depends on 1)
  3. Move source               (depends on 2)
  4. Update projections        (depends on 3)
  5. Validate references       (depends on 4)
  6. Finalize                  (depends on 5)
```

---

## Dependency graph (not flat list)

Operations form a **dependency graph**, not an unordered batch:

```txt
Create Folder
      ↓
Copy Docs
      ↓
Move Source
      ↓
Update Projection
      ↓
Verify
```

The same engine scales to thousands of operations (GPU migration, Drive sync, multi-machine rollout, DB upgrades).

---

## Rollback belongs to the plan

```txt
Certificate → Plan → Rollback Plan (embedded) → Proposal (025)
```

Rollback is engineering metadata on the plan — not attached to approval or proposal copy.

---

## Diffable plans

CoS and executives compare alternatives:

```txt
Plan A   143 operations · 18 GB · 12 min
Plan B    91 operations · 12 GB ·  8 min
```

Benefits:

- Plans can be regenerated without invalidating certificates
- Proposals stay small (reference `plan_id`)
- Multiple proposals can reference one plan
- One certificate can produce multiple plan variants

---

## Proposal simplicity (025)

```txt
Proposal PROP-000014
Based on PLAN-000031
Approve? YES / NO
```

Proposal does not invent operations — it references the plan.

---

## Phase 1 finish arc (reframed)

```txt
019  Audit
020  Evidence
021  Architecture
022  Survey
023  Proof
024  Planning          ← Migration Plan
025  Executive Approval ← Proposal references plan
026  Execution + Verification
```

Mirrors large-scale infrastructure change management: investigate → validate → plan → approve → execute.

---

## LB-OS-024 scope

```txt
IN:  MigrationPlan contract · dependency graph · rollback plan
IN:  Plan generation from certified certificate only
IN:  Plan diff · GET/POST plan API · planning UI
OUT: Proposals (025) · approval · execution · LLM operation invention
```

---

## API (planned)

```txt
GET  /api/migration/plans
POST /api/migration/plans/generate   { certificate_id, variant? }
GET  /api/migration/plans/:planId/diff/:otherPlanId
```

---

## Five Gates (024)

| Gate | Answer |
| ---- | ------ |
| System | Executive OS |
| Object | ProofCertificate → MigrationPlan |
| Module | Migration / planning |
| EQ | EQ-014 |
| Leverage | Executable clarity before human approval |

---

*Architecture lock · Migration Plan · ENG-MPL-001*
