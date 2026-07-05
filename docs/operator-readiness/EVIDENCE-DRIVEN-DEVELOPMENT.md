# Evidence-Driven Development (EDD)

> **Prime Directives:** [**Protect the evidence.**](./PRIME-DIRECTIVE.md) · [**Protect the pace.**](./PRIME-DIRECTIVE.md#the-rules)  
> **Status:** ✅ **Declared** · Entered at PRL-3 · 2026-07-05  
> **Prior phase:** Automated Acceptance ([CPAT v1.0](./CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md))  
> **Current gate:** [PRL-4](./PLATFORM-READINESS-LEVELS.md) — Internal Operator Validated  
> **Next phase:** Production (PRL-6)

---

## Platform lifecycle

```text
Architecture
        ↓
Implementation
        ↓
Certification
        ↓
Automated Acceptance          ← PRL-3 achieved
        ↓
Evidence-Driven Development   ← YOU ARE HERE
        ↓
Production                      ← PRL-6
```

The platform is no longer waiting on engineering to define what to build. It is waiting on **operators to tell us how well it works**.

That changes the role of engineering — and the role of platform leadership.

---

## Roles at PRL-4

Architecture is frozen. Product design pauses. A different discipline begins.

| Role | Responsibility |
| ---- | -------------- |
| **Operator** | Accomplish real work in a realistic scenario — [briefing frame](./OPERATOR-BRIEFING-FRAME.md) |
| **Facilitator / observer** | Protect session discipline — [facilitator card](./OPERATOR-SESSION-FACILITATOR-CARD.md) |
| **Evidence Scribe** | Capture exactly what happened — no interpretation — [scribe guide](./EVIDENCE-SCRIBE-GUIDE.md) |
| **Evidence analyst** | Prepare sessions · analyze packages · identify cross-operator patterns · recommend **smallest justified changes** · protect frozen doctrine |

The observer's job is harder than the operator's. The scribe is not the facilitator. Interpretation happens **after** capture:

```text
Evidence  →  Interpretation  →  Recommendation
```

PRL-4 is not about discovering *how* to evaluate the platform. The governance, acceptance test, and evidence lifecycle already exist. PRL-4 is about learning *how the platform behaves* in the hands of real operators.

---

## The shift

| Before (Implementation) | Now (Evidence-Driven Development) |
| ------------------------- | --------------------------------- |
| "What feature should we build next?" | "What did the operators teach us today?" |
| Prove individual capabilities | Prove operational readiness |
| Design loops | Evidence loops |
| Architecture questions | Operator observation questions |

Engineering **implements within frozen contracts**. Operators **determine priority**. Governance **dispositions evidence** before architecture changes.

---

## Primary engineering question

> **What did the operators teach us today?**

Every iteration cycle starts from:

1. Operator walkthrough evidence
2. [Platform Health Score](./PLATFORM-HEALTH-SCORE.md) trends
3. [Operational Evidence Candidates](./OPERATIONAL-EVIDENCE-REGISTER.md) disposition
4. Canonical acceptance test still passing

Not from speculative features or new conceptual models.

---

## Evidence loop (replaces feature loop)

```text
Operator Walkthrough
        ↓
Evidence Package + Health Score
        ↓
OEC Register (observations, not bugs)
        ↓
Governance Disposition
        ↓
Bounded Implementation (doctrine-preserving)
        ↓
CPAT v1.0 regression
        ↓
Repeat
```

---

## Frozen constraints during EDD

| Constraint | Document |
| ---------- | -------- |
| Architecture v1.0 | Contact v3 + UCIE ADRs — change only via ADR |
| [Certified Implementation Doctrine](../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md) | Eleven doctrines — active review check on every change |
| [Canonical Acceptance Test](./CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md) | Permanent regression benchmark |

Every implementation review includes:

> **Does this change preserve every certified doctrine?**

---

## What engineering does during PRL-4

Engineering does **not** wait idle. Work proceeds on **bounded improvements** that strengthen the platform **without altering the contracts operators are validating**:

| Workstream | Examples | Architecture impact |
| ---------- | -------- | ------------------- |
| Connector hardening | Google, Apple, Outlook OAuth | None — within UCIE intake |
| OCR accuracy | Model tuning, field extraction | None — staging only |
| Identity matching | Fuzzy addresses, nicknames, phone normalization | None — resolution rules within doctrine |
| Import parsers | CSV edge cases, Excel, PDF | None |
| Performance | Profiling, query optimization | None |
| Accessibility | WCAG, keyboard, screen reader | None |
| Observability | Logging, metrics, tracing | None |
| Documentation | Onboarding, operator guides | None |

**Out of scope without OEC disposition + governance:** new engines, trust boundary changes, doctrine violations, architecture v1.1.

See [Execution Charter](../contact-management/slices/CONTACT-V3-EXECUTION-CHARTER.md) workstreams 2–4.

---

## PRL-4 exit

PRL-4 advancement is **evidence-based**, not subjective. See [PRL-4 Exit Contract](./PRL-4-EXIT-CONTRACT.md).

---

## Mature progression (where we are)

| Stage | Status |
| ----- | ------ |
| 1. Vision & architecture | ✅ Complete |
| 2. Implementation foundation | ✅ Complete |
| 3. Governance & certification | ✅ Complete |
| 4. Automated platform validation (PRL-3 · CPAT) | ✅ Complete |
| 5. **Operator validation (PRL-4)** | ⏳ **Active — organizational learning, not engineering** |

The next meaningful advances come from **observing real operators**, measuring readiness, and iterating within governance — not from adding conceptual models.

**Engineering stop line (2026-07-05):** Adding more architecture now would reduce confidence, not increase it. [EPO-001](../epo/EPO-001-RESERVATION.md) is reserved; trust domains are certified. Hold changes until operator evidence earns them.

---

## Executive measurement (PRL-4 era)

Stop measuring features completed. Maintain four executive views:

| Pillar | What leadership sees | Primary sources |
| ------ | -------------------- | --------------- |
| **Trust** | Identity · Relationship · Operational (Governance reserved) | UCIE · Contact v3 · VOP certification · [architecture](../platform/GOVERNED-PLATFORM-ARCHITECTURE.md) |
| **Readiness** | PRL · CPAT · operator readiness · platform health | [PRL](./PLATFORM-READINESS-LEVELS.md) · [CPAT](./CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md) · [Health Score](./PLATFORM-HEALTH-SCORE.md) |
| **Evidence** | OEC lifecycle · quality · facilitator interventions · self-recovery · confidence | [Scoreboard](./OPERATOR-EVIDENCE-SCOREBOARD.md) · [OEC Register](./OPERATIONAL-EVIDENCE-REGISTER.md) |
| **Stability** | Coherence · acceptance tests · doctrine · architecture integrity | [PSA-001](./PSA-001-PLATFORM-STATE-REPORT.md) · CPAT · [Doctrine](../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md) |

These four views tell leadership more than a burn-down chart.

---

## The question shift

| Era | Question |
| --- | -------- |
| Implementation | *Can we build this?* |
| **Evidence-Driven Development** | ***Should we change this?*** |

The only acceptable answer:

> **Show me the evidence.**

---

## Three-operator discipline

When Kelly completes her session — **do not immediately fix anything.**

Wait until Kelly, Chris, and the third internal operator have all completed Walkthrough #1. Review evidence **together**. Look for patterns.

- One person's hesitation may be personal preference.
- Three people's hesitation is likely a platform issue.

That restraint is what [protects the evidence](./PRIME-DIRECTIVE.md).

---

## Related documents

| Document | Purpose |
| -------- | ------- |
| [Certified Implementation Doctrine](../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md) | Engineering constitution |
| [Platform Readiness Levels](./PLATFORM-READINESS-LEVELS.md) | PRL-1 … PRL-6 |
| [PRL-4 Exit Contract](./PRL-4-EXIT-CONTRACT.md) | Objective PRL-4 completion |
| [Prime Directives](./PRIME-DIRECTIVE.md) | Protect the evidence · Protect the pace |
| [Operator Evidence Scoreboard](./OPERATOR-EVIDENCE-SCOREBOARD.md) | Primary success metrics |
| [Operator Session Facilitator Card](./OPERATOR-SESSION-FACILITATOR-CARD.md) | Observer discipline — one page |
| [Evidence Scribe Guide](./EVIDENCE-SCRIBE-GUIDE.md) | Capture-only role |
| [Operator Briefing Frame](./OPERATOR-BRIEFING-FRAME.md) | What to tell Kelly |
| [Operational Evidence Register](./OPERATIONAL-EVIDENCE-REGISTER.md) | OEC lifecycle |
| [Platform Health Score](./PLATFORM-HEALTH-SCORE.md) | Longitudinal metrics |

---

*Evidence-Driven Development · LocalBrain Governed Platform · 2026*
