# LocalBrain Novel Studio v1.0

> **Creative Domain flagship** — far beyond a text editor.  
> Domains: [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) · Matrix cell: Creative × Memory + Intelligence

---

## Mission

First-class **novel workspace** — Steve's historical fiction (and future novels) as a living canon system.

---

## What Novel Studio understands

```txt
Story canon · historical timeline · characters · locations · genealogy
Research sources · maps · plot threads · unresolved questions
Chapter status · continuity conflicts · scene inventory
```

---

## Example queries

```txt
"Show me every scene where François Grappe interacted with the Caddo."
"Find continuity issues in Alexis's timeline."
"What unresolved plot lines exist?"
"Which chapters reference the 1830 treaty but haven't paid it off?"
```

**Remember + Think** — memory graph + intelligence, not generic chat.

---

## Object model

```txt
NovelWorkspace
├── canon_rules
├── characters[]      — traits, arcs, genealogy links
├── locations[]       — maps, historical notes
├── timeline_events[] — dated, sourced
├── plot_threads[]    — open/resolved
├── chapters[]        — status, scenes
├── scenes[]          — POV, characters present, location, date
├── research_sources[]
└── continuity_flags[]
```

Filesystem: H: novel project folder · Studio: intelligence layer above files.

---

## Engines

| Engine | ID | Job |
|--------|-----|-----|
| Canon registry | ENG-CR-001 | Characters, places, rules |
| Timeline engine | ENG-CR-002 | Dated events, conflicts |
| Scene index | ENG-CR-003 | Who/when/where index |
| Continuity checker | ENG-CR-004 | Flag contradictions |
| Genealogy graph | ENG-CR-005 | Family/lineage links |

---

## UI

```txt
Route: /studio/novel/:workspaceId
Tabs: Canon · Timeline · Characters · Scenes · Chapters · Research · Conflicts
```

LB-OS-002: Novel Studio route stub under Creative.

---

## Slice

LB-OS-102 · Creative division · Track A planning now, build post-015

---

*Novel studio v1.0 · Creative domain · 2026-06-28*
