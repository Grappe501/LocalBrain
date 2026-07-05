# WSP-001 — GitHub-Backed Sovereign Collaboration Workspace (Reservation)

> **Slice:** `WSP-001`  
> **Status:** 🔒 **RESERVED** · Do not implement during PRL-4  
> **Doctrine:** **Preserve the work. Protect the boundary.**  
> **Charter:** [Collaboration Charter](./COLLABORATION-CHARTER.md)  
> **Trust domain:** **Collaboration Trust** — *Who is allowed to think together?*

---

## Mission (reserved)

> Let authorized people work together in real time inside a firewalled project brain where every artifact, decision, word, and step is preserved, versioned, attributable, and auditable.

This is **not** a collaboration room. It is a **governed collaboration ledger** — full preservation inside the boundary, zero pollution outside it.

---

## Doctrine

> **Preserve the work. Protect the boundary.**

| Pillar | Meaning |
| ------ | ------- |
| **Preserve the work** | Every word, edit, decision, artifact, handoff, and step — authorship and timestamp — permanently retained |
| **Protect the boundary** | Workspace memory stays inside the workspace; personal LocalBrains learn nothing by default |

**Key principle:**

> A workspace may remember everything inside itself, but it may not teach every member's personal brain by default.

Full preservation **without** context pollution.

---

## Two permanent layers

Each sovereign workspace has two layers:

| Layer | Purpose |
| ----- | ------- |
| **Live workspace** | Real-time collaboration · documents · chat · tasks · decisions · AI assistance |
| **Workspace Ledger** | Canonical project memory — conversations · decisions · evidence · alternatives · approvals · artifacts · AI outputs · handoffs · authorship · timestamp |

The **Workspace Ledger** is one of **three ledgers** in the Digital Institution model. See [Digital Institution Charter](../institution/DIGITAL-INSTITUTION-CHARTER.md).

When the workspace **closes**, the live layer stops. The Workspace Ledger **remains** — archived, queryable, attributable — but does **not** merge into personal LocalBrains unless explicitly exported.

### Institution ownership (non-negotiable)

Every workspace has an **owning institution**. A workspace owned by Kelly Campaign Institution:

- Survives personnel changes
- Workspace Ledger remains with the institution
- Former members lose **access** when sponsorship ends — authorship attribution **preserved**
- Ensures institutional continuity

See [Federation Sponsorship Model](../federation/FEDERATION-SPONSORSHIP-MODEL.md) · access vs authorship.

---

## GitHub as canonical ledger (reserved)

**Do not think of GitHub as merely storage.**

| Role | Responsibility |
| ---- | -------------- |
| **GitHub** | **Canonical ledger** for this workspace — versioning · attribution · review · audit · immutable commit chain |
| **LocalBrain** | **Living interface** — AI orchestration · live conversations · contextual memory · workflows · permissions |

GitHub already understands:

| Capability | WSP-001 use |
| ---------- | ----------- |
| Version history | Immutable audit of every change |
| Branches | Parallel workstreams within a workspace |
| Commits | Attributed steps with timestamps |
| Pull requests | Reviewed handoffs and merge decisions |
| Diffs | What changed, when, by whom |
| Authorship | Who wrote what |
| Issues | Tasks and tracked work |
| Project boards | Workspace task flow |
| Permissions | Invite · remove · archive |
| Audit trails | Compliance and explainability |

Each workspace is modeled as a **private GitHub-backed project** — not a generic file share.

---

## Workspace repository layout (reserved)

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

| Path | Contents |
| ---- | -------- |
| `/docs` | Working documents · drafts · plans |
| `/decisions` | Recorded decisions · rationale · dissent |
| `/tasks` | Action items · assignments · status |
| `/evidence` | Operator observations · supporting material |
| `/chat-transcripts` | Conversation history · AI-assisted threads |
| `/artifacts` | Generated outputs · exports · deliverables |
| `/handoffs` | PR-style reviews · transitions between members |
| `/archive` | Closed-workspace snapshot · read-only retention |

LocalBrain orchestrates the live experience; GitHub holds the **Workspace Ledger**.

---

## Three ledgers (context)

| Ledger | WSP-001 role |
| ------ | ------------ |
| Personal Ledger | Never auto-populated from workspace |
| **Workspace Ledger** | **WSP-001 scope** |
| Institutional Ledger | Explicit promotion only · see [ILG-001](../institution/ILG-001-RESERVATION.md) |

See [Digital Institution Charter](../institution/DIGITAL-INSTITUTION-CHARTER.md).

---

