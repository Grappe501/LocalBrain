# CONTACT-V3 — Execution Charter

> **Status:** **Accepted** · **Evidence-Driven Development** · **PRL-3** · 2026-07-05  
> **Platform:** Governed **constituent operating platform** — UCIE (identity trust) + Contact Management v3 (relationship trust)  
> **Phase:** [Evidence-Driven Development](../../operator-readiness/EVIDENCE-DRIVEN-DEVELOPMENT.md)  
> **Doctrine:** [Certified Implementation Doctrine](../../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md) — frozen · review on every change  
> **Acceptance test:** [Canonical Platform Acceptance Test v1.0](../../operator-readiness/CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md) ✅  
> **Readiness:** [PRL-1 … PRL-6](../../operator-readiness/PLATFORM-READINESS-LEVELS.md) · current **PRL-3** · next **[PRL-4 Exit Contract](../../operator-readiness/PRL-4-EXIT-CONTRACT.md)**  
> **Handoff:** Implementation Phase 1 complete → **Operator Readiness**  
> **Execution protocol:** [Implementation Execution Protocol v1.0](./CONTACT-V3-IMPLEMENTATION-EXECUTION-PROTOCOL.md)  
> **UCIE:** [UCIE README](../../ucie/UCIE-README.md) · [CONTACT-V3-100](../../ucie/CONTACT-V3-100-IDENTITY-ACQUISITION-PLATFORM.md)  
> **Review process:** [Technical review guide](./CONTACT-V3-TECHNICAL-REVIEW.md) · [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md) · [Implementation guide](./CONTACT-V3-IMPLEMENTATION-GUIDE.md)

---

## Contact Management v3 — Execution Charter

| | |
| - | - |
| **Planning** | Complete |
| **Architecture** | v1.0 Frozen (Contact v3) · UCIE v1.0 Certified |
| **Implementation Phase 1** | Complete · Reference patterns certified |
| **Current phase** | **[Evidence-Driven Development](../../operator-readiness/EVIDENCE-DRIVEN-DEVELOPMENT.md)** · **PRL-3** |
| **Next gate** | **[PRL-4 Exit Contract](../../operator-readiness/PRL-4-EXIT-CONTRACT.md)** |
| **Governance** | Active · doctrine frozen |

From this point onward, default operating mode is **[Evidence-Driven Development](../../operator-readiness/EVIDENCE-DRIVEN-DEVELOPMENT.md)** — operator evidence determines priority; engineering asks *what did operators teach us today?*

> **The platform contracts are established. The doctrines are frozen. Build against them.**

---

## Platform (2026-07-05 milestone)

This is not "a CRM." It is a **governed constituent operating platform** with two independently governed subsystems:

| Subsystem | Mission | Trust boundary | Certified doctrine |
| --------- | ------- | -------------- | ------------------ |
| **[UCIE](../../ucie/UCIE-README.md)** — Identity Platform | Produce trusted identities | Identity trust | Stage, don't commit · Provenance, always · Review before merge |
| **Contact Management v3** — Relationship Platform | Produce trusted relationships | Relationship trust | Promote · Reference · Group · Belong · Summarize · Aggregate |

```text
External Sources → UCIE (Stage → Resolve → Review → Commit)
                 → Canonical Contact Identity
                 → Relationship Platform (certified engines)
```

**Future (reserved, not Contact V3-101):** ~~Volunteer Operations Platform (VOP)~~ — **VOP-001 Reference Pattern Certified** · [VOP README](../../vop/VOP-README.md) · peer subsystem; consumes UCIE + Contact v3 without changing either.

---

## Evidence-Driven Development (current)

Primary question: **What did the operators teach us today?**

Four parallel workstreams — **no architectural changes** · **[doctrine preserved](../../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md)** on every change:

| # | Workstream | Focus |
| - | ---------- | ----- |
| 1 | **Operator walkthroughs** | PRL-4 evidence — [OPERATOR-WALKTHROUGH-001](../../operator-readiness/WALKTHROUGH-001-SCENARIO.md) · [exit contract](../../operator-readiness/PRL-4-EXIT-CONTRACT.md) |
| 2 | **Connector hardening** | Google, Apple, Outlook OAuth · CSV/Excel/PDF parsers |
| 3 | **Queue optimization** | Prioritization, SLA, supervisor dashboards — disposition via [OEC register](../../operator-readiness/OPERATIONAL-EVIDENCE-REGISTER.md) |
| 4 | **Identity confidence** | Fuzzy addresses, nicknames, phone normalization |

**Also in scope during PRL-4:** OCR accuracy · performance profiling · accessibility · observability · documentation/onboarding.

Success is determined by **operator evidence, readiness scores, and disciplined iteration** — not redesign.

---

## Review inputs (authoritative order)

1. [Constitution](./CONTACT-V3-CONSTITUTION.md)
2. [ADRs](./CONTACT-V3-DECISION-RECORDS.md)
3. [Architecture v1.0](./CONTACT-V3-ARCHITECTURE.md)
4. [V3-000 Lifecycle](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md)
5. Slice contract
6. [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md)
7. Targeted test results
8. Operator evidence
9. [Doctrine preservation](../../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md) — **Does this change preserve every certified doctrine?**

---

## Review outputs

Every slice receives **two independent determinations**:

### Implementation status

| Verdict | Meaning |
| ------- | ------- |
| ✅ **Approve** | Satisfies frozen contracts |
| 🟡 **Approve with Iteration** | Correct; improvements schedulable without blocking |
| 🔴 **Block** | Violates frozen contract |

### Pattern status

| Verdict | Meaning |
| ------- | ------- |
| **Reference Pattern Certified** | Canonical implementation pattern for remaining v3 |
| **Reference Pattern Pending** | Approved but not yet canonical template |

A slice may be **approved** without being **Reference Pattern Certified**.

---

## Architecture policy

Architecture v1.0 is **immutable** during normal development.

The only path to architectural change:

1. Explicit decision to reopen architecture.
2. New ADR documenting the rationale.
3. Version increment (v1.1 or later).
4. Review and approval before implementation changes.

Normal implementation work **does not modify** governing artifacts ([ADR-006](./CONTACT-V3-DECISION-RECORDS.md#adr-006-foundation-documents-protected-during-implementation)).

---

## Next milestone

**PRL-4 — Internal Operator Validated** via [Exit Contract v1.0](../../operator-readiness/PRL-4-EXIT-CONTRACT.md)

Kelly, Chris, and ≥ 3 internal operators complete walkthroughs with signed evidence. [CPAT v1.0](../../operator-readiness/CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md) must remain passing.

Do **not** reopen architecture for normal work. Extend within certified contracts and frozen doctrine only.

---

*CONTACT-V3 Execution Charter · LocalBrain · 2026*
