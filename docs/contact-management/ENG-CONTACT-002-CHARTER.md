# ENG-CONTACT-002 — Contact Management V2

> **Status:** **RESERVED** — 2026-07-03 · not authorized · post–Commercial Beta  
> **Crossing:** Contact Management V2 · authoritative institutional record · facts only · not CRM · not Relationship Studio  
> **Prerequisite:** [ENG-CONTACT-001](./ENG-CONTACT-001-CHARTER.md) **COMPLETE** · [ENG-PMO-014](./ENG-PMO-014-CONTACT-MANAGEMENT-MODULE-EVALUATION.md) · [ENG-BETA-001](../commercial-beta/ENG-BETA-001-COMMERCIAL-BETA-PREPARATION.md) **OPENED**  
> **Governance:** [ENG / OPS / ENG-PMO](../memory-os/ENG-PMO-GOVERNANCE.md) · [VERSION2_BACKLOG](../VERSION2_BACKLOG.md)  
> **Held constant:** Facts · interpretations · recommendations remain separate authorities · no automation in Contact Management

---

## Three questions · three authorities (binding)

| Question | Owning subsystem |
| -------- | ---------------- |
| **Who are they?** | Contact Management |
| **What has objectively happened?** | Contact Management (institutional record · immutable interaction ledger) |
| **What does it mean?** | [Relationship Studio](../LOCALBRAIN_RELATIONSHIP_NETWORK_INTELLIGENCE_DEPARTMENT.md) |
| **What should we do next?** | Executive Intelligence · Planning · future workflow systems |

Contact Management V2 deepens **facts**. It does **not** answer meaning or recommendations.

---

## Purpose (binding)

> **Contact Management V2 is the authoritative institutional record of people, organizations, identity, affiliations, contact methods, and objectively observed interactions.**

**Contact Management V2 answers:**

> *Who is this person, what do we objectively know about them, and what institutional record exists?*

| Authority | Answers |
| --------- | ------- |
| **Contact Management V2** | Who · objective facts · institutional record |
| **Relationship Studio** | *What does this relationship mean?* |
| **Executive Intelligence** | *What should we do next?* |

**Explicitly excluded from Contact Management** (interpretations):

* trust · influence · relationship strength · next best action · recommendations

---

## V1 → V2

| Era | Scope |
| --- | ----- |
| **V1** ([ENG-CONTACT-001](./ENG-CONTACT-001-CHARTER.md)) | Trustworthy people records for Commercial Beta |
| **V2** (this charter) | Rich identity · orgs · ledger · attachments · geography · merge · permissions · health · fact search |

---

## Position in the roadmap

```text
ENG-CONTACT-001 V1 COMPLETE (ENG-PMO-014)
        ↓
Commercial Beta preparation / readiness (ENG-BETA-001)
        ↓
Commercial Beta availability
        ↓
ENG-CONTACT-002 RESERVED  ← authorization required
```

Not on the V1 critical path.

---

## Acceptance question (binding)

> **Can Contact Management become the authoritative institutional record for people and organizations while remaining separate from relationship intelligence and workflow automation?**

Slice **002.1–002.9** each introduce **one** behavioral uncertainty. No slice reopens V1 acceptances.

---

## Ownership boundaries (binding)

```text
Contact Management                          owns
────────────────────────────────────────────────────────
Canonical people records · organizations · affiliations
Identity · contact methods · roles (as recorded facts)
Immutable interaction ledger · attachments
Stored geography (facts + derived results with provenance)
Institutional edit history · contact health (objective)
Fact search · smart views (filters over canonical data)

Communications Office                       owns
────────────────────────────────────────────────────────
Draft generation · evidence-backed messaging · work products

Relationship Studio                         owns (inferred)
────────────────────────────────────────────────────────
Observed facts → relationship interpretation
Interaction frequency · trust trajectory · influence graph
Community clusters · shared history · affinity · social distance
Engagement patterns · relationship health · suggested reconnects
Risk · context · timelines/stories built from the ledger

Executive Intelligence / Planning           owns (recommendations)
────────────────────────────────────────────────────────
What should we do next · executive judgment · planning outputs
```

### Interaction ledger vs relationship timeline

```text
Contact Management owns
the immutable interaction ledger.

Relationship Studio
constructs timelines,
stories,
and interpretations
from that ledger.
```

Ledger events (objective): created · email sent · meeting · call · text · volunteer event · donation · conversation · document · photo · campaign · speech · draft · appointment · …

---

## Architectural rule (binding)

```text
Everything consumes contacts.
Nothing owns contacts.
```

Integrations (COM · volunteer · calendar · tasks · documents · Relationship Studio · analytics · campaigns) **consume** `contact_id` and canonical fields. They **never** become system-of-record for identity.

---

## Capability map

