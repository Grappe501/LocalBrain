# LocalBrain Burt / Cursor Execution Protocol v1.0

> How Burt assigns · How Cursor executes · How slices close.  
> Queue: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) (authoritative) · v1 [archived](./LOCALBRAIN_BUILD_SLICE_QUEUE.md)  
> Generator: [Burt Script Generator Plan v1.0](./LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md)  
> MRIDs: [Requirement Registry v1.0](./LOCALBRAIN_REQUIREMENT_REGISTRY.md)

---

## Prime Directive

```txt
Build exactly one approved LocalBrain slice at a time.
Protect the user's filesystem.
Never add dangerous capability before safety gates exist.
Validate before commit.
Report clearly.
```

---

## Standard Burt Workflow

```txt
1. Read the assigned slice.
2. Read relevant docs.
3. Confirm scope.
4. Identify files to create/modify.
5. Build only within scope.
6. Run validation.
7. Fix errors.
8. Write closeout report.
9. Commit changes.
10. Push only when instructed or if standing repo rule allows.
```

---

## Required Docs to Read First

Before any slice work, read:

```txt
docs/LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md
docs/LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md
docs/LOCALBRAIN_ENGINE_REGISTRY.md
docs/LOCALBRAIN_SAFETY_MODEL.md
docs/LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md
docs/LOCALBRAIN_BURT_CURSOR_PROTOCOL.md
```

Before **LB-OS-002** specifically, also read:

```txt
docs/LOCALBRAIN_PRODUCT_STRATEGY_PHASE.md
docs/LOCALBRAIN_STUDIO_BLUEPRINT.md
docs/LOCALBRAIN_COMMAND_LAYER.md
```

**Rule:** Do not start LB-OS-002 until PSP exit criteria met and Steve approves. ✅ Approved 2026-06-28.

**LB-OS-002 locked:** home = `localbrain` · CFO = briefing only · no modules/OpenAI/filesystem.

---

## Safety Rules

```txt
Do not read secrets.
Do not print secrets.
Do not write outside the LocalBrain repo.
Do not scan the whole drive.
Do not add shell execution tools in V1.
Do not add permanent delete in V1.
Do not bypass approval gates.
Do not give AI direct filesystem control.
```

---

## Forbidden Default Paths

```txt
C:\Windows
C:\Program Files
C:\Program Files (x86)
C:\Users\User\AppData
.git
node_modules
.env
.env.local
*.pem
*.key
credentials.json
id_rsa
```

---

## LocalBrain-Specific Rule

```txt
The AI is never the executor.
The backend tool router is the executor.
The permission engine is the gatekeeper.
The user is the final authority.
```

---

## Queue Rules

```txt
One slice = one Burt/Cursor execution packet.
Each slice must build, validate, commit, and report.
Do not skip safety slices.
Do not add write/delete powers before approval gates exist.
Every slice LB-OS-097+ must cite Enterprise Capability Matrix cells in the packet.
Coherence: no disconnected features — strengthen an engine, domain, or matrix cell.
Do not expand departments/studios before LB-OS-106 (MODULARITY GATE).
Modularity: new studio/domain work goes in modules/ — not core/ — see Modular Architecture.
Slices LB-OS-005+ require LB-OS-106 complete. Slices LB-OS-011+ require module manifest.
Slices adding >500 LOC to backend/src/core/ require justification in packet.
```

Before **LB-OS-097+** specifically, also read:

```txt
docs/LOCALBRAIN_MODULAR_ARCHITECTURE.md
docs/LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md
docs/LOCALBRAIN_EXECUTIVE_DOMAINS.md
```

Every packet must list:

```txt
Executive domain(s):
Matrix cell(s):
Four mode(s): Remember | Think | Do | Run
```

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Steve / Ernie** | Assign slice packets, approve exit criteria, authorize commit/push |
| **Burt** | Author execution packets; review closeout reports |
| **Cursor** | Execute exactly one slice; validate; report; commit when approved |

---

## Safety Gates by Phase

| Phase | Slices | Allowed | Forbidden |
|-------|--------|---------|-----------|
| Foundation | 001–004 | UI, chat, DB | File access, tools |
| Safe Search | 005–008 | Read approved paths | Writes, deletes |
| Tool Router | 009 | search/read tools only | Write tools |
| Approval | 010 | Pending actions, approve/reject | Auto-execute writes |
| Writes | 011+ | Approved create/edit/move/quarantine | Permanent delete, shell, git |

---

## Slice Execution Template

Every assignment must use this format:

