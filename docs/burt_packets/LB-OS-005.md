# BURT / CURSOR EXECUTION SCRIPT

**Project:** LocalBrain  
**Slice:** LB-OS-005  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-106 ✅  
**Authoritative spec:** [Knowledge Explorer](../LOCALBRAIN_KNOWLEDGE_EXPLORER.md)

---

## Mission

Build the **Knowledge Explorer** — not a Windows Explorer clone. Help Steve **understand** what's in approved folders via six lenses, workspace mapping, typed search, and "Explain this folder."

**Binding:** Folders are not the primary object. Internal chain: Filesystem → KnowledgeSource → LivingWorkspace → executive_context.

---

## Hard boundaries

**Do not:**

```txt
Scan entire H: drive on startup
Make folders the primary data model
Build a left-column file tree for the whole app shell
Index secrets, node_modules, .env
Auto-move or auto-delete files (LB-OS-010+)
```

**Do:**

```txt
Load workspace registry first · cached metadata second · visible tree third
Background index incrementally
Map paths to LivingWorkspace via filesystem_roots
Register filesystem as KnowledgeSource per workspace root
Lazy-load tree children from index
```

---

## Six lenses (UI tabs per node)

| Lens | 005 deliverable |
|------|-----------------|
| Physical | Full — tree, size, dates |
| Workspace | Full — resolve owner workspace |
| Knowledge | Stub — summary placeholder until index rich |
| Activity | Stub — mtime + index run hints |
| Relationship | Stub — WorkspaceLink empty OK |
| AI | Stub — "Explain this folder" minimal (workspace context); full AI LB-OS-008+ |

---

## Search prefixes (005 minimum)

```txt
file: budget.xlsx
workspace: localbrain
(path-only search without prefix)
```

---

## Explain this folder

Command or context action on folder node:

```txt
GET /api/knowledge-explorer/explain?path=...
→ purpose (from workspace executive_context if mapped)
→ owning workspace
→ file count / large files from cache
→ recommendations stub
```

---

## API (target)

```txt
GET  /api/knowledge-explorer/tree?path=&depth=
GET  /api/knowledge-explorer/explain?path=
GET  /api/knowledge-explorer/workspace-for-path?path=
POST /api/index/run          — background job trigger
GET  /api/index/status
GET  /api/search?q=          — parses file: workspace: prefixes
```

---

## SQLite

```txt
file_index       — path, size, mtime, workspace_id, excerpt
index_runs       — started, finished, paths_scanned
file_index_fts   — FTS5 on name + excerpt
```

---

## Exit criteria

```txt
[ ] Approved roots only — permission engine gates crawler
[ ] No full-drive scan before UI render
[ ] Workspace badge on nodes under filesystem_roots
[ ] file: and workspace: search work
[ ] Explain endpoint returns workspace mapping
[ ] Lens tabs render (stubs OK for non-Physical)
[ ] npm run check && npm run test pass
```

---

## Commit

`feat: add knowledge explorer tree and metadata index`

**Next:** LB-OS-006 Storage intelligence (uses same index)

---

*LB-OS-005 · Knowledge Explorer · 2026-06-28*
