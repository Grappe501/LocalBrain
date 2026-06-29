# LocalBrain Safety Model v1.0

> Companion: [System Architecture v1.0](./LOCALBRAIN_ARCHITECTURE.md) · [V1 Implementation Plan](./LOCALBRAIN_V1_IMPLEMENTATION_PLAN.md)

---

## Prime Rule

```txt
LocalBrain can think freely.
LocalBrain can search approved spaces.
LocalBrain can only change files through approval, preview, backup, and logs.
```

---

## LocalBrain-Specific Rule

```txt
The AI is never the executor.
The backend tool router is the executor.
The permission engine is the gatekeeper.
The user is the final authority.
```

## AI Provider Rule (binding from LB-OS-017)

```txt
No business logic calls OpenAI, Anthropic, or any vendor SDK directly.
All LLM traffic: Chief of Staff → Capability Router → AI Provider Manager → Provider Adapter.
```

Spec: [AI Provider Management](./LOCALBRAIN_AI_PROVIDER_MANAGEMENT.md)

---

# 1. Permission Levels

```txt
LEVEL 0 — Forbidden
Blocked completely.

LEVEL 1 — Read Only
Search, list, read, summarize.

LEVEL 2 — Create Draft
Create new files only after approval.

LEVEL 3 — Edit Existing
Preview diff, backup, approve, then edit.

LEVEL 4 — Move / Rename
Preview path change, approve, backup/log.

LEVEL 5 — Delete to Quarantine
Never permanent delete in V1.
```

| Level | Maps to risk | Tools |
|-------|--------------|-------|
| 0 | FORBIDDEN | Blocked paths, secret files, forbidden tools |
| 1 | LOW | `search_files`, `read_file`, `summarize_*` |
| 2 | MEDIUM | `create_file_draft` |
| 3 | HIGH | `preview_edit_file`, `apply_approved_edit` |
| 4 | HIGH | `move_approved_file`, rename |
| 5 | CRITICAL | `delete_to_quarantine`, `restore_quarantined_file` |

---

# 2. Risk Categories

```txt
LOW
Search files
List folders
Read approved files
Summarize approved files

MEDIUM
Create new file
Create draft
Generate proposed edit

HIGH
Edit existing file
Move file
Rename file
Bulk create/edit

CRITICAL
Delete to quarantine
Bulk move
Bulk delete
Overwrite important config

FORBIDDEN
Permanent delete
Read secrets
Run shell commands
Modify system folders
Scan entire drive
Auto-commit Git
```

---

# 3. Default Allowed Behavior

```txt
Allowed without approval:
- Chat
- Search indexed files
- Read approved files
- Summarize approved files
- Generate plans
- Generate Burt/Cursor scripts
```

---

# 4. Always Requires Approval

```txt
Requires approval:
- Create file
- Edit file
- Move file
- Rename file
- Delete to quarantine
- Bulk action
- Re-index very large folder
```

---

# 5. Forbidden in V1

```txt
Never allow in V1:
- Permanent delete
- Shell command execution
- Git commit/push
- Reading .env files
- Reading private keys
- Reading credential files
- Scanning the full C:\ drive
- Writing outside approved folders
- Editing without diff preview
- Deleting without quarantine
```

---

# 6. Forbidden Path Registry

```txt
C:\Windows
C:\Program Files
C:\Program Files (x86)
C:\Users\User\AppData
C:\Users\User\.ssh
C:\Users\User\.aws
C:\Users\User\.azure
C:\Users\User\.config
C:\Users\User\.docker
node_modules
.git
dist
build
.next
.env
.env.local
.env.production
*.pem
*.key
*.p12
*.pfx
id_rsa
id_ed25519
credentials.json
token.json
```

---

# 7. Path Validation Rules

Every file action must pass:

```txt
1. Normalize path.
2. Resolve absolute path.
3. Confirm path is inside allowed folder.
4. Confirm path is not inside forbidden folder.
5. Confirm filename is not a forbidden secret pattern.
6. Confirm action type is allowed for current permission level.
7. Confirm file size is within limits.
8. Log decision.
```

Implemented in `backend/src/safety/` (slice 005+). MRID: **LB-SAFE-011**

---

# 8. File Size Limits

Suggested V1 defaults:

```txt
Read file max: 2 MB
Summarize file max: 5 MB
Index text max per file: 500 KB
Folder scan max files per run: 25,000
Single bulk action max: 50 files
```

Large files should return:

```txt
File is too large for direct read.
LocalBrain can index metadata or summarize excerpts only.
```

MRID: **LB-SAFE-014** (bulk cap) · **LB-FILE-002** (read max)

---

# 9. Approval Flow

```txt
AI proposes action
↓
Backend classifies risk
↓
Permission engine validates path
↓
Action saved as pending
↓
User sees preview
↓
User approves or rejects
↓
Backend executes approved action
↓
Backup/log created
↓
Result shown to user
```

---

# 15. Migration & Reorganization Safety

> Binding for LB-OS-016–024 and any duplicate cleanup, folder reorganization, or bulk move.  
> Doctrine: [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md)

## Rule

LocalBrain must **not** auto-delete or auto-move duplicates. It must **not** execute bulk reorganization without a completed dry-run report package and explicit approval.

