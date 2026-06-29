# LocalBrain AI Chief of Staff v1.0

> **Pillar 16** — the **lead AI** (never an "assistant").  
> **Reports to:** [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) (Pillar 17) · Evolution: [AI Evolution Engine](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md)

---

## Naming rule (binding)

```txt
DO NOT call the lead AI an "assistant."
CALL IT: Chief of Staff.
```

| Assistant | Chief of Staff |
|-----------|----------------|
| Waits to be told | Knows priorities, protects time |
| Answers prompts | Coordinates department chiefs |
| Tool-centric | Outcome-centric |

---

## Mission

The Chief of Staff **coordinates departments** and **surfaces what matters** before Steve asks.

```txt
CoS thinks in workspaces — not folders.
"Open RedDirt workspace" · "Summarize Novel workspace" · "Switch to Database Studio"
```

See [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) · `executive_context` on every workspace.

```txt
This intelligence does not require a bigger LLM.
It requires excellent architecture, rich project memory, thoughtful tooling,
and continuous learning (Pillars 12, 15, knowledge graph, Living Workspaces).
```

The GPU server **accelerates** — it is not a **prerequisite** for Chief of Staff behavior.

**Parent:** Pillar 17 [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) owns briefings, calendar, email, prioritization, effectiveness.

---

## Proactive behaviors (examples)

```txt
"This project has three conflicting design documents."
"You've written this grant language before — reuse it?"
"Your ACU project hasn't been updated in 18 days."
"This Burt packet is missing validation commands."
"You have four versions of this proposal — here's the newest."
"This coding concept came up five times — time for a deeper OJT lesson."
"RedDirt deployment checklist is 6/9 — blocking items listed."
"Token spend on writing is 2× last month — mostly Project X."
```

Each signal: **evidence links** · **suggested action** · **approval if risky**

---

## Signal sources

| Source | Signal type |
|--------|---------------|
| ENG-KG-001 / ENG-MR-003 | Conflicts, duplicates, version clusters |
| ENG-KP-001 Living Workspace | Stale project, health drop |
| ENG-KD-001 | Doc freshness, spec drift |
| ENG-KC-001 | Missing validation, slice gaps |
| ENG-OJ-001 / ENG-LP-002 | Repeated concepts |
| ENG-TE-001 / ENG-EV-004 | Spend anomalies |
| ENG-EV-003 | High rewrite rate → coaching |
| Migration / ST engines | Misplaced files, dup proposals |

**No signal auto-executes** — preview → Steve acts or dismisses.

---

## Engines

| Engine | ID | Job |
|--------|-----|-----|
| Proactive signal engine | ENG-CS-001 | Rule + AI ranking of signals |
| Conflict & stale detector | ENG-CS-002 | Docs, projects, versions |
| Briefing composer | ENG-CS-003 | Daily/weekly Chief of Staff brief |
| Briefing UI feed | ENG-CS-004 | CommandBar strip + workspace home |

---

## Briefing UX (LB-OS-002+)

```txt
CommandBar: "3 signals" pill → briefing drawer
Home / Living Workspace: Chief of Staff strip above signals
  - Priority ordered
  - Snooze / done / act
```

Not an ninth context card — **first-class strip** (more important than a tiny card).

---

## Queue arc (LB-OS-083–086)

| Slice | Focus | Track |
|-------|-------|-------|
| 083 | Chief of Staff doctrine embedded | A |
| 084 | Proactive signal engine | A |
| 085 | Conflict, stale, version, Burt-gap detectors | A |
| 086 | Chief of Staff briefing UI | A |

**Depends on:** 004 KP stub · 051+ memory · 077 capabilities (soft) · best after 024.

**Gate:** **CHIEF OF STAFF** = LB-OS-086

---

## Chief of Staff vs Evolution

| Pillar 15 Evolution | Pillar 16 Chief of Staff |
|---------------------|--------------------------|
| Which model is best? | What should Steve know/do? |
| Scorecard, preferences | Briefings, conflicts, nudges |
| Measures past | Shapes present |

Together: *"Use the fast model for this summary (15) — and ACU is stale (16)."*

---

## Safety

```txt
Signals are read-only until Steve approves an action
No shame metrics — dismiss snoozes respectfully
Chief of Staff does not bypass permission engine
```

---

*AI Chief of Staff v1.0 · Pillar 16 · 2026-06-28*