## AI context contract (non-negotiable)

The AI assists **inside** the workspace only. Its memory is scoped to **that repo/workspace**.

| Allowed | Forbidden |
| ------- | --------- |
| Learn venues, travel, strategy **inside** "Northwest Arkansas Tour" | Flow context into Kelly's personal LocalBrain |
| Answer workspace-scoped questions from workspace history | Auto-merge workspace memory on close |
| Reference authorized campaign services when explicitly invoked | Teach Chris's assistant what Kelly said privately in another workspace |

Nothing flows into Kelly's, Chris's, Carol's, or Steve's personal LocalBrain unless **explicitly exported**.

---

## Explicit export model

On workspace close or per artifact, each operator chooses:

| Operator choice | Destination |
| --------------- | ----------- |
| Save to my LocalBrain | Level 1 — personal, operator-initiated |
| Save to campaign services | Level 2 — governed promotion |
| Leave in workspace archive | Immutable history only — default for most artifacts |

**No silent promotion.**

---

## Architecture placement

```text
Level 1 — Personal LocalBrain (Kelly · Chris · Carol · Steve)
        │
        │  explicit export only (never auto-merge)
        ▼
Level 3 — WSP-001 Sovereign Collaboration Workspace     ← RESERVED
        │     live layer + immutable GitHub-backed history
        │
        ▼
Level 2 — Shared Campaign Services (UCIE · Contact · VOP)
        │     via FED-001 sync contracts
        ▼
Level 4 — Organization / EPO (reserved)
```

---

## Responsibilities (when implemented)

| Area | Scope |
| ---- | ----- |
| Workspace lifecycle | Create · invite · active · archive · close |
| Live layer | Real-time collaboration surfaces |
| Immutable history | GitHub-backed ledger · full audit |
| Repository scaffold | Standard `/docs` … `/archive` layout |
| Membership | Invite · remove · permission-scoped access |
| Workspace AI memory | Scoped to workspace repo only |
| Explicit export | Personal · campaign · archive-only |
| Handoffs | PR-style reviewed transitions |
| Offline operation | Local-first live state · sync on reconnect |
| Federation integration | Network member discovery via FED-001 |

---

## Distinction from existing workspace concepts

| Concept | Scope | Relationship to WSP-001 |
| ------- | ----- | ----------------------- |
| **LivingWorkspace** (LB-OS-004) | Personal project container | Level 1 — not collaborative |
| **Executive Workspace** (LB-OS-021) | Organization-level executive surface | Level 4 precursor |
| **Team Workspace Model** (LB-OS-112) | Permission-based shared folders | Superseded by this reservation |
| **Slack / chat channel** | Communication without immutable ledger | Not sovereign collaboration |
| **VOP workspace_id** | Operational scoping for volunteer work | Level 2 service parameter |

WSP-001 is a **new trust domain** with a **governed ledger**, not LB-OS-112 permissions.

---

## Dependencies (before build)

| Dependency | Status |
| ---------- | ------ |
| UCIE Reference Pattern | ✅ |
| Contact v3 Reference Pattern | ✅ |
| VOP-001 Reference Pattern | ✅ |
| FED-001 reservation understood | 🔒 Architecture only |
| GitHub (or equivalent) integration design | 🔒 Reserved backbone |
| PRL-4 operator validation | ⏳ Current gate |
| Multi-operator collaboration evidence | 🔒 Future gate |

**Gate:** Do not start WSP-001 until operator evidence demonstrates natural collaboration patterns and identifies preservation vs. pollution failures — not speculative ledger design.

---

## PRL-4 evidence checklist (observe, do not build)

| Signal | Implication |
| ------ | ----------- |
| Operators need full history of who decided what | Immutable history layer |
| Post-project audit required | GitHub-backed ledger |
| AI recalls cross-project context incorrectly | Boundary failure |
| Event planning then archive | Live → immutable transition |
| "I want a record but not in my assistant" | Explicit export default |

---

## Reservation record

| Date | Action |
| ---- | ------ |
| 2026-07-05 | Temporary Sovereign Workspace distinguished from shared folder / Slack |
| 2026-07-05 | Four Levels of Intelligence · Collaboration Trust reserved |
| 2026-07-05 | WSP-001 reserved · PRL-4 freeze honored |
| 2026-07-05 | Governed collaboration ledger · GitHub backbone · **Preserve the work. Protect the boundary.** |
| 2026-07-05 | Digital Institution vision · three ledgers · ILG-001 reserved |

---

*WSP-001 Reservation · LocalBrain · 2026*
