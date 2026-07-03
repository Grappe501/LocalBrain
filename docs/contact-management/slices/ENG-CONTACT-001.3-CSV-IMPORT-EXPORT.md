# ENG-CONTACT-001.3 — CSV Import / Export

> **Status:** **IMPLEMENTATION FROZEN** — 2026-07-03  
> **Parent:** [ENG-CONTACT-001 Charter](../ENG-CONTACT-001-CHARTER.md)  
> **Prerequisite:** [ENG-CONTACT-001.2](./ENG-CONTACT-001.2-CRUD-API-WORKBENCH-UI.md) **IMPLEMENTATION FROZEN**

---

## Behavioral question (binding)

> **Can beta users safely move contacts in and out of LocalBrain by CSV without corrupting canonical contact records?**

This is the **only** behavioral question for ENG-CONTACT-001.3.

---

## Scope (binding)

| In scope | |
| -------- | - |
| **CSV export** | `GET /api/contacts/export.csv` · workspace-scoped · current list filters |
| **Import preview** | `POST /api/contacts/import/preview` · row validation · duplicate detection |
| **Duplicate handling** | `error` (default) · `skip` · `update` by normalized email |
| **Import commit** | `POST /api/contacts/import/commit` · SQLite transaction · error report |
| **Workbench UI** | Export button · file picker · preview table · commit control |
| **Round-trip columns** | `contact_id`, `display_name`, `first_name`, `last_name`, `email`, `phone`, `tags`, `notes`, `outreach_status`, `archived` |

### Excluded

* Bulk outreach · AI enrichment · voter matching
* Volunteer workflows · relationship studio merge
* Communications automation · COM draft linking (ENG-CONTACT-001.4)

---

## Evidence (acceptance criteria)

| # | Criterion | Status |
| - | --------- | ------ |
| C1 | CSV export returns canonical headers and escaped field values | ✅ |
| C2 | Import preview validates rows and flags duplicates before write | ✅ |
| C3 | Import commit applies creates/updates/skips inside a transaction | ✅ |
| C4 | Default duplicate policy blocks unsafe commits | ✅ |
| C5 | Workbench supports export, preview, and commit without repository access | ✅ |
| C6 | CSV + route tests pass in isolation | ✅ |
| C7 | No CRM · COM · relationship · volunteer surfaces opened | ✅ |

---

## Institutional posture

```text
Slice:                 ENG-CONTACT-001.3 IMPLEMENTATION FROZEN
Next act:              ENG-CONTACT-001.4 Communications draft linking
Blocked on:            Nothing — PMO acceptance deferred
```

---

*ENG-CONTACT-001.3 · CSV import/export · LocalBrain V1 · 2026*
