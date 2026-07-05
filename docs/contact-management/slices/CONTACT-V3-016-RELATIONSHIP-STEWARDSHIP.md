# CONTACT-V3-016 — Relationship Stewardship Engine

> **Type:** Contact Management v3 feature slice  
> **Status:** **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
> **Contract:** `CONTACT-V3-016` · internal engine id: **Relationship Stewardship Engine**  
> **Constitution:** [CONTACT-V3-CONSTITUTION](./CONTACT-V3-CONSTITUTION.md) **FROZEN**  
> **Predecessor:** [CONTACT-V3-014](./CONTACT-V3-014-RELATIONSHIP-TIMELINE.md) · [CONTACT-V3-000](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) (frozen)  
> **Roadmap:** [Contact Management v3](./CONTACT-V3-README.md) · [Architecture — seven engines](./CONTACT-V3-ARCHITECTURE.md)  
> **Pairs with:** [CONTACT-V3-016.1 — Context Engine](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md)

---

## Purpose

The timeline records *what happened*. Campaigns need to know **how this relationship is being cultivated** — not merely who is assigned — when Kelly, a body person, county captain, organizer, volunteer coordinator, and data team share the same CRM.

**Stewardship**, not ownership: ownership implies exclusivity; campaigns rarely work that way. The Stewardship Engine **interprets** the Timeline Engine; the [Context Engine](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md) explains *why* the relationship exists. Together they form the foundation for Intelligence and Action engines.

Once stewardship exists, nearly every downstream module becomes smarter: volunteer management, events, scheduling, email/SMS, field, canvassing, call lists, AI briefings, body-person support, and campaign analytics.

---

## Relationship formula (this engine's terms)

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

This slice owns: **Steward**, **Contributors**, **Watchers**, **Strength** (bond depth), **Momentum** (computed), **Health** (stewardship condition), **Steward transitions**. **Lifecycle** (journey maturity) → [V3-000](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md). Contexts → [V3-016.1](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md). Timeline → [V3-014](./CONTACT-V3-014-RELATIONSHIP-TIMELINE.md).

**Strength vs lifecycle:** Strength = bond depth. Lifecycle = journey stage. Momentum = direction. Health = stewardship condition. Do not collapse.

---

## Evolutionary data model (no parallel concepts)

V3-014 timeline meta already stores optional `relationship_owner_user_id`. **V3-016 promotes that field into the Steward role** — same column or migrated identity, not a duplicate owner concept. Contributors and Watchers are new assignment types; Steward Health and Momentum are computed layers.

---

## Behavioral question

> When anyone opens a contact, can they immediately see who is accountable, who contributes, who is watching, relationship strength, calculated health, momentum, last meaningful contact, and stewardship history — without losing institutional knowledge on handoffs?

---

## Three assignment roles

### 1. Steward

The person **accountable**. Exactly one.

```
Kelly Grappe
```

Responsible for:

- relationship quality
- follow-up
- strategy
- approvals

**Storage:** Promote V3-014 `relationship_owner_user_id` → `steward_user_id` (alias/migrate in place; do not introduce parallel owner fields).

**UI:** May display as **Owner** or **Steward** — product choice; internal contract uses **Steward**.

### 2. Contributors

Many. They interact with the contact; they are **not** accountable for the relationship.

```
Chris
County Captain
Volunteer
Body Person
```

### 3. Watchers

Optional. Receive updates. Never assigned work.

```
Communications
Finance
Scheduler
Candidate
```

This distinction becomes valuable for permissions, notifications, task routing (V3-017), and AI explainability.

---

## Relationship intelligence (contact header)

```
John Smith
★★★★★ Relationship

Steward       Kelly
Contexts      Campaign (Primary) · Church · Volunteer
Contributors  Chris · Mary · Body Person
Watching      Finance · Communications

Strength      Volunteer        (bond character)
Lifecycle     Leader           (journey stage — V3-000)
Momentum      Growing
Health        92 — Healthy

Last Contact  4 days ago
Next Follow-up July 12
Open Tasks    3
```

Campaign staff get full context in seconds.

---

## Relationship strength

Categorical bond depth — **distinct from momentum and health**.

| Value |
| ----- |
| Unknown |
| New |
| Acquaintance |
| Supporter |
| Volunteer |
| Core Volunteer |
| County Leader |
| Donor |
| Major Donor |
| Community Influencer |
| Strategic Partner |

*Example:* A donor can be **strong** but **cooling**. A volunteer can be **new** but **growing rapidly**.

---

## Relationship momentum

Engagement trajectory — **separate from strength**.

| Value | Meaning |
| ----- | ------- |
| Growing | Interaction frequency or depth increasing |
| Stable | Consistent engagement |
| Cooling | Declining engagement |
| Dormant | No recent meaningful activity |
| Lost | Relationship effectively abandoned |

