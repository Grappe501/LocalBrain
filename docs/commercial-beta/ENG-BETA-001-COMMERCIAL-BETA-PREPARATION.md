# ENG-BETA-001 — Commercial Beta Preparation

> **Type:** Release governance charter — not subsystem · not slice · not implementation  
> **Status:** **OPENED** — 2026-07-03  
> **Prerequisite:** All V1 subsystems **COMPLETE** · [ENG-PMO-013](../communications-office/ENG-PMO-013-COMMUNICATIONS-OFFICE-MODULE-EVALUATION.md) · [ENG-PMO-014](../contact-management/ENG-PMO-014-CONTACT-MANAGEMENT-MODULE-EVALUATION.md) · engineering **closed**  
> **Governance:** [ENG / OPS / ENG-PMO](../memory-os/ENG-PMO-GOVERNANCE.md)  
> **Held constant:** Completed V1 subsystem baseline · verification lane definitions · no subsystem reopening without new evidence

---

## Position in the critical path

```text
Executive Office · Peer Review · Factory · Memory OS · EI · COM · Contact
        ↓
All V1 subsystems COMPLETE (inherited baseline)
        ↓
Commercial Beta preparation (ENG-BETA-001)  ← this release scope
        ↓
Commercial Beta readiness evaluation (separate gate)
        ↓
Commercial Beta availability
```

Release governance begins **after** subsystem promotion. No further subsystem crossings are authorized under this charter.

---

## Release evaluation question (binding)

> **Is LocalBrain prepared to be exercised safely and usefully by real beta users?**

This is the **only** release-level question for ENG-BETA-001 preparation.

Unlike module evaluations, this question looks **across** completed subsystems — it does **not** reopen any of them.

---

## Preparation vs readiness (binding distinction)

| Scope | Question | Authority | This charter |
| ----- | -------- | --------- | ------------ |
| **Preparation** | What release-level evidence must exist before readiness can be evaluated? | ENG-BETA-001 | **OPENED** · active |
| **Readiness** | Has LocalBrain earned Commercial Beta availability? | ENG-PMO-015 or successor | **Separate gate** · not opened by this document |

**Preparation COMPLETE** does not authorize beta launch.  
**Readiness COMPLETE** does not reopen subsystem engineering.

```text
Completion → Verification → Acceptance → Promotion
                              ↓
              Promotion target: Commercial Beta availability
              (not slice · not module · not subsystem)
```

---

## Inherited V1 subsystems (not under evaluation)

The following are **accepted inputs** — not reconsidered in this release scope:

| Subsystem | Basis | Status |
| --------- | ----- | ------ |
| Executive Office | Module certification · regression lock | **INHERITED** |
| Peer Review / Theory | Convention close · theory v1.0 freeze | **INHERITED** |
| Empty Brain Factory | v1.0.0-factory-certified | **INHERITED** |
| Memory OS | Institutional Cognition Foundation V1 · ENG-PMO-005 | **INHERITED** |
| Executive Intelligence | ENG-EI-002 COMPLETE · ENG-PMO-009 · deterministic pipeline closed | **INHERITED** |
| Communications Office | ENG-PMO-013 · Contract `ENG-COM-001.3` · 18/18 behavioral | **INHERITED** |
| Contact Management | ENG-PMO-014 · Contract `ENG-CONTACT-001.1` · 23/23 behavioral | **INHERITED** |

Subsystem charters, slice acceptances, and module evaluations are **historical facts**. Release governance evaluates **composition and readiness** — not individual subsystem implementation.

---

## Release evaluation areas

| Area | Evaluation focus | Preparation evidence |
| ---- | ---------------- | -------------------- |
| **Product** | Are beta workflows coherent end to end? | [001.1 Commercial Beta workflow map](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md) · [001.4 Onboarding](./ENG-BETA-001.4-BETA-ONBOARDING.md) |
| **Operational** | Are dashboards, metrics, and projections synchronized with repository truth? | OPS sync **after** prep evidence · Program Office API |
| **User readiness** | Can reference operators and later cohorts accomplish meaningful work without engineering assistance? | [001.4 Onboarding](./ENG-BETA-001.4-BETA-ONBOARDING.md) · [BETA-OBS sessions](../ops/beta-feedback/BETA-OBS-SCHEMA.md) · human-help metric |
| **Data** | Is seed/demo data appropriate and is user data handled correctly? | [001.3 Seed/demo data plan](./ENG-BETA-001.3-SEED-DEMO-DATA-PLAN.md) |
| **Connector posture** | Which integrations are enabled, disabled, or intentionally deferred for beta? | [001.2 Connector posture matrix](./ENG-BETA-001.2-CONNECTOR-POSTURE-MATRIX.md) |
| **Support** | Are BETA-OBS session records collected · issues triaged only when needed? | [001.5 Feedback & triage](./ENG-BETA-001.5-FEEDBACK-ISSUE-TRIAGE.md) · [BETA-OBS schema](../ops/beta-feedback/BETA-OBS-SCHEMA.md) |

PMO evaluates **release evidence**, not feature count.

---

## Explicitly out of scope (binding)

The following are **not** under ENG-BETA-001 preparation:

