# Local Command Brain — Master Build Plan (Legacy)

> **Superseded by LocalBrain v1.0 docs** — see [LOCALBRAIN_REQUIREMENT_REGISTRY.md](./LOCALBRAIN_REQUIREMENT_REGISTRY.md)  
> **Product name:** LocalBrain  
> **Repo root:** `H:\localAgent`  
> **Rule:** No application code until Ernie/Burt assigns a build slice.

---

## 1. Vision

Build a **local AI workbench** — not a chatbot wrapper. A private, ChatGPT-style command center that:

- Chats with OpenAI via the **Responses API** (Assistants API is legacy)
- Searches and understands files across approved folders on this machine
- Proposes file actions through a **controlled tool router** (never raw filesystem access)
- Gates dangerous operations behind previews and user confirmation
- Remembers project context in local SQLite
- Eventually runs **job-specific agents** (Campaign OS, script writer, debate prep, etc.)

**Critical safety principle:** The model proposes → the backend validates → the user previews → the user approves → the action runs → everything is logged.

---

## 2. Stack (Recommended)

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | React + Vite + TypeScript | Fast local dev, simple deploy, no SSR needed for v1 |
| **Backend** | Node + Express + TypeScript | Same language as frontend; excellent OpenAI SDK support |
| **AI** | OpenAI Responses API | Current recommended path; typed items, function calling, `previous_response_id` for state |
| **Storage** | SQLite (`better-sqlite3`) | Zero-config local persistence; chat, index, memories, audit log |
| **Search** | SQLite FTS5 + file watcher | Local full-text index; optional web search in a later phase |
| **Process** | Single app, two ports in dev | Vite on `:5173`, API on `:3001`; Electron/Tauri optional later |

**Alternatives (deferred unless Ernie chooses otherwise):**
- Next.js if we want one repo with API routes (adds complexity for a desktop-first tool)
- Python/FastAPI if Ernie prefers Python for indexing scripts

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  React UI (ChatGPT-style)                                   │
│  - message list, input, tool previews, approval modals      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / SSE
┌──────────────────────────▼──────────────────────────────────┐
│  Express API                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │ Chat Router │  │ Tool Router  │  │ Permission Gate     │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬──────────┘   │
│         │                │                      │             │
│  ┌──────▼────────────────▼──────────────────────▼──────────┐ │
│  │ OpenAI Responses Client (function tools only)           │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ File Index  │  │ Action Queue │  │ Audit Logger        │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  SQLite (localAgent.db)                                       │
│  chats · messages · file_index · memories · pending_actions   │
│  · action_log · settings · allowed_roots                      │
└───────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  Approved filesystem roots only (never whole disk)            │
│  H:\SOSWebsite · Desktop · Documents · Campaign folders · … │
└───────────────────────────────────────────────────────────────┘
```

### Request flow (tool call)

```
User message
    → API sends to OpenAI Responses (with tool definitions)
    → Model returns function_call item(s)
    → Tool Router maps call_id → handler
    → Permission Gate classifies: auto / preview / confirm / blocked
    → UI shows preview or confirmation modal
    → User approves or rejects
    → Handler executes on allowed path only
    → Result sent back as function_call_output
    → Model continues; final reply streamed to UI
    → Audit log written
```

---

## 4. Repository Layout (planned)

```
H:\localAgent\
├── docs/
│   ├── MASTER_BUILD_PLAN.md      ← this file
│   ├── PHASE_CHECKLIST.md        ← living progress tracker
│   └── API_CONTRACT.md           ← written in Phase 1
├── apps/
│   ├── web/                      ← Vite + React frontend
│   └── api/                      ← Express backend
├── packages/
│   └── shared/                   ← types, tool schemas, constants
├── data/                         ← gitignored: SQLite DB, backups
├── .env.example
├── .gitignore
├── package.json                  ← npm workspaces monorepo
└── README.md
```

---

## 5. Configuration

### `.env` (local only, never committed)

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini          # or gpt-4.1 / gpt-5 per Ernie's preference
PORT=3001
DATABASE_PATH=./data/localAgent.db
ALLOWED_ROOTS=H:\SOSWebsite;C:\Users\User\Desktop;...
LOG_LEVEL=info
```

### Default index roots (Phase 2)

