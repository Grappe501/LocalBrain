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
| **Product** | Are beta workflows coherent end to end? | Kelly/Chris task paths · workbench surfaces · cross-subsystem flows documented |
| **Operational** | Are dashboards, metrics, and projections synchronized with repository truth? | Program Office API · launch snapshot · context cards · workspace projection — no contradiction |
| **User readiness** | Can Kelly, Chris, and trusted beta users accomplish intended tasks without engineering assistance? | [Launch criteria](../LOCALBRAIN_V1_LAUNCH_CRITERIA.md) beta cohort · Kelly Sandbox · guided workflows |
| **Data** | Is seed/demo data appropriate and is user data handled correctly? | Workspace seed posture · no personal Steve data in permanent Memory OS before factory gate · import/export discipline |
| **Connector posture** | Which integrations are enabled, disabled, or intentionally deferred for beta? | Explicit connector matrix · no silent activation · send paths remain approval-gated |
| **Support** | Is there a documented process for collecting beta feedback and triaging issues? | Feedback channel · triage workflow · severity classification · OPS review cadence |

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

Per [LOCALBRAIN_V1_LAUNCH_CRITERIA.md](../LOCALBRAIN_V1_LAUNCH_CRITERIA.md) Phase 7:

* **Kelly**
* **Chris**
* One or two additional trusted customers

User readiness evidence must be evaluable against this cohort — not against engineering convenience.

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
| 1 | ENG-BETA-001 charter | This document · **OPENED** |
| 2 | Beta workflow map | End-to-end paths across inherited subsystems |
| 3 | Connector posture matrix | Enabled · disabled · deferred |
| 4 | Beta feedback + triage process | Support dimension |
| 5 | OPS preparation sync | Operational surfaces match release evidence |
| 6 | Readiness evaluation | ENG-PMO-015 or successor |
| 7 | Commercial Beta availability | Separate promotion gate |

---

## Institutional posture

```text
Engineering truth:     All V1 subsystems COMPLETE · inherited baseline committed
Governance truth:      ENG-BETA-001 OPENED · release-level preparation active
Module governance:     CLOSED (no active subsystem crossing)
Active authority:      Commercial Beta preparation
Next repository act:   Preparation evidence · connector posture · beta workflow map
Readiness gate:        ENG-PMO-015 or successor (not opened)
```

---

*ENG-BETA-001 · Commercial Beta Preparation · OPENED · LocalBrain V1 · Release governance · 2026*
