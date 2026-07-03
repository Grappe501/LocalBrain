# ENG-CONTACT-001 — Contact Management V1

> **Status:** **AUTHORIZED** — 2026-07-03  
> **Crossing:** Contact Management · practical people records for Commercial Beta  
> **Prerequisite:** [ENG-PMO-013](../communications-office/ENG-PMO-013-COMMUNICATIONS-OFFICE-MODULE-EVALUATION.md) · Communications Office V1 subsystem **COMPLETE**  
> **Governance:** [ENG / OPS / ENG-PMO](../memory-os/ENG-PMO-GOVERNANCE.md)  
> **Held constant:** Constitutional Memory · Communications Office contract (`ENG-COM-001.3`) · Relationship studio philosophy (Social Knowledge) · PMO governance · verification lane definitions · no automated outreach

---

## Position in the critical path

```text
Communications Office COMPLETE
        ↓
Contact Management V1 (ENG-CONTACT-001)  ← this crossing
        ↓
Commercial Beta
```

Contact Management is a **practical release dependency** for Commercial Beta — not a full CRM, not volunteer management, not connector activation.

---

## Architectural question (binding)

> **Can LocalBrain maintain a trustworthy, searchable contact record system sufficient for Commercial Beta without becoming a full CRM?**

This is the **only** architectural question for ENG-CONTACT-001.

No secondary questions. No campaign CRM ambitions. No automation scope in this charter.

---

## Problem statement

Commercial Beta users need **people records** to make Communications useful. Today:

- [Communications Office](../communications-office/ENG-COM-001-CHARTER.md) produces constitutionally accountable drafts — backend library only, no workbench UI
- [Relationship & Network Intelligence](../LOCALBRAIN_RELATIONSHIP_NETWORK_INTELLIGENCE_DEPARTMENT.md) (LB-OS-015) models Social Knowledge — seed catalog, read-only, no persistent contact store
- Beta users cannot add, edit, import, or link real contacts to draft communications

Contact Management V1 closes that gap with **small, ship-oriented scope**.

---

## Relationship to adjacent systems (binding)

| System | Role | ENG-CONTACT-001 posture |
| ------ | ---- | ----------------------- |
| **Communications Office** | Draft generation · traceability · advisory restraint | Contacts **link to** draft requests and recipient context — COM does not own contact storage |
| **Relationship studio** | Social Knowledge · graph · engagement heuristics | Relationship layer **references** canonical contact records — does not duplicate email/phone/address fields |
| **Volunteer Management** | Field operations roster (post–Commercial Beta) | Volunteers reference `contact_id` / `relationship_id` — [ENG-VOL-001](../volunteer-management/ENG-VOL-001-MASTER-BUILD-PLAN.md) does not authorize before beta |
| **Executive Communications Department** | Connectors · email/SMS · calendar (post-V1) | CAP-FUT-ECD-001 consumes contact records — does not replace this crossing |

```text
Canonical Contact Record (ENG-CONTACT-001)
        ↓
Relationship context · Communications draft links · future connectors
```

---

## V1 scope (in)

| Capability | Description |
| ---------- | ----------- |
| **Add/edit contacts** | Create, update, archive — workspace-scoped |
| **Organizations / affiliations** | Org entity + contact↔org links |
| **Roles / tags** | Freeform and controlled vocabulary tags |
| **Contact fields** | Email, phone, address — structured, validated |
| **Notes** | Human-authored notes on contact record |
| **Relationship / context history** | Timeline of touches, notes, draft links — append-only audit where applicable |
| **Search / filter** | Name, org, tag, outreach status |
| **Import / export CSV** | Human-initiated bulk load and extract |
| **Link to Communications drafts** | `contact_id` on draft request / recipient context |
| **Outreach status** | Human-controlled status (e.g. none · queued · sent · replied) — **no automated send** |

---

## Out of scope (binding)

| Excluded | Reason |
| -------- | ------ |
| Automated outreach | Connector / action pipeline — post-charter |
| Bulk texting / email sending | Production department · approval-gated send path |
| Fundraising automation | Campaign CRM — not V1 |
| Voter-file matching | Data intelligence scope — not contact management |
| AI relationship scoring | Relationship studio intelligence — not storage |
| Campaign CRM complexity | Explicit non-goal |
| Volunteer management | [ENG-VOL-001](../volunteer-management/ENG-VOL-001-MASTER-BUILD-PLAN.md) — post–Commercial Beta |
| Google Contacts / Gmail sync | Connector scope — CAP-FUT |
| Duplicate contact graph | Single canonical record per person per workspace |

