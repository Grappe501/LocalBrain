# Federation Sponsorship Model — One Person. One LocalBrain. Many Governed Sponsorships.

> **Status:** 🔒 **Foundational model · reserved** · Not implemented · 2026-07-05  
> **Root concept:** [Institution = highest sovereign organizational boundary](../institution/INSTITUTION-ROOT-CONCEPT.md)  
> **Parent:** [Federation Charter](./FEDERATION-CHARTER.md) · [Federation Graph Model](./FEDERATION-GRAPH-MODEL.md) · [FED-001 Reservation](./FED-001-RESERVATION.md)  
> **Gate:** Do not build until PRL-4 operator evidence validates multi-universe identity and legal boundary requirements

**Universes** are operational scopes **within an institution**. **Sponsorship** is how an **institution** recognizes a LocalBrain in a universe — preserving one identity across a lifetime of changing institutions.

---

## Doctrine (reserved — federation layer)

> **One Person. One LocalBrain. Many Governed Sponsorships.**

Complements:

| Principle | Scope |
| --------- | ----- |
| Local First. Shared by Contract. | Federation · sync |
| Preserve the work. Protect the boundary. | Workspaces · ledgers |
| Protect the evidence. | Operator validation · EDD |
| Protect the pace. | Engineering discipline |
| **One Person. One LocalBrain. Many Governed Sponsorships.** | **Identity · universes · legal isolation** |

---

## Identity never changes

> **A person has one LocalBrain identity. They may participate in many universes through governed sponsorships.**

That allows:

- Lifetime history in one identity
- Changing organizations · campaigns · movements
- Changing workspaces
- **No identity duplication**

Sarah joins Kelly Campaign today. Years later she joins another organization — **same Sarah LocalBrain**, new **governed sponsorship**. Not a second Sarah.

---

## Sponsorship — every connection has a sponsor

Every LocalBrain exists as a **sovereign identity**.

It may belong to **multiple universes** over its lifetime — but each connection has a **Sponsor** who authorizes membership.

### Kelly Campaign Institution

```text
Institution
  Kelly Grappe for Secretary of State
Operational Universe
  Campaign Operations
Sponsor (institution recognizes membership)
  Kelly Campaign Institution
Connected LocalBrains
  Kelly · Carol · Sarah · Xavion · Chance
Connection type
  Sponsored Connection
```

### Youth Movement Institution (not a campaign institution)

```text
Institution
  Youth Movement
Operational Universe
  Youth Universe
Sponsor
  Youth Movement Institution
Connected LocalBrains
  Xavion · Chance · Future Youth Leaders
```

### One LocalBrain — multiple sponsorships

Xavion has **one LocalBrain** — not two.

```text
Xavion LocalBrain
Sponsored Connections
  ✓ Youth Movement Institution → Youth Universe
  ✓ Kelly Campaign Institution → Campaign Operations Universe
No visibility into
  Chris Campaign Institution
  unless separately sponsored and authorized
```

> **This institution recognizes this LocalBrain as belonging to this universe.**

Each sponsorship is **governed independently**. Visibility in one universe does not imply visibility in another.

---

## Connection types

Every graph edge carries a **connection type** — richer than flat permissions:

| Connection | Meaning |
| ---------- | ------- |
| **Personal** | My own LocalBrain — sovereign · Level 1 |
| **Sponsored** | Institution recognizes LocalBrain in an operational universe |
| **Federated** | Explicit bridge between universes — legally authorized · capability-scoped |
| **Workspace** | Temporary active collaboration · WSP-001 |
| **Observer** | Read-only or limited visibility — no full collaboration rights |

Sponsored edges answer *"Who authorized this person in this universe?"*

Federated edges answer *"What legally permitted information may cross this boundary?"*

Workspace edges answer *"Who is thinking together right now?"*

---

## Campaign institution isolation — non-negotiable architectural guarantee

**Legal requirement (elevated to doctrine):**

> **No coordination of campaigns through the LocalBrain system is permitted where federal or state coordination laws prohibit it.**

