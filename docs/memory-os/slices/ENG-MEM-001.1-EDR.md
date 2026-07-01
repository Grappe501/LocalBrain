# Engineering Decision Record — ENG-MEM-001.1 Episode

> **Status:** Accepted  
> **Slice:** Gold standard reference implementation

---

## Context

First ENG-MEM-001 implementation commit. Episode chosen as the institutional memory atom — temporal container for meetings, calls, decisions, and future Institution Timeline.

---

## Decisions

| # | Decision | Rationale |
| - | -------- | --------- |
| D1 | Module path `backend/src/memory/` | MEM-008 T13.2 expected zero memory module — now authorized |
| D2 | Canonical types in `shared/src/memoryOs/` | Cross-package validation · serialization round-trip |
| D3 | SQLite JSON payload + lifecycle column | Matches existing backend persistence style (Vol 3 primary store) |
| D4 | Content append-only · lifecycle column mutable | A8 invariant — authoritative fields frozen; S2 transitions audited |
| D5 | Initial lifecycle `Captured` | S2 normative state for persisted memory with provenance |
| D6 | No HTTP routes in slice 1 | Wave 1 charter · MEM-008 no recall API |
| D7 | Provenance includes trust envelope | TRUST + S4 on every memory object (A4, A6) |
| D8 | Strict unknown-field rejection | Vol 2 evolution rules — additive fields require schema version bump |

---

## Consequences

- Future slices (Fact, Artifact, …) copy file layout, validator pattern, audit hooks, and test structure.
- Institution Timeline UI will read Episode records — no parallel event model.
- Wave 2 adds recall without changing Episode storage shape.

---

*ENG-MEM-001.1 EDR · LocalBrain V1*
