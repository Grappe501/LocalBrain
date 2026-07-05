# CONTACT-V3-018 — Implementation Package v1.0

> **Type:** Implementation specification (clone V3-016.1 + V3-016 + V3-017 reference patterns)  
> **Status:** **COMPLETE** · ✅ Certified 2026-07-05  
> **Slice contract:** [CONTACT-V3-018](./CONTACT-V3-018-HOUSEHOLD-FAMILY-RELATIONSHIPS.md)  
> **Templates:** Context · Stewardship · Action 🏆 Reference Pattern Certified  

---

## Build increments

| ID | Deliverable | Status |
| -- | ----------- | ------ |
| IMPLEMENT-018-001 | Shared contract + migration | ✅ Complete |
| IMPLEMENT-018-002 | Validator + RBAC | ✅ Complete |
| IMPLEMENT-018-003 | Repository + append-only history | ✅ Complete |
| IMPLEMENT-018-004 | Compute layer (size, voters, health) | ✅ Complete |
| IMPLEMENT-018-005 | API endpoints + search/lookup | ✅ Complete |
| IMPLEMENT-018-006 | React household panel + profile stack | ✅ Complete |
| IMPLEMENT-018-007 | Targeted tests | ✅ Complete (2/2 pass) |
| IMPLEMENT-018-008 | Validation note + review package | ✅ Certified 2026-07-05 |

---

## Targeted tests

```bash
cd backend && node --import tsx --test src/contacts/contactHousehold.test.ts
```

---

## Acceptance criteria

- [x] Household entity + member links (canonical contacts only — **group, don't duplicate**)
- [x] Merge, split, primary residence transfer
- [x] Append-only household history
- [x] Computed metrics (size, adults, minors, voters, volunteers, strength, health)
- [x] Integration references Stewardship, Context, Action (no duplicate state)
- [x] Household search (name, address, member)
- [x] Contact → household and household → contacts lookup
- [x] Profile stack: Stewardship → Household → Context → Actions
- [x] Targeted tests pass (2/2)
- [x] Governance review (2026-07-05)

---

*CONTACT-V3-018 Implementation Package v1.0 · LocalBrain · 2026*
