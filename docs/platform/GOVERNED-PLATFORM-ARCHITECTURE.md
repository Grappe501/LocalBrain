# Governed Platform Architecture

> **Status:** Three trust domains **certified** · Two domains **reserved** · 2026-07-05  
> **Root concept:** [Institution = highest sovereign organizational boundary](../institution/INSTITUTION-ROOT-CONCEPT.md)  
> **Capstone:** [First Principles Stack](./FIRST-PRINCIPLES-STACK.md) · *Sovereignty before synchronization.*  
> **Prime Directive:** [Protect the evidence.](../operator-readiness/PRIME-DIRECTIVE.md)

LocalBrain is an **Institution Operating System** — not campaign software. Campaigns are the **first institution type** being built. Trust domains, services, and ledgers are **institutional primitives** that specialize per institution type.

This document describes what exists from a **systems** perspective — not a feature list.

---

## What was built

LocalBrain is not three products bolted together. It is **three governed trust systems** — institutional primitives with explicit contracts, certified patterns, and operational readiness gates. The first certified instance serves **campaign institutions**; the model is institution-universal.

```text
Person → LocalBrain → Sponsorship → Institution → Universe → Workspace
                                      │
                    UCIE · Contact · VOP · Ledgers · Governance
```

See [Institution Root Concept](../institution/INSTITUTION-ROOT-CONCEPT.md).

---

## Three trust domains (operational today)

| Trust Domain | Question | Platform | Doctrine |
| ------------ | -------- | -------- | -------- |
| **Identity Trust** | *Who is this?* | [UCIE](../ucie/UCIE-README.md) | Stage, don't commit · Provenance, always · Review before merge |
| **Relationship Trust** | *How do we know them?* | [Contact Management v3](../contact-management/slices/CONTACT-V3-README.md) | Promote · Reference · Group · Belong · Summarize · Aggregate |
| **Operational Trust** | *Who is doing the work?* | [VOP](../vop/VOP-README.md) | Coordinate people, don't just assign tasks · Expose, don't obscure |

These three questions cover almost every core workflow in a **campaign institution** — and generalize to any institution type.

```text
External Sources
        │
        ▼
Identity Trust (UCIE)
        │
        ▼
Canonical Contact Identity
        │
        ▼
Relationship Trust (Contact v3)
        │
        ▼
Operational Trust (VOP)
        │
        ▼
Commercial Beta → Production
```

Each domain:

- Owns its trust boundary
- Consumes upstream domains without modifying their contracts
- Certifies through reference-pattern vertical slices
- Improves through operator evidence (EDD), not architecture churn

---

## Fourth domain — reserved (not built)

| Trust Domain | Question | Platform | Status |
| ------------ | -------- | -------- | ------ |
| **Governance Trust** | *Is the organization healthy?* | [Executive Program Office (EPO)](../epo/EPO-001-RESERVATION.md) | **EPO-001 reserved** |

EPO does **not** replace UCIE, Contact, or VOP. It **governs** them.

```text
Executive Program Office (EPO)     ← Governance Trust · RESERVED
        │
        ├─► Identity Trust (UCIE)
        ├─► Relationship Trust (Contact v3)
        └─► Operational Trust (VOP)
```

**Mission (reserved):**

> Govern the governed platforms.

See [EPO Charter](../epo/EPO-CHARTER.md) · [EPO-001 Reservation](../epo/EPO-001-RESERVATION.md)

---

## Fifth domain — reserved (not built)

| Trust Domain | Question | Platform | Status |
| ------------ | -------- | -------- | ------ |
| **Collaboration Trust** | *Who is allowed to think together?* | [GitHub-Backed Sovereign Workspace (WSP)](../collaboration/WSP-001-RESERVATION.md) | **WSP-001 reserved** |

This is **not** identity, relationships, operations, or governance.

It governs **governed collaboration ledgers** — live workspace + immutable GitHub-backed history — that **preserve every step** without **teaching personal brains by default**.

