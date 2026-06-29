# Three Worlds and the Projection Layer

> **Status:** Architecture lock — durable through GPU · cloud · multi-user · commercialization  
> **Rule:** Executive and Logical worlds stay stable; only Physical World and projections evolve.  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md) · [Executive Workspace Architecture](./LOCALBRAIN_EXECUTIVE_WORKSPACE_ARCHITECTURE.md)

---

## Principle

LocalBrain manages **three separate realities**. They must never collapse into one undifferentiated "filesystem."

```txt
Executive World     — where Steve thinks
Logical World       — where LocalBrain organizes knowledge
Physical World      — where bytes live
```

Between Logical and Physical sits the **Projection Layer** — a permanent interface, **not** an eleventh foundational object.

```txt
Executive World
        ↓
Logical World
        ↓
Projection Layer
        ↓
Physical World
```

---

## 1. Executive World

**Question:** *What am I trying to accomplish?*

Where the executive **thinks** — intent, priorities, recommendations.

| Contains | System |
| -------- | ------ |
| Mission Stack (Phase 2) | Executive Intelligence |
| Executive Questions | Executive Intelligence |
| Executive Intelligence Cards | Executive Intelligence |
| Executive Briefing | Executive OS + Intelligence |
| Executive Leverage · MCP · ECL | Executive Intelligence |
| Chief of Staff | Executive Intelligence |

**No drive letters.** No paths. No storage providers.

Phase 2 deepens this world; Phase 1 seeds it (Briefing · EQ · EIC · CoS).

---

## 2. Logical World

**Question:** *How is my knowledge organized?*

Where LocalBrain **organizes** — stable identity regardless of where bytes move.

| Contains | Foundational object / spec |
| -------- | ------------------------- |
| Living Workspaces | LivingWorkspace |
| Knowledge Sources | KnowledgeSource |
| Digital Assets | DigitalAsset |
| Memory Domains | Memory |
| Relationships | Person · Organization |
| Decisions | Decision |
| Collections · Archives | LivingWorkspace specializations |

**No drive letters.** Workspaces have identity (`workspace_id`, Workspace DNA) — not `H:\...`.

021 builds primarily in the **Logical World** (Organization Tree · Workspace DNA · Blueprints).

---

## 3. Physical World

**Question:** *Where are the bytes?*

Storage only — infrastructure that changes over time without touching Executive or Logical models.

| Contains (Steve today) | Contains (future) |
| ---------------------- | ----------------- |
| H: · C: | Google Drive · NAS · GPU server |
| Local SSD paths | USB archive · Dropbox · OneDrive |
| | Team storage · cloud archives |

Three years from now: H: + GPU + Google Drive + NAS + USB + cloud — **Executive World unchanged · Logical World unchanged · Physical World expanded.**

---

## Projection Layer (permanent interface)

**Not a foundational object.** A binding contract: every logical entity may have zero or more physical representations.

```txt
Projection {
  logical_type       — living_workspace · knowledge_source · digital_asset · memory · relationship · …
  logical_id         — stable id in Logical World
  projection_kind    — filesystem_root · sqlite_db · physical_file · contact_record · …
  physical_ref       — path · URI · provider_id + relative_path · device label
  storage_provider_id — optional (future) · null = legacy direct path
  status             — active · stale · missing · planned
  observed_at
}
```

### Examples

```txt
Living Workspace  →  Filesystem Root     H:\Projects\RedDirt  (today)
Living Workspace  →  Filesystem Root     provider:primary · Projects\Campaigns\RedDirt  (future)
Knowledge Source  →  SQLite              localbrain.db
Digital Asset     →  Physical File       H:\…\chapter-07.docx
Memory            →  Storage             memory_entries table + optional file ref
Relationship      →  Contact Record      CRM row · vCard path
```

**Migration is translation:** change projection, not workspace identity.

```txt
Workspace: RedDirt          ← Logical World (unchanged)

Current projection:
  Physical: H:\Campaigns\RedDirt

Future projection:
  Storage Provider: Projects SSD
  Physical Path: Projects\Campaigns\RedDirt

Workspace ID never changes.
```

