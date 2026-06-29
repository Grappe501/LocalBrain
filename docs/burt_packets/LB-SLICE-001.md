# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Active lane:** Foundation  
**Slice:** LB-SLICE-001  
**Generated:** 2026-06-28  
**Source:** [V1 Execution Package](../LOCALBRAIN_V1_EXECUTION_PACKAGE.md)

---

## Mission

Create the LocalBrain workspace foundation — monorepo scaffold with frontend, backend, shared, and `local_data` layout. Health endpoint only. No OpenAI, no SQLite app DB, no file tools, no folder scanning.

---

## Context

Phase 0 planning docs are complete in `docs/`. No application code exists yet. This is the first code slice.

**What already exists:**

```txt
docs/          — full LOCALBRAIN_* planning foundation
README.md      — project overview
```

---

## Hard Boundaries

**Do not touch:**

```txt
Any path outside H:\localAgent
Other repos (ACU, VoteMatch, etc.)
docs/ content except README status line if needed
```

**Do not enable:**

```txt
Unrestricted filesystem access
Shell execution tools
Delete / quarantine tools
Git commit / push tools
OpenAI integration
Folder scanning or indexing
SQLite application database (slice 004)
File read/write tools
```

**Do not commit secrets:**

```txt
.env.local
OPENAI_API_KEY or any API keys
credentials.json, *.pem, *.key
```

---

## Files to Read First

```txt
docs/LOCALBRAIN_V1_EXECUTION_PACKAGE.md
docs/LOCALBRAIN_BUILD_SLICE_QUEUE.md          (LB-SLICE-001 section)
docs/LOCALBRAIN_BURT_CURSOR_PROTOCOL.md
docs/LOCALBRAIN_ARCHITECTURE.md               (folder tree)
docs/LOCALBRAIN_SAFETY_MODEL.md               (hard boundaries)
docs/LOCALBRAIN_V1_IMPLEMENTATION_PLAN.md
```

---

## Files to Create

```txt
package.json                    — npm workspaces root
.env.example
.gitignore
frontend/package.json
frontend/vite.config.ts
frontend/tsconfig.json
frontend/index.html
frontend/src/main.tsx
frontend/src/App.tsx
backend/package.json
backend/tsconfig.json
backend/src/index.ts            — Express, GET /api/health
shared/package.json
shared/tsconfig.json
shared/src/index.ts             — minimal shared types
local_data/backups/.gitkeep
local_data/quarantine/.gitkeep
local_data/logs/.gitkeep
local_data/indexes/.gitkeep
local_data/project_profiles/.gitkeep
```

---

## Files to Modify

```txt
README.md                       — status: slice 001 complete after build
```

---

## Requirements

```txt
LB-CORE-001 — Monorepo workspace root
LB-CORE-002 — Frontend package
LB-CORE-003 — Backend package
LB-CORE-004 — Shared package
LB-CORE-005 — local_data runtime folder
LB-CORE-006 — Dev scripts (dev, check, typecheck)
LB-SAFE-009 — No unsafe capabilities in scaffold
LB-TEST-001 — Typecheck script
LB-TEST-002 — Backend health smoke test
LB-DOCS-007  — First-run setup doc reference in README (already exists)
```

---

## Implementation Steps

1. Create root `package.json` with workspaces: `frontend`, `backend`, `shared`.
2. Root scripts: `dev`, `check`, `typecheck`, `build`, `frontend:dev`, `backend:dev`.
3. **frontend/** — Vite + React + TypeScript, port `5174`, minimal App shell.
4. **backend/** — Express + TypeScript, port `4545`, `GET /api/health` → `{ "ok": true, "service": "localbrain" }`.
5. **shared/** — export minimal types (e.g. `HealthResponse`).
6. **local_data/** — create subdirs: `backups/`, `quarantine/`, `logs/`, `indexes/`, `project_profiles/` with `.gitkeep`.
7. **`.env.example`:**

   ```env
   OPENAI_API_KEY=
   LOCALBRAIN_DEFAULT_MODEL=gpt-4.1-mini
   LOCALBRAIN_PORT=4545
   LOCALBRAIN_FRONTEND_PORT=5174
   ```

8. **`.gitignore`:** `node_modules/`, `.env.local`, `local_data/**/*.db`, `local_data/logs/*` (keep `.gitkeep`), OS junk.
9. Wire backend to import shared types if useful for health response.
10. Add `LB-TEST-002`: minimal test that health route returns 200 (vitest or node test in backend).

---

## Validation Commands

```txt
npm install
npm run typecheck
npm run check
npm run build
```

If `npm run build` or `npm run test` does not exist yet, report:

```txt
Command not available yet: [command]
Reason: [why]
Replacement validation used: [what ran instead]
```

---

## Manual Checks

```txt
[ ] http://localhost:5174 loads (after npm run frontend:dev)
[ ] http://localhost:4545/api/health returns ok JSON
[ ] git status shows no .env.local or secrets
[ ] local_data/ subdirs exist with .gitkeep
[ ] No filesystem tool code added
```

---

## Exit Criteria

```txt
[ ] LocalBrain repo scaffold exists
[ ] docs folder contains master planning docs
[ ] frontend/backend/shared folders exist
[ ] .env.example exists without secrets
[ ] .gitignore blocks secrets and local runtime data
[ ] no filesystem tools added yet
[ ] no unsafe capabilities added
```

---

## Expected Closeout Report

Return **LOCALBRAIN SLICE CLOSEOUT** per [Burt/Cursor Protocol](../LOCALBRAIN_BURT_CURSOR_PROTOCOL.md#closeout-report-format):

```txt
LOCALBRAIN SLICE CLOSEOUT
Slice: LB-SLICE-001
Status:
Commit:
Branch:
What changed:
-
Files created:
-
Files modified:
-
Validation:
- npm run typecheck:
- npm run check:
- npm run build:
Safety confirmation:
- No secrets committed
- No unrestricted filesystem access added
- No shell execution added
- No delete tools added
- No folder scanning added
- No other repos touched
Known issues:
-
Next recommended slice:
LB-SLICE-002 — Basic UI Shell
```

---

## Commit Message

```txt
chore: scaffold LocalBrain planning foundation
```

---

*Assign this file to Cursor to execute LB-SLICE-001.*
