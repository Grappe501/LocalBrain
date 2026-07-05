# ENG-BETA-001.5 — Feedback & Issue Triage

> **Type:** Release preparation evidence · not implementation · not readiness evaluation  
> **Status:** **DRAFT** — 2026-07-03  
> **Parent:** [ENG-BETA-001 Commercial Beta Preparation](./ENG-BETA-001-COMMERCIAL-BETA-PREPARATION.md)  
> **Prerequisite:** [Workflow map](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md) · [Onboarding](./ENG-BETA-001.4-BETA-ONBOARDING.md)

---

## Purpose

Define how pilot evidence is collected and routed — without reopening V1 subsystems or mixing release issues with V2 ideas.

The primary evidence surface is **[BETA-OBS session records](../ops/beta-feedback/BETA-OBS-SCHEMA.md)** — canonical beta evidence · organized by **evidence** · not an issue tracker. Capture successes and difficulties alike.

---

## Primary readiness metric

> **How many times did someone have to ask another human what to do?**

Record per session in the ledger. If that number trends toward zero across pilot phases A → B → C, the architecture translated into experience.

---

## Evidence channels

| Channel | Use | When |
| ------- | --- | ---- |
| **[BETA-OBS session record](../ops/beta-feedback/BETA-OBS-SCHEMA.md)** | Evidence NNN · hypotheses · vocabulary · metrics | **Primary** · all phases |
| **[Evidence Ledger](../ops/beta-feedback/EVIDENCE-LEDGER.md)** | Session registry · hypothesis tally · cumulative metrics | All phases |
| **Session debrief** | "What surprised you?" per workflow step | After each Phase A session |
| **Issue / defect log** | P0/P1 reproducible bugs only | When ledger root cause = Engineering |
| **V2 backlog** | Future capability | When root cause = Future V2 |

Do not convert every ledger row into a ticket.

---

## Issue classification

| Severity | Definition | Response target |
| -------- | ---------- | --------------- |
| **P0 — Blocker** | W-001 cannot complete · data loss · accidental send path | Same day · stop handoff |
| **P1 — Major** | W-001 completable only with engineering assist | 1–2 days |
| **P2 — Minor** | Confusing UX · non-blocking error | Next prep iteration |
| **P3 — Cosmetic** | Polish · copy · layout | Backlog / V2 |

### Triage routes

| Route | Meaning | Typical disposition |
| ----- | ------- | ------------------- |
| **ENG** | Subsystem defect · reproducible bug · incorrect behavior | ENG fix · isolated test |
| **OPS** | Operational drift · metrics/snapshot contradict truth | OPS sync commit |
| **UX** | System works correctly · users do not naturally understand it | Onboarding update · copy · affordance · layout — **not** mislabeled as defect or V2 |
| **V2** | Capability not on W-001 path · future architecture | VERSION2_BACKLOG · no implementation |
| **Release prep** | Gap in prep evidence · connector posture · seed policy | ENG-BETA-001 doc update |

### Ledger root cause (per hesitation)

| Root cause | Maps to route | Meaning |
| ---------- | ------------- | ------- |
| **Engineering** | ENG | Defect · incorrect behavior |
| **UX** | UX | Works correctly · user doesn't naturally understand |
| **Documentation** | Release prep | Onboarding · limitations · reference gap |
| **Training** | *(BETA-OBS · Phase A)* | Operator knowledge gap · not a product defect |
| **V2** | V2 | Not V1 scope · was Future V2 |

**Training** is valid evidence in Phase A — it does not always mean something is broken.

---

## The binding question (per finding)

> Is the **interface** wrong, or is **onboarding** wrong?

| Answer | Route |
| ------ | ----- |
| Interface — wrong affordance, missing label, misleading layout | **UX** (may include small ENG surface fix) |
| Onboarding — user could succeed with better orient/limitations copy | **Release prep** · update 001.4 / 001.1 |
| Both | Split into two records |
| Neither — actual bug | **ENG** |
| Neither — future capability | **V2** |

---

## Triage workflow

```text
Feedback received (observation · debrief · log)
        ↓
Classify severity (P0–P3)
        ↓
P0? → halt cohort expansion · fix or workaround · re-run W-001
        ↓
Map to W-001 step (Welcome · Workspace · Contacts · … · Return)
        ↓
Apply binding question: interface vs onboarding?
        ↓
Route: ENG | OPS | UX | V2 | Release prep
        ↓
Close loop with beta user
```

---

## BETA-OBS evidence block (primary)

Each session follows [BETA-OBS-SCHEMA](../ops/beta-feedback/BETA-OBS-SCHEMA.md). One **Evidence NNN** per meaningful moment — including **Positive evidence**:

| Field | Content |
| ----- | ------- |
| Hypothesis | H-001 … H-007 |
| Expected / Observed | |
| Recovered on own? | Self-recovery metric |
| Disposition | Positive evidence · Weakens hypothesis · Neutral · Architecture exposure |
| Journey severity | J0–J4 |

**First session:** [BETA-OBS-001 Kelly](../ops/beta-feedback/BETA-OBS-001-KELLY-REFERENCE-OPERATOR-SESSION.md)

---

## Issue record template (P0/P1 only)

Use when ledger root cause = **Engineering** or severity requires tracking:

```markdown
## Issue — YYYY-MM-DD (from ledger row #N)

**Phase:** A | B | C
**Operator:** Kelly | Chris | (name)
**W-001 step:** Welcome | … | Return
**Ledger root cause:** Engineering
**Severity:** P0 | P1

### Observed / expected
(from ledger row)

### Route: ENG | OPS
### Disposition: (fix | workaround | closed)
### Subsystem reopen? NO — default
```

---

## Pilot phases (evidence expectations)

| Phase | Primary question | Ledger focus |
| ----- | ---------------- | ------------ |
| **A — Reference operators** | Does product match engineering model? | Every hesitation · Training allowed |
| **B — Trusted internal** | Can someone learn the product? | Documentation root causes increase |
| **C — Outside beta** | Can product teach itself? | Human-help count must trend down |

---

## Governance boundaries

| Allowed during beta prep | Not allowed |
| ------------------------ | ----------- |
| Fix defects blocking W-001 | Reopen ENG-CONTACT / ENG-COM slices |
| Update prep/onboarding docs | Authorize ENG-CONTACT-002 |
| UX improvements from pilot evidence | Mislabel UX findings as V2 features |
| OPS sync when evidence earned | Declare Commercial Beta ready without ENG-PMO-015 |
| Add synthetic seed data | Import production PII without consent |

---

## Cadence

| Activity | When |
| -------- | ---- |
| Ledger entries | Every hesitation · all phases |
| "What surprised you?" debrief | After each workflow step · Phase A |
| Human-help count | End of every session |
| Issue triage | P0/P1 only · from Engineering root cause |
| Phase gate review | After A (Kelly + Chris) · before B · before C |
| Readiness gate | After [release checklist](./ENG-BETA-001.6-RELEASE-CHECKLIST.md) complete |

---

## Institutional posture

```text
Evidence surface:      BETA-OBS session records (canonical)
Index:                 EVIDENCE-LEDGER.md
Metrics:               Human-help ↓ · Self-recovery ↑ · Architecture exposure → 0
Mode:                  Hypothesis-driven · not issue-tracker-driven
```

---

*ENG-BETA-001.5 · Feedback & Issue Triage · DRAFT · 2026*
