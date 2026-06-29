# LocalBrain API Contract v1.0

> **Authoritative REST contract.** UI: [UI/UX Blueprint v1.0](./LOCALBRAIN_UI_UX_BLUEPRINT.md) · DB: [Database Schema v1.0](./LOCALBRAIN_DATABASE_SCHEMA.md)

---

## Base

```txt
Backend base: http://localhost:4545
Frontend base: http://localhost:5174
Content-Type: application/json
```

**Errors:**

```ts
{ error: string; code?: string }
```

**Rule:** Never expose `OPENAI_API_KEY` in any response.

---

## Shared Types

```ts
type ToolCallSummary = {
  toolCallId: string;
  toolName: string;
  status: string;
  riskLevel: string;
  targetPath?: string;
};

type LocalSource = {
  path: string;
  filename: string;
  excerpt?: string;
};
```

---

# 1. Health

```txt
GET /api/health
```

**Slice:** 001 · **MRID:** LB-API-001

**Returns:**

```ts
{
  ok: boolean;
  app: "LocalBrain";
  version: string;
  dbConnected: boolean;
  openaiKeyPresent: boolean;
}
```

---

# 2. Chat

```txt
POST /api/chat
```

**Slice:** 003 · **MRID:** LB-API-002

**Request:**

```ts
{
  conversationId?: string;
  message: string;
  projectId?: string;
  agentId?: string;
}
```

**Response:**

```ts
{
  conversationId: string;
  messageId: string;
  assistantMessage: string;
  toolCalls?: ToolCallSummary[];
  sources?: LocalSource[];
}
```

*Optional future: SSE streaming variant documented in slice 003+; V1 contract defaults to JSON response above.*

---

# 3. Conversations

```txt
GET /api/conversations
POST /api/conversations
GET /api/conversations/:id
DELETE /api/conversations/:id
GET /api/conversations/:id/messages
```

**Slice:** 004 · **MRID:** LB-API-003

**Create request:**

```ts
{
  title?: string;
  projectId?: string;
  agentId?: string;
}
```

**Conversation object:**

