# Contact Management v3 — Architecture

> **Version:** **v1.0** · **immutable** for normal development · frozen 2026-07-05  
> **Changes:** Explicit architecture review + ADR only ([ADR-006](./CONTACT-V3-DECISION-RECORDS.md#adr-006-foundation-documents-protected-during-implementation))  
> **Constitution:** [CONTACT-V3-CONSTITUTION — Relationship Doctrine](./CONTACT-V3-CONSTITUTION.md) **FROZEN**  
> **Decisions:** [CONTACT-V3-DECISION-RECORDS (ADR)](./CONTACT-V3-DECISION-RECORDS.md) **FROZEN**  
> **Lifecycle:** [CONTACT-V3-000 — Relationship Lifecycle Engine](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md)  
> **Principle:** Foundation complete — implement and validate; resist new architecture layers without ADR.

Contact Management v3 is a **relationship operating system** — a long-term relationship record, not an address book. Seven engines decompose responsibility; [Relationship Doctrine](./CONTACT-V3-CONSTITUTION.md) governs them all.

---

## Document hierarchy

```
CONTACT-V3-CONSTITUTION          Relationship Doctrine (frozen)
CONTACT-V3-DECISION-RECORDS      ADR index — why (frozen, peers with Constitution)
        │
CONTACT-V3-ARCHITECTURE          Seven engines, formula, sequencing (this doc)
        │
CONTACT-V3-000                   Lifecycle vocabulary (frozen)
        │
CONTACT-V3-NNN                   Implementation slices
```

**Foundation complete.** No further architecture documents before implementation.

## Seven engines

| Engine | Role |
| ------ | ---- |
| **Identity** | Who the contact is |
| **Timeline** | What happened |
| **Context** | Why the relationship exists |
| **Stewardship** | Who cultivates it |
| **Lifecycle** | Where they are in the journey |
| **Intelligence** | What the system can infer / advisory surface |
| **Action** | What should happen next |

| Engine | Primary slices |
| ------ | -------------- |
| Identity | ENG-CONTACT-001.1 (V1 frozen) |
| Timeline | [CONTACT-V3-014](./CONTACT-V3-014-RELATIONSHIP-TIMELINE.md) ✅ |
| Context | [CONTACT-V3-016.1](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md) 🟡 |
| Stewardship | [CONTACT-V3-016](./CONTACT-V3-016-RELATIONSHIP-STEWARDSHIP.md) 🟡 |
| Lifecycle | [CONTACT-V3-000](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) **FROZEN** |
| Intelligence | [V3-020](./CONTACT-V3-020-AI-CONTACT-BRIEFS.md) · [V3-021](./CONTACT-V3-021-RELATIONSHIP-ANALYTICS-DASHBOARD.md) 🏆 **Certified complete** |
| Action | [CONTACT-V3-017](./CONTACT-V3-017-SMART-TASKS-FOLLOW-UP-QUEUE.md) · downstream |

**Infrastructure (not an engine):** [CONTACT-V3-015](./CONTACT-V3-015-TEST-RUNNER-ISOLATION.md) — test isolation debt.

---

## Freeze rules (lifecycle)

| Dimension | Meaning |
| --------- | ------- |
| **Lifecycle** | Relationship maturity — journey stage |
| **Strength** | Bond depth |
| **Momentum** | Direction of movement |
| **Health** | Stewardship condition |

- AI may recommend review; must **not** auto-promote lifecycle stage in v3.
- Transitions explainable through timeline/context evidence.
- **Manual** and **advisory** transitions allowed; **automatic** deferred unless explicitly approved later.
- Top lifecycle stage: **Champion** — not Steward (steward = accountable person).

See [CONTACT-V3-000](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md).

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

---

## Implementation sequencing

```text
V3-000  Lifecycle vocabulary + contract     ✅ FROZEN
V3-014  Timeline                              ✅
V3-016.1 Context                              🏆
V3-016  Stewardship                            🏆
V3-017  Action                                 🏆
V3-018  Household                              🏆
V3-019  Organizations                          🏆
V3-020  Advisory AI Contact Briefs             🏆
V3-021  Relationship Analytics                 🏆
```

**Intelligence Engine complete** under Architecture v1.0 · 2026-07-05

---

## Dependency chain

```
V3-000  Lifecycle (vocabulary FROZEN)
            │
V3-014  Timeline
            │
            ├──────────────┐
            ▼              ▼
V3-016.1  Context    V3-016  Stewardship
            │              │
            └──────┬───────┘
                   ▼
           Intelligence (014 · 016 · 020 · 021)
                   ▼
           V3-017  Action
                   ▼
         Volunteers · Events · Comms · Field · Analytics
```

Timeline supplies evidence; lifecycle tracks journey position; stewardship interprets; context explains why; intelligence advises; action responds.

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

Every future module enriches **one** component. Do not introduce alternate progression models.

---

## Implementation gate

Before **V3-016.1** or **V3-016** code:

1. [CONTACT-V3-000](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) frozen ✅
2. 016 / 016.1 specs reference lifecycle vocabulary and transition log
3. Phase 1: manual lifecycle stage + append-only lifecycle transition log

---

*Contact Management v3 Architecture · Relationship operating system · LocalBrain · 2026*
