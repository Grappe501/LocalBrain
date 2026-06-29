# LocalBrain Data & Intelligence Department v1.0

> **Slice:** LB-OS-014 · **Not a SQL console** — business capability for knowledge.  
> Mission: *What do we know, where does it come from, and what can we learn from it?*  
> Parent: [Knowledge Sources](./LOCALBRAIN_KNOWLEDGE_SOURCES.md) · [Data Platform](./LOCALBRAIN_DATA_PLATFORM.md) · [Department Organization](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md)

---

## Principle

```txt
Database = technology
Data & Intelligence = business capability
```

Aligns with Knowledge Sources abstraction and Chief of Staff orchestration. Steve asks questions — the department resolves sources, plans queries, explains lineage, and surfaces insights.

---

## Chief

| Role | Agent ID | Responsibility |
|------|----------|----------------|
| **Data Chief** | `data_chief` | Source health, query governance, insights, lineage |

---

## Department UI — six tabs

| Tab | Purpose |
|-----|---------|
| **Overview** | Data Health Score, connected sources, active queries, Chief recommendation, quality summary |
| **Knowledge Sources** | Full catalog — live + planned — status, sync, records, permissions, health |
| **Query Studio** | NL → query plan → SQL/API preview (execution blocked V1) |
| **Relationships** | Data relationship graph — workspace ↔ source ↔ assets ↔ modules ↔ decisions |
| **Insights** | Stale data, missing imports, opportunities |
| **Learn** | OJT stub — SQL, indexes, joins, APIs, normalization, modeling |

Route: `/studio/data` · Nav: **Data & Intelligence**

---

## Knowledge Sources catalog

Live (V1): LocalBrain SQLite, filesystem index, Digital Asset Registry, workspace registry, git, docs, module manifests.

Planned: Postgres, Google Drive, voter files, Census, BLS, contacts, email, calendar, ChatGPT archive, Cursor reports, future APIs.

User-facing rule: **Knowledge Source** — not "database."

---

## Query Studio (V1)

```txt
Natural language question
    ↓
Query plan (governed)
    ↓
SQL / API preview
    ↓
Explanation + lineage
    ↓
Execution BLOCKED until approval + connected source
```

Future: NL → SQL with sandboxed execution and OJT explain blocks.

---

## Data lineage (priority capability)

Every answer must eventually explain **where did this come from?**

```txt
Source → Transformation → Workspace → Query → Result
```

V1: lineage steps on query preview and dedicated API.

---

## Data Health Score

| Factor | Signals |
|--------|---------|
| Connectivity | Active vs planned sources |
| Freshness | Index freshness |
| Coverage | Catalog breadth |
| Integrity | Registry asset health |
| Documentation | Data/knowledge docs |
| Performance | Operational health cross-signal |
| Query Success | Plan-only success (V1) |
| Knowledge Quality | Healthy source ratio + graph |

---

## Guardrails (binding)

```txt
No arbitrary SQL execution in V1
No imports without approval
No writes to external systems
Permission engine on every path
Lineage on every governed answer
```

---

## LB-OS-014 bootstrap scope

**Build:**

```txt
Data & Intelligence Department (/studio/data)
Knowledge Sources catalog (live + planned)
Query Studio plan preview
Data relationship graph
Data lineage stub
Insights heuristics
Data Health Score
GET/POST /api/data-intelligence/*
data-studio manifest active
```

**Do not build in 014:**

```txt
Arbitrary SQL execution
Voter file import
External API connectors
Full NL → SQL with results grid
```

---

## V1 sequence

```txt
012 ✅ Engineering
013 ✅ Writing
014 Data & Intelligence  ← this doc
015 Relationship Intelligence
016 Executive OS V1 milestone
```

The three foundational departments:

```txt
Engineering      → builds and understands systems
Writing          → creates and manages narratives
Data & Intelligence → understands information and turns it into knowledge
```

---

*Data & Intelligence Department v1.0 · LB-OS-014 · 2026-06-29*