| Root | Purpose |
|------|---------|
| `H:\SOSWebsite` | SOS / web project |
| `C:\Users\User\Desktop` | Quick-access files |
| User Documents | General docs |
| Campaign folders | ACU, RedDirt, VoteMatch, etc. (paths TBD with Ernie) |

Roots are stored in SQLite `allowed_roots` and editable from Settings UI.

---

## 6. SQLite Schema (outline)

### `conversations`
- `id`, `title`, `agent_mode` (default `general`), `created_at`, `updated_at`

### `messages`
- `id`, `conversation_id`, `role` (`user` | `assistant` | `system` | `tool`)
- `content`, `openai_item_json` (full Responses item for replay)
- `created_at`

### `allowed_roots`
- `id`, `path`, `label`, `enabled`, `created_at`

### `file_index`
- `id`, `path`, `filename`, `extension`, `modified_at`, `size_bytes`
- `content_text` (extracted), `content_hash`, `indexed_at`
- `project_tag` (nullable: `ACU`, `RedDirt`, `VoteMatch`, `CountyWorkbench`, …)
- FTS5 virtual table: `file_index_fts` on `filename`, `content_text`, `path`

### `memories` (Phase 4)
- `id`, `project_tag`, `key`, `value`, `source`, `created_at`, `updated_at`

### `pending_actions`
- `id`, `conversation_id`, `tool_name`, `arguments_json`, `preview_json`
- `risk_level`, `status` (`pending` | `approved` | `rejected` | `expired`)
- `created_at`, `resolved_at`

### `action_log`
- `id`, `pending_action_id`, `tool_name`, `path`, `before_hash`, `after_hash`
- `backup_path` (nullable), `result`, `created_at`

---

## 7. Tool Definitions (OpenAI Responses format)

All tools use `strict: true` and `additionalProperties: false` per OpenAI guidance.

### Phase 2 — Read / Search only

| Tool | Risk | Gate |
|------|------|------|
| `search_files` | Low | Auto |
| `read_file` | Low | Auto (path must be in allowed root) |
| `summarize_folder` | Low | Auto |
| `list_allowed_roots` | None | Auto |

### Phase 3 — Write / Move / Delete

| Tool | Risk | Gate |
|------|------|------|
| `create_file` | Medium | Preview → approve |
| `edit_file` | Medium | Diff preview → approve |
| `move_file` | High | Confirm + show source/dest |
| `delete_file` | High | Confirm + backup |
| `bulk_action` | Critical | Confirm + backup + list all targets |

### Phase 4 — Memory

| Tool | Risk | Gate |
|------|------|------|
| `remember_fact` | Low | Auto |
| `recall_facts` | Low | Auto |
| `forget_fact` | Medium | Confirm |

### Phase 5 — Job agents (modes inject extra tools + system instructions)

Mode-specific tools added per agent (e.g. `audit_repo`, `write_script_draft`, `build_checklist`).

---

## 8. Permission Gate Rules

```typescript
// Conceptual — implement when Ernie approves Phase 1 start

type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

function classifyTool(toolName: string): RiskLevel { ... }

function validatePath(path: string, allowedRoots: string[]): boolean {
  // Resolve to real path; reject .., symlinks outside roots, etc.
}

// Read = allowed immediately
// Create/edit = pending until user approves preview
// Move/delete = pending + require explicit confirm checkbox
// Bulk = pending + backup zip to data/backups/
```

**Always log:** tool name, paths, user decision, timestamp, conversation id.

---

## 9. Build Phases

### Phase 0 — Planning (NOW)
**Owner:** Ernie + Cursor  
**Deliverables:**
- [x] Master build plan (this document)
- [ ] Ernie confirms stack choices (Vite/React + Express vs alternatives)
- [ ] Ernie confirms model default (`gpt-4.1-mini` recommended for cost/speed)
- [ ] Ernie lists exact campaign folder paths for index roots
- [ ] Ernie picks final product name
- [ ] Phase checklist created and first implementation task assigned

**Exit criteria:** Ernie says "start Phase 1."

---

### Phase 1 — Basic Local Chat
**Goal:** Working chat UI talking to OpenAI with history saved locally.

