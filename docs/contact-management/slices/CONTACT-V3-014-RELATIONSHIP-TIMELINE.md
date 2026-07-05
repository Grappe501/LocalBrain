# CONTACT-V3-014 — Relationship Timeline + Interaction Intelligence

> **Type:** Contact Management v3 module slice  
> **Status:** **FUNCTIONALLY COMPLETE** — 2026-07-03 · targeted tests 2/2  
> **Contract:** `CONTACT-V3-014` · `shared/src/contacts/contactInteraction.ts`

---

## Purpose

Turn each contact into a living record of campaign interactions — calls, notes, commitments, follow-ups — as the foundation for handoffs, organizer workflows, and advisory “what next?” guidance.

---

## Scope delivered

| Requirement | Status |
| ----------- | ------ |
| `ContactInteraction` model + SQLite table | ✅ |
| CRUD API + visibility permissions (header-based roles) | ✅ |
| Timeline tab on contact profile | ✅ |
| Quick-log interaction form | ✅ |
| Interaction feed with type filter | ✅ |
| Follow-up panel (overdue / due today / upcoming) | ✅ |
| Advisory-only AI summary placeholder (no live AI) | ✅ |
| No automatic sends / background outreach | ✅ |

---

## API routes

| Method | Path |
| ------ | ---- |
| GET | `/api/contacts/:id/timeline` |
| PATCH | `/api/contacts/:id/timeline/meta` |
| GET | `/api/contacts/:id/interactions` |
| POST | `/api/contacts/:id/interactions` |
| PATCH | `/api/contacts/:contactId/interactions/:interactionId` |
| DELETE | `/api/contacts/:contactId/interactions/:interactionId` |
| GET | `/api/contacts/follow-ups?workspace_id=` |

**Access headers:** `X-Contact-User-Id` · `X-Contact-User-Role` (`admin` \| `owner` \| `organizer` \| `viewer`)

---

## Changed files

**Shared:** `shared/src/contacts/contactInteraction.ts` · `index.ts` · `shared/src/index.ts`

**Backend:** `migrate.ts` · `contactInteractionValidator.ts` · `contactInteractionRepository.ts` · `routes/contacts.ts` · `contactInteraction.test.ts`

**Frontend:** `api/contactTimeline.ts` · `ContactTimelinePanel.tsx` · `ContactManagementView.tsx` · `globals.css`

---

## AI wiring

**Skipped live AI.** Advisory summary is rule-based from timeline entries with citations, uncertainty notes, and `live_ai_wired: false`. Safe to wire COM/EI later without creating facts automatically.

---

## Validation

```bash
npm run typecheck
npm run check
npm run build
cd backend && node --import tsx --test src/contacts/contactInteraction.test.ts
```

## CONTACT-V3-014 Validation Note

Targeted validation passed:

- Command: `cd backend && node --import tsx --test src/contacts/contactInteraction.test.ts`
- Result: 2/2 passed

The broader command:

- `npm run test -- src/contacts/contactInteraction.test.ts`

did not isolate the target file because the backend test script expands `src/**/*.test.ts`. That triggered the full suite instead.

Full-suite result:

- 299 passed
- 69 failed
- Failures appear primarily related to `SQLITE_BUSY` parallel DB lock contention and unrelated environment/assertion issues.

Conclusion:

CONTACT-V3-014 tests pass when run directly. Full-suite failures should be tracked separately as backend test-runner/database isolation debt, not as a blocker for this module.

**Follow-on:** [CONTACT-V3-CONSTITUTION](./CONTACT-V3-CONSTITUTION.md) · [V3-000 Lifecycle](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) · [V3 Architecture](./CONTACT-V3-ARCHITECTURE.md) · [V3-016.1 Context](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md) · [V3-016 Stewardship](./CONTACT-V3-016-RELATIONSHIP-STEWARDSHIP.md)

---

*CONTACT-V3-014 · LocalBrain · 2026*
