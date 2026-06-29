# LB-OS-024 — Migration Planning Engine

> **Depends on:** LB-OS-023 ✅  
> **Spec:** [Migration Plan](../LOCALBRAIN_MIGRATION_PLAN.md) · [Proof & Certification](../LOCALBRAIN_PROOF_AND_CERTIFICATION.md)  
> **Next:** LB-OS-025 Executive Approval

---

## Goal

Generate **Migration Plans** from certified proof — not proposals.

```txt
Certificate → Plan (sequence + rollback + dependency graph)
Core rule: If we execute this, what exactly happens?
```

---

## Five Gates

| Gate | Answer |
| ---- | ------ |
| System | Executive OS |
| Object | ProofCertificate → MigrationPlan |
| Module | Migration / planning |
| EQ | EQ-014 |
| Leverage | Executable clarity before approval |

---

## Build

```txt
shared/     MigrationPlan · operations · dependency graph · PlanDiff
backend/    Plan generator from certificate · rollback plan · diff engine
frontend/   Plan viewer · dependency graph · plan diff UI
```

---

## Deliverables

```txt
PLAN-* ids · dependency-ordered operations
Rollback plan embedded in plan (not on proposal)
Plan diff (operations · bytes · duration)
Requires certified certificate — plan_eligible gate
```

---

## Guardrails

```txt
Read-only planning · No approval · No execution · No proposals in 024
Deterministic operation sequencing from blueprint + simulation
No LLM operation invention
```

---

## Exit criteria

```txt
[ ] Plan generated only from certified certificates
[ ] Dependency graph + rollback plan on every plan
[ ] Plan diff API between two plans
[ ] Zero filesystem mutations
```

---

**Commit:** `feat: add Migration Planning Engine`

---

*Burt packet · LB-OS-024 · Planning not Proposal*
