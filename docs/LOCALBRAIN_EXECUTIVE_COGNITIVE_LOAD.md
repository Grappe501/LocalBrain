# Executive Cognitive Load (ECL)

> **Engine:** ENG-ECL-001 (planned)  
> **System:** [Executive Intelligence](./LOCALBRAIN_FOUR_SYSTEMS.md) (System 3)  
> **Phase:** 2 — Teach the Brain  
> **Parent:** [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md) · [Executive Mission Stack](./LOCALBRAIN_EXECUTIVE_INTENT.md) · [Executive Leverage Score](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md)

---

## Principle

Not system load. **Your load.**

CoS optimizes not only for mission completion ([MCP](./LOCALBRAIN_EXECUTIVE_INTENT.md#mission-completion-probability-mcp--eng-mcp-001)) but for **preserving executive attention**. Sometimes the best recommendation is not another task — it is reducing context switches or deferring lower-value work.

```txt
Wrong optimization:  Maximize tasks surfaced
Right optimization:  Maximize mission completion while minimizing cognitive load
```

ECL complements MCP: high MCP with high ECL may mean Steve is over-scheduled; CoS should recommend deferrals or focus mode.

---

## Example surface

```txt
Executive Cognitive Load
  LOW

Today's Mission Count        2
Outstanding Decisions        4
Urgent Interruptions         1
Context Switching            Low
Predicted Mental Fatigue     Medium after 4 PM
```

---

## Definition

**Executive Cognitive Load** is a composite estimate of **attention strain** on Steve — derived from mission count, pending decisions, interruption rate, context-switch frequency, and time-of-day patterns (Mission Memory / Executive Evolution inputs).

| Band | Meaning | CoS bias |
| ---- | ------- | -------- |
| **LOW** | Room for deep work | Normal Attention Budget |
| **MEDIUM** | Manageable · watch switches | Prefer single-mission blocks |
| **HIGH** | At capacity | Deep Focus mode · defer secondaries |
| **CRITICAL** | Overloaded | Protect primary only · explicit deferrals |

---

## Inputs (draft)

| Input | Source system |
| ----- | ------------- |
| Active mission count (primary + secondary) | Executive Intelligence · Mission Stack |
| Outstanding decisions | Executive Memory OS · Decision Ledger |
| Urgent interruptions (CoS, actions, calendar) | Executive OS · Actions |
| Context switches (workspace/route changes, dept hops) | Executive OS · session telemetry |
| Predicted fatigue | Executive Evolution · Mission Memory patterns |
| Attention Budget consumption | Executive Intelligence · ENG-AB-001 |

---

## Relationship to other metrics

```txt
Mission Completion Probability  — Will I finish the primary mission?
Executive Cognitive Load        — Am I being asked to carry too much?
Executive Leverage Score        — Did LocalBrain make me more effective?
Memory Confidence               — Do we know enough to advise well?
```

CoS should not raise MCP by recommendations that spike ECL without explicit Steve opt-in.

---

## Surfaces

```txt
Executive Briefing            — ECL band + 2–3 drivers
Mission Operating Mode        — "Load: LOW — safe for 6.2h focus block"
CoS response footer           — when recommending deferral due to load
System Health / effectiveness — trend (not machine CPU)
```

Does **not** live on Program Office (construction) or System Evolution alone — ECL is an **executive** metric.

---

## Contract (planned)

```txt
ExecutiveCognitiveLoadReport {
  band                       — low | medium | high | critical
  score                      — 0–100 (optional numeric)
  mission_count
  outstanding_decisions
  urgent_interruptions
  context_switch_level       — low | medium | high
  predicted_fatigue            — label + optional time window
  observed_at
  drivers[]                  — human-readable explanations
  recommended_mode           — normal | campaign | deep_focus
}
```

---

## Honesty rules

- ECL is **heuristic** — Steve can override mode
- Fatigue prediction labeled as estimate until Mission Memory matures
- Never shame; trend and protection, not gamification

---

*Executive Cognitive Load · ENG-ECL-001 · System 3 · Phase 2 · 2026-06-29*