| Task | Details |
|------|---------|
| 1.1 | Scaffold monorepo (`apps/web`, `apps/api`, `packages/shared`) |
| 1.2 | Express server: health check, CORS, env loading |
| 1.3 | OpenAI Responses client wrapper (create, stream, `previous_response_id`) |
| 1.4 | SQLite: `conversations`, `messages` tables + migrations |
| 1.5 | `POST /api/chat` — send message, stream assistant reply |
| 1.6 | `GET /api/conversations`, `GET /api/conversations/:id/messages` |
| 1.7 | React chat UI: sidebar (conversations), message list, input, streaming |
| 1.8 | Settings page: API key status (masked), model selector |
| 1.9 | `.env.example`, `.gitignore`, README with run instructions |

**Acceptance tests:**
- [ ] User can send a message and get a streamed reply
- [ ] Conversations persist across app restart
- [ ] API key never sent to frontend; only backend reads `.env`
- [ ] Empty/error states handled gracefully

**Ernie demo prompt:** *"Explain what Local Command Brain will do when finished."*

---

### Phase 2 — File Search
**Goal:** Index approved folders; answer "find every file about X" with clickable results.

| Task | Details |
|------|---------|
| 2.1 | `allowed_roots` table + Settings UI to add/remove roots |
| 2.2 | Indexer service: walk roots, extract text (txt, md, docx, pdf, code) |
| 2.3 | FTS5 search + metadata filters (extension, date, project tag) |
| 2.4 | `POST /api/index/rebuild`, `GET /api/index/status` |
| 2.5 | Register `search_files`, `read_file`, `summarize_folder` tools |
| 2.6 | Tool loop in chat handler (function_call → execute → function_call_output) |
| 2.7 | UI: search result cards with path, snippet, "Open folder" / copy path |
| 2.8 | Background re-index on file change (chokidar, debounced) |

**Acceptance tests:**
- [ ] "Find every file about ACU Lane A" returns ranked results with paths
- [ ] Clicking a result copies path or opens in Explorer
- [ ] Index skips paths outside `allowed_roots`
- [ ] Re-index completes without blocking chat

**Ernie demo prompt:** *"Find every file about ACU Lane A."*

---

### Phase 3 — Safe File Tools
**Goal:** Create/edit with diff preview; move/delete only after approval.

| Task | Details |
|------|---------|
| 3.1 | Permission gate module + `pending_actions` table |
| 3.2 | `create_file`, `edit_file` — generate preview, hold until approved |
| 3.3 | Diff viewer component (before/after for edits) |
| 3.4 | `move_file`, `delete_file` — confirmation modal with warnings |
| 3.5 | Backup service: copy to `data/backups/` before destructive ops |
| 3.6 | `action_log` for full audit trail |
| 3.7 | Approve/reject API: `POST /api/actions/:id/approve` |
| 3.8 | Bulk action guard: max N files without extra confirm |

**Acceptance tests:**
- [ ] AI cannot write a file without user clicking Approve
- [ ] Edit shows side-by-side or unified diff
- [ ] Delete creates backup; restore documented
- [ ] Rejected actions are logged and model receives rejection reason

**Ernie demo prompt:** *"Draft a one-paragraph summary file about today's ACU meeting and save it to Desktop — but let me approve first."*

---

### Phase 4 — Project Memory
**Goal:** Persistent facts tagged by project.

| Task | Details |
|------|---------|
| 4.1 | `memories` table + CRUD API |
| 4.2 | `remember_fact`, `recall_facts`, `forget_fact` tools |
| 4.3 | Project tag picker in UI (ACU, RedDirt, VoteMatch, CountyWorkbench, …) |
| 4.4 | Inject relevant memories into system instructions per conversation tag |
| 4.5 | Memory browser in Settings |

**Acceptance tests:**
- [ ] "Remember that ACU Lane A deadline is March 15" persists across sessions
- [ ] New chat tagged `ACU` recalls ACU memories automatically
- [ ] Forget requires confirmation

---

### Phase 5 — Specialized Job Agents
**Goal:** Mode switch changes system prompt, tools, and UI context.

