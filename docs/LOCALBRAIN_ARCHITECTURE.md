# LocalBrain System Architecture v1.0

> **Authoritative system design.**  
> Doctrine: [Product Doctrine v1.0](./LOCALBRAIN_PRODUCT_DOCTRINE.md) · Safety: [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md) · Build: [V1 Implementation Plan](./LOCALBRAIN_V1_IMPLEMENTATION_PLAN.md)

---

## 1. Architecture Doctrine

```txt
LocalBrain is a local-first AI workbench.
Frontend = interface
Backend = executor
OpenAI = reasoning engine
Tool Router = controlled bridge
Permission Engine = safety gate
SQLite = local memory
File Index = local search layer
User = final authority
```

---

## 2. System Diagram

```txt
User
 ↓
Frontend UI
 ↓
Backend API
 ↓
Chat Orchestrator
 ↓
OpenAI Responses API
 ↓
Tool Request
 ↓
Tool Router
 ↓
Permission Engine
 ↓
Approved Local Tool
 ↓
File/Search/DB Action
 ↓
Logged Result
 ↓
Assistant Response
```

---

## 3. Folder Architecture

```txt
LocalBrain/                         (repo: H:\localAgent)
  package.json
  README.md
  .env.example
  .gitignore
  frontend/
    src/
      main.tsx
      App.tsx
      pages/
        ChatPage.tsx
        SearchPage.tsx
        ProjectsPage.tsx
        ActionsPage.tsx
        AgentsPage.tsx
        SettingsPage.tsx
      components/
        Sidebar.tsx
        ChatWindow.tsx
        MessageList.tsx
        ChatInput.tsx
        SearchPanel.tsx
        SourcePanel.tsx
        ApprovalPanel.tsx
        ActionLogPanel.tsx
      api/
        client.ts
      styles/
        globals.css
  backend/
    src/
      server.ts
      routes/
        chat.routes.ts
        search.routes.ts
        files.routes.ts
        settings.routes.ts
        actions.routes.ts
        projects.routes.ts
        agents.routes.ts
      openai/
        client.ts
        chatOrchestrator.ts
        prompts.ts
      tools/
        toolRegistry.ts
        toolRouter.ts
        schemas.ts
        searchFiles.tool.ts
        readFile.tool.ts
        summarizeFile.tool.ts
      safety/
        permissionEngine.ts
        forbiddenPaths.ts
        riskClassifier.ts
        pathValidator.ts
      search/
        indexer.ts
        textExtractor.ts
        searchService.ts
      files/
        fileReader.ts
        fileWriter.ts
        backupService.ts
        quarantineService.ts
        diffService.ts
      db/
        connection.ts
        migrations/
        repositories/
      agents/
        agentRegistry.ts
        agentPrompts.ts
      logs/
        actionLogger.ts
  shared/
    types/
      chat.ts
      tools.ts
      actions.ts
      files.ts
      projects.ts
      agents.ts
  docs/
  local_data/                       (gitignored)
    localbrain.db
    backups/
    quarantine/
    logs/
    indexes/
    project_profiles/
```

---

## 4. Core Backend Modules

### Chat Orchestrator

Responsible for:

```txt
Receive user message
Load conversation history
Load selected agent prompt
Load selected project context
Call OpenAI
Handle tool requests
Return final assistant message
Save conversation
```

**Location:** `backend/src/openai/chatOrchestrator.ts` · **Slices:** 003, 004, 009

---

### Tool Router

Responsible for:

```txt
Register available tools
Validate tool name
Validate tool arguments
Classify risk
Route to permission engine
Execute safe tools
Create pending actions for risky tools
Return structured result
Log tool calls
```

**Location:** `backend/src/tools/` · **Slices:** 009, 010–011

---

### Permission Engine

Responsible for:

```txt
Normalize paths
Check allowed folders
Check forbidden folders
Block secrets
Apply risk level
Require approval when needed
Prevent unsafe actions
Log allow/block decisions
```

**Location:** `backend/src/safety/` · **Slices:** 005, 010–011 · See [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md)

---

### File Indexer

Responsible for:

