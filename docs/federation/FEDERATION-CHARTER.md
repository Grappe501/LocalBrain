# Federation Charter — Local First. Shared by Contract.

> **Status:** 🔒 **Architectural principle · reserved** · Not implemented · 2026-07-05  
> **Gate:** Do not build until PRL-4 operator evidence validates governed campaign services under real use  
> **Mission (reserved):** Connect multiple LocalBrains without merging them into one shared memory

This is **not** user permissions alone. It is a **federated LocalBrain architecture** modeled as a **graph of trusted universes** — not a global permission list.

> **A LocalBrain should never discover another LocalBrain by searching the world. It only knows the LocalBrains reachable through its own trusted universe.**

See [Federation Graph Model](./FEDERATION-GRAPH-MODEL.md) · [Federation Sponsorship Model](./FEDERATION-SPONSORSHIP-MODEL.md) for the full reserved topology.

> **One Person. One LocalBrain. Many Governed Sponsorships.**

---

## The principle

> **Local First. Shared by Contract.**

Each LocalBrain owns its own knowledge.

Sharing happens through **governed contracts** — never through unrestricted memory access.

This preserves:

- Privacy
- Security
- Explainability
- Offline capability
- Future scalability

**Federation doctrines (reserved — not yet certified):**

| Doctrine | Meaning |
| -------- | ------- |
| **One Person. One LocalBrain. Many Governed Sponsorships.** | Identity persists · universes connect via governed sponsorship |
| **Campaign institutions are sovereign.** | No cross-campaign information without explicit federated contract **and** legal permission |
| **Institution = highest sovereign organizational boundary.** | Root concept — see [Institution Root Concept](../institution/INSTITUTION-ROOT-CONCEPT.md) |

See [Federation Sponsorship Model](./FEDERATION-SPONSORSHIP-MODEL.md).

---

## Topology (conceptual)

```text
                     Steve
               LocalBrain (Operator)
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
 Kelly LocalBrain  Chris LocalBrain  Carol LocalBrain
        │             │             │
        └────── Shared Campaign Services ──────┘
              UCIE · Contact · VOP
```

Each person has:

- Their **own LocalBrain**
- Their **own AI context**
- Their **own local memory**
- Their **own documents**
- Their **own workspace**

Those remain **independent**.

They connect through **shared campaign services** — not by exposing each other's LocalBrains.

---

## Personal vs campaign knowledge

| Layer | Owns | Examples |
| ----- | ---- | -------- |
| **Personal LocalBrain** | Individual operator | Calendar · notes · drafts · preferences · private working context |
| **Shared campaign services** | Governed platform contracts | UCIE · Contact Management · VOP |

Kelly's LocalBrain primarily knows Kelly's world. It **consumes** shared campaign data she is authorized to see. It does **not** automatically know Chris's private notes.

Chris's LocalBrain develops independently. His AI learns **Chris** — not Kelly.

---

## Graph model — universes, edges, bridges (reserved)

Federation is a **graph**, not flat permissions:

| Layer | Defines |
| ----- | ------- |
| **Universes** | Trust boundaries — sovereign campaign scopes |
| **Relationship edges** | Possible collaboration — discoverability within universe |
| **Sovereign Workspaces** | Active collaboration — intentional · auditable |
| **Explicit bridges** | Cross-universe federation — never universe merge |
| **Campaign services** | Shared operational data |
| **Personal LocalBrains** | Sovereign — never merged by default |

```text
Kelly Campaign Universe          Chris Campaign Universe
  Kelly ─── Carol                    Chris ─── Volunteer X
    │                                      │
  Volunteer A                            Volunteer Y
         │         governed bridge          │
         └──────────────────────────────────┘
                    (explicit only)
```

**Discoverability** within a universe is automatic. **Workspace membership** is explicit. At scale (hundreds of volunteers), collaborators are reachable without auto-granting collaboration rights to every pair.

Full model: [Federation Graph Model](./FEDERATION-GRAPH-MODEL.md) · [Federation Sponsorship Model](./FEDERATION-SPONSORSHIP-MODEL.md)

---

## Permission models (evolving — graph-first)

Traditional RBAC is insufficient alone. The graph model provides reachability; capability-scoped sync provides authorization:

| Model | Scope |
| ----- | ----- |
| **Role-based** | Campaign role (volunteer coordinator, steward, executive) |
| **Capability-based** | What the platform can do (`CAP-*` alignment) |
| **Trust-based** | What this person is authorized to see at this maturity level |

Carol might gain **volunteer management** without **campaign strategy** without **executive notes**.

That argues for **capability-scoped synchronization** — not blanket access.

---

## AI context boundaries

One LocalBrain must **not** accidentally learn another person's private working context because they share a campaign.

Each AI answers from:

1. **Its own LocalBrain** — personal authorized knowledge
2. **Authorized shared campaign data** — governed service contracts
3. **Public knowledge** — explicitly non-private sources

Never from another operator's private memory by default.

---

## Relationship to trust domains

The federated model extends the trust-boundary philosophy already established:

| Domain | Federation role |
| ------ | --------------- |
| **Identity Trust (UCIE)** | Campaign service — shared by contract |
| **Relationship Trust (Contact)** | Campaign service — shared by contract |
| **Operational Trust (VOP)** | Campaign service — shared by contract |
| **Personal intelligence** | LocalBrain-owned — never merged |

UCIE, Contact, and VOP are **campaign services**, not personal knowledge. Each LocalBrain synchronizes according to authorization.

---

## What this is not

- Not a centralized CRM with shared AI memory
- Not "everyone sees everything in the campaign"
- Not unrestricted sync between LocalBrain instances
- Not built during PRL-4 operator validation

---

## Reserved subsystem

See [FED-001 Reservation](./FED-001-RESERVATION.md) · [Federation Graph Model](./FEDERATION-GRAPH-MODEL.md) · [Federation Sponsorship Model](./FEDERATION-SPONSORSHIP-MODEL.md) — **Federation & Synchronization** (not implemented).

For governed collaboration ledgers, see [Collaboration Charter](../collaboration/COLLABORATION-CHARTER.md) · [WSP-001](../collaboration/WSP-001-RESERVATION.md) — **GitHub-Backed Sovereign Collaboration Workspace** (not implemented).

---

## Related

- [Governed Platform Architecture](../platform/GOVERNED-PLATFORM-ARCHITECTURE.md)
- [Engineering Philosophy v1.0](../platform/ENGINEERING-PHILOSOPHY-V1.md)
- [EPO-001 Reservation](../epo/EPO-001-RESERVATION.md)

---

*Federation Charter · LocalBrain · 2026*
