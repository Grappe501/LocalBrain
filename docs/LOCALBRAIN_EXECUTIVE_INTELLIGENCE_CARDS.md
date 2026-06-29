# Executive Intelligence Cards (EIC)

> **Introduced:** LB-OS-020 — first permanent Executive Intelligence presentation model  
> **Engine:** ENG-EIC-001  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md) · [Consolidation Planner](./LOCALBRAIN_CONSOLIDATION_PLANNER.md)

---

## Principle

Not widgets. Not reports. **Reusable intelligence objects.**

Every department eventually produces the same card shape. The Executive Briefing, Program Office, System Evolution, and department surfaces all render **Executive Intelligence Cards** — one design language across the Executive OS.

```txt
Before 020:  lists, tables, utility reports
After 020:   Executive Intelligence Cards — scored, simulatable, actionable
```

---

## Card anatomy (binding)

```txt
Executive Intelligence Card
─────────────────────────────
Title          Consolidate ContactListSOS Versions
Category       Version Chain
Source         Migration · Consolidation Engine
Priority       High

Scores (universal — see below)
  Importance · Confidence · Urgency · Effort · Expected Benefit
  Decision Friction Reduction · Risk

Evidence       98%
Executive Impact
  Reduces future decision friction
Estimated Time 3 minutes
Estimated Benefit
  Eliminates 7 duplicate decision points

Pipeline state
  Recommendation   ✓
  Simulation       Available
  Proposal         Not yet generated
  Approval         —
  Execution        —
  Verification     —
  Learning         —

Actions        Review · Simulate · Generate Proposal · Dismiss
```

Cards are **read-only intelligence** until Steve initiates Simulation or Proposal generation.

---

## Universal scoring standard (seven values)

Every Executive Intelligence Card carries the same seven scores (0–100 unless noted). Departments populate them; Chief of Staff ranks cards **without per-department scoring models**.

| Score | Meaning |
| ----- | ------- |
| **Importance** | Strategic weight to Steve's goals this week |
| **Confidence** | Evidence strength backing the recommendation |
| **Urgency** | Time sensitivity — decay if ignored |
| **Effort** | Steve/review time required (lower effort = higher score, or invert in UI with label "Estimated Time") |
| **Expected Benefit** | Quantified upside — hours saved, GB reclaimed, decisions eliminated |
| **Decision Friction Reduction** | How much future "which one is current?" overhead is removed |
| **Risk** | Downside if acted on incorrectly (lower = safer) |

**Rule:** no department ships a recommendation surface without all seven scores (nullable only when genuinely unknown — must show `—` with reason).

CoS prioritization (Phase 2+) sorts across departments using this shared schema.

---

## Department examples (future)

| Source | Example card title |
| ------ | ------------------ |
| Engineering | Dependency Hotspot |
| Writing | Chapter Drift |
| Relationships | Important Contact Going Cold |
| Data | Missing Knowledge Source |
| Finance | Expense Classification Needed |
| Photography | Catalog Needs Consolidation |
| Program Office | Architecture Risk |
| System / Migration | Storage Opportunity |
| Chief of Staff | Weekly Priority |

LB-OS-020 ships cards from **Migration / Consolidation** first. Other departments adopt EIC shape in Phase 1 integration (020.5) and Phase 2 without redesigning the shell.

---

## Surfaces (one model everywhere)

| Surface | How cards appear |
| ------- | ---------------- |
| **Executive Briefing** | Morning collection — top N cards by CoS rank |
| **Executive Consolidation Briefing** | Migration-specific briefing = scored card stack + summary header |
| **Program Office** | Construction / architecture risk cards |
| **System Evolution** | Intelligence-growth cards (Phase 2) |
| **Department home** | Domain-filtered card feed |
| **Chief of Staff** | Unified inbox of open cards across sources |

---

## Types & engine (LB-OS-020)

```txt
shared/src/executiveIntelligenceCard.ts
  ExecutiveIntelligenceCard
  IntelligenceScores (7 fields)
  IntelligencePipelineState
  IntelligenceCardCategory

backend/src/intelligence/
  cardComposer.ts          — normalize provider output → EIC
  scoreNormalizer.ts       — map domain signals → universal scores

backend/src/consolidation/
  briefingComposer.ts      — produces EIC[] + briefing summary
```

Consolidation priorities **are** Executive Intelligence Cards — not a parallel row type.

---

## Relationship to foundational objects

EIC is **not** an eleventh foundational object. It is a **composed presentation contract** specializing:

- **Decision** / recommendation signals
- **Action** pipeline state (when proposal exists)
- **Engine** output (consolidation, health, CoS, …)

See [Foundational Object Model — Specialization rule](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md#specialization-rule).

---

## Exit criteria (020 introduces; 020.5 spreads)

```txt
[ ] shared ExecutiveIntelligenceCard types
[ ] Consolidation briefing renders cards with all seven scores
[ ] Pipeline state visible on each card (Simulation Available, etc.)
[ ] Executive Briefing Consolidation block links to card detail
[ ] Documentation: departments adopt EIC in 020.5 audit where data exists
```

---

*Executive Intelligence Cards · ENG-EIC-001 · LB-OS-020 · 2026-06-29*