**Doctrine (reserved):**

> Preserve the work. Protect the boundary.

See [Collaboration Charter](../collaboration/COLLABORATION-CHARTER.md) · [WSP-001 Reservation](../collaboration/WSP-001-RESERVATION.md)

---

## Four levels of intelligence (reserved model)

| Level | Intelligence | Trust |
| ----- | ------------ | ----- |
| 1 | Personal LocalBrain | Private · learns the operator |
| 2 | Shared campaign services | UCIE · Contact · VOP |
| 3 | Sovereign workspace | Governed collaboration ledger · WSP-001 · GitHub-backed |
| 4 | Organization | Executive · EPO-001 |

AI answers route by level: personal ledger → campaign services → workspace ledger → institutional ledger → public. Never a single merged memory.

See [Digital Institution Charter](../institution/DIGITAL-INSTITUTION-CHARTER.md) · [ILG-001 Reservation](../institution/ILG-001-RESERVATION.md).

---

## Federated LocalBrain architecture (reserved)

This is **not** user permissions alone. It is a **graph of trusted universes** — not a searchable global network:

> A LocalBrain never discovers another LocalBrain by searching the world. It only knows LocalBrains reachable through its own trusted universe.

> **One Person. One LocalBrain. Many Governed Sponsorships.**

- Each person has **one sovereign LocalBrain identity** — lifetime · never duplicated
- **Sponsored connections** attach that identity to universes (campaign · movement · org) — each governed independently
- **Campaign universes are sovereign** — no cross-campaign information without explicit federated contract **and** legal permission
- **Explicit bridges** connect universes — never merge them

```text
Kelly Campaign Universe · Chris Campaign Universe · …
        │
        │  graph: edges · bridges (FED-001 — reserved)
        ▼
Kelly LocalBrain · Chris LocalBrain · Carol LocalBrain
        │
        │  capability-scoped sync
        ▼
Shared Campaign Services (UCIE · Contact · VOP)
```

Discoverability within a universe is automatic. Workspace membership is explicit. Campaign isolation is an **architectural guarantee** — not a permission toggle.

See [Federation Graph Model](../federation/FEDERATION-GRAPH-MODEL.md) · [Federation Sponsorship Model](../federation/FEDERATION-SPONSORSHIP-MODEL.md) · [Federation Charter](../federation/FEDERATION-CHARTER.md) · [FED-001 Reservation](../federation/FED-001-RESERVATION.md) — **not built during PRL-4**.

---

## Engineering foundation (2026-07-05)

| Property | Status |
| -------- | ------ |
| Stable architectural contracts | ✅ |
| Certified implementation patterns | ✅ (Contact v3 · UCIE · VOP-001) |
| Acceptance tests tied to mission | ✅ CPAT v1.0 |
| Evidence-driven improvement | ✅ EDD declared |
| Governed subsystems | ✅ Three operational |
| Explicit trust boundaries | ✅ |
| Operational readiness gates | ✅ PRL-3 · PRL-4 current |
| Platform doctrines | ✅ Eleven frozen |
| Platform self-audit | ✅ PSA-001 |
| Cross-platform governance layer | 🔒 **EPO-001 reserved** |
| Federated LocalBrain architecture | 🔒 **FED-001 reserved** · Graph · Sponsorship · Campaign isolation guarantee |
| Sovereign collaboration workspace | 🔒 **WSP-001 reserved** · Workspace Ledger · Preserve the work. Protect the boundary. |
| Institutional ledger | 🔒 **ILG-001 reserved** · Organization memory · GitHub canonical ledger |

---

## Strategic posture

The next competitive advantage is **not** another feature in a trust domain.

It is **preserving this governance discipline** as the platform grows — maintaining coherence while adding capabilities.

Bounded work continues within stable boundaries: connector hardening, OCR, identity confidence, VOP-002 training gates, performance, usability. Operator evidence drives refinement; architecture v1.0 remains frozen.

---

*Governed Platform Architecture · LocalBrain · 2026*