```txt
LOCALBRAIN BUILD SLICE: LB-SLICE-###

Mission:
[What this slice builds]

Scope:
[Allowed work]

Do Not Touch:
[Forbidden areas]

Files to Create:
[Exact files]

Files to Modify:
[Exact files]

Requirements:
[MRIDs]

Implementation Steps:
1.
2.
3.
4.

Validation Commands:
npm run typecheck
npm run test
npm run check
npm run build

Manual Validation:
[User-facing checks]

Local Visual Test (required for any slice with UI changes):
npm run dev → http://localhost:5174
Document route checklist in slice packet; confirm in closeout.
See Visual Test Protocol below.

Exit Criteria:
[What must be true]

Commit Message:
[type]: [message]
```

---

## Validation Standard

Every slice should run the strongest available version of:

```txt
npm install
npm run typecheck
npm run test
npm run check
npm run build
```

Early slices may not have every command yet. If a command does not exist, Burt/Cursor must say:

```txt
Command not available yet: [command]
Reason:
Replacement validation used:
```

---

## Local Visual Test Protocol (binding)

Every slice that **changes UI** must include a local visual test in the packet, validation, and closeout.

```bash
npm run dev
```

Open **http://localhost:5174** (frontend port — not bare `localhost`).

Closeout lists routes checked and pass/fail. Backend-only slices skip unless they add Settings-visible API.

---

## Closeout Report Format

After every slice, Cursor must return:

```txt
LOCALBRAIN SLICE CLOSEOUT
Slice:
Status:
Commit:
Branch:
What changed:
-
-
-
Files created:
-
Files modified:
-
Validation:
- npm run typecheck:
- npm run test:
- npm run check:
- npm run build:
Safety confirmation:
- No secrets committed
- No forbidden paths touched
- No unrestricted filesystem access added
- No shell execution added
- No permanent delete added
- Approval gates preserved
Known issues:
-
Next recommended slice:
```

### OJT block (when Teach Me While We Build is ON)

Per [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md):

```txt
LOCALBRAIN OJT — BUILD LESSON
Slice:
What we built:
Why it matters:
Files touched:
Concepts learned (broad):
Concepts learned (narrow):
What validation proved:
What to recognize next time:
Practice challenge (5–15 min):
```

---

## Commit Rules

```txt
One slice = one commit.
Commit message must match the slice purpose.
Do not mix unrelated fixes.
Do not commit secrets.
Do not commit local_data runtime files unless explicitly approved.
```

---

## Push Rules

```txt
Push only if Steve instructs or the repo-specific standing rule says to push.
If unsure, commit locally and report.
```

---

## Traceability

- Commit messages should reference `LB-SLICE-###`
- Update MRID **Status** in registry after Steve approves slice
- Slice closeout reports archived in chat or `docs/slice-reports/` (optional, slice 018+)

---

## Example Packet — LB-SLICE-001

```txt
LOCALBRAIN BUILD SLICE: LB-SLICE-001

Mission:
Create LocalBrain app structure with frontend, backend, shared workspaces.

Scope:
Repo scaffold only. No OpenAI, no file tools, no DB.

Do Not Touch:
local_data runtime files, .env.local, anything outside H:\localAgent

Files to Create:
- package.json
- frontend/package.json, frontend/vite.config.ts, frontend/index.html
- frontend/src/main.tsx, frontend/src/App.tsx
- backend/package.json, backend/src/index.ts
- shared/package.json, shared/src/index.ts
- .env.example, .gitignore, README.md
- local_data/.gitkeep

Files to Modify:
- (none)

Requirements:
- LB-CORE-001, LB-CORE-002, LB-CORE-003, LB-CORE-004, LB-CORE-005, LB-CORE-006
- LB-SAFE-009, LB-TEST-001, LB-TEST-002, LB-DOCS-007

Implementation Steps:
1. Init npm workspaces at repo root
2. Scaffold Vite React TS in frontend/
3. Scaffold Express TS in backend/ with GET /api/health
4. Add shared/ for types
5. Add scripts: dev, check, typecheck, frontend:dev, backend:dev
6. Write .env.example and .gitignore

Validation Commands:
npm install
npm run check

Manual Validation:
Open http://localhost:5174 and http://localhost:4545/api/health

Exit Criteria:
- Root workspace works
- Frontend/backend folders exist
- No secrets committed

Commit Message:
chore: scaffold LocalBrain workspace
```

---

## Burt Script Output Types (Slice 015+)

Full template: [Burt Script Generator Plan v1.0](./LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md)

| Type | Mode | MRID |
|------|------|------|
| Build slice script | Build | LB-BURT-002 |
| Audit script | Audit | LB-BURT-003 |
| Repair script | Repair | LB-BURT-004 |
| Deployment checklist | Deployment | LB-BURT-005 |
| Documentation pass | Build/Audit | — |
| Closeout report template | All | LB-BURT-007 |
| Next-slice recommendation | Build | LB-BURT-010 |

### Generated Script Header

```txt
BURT / CURSOR EXECUTION SCRIPT
Project:
Active lane:
Slice:
Mission:
(paste full template from Burt Script Generator Plan §3)
```

---

*Execution protocol version 1.0 · 2026-06-28*
