# LocalBrain Research Division v1.0

> **Research Domain** — unified intelligence, one prompt.  
> Data: [Data Platform](./LOCALBRAIN_DATA_PLATFORM.md) · Matrix: Research column

---

## Mission

One research brain — no context switching between Census tab, voter DB, GIS tool, and spreadsheet.

---

## Data sources (phased)

| Source | Phase | Integration |
|--------|-------|-------------|
| Personal notes / docs | V1 | Search index |
| Voter files | V1 | Data platform import |
| Census | V2 | API + blocks |
| BLS | V2 | API |
| County data | V2 | Imports |
| GIS / precincts | V2 | Join engine |
| Election history | V2 | Tables |
| Legislative tracking | V3 | Feeds |
| Public APIs | Ongoing | Catalog |

---

## Example

```txt
"Show me Pulaski County registration growth by precinct against Census population growth."
```

Planner pulls: voter registrations · census blocks · precinct GIS · returns table + narrative.

---

## Chief

`research_chief` · delegates to `data_chief` for SQL · CoS for briefing inclusion.

---

## Slice

LB-OS-103 · depends 098, 099

---

*Research division v1.0 · 2026-06-28*
