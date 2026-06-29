# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Slice:** LB-OS-006  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-005 ✅  
**Authoritative spec:** [Digital Asset Model](../LOCALBRAIN_DIGITAL_ASSET_MODEL.md)

---

## Mission

Build the **Digital Asset Registry** — the central index of everything Steve owns digitally. Knowledge Explorer, CoS, and Digital Twin read the registry; the registry watches the filesystem incrementally.

**Not** "Storage Intelligence." Storage is one dimension later (007).

---

## Hard boundaries

**Do not:**

```txt
Scan entire H: on startup
Replace foundational objects (asset specializes KnowledgeSource + index)
Build cleanup/delete in 006 (007 + LB-OS-010)
Duplicate file_index parallel to asset_registry — migrate/evolve file_index
```

**Do:**

```txt
Asset fingerprint schema (hash, size, dates, workspace, lifecycle stub)
Migrate LB-OS-005 file_index → digital_assets table (or unified view)
Incremental sync from permission-gated indexer
Registry API for explorer + CoS
Lifecycle stage field (default from mtime heuristics)
```

---

## Schema (target)

```txt
digital_assets       — fingerprint + kind + path (PK) + workspace_id
asset_collections    — dynamic collection definitions (stub rows OK)
asset_collection_members — many-to-many (stub)
asset_events         — lifecycle transitions (append-only)
```

Evolve existing `file_index` / FTS — do not throw away 005 work.

---

## API (target)

```txt
GET  /api/assets                    — list/filter
GET  /api/assets/:id                — fingerprint + health stub
GET  /api/assets/stats              — counts by lifecycle, dormant GB estimate
POST /api/assets/sync               — trigger incremental sync (background)
GET  /api/assets/registry/status
```

Knowledge Explorer tree **reads registry first**, filesystem second for cache miss only.

---

## Exit criteria

```txt
[x] digital_assets table populated from incremental sync
[x] file_index migration path documented in code
[x] Explorer tree uses registry for metadata where available
[x] Lifecycle stage assigned per asset
[x] No full-drive scan on startup
[x] npm run check && npm run test pass
```

---

## Commit

`feat: add digital asset registry foundation`

**Next:** LB-OS-007 Digital Asset Intelligence Engine

---

*LB-OS-006 · Digital Asset Registry · ✅ Complete*
