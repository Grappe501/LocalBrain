# ENG-BETA-001.1 — Commercial Beta Workflow Map

> **Type:** Release preparation evidence · proves product coherence · not readiness evaluation  
> **Status:** **DRAFT** — 2026-07-03  
> **Parent:** [ENG-BETA-001 Commercial Beta Preparation](./ENG-BETA-001-COMMERCIAL-BETA-PREPARATION.md)  
> **Prerequisite:** All V1 subsystems **COMPLETE** · inherited baseline · no subsystem reopening

---

## Purpose

This document answers whether LocalBrain **as it exists today** can support real beta users safely and effectively — not where V2 is headed.

It is the **primary preparation artifact**. Connector posture, onboarding, support playbooks, feedback forms, and readiness evaluation all derive from these workflows.

**Beta cohort (staged):** Phase A — Kelly and Chris as **reference operators** ([onboarding](./ENG-BETA-001.4-BETA-ONBOARDING.md)). Observe · do not instruct.

---

## W-001 — Reference beta journey

W-001 is the **reference beta journey** — the benchmark every later workflow is measured against.

> **A first-time operator successfully completes their first meaningful outcome without engineering assistance.**

Phase A reference operators answer a narrower question:

> **Can a knowledgeable operator accomplish meaningful work without engineering intervention?**

That is not software testing. Everything in the journey supports one meaningful outcome. Workflows 1–6 below are the **journey steps** that compose W-001.

| Step | User action | Success evidence |
| ---- | ----------- | ---------------- |
| **Welcome** | Opens LocalBrain | Understands purpose and where to begin |
| **Workspace** | Creates or enters workspace | No assistance required |
| **Contacts** | Creates a real contact | Contact is searchable and editable |
| **Communications** | Generates a linked draft | Draft is evidence-backed and linked correctly |
| **Review** | Confirms citations and uncertainty | User understands why the draft was produced |
| **Follow-up** | Updates outreach status | Audit entry recorded correctly |
| **Return** | Leaves and comes back | Work resumes seamlessly |

**Total expected duration:** 35–50 minutes first session · 15–25 minutes on return.

### Observation capture (per step)

Sessions test **hypotheses** H-001–H-007 ([schema](../ops/beta-feedback/BETA-OBS-SCHEMA.md)). Record **Evidence NNN** in BETA-OBS session files — positive and negative · register in [Evidence Ledger](../ops/beta-feedback/EVIDENCE-LEDGER.md).

**W-001 passes** when a reference operator completes the journey without engineering assistance — BETA-OBS session complete · metrics recorded in [Evidence Ledger](../ops/beta-feedback/EVIDENCE-LEDGER.md).

---

## Pilot phases (increasing difficulty)

| Phase | Who | Goal |
| ----- | --- | ---- |
| **A — Reference operators** | Kelly · Chris | Does the product match the engineering model? |
| **B — Trusted internal** | Campaign-aware users | Can someone learn the product? |
| **C — Outside beta** | Architecture-unfamiliar users | Can the product teach itself? |

See [001.4 onboarding](./ENG-BETA-001.4-BETA-ONBOARDING.md) for phase gates and observer protocol.

---

## End-to-end session (W-001 journey steps)

```text
Welcome / First access       (Executive Office · Workspace)     → Step: Welcome
        ↓
Workspace orient             (Living Workspace)                 → Step: Workspace
        ↓
Create contact               (Contact Management)               → Step: Contacts
        ↓
Generate draft               (Communications Office + Contacts) → Step: Communications
        ↓
Review evidence              (Executive Intelligence · COM)     → Step: Review
        ↓
Update outreach              (Contact Management)               → Step: Follow-up
        ↓
Exit and return              (Workspace · persistence)          → Step: Return
```

