# LocalBrain OJT Coding Academy v1.0

> **Pillar 9:** On-the-job training — teach Steve coding while real systems are built.  
> Inspired by [freeCodeCamp](https://www.freecodecamp.org/) (self-paced curriculum, interactive challenges, real projects, certifications) and [Codecademy](https://www.codecademy.com/) (guided lessons, career paths, portfolio projects, gamified progress).  
> Doctrine: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Queue: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md)

---

## Core Idea

```txt
LocalBrain should teach Steve coding by working beside him while real systems are being built.
```

Learning is **always tied to real work** — not generic exercises divorced from Steve's operating company.

**Examples:**

```txt
Today you learned: SQL JOIN — because we joined voter files in Database Studio.
Today you learned: React state — because we built the campaign dashboard.
Today you learned: TypeScript interfaces — because we created Contact objects.
Today you learned: REST APIs — because we connected Census data.
```

**Matrix:** Learning domain × OJT · [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) · Slice LB-OS-105

---

## How It Works

Every time LocalBrain or Burt builds something, LocalBrain teaches:

```txt
What we are building
Why it matters
What files are involved
What each function does
What the bug means
What the validation command proves
What concept Steve just learned
How this applies to the next build
```

---

## Teach Me While We Build

**Global toggle:**

```txt
Teach Me While We Build: ON / OFF
```

Stored in settings. Default: **ON** for Steve during foundation phase (configurable).

### When ON, every slice closeout includes

```txt
What changed
Why it matters
Coding concepts learned
What Steve should recognize next time
One small practice challenge
```

### When ON, chat and code studio add

```txt
Broad concept callouts (React, API, migration, etc.)
Narrow file-level explanations on request
"Explain this error" and "Explain this file" modes
```

---

## Two Teaching Layers

### Broad layer (concepts)

```txt
What is React?
What is TypeScript?
What is an API?
What is SQLite?
What is a backend?
What is a migration?
What is a permission engine?
What is a tool router?
```

Taught in context when LocalBrain first uses each in a real slice.

### Narrow layer (this build)

```txt
What did this exact file do?
Why did Burt create this function?
Why did this error happen?
Why did this validation command fail?
What changed in this commit?
```

Tied to actual diffs, logs, and closeout reports.

---

## freeCodeCamp + Codecademy Lessons Stolen

| Pattern | Source | LocalBrain adaptation |
|---------|--------|----------------------|
| Self-paced curriculum | freeCodeCamp | Concept ladder tied to LB-OS-### slices |
| Interactive challenges | freeCodeCamp | Challenges generated from real project code |
| Real projects | freeCodeCamp | LocalBrain itself is the project |
| Certifications | freeCodeCamp | Portfolio evidence + skill badges (LB-OS-030) |
| Guided lessons | Codecademy | Build-along mode in closeouts |
| Career paths | Codecademy | Paths: OS shell, explorer, safety, AI, migration |
| Gamified progress | Codecademy | Progress dashboard, streaks, concepts mastered |
| Portfolio projects | Codecademy | Ship gates = portfolio milestones |

---

## OS Integration Points

| Surface | Teaching behavior |
|---------|-------------------|
| Slice closeouts | Extended LOCALBRAIN SLICE CLOSEOUT + OJT block |
| Right panel | "Concepts this session" snippet |
| Code studio | Explain file / explain error |
| Explorer | "What is this file type?" |
| Settings | Teach toggle · progress link |
| `/learn` (future) | Concept ladder + challenges + progress |

**Not a separate app** — `/learn` is a view inside the same shell (LB-OS-002 layout).

---

## Concept Ladder (Preview)

Skills unlock as slices ship:

```txt
LB-OS-002  → React layout, components, CSS modules
LB-OS-003  → TypeScript, Express, permission checks
LB-OS-004  → SQLite, schemas, project registry
LB-OS-005  → Indexing, FTS, tree UI
LB-OS-008  → OpenAI API, orchestrator, env vars
LB-OS-010  → Approval flows, diffs, quarantine
…
LB-OS-024  → Migration, inventory, digital life OS
```

Full map: **LB-OS-027 — Concept Ladder + Skill Map**

---

## Closeout Extension (OJT Block)

Append to every closeout when **Teach Me While We Build** is ON:

```txt
LOCALBRAIN OJT — BUILD LESSON
Slice:
What we built:
Why it matters:
Files touched:
  - path — role in plain English
Concepts learned (broad):
  -
Concepts learned (narrow):
  -
What validation proved:
What to recognize next time:
Practice challenge (5–15 min):
  -
Optional deeper reading:
  -
```

Burt/Cursor must fill this block when toggle is ON.

---

## Queue Slices (LB-OS-025–030)

| Slice | Deliverable |
|-------|-------------|
| LB-OS-025 | OJT academy doctrine embedded in product + docs |
| LB-OS-026 | Build-along teaching mode (toggle + closeout template) |
| LB-OS-027 | Concept ladder + skill map UI |
| LB-OS-028 | Interactive challenges from real project code |
| LB-OS-029 | Steve coding progress dashboard |
| LB-OS-030 | Certification / portfolio evidence system |

**Depends on:** LB-OS-011 (code studio foundation) minimum for 026+; full arc after LB-OS-015 or parallel from 026 after 011.

**Recommended order:**

```txt
LB-OS-002–015  V1 OS (teach toggle stub in 002, closeout OJT manual until 026)
LB-OS-016–024  Migration arc
LB-OS-025–030  OJT academy full implementation
```

Early slices: Burt fills OJT block in closeouts **by hand** per this doc until LB-OS-026 automates.

---

## Safety

```txt
Teaching never bypasses permission engine
Practice challenges are read-only or sandbox until Steve approves writes
No separate "training" filesystem with weaker rules
Challenges use copies or marked sandbox paths on H:
```

---

## V1 Academy Acceptance (LB-OS-030)

```txt
[ ] Teach toggle works globally
[ ] Closeouts include OJT block when ON
[ ] Concept ladder shows progress through LB-OS slices
[ ] At least 10 challenges generated from LocalBrain repo code
[ ] Progress dashboard shows concepts mastered
[ ] Portfolio exports: slices completed + concepts + project evidence
[ ] Steve can explain what LB-OS-002 layout files do without opening Cursor docs
```

---

## Foundation Rule (Before LB-OS-002)

```txt
This document must exist before LB-OS-002 code starts.
Burt includes OJT block in LB-OS-002 closeout manually until LB-OS-026.
```

---

## Related Documents

| Doc | Role |
|-----|------|
| [Code Engineering Studio](./LOCALBRAIN_CODE_ENGINEERING_STUDIO.md) | Build loop + teaching |
| [Burt/Cursor Protocol](./LOCALBRAIN_BURT_CURSOR_PROTOCOL.md) | Closeout format |
| [Capability Map](./LOCALBRAIN_CAPABILITY_MAP.md) | Pillar 9 |

---

*OJT Coding Academy version 1.0 · 2026-06-28*
