# CONTACT-V3-015 — Test Runner Isolation + SQLite Lock Hardening

> **Type:** Backend test infrastructure (not feature work)  
> **Status:** **PLANNED** — infrastructure debt · not started  
> **Contract:** `CONTACT-V3-015`  
> **Predecessor:** [CONTACT-V3-014 — Relationship Timeline](./CONTACT-V3-014-RELATIONSHIP-TIMELINE.md)

---

## Purpose

Make targeted module validation trustworthy. Without this, every future contact slice can pass in isolation while the default `npm run test` path reports false failures from parallel SQLite contention.

---

## Problem statement

| Issue | Evidence |
| ----- | -------- |
| `npm run test -- <file>` does not isolate a target file | Backend script expands `src/**/*.test.ts`; extra args do not filter |
| Parallel DB tests contend on shared `localbrain.db` | Widespread `SQLITE_BUSY` / `database is locked` in full suite (~69 failures observed 2026-07-03) |
| Per-file serial `describe(..., { concurrency: 1 })` is a partial fix only | Helps within one file; full suite still runs files in parallel |

**Example:** CONTACT-V3-014 passes **2/2** when run directly; fails under full-suite parallel contention.

---

## Scope (proposed)

| Requirement | Notes |
| ----------- | ----- |
| Single-file / pattern test entry point | e.g. `npm run test:file -- src/contacts/contactInteraction.test.ts` |
| Full-suite serial DB access or isolated test databases | Per-test temp DB, or global mutex around bootstrap/shutdown, or `--test-concurrency=1` for DB suites |
| Document canonical validation commands | Slice docs reference targeted command; full suite tracked separately |
| Audit contact test files for serial describe pattern | Already applied to `contactInteraction.test.ts`, `contactRepository.test.ts` — normalize or supersede with runner-level fix |

---

## Non-goals

- Fixing unrelated full-suite environment failures (missing paths, migration certificate eligibility, fingerprint drift)
- Changing production database configuration for runtime performance

---

## Success criteria

1. `npm run test:file -- src/contacts/contactInteraction.test.ts` runs only that file and passes.
2. Full `npm run test` no longer fails primarily on `SQLITE_BUSY` for contact (and ideally all DB) tests.
3. Slice validation notes can cite one canonical targeted command without caveat about false full-suite failures.

---

## Validation (when implemented)

```bash
cd backend && npm run test:file -- src/contacts/contactInteraction.test.ts
cd backend && npm run test:file -- src/contacts/contactRepository.test.ts
cd backend && npm run test
```

---

*CONTACT-V3-015 · LocalBrain · 2026*
