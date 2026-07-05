# CONTACT-V3-019 — Organization & Affiliation Mapping

> **Type:** Contact Management v3 feature slice  
> **Status:** **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
> **Contract:** `CONTACT-V3-019`  
> **Predecessor:** [CONTACT-V3-018 — Household & Family](./CONTACT-V3-018-HOUSEHOLD-FAMILY-RELATIONSHIPS.md)  
> **Roadmap:** [Contact Management v3](./CONTACT-V3-README.md)

---

## Purpose

Extend V1 organization affiliations into a campaign-ready map: boards, employers, churches, unions, PACs, and community groups — with roles and influence context.

---

## Behavioral question

> Can organizers see which institutions a contact touches and route outreach through the right network?

---

## Scope

- Rich org graph beyond ENG-CONTACT-001.2 basic links (**belong, don't flatten**)
- Role labels, tenure, membership status, categories
- Org-centric views and contact ↔ organization lookup
- Computed metrics referencing Stewardship, Context, Action, Household
- Organization panel on contact profile (below Relationship Intelligence)

*Builds on frozen* ENG-CONTACT-001.2 *organization storage.*

---

## Validation (when implemented)

```bash
cd backend && node --import tsx --test src/contacts/contactOrganization.test.ts
npm run typecheck
npm run build
```

---

## Governance review (2026-07-05)

| Decision | Result |
| -------- | ------ |
| Implementation Status | ✅ **APPROVE** |
| Pattern Status | 🏆 **REFERENCE PATTERN CERTIFIED** |

**Certification statement:** Clone implementation conventions from **V3-016.1**, **V3-016**, **V3-017**, **V3-018**, and **V3-019** for future affiliation-oriented engines.

**Implementation principles certified:**
- **Promote, don't duplicate** — elevate existing concepts instead of parallel state.
- **Reference, don't replicate** — derived systems compose data from authoritative engines.
- **Group, don't duplicate** — groups are relationship containers around canonical contacts.
- **Belong, don't flatten** — affiliations are explicit structures with roles, history, and status.

**Inherited pattern (unless ADR documents deviation):** shared contracts · version constants · validator · repository history · append-only audit · RBAC · compute layer for derived metrics · API conventions · focused UI panels · targeted serial tests.

---

*CONTACT-V3-019 · LocalBrain · 2026*
