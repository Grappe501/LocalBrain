# LocalBrain Search & Indexing Plan v1.0

> **Local-first search over approved folders only.**  
> API: [API Contract v1.0](./LOCALBRAIN_API_CONTRACT.md) · DB: [Database Schema v1.0](./LOCALBRAIN_DATABASE_SCHEMA.md) · Safety: [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md) · Tools: [Tool Registry v1.0](./LOCALBRAIN_TOOL_REGISTRY.md) · Burt: [Burt Script Generator Plan v1.0](./LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md)

---

## Core Rule

```txt
LocalBrain only indexes approved folders.
It never indexes secrets.
It never scans the whole drive.
```

V1 uses SQLite + FTS5 keyword search. Vector/semantic search is a future enhancement (not in V1 MRIDs).

---

## 1. Indexing Flow

```txt
User approves folder
↓
Permission engine validates folder
↓
Indexer scans folder
↓
Forbidden paths skipped
↓
Metadata extracted
↓
Safe text excerpt extracted
↓
Record saved to SQLite
↓
Index run summary shown
```

**Backend modules:**

```txt
backend/src/indexer/
  crawler.ts
  metadataExtractor.ts
  textExtractor.ts
  ignoreRules.ts
  projectGuesser.ts
  indexRunner.ts
  indexStore.ts

backend/src/search/
  searchService.ts
  searchRanker.ts
```

**Slices:** 006 (indexer), 007 (search + ranking)

---

## 2. Indexed Fields

```txt
path
filename
extension
folder_path
project_id
project_guess
size_bytes
modified_at
content_excerpt
content_hash
indexed_at
is_blocked
blocked_reason
```

Stored in `file_index` table — **MRID:** LB-DB-006

---

## 3. Default Ignored Folders

```txt
.git
node_modules
dist
build
.next
.cache
coverage
vendor
local_data/backups
local_data/quarantine
```

