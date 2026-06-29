# Executive Mission Stack

> **Phase:** 2 — Teach the Brain (first intelligence arc after Personal OS cutover)  
> **Engines:** ENG-EMS-001 Mission Stack · ENG-EI-001 Mission Alignment · ENG-AB-001 Attention Budget · ENG-MCP-001 Mission Completion Probability  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md) · [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md) · [Executive Leverage Score](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md)  
> **Also known as:** Executive Intent (refined) — single-intent model superseded by Mission Stack, June 2026

---

## Principle

Phase 1 gives LocalBrain a complete, trustworthy understanding of Steve's digital world.  
Phase 2 teaches it **what matters most today** — and what should stay quiet.

```txt
Phase 1 session start:  What workspace is active?
Phase 2 session start:  What is my Mission Stack?
```

| Surface | Answers |
| ------- | ------- |
| Executive Briefing (Phase 1) | *What is happening?* |
| Mission Operating Mode (Phase 2) | *What matters most today?* · *What should I defer?* |
| Mission Completion Probability | *Will I finish my primary mission today?* |

**Do not build in Phase 1.** Reserve for first Phase 2 arc after LB-OS-026.

---

## Why Mission Stack (not single Intent)

Steve rarely operates with one priority. Reality is layered:

- **One dominant objective** — today's primary mission
- **Several supporting objectives** — active but not today's critical path
- **Obligations that can't be ignored** — maintenance missions (email, calendar, finance, health)

A single Executive Intent was too flat. **Mission Stack** models how an executive actually works.

```txt
Executive Mission Stack
━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIMARY MISSION (1)
  Finish ContactListSOS MVP
━━━━━━━━━━━━━━━━━━━━━━━━━━
SECONDARY MISSIONS (3)
  • Secretary of State Campaign
  • Arkansas Civic University
  • LocalBrain Development
━━━━━━━━━━━━━━━━━━━━━━━━━━
MAINTENANCE MISSIONS
  • Email · Calendar · Finance · Health
```

Every recommendation must answer:

> **Which mission does this advance?**

If it advances **none** of them, it should almost never interrupt Steve.

---

## Alignment stack (Phase 2)

```txt
Executive Mission Stack
        ↓
Mission Completion Probability (MCP)     ← CoS north star
        ↓
Chief of Staff
        ↓
Attention Budget (adaptive mode)
        ↓
Executive Questions (EQ-* filtered by active mission)
        ↓
Mission Alignment Score (per recommendation)
        ↓
Executive Intelligence Cards (ranked · deferred if misaligned)
        ↓
Departments
        ↓
Living Workspaces
        ↓
Digital Assets
        ↓
Mission Memory (long-term habits · late Phase 2)
        ↓
Predictive Chief of Staff
```

---

## Mission Alignment (Executive Intent as scoring engine)

**Executive Intent** is no longer a single declared focus — it becomes **Mission Alignment scoring** (ENG-EI-001). Every recommendation, card, and briefing item receives:

```txt
Mission Alignment
  98%
  Supports:
    ✔ ContactListSOS MVP (Primary)

  — or —

  18%
  Supports:
    Maintenance only
```

CoS uses alignment + MCP delta as signals when deciding what deserves attention.

---

## Mission-aware Executive Questions

The [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md) (ENG-EQ-001, Phase 1) does **not** change. Questions become **filtered through the active mission**.

| Mission | Example questions (mission-scoped) |
| ------- | ---------------------------------- |
| ContactListSOS MVP | What is blocking launch? · Today's critical path? · Which bugs prevent deployment? · Missing documents? · Failed builds? |
| Novel Writing | Which chapter is next? · Continuity conflicts? · Missing research? · Characters needing development? |
| Campaign | Who needs follow-up? · Counties needing attention? · Approaching deadlines? · Unfinished speeches? |

CoS routes natural language → mission classification → mission-scoped EQ → authoritative `primary_route`.

---

## Adaptive Attention Budget (ENG-AB-001)

Static budgets assume the same interruption level every day. **Attention Budget is mode-aware:**

| Mode | Primary | Recommendations | Warnings | Watch Items | Everything else |
| ---- | ------- | --------------- | -------- | ----------- | --------------- |
| **Normal Day** | 1 | 5 | 3 | 5 | Quiet |
| **Campaign Week** | 1 | 8 | 5 | 10 | Quiet |
| **Deep Focus Mode** | 1 | 2 | Critical only | Hidden | Hidden |

CoS respects working style instead of assuming constant chatty capacity. Mode is declared by Steve or inferred from calendar/mission context (Phase 2+).

---

## Mission Operating Mode (briefing center)

Mission Operating Mode becomes the **center of the morning briefing** — not a sidebar on generic status.

