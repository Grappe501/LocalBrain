# LocalBrain Platform Separation Strategy v1.0

> **Planning only** — no multi-tenant implementation in V1.  
> **Purpose:** Define the boundary between sellable **Platform** code and private **Brain** data so Steve's personal OS and a future commercial product share one architecture without a redesign.  
> Parent: [Operating System Doctrine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) · [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md)

---

## Decision

```txt
Build Steve's LocalBrain first — one real user, one real problem solved.
Design every feature as Platform capability operating on Brain-scoped data.
Do not design for thousands of customers yet.
```

The modular architecture already frozen (kernel → modules → knowledge sources → brain data → Chief of Staff) naturally supports commercialization **if** we keep the Platform / Brain boundary explicit from now on.

**Knowledge classes:** [Knowledge Taxonomy](./LOCALBRAIN_KNOWLEDGE_TAXONOMY.md) — Operational (ships with product) · Executive (per user) · Domain (per workspace). Customers receive Operational knowledge on install; build Executive and Domain over time.

---

## Three layers

### Layer 1 — SteveBrain (current)

Steve's **personal AI Executive Operating System**. Private operating environment — never shipped as product.

| Contains | Examples |
|----------|----------|
| Workspaces | `localbrain`, `reddirt`, campaign projects |
| Memory | Six memory domains, recall graph, learning outcomes |
| Writing voice | Novel canon, style profiles |
| Campaign systems | Voter data, donor intel, compliance context |
| Contacts & relationships | Relationship Intelligence data |
| Knowledge graph | Indexed assets, decisions, links |
| Digital Twin | Composed apex for Steve's world |

**Repo today:** `H:\localAgent` with `local_data/localbrain.db`, Steve's `H:/` workspace roots, Steve-specific docs in `docs/burt_packets/`.

---

### Layer 2 — LocalBrain Platform (sellable)

The **software** that could eventually be licensed. Contains **no Steve-specific content**.

| Platform surface | Status (V1) |
|------------------|-------------|
| Executive shell | LB-OS-002 ✅ |
| Chief of Staff framework | LB-OS-008, 010.5 ✅ |
| LivingWorkspace engine | LB-OS-004 ✅ |
| Knowledge Explorer | LB-OS-005 ✅ |
| Digital Asset Registry | LB-OS-006 ✅ |
| Digital Asset Intelligence | LB-OS-007 ✅ |
| Approval engine | LB-OS-010 ✅ |
| Executive Program Office | LB-OS-012.5 ✅ |
| System health monitor | LB-OS-011 ✅ |
| Module loader | LB-OS-106 ✅ |
| Provider router | Partial — OpenAI bridge |
| Permission engine | LB-OS-003 ✅ |
| Engineering Department | LB-OS-012 📋 next |
| Writing Department | LB-OS-013 📋 |
| Database Department | LB-OS-014 📋 |

**Code paths:** `backend/src/`, `frontend/src/`, `shared/src/`, `docs/LOCALBRAIN_*.md` (specs — not customer data).

---

### Layer 3 — Customer packages

Every customer gets their own **Brain** — same Platform, different knowledge.

```txt
Company Brain
Family Brain
Law Firm Brain
Photography Brain
Campaign Brain
School Brain
```

Same engines. Different memory, workspaces, Digital Twin, modules enabled, and provider keys.

---

## Brain Profiles

Replace the mental model of "user accounts" with **Brains**.

```txt
Steve Brain
Kelly Campaign Brain
Photography Brain
Novel Brain
Demo Brain
Customer ABC Brain
```

Each Brain has:

| Scoped to Brain | Notes |
|-----------------|-------|
| Memory | All six domains |
| Workspaces | LivingWorkspace registry |
| Knowledge sources | Drives, DBs, APIs, indexes |
| Decisions | Decision ledger entries |
| Modules | Enabled department manifests |
| Settings | Providers, roots, branding |
| AI providers | Keys, routing, budgets |
| Digital Twin | Composed read model |
| Action log · approvals · quarantine | Per-brain audit trail |

The Platform loads a Brain context at startup. **The code does not care whose Brain it is.**

---

## Canonical stack (vocabulary)

Use **Platform** and **Brain** in internal architecture docs and new code comments:

