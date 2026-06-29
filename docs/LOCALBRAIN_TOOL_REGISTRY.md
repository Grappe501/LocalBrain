# LocalBrain Tool Registry v1.0

> **Authoritative V1 tool definitions.**  
> Agents: [Agent Registry v1.0](./LOCALBRAIN_AGENT_REGISTRY.md) · Safety: [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md) · DB: [Database Schema v1.0](./LOCALBRAIN_DATABASE_SCHEMA.md) · API: [API Contract v1.0](./LOCALBRAIN_API_CONTRACT.md)

---

## Tool Doctrine

```txt
Tools are controlled backend actions.
The AI may request tools.
The permission engine decides what is allowed.
The user approves risky actions.
Every tool call is logged.
```

---

## 1. V1 Tool Categories

```txt
SAFE READ TOOLS
- search_files
- read_file
- summarize_file
- summarize_folder

APPROVAL-GATED WRITE TOOLS
- create_file_draft
- preview_edit_file
- apply_approved_edit
- move_approved_file
- delete_to_quarantine
- restore_quarantined_file

FORBIDDEN V1 TOOLS
- run_shell_command
- permanent_delete
- auto_git_commit
- auto_git_push
- read_secret_file
- scan_entire_drive
```

---

## 2. Tool Risk Matrix

| Tool | Risk | Approval | Slice |
|------|-----:|---------:|-------|
| `search_files` | LOW | No | 009 |
| `read_file` | LOW | No | 009 |
| `summarize_file` | LOW | No | 009 |
| `summarize_folder` | LOW/MEDIUM | Sometimes | 008/009 |
| `create_file_draft` | MEDIUM | Yes | 011 |
| `preview_edit_file` | MEDIUM | Yes | 011 |
| `apply_approved_edit` | HIGH | Yes | 011 |
| `move_approved_file` | HIGH | Yes | 011 |
| `delete_to_quarantine` | CRITICAL | Yes | 011 |
| `restore_quarantined_file` | HIGH | Yes | 011 |

**Slice 010** builds approval workflow; **slice 011** registers and executes write tools.

---

# 3. Safe Read Tools

## `search_files`

**Purpose:** Search indexed files inside approved folders.

```txt
risk: LOW
approval_required: false
introduced_in: LB-SLICE-009
MRID: LB-TOOL-003
```

**Arguments:**

```ts
{
  query: string;
  projectId?: string;
  extensions?: string[];
  limit?: number;
}
```

**Output:**

```ts
{
  results: Array<{
    path: string;
    filename: string;
    extension: string;
    modifiedAt: string;
    excerpt?: string;
    projectGuess?: string;
  }>;
}
```

**Rules:**

```txt
Only search indexed files.
Never return forbidden paths.
Limit defaults to 20.
```

---

## `read_file`

**Purpose:** Read content from one approved file.

```txt
risk: LOW
approval_required: false
introduced_in: LB-SLICE-009
MRID: LB-TOOL-004
```

**Arguments:**

```ts
{
  path: string;
  maxChars?: number;
}
```

**Output:**

```ts
{
  path: string;
  content: string;
  truncated: boolean;
  blocked?: boolean;
  reason?: string;
}
```

**Rules:**

```txt
Must pass permission engine.
Block secrets.
Respect max file size (2 MB default).
Log read (LB-TOOL-014).
```

---

## `summarize_file`

**Purpose:** Read and summarize one approved file.

```txt
risk: LOW
approval_required: false
introduced_in: LB-SLICE-008/009
MRID: LB-TOOL-005
```

**Arguments:**

```ts
{
  path: string;
  summaryStyle?: "brief" | "detailed" | "action_items" | "burt_context";
}
```

**Output:**

```ts
{
  path: string;
  summary: string;
  keyPoints: string[];
  actionItems?: string[];
}
```

**Rules:**

```txt
Must cite local path.
Must say if content was truncated.
```

---

## `summarize_folder`

**Purpose:** Summarize files in an approved folder.

```txt
risk: LOW/MEDIUM
approval_required: false for small folders
approval_required: true for large folder scans
introduced_in: LB-SLICE-008/009
MRID: LB-TOOL-006
```

**Arguments:**

```ts
{
  folderPath: string;
  recursive?: boolean;
  limit?: number;
  summaryStyle?: "inventory" | "project_status" | "duplicates" | "burt_context";
}
```

**Output:**

```ts
{
  folderPath: string;
  filesReviewed: number;
  filesSkipped: number;
  summary: string;
  notableFiles: Array<{
    path: string;
    reason: string;
  }>;
}
```

**Rules:**

```txt
Must be inside approved folder.
Large recursive scans require approval.
Never summarize secrets.
```

---

# 4. Approval-Gated Write Tools

## `create_file_draft`

**Purpose:** Create a new file after approval.

```txt
risk: MEDIUM
approval_required: true
introduced_in: LB-SLICE-011
MRID: LB-TOOL-007
```

**Arguments:**

```ts
{
  targetPath: string;
  content: string;
  overwrite?: false;
}
```

**Output before approval:**

```ts
{
  proposedActionId: string;
  risk: "MEDIUM";
  targetPath: string;
  preview: string;
}
```

**Rules:**

```txt
Cannot overwrite existing file in V1 unless using edit flow.
Target must be inside allowed folder.
```

---

