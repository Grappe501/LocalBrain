# LocalBrain Database Schema v1.0

> **Path:** `local_data/localbrain.db` · **Migrations:** `backend/src/db/migrations/`  
> API: [API Contract v1.0](./LOCALBRAIN_API_CONTRACT.md) · Tools: [Tool Registry v1.0](./LOCALBRAIN_TOOL_REGISTRY.md)

---

## Database Location

```txt
local_data/localbrain.db
```

## Core Rule

```txt
SQLite is local memory, not secret storage.
Never store OpenAI API keys in the database.
```

---

# 1. Tables

## `settings`

Stores local app settings.

```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**Seed keys:**

```txt
first_run_completed
default_project_id
selected_agent_id
default_model
safety_acknowledged
last_index_completed_at
```

**MRID:** LB-DB-005 · **Slice:** 004

---

## `conversations`

```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  project_id TEXT,
  agent_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**MRID:** LB-DB-003 · **Slice:** 004

---

## `messages`

```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  tool_call_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

**Allowed roles:**

```txt
system
user
assistant
tool
```

**MRID:** LB-DB-004 · **Slice:** 004

---

## `allowed_folders`

```sql
CREATE TABLE allowed_folders (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  project_id TEXT,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**Slice:** 005 (with LB-CONFIG-002)

---

## `file_index`

```sql
CREATE TABLE file_index (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  extension TEXT,
  folder_path TEXT NOT NULL,
  project_id TEXT,
  project_guess TEXT,
  size_bytes INTEGER NOT NULL,
  modified_at TEXT,
  content_excerpt TEXT,
  content_hash TEXT,
  indexed_at TEXT NOT NULL,
  is_blocked INTEGER NOT NULL DEFAULT 0,
  blocked_reason TEXT
);
```

**Indexes:**

```sql
CREATE INDEX idx_file_index_filename ON file_index(filename);
CREATE INDEX idx_file_index_extension ON file_index(extension);
CREATE INDEX idx_file_index_project ON file_index(project_id);
CREATE INDEX idx_file_index_folder ON file_index(folder_path);
```

**FTS5 (slice 007):** `file_index_fts` on filename, path, content_excerpt

**MRID:** LB-DB-006 · **Slice:** 006

---

## `tool_calls`

```sql
CREATE TABLE tool_calls (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  agent_id TEXT,
  tool_name TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  status TEXT NOT NULL,
  arguments_json TEXT NOT NULL,
  result_json TEXT,
  target_path TEXT,
  blocked_reason TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT
);
```

**Statuses:**

```txt
requested
allowed
blocked
pending_approval
executed
failed
```

**MRID:** LB-DB-011 · **Slice:** 009

---

## `proposed_actions`

```sql
CREATE TABLE proposed_actions (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  agent_id TEXT,
  action_type TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  status TEXT NOT NULL,
  target_path TEXT,
  source_path TEXT,
  destination_path TEXT,
  proposed_content TEXT,
  diff_preview TEXT,
  reason TEXT,
  created_at TEXT NOT NULL,
  approved_at TEXT,
  rejected_at TEXT,
  executed_at TEXT
);
```

**Statuses:**

```txt
pending
approved
rejected
executed
failed
cancelled
```

**MRID:** LB-DB-008 · **Slice:** 010

---

## `action_logs`

```sql
CREATE TABLE action_logs (
  id TEXT PRIMARY KEY,
  action_type TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  status TEXT NOT NULL,
  target_path TEXT,
  details_json TEXT,
  conversation_id TEXT,
  agent_id TEXT,
  proposed_action_id TEXT,
  created_at TEXT NOT NULL
);
```

**MRID:** LB-DB-007 · **Slice:** 011

---

## `backups`

```sql
CREATE TABLE backups (
  id TEXT PRIMARY KEY,
  proposed_action_id TEXT,
  original_path TEXT NOT NULL,
  backup_path TEXT NOT NULL,
  action_type TEXT NOT NULL,
  file_hash_before TEXT,
  file_hash_after TEXT,
  created_at TEXT NOT NULL,
  restored_at TEXT
);
```

**MRID:** LB-DB-012 · **Slice:** 011

---

## `projects`

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  root_path TEXT,
  default_agent_id TEXT,
  profile_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**Seed project IDs:**

```txt
general_files
reddirt
acu
countyworkbench
votematch
sos_public
ajax
phatlip
```

**MRID:** LB-DB-009 · **Slice:** 012

---

## `agents`

```sql
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  default_project_id TEXT,
  system_prompt TEXT NOT NULL,
  allowed_tools_json TEXT NOT NULL,
  blocked_tools_json TEXT NOT NULL,
  risk_limit TEXT NOT NULL,
  output_style TEXT,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**Seed agent IDs:**

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

**MRID:** LB-DB-010 · **Slice:** 014

---

## `index_runs`

Tracks indexing jobs.

```sql
CREATE TABLE index_runs (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL,
  folders_scanned INTEGER NOT NULL DEFAULT 0,
  files_seen INTEGER NOT NULL DEFAULT 0,
  files_indexed INTEGER NOT NULL DEFAULT 0,
  files_skipped INTEGER NOT NULL DEFAULT 0,
  files_blocked INTEGER NOT NULL DEFAULT 0,
  error_json TEXT
);
```

**MRID:** LB-DB-014 · **Slice:** 006

---

## `quarantine`

```sql
CREATE TABLE quarantine (
  id TEXT PRIMARY KEY,
  original_path TEXT NOT NULL,
  quarantine_path TEXT NOT NULL,
  reason TEXT,
  proposed_action_id TEXT,
  created_at TEXT NOT NULL,
  restored_at TEXT
);
```

**MRID:** LB-DB-013 · **Slice:** 011

---

# 2. Relationships

```txt
conversations.project_id → projects.id
conversations.agent_id → agents.id
messages.conversation_id → conversations.id
allowed_folders.project_id → projects.id
file_index.project_id → projects.id
tool_calls.conversation_id → conversations.id
tool_calls.agent_id → agents.id
proposed_actions.conversation_id → conversations.id
proposed_actions.agent_id → agents.id
action_logs.proposed_action_id → proposed_actions.id
action_logs.conversation_id → conversations.id
backups.proposed_action_id → proposed_actions.id
quarantine.proposed_action_id → proposed_actions.id
projects.default_agent_id → agents.id
agents.default_project_id → projects.id
```

---

# 3. Migration Files

```txt
backend/src/db/migrations/001_initial_settings.sql
backend/src/db/migrations/002_conversations_messages.sql
backend/src/db/migrations/003_projects_agents.sql
backend/src/db/migrations/004_allowed_folders_file_index.sql
backend/src/db/migrations/005_tools_actions_logs.sql
backend/src/db/migrations/006_backups_quarantine.sql
backend/src/db/migrations/007_index_runs.sql
backend/src/db/migrations/008_seed_defaults.sql
```

**Command:** `npm run db:migrate` · **MRID:** LB-DB-002

### Slice alignment (implementation order)

| Migration | Tables | Slice |
|-----------|--------|-------|
| 001 | settings | 004 |
| 002 | conversations, messages | 004 |
| 003 | projects, agents (schema only; seed in 008) | 012/014 prep |
| 004 | allowed_folders, file_index | 005–006 |
| 005 | tool_calls, proposed_actions, action_logs | 009–010 |
| 006 | backups, quarantine | 011 |
| 007 | index_runs | 006 |
| 008 | seed defaults | 012/014/017 |

*Note: Migrations may be split per slice during build; filenames above are the target layout.*

---

# 4. Seed Defaults

## Settings

```txt
first_run_completed=false
default_project_id=general_files
selected_agent_id=general_localbrain
default_model=gpt-4.1-mini
safety_acknowledged=false
```

## Default Projects

```txt
General Files
RedDirt
ACU
CountyWorkbench
VoteMatch
SOS Public
AJAX
Phatlip
```

## Default Agents

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

**MRID:** LB-DB-015 · **Migration:** 008_seed_defaults.sql

---

# 5. Database MRIDs

```txt
LB-DB-001 — SQLite database setup
LB-DB-002 — Migration system
LB-DB-003 — Conversations table
LB-DB-004 — Messages table
LB-DB-005 — Settings table
LB-DB-006 — File index table
LB-DB-007 — Action log table
LB-DB-008 — Proposed actions table
LB-DB-009 — Project profiles table
LB-DB-010 — Agents table
LB-DB-011 — Tool calls table
LB-DB-012 — Backups table
LB-DB-013 — Quarantine table
LB-DB-014 — Index runs table
LB-DB-015 — Seed defaults
```

---

# 6. Never Store in SQLite

```txt
OPENAI_API_KEY value
Secret file contents
Full file bodies (excerpts only in file_index)
Quarantined file bytes (disk only)
```

---

# 7. Schema Acceptance

```txt
[ ] 13 tables created via migrations
[ ] All relationships valid
[ ] Seed projects and agents load on first run
[ ] index_runs populated on each scan
[ ] tool_calls matches Tool Registry log schema
[ ] No API key in any row
```

---

*Database schema version 1.0 · 2026-06-28 · 13 tables*
