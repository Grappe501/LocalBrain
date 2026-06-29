# LocalBrain Build Slice Queue v2.0

> **Authoritative execution map** for LocalBrain as **Local AI Operating System Shell**.  
> **Supersedes:** [Build Slice Queue v1.0](./LOCALBRAIN_BUILD_SLICE_QUEUE.md) — do not continue `LB-SLICE-002+`.  
> Doctrine: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Protocol: [Burt/Cursor Protocol v1.0](./LOCALBRAIN_BURT_CURSOR_PROTOCOL.md)

---

## Decision (2026-06-28)

```txt
LocalBrain = Local AI Operating System Shell
NOT = Chatbot + file tools
```

## Foundation Principle

```txt
Project folders ARE the filesystem folders.
The file explorer, folder manager, storage optimizer, project map,
and AI assistant are ONE foundation — not separate modules.
```

## Build spine (binding)

```txt
1. Shell first          — LB-OS-002
2. Safety second        — LB-OS-003
3. Workspace registry   — LB-OS-004  (LivingWorkspace — not "projects")
4. Modularity fourth    — LB-OS-106 (MODULARITY GATE)
5. Everything else      — registered modules only
```

Prevents studios/domains from hard-coding into the shell before module loader exists.

---

## Queue Rules

```txt
One slice = one Burt/Cursor execution packet = one commit.
Do not skip LB-OS-003 (permissions) before file intelligence or writes.
Do not add move/delete without LB-OS-010 approval gates.
Do not expand departments/studios before LB-OS-106 (MODULARITY GATE).
LB-OS-001 scaffold exists — PSP then LB-OS-002.
Dual-track: Track A slices ship on current hardware; Track B slices ship interfaces + stubs until GPU (see Dual-Track Roadmap).
Capability-first: request capabilities (Reasoning, Coding, …) not vendors — LB-OS-077+.
Coherence: every slice must map to Enterprise Capability Matrix — LB-OS-097+.
Four modes: Remember · Think · Do · Run — see Enterprise Capability Matrix.
```

---

## V1 Goal (OS Shell)

LocalBrain V1 boots into a **system dashboard** that can:

```txt
Browse files/folders
Search files/folders
Understand project folders
Show storage usage
Show large/duplicate/stale files
Show system health: CPU, RAM, disk
Chat with OpenAI API
Summarize approved files
Generate code/build scripts
Preview file actions
Require approval before edits/moves/deletes
Log every action
```

---

## Product Strategy Phase (PSP)

```txt
✅ APPROVED — 2026-06-28 (Steve)
Gate cleared for LB-OS-002
```

| Doc | Status |
|-----|--------|
| [Product Strategy Phase](./LOCALBRAIN_PRODUCT_STRATEGY_PHASE.md) | ✅ Approved |
| [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) | ✅ |
| [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md) | ✅ |
| [Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md) | ✅ |
| [Command Layer](./LOCALBRAIN_COMMAND_LAYER.md) | ✅ |

**Steve locked for LB-OS-002:**

```txt
Home mock:        localbrain (self-build meta workspace)
Finance/CFO:      briefing section only — not 9th context card
Module manifests: after LB-OS-004 + LB-OS-106 — not in 002
```

**Burt packet:** [burt_packets/LB-OS-002.md](./burt_packets/LB-OS-002.md)

---

## Critical path (post-PSP)

```txt
PSP approve
→ LB-OS-002  Executive shell mock
→ LB-OS-003  Permission engine
→ LB-OS-004  Workspace registry (LivingWorkspace)
→ LB-OS-106  Core kernel boundaries + module loader   ← MODULARITY GATE
→ LB-OS-005  Knowledge Explorer / search foundation
→ LB-OS-006+ Everything else (studios = registered modules only)
```

**LB-OS-106 status:** MOVED EARLY — required after LB-OS-004 and before LB-OS-005.

No department or studio expansion before LB-OS-106. See [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md).

---

## First Real Interface (LB-OS-002 — Post-PSP)

```txt
Top:    Command Bar (Ctrl+Space) + project pill
Nav:    Studio router — not explorer-first spine
Center: Active studio / Living Workspace lens
Right:  Context panel — optimization cards + approvals + signals
```

See [Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md) · [Command Layer](./LOCALBRAIN_COMMAND_LAYER.md) · [Burt packet LB-OS-002](./burt_packets/LB-OS-002.md).

**READY** — PSP approved; assign to Cursor/Burt.

---

## Queue at a Glance

| Slice | Name | Depends | Gate |
|-------|------|---------|------|
| **LB-OS-001** | Repo scaffold | — | ✅ Complete |
| **LB-OS-002** | OS Shell + executive briefing + command stub | 001, PSP | ✅ Complete |
| **LB-OS-003** | Filesystem permission engine v2 | 002 | ✅ Complete |
| **LB-OS-004** | Workspace registry (LivingWorkspace) | 003 | ✅ **Complete** |
| **LB-OS-106** | Core kernel + module loader | 004 | ✅ **Complete** — MODULARITY GATE |
| **LB-OS-005** | Knowledge Explorer + metadata index | 106 | ✅ **Complete** |
| **LB-OS-006** | Digital Asset Registry | 005 | ▶ **READY** |
| **LB-OS-007** | Digital Asset Intelligence Engine | 006 | Health · collections · cleanup |
| **LB-OS-008** | OpenAI chat command layer | 002, 004, 007 | AI commands |
| **LB-OS-009** | System health monitor (CPU/RAM/disk) | 002 | *Renumbered from old 007* |
| **LB-OS-010** | File read/summarize tools | 005, 008 | *Renumbered from old 009* |
| **LB-OS-011** | Approval-gated file management | 003, 010 | **V1 safety gate** |
| **LB-OS-012** | Engineering Department foundation | 010, 010.5, 011, 106 | Chief + workspace + Code Studio tab |
| **LB-OS-012.5** | Executive Program Office (EPO) | 011, 010.5, 106 | Mission control — Executive Office, read-only |
| **LB-OS-013** | Writing Department foundation | 008, 106 | Writing module |
| **LB-OS-014** | Database Department foundation | 106, 098 | Database Studio seed |
| **LB-OS-015** | Relationship Intelligence | 004, 106 | Contacts / CRM seed |
| **LB-OS-016** | Executive OS V1 milestone | 012–015 | **V1 ship** |
| **LB-OS-017** | AI Provider Management | 016, 008 | **Provider spine** — registry, router, vault, flight recorder |
| **LB-OS-018** | Drive architecture & migration planner | 017 | Migration start |
| **LB-OS-019** | Full filesystem mapping audit | 018 | Inventory |
| **LB-OS-020** | Executive consolidation briefing (Executive Intelligence) | 019 | Briefing · score · evidence providers · simulate |
| **LB-OS-020.5** | Phase 1 integration pass (Question Registry) | 020 | EQ map · measurable cohesion · 021 gate |
| **LB-OS-021** | H:/ project filing system builder | 020.5 | Filing taxonomy |
| **LB-OS-022** | ChatGPT knowledge import pipeline | 021 | Import |
| **LB-OS-023** | Project memory transfer engine | 022 | Memory |
| **LB-OS-024** | Legacy folder reorganization assistant | 023 | Reorg proposals |
| **LB-OS-025** | Personal system cutover plan | 024 | Cutover |
| **LB-OS-026** | LocalBrain Personal OS launch | 025 | **Personal OS launch** |
| **LB-OS-027** | OJT coding academy doctrine (embedded) | 016 | Academy start |
| **LB-OS-028** | Build-along teaching mode | 027 | Teach toggle + closeouts |
| **LB-OS-029** | Concept ladder + skill map | 028 | Curriculum map |
| **LB-OS-030** | Interactive challenges from real code | 029 | Challenges |
| **LB-OS-031** | Steve coding progress dashboard | 030 | Progress UI |
| **LB-OS-032** | Certification / portfolio evidence | 031 | **Academy complete** |
| **LB-OS-033** | System optimization doctrine (embedded) | 015 | Optimization start |
| **LB-OS-034** | C:/ and H:/ drive architecture mapper | 033 | Drive map |
| **LB-OS-035** | Storage cleanup intelligence | 034 | Storage reports |
| **LB-OS-036** | Duplicate and version resolution planner | 035 | Dup/version plans |
| **LB-OS-037** | CPU/RAM/disk performance monitor (full) | 033 | Performance full |
| **LB-OS-038** | Process and startup advisor | 037 | Advisory only |
| **LB-OS-039** | Safe cleanup execution center | 036, 010 | Gated cleanup |
| **LB-OS-040** | System efficiency dashboard | 038, 039 | **Optimization command** |
| **LB-OS-041** | Direct API performance doctrine (embedded) | 015 | API perf start |
| **LB-OS-042** | API usage monitor + rate-limit awareness | 041, 008 | Usage visible |
| **LB-OS-043** | Context cache + prompt-prefix strategy | 042, 005 | Cache live |
| **LB-OS-044** | Request queue + retry engine | 042 | Queue + backoff |
| **LB-OS-045** | Streaming response engine (full) | 008, 042 | Stream UX |
| **LB-OS-046** | Model router (fast/deep/code/writing) | 041 | Model routing |
| **LB-OS-047** | Local context compression engine | 043 | Compress before send |
| **LB-OS-048** | API performance dashboard | 042–047 | **API performance command** |
| **LB-OS-049** | Token economy doctrine (embedded) | 048 | Token economy start |
| **LB-OS-050** | Token usage logger | 049, 042 | Per-call attribution |
| **LB-OS-051** | Estimated cost monitor | 050 | $ estimates live |
| **LB-OS-052** | Project/client chargeback reports | 051 | Chargeback reports |
| **LB-OS-053** | Memory compression pipeline | 050, 023 | Layered memory |
| **LB-OS-054** | Chunked recall engine | 053, 005 | Recall before send |
| **LB-OS-055** | Style learning engine | 054 | User patterns |
| **LB-OS-056** | Learning pace + OJT adaptation | 055, 028 | Teach more/less |
| **LB-OS-057** | Token/Memory/Learning dashboard | 050–056 | **Token economy command** |
| **LB-OS-058** | Provider-neutral AI doctrine (embedded) | 057, **017** | Deepens 017 foundation |
| **LB-OS-059** | AI provider router interface | 058, 017 | Router extensions |
| **LB-OS-060** | OpenAI provider adapter | 059 | Hardening |
| **LB-OS-061** | Claude provider adapter placeholder | 059 | Anthropic stub |
| **LB-OS-062** | Grok provider adapter placeholder | 059 | xAI stub |
| **LB-OS-063** | Model capability registry | 059 | Model catalog |
| **LB-OS-064** | GPU server migration plan + bundle | 063, 065 | Cutover ready |
| **LB-OS-065** | Local model runtime adapter (Ollama) | 059 | Local stub |
| **LB-OS-066** | Provider cost/performance dashboard | 060–065 | Compare providers |
| **LB-OS-067** | Smart model selection engine | 063, 056 | **Provider-neutral AI** |
| **LB-OS-066** | Local Neural Network Lab doctrine | 065 | Neural lab start |
| **LB-OS-067** | GPU runtime environment plan | 063, 062 | Train + serve stack |
| **LB-OS-068** | Training data capture pipeline | 066 | Data capture |
| **LB-OS-069** | Dataset quality / privacy filter | 068 | Safe datasets |
| **LB-OS-070** | Fine-tuning experiment tracker | 069 | LoRA experiments |
| **LB-OS-071** | Local model adapter (train → serve) | 070, 063 | Deploy to Ollama |
| **LB-OS-072** | Small classifier training lab | 069 | Level 3 NNs |
| **LB-OS-073** | Steve-style writing fine-tune plan | 070 | Writing model |
| **LB-OS-074** | Burt script scoring model | 072 | Burt scorer |
| **LB-OS-075** | Local Neural Lab dashboard | 066–074 | **Neural lab** (Track B) |
| **LB-OS-076** | AI evolution + dual-track doctrine | 065 | Evolution start (Track A) |
| **LB-OS-077** | AI capability registry | 076 | Capabilities |
| **LB-OS-078** | Capability router | 077, 057 | Capability-first |
| **LB-OS-079** | Self-measurement pipeline | 078, 048 | Metrics |
| **LB-OS-080** | Outcome scorecard engine | 079 | Scorecard |
| **LB-OS-081** | Model preference learner | 080 | Preferences |
| **LB-OS-082** | AI Evolution dashboard | 080–081 | **AI evolution** |
| **LB-OS-083** | AI Chief of Staff doctrine | 082 | CoS start |
| **LB-OS-084** | Proactive signal engine | 083, 024 | Signals |
| **LB-OS-085** | Conflict/stale/version detectors | 084 | Detectors |
| **LB-OS-086** | Chief of Staff briefing UI | 085 | CoS UI |
| **LB-OS-087** | Executive Office doctrine | 086 | Exec office start |
| **LB-OS-088** | Chief of Staff orchestrator + dept routing | 087 | CoS delegates |
| **LB-OS-089** | Executive briefing (default home) | 088 | Morning brief |
| **LB-OS-090** | Calendar intelligence stub | 089 | Calendar |
| **LB-OS-091** | Email intelligence stub | 089 | Email gated |
| **LB-OS-092** | Department chief framework | 088 | Dept chiefs |
| **LB-OS-093** | Photography division stub | 092 | Photo |
| **LB-OS-094** | Podcast division stub | 092 | Podcast |
| **LB-OS-095** | Effectiveness metrics (MWI) | 079, 088 | Meaningful work |
| **LB-OS-096** | Executive Office home | 087–095 | Executive Office |
| **LB-OS-097** | Enterprise matrix + coherence | 096 | Matrix start |
| **LB-OS-098** | Data platform foundation | 097 | Data catalog |
| **LB-OS-099** | Database Studio | 098 | NL → SQL |
| **LB-OS-100** | Relationship intelligence | 098 | Contacts |
| **LB-OS-101** | Accounting & CFO division | 097, 088 | **CFO from start** |
| **LB-OS-102** | Novel Studio foundation | 104 | Creative |
| **LB-OS-103** | Research data connectors | 098, 099 | Research |
| **LB-OS-104** | Creative division + domain nav | 092 | Creative chief |
| **LB-OS-105** | Matrix UI + OJT real-work | 097, 026 | **Enterprise map** |

