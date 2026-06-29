# LocalBrain V1 Execution Package v1.0

> **Planning foundation + first build slice handoff.**  
> Script: [LB-SLICE-001 Burt/Cursor packet](./burt_packets/LB-SLICE-001.md) · Queue: [Build Slice Queue v1.0](./LOCALBRAIN_BUILD_SLICE_QUEUE.md) · Protocol: [Burt/Cursor Protocol v1.0](./LOCALBRAIN_BURT_CURSOR_PROTOCOL.md)

---

## Execution Goal

Create the planning foundation and initial repo scaffold for **LocalBrain**, Steve's local AI command center.

```txt
LocalBrain must start safe before it becomes powerful.
```

**Workspace:** `H:\localAgent`

---

## Package Status

```txt
Phase 0 — Planning + OS + migration doctrine:  ✅ COMPLETE
Product Strategy Phase (PSP):                  ✅ DOCS WRITTEN · ⬜ Steve approval
LB-OS-001 — Repo scaffold:                   ✅ COMPLETE
LB-OS-002 — Studio router shell:             ⏸ PAUSED (post-PSP)
Next: Steve reviews PSP → LB-OS-002 Burt packet
Self-build v1 gate: LB-OS-011 (Burt + engine context)
```

Assign the script to Cursor to begin Phase 1. No filesystem tools, scanning, or AI wiring in slice 001.

---

## Package Contents

### Phase 0 — Planning Foundation ✅

All master planning docs exist:

```txt
docs/LOCALBRAIN_PRODUCT_DOCTRINE.md
docs/LOCALBRAIN_ARCHITECTURE.md
docs/LOCALBRAIN_SAFETY_MODEL.md
docs/LOCALBRAIN_REQUIREMENT_REGISTRY.md
docs/LOCALBRAIN_BUILD_SLICE_QUEUE.md
docs/LOCALBRAIN_BURT_CURSOR_PROTOCOL.md
docs/LOCALBRAIN_V1_IMPLEMENTATION_PLAN.md
docs/LOCALBRAIN_FIRST_RUN_SETUP.md
docs/LOCALBRAIN_AGENT_REGISTRY.md
docs/LOCALBRAIN_TOOL_REGISTRY.md
docs/LOCALBRAIN_DATABASE_SCHEMA.md
docs/LOCALBRAIN_API_CONTRACT.md
docs/LOCALBRAIN_UI_UX_BLUEPRINT.md
docs/LOCALBRAIN_OPENAI_INTEGRATION_PLAN.md      ← OpenAI integration spec
docs/LOCALBRAIN_SEARCH_INDEXING_PLAN.md
docs/LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md    ← Burt generator spec
docs/LOCALBRAIN_V1_EXECUTION_PACKAGE.md          ← this file
docs/LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md
docs/LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md
docs/LOCALBRAIN_OJT_CODING_ACADEMY.md
docs/LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md
docs/LOCALBRAIN_DRIVE_ARCHITECTURE_PLAN.md
docs/LOCALBRAIN_STORAGE_CLEANUP_BLUEPRINT.md
docs/LOCALBRAIN_PERFORMANCE_MONITOR_BLUEPRINT.md
docs/LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md
docs/LOCALBRAIN_PRODUCT_STRATEGY_PHASE.md
docs/LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md
docs/LOCALBRAIN_ENGINE_REGISTRY.md
docs/LOCALBRAIN_STUDIO_BLUEPRINT.md
docs/LOCALBRAIN_COMMAND_LAYER.md
```

Living tracker: [PHASE_CHECKLIST.md](./PHASE_CHECKLIST.md)

---

### Phase 1 — First Build Slice

**LB-SLICE-001 — Repo Scaffold**

```txt
Mission:
Create the LocalBrain workspace foundation.

Build:
- root package.json
- frontend folder
- backend folder
- shared folder
- docs folder
- local_data folder
- README.md
- .env.example
- .gitignore
```

**Recommended structure:**

```txt
LocalBrain/
  package.json
  README.md
  .env.example
  .gitignore
  frontend/
  backend/
  shared/
  docs/
  local_data/
    backups/
    quarantine/
    logs/
    indexes/
    project_profiles/
```

**Full Burt/Cursor script:** [burt_packets/LB-SLICE-001.md](./burt_packets/LB-SLICE-001.md)

---

## Hard Boundaries

```txt
Do not add unrestricted filesystem access.
Do not add shell execution.
Do not add delete tools.
Do not add Git commit/push tools.
Do not read secrets.
Do not commit .env.local.
Do not scan any folders yet.
Do not touch other repos.
```

---

## Initial Stack

```txt
Frontend: React + Vite + TypeScript
Backend: Node + Express + TypeScript
Database: SQLite
AI: OpenAI API, backend only
```

**Ports (slice 001+):** frontend `5174` · backend `4545`

---

## Validation

```txt
npm install
npm run check
npm run typecheck
npm run build
```

If some scripts do not exist yet, Burt must report that clearly per [Burt/Cursor Protocol](./LOCALBRAIN_BURT_CURSOR_PROTOCOL.md#validation-standard).

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

## Commit Message

```txt
chore: scaffold LocalBrain planning foundation
```

---

## Burt Closeout Format

After LB-SLICE-001, Cursor returns:

```txt
LOCALBRAIN SLICE CLOSEOUT
Slice:
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
-
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

## V1 North Star (Full V1)

```txt
Find the latest ACU Cursor report, summarize it, identify what changed, and write the next Burt script.
```

**Gates:** V1 core = slice 010 · V1 full = slice 011 · V1 ship = slice 019

---

## MRID Summary

```txt
Total MRIDs:   193
Docs complete: 15 (slice 000)
Slice 001:     LB-CORE-001–006, LB-SAFE-009, LB-TEST-001–002, LB-DOCS-007
```

---

## What Happens Next

```txt
1. Steve/Ernie: assign docs/burt_packets/LB-SLICE-001.md to Cursor
2. Cursor: build scaffold only; run validation; return LOCALBRAIN SLICE CLOSEOUT
3. Commit: chore: scaffold LocalBrain planning foundation
4. Next slice: LB-SLICE-002 — Basic UI Shell
```

---

*V1 execution package version 1.0 · 2026-06-28*
