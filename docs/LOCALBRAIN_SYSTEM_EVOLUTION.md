# System Evolution — Executive Office

> **System:** [Executive Evolution](./LOCALBRAIN_FOUR_SYSTEMS.md) (System 4) · intelligence learning scoreboard  
> **Engine:** ENG-EVO-001  
> **Parent:** [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md) · [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) · [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md)  
> **Sibling:** [Executive Program Office](./LOCALBRAIN_EXECUTIVE_PROGRAM_OFFICE.md) (System 1) — measures **construction**, not intelligence

---

## Principle

```txt
Program Office  →  "What did we build?"
System Evolution →  "What did the system learn?"
Executive Leverage Score →  "How much more effective am I?"
```

The Program Office is a **projection of authoritative build sources** (checklist, git, tests, docs).  
System Evolution is a **projection of learning and usefulness** (decisions, outcomes, CoS accuracy, maturity gains).

---

## Placement

```text
Executive Office
    Executive Briefing           ← Executive Intelligence Cards (ENG-EIC-001 · LB-OS-020)
    Program Office (EPO)         ← build mission control  ✅ LB-OS-012.5
    System Evolution             ← intelligence scoreboard  📋 LB-OS-035
    System Health                ← machine + ops
    Decisions                    ← decision ledger
```

Phase 2 surfaces **learning cards** as Executive Intelligence Cards — same model as consolidation (020).

---

## Question maturity metrics (Phase 2+)

Per [Executive Epistemology Convention](./LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md) — Evolution measures organizational maturity through questions, not only recommendation acceptance:

```txt
Questions answered
Questions eliminated
Questions discovered
Questions deferred
Recurring questions
```

---

```text
What became smarter this month?
What has the Chief of Staff learned?
Which recommendations are now more accurate?
How many decisions became reusable knowledge?
What capabilities crossed from L1 → L2 (or L2 → L3)?
Which departments improved?
Which workflows were automated?
How much time did LocalBrain save?
```

---

## Data sources (authoritative projections)

System Evolution must be **data-driven**, like EPO — not hand-maintained JSON.

| Signal | Source | Phase 2 use |
| ------ | ------ | ----------- |
| Experience maturity gains | ENG-EXP-001 / surface registry | L1→L2 crossings per route |
| CoS recommendation outcomes | `outcomeStore`, command flight records | Accuracy trend |
| Decisions → reuse | Decision Ledger + changelog | Reusable knowledge count |
| Approval patterns | Actions log | Automated vs manual ratio |
| Workspace momentum | LivingWorkspace events + focus changes | Stale vs advancing workspaces |
| Department scores | Engineering / Writing / Data / Relationship scores | Month-over-month delta |
| Effectiveness proxy | [Effectiveness Metrics](./LOCALBRAIN_EFFECTIVENESS_METRICS.md) | Time saved estimates |
| Build velocity (context only) | ENG-BLD-001 | Secondary — not primary headline |

---

## Dashboard panels (v1 spec)

### 1. Intelligence headline

Single sentence from CoS synthesizing the month — e.g. *"Relationship follow-ups improved; engineering debt visibility up; writing drafts still template-only."*

### 2. Maturity crossings

Table from ENG-EXP-001:

```text
/workspace          L1 → L2   (live projection added)
/actions            L2        (no change)
/program-office     L2 → L3   (when CoS insights land)
```

### 3. CoS learning

- Recommendations issued vs accepted vs outcomes recorded
- Confidence calibration (high-confidence hits / misses)
- Top recurring recommendation themes

### 4. Decision compounding

- New binding decisions this month
- Decisions cited in later slices / docs
- Open decisions aging

### 5. Department intelligence delta

Per department: score change, chief recommendation shift, new capabilities unlocked.

### 6. Time & effectiveness (honest)

- **Executive Leverage Score (ELS)** month-over-month delta — see [ELS spec](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md)
- Estimated time saved (heuristic, labeled as estimate)
- Workflows that moved from manual → approval-gated → automated
- **North star:** meaningful work accomplished (link to effectiveness metrics)

---

## What System Evolution is NOT

- Not a duplicate Program Office scoreboard
- Not a git commit viewer (EPO owns commit timeline)
- Not a slice checklist editor
- Not a vanity metrics dashboard

---

## Deliverables (LB-OS-035)

- [ ] `ENG-EVO-001` — evolution projection engine
- [ ] `GET /api/evolution/overview` — read-only
- [ ] Frontend route under Executive Office
- [ ] Maturity crossing detector (diff vs prior snapshot)
- [ ] CoS outcome aggregation
- [ ] Link from EPO header ("Construction ↔ Intelligence")
- [ ] Dev-mode: show data source freshness; production: executive summary only

---

## Acceptance

- Page loads without manual curation after any slice ships
- At least one panel shows measurable delta month-over-month
- Distinct from EPO in navigation and mental model
- Steve can answer: *"Is LocalBrain getting smarter?"* in under 30 seconds