**Architectural guarantee (reserved — enforced by FED-001):**

> **Campaign institutions are sovereign. Information does not cross campaign institution boundaries unless an explicit, authorized federation contract exists and the information is legally permitted to be shared.**

| Prohibited by default | Permitted only when |
| --------------------- | ------------------- |
| Cross-institution data sync (campaign institutions) | Explicit federated bridge + legal authorization |
| Cross-institution AI context | Same |
| Cross-institution discoverability | Same |
| Implicit institution merge | Never |

Kelly Campaign Institution and Chris Campaign Institution remain **legally and operationally isolated** unless a governed bridge explicitly authorizes specific, legally permitted sharing.

---

## Youth Movement — non-campaign institution

The Youth Movement is **not a campaign institution**. It does not merge campaign institutions.

```text
Youth Movement Institution
          │
          ├─────────────┐
          │             │
Kelly Campaign     Chris Campaign
  Institution        Institution
```

Individual youth leaders may hold **sponsored connections** to different campaign institutions — each governed independently.

The Youth Movement roster is **not** visible to Kelly unless Kelly holds authorized sponsorship or observer rights in the Youth Movement institution.

Campaign coordination laws apply between **campaign institutions**. Non-campaign institutions follow the same **institution boundary** model with institution-appropriate legal constraints.

---

## Discoverability — sponsorship-scoped

When Kelly opens **Connected LocalBrains**:

| She sees | She does not see |
| -------- | ---------------- |
| LocalBrains **sponsored into Kelly Campaign Institution** (authorized universes) | Youth Movement roster (unless authorized there) |
| Other institutions she is authorized to view | Chris Campaign participants (unless federated bridge or shared authorized sponsorship) |

No global browse. No world search. Only **sponsored reachability** through universes she is authorized to view.

---

## Graph model (sponsorship-enriched)

| Element | Types |
| ------- | ----- |
| **Nodes** | LocalBrains · Universes · Workspaces · Sponsors (campaign · movement · org) |
| **Edges** | Personal · Sponsored · Federated · Workspace · Observer |

Questions the graph answers:

- *"Who sponsors Xavion in Kelly Campaign?"*
- *"Which universes is Sarah connected to?"*
- *"Show all active federation bridges between campaign universes."*
- *"Is this cross-universe sync legally authorized?"*

---

## Where sponsorship fits

```text
Sovereign LocalBrain identity (one per person · lifetime)
        │
        ├── Personal connection (sovereign · private)
        │
        ├── Sponsored connection → Kelly Campaign Universe
        ├── Sponsored connection → Youth Movement Universe
        │
        ├── Workspace connection → active WSP-001 collaboration
        │
        └── Federated connection → explicit cross-universe bridge (legal + authorized)
```

| Layer | Role |
| ----- | ---- |
| **Sponsor** | Authorizes membership in a universe |
| **Universe** | Trust boundary · operational scope |
| **Sponsored connection** | Governed edge · independent per universe |
| **Federated bridge** | Cross-universe · legal + explicit |
| **Workspace** | Temporary collaboration |
| **Personal LocalBrain** | Never duplicated |

---

## Sponsorship revocation — ownership, provenance, stewardship

**Never conflate ownership, provenance, and stewardship.**

| Concept | Meaning |
| ------- | ------- |
| **Ownership** | Institution permanently owns institutional assets |
| **Provenance** | Ledger permanently records who contributed what and when |
| **Stewardship** | Current sponsors determine who may **access** institutional assets |

> **Institutions own their institutional knowledge. Ledgers preserve provenance. Current sponsors steward access.**

Constitutional form: [Platform Constitution](../platform/PLATFORM-CONSTITUTION.md) — Articles II–IV

When sponsorship ends:

### Access — revoked immediately

The LocalBrain **immediately loses access** to that institution's assets:

| Asset class | Access after revocation |
| ----------- | ----------------------- |
| Institutional Ledgers | ✗ No access |
| Workspace Ledgers (institution-owned) | ✗ No access |
| Institutional AI memory | ✗ No access |
| Institutional services (UCIE · Contact · VOP) | ✗ No access |
| Institutional documents · decisions · workspaces | ✗ No access |