Proposals for excluded items belong in [VERSION2_BACKLOG.md](../VERSION2_BACKLOG.md) unless they shorten the critical path to charter acceptance.

---

## Held constant (not under evaluation)

| Layer | Artifact |
| ----- | -------- |
| Communications Office | ENG-COM-001.3 · 18/18 behavioral · subsystem COMPLETE |
| Constitutional draft pipeline | Traceability · uncertainty · advisory restraint inherited |
| Relationship philosophy | Social Knowledge — relationship is contextual layer atop contact record |
| PMO governance | Charter → implementation → verification → PMO acceptance |
| Human control | All outreach status changes are human-initiated |

---

## Acceptance question

> **What evidence demonstrates a trustworthy, searchable contact record system sufficient for Commercial Beta — without CRM scope creep?**

PMO evaluates **evidence**, not feature count.

---

## Evidence required

| # | Requirement |
| - | ----------- |
| E1 | Canonical contact schema — one record per person per workspace · no silent duplicates |
| E2 | CRUD API — create, read, update, archive with validation |
| E3 | Workbench UI — add/edit/search contacts without developer tools |
| E4 | CSV import/export — round-trip without data loss on required fields |
| E5 | Contact↔Communications draft link — draft request names recipient from stored contact |
| E6 | Outreach status is human-controlled — no automated send path opened |
| E7 | Relationship studio can reference contact records without field duplication |

Implementation slices · behavioral tests · contracts · and PMO acceptance **emerge from** satisfying these requirements.

---

## Failure (binding definition)

Failure **is**:

> "Contact Management became a CRM, duplicated relationship data, or opened automated outreach without authorization."

Failure is **not**:

> "The UI wasn't as polished as Salesforce."

---

## Success (binding definition)

Success **is**:

> "Beta users can maintain real people records, find them quickly, import a CSV, and link contacts to Communications drafts — with human-controlled outreach status only."

---

## Build order (binding sequence)

| Step | Artifact | Notes |
| ---- | -------- | ----- |
| 1 | ENG-CONTACT-001 charter | This document |
| 2 | Contact data model | Shared contract + SQLite persistence |
| 3 | CRUD API | `/api/contacts/*` |
| 4 | Admin / workbench UI | `/studio/contacts` or integrated contacts surface |
| 5 | CSV import / export | Human-initiated only |
| 6 | Link contacts to Communications drafts | Wire COM request to `contact_id` |
| 7 | PMO module acceptance | ENG-PMO-014 or successor |
| 8 | Commercial Beta | Next gate after module acceptance |

---

## Implementation slices

| Slice | Behavioral question | Status |
| ----- | ------------------- | ------ |
| [ENG-CONTACT-001.1](./slices/ENG-CONTACT-001.1-CANONICAL-CONTACT-STORAGE.md) | Can canonical contact records persist with integrity? | **IMPLEMENTATION FROZEN** |
| ENG-CONTACT-001.2 | Can beta users manage contacts through the workbench? | **IMPLEMENTATION FROZEN** |
| ENG-CONTACT-001.3 | Can CSV import/export round-trip without loss? | **IMPLEMENTATION FROZEN** |
| ENG-CONTACT-001.4 | Can contacts link to Communications drafts? | Reserved |

Slice definitions emerge as prior slices complete. See [slices/README.md](./slices/README.md).

---

## Institutional posture

```text
Engineering truth:     ENG-CONTACT-001.2 IMPLEMENTATION FROZEN · `/api/contacts/*` · `/studio/contacts`
Operational truth:     Contact Management V1 before Commercial Beta
Prior crossing:        ENG-CONTACT-001.1 storage · 7/7 PASS
Next repository act:   ENG-CONTACT-001.4 Communications draft linking
```

---

*ENG-CONTACT-001 · Contact Management V1 · AUTHORIZED · LocalBrain V1 · Execution phase · 2026*