| # | Capability | Contact Management (facts) | Elsewhere (interpretation / compute) |
| - | ---------- | ---------------------------- | ------------------------------------ |
| 1 | **Rich identity** | Aliases · preferred name · pronouns · biography · photo · profiles · skills · languages · education · employment · family · emergency · custom fields | RS references `contact_id` |
| 2 | **Organizations** | Org · departments · locations · board · staff · committees · programs · org relationships | RS links context · not master data |
| 3 | **Multiple roles** | Role records with start/end · source · confidence · notes (volunteer · donor · reporter · …) | RS interprets patterns |
| 4 | **Contact methods** | Emails · phones · addresses · messengers · social handles · preferred · verified · historical · inactive | COM recipient refs |
| 5 | **Interaction ledger** | Append-only objective events + institutional edit history | RS stories · EI planning inputs |
| 6 | **Attachments** | PDFs · photos · cards · scans · contracts · notes · audio · video (linkage + metadata) | Blob storage may be shared service |
| 7 | **Geography** | Stores: address · county · city · state · **and** derived district fields **with provenance** | **Geography service computes** congressional · ward · precinct · school district · CM stores result |
| 8 | **Duplicate merge** | Possible duplicate · preview · canonical selection · conflict resolution · merge audit | No silent dedup |
| 9 | **Permissions** | Read · edit · sensitive · financial · political · private notes · delete · merge | Governance · audit |
| 10 | **Contact health** | Verified · Incomplete · Duplicate · Needs Review · Stale · Conflicting Identity · Missing Required Field · Import Error · Awaiting Verification · Merged · Archived — **objective only** | Not AI scoring |
| 11 | **Integrations** | Consumption interfaces | Never own contacts |
| 12 | **Contact search** | Fact search: name · role · place · org · phone · email · tags | See semantic layer |
| 13 | **Smart views** | Saved filters over canonical data | Not duplicated rows |

### Search — two layers (binding)

**Contact search** (Contact Management) — fact search:

```text
John · teacher · Jonesboro · church · NAACP · phone · email
```

**Semantic search** (Relationship Studio · Executive Intelligence · future reasoning) — reasoning queries:

```text
Who did Kelly meet last summer?
Who has not been contacted?
Who knows Mayor X?
People active in education.
```

Contact Management does **not** own semantic / reasoning search.

---

## Out of scope (binding)

| Excluded | Belongs to |
| -------- | ---------- |
| Trust · influence · relationship strength · recommendations | Relationship Studio · Executive Intelligence |
| Workflow automation · campaign orchestration | Action pipeline |
| AI relationship scoring | Relationship Studio |
| Automated outreach · bulk send | Connectors · ECD |
| CRM pipeline · deal stages | VERSION2_BACKLOG |
| Absorbing Relationship Studio | Architectural violation |
| Computing geographic districts inside Contact Management | Geography service |
| Semantic / reasoning search | RS · EI |

---

## V2 slice roadmap (binding sequence)

Search is **last** — it composes all prior capabilities.

| Slice | Behavioral question | Primary capabilities |
| ----- | ------------------- | -------------------- |
| [002.1](./slices/ENG-CONTACT-002.1-RICH-IDENTITY.md) | Can contacts support rich identity without breaking canonical ownership? | 1 · partial 3 · 4 |
| [002.2](./slices/ENG-CONTACT-002.2-ORGANIZATIONS.md) | Can organizations become first-class entities while preserving person ownership? | 2 |
| [002.3](./slices/ENG-CONTACT-002.3-IMMUTABLE-INTERACTION-LEDGER.md) | Can the immutable interaction ledger preserve objective institutional history? | 5 |
| [002.4](./slices/ENG-CONTACT-002.4-ATTACHMENTS.md) | Can attachments and documents be integrated safely? | 6 |
| [002.5](./slices/ENG-CONTACT-002.5-GEOGRAPHY.md) | Can geography enrich contacts without Contact Management owning district computation? | 7 |
| [002.6](./slices/ENG-CONTACT-002.6-DUPLICATE-MERGE.md) | Can duplicate merge preserve institutional history? | 8 |
| [002.7](./slices/ENG-CONTACT-002.7-PERMISSIONS.md) | Can permissions satisfy institutional governance without workflow automation? | 9 · 11 |
| [002.8](./slices/ENG-CONTACT-002.8-CONTACT-HEALTH.md) | Can contact health remain entirely objective? | 10 |
| [002.9](./slices/ENG-CONTACT-002.9-SEARCH.md) | Can fact search compose identity · org · ledger · geo · health without reasoning queries? | 12 · 13 |

---

## Build order (when authorized)

| Step | Artifact |
| ---- | -------- |
| 1 | ENG-CONTACT-002 **AUTHORIZED** | This charter |
| 2 | Slices 002.1 … 002.9 | One crossing at a time |
| 3 | PMO module evaluation | ENG-PMO-016 or successor |
| 4 | Relationship Studio V2 crossing | Separate charter · consumes ledger · owns interpretation |

---

## Failure · success

**Failure:** Contact Management became a CRM, stored interpretations, computed geography internally, owned semantic search, or silently merged without audit.

**Success:** Institutional people/org records are authoritative, ledger-faithful, objectively healthy, fact-searchable, and consumed everywhere — **nothing owns contacts except Contact Management.**

---

## Institutional posture

```text
V1:                    ENG-CONTACT-001 COMPLETE · ENG-PMO-014
V2:                    ENG-CONTACT-002 RESERVED
Active authority:      ENG-BETA-001 Commercial Beta preparation
Philosophy:            facts · interpretations · recommendations — separate
```

---

*ENG-CONTACT-002 · Contact Management V2 · RESERVED · LocalBrain · 2026*
