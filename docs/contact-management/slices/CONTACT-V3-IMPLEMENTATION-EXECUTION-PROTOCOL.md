# IMPLEMENTATION EXECUTION PROTOCOL v1.0

> **Status:** **Accepted** · 2026-07-05  
> **Scope:** Contact Management v3 and similar build efforts  
> **Companion:** [Execution Charter](./CONTACT-V3-EXECUTION-CHARTER.md) · [Implementation Guide](./CONTACT-V3-IMPLEMENTATION-GUIDE.md)

## Purpose

Prevent analysis paralysis and ensure every planning effort transitions immediately into meaningful implementation.

---

## Rule 1 — Planning Ends Automatically

When architecture, contracts, and governance are declared complete, **implementation begins immediately**.

There is no "standing by" state.

The assistant must automatically transition into implementation work unless the user explicitly says to stop.

---

## Rule 2 — Default Is Build

Whenever there is uncertainty between planning and implementation: **choose implementation**.

Do not ask whether to begin building if the architecture has already been approved.

---

## Rule 3 — Large Vertical Slices

Avoid tiny implementation passes.

Every implementation pass should produce a meaningful amount of working software. Each pass should attempt to complete an entire vertical capability whenever practical, including:

- schema
- repository
- service
- API
- UI
- permissions
- tests
- documentation updates

The goal is a feature that can be exercised, not a collection of partial files.

---

## Rule 4 — Build to the Engineer's Capability

Assume the engineering workflow can implement substantial production-grade functionality.

Do not artificially decompose work into tiny increments simply because it is easier to describe.

Prefer one comprehensive implementation package over many micro-passes.

---

## Rule 5 — One Pass = One Deliverable

Every implementation pass should end with a usable outcome, such as:

- a working feature
- a reviewable pull request
- a complete Cursor implementation package
- a deployable subsystem

Never end a pass with only discussion if implementation is possible.

---

## Rule 6 — Stop Designing Once Frozen

After Architecture v1.0 is frozen:

- no new architectural documents
- no new conceptual models
- no speculative redesign

Unless the user explicitly opens Architecture v1.1 through the ADR process.

---

## Rule 7 — Implementation First

When new ideas arise during implementation:

1. Determine whether the idea fits the frozen architecture.
2. If yes, implement it.
3. If no, record it as a future ADR candidate.
4. Continue implementation.

Do not interrupt the current slice.

---

## Rule 8 — Review After Building

Implementation comes before review.

The sequence is always:

```
Contract
  ↓
Build
  ↓
Targeted Tests
  ↓
Review
  ↓
Operator Evidence
  ↓
Iteration
```

Never:

```
Contract → Review → Wait
```

---

## Rule 9 — Maximize Value Per Pass

Each implementation pass should seek to maximize completed capability while minimizing future integration work.

Favor completing an entire subsystem over touching many unrelated areas.

---

## Rule 10 — Assume Existing Competence

Unless there is evidence otherwise:

- assume the engineering environment works
- assume comprehensive implementation is preferable to placeholder scaffolding
- do not intentionally under-build

---

## Rule 11 — Escalation Threshold

Only stop implementation for:

- contract violation
- security issue
- destructive migration
- missing external dependency
- explicit user instruction

Everything else should be implemented and reviewed afterward.

---

## Rule 12 — Execution Bias

When a conversation has transitioned into implementation, every assistant response should ask internally:

> What code can be built next?

Not:

> What document can be written next?

---

## Rule 13 — Standing Authority

Once implementation is authorized, the assistant is expected to prepare complete implementation packages and implement without waiting for repeated permission.

The default assumption is: **Build until blocked.**

---

## Success Metric

Success is measured by:

- working functionality
- passing targeted tests
- reusable implementation patterns
- operator validation

—not by the number of planning documents produced.

---

## Role handoff (explicit)

| Role | Responsibility |
| ---- | -------------- |
| Product Owner / Architect | Contracts, ADRs, architecture freeze |
| Technical Lead | Implementation packages, build instructions |
| Cursor / Engineer | Vertical implementation, tests, review package |

When architecture is frozen and the next slice is identified, the default next action is **build** — not wait for permission.

---

*IMPLEMENTATION EXECUTION PROTOCOL v1.0 · LocalBrain · 2026*
