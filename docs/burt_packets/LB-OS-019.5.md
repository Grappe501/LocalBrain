# LB-OS-019.5 — Executive Program Office Synchronization

## Mission

Make the Executive Program Office a **projection** of authoritative build sources — never a manually maintained scoreboard.

## Problem

EPO lagged the real build because phase tables, slice dependencies, and current-slice logic were hard-coded through LB-OS-016. Slices 017–019 were invisible even when marked complete in `PHASE_CHECKLIST.md`.

## Solution — ENG-BLD-001 Build State Engine

```text
Git commits
        ↓
Build Slice Registry (LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md)
        ↓
PHASE_CHECKLIST.md
        ↓
Decision Ledger / binding decisions
        ↓
Module manifests
        ↓
Test file inventory
        ↓
Documentation library (/docs walk)
        ↓
Executive Program Office (read-only projection)
```

## Deliverables

- [x] `backend/src/buildState/buildStateEngine.ts` — ENG-BLD-001
- [x] `backend/src/buildState/sliceRegistry.ts` — queue parser + dependency expansion
- [x] `backend/src/buildState/gitMetrics.ts` — commits, LOC, docs, velocity
- [x] `checklistParser.ts` — all phase tables (not Phase 1 only)
- [x] EPO overview: current sprint, build velocity, commit timeline
- [x] Build graph lifecycle: planned → ready → in_progress → testing → committed → released
- [x] No manually maintained progress values in `epoData.ts`

## Build checklist

```txt
[ ] npm run test -- buildState
[ ] Verify /program-office shows LB-OS-020 current, 017–019 complete
[ ] Verify phase bars match completed/total per phase
```

## Completion criteria

- EPO current slice matches PHASE_CHECKLIST gate (LB-OS-020)
- Phase 1.5 and Phase 2 slices appear on scoreboard
- Sprint panel: completed 017–019, in progress 020, queued 021–023
- Velocity panel populated from git + filesystem
