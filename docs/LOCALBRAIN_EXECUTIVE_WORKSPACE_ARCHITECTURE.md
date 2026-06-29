# Executive Workspace Architecture

> **Slice:** LB-OS-021  
> **Depends on:** LB-OS-020.5 (integration gate passed)  
> **Engine:** ENG-EWA-001 (planned)  
> **System:** [Executive OS](./LOCALBRAIN_FOUR_SYSTEMS.md) (System 1)  
> **Parent:** [Three Worlds & Projection](./LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md) · [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md) · [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) · [Five Gates](./LOCALBRAIN_FIVE_GATES_RULE.md)

---

## Principle

LB-OS-021 is the **Executive Workspace Architecture Builder** — mapping the **Logical World** onto the **Physical World** through **Projections**. Not a folder builder.

```txt
Wrong:  Where should this folder go?
Right:  Which Living Workspace owns this — and what is its projection?
```

**Migration = translate Logical → Physical.** Workspace identity never changes; only projections change.

See [Three Worlds](./LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md).

---

## Binding stack

```txt
Executive World        What am I trying to accomplish?     (Mission · EQ · EIC — Phase 2+)
        ↓
Logical World          How is knowledge organized?         (Workspace · Asset · Memory · …)
        ↓
Projection Layer       Logical object → physical representation
        ↓
Physical World         Where are the bytes?                (H: · C: · future providers)
```

**No drive letters in Executive or Logical worlds.**

---

## Five Gates (021)

| Gate | Answer |
| ---- | ------ |
| **System** | Executive OS |
| **Object** | LivingWorkspace (+ KnowledgeSource · DigitalAsset · **Projection interface**) |
| **Module** | Migration / workspace architecture module (not kernel) |
| **Executive Question** | EQ-014 · EQ-015 |
| **Leverage** | Safe Personal OS cutover; projection-traceable migration |

**Not** a new foundational object — Projection is a permanent interface ([spec](./LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md)).

---

## Deliverables (021)

### 1. Workspace DNA (Logical World)

Immutable identity — projections are mutable:

```txt
Workspace ID · Mission · Owner · Created · Purpose · Success Definition
Knowledge Sources[] · Primary Department · Mission Category · Lifecycle · Health
Projections[]          — current filesystem_root(s) · recommended (blueprint)
```

Example:

```txt
Logical:   workspace_id = contactlistsos
Location:  Primary Development
Projection: filesystem_root → provider: primary → H:\Projects\Campaigns\ContactListSOS
```

### 2. Workspace Blueprint (translation preview)

Read-only · simulation-ready · **zero moves**:

```txt
Workspace:        RedDirt
Logical ID:       reddirt
Current Projection:
  Physical:       H:\OldProjects\Campaigns\RedDirt
Recommended Projection:
  Physical:       H:\Projects\Campaigns\RedDirt
  Provider:       primary (H) — StorageProvider stub for future multi-backend
Confidence:       98%
Migration Impact: 12 folders · 241 files · 0 broken projections
Simulation:       Available
```

### 3. Organization Tree (Logical — not folder tree)

```txt
Steve → Projects → Campaigns · Creative · Research · Business
     → Education · Archives · Shared · System
```

Nodes map to Living Workspace · Collection · Archive. Paths are **derived projections**, not tree keys.

### 4. Physical World Survey (foundation for 022)

021 ships **Projection** types + initial Physical World survey; **022** completes Digital Land Survey.

Surveys **Physical World** first, then logical bindings:

```txt
Physical: H — Healthy · 2.1 TB · SSD · Primary
Logical:  workspace projections · orphans · boundary conflicts · empty namespace
```

---

## Explicit non-goals (021)

```txt
OUT: StorageProvider runtime (types/stub only)
OUT: Cloud · NAS · GPU storage backends
OUT: folder creation · moves · renames · deletes
OUT: new foundational objects
OUT: collapsing Three Worlds into filesystem-first UX
```

Mutations: **023 simulate → 024 propose → approve → execute**.

---

## Commercialization

Customers configure **Storage Providers** and projections — not `H:\Projects\`:

```txt
Executive World + Logical World  →  identical platform
Physical World + Projections     →  per customer
```

---

## Phase 1 finish arc

```txt
021  Executive Workspace Architecture + Projection contracts
022  Digital Land Survey (Physical World)
023  Migration Simulation (projection translation)
024  Migration Proposal Builder
025  Cutover Planner
026  Personal OS Launch
```

---

## Exit criteria (021)

```txt
[ ] Projection interface in shared (not foundational object)
[ ] Workspace DNA + projections[] on LivingWorkspace envelope
[ ] Organization Tree seeded
[ ] Blueprint generator: logical id + current/recommended projection
[ ] Physical World survey contract + initial H:/C: report
[ ] Blueprint UI · EQ-014/EQ-015 shell
[ ] Zero filesystem mutations
[ ] StorageProvider type stub only (no runtime)
[ ] Five Gates · PHASE_CHECKLIST
```

**Commit:** `feat: add executive workspace architecture builder`

---

## Related docs

| Doc | Role |
| --- | --- |
| [Three Worlds & Projection](./LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md) | Architecture lock |
| [Migration Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md) | C:/H: Phase 1 |
| [Consolidation Planner](./LOCALBRAIN_CONSOLIDATION_PLANNER.md) | Blueprint evidence |

---

*Executive Workspace Architecture · LB-OS-021 · ENG-EWA-001 · 2026-06-29*
