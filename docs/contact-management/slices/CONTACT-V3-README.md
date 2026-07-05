# Contact Management v3 — Roadmap

> **Parent:** [ENG-CONTACT-001 Charter](../ENG-CONTACT-001-CHARTER.md) · V1 module complete  
> **Execution charter:** [Planning → Implementation handoff](./CONTACT-V3-EXECUTION-CHARTER.md) **ACTIVE**  
> **Foundation (frozen):** [Constitution](./CONTACT-V3-CONSTITUTION.md) · [ADR](./CONTACT-V3-DECISION-RECORDS.md) · [Architecture v1.0](./CONTACT-V3-ARCHITECTURE.md) · [V3-000](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md)  
> **Implementation:** [Guide](./CONTACT-V3-IMPLEMENTATION-GUIDE.md) · [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md) · [Technical review](./CONTACT-V3-TECHNICAL-REVIEW.md)  

---

## Platform milestone (2026-07-05)

This is not "a CRM." LocalBrain now operates as a **governed constituent operating platform** with three independently governed subsystems:

| Subsystem | Mission |
| --------- | ------- |
| **[UCIE — Identity Platform](../../ucie/UCIE-README.md)** | Produce trusted identities |
| **Contact Management v3 — Relationship Platform** | Produce trusted relationships |
| **[VOP — Volunteer Operations](../../vop/VOP-README.md)** | Coordinate trusted people |

**Current phase:** [Operator Readiness](./CONTACT-V3-EXECUTION-CHARTER.md#operator-readiness-phase-current) — walkthroughs, connector hardening, queue optimization, identity confidence. Bounded VOP improvements (VOP-002+) follow certified VOP-001 patterns.

**VOP-001:** 🏆 Reference Pattern Certified · [Governance Review](../../vop/VOP-GOVERNANCE-REVIEW.md)

---

## Planning — complete · Operator Readiness — active

See **[Execution Charter](./CONTACT-V3-EXECUTION-CHARTER.md)** for formal handoff.

| | |
| - | - |
| **Planning** | Complete |
| **Architecture v1.0** | Frozen |
| **Governance** | Active |
| **Implementation** | Authorized |

Planning effort formally complete · 2026-07-05. Next artifact is **code** — not documentation.

**Next target:** Dual platform complete — [UCIE Identity Acquisition](../../ucie/UCIE-README.md) 🏆 Certified · Contact Management v3 Intelligence Engine 🏆 Certified.

The reference implementation phase established governance, architecture, and implementation discipline across all seven engines under Architecture v1.0.

---

**Contact Management v3 is a governed implementation project** — not an architectural exploration.

### Canonical state

| Area | Status |
| ---- | ------ |
| Architecture | **v1.0 Frozen** |
| Constitution | Governing doctrine |
| ADRs | Canonical decision history |
| Architecture doc | Seven-engine model |
| Lifecycle (V3-000) | Canonical relationship vocabulary |
| Slice contracts | Frozen before implementation |
| [Technical review](./CONTACT-V3-TECHNICAL-REVIEW.md) | Governing review process |
| [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md) | Governing completion criteria |

| | |
| - | - |
| **Current phase** | **Implementation Phase 1 — Reference Implementations** · **Intelligence Engine complete** |
| **Next engineering target** | Downstream modules on certified core (operator evidence · V3-015 test isolation · future ingestion) |

Frozen artifacts constrain implementation. Architecture v1.0 is not reopened unless explicitly requested + ADR + version increment (e.g. v1.1) per [ADR-006](./CONTACT-V3-DECISION-RECORDS.md#adr-006-foundation-documents-protected-during-implementation).

**Next milestone:** Operator evidence for certified slices · parallel V3-015 test isolation as needed.

### Certified implementation doctrine

1. **Promote, don't duplicate** — V3-016
2. **Reference, don't replicate** — V3-017
3. **Group, don't duplicate** — V3-018
4. **Belong, don't flatten** — V3-019
5. **Summarize, don't speculate** — V3-020
6. **Aggregate, don't centralize** — V3-021

These principles are internally consistent and reinforce the relationship-centric architecture frozen under v1.0.

### Future conversation categories

1. **Implementation review** (default) — does code satisfy frozen contracts?
2. **Operator evidence review** — what did users demonstrate; iterative improvements?
3. **Infrastructure review** — build, tests, performance, security, deployment
4. **Architecture review** *(exception only)* — explicit request · ADR · version increment

---
## Implementation cadence

```
Contract → Implement → Targeted Tests → Operator Validation → Evidence → Small Improvement → Repeat
```

See [CONTACT-V3-IMPLEMENTATION-GUIDE.md](./CONTACT-V3-IMPLEMENTATION-GUIDE.md).

---

## Foundation layer (frozen)

| Document | Role |
| -------- | ---- |
| [CONSTITUTION](./CONTACT-V3-CONSTITUTION.md) | What must always be true |
| [DECISION-RECORDS](./CONTACT-V3-DECISION-RECORDS.md) | Why decisions were made (ADR-001–006) |
| [ARCHITECTURE](./CONTACT-V3-ARCHITECTURE.md) | Seven engines, formula |
| [V3-000](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md) | Lifecycle vocabulary |

**Governance:** No implementation modifies Constitution, Architecture, or V3-000 without explicit architecture review ([ADR-006](./CONTACT-V3-DECISION-RECORDS.md#adr-006-foundation-documents-protected-during-implementation)).

---

## Implementation status

| Slice | Status | Notes |
| ----- | ------ | ----- |
| [V3-014](./CONTACT-V3-014-RELATIONSHIP-TIMELINE.md) | ✅ Complete | Timeline Engine |
| [V3-016.1](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md) | 🏆 Certified | Context Engine |
| [V3-016](./CONTACT-V3-016-RELATIONSHIP-STEWARDSHIP.md) | 🏆 Certified | Stewardship Engine |
| [V3-017](./CONTACT-V3-017-SMART-TASKS-FOLLOW-UP-QUEUE.md) | 🏆 Certified | Action Engine |
| [V3-018](./CONTACT-V3-018-HOUSEHOLD-FAMILY-RELATIONSHIPS.md) | 🏆 Certified | Household Engine |
| [V3-019](./CONTACT-V3-019-ORGANIZATION-AFFILIATION-MAPPING.md) | 🏆 Certified | Organization Engine |
| [V3-020](./CONTACT-V3-020-AI-CONTACT-BRIEFS.md) | 🏆 Certified | Intelligence · Contact Briefs |
| [V3-021](./CONTACT-V3-021-RELATIONSHIP-ANALYTICS-DASHBOARD.md) | 🏆 Certified | Intelligence · Analytics |
| [V3-015](./CONTACT-V3-015-TEST-RUNNER-ISOLATION.md) | 🟡 Parallel | Test infrastructure debt |

**Intelligence Engine (V3-020 + V3-021):** ✅ Complete under Architecture v1.0 · 2026-07-05

**Peer subsystem:** [UCIE — Identity Acquisition Platform](../../ucie/UCIE-README.md) · CONTACT-V3-100 · 🏆 Certified 2026-07-05

---

## Slice complete

Every slice: [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md) + four gates (Constitution · Architecture · Lifecycle · Evidence).

---

*Contact Management v3 · Implementation phase · LocalBrain · 2026*