```txt
Platform
  └── Brain
        ├── Workspaces
        ├── Knowledge Sources
        ├── Memory
        ├── Decisions
        ├── Digital Twin
        └── Chief of Staff
              └── Modules (departments · studios)
```

**User-facing product name** remains **LocalBrain** until a commercial SKU exists. Internal separation language prevents Steve-specific assumptions from leaking into Platform code.

---

## Boundary definitions

### 1. Platform code (sellable)

**What:** Runtime, UI shell, engines, APIs, module loader, permission framework, provider router, approval workflow, tests, shared types.

**Rules:**

```txt
No hard-coded Steve paths, names, or campaign content.
No default workspace named after a real customer.
Configuration and secrets come from Brain context — not source constants.
Platform docs describe capability — not Steve's life.
```

**Today:** Mostly satisfied. Watch for: default workspace seeds, briefing copy, doc examples, test fixtures.

---

### 2. Brain data (customer-specific)

**What:** Everything that makes *this* Brain unique.

| Store | Current location (Steve Brain) |
|-------|-------------------------------|
| Primary database | `local_data/localbrain.db` |
| File indexes | SQLite tables + indexer state |
| Quarantine / backups | `local_data/quarantine/`, `local_data/backups/` |
| Workspace roots | Permission-approved paths (e.g. `H:/`) |
| Provider keys | `settings` table / env (never committed) |
| Learning outcomes | `cos_outcomes`, future verify records |

**Rules:**

```txt
Brain data never ships in the Platform repository.
Migrations are Platform code; migrated rows are Brain data.
Export/import is a future Brain portability feature — not V1.
```

**Future:** `brains/<brain_id>/` or separate DB file per Brain on a shared server — see [Shared Server Brain](./LOCALBRAIN_SHARED_SERVER_BRAIN.md).

---

### 3. Modules (installable capabilities)

**What:** Lazy-loaded department and studio packages — manifests, routes, agents, tools.

| Property | Platform or Brain? |
|----------|-------------------|
| Module **code** + manifest schema | Platform |
| Module **enabled for this Brain** | Brain configuration |
| Module **content** (templates, sample packets) | Ship with Platform as demos; customer replaces |

**Rule:** Modules extend Platform capability. They read/write Brain-scoped data through kernel APIs — never bypass permissions or approval.

See [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) · LB-OS-106 gate.

---

### 4. Customer configuration (per Brain)

**What:** Branding, enabled modules, provider choices, permission roots, team members (Professional+), SSO (Enterprise).

| Config item | Layer |
|-------------|-------|
| Product edition (Personal / Pro / Enterprise) | Platform license |
| Brain display name + icon | Brain config |
| Enabled modules | Brain config |
| API keys · model routing | Brain config (encrypted) |
| Approved filesystem roots | Brain config |
| Team roles · shared workspaces | Brain config (Pro+) |
| Audit retention · SSO | Brain config (Enterprise) |

**V1:** Single implicit Brain — no config UI. Settings table is proto–Brain config.

---

## How current architecture maps

```txt
Host Platform (Layer 0)          OS · hardware · GPU
        ↓
LocalBrain Platform (Layer 1)    kernel · engines · shell · APIs
        ↓
Brain context (implicit V1)      local_data/ · workspace registry · settings
        ↓
Modules (Layer 4)                engineering-studio · data-studio · …
        ↓
Knowledge Sources              indexed drives · assets · future DBs
        ↓
Chief of Staff (Layer 5)       intent · proposals · Digital Twin consult
```

The [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md) ten objects all live **inside a Brain** except `Engine` and `Module` definitions, which are Platform-hosted.

---

## Multi-tenant (later)

```txt
LocalBrain Platform
        ↓
Brain Registry
        ↓
   Brain A · Brain B · Brain C · Brain D
```

Analogous to a database server hosting multiple databases. Not V1 scope.

**Triggers to implement:** Second personal Brain (e.g. Kelly Campaign) on same machine, or first trusted beta user needs isolation from Steve's data.

**Early enabler (when needed):** `brain_id` on all tables + `local_data/brains/<id>/` — design only until second Brain is real.

---

## Licensing (future)

Three editions — capabilities unlock at Platform level; each Brain still owns its data.