Plus system forbidden paths from [Safety Model §6](./LOCALBRAIN_SAFETY_MODEL.md#6-forbidden-path-registry) (`C:\Windows`, `AppData`, `.ssh`, etc.).

**MRID:** LB-SEARCH-004

---

## 4. Blocked Secret Patterns

```txt
.env
.env.local
.env.production
*.pem
*.key
*.p12
*.pfx
id_rsa
id_ed25519
credentials.json
token.json
secrets.*
```

Blocked files: **never index content** (see §11).

Enforced by `permissionEngine` + `ignoreRules.ts`.

---

## 5. File Types to Index First

```txt
.md
.txt
.json
.ts
.tsx
.js
jsx
.css
.html
.sql
.yml
.yaml
.csv
```

**Later (post–V1 core):**

```txt
.pdf
.docx
.xlsx
pptx
images with OCR
audio/video transcripts
```

**MRID:** LB-SEARCH-003

---

## 6. Text Extraction Limits

```txt
Max indexed excerpt per file: 500 KB
Max read file direct: 2 MB
Max summarize file: 5 MB
Max files per scan: 25,000
Max search results: 100
Default search results: 20
```

**MRIDs:** LB-SEARCH-002, LB-SEARCH-003, LB-FILE-002, LB-SAFE-014

---

## 7. Project Guessing

Use path clues:

```txt
RedDirt → paths containing RedDirt
ACU → acu_lane_a, acu_lane_c, arkansas_civic_university
CountyWorkbench → countyWorkbench
VoteMatch → petition_match
SOS Public → sos-public
AJAX → ajax
Phatlip → phatlip
```

Fallback: `project_guess = "General Files"`, `project_id` null.

Implemented in `projectGuesser.ts` — **MRID:** LB-SEARCH-010 · **Slice:** 006

---

## 8. Search Ranking

Rank results by:

```txt
Exact filename match
Path match
Recent modified date
Project match
Content excerpt match
Important doc names
```

**Important doc boosts:**

```txt
README
HANDOFF
REPORT
CLOSEOUT
PROGRESS
REGISTRY
QUEUE
PROTOCOL
PLAN
ARCHITECTURE
```

Implemented in `searchRanker.ts` after FTS5 retrieval — **MRID:** LB-SEARCH-011 · **Slice:** 007

---

## 9. Search API Behavior

**Query:**

```txt
GET /api/search?q=acu cursor report&projectId=acu&limit=20
```

**Returns:**

```txt
filename
path
extension
project_guess
modified_at
excerpt
size_bytes
```

**Rules:**

```txt
Only indexed approved files (is_blocked = 0)
Never return forbidden paths
Default limit: 20, max: 100
Empty query → 400
Permission re-check on result paths
```

**MRIDs:** LB-SEARCH-006, LB-API-007

**Chat:** `search_files` tool uses same service — **MRID:** LB-TOOL-003 · **Slice:** 009

---

## 10. Re-Indexing

**Options:**

```txt
Full re-index approved folders
Re-index one project
Re-index one folder
Re-index recently modified files
Clear index and rebuild
```

**Large re-index should show:**

```txt
files seen
files indexed
files skipped
files blocked
errors
duration
```

**API:** `POST /api/index/scan` · **CLI:** `npm run index:scan`

**MRID:** LB-SEARCH-005

---

## 11. Blocked File Handling

Blocked files may appear only as safety metadata if useful:

```txt
filename
path
blocked_reason
```

**Never index blocked content.**

Set `is_blocked = 1` on `file_index` when a path is seen but rejected.

---

## 12. Index Run Record

Each scan creates:

```txt
index_run_id
started_at
completed_at
status
folders_scanned
files_seen
files_indexed
files_skipped
files_blocked
error_json
```

Stored in `index_runs` table — **MRIDs:** LB-DB-014, LB-SEARCH-012, LB-API-006

**Status API:**

```txt
GET /api/index/status
GET /api/index/runs
POST /api/index/scan
```

---

## 13. First Practical Search Goal

LocalBrain must handle:

```txt
Find the latest ACU Cursor report.
```

By searching for:

```txt
ACU
Cursor
report
closeout
latest
lane
slice
```

Ranking should surface recent `CLOSEOUT`, `REPORT`, and `HANDOFF` filenames in ACU paths. Validates north star before Burt pipeline (slice 015).

---

## 14. Search MRIDs

```txt
LB-SEARCH-001 — Approved-folder scanner
LB-SEARCH-002 — File metadata extraction
LB-SEARCH-003 — Text content extraction
LB-SEARCH-004 — Ignored folder rules
LB-SEARCH-005 — Re-index command
LB-SEARCH-006 — Search endpoint
LB-SEARCH-007 — Search UI
LB-SEARCH-008 — Search result cards
LB-SEARCH-009 — Folder summary search
LB-SEARCH-010 — Project guessing
LB-SEARCH-011 — Search ranking
LB-SEARCH-012 — Index run logging
```

| MRID | Priority | Slice |
|------|----------|-------|
| LB-SEARCH-001–005 | P0 | 006 |
| LB-SEARCH-010, LB-SEARCH-012 | P0 | 006 |
| LB-SEARCH-006–008, LB-SEARCH-011 | P0 | 007 |
| LB-SEARCH-009 | P1 | 008 |

**Related:** LB-DB-006, LB-DB-014, LB-API-006–007, LB-TOOL-003, LB-FIRST-006

---

## 15. Build Slices

| Slice | Deliverable |
|-------|-------------|
| 005 | Allowed folders + forbidden rules (prerequisite) |
| 006 | Indexer, project guess, index run logging, CLI scan |
| 007 | FTS5, search API, ranking, Search UI |
| 008 | Folder summary search |
| 009 | `search_files` in chat |
| 017 | First-run index step |

---

## 16. Validation

```txt
npm run index:scan
npm run test:indexer
npm run test:search
npm run check
```

**V1 acceptance:**

```txt
[ ] Only approved folders indexed; secrets never indexed
[ ] Search finds ACU Cursor report by keyword + ranking
[ ] Result cards show path, project_guess, excerpt, modified_at
[ ] Re-index shows files seen/indexed/skipped/blocked + duration
[ ] Chat search_files matches /api/search results
```

Aligns with [V1 North Star](./LOCALBRAIN_PRODUCT_DOCTRINE.md#v1-north-star).

---

*Search & indexing plan version 1.0 · 2026-06-28*
