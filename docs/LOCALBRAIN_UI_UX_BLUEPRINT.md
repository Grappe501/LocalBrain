# LocalBrain UI/UX Blueprint v1.0

> **Authoritative interface spec.** API: [API Contract v1.0](./LOCALBRAIN_API_CONTRACT.md) · OpenAI: [OpenAI Integration Plan v1.0](./LOCALBRAIN_OPENAI_INTEGRATION_PLAN.md)

---

## UI Doctrine

```txt
LocalBrain should feel like ChatGPT crossed with a local command center.
Simple chat in the middle.
Files, tools, approvals, and sources visible around it.
```

---

## Main Layout (LB-OS-002 OS Shell)

```txt
Top:    CommandBar — search, Ctrl+Space, project pill, Chief of Staff signals stub
Left:   ExplorerPanel — project/folder tree
Center: WorkspacePanel — Chat | File Preview | (future Write)
Right:  ContextPanel — optimization cards + AI Actions + Approvals
```

```txt
┌─────────────────────────────────────────────────────────────────┐
│ CommandBar                                                      │
├──────────┬────────────────────────────┬─────────────────────────┤
│ Explorer │  Workspace (tabs)          │  ContextPanel           │
│  ~240px  │                            │  ~320px                 │
│          │                            │  ┌─ Storage Health ────┐ │
│          │                            │  ├─ Performance Health│ │
│          │                            │  ├─ Drive Architecture│ │
│          │                            │  ├─ Cleanup Recs ─────┤ │
│          │                            │  ├─ API Performance ──┤ │
│          │                            │  ├─ Token Economy ─────┤ │
│          │                            │  ├─ AI Provider ───────┤ │
│          │                            │  ├─ Neural Lab ────────┤ │
│          │                            │  └─ Approvals ────────┘ │
└──────────┴────────────────────────────┴─────────────────────────┘
```

**MRIDs:** LB-UI-001 (shell), LB-UI-002 (explorer), LB-UI-011 (right panel), LB-UI-013 (optimization cards)

**Doc:** [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md) · Dashboard placeholders required from slice 002.

---

## Context & Performance Cards (LB-OS-002 Placeholders)

Eight cards in **ContextPanel** (scrollable). Stub data only until wired.

| Card | Live data slice | Placeholder copy |
|------|-----------------|------------------|
| **Storage Health** | 006 partial · 033 full | "Not connected — available after LB-OS-006" |
| **Performance Health** | 007 partial · 035 full | "Not connected — available after LB-OS-007" |
| **Drive Architecture** | 016 badges · 032 full | "Not connected — available after LB-OS-032" |
| **Cleanup Recommendations** | 014 advise · 033–034 | "No recommendations yet" |
| **API Performance** | 008 key · 040–046 | See below |
| **Token Economy** | 048–055 | See below |
| **AI Provider** | 056–065 | See below |
| **Neural Lab** | 066–075 | See below |

### API Performance card (Pillar 11 — core value prop)

```txt
OpenAI key status:     configured / not configured
Request mode:          Direct API
Streaming:             planned
Context cache:         planned
Rate-limit monitor:    planned
```

Partial live from LB-OS-008 (`openaiKeyPresent` on health endpoint). Full metrics LB-OS-040+.

### Token Economy card (Pillar 12 — work to your advantage)

```txt
Token monitor:        planned
Cost estimate:        planned
Project chargeback:   planned
Memory compression:   planned
```

Full dashboard LB-OS-055 expands into four cards: **Token Usage · Estimated Spend · Memory Efficiency · Learning Pace**.

### AI Provider card (Pillar 13 — not locked to OpenAI)

```txt
Active provider:        OpenAI
Provider router:        planned
Claude/Grok adapters:   planned
GPU server mode:        planned
Local model fallback:   planned
```

Live from 058: OpenAI adapter health · 063: Ollama dot · 064: comparison link.

### Neural Lab card (Pillar 14 — AI lab)

```txt
Local training:     planned
Fine-tune (LoRA):   planned
Classifiers:        planned
GPU lab mode:       planned
```

Full lab UI LB-OS-075 at `/lab`. Level 5 foundation training not exposed.

Each card: title · status line · optional "Learn more" link to in-app docs stub.