```ts
{
  id: string;
  title: string;
  projectId?: string;
  agentId?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

# 4. Settings

```txt
GET /api/settings
POST /api/settings
```

**Slice:** 004 · **MRID:** LB-API-004

**Update request:**

```ts
{
  key: string;
  value: string;
}
```

**Protected rule:**

```txt
Never store OPENAI_API_KEY through settings.
API key stays in .env.local only.
```

**GET returns keys from** `settings` table (see [Database Schema](./LOCALBRAIN_DATABASE_SCHEMA.md#settings)).

---

# 5. Allowed Folders

```txt
GET /api/folders
POST /api/folders
DELETE /api/folders/:id
```

**Slice:** 005 · **MRID:** LB-API-005

**Create request:**

```ts
{
  label: string;
  path: string;
  projectId?: string;
}
```

**Response:**

```ts
{
  id: string;
  label: string;
  path: string;
  projectId?: string;
  isEnabled: boolean;
  safetyStatus: "allowed" | "blocked";
  blockedReason?: string;
}
```

---

# 6. Indexing

```txt
POST /api/index/scan
GET /api/index/status
GET /api/index/runs
```

**Slice:** 006 · **MRID:** LB-API-006

**Scan request:**

```ts
{
  folderIds?: string[];
  projectId?: string;
  recursive?: boolean;
}
```

**Scan response:**

```ts
{
  indexRunId: string;
  status: "started" | "completed" | "failed";
  filesSeen: number;
  filesIndexed: number;
  filesSkipped: number;
  filesBlocked: number;
}
```

**`GET /api/index/status`:** latest run summary + `totalIndexedFiles`

**`GET /api/index/runs`:** paginated list from `index_runs` table

---

# 7. Search

```txt
GET /api/search?q=term&projectId=acu&limit=20
```

**Slice:** 007 · **MRID:** LB-API-007

**Response:**

```ts
{
  query: string;
  results: Array<{
    id: string;
    path: string;
    filename: string;
    extension?: string;
    projectId?: string;
    projectGuess?: string;
    sizeBytes: number;
    modifiedAt?: string;
    excerpt?: string;
  }>;
}
```

**Rules:**

```txt
Only return indexed approved files.
Never return forbidden paths.
Default limit: 20.
Max limit: 100.
```

---

# 8. Files

```txt
POST /api/files/read
POST /api/files/summarize
POST /api/files/summarize-folder
```

**Slice:** 008 · **MRID:** LB-API-008

**Read request:**

```ts
{
  path: string;
  maxChars?: number;
}
```

**Read response:**

```ts
{
  path: string;
  content: string;
  truncated: boolean;
  blocked: boolean;
  blockedReason?: string;
}
```

**Summarize request:**

```ts
{
  path: string;
  style?: "brief" | "detailed" | "action_items" | "burt_context";
}
```

**Summarize-folder request:**

```ts
{
  folderPath: string;
  recursive?: boolean;
  limit?: number;
  style?: "inventory" | "project_status" | "duplicates" | "burt_context";
}
```

---

# 9. Tools

```txt
POST /api/tools/run
GET /api/tools
```

**Slice:** 009 · **MRID:** LB-API-009

**Run request:**

```ts
{
  conversationId?: string;
  agentId?: string;
  toolName: string;
  arguments: Record<string, unknown>;
}
```

**Run response:**

```ts
{
  toolCallId: string;
  status: "executed" | "blocked" | "pending_approval" | "failed";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "FORBIDDEN";
  result?: unknown;
  proposedActionId?: string;
  blockedReason?: string;
}
```

**`GET /api/tools`:** list registered tool names + risk levels (read-only catalog)

---

# 10. Proposed Actions

```txt
GET /api/actions
GET /api/actions/:id
POST /api/actions/:id/approve
POST /api/actions/:id/reject
```

**Slice:** 010–011 · **MRID:** LB-API-010

**Approve response:**

```ts
{
  id: string;
  status: "approved" | "executed" | "failed";
  result?: unknown;
  backupPath?: string;
  error?: string;
}
```

**Reject request:**

```ts
{
  reason?: string;
}
```

---

# 11. Projects

```txt
GET /api/projects
POST /api/projects
POST /api/projects/:id/select
GET /api/projects/:id/profile
```

**Slice:** 012–013 · **MRID:** LB-API-011

**Project create request:**

```ts
{
  name: string;
  description?: string;
  rootPath?: string;
  defaultAgentId?: string;
}
```

**`GET /api/projects/:id/profile`:** project + `profile_json` + repo map summary when available

---

# 12. Agents

```txt
GET /api/agents
GET /api/agents/:id
POST /api/agents/:id/select
```

**Slice:** 014 · **MRID:** LB-API-012

**Agent response:**

```ts
{
  id: string;
  name: string;
  description: string;
  defaultProjectId?: string;
  allowedTools: string[];
  blockedTools: string[];
  riskLimit: string;
  outputStyle?: string;
  isEnabled: boolean;
}
```

---

# 13. Backups & Quarantine

```txt
GET /api/backups
GET /api/quarantine
POST /api/quarantine/:id/restore
```

**Slice:** 011 · **MRID:** LB-API-013

**Restore response:**

```ts
{
  success: boolean;
  restoredPath: string;
}
```

---

# 14. Logs

```txt
GET /api/logs/actions
GET /api/logs/tools
```

**Slice:** 011 · **MRID:** LB-API-014

**Query params:**

```ts
{
  conversationId?: string;
  agentId?: string;
  riskLevel?: string;
  status?: string;
  limit?: number;
}
```

---

# API MRIDs

```txt
LB-API-001 — Health endpoint
LB-API-002 — Chat endpoint
LB-API-003 — Conversations endpoints
LB-API-004 — Settings endpoints
LB-API-005 — Allowed folders endpoints
LB-API-006 — Indexing endpoints
LB-API-007 — Search endpoint
LB-API-008 — File read/summarize endpoints
LB-API-009 — Tool runner endpoint
LB-API-010 — Proposed action endpoints
LB-API-011 — Project endpoints
LB-API-012 — Agent endpoints
LB-API-013 — Backup/quarantine endpoints
LB-API-014 — Log endpoints
```

| MRID | Endpoints | Slice |
|------|-----------|-------|
| LB-API-001 | `/api/health` | 001 |
| LB-API-002 | `/api/chat` | 003 |
| LB-API-003 | `/api/conversations*` | 004 |
| LB-API-004 | `/api/settings` | 004 |
| LB-API-005 | `/api/folders` | 005 |
| LB-API-006 | `/api/index/*` | 006 |
| LB-API-007 | `/api/search` | 007 |
| LB-API-008 | `/api/files/*` | 008 |
| LB-API-009 | `/api/tools/*` | 009 |
| LB-API-010 | `/api/actions/*` | 010–011 |
| LB-API-011 | `/api/projects/*` | 012–013 |
| LB-API-012 | `/api/agents/*` | 014 |
| LB-API-013 | `/api/backups`, `/api/quarantine/*` | 011 |
| LB-API-014 | `/api/logs/*` | 011 |

**Contract doc:** LB-DOCS-009 (COMPLETE)

---

# Endpoint Count

**28 route patterns** across 14 API groups.

---

*API contract version 1.0 · 2026-06-28*
