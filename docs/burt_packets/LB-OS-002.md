# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Active lane:** V1 OS Shell  
**Slice:** LB-OS-002  
**Generated:** 2026-06-28  
**PSP:** ✅ Approved — Steve locked home mock + CFO placement  
**Source:** [Build Slice Queue v2](../LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) · [Command Layer](../LOCALBRAIN_COMMAND_LAYER.md)

---

## Mission

Boot into the **inverted AI-OS shell** — Executive Briefing home, Chief of Staff command bar, department nav placeholders, Living Workspace context for **LocalBrain** (`localbrain`). Mock data only. No filesystem, no OpenAI, no module registration.

This slice is **shell first** on the build spine:

```txt
Shell first → Safety (003) → Registry (004) → Modularity (106) → Modules
```

---

## Steve decisions (locked)

| Decision | Value |
|----------|-------|
| PSP | **Approved** |
| Home / Living Workspace mock | **`localbrain`** — meta self-build teaches the system to build itself |
| Finance / CFO in 002 | **Briefing section only** — not a 9th context card |
| Module registration | **Not in 002** — after LB-OS-004 + LB-OS-106 |

---

## Executive domain / matrix

```txt
Executive domain(s): Executive
Matrix cell(s): Executive × Intelligence, Executive × Dashboards
Four mode(s): Think (briefing), Remember (workspace context stub)
```

---

## Context

LB-OS-001 scaffold exists (`frontend/`, `backend/`, `shared/`, health endpoint). PSP docs complete. LB-OS-002 is the first UI slice.

**Why `localbrain` home:** First living workspace should teach LocalBrain to build itself — not campaign ops (RedDirt).

---

## Hard boundaries

**Do not:**

```txt
Explorer-left + chat-center layout (pre-PSP — superseded)
Wire OpenAI or any LLM API calls
Read/index filesystem or show real paths from H:/
Register module manifests (LB-OS-106)
Implement permission engine (LB-OS-003)
Add 9th context card for Finance/CFO (briefing section only)
Label lead AI "assistant" anywhere in UI
```

**Allowed:**

```txt
Static/mock JSON for briefing, signals, context cards
POST /api/command stub returning { intent: "STUB", message }
Local React state for CommandBar, Ctrl+Space palette, Teach toggle
```

---

## Files to read first

```txt
docs/LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md
docs/LOCALBRAIN_ENGINE_REGISTRY.md
docs/LOCALBRAIN_STUDIO_BLUEPRINT.md
docs/LOCALBRAIN_COMMAND_LAYER.md
docs/LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md
docs/LOCALBRAIN_MODULAR_ARCHITECTURE.md
docs/LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md
docs/LOCALBRAIN_BURT_CURSOR_PROTOCOL.md
docs/LOCALBRAIN_SAFETY_MODEL.md
```

---

## Build

### Layout (persistent chrome)

```txt
Top:    CommandBar — "Chief of Staff" label, project pill (LocalBrain / localbrain),
        command input, Ctrl+Space palette stub, signals pill
Nav:    DepartmentNav — placeholders: Engineering, Creative, Data, Finance, …
        (static list — not module manifests until 106)
Center: Executive Briefing home (default) — letter layout, mock sections
Right:  ContextPanel — exactly eight placeholder cards
```

### Eight context cards (no 9th)

```txt
1. Storage Health
2. Performance Health
3. Drive Architecture
4. Cleanup Recommendations
5. API Performance
6. Token Economy
7. AI Provider
8. Neural Lab (Track B stub)
```

Each card: title + "Not connected" / "Planned" — no live metrics.

### Executive Briefing (default route `/`)

Mock sections per [Executive Briefing Model](../LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md):

```txt
Good morning, Steve.
Today's priorities · Calendar · Email · Projects at risk
Finance & CFO section (mock — compliance, budget lines)
Token spend · System health · Suggested focus
MWI footer stub
```

**Finance & CFO:** briefing text block only — not a context card.

### Living Workspace context

```txt
Active workspace: localbrain (LocalBrain meta / self-build)
Project pill and briefing header reference LocalBrain on H:/localAgent
Route /project/localbrain → workspace shell stub (mock signals) OR
  briefing embeds workspace strip — either OK if pill = localbrain
```

### Routes

```txt
/                    → Executive Briefing (default home)
/project/localbrain  → Living Workspace mock (mock signal cards)
/explorer            → stub page (not left-column spine)
/studio/*            → empty "coming after modularity gate" states
/learn               → Teach Me stub
/actions · /settings → stubs
```

### Backend

```txt
POST /api/command → { intent: "STUB", message: string } — no OpenAI
Safety banner in UI: "Filesystem tools not enabled until LB-OS-003+"
```

### Teach Me While We Build

Toggle in settings or learn area — UI state only (no OJT generator until LB-OS-026).

---

## Files to create (suggested)

```txt
frontend/src/shell/CommandBar.tsx
frontend/src/shell/DepartmentNav.tsx
frontend/src/shell/ContextPanel.tsx
frontend/src/shell/AppLayout.tsx
frontend/src/views/ExecutiveBriefing.tsx
frontend/src/views/LivingWorkspaceMock.tsx
frontend/src/views/stubs/ExplorerStub.tsx
frontend/src/data/mockBriefing.ts
frontend/src/data/mockLocalbrainWorkspace.ts
frontend/src/router.tsx
backend/src/routes/command.ts
```

Adjust to match existing scaffold patterns under `frontend/src/` and `backend/src/`.

---

## Files to modify

```txt
frontend/src/App.tsx (or main entry) — AppLayout + router
backend/src/index.ts — mount /api/command stub
README.md — build status line only if needed
```

---

## Validation

```bash
npm run check   # ✅ passed
npm run test    # ✅ passed
npm run dev     # http://localhost:5174
```

**Local visual test (review checklist):**

| Route / check | Expected |
|---------------|----------|
| `/` | Executive Briefing |
| `/project/localbrain` | Living Workspace mock |
| `/settings` | Teach Me toggle |
| `/learn` | Teach Me toggle |
| Ctrl+Space | Command palette |
| Command bar | POST `/api/command` → STUB |
| Context panel | Eight cards exactly |
| Briefing body | Finance & CFO — not card 9 |

Automated smoke: all routes HTTP 200; command API returns `{ intent: "STUB", ... }`.

---

## Exit criteria

```txt
[ ] Studio router — not explorer-first spine
[ ] Executive Briefing = default home
[ ] Living Workspace mock = localbrain
[ ] Chief of Staff command bar + signals pill
[ ] Department nav placeholders (not module manifests)
[ ] Eight context cards exactly
[ ] Finance & CFO in briefing only — not 9th card
[ ] Teach Me While We Build toggle stub
[ ] POST /api/command stub
[ ] No filesystem · No OpenAI · No module registration
```

---

## Commit message

```txt
feat: add LocalBrain OS shell with executive briefing and command stub
```

---

## Engines touched (stub/mock)

```txt
ENG-CM-001 — Command layer stub
ENG-ID-001 — Profile / teach toggle stub
ENG-CF-001 — Config stub
ENG-KP-001 — Living Workspace mock (localbrain)
```

---

## Closeout

Include OJT block placeholder when Teach toggle ON (manual prose until LB-OS-026).

**Next slice:** LB-OS-003 — Permission engine.