*(LB-OS-106 executes in Phase 1 — after 004, before 005 — not at end of queue.)*

---

## V4 Gates (Optimization + API Performance)

```txt
V1 SHIP                = LB-OS-015
MODULARITY GATE        = LB-OS-106   (after 004, before 005 — not optional)
PERSONAL OS            = LB-OS-024
OJT ACADEMY            = LB-OS-030
OPTIMIZATION COMMAND   = LB-OS-031–038
API PERFORMANCE        = LB-OS-039–046
TOKEN ECONOMY          = LB-OS-047–055
PROVIDER-NEUTRAL AI    = LB-OS-056–065
NEURAL LAB             = LB-OS-066–075  (Track B — stubs until GPU)
AI EVOLUTION           = LB-OS-076–082  (Track A)
CHIEF OF STAFF         = LB-OS-083–086  (Track A — CoS layer)
EXECUTIVE OFFICE       = LB-OS-087–096
ENTERPRISE DOMAINS     = LB-OS-097–105  (matrix-led — no new pillars)
```

**Modularity:** LB-OS-106 is part of V1 foundation (002–007 arc), not Phase 13.

**Product:** AI Executive Operating System [Dual-Track Roadmap](./LOCALBRAIN_DUAL_TRACK_ROADMAP.md) — 90–95% on Track A before GPU

Doctrine: [System Optimization](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md) · [Direct API Performance](./LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md) · [Token Economy](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md) · [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) · [Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md) · [AI Evolution](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md) · [Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md)

Academy: [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md)

---

## V2 Gates (Migration Arc)

```txt
V1 SHIP      = LB-OS-015   Daily-usable OS shell
MIGRATION    = LB-OS-016–023   Map, import, plan — reports before actions
PERSONAL OS  = LB-OS-024   Steve's primary interface for digital life
```

Drive doctrine: [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md)

```txt
C:/ = operating programs only
H:/ = work projects, data, archives, documents, repos, media, storage
```

```txt
OS Shell                  [██████████] LB-OS-002 ✅
Permissions + Projects    [██░░░░░░░░] LB-OS-003 ✅ · 004 next
Modular Core              [░░░░░░░░░░] LB-OS-106   MODULARITY GATE
Explorer + Index          [░░░░░░░░░░] LB-OS-005
Storage + Asset Intelligence [░░░░░░░░░░] LB-OS-006–007
System Health              [░░░░░░░░░░] LB-OS-009
AI Command Layer          [░░░░░░░░░░] LB-OS-008–009
Approval + File Ops       [░░░░░░░░░░] LB-OS-010
Studios (Code/Write/Soc)  [░░░░░░░░░░] LB-OS-011–013
Optimization Advisor      [░░░░░░░░░░] LB-OS-014
Release Candidate         [░░░░░░░░░░] LB-OS-015
Migration Arc             [░░░░░░░░░░] LB-OS-016–023
Personal OS Launch        [░░░░░░░░░░] LB-OS-024
OJT Coding Academy        [░░░░░░░░░░] LB-OS-025–030
Optimization Command      [░░░░░░░░░░] LB-OS-031–038
API Performance           [░░░░░░░░░░] LB-OS-039–046
Token Economy             [░░░░░░░░░░] LB-OS-047–055
Provider-Neutral AI       [░░░░░░░░░░] LB-OS-056–065
Neural Network Lab        [░░░░░░░░░░] LB-OS-066–075  Track B
AI Evolution              [░░░░░░░░░░] LB-OS-076–082  Track A
Chief of Staff            [░░░░░░░░░░] LB-OS-083–086  Track A
Executive Office          [░░░░░░░░░░] LB-OS-087–096
Enterprise Domains        [░░░░░░░░░░] LB-OS-097–105
```

---

## V1 Gates

```txt
V1 SHELL          = LB-OS-002   Dashboard + layout boot
MODULARITY GATE   = LB-OS-106   Kernel boundaries + lazy modules (before explorer/studios)
V1 SAFE           = LB-OS-010   Approval before edits/moves/deletes
V1 SHIP           = LB-OS-015   Release candidate
```

---

## v1 → v2 Migration

| Old (cancelled / merged) | New |
|--------------------------|-----|
| LB-SLICE-001 Repo scaffold | **LB-OS-001** ✅ |
| LB-SLICE-002 Basic chat UI | **LB-OS-002** OS shell (replaces) |
| LB-SLICE-003 OpenAI chat | **LB-OS-008** |
| LB-SLICE-004 SQLite | Woven into 003–010 (per-slice tables) |
| LB-SLICE-005 Permissions | **LB-OS-003** |
| LB-SLICE-006–007 Index/search | **LB-OS-005** + explorer |
| LB-SLICE-008 Read/summarize | **LB-OS-009** |
| LB-SLICE-009 Tool router | **LB-OS-008–009** |
| LB-SLICE-010–011 Approval/writes | **LB-OS-010** |
| LB-SLICE-012–013 Projects/repo map | **LB-OS-004–005** |
| LB-SLICE-014 Agents | Distributed across 008, 011–013 |
| LB-SLICE-015 Burt pipeline | **LB-OS-011** |
| LB-SLICE-016–019 Tests/wizard/ship | **LB-OS-014–015** |

---

# LB-OS-001 — Repo Scaffold ✅

**Status:** COMPLETE (from LB-SLICE-001)

**Delivered:** `frontend/`, `backend/`, `shared/`, `local_data/`, health endpoint, root scripts.

**Commit:** `chore: scaffold LocalBrain planning foundation`

---

# LB-OS-002 — OS Shell + Executive Briefing + Command Stub

**Status:** ✅ **COMPLETE** — 2026-06-28

**Depends on:** 001, PSP ✅

**Goal:** Shell first on the build spine. Boot into Executive Briefing home with **localbrain** workspace context. Mock only.

**Steve decisions (locked):**

```txt
Home:           localbrain — self-build teaches the system to build itself
Finance/CFO:    briefing section only — NOT 9th context card
No modules:     department nav = placeholders until LB-OS-106
```

**Burt packet:** [burt_packets/LB-OS-002.md](./burt_packets/LB-OS-002.md)

