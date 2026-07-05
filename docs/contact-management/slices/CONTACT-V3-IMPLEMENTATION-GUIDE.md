# CONTACT-V3-IMPLEMENTATION-GUIDE

> **Status:** Active · post-foundation · 2026-07-05  
> **Foundation (frozen):** [Constitution](./CONTACT-V3-CONSTITUTION.md) · [ADR](./CONTACT-V3-DECISION-RECORDS.md) · [Architecture](./CONTACT-V3-ARCHITECTURE.md) · [V3-000 Lifecycle](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md)  
> **Review:** [Technical review guide](./CONTACT-V3-TECHNICAL-REVIEW.md)  
> **Completion checklist:** [Slice Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md)  
> **Execution protocol:** [Implementation Execution Protocol v1.0](./CONTACT-V3-IMPLEMENTATION-EXECUTION-PROTOCOL.md)  
> **Reference slice:** [CONTACT-V3-016.1 — Context Engine](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md)

---

## Stop designing. Start validating.

The architectural foundation is **complete** (v1.0, immutable). Objective: **prove the architecture in software** — not improve it.

See [Implementation Execution Protocol v1.0](./CONTACT-V3-IMPLEMENTATION-EXECUTION-PROTOCOL.md) for standing build authority and anti-deadlock rules.

See [Technical review](./CONTACT-V3-TECHNICAL-REVIEW.md) for reviewer verdicts and **Reference Pattern Certified** milestone.

---

## Implementation cadence

Treat each slice as an **implementation loop**, not a design loop:

```
Contract
    ↓
Implement
    ↓
Targeted Tests
    ↓
Operator Validation
    ↓
Evidence
    ↓
Small Improvement
    ↓
Repeat
```

| Step | Output |
| ---- | ------ |
| **Contract** | Shared types, API shape, acceptance criteria (slice doc) |
| **Implement** | Repository, service, routes, UI |
| **Targeted tests** | Isolated test file — not full suite unless needed |
| **Operator validation** | Real workflow exercised; feedback logged as evidence |
| **Evidence** | BETA-OBS or slice validation note — what passed, what surprised |
| **Small improvement** | One focused fix; avoid scope creep |
| **Repeat** | Until [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md) satisfied |

---

## Implementation order

**Phase 1 — Reference implementations:** ✅ Complete · 2026-07-05

1. **CONTACT-V3-016.1** — Context Engine 🏆  
2. **CONTACT-V3-016** — Stewardship Engine 🏆  
3. **CONTACT-V3-017** — Action Engine 🏆  
4. **CONTACT-V3-018** — Household Engine 🏆  
5. **CONTACT-V3-019** — Organization Engine 🏆  
6. **CONTACT-V3-020** — AI Contact Briefs (Intelligence) 🏆  
7. **CONTACT-V3-021** — Relationship Analytics (Intelligence) 🏆  

**Parallel:** **CONTACT-V3-015** — Test infrastructure (as needed)  
**Next:** Operator evidence · downstream modules on certified core

---

## Certified implementation doctrine

> **Status:** ✅ **FROZEN** · [Certified Implementation Doctrine](../../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md) · active review on every change

| # | Principle | Origin |
| - | --------- | ------ |
| 1 | **Promote, don't duplicate** | V3-016 |
| 2 | **Reference, don't replicate** | V3-017 |
| 3 | **Group, don't duplicate** | V3-018 |
| 4 | **Belong, don't flatten** | V3-019 |
| 5 | **Summarize, don't speculate** | V3-020 |
| 6 | **Aggregate, don't centralize** | V3-021 |

UCIE doctrines: **Stage, don't commit** · **Provenance, always** · **Review before merge** — same frozen policy.

Every review must answer: **Does this change preserve every certified doctrine?**

Clone conventions from certified slices unless an ADR documents deviation.

---

## V3-016.1 — reference implementation

V3-016.1 establishes the **implementation pattern** every future engine slice follows. Do not build every possible Context capability in v1 — build the **pattern** completely.

See full spec: [CONTACT-V3-016.1](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md#reference-implementation-pattern).

Later modules reuse:

- Data contract shape (entity + join + audit + effective dates)  
- Service layer operations (CRUD, assign, merge, filter, history)  
- UI components (cards, chips, selectors, filter drawer)  
- Permission matrix  
- Test layers (unit → repository → service → API → UI → permissions → targeted validation)  

---

## Slice acceptance — four gates

Before marking a slice done:

| Gate | Question |
| ---- | -------- |
| **Constitution** | Does it uphold the [Relationship Doctrine](./CONTACT-V3-CONSTITUTION.md)? |
| **Architecture** | Does it belong to one [engine](./CONTACT-V3-ARCHITECTURE.md)? |
| **Lifecycle** | Does it respect the [relationship journey](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md)? |
| **Evidence** | Can its behavior be explained and audited? |

Plus the full [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md).

---

## Governance — protect the architecture

> **No implementation may modify the Constitution, Architecture, or V3-000 without an explicit architecture review.**

| Allowed during implementation | Requires architecture review |
| ----------------------------- | ---------------------------- |
| New slice docs (`CONTACT-V3-NNN`) | Changes to [Constitution](./CONTACT-V3-CONSTITUTION.md) |
| New ADRs (append-only) | Changes to [Architecture](./CONTACT-V3-ARCHITECTURE.md) |
| Code, tests, migrations | Changes to [V3-000 lifecycle vocabulary](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) |
| Slice validation notes | Renaming or merging engines |

Implementation convenience does not erode design. If code forces an architecture change, write an ADR and review before editing foundation docs.

See [ADR-006](./CONTACT-V3-DECISION-RECORDS.md#adr-006-foundation-documents-protected-during-implementation).

---

## Targeted test command (convention)

From `backend/`:

```bash
node --import tsx --test src/contacts/<slice>.test.ts
```

Do not rely on `npm run test -- <file>` for isolation — see [V3-014 validation note](./CONTACT-V3-014-RELATIONSHIP-TIMELINE.md#contact-v3-014-validation-note). V3-015 addresses full-suite debt separately.

---

*CONTACT-V3-IMPLEMENTATION-GUIDE · LocalBrain · 2026*
