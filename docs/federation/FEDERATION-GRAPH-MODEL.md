# Federation Graph Model — Trusted Universes, Not Permission Lists

> **Status:** 🔒 **Foundational model · reserved** · Not implemented · 2026-07-05  
> **Root concept:** [Institution](../institution/INSTITUTION-ROOT-CONCEPT.md) · operational scopes = **universes within an institution**  
> **Parent:** [Federation Charter](./FEDERATION-CHARTER.md) · [FED-001 Reservation](./FED-001-RESERVATION.md)  
> **Gate:** Do not build until PRL-4 operator evidence validates multi-operator campaign topology

Federation is a **graph**, not a permission list. This document defines the reserved graph model for how LocalBrains discover, connect, and collaborate.

---

## Core insight

> **A LocalBrain should never discover another LocalBrain by searching the world. It only knows the LocalBrains that are reachable through its own trusted universe.**

That preserves isolation and scales without a global directory of every operator on the platform.

**Sponsorship:** Every universe connection is **sponsored** — authorized by a campaign, movement, or organization. One person · one LocalBrain · many governed sponsorships. See [Federation Sponsorship Model](./FEDERATION-SPONSORSHIP-MODEL.md).

---

## Hierarchy of universes

Not one global LocalBrain network. A **hierarchy of sovereign universes**:

```text
Global LocalBrain Network (conceptual — not a searchable directory)
│
├── Kelly Campaign Institution
│     └── Campaign Operations Universe
│           Kelly · Carol · Volunteer A · Volunteer B
│
├── Chris Campaign Institution
│     └── Campaign Operations Universe
│           Chris · Volunteer X · Volunteer Y
│
└── Youth Movement Institution
      └── Youth Universe
```

Each **institution** is sovereign. Kelly Campaign Institution does **not** know Chris Campaign Institution exists — unless there is an **explicit bridge** between institutions.

---

## Graph model

| Element | Types |
| ------- | ----- |
| **Nodes** | LocalBrains · **Institutions** · Universes · Workspaces |
| **Edges** | Personal · Sponsored · Federated · Workspace · Observer |

Connection types (full model): [Federation Sponsorship Model](./FEDERATION-SPONSORSHIP-MODEL.md)

Because it is a graph, questions become straightforward:

- *"Who can Kelly invite to a workspace from this universe?"*
- *"Which universes is Carol connected to?"*
- *"Show all active collaboration bridges."*

---

## Relationship edges — not permissions

When a new LocalBrain joins a universe, do **not** think "adding permissions."

Think **creating relationship edges**:

```text
Kelly  ─────── Carol
   │
Volunteer A
   │
Volunteer B
```

Edges define **potential collaboration** — not automatic visibility into private content.

| Edge type | Connection | Meaning |
| --------- | ---------- | ------- |
| **Personal** | Personal | Sovereign LocalBrain · private |
| **Sponsored** | Sponsored | Universe membership · sponsor-authorized |
| **Federated** | Federated | Cross-universe bridge · legal + explicit |
| **Workspace** | Workspace | Active WSP-001 collaboration |
| **Observer** | Observer | Read-only or limited visibility |

---

## Discoverability vs collaboration

**Do not** automatically create collaboration rights between every pair of users.

| Automatic | Explicit |
| --------- | -------- |
| **Discoverability within the universe** — authorized collaborators exist and are reachable | **Workspace membership** — intentional · auditable · scoped |

At hundreds of volunteers, a volunteer can see that other authorized collaborators exist in the universe — but **actual workspace membership remains intentional**.

---

## Workspace creation (reserved UI)

The UI becomes natural:

1. Operator opens **Connected LocalBrains**
2. They see only LocalBrains connected through their **current universe**
3. They select one person · several people · everyone in that universe
4. They create a **Sovereign Workspace** ([WSP-001](../collaboration/WSP-001-RESERVATION.md))

No searching the global network. No exposure of unrelated organizations.

---

## Explicit bridges between universes

Kelly and Chris do **not** merge universes when they collaborate.

