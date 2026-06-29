# Platform Stability (EPO)

> **Engine:** ENG-PST-001  
> **Surface:** Executive Program Office  
> **Parent:** [Executive Program Office](./LOCALBRAIN_EXECUTIVE_PROGRAM_OFFICE.md) · [Architecture Debt](./LOCALBRAIN_ARCHITECTURE_DEBT.md) · [Five Gates](./LOCALBRAIN_FIVE_GATES_RULE.md)

---

## Executive question

```txt
"How likely is it that we'll have to redesign the platform?"
```

Distinct from build progress and operational health — a **leading indicator** for architectural maturity.

---

## Example EPO strip

```txt
Platform Stability        96%
Foundational Objects      Locked
Architecture Debt         Low
Open Redesign Items       2
Phase 1 Completion        88%
```

As Phase 1 closes, stability should **rise**. If it falls, the platform is accumulating redesign pressure instead of capability on a stable foundation.

---

## Components

| Signal | Source |
| ------ | ------ |
| **Stability percent** | Composite rollup (0–100) |
| **Foundational objects** | Constitution Article II — locked set unchanged |
| **Architecture debt** | [ADS](./LOCALBRAIN_ARCHITECTURE_DEBT.md) band → low/medium/high |
| **Open redesign items** | Assumption Ledger · architecture review queue |
| **Phase 1 completion** | [Phase Checklist](./PHASE_CHECKLIST.md) slice completion |

---

## Relationship to other metrics

| Metric | Question |
| ------ | -------- |
| Build progress | Where are we in the slice queue? |
| Operational health | Is the machine healthy? |
| Engineering score | Is the repo healthy? |
| **Platform stability** | Will we need to redesign before we scale? |

---

## Certification pipeline signal

When Evidence → Proof → Plan → Approval → Execution is complete for migration, `certification_pipeline_complete` contributes to stability — the platform can manage high-impact change without ad-hoc workflows.

---

## Phase 1 target

Stability **≥ 90%** at Personal OS launch (026) with foundational objects locked and architecture debt low.

---

*EPO indicator · ENG-PST-001 · instrumentation grows through LB-OS-019.5+*
