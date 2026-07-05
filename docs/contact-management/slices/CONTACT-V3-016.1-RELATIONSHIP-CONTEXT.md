# CONTACT-V3-016.1 — Relationship Context Engine

> **Type:** Contact Management v3 feature slice  
> **Status:** **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
> **Implementation:** [Implementation guide](./CONTACT-V3-IMPLEMENTATION-GUIDE.md) · [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md)  
> **Contract:** `CONTACT-V3-016.1` · internal engine id: **Context Engine**  
> **Predecessor:** [CONTACT-V3-014 — Relationship Timeline](./CONTACT-V3-014-RELATIONSHIP-TIMELINE.md)  
> **Pairs with:** [CONTACT-V3-016 — Relationship Stewardship Engine](./CONTACT-V3-016-RELATIONSHIP-STEWARDSHIP.md)  
> **Constitution:** [CONTACT-V3-CONSTITUTION](./CONTACT-V3-CONSTITUTION.md) **FROZEN**  
> **Architecture:** [Seven engines · V3-000 Lifecycle frozen](./CONTACT-V3-ARCHITECTURE.md)

---

## Purpose

Every relationship exists in **one or more contexts**. The same person may be a campaign volunteer, church member, Rotary contact, neighbor, business owner, and petition leader — simultaneously.

Without context, later modules (AI, events, communications, analytics) cannot answer **why** someone knows a contact or filter relationships meaningfully.

The Context Engine models *why the relationship exists*. The Timeline Engine records *what happened*. The Stewardship Engine assigns *who cultivates it*.

---

## Behavioral question

> Can staff see — and filter by — the distinct reasons this relationship exists, with interactions and stewardship understood in context?

---

## Relationship contexts (examples)

A contact may carry multiple labeled contexts:

```
Kelly ── John Smith
  │
  ├── Secretary of State Campaign
  ├── Local Volunteer
  ├── Church
  ├── Rotary Club
  ├── Neighbor
  ├── Business Owner
  └── Petition Leader
```

Each context is a **separate relational edge** to the same identity — not a tag soup on the contact record alone.

---

## Context object

Contexts attach to the **relationship** (contact + workspace, optionally + steward perspective), with rank:

```
Steward     Kelly

Contexts
  Secretary of State Campaign    Primary
  Church                         Secondary
  Volunteer Coordinator          Secondary
```

**Primary vs secondary** drives UI emphasis, default filters, and AI explanation priority.

---

## Context taxonomy (seed catalog)

Workspace-configurable; seed examples for campaigns:

| Category | Examples |
| -------- | -------- |
| Campaign | Secretary of State Campaign, Primary volunteer, Petition leader |
| Civic | Church, Rotary, County Fair, Neighbor |
| Professional | Business owner, Teacher, Veteran, Media, Legislator |
| Program | Food drive, Canvass turf, Donor circle |

Filters campaigns expect:

- Veterans · Teachers · Church relationships · County Fair contacts
- Business relationships · Petition volunteers · Media · Legislators

Those are **contexts**, not ad-hoc tags.

---

## Context timeline

Interactions inherit optional **context** at log time:

| Interaction | Context |
| ----------- | ------- |
| Call | Campaign |
| Meeting | Church |
| Volunteer Shift | Petition |
| Door knock | Canvass turf |

Extends V3-014 `ContactInteraction` with optional `context_id` or `context_key` — evolutionary add, not a parallel event log.

Analytics become richer: engagement by context, cooling within campaign vs church, etc.

---

## Stewardship × context

Steward assignment may be **global per contact** (V3-016 default) or **context-scoped** in a later refinement. Minimum V3-016.1 deliverable:

- One steward per contact (promoted from V3-014 meta)
- Contexts explain *through which lens* that stewardship is primary
- AI example: *"Kelly is the primary steward through campaign work, but also shares a church affiliation."*

---

## Relationship graph

Target visualization — multiple edges, one identity:

```
Kelly
  │
  ▼
John Smith
  │
  ───────────────
  Campaign
  Church
  Volunteer
  County Fair
  Neighbor
  ───────────────
```

Context Engine owns edge definitions; V3-018 household and V3-019 org mapping extend the graph without replacing it.

---

## AI (advisory only)

With context + timeline evidence:

> You know John primarily through the campaign, but you've also worked together on two community food drives and attended three civic events together.

**Constraints:** Cite interaction + context assignments; `advisory: true`; no fabricated affiliations.

---

---

## Reference implementation pattern

V3-016.1 is the **first code slice** and the **template** for all future engines. Implement the pattern completely; defer exotic Context features.

### Data contract

| Element | Requirement |
| ------- | ----------- |
| Context entity | Workspace-scoped catalog entry (id, label, category, status) |
| Contact ↔ Context | Join with rank: **primary** \| **secondary** |
| Effective dates | `effective_from` · `effective_until` (optional) |
| Confidence / source | `manual` · `import` · `inferred_advisory` (never silent infer in v1) |
| Audit metadata | `created_at` · `created_by` · `updated_at` · append-only assignment history |