They create a **governed bridge**:

```text
Kelly Campaign Universe
        │
        │  (approved federation)
        │
Chris Campaign Universe
```

Only the bridge exposes **agreed capabilities or workspaces**.

Everything else remains isolated.

Bridge edges are:

- Explicitly approved
- Capability-scoped
- Auditable
- Revocable

---

## Where each layer fits

| Layer | Defines |
| ----- | ------- |
| **Sponsors** | Who authorizes membership in a universe |
| **Universes** | Trust boundaries — campaign · movement · org |
| **Sponsored connections** | Governed edges — one LocalBrain · many universes |
| **Relationship edges** | Discoverability within authorized universe |
| **Sovereign Workspaces** | Active collaboration — WSP-001 |
| **Federated bridges** | Cross-universe — legal + explicit only |
| **Campaign services** | Shared operational data — UCIE · Contact · VOP |
| **Personal LocalBrains** | Sovereign — one identity per person · never duplicated |

```text
Personal LocalBrain (sovereign)
        │
        ▼
Campaign Universe (trust boundary · graph root)
        │
        ├── relationship edges (discoverability)
        │
        ├── Sovereign Workspace (active collaboration · WSP-001)
        │
        ├── explicit bridge (cross-universe · governed)
        │
        ▼
Campaign Services (UCIE · Contact · VOP)
```

---

## Relationship to three ledgers

| Graph scope | Ledger |
| ----------- | ------ |
| Personal LocalBrain node | Personal Ledger |
| Workspace node | Workspace Ledger ([WSP-001](../collaboration/WSP-001-RESERVATION.md)) |
| Organization / universe governance | Institutional Ledger ([ILG-001](../institution/ILG-001-RESERVATION.md)) |

Graph edges control **reachability**. Ledgers control **memory**.

---

## What FED-001 must implement (reserved)

| Area | Graph responsibility |
| ---- | -------------------- |
| Universe registry | Sovereign campaign universe nodes |
| Membership edges | Member of · operator binding |
| Collaboration edges | Can collaborate with · discoverability |
| Bridge edges | Federated to · cross-universe contracts |
| Workspace edges | Invited to workspace · WSP-001 integration |
| Query surface | Connected LocalBrains · bridge inventory · invite eligibility |
| Audit | Edge creation · removal · bridge approval |

Capability-scoped sync remains — but **authorization traverses the graph**, not flat permission tables alone.

---

## What this is not

- Not a global LocalBrain directory searchable by anyone
- Not automatic full-mesh collaboration within a universe
- Not universe merge on cross-campaign collaboration
- Not RBAC tables as the primary federation model
- Not built during PRL-4

---

## PRL-4 evidence signals

| Signal | Graph implication |
| ------ | ----------------- |
| *"I didn't know Carol was on the campaign"* | Discoverability edge |
| *"Why can Volunteer A see executive notes?"* | Over-broad permission — graph + ledger boundary failure |
| *"Kelly and Chris need to coordinate one project"* | Explicit bridge — not universe merge |
| *"We have 200 volunteers"* | Discoverability without auto-workspace membership |

---

## Reservation record

| Date | Action |
| ---- | ------ |
| 2026-07-05 | Federation graph model articulated · trusted universes |
| 2026-07-05 | Sponsorship model linked · connection types · campaign isolation |
| 2026-07-05 | Reserved under FED-001 · PRL-4 freeze honored |

---

## Related

- [Federation Sponsorship Model](./FEDERATION-SPONSORSHIP-MODEL.md)
- [Federation Charter](./FEDERATION-CHARTER.md)
- [FED-001 Reservation](./FED-001-RESERVATION.md)
- [Collaboration Charter](../collaboration/COLLABORATION-CHARTER.md)
- [Digital Institution Charter](../institution/DIGITAL-INSTITUTION-CHARTER.md)
- [Governed Platform Architecture](../platform/GOVERNED-PLATFORM-ARCHITECTURE.md)

---

*Federation Graph Model · LocalBrain · 2026*
