# LocalBrain Digital Asset Model v1.0

> **Binding before LB-OS-006** — LocalBrain understands what you own digitally, not just where it lives.  
> Parent: [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md) · Consumer: [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md) · Explorer: [Knowledge Explorer](./LOCALBRAIN_KNOWLEDGE_EXPLORER.md)

---

## Strategic shift

**Old (superseded):**

```txt
LB-OS-006 Storage Intelligence — storage is the product
Explorer/index talk to the filesystem repeatedly
```

**New (binding):**

```txt
LB-OS-006 Digital Asset Registry
LB-OS-007 Digital Asset Intelligence Engine
Storage optimization = one capability among many
Almost everything talks to the Asset Registry — not directly to the filesystem
```

---

## Competitive advantage (binding doctrine)

```txt
LocalBrain's moat is not the AI model.
It is understanding Steve's world.

Models change · APIs change · providers change
Workspaces · assets · decisions · relationships · goals persist

Every future model plugged into LocalBrain starts with context — not from scratch.
```

Optimize **world understanding** above raw model capability.

---

## Digital Asset

Every digital object — regardless of type — eventually receives an **intelligence profile**.

**Not a new foundational object.** A **registry record** specializing `KnowledgeSource` (filesystem) + indexed metadata + workspace linkage.

### Asset kinds (extensible)

```txt
document · source_code · photo · podcast · video · spreadsheet · database
zip_archive · pdf · email_attachment · ai_export · git_repository · font
3d_model (future) · …
```

The engine knows **what role the asset plays** — not only its path.

---

## Asset fingerprint (every registry entry)

```txt
hash · size · created · modified · last_referenced
workspace_id · knowledge_source_id · owner
health_score · lifecycle_stage
relationships[] · summary · duplicate_group · version_cluster
collections[] · tags[]
```

Powers cleanup, CoS briefings, and Knowledge Explorer lenses without rescanning disk.

---

## Asset health score

Workspaces have health. **Assets have health too.**

**Good health signals:**

```txt
Fresh · referenced recently · active workspace · backed up
no duplicates · indexed · tagged · understood
```

**Poor health signals:**

```txt
unknown owner · duplicate · old version · never referenced
missing metadata · archive candidate
```

CoS example: *"You have 4,200 dormant assets consuming 31 GB."*

---

## Asset lifecycle (binding)

```txt
created
  ↓
active
  ↓
referenced
  ↓
dormant
  ↓
archive_candidate
  ↓
archived
  ↓
deleted          ← only after LB-OS-010+ approval
```

Lifecycle transitions emit `WorkspaceEvent` / asset events — audit trail for CoS.

---

## Collections (dynamic — not folders)

Collections group assets **without moving files on disk.**

```txt
Everything related to Kelly
Everything related to Grappe Novel
Everything using Census
Everything touched this week
Everything using Claude
Everything from camera X
Everything mentioning Buffalo River
```

One asset → many collections. Query via Asset Registry + graph — not directory structure.

---

## Asset Registry architecture (binding)

```txt
                    ┌─────────────────────┐
                    │   Asset Registry    │
                    │   (SQLite + FTS)    │
                    └──────────┬──────────┘
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
   Knowledge Explorer    Chief of Staff      Digital Twin
           │                   │                   │
           └───────────────────┴───────────────────┘
                               │
                    incremental watcher / indexer
                               │
                         filesystem (H:)
```

**Rules:**

```txt
Explorer reads the registry — not raw filesystem on every action
Registry watches changes — incremental updates (005 index evolves into registry)
CoS queries the registry — dormant counts, duplicates, lifecycle
Never full H: scan on startup (inherited from Knowledge Explorer)
Ask "what changed?" — not "what exists?"
```

LB-OS-005 `file_index` **migrates into** Asset Registry in 006 — not a parallel system.

---

## Slice sequence (binding)

```txt
LB-OS-006  Digital Asset Registry        — schema, fingerprint, lifecycle, incremental sync
LB-OS-007  Digital Asset Intelligence    — health, collections, cleanup, CoS asset signals
LB-OS-008  OpenAI Command Layer          — AI with asset + workspace context
LB-OS-009  System Health Monitor         — machine metrics (renumbered from old 007)

Later specializations (same asset model):
  Photo · Podcast · Novel · Database · Media intelligence modules
```

Storage reports, duplicate detection, stale analysis → **capabilities of ENG-DAI-001**, not a separate "storage app."

---

## Three operating modes + assets

Knowledge Explorer modes (005) gain asset context from registry:

| Mode | Asset role |
|------|------------|
| Browse | overlay badges + lifecycle hint |
| Understand | fingerprint summary, health, collections |
| Executive | dormant asset counts, archive candidates, duplicate risks |

**"Why am I seeing this?"** cites registry fields — surfaced_because, lifecycle, health.

---

## Engines

| ID | Role |
|----|------|
| **ENG-DAR-001** | Digital Asset Registry — ingest, fingerprint, lifecycle, incremental sync |
| **ENG-DAI-001** | Digital Asset Intelligence — health, collections, cleanup proposals, CoS queries |

Update [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md) when 006 ships.

---

## Related docs

| Doc | Role |
|-----|------|
| [Knowledge Explorer](./LOCALBRAIN_KNOWLEDGE_EXPLORER.md) | Primary UI lens over registry |
| [Storage Cleanup Blueprint](./LOCALBRAIN_STORAGE_CLEANUP_BLUEPRINT.md) | Cleanup flows (DAI capability) |
| [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) | DEC-DA-001 |
| [Burt LB-OS-006](./burt_packets/LB-OS-006.md) | Registry execution |

---

*Digital Asset Model v1.0 · architecture lock before LB-OS-006 · 2026-06-28*
