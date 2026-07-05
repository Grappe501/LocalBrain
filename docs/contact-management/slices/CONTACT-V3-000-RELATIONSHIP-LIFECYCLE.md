# CONTACT-V3-000 — Relationship Lifecycle Engine

> **Type:** Contact Management v3 foundational architecture — **FROZEN** before implementation  
> **Status:** **ARCHITECTURE FROZEN** · 2026-07-05 · no code until 016.1 / 016 contracts reference this doc  
> **Contract:** `CONTACT-V3-000` · internal engine id: **Relationship Lifecycle Engine**  
> **Constitution:** [CONTACT-V3-CONSTITUTION](./CONTACT-V3-CONSTITUTION.md) **FROZEN**  
> **Decisions:** [CONTACT-V3-DECISION-RECORDS (ADR)](./CONTACT-V3-DECISION-RECORDS.md) **FROZEN**  
> **Parent:** [Architecture](./CONTACT-V3-ARCHITECTURE.md) · [Roadmap](./CONTACT-V3-README.md)

---

## Purpose

Contact Management v3 defines **what** a relationship is (timeline, context, stewardship, intelligence, action). This document defines **how relationships evolve** — a shared progression model every engine uses.

Without a frozen lifecycle vocabulary, Timeline, Stewardship, Context, Intelligence, Action, and downstream modules (volunteers, events, comms, analytics) will each invent their own stage names. That debt is expensive to unwind.

**Relationship operating system:** The contact record is a long-term relationship record. Lifecycle is the dimension that ties all engines together.

---

## Terminology guardrail

| Term | Meaning | Do not confuse with |
| ---- | ------- | ------------------- |
| **Lifecycle stage** | Where the contact is in the **relationship journey** (this document) | — |
| **Steward** | The **person** accountable for cultivating the relationship | Lifecycle stage |
| **Champion** | Highest **lifecycle stage** — community leader who advocates for the cause | Steward role |
| **Relationship strength** | Bond **depth** / character (Stewardship Engine) | Lifecycle maturity |
| **Momentum** | **Direction** of engagement movement (Growing, Cooling, …) | Lifecycle stage |
| **Health** | **Stewardship condition** (Intelligence Engine) | Lifecycle stage |
| **Steward transition** | Change of **accountable person** | Lifecycle stage change |

The canonical top lifecycle stage is **Champion** (alias acceptable in UI: *Community Leader*). Do **not** use *Steward* as a lifecycle stage.

---

## Freeze rules

| Dimension | Meaning |
| --------- | ------- |
| **Lifecycle** | Relationship **maturity** — journey stage (this engine) |
| **Strength** | Bond **depth** / character |
| **Momentum** | **Direction** of movement |
| **Health** | **Stewardship condition** |

- Lifecycle is **relationship maturity**, not relationship strength.
- AI may **recommend review**; must **not auto-promote**.
- Transitions must be **explainable** through timeline/context evidence.
- **Manual** transition — allowed.
- **Advisory** transition — allowed.
- **Automatic** transition — deferred unless explicitly approved later.

Use **Champion**, not Steward, as the highest lifecycle stage (Steward = accountable person in Stewardship Engine).

---

## Canonical lifecycle stages

```text
Unknown
Identified
Connected
Engaged
Supporter
Volunteer
Leader
Advocate
Champion
```

Not everyone reaches the final stages. Relationships move **forward and backward**.

---

## Stage definitions

Each stage has entry signals, exit signals, and typical engine evidence. Criteria are **guidance for advisory review** — not automatic promotion rules in v3.

### Unknown

| | |
| - | - |
| **Meaning** | No meaningful relationship yet — name may exist from list import or prospecting. |
| **Entry** | Record created without confirmed interaction. |
| **Exit ↑** | First confirmed touchpoint → **Identified**. |
| **Engine evidence** | Identity only; empty or import-only timeline. |

### Identified

| | |
| - | - |
| **Meaning** | Organization knows who they are; minimal or one-way contact. |
| **Entry** | First conversation, reply, or verified channel. |
| **Exit ↑** | Mutual recognition, event attendance, or sustained two-way contact → **Connected**. |
| **Exit ↓** | Record stale with no validation → **Unknown** (advisory review). |
| **Example interaction** | First phone call, door knock with response, email reply. |

### Connected

| | |
| - | - |
| **Meaning** | Two-way relationship established; not yet actively engaged in mission. |
| **Entry** | Attends event, joins list, accepts meeting, responds repeatedly. |
| **Exit ↑** | Repeated participation or expressed support → **Engaged**. |
| **Exit ↓** | Long silence, bounced contact → **Identified** or **Unknown**. |
| **Example interaction** | Attends county fair booth; accepts calendar invite. |

### Engaged