The LocalBrain behaves as though those resources are **unavailable** unless a new authorized sponsorship is established.

### Authorship — preserved permanently

The institution's ledger **permanently retains** attributable facts:

- Who created a document · who made a decision · who authored a proposal
- Who completed a task · who approved a policy

> **The institution owns the work; the ledger preserves the authorship.**

The former member **cannot see or retrieve** institutional records — but historical integrity remains accurate.

### Contribution doctrine

> **Contributions become institutional assets upon contribution unless explicitly designated as personal.**

| Contribution | Ownership |
| ------------ | --------- |
| Private draft in Personal Ledger | Individual |
| Document contributed into institutional workspace | Institution — upon contribution |
| Explicit export to Personal Ledger before sponsorship ends | Individual — by explicit choice |

### Personal vs institutional retention

**Personal LocalBrain retains:** personal notes · drafts · learning · public knowledge · anything explicitly exported before sponsorship ends.

**Institution retains:** workspace history · decisions · chat transcripts · evidence · governance records · operational history · AI workspace memory · institutional documents.

### Workspace institution ownership

Every workspace has an **owning institution**.

A workspace owned by **Kelly Campaign Institution**:

- Survives personnel changes
- Ledger remains with the institution
- Former members lose **access** — not authorship attribution
- Institution retains full history

This preserves personal sovereignty · institutional sovereignty · historical integrity — simultaneously.

---

## What FED-001 must implement (reserved)

| Area | Sponsorship responsibility |
| ---- | -------------------------- |
| Sovereign identity | One LocalBrain per person · lifetime |
| Sponsorship registry | Sponsor · universe · member · connection type |
| Multi-universe membership | Independent governed edges per universe |
| Campaign isolation enforcement | No cross-campaign sync without federated + legal authorization |
| Connection type model | Personal · Sponsored · Federated · Workspace · Observer |
| Discoverability queries | Scoped to authorized universes and sponsorships |
| Audit | Sponsorship grant · revoke · bridge approval · legal basis record |
| Revocation | Remove access immediately · preserve authorship in institutional ledger · never destroy identity or personal ledger |
| Access vs authorship | Never conflated · provenance permanent · access revocable |

---

## PRL-4 evidence signals

| Signal | Sponsorship implication |
| ------ | ----------------------- |
| *"Same volunteer on two campaigns"* | One LocalBrain · two sponsored connections · isolation enforced |
| *"We can't coordinate campaigns through the system"* | Campaign isolation doctrine validated |
| *"Youth leaders work with multiple campaigns"* | Non-campaign universe + independent sponsorships |
| *"Sarah left and joined another org"* | New sponsorship · same identity · prior authorship preserved at old institution |
| *"Can I still see campaign docs after I left?"* | Access revoked · authorship preserved in institution ledger |
| *"Can Kelly see Chris's volunteers?"* | Federation bridge required — not default |

---

## Reservation record

| Date | Action |
| ---- | ------ |
| 2026-07-05 | Sponsorship model articulated · connection types |
| 2026-07-05 | Campaign isolation elevated to architectural guarantee || 2026-07-05 | Institution identified as root abstraction · Institution Operating System |
| 2026-07-05 | Access vs authorship · contribution doctrine · sponsorship revocation model |
| 2026-07-05 | Reserved under FED-001 · PRL-4 freeze honored |

---

## Related

- [Institution Root Concept](../institution/INSTITUTION-ROOT-CONCEPT.md)
- [Federation Graph Model](./FEDERATION-GRAPH-MODEL.md)
- [Federation Charter](./FEDERATION-CHARTER.md)
- [FED-001 Reservation](./FED-001-RESERVATION.md)
- [Collaboration Charter](../collaboration/COLLABORATION-CHARTER.md)
- [Prime Directive](../operator-readiness/PRIME-DIRECTIVE.md)

---

*Federation Sponsorship Model · LocalBrain · 2026*
