# LocalBrain Executive Briefing Model v1.0

> **Pillar 17 · Default morning experience.**  
> **LB-OS-002:** Finance & CFO = **briefing section only** (not 9th context card).  
> Executive Office: [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) · CoS: [Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md)

---

## Principle

Every morning Steve opens LocalBrain → **Executive Briefing** — a curated stack of **[Executive Intelligence Cards](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md)**, not a widget dashboard.

```txt
An exceptional human Chief of Staff prepares the day.
LocalBrain does the same — from local memory, signals, calendar, email, metrics.
```

---

## Briefing sections

```txt
Good morning, Steve.

TODAY'S PRIORITIES
  1. CountyWorkbench — highest leverage (grant deadline)
  2. RedDirt deployment unblock
  3. Burt review before county meeting

CALENDAR
  10:00 County meeting · 3h free before — enough for Burt review

EMAIL REQUIRING ATTENTION
  2 unread flagged · Kelly thread · grant officer reply suggested

PROJECTS AT RISK
  RedDirt: Netlify failed · ACU: 6 days idle

RECENT ACCOMPLISHMENTS
  2 Burt packets completed yesterday

PENDING APPROVALS
  1 file move · 1 draft send

TOKEN SPEND
  Yesterday: $18.43 · Month: $142 (on budget)

FINANCE & CFO
  RedDirt: Q2 compliance worksheet due Apr 15 · 3 receipts uncategorized
  Household: on budget · Business API spend $142 MTD
  Action: approve 2 expense classifications

SYSTEM HEALTH
  H: 41% free · C: 78% · API healthy

LEARNING FOCUS
  Async/await — 5th exposure — deeper lesson suggested

SUGGESTED DEEP-WORK BLOCK
  8:00–11:00 — CountyWorkbench (no meetings)

OPPORTUNITIES
  Reuse grant language from 2024 CountyWorkbench proposal

CONSOLIDATION OPPORTUNITY
  Consolidation Score: 92/100 Healthy (↑4) · 387 GB reclaimable · 24 min review
  Top priority: ContactListSOS version chains — reduces "which folder is current?" friction
  Risk: 0 high · 12 medium · 186 low · Nothing has changed

QUESTIONS NEEDING YOUR DECISION
  Archive Phatlip v2 or merge into v3?
```

Sections are **configurable** — Steve toggles in settings.

---

## Data sources

| Section | Engines |
|---------|---------|
| Priorities | ENG-EO-007, ENG-KP-001, ENG-CS-001 |
| Calendar | ENG-EO-005 |
| Email | ENG-EO-006 |
| Projects at risk | ENG-CS-002, ENG-KP-001 |
| Accomplishments | ENG-MM-001, slice progress |
| Approvals | ENG-TL-001 |
| Token spend | ENG-TE-001, ENG-EV-004 |
| Finance & CFO | ENG-FN-005, ENG-FN-002 |
| System health | ENG-HL-001, ENG-ST-001 |
| Learning | ENG-LP-002, ENG-OJ-001 |
| Deep-work | ENG-EO-005 + ENG-EO-007 |
| Opportunities | ENG-KG-001, ENG-MR-002 |
| Consolidation Opportunity | LB-OS-020 Executive Briefing + ENG-CNS-001 (read-only) |
| Decisions | ENG-MM-001, pending signals |

---

## Generation flow

```txt
06:00 (or on boot) scheduled job OR Steve opens app
  ↓
ENG-CS-003 / ENG-EO-004 gathers signals (read-only)
  ↓
ENG-EO-002 Chief of Staff composes narrative (capability: reasoning, local-first if privacy)
  ↓
Briefing rendered at / (home) — replaces generic dashboard
  ↓
Steve: act · snooze · delegate to department chief
```

**No auto-actions** from briefing text — each item links to approval flow if mutating.

---

## UX

```txt
Route: /  or  /briefing  (default boot post LB-OS-089)
Layout: letter-style scroll + action buttons per section
CommandBar: "Refresh briefing" · "Focus mode"
Mobile/iPad: briefing-first responsive
```

LB-OS-002: static mock briefing with sample data.

---

## Calendar intelligence (example)

Not just sync — **understand**:

```txt
"You have three hours before the county meeting.
 This is enough time to finish the Burt review."
```

ENG-EO-005: parse calendar (future integration) + task estimates from KC/KP.

---

## Email intelligence (example)

```txt
Unread → Classify → Summarize → Suggest reply → Wait approval → Send
```

Learns over time: urgency by sender, tone preferences, recurring threads, forgotten follow-ups.

ENG-EO-006 · **never auto-send** in V1 without explicit approval.

---

## Consolidation Opportunity (LB-OS-020)

Read-only briefing section — introduced with [Evidence-Based Consolidation Planner](./LOCALBRAIN_CONSOLIDATION_PLANNER.md). Primary surface is the **Executive Consolidation Briefing** (`/migration/consolidation`).

```txt
CONSOLIDATION OPPORTUNITY
  consolidation_score            — 0–100 · band · trend (ENG-CNS-001)
  reclaimable_storage_bytes      — estimated from duplicate + superseded versions
  workspace_simplification         — High | Medium | Low
  duplicate_confidence           — aggregate evidence %
  estimated_review_minutes       — time to review top priorities
  risk_band                        — high / medium / low item counts
  top_priority_summary             — #1 decision-friction narrative
  executive_summary                — "Nothing has been changed."
```

Links to `/migration/consolidation`. **No auto-consolidation** from briefing.

**Copy rule:** prefer decision-friction insight ("which folder is current?") over raw counts ("4 copies").

---

## Slice mapping

| Slice | Deliverable |
|-------|-------------|
| 083–086 | CoS signals + briefing drawer (Pillar 16) |
| 089 | Full executive briefing composer + home |
| 096 | Executive Office polish + effectiveness footer |

---

*Executive briefing model v1.0 · Pillar 17 · 2026-06-28*
