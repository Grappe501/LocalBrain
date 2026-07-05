# First Principles Stack

> **Status:** 🔒 **Conceptual capstone · frozen at reservation** · 2026-07-05  
> **Gate:** No further architecture until PRL-4 operator evidence earns it  
> **Root concept:** [Institution = highest sovereign organizational boundary](../institution/INSTITUTION-ROOT-CONCEPT.md)

This is the **lowest-level invariant**. Everything else is a specialization.

UCIE wasn't "import." Contact wasn't "CRM." VOP wasn't "task management." They were manifestations of **trust domains** — institutional primitives.

Campaigns, youth movements, nonprofits, civic universities, parties, companies are **institution types** — not the root abstraction.

The architecture is organized around **first principles**, not applications.

---

## The meta-principle

Every doctrine shares one theme:

> **Sovereignty before synchronization.**

| Doctrine | Expression |
| -------- | ------------ |
| Local First. Shared by Contract. | Personal and institutional sovereignty first · sync by explicit contract |
| Preserve the work. Protect the boundary. | Workspace memory sovereign · export explicit |
| Protect the evidence. · Protect the pace. | Evidence integrity · no premature engineering |
| One Person. One LocalBrain. Many Governed Sponsorships. | Identity sovereign · institutional recognition explicit |
| Institution = highest sovereign organizational boundary. | Organizational sovereignty below the boundary |
| Contributions become institutional assets upon contribution unless explicitly designated as personal. | Contribution boundary · not conflated with access |
| **Access and authorship are never conflated.** | Revoked access · permanent attributable provenance |
| **Institutions own knowledge. Ledgers preserve provenance. Sponsors steward access.** | Ownership · provenance · stewardship — constitutional |

Constitutional essence: [Platform Constitution](./PLATFORM-CONSTITUTION.md) — six articles · complete · amendment discipline only

Instead of assuming everything should be shared and restricting later, the model starts with **independent sovereign entities** — people, institutions, workspaces — and defines **explicit, governed** ways to collaborate.

---

## LocalBrain is a runtime — not an application

> **LocalBrain is not an application. It's a runtime.**

Institutions become applications that run on it:

| Institution type | Runs on |
| ---------------- | ------- |
| Campaign | LocalBrain |
| Youth movement | LocalBrain |
| Nonprofit | LocalBrain |
| Educational organization | LocalBrain |
| Business | LocalBrain |

The operating system remains the same. Only institution-specific doctrine and services specialize.

---

## The stack

| Level | Primitive | Owns | Question |
| ----- | --------- | ---- | -------- |
| **0** | **Person** | Human identity | *Who am I?* |
| **1** | **LocalBrain** | Personal sovereignty | *What do I know?* |
| **2** | **Institution** | Organizational sovereignty | *Who are we?* |
| **3** | **Universe** | Operational scope | *Where do we operate?* |
| **4** | **Workspace** | Collaborative thinking | *What are we thinking about together?* |
| **5** | **Services** | Operational execution | *What are we doing?* |
| **6** | **Ledgers** | Institutional memory | *What have we learned?* |
| **7** | **Governance** | Institutional learning | *Are we becoming better?* |

Every layer answers **exactly one question**.

---

## The institution boundary

```text
Person                           Level 0
   │
LocalBrain                       Level 1  ← individual sovereignty
   │
══════════════════════════════════════
Institution Boundary
   Sponsorship = recognition across boundary
══════════════════════════════════════
   │
Institution                      Level 2  ← organizational sovereignty
   │
   ├── Universes                  Level 3
   ├── Workspaces                 Level 4
   ├── Services                   Level 5
   ├── Ledgers                    Level 6
   └── Governance                 Level 7
```

| Above the boundary | Below the boundary |
| ------------------ | ------------------ |
| Person · LocalBrain · Personal Ledger | Institution · universes · workspaces · services · ledgers · governance |
| Belongs to the **individual** | Belongs to **exactly one institution** |

**Consequences:**

- A person can leave an institution.
- An institution can continue after people leave.
- Institutional knowledge persists without becoming personal memory.
- Personal knowledge remains personal unless **intentionally shared**.

That is an elegant solution to one of the hardest problems in collaborative systems.

---

## Sponsorship — connecting two sovereign worlds

Sponsorship is not permissions. Not ownership. **Recognition.**

> **This institution recognizes this LocalBrain as belonging to this universe.**

That wording mirrors how real institutions work. Membership isn't the same as ownership.

Sponsorship is the governed edge that crosses the institution boundary — connecting individual sovereignty to organizational sovereignty without merging them.

---

## Access and authorship — never conflated

Two distinct concepts govern what happens when sponsorship ends:

| Concept | Behavior when sponsorship ends |
| ------- | ------------------------------ |
| **Access** | Revoked immediately — LocalBrain loses reach to institutional assets |
| **Authorship** | Preserved permanently — ledger retains who created, decided, approved |