Shared types: `shared/src/contacts/contactContext.ts` · contract id `CONTACT-V3-016.1`

### Service layer

| Operation | Notes |
| --------- | ----- |
| Create context | Catalog entry |
| Assign context | Contact link + rank + effective dates |
| Remove context | Soft-end or archive link — preserve history |
| Merge duplicate contexts | Reassign links; log merge audit |
| Search / filter | Contacts by context, category, primary-only |
| History | Assignment change log (append-only) |

### UI pattern (reusable components)

| Component | Use |
| --------- | --- |
| **Context cards** | Contact profile summary |
| **Context chips** | Compact multi-context display |
| **Context timeline indicators** | Interaction rows show context |
| **Context filter drawer** | Workspace list filters |
| **Context selector** | Quick-log + assign flows |

Later engines reuse these primitives — do not one-off per slice.

### Permissions

Define once; reuse via V3-014 header roles pattern (`admin` · `owner` · `organizer` · `viewer`):

| Action | Typical roles |
| ------ | ------------- |
| Create contexts (catalog) | admin, owner |
| Edit contexts | admin, owner |
| Archive contexts | admin |
| Merge contexts | admin |
| Assign context to contact | admin, owner, organizer |
| Remove contact context link | admin, owner, organizer |
| View contexts | all roles |

Document matrix in slice doc when implemented.

### Tests (establish convention)

| Layer | File (example) |
| ----- | -------------- |
| Unit | `contactContextValidator.test.ts` |
| Repository | `contactContextRepository.test.ts` |
| Service | `contactContextService.test.ts` or repository integration |
| API | `contactContextRoutes.test.ts` |
| Permissions | Cases in API or dedicated permission tests |
| Targeted slice | `contactContext.test.ts` — serial DB suite |

Run: `cd backend && node --import tsx --test src/contacts/contactContext.test.ts`

Complete against [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md).

Upon successful [technical review](./CONTACT-V3-TECHNICAL-REVIEW.md#milestone-reference-pattern-certified), declare **Reference Pattern Certified** in the slice validation note.

### Success question

> Can another engineer implement Stewardship, Action, and Intelligence by following this pattern?

If yes, V3-016.1 succeeded — regardless of Context feature breadth.

---

## Proposed scope (MVP)

| Area | Deliverable |
| ---- | ----------- |
| Shared contract | `RelationshipContext`, contact-context links, primary/secondary rank |
| Storage | Context catalog table + contact_context join; optional context on interactions |
| API | CRUD contexts; assign/rank on contact; filter contacts by context |
| UI | Context list on contact header; context picker on quick-log interaction |
| Filters | Workspace views: by context category and primary context |
| Migration | Map existing tags to contexts where sensible (optional, non-destructive) |

---

## Out of scope (this slice)

- Full relationship graph UI (→ V3-021 analytics)
- Context-specific steward reassignment workflow (future refinement)
- Automatic context inference from AI (→ Intelligence Engine / V3-020)

---

## Dependencies

- **CONTACT-V3-014** — interaction types, timeline feed (complete)
- **CONTACT-V3-016** — stewardship model should be specified together; implement paired or context-first

---

## Success criteria

1. Contact may have **multiple contexts** with primary/secondary rank.
2. Interactions may optionally record **context**.
3. Filters return contacts by context (e.g. all Church relationships in Benton County).
4. Contact header shows context summary alongside stewardship block.
5. Advisory copy can explain relationship **through** primary context with secondary citations.
6. No parallel "relationship type" field outside Context Engine.

---

## Validation (when implemented)

```bash
cd backend && node --import tsx --test src/contacts/contactContext.test.ts
npm run typecheck
npm run build
```

## CONTACT-V3-016.1 Validation Note

Targeted validation passed:

- Command: `cd backend && node --import tsx --test src/contacts/contactContext.test.ts`
- Result: 2/2 passed

Initial failure was caused by an incorrect test expectation: the test expected a `merged` history entry on contact A, but merge history is correctly recorded on contact B because contact A's campaign link had already ended before merge.

Correction made:

- Assertion updated to match actual lifecycle/history behavior.

Conclusion:

CONTACT-V3-016.1 targeted validation passes and is ready for governance review.

## Governance review (2026-07-05)

| Decision | Result |
| -------- | ------ |
| Implementation Status | ✅ **APPROVE** |
| Pattern Status | 🏆 **REFERENCE PATTERN CERTIFIED** |

**Certification statement:** Build CONTACT-V3-016 Stewardship by cloning the CONTACT-V3-016.1 implementation pattern — not by inventing a new one.

**Inherited pattern (unless ADR documents deviation):** shared contracts · version constants · validator layer · repository history ownership · append-only audit · RBAC isolation · API conventions · reusable React hierarchy · targeted serial tests.

**Scheduled iteration (non-blocking):** HTTP route tests for context endpoints.

---

*CONTACT-V3-016.1 · Context Engine · LocalBrain · 2026*
