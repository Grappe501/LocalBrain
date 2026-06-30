# LB-OS-026.7 — Executive Office (Executive Operating Environment)

> **LOCALBRAIN V1 ROADMAP** · Architecture FROZEN · Implementation mode
>
> ```txt
> □ Executive Office Certification
> □ Session 4
> □ Session 5
> □ Theory Freeze
> □ Convention
> □ Empty Brain Factory
> □ Memory OS
> □ Communications Office
> □ Commercial Beta
>
> Everything else → VERSION2_BACKLOG.md
> ```


> **Depends on:** LB-OS-026.67 (ENG-EO-001 office structure)  
> **Replaces naming:** ~~Executive Dashboard & Daily Briefing~~ → **Executive Office**  
> **Rule:** Narrative briefing first · dashboard is one view inside the office · not a card grid

---

## Mission

When Steve opens LocalBrain, he walks into his **Executive Office** — not a feature dashboard.

The interface answers four questions every day:

1. **What deserves my attention?**
2. **What decision requires me?**
3. **What can safely wait?**
4. **What changed that I didn't notice?**

This is an **Executive Operating Environment**, not an application exposing widgets.

---

## Reading order (binding)

```txt
1. Chief of Staff Briefing     ← primary entry (narrative)
2. Executive Workspace         ← today's work (after briefing)
3. Office                      ← departments, capabilities, directory
4. Operations                  ← migration, platform, build (background)
```

---

## Zone 1 — Chief of Staff Briefing

```txt
Good Morning Steve
Chief of Staff Briefing
Estimated reading time: 6 minutes
Executive Attention Score
Today's Top Priorities

Chief of Staff
Good morning.
After reviewing all departments, I believe five items deserve your attention today.
The most important is...

[Department reports — narrative, not dashboards]
```

### Department report shape

Each department submits:

| Field | Purpose |
| ----- | ------- |
| Status | Healthy · degraded · monitoring · reserved |
| Attention | elevated · normal · monitoring · dormant |
| Summary | Narrative — what matters now |
| What changed since yesterday | Delta only — not full knowledge dump |
| Read more | Optional deep link |

Departments **do not** talk directly to Steve. They submit reports. **Chief of Staff edits:**

```txt
Include · Merge · Suppress · Escalate · Delay
```

---

## Example department reports (target UX)

**Chief of Staff** — Campaign and Communications have conflicting priorities this morning…

**CFO** — Campaign spending tracking above forecast by 6.2%.

**Campaign Director** — Three immersion counties need scheduling. Volunteer recruitment exceeded goals.

**Communications** — Press inquiry waiting. County chairs awaiting response. Debate clip still growing.

**Chief Knowledge Officer** — Two contradictions detected. Knowledge confidence improved. Memory quality stable.

---

## Zone 2 — Executive Workspace (after briefing)

```txt
Today's Work · Projects · Meetings · Tasks · Questions
```

---

## Zone 3 — Office

```txt
Departments · Capabilities · Office Directory
```

Projects existing ENG-EO-001 `/api/integration/office` and ENG-ATL-001 atlas.

---

## Zone 4 — Operations (background)

```txt
Migration · Platform · Build · System Health
```

Platform infrastructure — not the center of the experience.

---

## Daily Briefing Archive (institutional memory)

Every morning becomes durable memory:

```txt
July 2
Chief of Staff Briefing
        ↓
Actions Taken
        ↓
Outcome
        ↓
Learning
```

Schema: `BriefingArchiveEntry` in ENG-EOB-001. Archive populates when live briefing ships.

---

## Engines

| Engine | Deliverable |
| ------ | ----------- |
| ENG-EOB-001 | Executive Office experience contract + scaffold projection |
| ENG-EO-001 | Department roster, charter, standing orders (026.67) |
| ENG-ATL-001 | Capability detail layer |

---

## APIs

```txt
GET /api/integration/office/experience
```

Contract: `buildExecutiveOfficeExperience()` in `@localbrain/shared`.

---

## Acceptance

```txt
[ ] Home route projects Executive Office — not mock widget briefing
[ ] Chief of Staff narrative is single opening — not 30 cards
[ ] Department reports are narrative with what_changed_since_yesterday
[ ] Reading order: Briefing → Workspace → Office → Operations
[ ] CoS editorial actions defined (include/merge/suppress/escalate/delay)
[ ] Briefing archive schema ready; first entries on live mode
[ ] Graph integrity PASS · experience certification re-run
[ ] No Phase 2 cognitive code · connectors remain read-first
```

---

## Out of scope (later slices)

- Live Gmail/Calendar/finance connectors
- Autonomous department agents
- Executive Attention Score instrumentation (null until metrics ship)

---

*Burt packet · LB-OS-026.7 · Executive Office — not Dashboard*