## `preview_edit_file`

**Purpose:** Generate an edit proposal and diff.

```txt
risk: MEDIUM
approval_required: true
introduced_in: LB-SLICE-011
MRID: LB-TOOL-008
```

**Arguments:**

```ts
{
  path: string;
  proposedContent?: string;
  patchInstructions?: string;
}
```

**Output:**

```ts
{
  proposedActionId: string;
  path: string;
  diffPreview: string;
  risk: "HIGH";
}
```

**Rules:**

```txt
Read current file first.
Generate diff.
Do not apply edit.
```

---

## `apply_approved_edit`

**Purpose:** Apply an already approved edit.

```txt
risk: HIGH
approval_required: true
introduced_in: LB-SLICE-011
MRID: LB-TOOL-009
```

**Arguments:**

```ts
{
  proposedActionId: string;
}
```

**Output:**

```ts
{
  success: boolean;
  path: string;
  backupPath: string;
}
```

**Rules:**

```txt
Only works on approved proposed action.
Backup before write.
Log file hash before/after.
```

---

## `move_approved_file`

**Purpose:** Move or rename a file after approval.

```txt
risk: HIGH
approval_required: true
introduced_in: LB-SLICE-011
MRID: LB-TOOL-010
```

**Arguments:**

```ts
{
  sourcePath: string;
  destinationPath: string;
}
```

**Output:**

```ts
{
  proposedActionId: string;
  sourcePath: string;
  destinationPath: string;
  risk: "HIGH";
}
```

**Rules:**

```txt
Both paths must pass permission engine.
No overwrite unless explicitly approved in later version.
```

---

## `delete_to_quarantine`

**Purpose:** Move file to quarantine, not permanent delete.

```txt
risk: CRITICAL
approval_required: true
introduced_in: LB-SLICE-011
MRID: LB-TOOL-011
```

**Arguments:**

```ts
{
  path: string;
  reason?: string;
}
```

**Output:**

```ts
{
  proposedActionId: string;
  path: string;
  risk: "CRITICAL";
  message: "This will move the file to quarantine, not permanently delete it.";
}
```

**Rules:**

```txt
Permanent delete is forbidden.
Quarantine path must record original location.
Restore must be possible.
```

---

## `restore_quarantined_file`

**Purpose:** Restore a quarantined file.

```txt
risk: HIGH
approval_required: true
introduced_in: LB-SLICE-011
MRID: LB-TOOL-012
```

**Arguments:**

```ts
{
  quarantineId: string;
  restorePath?: string;
}
```

**Output:**

```ts
{
  success: boolean;
  restoredPath: string;
}
```

**Rules:**

```txt
Restore path must pass permission engine.
Do not overwrite existing file without future explicit flow.
```

---

# 5. Forbidden Tools

These must not exist in V1:

```txt
run_shell_command
permanent_delete
auto_git_commit
auto_git_push
read_secret_file
scan_entire_drive
```

**MRID:** LB-TOOL-013 — forbidden tool handler

If the AI requests them, return:

```txt
This tool is forbidden in LocalBrain V1.
Reason: unsafe capability outside approved V1 boundaries.
```

---

# 6. Tool Log Schema

Stored in `tool_calls` table. **MRID:** LB-TOOL-014

```ts
{
  id: string;
  timestamp: string;
  toolName: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "FORBIDDEN";
  status: "requested" | "allowed" | "blocked" | "pending_approval" | "executed" | "failed";
  argumentsJson: string;
  resultJson?: string;
  targetPath?: string;
  blockedReason?: string;
  conversationId?: string;
  agentId?: string;
}
```

---

# 7. Tool Registry MRIDs

```txt
LB-TOOL-001 — Tool schema registry
LB-TOOL-002 — Tool router backend
LB-TOOL-003 — search_files tool
LB-TOOL-004 — read_file tool
LB-TOOL-005 — summarize_file tool
LB-TOOL-006 — summarize_folder tool
LB-TOOL-007 — create_file_draft tool
LB-TOOL-008 — preview_edit_file tool
LB-TOOL-009 — apply_approved_edit tool
LB-TOOL-010 — move_approved_file tool
LB-TOOL-011 — delete_to_quarantine tool
LB-TOOL-012 — restore_quarantined_file tool
LB-TOOL-013 — forbidden tool handler
LB-TOOL-014 — tool call logging
```

| MRID | Slice |
|------|-------|
| LB-TOOL-001–006 | 009 (read tools + router) |
| LB-TOOL-007–012 | 011 (write tools) |
| LB-TOOL-013–014 | 009+ (handler + logging from first tool call) |

---

# 8. Router Flow

```txt
function_call received
  → LB-TOOL-002 router
  → unknown / forbidden name? → LB-TOOL-013 response
  → agent allowed_tools check
  → permission engine
  → LOW read → execute → LB-TOOL-014 log (allowed/executed)
  → MEDIUM+ → pending_approval → LB-TOOL-014 log
  → blocked → LB-TOOL-014 log (blocked)
  → return function_call_output to OpenAI
```

---

# 9. OpenAI Registration

All tools: `strict: true`, `additionalProperties: false`.  
Registry file: `backend/src/tools/schemas.ts` · `toolRegistry.ts`

---

*Tool registry version 1.0 · 2026-06-28 · 10 tools + 6 forbidden*
