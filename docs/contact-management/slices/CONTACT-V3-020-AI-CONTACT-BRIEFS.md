# CONTACT-V3-020 — AI Contact Briefs (Advisory Only)

> **Type:** Contact Management v3 feature slice  
> **Status:** **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
> **Contract:** `CONTACT-V3-020`  
> **Predecessor:** [CONTACT-V3-019 — Organization Mapping](./CONTACT-V3-019-ORGANIZATION-AFFILIATION-MAPPING.md)  
> **Architecture:** [Intelligence Engine](./CONTACT-V3-ARCHITECTURE.md) · pairs with [V3-021](./CONTACT-V3-021-RELATIONSHIP-ANALYTICS-DASHBOARD.md)

---

## Purpose

Generate advisory contact briefs from timeline, ownership, tasks, household, and org context — citing sources, withholding when evidence is thin.

---

## Behavioral question

> Before Kelly calls John, can she get a one-screen brief that is traceable and never fabricates relationship facts?

---

## Scope

- Brief composes certified engines — **summarize, don't speculate**
- Evidence citations for every statement and recommendation
- Cache metadata only (no AI-owned relationship state)
- Per-contact brief panel with regenerate
- No automatic outreach

*Consumes V3-014 advisory pattern and certified relationship engines.*

---

## Validation

```bash
cd backend && node --import tsx --test src/contacts/contactBrief.test.ts
npm run typecheck
npm run build
```

---

## Governance review (2026-07-05)

| Decision | Result |
| -------- | ------ |
| Implementation Status | ✅ **APPROVE** |
| Pattern Status | 🏆 **REFERENCE PATTERN CERTIFIED** |

**Certification statement:** Establishes the canonical **Intelligence Engine** pattern for Contact Management v3 — per-contact advisory synthesis from authoritative engines.

**Implementation principle certified:**
- **Summarize, don't speculate** — organize verified evidence into human-readable guidance; never invent facts, infer unsupported motivations, or replace human judgment.

**Inherited pattern (unless ADR documents deviation):** shared contract · cache metadata only · composer reads certified engines · evidence citations · advisory recommendations with confidence · withheld sections when evidence insufficient · explainability (Why?) · RBAC · profile-top UI panel · targeted serial tests.

---

*CONTACT-V3-020 · LocalBrain · 2026*
