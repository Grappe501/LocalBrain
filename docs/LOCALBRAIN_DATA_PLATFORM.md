# LocalBrain Data Platform v1.0

> **Data Domain** — real data layer beyond SQLite alone.  
> Matrix: [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) · Studio: [Database Studio](./LOCALBRAIN_DATABASE_STUDIO.md)

---

## Mission

LocalBrain has its own **data platform** — every source queryable through natural language.

```txt
Not: SQLite for app state only
Yes: Unified data layer for Steve's operating company
```

---

## Data sources (catalog)

```txt
Data Sources
├── Contacts / Relationships
├── Voter Files
├── Census
├── BLS
├── County Data
├── GIS
├── Campaign Finance
├── Calendar
├── Email (metadata)
├── Photography Metadata
├── Podcast Metadata
├── Personal Notes
├── Project Metrics
├── Finance / Ledger
└── AI Memory
```

Each source: **registered** · **schema documented** · **import path** · **permission scope**

---

## Architecture

```txt
┌─────────────────────────────────────────┐
│  Natural Language Query (Chief of Staff   │
│  or Database Studio)                    │
└─────────────────┬───────────────────────┘
                  ▼
         ENG-DP-001 Query Planner
                  ▼
    ┌─────────────┴─────────────┐
    ▼             ▼             ▼
 SQLite       DuckDB/Parquet   External APIs
 (app)        (analytics)      (Census, etc.)
```

**Remember for me** at scale · feeds Research, Finance, Relationships, Creative canon exports.

---

## Engines

| Engine | ID | Job |
|--------|-----|-----|
| Data catalog | ENG-DP-001 | Register sources, schemas |
| Import pipeline | ENG-DP-002 | CSV, voter file, shapefile stubs |
| Query planner | ENG-DP-003 | NL → SQL / API plan |
| Normalization | ENG-DP-004 | Addresses, dedupe, geocode stubs |
| Index builder | ENG-DP-005 | Indexes, lookup tables |
| Data lineage | ENG-DP-006 | What import created what |

---

## Example queries

```txt
"Find everyone in contacts who lives in White County, donated before,
 and attended two campaign events."

"Compare voter turnout with Census growth."

"Show Pulaski registration growth by precinct vs population growth."
```

---

## Storage layout

```txt
local_data/data_platform/
  catalog.json
  sources/{source_id}/
    schema.json
    raw/
    normalized/
    indexes/
```

H: may hold large files (voter dumps, GIS) — platform references paths, permission engine gates.

---

## Queue

| Slice | Focus |
|-------|-------|
| LB-OS-098 | Data platform foundation + catalog |
| LB-OS-099 | Database Studio |

---

*Data platform v1.0 · Data domain · 2026-06-28*