```txt
Scan approved folders
Skip forbidden paths
Extract metadata
Extract text excerpts
Store index in SQLite
Support re-indexing
Detect project guesses
```

**Location:** `backend/src/search/indexer.ts` · **Slices:** 006–007

---

### Backup / Quarantine System

Responsible for:

```txt
Backup before edits
Backup before moves
Quarantine deletes
Restore files
Record original paths
Record hashes
Record timestamps
```

**Location:** `backend/src/files/backupService.ts`, `quarantineService.ts` · **Slice:** 011

---

## 5. Database Architecture

### Required Tables

```txt
settings
conversations
messages
allowed_folders
file_index
tool_calls
proposed_actions
action_logs
backups
projects
agents
```

### Important Relationships

```txt
conversations → messages
projects → allowed_folders
tool_calls → action_logs
proposed_actions → action_logs
backups → proposed_actions
agents → conversations
```

**Location:** `backend/src/db/` · **Database:** `local_data/localbrain.db`

---

## 6. API Architecture

```txt
GET  /api/health
POST /api/chat
GET  /api/conversations
POST /api/conversations
GET  /api/settings
POST /api/settings
GET  /api/folders
POST /api/folders
DELETE /api/folders/:id
POST /api/index/scan
GET  /api/index/status
GET  /api/search
POST /api/files/read
POST /api/files/summarize
GET  /api/actions
POST /api/actions/:id/approve
POST /api/actions/:id/reject
GET  /api/projects
POST /api/projects
POST /api/projects/:id/select
GET  /api/agents
POST /api/agents/:id/select
```

**Location:** `backend/src/routes/` · Introduced across slices 001–014

---

## 7. Tool Architecture

### V1 Safe Tools

```txt
search_files
read_file
summarize_file
summarize_folder
```

### V1 Approval-Gated Tools

```txt
create_file_draft
preview_edit_file
apply_approved_edit
move_approved_file
delete_to_quarantine
restore_quarantined_file
```

### Forbidden V1 Tools

```txt
run_shell_command
permanent_delete
auto_git_commit
auto_git_push
scan_entire_drive
read_secret_file
```

**Build order:** Safe tools (008–009) → Approval system (010) → Gated tools (011)

---

## 8. Frontend Architecture

### Main Layout

```txt
Sidebar
 ↓
Main Work Area
 ↓
Right Context Panel
```

### Screens

```txt
/chat      — main conversation
/search    — local search
/projects  — project profiles
/actions   — approvals/history
/agents    — agent modes
/settings  — API/folders/safety
/backups   — quarantine/restore
```

### Right Panel Should Show

```txt
Files referenced
Tool calls
Pending approvals
Action history
Source paths
Warnings
```

**Components:** `SourcePanel`, `ApprovalPanel`, `ActionLogPanel` · **Slice:** 002+

---

## 9. Data Flow: Search + Summarize

```txt
User: “Find latest ACU report”
 ↓
OpenAI requests search_files
 ↓
Tool Router validates
 ↓
Search service queries file_index
 ↓
Results returned to OpenAI
 ↓
OpenAI requests read_file
 ↓
Permission Engine validates path
 ↓
File Reader reads approved file
 ↓
OpenAI summarizes
 ↓
Frontend displays summary + source path
 ↓
Action logged
```

---

## 10. Data Flow: Edit File

```txt
User: “Update this doc”
 ↓
AI proposes edit
 ↓
Tool Router classifies HIGH risk
 ↓
Proposed action created
 ↓
Frontend shows diff preview
 ↓
User approves
 ↓
Backup created
 ↓
Edit applied
 ↓
Action logged
 ↓
Result shown
```

---

## 11. Agent Architecture

Each agent has:

```txt
id
name
description
system_prompt
allowed_tools
blocked_tools
default_project
output_style
risk_limit
```

**Initial agents:**

```txt
general_localbrain
burt_script_writer
codebase_auditor
campaignos_agent
acu_agent
countyworkbench_agent
votematch_agent
document_organizer
deployment_checklist_agent
debate_prep_agent
```

**Registry:** [Agent Registry v1.0](./LOCALBRAIN_AGENT_REGISTRY.md) · **Tools:** [Tool Registry v1.0](./LOCALBRAIN_TOOL_REGISTRY.md)

