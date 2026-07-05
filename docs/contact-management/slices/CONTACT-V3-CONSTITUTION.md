# CONTACT-V3-CONSTITUTION — Relationship Doctrine

> **Type:** Contact Management v3 design constitution — **FROZEN**  
> **Status:** **ARCHITECTURE FROZEN** · 2026-07-05 · governs all engines and slices  
> **Scope:** Not a build slice. Not an engine. The lens for every future feature, schema change, AI capability, and UI decision.  
> **Peers:** [CONTACT-V3-DECISION-RECORDS (ADR)](./CONTACT-V3-DECISION-RECORDS.md) — why decisions were made  
> **Architecture:** [Seven engines](./CONTACT-V3-ARCHITECTURE.md) · [Lifecycle](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) · [Roadmap](./CONTACT-V3-README.md)

---

## What this is

Contact Management v3 is a **relationship-centered operating model**, not a contact database with extra fields. This document is the **constitution** that governs all seven engines:

| Engine | Role |
| ------ | ---- |
| Identity | Who the contact is |
| Timeline | What happened |
| Context | Why the relationship exists |
| Stewardship | Who cultivates it |
| Lifecycle | Where they are in the journey |
| Intelligence | What the system can infer / advisory surface |
| Action | What should happen next |

When a proposal arrives, the first question is not *"Can we build it?"* It is *"Does it uphold the relationship doctrine?"*

---

## Core principles

### Principle 1 — Relationships are the product

The CRM does not manage contacts.

It manages **relationships**.

---

### Principle 2 — Every piece of data must strengthen a relationship

If a field cannot answer one of these, it probably does not belong:

- **Who?**
- **What happened?**
- **Why?**
- **Where are we?**
- **Who is responsible?**
- **What should happen next?**

Map fields to engines: Identity · Timeline · Context · Lifecycle · Stewardship · Action · Intelligence.

---

### Principle 3 — Evidence before inference

Everything AI says must trace back to:

- Timeline
- Context
- Lifecycle
- Stewardship

**Never invent.**

Advisory output requires citations. `advisory: true` until explicitly wired; even then, evidence-first.

---

### Principle 4 — One contact. Many relationships. Many contexts.

Avoid duplicate contacts.

**Duplicate relationships instead.**

One identity; many contextual edges (campaign, church, volunteer, civic). See [Context Engine](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md).

---

### Principle 5 — Humans remain responsible

AI advises.

Humans decide.

**Always.**

No automatic lifecycle promotion, no automatic outreach, no silent field mutation that implies human judgment.

---

### Principle 6 — Everything is explainable

Every score.

Every recommendation.

Every transition.

Must answer:

> **Why?**

Lifecycle transitions, steward changes, health scores, momentum, and advisory briefs carry reasons and evidence refs.

---

### Principle 7 — Institutional memory is sacred

Never overwrite.

**Append.**

History is valuable.

Timeline, lifecycle transition log, steward transition log, and interaction records are append-only by default.

---

### Principle 8 — Relationships evolve

Nothing is static.

Everything can grow.

Everything can cool.

Everything can recover.

Lifecycle stages move forward and backward. Momentum and health reflect current reality, not permanent labels.

---

### Principle 9 — Context matters

People are never just voters.

They are neighbors. Parents. Teachers. Veterans. Business owners. Volunteers. Community members.

Campaigns should **remember that**.

Context Engine exists to preserve *why* the relationship exists — not to reduce people to a single tag.

---

### Principle 10 — Trust is earned

The system should help campaigns **build trust**.

Not manipulate people.

Advisory language uses *appears*, *ready for review*, *based on interaction history* — never coercion, never fabricated intimacy, never hidden automation.

---

## Golden question

Every feature proposal must answer:

> **Does this help cultivate healthier relationships?**

If the answer is no — it probably belongs somewhere else.

---

## Architecture test

Before approving a slice:

**Can it map into one of the seven engines?**

If not — **should it exist?**

| Pass | Fail |
| ---- | ---- |
| Extends Timeline with interaction evidence | Adds orphan fields with no engine home |
| Adds Context edge or filter | Introduces parallel progression vocabulary |
| Computes Intelligence from stored evidence | Collapses lifecycle + strength + momentum into one opaque score |

New engines require constitution amendment — not silent addition in a slice doc.

---

## AI test

Before AI says anything:

**Can it cite evidence?**

If not — **don't say it.**

Required evidence sources (any subset, never none):

- Timeline entries
- Context assignments
- Lifecycle stage + transition history
- Stewardship assignments + steward transitions

Forbidden without human review:

- *"Kelly owns this person."*
- *"Promote to Leader."*
- Any substantive claim with no citation ref

Preferred:

- *"Kelly appears to be the primary steward based on interaction history."*
- *"This contact appears ready for review as a potential Leader because…"*

---

## Future product test

Imagine five years from now.

A user opens a contact.

The software should **tell the story of the relationship**.

Not just display fields.

The story weaves:

- Who they are (Identity)
- What happened (Timeline)
- Why we know them (Context)
- Who cultivates the bond (Stewardship)
- Where they are in the journey (Lifecycle)
- What the system observes (Intelligence — advisory)
- What should happen next (Action)

If a feature makes the contact page more like a form and less like a story — reconsider.

---

## Relationship formula (constitutional)

All slices must respect the canonical composition:

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

Enrich one component. Do not introduce competing relationship models.

---

## Slice approval checklist

Before implementation of any `CONTACT-V3-NNN` slice:

- [ ] Maps to at least one engine
- [ ] Passes the Golden Question
- [ ] Respects append-only history where applicable
- [ ] AI (if any) is advisory with citation contract
- [ ] References [V3-000 lifecycle vocabulary](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) where journey stage is involved
- [ ] Does not duplicate contacts when contexts would suffice
- [ ] Explainability: every computed output has a *why*

---

## Hierarchy of v3 documents

```
CONTACT-V3-CONSTITUTION          what must always be true
CONTACT-V3-DECISION-RECORDS      why decisions were made      ← peers
        │
CONTACT-V3-ARCHITECTURE          how the system is organized
        │
CONTACT-V3-000                   lifecycle vocabulary
        │
CONTACT-V3-NNN slices            implementation specs
```

Constitution and ADR index change rarely and deliberately. Architecture and slices implement doctrine; they do not override it without a new ADR. **Implementation phase:** [Guide](./CONTACT-V3-IMPLEMENTATION-GUIDE.md) · [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md).

---

*CONTACT-V3-CONSTITUTION · Relationship Doctrine · Architecture frozen · LocalBrain · 2026*