**Total expected duration:** see [W-001 reference journey](#w-001--reference-beta-journey).

---

## Journey step summary (workflows 1–6)

| W-001 step | Workflow | Goal | Success criteria | Subsystems touched | Duration |
| ---------- | -------- | ---- | ---------------- | ------------------ | -------- |
| Welcome | **1. First access** | User reaches a usable workspace and knows where to start | User orients without engineering · understands beta is draft-only | Executive Office · Living Workspace · Program Office (optional) | 5–10 min |
| Workspace | *(within 1)* | Enter beta workspace | Workspace loads · `localbrain` understood | Living Workspace | *(in step 1)* |
| Contacts | **2. Create contact** | Add a real person record | Contact saved · searchable · workspace-scoped | Contact Management | 5–10 min |
| Communications | **3. Generate draft** | Produce evidence-backed communication linked to contact | Draft link created · preview visible · advisory only | Communications Office · Contact Management | 5–10 min |
| Review | **4. Review evidence** | Verify citations and uncertainty posture | User can inspect supporting evidence or understands limits | Executive Intelligence · Communications Office | 5–10 min |
| Follow-up | **5. Update outreach** | Record human follow-up | Audit trail appended · no automated send | Contact Management | 3–5 min |
| Return | **6. Exit and return** | Resume work later | Contact · draft link · audit persist after reload | Living Workspace · Contact Management | 2–5 min return |

---

## Workflow 1 — First access (Welcome · Workspace)

| Field | Detail |
| ----- | ------ |
| **Goal** | User reaches a usable workspace and understands where to start |
| **Primary actor** | Kelly · Chris · trusted beta user |
| **Subsystems** | Executive Office · Living Workspace · (optional) Program Office |
| **Surfaces** | `/` · context panel · `/workspace/localbrain` · optional `/epo` |
| **APIs** | `GET /api/workspaces/localbrain` · `GET /api/epo/project-state` (optional) |

### Success criteria

* Shell loads · Executive Office visible
* User can navigate to Contacts (`/studio/contacts`) without guidance after brief orient
* User understands: **V1 subsystems complete · Commercial Beta preparation active · no email send**

### Beta success

User states in their own words: *"I know where to manage people and that drafts don't send."*

### Manual fallback

| Failure | Fallback |
| ------- | -------- |
| Instance not running | Admin starts backend + frontend · shares URL |
| User lost in nav | Admin walks through command palette · department nav to Contacts |
| Confusing posture signals | Read [launch snapshot](../LOCALBRAIN_V1_LAUNCH_READINESS_SNAPSHOT.md) · use live Program Office API |

### Known limitations (acceptable for beta)

* **No product login gate** — access is trust-based (URL / machine boundary)
* Context panel may mix live API + static mocks until OPS sync
* Program Office is optional for Kelly/Chris — not required for W-001

### Pilot observation (Welcome · Workspace)

| Field | Record during pilot |
| ----- | ------------------- |
| Expected | Opens `/` · reads context · navigates toward Contacts or workspace without prompt |
| Observed | |
| Hesitation | |
| Product or documentation? | |

---

## Workflow 2 — Create contact (Contacts step)

| Field | Detail |
| ----- | ------ |
| **Goal** | Add a real person the beta user cares about |
| **Subsystems** | Contact Management V1 |
| **Surfaces** | `/studio/contacts` |
| **APIs** | `GET/POST/PATCH /api/contacts` · optional CSV `import/preview` + `commit` |

### Success criteria

* `display_name` saved with valid workspace scope (`localbrain`)
* Contact appears in list · search/filter finds it
* Duplicate email policy enforced (same workspace)

### Beta success

Kelly or Chris creates a contact they would actually use — not a throwaway row — without developer tools.

### Manual fallback

| Failure | Fallback |
| ------- | -------- |
| Validation error | Fix required fields · retry |
| Duplicate email rejected | Edit existing contact or use different email |
| CSV import blocked | Fix preview errors · use single-contact create |

### Known limitations (acceptable for beta)

* Workbench hardcodes workspace `localbrain` — no workspace picker
* Rich identity (V2) not available — V1 fields only
* Optional path: CSV bulk import ([seed plan](./ENG-BETA-001.3-SEED-DEMO-DATA-PLAN.md))

### Pilot observation (Contacts)

| Field | Record during pilot |
| ----- | ------------------- |
| Expected | Finds `/studio/contacts` · creates contact with real intent · finds it via search |
| Observed | |
| Hesitation | |
| Product or documentation? | |

---

## Workflow 3 — Generate draft (Communications step)

| Field | Detail |
| ----- | ------ |
| **Goal** | Produce evidence-backed communication linked to the contact |
| **Subsystems** | Communications Office · Contact link layer |
| **Surfaces** | Contact detail · "Generate linked draft" |
| **APIs** | `POST /api/communications/drafts/generate` · `GET /api/contacts/:id/drafts` |

### Success criteria

* Intent label provided · COM generates traceable draft
* Link row persisted · `body_preview` visible on contact detail
* **No send path** invoked

### Beta success

User generates a draft that reads as advisory and is clearly tied to the contact they created.

### Manual fallback

| Failure | Fallback |
| ------- | -------- |
| OpenAI not configured | Admin configures `/settings/providers` ([W-A1 admin](#admin-workflow-w-a1-provider-setup)) |
| COM withhold / empty package | Simplify intent · ensure provider healthy · retry |
| Generation error | Admin checks flight log · retries once |

### Known limitations (acceptable for beta)

* No standalone Communications workbench route — UX lives on contact detail
* Full COM product UI deferred — backend + link layer only
* Draft body is preview text — not formatted email

### Pilot observation (Communications)

| Field | Record during pilot |
| ----- | ------------------- |
| Expected | Enters intent on contact detail · generates draft · sees preview linked to contact |
| Observed | |
| Hesitation | |
| Product or documentation? | |

---

## Workflow 4 — Review evidence (Review step)

| Field | Detail |
| ----- | ------ |
| **Goal** | Verify citations and uncertainty — user trusts the draft is evidence-backed, not authoritative |
| **Subsystems** | Executive Intelligence (traceability contract) · Communications Office (advisory restraint · uncertainty) |
| **Surfaces** | Contact detail draft preview · optional `GET /api/communications/drafts/links/:linkId` · context panel / executive briefing (orientation) |
| **APIs** | Link detail returns `draft_json` with COM artifact · constitutional traceability inherited from ENG-COM-001 |

### Success criteria

* User reads preview and understands **advisory** posture
* User knows citations exist in payload even if not fully rendered in UI
* User does not mistake draft for sent mail or policy directive

### Beta success

User can answer: *"I see what the draft says · I know it's a draft · I know where uncertainty would be flagged."*

### Manual fallback

| Failure | Fallback |
| ------- | -------- |
| Preview too thin for trust | Admin opens link detail JSON · walks through citations with user |
| User expects Send button | Re-read onboarding limitation — outreach is human-record only |

### Known limitations (acceptable for beta)

* **Citation UI not fully productized** — preview + API inspect · not Kelly-grade traceability browser
* Executive Briefing on `/` is institutional context — not per-draft citation viewer
* This workflow validates **inherited COM/EI behavior** — does not reopen subsystem eval

### Pilot observation (Review)

| Field | Record during pilot |
| ----- | ------------------- |
| Expected | Reads preview · understands advisory posture · does not expect Send |
| Observed | |
| Hesitation | |
| Product or documentation? | |

---

## Workflow 5 — Update outreach (Follow-up step)

| Field | Detail |
| ----- | ----- |
| **Goal** | Record human follow-up with institutional audit |
| **Subsystems** | Contact Management V1 |
| **Surfaces** | Contact detail · outreach status + note |
| **APIs** | `POST /api/contacts/:id/outreach` · `GET /api/contacts/:id/outreach-audit` |

### Success criteria

* Outreach status changed (e.g. `none` → `queued`)
* Audit note required and persisted append-only
* No connector · no automated message

### Beta success

User records what they would do next in the real world — as a note — without expecting the system to act.

### Manual fallback

| Failure | Fallback |
| ------- | -------- |
| Empty note rejected | Enter human-authored note · retry |
| Status not saving | Check network · refresh contact detail |

### Known limitations (acceptable for beta)

* Outreach is **record-keeping only** — not CRM pipeline · not send queue
* No calendar/task integration in W-001

### Pilot observation (Follow-up)

| Field | Record during pilot |
| ----- | ------------------- |
| Expected | Changes outreach status · writes required audit note · sees append-only trail |
| Observed | |
| Hesitation | |
| Product or documentation? | |

---

## Workflow 6 — Exit and return (Return step)

| Field | Detail |
| ----- | ------ |
| **Goal** | User leaves and resumes work — state persists correctly |
| **Subsystems** | Living Workspace · Contact Management · COM link persistence |
| **Surfaces** | Browser reload · return to `/studio/contacts` |
| **APIs** | `GET /api/contacts/:id` · drafts · outreach-audit lists |

### Success criteria

* Contact record unchanged except intentional edits
* Linked drafts still listed
* Outreach audit trail intact after reload

### Beta success

User returns next day (or after admin restart **without DB wipe**) and continues from contact detail without re-creating data.

### Manual fallback

| Failure | Fallback |
| ------- | -------- |
| Data missing after admin DB reset | Expected — [seed plan](./ENG-BETA-001.3-SEED-DEMO-DATA-PLAN.md) documents reset policy |
| Wrong workspace | Use `localbrain` only in beta |

### Known limitations (acceptable for beta)

* Single-user SQLite instance — not multi-tenant cloud persistence story
* No formal session/auth — "return" means same machine/instance

### Pilot observation (Return)

| Field | Record during pilot |
| ----- | ------------------- |
| Expected | Reloads or returns later · contact · drafts · audit intact · continues without re-entry |
| Observed | |
| Hesitation | |
| Product or documentation? | |

---

## Admin workflow (W-A1) — Provider setup

*Not part of beta user W-001 · required before Communications step.*

| Field | Detail |
| ----- | ------ |
| **Goal** | Enable COM draft generation safely |
| **Actor** | Steve (admin) |
| **Duration** | 5–10 min |
| **Surface** | `/settings/providers` |
| **Success** | OpenAI connected · connection test pass · one W-001 journey smoke |

See [connector posture matrix](./ENG-BETA-001.2-CONNECTOR-POSTURE-MATRIX.md).

---

## Optional workflow (W-O1) — Program Office orient

| Goal | Steve or Kelly reviews launch posture |
| **Duration** | 5 min |
| **Surface** | `/epo` |
| **Success** | Module rows show Contact + COM complete · ENG-BETA-001 preparation understood |

---

## Explicitly out of beta workflows

| Capability | Reason |
| ---------- | ------ |
| Email / SMS send | Connector disabled · no approval-gated send |
| Volunteer roster | Post-beta |
| Relationship studio as W-001 step | RS not wired to live contacts · exploratory only |
| Campaign CRM · automation · AI scoring | Non-goals |
| V2 rich identity · ledger · merge | RESERVED — [ENG-CONTACT-002](../contact-management/ENG-CONTACT-002-CHARTER.md) not authorized |

---

## What this map drives

| Preparation artifact | Derived from |
| -------------------- | ------------ |
| [Connector posture](./ENG-BETA-001.2-CONNECTOR-POSTURE-MATRIX.md) | Workflows 3–4 · admin W-A1 |
| [Seed / demo data](./ENG-BETA-001.3-SEED-DEMO-DATA-PLAN.md) | Workflows 2 · 6 |
| [Onboarding](./ENG-BETA-001.4-BETA-ONBOARDING.md) | Full path · durations |
| [Feedback & triage](./ENG-BETA-001.5-FEEDBACK-ISSUE-TRIAGE.md) | Fallbacks · failure modes |
| [Release checklist](./ENG-BETA-001.6-RELEASE-CHECKLIST.md) | W-001 journey pass · per-step observation logs |
| ENG-PMO-015 readiness | Reference journey passes · cohort staged per 001.4 |

---

## Repository posture

```text
V1 Engineering:          COMPLETE
V1 Subsystems:           COMPLETE
Commercial Beta Prep:    ACTIVE (this document)
V2 Architecture:         RESERVED · uncommitted
Next act:                Phase 0 admin smoke · Phase A with Kelly (observe · ledger only)
Evidence surface:        docs/ops/beta-feedback/BETA-OBS-001-KELLY-REFERENCE-OPERATOR-SESSION.md
OPS sync:                After prep evidence finalized · not before
```

---

*ENG-BETA-001.1 · Commercial Beta Workflow Map · DRAFT · LocalBrain V1 · 2026*
