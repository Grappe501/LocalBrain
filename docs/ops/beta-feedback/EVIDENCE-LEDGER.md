# Evidence Ledger — Commercial Beta

> **Type:** Session registry · cumulative metrics · hypothesis tally  
> **Canonical artifact:** [BETA-OBS session records](./BETA-OBS-SCHEMA.md) · organized by **evidence** · not by bug  
> **Authority:** [ENG-BETA-001.5](../../commercial-beta/ENG-BETA-001.5-FEEDBACK-ISSUE-TRIAGE.md)

---

## Purpose

This ledger registers every **BETA-OBS** session and tracks cumulative readiness metrics. The institutional evidence lives in individual session files — not here.

```text
Engineering evidence  →  commits · tests · PMO evaluations
Beta evidence         →  BETA-OBS-NNN session records (Evidence NNN entries)
Evidence Ledger       →  registry · metrics · hypothesis tally
```

Not every important finding is a difficulty. The ledger tracks **positive evidence** and **self-recovery** alongside human-help.

---

## Readiness metrics (cumulative)

| Metric | Definition | Trend target |
| ------ | ---------- | ------------ |
| **Human-help count** | Times operator asked another human what to do | → zero |
| **Self-recovery count** | Paused · looked · continued without help | → up |
| **Architecture exposure** | Times internal architecture had to be explained | → zero |
| **Positive evidence entries** | Disposition = Positive evidence | → up |

---

## Session registry

| Session ID | Operator | Phase | Date | W-001 | Human-help | Self-recovery | Arch. exposure | Pos. evidence | File |
| ---------- | -------- | ----- | ---- | ----- | ---------- | ------------- | -------------- | ------------- | ---- |
| BETA-OBS-001 | Kelly | A | | | | | | | [001](./BETA-OBS-001-KELLY-REFERENCE-OPERATOR-SESSION.md) |
| BETA-OBS-002 | Chris | A | | | | | | | *(pending)* |
| BETA-OBS-003+ | | B/C | | | | | | | |

**Phase A gate:** BETA-OBS-001 + 002 complete · hypotheses evaluated · human-help trending down · self-recovery documented.

---

## Hypothesis tally (cross-session)

Update after each session. Evidence **supports** or **weakens** each hypothesis.

| Hypothesis | Journey step | Supports | Weakens | Neutral | Notes |
| ---------- | ------------ | -------- | ------- | ------- | ----- |
| H-001 | Welcome | | | | |
| H-002 | Workspace | | | | |
| H-003 | Contacts | | | | |
| H-004 | Communications | | | | |
| H-005 | Review | | | | |
| H-006 | Follow-up | | | | |
| H-007 | Return | | | | |

---

## Journey severity scale

| Level | Meaning |
| ----- | ------- |
| **J0** | Completed naturally |
| **J1** | Brief hesitation |
| **J2** | Needed clarification |
| **J3** | Needed demonstration |
| **J4** | Could not continue |

---

## Creating a new session

1. Copy structure from [BETA-OBS-SCHEMA](./BETA-OBS-SCHEMA.md)
2. Assign next BETA-OBS-NNN · name file accordingly
3. Record build/commit at session start
4. Add row to session registry above
5. Update hypothesis tally after session
6. Complete recommendations in session file — not during observation

---

*Evidence Ledger · ENG-BETA-001 pilot · LocalBrain V1 · 2026*