| | |
| - | - |
| **Meaning** | Regularly interacts with the organization; interest is active. |
| **Entry** | Multiple touchpoints in rolling window; positive sentiment trend. |
| **Exit ↑** | Declared support, donation, or signup → **Supporter**. |
| **Exit ↓** | Cooling momentum, missed follow-ups → **Connected**. |
| **Example interaction** | Attends second event; joins email updates; asks how to help. |

### Supporter

| | |
| - | - |
| **Meaning** | Supports mission materially or vocally — donor, signer, endorser. |
| **Entry** | Donation, petition signature, public endorsement, yard sign. |
| **Exit ↑** | Hands-on participation → **Volunteer**. |
| **Exit ↓** | Support lapses → **Engaged**. |
| **Example interaction** | Donates; signs petition; shares social post. |

### Volunteer

| | |
| - | - |
| **Meaning** | Contributes time and labor to campaign or program work. |
| **Entry** | Completes volunteer shift(s); recurring volunteer activity. |
| **Exit ↑** | Recruits, leads teams, owns turf → **Leader**. |
| **Exit ↓** | Stops showing up → **Supporter** or **Engaged**. |
| **Example interaction** | Two volunteer shifts; phone bank shift; canvass day. |

### Leader

| | |
| - | - |
| **Meaning** | Leads others — precinct, county team, event captain, shift lead. |
| **Entry** | Leads meeting, recruits volunteers, owns geography or program. |
| **Exit ↑** | Public advocacy, media, sustained recruitment → **Advocate**. |
| **Exit ↓** | Steps back from leadership role → **Volunteer**. |
| **Example interaction** | Leads precinct team; recruits 4 volunteers; hosts neighborhood meeting. |

### Advocate

| | |
| - | - |
| **Meaning** | Speaks for the organization externally; influences others beyond direct volunteer work. |
| **Entry** | Testimonial, speaking engagement, peer recruitment at scale. |
| **Exit ↑** | Sustained community-wide influence → **Champion**. |
| **Exit ↓** | Reduced public activity → **Leader**. |

### Champion

| | |
| - | - |
| **Meaning** | Community leader who expands reach and embodies the relationship at its deepest organizational tie. |
| **Entry** | Advisory review confirms sustained multi-channel leadership and recruitment impact. |
| **Exit ↓** | Disengagement or conflict → lower stages (always logged with reason). |
| **UI alias** | *Community Leader* acceptable; contract value: `champion`. |

---

## Lifecycle vs other dimensions

| Dimension | Engine | Question | Example |
| --------- | ------ | -------- | ------- |
| **Lifecycle stage** | Lifecycle | Where are they in the journey? | `Volunteer` |
| **Context** | Context | Why do we know them? | `Church` · `Campaign` |
| **Steward** | Stewardship | Who cultivates? | Kelly |
| **Strength** | Stewardship | What kind of bond? | `Donor` · `County Leader` |
| **Momentum** | Intelligence | Which way is engagement moving? | `Growing` |
| **Health** | Intelligence | How well is stewardship working? | `92` |

**Strength** describes bond *character* (donor, influencer). **Lifecycle** describes journey *position*. A **Donor** (strength) can be at **Supporter** or **Engaged** (lifecycle). Do not collapse these into one field.

Lifecycle may be **global per contact** in v3; **per-context lifecycle** is a future refinement (e.g. `Volunteer` in Campaign, `Connected` in Church).

---

## How lifecycle relates to the seven engines

Lifecycle is the **progression dimension** every engine reads or writes:

| Engine | Lifecycle question | Lifecycle role |
| ------ | ------------------ | -------------- |
| **Identity** | Who is this? | Default stage `Unknown` on create (unless import metadata). |
| **Timeline** | What happened? | Interactions supply evidence; optional lifecycle impact annotation. |
| **Context** | Why do we know them? | Stage may differ per context (future); filters by stage + context. |
| **Stewardship** | Who is cultivating? | Steward approves or records stage changes; transitions logged. |
| **Intelligence** | How healthy is it? | Advisory: *ready for review as potential Leader* with cited evidence. |
| **Action** | What should we do next? | Tasks keyed to stage (e.g. onboarding Engaged → Supporter). |
| **Lifecycle** | Where are they in the journey? | **Owns stage vocabulary, transition log, advisory criteria.** |

See [CONTACT-V3-ARCHITECTURE.md](./CONTACT-V3-ARCHITECTURE.md).

---

## Relationship formula

```text
Relationship =
  Identity
  + Timeline
  + Contexts
  + Steward
  + Contributors
  + Follow-up
  + Momentum
  + Strength
  + Lifecycle
  + Transitions
```

**Lifecycle transitions** (stage changes) and **steward transitions** (person changes) are separate append-only logs.

---

## Interaction → lifecycle impact

