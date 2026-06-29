# LocalBrain

**Steve's AI Executive Operating System** — second brain and operating company. Chief of Staff coordinates executive domains; CFO runs books from the start.

```txt
Remember · Think · Do · Run
Project folders ARE the filesystem folders.
```

**North star:** [Operating System Doctrine v2.0](docs/LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md)  
**Planning apex:** [Enterprise Capability Matrix](docs/LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) · [Modular Architecture](docs/LOCALBRAIN_MODULAR_ARCHITECTURE.md) — thin core, lazy modules  
**Architecture:** [Master System Architecture](docs/LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) · [Engine Registry](docs/LOCALBRAIN_ENGINE_REGISTRY.md)  
**Dual-track:** [Dual-Track Roadmap](docs/LOCALBRAIN_DUAL_TRACK_ROADMAP.md) — Track A now (90–95%) · Track B GPU stubs  
**PSP:** ✅ Approved · **Next:** [LB-OS-002 Burt packet](docs/burt_packets/LB-OS-002.md)

```txt
C:/ = operating programs only
H:/ = work projects, data, archives, documents, repos, media, storage
```

**Location:** `H:\localAgent`

---

## Build Status — Executive OS V1 ✅

```txt
LB-OS-001–011   ✅ Foundation + safety + CoS + system health
LB-OS-012.5     ✅ Executive Program Office
LB-OS-012–015   ✅ Engineering · Writing · Data & Intelligence · Relationships
LB-OS-016       ✅ Executive OS V1 milestone (release candidate)
LB-OS-017       ✅ AI Provider Management
LB-OS-018       ✅ Drive architecture & migration planner
LB-OS-019       ✅ Full filesystem mapping audit
```

**Verify:** `GET /api/migration/audit` · `GET /api/migration/audit/export`

**Next:** [LB-OS-021 Executive Workspace Architecture](docs/LOCALBRAIN_EXECUTIVE_WORKSPACE_ARCHITECTURE.md) · Phase 1 finish arc 021–026

**Dev:** `npm run dev` → http://localhost:5174 · API http://localhost:4545

---

## Legacy build notes

---

## V1 Boots To (LB-OS-002)

```txt
Home:   Executive Briefing (/) — workspace context: localbrain
Top:    Chief of Staff command bar + signals pill + Ctrl+Space
Nav:    Department placeholders (manifests after 106)
Right:  Eight context cards (CFO in briefing only — not card 9)
```

---

## Key Docs

| Doc | Purpose |
|-----|---------|
| [**Product Strategy Phase**](docs/LOCALBRAIN_PRODUCT_STRATEGY_PHASE.md) | PSP — blocks code until approved |
| [**Master System Architecture**](docs/LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) | Five layers, Living Workspaces |
| [**Engine Registry**](docs/LOCALBRAIN_ENGINE_REGISTRY.md) | 28 engines, slice mapping |
| [**Studio Blueprint**](docs/LOCALBRAIN_STUDIO_BLUEPRINT.md) | All studios as lenses |
| [**Command Layer**](docs/LOCALBRAIN_COMMAND_LAYER.md) | Ctrl+Space universal routing |
| [**Dual-Track Roadmap**](docs/LOCALBRAIN_DUAL_TRACK_ROADMAP.md) | Track A now · Track B GPU-ready |
| [**AI Evolution Engine**](docs/LOCALBRAIN_AI_EVOLUTION_ENGINE.md) | Pillar 15 — capability scorecard |
| [**Executive Office**](docs/LOCALBRAIN_EXECUTIVE_OFFICE.md) | Pillar 17 — apex of the OS |
| [**Enterprise Capability Matrix**](docs/LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) | **Planning apex** — domains × capabilities |
| [**Modular Architecture**](docs/LOCALBRAIN_MODULAR_ARCHITECTURE.md) | Thin core · plugins · LOC budgets |
| [**Executive Domains**](docs/LOCALBRAIN_EXECUTIVE_DOMAINS.md) | Life domains · four modes |
| [**Accounting & CFO**](docs/LOCALBRAIN_ACCOUNTING_CFO_DIVISION.md) | Campaign, household, business books |
| [**Data Platform**](docs/LOCALBRAIN_DATA_PLATFORM.md) | Unified queryable data layer |
| [**Database Studio**](docs/LOCALBRAIN_DATABASE_STUDIO.md) | NL → SQL, explain, teach |
| [**Relationship Intelligence**](docs/LOCALBRAIN_RELATIONSHIP_INTELLIGENCE.md) | Contacts as relationship objects |
| [**Novel Studio**](docs/LOCALBRAIN_NOVEL_STUDIO.md) | Canon, timeline, continuity |
| [**Research Division**](docs/LOCALBRAIN_RESEARCH_DIVISION.md) | Voters, census, GIS, elections |
| [**Build Slice Queue v2**](docs/LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) | LB-OS-001–106 |
| [Capability Map](docs/LOCALBRAIN_CAPABILITY_MAP.md) | Pillars → slices |
| [Safety Model](docs/LOCALBRAIN_SAFETY_MODEL.md) | Permission gates |
| [Explorer Blueprint](docs/LOCALBRAIN_EXPLORER_SYSTEM_BLUEPRINT.md) | File explorer vision |

v1 queue archived: [LOCALBRAIN_BUILD_SLICE_QUEUE.md](docs/LOCALBRAIN_BUILD_SLICE_QUEUE.md)

---

## Dev Commands (Scaffold)

```bash
npm install
npm run dev
npm run check
curl http://localhost:4545/api/health
```

---

## Next Step

1. **Execute LB-OS-004** — [Burt packet](docs/burt_packets/LB-OS-004.md) · LivingWorkspace foundation  
2. **Spine:** 004 registry → 106 (MODULARITY GATE) → 005 explorer  
3. **Visual test:** http://localhost:5174/workspace/localbrain

---

## Stack

React + Vite + TypeScript · Node + Express · SQLite · OpenAI Responses API (backend only)
