# ENG-CONTACT-001.1 — Canonical Contact Storage

> **Status:** **AUTHORIZED** — 2026-07-03  
> **Parent:** [ENG-CONTACT-001 Charter](../ENG-CONTACT-001-CHARTER.md)  
> **Phase:** First behavioral slice · storage foundation · no UI · no CSV · no COM wiring

---

## Behavioral question (binding)

> **Can canonical contact records persist with integrity — one trustworthy row per person per workspace?**

This is the **only** behavioral question for ENG-CONTACT-001.1.

Everything else remains for later slices.

---

## Held constant (not under evaluation)

* ENG-CONTACT-001 charter scope boundaries (not a CRM)
* Communications Office contract (`ENG-COM-001.3`) — no draft linking in this slice
* Relationship studio philosophy — contact record is storage layer, not graph intelligence
* Workspace scoping — contacts belong to a workspace
* Human-controlled outreach — status field may exist; no send automation

---

## Scope (binding)

| | |
| - | - |
| **Input** | Contact create/update payloads · workspace context |
| **Output** | Persisted contact records · query by id · list with basic filters |

### In scope

| Item | Requirement |
| ---- | ----------- |
| **Shared contract** | `ContactRecord` type in `shared/` · version constant |
| **Persistence** | SQLite table(s) · migration |
| **Core fields** | `contact_id` · `workspace_id` · name · email(s) · phone(s) · address · org affiliation refs · tags · notes · outreach_status · timestamps · archived flag |
| **Organization entity** | Minimal org table + contact↔org link |
| **Integrity** | Required field validation · duplicate detection policy (same email within workspace) |
| **Repository layer** | Create · read · update · archive · list · search by name/email/tag |
| **Tests** | Repository + validator tests — no HTTP in this slice unless trivial |

### Excluded from this slice

* HTTP routes (`/api/contacts/*`) — ENG-CONTACT-001.2
* Workbench UI — ENG-CONTACT-001.2
* CSV import/export — ENG-CONTACT-001.3
* Communications draft linking — ENG-CONTACT-001.4
* Relationship graph mutations
* Connector sync
* Automated outreach

```text
Contact payload + workspace_id
        ↓
Validation · dedupe policy
        ↓
SQLite persistence
        ↓
ContactRecord (canonical)
```

---

## Evidence (acceptance criteria)

PMO evaluates evidence, not UI polish.

| # | Criterion |
| - | --------- |
| C1 | `ContactRecord` contract published in shared with version constant | Pending |
| C2 | SQLite schema migrates cleanly on fresh and existing installs | Pending |
| C3 | Create/read/update/archive round-trip preserves all required fields | Pending |
| C4 | Duplicate email within same workspace is rejected or surfaced — policy documented | Pending |
| C5 | Organization affiliation links persist and resolve on read | Pending |
| C6 | Archived contacts excluded from default list · recoverable | Pending |
| C7 | Behavioral tests pass in isolation (OPS-TEST-004 lane) | Pending |

---

## Explicitly not evaluated

* Search relevance ranking
* CSV encoding edge cases
* Communications draft quality
* Relationship health score impact
* Import performance at scale

---

## Suggested file layout (non-binding)

```text
shared/src/contacts/contactRecord.ts          — contract + version
backend/src/contacts/contactRepository.ts     — persistence
backend/src/contacts/contactValidator.ts      — validation + dedupe
backend/src/contacts/contactRepository.test.ts
backend/src/db/migrations/…                   — schema
```

---

## Institutional posture

```text
Slice:                 ENG-CONTACT-001.1 AUTHORIZED
Next act:              Shared contract + SQLite schema + repository tests
Blocked on:            Nothing — charter AUTHORIZED
Commercial Beta:       After full ENG-CONTACT-001 module acceptance
```

---

*ENG-CONTACT-001.1 · Canonical Contact Storage · AUTHORIZED · LocalBrain V1 · 2026*
