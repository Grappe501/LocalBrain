# LocalBrain OpenAI Integration Plan v1.0

> **Backend-only OpenAI via Responses API.**  
> API: [API Contract v1.0](./LOCALBRAIN_API_CONTRACT.md) · Tools: [Tool Registry v1.0](./LOCALBRAIN_TOOL_REGISTRY.md) · Agents: [Agent Registry v1.0](./LOCALBRAIN_AGENT_REGISTRY.md) · Search: [Search & Indexing Plan v1.0](./LOCALBRAIN_SEARCH_INDEXING_PLAN.md)

---

## Core Decision

LocalBrain should use the **OpenAI Responses API** through the backend only. The OpenAI platform docs now center agent-style development around Responses, tools/function calling, structured outputs, streaming events, conversations, and hosted tools, while older Assistants APIs are listed under legacy APIs.

References:
- [Migrate to Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [Function calling](https://developers.openai.com/api/docs/guides/function-calling)
- [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

---

## Prime Rule

```txt
The browser never sees the OpenAI API key.
Only the backend calls OpenAI.
Only the backend tool router can execute local tools.
```

---

## 1. Environment Variables

Root or backend `.env.local`:

```env
OPENAI_API_KEY=
LOCALBRAIN_DEFAULT_MODEL=gpt-4.1-mini
LOCALBRAIN_PORT=4545
LOCALBRAIN_FRONTEND_PORT=5174
```

**Never store:**

```txt
OPENAI_API_KEY in SQLite
OPENAI_API_KEY in frontend state
OPENAI_API_KEY in logs
OPENAI_API_KEY in browser localStorage
```

Settings table may store `default_model` (not secret). Key presence is derived at runtime for health/settings — **MRID:** LB-AI-001

---

## 2. Backend Modules

```txt
backend/src/openai/
  client.ts
  chatOrchestrator.ts
  prompts.ts
  modelConfig.ts
  structuredOutputs.ts
```

| Module | Role | Slice |
|--------|------|-------|
| `client.ts` | OpenAI SDK singleton, Responses API | 003 |
| `chatOrchestrator.ts` | Chat + tool loop | 003, 009 |
| `prompts.ts` | Base clause + agent system prompts | 003, 014 |
| `modelConfig.ts` | Resolve model from env + settings | 003 |
| `structuredOutputs.ts` | JSON schemas for machine-readable outputs | 009, 015 |

**MRIDs:** LB-AI-002, LB-AI-005, LB-AI-011

---

## 3. Chat Flow

```txt
User sends message
↓
Frontend POST /api/chat
↓
Backend loads conversation/project/agent context
↓
Backend calls OpenAI Responses API
↓
OpenAI may request tool
↓
Tool Router validates request
↓
Permission Engine approves/blocks
↓
Tool result returns to OpenAI
↓
Assistant final answer returns to frontend
↓
Conversation + tool logs saved locally
```

**MRIDs:** LB-AI-003, LB-AI-006, LB-AI-007

### Responses API call pattern

```typescript
// chatOrchestrator.ts — pseudocode

const model = modelConfig.resolve(); // env + settings

const response = await openai.responses.create({
  model,
  instructions: prompts.buildInstructions(agent, project),
  input: buildInputItems(history, userMessage),
  tools: toolRegistry.getOpenAISchemas(agent.allowed_tools_json),
});

for (const item of response.output) {
  if (item.type === 'function_call') {
    const result = await toolRouter.run(item, { conversationId, agentId });
    // append function_call_output; continue until assistant message
  }
}
```

```txt
strict: true on all tool schemas
additionalProperties: false on parameters
```

---

## 4. Initial Model Strategy

```txt
Default: gpt-4.1-mini
Heavy reasoning option: gpt-4.1 or current best reasoning model available in settings
Fast draft option: smaller low-cost model
```

Model choice should be configurable in **Settings**, because OpenAI model availability and pricing can change.

`modelConfig.ts` resolves: `settings.default_model` → `LOCALBRAIN_DEFAULT_MODEL` → hardcoded fallback.

**MRIDs:** LB-AI-005, LB-CONFIG-005 · **Slice:** 003

---

## 5. Tool Calling Strategy

LocalBrain should expose **only approved tool schemas** to OpenAI.

**Initial tools (slice 009):**

```txt
search_files
read_file
summarize_file
summarize_folder
```

**Write tools — not exposed until approval gates exist (slice 011):**

```txt
create_file_draft
preview_edit_file
apply_approved_edit
move_approved_file
delete_to_quarantine
restore_quarantined_file
```

**Forbidden tools — never exposed:**

```txt
run_shell_command
permanent_delete
auto_git_commit
auto_git_push
read_secret_file
scan_entire_drive
```

Tool flow:

```txt
function_call → toolRouter → permissionEngine → handler OR proposed_action
→ tool_calls log → function_call_output JSON to model
```

**MRIDs:** LB-AI-006, LB-AI-007, LB-TOOL-001–014

---

## 6. System Prompt Base Clause

Every agent prompt must include this clause (via `prompts.ts`):

```txt
You are LocalBrain, Steve's private local AI workbench.
You may request approved tools, but you do not directly control the filesystem.
Never ask to read secrets.
Never propose permanent delete.
Never propose shell execution.
For file changes, propose an action and wait for approval.
When using local files, show source paths.
Prefer dry-run plans before risky work.
```

Layers:

```txt
Layer 1: Base clause (above)
Layer 2: Agent system_prompt (agents table)
Layer 3: Project context (name, root, profile summary)
Layer 4: Conversation metadata (optional)
```

**MRID:** LB-AI-008 · **Slice:** 014

---

## 7. Structured Outputs

Use structured JSON for:

```txt
tool requests
source references
Burt/Cursor scripts
action proposals
risk summaries
file summaries
repo audits
```

This keeps LocalBrain from returning messy text when the backend needs machine-readable behavior.

Implemented in `structuredOutputs.ts` — Zod/JSON Schema definitions consumed by orchestrator and Burt pipeline.

**MRID:** LB-AI-011 · **Slice:** 009 (tool/source shapes), 015 (Burt packets)

---

## 8. Streaming

V1 can start **non-streaming** for speed of build. API Contract v1.0 uses JSON `POST /api/chat` response.

Add streaming after basic chat works:

```txt
LB-AI-009 — Response streaming (SSE; partial assistant message display)
LB-AI-010 — Tool activity streaming (live tool-call events to UI)
```

**MRIDs:** LB-AI-009, LB-AI-010 · **Priority:** P2 · **Status:** post–V1 core (after slice 010)

---

## 9. Error Handling

Friendly errors:

| Condition | User-facing message |
|-----------|---------------------|
| Missing API key | "OpenAI API key is missing. Add it to `.env.local`. Do not paste it into the browser." |
| Rate limit | "OpenAI returned a rate-limit error. Try again after a short pause." |
| Tool blocked | "LocalBrain blocked that tool request because it violates the safety model." |
| Forbidden path | "LocalBrain cannot access that path because it is outside approved folders or matches a protected pattern." |

Never log the API key. Sanitize `arguments_json` in `tool_calls`.

**MRID:** LB-AI-004 · **Slice:** 003

---

## 10. OpenAI MRIDs

```txt
LB-AI-001 — Secure API key loading
LB-AI-002 — OpenAI Responses API client
LB-AI-003 — /api/chat integration
LB-AI-004 — Friendly missing-key error
LB-AI-005 — Model configuration
LB-AI-006 — Tool/function calling bridge
LB-AI-007 — Structured tool response handling
LB-AI-008 — Agent-specific system prompts
LB-AI-009 — Streaming support
LB-AI-010 — Tool activity streaming
LB-AI-011 — Structured output contracts
```

| MRID | Priority | Slice | Status |
|------|----------|-------|--------|
| LB-AI-001–004 | P0 | 003 | PLANNED |
| LB-AI-005 | P1 | 003 | PLANNED |
| LB-AI-006–007 | P0 | 009 | PLANNED |
| LB-AI-008 | P1 | 014 | PLANNED |
| LB-AI-011 | P1 | 009/015 | PLANNED |
| LB-AI-009–010 | P2 | FUTURE | DEFERRED |

---

## Frontend Integration

```txt
POST /api/chat only — frontend never calls OpenAI
Display openaiKeyPresent from /api/health and /api/settings
No VITE_OPENAI_API_KEY
```

---

## Build Slices

| Slice | OpenAI deliverable |
|-------|-------------------|
| 003 | client, modelConfig, prompts base, basic chat, missing-key UX |
| 004 | Multi-turn history in DB |
| 009 | Tool loop, structuredOutputs (tool/source), LB-AI-006–007, LB-AI-011 |
| 014 | Agent prompts + filtered tools (LB-AI-008) |
| 015 | Burt structured output contracts |
| FUTURE | LB-AI-009–010 streaming |

---

## Security Checklist

```txt
[ ] OPENAI_API_KEY only in .env.local
[ ] Key never in SQLite, frontend, localStorage, or logs
[ ] health/settings expose present/missing only
[ ] Tool calls validated before execution
[ ] No Assistants API usage
[ ] Base safety clause in every agent prompt
[ ] Forbidden tools never registered with OpenAI
```

---

## V1 Acceptance (OpenAI)

```txt
[ ] Steve chats with real OpenAI responses (non-streaming)
[ ] Missing key shows friendly error in UI
[ ] Multi-turn history works
[ ] AI can search_files + read_file in chat
[ ] Tool results appear in assistant reply + sources panel
[ ] ACU agent changes behavior vs General
[ ] No secret content sent to OpenAI from blocked files
[ ] Structured tool results parse cleanly in backend
```

Aligns with [V1 North Star](./LOCALBRAIN_PRODUCT_DOCTRINE.md#v1-north-star).

---

*OpenAI integration plan version 1.0 · 2026-06-28*
