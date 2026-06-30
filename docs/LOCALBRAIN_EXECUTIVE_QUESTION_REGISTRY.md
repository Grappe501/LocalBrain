# Executive Question Registry

> **Introduced:** LB-OS-020.5 planning · **Engine:** ENG-EQ-001 (planned)  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Phase 1 Integration Pass](./LOCALBRAIN_PHASE1_INTEGRATION_PASS.md) · [Executive Intelligence Cards](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md)

---

## Principle

Shift from organizing by **features** to organizing by **Executive Questions**.

The platform does not ask *"What do I know?"* It asks **"What question am I trying to answer?"** — see [Executive Epistemology Convention](./LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md).

Every major page answers **one canonical question**. The Chief of Staff routes to the **authoritative owner** of that question — not to three dashboards that partially overlap.

```txt
Wrong:  "Open the migration feature"
Right:  "What should I consolidate?" → /migration/consolidation
```

**LB-OS-020.5 binding objective:**

> **Every Executive Question has exactly one authoritative answer.**

---

## Three classes of questions

| Class | Scope | Examples |
| ----- | ----- | -------- |
| **Operational** | Where things are · system state | Where is this file? · How much disk space? · Which workspace owns this? |
| **Executive** | What to do · priorities · approvals | What should I work on today? · Why is this blocked? · Should I approve this migration? |
| **Epistemic** | What we know · assumptions · gaps | What do we actually know? · What assumptions are we making? · What contradicts this? · What are we missing? |

Phase 1 registry (below) is primarily **Operational** and **Executive**. **Epistemic** questions become the foundation of Executive Intelligence in Phase 2.

### Requested vs Emergent

| Kind | Source |
| ---- | ------ |
| **Requested** | Steve asks — e.g. "Where are my RedDirt documents?" |
| **Emergent** | System asks — e.g. "Why are three workspaces referencing the same archive?" |

Emergent questions are where Executive Intelligence creates leverage.

### Transparent recommendation chain

Every recommendation carries its originating question:

```txt
Question → Evidence → Memory → Knowledge → Beliefs considered → Understanding applied → Recommendation
```

---

## ExecutiveQuestion contract

Not an eleventh foundational object — a **routing and ownership registry** (specializes CoS + Module + Engine).

```txt
ExecutiveQuestion {
  question_id          — EQ-001, EQ-002, …
  canonical_question   — human-readable question Steve asks
  owner_department     — Chief of Staff · Engineering · Consolidation · …
  primary_route        — single authoritative URL
  supporting_engines   — ENG-* that feed the answer
  supporting_workspaces — LivingWorkspace ids (when scoped)
  answer_surface       — briefing · EIC stack · dashboard · scoreboard
  answer_confidence    — 0–100 (live data vs stub)
  last_updated         — ISO timestamp
  duplicate_routes     — [] after 020.5 — must be empty at gate
}
```

**Rule:** If two routes answer the same question, one becomes **primary**; the other **links to it** (summary + deep link only) or is removed from executive nav.

---

## Phase 1 question map (binding)

| ID | Canonical question | Owner | Primary route | Status |
| -- | ------------------ | ----- | ------------- | ------ |
| EQ-001 | What should I do today? | Chief of Staff | `/` | ✅ Live (partial — mock sections remain) |
| EQ-002 | How is the build progressing? | Program Office | `/program-office` | ✅ Live |
| EQ-003 | How healthy is my **system** (machine + ops)? | System Health | `/system` | ✅ Live |
| EQ-004 | Where is my information? | Knowledge Explorer | `/explorer` | ✅ Live |
| EQ-005 | What should I consolidate? | Consolidation | `/migration/consolidation` | ✅ Live (LB-OS-020) |
| EQ-006 | What relationships need attention? | Relationships | `/studio/relationships` | 🔶 Partial |
| EQ-007 | What projects are drifting? | Living Workspaces | `/workspace/:id` | 🔶 Partial |
| EQ-008 | What changed since yesterday? (intelligence) | System Evolution | `/executive/evolution` | 📋 Phase 2 (LB-OS-035) |
| EQ-009 | How much leverage am I getting? | Chief of Staff + ELS | `/` (headline) | 📋 Phase 2 (ENG-ELS-001) |
| EQ-010 | How healthy is my **engineering** work? | Engineering | `/studio/engineering` | 🔶 Partial |
| EQ-011 | What is my writing pipeline? | Writing | `/studio/writing` | 🔶 Partial |
| EQ-012 | What data sources am I missing? | Data & Intelligence | `/studio/data` | 🔶 Partial |
| EQ-013 | What actions need my approval? | Actions | `/actions` | ✅ Live |
| EQ-014 | How should I migrate my world? | Migration Planner | `/migration` | ✅ Live (planning) |
| EQ-015 | What is on my H: drive? (inventory) | Migration Audit | `/migration/audit` | ✅ Live (read-only) |

