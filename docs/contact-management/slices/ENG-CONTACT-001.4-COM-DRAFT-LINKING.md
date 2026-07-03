# ENG-CONTACT-001.4 — Communications Draft Linking

> **Status:** **IMPLEMENTATION FROZEN** — 2026-07-03  
> **Parent:** [ENG-CONTACT-001 Charter](../ENG-CONTACT-001-CHARTER.md)  
> **Prerequisite:** [ENG-CONTACT-001.3](./ENG-CONTACT-001.3-CSV-IMPORT-EXPORT.md) **IMPLEMENTATION FROZEN**

---

## Behavioral question (binding)

> **Can beta users associate Communications drafts with Contact records without giving Contacts ownership over Communications or turning Contact Management into a CRM?**

This is the **only** behavioral question for ENG-CONTACT-001.4.

---

## Scope (binding)

| In scope | |
| -------- | - |
| **Draft metadata** | `contact_id` · `recipient_refs` on `CommunicationsDraftRequest` (COM generator ignores; link layer consumes) |
| **Generate + link** | `POST /api/communications/drafts/generate` · persists link rows · COM owns draft body |
| **Contact lookup** | Resolve recipients from workspace contacts before link creation |
| **Contact detail** | `GET /api/contacts/:id/drafts` · linked draft list with preview |
| **Outreach update** | `POST /api/contacts/:id/outreach` · human status + required audit note |
| **Audit trail** | `GET /api/contacts/:id/outreach-audit` · append-only notes |
| **Workbench UI** | Generate linked draft · view links · outreach audit on contact detail |

### Excluded

* Sending · bulk outreach · automation · AI scoring
* Relationship merge · volunteer workflows · campaign CRM
* Contacts owning draft generation logic · COM owning contact storage

---

## Boundary (binding)

```text
Contacts owns people records.
Communications owns drafts.
Links connect them.
Neither owns the other.
```

---

## Evidence (acceptance criteria)

| # | Criterion | Status |
| - | --------- | ------ |
| C1 | Draft request accepts `contact_id` / `recipient_refs` without COM contract violation | ✅ |
| C2 | Generate endpoint creates link rows; draft body stored under COM artifact | ✅ |
| C3 | Contact detail lists linked drafts independently of COM subsystem | ✅ |
| C4 | Outreach status update requires audit note; append-only audit persisted | ✅ |
| C5 | Workbench supports generate + linked draft view + outreach audit | ✅ |
| C6 | Link repository + route tests pass in isolation | ✅ |
| C7 | No send path · CRM · automation · or relationship merge opened | ✅ |

---

## Institutional posture

```text
Slice:                 ENG-CONTACT-001.4 IMPLEMENTATION FROZEN
Next act:              PMO module evaluation (ENG-PMO-014 or successor)
Blocked on:            Nothing — PMO acceptance deferred
```

---

*ENG-CONTACT-001.4 · Communications draft linking · LocalBrain V1 · 2026*
