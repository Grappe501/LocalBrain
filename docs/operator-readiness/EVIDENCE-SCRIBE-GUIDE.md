# Evidence Scribe Guide

> **Role:** Capture exactly what happened — one person per session, separate from facilitator and operator  
> **Pair with:** [Facilitator Card](./OPERATOR-SESSION-FACILITATOR-CARD.md) · [Evidence template](./WALKTHROUGH-001-EVIDENCE-TEMPLATE.md)

---

## Responsibility

> Capture exactly what happened.

**Not your job:**

- Interpretation
- Recommendations
- Solutions
- Defending the platform
- Helping the operator succeed

The scribe protects evidence quality. The facilitator protects session discipline. The operator produces the signal.

---

## What to write

Use plain language and timestamps where possible.

| Capture | Example |
| ------- | ------- |
| Action | *09:14 — opened Ingestion Studio, uploaded CSV* |
| Hesitation | *09:18 — paused 12s on duplicate warning, re-read label* |
| Question | *09:21 — "Is this the same person or a different Kelly?"* |
| Wrong turn | *09:24 — opened Contacts before commit; returned to queue* |
| Recovery | *09:26 — found Commit action from work item list* |
| Unexpected success | *09:30 — matched Jane to voter file without help* |
| Workaround | *09:33 — copied name from OCR preview into manual field* |
| Facilitator prompt | *09:35 — facilitator: "What would you do next?" (allowed)* |
| Contamination | *09:40 — P1 assistance: showed queue filter (logged)* |

Write **what** happened. Not **why** it happened. Not **what we should build**.

---

## During the session

- Keep the [evidence template](./WALKTHROUGH-001-EVIDENCE-TEMPLATE.md) open
- Fill phase timestamps, durations, and verbatim notes as you go
- Flag human interventions and assistance levels immediately
- If unsure whether something is interpretation, write the observable behavior only

**Good:** *Operator scrolled past Voter Verification twice before opening it.*

**Bad:** *Voter Verification UX is confusing.*

---

## After the session

Hand the raw capture to the facilitator for:

- Post-session debrief answers (operator voice)
- Readiness dimension scoring
- Sign-off block

**Interpretation** (patterns, OECs, smallest justified changes) happens **later** — by the evidence analyst, not during the session.

```text
Evidence  →  Interpretation  →  Recommendation
     ↑              ↑                    ↑
  Scribe      Evidence analyst    Governance + engineering
  (this role)   (post-session)      (bounded, doctrine-preserving)
```

---

## Session checklist

- [ ] Scribe name recorded in evidence template
- [ ] Build / environment recorded
- [ ] Phase start/end times captured
- [ ] Contamination log complete (or explicitly *none*)
- [ ] No interpretive summaries in scribe notes
- [ ] Debrief Q&A captured verbatim

---

*Evidence Scribe Guide v1.0 · PRL-4 · LocalBrain · 2026*
