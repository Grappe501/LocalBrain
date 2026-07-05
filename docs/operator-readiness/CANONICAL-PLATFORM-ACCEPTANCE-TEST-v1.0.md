# Canonical Platform Acceptance Test v1.0

> **Status:** ✅ **ACCEPTED** · Governance Assessment · 2026-07-05  
> **Walkthrough:** [OPERATOR-WALKTHROUGH-001](./WALKTHROUGH-001-SCENARIO.md) — *Unknown Person → Trusted Relationship*  
> **Classification:** Canonical Platform Acceptance Test — not an integration test, not a feature test

---

## Governance determination

| Field | Value |
| ----- | ----- |
| **Acceptance ID** | `CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0` |
| **Walkthrough ID** | `OPERATOR-WALKTHROUGH-001` |
| **Verdict** | ✅ **ACCEPTED** |
| **Platform Readiness Level achieved** | **PRL-3** — Automated Acceptance Passing |
| **Next gate** | **PRL-4** — Internal Operator Validated |

This is the first **operational proof** that the governed platform fulfills its central mission:

> Can an organization reliably transform raw information into a trusted relationship?

Every significant future change **must continue to pass** this acceptance test unless governance explicitly supersedes v1.0.

---

## What this test proves

This is **platform validation**, not software development in the narrow sense. It exercises every trust boundary the platform was built to govern.

### Identity Trust (UCIE)

| Capability | Certified doctrine preserved |
| ---------- | ---------------------------- |
| Intake (CSV, OCR, manual) | Stage, don't commit |
| Schema discovery & mapping | Review before merge |
| Identity resolution | Review before merge |
| Voter verification | Review before merge |
| Provenance on commit | Provenance, always |
| Commit discipline | Stage, don't commit |

### Relationship Trust (Contact Management v3)

| Capability | Doctrine |
| ---------- | -------- |
| Context assignment | Promote |
| Stewardship | Reference |
| Household | Group |
| Organization membership | Belong |
| Action tasks | — |

All established from a newly acquired identity — no duplicate CRM entry on duplicate intake.

### Intelligence Trust

| Capability | Doctrine |
| ---------- | -------- |
| Contact Brief | Summarize, don't speculate |
| Relationship Analytics | Aggregate, don't centralize |

Knowledge derived from authoritative engines — not invented.

---

## Automated acceptance

```bash
cd backend
node --import tsx --test src/operatorWalkthrough/walkthrough001.test.ts
```

| Artifact | Location |
| -------- | -------- |
| Scenario fixtures | `backend/src/operatorWalkthrough/walkthrough001Scenario.ts` |
| Evidence recorder | `backend/src/operatorWalkthrough/walkthrough001Recorder.ts` |
| Shared contracts | `shared/src/operatorReadiness/` |
| Operator scenario doc | [WALKTHROUGH-001-SCENARIO.md](./WALKTHROUGH-001-SCENARIO.md) |
| Evidence template | [WALKTHROUGH-001-EVIDENCE-TEMPLATE.md](./WALKTHROUGH-001-EVIDENCE-TEMPLATE.md) |

---

## Benchmark policy

| Change type | Requirement |
| ----------- | ----------- |
| UCIE intake, resolution, commit | Must pass walkthrough #1 |
| Contact v3 relationship engines | Must pass walkthrough #1 |
| Intelligence (brief, analytics) | Must pass walkthrough #1 |
| Architecture change | Requires new ADR + acceptance test version increment (v1.1+) |
| Queue / connector hardening | Must pass walkthrough #1; operational evidence may inform iteration |

**Regression on this test is a platform governance event** — not merely a CI failure.

---

## Walkthrough #1 freeze (after PRL-4)

When PRL-4 completes successfully:

1. **Freeze** [OPERATOR-WALKTHROUGH-001](./WALKTHROUGH-001-SCENARIO.md) — do not change the scenario, fixture, or success criteria.
2. **Create** Walkthrough #2, then #3 — new scenarios for new evidence domains.
3. **Require** every future release to still pass Walkthrough #1 — automated (CPAT) and operator regression.

Walkthrough #1 becomes the **operator-experience regression suite** — a governed asset, not tribal knowledge.

| Walkthrough | Status | Policy |
| ----------- | ------ | ------ |
| **#1** Unknown Person → Trusted Relationship | ✅ Canonical · CPAT v1.0 | **Frozen after PRL-4** |
| **#2** | Planned post-PRL-4 | New scenario · new evidence |
| **#3** | Planned post-PRL-4 | New scenario · new evidence |

Shared contract: `WALKTHROUGH_001_FREEZE_POLICY` (`shared/src/operatorReadiness/evidenceGovernance.ts`)

---

## Platform Readiness Level at acceptance

| Level | Status at acceptance |
| ----- | -------------------- |
| PRL-1 Architecture Complete | ✅ |
| PRL-2 Certified Core Implemented | ✅ |
| PRL-3 Automated Acceptance Passing | ✅ |
| PRL-4 Internal Operator Validated | ⏳ Pending |
| PRL-5 External Pilot Validated | ⏳ Pending |
| PRL-6 Production Ready | ⏳ Pending |

See [Platform Readiness Levels](./PLATFORM-READINESS-LEVELS.md).

---

## Operational evidence (first candidate)

The automated run surfaced an observation that is **not classified as a bug**:

> **OEC-001:** Jane Smith's OCR row may receive **two identity-review work items** — one on initial name-only resolution, one after voter attachment re-resolves the row.

**Classification:** [Operational Evidence Candidate](./OPERATIONAL-EVIDENCE-REGISTER.md#oec-001-jane-smith-double-identity-review)

**Governance question:** Should identity review and voter verification collapse into one work item after voter attachment?

**Disposition:** Capture operator evidence during PRL-4. Do not redesign the queue preemptively.

---

## Sign-off

| Role | Determination | Date |
| ---- | ------------- | ---- |
| Governance reviewer | ✅ ACCEPTED — Canonical Platform Acceptance Test v1.0 | 2026-07-05 |
| Engineering | PRL-3 automated acceptance passing | 2026-07-05 |
| Operator readiness | PRL-4 pending — internal walkthrough with evidence templates | — |

---

*Canonical Platform Acceptance Test v1.0 · LocalBrain Governed Platform · 2026*
