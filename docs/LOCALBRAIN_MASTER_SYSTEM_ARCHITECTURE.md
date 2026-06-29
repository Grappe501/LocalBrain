# LocalBrain Master System Architecture v1.0

> **Authoritative OS architecture** — supersedes [Architecture v1.0](./LOCALBRAIN_ARCHITECTURE.md) for product structure and engine design.  
> V1 safety, API patterns, and folder layout in Architecture v1.0 remain binding until revised.  
> PSP: [Product Strategy Phase](./LOCALBRAIN_PRODUCT_STRATEGY_PHASE.md) · Registry: [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md)

---

## 1. Architectural Thesis

### The inversion

LocalBrain is **not** a file explorer with an AI panel.

```txt
The AI is the operating system.
Views (explorer, studios, health) are lenses.
Engines do the work.
The command layer is the universal entry point.
Steve approves everything risky.
```

### One foundation

```txt
Layer 0 — Host Platform     Windows · Linux · macOS · server · cloud node
Layer 1 — LocalBrain Kernel permissions · registry · engines · agents · audit
Living Workspace            intelligence layer over H:/ project folders
Digital Twin                composed apex — CoS consults, does not reconstruct
Knowledge Sources           user-facing data abstraction (not "databases")
Foundational objects (10)   frozen — see Foundational Object Model
```

### North star

```txt
LocalBrain maps, reorganizes, and preserves Steve's digital life —
then becomes the primary interface for managing it.

Organized, fast, lean, backed up.
C:/ programs · H:/ work/data.
```

---

## 2. Layer Model (0–5)

```txt
┌─────────────────────────────────────────────────────────────┐
│  Layer 0 — Host Platform                                    │
│  Windows · Linux · macOS · future server · cloud node       │
│  Hardware · drivers · networking · GPU runtime · ACLs       │
├─────────────────────────────────────────────────────────────┤
│  Layer 5 — Universal Command Layer                          │
│  Chief of Staff · Ctrl+Space · intent · routing             │
├─────────────────────────────────────────────────────────────┤
│  Layer 4 — Productivity Studios (lazy-loaded modules)       │
│  Code · Writing · Campaign · Research · Social · SysAdmin   │
│  Living Workspace dashboard                                 │
├─────────────────────────────────────────────────────────────┤
│  Layer 3 — Knowledge Services                               │
│  Knowledge Engine · recall · graph · learning · OJT         │
├─────────────────────────────────────────────────────────────┤
│  Layer 2 — System Services                                  │
│  Explorer · storage · performance · backup · health         │
├─────────────────────────────────────────────────────────────┤
│  Layer 1 — LocalBrain Kernel                                │
│  Identity · permissions · agents · tools · workspace registry│
│  Memory domains · decision ledger · logging · automation    │
└─────────────────────────────────────────────────────────────┘
```

**Rule:** Layer 0 is **Host Platform** — portable, not Windows-only. Layer 1 is the **LocalBrain Kernel**. Layers 2–5 are the executive shell. LocalBrain does not replace Layer 0.

**Digital Twin:** Composed read model across layers — [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md). Chief of Staff consults it; does not rebuild Steve's world each session.

**Foundational objects (frozen):** [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md)

