# Operator Evidence Scoreboard

> **Status:** Primary governance dashboard · PRL-4+  
> **Rule:** [Prime Directive](./PRIME-DIRECTIVE.md) — *Protect the evidence.*  
> **Replaces:** Feature completion as the primary success signal

This scoreboard tells you whether the platform is actually becoming easier to use — not whether engineering shipped more code.

---

## Primary metrics

| Metric | Desired trend | What it means |
| ------ | ------------- | ------------- |
| **OECs opened** | ↓ | Fewer new friction signals per session |
| **OECs confirmed** | ↓ | Fewer replicated problems across operators |
| **Operator confidence** | ↑ | Self-reported and observed certainty |
| **Facilitator interventions** | ↓ | Less evidence contamination |
| **Self-recovery** | ↑ | Operators recover from errors without help |
| **Platform Readiness** | ↑ | Longitudinal dimension average |
| **Time to completion** | ↓ | Workflow efficiency (not rushed sessions) |
| **Evidence quality** | ↑ | Complete scribe capture · low contamination |

**Celebrate:** *We learned something true* — not merely *the build passed*.

---

## Evidence quality rubric

| Signal | Quality |
| ------ | ------- |
| Dedicated scribe · no interpretation during session | High |
| Contamination log empty · no P0/P1 assistance | High |
| Post-session debrief captured verbatim | High |
| Facilitator explained navigation or architecture | **Corrupted — discard for readiness scoring** |
| Operator coached to "correct" path | **Corrupted — log and exclude from confidence metrics** |

Corrupted sessions may still inform training. They do **not** count toward PRL-4 exit evidence without governance exception.

---

## Secondary metrics (still tracked)

| Metric | Role |
| ------ | ---- |
| CPAT v1.0 automated pass | Permanent technical regression floor |
| Platform Health Score (scenario) | Walkthrough-specific UX |
| Readiness dimensions (8) | Longitudinal governance |
| Doctrine preservation reviews | Implementation integrity |

Automated scores set the floor. Operator scores set the ceiling for launch decisions.

---

## Shared contracts

| Symbol | Location |
| ------ | -------- |
| `PRIME_DIRECTIVE` | `shared/src/operatorReadiness/evidenceGovernance.ts` |
| `EVIDENCE_SCOREBOARD_METRICS` | `shared/src/operatorReadiness/evidenceGovernance.ts` |
| `ENGINEERING_SUCCESS_MANTRA` | `shared/src/operatorReadiness/evidenceGovernance.ts` |

---

## Review cadence

| When | Action |
| ---- | ------ |
| After each operator session | Update scoreboard row for that package |
| Weekly during PRL-4 | Trend review · OEC disposition queue |
| Before PRL-4 exit | Confirm evidence quality floor across ≥ 3 operators |
| Every release | CPAT v1.0 + walkthrough #1 operator regression (post-PRL-4 freeze) |

---

*Operator Evidence Scoreboard · LocalBrain Governance · 2026*
