# CONTACT-V3-018 — Household & Family Relationships

> **Type:** Contact Management v3 feature slice  
> **Status:** **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
> **Contract:** `CONTACT-V3-018`  
> **Predecessor:** [CONTACT-V3-017 — Smart Tasks](./CONTACT-V3-017-SMART-TASKS-FOLLOW-UP-QUEUE.md)  
> **Roadmap:** [Contact Management v3](./CONTACT-V3-README.md)

---

## Purpose

Model households and family links so campaigns understand who lives together, who influences whom, and how to reach networks without duplicate outreach.

---

## Behavioral question

> Can staff see household structure and avoid treating family members as unrelated strangers?

---

## Scope

- Household entity + member links (**group, don't duplicate** — contacts remain canonical)
- Primary residence per household
- Member relationships (spouse, parent, influences, etc.)
- Merge, split, transfer primary residence
- Computed household metrics (reference Stewardship, Context, Action)
- Household search and lookup
- Household panel on contact profile (below Relationship Intelligence)

---

## Validation (when implemented)

```bash
cd backend && node --import tsx --test src/contacts/contactHousehold.test.ts
npm run typecheck
npm run build
```

---

## Governance review (2026-07-05)

| Decision | Result |
| -------- | ------ |
| Implementation Status | ✅ **APPROVE** |
| Pattern Status | 🏆 **REFERENCE PATTERN CERTIFIED** |

**Certification statement:** Implement future grouping and affiliation engines by cloning conventions from **V3-016.1**, **V3-016**, **V3-017**, and **V3-018**.

**Implementation principles certified:**
- **Promote, don't duplicate** — elevate existing concepts instead of parallel state.
- **Reference, don't replicate** — derived systems compose data from authoritative engines.
- **Group, don't duplicate** — groups are relationship containers around canonical contacts, not alternative identity records.

**Inherited pattern (unless ADR documents deviation):** shared contracts · version constants · validator · repository history · append-only audit · RBAC · compute layer for derived metrics · API conventions · focused UI panels · targeted serial tests.

---

*CONTACT-V3-018 · LocalBrain · 2026*