**Read first:**

```txt
LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md
LOCALBRAIN_ENGINE_REGISTRY.md
LOCALBRAIN_STUDIO_BLUEPRINT.md
LOCALBRAIN_COMMAND_LAYER.md
LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md
```

**Build:**

```txt
Executive briefing home (default route /)
Chief of Staff command bar + signals pill
Department nav placeholders (static — not manifests)
Living Workspace mock: localbrain (pill + /project/localbrain or embedded strip)
Eight context cards (Storage … Neural Lab) — no Finance card
Finance & CFO section inside briefing body only
Teach Me While We Build toggle (UI stub)
POST /api/command stub — no OpenAI
Safety banner: filesystem tools not enabled until LB-OS-003+
```

**Explicitly not in 002:**

```txt
No real filesystem access or indexing
No OpenAI / LLM API calls
No module registration (LB-OS-106)
No permission engine (LB-OS-003)
No 9th context card for CFO
```

**Do not:**

```txt
Explorer-left chat-center layout (pre-PSP — superseded)
Wire OpenAI · index files · read files · show real CPU metrics
Hard-code studios as app sections (placeholders only)
```

**Validation:**

```txt
npm run dev
npm run check
Manual: briefing home, localbrain context, 8 cards, CFO in briefing, CoS label
```

**Exit criteria:**

```txt
[ ] Default `/` = Executive Briefing mock
[ ] Active workspace context = localbrain (LocalBrain meta)
[ ] Chief of Staff command bar + signals pill — never "Assistant"
[ ] Department nav placeholders (not module manifests)
[ ] Exactly eight context placeholder cards
[ ] Finance & CFO section in briefing — NOT a context card
[ ] Teach Me While We Build toggle stub
[ ] CommandBar + Ctrl+Space palette (local state)
[ ] POST /api/command stub
[ ] /explorer is a route, not the left column of every view
[ ] No filesystem tools · No OpenAI · No module registration
```

**Commit:** `feat: add LocalBrain OS shell with executive briefing and command stub`

**Maps engines:** ENG-CM-001 stub, ENG-ID-001 stub, ENG-CF-001 stub, ENG-KP-001 mock (localbrain)

**Closeout:** OJT block when Teach toggle ON (manual until LB-OS-026).

**Next:** LB-OS-003 permissions → 004 registry → 106 modularity gate.

---

# LB-OS-003 — Filesystem Permission Engine v2

**Status:** ✅ **COMPLETE** — 2026-06-28

**Depends on:** 002

**Burt packet:** [burt_packets/LB-OS-003.md](./burt_packets/LB-OS-003.md)

**Goal:** Single permission engine for explorer, storage scan, AI tools, and file ops — plus **Settings UI** to inspect and test permissions.

**Build:**

```txt
backend/src/safety/permissionEngine.ts
backend/src/safety/pathValidator.ts
backend/src/safety/ignoreRules.ts
backend/src/safety/forbiddenPaths.ts
Forbidden path/pattern registry (Safety Model §6)
SQLite: settings, allowed_folders, permission_log (stub)
API: GET /api/safety/status|allowed|forbidden · POST /api/safety/test-path
Settings UI — Safety panel:
  Allowed folders (read-only)
  Forbidden paths (read-only)
  Permission test panel (path + allow/deny + reason)
  Safety status
```

**Rules:**

```txt
Normalize → resolve absolute → allowed root → not forbidden → size limits
Same engine for explorer, indexer, storage scan, tools
No file indexing or writes in this slice
```

**Local visual test:**

```txt
npm run dev → http://localhost:5174/settings
Safety status · allowed list · forbidden list · test C:/Windows denied · H:/localAgent allowed
```

**Exit criteria:**

```txt
[ ] Blocked paths rejected with clear reason (unit tests + test panel)
[ ] Allowed folder can be validated
[ ] Settings Safety panel shows folder config + test panel
[ ] Local visual test checklist passed
```

**Commit:** `feat: add filesystem permission engine v2`

**Maps v1 MRIDs:** LB-SAFE-001–002, LB-SAFE-010–011, LB-CONFIG-001–004, LB-UI-005

---

# LB-OS-004 — Workspace Registry (LivingWorkspace)

**Status:** ▶ **READY** — architectural spec locked 2026-06-28

**Depends on:** 003

**Doc:** [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) · **Burt packet:** [burt_packets/LB-OS-004.md](./burt_packets/LB-OS-004.md)

**Goal:** **`LivingWorkspace`** is the core object — not "Project Registry." A project is one `workspace_type`. Chief of Staff thinks in workspaces.

**Build:**

```txt
SQLite: living_workspaces, workspace_links (graph-ready), active_workspace
shared/src/workspace.ts — LivingWorkspace types
Workspace registry service + permission sync on filesystem_roots
API: GET/POST /api/workspaces · GET /api/workspaces/:id · POST select · GET links
Seed localbrain — full template (mission, phase, slices, executive_context, avatar/color/icon, flags)
Seed stubs: reddirt, acu, countyworkbench, votematch, general (roots where known)
Frontend: /workspace/:id dashboard · /project/:id → redirect
Command bar pill from active workspace registry
```

**Key fields:** `executive_context`, `workspace_avatar`, `workspace_color`, `workspace_icon`, flags (pinned/recent/favorite/archived/hidden/ai_recommended/needs_attention), graph-ready links (empty OK).

**Local visual test:**

```txt
npm run dev → http://localhost:5174/workspace/localbrain
Full template · pill from registry · /project/localbrain redirects
```

**Exit criteria:**

```txt
[ ] living_workspaces table — not "projects"
[ ] localbrain matches Living Workspace Model template
[ ] executive_context on localbrain
[ ] filesystem_roots sync to allowed_folders
[ ] /workspace/:id data-driven dashboard
[ ] Active workspace in command bar pill
[ ] Local visual test passed
```

**Commit:** `feat: add workspace registry and LivingWorkspace foundation`

**Maps engines:** ENG-WR-001 (workspace registry), ENG-KP-001, ENG-PM-001, ENG-CF-001

**Next:** LB-OS-106 MODULARITY GATE

---

# LB-OS-106 — Core Kernel Boundaries + Module Loader

**Status:** MOVED EARLY — required after LB-OS-004 and before LB-OS-005.

**Depends on:** 004

**Doc:** [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md)

**Goal:** MODULARITY GATE — no studio/department ships as hard-coded app sections after this.

**Build:**

```txt
backend/src/core/           — kernel only (README with LOC budget note)
backend/src/engines/        — shared services (existing paths migrate toward this)
backend/src/modules/        — empty + README; first manifests here
shared/moduleManifest.ts    — schema + types
moduleLoader.ts             — register manifests, lazy frontend routes, engine hooks
Shell nav reads manifests   — not hard-coded studio list
Seed manifests (stubs): shell-only placeholders until real modules land in 011+
```

**Module manifest (required fields for every domain after 106):**

```txt
module_id
name
domain
routes
permissions
tools
agents
data_sources
nav_placement
lazy_load_boundary
```

**Exit criteria:**

```txt
[ ] backend/src/core/ vs engines/ vs modules/ layout in repo
[ ] Module manifest schema in shared/
[ ] Module loader registers stubs; lazy route load on nav
[ ] No domain logic in permissionEngine or commandRouter
[ ] LB-OS-005+ and LB-OS-011+ blocked in Burt packets without manifest registration
```

**Commit:** `feat: add core kernel boundaries and module loader stub`

**Maps engines:** ENG-CF-001 (module loader), ENG-ID-001 (nav from manifest)

---

# LB-OS-005 — Knowledge Explorer (tree + metadata index)

**Depends on:** 106

**Doc:** [Knowledge Explorer](./LOCALBRAIN_KNOWLEDGE_EXPLORER.md) · **Burt packet:** [burt_packets/LB-OS-005.md](./burt_packets/LB-OS-005.md)

**Goal:** Browse approved workspace roots with **six lenses** — not a Windows Explorer clone. Map paths → KnowledgeSource → LivingWorkspace. Never scan all of H: on startup.

**Build:**

```txt
Indexer: background crawler, metadataExtractor, textExtractor (permission-gated)
SQLite: file_index, index_runs, FTS5
Knowledge Explorer UI at /explorer: lazy tree, lens tabs, workspace badges
Startup: registry → cached metadata → visible folders → background index
Search: file: · workspace: prefixes (+ path search)
Explain this folder: minimal API (workspace context; AI in 008+)
API: /api/knowledge-explorer/*, /api/index/*, /api/search
Filesystem registered as KnowledgeSource per workspace root
```

**Exit criteria:**

```txt
[ ] Tree shows approved workspace roots only — no full H: scan on startup
[ ] Nodes resolve to LivingWorkspace via filesystem_roots
[ ] file: and workspace: search work
[ ] Explain this folder returns workspace + metadata stub
[ ] Six lens tabs (non-Physical may stub)
[ ] Secrets/node_modules never indexed
```

**Commit:** `feat: add knowledge explorer tree and metadata index`

**Maps v1 MRIDs:** LB-SEARCH-001–012, LB-DB-006, LB-DB-014, LB-API-006–007

---

# LB-OS-006 — Digital Asset Registry

**Depends on:** 005

**Doc:** [Digital Asset Model](./LOCALBRAIN_DIGITAL_ASSET_MODEL.md) · **Burt packet:** [burt_packets/LB-OS-006.md](./burt_packets/LB-OS-006.md)

**Goal:** Central **Asset Registry** — everything Steve owns digitally, incrementally synced. Knowledge Explorer and CoS read the registry, not the raw filesystem on every action.

**Build:**

```txt
digital_assets table — fingerprint, kind, lifecycle, workspace_id, health stub
Migrate/evolve LB-OS-005 file_index → registry (single source of truth)
Incremental sync job (background, permission-gated, no full H: on startup)
Registry API: GET /api/assets, /stats, POST /sync
Knowledge Explorer tree reads registry metadata first
Asset kinds detector (extension/heuristic — document, code, photo, …)
```

**Exit criteria:**

```txt
[ ] Registry populated via incremental sync from approved roots
[ ] Lifecycle stage on each asset (mtime heuristics OK)
[ ] Explorer uses registry for node metadata
[ ] No full-drive scan on startup
[ ] file_index migration path clear (no duplicate indexes)
```