### Separation rules (no overlap)

| Question | Authoritative route | Must NOT duplicate on |
| -------- | ------------------- | ----------------------- |
| System health (machine) | `/system` | Program Office, Briefing (link only) |
| Build progress | `/program-office` | Briefing body, System Health |
| Consolidation | `/migration/consolidation` | Briefing (opportunity summary + link only) |
| Engineering health | `/studio/engineering` | Program Office, System |
| Today's priorities | `/` (Briefing) | Program Office, CoS drawer alone |

---

## Example records

### EQ-001 — What should I do today?

```txt
question_id:        EQ-001
canonical_question: What should I do today?
owner_department:   Chief of Staff
primary_route:      /
supporting_engines: ENG-CS-003, ENG-EO-004, ENG-ELS-001 (Phase 2)
supporting_workspaces: calendar, relationships (future)
answer_surface:     Executive Briefing + EIC collection
answer_confidence:  partial (mock sections until LB-OS-089)
```

### EQ-005 — What should I consolidate?

```txt
question_id:        EQ-005
canonical_question: What should I consolidate?
owner_department:   Consolidation (Migration)
primary_route:      /migration/consolidation
supporting_engines: ENG-CNS-001, ENG-EIC-001
supporting_workspaces: H: indexed assets
answer_surface:     Executive Consolidation Briefing + EIC stack
answer_confidence:  high (registry + audit grounded)
```

---

## CoS routing (future-facing)

```txt
Steve asks (natural language)
  → CoS classifies Executive Question
  → Route to primary_route owner
  → Render EIC / briefing / scoreboard for that question
  → Never duplicate full answer on secondary surface
```

**Prerequisite for Phase 2:** [Executive Mission Stack](./LOCALBRAIN_EXECUTIVE_INTENT.md) filters which questions CoS surfaces and scopes mission-specific question variants (registry unchanged; routing filtered by active mission).

---

## LB-OS-020.5 deliverables (registry)

| # | Deliverable |
|---|-------------|
| 1 | `shared/src/executiveQuestion.ts` — types (optional runtime in 020.5) |
| 2 | `backend/src/questions/questionRegistry.ts` — authoritative map |
| 3 | Integration audit: every priority route maps to one EQ-* |
| 4 | Close duplicate summaries — link to primary only |
| 5 | Nav / breadcrumbs show canonical question (subtitle) where helpful |
| 6 | Live Surface registry annotated with `question_id` |

---

## Measurable cohesion (020.5 gate)

Tracked in integration audit — **before → after**:

| Metric | Before (audit) | Target |
| ------ | -------------- | ------ |
| Cross-route links | baseline | **90+** |
| Orphan pages (priority routes) | baseline | **0** |
| Duplicate executive summaries | baseline | **0** |
| EIC usage on executive pages | 2 (consolidation + partial) | **All executive answer surfaces** |
| Consistent shell actions (LiveSurfaceBanner, crumbs, guardrails) | ~40% | **100%** priority routes |
| Questions with single authoritative route | partial | **100%** Phase 1 map |

Audit runs at start and end of 020.5; numbers stored in checklist gate line.

---

## Relationship to other contracts

| Contract | Role |
| -------- | ---- |
| [Executive Intelligence Cards](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md) | **How** answers are presented |
| Executive Question Registry | **Which question** each route owns |
| [Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md) | **How** Steve acts on answers |
| [Live Surface Registry](../backend/src/liveSurface/surfaceRegistry.ts) | **Where** routes are live |

---

*Executive Question Registry · ENG-EQ-001 · LB-OS-020.5 · 2026-06-29*
