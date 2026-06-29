# LocalBrain Burt Script Generator Plan v1.0

> **Generate ready-to-paste Burt/Cursor execution scripts.**  
> Protocol: [Burt/Cursor Execution Protocol v1.0](./LOCALBRAIN_BURT_CURSOR_PROTOCOL.md) · Agent: [Agent Registry §2](./LOCALBRAIN_AGENT_REGISTRY.md#2-burt-script-writer) · Queue: [Build Slice Queue v1.0](./LOCALBRAIN_BUILD_SLICE_QUEUE.md) · Package: [V1 Execution Package v1.0](./LOCALBRAIN_V1_EXECUTION_PACKAGE.md)

---

## Purpose

LocalBrain should generate complete, ready-to-paste Burt/Cursor execution scripts.

**Core job:**

```txt
Turn Steve's intent + local project context into a safe Cursor build packet.
```

**Slice:** LB-SLICE-015 · **Agent:** `burt_script_writer` · **MRID:** LB-AGENT-004

---

## 1. Generator Inputs

```txt
User request
Selected project
Selected agent
Relevant local files
Latest Cursor/Burt report
Build slice queue
Requirement registry
Safety model
Known project boundaries
```

Loaded by `backend/src/burt/contextLoader.ts` from SQLite, search index, and `docs/`.

---

## 2. Output Types

```txt
Build slice script
Audit script
Repair script
Documentation pass
Deployment checklist
Closeout report template
Next-slice recommendation
```

| Type | Mode | MRID |
|------|------|------|
| Build slice script | Build | LB-BURT-002 |
| Audit script | Audit | LB-BURT-003 |
| Repair script | Repair | LB-BURT-004 |
| Deployment checklist | Deployment | LB-BURT-005 |
| Documentation pass | Build/Audit | (uses template §3) |
| Closeout report template | All | LB-BURT-007 |
| Next-slice recommendation | Build | LB-BURT-010 |

---

## 3. Standard Burt Script Template

Every generated script uses this structure — **MRID:** LB-BURT-001

```txt
BURT / CURSOR EXECUTION SCRIPT
Project:
Active lane:
Slice:
Mission:
Context:
What already exists.
Hard boundaries:
Do not touch:
Do not enable:
Do not commit secrets:
Files to read first:
-
Files to create:
-
Files to modify:
-
Requirements:
-
Implementation steps:
1.
2.
3.
Validation commands:
-
Manual checks:
-
Expected closeout report:
-
Commit message:
```

Protocol shorthand `LOCALBRAIN BUILD SLICE: LB-SLICE-###` remains valid; generator expands into this full template.

---

## 4. LocalBrain-Specific Script Rules

```txt
Always include safety boundaries.
Always include validation commands.
Always include exit criteria.
Always include commit message.
Always tell Burt what not to touch.
Never ask Burt to add unrestricted filesystem control.
Never ask Burt to read secrets.
Never ask Burt to bypass approval gates.
```

Enforced by `packetValidator.ts` before chat output.

---

## 5. Script Generator Modes

### Build Mode

**Used when Steve says:**

```txt
Build the next slice.
Write the next Burt script.
Put this in the queue.
```

**Output:** One complete implementation script.

**MRID:** LB-BURT-002

### Audit Mode

**Used when Steve says:**

```txt
Audit this.
What is missing?
Find the fastest path.
```

**Output:** Read-only audit script. No code changes unless explicitly requested.

**MRID:** LB-BURT-003

### Repair Mode

**Used when Steve provides errors.**

**Output:** Targeted repair script. Preserve prior work. Run validation. Commit only fix.

**MRID:** LB-BURT-004

### Deployment Mode

**Used for Netlify/GitHub/release checks.**

**Output:**

```txt
Preflight checklist
Build commands
Env checks
Rollback plan
Launch gate
```

**MRID:** LB-BURT-005

---

## 6. Required Sections in Every Script

```txt
Mission
Context
Scope
Hard boundaries
Files to inspect
Files to create
Files to modify
Implementation steps
Validation commands
Exit criteria
Closeout format
Commit message
```

Injected by **LB-BURT-008** (project boundaries) and **LB-BURT-009** (requirement MRIDs).

---

## 7. Validation Command Library

LocalBrain suggests commands by project type — **MRID:** LB-BURT-006

**Generic:**

```txt
npm install
npm run typecheck
npm run test
npm run check
npm run build
```

**Next.js:**

```txt
npm run lint
npm run typecheck
npm run build
```

**Vite:**

```txt
npm run typecheck
npm run build
```

**Prisma:**

```txt
npx prisma validate
npx prisma generate
```

**Custom LocalBrain:**

```txt
npm run db:migrate
npm run test:permissions
npm run test:tools
npm run index:scan
```

Implemented in `backend/src/burt/validationCommandLibrary.ts`.

---

## 8. Closeout Report Template

**MRID:** LB-BURT-007

```txt
BURT CLOSEOUT REPORT
Project:
Branch:
Commit:
Slice:
Status:
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
- No forbidden paths touched
- No unrestricted filesystem access added
- No approval gates bypassed
- No shell execution added
- No permanent delete added
Known issues:
-
Next recommended slice:
```

Aligns with [Burt/Cursor Protocol closeout format](./LOCALBRAIN_BURT_CURSOR_PROTOCOL.md#closeout-report-format).

---

## 9. First LocalBrain Use Case

**Prompt Steve should be able to give:**

```txt
Find the latest ACU Cursor report and write the next Burt script.
```

**LocalBrain should:**

```txt
Search approved ACU folders
Find latest relevant report
Read it
Summarize status
Identify next slice
Generate full Burt script
Show source path
Log the tool calls
```

**Tool flow:** `search_files` → `read_file` → `summarize_file` · **Ranking:** LB-SEARCH-011

Depends on slices **006–007**, **009**, **014**, **015**.

---

## 10. Burt Generator MRIDs

```txt
LB-BURT-001 — Burt script template
LB-BURT-002 — Build-mode generator
LB-BURT-003 — Audit-mode generator
LB-BURT-004 — Repair-mode generator
LB-BURT-005 — Deployment-mode generator
LB-BURT-006 — Validation command library
LB-BURT-007 — Closeout template
LB-BURT-008 — Project-aware boundary injector
LB-BURT-009 — Requirement ID injector
LB-BURT-010 — Next-slice recommendation
```

| MRID | Priority | Slice |
|------|----------|-------|
| LB-BURT-001–010 | P1 | 015 |

**Related:** LB-AGENT-004, LB-AI-011 (structured outputs)

---

## Backend Modules

```txt
backend/src/burt/
  scriptTemplate.ts              — LB-BURT-001, LB-BURT-007
  buildModeGenerator.ts          — LB-BURT-002
  auditModeGenerator.ts          — LB-BURT-003
  repairModeGenerator.ts         — LB-BURT-004
  deploymentModeGenerator.ts     — LB-BURT-005
  validationCommandLibrary.ts    — LB-BURT-006
  boundaryInjector.ts            — LB-BURT-008
  requirementInjector.ts         — LB-BURT-009
  nextSliceRecommender.ts        — LB-BURT-010
  contextLoader.ts
  packetValidator.ts
```

**OpenAI:** `structuredOutputs.ts` validates packet JSON before markdown render.

---

## Build Slice 015

**Exit criteria:**

```txt
LocalBrain generates a complete Burt/Cursor script in §3 template
All modes (build, audit, repair, deployment) produce valid output
ACU "latest Cursor report → next script" manual test passes
MRIDs and boundaries injected correctly
```

**Commit:** `feat: add Burt Cursor instruction pipeline`

**Validation:**

```txt
npm run test:burt-pipeline
npm run check
```

---

## Safety

```txt
Generated scripts never instruct secret reads or whole-drive scans
Generated scripts never bypass approval gates
create_file_draft requires approval when slice 011+ active
Next-slice recommendation is advisory — Steve/Ernie assign slices
```

---

## V1 Acceptance

```txt
[ ] Burt Script Writer agent selectable
[ ] Build mode generates paste-ready LB-SLICE-### script
[ ] Audit mode is read-only by default
[ ] Validation library picks LocalBrain commands for this repo
[ ] Closeout template matches protocol
[ ] ACU north-star prompt succeeds end-to-end
[ ] Tool calls logged; source paths shown
```

---

*Burt script generator plan version 1.0 · 2026-06-28*
