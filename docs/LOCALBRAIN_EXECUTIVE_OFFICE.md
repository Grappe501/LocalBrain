# LocalBrain Executive Office v1.0

> **Pillar 17 — sits above every studio.**  
> Product: **AI Executive Operating System** · Domains: [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) · Matrix: [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) · CoS: [Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md)

---

## Product reframe

LocalBrain is not just software. It is Steve's **AI Executive Operating System**.

```txt
Not: AI app with features
Yes: Executive Office that coordinates departments, compounds effectiveness over time
```

**North star question (binding):**

```txt
Did Steve accomplish more meaningful work this week than he would have without LocalBrain?
```

Measured via [Effectiveness Metrics](./LOCALBRAIN_EFFECTIVENESS_METRICS.md) — not feature count.

---

## Executive Office owns

The Executive Office is **not another studio**. It sits **above** every studio.

```txt
Chief of Staff (lead AI — not "assistant")
Executive briefings (morning default — not dashboard-first)
Calendar intelligence
Email intelligence (classify → summarize → suggest → approve → send)
Project prioritization · workload balancing · delegation
Strategic recommendations · decision support
Personal productivity metrics · long-term goals
```

Everything else in LocalBrain exists to **support the Executive Office**.

---

## Chief of Staff — not an assistant

| Assistant | Chief of Staff |
|-----------|----------------|
| Waits to be told | Knows priorities |
| Answers prompts | Surfaces risks |
| Single chat | Coordinates department chiefs |
| Tool-centric | Outcome-centric |

```txt
An assistant waits.
A Chief of Staff protects time, coordinates specialists, and improves decisions.
```

**Never** label the lead AI "assistant" in product copy, agent registry, or UI.

---

## Organizational model

```txt
                           Steve
                             │
                     Chief of Staff AI
                             │
 ┌──────────────┬─────────────┼─────────────┬──────────────┐
 │              │             │             │              │
Engineering   Writing     Operations    Media         Research
Chief         Chief       Chief         Chief         Chief
 │              │             │             │              │
specialists   specialists  specialists  specialists   specialists
```

Plus divisions: **Finance/CFO** · Photography · Podcast · Creative/Novel · Data · Relationships · Campaigns · Learning · System Administration.

Full map: [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) · CFO: [Accounting & CFO Division](./LOCALBRAIN_ACCOUNTING_CFO_DIVISION.md)

---

## Steve's workflow (not studio-first)

**Wrong:**

```txt
Steve → Code Studio → agents
```

**Right:**

```txt
Steve
  ↓
Chief of Staff (intent, priorities, briefing)
  ↓
Department Chief (Engineering, Writing, …)
  ↓
Specialist agents
  ↓
Results
  ↓
Chief of Staff (synthesis, next actions, approvals)
  ↓
Steve
```

Command layer routes through **ENG-EO-002 Chief of Staff** before department dispatch.

---

## Monday morning (target experience)

Steve opens LocalBrain → **Executive Briefing** — not a blank dashboard.

```txt
Good morning, Steve.

Yesterday: two Burt packets completed.
RedDirt: deployment blocked — Netlify failed.
ACU: untouched six days.
Kelly: debate Friday.
Grants: three deadlines within thirty days.
API spend yesterday: $18.43.
Recommendation: focus CountyWorkbench this morning — highest leverage.
```

Template: [Executive Briefing Model](./LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md)

---

## What Chief of Staff always knows

```txt
What you're trying to accomplish
What's blocking you
What should happen next
What meetings matter (calendar)
What emails need attention
What opportunities you're missing
```

---

## Engines (Pillar 17)

| Engine | ID | Job |
|--------|-----|-----|
| Executive Office orchestrator | ENG-EO-001 | Top-level routing, goals |
| Chief of Staff lead | ENG-EO-002 | Delegation, synthesis, Steve interface |
| Department chief router | ENG-EO-003 | Route to department chiefs |
| Calendar intelligence | ENG-EO-005 | Time + leverage (not just sync) |
| Email intelligence | ENG-EO-006 | Classify, summarize, suggest — gated send |
| Workload prioritization | ENG-EO-007 | Leverage ranking, deep-work blocks |
| Effectiveness metrics | ENG-EO-008 | Meaningful-work scorecard |
| Executive briefing | ENG-CS-003 / ENG-EO-004 | Morning brief composer |

Pillar 16 engines (ENG-CS-*) report **into** Executive Office.

---

## Queue arc (LB-OS-087–096)

| Slice | Focus | Track |
|-------|-------|-------|
| 087 | Executive Office doctrine embedded | A |
| 088 | Chief of Staff orchestrator + dept routing | A |
| 089 | Executive briefing (replaces dashboard boot) | A |
| 090 | Calendar intelligence stub | A |
| 091 | Email intelligence stub (approval-gated) | A |
| 092 | Department chief framework | A |
| 093 | Photography division stub | A/B |
| 094 | Podcast division stub | A |
| 095 | Effectiveness metrics engine | A |
| 096 | Executive Office home | A |

**Depends on:** 086 (CoS briefing UI) · best after 024.

**Gate:** **EXECUTIVE OFFICE** = LB-OS-096

---

## LB-OS-002 change

```txt
Default boot: Executive Briefing placeholder (not generic dashboard)
Chief of Staff persona in CommandBar — never "assistant"
Department nav stubs in studio router
```

---

## Success metric

```txt
Time saved · projects completed · opportunities captured
API cost per deliverable · quality improvements · learning growth
Meaningful work index (weekly) — see Effectiveness Metrics
```

---

*Executive Office v1.0 · Pillar 17 · AI Executive OS · 2026-06-28*