| Edition | Users | Brains | Deployment | Highlights |
|---------|-------|--------|------------|------------|
| **Personal** | 1 | 1 | Local | Full departments, local models, no SSO |
| **Professional** | Small team | 1+ shared | Server | Shared workspaces, roles, audit export |
| **Enterprise** | Org | Many | Multi-site | SSO, GPU cluster, multi-provider, compliance |

No pricing or license enforcement in V1. Document edition boundaries so features slot cleanly later.

---

## Recommended progression

Real use drives commercial features — not speculation.

```txt
Steve Brain                    ← now (H:\localAgent)
        ↓
Kelly Campaign Brain           ← second Brain, same Platform
        ↓
Another personal Brain         ← prove Brain switching / isolation
        ↓
Trusted beta (10–20)           ← Brain Registry, basic provisioning
        ↓
Small organizations            ← Professional edition features
        ↓
Commercial platform            ← packaging, billing, support
```

**Do not skip steps.** Each stage should expose a real gap (isolation, backup, onboarding, permissions) before building the next.

---

## What to do now

| Action | Effort |
|--------|--------|
| Use **Platform** / **Brain** in new docs and architecture discussions | Zero |
| Treat `local_data/` as Brain data — never commit secrets or DB | Ongoing |
| Keep Platform code free of Steve-specific defaults where easy | Low |
| Build LB-OS-012–016 on Platform primitives | Current queue |
| Reference this doc when adding settings, storage, or auth | Ongoing |

**Optional later (when second Brain appears):**

```txt
brain_id column migration
Brain selector at startup
brains/<id>/ data directory layout
```

---

## What not to do yet

```txt
✗ Multi-tenant auth · billing · provisioning UI
✗ Per-customer cloud hosting design
✗ SSO · org hierarchy · thousands of tenants
✗ Separate commercial repo fork
✗ License key enforcement
✗ Abstract every table before Steve Brain is complete
```

Premature multi-tenancy adds enormous complexity without a second real Brain to validate against.

---

## Steve Brain vs Demo Brain

For beta users, ship a **Demo Brain** package:

```txt
Platform install          ← same repo / installer
Demo Brain seed data      ← sample workspaces, fake contacts, tutorial packets
Customer replaces data    ← their Brain, not a fork of Platform code
```

Demo content is Brain data — not Platform code.

---

## Review checklist (new features)

Before merging a slice, ask:

```txt
[ ] Does this code assume Steve's paths, projects, or content?
[ ] Would this work unchanged if brain_id pointed at a different database?
[ ] Are new secrets/settings in Brain config — not hard-coded?
[ ] Is module behavior registered via manifest — not inline in kernel?
[ ] Does documentation describe Platform capability vs Brain instance?
```

EPO ([Executive Program Office](./LOCALBRAIN_EXECUTIVE_PROGRAM_OFFICE.md)) tracks **Platform build progress**. Brain-specific health (campaign deadlines, novel word count) belongs in workspace dashboards — not the EPO scoreboard.

---

## Related documents

| Doc | Relationship |
|-----|--------------|
| [Product Doctrine](./LOCALBRAIN_PRODUCT_DOCTRINE.md) | V1 identity — Steve's bootstrap |
| [Operating System Doctrine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) | North star — update wording over time |
| [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) | Layer 0–5 — Platform structure |
| [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) | Module loader — Platform vs enabled modules |
| [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md) | Objects live inside a Brain |
| [Shared Server Brain](./LOCALBRAIN_SHARED_SERVER_BRAIN.md) | Future multi-machine single Brain |
| [Multi-Machine Network Plan](./LOCALBRAIN_MULTI_MACHINE_NETWORK_PLAN.md) | Phase 14 — network topology |
| [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) | What Platform can do — not whose data |

---

## Status

| Item | State |
|------|-------|
| Strategy document | ✅ This doc — 2026-06-28 |
| Steve approval | ⬜ |
| `brain_id` schema | 📋 Deferred until second Brain |
| Brain Registry service | 📋 Deferred |
| Commercial packaging | 📋 Future |

---

*Platform Separation Strategy v1.0 · planning artifact · guides LB-OS-012+ without blocking Steve Brain delivery*