**Commit:** `feat: add digital asset registry foundation`

**Maps engines:** ENG-DAR-001

---

# LB-OS-007 — Digital Asset Intelligence Engine

**Depends on:** 006

**Doc:** [Digital Asset Model](./LOCALBRAIN_DIGITAL_ASSET_MODEL.md) · **Burt packet:** [burt_packets/LB-OS-007-asset-intelligence.md](./burt_packets/LB-OS-007-asset-intelligence.md)

**Goal:** Intelligence over the registry — **not** "Storage Intelligence Dashboard." Storage cleanup is one capability among health, collections, duplicates, and CoS signals.

**Build:**

```txt
Asset health scoring (good/poor signals per asset)
Collections engine — dynamic, not folders (seed: focus workspace, this week, stale)
Duplicate + version cluster detection from registry hashes/names
Dormant asset rollup for CoS ("N assets · X GB dormant")
Archive candidate proposals — suggest only, no delete (010+ for actions)
Executive Mode + search: duplicate: stale: archive: use registry
UI panel in Knowledge Explorer or /assets route
```

**Exit criteria:**

```txt
[ ] Per-asset health_score computed
[ ] ≥3 dynamic collections defined
[ ] Duplicate and dormant reports from registry
[ ] Cleanup is suggest-only
[ ] CoS/Executive insights cite registry stats
```

**Commit:** `feat: add digital asset intelligence engine`

**Maps engines:** ENG-DAI-001

---

# LB-OS-009 — System Health Monitor (CPU / RAM / Disk)

> **Renumbered:** was LB-OS-007 before Digital Asset track inserted. Implementation unchanged.

**Depends on:** 002

**Goal:** System administrator partner — monitor, don't reckless-optimize.

**Build:**

```txt
backend/src/system/healthMonitor.ts
Poll: CPU %, RAM used/total, disk used/free per volume
API: GET /api/system/health
Right panel System Health widget (live refresh)
History: system_metrics table (optional lightweight)
```

**V1 scope:**

```txt
Show CPU/RAM/disk · track over time
NO process kill · NO startup manager · NO service control
```

**Later (post-V1):** startup review, process management, cache cleanup, local models.

**Exit criteria:**

```txt
[ ] Dashboard shows live CPU, RAM, disk
[ ] Metrics refresh without exposing secrets
[ ] No destructive system actions
```

**Commit:** `feat: add system health monitor`

**New MRIDs:** LB-OS-007-001–003

---

# LB-OS-008 — OpenAI Chat Command Layer

**Depends on:** 002, 004

**Goal:** AI command interface in center workspace — routes to explorer context.

**Build:**

```txt
backend/src/openai/* — client, chatOrchestrator, modelConfig, prompts
POST /api/chat — Responses API, backend only
SQLite: conversations, messages
Center panel Chat tab wired to API
Command bar can send quick prompts
Project + active file context injected into prompts
openaiKeyPresent in health — never expose key
```

**Exit criteria:**

```txt
[ ] Multi-turn chat works
[ ] Missing key shows friendly error
[ ] Chat aware of selected project
[ ] No tools yet (LB-OS-010)
```

**Commit:** `feat: add OpenAI chat command layer`

**Maps v1 MRIDs:** LB-AI-001–005, LB-CHAT-001–006, LB-DB-001–005, LB-API-002–004

---

# LB-OS-010 — File Read / Summarize Tools

> **Renumbered:** was LB-OS-009.

**Depends on:** 005, 008

**Goal:** AI can read and summarize approved files from explorer selection.

**Build:**

```txt
Tool router + tool_calls log
Tools: search_files, read_file, summarize_file, summarize_folder
Wire chat to tool loop
Tool activity in right panel
Sources in center/right when AI cites files
```

**Exit criteria:**

```txt
[ ] "Summarize this file" works on explorer selection
[ ] search_files uses same index as explorer
[ ] Tool calls logged
[ ] Blocked paths stay blocked
```

**Commit:** `feat: add file read and summarize tools`

**Maps v1 MRIDs:** LB-AI-006–007, LB-AI-011, LB-TOOL-001–006, LB-FILE-001–005

---

# LB-OS-011 — Approval-Gated File Management

> **Renumbered:** was LB-OS-010.

**Depends on:** 003, 010

**Goal:** **V1 safety gate** — preview, approve, backup, log, quarantine.

**Build:**

```txt
proposed_actions + action_log tables
Approval panel in right context
Preview/diff for edits
Tools: create_file_draft, preview_edit_file, apply_approved_edit,
  move_approved_file, delete_to_quarantine, restore_quarantined_file
Backups + quarantine under local_data/
Actions route /actions — Pending/Approved/Rejected/Executed/Blocked
```

**Exit criteria:**

```txt
[ ] No move/edit/delete without approval
[ ] Backup before write
[ ] Every action logged
[ ] Quarantine only — no permanent delete
```

**Commit:** `feat: add approval-gated file management`

**Maps v1 MRIDs:** LB-SAFE-003–008, LB-FILE-006–011, LB-BACKUP-001–005, LB-UI-008–010, LB-DB-007–008, LB-DB-012–013

---

# LB-OS-012 — Engineering Department Foundation

**Depends on:** 010, 010.5, 011, **106**

**Spec:** [Engineering Department](./LOCALBRAIN_ENGINEERING_DEPARTMENT.md) · **Burt packet:** [LB-OS-012](./burt_packets/LB-OS-012.md)

**Gate:** Must ship as `modules/engineering-studio/` with manifest — department shell, not IDE.

**Goal:** Engineering Department with Chief routing, workspace dashboard, Code Studio tab, Engineering Score stub, Burt packet flow.

**Build:**

```txt
Engineering Department view (/studio/engineering)
Engineering Chief — Explain this project
Engineering Score stub (9 factors)
Code Studio workspace tab (read + chat, not Monaco IDE)
Burt: generate → preview → approve → export
GET /api/engineering/overview · /explain · /score
Specialist routing table (stubs)
```

**Not in 012:**

```txt
In-browser code editor · shell · git writes · API impact graph
```

**Exit criteria:**

```txt
[ ] Explain this project returns full envelope
[ ] Engineering Score visible on department home
[ ] Burt packet preview + export path (approval-gated)
[ ] Code Studio is tab inside department, not standalone product
[ ] Read-only except approved proposals
```

**Commit:** `feat: add Engineering Department foundation`

**Maps v1 MRIDs:** LB-BURT-001–010, LB-AGENT-003–004, LB-UI-007

---

# LB-OS-012 (legacy queue note) — superseded

*Former "Code Engineering Studio Foundation" content moved to Engineering Department spec. Code Studio = workspace inside department.*

---

# LB-OS-012 — Writing Dashboard Foundation

**Depends on:** 008, **106**

**Gate:** Module `modules/writing-studio/` + manifest.

**Goal:** Creative cockpit seed — modes and voices in workspace.

**Build:**

```txt
Center workspace: Write tab
Mode selector: blog, grant, speech, campaign, debate prep, etc.
Voice selector: Steve strategic, Kelly campaign, grant, etc.
Draft list per project (SQLite writing_drafts)
Chat + structured output for long-form
```

**Exit criteria:**

```txt
[ ] Write tab separate from generic chat
[ ] At least 3 modes + 3 voices selectable
[ ] Drafts persist locally
```

**Commit:** `feat: add writing dashboard foundation`

**New MRIDs:** LB-OS-012-001–004

---

# LB-OS-013 — Social Media Drafting Dashboard

**Depends on:** 012, **106**

**Gate:** Module `modules/social-studio/` + manifest.

**Goal:** Social drafting inside OS — no auto-publish in V1.

**Build:**

```txt
Center workspace: Social tab
Composer: platform, caption, thread mode
Repurpose from writing drafts (long → short)
Draft queue · theme tags
Export/copy only — no API posting
```

**Exit criteria:**

```txt
[ ] Create and save social drafts
[ ] Repurpose from writing draft works
[ ] No auto-publish
```

**Commit:** `feat: add social media drafting dashboard`

**New MRIDs:** LB-OS-013-001–003

---

# LB-OS-014 — System Optimization Advisor

**Depends on:** 006, 007

**Goal:** Advise and preview — connect storage + system health.

**Build:**

```txt
Optimization advisor agent / panel
Correlate: disk pressure + large folders + stale files + RAM usage
Generate cleanup plan → proposed_actions (LB-OS-010)
First-run wizard (9 steps) — API key, folders, safety, first index
Test harness for safety + core flows
Track system health over time (charts)
```

**V1 advisor scope:**

```txt
Suggest cleanup · preview plan · approve to execute
NOT: startup manager, process kill, service control
```

**Exit criteria:**

```txt
[ ] Advisor suggests cleanup from real metrics
[ ] Preview plan before any move/delete
[ ] First-run wizard completes
[ ] npm run test passes for core safety paths
```

**Commit:** `feat: add system optimization advisor and first-run wizard`

**Maps v1 MRIDs:** LB-FIRST-001–010, LB-UI-012, LB-TEST-*

---

# LB-OS-015 — LocalBrain Release Candidate

**Depends on:** 011–014

**Goal:** V1 ship — Steve can live in LocalBrain daily.

**Build:**

```txt
Operator docs · troubleshooting guide
Polish: responsive iPad, error states, empty states
Full V1 acceptance run (checklist below)
Version bump · release notes
```

**V1 acceptance:**

```txt
[ ] Boot to OS dashboard
[ ] Browse/search project folders
[ ] Storage + system health visible
[ ] Chat + summarize files
[ ] Approve move/edit/quarantine
[ ] Generate Burt script
[ ] Write + social drafts
[ ] Optimization suggestions with preview
[ ] No secrets committed · no whole-drive scan
```

**Commit:** `feat: LocalBrain v1.0.0 release candidate`

---

# Phase 3 — Migration & Personal OS Launch (LB-OS-018–026)

> **Final major build phase.** Map, reorganize, preserve Steve's digital life.  
> **Prerequisite:** [LB-OS-017 AI Provider Management](./LOCALBRAIN_AI_PROVIDER_MANAGEMENT.md) — provider spine before migration/GPU expansion.  
> Doctrine: [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md)  
> **Rule:** Reports and plans before any move/delete. No auto-cleanup.

