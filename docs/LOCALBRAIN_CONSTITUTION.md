# LocalBrain Constitution v1.0

> **Version 2 Constitution (planned canonical index)** — June 2026  
> **Status:** Index + governing principles; detailed law lives in linked doctrine  
> **Rule:** Every planning document is an **implementation guide beneath this Constitution**, not an independent authority.

When documents conflict, **Constitution wins** → then Architecture lock → then Phase Checklist gate line.

---

## Article I — Mission

**Product:** [Executive Operating System](./LOCALBRAIN_EXECUTIVE_OFFICE.md) — Steve's AI Executive Operating System.

**Engine:** [LocalBrain](./LOCALBRAIN_PRODUCT_NAMING.md) — reasoning, memory, orchestration.

**North star:**

```txt
Did Steve accomplish more meaningful work this week
than he would have without LocalBrain?
```

**Measured by:** [Executive Leverage Score](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md) · [Effectiveness Metrics](./LOCALBRAIN_EFFECTIVENESS_METRICS.md)

**Development phases:** [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md)

---

## Article II — Foundational Objects

Ten frozen objects — [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md)

```txt
LivingWorkspace · DigitalAsset · Decision · Memory · KnowledgeSource
Module · Engine · Action · Person · Organization
```

No new core object types without Constitution amendment.

---

## Article III — Layer Architecture

[Operating System Doctrine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) · [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md)

```txt
Layer 0 — Host platform
Kernel — module loader (LB-OS-106)
Platform — sellable engines and shell
Brain — Steve's private data and workspaces
```

---

## Article IV — Executive Office

[Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) sits **above** all departments.

| Surface | Role | Doc |
| ------- | ---- | --- |
| Executive Briefing | Morning narrative · **ELS headline** | CoS + ELS |
| Program Office | Construction scoreboard | [EPO](./LOCALBRAIN_EXECUTIVE_PROGRAM_OFFICE.md) |
| System Evolution | Intelligence scoreboard | [Evolution](./LOCALBRAIN_SYSTEM_EVOLUTION.md) |
| System Health | Machine + ops | LB-OS-011 |
| Decisions | Decision Ledger | [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) |

---

## Article V — Chief of Staff

[AI Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md) · [Command Layer](./LOCALBRAIN_COMMAND_LAYER.md)

```txt
CoS → Capability Router → departments / providers → outcomes
No direct vendor SDK calls from business logic (LB-OS-017)
Recommendations → Actions queue → Steve approves → execute
```

Phase 2 success: CoS **improves decisions**, not only describes state.

---

## Article VI — Departments

[Studio Blueprint](./LOCALBRAIN_STUDIO_BLUEPRINT.md) · [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md)

Departments are modules with shared spine: types → service → routes → UI → docs → checklist.

Phase 3 adds departments only on an **intelligent** executive layer (Phase 2 gate).

---

## Article VII — Knowledge Model

[Knowledge Sources](./LOCALBRAIN_KNOWLEDGE_SOURCES.md) · [Digital Asset Model](./LOCALBRAIN_DIGITAL_ASSET_MODEL.md) · Knowledge Explorer (LB-OS-005)

```txt
Index · explain · permission-gated read
Registry · intelligence · recommend-only cleanup
```

---

## Article VIII — Memory Model

[Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) · [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md)

Six domains + apex Digital Twin compose Steve's world for CoS context.

---

## Article IX — Safety Model

[Permission engine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) (LB-OS-003) · Approval workflow (LB-OS-010)

```txt
Read tools gated · Write/move/quarantine require approval
No silent writes · No auto-delete · Quarantine before destroy
```

---

## Article X — Development Doctrine

[Build Slice Queue v2](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) · [Phase Checklist](./PHASE_CHECKLIST.md) · [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md)

```txt
Slice order is law · Burt packet per slice · Checklist gate line is authoritative
EPO = construction (ENG-BLD-001) · Evolution = intelligence (ENG-EVO-001)
Experience Maturity L0–L5 on every route · Dev mode shows badges; production hides
```

**Workspace modes:** [Adaptive Workspace Modes](./LOCALBRAIN_WORKSPACE_MODES.md) (future LB-OS-03X)

---

## Amendment process

1. Propose change in Decision Ledger + Phase Checklist change log  
2. Update Constitution index if principle changes  
3. Update downstream implementation guides  
4. Never silently contradict Article II objects or Article IX safety

---

## Document hierarchy

```text
LOCALBRAIN_CONSTITUTION.md          ← you are here
├── LOCALBRAIN_THREE_PHASE_ROADMAP.md
├── LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md
├── LOCALBRAIN_*_DEPARTMENT.md
├── LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md
├── PHASE_CHECKLIST.md
└── docs/burt_packets/LB-OS-*.md
```

---

*Constitution v1.0 · strategic checkpoint · 2026-06-28*