```txt
Good morning, Steve.

Today's Primary Mission
  Finish ContactListSOS MVP

  Probability of completion:  82%
  Time required:              6.2 hours
  Largest blocker:            OAuth testing

Suggested schedule:
  9:00–12:00   Engineering
  1:00–3:00    Documentation
  3:00–4:00    Testing

Items intentionally deferred:
  • Campaign social media
  • Novel editing
  • Photo organization

Reason:
  They reduce today's probability of success.
```

One of the most valuable things CoS can do is explain **what not to work on today**.

---

## Mission Completion Probability (MCP) — ENG-MCP-001

**North star metric for the Chief of Staff.**

Rather than only reporting state, LocalBrain continuously estimates:

> **Probability that Steve will complete the current primary mission** (today or by declared deadline).

Every recommendation, schedule adjustment, and proposed action has one overarching purpose:

> **Increase MCP** — or explicitly defer with reason.

MCP aligns Executive Briefing, [Executive Leverage Score](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md), and CoS recommendations without adding parallel complexity.

```txt
MCP inputs (draft):
  • Primary mission scope remaining
  • Time available today (calendar-aware)
  • Blockers on critical path
  • Historical completion patterns (Mission Memory)
  • Deferred secondary missions (reduces distraction → increases MCP)

MCP outputs:
  • Briefing headline probability
  • "Items intentionally deferred" list
  • Recommendation rank (Δ MCP if accepted)
```

---

## Mission Memory (late Phase 2)

The system learns Steve's patterns over time:

- When he works best (time-of-day effectiveness)
- Typical engineering session length
- Morning vs evening writing completion
- Projects that tend to stall
- Tasks routinely postponed
- Recommendations usually accepted or rejected

CoS evolves from **recommendation engine** → **strategic partner** that understands habits and helps improve them.

Mission Memory feeds MCP and adaptive Attention Budget. Local only; inspectable; Steve can dispute inferences.

---

## Relationship to Executive Leverage Score

ELS measures outcomes **against mission completion**, not activity:

```txt
Primary Mission Completed?     80%
        ↓
Mission Completion Probability 82% → 94% (week trend)
        ↓
Executive Leverage Score        7.8 / 10
        ↓
Time Saved                      4.2 hours
        ↓
Recommendations Accepted        12
        ↓
Decision Friction Removed       18
```

See [Executive Leverage Score](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md).

---

## Phase 2 build order (binding direction)

```txt
Personal OS cutover (026)
  ↓
Executive Intelligence (EIC + Simulation — inherited from Phase 1)
  ↓
Mission Stack Engine              (ENG-EMS-001)
  ↓
Attention Budget (adaptive)       (ENG-AB-001)
  ↓
Executive Question Router         (mission-filtered EQ)
  ↓
Mission Alignment Scoring         (ENG-EI-001)
  ↓
Adaptive Prioritization           (EIC rank · deemphasis · deferrals)
  ↓
Mission Completion Probability    (ENG-MCP-001)
  ↓
Executive Leverage optimization   (ENG-ELS-001)
  ↓
Mission Memory
  ↓
Predictive Chief of Staff
```

**Prerequisites:** Phase 1 complete (026) · Question Registry (020.5) · EIC + Simulation (020).

---

## Contracts (planned)

### MissionStack

```txt
MissionStack {
  stack_id
  observed_at
  primary_mission          MissionSlot     — exactly one
  secondary_missions       MissionSlot[]   — 0–N
  maintenance_missions     MissionSlot[]   — obligations
  attention_mode           normal | campaign | deep_focus
  declared_by              steve | cos_suggested
}

MissionSlot {
  mission_id
  label                    — "Finish ContactListSOS MVP"
  workspace_ids[]
  mission_type             primary | secondary | maintenance
  active_from / active_until
  completion_percent       — 0–100
}
```

### MissionAlignment (per recommendation / EIC)

```txt
MissionAlignment {
  alignment_percent        — 0–100
  supports_mission_ids[]
  primary_mission_support  boolean
  maintenance_only         boolean
  mcp_delta_if_accepted    — estimated Δ MCP (-100..+100 bps)
}
```

Not foundational objects — compose LivingWorkspace + CoS session state + EQ registry.

---

## Session start (Phase 2 UX)

```txt
Good morning, Steve.

Primary Mission
  Finish ContactListSOS MVP        [ Change ]
  MCP: 82% (↑6 since yesterday)

Secondary (3 active) · Maintenance (4 standing)

Today's Executive Questions (primary-mission filtered)
  What is blocking launch?
  What is today's critical path?
  …

Attention remaining: 4 priority · 2 warnings · Deep Focus off
Items deferred today: 3 (tap to see why)
```

---

*Executive Mission Stack · ENG-EMS-001 · Phase 2 cornerstone · refined from Executive Intent · 2026-06-29*
