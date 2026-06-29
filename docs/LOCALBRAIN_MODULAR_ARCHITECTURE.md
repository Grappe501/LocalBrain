# LocalBrain Modular Architecture v1.0

> **Large product · small core.** Thin kernel + lazy-loaded modules.  
> **MODULARITY GATE:** LB-OS-106 — after 004, before 005. No studio expansion before 106.  
> Architecture: [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) · Matrix: [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md)

---

## Principle

LocalBrain is a **large executive operating system** in scope. It must **not** become a bloated monolith.

```txt
The danger is not lines of code.
The danger is tight coupling.
```

**Binding rules:**

```txt
LocalBrain core stays small.
Departments are plugins.
Data is indexed, not duplicated.
AI context is compressed, not repeatedly resent.
```

Coherence (every capability strengthens the enterprise) and modularity (departments ship as plugins) work together — the matrix maps *what* exists; modules control *how much code loads*.

---

## Critical path

```txt
PSP approve → 002 shell → 003 permissions → 004 registry
→ 106 MODULARITY GATE → 005 explorer → 006+ (modules only)
```

**Rule:** No department/studio expansion before LB-OS-106.

---

## Build spine (with LB-OS-002 decisions)

```txt
Shell first          LB-OS-002  — briefing home, localbrain mock, 8 cards, no modules
Safety second        LB-OS-003
Workspace registry   LB-OS-004
Modularity fourth    LB-OS-106  — MODULARITY GATE
Everything else      registered modules only
```

**002 locked:** `localbrain` home · CFO briefing-only · no OpenAI · no filesystem · no manifests.

---

## Estimated codebase size

### Lean V1 shell (LB-OS-001–015)

```txt
25,000–45,000 lines of code
```

Includes:

```txt
OS shell · command bar · project/workspace registry
file explorer foundation · OpenAI API bridge
permission engine · logs · basic memory
basic studios as stubs (routes + manifest, not full features)
```

### Strong usable V2 (~LB-OS-030 + core studios)

```txt
75,000–125,000 lines of code
```

Includes:

```txt
real file management · search/indexing · project memory
code studio · writing studio · contact system
database studio · email/calendar integration · token/cost tracking
```

### Full executive OS (all domains + Track B)

```txt
175,000–350,000+ lines of code
```

If everything ships in one tree: photography, podcast, CFO, data platform, AI routing, neural lab, GPU tools, social dashboard, etc.

**Target:**

```txt
Keep the core repo under ~100,000 lines.
Push everything else into plugins/modules.
```

Modules may add LOC in separate packages or `modules/` trees — they do not inflate the kernel.

---

## Three implementation layers

