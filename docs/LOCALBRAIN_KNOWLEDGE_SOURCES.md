# LocalBrain Knowledge Sources v1.0

> **User-facing abstraction** — stop calling things "databases" from Steve's perspective.  
> Foundational object: **KnowledgeSource** · Engine: **ENG-KN-001** (Knowledge Engine)  
> Parent: [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md)

---

## Principle

From Steve's perspective, everything is a **Knowledge Source**. The Chief of Staff does not care whether data lives in SQLite, PostgreSQL, a CSV, an API, or a vector index.

```txt
Steve / Chief of Staff  →  Knowledge Engine  →  correct adapter  →  answer
```

The Knowledge Engine decides routing. Studios and modules register sources — they do not expose storage mechanics to the user.

---

## KnowledgeSource object (frozen)

| Field | Purpose |
|-------|---------|
| `source_id` | Stable slug — `localbrain_db`, `voter_file_tx`, `steve_contacts` |
| `kind` | Adapter type — see kinds below |
| `title` | Display name |
| `description` | Plain-language summary |
| `workspace_id` | Optional scope — global or workspace-bound |
| `connection` | Opaque adapter config (path, URL, credentials ref) |
| `status` | active · paused · error · sync_pending |
| `last_synced_at` | For CoS "freshness" signals |
| `capabilities` | query · full_text · semantic · write (gated) |

---

## Example sources (not exhaustive)

```txt
SQLite              — localbrain.db, project-local DBs
Postgres            — County Workbench, production databases
Contacts            — relationship intel
Calendar            — schedule, deadlines
Email               — threads, commitments (future)
Filesystem          — H:/ roots, indexed folders
Git                 — repos, commit history
Voter File          — campaign research
Census · BLS        — public data APIs
Photography         — session catalogs, EXIF corpora
Podcast             — episode archives, transcripts
ChatGPT Archive     — migration imports
Cursor Reports      — build handoffs, agent transcripts
Vector Index        — embeddings (post ENG-AP-008)
```

User says: *"Search the voter file for precinct 12"* — not *"query the Postgres table."*

---

## Knowledge Engine (ENG-KN-001)

Planned responsibilities:

```txt
Register and validate KnowledgeSource records
Route queries to the correct adapter (SQL, file, API, graph, vector)
Unify results into a common result shape for CoS and studios
Enforce permissions — same gates as filesystem and write tools
Log every query — ENG-LG-001 audit trail
```

**Relationship to ENG-KG-001:** Knowledge Graph links entities **across** sources. Knowledge Engine **queries** sources. Graph consumes source metadata; Engine executes retrieval.

---

## Adapter pattern

```txt
KnowledgeSource (registry record)
    ↓
Adapter (kind-specific: sqlite, postgres, filesystem, api, …)
    ↓
Normalized result: { snippets, rows, entities, citations, freshness }
```

New source types = new adapter + registry entry — **not** a new foundational object.

---

## What we stop saying (user-facing)

| Old | New |
|-----|-----|
| "Connect to the database" | "Add a knowledge source" |
| "SQLite project DB" | "Knowledge source: project data" |
| "Query Postgres" | "Ask the County Workbench source" |

Internal engineering may still say SQLite/Postgres in logs and adapter code.

---

## Slices (planned)

| Slice | Deliverable |
|-------|-------------|
| LB-OS-005+ | Filesystem as first-class KnowledgeSource |
| LB-OS-046+ | Vector / semantic source kind |
| Post-024 | External DB adapters (Postgres, CSV bulk) |

---

## Related docs

| Doc | Role |
|-----|------|
| [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md) | Company domain consumes sources |
| [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md) | ENG-KN-001 catalog entry |
| [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) | `data_sources` stubs → KnowledgeSource refs |

---

*Knowledge Sources v1.0 · 2026-06-28*
