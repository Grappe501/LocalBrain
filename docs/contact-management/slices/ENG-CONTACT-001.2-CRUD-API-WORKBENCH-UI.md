# ENG-CONTACT-001.2 — CRUD API + Workbench UI

> **Status:** **IMPLEMENTATION FROZEN** — 2026-07-03  
> **Parent:** [ENG-CONTACT-001 Charter](../ENG-CONTACT-001-CHARTER.md)  
> **Prerequisite:** [ENG-CONTACT-001.1](./ENG-CONTACT-001.1-CANONICAL-CONTACT-STORAGE.md) **IMPLEMENTATION FROZEN** · 7/7 PASS

---

## Behavioral question (binding)

> **Can beta users create, find, update, and archive contact records through the workbench without touching lower-level storage directly?**

This is the **only** behavioral question for ENG-CONTACT-001.2.

---

## Scope (binding)

| In scope | |
| -------- | - |
| **HTTP CRUD** | `/api/contacts/*` · list · get · create · patch · archive · restore |
| **Organizations** | list · create · affiliation link |
| **Workbench** | `/studio/contacts` · list + detail form |
| **Search / filter** | name · email · tag · include archived |
| **Archive / restore** | human-initiated controls in UI |
| **Affiliations** | display + link organization on contact |

### Excluded

* CSV import/export — ENG-CONTACT-001.3
* Communications draft linking — ENG-CONTACT-001.4
* Relationship studio wiring
* Volunteer management
* Automation · AI scoring · bulk outreach

---

## Evidence (acceptance criteria)

| # | Criterion | Status |
| - | --------- | ------ |
| C1 | `GET/POST/PATCH /api/contacts` operational with workspace scoping | ✅ |
| C2 | Archive and restore routes change visibility in default list | ✅ |
| C3 | Workbench list/detail form at `/studio/contacts` | ✅ |
| C4 | Search and tag filter without direct repository access | ✅ |
| C5 | Organization affiliations visible and linkable from UI | ✅ |
| C6 | Route tests pass in isolation | ✅ |
| C7 | No CSV · COM · relationship · volunteer surfaces opened | ✅ |

---

## Institutional posture

```text
Slice:                 ENG-CONTACT-001.2 IMPLEMENTATION FROZEN
Next act:              ENG-CONTACT-001.3 CSV import/export
Blocked on:            Nothing — PMO acceptance deferred
```

---

*ENG-CONTACT-001.2 · CRUD API + Workbench UI · LocalBrain V1 · 2026*
