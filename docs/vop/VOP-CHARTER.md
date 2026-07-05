# Volunteer Operations Platform (VOP)

> **Coordinate people, don't just assign tasks.**  
> **Status:** VOP-001 **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
> **Governance:** [VOP Governance Review](./VOP-GOVERNANCE-REVIEW.md) · [ADRs](./VOP-DECISION-RECORDS.md)

## Mission

Turn trusted contacts into coordinated human action.

| Platform | Answers |
| --- | --- |
| **Contact Management** | Who are they, what is the relationship, and what should happen next? |
| **Volunteer Operations** | Who can do the work, what work is available, who claimed it, how well is it moving, and where do managers need to intervene? |

## Position in the stack

```text
UCIE (Identity Acquisition) ──┐
Contact Management v3 ────────┼──► VOP ──► Commercial Beta
                              │
Operational work routing      │
```

VOP consumes UCIE and Contact v3 **without modifying either**.

## Core modules (roadmap)

| Module | Slice |
| --- | --- |
| Volunteer Profile | VOP-001 ✅ |
| Work Marketplace | VOP-001 ✅ |
| Task Matching | VOP-001 ✅ (county + skills) |
| Supervisor Dashboard | VOP-001 ✅ |
| Quality Review | VOP-001 ✅ (flags) |
| Training & Certification | VOP-002 |
| Shift & Availability | VOP-002 |
| Recognition & Retention | VOP-003 |
| Escalation System | VOP-003 |
| Volunteer Evidence Ledger | VOP-003 |

## Live surface

- Route: `/studio/volunteer`
- Capability: `CAP-VOP-001`
- Engine: `VOP-001`
- API prefix: `/api/vop/*`