Every agent system prompt includes [AI safety instruction](./LOCALBRAIN_SAFETY_MODEL.md#15-ai-prompt-safety-instruction).

---

## 12. Configuration Architecture

Settings should support:

```txt
OpenAI model
Default project
Allowed folders
Blocked folders
File size limits
Tool permissions
Theme
First-run completion status
```

`.env.local` should hold:

```txt
OPENAI_API_KEY=
LOCALBRAIN_PORT=4545
LOCALBRAIN_FRONTEND_PORT=5174
```

**Never store API key in frontend state or SQLite.**

| Setting type | Storage |
|--------------|---------|
| API key | `.env.local` only |
| User prefs | SQLite `settings` |
| Allowed folders | SQLite `allowed_folders` |

---

## 13. Security Boundaries

```txt
Frontend cannot access filesystem.
Frontend cannot see API key.
AI cannot directly access filesystem.
Only backend tools touch files.
Only permission engine approves paths.
Only user approves risky actions.
```

---

## 14. V1 Architecture Acceptance

LocalBrain architecture is ready when:

```txt
[ ] Frontend/backend separation is clear
[ ] OpenAI key is backend-only
[ ] Tool router exists
[ ] Permission engine exists
[ ] File indexer only scans allowed folders
[ ] Search/read tools are logged
[ ] Risky tools create pending actions
[ ] Approval UI controls execution
[ ] Backup/quarantine system protects changes
[ ] Agents are modular
[ ] Project profiles are modular
```

Verified at **LB-SLICE-019** (V1 release candidate).

---

## 15. Slice → Architecture Map

| Slice | Architecture components |
|-------|-------------------------|
| 001 | Folder tree, `server.ts`, workspace |
| 002 | Frontend pages + components shell |
| 003 | `openai/client.ts`, `chat.routes.ts`, orchestrator stub |
| 004 | `db/`, conversations, messages |
| 005 | `safety/`, settings routes |
| 006–007 | `search/`, index routes |
| 008 | `files/fileReader.ts`, summarize tools |
| 009 | `tools/toolRouter.ts`, tool loop in orchestrator |
| 010 | `proposed_actions`, `ApprovalPanel` |
| 011 | `fileWriter`, backup, quarantine, diff |
| 012–013 | `projects`, repo map in `project_profiles/` |
| 014–015 | `agents/`, Burt pipeline |
| 016–019 | Tests, wizard, docs, release |

---

## Related Documents

| Doc | Role |
|-----|------|
| [Product Doctrine v1.0](./LOCALBRAIN_PRODUCT_DOCTRINE.md) | Why LocalBrain exists |
| [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md) | Permission levels, flows |
| [V1 Implementation Plan](./LOCALBRAIN_V1_IMPLEMENTATION_PLAN.md) | Phases, acceptance |
| [Tool Registry v1.0](./LOCALBRAIN_TOOL_REGISTRY.md) | Tools, risk matrix, log schema |
| [Database Schema v1.0](./LOCALBRAIN_DATABASE_SCHEMA.md) | SQL tables, migrations |
| [API Contract v1.0](./LOCALBRAIN_API_CONTRACT.md) | REST contracts |
| [UI/UX Blueprint v1.0](./LOCALBRAIN_UI_UX_BLUEPRINT.md) | Screens, LB-UI-001–013 |
| [OpenAI Integration Plan v1.0](./LOCALBRAIN_OPENAI_INTEGRATION_PLAN.md) | Responses API, chat orchestrator |
| [Search & Indexing Plan v1.0](./LOCALBRAIN_SEARCH_INDEXING_PLAN.md) | Indexer, FTS5, ranking |
| [Burt Script Generator Plan v1.0](./LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md) | Burt modes, LB-BURT-001–010 |
| [V1 Execution Package v1.0](./LOCALBRAIN_V1_EXECUTION_PACKAGE.md) | Handoff + slice 001 packet |
| [Agent Registry v1.0](./LOCALBRAIN_AGENT_REGISTRY.md) | Agent modes, tools, prompts |

---

*System architecture version 1.0 · 2026-06-28*
