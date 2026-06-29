# LocalBrain Product Strategy Phase (PSP)

> **Status:** ✅ **APPROVED** — 2026-06-28 (Steve). LB-OS-002 unblocked.  
> **Trigger:** Ernie inflection point (2026-06-28) — vision outgrew v1 shell sketch; implement after engine map exists.  
> **North star:** [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md)

---

## Decision

```txt
PSP complete. LB-OS-002 is READY.

Steve locked:
  Home mock = localbrain (self-build meta workspace)
  Finance/CFO = briefing section only in 002 (not 9th context card)
  Module registration = after LB-OS-004 + LB-OS-106
```

**Why localbrain home:** First living workspace should teach the system to build itself.

**Burt packet:** [burt_packets/LB-OS-002.md](./burt_packets/LB-OS-002.md)

---

## What PSP Delivers

| # | Document | Job |
|---|----------|-----|
| 1 | [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) | Five layers, inverted AI-OS model, Living Workspaces, data flows |
| 2 | [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md) | Every engine: responsibility, deps, APIs, slice mapping |
| 3 | [Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md) | Every user-facing workspace as a lens on shared intelligence |
| 4 | [Command Layer](./LOCALBRAIN_COMMAND_LAYER.md) | Universal Ctrl+Space routing to engines |

**Supporting (already exist — PSP wires them in):**

```txt
Operating System Doctrine · Capability Map · Safety Model
Migration & Drive · OJT Academy · System Optimization
Agent Registry · Tool Registry · API Contract · Database Schema
Build Slice Queue v2 (LB-OS-001–096)
```

**Superseded for OS v2 planning (still valid for V1 safety):**

```txt
LOCALBRAIN_ARCHITECTURE.md          → bootstrap chat/workbench diagram
LOCALBRAIN_UI_UX_BLUEPRINT.md       → revise after PSP (LB-OS-002 packet)
```

---

## PSP Exit Criteria

```txt
[x] Master architecture describes all 5 layers and engine interaction
[x] Engine registry lists every engine with ID, deps, API surface, slice
[x] Studio blueprint defines every studio + Living Workspace object model
[x] Command layer defines intent routing, context, shortcuts, safety
[x] LB-OS-002 scope rewritten to match inverted architecture (not explorer+chat)
[x] Self-build path documented: which engines enable LocalBrain to generate its own slices
[x] Steve reviews and approves PSP before any LB-OS-002 code — 2026-06-28
```

---

## Architectural Commitment (Ernie)

### Invert the stack

**Wrong:**

```txt
Explorer
 └── AI Chat panel
```

**Right:**

```txt
LocalBrain (AI = OS kernel)
├── Command Layer          ← always available
├── Explorer View          ← one lens
├── Code Studio            ← one lens
├── Writing Studio
├── Campaign Studio
├── Research Studio
├── System Health
├── Projects (Living Workspaces)
└── Automation
```

Every screen is a **lens** on the same engines — not a separate app with bolted-on AI.

### Living Workspaces

Folders contain files. **Projects are living objects.**

Opening **RedDirt** shows health, architecture, git, conversations, Burt packets, requirements, build progress, deployment readiness, docs freshness, writing, decisions, risks, next actions — files are one tab, not the whole project.

Same model for grants, campaigns, novels, ACU, VoteMatch.

---

## Path to Self-Build (LocalBrain builds LocalBrain)

Steve's goal: **use LocalBrain to generate and execute its own build slices** with approval gates.

### Phase A — PSP (now, docs only)

Define engines so Burt knows *what exists* and *what to wire next*.

### Phase B — Shell as front door (LB-OS-002, post-PSP)

```txt
Command layer stub (UI only)
Studio router (empty studios, correct nav)
Living Workspace shell (project object page, mock data)
Context panel (optimization cards as designed)
NO premature explorer-first layout
```

### Phase C — Safety + execution core (LB-OS-003–010)

```txt
Permission engine → filesystem engine → search/index
Agent registry live → tool registry live → approval gates
Without these, self-build is unsafe
```

### Phase D — Reasoning bridge (LB-OS-008–011)

```txt
OpenAI orchestration engine
Burt script generator reads: queue + engine registry + requirement registry + project context
Output: paste-ready Cursor packet
```

### Phase E — Self-build loop (LB-OS-011+, automation engine later)

