# OPERATOR-WALKTHROUGH-001 — Unknown Person → Trusted Relationship

> **Type:** [Canonical Platform Acceptance Test v1.0](./CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md)  
> **Status:** ✅ Governance accepted · PRL-3 automated passing · 2026-07-05  
> **Central question:** Can an organization reliably transform raw information into a trusted relationship?

**PRL-4 live session:** [Operator briefing](./OPERATOR-BRIEFING-FRAME.md) · [Facilitator card](./OPERATOR-SESSION-FACILITATOR-CARD.md) · [Evidence scribe](./EVIDENCE-SCRIBE-GUIDE.md) · [Evidence template](./WALKTHROUGH-001-EVIDENCE-TEMPLATE.md)

This walkthrough exercises **both** platform subsystems end to end and is the **golden acceptance test** for operator readiness.

| Subsystem | Phases exercised |
| --------- | ---------------- |
| **UCIE** (Identity Acquisition) | 1–4 |
| **Contact Management v3** (Relationships) | 5–6 |
| **Campaign visibility** | 7 |

---

## Scenario — County Fair Return

A volunteer returns from Benton County Fair with:

| Source | Content |
| ------ | ------- |
| Handwritten sign-up sheet | OCR intake — **Jane Smith** (name only) |
| Online registration CSV | Kelly (duplicate), Alex, Sam |
| Manual booth entry | **Jordan Lee** |
| Pre-existing in CRM | **Kelly Morgan**, **Chris Patel** (steward) |
| Voter file only | **Jane Smith** — not yet in our database |
| Duplicate discovered | Kelly Morgan in CSV matches existing contact |

Fixture: [county-fair-volunteers.csv](./fixtures/county-fair-volunteers.csv)

---

## Success flow (7 phases)

### Phase 1 — Intake (UCIE)

Sources enter the platform:

- OCR sheet → Import Session
- CSV export → Import Session
- Manual entry → Import Session

**Nothing reaches Contact Management yet.**

Evidence: import accuracy, schema mapping, OCR usability, session creation time.

### Phase 2 — Identity Resolution

For each staged person:

```text
Search → Possible matches → Confidence → Review → (prepare for) Commit
```

Evidence: AI match accuracy, operator intervention rate, resolution time, hesitation points.

Expected outcomes:

| Person | Expected match |
| ------ | -------------- |
| Kelly Morgan | `exact_match` → link existing |
| Alex Rivera | `new_identity` |
| Sam Nguyen | `new_identity` |
| Jane Smith | `review_required` (name-only) |
| Jordan Lee | `new_identity` |

### Phase 3 — Voter Verification

Jane fails confidence (name-only OCR). System creates a **Voter Verification Work Item**.

Operator flow:

1. Claim work item
2. Open VoterView — search Benton / Smith
3. Attach voter record to staged row
4. Complete verification

Evidence: queue usability, county assignment, completion time.

### Phase 4 — Commit

**Now — and only now** — trusted identities enter Contact Management.

- Kelly → **linked** (no duplicate contact)
- Alex, Sam, Jordan, Jane → **created**
- Provenance recorded for every committed field

### Phase 5 — Relationship Cultivation

Operator opens a new contact (Jordan Lee) and assigns:

```text
Context → Steward → Household → Organization → Action
```

Chris Patel (existing steward) receives stewardship. No duplicate CRM entry.

### Phase 6 — Intelligence

Generate **Contact Brief** for Jordan.

Verify:

- Evidence citations present
- Recommendations grounded (not speculative)
- Confidence ratings on every advisory item

Doctrine: **Summarize, don't speculate.**

### Phase 7 — Campaign View

Manager opens Analytics and confirms:

- New contacts visible in portfolio
- Steward assignment reflected
- UCIE queue reduced (work items completed)
- Relationship health aggregates updated

---

## What we're actually testing

This is **not** a unit test suite. We are asking whether the **governed platform** accomplishes its central mission:

> Turn fragmented, messy constituent information into trusted, actionable relationships.

If this walkthrough succeeds with real operators, we improve from **observed behavior** — not speculative features.

---

## Technical acceptance (automated)

```bash
cd backend
node --import tsx --test src/operatorWalkthrough/walkthrough001.test.ts
```

Implementation:

- Scenario fixtures: `backend/src/operatorWalkthrough/walkthrough001Scenario.ts`
- Evidence recorder: `backend/src/operatorWalkthrough/walkthrough001Recorder.ts`
- Shared contracts: `shared/src/operatorReadiness/`

---

## Live operator run

Use [WALKTHROUGH-001-EVIDENCE-TEMPLATE.md](./WALKTHROUGH-001-EVIDENCE-TEMPLATE.md) to capture:

- Start / completion time per phase
- Human interventions
- AI confidence
- Errors and recovery paths
- Hesitation and questions
- Suggested improvements

Complete the **Platform Health Score** table before signing off.

---

## Platform Health Score (operator rubric)

See [Platform Health Score](./PLATFORM-HEALTH-SCORE.md) for the full governance metric.

### Scenario scores (this walkthrough)

| Category | What it measures |
| -------- | ---------------- |
| Intake Experience | CSV, OCR, manual — speed and clarity |
| Identity Resolution | Match quality, duplicate handling |
| Voter Verification | VoterView workflow, county correctness |
| Queue Workflow | Claim, complete, backlog reduction |
| Relationship Assignment | Context, steward, household, org, action |
| AI Brief Accuracy | Evidence-backed, non-speculative brief |
| Manager Visibility | Analytics reflect new relationships and queue state |

### Readiness dimensions (every walkthrough)

| Dimension | What it measures |
| --------- | ---------------- |
| Operator Readiness | Staff complete workflows without engineering |
| Technical Readiness | Engines behave correctly under real inputs |
| Performance Readiness | Phase durations acceptable at scale |
| Training Readiness | New staff learn from documentation |
| Operational Readiness | Queues, resolution, commit paths scale |
| Data Quality Readiness | Imported data trustworthy after governance |
| Volunteer Readiness | Volunteers execute voter/OCR/queue workflows |
| Manager Readiness | Analytics reflect reality for decision-makers |

**Overall Operator Readiness** = scenario average · **Overall Readiness** = dimension average

Target for PRL-6: **≥ 90%** overall, no dimension below **85%** (operator judgment).

Automated technical scoring provides the PRL-3 floor; operators adjust at PRL-4+.
