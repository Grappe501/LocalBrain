# CONTACT-V3-017 — Smart Tasks & Follow-Up Queue



> **Type:** Contact Management v3 feature slice  

> **Status:** **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  

> **Contract:** `CONTACT-V3-017`  

> **Predecessor:** [CONTACT-V3-016 — Relationship Stewardship](./CONTACT-V3-016-RELATIONSHIP-STEWARDSHIP.md)  

> **Architecture:** [Action Engine · six engines](./CONTACT-V3-ARCHITECTURE.md)



---



## Purpose



Turn stewardship into daily work: assignable tasks, prioritized follow-up queues, and open-task counts surfaced on the contact header (referenced in V3-016 mock).



---



## Behavioral question



> Can organizers see what to do next, for whom, and in what order — without losing tasks across handoffs?



---



## Scope



- Task model linked to contact + owner

- Follow-up queue integration with V3-014 interaction follow-ups (**promote, don't duplicate**)

- Workspace and personal task views via unified queue API

- Open task count on contact header

- Append-only task status history



---



## Validation (when implemented)



```bash

cd backend && node --import tsx --test src/contacts/contactAction.test.ts

npm run typecheck

npm run build

```



---



---

## Governance review (2026-07-05)

| Decision | Result |
| -------- | ------ |
| Implementation Status | ✅ **APPROVE** |
| Pattern Status | 🏆 **REFERENCE PATTERN CERTIFIED** |

**Certification statement:** Implement future operational engines using combined conventions from **V3-016.1 (Context)**, **V3-016 (Stewardship)**, and **V3-017 (Action)**.

**Implementation principles certified:**
- **Promote, don't duplicate** — elevate existing concepts instead of parallel state.
- **Reference, don't replicate** — derived systems compose data from authoritative engines rather than maintaining synchronized copies.

**Inherited pattern (unless ADR documents deviation):** shared contracts · version constants · validator · repository history · append-only audit · RBAC · compute layer for derived views · API conventions · focused UI panels · targeted serial tests.

---

*CONTACT-V3-017 · LocalBrain · 2026*

