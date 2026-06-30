# V1 Module Review Template

> **Phase 2 rule:** Ask Burt to **review this module** — not *what should we build next?*

---

## Review template

Copy into every module review request:

```txt
Module:
Purpose:
Acceptance Criteria:
Tests:
Kelly Sandbox Result:
Performance:
Security:
UX:
Launch Ready?
PASS / NEEDS WORK
```

---

## Certification dimensions (Program Office)

Every V1 module is tracked on six dimensions:

| Dimension | Meaning |
| --------- | ------- |
| Navigation | Routes coherent · no orphans · graph integrity |
| Experience | Executive experience certification |
| Tests | Module test suite green |
| Security | Vault · credentials · no prod leakage |
| Kelly Sandbox | Golden integration test — *Does this work correctly against Kelly Sandbox?* |
| Launch | **CERTIFIED** only when all dimensions PASS |

Status values: `PASS` · `NEEDS WORK` · `PENDING` · `N/A`

---

## Verdict rules

| Verdict | When |
| ------- | ---- |
| **PASS** | All dimensions PASS · Kelly Sandbox PASS · ready for next roadmap step |
| **NEEDS WORK** | Any dimension failing · fix before moving on |

No module advances on the critical path without an honest review.

---

## Burt packet header

Every execution packet includes:

```txt
Burt mission: Finish the current module.
Review: Use LOCALBRAIN_V1_MODULE_REVIEW.md template.
```

---

## Current module

See live certification card at `/program-office` (CEO Mode).

API: `GET /api/epo/project-state` → `ceo_mode.current_module_certification`

---

## Related

* [LOCALBRAIN_V1_CONSTRUCTION_PHASE.md](./LOCALBRAIN_V1_CONSTRUCTION_PHASE.md)
* [LOCALBRAIN_V1_LAUNCH_CRITERIA.md](./LOCALBRAIN_V1_LAUNCH_CRITERIA.md)
