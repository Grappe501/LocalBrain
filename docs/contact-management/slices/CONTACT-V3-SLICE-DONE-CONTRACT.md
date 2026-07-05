# CONTACT-V3 — Slice Done Contract

> **Applies to:** Every `CONTACT-V3-NNN` implementation slice  
> **Gates:** [Four gates](./CONTACT-V3-DECISION-RECORDS.md#slice-acceptance--four-gates) · [Implementation cadence](./CONTACT-V3-IMPLEMENTATION-GUIDE.md)  
> **Reference:** First slice completed against this checklist: [CONTACT-V3-016.1](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md)

A slice is **complete** only when every item below is checked. Uniform definition of done across Contact Management v3.

---

## CONTACT-V3 Slice Complete

```
□ Constitution gate passed
□ Architecture gate passed
□ Lifecycle gate passed (if journey stage involved)
□ Evidence gate passed
□ ADR impact reviewed (new ADR added if significant decision made)
□ Data model complete
□ API complete
□ UI complete
□ Permissions complete
□ Audit trail complete (append-only where required)
□ Tests pass — unit
□ Tests pass — repository
□ Tests pass — service
□ Tests pass — API
□ Tests pass — permissions
□ Tests pass — targeted slice validation (isolated command)
□ Documentation updated (slice doc + validation note)
□ Migration reviewed
□ No orphan TODOs in slice scope
□ Pattern conformity (required after Reference Pattern Certified)
```

---

## Gate definitions

### Constitution gate

Slice upholds [Relationship Doctrine](./CONTACT-V3-CONSTITUTION.md): relationships are the product, evidence before inference, humans decide, append-only history, explainability.

### Architecture gate

All new capability maps to **one** of the seven engines. No orphan fields. No parallel progression vocabulary.

### Lifecycle gate

If the slice touches journey position: uses [V3-000](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) vocabulary; no auto-promote unless explicitly approved later.

### Evidence gate

Computed outputs and advisory copy cite timeline/context/stewardship/lifecycle evidence. Behavior is auditable.

### ADR impact reviewed

Significant boundary or vocabulary decisions during implementation → append [ADR](./CONTACT-V3-DECISION-RECORDS.md). Foundation doc changes → architecture review required ([ADR-006](./CONTACT-V3-DECISION-RECORDS.md#adr-006-foundation-documents-protected-during-implementation)).

---

## Test layers (reference — established by V3-016.1)

| Layer | Scope |
| ----- | ----- |
| **Unit** | Pure validators, serializers, domain rules |
| **Repository** | SQLite persistence, migrations |
| **Service** | Business logic, merge, filter, history |
| **API** | Routes, request/response contract |
| **Permissions** | Role headers / access matrix |
| **Targeted validation** | `node --import tsx --test src/contacts/<slice>.test.ts` |

UI smoke or component tests when UI is in slice scope.

---

## Validation note template

Record in slice doc when complete:

```md
## Validation Note
- Command: `cd backend && node --import tsx --test src/contacts/<file>.test.ts`
- Result: N/N passed
- Operator validation: [summary or link to evidence]
- Done contract: all items checked [date]
```

---

*CONTACT-V3 Slice Done Contract · LocalBrain · 2026*