```txt
┌─────────────────────────────────────────────────────────────┐
│  Layer 3 — Optional modules (lazy-loaded)                   │
│  Code · Writing · Novel · CFO · Contacts · Database Studio  │
│  Photography · Podcast · Research · Neural Lab · …            │
├─────────────────────────────────────────────────────────────┤
│  Layer 2 — Essential OS (+40k–70k LOC on top of kernel)     │
│  Explorer · search/index · workspaces · approval UI         │
│  memory service · basic studios wired to engines            │
├─────────────────────────────────────────────────────────────┤
│  Layer 1 — Core Kernel (20k–40k LOC)                        │
│  Command · permissions · AI router · tools · memory/index   │
│  project registry · events/logs · UI shell chrome           │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Owns | Does not own |
|-------|------|----------------|
| **Core Kernel** | Routing, safety, AI entry, tool dispatch, registry, shell | Studio business logic, domain schemas, heavy UI |
| **Essential OS** | Explorer, indexing hooks, Living Workspace, approvals cockpit | Campaign books, novel canon, voter ETL |
| **Optional modules** | Domain features per executive domain | Permission bypass, direct FS writes |

---

## Core Kernel (only this in `backend/src/core/`)

The kernel **only** does:

```txt
Command layer          — intent, routing, context carry
Permission engine      — paths, risk, approval gates
AI provider router     — capability-first, adapter plugins
Tool registry          — safe vs approval-gated tools
Memory/index service   — chunks, summaries, recall APIs
Project registry       — workspaces, roots on H:/
Event/log system       — audit trail, slice closeouts
UI shell               — CommandBar, router, ContextPanel chrome
Module loader          — manifest, lazy routes, engine registration
```

Nothing else is kernel code.

---

## Everything else is a module

```txt
Code Studio        = module
Writing Studio     = module
Novel Studio       = module
Database Studio    = module
CFO / Accounting   = module
Contacts           = module  (Relationship Intelligence)
Research           = module
Photography        = module
Podcast            = module
Neural Lab         = module  (Track B — interface in core, impl in module)
```

### Module manifest (required after MODULARITY GATE)

Every domain module must register:

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

Also: `matrix_cells`, `engines`, `dependencies`, `load` (eager | on_open | on_command).

### Module contract (summary)

Each module declares:

```txt
module_id             — e.g. mod_cfo, mod_novel_studio
domain                — executive domain (Finance, Creative, …)
matrix_cells          — which capability cells it fills
engines               — ENG-* IDs it registers or extends
routes                — frontend lazy routes
permissions           — paths, risk levels (via kernel permission engine)
tools                 — tool registry subset
agents                — domain chief + specialists
data_sources          — catalog IDs from data platform
nav_placement         — shell nav order / grouping
lazy_load_boundary    — when frontend/backend chunk loads
dependencies          — other modules or minimum kernel version
load                  — eager | on_open | on_command (default: on_open)
```

**Load policy:** `on_open` default — module code loads when Steve opens that studio or CoS routes there.

**Kernel ↔ module boundary:** Modules call kernel APIs (tools, memory, permissions, AI router). Modules never import each other directly — shared behavior lives in **engines** the kernel hosts.

---

## Data size estimate

### Early system

```txt
App code:           100–300 MB
SQLite/local DB:    100 MB–2 GB
Indexes:            1–20 GB (depends on H:/ folders indexed)
Backups/quarantine: variable under local_data/
```

### Long-term (imports, history, embeddings)

```txt
10–100+ GB
```

Still fine on **H:/** if managed carefully. Runtime and `node_modules` stay on **C:/** per [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md).

**Rule:** Raw files live on H:/. The app stores **metadata, summaries, chunks, indexes** — not duplicate file bodies.

---

## Efficiency doctrine (10 rules)

```txt
1.  Build modular — kernel vs modules, engines as shared services.
2.  Load modules only when opened (or when CoS explicitly routes).
3.  Index metadata first, content second.
4.  Store summaries/chunks, not giant repeated prompts.
5.  Never send full projects to AI unless necessary.
6.  Keep raw files on H:/, app runtime on C:/.
7.  Use SQLite first; upgrade to Postgres only when needed.
8.  Use background jobs for heavy scans (index, dedupe, import).
9.  Use local cache aggressively (context cache LB-OS-041+).
10. Keep GPU tools behind interfaces until hardware arrives (Track B).
```

Related engines: ENG-SR-001 (search), ENG-MM-001 (memory), LB-OS-045 (context compression).

---

## Anti-patterns (forbidden)

```txt
✗ Studio imports another studio's internals
✗ Domain logic in permissionEngine or commandRouter
✗ Duplicate voter/contact/canon data outside the data platform
✗ Full-repo or full-drive context in every AI call
✗ New feature without module manifest + matrix cell
✗ "Just one more" file in core because it's faster this slice
```

Burt/Cursor slices that add >500 LOC to `core/` require explicit justification in the packet.

---

## Repo layout (target)

```txt
localAgent/
├── backend/src/
│   ├── core/           ← Kernel only (hard LOC budget)
│   ├── engines/        ← Shared services (kernel hosts, modules consume)
│   └── modules/        ← Optional domain packages
│       ├── code-studio/
│       ├── novel-studio/
│       ├── cfo/
│       └── …
├── frontend/src/
│   ├── shell/          ← Kernel UI chrome
│   └── modules/        ← Lazy-loaded studio UIs
└── shared/             ← Types, contracts, module manifest schema
```

V1 scaffold may colocate stubs in 002 — **LB-OS-106** (after 004, before 005) establishes boundaries before explorer and studio expansion.

---

## MODULARITY GATE

```txt
MODULARITY GATE = LB-OS-106
```

After 106, every domain (Code, Writing, CFO, Novel, Contacts, Database Studio, Photography, Podcast, …) **registers as a module** — never as hard-coded shell sections.

---

## Mapping to release phases

| Phase | LOC band | What ships |
|-------|----------|------------|
| V1 shell (015) | 25k–45k | Kernel + essential stubs + module manifests |
| V2 usable (030+) | 75k–125k | Essential OS + 3–5 real modules |
| Executive OS (105+) | Core <100k | Full domain matrix via modules, not monolith |

Full executive capability ≠ full executive codebase in one tree.

---

## Slice

| Slice | Goal |
|-------|------|
| **LB-OS-106** | After 004, before 005 — manifest schema, loader, `core/` boundary; **MODULARITY GATE** |

**Depends on:** LB-OS-004 only. Blocks LB-OS-005 and all studio slices until complete.

---

## Related documents

| Doc | Role |
|-----|------|
| [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) | Five layers — Layer 1 = kernel |
| [Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md) | Studios = module lenses |
| [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md) | Shared engines vs module-owned |
| [Data Platform](./LOCALBRAIN_DATA_PLATFORM.md) | Index, don't duplicate |
| [Dual-Track Roadmap](./LOCALBRAIN_DUAL_TRACK_ROADMAP.md) | GPU/neural as modules behind interfaces |

---

*Modular architecture v1.1 · 2026-06-28 · MODULARITY GATE = LB-OS-106 (early critical path)*