```txt
Steve: Ctrl+Space → "Generate LB-OS-00N Burt packet"
  ↓
Command layer → orchestration → burt_script_writer agent
  ↓
contextLoader pulls: slice spec, engine deps, safety rules, living workspace state
  ↓
Generated packet → preview → Steve approves
  ↓
Steve assigns to Cursor (or future: automation engine with approval)
  ↓
Closeout → memory engine + project intelligence update living workspace
  ↓
Next-slice recommendation from queue + registry gaps
```

### What "self-build" requires (minimum engine set)

| Engine | Why required for self-build |
|--------|----------------------------|
| Permission | Safe file reads for context |
| Filesystem | Read docs, write packets to approved paths |
| Search/index | Find relevant specs and code |
| Agent registry | `burt_script_writer` mode |
| Tool registry | Controlled read/summarize/draft |
| OpenAI orchestration | Generate scripts |
| Memory | Remember closeouts, decisions |
| Project intelligence | Living workspace context |
| Logging/audit | Every generated script logged |
| Automation (later) | Optional: trigger Cursor SDK runs |

**Gate for "self-build v1":** LB-OS-011 (Code Engineering Studio + Burt generator wired to registry).

**Gate for "self-build autonomous":** Automation engine + Cursor SDK + standing approval policy (post–024, policy-defined).

---

## PSP Work Order (Recommended Sequence)

### Step 1 — Master System Architecture (1–2 sessions)

Read existing pillar docs. Write unified layer model, inversion principle, Living Workspace data model, cross-engine flows.

### Step 2 — Engine Registry (1–2 sessions)

Enumerate every engine from master arch. Assign `ENG-*` IDs. Map to LB-OS slices. Mark bootstrap vs full vs deferred.

### Step 3 — Studio Blueprint (1 session)

Define each studio: purpose, routes, engines consumed, Living Workspace integration, V1 vs OS v2 scope.

### Step 4 — Command Layer (1 session)

Define Ctrl+Space UX, intent taxonomy, router rules, context inheritance, safety for destructive intents.

### Step 5 — Reconcile queue + UI (half session)

Update LB-OS-002 spec in queue v2 to match PSP. Revise UI blueprint shell section. Add PSP gate to Burt protocol.

### Step 6 — Steve review gate

No code until Steve signs off on four docs + revised LB-OS-002 intent.

---

## What Changes in LB-OS-002 (Post-PSP)

| Old LB-OS-002 assumption | New LB-OS-002 intent |
|--------------------------|----------------------|
| Explorer-left, chat-center | **Command-first shell**; explorer is a route/view |
| Four-region fixed layout | **Studio router** + persistent command bar + context panel |
| Dashboard = home | **Executive Briefing** home; workspace context = **localbrain** |
| Chat as primary center | **Chief of Staff command layer** primary; chat is one mode |
| Mock explorer tree | **Department nav placeholders** — no module manifests until 106 |
| Finance in context panel | **Finance & CFO briefing section only** — not 9th card in 002 |

Optimization placeholder cards remain — they are system-lens panels, correct in inverted model.

---

## Relationship to Existing Queue

```txt
LB-OS-001  ✅ scaffold (unchanged)
PSP        ✅ APPROVED — 2026-06-28
LB-OS-002  ▶ READY — [Burt packet](./burt_packets/LB-OS-002.md)
LB-OS-003+ unchanged order — cite engine IDs from registry
```

No new `LB-OS-###` slices for PSP — this is **Phase 0.5 documentation**, not implementation.

---

## Burt Rule (Updated)

```txt
1. PSP approved 2026-06-28 — execute LB-OS-002 per Burt packet.
2. LB-OS-002: localbrain home, CFO briefing-only, no OpenAI/filesystem/modules.
3. Every future slice packet lists: engines touched, domains, matrix cells.
4. Self-build packets must load Engine Registry + Slice Queue + Safety Model.
```

---

## Related Documents

| Doc | Role |
|-----|------|
| [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) | PSP deliverable 1 |
| [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md) | PSP deliverable 2 |
| [Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md) | PSP deliverable 3 |
| [Command Layer](./LOCALBRAIN_COMMAND_LAYER.md) | PSP deliverable 4 |
| [Build Slice Queue v2](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) | Execution map (002 paused) |
| [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) | Post-PSP planning apex (097+) |
| [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) | Life domains · four modes |
| [Accounting & CFO](./LOCALBRAIN_ACCOUNTING_CFO_DIVISION.md) | Finance domain — from the start |
| [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) | Thin core · plugins · LOC budgets |
| [Burt Script Generator Plan](./LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md) | Self-build output format |

---

*Product Strategy Phase · 2026-06-28 · blocks implementation until engine map exists*
