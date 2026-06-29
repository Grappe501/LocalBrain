# LocalBrain Command Layer v1.0

> **Universal entry point — the AI OS kernel's user interface.**  
> Architecture: [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) · Engine: ENG-CM-001 · PSP: [Product Strategy Phase](./LOCALBRAIN_PRODUCT_STRATEGY_PHASE.md)

---

## Purpose

Whether Steve is in Explorer, Code Studio, or a Living Workspace, he can always invoke:

```txt
Ctrl+Space  (global shortcut)
```

and type natural language. The command layer **routes** intent to the right engines — it does not hard-code one chatbot behavior.

```txt
"Find duplicate ACU reports"
"Generate the next Burt script"
"Move this project to archive after showing me the plan"
"What's blocking deployment for RedDirt?"
"Summarize the last closeout for LB-OS-001"
```

---

## Command routing (Executive OS)

```txt
Steve → ENG-EO-002 Chief of Staff → ENG-EO-003 Department Chief → specialist agents
Results → CoS synthesis → Steve
```

Direct studio routes remain for power users; **default path is CoS-first**.

---

```txt
1. Context-aware — knows active studio, project, file selection
2. Engine-routed — dispatches to FS, SR, ST, KC, AI, etc.
3. Preview-first — destructive intents produce plans, not actions
4. Unified transcript — one command history across studios
5. Fallback to chat — conversational multi-turn when routing is ambiguous
6. Safety-inherited — every path through ENG-PM-001 + ENG-LG-001
```

---

## UI Surfaces

### Command Bar (persistent)

Top of shell — always visible.

```txt
[ LocalBrain ] [ Project: RedDirt ▼ ] [ 🔍 Command or search... ] [ Ctrl+Space ]
```

| Element | Behavior |
|---------|----------|
| Project pill | Sets workspace context for all commands |
| Input | Typeahead: files, commands, recent intents |
| Ctrl+Space | Opens command palette (modal or expanded bar) |

**Slice 002:** UI shell + keyboard handler stub (no backend route).

### Command Palette (modal)

```txt
┌─────────────────────────────────────────────┐
│  What do you want to do?                     │
│  ┌─────────────────────────────────────────┐│
│  │ Find duplicate ACU reports_             ││
│  └─────────────────────────────────────────┘│
│  Suggestions:                               │
│    Search files...                          │
│    Generate Burt script...                  │
│    Show storage report...                   │
│  Context: RedDirt · Writing Studio · 2 files│
└─────────────────────────────────────────────┘
```

### Inline command (studio-embedded)

Code Studio and Build panel accept commands in scoped mode:

```txt
/generate burt LB-OS-011
/audit requirements
/summarize selection
```

Slash commands = fast path to known intents.

---

## Context Model

Every command carries **context bundle**:

```txt
CommandContext
├── user_id              steve (local single-user V1)
├── active_studio        code | writing | explorer | workspace | system | ...
├── workspace_id         reddirt | localbrain | acu | ...
├── filesystem_selection [] paths (if any)
├── conversation_id      optional thread continuity
├── teach_mode           ON/OFF (OJT)
└── risk_ceiling         LOW default · MEDIUM with approval
```

Context inherited from UI state — not re-asked unless ambiguous.

---

## Intent Taxonomy

| Class | Examples | Primary engines |
|-------|----------|-----------------|
| **SEARCH** | find, locate, show files | SR, EX |
| **READ** | read, summarize, explain file | FS, AI |
| **STORAGE** | duplicates, large folders, free space | ST, DV |
| **PERFORMANCE** | CPU, RAM, what's slow | PF |
| **BUILD** | Burt script, next slice, MRIDs | KC, KD, AI, AG |
| **WRITE** | draft, rewrite, voice | KW, AI |
| **CAMPAIGN** | claims, debate prep | KM, KR, AI |
| **ORGANIZE** | move, archive, reorg plan | ST, DV, FS, PM |
| **DEPLOY** | checklist, readiness | KC, HL |
| **LEARN** | explain code, challenge | OJ, KL, AI |
| **META** | engine status, queue, health | KD, HL, CF |
| **CHAT** | general conversation | AI, MM |

Router classifies intent (rules first, AI fallback for ambiguity).

---

## Routing Flow

```txt
1. User submits text (+ optional slash command)
2. Build CommandContext from UI
3. Classify intent (router.ts)
4. If HIGH risk class (ORGANIZE, destructive) → plan-only mode
5. Dispatch:
     a. Direct engine call (SEARCH, PERFORMANCE) — no LLM
     b. AI orchestration with tool allowlist (BUILD, WRITE, READ)
     c. Multi-engine pipeline (STORAGE: ST → summarize → AI)
6. Stream results to:
     - Active studio panel (primary)
     - Context panel (sources, approvals)
     - Command history
7. Log ENG-LG-001 entry with intent class + engines invoked
```

