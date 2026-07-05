# CONTACT-V3-DECISION-RECORDS (ADR)

> **Type:** Architecture Decision Records — **FROZEN** index · ADRs append over time  
> **Status:** Foundation complete · 2026-07-05  
> **Peers:** [CONTACT-V3-CONSTITUTION — Relationship Doctrine](./CONTACT-V3-CONSTITUTION.md) (what must always be true) · [CONTACT-V3-ARCHITECTURE](./CONTACT-V3-ARCHITECTURE.md) (how the system is organized)  
> **This document:** **Why** significant design decisions were made — so future contributors do not unknowingly reverse them.

---

## What this is

| Document | Answers |
| -------- | ------- |
| [Constitution](./CONTACT-V3-CONSTITUTION.md) | What must always be true |
| [Architecture](./CONTACT-V3-ARCHITECTURE.md) | How the system is organized |
| **Decision Records (this doc)** | Why a decision was made |

The Constitution and ADR index sit **beside** each other — not parent/child. New ADRs are appended; superseded ADRs keep history with updated status.

---

## ADR format

Each record is short:

- **Decision**
- **Context**
- **Alternatives considered**
- **Consequences**
- **Status** — Accepted · Superseded · Deprecated

---

## Index

| ID | Title | Status |
| -- | ----- | ------ |
| [ADR-001](#adr-001-relationship-centric-not-contact-centric) | Relationship-centric, not contact-centric | Accepted |
| [ADR-002](#adr-002-stewardship-separate-from-lifecycle) | Stewardship separate from Lifecycle | Accepted |
| [ADR-003](#adr-003-context-as-first-class-engine) | Context as first-class engine | Accepted |
| [ADR-004](#adr-004-ai-advisory-only) | AI advisory-only | Accepted |
| [ADR-006](#adr-006-foundation-documents-protected-during-implementation) | Foundation documents protected during implementation | Accepted |

---

## ADR-001: Relationship-centric, not contact-centric

**Decision**

Contact Management v3 is a **relationship operating system**. The unit of value is the **relationship**, not the contact record.

**Context**

Traditional CRMs optimize for contact storage — names, emails, tags. Campaigns, nonprofits, and advocacy organizations optimize for **relationship cultivation** over time. V1 (ENG-CONTACT-001) delivered canonical contact storage; v3 extends toward long-term relationship memory.

**Alternatives considered**

- **Contact-centric evolution** — add relationship fields to the contact table without a relationship model. Rejected: collapses journey, context, and stewardship into undifferentiated columns.
- **Separate "Relationships" entity per person pair** — rejected for v3: over-engineered before timeline evidence existed; one identity with many contextual edges is sufficient (see ADR-003).

**Consequences**

- Seven engines and the relationship formula govern all slices.
- UI should tell the **story of the relationship**, not display a form (Constitution Future Product Test).
- Features that only strengthen contact hygiene without relationship cultivation belong elsewhere.

**Status:** Accepted · 2026-07-05

---

## ADR-002: Stewardship separate from Lifecycle

**Decision**

**Stewardship** (who cultivates) and **Lifecycle** (where they are in the journey) are **separate engines** with distinct vocabulary.

- **Steward** = accountable **person** (promoted from V3-014 `relationship_owner_user_id`).
- **Lifecycle stage** = relationship **maturity** (`unknown` → `champion`).
- Top lifecycle stage is **Champion**, not Steward — avoids collision with stewardship role.

**Context**

Campaigns conflate "who owns this contact?" with "how mature is this relationship?" Daily work assigns stewards; journey position changes with evidence. Collapsing both into one model causes UI ambiguity and blocks independent analytics (e.g. strong donor who is cooling vs new volunteer who is growing).

**Alternatives considered**

- **Lifecycle inside Stewardship Engine** — rejected: every future question about journey stage would route through stewardship permissions and owner fields.
- **Single "relationship status" enum** — rejected: cannot express steward change without stage change, or stage regression without steward reassignment.
- **Use "Steward" as top lifecycle stage** — rejected (terminology guardrail): steward is a role, not a maturity level.

**Consequences**

- Strength (bond depth), Momentum (direction), Health (stewardship condition), and Lifecycle (journey stage) remain orthogonal dimensions.
- Two append-only logs: **lifecycle transitions** and **steward transitions**.
- Dashboard queries can combine dimensions (e.g. Volunteer stage + no steward + Cooling momentum).

**Status:** Accepted · 2026-07-05 · See [CONTACT-V3-000](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md)

---

## ADR-003: Context as first-class engine

**Decision**

**Context** is a first-class engine (CONTACT-V3-016.1), not tags or notes. One contact; **many relationships in many contexts**.

**Context**

The same person is a campaign volunteer, church member, neighbor, and business owner simultaneously. Without context, AI, events, communications, and analytics cannot answer **why** the organization knows them. Duplicate contacts are a common CRM failure mode when context is missing.

**Alternatives considered**

- **Tags only** — rejected: no primary/secondary rank, no interaction inheritance, no graph edges.
- **Duplicate contact records per context** — rejected: violates Constitution Principle 4.
- **Context as optional note on interactions only** — rejected: cannot filter "all Church relationships" or explain stewardship through campaign vs civic lens.

**Consequences**

- Interactions may inherit optional `context` at log time.
- Relationship graph uses multiple edges per identity.
- Filters: Veterans, Teachers, Church, County Fair, Petition volunteers, etc. are **contexts**.

**Status:** Accepted · 2026-07-05 · See [CONTACT-V3-016.1](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md)

---

## ADR-004: AI advisory-only

**Decision**

All v3 AI surfaces are **advisory-only** in initial implementation: cite evidence, recommend review, never auto-act.

**Context**

Campaign trust and Constitution Principles 3, 5, and 10 require evidence before inference and human responsibility for decisions. V3-014 established the pattern (`advisory: true`, `live_ai_wired: false`). Lifecycle promotion, outreach, and stewardship assignment have real-world consequences.

**Alternatives considered**

- **Auto-promote lifecycle on rules** — deferred (V3-000): only with explicit workspace policy and reversibility; not v3 default.
- **Generative summaries without citations** — rejected: violates AI Test and Evidence gate.
- **Silent field inference** — rejected: humans must confirm material relationship facts.

**Consequences**

- Required phrasing: *appears*, *ready for review*, *based on interaction history*.
- Forbidden without review: *Kelly owns this person*, *Promote to Leader*.
- COM/EI integration paths must preserve citation envelope (aligned with Memory OS / EI traceability elsewhere in platform).

**Status:** Accepted · 2026-07-05 · See [Constitution — AI Test](./CONTACT-V3-CONSTITUTION.md#ai-test)

---

## ADR-005: Append-only relationship history

**Decision**

Relationship history is **append-only by default**: timeline interactions, lifecycle transitions, steward transitions, and material audit events are never silently overwritten.

**Context**

Constitution Principle 7 — institutional memory is sacred. Campaigns lose knowledge when staff turnover erases *why* a relationship changed. Corrections append new records with reason; they do not destroy prior truth.

**Alternatives considered**

- **In-place stage overwrite** — rejected for lifecycle and steward changes.
- **Soft-delete only timeline** — rejected: hides evidence AI and audits require.
- **Full event sourcing everywhere** — deferred: v3 scopes append-only to relationship-domain tables, not entire platform.

**Consequences**

- `UPDATE` on lifecycle stage updates current pointer; **transition log** retains full history.
- Backward lifecycle moves require **reason**.
- Import and correction use `system_correction` source key (V3-000).

**Status:** Accepted · 2026-07-05 · See [Constitution — Principle 7](./CONTACT-V3-CONSTITUTION.md#principle-7--institutional-memory-is-sacred)

---

## ADR-006: Foundation documents protected during implementation

**Decision**

**No implementation may modify** [Constitution](./CONTACT-V3-CONSTITUTION.md), [Architecture](./CONTACT-V3-ARCHITECTURE.md), or [V3-000 lifecycle vocabulary](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) **without an explicit architecture review.**

Implementation validates architecture; it does not silently revise it.

**Context**

Foundation complete as of 2026-07-05. The bottleneck shifts from design to code. Without this rule, convenience edits (extra enum values, merged engines, weakened AI constraints) erode coherence slice by slice.

**Alternatives considered**

- **Allow slice authors to patch Architecture inline** — rejected: no durable review trail.
- **Freeze all docs including slice specs** — rejected: slice docs and validation notes must update with code.
- **Architecture committee for every PR** — rejected for v3: explicit review only when foundation docs change; ADRs for significant runtime decisions.

**Consequences**

- New vocabulary → ADR + review before V3-000 edit.
- New engine → constitution amendment + architecture review.
- Slice completion uses [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md) and [Implementation guide](./CONTACT-V3-IMPLEMENTATION-GUIDE.md).
- V3-016.1 is reference implementation pattern for future slices.

**Status:** Accepted · 2026-07-05

---

## Adding new ADRs

When a **significant** design choice is made during implementation:

1. Assign next ID (`ADR-006`, …).
2. Use the standard format.
3. Link from affected slice docs.
4. If reversing an ADR, mark old record **Superseded** and add new ADR referencing it.

Trivial implementation choices do not need ADRs. Cross-engine boundaries, vocabulary, AI posture, and data lifecycle do.

---

## Architectural foundation — complete

No further foundational documents are required before implementation. Next value comes from **building and validating** through real software.

**Resist** adding more architecture layers unless a decision fails the four acceptance gates and requires a constitutional or ADR amendment.

---

## Implementation order (post-foundation)

**Phase 1 complete · 2026-07-05:** V3-016.1 · V3-016 · V3-017 · V3-018 · V3-019 · V3-020 · V3-021 — all reference-pattern certified. Intelligence Engine complete under [Architecture v1.0](./CONTACT-V3-ARCHITECTURE.md).

**Next:** Operator evidence · V3-015 test isolation (parallel) · downstream modules on certified core.

---

## Slice acceptance — four gates

Every completed slice must answer **yes** to all four before acceptance:

| Gate | Question |
| ---- | -------- |
| **Constitution** | Does it uphold the [Relationship Doctrine](./CONTACT-V3-CONSTITUTION.md)? |
| **Architecture** | Does it belong to one [engine](./CONTACT-V3-ARCHITECTURE.md)? |
| **Lifecycle** | Does it respect the [relationship journey](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md)? |
| **Evidence** | Can its behavior be explained and audited? |

If any gate fails, revise the slice — do not bypass with a one-off field or silent automation.

---

## Document map (foundation layer)

```
CONTACT-V3-CONSTITUTION          what must always be true
CONTACT-V3-DECISION-RECORDS      why decisions were made     ← peers
        │
CONTACT-V3-ARCHITECTURE         how the system is organized
        │
CONTACT-V3-000                  lifecycle vocabulary
        │
CONTACT-V3-014 · 016.1 · 016 …  implementation slices
```

---

*CONTACT-V3-DECISION-RECORDS · Architecture Decision Records · LocalBrain · 2026*