---

## Storage Provider (future — not Phase 1)

**Do not implement in 021.** Reserve interface for when multi-backend storage arrives.

```txt
StorageProvider {
  provider_id          — primary · archive · cold · replication · gpu_cache
  label                — "H" · "Google Drive" · "NAS"
  provider_type        — local_volume · cloud · nas · gpu_server · removable
  health               — healthy · degraded · offline · expected_offline
  capacity_bytes
  role                 — primary · archive · cold_storage · replication
}
```

Workspace references providers — not raw drive letters:

```txt
Workspace: RedDirt
  primary_storage:     H          (today — direct projection)
  archive_storage:     —          (future: Google Drive)
  cold_storage:        —          (future: NAS)
  replication:         —          (future: GPU Server)
```

Commercialization: one customer has `C:`/`D:`; another Mac + external SSD; another Linux RAID + NAS; another Google Shared Drive — **same Executive and Logical worlds**, different Storage Providers.

---

## Digital Land Survey (Physical World survey)

022 surveys the **Physical World**, not "folders" as the primary concept.

```txt
Physical World Survey
────────────────────────
H              Healthy · 2.1 TB · SSD · Primary
NAS            Healthy · 12 TB · Archive        (future)
Google Drive   Connected · 4.8 TB · Cloud      (future)
GPU Server     Offline · Expected · 6 weeks    (future)
────────────────────────
Logical bindings: workspace projections · orphans · conflicts
```

Folder inventory (LB-OS-019) feeds Physical World evidence; survey output links projections to Logical World ownership.

---

## Four Systems mapping

| World | Primary systems |
| ----- | --------------- |
| Executive | Executive Intelligence (+ Briefing surfaces in Executive OS) |
| Logical | Executive OS (workspaces) · Executive Memory OS |
| Projection | Executive OS (021–024 migration arc) · kernel registry |
| Physical | Executive OS (System Health) · host Layer 0 |

Executive Evolution optimizes projections and providers over time — not Logical identity.

---

## LB-OS-021 scope (Three Worlds aware)

021 implements **Logical World** structures + **Projection** contracts + **Physical World** read-only survey seed:

```txt
IN:  Workspace DNA · Organization Tree · Blueprints (logical + current/future projection)
IN:  Projection interface types in shared (not new foundational object)
IN:  Physical World survey contract (H: + C: for Steve)
OUT: StorageProvider runtime (interface/types only · stub)
OUT: Cloud/NAS providers
OUT: Projection mutation on disk
```

Blueprint example (projection-aware):

```txt
Workspace:     RedDirt
Logical ID:    reddirt
Current:       projection → H:\OldProjects\Campaigns\RedDirt
Recommended:   projection → H:\Projects\Campaigns\RedDirt
Confidence:    98%
Simulation:    Available
```

---

## Knowledge taxonomy alignment

| Knowledge class | World |
| --------------- | ----- |
| Operational | Platform docs · Logical + Physical ops |
| Executive | Executive World |
| Domain | Logical World (workspace-scoped) |

See [Knowledge Taxonomy](./LOCALBRAIN_KNOWLEDGE_TAXONOMY.md).

---

## Amendment

- **Projection interface** changes: update this doc + shared contracts — not Constitution Article II  
- **New StorageProvider implementation**: module + Assumption Ledger review — not new foundational object  
- Collapsing Three Worlds into filesystem-first design: **rejected** — requires architecture review

---

## Related docs

| Doc | Role |
| --- | --- |
| [Executive Workspace Architecture](./LOCALBRAIN_EXECUTIVE_WORKSPACE_ARCHITECTURE.md) | LB-OS-021 deliverables |
| [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md) | Ten frozen objects |
| [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md) | Platform vs Brain |
| [Migration Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md) | C:/H: Phase 1 physical |

---

*Three Worlds and Projection Layer · architecture lock · 2026-06-29*