---

## Intent → Engine Routing Table

| Intent | Engines (order) | Approval |
|--------|-----------------|----------|
| SEARCH | SR → EX | No |
| READ | PM → FS → AI | No |
| STORAGE report | ST → DV | No |
| STORAGE cleanup | ST → AI → proposed_action | Yes |
| PERFORMANCE | PF | No |
| BUILD Burt | KD → KC → AI → AG | No (output is packet) |
| BUILD execute | — | Human assigns Cursor |
| ORGANIZE move | ST → DV → PM → proposed_action | Yes |
| WRITE draft | KW → AI → FS draft | Gated write |
| DEPLOY check | KC → HL | No |
| LEARN explain | OJ → KC → AI | No |
| CHAT | AI → MM | No |

---

## Example Flows

### "Find duplicate ACU reports"

```txt
Intent: STORAGE + SEARCH
Context: workspace=acu
→ ENG-SR-001 search "ACU reports"
→ ENG-ST-001 duplicate clusters on results
→ Return: ranked list in explorer/results panel
→ No approval
```

### "Generate the next Burt script"

```txt
Intent: BUILD
Context: workspace=localbrain, studio=code
→ ENG-KC-001 next slice from queue
→ ENG-KD-001 load slice spec + safety + engine registry status
→ ENG-AI-001 burt_script_writer agent
→ Output: markdown packet preview
→ Steve copies to Cursor or saves to docs/burt_packets/
→ No filesystem write without approval
```

### "Move this project to archive after showing me the plan"

```txt
Intent: ORGANIZE
Context: workspace=phatlip
→ ENG-ST-001 size/impact report
→ ENG-DV-001 confirm H: target archive path
→ ENG-AI-001 generate move plan (dry-run)
→ ENG-TL-001 create proposed_action
→ Steve approves in /actions
→ ENG-BK-001 backup → ENG-FS-001 move
```

---

## API

### POST /api/command

```json
{
  "text": "Find duplicate ACU reports",
  "context": {
    "studio": "workspace",
    "workspaceId": "acu",
    "selection": []
  }
}
```

**Response (streaming):**

```json
{
  "intent": "STORAGE",
  "engines": ["ENG-SR-001", "ENG-ST-001"],
  "resultType": "report",
  "approvalRequired": false,
  "payload": { }
}
```

**Slice:** 002 stub (echo) · 008 wire AI · full router post-011

---

## Slash Commands (V1 Set)

```txt
/search <query>
/read <path>
/summarize <path>
/storage
/health
/burt [slice-id]
/queue
/workspace <id>
/teach on|off
/help
```

Extensible via ENG-CF-001 registry.

---

## Command History

```txt
SQLite: command_history
- id, text, intent, workspace_id, studio, engines_json, created_at
```

Surfaces in Context panel · feeds ENG-MM-001.

---

## Pre-Flight Gate (Pillar 12 — ENG-TE-004)

Before routing to AI, command layer invokes pre-flight:

```txt
Can I answer from local memory first?     → ENG-MR-002
Can I send a smaller excerpt?             → ENG-AP-006
Can I use a cheaper model?                → ENG-PRV-001 / ENG-PRV-007
Can I reuse cached context?               → ENG-AP-002
Is this worth a deep model call?          → ENG-TE-002 budget + intent class
```

Then **ENG-PRV-001** selects provider+model (not direct OpenAI). Skip or downgrade when cheaper path succeeds.

---

## Safety Rules

```txt
ORGANIZE and destructive intents never auto-execute
Command layer cannot bypass ENG-PM-001
Agent tool allowlists still apply under ENG-AI-001
No shell execution via command layer in V1
Secrets never in command text logs (redact .env paths)
```

---

## LB-OS-002 Deliverables

```txt
[ ] CommandBar component (persistent)
[ ] Ctrl+Space opens palette UI (local state only)
[ ] Project pill (mock projects)
[ ] Command input with placeholder suggestions
[ ] POST /api/command stub returns { intent: "STUB", message: "..." }
[ ] No OpenAI wiring
```

---

## Self-Build Commands (Target)

When ENG-KC-001 + Burt generator live:

```txt
/burt next                    → next queue slice packet
/burt LB-OS-011               → specific slice packet
/queue status                 → slice progress table
/engines                      → registry status summary
/closeout template            → closeout markdown skeleton
```

These make **LocalBrain build LocalBrain** without leaving the shell.

---

*Command layer v1.0 · PSP deliverable · ENG-CM-001 · 2026-06-28*
