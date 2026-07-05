# Digital Institution Charter

> **Status:** 🔒 **Architectural vision · reserved** · Not implemented · 2026-07-05  
> **Root concept:** [Institution = highest sovereign organizational boundary](./INSTITUTION-ROOT-CONCEPT.md)  
> **Gate:** Do not build until PRL-4 operator evidence validates how organizations actually preserve and retrieve memory  
> **Breakthrough:** You're not building software that remembers. You're building **institutions that remember.**

LocalBrain is an **Institution Operating System**. This charter describes how institutional memory works within that model — not campaign-specific software.

---

## Three different optimizations

| System type | Optimizes for |
| ----------- | ------------- |
| Collaboration tools (Slack, etc.) | **Working today** |
| GitHub | **Software history** |
| LocalBrain | **Organizational memory** |

Those are three different goals. LocalBrain's distinctive ambition is the third.

---

## The three ledgers

Not one memory. **Three ledgers** — each with its own boundary, lifecycle, and AI routing.

| Ledger | Lives in | Scope | Examples |
| ------ | -------- | ----- | -------- |
| **Personal Ledger** | LocalBrain (Level 1) | Private · operator-owned | Notes · thoughts · drafts · debate prep brainstorming |
| **Workspace Ledger** | Sovereign workspace (Level 3) | Shared by invitation · archived forever | County Fair Planning · Northwest Arkansas Tour · project decisions |
| **Institutional Ledger** | Institution (Level 4) | Defines the institution itself | Policies · architectures · constitutions · certified doctrine · major decisions · approved releases · operator evidence |

**Institutional services** (UCIE · Contact · VOP) are governed operational data within an institution — not a ledger. The first certified set serves **campaign institutions**; the model is institution-universal.

---

## Not everything belongs forever

| Content | Belongs in |
| ------- | ---------- |
| Kelly brainstorming debate answers | **Personal Ledger** |
| County Fair Planning | **Workspace Ledger** |
| Engineering Philosophy v1 | **Institutional Ledger** |
| Campaign contact records | **Institutional Services** (within institution) |

The hierarchy prevents both **loss** (nothing important disappears) and **contamination** (nothing important pollutes the wrong brain).

---

## What the Institutional Ledger records

More than history. It is the **organization's memory**:

- Conversations (governed, not personal chat)
- Decisions · evidence · alternatives considered
- Approvals · artifacts · AI outputs (governed)
- Operator evidence · meeting outcomes · handoffs
- Policies · architectures · certified doctrine
- Major releases · readiness gates · disposition records

Eventually searchable — not just keyword search, but **institutional reasoning**:

- *"Show me every decision that led to this architecture."*
- *"When did we first adopt Protect the Evidence?"*
- *"What operator evidence caused this workflow to change?"*

---

## GitHub + LocalBrain — complementary, not competing

**Do not think of GitHub as merely storage.**

| Role | Responsibility |
| ---- | -------------- |
| **GitHub** | **The canonical ledger** — versioning · attribution · review · branching · merge history · audit · immutable commit chain |
| **LocalBrain** | **The living interface** — AI orchestration · live conversations · contextual memory · operational workflows · permissions · synchronization · campaign intelligence |

GitHub gives you what institutions need for **preservation and proof**.

LocalBrain gives you what institutions need for **living operation and intelligence**.

Together they produce a Digital Institution — not a better app, but an organization that can **learn**, **preserve knowledge**, **explain why it decided**, and **continue functioning** as people join, leave, or change roles.

---

## AI routing across ledgers

```text
Debate prep question?           → Personal Ledger (Kelly)
County fair question?             → Workspace Ledger
Platform doctrine question?       → Institutional Ledger
Campaign contacts question?       → Campaign Services (UCIE · Contact · VOP)
Public question?                  → Public knowledge
```

No contamination. Context is **contextual**, not cumulative.

---

## Relationship to trust domains

| Ledger | Aligns with |
| ------ | ----------- |
| Personal Ledger | Level 1 · Personal Intelligence |
| Workspace Ledger | Level 3 · Collaboration Trust · [WSP-001](../collaboration/WSP-001-RESERVATION.md) |
| Institutional Ledger | Level 4 · Governance Trust · [ILG-001](./ILG-001-RESERVATION.md) |
| Campaign Services | Level 2 · Identity · Relationship · Operational Trust |

---

## Reserved subsystems

| Slice | Scope |
| ----- | ----- |
| [WSP-001](../collaboration/WSP-001-RESERVATION.md) | Workspace Ledger · GitHub-backed sovereign collaboration |
| [ILG-001](./ILG-001-RESERVATION.md) | Institutional Ledger · organization memory · canonical GitHub backbone |
| [EPO-001](../epo/EPO-001-RESERVATION.md) | Governance · health of the institution |

WSP-001 and ILG-001 share the GitHub-as-canonical-ledger pattern at different scopes. EPO eventually **governs** the institutional ledger.

---

## What this is not

- Not a centralized wiki with shared AI memory
- Not "everything in one searchable index"
- Not built during PRL-4 operator validation
- Not software that remembers — **an organization that remembers**

---

## PRL-4 evidence signals

| Signal | Implication |
| ------ | ----------- |
| *"Why did we decide that?"* | Institutional reasoning search |
| *"Where is the operator evidence?"* | Institutional Ledger scope |
| *"That was just my brainstorming"* | Personal vs workspace boundary |
| *"We need the full project record"* | Workspace Ledger |
| *"What is our doctrine?"* | Institutional Ledger |

---

## Related

- [**Institution Root Concept**](./INSTITUTION-ROOT-CONCEPT.md) — highest sovereign organizational boundary
- [ILG-001 Reservation](./ILG-001-RESERVATION.md)
- [Governed Platform Architecture](../platform/GOVERNED-PLATFORM-ARCHITECTURE.md)
- [Engineering Philosophy v1.0](../platform/ENGINEERING-PHILOSOPHY-V1.md) — early institutional memory (doctrine, evidence)
- [Certified Implementation Doctrine](../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md)
- [Evidence-Driven Development](../operator-readiness/EVIDENCE-DRIVEN-DEVELOPMENT.md)

---

*Digital Institution Charter · LocalBrain · 2026*