Host framing: [Operating System Doctrine — Host Platform](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md#host-platform-layer-0)

---

## 3. Layer 1 — LocalBrain Kernel

Invisible infrastructure. No direct UI except settings/debug. This layer **is** the LocalBrain Kernel.

| Engine | ID | One-line job |
|--------|-----|--------------|
| Identity & profile | ENG-ID-001 | Steve's preferences, roles, teach-toggle, home studio |
| OpenAI orchestration | ENG-AI-001 | Chat, tool loops, streaming, model routing |
| Agent registry | ENG-AG-001 | Agent modes, prompts, tool allowlists |
| Tool registry | ENG-TL-001 | Tool specs, risk tiers, router |
| Permission engine | ENG-PM-001 | Path rules, allowlist, approval requirements |
| Filesystem engine | ENG-FS-001 | Read, write, move, quarantine (gated) |
| Search/index engine | ENG-SR-001 | Full-text index, filters, semantic (later) |
| Knowledge graph | ENG-KG-001 | Entities, relations, cross-project links |
| Knowledge engine | ENG-KN-001 | Route queries to Knowledge Sources — [Knowledge Sources](./LOCALBRAIN_KNOWLEDGE_SOURCES.md) |
| Memory engine | ENG-MM-001 | Six memory domains — [Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) |
| Decision ledger | ENG-DL-001 | Binding architectural/business decisions — [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) |
| Digital Twin composer | ENG-DT-001 | Composed apex view for CoS — [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md) |
| Automation engine | ENG-AU-001 | Scheduled/triggered flows (approval-gated) |
| Settings/config | ENG-CF-001 | `.env` presence, feature flags, drive doctrine |
| Logging & audit | ENG-LG-001 | Action log, tool log, immutable audit trail |

**Pillar 11 (API path):** ENG-AP-001–007 — [Direct API Performance Engine](./LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md)

**Pillar 12 (economy + recall + pace):** ENG-TE-001–004, ENG-MR-001–003, ENG-LP-001–002 — [Token Economy Engine](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md)

**Pillar 13 (provider-neutral + GPU):** ENG-PRV-001–008 — [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md)

**Pillar 14 (neural lab):** ENG-NN-001–008 — Track B stubs until GPU

**Pillar 15 (evolution):** ENG-EV-001–006 — [AI Evolution](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md)

**Pillar 16 (Chief of Staff):** ENG-CS-001–004 — lead AI layer, not "assistant"

**Pillar 17 (Executive Office):** ENG-EO-001–008 — [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) — apex above studios

**Cross-cutting:** Every engine call passes through ENG-PM-001 + ENG-LG-001.

---

## 4. Layer 2 — System Services

Manage Steve's computer and H: workspace.

| Engine | ID | One-line job |
|--------|-----|--------------|
| Drive architecture | ENG-DV-001 | C:/H: map, placement, misplacement |
| Explorer service | ENG-EX-001 | Tree, metadata, previews (not the UI) |
| Storage optimizer | ENG-ST-001 | Large/dup/stale/bloat reports |
| Performance monitor | ENG-PF-001 | CPU/RAM/disk/process advisory |
| Backup manager | ENG-BK-001 | Pre-write snapshots, restore |
| Project registry | ENG-PR-001 | Registered roots = living workspace IDs |
| Environment manager | ENG-EN-001 | Node, ports, `.env` status (not values) |
| Version manager | ENG-VR-001 | Git status, branch, dirty state |
| Health monitor | ENG-HL-001 | Composite system + app health |

**Never clean first:** Storage and drive engines report before proposing actions.

---

## 5. Layer 3 — Knowledge Services

Understand Steve's work — feed studios and command layer.

| Engine | ID | One-line job |
|--------|-----|--------------|
| Project intelligence | ENG-KP-001 | Living Workspace aggregate |
| Documentation intelligence | ENG-KD-001 | Specs, closeouts, freshness |
| Code intelligence | ENG-KC-001 | Repo map, slice progress, tests |
| Writing intelligence | ENG-KW-001 | Drafts, voices, narrative state |
| Campaign intelligence | ENG-KM-001 | CampaignOS, assets, calendar |
| Research intelligence | ENG-KR-001 | Sources, claims, debate prep |
| Learning engine | ENG-KL-001 | Skill map, challenges, progress |
| OJT Academy | ENG-OJ-001 | Teach-while-build closeout extension |

Knowledge services **read** from index, memory, git, registry — they do not bypass permissions.

---

## 6. Layer 4 — Productivity Studios

User-facing workspaces. Each studio is a **composed view** over engines.

| Studio | Route | Primary engines |
|--------|-------|-----------------|
| Project Dashboard | `/project/:id` | KP, PR, VR, KD, MM |
| Explorer View | `/explorer` | EX, FS, SR, ST |
| Code Engineering Studio | `/studio/code` | KC, AI, AG, TL, FS |
| Writing Studio | `/studio/writing` | KW, AI, FS |
| Campaign Studio | `/studio/campaign` | KM, KW, AI |
| Research Studio | `/studio/research` | KR, SR, AI |
| Social Media Studio | `/studio/social` | KW, KM, AI |
| System Admin Studio | `/studio/system` | DV, ST, PF, BK, HL |
| OJT Academy | `/learn` | OJ, KL, KC |

**Doc:** [Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md)

---

## 7. Layer 5 — Universal Command Layer

Always available. Routes natural language to engines.

```txt
Ctrl+Space (global)
→ parse intent
→ attach context (studio, project, selection)
→ dispatch to engine(s)
→ stream results to active lens + context panel
```

**Doc:** [Command Layer](./LOCALBRAIN_COMMAND_LAYER.md)

Examples:

```txt
"Find duplicate ACU reports"        → SR + ST + KP
"Generate the next Burt script"     → AI + AG + KD + queue context
"Move this project to archive"      → ST + DV + PM → proposed_action
"What's blocking LB-OS-011?"        → KC + KD + MM
```

---

## 8. Living Workspaces

### Concept

A **Living Workspace** is the primary object Steve works on — not a folder path.

```txt
workspace_id: reddirt
filesystem_root: H:/RedDirt
type: campaign | codebase | grant | novel | hybrid
```

### Object model (logical)

```txt
LivingWorkspace
├── identity          name, type, roots, drive badges
├── health            composite score + signals
├── architecture      map, key folders, dependencies
├── version           git branch, dirty, last commit
├── conversations     recent AI threads (memory engine)
├── build             slice progress, Burt packets, requirements
├── deployment        readiness checklist
├── documentation     freshness, stale specs
├── writing           linked drafts, voices
├── decisions         logged choices (memory)
├── people            collaborators, roles (future)
├── risks             open issues, blockers
├── next_actions      AI + rule-based suggestions
└── files             explorer lens (one tab, not the whole object)
```

### Example — RedDirt

```txt
Health:        72% — 3 stale docs, deployment checklist incomplete
Architecture:  CampaignOS + Netlify + Supabase map
Git:           main · 2 commits ahead · clean
Conversations: debate prep thread (2h ago)
Burt packets:  LB-OS-011 pending
Requirements:  14 open MRIDs
Build:         slice 010 complete
Deployment:    staging green · prod checklist 6/9
Writing:       2 draft posts · voice: RedDirt-TownHall
Risks:         claims gate not run on latest script
Next:          Generate LB-OS-011 packet · run claims review
```

### Same pattern elsewhere

| Workspace | Type | Key signals |
|-----------|------|-------------|
| ACU | codebase | tests, auditor, slice queue |
| CountyWorkbench | hybrid | grants + code |
| VoteMatch | codebase | deployment, data pipeline |
| Phatlip | creative | writing + media |
| LocalBrain | meta | self-build progress, engine registry |

### Storage

```txt
SQLite: workspace_profiles, workspace_signals, workspace_links
Filesystem: project_profiles/*.json in local_data/
Source of truth for files: still H:/ folders
```

---

## 9. Request Flow (End-to-End)

```txt
Steve (Command or Studio UI)
    ↓
Frontend shell (studio router + context panel)
    ↓
Backend API
    ↓
Command router (if universal command) OR studio controller
    ↓
OpenAI orchestration (if reasoning needed)
    ↓
Tool router
    ↓
Permission engine ──deny──→ logged rejection → user message
    ↓ allow
Target engine(s): FS, SR, ST, KC, ...
    ↓
Logging & audit
    ↓
Response → update Living Workspace signals → UI
```

---

## 10. Data Architecture

```txt
H:/                     Steve's files (source of truth)
local_data/
  indexes/              search + drive snapshots
  backups/              pre-write copies
  quarantine/           soft deletes
  logs/                 structured logs
  project_profiles/     workspace JSON
SQLite                  agents, tools, actions, memory, metrics, workspaces
OpenAI API              reasoning (no file storage)
```

**Knowledge graph (later):** entities = projects, files, people, requirements, slices — edges = references, imports, duplicates.

---

## 11. UI Shell Model (Post-PSP)

```txt
┌──────────────────────────────────────────────────────────────┐
│ CommandBar (persistent) — search, Ctrl+Space, project pill │
├────────┬─────────────────────────────────────┬───────────────┤
│ Studio │  Active lens content                │ ContextPanel  │
│ Nav    │  (Living Workspace / Studio view)   │ Signals       │
│        │                                     │ Optimization  │
│        │                                     │ Approvals     │
│        │                                     │ Sources       │
└────────┴─────────────────────────────────────┴───────────────┘
```

- **Studio Nav** replaces chat-first sidebar
- **Home** defaults to last project or project picker — configurable in ENG-ID-001
- **Explorer** is `/explorer`, not the left spine of the whole app

---

## 12. Safety Architecture (Unchanged)

```txt
Think freely · Preview clearly · Ask approval · Act safely · Log everything · Undo when possible
```

```txt
ENG-PM-001 wraps every mutating call
ENG-BK-001 before writes/moves/deletes
ENG-LG-001 after every tool call
No ENG-AU-001 without explicit policy
```

Binding: [Safety Model](./LOCALBRAIN_SAFETY_MODEL.md)

---

## 13. Self-Build Architecture

LocalBrain extends itself through **documented engines + slice queue + Burt packets**.

```txt
Intent ("build next slice")
  → Command layer
  → burt_script_writer agent
  → contextLoader:
       Engine Registry (what exists)
       Slice Queue (what's next)
       Requirement Registry (MRIDs)
       Living Workspace: LocalBrain (meta)
       Safety Model
  → Generated packet
  → Steve approves
  → Cursor executes (human or future SDK)
  → Closeout → Memory + Project intelligence
  → Workspace signals update
```

**Minimum engines for self-build v1:** PM, FS, SR, AG, TL, AI, MM, KP, KD, KC

---

## 14. Migration from Architecture v1.0

| v1 concept | OS v2 mapping |
|------------|---------------|
| Chat Orchestrator | ENG-AI-001 |
| Tool Router | ENG-TL-001 |
| Permission Engine | ENG-PM-001 |
| File Index | ENG-SR-001 |
| Sidebar pages | Studio router (Layer 4) |
| Projects page | Living Workspace dashboard |
| Actions page | Approval flow across engines |

Keep v1 folder layout (`frontend/`, `backend/`, `shared/`) — engines are **logical modules** inside `backend/src/engines/`.

**Modular architecture (binding):** See [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md).

```txt
Core Kernel (~20k–40k LOC)     — command, permissions, AI router, tools, registry, shell
Essential OS (+40k–70k)        — explorer, index hooks, workspaces, approvals
Optional modules (lazy-loaded) — every studio/domain (CFO, Novel, Database Studio, …)
```

Target: **core repo under ~100k LOC**; full executive OS via plugins, not monolith.

---

## 15. Implementation Phasing

```txt
PSP (docs)           → Master arch, registry, studios, command
LB-OS-002            → Shell: command bar, studio router, workspace stub
LB-OS-003–004        → Permissions + project registry
LB-OS-106            → MODULARITY GATE — kernel boundaries + module loader
LB-OS-005–007        → Explorer + system engines
LB-OS-008–011        → AI + code studio (as module) + Burt generator
LB-OS-012–015        → Other studios bootstrap · V1 ship
LB-OS-016–024        → Migration · Personal OS
LB-OS-025–030        → OJT
LB-OS-031–038        → Optimization command
Post-038             → Knowledge graph full · automation · semantic search
```

---

## Document Hierarchy

```txt
LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md   ← ten frozen objects + layer stack
LOCALBRAIN_DIGITAL_TWIN.md
LOCALBRAIN_KNOWLEDGE_SOURCES.md
LOCALBRAIN_DECISION_LEDGER.md
LOCALBRAIN_MEMORY_DOMAINS.md
LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md  ← YOU ARE HERE
LOCALBRAIN_ENGINE_REGISTRY.md
LOCALBRAIN_STUDIO_BLUEPRINT.md
LOCALBRAIN_COMMAND_LAYER.md
LOCALBRAIN_MODULAR_ARCHITECTURE.md
LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md
LOCALBRAIN_PRODUCT_STRATEGY_PHASE.md
```

---

*Master system architecture v1.0 · PSP deliverable · 2026-06-28*
