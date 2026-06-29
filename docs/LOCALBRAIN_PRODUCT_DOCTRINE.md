# LocalBrain Product Doctrine v1.0

> **Owner:** Steve · **Repo:** `H:\localAgent`  
> **North star (identity & long-range vision):** [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md)  
> Architecture: [System Architecture v1.0](./LOCALBRAIN_ARCHITECTURE.md) · Safety: [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md)  
> **Status:** V1 safety + bootstrap scope — OS v2.0 defines product category

---

## Identity (V1 Bootstrap)

**LocalBrain is Steve's private, local AI command center** — the safe bootstrap toward the [Personal Operating System](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md).

```txt
Full vision: Local AI Operating System Shell — not an app inside the computer,
but the control layer over the computer.
```

---

## Core Promise

```txt
LocalBrain helps Steve move faster without losing control.
```

---

## Prime Directive

```txt
The user is always the final authority.
The AI may reason.
The tool router may execute.
The permission engine must protect.
The action log must remember.
```

---

## What LocalBrain Is

```txt
A local ChatGPT-style assistant
A file search engine
A project-aware knowledge system
A Burt/Cursor script generator
A safe filesystem operator
A campaign/project command brain
A future multi-agent workbench
```

---

## What LocalBrain Is Not

```txt
Not an unchecked autonomous agent
Not a system-wide file controller
Not a secret reader
Not a shell command runner in V1
Not a permanent delete tool
Not a cloud storage replacement
Not allowed to act silently
```

---

## Operating Philosophy

```txt
Search first.
Read safely.
Summarize clearly.
Propose before acting.
Preview before changing.
Backup before writing.
Quarantine before deleting.
Log everything.
```

---

## V1 North Star

LocalBrain V1 succeeds when Steve can say:

```txt
Find the latest Cursor report for ACU, summarize it, identify what changed, and write the next Burt script.
```

And LocalBrain can safely do it.

**Ship gate:** LB-SLICE-019

---

## Product Values

```txt
Local-first
User-controlled
Project-aware
Safety-first
Fast to use
Easy to extend
Built for Burt/Cursor workflows
Transparent about actions
```

---

## Future Vision

LocalBrain eventually becomes the private intelligence layer across Steve's work:

```txt
CampaignOS
ACU
CountyWorkbench
VoteMatch
SOS public site
AJAX Organizing Hub
Debate prep
Opposition research
Grant writing
Document organization
Local codebase auditing
```

---

## Non-Negotiable Rule

```txt
Never trade speed for unsafe control.
```

---

## Technical Alignment

LocalBrain implements this doctrine through:

| Principle | System component |
|-----------|------------------|
| User is final authority | Approval UI + pending actions |
| AI may reason | OpenAI Responses API |
| Tool router may execute | `backend/src/tools/toolRouter.ts` |
| Permission engine must protect | `backend/src/safety/permissionEngine.ts` |
| Action log must remember | `action_logs`, `tool_calls`, `local_data/logs/` |

OpenAI platform: **Responses API** (not deprecated Assistants API).  
Build order: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) · Execution: [Burt/Cursor Protocol v1.0](./LOCALBRAIN_BURT_CURSOR_PROTOCOL.md)

---

## Initial Scope (V1)

**Projects:** RedDirt · ACU · VoteMatch · CountyWorkbench · SOS Public · AJAX · Phatlip · General Files

**Agents:** `general_localbrain` · `burt_script_writer` · `codebase_auditor` · `campaignos_agent` · `acu_agent` · `countyworkbench_agent` · `votematch_agent` · `document_organizer` · `deployment_checklist_agent` · `debate_prep_agent`

See [Agent Registry v1.0](./LOCALBRAIN_AGENT_REGISTRY.md).

---

## Planning Status

| Doc | Status |
|-----|--------|
| Product Doctrine v1.0 | ✅ This document |
| System Architecture v1.0 | ✅ |
| Safety Model v1.0 | ✅ |
| Requirement Registry v1.0 | ✅ |
| Build Slice Queue v1.0 | ✅ |
| Burt/Cursor Protocol v1.0 | ✅ |
| V1 Implementation Plan v1.0 | ✅ |
| First-Run Setup Plan v1.0 | ✅ |
| Agent Registry v1.0 | ✅ |
| Tool Registry v1.0 | ✅ |
| Database Schema v1.0 | ✅ |
| API Contract v1.0 | ✅ |
| UI/UX Blueprint v1.0 | ✅ |
| OpenAI Integration Plan v1.0 | ✅ |
| Search & Indexing Plan v1.0 | ✅ |
| Burt Script Generator Plan v1.0 | ✅ |
| V1 Execution Package v1.0 | ✅ |
| Application code | ⬜ LB-SLICE-001 |

---

*Product doctrine version 1.0 · 2026-06-28*