---

# LB-OS-017 — AI Provider Management

**Depends on:** 016, 008

**Goal:** First-class AI operating environment — registry, credential vault, capability router, flight recorder, System UI + dock.

**Spec:** [AI Provider Management](./LOCALBRAIN_AI_PROVIDER_MANAGEMENT.md) · [Burt packet](./burt_packets/LB-OS-017.md)

**Build:**

```txt
backend/src/providers/ — manager, router, vault, flightRecorder, adapters
Refactor commandOrchestrator → router (no direct openaiClient from business logic)
GET/PUT /api/providers · POST verify · flight log query
UI /system/providers · dock API line (status · spend · tokens)
```

**Binding rule:** Nothing calls OpenAI/vendors directly — CoS → Capability Router → Provider Manager → Adapter.

**Commit:** `feat: add AI Provider Management foundation`

---

# LB-OS-018 — Drive Architecture & Migration Planner

**Depends on:** 017

**Goal:** Enforce C:/H: separation; migration planner shell.

**Build:**

```txt
Drive rules in permissionEngine: H: = project roots, C: = warn/block as project root
UI: drive badges, C: warning banner
Migration planner route /migration — phase checklist, dry-run status
Gate: no migration tool calls until inventory flag set (LB-OS-019)
```

**Exit criteria:**

```txt
[ ] C: cannot be registered as project folder without override + log
[ ] H: default for new project registration
[ ] Migration planner UI shows 018–026 arc
```

**Commit:** `feat: add drive architecture and migration planner`

---

# LB-OS-019 — Full Filesystem Mapping Audit

**Depends on:** 018

**Goal:** Read-only inventory of approved H: trees.

**Build:**

```txt
migration_inventory job — metadata only, permission-gated
Export migration_inventory.json + human report
Map: project → folder → file counts, types, staleness
No moves, no deletes
```

**Exit criteria:**

```txt
[ ] Full H: approved tree inventoried
[ ] Report exportable
[ ] Zero file mutations
```

**Commit:** `feat: add filesystem mapping audit`

---

# LB-OS-020 — Executive Consolidation Briefing (Executive Intelligence)

**Depends on:** 019

**Reframe:** First **Executive Intelligence** slice — LocalBrain reasons about the environment; primary output is an **Executive Consolidation Briefing**, not a candidate list.

**Goal:** Evidence-provider pipeline → Consolidation Score (ENG-CNS-001) → briefing-first UI → simulate → Executive Briefing hook. Decision-friction narratives. **No auto cleanup.**

**Spec:** [Consolidation Planner](./LOCALBRAIN_CONSOLIDATION_PLANNER.md) · [Burt packet](./burt_packets/LB-OS-020.md)

**Build:**

```txt
Pipeline: Registry → Evidence → Consolidation → Simulation → EIC Briefing → Proposals
shared/executiveIntelligenceCard.ts · consolidation providers · simulationEngine (shared)
GET /api/consolidation/briefing · /:category · POST /simulate
UI /migration/consolidation — EIC stack hero + drill-down tabs
Consolidation Score + Consolidation Opportunity on Executive Briefing
Action Pipeline: Recommendation → Simulation → Proposal → Approval (010)
```

**Exit criteria:**

```txt
[ ] Executive Intelligence Cards with universal seven scores
[ ] Simulation first-class on each card before Proposal
[ ] Executive Consolidation Briefing as primary surface
[ ] Consolidation Score with trend
[ ] Evidence providers extensible
[ ] Programs/Knowledge tabs stubbed
```

**Commit:** `feat: add evidence-based consolidation planner`

---

# LB-OS-020.5 — Phase 1 Integration Pass

**Depends on:** 020

**Objective:** **Every Executive Question has exactly one authoritative answer.** Measurable cohesion — not open-ended polish.

**Spec:** [Phase 1 Integration Pass](./LOCALBRAIN_PHASE1_INTEGRATION_PASS.md) · [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md) · [Burt packet](./burt_packets/LB-OS-020.5.md)

**Metrics (audit before → after):**

```txt
Cross-route links ≥ 90 · Orphan pages = 0 · Duplicate summaries = 0
EIC on all executive surfaces · Shell consistency 100% priority routes
Question Registry: 100% Phase 1 questions → one primary_route
```

**Exit criteria:**

```txt
[ ] Integration audit baseline + final metrics pass
[ ] questionRegistry.ts wired · EQ map on priority routes
[ ] No duplicate full answers across Briefing / EPO / System / departments
[ ] 021 blocked until gate passes
```

**Commit:** `fix: phase 1 integration pass — executive question registry and cohesion`

**Do not rush LB-OS-021** — future departments inherit this coherence.

---

# LB-OS-021 — H:/ Project Filing System Builder

**Depends on:** 020.5

**Goal:** Standard filing taxonomy for H: projects.

**Build:**

```txt
Filing templates per project type (ACU, campaign, civic, code)
Propose folder creates/renames — proposed_actions only
H:/ taxonomy doc generated for Steve review
```

**Exit criteria:**

```txt
[ ] Templates defined for major projects
[ ] Proposals require LB-OS-010 approval
```

**Commit:** `feat: add H drive project filing system builder`

---

# LB-OS-022 — ChatGPT Knowledge Import Pipeline

**Depends on:** 021

**Goal:** Import/map ChatGPT exports into project memory.

**Build:**

```txt
Parse export JSON/Markdown
Map threads → projects · index excerpts into file_index / memory tables
Import voice/strategy fragments to writing_voices
Scan exports for secrets — block patterns
```

**Exit criteria:**

```txt
[ ] Sample export imports successfully
[ ] Content searchable by project
[ ] No secrets imported
```

**Commit:** `feat: add ChatGPT knowledge import pipeline`

---

# LB-OS-023 — Project Memory Transfer Engine

**Depends on:** 022

**Goal:** Transfer Cursor reports, build docs, handoffs into unified memory.

**Build:**

```txt
Detect: CLOSEOUT, REPORT, HANDOFF, REGISTRY, QUEUE files on H:
Link to project registry · searchable memory graph
requirements + old plans indexed
```

**Exit criteria:**

```txt
[ ] ACU Cursor reports mapped and searchable
[ ] Build docs linked to projects
```

**Commit:** `feat: add project memory transfer engine`

---

# LB-OS-024 — Legacy Folder Reorganization Assistant

**Depends on:** 023

**Goal:** Execute approved reorg from plans (020–021) in batches.

**Build:**

```txt
Batch move executor — uses approval plans only
Preview each batch · backup · log · rollback path
AI assistant explains each batch before submit
```

**Exit criteria:**

```txt
[ ] Reorg runs only from approved plan
[ ] Every batch logged + backed up
```

**Commit:** `feat: add legacy folder reorganization assistant`

---

# LB-OS-025 — Personal System Cutover Plan

**Depends on:** 024

**Goal:** Steve sign-off — LocalBrain becomes primary interface.

**Build:**

```txt
Cutover checklist doc generator
Per-domain: ChatGPT · Cursor · Explorer · Notion replacements
Rollback plan if cutover fails
```

**Exit criteria:**

```txt
[ ] Checklist complete and signed off by Steve
[ ] Rollback documented
```

**Commit:** `feat: add personal system cutover plan`

---

# LB-OS-026 — LocalBrain Personal OS Launch

**Depends on:** 025

**Goal:** Personal OS launch — digital life mapped and preserved.

**Build:**

```txt
Final acceptance against migration + OS doctrine
Launch notes · operator guide update
Mark LocalBrain primary for Steve's H: work world
```

**North star:**

```txt
LocalBrain maps, reorganizes, and preserves Steve's digital life —
then becomes the primary interface for managing it going forward.
```

**Exit criteria:**

```txt
[ ] Migration inventory complete
[ ] Knowledge import verified
[ ] Steve uses LocalBrain as first-open app for H: work
[ ] ChatGPT/Cursor/Explorer reduced for mapped domains
```

**Commit:** `feat: LocalBrain personal OS launch`

---

# Phase 4 — OJT Coding Academy (LB-OS-025–030)

> **Teach Steve coding on the job** while building real systems.  
> Doctrine: [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md)  
> Patterns from freeCodeCamp (challenges, projects, certs) + Codecademy (paths, progress, portfolio).

---

# LB-OS-025 — OJT Coding Academy Doctrine (Embedded)

**Depends on:** 015

**Goal:** Academy doctrine lives inside the product, not docs only.

**Build:**

```txt
docs/LOCALBRAIN_OJT_CODING_ACADEMY.md linked in app About/Learn
Settings: "Teach Me While We Build" toggle (stored, default ON)
Closeout template includes empty OJT block section
/learn route shell (placeholder)
```

**Exit criteria:**

```txt
[ ] OJT doc accessible from UI
[ ] Toggle persists in settings
[ ] Closeout template has OJT section
```

**Commit:** `feat: embed OJT coding academy doctrine`

---

# LB-OS-026 — Build-Along Teaching Mode

**Depends on:** 025, 011

**Goal:** Automate teaching in closeouts and chat when toggle ON.

**Build:**

```txt
closeoutOjtGenerator.ts — fills OJT block from diff + slice metadata
Chat "explain this" for files and errors
Right panel: "Concepts this session"
Burt protocol updated — OJT block required when toggle ON
```

**Exit criteria:**

```txt
[ ] Closeout auto-includes OJT when toggle ON
[ ] Explain file/error works in code studio
```

**Commit:** `feat: add build-along teaching mode`

---

# LB-OS-027 — Concept Ladder + Skill Map

**Depends on:** 026

**Goal:** freeCodeCamp-style curriculum map tied to LB-OS slices.

**Build:**

```txt
concept_ladder table — concept, slice_unlock, broad/narrow, prerequisites
/learn UI: skill tree, locked/unlocked by completed slices
Broad concepts: React, TS, API, SQLite, permissions, etc.
```

**Exit criteria:**

```txt
[ ] Ladder shows concepts through LB-OS-015 minimum
[ ] Completing slice unlocks related concepts
```

**Commit:** `feat: add concept ladder and skill map`

---