Every interaction *may* contribute evidence toward a stage change. v3 does **not** require automatic promotion.

| Interaction (Timeline) | Typical evidence | Advisory direction |
| ---------------------- | ---------------- | ------------------ |
| First conversation | Unknown → Identified | Confirm identification |
| Attends event | Connected → Engaged | Deepen engagement |
| Volunteers twice | Engaged → Volunteer | Review volunteer stage |
| Leads precinct | Volunteer → Leader | Review leadership stage |
| Public endorsement | Leader → Advocate | Review advocacy stage |

Timeline Engine stores the interaction; Lifecycle Engine records **stage** and **stage transition** when a steward or admin confirms — or when advisory workflow accepts a recommendation.

Optional field on interaction (future): `lifecycle_evidence_for` — stage key the interaction supports (advisory only at capture time).

---

## Transition modes

| Mode | v3 default | Description |
| ---- | ---------- | ----------- |
| **Manual** | ✅ Primary | Steward or admin sets stage with reason; append-only transition log. |
| **Advisory** | ✅ Primary | Intelligence Engine suggests review with cited timeline/context evidence; no auto-apply. |
| **Automated** | 🔲 Future | Rule-based promotion only after explicit policy enablement per workspace; always explainable and reversible. |

### Advisory example (required phrasing pattern)

**Do not say:**

> Promote to Leader.

**Say:**

> This contact appears ready for review as a potential **Leader** because:
>
> - Completed 8 volunteer shifts.
> - Recruited 4 additional volunteers.
> - Led 2 neighborhood meetings.

Same constraints as V3-014 / V3-016: `advisory: true`, citations to timeline entries, steward decides.

---

## Lifecycle transition log

Append-only, parallel to steward transition log:

```
Previous stage   Engaged          Mar 1 – Apr 10
Changed to       Volunteer        Apr 10
Reason           Completed 2 volunteer shifts
Changed by       Kelly (steward)
Source           manual | advisory_accepted | import
```

Backward transitions require **reason** (disengagement, move, data correction).

---

## Implementation sequencing

```text
V3-000  Lifecycle vocabulary + contract     ✅ FROZEN
V3-014  Timeline                              ✅
V3-016.1 Context
V3-016  Stewardship
V3-017  Action
V3-020  Advisory AI Contact Briefs
V3-021  Relationship Analytics
```

Every future module uses this vocabulary to answer: **"Where is this person in the relationship journey?"**

---

## Implementation phases

| Phase | Scope | Slice |
| ----- | ----- | ----- |
| **0 — Freeze** | This document; vocabulary; engine mapping | **CONTACT-V3-000** ✅ |
| **1 — Field + log** | `lifecycle_stage` on contact; transition table; manual UI | With V3-016 / 016.1 |
| **2 — Advisory** | Intelligence rules cite evidence; review queue | V3-016 Intelligence layer |
| **3 — Context-scoped** | Per-context lifecycle on graph edges | Post V3-019 |
| **4 — Automation** | Optional workspace policies | Future; explicit opt-in |

No Phase 1 code until **016.1** and **016** specs reference `CONTACT-V3-000`.

---

## Canonical vocabulary (mandatory)

Use these **lifecycle stage** keys in APIs, storage, and docs:

`unknown` · `identified` · `connected` · `engaged` · `supporter` · `volunteer` · `leader` · `advocate` · `champion`

Use these **transition source** keys:

`manual` · `advisory_accepted` · `import` · `system_correction`

Do **not** introduce alternate progressions (`lead`, `prospect`, `member`, `active donor`) without mapping to this vocabulary in the Lifecycle Engine catalog.

---

## Dashboard questions lifecycle enables

- Show contacts at **Engaged** cooling toward **Connected**
- Show **Volunteer**-stage contacts with no steward
- Show **Leader** candidates pending advisory review
- Show county breakdown of **Champion**-stage community leaders
- Show relationships that **regressed** this quarter (with reasons)

---

## Dependencies

- **CONTACT-V3-014** — timeline evidence (complete)
- **CONTACT-V3-016.1** — context-scoped lifecycle (future)
- **CONTACT-V3-016** — steward approves transitions; strength orthogonal to stage
- **CONTACT-V3-017** — stage-aware tasks and follow-ups

---

## Success criteria (architecture freeze)

1. Canonical nine-stage lifecycle documented with entry/exit guidance.
2. **Champion** reserved for top stage; **Steward** reserved for accountable person.
3. Manual vs advisory vs future automated modes defined.
4. Lifecycle distinct from strength, momentum, and steward role.
5. Formula and seven-engine map updated in architecture doc.
6. All v3 slice specs reference this vocabulary before implementation.

---

*CONTACT-V3-000 · Relationship Lifecycle Engine · Architecture frozen · LocalBrain · 2026*
