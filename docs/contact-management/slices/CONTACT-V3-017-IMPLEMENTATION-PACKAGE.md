# CONTACT-V3-017 — Implementation Package v1.0

> **Type:** Implementation specification (clone V3-016.1 + V3-016 reference patterns)  
> **Status:** **COMPLETE** · ✅ Certified 2026-07-05  
> **Slice contract:** [CONTACT-V3-017](./CONTACT-V3-017-SMART-TASKS-FOLLOW-UP-QUEUE.md)  
> **Templates:** [V3-016.1](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md) · [V3-016](./CONTACT-V3-016-RELATIONSHIP-STEWARDSHIP.md) 🏆 Reference Pattern Certified  

---

## Build increments

| ID | Deliverable | Status |
| -- | ----------- | ------ |
| IMPLEMENT-017-001 | Shared contract + migration | ✅ Complete |
| IMPLEMENT-017-002 | Validator + RBAC | ✅ Complete |
| IMPLEMENT-017-003 | Repository + append-only task history | ✅ Complete |
| IMPLEMENT-017-004 | Compute layer (unified queue, summary) | ✅ Complete |
| IMPLEMENT-017-005 | API endpoints + follow-up completion | ✅ Complete |
| IMPLEMENT-017-006 | React action panel + header badge | ✅ Complete |
| IMPLEMENT-017-007 | Targeted tests | ✅ Complete (2/2 pass) |
| IMPLEMENT-017-008 | Validation note + review package | ✅ Certified 2026-07-05 |

---

## Targeted tests

```bash
cd backend && node --import tsx --test src/contacts/contactAction.test.ts
```

---

## Acceptance criteria

- [x] Task model linked to contact + assignee
- [x] Follow-up queue integrates V3-014 timeline follow-ups (promote, don't duplicate)
- [x] Workspace queue with overdue / due today / upcoming / no due buckets
- [x] Open action count on contact header
- [x] Append-only task status history
- [x] RBAC aligned with V3-016.1 / V3-016
- [x] Targeted tests pass (2/2)
- [x] Governance review (2026-07-05)

---

*CONTACT-V3-017 Implementation Package v1.0 · LocalBrain · 2026*