# LB-OS-028 — Interactive Coding Challenges from Real Project Code

**Depends on:** 027

**Goal:** Codecademy-style challenges generated from LocalBrain repo.

**Build:**

```txt
Challenge generator: snippet from real file + question + sandbox read
Challenge types: predict output, fix bug, explain function, find file
Tied to concepts on ladder
No unsafe execution — read-only or isolated sandbox on H:
```

**Exit criteria:**

```txt
[ ] 10+ challenges from LocalBrain codebase
[ ] Challenge completion updates progress
```

**Commit:** `feat: add interactive coding challenges`

---

# LB-OS-029 — Steve Coding Progress Dashboard

**Depends on:** 028

**Goal:** Gamified progress — Codecademy-style.

**Build:**

```txt
/learn/progress — concepts mastered, slices done, challenge streak
Charts: weekly learning, concepts by category
Link slice closeouts to progress events
```

**Exit criteria:**

```txt
[ ] Dashboard reflects real slice + challenge completion
[ ] Steve sees broad + narrow concept counts
```

**Commit:** `feat: add coding progress dashboard`

---

# LB-OS-030 — Certification / Portfolio Evidence System

**Depends on:** 029

**Goal:** freeCodeCamp-style evidence — Steve built a real OS.

**Build:**

```txt
Export portfolio: slices, concepts, challenges, key commits (metadata only)
Certificates: "LocalBrain OS Shell", "Safety Engineer", "Migration Architect"
PDF/Markdown export for Steve's records
```

**Exit criteria:**

```txt
[ ] Portfolio export generates from real progress data
[ ] At least 3 certificate tiers defined
[ ] Steve can demonstrate learning path to a third party
```

**Commit:** `feat: add certification and portfolio evidence`

---

# Phase 5 — System Optimization & Performance Command Center (LB-OS-031–038)

> **Pillar 10:** Organized, fast, lean — C:/ programs, H:/ work.  
> Never clean first — inventory → reports → plan → approve → act.  
> Docs: [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md) · [Drive Plan](./LOCALBRAIN_DRIVE_ARCHITECTURE_PLAN.md) · [Storage Blueprint](./LOCALBRAIN_STORAGE_CLEANUP_BLUEPRINT.md) · [Performance Blueprint](./LOCALBRAIN_PERFORMANCE_MONITOR_BLUEPRINT.md)

---

# LB-OS-031 — System Optimization Doctrine (Embedded)

**Depends on:** 015

**Goal:** Pillar 10 doctrine in product + unified optimization flow entry.

**Build:** Settings/docs links · optimization flow state machine · dashboard cards wire to stubs

**Commit:** `feat: embed system optimization doctrine`

---

# LB-OS-032 — C:/ and H:/ Drive Architecture Mapper

**Depends on:** 031

**Goal:** C:/H: placement report + misplacement detection.

**Build:** driveMapper.ts · C:/H: gauges · misplaced-work-file list · extends LB-OS-016 rules

**Commit:** `feat: add C and H drive architecture mapper`

---

# LB-OS-033 — Storage Cleanup Intelligence

**Depends on:** 032

**Goal:** Storage, large-folder, stale, bloat reports on H:.

**Build:** Extends LB-OS-006 · per-project storage · node_modules/dist flags · recommendations card (read-only)

**Commit:** `feat: add storage cleanup intelligence`

---

# LB-OS-034 — Duplicate and Version Resolution Planner

**Depends on:** 033

**Goal:** Duplicate + multi-version plans — zero auto cleanup.

**Build:** Extends LB-OS-018 · latest-version rec · approval checklist generator

**Commit:** `feat: add duplicate and version resolution planner`

---

# LB-OS-035 — CPU/RAM/Disk Performance Monitor (Full)

**Depends on:** 031

**Goal:** Full performance metrics + history.

**Build:** Extends LB-OS-007 · system_metrics history · Performance Health card live

**Commit:** `feat: add full performance monitor`

---

# LB-OS-036 — Process and Startup Advisor

**Depends on:** 035

**Goal:** Advisory only — high-load processes, startup review suggestions.

**Build:** processAdvisor.ts · read-only process list · no kill/disable in V1

**Commit:** `feat: add process and startup advisor`

---

# LB-OS-037 — Safe Cleanup Execution Center

**Depends on:** 034, 010

**Goal:** Execute approved cleanup plans in batches.

**Build:** cleanupExecutor.ts · ties recommendations → proposed_actions → backup → log

**Commit:** `feat: add safe cleanup execution center`

---

# LB-OS-038 — System Efficiency Dashboard

**Depends on:** 036, 037

**Goal:** Unified command center — all four cards + optimization plan summary.

**Build:** `/system/efficiency` · unifies Storage, Performance, Drive, Cleanup cards · north star UX

**Exit criteria:**

```txt
[ ] Full optimization flow: map → reports → plan → approve → act
[ ] C:/H: · storage · performance visible in one view
[ ] Never cleans without approved plan
```

**Commit:** `feat: add system efficiency dashboard`

---

# Phase 6 — Direct API Performance Engine (LB-OS-039–046)

