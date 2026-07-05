# VOP — Architecture Decision Records

> **Subsystem:** Volunteer Operations Platform  
> **Governance:** Same discipline as Contact v3 and UCIE

---

## ADR-VOP-001 — VOP-001 Implementation Approved

| Field | Value |
| ----- | ----- |
| **Status** | Accepted |
| **Date** | 2026-07-05 |
| **Slice** | VOP-001 |

**Context**

PSA-001 identified missing operator surfaces: Volunteer Workspace and Manager Dashboard. Contact Management and UCIE produce work but do not coordinate human execution.

**Decision**

Implement **VOP-001 Volunteer Work Marketplace** as a peer subsystem with dedicated route `/studio/volunteer`, claim/release/complete workflow, county/skill matching, and supervisor dashboard.

**Consequences**

- Third governed platform established (Operational Trust)
- PSA Layer 3 missing surfaces reduced to 0
- UCIE and Contact v3 contracts unchanged

**Review:** [VOP Governance Review](./VOP-GOVERNANCE-REVIEW.md)

---

## ADR-VOP-002 — VOP Reference Pattern Certified

| Field | Value |
| ----- | ----- |
| **Status** | Accepted |
| **Date** | 2026-07-05 |
| **Slice** | VOP-001 |

**Context**

VOP-001 completed operator pass and PSA alignment. Implementation demonstrates reusable patterns for operational work management across the platform.

**Decision**

VOP is **Reference Pattern Certified** as the canonical **Volunteer Operations / Operational Work Management** pattern.

**Certified patterns**

- Marketplace model (volunteers choose work)
- Queue hierarchy: Available · My Queue · Supervisor
- Operational supervisor metrics
- PSA-driven implementation loop

**Certified doctrine (Operational Trust)**

- **Coordinate people, don't just assign tasks.** (mission doctrine — `VOP_DOCTRINE`)
- **Expose, don't obscure.** (implementation doctrine — added to frozen constitution)

**Consequences**

- VOP-002+ slices must conform to VOP-001 patterns unless ADR documents deviation
- Doctrine count increases to eleven (see [Certified Implementation Doctrine](../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md))

---

## ADR-VOP-003 — Operational Work Separate from UCIE Identity Work

| Field | Value |
| ----- | ----- |
| **Status** | Accepted |
| **Date** | 2026-07-05 |

**Decision**

Operational volunteer work lives in `vop_work_items`. UCIE identity resolution work remains in `ucie_work_items`. VOP marketplace may **surface** UCIE open items read-only; identity claims continue through UCIE.

**Rationale**

Preserves identity trust boundary. Prevents operational queue logic from contaminating identity resolution audit trails.

---

*VOP ADRs · LocalBrain · 2026*
