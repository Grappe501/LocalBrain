# Volunteer Operations Platform (VOP) — Roadmap

> **Contract:** `VOP-001` · `CAP-VOP-001`  
> **Status:** **VOP-001 COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
> **Phase:** [Evidence-Driven Development](../operator-readiness/EVIDENCE-DRIVEN-DEVELOPMENT.md) · PRL-3 / PRL-4 gate  
> **Doctrine:** [Certified Implementation Doctrine](../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md) — frozen  
> **Subsystem:** **Volunteer Operations Platform** — peer to UCIE and Contact Management  
> **Foundation:** [Charter](./VOP-CHARTER.md) · [Architecture](./VOP-ARCHITECTURE.md) · [ADRs](./VOP-DECISION-RECORDS.md) · [Governance Review](./VOP-GOVERNANCE-REVIEW.md)  
> **Slice:** [VOP-001 Work Marketplace](./VOP-001-WORK-MARKETPLACE.md)

---

## Architectural question

> **Who can do the work, what work is available, who claimed it, how well is it moving, and where do managers need to intervene?**

Contact Management answers relationship questions. UCIE creates identity work. VOP **routes operational work to people** without owning identity or relationship state.

---

## Three governed platforms

```text
External Sources
        │
        ▼
UCIE — Identity trust
(Stage → Resolve → Review → Commit)
        │
        ▼
Canonical Contact Identity
        │
        ▼
Contact Management v3 — Relationship trust
(Context → Stewardship → Action →
 Household → Organizations → Intelligence)
        │
        ▼
VOP — Operational trust
(Marketplace → Queue → Supervision → Execution)
        │
        ▼
Commercial Beta
```

**Reserved governance layer:** [EPO-001](../epo/EPO-001-RESERVATION.md) — *Is the organization healthy?* (not built; governs the three domains above)

See [Governed Platform Architecture](../platform/GOVERNED-PLATFORM-ARCHITECTURE.md).

| Platform | Responsibility | Certified doctrine |
| -------- | -------------- | ------------------ |
| **UCIE** | Identity trust | Stage, don't commit · Provenance, always · Review before merge |
| **Contact Management v3** | Relationship trust | Promote · Reference · Group · Belong · Summarize · Aggregate |
| **VOP** | Operational trust | Coordinate people, don't just assign tasks · **Expose, don't obscure** |

---

## Peer subsystem boundary

| Subsystem | Owns | Consumes |
| --------- | ---- | -------- |
| **UCIE** | Identity acquisition, staging, resolution, identity work marketplace | External sources |
| **Contact Management v3** | Canonical contact + relationship engines | Trusted identities from UCIE |
| **VOP** | Volunteer profiles, operational work items, claims, supervisor metrics | UCIE open work (read-only surfacing) · Contact-derived operational tasks |

VOP **never writes** to UCIE or Contact canonical tables. Work is created in `vop_*` tables or surfaced read-only from UCIE.

---

## VOP-001 modules (certified)

| Module | Status |
| ------ | ------ |
| Volunteer Profile | ✅ VOP-001 |
| Work Marketplace | ✅ VOP-001 |
| Task Matching (county + skills) | ✅ VOP-001 |
| Supervisor Dashboard | ✅ VOP-001 |
| Quality Flags | ✅ VOP-001 |

## Reserved (post VOP-001)

| Module | Target slice |
| ------ | ------------ |
| Training & Certification gates | VOP-002 |
| Shift & Availability | VOP-002 |
| Volunteer Evidence Ledger | VOP-003 |
| Escalation System | VOP-003 |
| Recognition & Retention | VOP-003 |

---

## Live surface

- Route: `/studio/volunteer`
- Capability: `CAP-VOP-001`
- Engine: `VOP-001`
- Executive question: `EQ-018`

---

## PSA governance loop (established)

```text
PSA-001 → missing Volunteer Workspace / Manager Dashboard
       → VOP-001 implementation
       → PSA-001 regenerated (L3 missing: 0, coherence: 100%)
       → Gap closed
```

Future platform improvements should follow the same evidence chain.

---

*VOP README · LocalBrain · 2026*
