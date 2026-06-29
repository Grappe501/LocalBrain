# LocalBrain Build Slice Queue v1.0

> **⛔ SUPERSEDED** — Use [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md).  
> Do not continue `LB-SLICE-002+`. New IDs: `LB-OS-002` through `LB-OS-015`.

---

# LocalBrain Build Slice Queue v1.0 (Archive)

---

## Pause Notice (2026-06-28)

```txt
Vision upgraded: LocalBrain = Personal Operating System (not chatbot-only).
LB-SLICE-001 scaffold may exist — do not proceed to LB-SLICE-002 until:
  1. OS doctrine v2.0 + pillar blueprints reviewed (Steve/Ernie)
  2. Build slice queue v2 reconciles bootstrap path with six pillars
  3. Explicit unpause + new Burt packet assigned
```

---

## Queue Rules

```txt
One slice = one Burt/Cursor execution packet.
Each slice must build, validate, commit, and report.
Do not skip safety slices.
Do not add write/delete powers before approval gates exist.
```

---

## Queue at a Glance

| Phase | Slice | Name | Depends | V1 Role |
|-------|-------|------|---------|---------|
| 0 | **000** | Master docs foundation | — | ✅ Complete |
| 1 | 001 | Repo scaffold | 000 | Foundation |
| 1 | 002 | Basic UI shell | 001 | Foundation |
| 1 | 003 | OpenAI chat backend | 002 | Foundation |
| 1 | 004 | SQLite persistence | 003 | Foundation |
| 2 | 005 | Folder allowlist & permissions | 004 | Safe search |
| 2 | 006 | File indexer | 005 | Safe search |
| 2 | 007 | Search API & UI | 006 | Safe search |
| 2 | 008 | Read file & summarize tools | 007 | Safe search |
| 3 | 009 | Tool calling bridge | 008 | Tool router |
| 4 | 010 | Proposed action approval | 009 | **V1 core gate** |
| 4 | 011 | Backups, quarantine & writes | 010 | **V1 full gate** |
| 5 | 012 | Project profiles | 011 | Project awareness |
| 5 | 013 | Repo map builder | 012 | Project awareness |
| 6 | 014 | Agent registry | 013 | Agent modes |
| 6 | 015 | Burt/Cursor script pipeline | 014 | Burt pipeline |
| 7 | 016 | V1 test harness | 015 | Hardening |
| 7 | 017 | First-run setup wizard | 016 | Hardening |
| 7 | 018 | V1 docs & operator manual | 017 | Hardening |
| 7 | 019 | V1 release candidate | 018 | **V1 ship gate** |

---

## V1 Queue Bar Graph

```txt
Planning Docs             [██████████] Slice 000
Foundation                [██████████] Slices 001-004
Safe Search               [██████████] Slices 005-008
Tool Router               [██████████] Slice 009
Approval/Logging          [██████████] Slices 010-011
Project Awareness         [████████░░] Slices 012-013
Agent Modes               [███████░░░] Slice 014
Burt Pipeline             [███████░░░] Slice 015
Hardening                 [██████████] Slices 016-019
```

---

## V1 Boundaries

```txt
V1 CORE  = through LB-SLICE-010  (approval gates exist; no writes yet)
V1 FULL  = through LB-SLICE-011  (safe create/edit/move/quarantine)
V1 SHIP  = through LB-SLICE-019  (tested, wizard, docs, release candidate)
```

---

# Phase 0 — Planning Docs

## LB-SLICE-000 — Master Docs Foundation ✅

**Goal:** Create LocalBrain planning documents before code.