**Components:** `ContextCard.tsx` · `ApiPerformanceCard.tsx` · `TokenEconomyCard.tsx` · `AiProviderCard.tsx` · `NeuralLabCard.tsx` · `ContextPanel.tsx`

**Never show live metrics in 002** — layout and navigation only.

### Chief of Staff briefing strip (Pillar 16 — not a context card)

```txt
CommandBar: "Signals" pill (count) → briefing drawer stub
Living Workspace home: CoS strip above project signals — "No signals yet"
```

Live LB-OS-086. Proactive intelligence without GPU.

---

## Legacy Layout Note

Pre–OS-shell v1 wireframe (superseded by layout above for LB-OS-002+):

```txt
Left Sidebar     Main Work Area        Right Context Panel
Navigation       Chat/Search/etc.      Sources, tools, approvals
```

---

## Primary Screens

```txt
/chat
/search
/projects
/actions
/agents
/settings
/backups
```

---

## Sidebar Navigation

```txt
LocalBrain
- Chat
- Search
- Projects
- Agents
- Actions
- Backups
- Settings
```

**Component:** `Sidebar.tsx` · **Slice:** 002 · **MRID:** LB-UI-002

---

## Chat Screen

**Route:** `/chat` · **Slice:** 002–003, 009–010 · **MRID:** LB-UI-003

**Components:**

```txt
ChatPage
ChatWindow
MessageList
MessageBubble
ChatInput
AgentSelector
ProjectSelector
SourcePanel
ToolActivityPanel
```

**Must show:**

```txt
Selected agent
Selected project
Conversation messages
Tool activity
Local file sources
Pending approvals
```

**API:** `POST /api/chat`, conversations endpoints

**MRIDs:** LB-CHAT-001–004, LB-UI-008 (approvals in panel)

---

## Search Screen

**Route:** `/search` · **Slice:** 007 · **MRID:** LB-UI-004

**Components:**

```txt
SearchPage
SearchInput
SearchFilters
SearchResultsList
SearchResultCard
FilePreviewPanel
```

**Search result card shows:**

```txt
Filename
Path
Project guess
File type
Modified date
Excerpt
Read / Summarize button
```

**API:** `GET /api/search`, `POST /api/files/read`, `POST /api/files/summarize`

---

## Projects Screen

**Route:** `/projects` · **Slice:** 012 · **MRID:** LB-UI-006

**Purpose:**

```txt
Show LocalBrain's known workspaces.
Connect folders to project profiles.
```

**Initial projects:**

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

**API:** `GET /api/projects`, `POST /api/projects/:id/select`, `GET /api/projects/:id/profile`

---

## Agents Screen

**Route:** `/agents` · **Slice:** 014 · **MRID:** LB-UI-007

**Show cards for:**

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

**Each card shows:**

```txt
Purpose
Default project
Allowed tools
Blocked tools
Risk limit
Select button
```

**API:** `GET /api/agents`, `POST /api/agents/:id/select`

---

## Actions Screen

**Route:** `/actions` · **Purpose:** **This is the safety cockpit.**

**Slice:** 010–011 · **MRIDs:** LB-UI-008, LB-UI-009

**Tabs:**

```txt
Pending
Approved
Rejected
Executed
Blocked
```

**Action card shows:**

```txt
Action type
Risk level
Target path
Reason
Diff preview if edit
Approve button
Reject button
```

**API:** `GET /api/actions`, approve/reject endpoints

---

## Settings Screen

**Route:** `/settings` · **Slice:** 005 · **MRID:** LB-UI-005

**Sections:**

```txt
OpenAI status
Allowed folders
Forbidden rules
Default model
Default project
Default agent
File size limits
First-run reset
```

**Important rule:**

```txt
Never paste or display the OpenAI key in the browser.
Only show: key present / missing.
```

**API:** settings, folders, health (`openaiKeyPresent`)

---

## Backups Screen

**Route:** `/backups` · **Slice:** 011 · **MRID:** LB-UI-010

**Tabs:**

```txt
Backups
Quarantine
Restore History
```

**Quarantine card shows:**

```txt
Original path
Quarantine path
Date
Reason
Restore button
```

**API:** LB-API-013 (backups, quarantine, restore)

---

## First-Run Wizard UI

**Full-screen overlay** · **Slice:** 017 · **MRID:** LB-UI-012