> **Pillar 11:** Own the API path — not ChatGPT/Cursor UI overhead.  
> Docs: [Direct API Performance Engine](./LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md)  
> References: [OpenAI rate limits](https://developers.openai.com/api/docs/guides/rate-limits) · [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)

---

# LB-OS-039 — Direct API Performance Doctrine (Embedded)

**Depends on:** 015

**Goal:** Pillar 11 in product; prompt structure rules; API Performance card wires to stubs.

**Build:** Settings/docs links · doctrine in orchestration config · stable-prefix prompt template skeleton

**Commit:** `feat: embed direct API performance doctrine`

---

# LB-OS-040 — API Usage Monitor + Rate Limit Awareness

**Depends on:** 039, 008

**Goal:** Token/request logging; 429 awareness; API Performance card partial live.

**Build:** `apiUsageMonitor.ts` · `api_usage_log` table · dashboard: key status, requests/min, token burn

**Commit:** `feat: add API usage monitor and rate limit awareness`

---

# LB-OS-041 — Context Cache + Prompt Prefix Strategy

**Depends on:** 040, 005

**Goal:** Cache stable system/project prefixes; invalidate on registry/settings change.

**Build:** `contextCache.ts` · prefix builder (stable → semi-stable → variable) · OpenAI cache-friendly ordering

**Commit:** `feat: add context cache and prompt prefix strategy`

---

# LB-OS-042 — Request Queue + Retry Engine

**Depends on:** 040

**Goal:** Queue heavy tasks; exponential backoff on rate limits; user-visible queue status.

**Build:** `requestQueue.ts` · priority lanes (interactive vs background) · retry policy

**Commit:** `feat: add API request queue and retry engine`

---

# LB-OS-043 — Streaming Response Engine (Full)

**Depends on:** 008, 040

**Goal:** End-to-end streaming to all studios + command layer; partial UI render.

**Build:** Extends `chatOrchestrator.ts` · SSE/WebSocket to frontend · stream cancel

**Commit:** `feat: add full streaming response engine`

---

# LB-OS-044 — Model Router (Fast / Deep / Code / Writing)

**Depends on:** 039

**Goal:** Route by intent class to appropriate model/tier; override in settings.

**Build:** `modelRouter.ts` · intent → model map · ENG-CM-001 integration

**Commit:** `feat: add model router for fast deep code writing modes`

---

# LB-OS-045 — Local Context Compression Engine

**Depends on:** 041

**Goal:** Summarize/index locally before send; excerpts only to API.

**Build:** `contextCompressor.ts` · ties ENG-SR-001 + summaries · token budget pre-check

**Commit:** `feat: add local context compression engine`

---

# LB-OS-046 — API Performance Dashboard

**Depends on:** 040–045

**Goal:** Unified API perf view — all Pillar 11 capabilities visible.

**Build:** `/system/api` or section in System Admin Studio · API Performance card fully live

**Exit criteria:**

```txt
[ ] Token usage visible with history
[ ] Queue status + rate-limit events shown
[ ] Context cache hit/miss metrics
[ ] Streaming status live
[ ] Model router mode visible per request class
[ ] No full-project re-upload in Burt generation path
```

**Commit:** `feat: add API performance dashboard`

---

# Phase 7 — Token Economy, Memory Recall & Learning Pace (LB-OS-047–055)

> **Pillar 12:** Visible $ · smart recall · adaptive teaching.  
> Docs: [Token Economy Engine](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md) · [Memory Recall](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md) · [Learning Pace](./LOCALBRAIN_LEARNING_PACE_ENGINE.md) · [Chargeback Model](./LOCALBRAIN_PROJECT_CHARGEBACK_MODEL.md)

---

# LB-OS-047 — Token Economy Doctrine (Embedded)

**Depends on:** 046

**Goal:** Pillar 12 in product; five-question pre-flight gate; Token Economy card stub wired.

**Build:** Doctrine in settings · `preFlightOptimizer.ts` skeleton · purpose taxonomy enum

**Commit:** `feat: embed token economy doctrine`

---

# LB-OS-048 — Token Usage Logger

**Depends on:** 047, 040

**Goal:** Every API call logs full chargeback schema.

**Build:** `openai_usage_log` table · hook in orchestrator · extends ENG-AP-001

**Commit:** `feat: add token usage logger with project attribution`

---

# LB-OS-049 — Estimated Cost Monitor

**Depends on:** 048

**Goal:** USD estimates, pricing table, budget warnings.

**Build:** `costEstimator.ts` · project monthly budgets · Token Usage + Estimated Spend card partial

**Commit:** `feat: add estimated cost monitor and budget warnings`

---

# LB-OS-050 — Project/Client Chargeback Reports

**Depends on:** 049

**Goal:** By project, client, agent, model, purpose reports + export.

**Build:** `chargebackReporter.ts` · `clients` + `project_client_map` · CSV/Markdown export

**Commit:** `feat: add project and client chargeback reports`

---

# LB-OS-051 — Memory Compression Pipeline

**Depends on:** 048, 021

**Goal:** Raw → summary → decision → chunk pipeline.

**Build:** `memoryCompressor.ts` · tables per [Memory Recall Architecture](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md)

**Commit:** `feat: add memory compression pipeline`

---

# LB-OS-052 — Chunked Recall Engine

**Depends on:** 051, 005

**Goal:** Recall before send; log recall hits and tokens saved.

**Build:** `chunkRecall.ts` · `GET /api/memory/recall` · pre-flight integration

**Commit:** `feat: add chunked recall engine`

---

# LB-OS-053 — Style Learning Engine

**Depends on:** 052

**Goal:** Local user style patterns inform agents and router.

**Build:** `styleLearning.ts` · `user_style_patterns` table

**Commit:** `feat: add style learning engine`

---

# LB-OS-054 — Learning Pace + OJT Adaptation

**Depends on:** 053, 026

**Goal:** Teach more/less, confidence, concept tracker.

**Build:** `learningPace.ts` · integrates OJT · Learning Pace card partial

**Commit:** `feat: add learning pace and OJT adaptation`

---

# LB-OS-055 — Token/Memory/Learning Dashboard

**Depends on:** 048–054

**Goal:** Unified Pillar 12 command center.

**Build:** `/system/economy` · four cards: Token Usage · Estimated Spend · Memory Efficiency · Learning Pace

**Exit criteria:**

```txt
[ ] Every API call logged with project/client attribution
[ ] Monthly $ by project visible
[ ] Recall hits and tokens-saved metrics shown
[ ] Learning pace controls work
[ ] Pre-flight gate runs before deep model calls
[ ] "RedDirt used $X this month" report generatable
```

**Commit:** `feat: add token memory learning dashboard`

---

# Phase 8 — Provider-Neutral AI + GPU-Ready Intelligence (LB-OS-056–065)

> **Pillar 13:** Router + adapters · GPU-ready · outcome learning.  
> Docs: [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) · [Model Router](./LOCALBRAIN_MODEL_ROUTER_STRATEGY.md) · [GPU Migration](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md) · [Local Fallback](./LOCALBRAIN_LOCAL_MODEL_FALLBACK_PLAN.md)

---

# LB-OS-056 — Provider-Neutral AI Doctrine (Embedded)

**Depends on:** 055, **017**

**Goal:** Pillar 13 doctrine embedded in product; deepens **LB-OS-017** foundation (router + adapters already live in 017).

**Note:** Core provider spine ships in **LB-OS-017**. This slice adds doctrine UI card + outcome-learning hooks without changing the 017 call path.

**Commit:** `feat: embed provider-neutral AI doctrine`

---

# LB-OS-057 — AI Provider Router Interface

**Depends on:** 056, 008

**Goal:** `AIProviderRouter` — single LLM entry; adapter plugin interface.

**Build:** `backend/src/providers/router.ts` · `AIProviderAdapter` interface · refactor orchestrator to call router

**Commit:** `feat: add AI provider router interface`

---

# LB-OS-058 — OpenAI Provider Adapter

**Depends on:** 057

**Goal:** Move OpenAI client behind adapter; first live provider.

**Build:** `openaiAdapter.ts` · wraps existing client · streaming normalized

**Commit:** `feat: add OpenAI provider adapter`

---

# LB-OS-059 — Claude Provider Adapter Placeholder

**Depends on:** 057

**Goal:** Anthropic adapter stub; health disabled until key configured.

**Commit:** `feat: add Claude provider adapter placeholder`

---

# LB-OS-060 — Grok Provider Adapter Placeholder

**Depends on:** 057

**Goal:** xAI adapter stub.

**Commit:** `feat: add Grok provider adapter placeholder`

---

# LB-OS-061 — Model Capability Registry

**Depends on:** 057

**Goal:** `model_capabilities` table; profiles fast/deep/code/writing/local.

**Commit:** `feat: add model capability registry`

---

# LB-OS-062 — GPU Server Migration Plan + Bundle Script

**Depends on:** 061, 063

**Goal:** Executable cutover — export bundle + runbook per [GPU Migration Plan](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md).

**Build:** `scripts/export-gpu-bundle.ts` · migration checklist in settings

**Commit:** `feat: add GPU server migration bundle and runbook`

---

# LB-OS-063 — Local Model Runtime Adapter (Ollama)

**Depends on:** 057

**Goal:** Ollama HTTP adapter; health check; zero-cost logging.

**Commit:** `feat: add Ollama local model adapter placeholder`

---

# LB-OS-064 — Provider Cost/Performance Comparison Dashboard

**Depends on:** 058–063

**Goal:** Compare providers by cost, latency, acceptance rate; AI Provider card live.

**Build:** `/system/providers` · extends usage_log with `provider_id`

**Commit:** `feat: add provider cost performance dashboard`

---

# LB-OS-065 — Smart Model Selection Engine

**Depends on:** 061, 054

**Goal:** Outcome learning; route by job profile + history; absorbs LB-OS-044 into provider-aware router.

**Build:** `smartModelSelector.ts` · `task_outcomes` table · ENG-PRV-007

**Exit criteria:**

```txt
[ ] No business logic calls OpenAI SDK directly
[ ] Router selects provider+model by profile
[ ] Outcomes logged: accepted, burt_ok, validation_ok, steve_revised
[ ] OpenAI + local Ollama adapters health-visible
[ ] Claude/Grok stubs present
[ ] GPU bundle export runs
```

**Commit:** `feat: add smart model selection engine`

---

# Phase 9 — Local Neural Network Lab (LB-OS-066–075)

> **Pillar 14:** Levels 1–4 · train smart, not ChatGPT-scale.  
> Docs: [Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md) · [Fine-Tuning](./LOCALBRAIN_FINE_TUNING_STRATEGY.md) · [Training Data](./LOCALBRAIN_TRAINING_DATA_PIPELINE.md) · [GPU Runtime](./LOCALBRAIN_GPU_MODEL_RUNTIME_PLAN.md)

---

# LB-OS-066 — Local Neural Network Lab Doctrine (Embedded)

**Depends on:** 065

**Goal:** Pillar 14 in product; Levels 1–4 scope; Level 5 boundary; Neural Lab card stub.

**Commit:** `feat: embed local neural network lab doctrine`

---

# LB-OS-067 — GPU Runtime Environment Plan

**Depends on:** 063, 062

**Goal:** Training venv + inference stack documented and checkable per [GPU Model Runtime Plan](./LOCALBRAIN_GPU_MODEL_RUNTIME_PLAN.md).

**Build:** `GET /api/lab/gpu/status` · requirements.txt for training venv · runbook in settings

**Commit:** `feat: add GPU runtime environment plan`

---

# LB-OS-068 — Training Data Capture Pipeline

**Depends on:** 066

**Goal:** Capture approved outputs into `training_examples` per [Training Data Pipeline](./LOCALBRAIN_TRAINING_DATA_PIPELINE.md).

**Commit:** `feat: add training data capture pipeline`

---

# LB-OS-069 — Dataset Quality / Privacy Filter

**Depends on:** 068

**Goal:** ENG-NN-004 — strip secrets, tier quality, dedupe.

**Commit:** `feat: add dataset quality and privacy filter`

---

# LB-OS-070 — Fine-Tuning Experiment Tracker

**Depends on:** 069

**Goal:** `fine_tune_experiments` table · experiment CRUD · metrics JSON.

**Commit:** `feat: add fine-tuning experiment tracker`

---

# LB-OS-071 — Local Model Adapter (Train → Serve)

**Depends on:** 070, 063

**Goal:** Deploy fine-tuned artifact to Ollama; register in ENG-PRV-006.

**Commit:** `feat: add train-to-serve local model adapter`

---

# LB-OS-072 — Small Classifier Training Lab

**Depends on:** 069

**Goal:** Train tiny models: project classifier, recall ranker, file importance — export + register.

**Commit:** `feat: add small classifier training lab`

---

# LB-OS-073 — Steve-Style Writing Fine-Tune Plan

**Depends on:** 070

**Goal:** QLoRA workflow + eval gate for writing model per [Fine-Tuning Strategy](./LOCALBRAIN_FINE_TUNING_STRATEGY.md).

**Commit:** `feat: add steve-style writing fine-tune plan and scripts`

---

# LB-OS-074 — Burt Script Scoring Model

**Depends on:** 072

**Goal:** Classifier/regressor for Burt packet quality; suggest before Steve sends to Cursor.

**Commit:** `feat: add Burt script scoring model`

---

# LB-OS-075 — Local Neural Lab Dashboard

**Depends on:** 066–074

**Goal:** `/lab` or `/system/lab` — experiments, datasets, GPU status, deploy queue.

**Exit criteria:**

```txt
[ ] Training capture on approved outputs only
[ ] Privacy filter blocks secrets in datasets
[ ] At least one experiment trackable end-to-end
[ ] Deploy path registers model with provider router
[ ] Neural Lab card live in context panel
[ ] Level 5 foundation training not exposed in UI
```

**Commit:** `feat: add local neural lab dashboard`

---

# Phase 10 — AI Evolution Engine (LB-OS-076–082) · Track A

> **Pillar 15:** Capability-first · self-measure · scorecard.  
> Docs: [AI Evolution](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md) · [Capability Architecture](./LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md) · [Self-Measurement](./LOCALBRAIN_SELF_MEASUREMENT_MODEL.md)

---

# LB-OS-076 — AI Evolution + Dual-Track Doctrine (Embedded)

**Depends on:** 065

**Goal:** Pillars 15–16 + dual-track in product; link docs from settings.

**Commit:** `feat: embed AI evolution and dual-track doctrine`

---

# LB-OS-077 — AI Capability Registry

**Depends on:** 076

**Goal:** `ai_capabilities` + `capability_providers` per [Capability Architecture](./LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md).

**Commit:** `feat: add AI capability registry`

---

# LB-OS-078 — Capability Router

**Depends on:** 077, 057

**Goal:** ENG-EV-002 — invoke by capability; provider adapters unchanged.

**Commit:** `feat: add capability-first router`

---

# LB-OS-079 — Self-Measurement Pipeline

**Depends on:** 078, 048

**Goal:** `ai_interaction_metrics` per [Self-Measurement Model](./LOCALBRAIN_SELF_MEASUREMENT_MODEL.md).

**Commit:** `feat: add self-measurement pipeline`

---

# LB-OS-080 — Outcome Scorecard Engine

**Depends on:** 079

**Goal:** Aggregates by capability · export · API for scorecard table.

**Commit:** `feat: add outcome scorecard engine`

---

# LB-OS-081 — Model Preference Learner

**Depends on:** 080

**Goal:** ENG-EV-005 updates `capability_preferences` from outcomes.

**Commit:** `feat: add model preference learner`

---

# LB-OS-082 — AI Evolution Dashboard

**Depends on:** 080–081

**Goal:** `/system/evolution` — scorecard, trends, overrides.

**Exit criteria:**

```txt
[ ] Capabilities registered with provider map
[ ] Router accepts capability not vendor
[ ] Every chat logs interaction metrics
[ ] Scorecard shows measured preferences
[ ] Steve can override preference per capability
```

**Commit:** `feat: add AI evolution dashboard`

---

# Phase 11 — AI Chief of Staff (LB-OS-083–086) · Track A

> **Pillar 16:** Proactive intelligence.  
> Doc: [AI Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md)

---

# LB-OS-083 — AI Chief of Staff Doctrine (Embedded)

**Depends on:** 082

**Commit:** `feat: embed AI chief of staff doctrine`

---

# LB-OS-084 — Proactive Signal Engine

**Depends on:** 083, 024

**Goal:** ENG-CS-001 — rank signals from KP, KG, KD, TE, EV.

**Commit:** `feat: add proactive signal engine`

---

# LB-OS-085 — Conflict, Stale, Version & Burt-Gap Detectors

**Depends on:** 084

**Goal:** ENG-CS-002 — concrete detectors for example CoS prompts.

**Commit:** `feat: add chief of staff detectors`

---

# LB-OS-086 — Chief of Staff Briefing UI

**Depends on:** 085

**Goal:** CommandBar signals pill · briefing drawer · Living Workspace strip.

**Exit criteria:**

```txt
[ ] Signals show evidence links
[ ] Snooze / dismiss / act flows
[ ] No auto-execute on signals
[ ] Works without GPU
```

**Commit:** `feat: add chief of staff briefing UI`

---

# Phase 12 — Executive Office (LB-OS-087–096) · Track A

> **Pillar 17:** AI Executive OS — above all studios.  
> Docs: [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) · [Briefing](./LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md) · [Departments](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md)

---

# LB-OS-087 — Executive Office Doctrine (Embedded)

**Depends on:** 086

**Commit:** `feat: embed executive office doctrine`

---

# LB-OS-088 — Chief of Staff Orchestrator + Department Routing

**Depends on:** 087, 078

**Goal:** ENG-EO-002/003 — Steve → CoS → dept chief → agents; never "assistant" label.

**Commit:** `feat: add chief of staff orchestrator and department routing`

---

# LB-OS-089 — Executive Briefing (Default Home)

**Depends on:** 088

**Goal:** `/` boots to briefing mock/live per [Executive Briefing Model](./LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md).

**Commit:** `feat: add executive briefing as default home`

---

# LB-OS-090 — Calendar Intelligence Stub

**Depends on:** 089

**Commit:** `feat: add calendar intelligence stub`

---

# LB-OS-091 — Email Intelligence Stub

**Depends on:** 089

**Goal:** classify → summarize → suggest — no auto-send.

**Commit:** `feat: add email intelligence stub`

---

# LB-OS-092 — Department Chief Framework

**Depends on:** 088

**Goal:** Chief agents + `reports_to` in registry; Engineering, Writing, Ops, Media, Research stubs.

**Commit:** `feat: add department chief framework`

---

# LB-OS-093 — Photography Division Stub

**Depends on:** 092

**Doc:** [Photography Division](./LOCALBRAIN_PHOTOGRAPHY_DIVISION.md)

**Commit:** `feat: add photography division stub`

---

# LB-OS-094 — Podcast Division Stub

**Depends on:** 092

**Doc:** [Podcast Division](./LOCALBRAIN_PODCAST_DIVISION.md)

**Commit:** `feat: add podcast division stub`

---

# LB-OS-095 — Effectiveness Metrics Engine

**Depends on:** 079, 088

**Goal:** Meaningful Work Index per [Effectiveness Metrics](./LOCALBRAIN_EFFECTIVENESS_METRICS.md).

**Commit:** `feat: add effectiveness metrics engine`

---

# LB-OS-096 — Executive Office Home

**Depends on:** 087–095

**Exit criteria:**

```txt
[ ] Default boot is Executive Briefing
[ ] CoS routes to department chiefs (not studio-first)
[ ] Lead AI never labeled assistant
[ ] MWI visible in briefing footer
[ ] Photography + Podcast division routes exist
```

**Commit:** `feat: add executive office home`

---

# Phase 13 — Enterprise Domains & Data (LB-OS-097–105) · Track A

> **Matrix-led** — no new pillars.  
> Docs: [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) · [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md)

---

# LB-OS-097 — Enterprise Matrix + Coherence Doctrine

**Depends on:** 096

**Goal:** Four modes embedded; coherence rule; matrix doc in product.

**Commit:** `feat: embed enterprise capability matrix doctrine`

---

# LB-OS-098 — Data Platform Foundation

**Depends on:** 097

**Doc:** [Data Platform](./LOCALBRAIN_DATA_PLATFORM.md)

**Commit:** `feat: add data platform catalog foundation`

---

# LB-OS-099 — Database Studio

**Depends on:** 098

**Doc:** [Database Studio](./LOCALBRAIN_DATABASE_STUDIO.md)

**Commit:** `feat: add database studio stub`

---

# LB-OS-100 — Relationship Intelligence Engine

**Depends on:** 098

**Doc:** [Relationship Intelligence](./LOCALBRAIN_RELATIONSHIP_INTELLIGENCE.md)

**Commit:** `feat: add relationship intelligence stub`

---

# LB-OS-101 — Accounting & CFO Division

**Depends on:** 097, 088

**Doc:** [Accounting & CFO](./LOCALBRAIN_ACCOUNTING_CFO_DIVISION.md) — **from the start**

**Commit:** `feat: add CFO division ledger schema and chief agent`

---

# LB-OS-102 — Novel Studio Foundation

**Depends on:** 092

**Doc:** [Novel Studio](./LOCALBRAIN_NOVEL_STUDIO.md)

**Commit:** `feat: add novel studio foundation stub`

---

# LB-OS-103 — Research Division Data Connectors

**Depends on:** 098, 099

**Doc:** [Research Division](./LOCALBRAIN_RESEARCH_DIVISION.md)

**Commit:** `feat: add research division data connector stubs`

---

# LB-OS-104 — Creative Division + Domain Nav

**Depends on:** 092

**Goal:** `creative_chief`, Novel/Writing routes, domain nav update.

**Commit:** `feat: add creative division and domain navigation`

---

# LB-OS-105 — Enterprise Matrix UI + OJT Real-Work Linker

**Depends on:** 097, 026

**Goal:** `/system/matrix` gap view · OJT lessons from today's domain work.

**Exit criteria:**

```txt
[ ] Matrix columns/rows visible with gap highlights
[ ] CFO finance section in executive briefing
[ ] Finance domain + cfo_chief in registry
[ ] Data catalog stub · Database Studio route
[ ] Novel Studio route stub
[ ] Coherence rule in Burt protocol
```

**Commit:** `feat: add enterprise matrix UI and real-work OJT linker`

---

## LB-OS-106 (reference)

Executed in **Phase 1** immediately after LB-OS-004 — see [LB-OS-106](#lb-os-106--core-kernel-boundaries--module-loader) above. **MODULARITY GATE** — not repeated at end of queue.

---

## Burt Rule (Effective Immediately)

```txt
Do NOT continue LB-SLICE-002 or any old LB-SLICE-00N queue item.
Use LB-OS-### IDs only for new packets.
Prerequisite docs for LB-OS-002:
  Product Strategy Phase (PSP) ✅ docs written · ⬜ Steve approval
  Master System Architecture ✅
  Engine Registry ✅
  Studio Blueprint ✅
  Command Layer ✅
  Migration & Drive Doctrine ✅
  OJT Coding Academy ✅
  System Optimization + blueprints ✅
  Direct API Performance Engine ✅
  Token Economy + Memory + Learning Pace ✅
  Provider-Neutral AI + GPU docs ✅
  Neural Network Lab docs ✅
  Executive Office + Enterprise docs ✅
  queue LB-OS-001–105 documented ✅
Next: Assign [LB-OS-002 Burt packet](./burt_packets/LB-OS-002.md) → Cursor execute
```

---

## Related Documents

| Doc | Role |
|-----|------|
| [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) | North star |
| [Capability Map](./LOCALBRAIN_CAPABILITY_MAP.md) | Pillars |
| [Explorer Blueprint](./LOCALBRAIN_EXPLORER_SYSTEM_BLUEPRINT.md) | Explorer detail |
| [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md) | Binding safety |
| [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md) | Teach while building |
| [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md) | C:/H: · migration arc |
| [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md) | Pillar 10 · four layers |
| [Drive Architecture Plan](./LOCALBRAIN_DRIVE_ARCHITECTURE_PLAN.md) | C:/H: mapper |
| [Storage Cleanup Blueprint](./LOCALBRAIN_STORAGE_CLEANUP_BLUEPRINT.md) | Duplicates · bloat |
| [Token Economy Engine](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md) | Pillar 12 · $ + recall + pace |
| [Memory Recall Architecture](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md) | Layered memory |
| [Project Chargeback Model](./LOCALBRAIN_PROJECT_CHARGEBACK_MODEL.md) | Billing schema |
| [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) | Pillar 13 |
| [GPU Server Migration Plan](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md) | GPU cutover |
| [Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md) | Pillar 14 |
| [AI Evolution Engine](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md) | Pillar 15 |
| [AI Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md) | Pillar 16 |
| [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) | Pillar 17 · AI Executive OS |
| [Department Organization](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md) | Dept chiefs |
| [Performance Monitor Blueprint](./LOCALBRAIN_PERFORMANCE_MONITOR_BLUEPRINT.md) | CPU/RAM/disk |
| [Build Slice Queue v1.0](./LOCALBRAIN_BUILD_SLICE_QUEUE.md) | **Superseded** |

---

*Build slice queue version 2.0 · 2026-06-28 · Steve/Ernie OS Shell direction*