> **The institution owns the work; the ledger preserves the authorship.**

Those are compatible — and must never be conflated.

### Access revoked (immediate)

When sponsorship ends, the LocalBrain **immediately loses access** to that institution's assets:

- Institutional Ledgers · Workspace Ledgers owned by that institution
- Institutional AI memory · institutional services (UCIE · Contact · VOP)
- Institutional documents · decisions · workspaces

The LocalBrain behaves as though those resources are **unavailable** unless a new authorized sponsorship is established.

### Authorship preserved (permanent)

Contributions remain **permanently attributable** in the institution's audit history:

- Who created a document · who made a decision · who authored a proposal
- Who completed a task · who approved a policy

The former member **cannot see or retrieve** those records — but the institution's ledger preserves accurate provenance.

### Contribution doctrine

> **Contributions become institutional assets upon contribution unless explicitly designated as personal.**

| State | Belongs to |
| ----- | ---------- |
| Private draft in Personal Ledger | Individual — always |
| Proposal or document contributed into institutional workspace | Institution — upon contribution |
| Anything explicitly exported to Personal Ledger before sponsorship ends | Individual — by explicit export |

### Personal vs institutional retention

| Personal LocalBrain retains | Institution retains |
| --------------------------- | ------------------- |
| Personal notes · drafts · learning | Workspace history · decisions · chat transcripts |
| Public knowledge | Evidence · governance records · operational history |
| Explicit exports before sponsorship ends | AI workspace memory · institutional documents |

### Three properties preserved

| Property | How |
| -------- | --- |
| **Personal sovereignty** | People retain LocalBrain and Personal Ledger |
| **Institutional sovereignty** | Institutions retain memory and operational history |
| **Historical integrity** | Audit trail records who did what after membership changes |

Full model: [Federation Sponsorship Model](../federation/FEDERATION-SPONSORSHIP-MODEL.md) · sponsorship revocation.

---

## Trust domains — institutional services (Level 5)

The three certified trust domains are **institutional services** — not application features:

| Trust Domain | Question | Service |
| ------------ | -------- | ------- |
| Identity Trust | *Who is this?* | UCIE |
| Relationship Trust | *How do we know them?* | Contact v3 |
| Operational Trust | *Who is doing the work?* | VOP |

Reserved:

| Trust Domain | Question | Reservation |
| ------------ | -------- | ----------- |
| Collaboration Trust | *Who is allowed to think together?* | WSP-001 |
| Governance Trust | *Is the institution healthy?* | EPO-001 |

---

## Ledgers — institutional memory (Level 6)

| Ledger | Scope |
| ------ | ----- |
| Personal Ledger | Level 1 — private |
| Workspace Ledger | Level 4 — WSP-001 |
| Institutional Ledger | Level 6 — ILG-001 |

GitHub (reserved): **canonical ledger**. LocalBrain: **living interface**.

---

## Reserved subsystems — specializations only

No further root concepts. Existing reservations specialize this stack:

| Reservation | Stack level |
| ----------- | ----------- |
| [FED-001](../federation/FED-001-RESERVATION.md) | Sponsorship · federation · institution isolation |
| [WSP-001](../collaboration/WSP-001-RESERVATION.md) | Level 4 · Workspace |
| [ILG-001](../institution/ILG-001-RESERVATION.md) | Level 6 · Ledgers |
| [EPO-001](../epo/EPO-001-RESERVATION.md) | Level 7 · Governance |

---

## Conceptual stopping point

**2026-07-05:** Architecture and constitutional principles **complete at reservation**.

> **People own themselves. Institutions own their institutional knowledge. Sponsorship governs the relationship between the two.**

Full text: [Platform Constitution](./PLATFORM-CONSTITUTION.md) — six articles · **complete · do not expand without amendment**.

| Do now | Do not now |
| ------ | ---------- |
| PRL-4 operator validation | New architecture or constitutional principles |
| Test principles under real use | Speculative expansion |
| Evidence capture · pattern review | Doctrine churn |
| CPAT regression | Implementation before evidence |

When operator evidence returns, implement **specializations** — not new invariants. See whether stewardship, ownership, and provenance **hold** when people join, leave, and institutions succeed one another.

---

## Related

- [Institution Root Concept](../institution/INSTITUTION-ROOT-CONCEPT.md)
- [Digital Institution Charter](../institution/DIGITAL-INSTITUTION-CHARTER.md)
- [Governed Platform Architecture](./GOVERNED-PLATFORM-ARCHITECTURE.md)
- [Engineering Philosophy v1.0](./ENGINEERING-PHILOSOPHY-V1.md)
- [Platform Constitution](./PLATFORM-CONSTITUTION.md)
- [Prime Directive](../operator-readiness/PRIME-DIRECTIVE.md)

---

*First Principles Stack · LocalBrain · 2026 · Conceptual capstone*
