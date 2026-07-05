# OPS-TEST-004 — Backend npm Test Scope Overrun

> **Status:** **Disposition: Non-blocking**  
> **Type:** Operations test review — test harness scope failure · not product failure  
> **Lane:** 3 Operational Verification  
> **Observed:** 2026-07-02 · post–OPS-006 dashboard crawl verification attempt  
> **Prerequisite:** [OPS-006](./OPS-006-EI-BRIEF-WORKBENCH-CRAWL.md) · `68801db`

---

## PMO read

```text
OPS-006 dashboard crawl: verified
buildState.test.ts: 17/17 PASS isolated
Full backend suite: not authoritative for this gate
Constitutional / EI work: not implicated
```

---

## Record

```text
OPS-TEST-004
Backend npm test scope overrun
Issue:
npm test executed full src/**/*.test.ts instead of intended buildState-only run.
Observed:
124 pass / 193 fail, mostly SQLITE_BUSY from parallel shared SQLite contention.
Authoritative check:
node --import tsx --test src/buildState/buildState.test.ts
→ 17/17 PASS
Disposition:
Non-blocking. Use targeted node test command for buildState verification.
```

---

## Evidence

| Run | Intended scope | Actual scope | Result |
| --- | -------------- | ------------ | ------ |
| `npm test -- --run backend/src/buildState/buildState.test.ts` | `buildState.test.ts` only | **317 tests** — full `src/**/*.test.ts` | 124 pass · 193 fail · exit 1 |

| Authoritative check | Result |
| ------------------- | ------ |
| `node --import tsx --test src/buildState/buildState.test.ts` (from `backend/`) | **17/17 PASS** |

Within `buildState.test.ts` during the overrun run, the EI metrics test (**ENG-EI-002.1 complete · 002.2 next**) passed; remaining failures in that file were bootstrap/DB contention artifacts, not OPS-006 posture regressions.

---

## Classification

| Correctness type | Verdict |
| ---------------- | ------- |
| **Constitutional** (Lane 1) | Not implicated |
| **Behavioral** (Lane 2) | Not implicated |
| **Operational** (Lane 3) | Test harness scope overrun + SQLite contention under full parallel suite |

**Do not open an ENG defect** for this exit code. Classify as **Lane 3 / OPS-TEST** — test infrastructure, not OPS-006 logic failure.

---

## Authoritative gate command

From `backend/`:

```bash
node --import tsx --test src/buildState/buildState.test.ts
```

Do **not** use `npm test` with a file path argument when verifying build-state / dashboard crawl gates — the workspace script expands to `src/**/*.test.ts`.

---

## Related

- [OPS-006](./OPS-006-EI-BRIEF-WORKBENCH-CRAWL.md) — Executive Brief workbench crawl (verified)
- [OPS-TEST-003](./OPS-TEST-003-BACKEND-FILTER-SCOPE.md) — prior filter-scope overrun
- [OPS-TEST-002](./OPS-TEST-002-LIVESURFACE-PARALLEL-SQLITE.md) — parallel SQLite contention
- [OPS-TEST-REVIEW-2026-07-02-DASHBOARD-PROGRESS.md](./OPS-TEST-REVIEW-2026-07-02-DASHBOARD-PROGRESS.md) — dashboard progress crawl disposition
- [Verification Lanes](../memory-os/VERIFICATION-LANES.md)

---

*OPS-TEST-004 · Operations · LocalBrain V1 · 2026*