Computed from timeline patterns (interaction types, frequency, sentiment, volunteer activity), not manual entry.

---

## Steward health (calculated)

**Not manual.** Derived score with explainable factors.

```
Health Score  92

because
  Meaningful contact   5 days ago
  Open tasks           0
  Volunteer activity   High
  Recent response      Positive
```

Stale thresholds contribute to health degradation:

- 30 / 60 / 90 days without meaningful interaction

Last meaningful contact surfaced as human-readable recency (e.g. `17 days ago`).

---

## Steward transition history

Relationships change — people leave campaigns, retire, move counties. Preserve institutional knowledge.

```
Previous Steward  Chris        Jan–Apr
Transferred       Kelly        April 17
Reason            County reassignment
```

Append-only transition log; current steward remains exactly one.

---

## Manager dashboard

Management intelligence queries:

- Show every relationship **cooling** in Benton County
- Show everyone **growing rapidly**
- Show relationships **without a steward**
- Show people with **four contributors but no accountable steward**
- Who has **no steward**?
- Who stewards **too many** people?
- Which volunteers are being **ignored**?
- Which **donors** haven't been contacted?
- Which **county leaders** are inactive?

---

## AI layer (advisory only)

Because V3-014 timeline exists, advisory output cites interaction history — never asserts ownership as fact.

**Do not say:**

> Kelly owns this person.

**Say:**

> Kelly appears to be the primary steward based on interaction history.

**Constraints:** Same as V3-014 — `advisory: true`, `live_ai_wired: false` until explicitly connected; citations required; no automatic sends or fact creation.

Example advisory synthesis:

> Kelly appears to be the primary steward through campaign work, but also shares a church affiliation. Chris has contributed at three events. Momentum is growing.

---

## Proposed scope

| Area | Deliverable |
| ---- | ----------- |
| Shared contract | `ContactStewardship` — steward, contributors, watchers, strength, momentum, health score + factors, transition log |
| Storage | Stewardship table or contact extension; **promote** `relationship_owner_user_id` → steward; contributor/watcher join tables |
| API | CRUD stewardship assignments; transition recording; computed health/momentum/last-contact; dashboard aggregate queries |
| Engine | **Relationship Stewardship Engine** — pure functions for health, momentum, staleness from timeline + tasks |
| UI | Contact header (Relationship Intelligence block); stewardship edit panel; transition history |
| Permissions | Steward edits vs contributor self-assign vs watcher read-only; align V3-014 role headers |
| Advisory | Stewardship-aware rule-based summaries; safe AI phrasing contract |

---

## Out of scope (this slice)

- Full task creation UI (→ V3-017) — open task **count** may surface from existing follow-ups
- Household graph (→ V3-018)
- Org affiliation expansion (→ V3-019)
- Full AI contact brief (→ V3-020)
- Campaign-wide analytics polish (→ V3-021)

---

## Dependencies

- **CONTACT-V3-014** — interaction timeline, follow-ups, timeline meta with `relationship_owner_user_id` (complete)
- **CONTACT-V3-016.1** — Context Engine (specify together; optional context on interactions)
- **ENG-CONTACT-001.1–001.4** — canonical contact storage, CRUD, permissions (frozen)

---

## Success criteria

1. Exactly one **Steward** per contact; contributors and watchers modeled separately — no parallel "owner" field.
2. V3-014 `relationship_owner_user_id` promoted, not duplicated.
3. **Health** and **momentum** computed from timeline (and task signals where available) — not manual enums alone.
4. **Steward transition** history append-only and readable on contact profile.
5. Contact header shows Relationship Intelligence block (steward / contributors / watching).
6. Dashboard supports cooling, growing, un-stewarded, and contributor-without-steward queries.
7. Advisory copy follows stewardship-safe phrasing.
8. Targeted tests pass via isolated runner (per V3-014 validation pattern).

---

## Validation (when implemented)

```bash
cd backend && node --import tsx --test src/contacts/contactStewardship.test.ts
npm run typecheck
npm run build
```

---

## Governance review (2026-07-05)

| Decision | Result |
| -------- | ------ |
| Implementation Status | ✅ **APPROVE** |
| Pattern Status | 🏆 **REFERENCE PATTERN CERTIFIED** |

**Certification statement:** Implement CONTACT-V3-017 Action Engine by cloning conventions from V3-016.1 and V3-016.

**Implementation principle certified:** **Promote, don't duplicate** — elevate existing concepts instead of parallel state.

**Inherited pattern (unless ADR documents deviation):** shared contracts · version constants · validator · repository history · append-only audit · RBAC · compute layer for derived values · API conventions · reusable React hierarchy · targeted serial tests.

---

*CONTACT-V3-016 · Relationship Stewardship Engine · LocalBrain · 2026*
