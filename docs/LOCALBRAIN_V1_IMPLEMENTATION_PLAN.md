# LocalBrain V1 Implementation Plan

> **Authoritative V1 spec.** Queue: [Build Slice Queue v1.0](./LOCALBRAIN_BUILD_SLICE_QUEUE.md) · Safety: [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md) · Protocol: [Burt/Cursor Protocol v1.0](./LOCALBRAIN_BURT_CURSOR_PROTOCOL.md)

---

## V1 Goal

Build a local ChatGPT-style workbench that can:

```txt
Chat with Steve
Use OpenAI API
Search approved folders
Read approved files
Summarize files
Remember conversations locally
Generate Burt/Cursor scripts
Require approval before file changes
Log every action
Block dangerous paths
```

**Slice 000 (planning) complete.** Application code starts at **LB-SLICE-001** only when assigned.

---

## V1 Completion Definition

LocalBrain V1 is complete when Steve can say:

```txt
"Search my approved project folders, find the latest ACU Cursor report, summarize it, and write the next Burt script."
```

And LocalBrain can:

```txt
Search approved folders
Read the right file
Summarize it
Use ACU/Burt mode
Generate a clean execution script
Show sources
Log everything
Avoid unsafe actions
```

**Ship gate:** LB-SLICE-019 · **Core gate:** LB-SLICE-010 · **Full gate:** LB-SLICE-011

---

# 1. Recommended V1 Stack

```txt
Frontend: React + Vite + TypeScript
Backend: Node + Express + TypeScript
Database: SQLite
AI: OpenAI API (Responses API)
Runtime: Local computer
Desktop wrapper: Later
```

---

# 2. Project Structure

```txt
LocalBrain/                    (repo: H:\localAgent)
  package.json
  README.md
  .env.example
  .gitignore
  frontend/
    src/
      App.tsx
      main.tsx
      components/
      pages/
      api/
      styles/
  backend/
    src/
      server.ts
      openai/
      db/
      tools/
      safety/
      search/
      files/
      agents/
      logs/
  shared/
    types/
  docs/
  local_data/                  (gitignored)
    localbrain.db
    indexes/
    logs/
    backups/
    quarantine/
```

---

# 3. V1 Database Tables

| Table | Introduced | Purpose |
|-------|------------|---------|
| `settings` | Slice 004 | App config key-value |
| `conversations` | Slice 004 | Chat threads |
| `messages` | Slice 004 | Chat messages |
| `allowed_folders` | Slice 005 | Approved scan roots |
| `file_index` | Slice 006 | Indexed file metadata + excerpts |
| `tool_calls` | Slice 009 | AI tool invocation log |
| `proposed_actions` | Slice 010 | Pending approve/reject |
| `action_logs` | Slice 011 | Immutable audit trail |
| `backups` | Slice 011 | Pre-write backup metadata |
| `projects` | Slice 012 | Project profiles |
| `agents` | Slice 014 | Agent mode config |

---

# 4. V1 API Endpoints

| Method | Path | Slice | Purpose |
|--------|------|-------|---------|
| GET | `/api/health` | 001 | Health check |
| POST | `/api/chat` | 003 | Send message, stream reply |
| GET | `/api/conversations` | 004 | List conversations |
| POST | `/api/conversations` | 004 | New conversation |
| GET | `/api/settings` | 004 | Read settings |
| POST | `/api/settings` | 004 | Update settings |
| GET | `/api/folders` | 005 | List allowed folders |
| POST | `/api/folders` | 005 | Add/update folder |
| DELETE | `/api/folders/:id` | 005 | Remove folder |
| POST | `/api/index/scan` | 006 | Trigger index scan |
| GET | `/api/index/status` | 006 | Index stats |
| GET | `/api/search` | 007 | Search indexed files |
| POST | `/api/files/read` | 008 | Read approved file |
| POST | `/api/files/summarize` | 008 | Summarize file/folder |
| GET | `/api/actions` | 010 | Pending + history |
| POST | `/api/actions/:id/approve` | 010 | Approve action |
| POST | `/api/actions/:id/reject` | 010 | Reject action |
| GET | `/api/projects` | 012 | List projects |
| POST | `/api/projects` | 012 | Create/update project |
| POST | `/api/projects/:id/select` | 012 | Set active project |
| GET | `/api/agents` | 014 | List agent modes |
| POST | `/api/agents/:id/select` | 014 | Set active agent |

---

# 5. V1 Tools

### Safe tools first (Slices 008–009)

```txt
search_files
read_file
summarize_file
summarize_folder
```

### Approval-gated tools (Slices 010–011)

```txt
create_file_draft
preview_edit_file
apply_approved_edit
move_approved_file
delete_to_quarantine
restore_quarantined_file
```

### Forbidden in V1

```txt
run_shell_command
permanent_delete
auto_git_commit
scan_entire_drive
read_secret_file
```

Full rules: [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md)

---

# 6. V1 Screens

```txt
/chat
/search
/projects
/actions
/settings
/agents
/backups
```

### Minimum UI

```txt
Sidebar
Chat panel
Search panel
Source/file panel
Approval panel
Action log panel
Settings panel
```

---

# 7. V1 Build Phases

