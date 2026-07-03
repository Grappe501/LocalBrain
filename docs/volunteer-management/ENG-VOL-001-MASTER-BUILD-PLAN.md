# ENG-VOL-001 — Volunteer Management · Master Build Plan

> **Status:** **DRAFT** — master build plan · authorization pending  
> **Module:** Volunteer Management (Field Operations)  
> **Parent office:** [Campaign Director](../LOCALBRAIN_EXECUTIVE_OFFICE_STRUCTURE.md#dept-cam-001--campaign-director-reserved) · `DEPT-CAM-001`  
> **Slice family:** `ENG-VOL-001.x` · execution packets `LB-OS-092+` (reserved)  
> **Route (planned):** `/studio/volunteers` · Nav: **Volunteers**  
> **Prerequisite:** LocalBrain V1 **Commercial Beta** gate · Memory OS · Relationship studio · Program Office module loader (`LB-OS-106`)

---

## Position in the roadmap

```text
V1 critical path (binding today):
  Communications Office → Contact Management V1 (ENG-CONTACT-001) → Commercial Beta

Next module (this plan):
  ENG-VOL-001 Volunteer Management — basic field operations for recruitment, assignment, and attendance
```

This plan does **not** authorize implementation. It defines scope, slices, contracts, and acceptance gates so the module can be chartered after V1 beta without reopening architecture.

**Governance:** Charter → slice authorization → implementation → verification → PMO acceptance → module evaluation → Program Office registration.

---

## Architectural question (binding)

> **Can the institution maintain a trustworthy volunteer roster — who is available, where they serve, and whether the field plan is covered — without becoming a CRM, payroll system, or outbound messaging platform?**

One question. Everything in V1 basic scope must answer it.

---

## Problem statement

Campaign and nonprofit executives lose field momentum when volunteer truth is scattered across spreadsheets, group texts, and memory. The executive needs:

- A **single roster** tied to real people (relationships), not duplicate contact rows
- **Shift and event coverage** legible before doors open
- **Recruitment pipeline** state (lead → trained → active → dormant)
- **Gap signals** when volunteer count falls below plan — for Campaign Director escalation, not inbox noise

LocalBrain already models people (Relationship studio), institutional memory (Memory OS), and executive briefing (Chief of Staff). Volunteer Management is the **operational layer** on top — not a replacement for those systems.

---

## V1 basic scope

### In scope (ENG-VOL-001 basic)

| Capability | Description |
| ---------- | ----------- |
| **Volunteer registry** | Canonical volunteer record linked to `relationship_id` · status · territory (county/region) |
| **Skills & roles** | Tags (phone bank, canvass, event setup, driver, etc.) · optional training-complete flag |
| **Availability** | Weekly windows or date-specific availability · timezone-aware |
| **Events & shifts** | Campaign events with shift slots · capacity · location · lead contact |
| **Assignment** | Sign-up / assign volunteer to shift · waitlist when full |
| **Check-in** | Mark arrived · no-show · partial shift · audit trail |
| **Pipeline stages** | `lead` → `contacted` → `trained` → `active` → `inactive` → `archived` |
| **Plan vs actual** | Per event and per territory: volunteers needed vs confirmed vs checked-in |
| **CoS elevation** | Deterministic gap facts for Campaign Director · no autonomous outreach |
| **Memory hooks** | Episodes for training sessions · Facts for “volunteer X trained on date Y” |

### Explicitly out of scope (V1 basic)

| Excluded | Reason |
| -------- | ------ |
| Mass SMS / email sends | Communications Office · human review · separate module |
| Background checks / compliance automation | Legal / HR — future slice or external system |
| Payroll · stipends · expense reimbursement | CFO domain · campaign finance separation |
| Voter file matching · walk lists | Data & Intelligence · voter data governance |
| Autonomous recruitment | Doctrine — recommend and draft only |
| Replacing Relationship studio | Volunteers **reference** relationships; they do not own contact graph |
| Full CRM | Relationship & Network Intelligence owns social knowledge |

---

## Design principles

```text
1. Relationship-first   — every volunteer links to a Relationship Profile
2. Deterministic ops    — roster state is inspectable; no LLM scoring of volunteers
3. Advisory intelligence — gap detection elevates to CoS; never auto-assign without policy
4. Append-friendly audit — check-ins and stage changes are logged, not silently overwritten
5. Territory-aware      — county/region is first-class for campaign field ops
6. Plugin module        — lazy-loaded studio; no shell coupling before LB-OS-106
```

---

## Held constant (inherited, not under evaluation)

| Layer | Artifact |
| ----- | -------- |
| Memory OS | Institutional Cognition Foundation V1 · five substrates |
| Relationship studio | LB-OS-015 · social knowledge graph |
| Executive Office | Certified shell · escalation policies |
| Program Office | Build state · module registration |
| Permission engine | LB-OS-003 · workspace-scoped writes |

---

## Core data model

### Entities

```text
Volunteer
  volunteer_id          uuid · primary key
  relationship_id       uuid · FK → relationship profile (required)
  workspace_id          uuid · campaign workspace scope
  display_name          string · denormalized for roster views
  status                pipeline stage enum
  territory_id          uuid · county/region
  primary_role          string? · optional label
  training_complete_at  iso datetime?
  notes                 string? · staff-only
  created_at / updated_at

VolunteerSkill
  volunteer_id + skill_code   composite key

VolunteerAvailability
  availability_id       uuid
  volunteer_id          uuid
  day_of_week?          0–6 · recurring
  specific_date?        iso date · one-off
  start_time / end_time local time
  timezone

FieldEvent
  event_id              uuid
  workspace_id          uuid
  title                 string
  event_type            enum: canvass | phone_bank | rally | training | other
  territory_id          uuid?
  location_label        string
  starts_at / ends_at     iso datetime
  volunteers_needed     int
  created_by            actor ref

Shift
  shift_id              uuid
  event_id              uuid
  label                 string · e.g. "Morning canvass"
  starts_at / ends_at   iso datetime
  capacity              int
  lead_volunteer_id?    uuid

ShiftAssignment
  assignment_id         uuid
  shift_id              uuid
  volunteer_id          uuid
  status                enum: confirmed | waitlisted | cancelled
  assigned_at           iso datetime
  assigned_by           actor ref

CheckIn
  check_in_id           uuid
  assignment_id         uuid
  status                enum: arrived | no_show | left_early | completed
  checked_in_at         iso datetime
  checked_in_by         actor ref
  note                  string?

Territory
  territory_id          uuid
  workspace_id          uuid
  name                  string · e.g. "Benton County"
  parent_territory_id?  uuid · optional hierarchy

RecruitmentPlan
  plan_id               uuid
  workspace_id          uuid
  territory_id?         uuid
  event_id?             uuid · optional tie to event
  volunteers_target     int
  effective_from / to   iso date range
```

### Shared contract (planned)

Package: `@localbrain/shared` · `shared/src/volunteerManagement/`

```text
VOLUNTEER_MANAGEMENT_VERSION = "ENG-VOL-001.1"
PipelineStage · AssignmentStatus · CheckInStatus · EventType enums
Volunteer · FieldEvent · Shift · ShiftAssignment · CheckIn · Territory DTOs
VolunteerGapReport · TerritoryCoverageSummary
```

---

## Module architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Frontend — Volunteer Studio (`/studio/volunteers`)         │
│  Overview · Roster · Events · Assignments · Territories · Learn │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST `/api/volunteers/*`
┌──────────────────────────▼──────────────────────────────────┐
│  backend/src/volunteerManagement/                            │
│  volunteerService · eventService · assignmentService         │
│  checkInService · gapReportService · territoryService        │
│  validators (deterministic) · SQLite persistence             │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 Relationship         Memory OS          Program Office
 (identity link)    (Episode/Fact hooks)  (module progress)
```

**Persistence:** SQLite tables in workspace-scoped schema · migrations under `backend/migrations/` · no cross-workspace volunteer leakage.

**Permissions:** Read roster = workspace member · assign/check-in = field lead role · admin = workspace owner · enforced via LB-OS-003 permission engine.

---

## UI — six tabs (V1 basic)

| Tab | Purpose |
| --- | ------- |
| **Overview** | Coverage score · events this week · gaps · Campaign Director recommendation stub |
| **Roster** | Search/filter volunteers · pipeline stage · skills · territory · link to Relationship profile |
| **Events** | Upcoming field events · create event/shift · capacity bars |
| **Assignments** | Shift board · drag-or-select assign · waitlist · check-in actions |
| **Territories** | County list · volunteers per territory · plan vs actual rollup |
| **Learn** | OJT stub — field organizing, shift lead basics, volunteer retention |

**Experience target:** L2 interactive · L3 Chief insights on Overview (gap elevation copy only).

---

## API surface (V1 basic)

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/api/volunteers` | List roster · filter by territory, stage, skill |
| POST | `/api/volunteers` | Create volunteer from relationship_id |
| GET | `/api/volunteers/:id` | Volunteer detail |
| PATCH | `/api/volunteers/:id` | Update stage, skills, availability |
| GET | `/api/volunteers/events` | List field events |
| POST | `/api/volunteers/events` | Create event + shifts |
| POST | `/api/volunteers/shifts/:id/assign` | Assign or waitlist |
| POST | `/api/volunteers/assignments/:id/check-in` | Record attendance |
| GET | `/api/volunteers/gaps` | Plan vs actual · territory and event rollups |
| GET | `/api/volunteers/territories` | Territory tree |

All mutations return deterministic validation errors · no LLM in write path.

---

## Integrations

### Relationship studio (LB-OS-015)

- Creating a volunteer **requires** an existing `relationship_id`
- Roster row links out to `/studio/relationships` profile
- Do not duplicate email/phone on volunteer row — read through relationship when needed

### Memory OS

| Action | Substrate |
| ------ | --------- |
| Volunteer training session held | Episode |
| “Volunteer X completed training” | Fact (with provenance to Episode) |
| Shift check-in at scale | Episode (batch) optional — V1 can defer batch Episode |

### Campaign Director (DEPT-CAM-001)

| Signal | Escalation |
| ------ | ---------- |
| Event &lt; 48h · confirmed &lt; 80% of needed | Notify Chief of Staff |
| Event &lt; 24h · confirmed &lt; plan | Interrupt executive (per standing orders) |
| Territory recruitment &lt; plan for 7 days | Monitor → notify if trend worsens |

Gap report is **input** to executive briefing — not a separate alert channel.

### Communications Office (future)

- Draft recruitment appeals from Evidence Package + gap report
- V1 basic: export volunteer segment CSV only · no send

---

## Implementation phases

### Phase 0 — Charter & registration (no code)

| Deliverable | Owner |
| ----------- | ----- |
| ENG-VOL-001 charter authorization | Steve / PMO |
| Capability registry entry `CAP-FUT-VOL-001` | OPS |
| Program Office module def + weight area | ENG-BLD |
| Route registration in module loader | ENG-SRF |

### Phase 1 — Registry & territory (ENG-VOL-001.1)

**Question:** Can every volunteer be uniquely identified and territorially scoped without duplicating the relationship graph?

| Deliverable | Evidence |
| ----------- | -------- |
| Shared DTOs + validators | Contract tests |
| `volunteers` + `territories` tables | Migration |
| CRUD API + Roster tab | API tests |
| Link to relationship profile | Integration test |

**Exit:** R1–R5 behavioral tests PASS (see below).

### Phase 2 — Events & shifts (ENG-VOL-001.2)

**Question:** Can field leadership define capacity-bound shifts that volunteers can be assigned to?

| Deliverable | Evidence |
| ----------- | -------- |
| Events + shifts schema | Migration |
| Events + Assignments tabs (read) | UI smoke |
| Assignment API with capacity enforcement | API tests |

**Exit:** E1–E4 tests PASS.

### Phase 3 — Check-in & pipeline (ENG-VOL-001.3)

**Question:** Can the institution record who showed up and track recruitment stage transitions with audit?

| Deliverable | Evidence |
| ----------- | -------- |
| Check-in API + UI actions | API tests |
| Pipeline stage transitions | State machine tests |
| Append-only check-in log | Audit test |

**Exit:** C1–C4 tests PASS.

### Phase 4 — Gap intelligence (ENG-VOL-001.4)

**Question:** Can the system deterministically report volunteer gaps for Campaign Director elevation?

| Deliverable | Evidence |
| ----------- | -------- |
| `RecruitmentPlan` + gap rollup service | Unit tests |
| Overview tab coverage score | UI + API |
| CoS briefing hook (deterministic facts) | Integration test |

**Exit:** G1–G3 tests PASS.

### Phase 5 — Module evaluation & certification

| Gate | Criterion |
| ---- | --------- |
| Kelly Sandbox | Roster + assign + check-in workflow against sandbox workspace |
| Module certification | 6 dimensions PASS (navigation, experience, tests, security, kelly, launch) |
| Program Office | `volunteer_management` weight area · progress 100% |

---

## Behavioral evidence matrix (V1 basic)

### ENG-VOL-001.1 — Registry (R1–R5)

| ID | Criterion | Method |
| -- | --------- | ------ |
| R1 | Volunteer cannot be created without `relationship_id` | validator test |
| R2 | Duplicate volunteer per relationship per workspace rejected | API test |
| R3 | Territory assignment filters roster correctly | API test |
| R4 | Pipeline stage transitions follow allowed enum only | validator test |
| R5 | Archived volunteer excluded from active assignment queries | API test |

### ENG-VOL-001.2 — Events (E1–E4)

| ID | Criterion | Method |
| -- | --------- | ------ |
| E1 | Shift capacity cannot be exceeded without waitlist | API test |
| E2 | Assignment is idempotent per volunteer per shift | API test |
| E3 | Cancelled assignment frees capacity | API test |
| E4 | Event list scoped to workspace only | API test |

### ENG-VOL-001.3 — Check-in (C1–C4)

| ID | Criterion | Method |
| -- | --------- | ------ |
| C1 | Check-in requires confirmed assignment | API test |
| C2 | No-show does not delete assignment | API test |
| C3 | Check-in audit row is immutable | API test |
| C4 | Stage change to `active` on first completed check-in (policy flag) | integration test |

### ENG-VOL-001.4 — Gaps (G1–G3)

| ID | Criterion | Method |
| -- | --------- | ------ |
| G1 | Gap = needed − confirmed (deterministic) | unit test |
| G2 | Territory rollup matches sum of events | unit test |
| G3 | Briefing hook receives gap fact when threshold breached | integration test |

---

## LB-OS execution packets (reserved)

| Packet | Slice | Summary |
| ------ | ----- | ------- |
| LB-OS-092 | ENG-VOL-001.1 | Volunteer registry + territories + Roster tab |
| LB-OS-093 | ENG-VOL-001.2 | Events, shifts, assignment API |
| LB-OS-094 | ENG-VOL-001.3 | Check-in, pipeline, audit |
| LB-OS-095 | ENG-VOL-001.4 | Gap report + Overview + CoS hook |
| LB-OS-096 | ENG-VOL-001 | Module certification pass |

One packet = one Burt execution = one commit.

---

## Test strategy

```text
Unit:        validators · gap math · stage machine
API:         supertest per route · workspace isolation
Integration: relationship link · briefing hook · permission denied cases
UI smoke:    liveSurface.test.ts route registration (post-implementation)
```

Target: **≥ 20 tests** across four slices before module evaluation.

Test globs (planned):

```text
backend/src/volunteerManagement/volunteerRegistry.test.ts
backend/src/volunteerManagement/eventsAndAssignments.test.ts
backend/src/volunteerManagement/checkIn.test.ts
backend/src/volunteerManagement/gapReport.test.ts
```

---

## PMO ceremonies (planned)

| Ceremony | When |
| -------- | ---- |
| ENG-PMO-VOL-001 | Charter authorization |
| ENG-PMO-VOL-002 | Registry slice acceptance (R1–R5) |
| ENG-PMO-VOL-003 | Events slice acceptance (E1–E4) |
| ENG-PMO-VOL-004 | Check-in slice acceptance (C1–C4) |
| ENG-PMO-VOL-005 | Gap intelligence acceptance (G1–G3) |
| ENG-PMO-VOL-006 | Module complete evaluation |

---

## Dependencies

| Dependency | Status | Notes |
| ---------- | ------ | ----- |
| LB-OS-106 Modularity gate | ✅ | Module loader required |
| LB-OS-015 Relationship studio | ✅ | `relationship_id` source |
| LB-OS-003 Permissions | ✅ | Workspace write gates |
| Memory OS Wave 1 | ✅ | Optional Fact/Episode hooks in 001.3+ |
| Commercial Beta | ⏳ | Recommended before charter authorization |
| Communications Office | ⏳ | Not blocking basic roster |

---

## Risks & mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Scope creep into CRM | Relationship-first rule · no contact fields on volunteer |
| Scope creep into messaging | Export only in V1 · Communications Office owns send |
| Duplicate volunteer data | Unique constraint (workspace_id, relationship_id) |
| Cross-workspace leakage | All queries workspace-scoped · permission tests |
| LLM in assignment decisions | Deterministic rules only · advisory copy separate |

---

## Success metrics (module complete)

| Metric | Target |
| ------ | ------ |
| End-to-end workflow | Create volunteer → assign shift → check in → gap visible on Overview |
| Test passage | All R/E/C/G behavioral tests PASS |
| CoS integration | Gap fact appears in briefing when threshold breached |
| Certification | Module PASS · Kelly Sandbox golden test |
| Executive judgment | Field lead can answer “are we covered Saturday?” in one screen |

---

## Institutional posture (target)

```text
Engineering truth:     Slices 001.1–001.4 COMPLETE · behavioral evidence on disk
Operational truth:     Volunteer Management · basic field ops · Campaign Director fed
Next repository act:   ENG-PMO-VOL-001 charter authorization (after Commercial Beta)
```

---

## Document map

| Document | Status |
| -------- | ------ |
| **This plan** | DRAFT |
| `ENG-VOL-001-CHARTER.md` | Not created — extract from § Architectural question on authorization |
| `slices/ENG-VOL-001.1-REGISTRY.md` | Not created — create at slice authorization |
| `slices/README.md` | Not created |

---

*ENG-VOL-001 · Volunteer Management · Master Build Plan · LocalBrain · 2026*