| Excluded | Reason |
| -------- | ------ |
| Reopening any V1 subsystem | Module governance **closed** — new evidence required for new crossing |
| Storage · CRUD · CSV · COM linking implementation | Contact Management **INHERITED** |
| Traceability · uncertainty · advisory restraint | Communications Office **INHERITED** |
| Constitutional Memory · Retrieval · Executive Brief | Deterministic pipeline **CLOSED** |
| Volunteer Management | Post–Commercial Beta · [ENG-VOL-001](../volunteer-management/ENG-VOL-001-MASTER-BUILD-PLAN.md) |
| Campaign CRM · bulk outreach · automation | Explicit non-goals · connector scope |
| Connector activation without posture matrix | Release decision · not engineering default |
| Declaring Commercial Beta **ready** | Separate readiness evaluation gate |

Proposals for excluded items belong in [VERSION2_BACKLOG.md](../VERSION2_BACKLOG.md) unless they shorten the critical path to beta readiness.

---

## Beta cohort (binding reference)

Per [LOCALBRAIN_V1_LAUNCH_CRITERIA.md](../LOCALBRAIN_V1_LAUNCH_CRITERIA.md) Phase 7 — staged as **reference operators** then expand:

| Phase | Cohort | Question |
| ----- | ------ | -------- |
| **A** | Kelly · Chris (reference operators) | Can a knowledgeable operator accomplish meaningful work without engineering? |
| **B** | Trusted internal users (campaign-aware) | Can someone learn the product? |
| **C** | Outside beta (architecture-unfamiliar) | Can the product teach itself? |

Staged expansion per [001.4 onboarding](./ENG-BETA-001.4-BETA-ONBOARDING.md). Primary evidence: [BETA-OBS session records](../ops/beta-feedback/BETA-OBS-SCHEMA.md).

---

## Failure (binding definition)

Failure **is**:

> "Beta users cannot accomplish intended workflows safely, operational surfaces contradict engineering truth, or a subsystem is reopened without authorization."

Failure is **not**:

> "The product lacks Salesforce features" or "Every connector is live."

---

## Success — preparation (binding definition)

Preparation success **is**:

> "Release-level evidence exists across product, operational, user, data, connector, and support dimensions — readiness evaluation can proceed without subsystem reopening."

Preparation success is **not** beta launch authorization.

---

## Success — readiness (separate gate)

Readiness success **is**:

> "Kelly, Chris, and trusted beta users can exercise LocalBrain safely and usefully — Commercial Beta availability is earned."

Readiness disposition belongs to **ENG-PMO-015 or successor** — not this charter.

---

## Execution lifecycle (binding)

```text
1. ENG-BETA-001 OPENED          ← current posture
2. Preparation evidence gathered  (product · ops · user · data · connector · support)
3. OPS sync                       (operational truth matches preparation evidence)
4. Readiness evaluation opened    (ENG-PMO-015 or successor)
5. Readiness COMPLETE             (if earned)
6. Commercial Beta availability   (separate promotion · not automatic)
```

Engineering commits under preparation are **release-scoped** — product surfaces, documentation, connector posture, support process — not subsystem crossings.

---

## Build order (binding sequence)

| Step | Artifact | Notes |
| ---- | -------- | ----- |
| 1 | ENG-BETA-001 charter | This document · **OPENED** · committed |
| 2 | [Commercial Beta workflow map](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md) | **DRAFT** · primary evidence · W-001 reference journey · steps 1–6 · observation capture |
| 3 | [Connector posture matrix](./ENG-BETA-001.2-CONNECTOR-POSTURE-MATRIX.md) | **DRAFT** |
| 4 | [Seed & demo data plan](./ENG-BETA-001.3-SEED-DEMO-DATA-PLAN.md) | **DRAFT** |
| 5 | [Beta onboarding](./ENG-BETA-001.4-BETA-ONBOARDING.md) | **DRAFT** |
| 6 | [Feedback & issue triage](./ENG-BETA-001.5-FEEDBACK-ISSUE-TRIAGE.md) | **DRAFT** |
| 7 | [Release checklist](./ENG-BETA-001.6-RELEASE-CHECKLIST.md) | DRAFT · preparation COMPLETE gate |
| — | [BETA-OBS schema](../ops/beta-feedback/BETA-OBS-SCHEMA.md) | **Canonical beta evidence** · hypothesis-driven |
| — | [BETA-OBS-001 Kelly](../ops/beta-feedback/BETA-OBS-001-KELLY-REFERENCE-OPERATOR-SESSION.md) | **OPEN** · Phase A first session |
| — | [Evidence Ledger](../ops/beta-feedback/EVIDENCE-LEDGER.md) | Session registry · hypothesis tally · metrics |
| 8 | OPS preparation sync | Operational surfaces match evidence · **deferred** |
| 9 | Readiness evaluation | ENG-PMO-015 or successor |
| 10 | Commercial Beta availability | Separate promotion gate |

---

## Institutional posture

```text
Engineering truth:     All V1 subsystems COMPLETE · inherited baseline committed
Governance truth:      ENG-BETA-001 OPENED · release-level preparation active
Mode:                  Building → learning · observational pilot active
Active phase:          Phase 0 admin smoke → Phase A (Kelly · reference operator)
Evidence surface:      BETA-OBS session records (canonical)
Next repository act:   BETA-OBS-001 · Kelly · observe · do not explain
Readiness gate:        ENG-PMO-015 or successor (not opened)
V2 documentation:      Uncommitted · post–Commercial Beta era
```

---

*ENG-BETA-001 · Commercial Beta Preparation · OPENED · LocalBrain V1 · Release governance · 2026*
