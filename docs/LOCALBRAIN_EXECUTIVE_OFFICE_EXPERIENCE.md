# Executive Office Experience

> **Slice:** LB-OS-026.7 · **Engine:** ENG-EOB-001  
> **Structure:** [Executive Office Structure](./LOCALBRAIN_EXECUTIVE_OFFICE_STRUCTURE.md) · **Phase 12 doctrine:** [Executive Office v1.0](./LOCALBRAIN_EXECUTIVE_OFFICE.md)

---

## Product shift

LocalBrain is no longer centered on **applications**. It is an **Executive Operating Environment**.

```txt
Not: open software → see cards
Yes: walk into your office → Chief of Staff has already synthesized overnight analysis
```

The **dashboard** (metrics, cards, KPI strips) becomes **one view inside** the Executive Office — not the home experience.

---

## Four daily questions

Every session should help the executive answer:

1. **What deserves my attention?**
2. **What decision requires me?**
3. **What can safely wait?**
4. **What changed that I didn't notice?**

---

## Experience layout

### 1. Chief of Staff Briefing (primary)

Single narrative. Not thirty widgets.

```txt
Good Morning Steve
Chief of Staff Briefing
Estimated reading time: 6 minutes
Executive Attention Score
Today's Top Priorities

Good morning.
After reviewing all departments, I believe five items deserve your attention today.
The most important is...
```

### 2. Department reports

Each department contributes **narrative** — status, attention, summary, and **what changed since yesterday** (delta only).

Departments submit to Chief of Staff. They do not speak directly to the executive.

**Chief of Staff editorial actions:** Include · Merge · Suppress · Escalate · Delay

### 3. Executive Workspace (after briefing)

Today's Work · Projects · Meetings · Tasks · Questions

### 4. Office

Departments · Capabilities · Office Directory

### 5. Operations (background)

Migration · Platform · Build · System Health

---

## Daily Briefing Archive

Institutional memory — every briefing becomes:

```txt
Date → Chief of Staff Briefing → Actions Taken → Outcome → Learning
```

Goldmine for Memory OS and long-term executive cognition.

---

## API

```txt
GET /api/integration/office/experience
npm run build -w @localbrain/shared
```

Scaffold projection ships before live briefing engine; `projection_mode: "scaffold" | "live"`.

---

## Sequence

```txt
026.67 Executive Office structure (committed)
026.7  Executive Office home experience (this slice)
       → Experience certification re-run
       → Peer Review Session 4
```

---

*Doctrine · LB-OS-026.7 · Executive Office — not Dashboard*
