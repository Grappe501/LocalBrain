# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Active lane:** V1 OS Shell — Safety  
**Slice:** LB-OS-003  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-002 ✅  
**Source:** [Build Slice Queue v2](../LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) · [Safety Model](../LOCALBRAIN_SAFETY_MODEL.md)

---

## Mission

Implement the **filesystem permission engine v2** — single gatekeeper for explorer, indexer, storage scan, and future AI tools. Backend-heavy slice with a **small Settings UI surface** so Steve can see and test permissions locally.

No file reads/writes/indexing yet — validate paths only.

---

## Executive domain / matrix

```txt
Executive domain(s): System
Matrix cell(s): System × Automation, System × Intelligence
Four mode(s): Run (safety), Remember (allowed folder registry)
```

---

## Hard boundaries

**Do not:**

```txt
Enable file read/write/index tools (LB-OS-005+)
Scan H:/ or C:/ drives
Add OpenAI or shell execution
Bypass permission engine for any future tool
Store secrets in SQLite
Auto-add allowed folders without explicit seed/config API
```

**Do:**

```txt
Normalize → resolve absolute → allowed root → not forbidden → size limits (stub limits OK)
Log permission decisions to events table or structured console (audit stub)
Same engine for all future consumers
```

---

## Files to read first

```txt
docs/LOCALBRAIN_SAFETY_MODEL.md          (§6 forbidden paths, §7 validation rules)
docs/LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md
docs/LOCALBRAIN_BURT_CURSOR_PROTOCOL.md
docs/LOCALBRAIN_MODULAR_ARCHITECTURE.md
docs/burt_packets/LB-OS-002.md
```

---

## Backend build

### Core modules

```txt
backend/src/safety/pathValidator.ts     — normalize, resolve absolute (Windows-safe)
backend/src/safety/ignoreRules.ts      — node_modules, .git, dist, etc.
backend/src/safety/forbiddenPaths.ts   — Safety Model §6 registry
backend/src/safety/permissionEngine.ts — checkPath(action, path) → allow/deny + reason
backend/src/safety/types.ts              — PermissionLevel, PathCheckResult
```

### Permission engine API (internal)

```typescript
checkPath(input: {
  path: string;
  action: "read" | "list" | "write" | "delete";
}): PathCheckResult

// PathCheckResult
{
  allowed: boolean;
  level: PermissionLevel;
  reason: string;
  normalizedPath?: string;
}
```

**Rules (Safety Model §7):**

```txt
1. Normalize path
2. Resolve absolute path
3. Inside allowed folder root
4. Not inside forbidden folder/pattern
5. Not forbidden secret filename pattern
6. Action allowed for level (writes blocked in 003 except validate-only)
7. Size limits — stub constants, enforce in 009+
8. Log decision
```

### SQLite (initial migration)

```txt
backend/src/db/migrate.ts (or migrations/001_initial.sql)
Tables:
  settings        — key/value (safety banner text, limits JSON)
  allowed_folders — id, path (absolute), label, created_at
  permission_log  — id, path, action, allowed, reason, created_at (optional stub)

Seed allowed_folders:
  H:/localAgent   — LocalBrain repo (dev default)
  (Additional roots added in LB-OS-004 project registry)
```

### HTTP routes

```txt
GET  /api/safety/status        — { engine: "v2", allowedFolderCount, forbiddenRuleCount, dbConnected }
GET  /api/safety/allowed       — list allowed folders (read-only)
GET  /api/safety/forbidden     — list forbidden path patterns (read-only, from registry)
POST /api/safety/test-path     — { path, action? } → PathCheckResult
```

No filesystem mutation endpoints in this slice.

---

## Frontend build (small UI surface)

Extend **Settings** (`/settings`) or add **Safety** section — not a new module (106 not yet).

### Safety panel sections

```txt
1. Safety status        — engine version, DB connected, banner all-clear / warnings
2. Allowed folders      — read-only list from GET /api/safety/allowed
3. Forbidden paths      — read-only collapsed list from GET /api/safety/forbidden
4. Permission test panel — path input + action dropdown + "Test" button
                           shows allow/deny + reason from POST /api/safety/test-path
```

Update shell **SafetyBanner** when engine is active:

```txt
"Permission engine active (LB-OS-003). File tools still disabled until LB-OS-005+."
```

---

## Suggested files

```txt
backend/src/safety/*.ts
backend/src/db/*.ts
backend/src/routes/safety.ts
backend/src/safety/permissionEngine.test.ts
frontend/src/views/SettingsPage.tsx       — add SafetyPanel section
frontend/src/components/SafetyPanel.tsx
frontend/src/api/safety.ts
```

---

## Validation

```bash
npm install
npm run check
npm run test
npm run dev
```

### Automated

```txt
[ ] permissionEngine.test.ts — allowed path under H:/localAgent passes
[ ] permissionEngine.test.ts — C:/Windows denied
[ ] permissionEngine.test.ts — .env path denied
[ ] permissionEngine.test.ts — node_modules segment denied
[ ] POST /api/safety/test-path returns JSON with reason
```

### Local visual test (required — UI slice surface)

```bash
npm run dev
```

Open **http://localhost:5174/settings**

```txt
[ ] Safety status shows engine active
[ ] Allowed folders list visible (includes H:/localAgent or configured root)
[ ] Forbidden paths list visible (read-only)
[ ] Permission test: H:/localAgent/README.md → allowed (read)
[ ] Permission test: C:/Windows → denied with clear reason
[ ] Permission test: .env → denied
[ ] Safety banner updated in shell (not the old LB-OS-002-only message)
[ ] Executive Briefing / other routes still load (no layout regression)
```

---

## Exit criteria

```txt
[ ] permissionEngine.ts single entry for path checks
[ ] Forbidden registry matches Safety Model §6
[ ] allowed_folders in SQLite with seed row
[ ] GET /api/safety/* and POST /api/safety/test-path work
[ ] Settings UI: allowed, forbidden, test panel, safety status
[ ] Unit tests for core deny/allow cases
[ ] npm run check && npm run test pass
[ ] Local visual test checklist passed
[ ] No file indexing, OpenAI, or write tools
```

---

## Commit message

```txt
feat: add filesystem permission engine v2
```

---

## Engines touched

```txt
ENG-PM-001 — Permission engine
ENG-LG-001 — Permission log (stub)
ENG-CF-001 — Settings / allowed folders config
```

---

## Next slice

LB-OS-004 — Workspace registry ([Living Workspace Model](../LOCALBRAIN_LIVING_WORKSPACE_MODEL.md)).

**After 004:** LB-OS-106 MODULARITY GATE before LB-OS-005 explorer.