## Phase 1 — Foundation

**Slices:**

```txt
001 Repo Scaffold
002 Basic UI Shell
003 OpenAI Chat Backend
004 SQLite Persistence
```

**Acceptance:**

```txt
App opens.
Chat works.
Messages persist.
No secrets exposed.
```

---

## Phase 2 — Local Search

**Slices:**

```txt
005 Folder Allowlist
006 File Indexer
007 Search API/UI
008 Read/Summarize File
```

**Acceptance:**

```txt
Only approved folders indexed.
Forbidden folders blocked.
Files searchable.
Approved files readable.
Summaries work.
```

---

## Phase 3 — AI Tools

**Slice:**

```txt
009 Tool Calling Bridge
```

**Acceptance:**

```txt
AI can search files.
AI can read approved files.
AI cites local paths.
Tool calls logged.
```

---

## Phase 4 — Approval & File Actions

**Slices:**

```txt
010 Proposed Action Approval System
011 Backups, Quarantine & Write Actions
```

**Acceptance:**

```txt
No write happens without approval.
Edits show preview/diff.
Backups created.
Delete moves to quarantine only.
Restore works.
```

---

## Phase 5 — Project Intelligence

**Slices:**

```txt
012 Project Profiles
013 Repo Map Builder
014 Agent Registry
015 Burt/Cursor Script Pipeline
```

**Acceptance:**

```txt
Project selector works.
Repo maps generated.
Agent modes work.
Burt scripts generated in standard format.
```

**Initial projects (012):** RedDirt · ACU · VoteMatch · CountyWorkbench · SOS Public · AJAX · Phatlip · General Files

---

## Phase 6 — Hardening

**Slices:**

```txt
016 Test Harness
017 First-Run Wizard
018 Operator Manual
019 V1 Release Candidate
```

**Acceptance:**

```txt
Tests pass.
Setup wizard works.
Docs complete.
V1 release candidate ready.
```

**Operator docs (018):**

```txt
LOCALBRAIN_FIRST_RUN_SETUP.md
LOCALBRAIN_USER_MANUAL.md
LOCALBRAIN_SAFETY_OPERATOR_GUIDE.md
LOCALBRAIN_BURT_SCRIPT_GUIDE.md
LOCALBRAIN_TROUBLESHOOTING.md
```

---

# 8. V1 Safety Gates

Before V1 can be considered usable:

```txt
Permission tests pass.
Forbidden paths are blocked.
Secrets are blocked.
Write actions require approval.
Backups work.
Delete is quarantine-only.
Action logs are visible.
No shell execution exists.
```

Enforced by build order: **010 before 011** (approval before writes). Details: [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md)

---

# 9. V1 Acceptance Checklist

```txt
[ ] Install works
[ ] Frontend starts
[ ] Backend starts
[ ] OpenAI chat works
[ ] Missing API key handled safely
[ ] SQLite persistence works
[ ] Allowed folder setup works
[ ] File indexing works
[ ] Search works
[ ] Read file works
[ ] Summarize file works
[ ] AI tool calling works
[ ] Approval panel works
[ ] Edit preview works
[ ] Backup before edit works
[ ] Quarantine delete works
[ ] Restore works
[ ] Project selector works
[ ] Agent selector works
[ ] Burt script generator works
[ ] Action logs work
[ ] Forbidden paths blocked
[ ] No secrets committed
```

Verified at **LB-SLICE-019** manual acceptance.

---

# 10. Planning Docs (Complete)

| Doc | Status |
|-----|--------|
| [Product Doctrine](./LOCALBRAIN_PRODUCT_DOCTRINE.md) | ✅ |
| [Architecture](./LOCALBRAIN_ARCHITECTURE.md) | ✅ |
| [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md) | ✅ |
| [Requirement Registry v1.0](./LOCALBRAIN_REQUIREMENT_REGISTRY.md) | ✅ |
| [Build Slice Queue v1.0](./LOCALBRAIN_BUILD_SLICE_QUEUE.md) | ✅ |
| [Burt/Cursor Protocol v1.0](./LOCALBRAIN_BURT_CURSOR_PROTOCOL.md) | ✅ |
| [UI/UX Blueprint v1.0](./LOCALBRAIN_UI_UX_BLUEPRINT.md) | ✅ |
| [OpenAI Integration Plan v1.0](./LOCALBRAIN_OPENAI_INTEGRATION_PLAN.md) | ✅ |
| [Search & Indexing Plan v1.0](./LOCALBRAIN_SEARCH_INDEXING_PLAN.md) | ✅ |
| [Burt Script Generator Plan v1.0](./LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md) | ✅ |
| [V1 Execution Package v1.0](./LOCALBRAIN_V1_EXECUTION_PACKAGE.md) | ✅ |
| This plan | ✅ |

---

# 11. Current Status

```txt
Planning:     COMPLETE (slice 000)
Application:  NOT STARTED
Next slice:   LB-SLICE-001 — Repo scaffold
Next action:  Assign docs/burt_packets/LB-SLICE-001.md
```

**Slice 001 commit (when approved):** `chore: scaffold LocalBrain planning foundation`

---

*V1 Implementation Plan version 1.0 · 2026-06-28*
