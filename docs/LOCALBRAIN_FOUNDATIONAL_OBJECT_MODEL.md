# LocalBrain Foundational Object Model v1.0

> **Binding architecture lock** — last major object-model change before module acceleration.  
> Supersedes the LB-OS-004-only freeze in [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md).  
> Layer model: [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) · CoS apex: [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md)

---

## Layer stack (binding)

```txt
Layer 0 — Host Platform        Windows · Linux · macOS · future server · cloud node
Layer 1 — LocalBrain Kernel    permissions · registry · engines · memory · agents · audit
Layer 2 — System Services      explorer · storage · health · workspace intelligence
Layer 3 — Knowledge Services   knowledge engine · recall · graph · learning
Layer 4 — Productivity Studios lazy-loaded modules and lenses
Layer 5 — Universal Command    Chief of Staff · Ctrl+Space · intent routing
```

**Rule:** Layer 0 is portable — LocalBrain is not Windows-specific. Layer 1 is the **LocalBrain Kernel** (not "Core OS Services" in user-facing language). Everything above Layer 1 is LocalBrain's executive operating shell.

Host framing: [Operating System Doctrine — Host Platform](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md#host-platform-layer-0)

---

## Foundational objects (frozen)

These ten objects are **stable for the life of the product**. New capability is expressed as specializations, engines, modules, and workspace types — **not** new foundation objects.

| Object | Role | Status (004+) |
|--------|------|----------------|
| **LivingWorkspace** | Core unit of work — campaign, novel, engineering, meta, … | ✅ Implemented |
| **WorkspaceEvent** | Append-only history — timeline, audit, replay | ✅ Implemented |
| **WorkspaceLink** | Graph edge between workspace and entity | ✅ Schema stub |
| **KnowledgeSource** | Any information origin the OS can query | 📋 Spec — [Knowledge Sources](./LOCALBRAIN_KNOWLEDGE_SOURCES.md) |
| **Decision** | Binding architectural/business choice with reason | 📋 Spec — [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) |
| **Memory** | Durable recall — six independent domains | 📋 Spec — [Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) |
| **Agent** | AI actor with mode, tools, and mandate | 📋 Spec — [Agent Registry](./LOCALBRAIN_AGENT_REGISTRY.md) |
| **Capability** | Enterprise matrix cell / skill the OS can perform | 📋 Spec — [Capability Map](./LOCALBRAIN_CAPABILITY_MAP.md) |
| **Module** | Lazy-loaded department or studio package | 📋 Spec — [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) |
| **Engine** | Shared backend service the kernel hosts | 📋 Spec — [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md) |

```txt
If it is not one of these ten, it specializes one of them.
```

---

## Specialization rule

| Instead of… | Use… |
|-------------|------|
| New "project" object | `LivingWorkspace` + `workspace_type` |
| New "timeline" object | `WorkspaceEvent` + event types |
| New "database" object (user-facing) | `KnowledgeSource` + adapter |
| New "file" intelligence blob | `DigitalAsset` registry record |
| New "we decided X" blob | `Decision` in ledger |
| New monolithic memory table | `Memory` in the correct domain |
| New department object | `Module` manifest |
| New backend service | `Engine` in registry |
| New AI persona | `Agent` in registry |
| New recommendation UI row type | `ExecutiveIntelligenceCard` — [EIC](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md) |

---

## Digital Twin (composed apex)

The **Digital Twin** is not an eleventh foundational object. It is the **continuously updated composed view** the Chief of Staff consults — built from workspaces, memory domains, knowledge sources, system health, and the decision ledger.

See [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md).

```txt
Chief of Staff does not reconstruct Steve's world every morning.
It consults the Digital Twin.
```

---

## Implementation phasing

| Object | First implementation slice (planned) |
|--------|--------------------------------------|
| LivingWorkspace · WorkspaceEvent · WorkspaceLink | LB-OS-004 ✅ |
| Decision | Early kernel slice (post-106) — ledger table + seed binding decisions |
| DigitalAsset | LB-OS-006 registry · LB-OS-007 intelligence — [Digital Asset Model](./LOCALBRAIN_DIGITAL_ASSET_MODEL.md) |
| KnowledgeSource | LB-OS-005 explorer; 006 registry ingest |
| Memory domains | LB-OS-051–052 recall slices |
| Agent · Module · Engine | LB-OS-106 modularity gate + registry |
| Digital Twin | Composed read model — grows as inputs land; no single "twin table" |

Shared TypeScript contracts: `@localbrain/shared` → `foundation.ts`, `digitalAsset.ts`

---

## Coherence promise

```txt
Millions of lines of code over many years — one mental model.
Chief of Staff always knows: workspaces, assets, decisions, sources, memory, agents, capabilities.
```

---

## Related docs

| Doc | Role |
|-----|------|
| [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md) | Apex understanding for CoS |
| [Digital Asset Model](./LOCALBRAIN_DIGITAL_ASSET_MODEL.md) | Asset registry + intelligence |
| [Knowledge Sources](./LOCALBRAIN_KNOWLEDGE_SOURCES.md) | User-facing data abstraction |
| [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) | Why we chose X |
| [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) | Workspace object detail |
| [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) | Module + kernel boundary |

---

*Foundational Object Model v1.0 · architecture lock · 2026-06-28*
