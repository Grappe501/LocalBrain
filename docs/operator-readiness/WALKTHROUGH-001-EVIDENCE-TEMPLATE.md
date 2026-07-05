# OPERATOR-WALKTHROUGH-001 — Evidence Package Template

> **Walkthrough:** Unknown Person → Trusted Relationship  
> **Use:** One completed package per live operator session. Operational evidence — not bug reports.  
> **Session kit:** [Briefing frame](./OPERATOR-BRIEFING-FRAME.md) · [Facilitator card](./OPERATOR-SESSION-FACILITATOR-CARD.md) · [Scribe guide](./EVIDENCE-SCRIBE-GUIDE.md)

**Discipline:** Scribe captures during the session. Interpretation and recommendations happen **after** sign-off.

---

## Session metadata

| Field | Value |
| ----- | ----- |
| Walkthrough ID | OPERATOR-WALKTHROUGH-001 |
| Workspace | |
| Operator | |
| Facilitator | |
| Evidence Scribe | |
| Date | |
| Build / commit | |
| Environment | local / staging / production |
| Scenario variant | County Fair (default) |
| Screen recording | yes / no · ref: |

**Central question:** Can an organization reliably transform raw information into a trusted relationship?

---

## Session integrity

| Check | ✓ |
| ----- | - |
| Test data loaded | |
| Fixture ready | |
| Facilitator card followed | |
| Dedicated scribe (not facilitator) | |

### Contamination log (if assistance was necessary)

| Time | Reason | Level (P0/P1) | Who intervened |
| ---- | ------ | ------------- | -------------- |
| | | | |
| | | | |

*None* ☐ — session completed without navigation hints or architectural explanation

---

## Post-session debrief (operator voice — after walkthrough only)

| Question | Response |
| -------- | -------- |
| What felt easiest? | |
| What felt hardest? | |
| What surprised you? | |
| Where were you least confident? | |
| If this were your job tomorrow, what would worry you? | |
| What one thing would you change first? | |

---

## Platform Health Score

Score each category **0–100%** based on operator experience (clarity, speed, confidence, recovery).  
Automated technical run may supply baseline scores; adjust for observed hesitation and UX friction.

| Category | Score | Notes |
| -------- | ----: | ----- |
| Intake Experience | | CSV, OCR, manual sessions |
| Identity Resolution | | Matches, duplicates, review |
| Voter Verification | | VoterView, county, attach |
| Queue Workflow | | Claim, complete, backlog |
| Relationship Assignment | | Context, steward, household, org, action |
| AI Brief Accuracy | | Evidence, recommendations, confidence |
| Manager Visibility | | Analytics, queue reduction, portfolio |
| **Overall Operator Readiness** | | **Weighted average** |

**Launch readiness guideline (PRL-6):** ≥ 90% overall readiness, no dimension below 85%.

### Readiness dimensions (longitudinal — all walkthroughs)

| Dimension | Score | Notes |
| --------- | ----: | ----- |
| Operator Readiness | | |
| Technical Readiness | | |
| Performance Readiness | | |
| Training Readiness | | |
| Operational Readiness | | |
| Data Quality Readiness | | |
| Volunteer Readiness | | |
| Manager Readiness | | |
| **Overall Readiness** | | **Dimension average** |

**Platform Readiness Level at capture:** PRL-___

---

## Operational evidence candidates observed

| ID | Observation | Operator notes |
| -- | ----------- | ---------------- |
| [OEC-001](./OPERATIONAL-EVIDENCE-REGISTER.md#oec-001-jane-smith-double-identity-review) | Jane double identity review | Did operators notice duplicate queue items? |

---

## Phase evidence

### Phase 1 — Intake (UCIE)

| Field | Value |
| ----- | ----- |
| Started at | |
| Completed at | |
| Duration | |
| Human interventions | |
| AI confidence (avg) | |
| Technical pass | yes / no |

**Errors / recovery:** *(scribe — observable facts only)*

**Hesitation / questions:** *(verbatim where possible)*

**Notes for analyst** *(post-session — not during walkthrough):*


---

### Phase 2 — Identity Resolution

| Field | Value |
| ----- | ----- |
| Started at | |
| Completed at | |
| Duration | |
| Human interventions | |
| AI confidence (avg) | |
| Technical pass | yes / no |

**Match outcomes observed:**

| Person | Outcome | Operator action |
| ------ | ------- | ----------------- |
| Kelly Morgan | | |
| Alex Rivera | | |
| Sam Nguyen | | |
| Jane Smith | | |
| Jordan Lee | | |

**Errors / recovery:** *(scribe — observable facts only)*

**Hesitation / questions:** *(verbatim where possible)*

**Notes for analyst** *(post-session — not during walkthrough):*


---

### Phase 3 — Voter Verification

| Field | Value |
| ----- | ----- |
| Started at | |
| Completed at | |
| Duration | |
| Human interventions | |
| Technical pass | yes / no |

**Work items:** OCR review · Voter verification · Identity review

**Errors / recovery:** *(scribe — observable facts only)*

**Hesitation / questions:** *(verbatim where possible)*

**Notes for analyst** *(post-session — not during walkthrough):*


---

### Phase 4 — Commit

| Field | Value |
| ----- | ----- |
| Started at | |
| Completed at | |
| Duration | |
| Human interventions | |
| Technical pass | yes / no |

**Commit actions:**

| Person | Action (linked / created) | Provenance verified |
| ------ | ------------------------- | ------------------- |
| | | |

**Errors / recovery:**

---

### Phase 5 — Relationship Cultivation

| Field | Value |
| ----- | ----- |
| Started at | |
| Completed at | |
| Duration | |
| Human interventions | |
| Technical pass | yes / no |

**Assignments completed:**

- [ ] Context
- [ ] Steward
- [ ] Household
- [ ] Organization
- [ ] Action

**Duplicate entry avoided:** yes / no

**Notes for analyst** *(post-session — not during walkthrough):*

---

### Phase 6 — Intelligence

| Field | Value |
| ----- | ----- |
| Started at | |
| Completed at | |
| Duration | |
| Human interventions | |
| AI confidence (avg) | |
| Technical pass | yes / no |

**Brief checks:**

- [ ] Every section cites evidence
- [ ] Recommendations non-speculative
- [ ] Confidence on advisory items

**Notes for analyst** *(post-session — not during walkthrough):*

---

### Phase 7 — Campaign View

| Field | Value |
| ----- | ----- |
| Started at | |
| Completed at | |
| Duration | |
| Human interventions | |
| Technical pass | yes / no |

**Manager visibility checks:**

- [ ] New contacts in portfolio
- [ ] Steward assignment visible
- [ ] Queue / backlog reduced
- [ ] Relationship health updated

**Notes for analyst** *(post-session — not during walkthrough):*

---

## Sign-off

| Role | Name | Date | Verdict |
| ---- | ---- | ---- | ------- |
| Operator | | | pass / pass with notes / fail |
| Facilitator | | | session integrity confirmed |
| Evidence Scribe | | | capture complete |
| Evidence analyst | | | package dispositioned |
| Governance reviewer | | | |

**Summary narrative** (2–4 sentences — what worked, what blocked real operators):

---

## Appendix — JSON evidence export

Automated runs produce a `Walkthrough001EvidencePackage` (see `shared/src/operatorReadiness/`).  
Paste or attach JSON from test output when correlating live and technical acceptance.

```json
{
  "walkthrough_id": "OPERATOR-WALKTHROUGH-001",
  "technical_acceptance_pass": true,
  "platform_health": {
    "overall_operator_readiness": 93,
    "categories": {}
  }
}
```