| Agent mode | Primary jobs |
|------------|--------------|
| **General** | Default chat + search + files |
| **Campaign OS** | Campaign timelines, lane tracking, doc cross-ref |
| **Cursor Script Writer** | Burt scripts, narration drafts |
| **Debate Prep** | Talking points, rebuttal cards |
| **County Workbench** | County docs, forms, checklists |
| **Document Organizer** | Rename, tag, folder cleanup proposals |
| **Codebase Auditor** | Repo structure, missing docs, dependency scan |
| **Opposition Research** | Source gathering, claim tracking |
| **Grant/Strategy Writer** | Outlines, grant language drafts |

Each mode = JSON config: `systemPrompt`, `enabledTools[]`, `defaultProjectTag`, `uiAccent`.

**Acceptance tests:**
- [ ] Switching mode changes behavior without new codebase
- [ ] "Write Burt script" in Script Writer mode produces on-brand draft
- [ ] "Audit repo" in Codebase Auditor searches + summarizes structure

---

### Phase 6 — Optional Enhancements (backlog)
- Web search tool (OpenAI hosted or custom)
- Electron/Tauri desktop shell (tray icon, global hotkey)
- Export conversation to markdown
- Scheduled index rebuilds
- Multi-user (not needed for v1)

---

## 10. OpenAI Responses API — Implementation Notes

Use the **Responses API**, not Assistants or raw Chat Completions.

```typescript
// Pattern (pseudocode — implement in Phase 1)
const response = await openai.responses.create({
  model: process.env.OPENAI_MODEL,
  instructions: SYSTEM_PROMPT,
  input: userMessage,
  tools: TOOL_DEFINITIONS,           // Phase 2+
  previous_response_id: lastResponseId, // optional state carry-forward
  stream: true,
});

// Tool loop: for each function_call in response.output
//   1. Run local handler
//   2. Submit function_call_output with matching call_id
//   3. Call responses.create again with accumulated input items
```

**References:**
- [Migrate to Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [Function calling](https://developers.openai.com/api/docs/guides/function-calling)
- [Using tools](https://developers.openai.com/api/docs/guides/tools)

---

## 11. Working With Ernie — Collaboration Protocol

| Role | Responsibility |
|------|----------------|
| **Ernie** | Product owner: priorities, folder paths, agent personalities, approve/reject previews, says when to write code |
| **Cursor** | Architecture, implementation, tests — **only when Ernie explicitly requests** |

### Session rhythm
1. Ernie reviews this plan and answers **Phase 0 open questions** (below).
2. Ernie says e.g. *"Start Phase 1, task 1.1"* — then Cursor scaffolds.
3. After each phase, Ernie runs acceptance tests and signs off before next phase.
4. Changes to scope go into `docs/PHASE_CHECKLIST.md`, not ad-hoc code.

### Phase 0 open questions for Ernie

1. **Final name:** Local Command Brain or CampaignOS Local Operator?
2. **Stack lock-in:** OK with React/Vite + Express + TypeScript?
3. **Default model:** `gpt-4.1-mini` for daily use, `gpt-4.1` for heavy tasks?
4. **Index roots:** Exact paths for all campaign folders?
5. **Project tags:** Complete list for memory + file tagging?
6. **First agent mode to build in Phase 5:** Which job matters most first?

---

## 12. Risk Register

| Risk | Mitigation |
|------|------------|
| Model gets unrestricted file access | Tool router + path validation only |
| Accidental mass delete | Confirm + backup + bulk limits |
| Index reads sensitive files | User controls roots; exclude patterns (e.g. `.env`, `node_modules`) |
| API key exposure | Backend only; never in frontend bundle |
| Large PDF/docx indexing slow | Async indexer, progress UI, skip binary blobs |
| OpenAI API cost | Default to mini model; token limits per request |

---

## 13. Success Metrics

| Phase | Done when |
|-------|-----------|
| 1 | Ernie uses it daily for chat instead of browser ChatGPT for local-context questions |
| 2 | Finds campaign files faster than Windows Search |
| 3 | Trusts file edits because preview/approve works every time |
| 4 | Project facts stick without re-explaining each session |
| 5 | At least one job agent saves measurable time per week |

---

## 14. Next Action

**Waiting on Ernie:**

> Review this plan. Answer the six Phase 0 questions. When ready, say: **"Start Phase 1"** (or name a specific task).

No application code will be written until that explicit go-ahead.

---

*Last updated: 2026-06-28 · Plan version 1.0*