## Required dry-run package (in order)

Before any duplicate cleanup, version consolidation, archive move, or legacy folder reorganization:

```txt
1. inventory          — what exists (read-only scan)
2. map                — project/folder relationships
3. duplicates report  — groups with paths + hashes
4. latest-version recommendation — which file to keep per group
5. archive plan       — what moves to archive paths
6. move plan          — proposed path changes (batch list)
7. delete-to-quarantine plan — nothing permanent
8. approval checklist — Steve reviews every section
```

Only after checklist approval may LB-OS-010 executors run batched moves (LB-OS-022).

## Forbidden in migration

```txt
Auto-delete duplicates
Auto-move without approved plan
Indexing C: as project workspace
Registering C: roots as H: project folders (without logged override)
Skipping inventory (LB-OS-017 gate)
Importing secrets from ChatGPT exports without pattern scan
```

## Drive separation

```txt
C:/ = operating programs only
H:/ = work projects, data, archives, documents, repos, media, storage
```

Path validator must tag every path with drive class and apply rules accordingly.

**Optimization (Pillar 10):** Same dry-run package applies to storage cleanup and performance-adjacent file moves. See [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md).

**MRIDs:** LB-SAFE-015 (dry-run required), LB-SAFE-016 (drive separation), LB-SAFE-017 (no cleanup without plan)

---

# 10. Edit Flow

```txt
1. Read current file.
2. Generate proposed new content or patch.
3. Show diff preview.
4. Create pending action.
5. User approves.
6. Backup original file.
7. Apply edit.
8. Log action.
9. Show result.
```

---

# 11. Delete Flow

```txt
1. User/AI proposes delete.
2. Backend classifies as CRITICAL.
3. User confirms.
4. File moves to local_data/quarantine.
5. Original path recorded.
6. Restore option created.
7. No permanent delete in V1.
```

---

# 12. Backup Rules

Before any edit/move/delete:

```txt
Create backup under:
local_data/backups/YYYY-MM-DD/[action_id]/

Record:
- original path
- backup path
- timestamp
- action type
- user approval
- file hash before
- file hash after
```

MRID: **LB-SAFE-006**

---

# 13. Action Log Requirements

Log every:

```txt
Chat tool call
Search
File read
Summary
Proposed action
Approval
Rejection
Edit
Move
Quarantine delete
Restore
Permission block
Error
```

Minimum log fields:

```txt
id
timestamp
action_type
risk_level
status
requested_by
target_path
approved_by_user
tool_name
reason
result
```

MRID: **LB-SAFE-012**

---

# 14. Secret Handling

Secret-like files are blocked by default.

**Patterns:**

```txt
.env*
*.key
*.pem
*.p12
*.pfx
id_rsa
id_ed25519
credentials.json
token.json
secrets.*
```

**V1 behavior:**

```txt
Do not read.
Do not index content.
Do not summarize.
Do not expose value.
May show metadata only:
- filename
- blocked reason
```

MRID: **LB-SAFE-010**

---

# 15. AI Prompt Safety Instruction

Every agent system prompt must include:

```txt
You may request tools, but you do not directly control the filesystem.
Never ask to read secrets.
Never propose permanent delete.
Never propose shell execution.
For file changes, propose an action and wait for user approval.
Prefer dry-run summaries before bulk work.
```

Injected via system prompt registry (slice 014 / LB-AI-008).

---

# 16. Safety MRIDs

```txt
LB-SAFE-001 — Permission classifier
LB-SAFE-002 — Forbidden path registry
LB-SAFE-003 — Action risk levels
LB-SAFE-004 — Approval UI
LB-SAFE-005 — Diff preview
LB-SAFE-006 — Backup before write
LB-SAFE-007 — Quarantine delete
LB-SAFE-008 — Dry-run mode
LB-SAFE-009 — No shell execution in V1
LB-SAFE-010 — Secret-file block
LB-SAFE-011 — Path normalization
LB-SAFE-012 — Action logging
LB-SAFE-013 — Restore support
LB-SAFE-014 — Bulk action cap
```

| MRID | Slice |
|------|-------|
| LB-SAFE-001–002, 010–011 | 005 |
| LB-SAFE-003–005 | 010 |
| LB-SAFE-006–008, 012–014 | 011 |
| LB-SAFE-009 | 001 |
| LB-SAFE-013 | 011 |

---

# 17. V1 Safety Acceptance Test

LocalBrain passes safety only when:

```txt
[ ] Cannot scan C:\
[ ] Cannot read .env
[ ] Cannot read private keys
[ ] Cannot access AppData
[ ] Cannot edit without approval
[ ] Cannot delete permanently
[ ] Delete goes to quarantine
[ ] Restore works
[ ] Backup is created before edit
[ ] Every file action is logged
[ ] Shell command tool does not exist
[ ] Git commit tool does not exist
```

Verified at **LB-SLICE-016** (test harness) and **LB-SLICE-019** (release).

---

## Build Order Reminder

```txt
005  Permission engine + path validation
010  Approval gates (before any write tool)
011  Write execution + backup + quarantine + restore
```

Violating this order is a protocol breach.

---

*Safety model version 1.0 · 2026-06-28*
