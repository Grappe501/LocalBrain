# LocalBrain Enterprise Capability Matrix v1.0

> **Top-level planning artifact** — replaces endless new pillars.  
> Doctrine: [Operating System Doctrine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Domains: [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md)

---

## Purpose

LocalBrain is Steve's **second brain and operating company** — not a collection of disconnected AI features.

The matrix answers:

```txt
What exists? · What's missing? · Where does the next capability plug in?
```

**Not** a roadmap. **Not** a slice queue. The **map of the enterprise**.

---

## Four fundamental modes (everything fits one)

| Mode | Job | Examples |
|------|-----|----------|
| **1. Remember for me** | Memory, index, contacts, canon, books | Memory engine, data platform, relationship intel |
| **2. Think with me** | Reason, plan, decide, brief | Chief of Staff, research, novel continuity |
| **3. Do work with me** | Create, build, write, edit, ship | Engineering, Creative, Media, Podcast |
| **4. Run my business with me** | Books, compliance, KPIs, ops | **CFO/Accounting**, campaigns, grants, system |

Every feature tags one primary mode + one domain cell.

---

## Matrix columns — Executive Domains

| Domain | Chief | Scope |
|--------|-------|-------|
| **Executive** | Chief of Staff | Briefings, calendar, email, goals, decisions |
| **Engineering** | Engineering Chief | Burt, Cursor, Git, docs, architecture, builds |
| **Creative** | Creative Chief | Novel, writing, narrative, voices, canon |
| **Research** | Research Chief | Census, voters, GIS, elections, public data |
| **Data** | Data Chief | Data platform, Database Studio, imports, SQL |
| **Finance** | **CFO Chief** | Campaign books, compliance, household, business |
| **Operations** | Operations Chief | Campaigns, grants, CountyWorkbench, deadlines |
| **Media** | Media Chief | Social, photography, podcast |
| **Relationships** | Relationship Chief | Contacts, donors, follow-ups, introductions |
| **Learning** | Learning Chief | OJT tied to real work |
| **System** | SysAdmin Chief | Machine, storage, API, security |

Domains plug in without redesign — e.g. future Drone Division = new column.

---

## Matrix rows — Enterprise capabilities

| Capability | What it means |
|------------|----------------|
| **Memory** | Persist, recall, chunk, graph |
| **Intelligence** | Summarize, reason, score, recommend |
| **Automation** | Workflows, triggers, approval-gated runs |
| **Search** | Full-text, semantic, cross-source query |
| **Dashboards** | KPIs, health, spend, MWI |
| **AI** | Capability router, models, evolution |
| **Integrations** | APIs, email, calendar, external DBs |
| **Workflows** | Templates, pipelines, checklists |
| **Analytics** | Aggregates, trends, comparisons |
| **Reporting** | Compliance, books, exports, briefings |

---

## Example cells (filled = planned or exists)

| | Memory | Intelligence | Automation | Search | … |
|---|:---:|:---:|:---:|:---:|:---:|
| **Executive** | ✓ brief history | ✓ CoS | ○ | ✓ | |
| **Engineering** | ✓ closeouts | ✓ Burt | ✓ slices | ✓ index | |
| **Creative** | ✓ novel canon | ✓ continuity | ○ | ✓ scenes | |
| **Research** | ✓ sources | ✓ joins | ○ | ✓ NL query | |
| **Data** | ✓ platform | ✓ SQL gen | ✓ ETL | ✓ | |
| **Finance** | ✓ books | ✓ CFO brief | ○ compliance | ✓ ledger | |
| **Relationships** | ✓ contact obj | ✓ "haven't talked" | ○ follow-up | ✓ | |

○ = gap to fill · ✓ = documented/planned

**Live matrix UI:** LB-OS-105 · **Doc maintenance:** update this file when adding capabilities.

---

## Coherence rule (permanent — binding)

> **LocalBrain never becomes a collection of disconnected features. Every new capability must strengthen an existing engine, executive domain, or enterprise capability cell.**

Before any slice or doc:

```txt
[ ] Which of the four modes? (Remember / Think / Do / Run)
[ ] Which domain column?
[ ] Which capability row?
[ ] Which engine ID(s)?
[ ] Strengthens what — not orphan feature?
```

---

## Pillar freeze

```txt
Seventeen pillars remain the historical map (LB-OS-001–096).
New work uses: Executive Domains + Enterprise Capability Matrix + slice queue.
Do NOT add Pillar 18+ without Steve explicit approval.
```

**Modularity:** Matrix cells are filled by **modules**, not kernel bloat — [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md). **MODULARITY GATE = LB-OS-106** (before 005 and all studio expansion).

---

| Gap | Domain | Row | Priority |
|-----|--------|-----|----------|
| Novel canon engine | Creative | Memory + Intelligence | High |
| Data platform | Data | All rows | High |
| **CFO / accounting** | **Finance** | **Reporting + Compliance** | **High — from start** |
| Relationship intelligence | Relationships | Memory + Intelligence | High |
| Database Studio | Data | AI + Workflows | High |
| Research public APIs | Research | Integrations | Medium |

---

## Related docs

| Doc | Domain |
|-----|--------|
| [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) | Full domain tree |
| [Data Platform](./LOCALBRAIN_DATA_PLATFORM.md) | Data column |
| [Accounting & CFO](./LOCALBRAIN_ACCOUNTING_CFO_DIVISION.md) | Finance column |
| [Novel Studio](./LOCALBRAIN_NOVEL_STUDIO.md) | Creative column |
| [Relationship Intelligence](./LOCALBRAIN_RELATIONSHIP_INTELLIGENCE.md) | Relationships |
| [Database Studio](./LOCALBRAIN_DATABASE_STUDIO.md) | Data + AI row |

---

*Enterprise capability matrix v1.0 · planning apex · 2026-06-28*
