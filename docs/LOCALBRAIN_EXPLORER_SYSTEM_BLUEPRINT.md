# LocalBrain Explorer System Blueprint v1.0

> **Pillar 2:** Next-generation file explorer.  
> Doctrine: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Map: [Capability Map](./LOCALBRAIN_CAPABILITY_MAP.md)

---

## Vision

LocalBrain Explorer is **not** a chat sidebar listing files. It is a first-class spatial interface — better than Windows Explorer for Steve's projects.

```txt
Folders tell you where files live.
LocalBrain tells you what files mean, how they relate, and what to do next.
```

---

## Core Views

### Project-based view (primary)

```txt
General Files · RedDirt · ACU · CountyWorkbench · VoteMatch
SOS Public · AJAX · Phatlip · LocalBrain
```

Each project shows: recent files, key docs, build status, AI summary, related workstreams.

### Timeline view

```txt
What changed this week across all approved folders
Grouped by day · filter by project · highlight CLOSEOUT/REPORT files
```

### Recent work view

```txt
Last opened · last edited · last referenced in chat
Steve's actual workflow, not alphabetical sort
```

### Collection views (not folder-bound)

```txt
Documents · Codebases · Reports · Drafts · Media
Social posts · Campaign assets · Build history
```

---

## File Object (Rich Card)

Every file is an object, not a row:

```txt
filename · path · project · type · modified
AI excerpt · "why this matters" · related files · tags
actions: Read · Summarize · Open folder · Propose move · Add to workstream
```

---

## AI-Native Features

| Feature | Description | Phase |
|---------|-------------|-------|
| Folder summary | AI paragraph on folder purpose + contents | V1 (008) |
| Why this matters | One-line relevance for reports/drafts | OS v2 |
| Related files | Co-reference, same project, same topic | OS v2 |
| Smart tagging | Auto + manual tags in SQLite | OS v2 |
| Duplicate detection | Hash + fuzzy name match | OS v3 |
| Semantic search | Meaning, not filename (embeddings) | OS v3 |
| File lineage | Index run + backup + action log chain | OS v2 |
| AI organize | Propose folder restructure → approval | OS v3 |

---

## Interaction Model

```txt
Browse ←→ Search ←→ Chat (same selection context)
Drag/drop → always creates proposed_action, never silent move
Right panel: sources, tool activity, pending approvals (LB-UI-011)
```

---

## UI Surfaces

| Surface | Route | Slice |
|---------|-------|-------|
| Search (bootstrap) | `/search` | 007 |
| Projects | `/projects` | 012 |
| Explorer (full) | `/explorer` | OS v2 TBD |
| Timeline | `/explorer/timeline` | OS v2 TBD |

Evolve `/search` into `/explorer` — do not throw away V1 work.

---

## Data Layer

**V1:** `file_index` + FTS5 + `project_guess`  
**OS v2:** `file_tags`, `file_relations`, `folder_summaries`, `workstreams`  
**OS v3:** `embeddings` table (local), duplicate groups

---

## Safety

```txt
Explorer only shows approved-folder index
Blocked files: metadata only, never content
Organize/move: approval + backup + log
No whole-drive tree
```

---

## V1 → OS Acceptance

```txt
[ ] V1: search finds ACU Cursor report with ranking
[ ] V2: project view is default landing for file work
[ ] V2: timeline shows last 7 days of indexed changes
[ ] V3: "find files like this" semantic query works
[ ] V3: duplicate report for a folder with approve-to-merge path
```

---

*Explorer system blueprint version 1.0 · 2026-06-28*
