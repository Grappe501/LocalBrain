# LocalBrain Effectiveness Metrics v1.0

> **Pillar 17 · How we measure success.**  
> Executive Office: [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md)

---

## North star

```txt
Did Steve accomplish more meaningful work this week
than he would have without LocalBrain?
```

**Not:** "How many AI features does LocalBrain have?"

---

## Meaningful work index (MWI)

Weekly composite score (0–100) — transparent formula, Steve can inspect.

| Factor | Weight | Source |
|--------|--------|--------|
| Projects advanced | 25% | Living Workspace health delta |
| Deliverables completed | 25% | Burt closeouts, approved drafts, deployments |
| Time saved (self-reported + inferred) | 15% | ENG-EV-003 `minutes_saved` |
| Opportunities captured | 10% | CoS signals acted on |
| Learning growth | 10% | OJT concepts mastered |
| Cost efficiency | 10% | $ per deliverable vs baseline |
| Quality | 5% | Low rewrite %, validation pass |

**Engine:** ENG-EO-008 · **Slice:** LB-OS-095

---

## Instrumented metrics

```txt
Time saved (aggregate minutes/week)
Projects completed / advanced
Opportunities captured (signals → actions)
API cost per deliverable
Quality: acceptance rate, rewrite %, burt_ok rate
Learning growth: concepts mastered / week
Email: median response time (when email live)
Calendar: deep-work hours protected
```

---

## Dashboard surfaces

```txt
Executive briefing footer: "This week MWI: 72 (↑8)"
/system/effectiveness — trends, drill-down
Weekly email-style summary (optional, local only)
```

---

## Privacy & honesty

```txt
Steve can dispute / adjust MWI inputs
No gamification shame — trend over perfection
Metrics local only
```

---

## Compounding

```txt
Week 1: baseline
Week 12: MWI trend + cost/deliverable down + more slices shipped
Year 1: Executive OS compounds — GPU adds speed, not definition of success
```

---

*Effectiveness metrics v1.0 · Pillar 17 · 2026-06-28*