**Build docs:** Full manifest in [V1 Execution Package v1.0](./LOCALBRAIN_V1_EXECUTION_PACKAGE.md#planning-doc-manifest-slice-000) — all `docs/LOCALBRAIN_*.md` v1.0 specs.

**Exit criteria:**

```txt
All planning docs exist (through V1 Execution Package).
Requirement IDs are stable (193 MRIDs).
Slice queue is committed.
LB-SLICE-001 ready packet exists.
```

**Commit:**

```txt
docs: add LocalBrain master planning foundation
```

**Status:** COMPLETE (commit pending Steve/Ernie approval)

---

# Phase 1 — App Foundation

## LB-SLICE-001 — Repo Scaffold

**Depends on:** 000

**Goal:** Create LocalBrain app structure.

**Build:**

```txt
LocalBrain/
  frontend/
  backend/
  shared/
  docs/
  local_data/
```

**Add:**

```txt
package.json
README.md
.env.example
.gitignore
local_data/backups/
local_data/quarantine/
local_data/logs/
local_data/indexes/
local_data/project_profiles/
```

**MRIDs:** LB-CORE-001–006, LB-SAFE-009, LB-TEST-001–002, LB-DOCS-007

**Validation:**

```txt
npm install
npm run check
```

**Exit criteria:**

```txt
Root workspace works.
Frontend/backend folders exist.
No secrets committed.
```

**Commit:**

```txt
chore: scaffold LocalBrain planning foundation
```

**Burt packet:** [docs/burt_packets/LB-SLICE-001.md](./burt_packets/LB-SLICE-001.md)

---

## LB-SLICE-002 — Basic UI Shell

**Depends on:** 001

**Goal:** Create ChatGPT-style app shell.

**Build:**

```txt
Sidebar
Chat screen
Message list
Input box
Right context panel (shell)
Mock assistant response
iPad: collapsible sidebar + drawer panel (baseline)
```

**Routes/screens:**

```txt
/chat
/search
/projects
/actions
/agents
/settings
/backups
```

**Validation:**

```txt
npm run frontend:dev
npm run check
```

**Exit criteria:**

```txt
User can type message.
Mock assistant reply appears.
Navigation works.
```

**Commit:**

```txt
feat: add LocalBrain chat UI shell
```

**MRIDs:** LB-CHAT-001–004, LB-UI-001–003, LB-UI-011, LB-UI-013

---

## LB-SLICE-003 — OpenAI Chat Backend

**Depends on:** 002

**Goal:** Connect chat to OpenAI API.

**Build:**

```txt
backend/src/openai/client.ts
backend/src/openai/chatOrchestrator.ts
backend/src/openai/prompts.ts (base clause)
backend/src/openai/modelConfig.ts
/api/chat endpoint
LOCALBRAIN_DEFAULT_MODEL env
missing-key error
frontend chat integration
```

**Safety:**

```txt
API key only in .env.local.
Never expose key to frontend.
```

**Validation:**

```txt
npm run backend:dev
npm run check
curl backend health endpoint
send test chat
```

**Exit criteria:**

```txt
Real response works.
Missing key returns friendly error.
No key appears in logs.
```

**Commit:**

```txt
feat: connect LocalBrain chat to OpenAI backend
```

**MRIDs:** LB-AI-001–004, LB-TEST-003 (+ P1: LB-AI-005, LB-CHAT-008, LB-CONFIG-005)

---

## LB-SLICE-004 — SQLite Persistence

**Depends on:** 003

**Goal:** Persist local chat history and settings.

**Build tables:**

```txt
conversations
messages
settings
```

**Build:**

```txt
SQLite connection
migration runner
save messages
load conversation
settings seed
```

**Validation:**

```txt
npm run db:migrate
npm run check
manual refresh persistence test
```

**Exit criteria:**

```txt
Messages survive refresh.
DB stored under local_data.
No cloud dependency.
```

**Commit:**

```txt
feat: add SQLite chat persistence
```

**MRIDs:** LB-DB-001–005, LB-CHAT-006 (+ P1: LB-CHAT-005)

---

# Phase 2 — Safe Local Search

## LB-SLICE-005 — Folder Allowlist & Permission Engine

**Depends on:** 004

**Goal:** Define what LocalBrain may access.

**Build:**

```txt
allowed_folders table
forbidden_path registry
permission classifier
settings UI for allowed folders
path normalization
```

**Default forbidden:**

```txt
C:\Windows
C:\Program Files
C:\Program Files (x86)
AppData
.git
node_modules
.env
.env.local
*.pem
*.key
credentials.json
```

**Validation:**

```txt
npm run test:permissions
npm run check
```

**Exit criteria:**

```txt
Approved folders allowed.
Forbidden paths blocked.
Secrets blocked by default.
```

**Commit:**

```txt
feat: add folder allowlist and permission engine
```

**MRIDs:** LB-CONFIG-001–004, LB-SAFE-001–002, LB-SAFE-010, LB-UI-005, LB-TEST-004

---

## LB-SLICE-006 — File Indexer

**Depends on:** 005

**Goal:** Scan approved folders safely. See [Search & Indexing Plan v1.0](./LOCALBRAIN_SEARCH_INDEXING_PLAN.md).

**Build:**

```txt
file crawler
metadata extractor
text extractor
file_index table
re-index command
scan status
```

**Index fields:**

```txt
path
filename
extension
size
modified_at
folder
content_excerpt
hash
project_guess
```

**Validation:**

```txt
npm run index:scan
npm run test:indexer
npm run check
```

**Exit criteria:**

```txt
Only approved folders scanned.
Forbidden folders skipped.
File index populated.
Large files skipped or capped.
```

**Commit:**

```txt
feat: add safe local file indexer
```

**MRIDs:** LB-SEARCH-001–005, LB-SEARCH-010, LB-SEARCH-012, LB-DB-006, LB-DB-014, LB-TEST-005

---

## LB-SLICE-007 — Search API & Search UI

**Depends on:** 006

**Goal:** Search indexed local files. See [Search & Indexing Plan v1.0](./LOCALBRAIN_SEARCH_INDEXING_PLAN.md).

**Build:**

```txt
/api/search
filename search
path search
content excerpt search
search page
result cards
open/read request button
```

**Validation:**

```txt
npm run test:search
npm run check
manual search test
```

**Exit criteria:**

```txt
Search returns relevant files.
Results show path, type, modified date, excerpt.
No forbidden paths returned.
```

**Commit:**

```txt
feat: add local file search
```

**MRIDs:** LB-SEARCH-006–008, LB-SEARCH-011, LB-UI-004, LB-TEST-006

---

## LB-SLICE-008 — Read File & Summarize Tools

**Depends on:** 007

**Goal:** Let LocalBrain read approved files.

**Build tools:**

```txt
read_file
summarize_file
summarize_folder
```

**Build:**

```txt
file size cap
content extraction
source path display
AI summarization prompt
read log
```

**Validation:**

```txt
npm run test:file-read
npm run check
manual summarize file test
```

**Exit criteria:**

```txt
Approved file can be summarized.
Forbidden file is blocked.
Sources are visible.
Reads are logged.
```

**Commit:**

```txt
feat: add approved file reading and summaries
```

**MRIDs:** LB-FILE-001–005, LB-SEARCH-009

---

# Phase 3 — AI Tool Router

## LB-SLICE-009 — Tool Calling Bridge

**Depends on:** 008

**Goal:** Allow OpenAI to request approved tools.

**Build:**

```txt
tool schema registry
tool router
structuredOutputs.ts (tool + source shapes)
search_files tool
read_file tool
summarize_file tool
summarize_folder tool
tool result injection
tool error display
```

**No write tools yet.**

**Validation:**

```txt
npm run test:tools
npm run check
manual: ask LocalBrain to find a file
manual: ask LocalBrain to summarize found file
```

**Exit criteria:**

```txt
AI can search files.
AI can read approved selected files.
Tool calls are logged.
Blocked paths stay blocked.
```

**Commit:**

```txt
feat: add AI tool router for local search and read tools
```

**MRIDs:** LB-AI-006–007, LB-AI-011, LB-TOOL-001–006, LB-TEST-007 (+ P1: LB-TOOL-007)

---

# Phase 4 — Approval & Logging

## LB-SLICE-010 — Proposed Action Approval System ⭐ V1 CORE

**Depends on:** 009

**Goal:** Create approval gates before any write action exists.

**Build:**

```txt
proposed_actions table
risk levels
approval panel
approve/reject workflow
action status model
```

**Risk levels:**

```txt
LOW
MEDIUM
HIGH
CRITICAL
FORBIDDEN
```

**Validation:**

```txt
npm run test:approvals
npm run check
manual proposed action test
```

**Exit criteria:**

```txt
Risky actions appear as pending.
User can approve/reject.
No pending action executes automatically.
```

**Commit:**

```txt
feat: add action approval workflow
```

**MRIDs:** LB-DB-008, LB-SAFE-003–004, LB-FILE-006–007, LB-LOG-003–004, LB-UI-008, LB-TEST-008 (+ P1: LB-SAFE-005, LB-CONFIG-007)

---

## LB-SLICE-011 — Backups, Quarantine & Write Actions ⭐ V1 FULL

**Depends on:** 010

**Goal:** Add safe create/edit/move/delete tools.

**Build tools:**

```txt
create_file_draft
preview_edit_file
apply_approved_edit
move_approved_file
delete_to_quarantine
restore_quarantined_file
```

**Safety:**

```txt
Backup before edit.
Delete means quarantine only.
Bulk actions require dry run.
No shell execution.
No Git commits.
```

**Validation:**

```txt
npm run test:backups
npm run test:write-tools
npm run check
manual create/edit/restore test
```

**Exit criteria:**

```txt
New files can be created after approval.
Edits show diff before apply.
Deleted files move to quarantine.
Restore works.
All write actions logged.
```

**Commit:**

```txt
feat: add approved file write tools with backup and quarantine
```

**MRIDs:** LB-DB-007, LB-FILE-008–011, LB-SAFE-005–008, LB-BACKUP-001–005, LB-LOG-001–002, LB-LOG-005, LB-UI-009–010, LB-TEST-009

---

# Phase 5 — Project Awareness

## LB-SLICE-012 — Project Profiles

**Depends on:** 011

**Goal:** Let LocalBrain understand major workspaces.

**Build:**

```txt
projects table
project folders
project selector
project summary
project-aware chat context
```

**Initial project profiles:**

```txt
RedDirt
ACU
VoteMatch
CountyWorkbench
SOS Public
AJAX
Phatlip
General Files
```

**Validation:**

```txt
npm run test:projects
npm run check
manual project selector test
```

**Exit criteria:**

```txt
User can choose project.
Chat includes selected project context.
Search can filter by project.
```

**Commit:**

```txt
feat: add project profiles and project-aware context
```

**MRIDs:** LB-DB-009, LB-MEM-001–004, LB-PROJ-001–004, LB-CHAT-007, LB-AI-008, LB-CONFIG-006, LB-UI-006

---

## LB-SLICE-013 — Repo Map Builder

**Depends on:** 012

**Goal:** Automatically map code projects.

**Build:**

```txt
package.json detector
README/doc detector
route detector
script detector
tech stack detector
repo map generator
```

**Outputs:**

```txt
local_data/project_profiles/[project]/repo_map.json
local_data/project_profiles/[project]/repo_summary.md
```

**Validation:**

```txt
npm run project:map
npm run test:repo-map
npm run check
```

**Exit criteria:**

```txt
LocalBrain identifies app type.
Scripts are listed.
Important docs are listed.
Repo summary is generated.
```

**Commit:**

```txt
feat: add local repo map builder
```

**MRIDs:** LB-PROJ-005–007

---

# Phase 6 — Agent Modes

## LB-SLICE-014 — Agent Registry

**Depends on:** 013

**Goal:** Add specialized LocalBrain modes.

**Build agents:**

```txt
General LocalBrain
Burt Script Writer
Codebase Auditor
CampaignOS Agent
ACU Agent
CountyWorkbench Agent
VoteMatch Agent
Document Organizer
Deployment Checklist Agent
Debate Prep Agent
```

**Each agent has:**

```txt
name
purpose
system prompt
allowed tools
forbidden tools
default output format
```

**Validation:**

```txt
npm run test:agents
npm run check
manual switch-agent test
```

**Exit criteria:**

```txt
User can switch agents.
Agent changes behavior.
Agent tool permissions are enforced.
```

**Commit:**

```txt
feat: add LocalBrain agent mode registry
```

**MRIDs:** LB-AGENT-001 through LB-AGENT-012, LB-UI-007

---

## LB-SLICE-015 — Burt/Cursor Script Pipeline

**Depends on:** 014

**Goal:** Generate high-quality Cursor instructions. See [Burt Script Generator Plan v1.0](./LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md).

**Build:**

```txt
Burt script template
slice instruction generator
validation checklist generator
commit message generator
Cursor return report template
```

**Output types:**

```txt
Build slice script
Audit script
Repair script
Deployment checklist
Closeout report
```

**Validation:**

```txt
npm run test:burt-pipeline
npm run check
manual generate script test
```

**Exit criteria:**

```txt
LocalBrain can generate a complete Burt/Cursor execution packet.
Packet includes mission, files, steps, validation, exit criteria, commit.
```

**Commit:**

```txt
feat: add Burt Cursor instruction pipeline
```

**MRIDs:** LB-BURT-001 through LB-BURT-010

---

# Phase 7 — V1 Hardening

## LB-SLICE-016 — V1 Test Harness

**Depends on:** 015

**Goal:** Add full test coverage for V1 safety and core flows.

**Build tests for:**

```txt
chat
OpenAI config
database
permissions
indexing
search
read tools
tool router
approvals
write tools
backups
agents
```

**Validation:**

```txt
npm run test
npm run typecheck
npm run check
npm run build
```

**Exit criteria:**

```txt
All core tests pass.
Build passes.
Safety tests pass.
```

**Commit:**

```txt
test: add LocalBrain V1 safety and workflow coverage
```

**MRIDs:** LB-TEST-001–009 (consolidated harness)

---

## LB-SLICE-017 — First-Run Setup Wizard

**Depends on:** 016

**Goal:** Implement first-run wizard per [First-Run Setup Plan v1.0](./LOCALBRAIN_FIRST_RUN_SETUP.md).

**Wizard steps (9):**

```txt
1. Welcome
2. API key status
3. Choose allowed folders
4. Confirm forbidden rules
5. Choose default project
6. Run first index
7. Run first search
8. First chat test
9. Safety confirmation
```

**MRIDs:** LB-FIRST-001 through LB-FIRST-010, LB-UI-012

---

## LB-SLICE-018 — V1 Documentation & Operator Manual

**Depends on:** 017

**Goal:** Document how to use and maintain LocalBrain.

**Build docs:**

```txt
docs/LOCALBRAIN_FIRST_RUN_SETUP.md
docs/LOCALBRAIN_USER_MANUAL.md
docs/LOCALBRAIN_SAFETY_OPERATOR_GUIDE.md
docs/LOCALBRAIN_BURT_SCRIPT_GUIDE.md
docs/LOCALBRAIN_TROUBLESHOOTING.md
```

**Validation:**

```txt
docs exist
commands match package scripts
safety warnings included
```

**Exit criteria:**

```txt
Steve can install, configure, index, search, chat, and generate Burt scripts.
```

**Commit:**

```txt
docs: add LocalBrain V1 operator manual
```

**MRIDs:** LB-DOCS-008 (+ operator guides)

---

## LB-SLICE-019 — V1 Release Candidate 🚀 V1 SHIP

**Depends on:** 018

**Goal:** Lock V1.

**Run:**

```txt
npm install
npm run typecheck
npm run test
npm run check
npm run build
npm run db:migrate
npm run index:scan
```

**Manual acceptance:**

```txt
Chat works.
Search works.
Read/summarize works.
Approval system works.
Edit with backup works.
Delete quarantine works.
Project selector works.
Burt script generation works.
Action logs work.
Forbidden paths blocked.
```

**Exit criteria:**

```txt
V1 release notes created.
Known issues documented.
No P0 blockers remain.
```

**Commit:**

```txt
release: LocalBrain V1 release candidate
```

---

## Current Status

```txt
Active slice:  LB-SLICE-000  COMPLETE
Next slice:    LB-SLICE-001  (awaiting Ernie/Burt go-ahead)
V1 core gate:  LB-SLICE-010
V1 full gate:  LB-SLICE-011
V1 ship gate:  LB-SLICE-019
```

---

*Slice queue version 1.0 · 2026-06-28 · Phases 0–7 · Slices 000–019*
