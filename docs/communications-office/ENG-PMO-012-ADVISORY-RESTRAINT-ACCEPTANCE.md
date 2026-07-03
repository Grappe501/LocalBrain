# ENG-PMO-012 — Advisory Restraint Acceptance

> **Type:** PMO acceptance ceremony — slice closeout · not implementation  
> **Status:** **COMPLETE** — 2026-07-03  
> **Prerequisite:** [ENG-COM-001.3](./slices/ENG-COM-001.3-ADVISORY-RESTRAINT.md) · [ENG-PMO-010](./ENG-PMO-010-TRACEABLE-DRAFT-ACCEPTANCE.md) · [ENG-PMO-011](./ENG-PMO-011-UNCERTAINTY-PRESERVATION-ACCEPTANCE.md) · 19/19 behavioral tests PASS  
> **Charter:** [ENG-COM-001](./ENG-COM-001-CHARTER.md)  
> **Governance:** [ENG / OPS / ENG-PMO](../memory-os/ENG-PMO-GOVERNANCE.md)

---

## PMO assessment

```text
ENG-PMO-012
ENG-COM-001.3 — Advisory Restraint
A1–A5: PASS
Behavioral tests:
19/19 PASS (5 traceability + 6 uncertainty + 7 advisory)
Disposition:
ACCEPTED
ENG-COM-001.3 COMPLETE
```

---

## Acceptance question

> **Can we demonstrate that advisory boundaries are preserved under ambiguous prompts while all inherited behavioral guarantees remain intact?**

**Answer:** **Yes.**

The implementation answers the charter directly without broadening scope.

---

## Charter criteria (A1–A5) — evidence

| # | Criterion | Verdict | Basis |
| - | --------- | ------- | ----- |
| A1 | Ambiguous prompts do not produce policy statements | **PASS** | Engineering implementation frozen; advisory restraint test suite passing (7/7) |
| A2 | Ambiguous prompts do not produce recommendations or prioritization | **PASS** | Behavioral test — recommendation violation rejected under prioritization prompt |
| A3 | Pressuring prompts do not collapse the advisory boundary | **PASS** | Behavioral test — `A3_PRESSURE_BOUNDARY_COLLAPSE` under pressuring prompt |
| A4 | Decision-making requests withheld or bounded — not fabricated as authority | **PASS** | Withhold path + fabricated authority rejection tests |
| A5 | Inherited traceability (C1–C5) and uncertainty (U1–U5) hold through composed validation | **PASS** | Composed pipeline test under adversarial request; inherited violation guards unchanged |

**Additional review criteria:**

| Criterion | Verdict | Basis |
| --------- | ------- | ----- |
| Inherited capabilities preserved | **PASS** | Traceability (C1–C5) and uncertainty preservation (U1–U5) remain inherited and were not reopened |
| Behavior isolated | **PASS** | Advisory restraint implemented as a composed validator after inherited validators; existing validators unchanged |
| Test isolation | **PASS** | Earlier A4 issue traced to fixture epistemic metadata affecting the uncertainty validator; corrected so advisory restraint is evaluated independently |
| Implementation discipline | **PASS** | Slice frozen after evidence was obtained; no scope expansion beyond the authorized behavioral question |

**Gate question:** Is any criterion only partially satisfied? **No.**

**Authoritative test commands (isolated):**

```bash
cd shared && npm run build
cd backend && node --import tsx --test src/communicationsOffice/communicationsDraft.test.ts
cd backend && node --import tsx --test src/communicationsOffice/communicationsDraftUncertainty.test.ts
cd backend && node --import tsx --test src/communicationsOffice/communicationsDraftAdvisoryRestraint.test.ts
```

**Expected:** 5/5 + 6/6 + 7/7 PASS

---

## Composed pipeline (held constant)

```text
Proposal
      ↓
Traceability Validator      (ENG-COM-001.1 · inherited · unchanged)
      ↓
Uncertainty Validator       (ENG-COM-001.2 · inherited · unchanged)
      ↓
Advisory Restraint Validator (ENG-COM-001.3 · new)
      ↓
Assembler
```

Traceability and uncertainty validators were **not modified** for this crossing.

---

## Scope discipline (evidence of restraint)

This slice did **not** attempt to prove:

* writing quality · tone · persuasiveness · provider comparison
* connectors · publishing · workflow · UI · campaign logic
* module completion · Commercial Beta readiness

Engineering stopped at evidence freeze. No further implementation commits belong to this slice.

---

## What this acceptance promotes

Disposition **ACCEPT** promotes exactly one capability:

> **Advisory restraint becomes an inherited behavioral guarantee** — composable after traceability and uncertainty, not replacing them.

The inherited Communications capability stack is now:

* Deterministic interfaces
* Evidence Package Contract
* Work Product Contract
* Traceability
* Uncertainty preservation
* **Advisory restraint**

This acceptance does **not**:

* establish Communications Office module completion
* authorize Commercial Beta
* reopen traceability or uncertainty evaluation

---

## Repository state after PMO-012

```text
Engineering
    COMPLETE (ENG-COM-001.3)
PMO
    ENG-PMO-012 ACCEPTED
Inherited capability
    Advisory restraint
Next authority
    Communications Office module evaluation
```

---

## After acceptance (not in this ceremony)

```text
Slice accepted (ENG-COM-001.3 COMPLETE)
      ↓
[ENG-PMO-013](./ENG-PMO-013-COMMUNICATIONS-OFFICE-MODULE-EVALUATION.md) Module Evaluation
      ↓
Release governance (Commercial Beta)
```

Module evaluation asks a **different** question:

> **Has the Communications Office earned completion as a V1 subsystem?**

---

*ENG-PMO-012 · ENG-COM-001.3 · Advisory Restraint · COMPLETE · LocalBrain V1 · 2026*
