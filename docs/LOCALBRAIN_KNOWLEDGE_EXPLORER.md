# LocalBrain Knowledge Explorer v1.0

> **LB-OS-005+** — not a file manager. A lens over workspaces, knowledge sources, and the Digital Twin.  
> **Internal name:** Knowledge Explorer (user may still see route `/explorer`).  
> Supersedes [Explorer System Blueprint v1.0](./LOCALBRAIN_EXPLORER_SYSTEM_BLUEPRINT.md) for LB-OS-005 execution.  
> Parent: [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md) · [Knowledge Sources](./LOCALBRAIN_KNOWLEDGE_SOURCES.md)

---

## Architectural shift (binding before 005)

**Old framing:**

```txt
Explorer = better Windows Explorer
Folders are the primary object
```

**New framing:**

```txt
Knowledge Explorer = understand what's in folders — not just list them
Windows Explorer already does folders well; LocalBrain's advantage is meaning
```

```txt
User sees folders.
LocalBrain thinks: Knowledge Source → Workspace → Executive Context.
```

Foundational objects **unchanged** — the explorer is another **lens**, not a new object.

---

## Internal object chain

Every node in the tree maps internally:

```txt
Filesystem path
    ↓
KnowledgeSource (kind: filesystem)
    ↓
LivingWorkspace (owner via filesystem_roots)
    ↓
executive_context · current_focus · success_definition
```

Folders are **not** the primary object. Workspaces and knowledge are.

---

## Three operating modes (binding)

Not just lenses — **how** Steve navigates:

### 1. Browse Mode

Traditional navigation. Fast. Minimal. Keyboard-friendly.

```txt
H:
└── SOSWebsite
```

Physical tree + workspace overlay badges. No panels required.

### 2. Understand Mode

Click a folder — immediately see (local metadata, no AI call required):

```txt
Purpose · workspace · executive context · health · current focus
Important files · recent activity · recommendations
```

### 3. Executive Mode

Chief of Staff perspective — not *what's in this folder* but *why it matters today*:

```txt
Supports highest-priority workspace · inactive project · duplicate versions
Deployment waiting · dormant folder · novel depends on this research
```

Decision support, not navigation.

---

## Workspace overlay (binding)

Subtle badges on folder rows — filesystem stays familiar:

```txt
📁 RedDirt
🟢 Healthy · 🎯 Active focus · 📌 Pinned

📁 Old Campaign
🟡 Dormant · 📦 Archive candidate
```

Overlay derives from LivingWorkspace flags, health_score, current_focus, and mtime — no new objects.

---

## Six lenses (every node)

Each folder/file node supports multiple views:

```txt
H:/
 └── SOSWebsite/
      ├── Physical       — traditional filesystem
      ├── Knowledge      — what is this?
      ├── Workspace      — owning LivingWorkspace
      ├── Activity       — momentum, dormancy, growth
      ├── Relationships  — graph edges
      └── AI             — Chief of Staff answers
```

### Physical lens

Traditional filesystem view:

```txt
Folders · files · size · dates · permissions (read-only in 005)
```

### Knowledge lens

What is this folder?

```txt
Summary · purpose · technologies · documentation status
Owner · related workspaces · index freshness
```

Feeds: cached metadata · ENG-KN-001 · workspace registry · future folder summaries.

### Workspace lens

Show the **LivingWorkspace** that owns this location:

```txt
H:/SOSWebsite/RedDirt
    ↓
Workspace: RedDirt
Mission · Current focus · Health · Next action · CoS summary
```

Resolve via `filesystem_roots` match — not folder name guessing alone.

### Activity lens

Beyond last-modified:

```txt
Most active this week · dormant · rapidly growing
Recently archived · AI recommendations (stub → CoS in later slices)
```

### Relationship lens

Connections from `WorkspaceLink` + future graph:

```txt
Related workspaces · shared contacts · databases · Git repos
Documents · APIs · modules
```

### AI lens

Chief of Staff can answer (005 stub → 008+ full):

```txt
Why does this folder exist?
Can it be archived? · Is there duplication?
Which novel/campaign uses this?
Which Burt packet created this?
```

---

