# LocalBrain AI Evolution Engine v1.0

> **Pillar 15** — LocalBrain continuously improves itself.  
> Capabilities: [AI Capability Architecture](./LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md) · Measurement: [Self-Measurement Model](./LOCALBRAIN_SELF_MEASUREMENT_MODEL.md) · Track: [Dual-Track Roadmap](./LOCALBRAIN_DUAL_TRACK_ROADMAP.md)

---

## Mission

Not merely "support multiple APIs."

```txt
LocalBrain learns which model wins for each job — and gets smarter over time
without waiting for a bigger LLM or a GPU server.
```

Intelligence grows from **architecture + memory + measurement + preferences** — GPU accelerates later.

---

## What it learns

```txt
Which model produces the best Burt packets
Which model writes the best campaign copy
Which model is cheapest for summarization
Which model is fastest for code explanation
Which local model is "good enough"
Which tasks should stay entirely local
```

Output: **internal performance scorecard** per capability — measured, refreshable.

---

## Engines

| Engine | ID | Job |
|--------|-----|-----|
| AI capability registry | ENG-EV-001 | Capabilities + provider map |
| Capability router | ENG-EV-002 | Request capability → provider+model |
| Self-measurement pipeline | ENG-EV-003 | Capture all interaction metrics |
| Outcome scorecard | ENG-EV-004 | Aggregates, dashboards, export |
| Preference learner | ENG-EV-005 | Update capability_preferences |
| Evolution dashboard | ENG-EV-006 | UI for scorecard + trends |

---

## Scorecard example

| Capability | Preferred | Why (generated) |
|------------|-----------|-----------------|
| Code generation | openai / *model* | 94% burt_ok, 12% revise rate |
| Long-form writing | anthropic / *model* | 78% accepted, voice match |
| Quick summaries | openai / mini | $0.002 avg, 96% useful |
| Local/private | local_gpu | Policy + zero $ |
| Classification | local_nn | 89% accuracy on holdout |

**Configurable** — Steve can override; system re-measures continuously.

---

## Queue arc (LB-OS-076–082)

| Slice | Focus | Track |
|-------|-------|-------|
| 076 | Evolution doctrine + dual-track embedded | A |
| 077 | AI capability registry | A |
| 078 | Capability router refactor | A |
| 079 | Self-measurement pipeline | A |
| 080 | Outcome scorecard engine | A |
| 081 | Model preference learner | A |
| 082 | AI Evolution dashboard | A |

**Depends on:** LB-OS-065 minimum (provider router); full value with 055 (token log).

**Gate:** **AI EVOLUTION** = LB-OS-082

---

## Relationship to pillars

| Pillar | Role |
|--------|------|
| 11–12 | Cost + tokens feed scorecard |
| 13 | Adapters behind capability router |
| 14 | Local models enter scorecard when Track B live |
| 16 | Chief of Staff uses scorecard + signals for proactive advice |

---

## LB-OS-002

Scorecard teaser in **AI Provider** card: "Preference learning: planned"

Full dashboard: LB-OS-082 `/system/evolution`

---

*AI evolution engine v1.0 · Pillar 15 · 2026-06-28*
