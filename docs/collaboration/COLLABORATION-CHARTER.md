# Collaboration Charter — Preserve the Work. Protect the Boundary.

> **Status:** 🔒 **Architectural principle · reserved** · Not implemented · 2026-07-05  
> **Gate:** Do not build until PRL-4 operator evidence reveals how people naturally collaborate  
> **Mission (reserved):** Governed collaboration inside a firewalled project brain — every step preserved, nothing leaked by default

This is **not** a collaboration room. It is a **Workspace Ledger** within a **Digital Institution** — one of three ledgers that preserve organizational memory without bureaucracy.

> **Preserve the work. Protect the boundary.**

See [Digital Institution Charter](../institution/DIGITAL-INSTITUTION-CHARTER.md) for the full three-ledger model.

| Pillar | Meaning |
| ------ | ------- |
| **Preserve the work** | Immutable history of every artifact, decision, word, and handoff |
| **Protect the boundary** | Workspace memory stays inside; personal brains learn nothing by default |

> A workspace may remember everything inside itself, but it may not teach every member's personal brain by default.

---

## The insight

Any operator in the LocalBrain network can convene a private workspace with individuals or groups.

That workspace is not Slack. It is a **temporary project brain**:

- Campaign Debate Team
- Ballot Initiative 2028
- County Fair Planning
- Volunteer Leadership Council
- Northwest Arkansas Tour

Each becomes **its own AI context** — invited, scoped, archivable — without merging into anyone's personal assistant.

---

## Four levels of intelligence

| Level | Name | Question | Examples |
| ----- | ---- | -------- | -------- |
| **1** | **Personal Intelligence** | *What does Kelly know privately?* | Calendar · notes · drafts · preferences · private working context |
| **2** | **Shared Services** | *What does the campaign govern?* | UCIE · Contact · VOP — campaign data by contract |
| **3** | **Sovereign Workspace** | *Who is allowed to think together?* | Invited project brains · temporary · own memory · archivable |
| **4** | **Organization** | *Is the whole campaign healthy?* | Executive level · eventually EPO-001 |

```text
Level 4 — Organization (EPO — reserved)
        │
Level 3 — Sovereign Workspace (WSP-001 — reserved)
        │     temporary project brains · invitation-scoped
        │
Level 2 — Shared Campaign Services (UCIE · Contact · VOP)
        │
Level 1 — Personal LocalBrain (Kelly · Chris · Carol · Steve)
```

Levels 1 and 3 both feel "private" — but they differ fundamentally:

- **Level 1** is permanent personal sovereignty — never shared by default.
- **Level 3** is **temporary collective sovereignty** — shared only inside the workspace boundary, archived when closed, never auto-merged.

---

## Workspace Ledger — two layers

Each sovereign workspace maintains:

| Layer | Purpose |
| ----- | ------- |
| **Live workspace** | Real-time collaboration · documents · chat · tasks · decisions · AI assistance |
| **Workspace Ledger** | Canonical project memory — conversations · decisions · evidence · alternatives · approvals · artifacts · handoffs · authorship · timestamp |

When the workspace **closes**, the live layer stops. The Workspace Ledger **remains** — archived and auditable — but does **not** merge into personal LocalBrains.

---

## Three ledgers

| Ledger | Scope | Example |
| ------ | ----- | ------- |
| **Personal Ledger** | LocalBrain · private | Kelly brainstorming debate answers |
| **Workspace Ledger** | WSP-001 · invited | County Fair Planning |
| **Institutional Ledger** | ILG-001 · organization | Engineering Philosophy v1 · certified doctrine |

Campaign services (UCIE · Contact · VOP) are governed operational data — not a ledger.

---

## GitHub as canonical ledger (reserved)

Each workspace is modeled as a **private GitHub-backed project**:

```text
Workspace
  ├── /docs
  ├── /decisions
  ├── /tasks
  ├── /evidence
  ├── /chat-transcripts
  ├── /artifacts
  ├── /handoffs
  └── /archive
```

GitHub (reserved backbone) is the **canonical ledger**. LocalBrain is the **living interface**. They complement each other — GitHub preserves; LocalBrain operates and orchestrates AI.

## Workspace creation (reserved UI)

Operators create workspaces from **Connected LocalBrains** — scoped to their current campaign universe only:

1. See LocalBrains reachable through relationship edges in this universe
2. Select one · several · or all authorized collaborators
3. Create a Sovereign Workspace

