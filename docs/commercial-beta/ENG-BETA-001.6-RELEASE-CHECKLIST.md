# ENG-BETA-001.6 — Commercial Beta Release Checklist

> **Type:** Release preparation evidence · not readiness evaluation · not beta authorization  
> **Status:** **DRAFT** — 2026-07-03  
> **Parent:** [ENG-BETA-001 Commercial Beta Preparation](./ENG-BETA-001-COMMERCIAL-BETA-PREPARATION.md)  
> **Readiness gate:** ENG-PMO-015 or successor · **not opened** by this document

---

## Purpose

Consolidated checklist for **preparation COMPLETE** — all evidence exists before OPS sync and readiness evaluation.

Distinct from [V1 Launch Criteria](../LOCALBRAIN_V1_LAUNCH_CRITERIA.md) (factory/manufacturing) and from **readiness** (whether beta is authorized).

---

## Preparation evidence (documents)

| # | Artifact | Status | Area |
| - | -------- | ------ | ---- |
| 1 | [ENG-BETA-001 charter](./ENG-BETA-001-COMMERCIAL-BETA-PREPARATION.md) | **OPENED** · committed | Governance |
| 2 | [001.1 Workflow map](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md) | DRAFT | Product |
| 3 | [001.2 Connector posture](./ENG-BETA-001.2-CONNECTOR-POSTURE-MATRIX.md) | DRAFT | Connector |
| 4 | [001.3 Seed/demo data plan](./ENG-BETA-001.3-SEED-DEMO-DATA-PLAN.md) | DRAFT | Data |
| 5 | [001.4 Beta onboarding](./ENG-BETA-001.4-BETA-ONBOARDING.md) | DRAFT | User readiness |
| 6 | [001.5 Feedback & triage](./ENG-BETA-001.5-FEEDBACK-ISSUE-TRIAGE.md) | DRAFT | Support |
| 7 | This checklist | DRAFT | Release |

**Preparation docs complete when:** all items 2–7 marked **FINAL** · charter remains OPENED until readiness.

---

## Inherited V1 subsystems (verify — do not re-evaluate)

| Subsystem | Evidence | ☐ |
| --------- | -------- | - |
| Executive Office | Module certified | ☐ |
| Empty Brain Factory | v1.0.0-factory-certified | ☐ |
| Memory OS | ENG-PMO-005 · 100% | ☐ |
| Executive Intelligence | ENG-PMO-009 · pipeline closed | ☐ |
| Communications Office | ENG-PMO-013 · 18/18 tests | ☐ |
| Contact Management | ENG-PMO-014 · 23/23 tests | ☐ |

---

## Product — W-001 reference journey (Phase A)

| Check | ☐ |
| ----- | - |
| Phase 0: Admin W-001 smoke pass (W-A1 provider · all steps) | ☐ |
| Phase A: Kelly · BETA-OBS-001 · evidence complete · metrics recorded | ☐ |
| Phase A: Chris · BETA-OBS-002 · evidence complete · metrics recorded | ☐ |
| Hypothesis register updated (H-001–H-007) | ☐ |
| Vocabulary log reviewed | ☐ |
| Final question captured per session | ☐ |
| Phase B gate documented (human-help trending down) | ☐ |
| No send button / send route in W-001 path | ☐ |

---

## Operational (pre OPS-sync)

| Check | ☐ |
| ----- | - |
| Program Office API reflects subsystem COMPLETE posture | ☐ |
| Known mock/static drift documented (if any) pending OPS sync | ☐ |
| Executive briefing coherent with ENG-BETA-001 OPENED | ☐ |

*Full operational sync is **step after** this checklist — OPS commit · not part of prep doc completion.*

---

## Data

| Check | ☐ |
| ----- | - |
| Seed plan reviewed · no personal Steve data in Memory OS path | ☐ |
| Synthetic or user-owned contacts only | ☐ |
| Instance reset procedure documented | ☐ |

---

## Connectors

| Check | ☐ |
| ----- | - |
| OpenAI configured for draft generation | ☐ |
| Email/SMS/calendar outbound **disabled** per matrix | ☐ |
| Reserved connectors show `reserved` in readiness report | ☐ |
| Admin can explain posture to beta user | ☐ |

---

## Support

| Check | ☐ |
| ----- | - |
| [BETA-OBS schema](../ops/beta-feedback/BETA-OBS-SCHEMA.md) in use | ☐ |
| [Evidence Ledger](../ops/beta-feedback/EVIDENCE-LEDGER.md) updated · hypothesis tally | ☐ |
| Self-recovery + human-help metrics per Phase A session | ☐ |
| P0/P1 issues triaged from ledger (Engineering root cause only) | ☐ |

---

## Preparation COMPLETE gate

All must be true before **OPS preparation sync** and opening **ENG-PMO-015**:

```text
☐ All prep documents FINAL (001.1 – 001.6)
☐ Phase A complete (BETA-OBS-001 + 002) · human-help metric recorded
☐ Phase B complete (if in scope for prep COMPLETE) or gate documented for readiness eval
☐ Connector posture verified live
☐ No P0 open issues
☐ No unauthorized subsystem reopening
```

**Preparation COMPLETE** → OPS sync → Readiness evaluation → (if earned) Commercial Beta availability.

---

## Explicit non-criteria

| Not required for preparation COMPLETE |
| ------------------------------------- |
| Commercial Beta authorized |
| OPS surfaces at 100% launch score |
| ENG-CONTACT-002 or any V2 charter committed |
| Full Communications workbench UI |
| Multi-workspace contact UI |
| Auth/login productization |

---

## Institutional posture

```text
Checklist:             ENG-BETA-001.6 DRAFT
Mode:                  Observational · ledger-driven
Next act:              BETA-OBS-001 · Kelly · canonical session record · observe only
Readiness:             ENG-PMO-015 (not opened)
```

---

*ENG-BETA-001.6 · Commercial Beta Release Checklist · DRAFT · 2026*
