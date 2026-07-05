# Certified Implementation Doctrine

> **Prime Directive:** [Protect the evidence.](../operator-readiness/PRIME-DIRECTIVE.md)  
> **Status:** ✅ **FROZEN** · Engineering Constitution · 2026-07-05  
> **Phase:** [Evidence-Driven Development](../operator-readiness/EVIDENCE-DRIVEN-DEVELOPMENT.md)  
> **Policy:** Every implementation review must answer the doctrine preservation question

These eleven doctrines are the platform's **engineering constitution**. They were certified through reference-pattern vertical slices. They are no longer aspirational documentation — they are **active engineering constraints**.

---

## Doctrine preservation question

Every pull request, slice review, and implementation decision must answer:

> **Does this change preserve every certified doctrine?**

If **no** — block, defer, or route through ADR + governance before proceeding.

Record reviews using `DoctrinePreservationReview` (`shared/src/operatorReadiness/certifiedDoctrine.ts`).

---

## Relationship Platform (Contact Management v3)

| # | Doctrine | Meaning | Origin |
| - | -------- | ------- | ------ |
| 1 | **Promote, don't duplicate** | Elevate existing concepts; no parallel state | V3-016 |
| 2 | **Reference, don't replicate** | Link to authoritative records; don't copy relationship data | V3-017 |
| 3 | **Group, don't duplicate** | Household membership — one canonical grouping model | V3-018 |
| 4 | **Belong, don't flatten** | Organization affiliation preserves structure | V3-019 |
| 5 | **Summarize, don't speculate** | Intelligence cites evidence; no invented narrative | V3-020 |
| 6 | **Aggregate, don't centralize** | Analytics roll up engine truth; no shadow CRM | V3-021 |

**Trust boundary:** Relationship trust — produce trusted relationships from canonical identities.

---

## Identity Platform (UCIE)

| # | Doctrine | Meaning | Origin |
| - | -------- | ------- | ------ |
| 7 | **Stage, don't commit** | Session-first intake; canonical writes only through commit adapter | UCIE-101+ |
| 8 | **Provenance, always** | Every canonical field knows its source | UCIE-108 |
| 9 | **Review before merge** | No automatic merge below approved confidence threshold | UCIE-105 |

**Trust boundary:** Identity trust — produce trusted identities from external sources.

---

## Volunteer Operations Platform (VOP)

| # | Doctrine | Meaning | Origin |
| - | -------- | ------- | ------ |
| 10 | **Coordinate people, don't just assign tasks** | Marketplace model — volunteers choose work; managers manage flow | VOP-001 |
| 11 | **Expose, don't obscure** | Operational work visible to responsible operators; no hidden queues | VOP-001 |

**Trust boundary:** Operational trust — coordinate trusted people into measurable execution.

---

## Review checklist

For each change, confirm:

- [ ] **Promote** — No duplicate entity models introduced
- [ ] **Reference** — Relationships point to authoritative records
- [ ] **Group** — Household logic uses certified engine, not ad-hoc grouping
- [ ] **Belong** — Org membership uses certified engine
- [ ] **Summarize** — Briefs/intelligence cite evidence; advisory flag preserved
- [ ] **Aggregate** — Dashboards compose from engines; no speculative rows
- [ ] **Stage** — Intake does not write canonical contact tables directly
- [ ] **Provenance** — Committed fields record source chain
- [ ] **Review** — Low-confidence matches route to human review, not silent merge
- [ ] **Coordinate** — Operational work uses marketplace/queue pattern, not shadow assignment tables
- [ ] **Expose** — Queues and supervisor metrics visible to responsible operators

---

## What violates doctrine

| Violation | Example |
| --------- | ------- |
| Parallel contact model | Second "people" table for imports |
| Silent duplicate merge | Auto-link below confidence threshold |
| Speculative brief section | AI narrative without citation |
| Direct CSV → contacts write | Bypassing UCIE session + commit |
| Shadow analytics store | Pre-computed CRM replacing engine aggregation |
| Hidden operational queue | Work routed off-platform or invisible to supervisors |
| Forced assignment-only model | Bypassing marketplace/queue hierarchy without ADR |

---

## Changing doctrine

Doctrine change requires:

1. Explicit governance decision — not a drive-by PR
2. New or amended ADR with rationale
3. Acceptance test review (CPAT version increment if behavior changes)
4. Operator evidence if the change affects walkthrough workflows

Normal EDD work **does not modify** doctrine.

---

## Shared contract

```typescript
CERTIFIED_IMPLEMENTATION_DOCTRINES
DOCTRINE_REVIEW_QUESTION
DoctrinePreservationReview
```

---

*Certified Implementation Doctrine · LocalBrain · 2026*