## Signature feature: "Explain this folder"

Right-click or command on any folder:

```txt
> Explain this folder.
```

Response includes:

```txt
Purpose · owning workspace · important documents
Duplicate risks · stale files · health
Recommendations · related workspaces
```

This is where LocalBrain feels like **Chief of Staff**, not a file browser.

**Slice target:** LB-OS-005 ships tree + cached metadata + workspace mapping; **Explain** ships minimal (workspace + path context) in 005, rich (AI) in LB-OS-008/009.

---

## Search philosophy

### Typed search (entity-first)

```txt
file: · workspace: · person: · campaign: · decision: · module: · agent: …
```

**005 scope:** `file:` · `workspace:` · path — wired to index + registry.

### Action-first search (005+)

```txt
archive: · duplicate: · stale: · large: · health: · focus: · recent: · decision:
```

Examples: `duplicate:` → duplicate candidates · `focus:` → workspaces with current_focus · `stale:` → dormant paths.

North star: *"Show me everything related to the Buffalo River article"* — without caring where it's stored.

---

## "Why am I seeing this?" (binding)

When CoS or Executive Mode surfaces a folder:

```txt
Why am I seeing this?
→ why it surfaced · owning workspace · what changed · decision facing
```

Transparency builds trust — not opaque AI recommendations.

---

## Performance rules (binding)

Never ask *"What files exist?"* on startup. Ask *"What changed?"*

```txt
1. Load Workspace Registry immediately     (already live — LB-OS-004)
2. Load cached metadata from SQLite        (file_index from prior runs)
3. Populate visible folders first          (lazy tree expand)
4. Index in background                     (permission-gated crawler)
5. Update incrementally                    (mtime watchers / scheduled delta)
```

Startup stays fast even when H: contains millions of files.

**Anti-pattern (forbidden):** full-drive walk before first paint.

---

## Asset Registry (LB-OS-006+)

LB-OS-005 `file_index` **evolves into** the central [Digital Asset Registry](./LOCALBRAIN_DIGITAL_ASSET_MODEL.md).

```txt
Knowledge Explorer → reads Asset Registry (not raw filesystem on every click)
Registry → incremental sync from approved roots
Chief of Staff → queries registry for dormant assets, duplicates, lifecycle
```

---

## LB-OS-005 build scope

```txt
Route:              /explorer  (label: Knowledge Explorer)
Engine:             ENG-EX-001 → rename responsibility to Knowledge Explorer Service
Indexer:            crawler, metadataExtractor, textExtractor (background)
SQLite:             file_index, index_runs, FTS5
Tree:               lazy-load children; workspace badge on nodes
Lenses (005):       Physical + Workspace (Knowledge/Activity/Relationship/AI = stubs)
Search:             file: · workspace: · path filter in command bar + explorer
Explain this folder: minimal — workspace context + path metadata (AI in 008+)
API:                /api/knowledge-explorer/tree · /api/search · /api/index/*
KnowledgeSource:    register filesystem roots as sources per workspace
```

**Exit criteria (005):**

```txt
[ ] Three modes: Browse · Understand · Executive
[ ] Workspace overlay badges on tree nodes
[ ] Tree shows approved workspace roots only — no full H: scan on startup
[ ] Nodes resolve to LivingWorkspace via filesystem_roots
[ ] Typed + action-first search (file: workspace: focus: stale: duplicate: …)
[ ] Explain this folder + Why am I seeing this?
[ ] Background incremental index
[ ] Secrets/node_modules never indexed
```

**Commit:** `feat: add knowledge explorer tree and metadata index`

---

## Module registration

Knowledge Explorer is a **kernel route** (Layer 2 essential OS), not a department module — but it **consumes** module manifests and Knowledge Sources. No domain hard-coding in tree logic.

---

## Related docs

| Doc | Role |
|-----|------|
| [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) | DEC-KE-001 Knowledge Explorer |
| [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) | Workspace lens |
| [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md) | Machine + company context |
| [Burt packet LB-OS-005](./burt_packets/LB-OS-005.md) | Execution spec |

---

*Knowledge Explorer v1.0 · architecture lock before LB-OS-005 · 2026-06-28*