No global network search. No exposure of unrelated organizations. Sponsorship-scoped discoverability: [FEDERATION-SPONSORSHIP-MODEL](../federation/FEDERATION-SPONSORSHIP-MODEL.md) · [FEDERATION-GRAPH-MODEL](../federation/FEDERATION-GRAPH-MODEL.md).

---

## Example — Northwest Arkansas Tour

Kelly creates **"Northwest Arkansas Tour"** and invites Chris, Carol, and a campaign volunteer.

**Inside the workspace**, the AI learns:

- Venues · hotels · travel · contacts · media · county strategy

**Outside the workspace**, none of that pollutes Kelly's personal assistant — unless Kelly explicitly chooses to export.

---

## AI answer hierarchy

The assistant routes context by question type:

```text
Debate prep question?           → Personal Ledger (Kelly)
County fair question?             → Workspace Ledger
Platform doctrine question?       → Institutional Ledger
Campaign contacts question?       → Campaign Services
Public question?                  → Public knowledge
```

This is cleaner than a single massive RAG index. Context is **contextual**, not cumulative.

---

## Security model

Instead of permissions on every document, **the workspace is the trust boundary**:

| Action | Effect |
| ------ | ------ |
| **Invite** | Grant think-together membership |
| **Remove** | Revoke membership · preserve audit |
| **Archive** | Close workspace · retain history · stop active sync |

Invite. Remove. Archive. Done.

---

## Collaboration Trust — a distinct domain

| Trust Domain | Question | Status |
| ------------ | -------- | ------ |
| Identity Trust | *Who is this?* | ✅ UCIE |
| Relationship Trust | *How do we know them?* | ✅ Contact v3 |
| Operational Trust | *Who is doing the work?* | ✅ VOP |
| Governance Trust | *Is the organization healthy?* | 🔒 EPO-001 reserved |
| **Collaboration Trust** | ***Who is allowed to think together?*** | 🔒 **WSP-001 reserved** |

Collaboration Trust is **not** identity, relationships, operations, or governance.

It governs **temporary collective intelligence** — a different problem from *who owns the data*.

---

## Explicit export — non-negotiable

Workspace memory must **not** automatically flow back into personal LocalBrains.

On close or on demand, each operator chooses explicitly:

- ✓ Save this note to **my LocalBrain**
- ✓ Save this decision to **campaign services**
- ✓ Leave it **only in the workspace archive**

That preserves sovereignty at every level.

---

## Relationship to federation (FED-001)

| Layer | Responsibility |
| ----- | -------------- |
| **FED-001** | Connect personal LocalBrains to shared campaign services by contract |
| **WSP-001** | Convene temporary sovereign workspaces between network members |

Federation answers *how brains sync with campaign data*.

Sovereign workspaces answer *how people think together without merging brains*.

Both preserve **Local First. Shared by Contract.** — workspaces add **Preserve the work. Protect the boundary.**

---

## What this is not

- Not a Slack channel (communication without immutable ledger)
- Not a shared folder (files without bounded AI context or audit history)
- Not automatic memory merge on workspace close
- Not built during PRL-4 operator validation
- Not the existing LivingWorkspace model (personal project container within one LocalBrain)

---

## Reserved subsystem

See [WSP-001 Reservation](./WSP-001-RESERVATION.md) — **GitHub-Backed Sovereign Collaboration Workspace** (not implemented).

---

## PRL-4 evidence signals

Watch for operator observations like:

- *"We needed a private planning space that didn't become campaign-wide"*
- *"The AI remembered something from a meeting it shouldn't have"*
- *"We spun up a team for one event — then it was over"*
- *"I wanted to keep tour planning separate from my daily assistant"*

Those inform WSP-001 design — not assumptions.

---

## Related

- [Digital Institution Charter](../institution/DIGITAL-INSTITUTION-CHARTER.md) · [ILG-001](../institution/ILG-001-RESERVATION.md)
- [Federation Charter](../federation/FEDERATION-CHARTER.md) · [FED-001](../federation/FED-001-RESERVATION.md)
- [Governed Platform Architecture](../platform/GOVERNED-PLATFORM-ARCHITECTURE.md)
- [Living Workspace Model](../LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) — personal Level 1 container (distinct)
- [Team Workspace Model](../LOCALBRAIN_TEAM_WORKSPACE_MODEL.md) — superseded direction for WSP-001 reservation

---

*Collaboration Charter · LocalBrain · 2026*