**Steps:**

```txt
1. Welcome
2. API key status
3. Choose allowed folders
4. Confirm forbidden rules
5. Choose default project
6. Run first index
7. Run first search
8. Run first chat test
9. Safety confirmation
```

Spec: [First-Run Setup Plan v1.0](./LOCALBRAIN_FIRST_RUN_SETUP.md) · **MRIDs:** LB-FIRST-001–010

---

## Right Context Panel

**Always available on `/chat`.** · **MRID:** LB-UI-011

**Shows:**

```txt
Current project
Current agent
Files referenced
Tool calls
Pending approvals
Recent action logs
Safety warnings
```

**Components:** `SourcePanel`, `ToolActivityPanel`, `ApprovalPanel` (compact), `ActionLogPanel` (snippet)

---

## Approval UX

For any risky action:

```txt
AI proposes action
↓
Right panel shows pending approval
↓
User opens details
↓
Preview/diff shown
↓
Approve / Reject
↓
Result logged
```

**Button language:**

```txt
Approve This Action
Reject
View Diff
Create Backup & Apply
Move to Quarantine
Restore File
```

**MRIDs:** LB-UI-008, LB-SAFE-004, LB-SAFE-005

---

## Visual Priority

Most important UI principle:

```txt
Steve should always know:
What LocalBrain found
Where it found it
What it wants to do
Whether it already acted
How to undo it
```

---

## Mobile / iPad

V1 should be **desktop-first**, but not broken on iPad.

**Responsive behavior:**

```txt
Sidebar collapses
Right panel becomes drawer
Chat remains primary
Actions remain accessible
```

**MRID:** LB-UI-013 · **Slice:** 002+ (baseline), polish 017–019

---

## Component File Map

```txt
frontend/src/
  pages/
    ChatPage.tsx
    SearchPage.tsx
    ProjectsPage.tsx
    ActionsPage.tsx
    AgentsPage.tsx
    SettingsPage.tsx
    BackupsPage.tsx
  components/
    Sidebar.tsx
    ChatWindow.tsx
    MessageList.tsx
    MessageBubble.tsx
    ChatInput.tsx
    AgentSelector.tsx
    ProjectSelector.tsx
    SearchInput.tsx
    SearchFilters.tsx
    SearchResultCard.tsx
    FilePreviewPanel.tsx
    SourcePanel.tsx
    ToolActivityPanel.tsx
    ApprovalPanel.tsx
    ActionLogPanel.tsx
    DiffPreview.tsx
    FirstRunWizard.tsx
    RightContextPanel.tsx
```

---

## UI MRIDs

```txt
LB-UI-001 — App shell
LB-UI-002 — Sidebar navigation
LB-UI-003 — Chat screen
LB-UI-004 — Search screen
LB-UI-005 — Settings screen
LB-UI-006 — Project screen
LB-UI-007 — Agent screen
LB-UI-008 — Action approval panel
LB-UI-009 — Action history screen
LB-UI-010 — Backup screen
LB-UI-011 — Right context panel
LB-UI-012 — First-run wizard
LB-UI-013 — Responsive iPad layout
```

| MRID | Slice | Priority |
|------|-------|----------|
| LB-UI-001–003 | 002 | P0 |
| LB-UI-005 | 005 | P0 |
| LB-UI-004 | 007 | P0 |
| LB-UI-008 | 010 | P0 |
| LB-UI-009–010 | 011 | P1 |
| LB-UI-006 | 012 | P1 |
| LB-UI-007 | 014 | P1 |
| LB-UI-011 | 002+ | P0 |
| LB-UI-012 | 017 | P1 |
| LB-UI-013 | 002+ | P1 |

---

## V1 UI Acceptance

```txt
[ ] ChatGPT-style chat with agent + project visible
[ ] Right panel shows sources and pending approvals on /chat
[ ] Search cards show path, excerpt, actions
[ ] Actions cockpit: all 5 tabs work
[ ] Settings never displays API key value
[ ] Agent cards show tools + risk limit
[ ] First-run wizard completes 9 steps
[ ] iPad: sidebar collapses, right panel drawer
[ ] Steve can answer: what found, where, what proposed, what acted, how undo
```

---

*UI/UX blueprint version 1.0 · 2026-06-28*
