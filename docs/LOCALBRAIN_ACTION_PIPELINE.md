# LocalBrain Action Pipeline

> **Binding execution doctrine** — all significant mutating actions  
> **Parent:** [Constitution Article IX](./LOCALBRAIN_CONSTITUTION.md#article-ix--safety-model) · [Safety Model](./LOCALBRAIN_SAFETY_MODEL.md) · [Executive Intelligence Cards](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md)

---

## Principle

**Simulation is a first-class citizen** — not a consolidation-only feature. Steve trusts the system when every significant action can be previewed before it becomes a proposal.

---

## Pipeline (binding)

```txt
Recommendation
      ↓
Simulation          ← first-class; available before proposal
      ↓
Proposal
      ↓
Approval            ← LB-OS-010; Steve explicit
      ↓
Execution
      ↓
Verification
      ↓
Learning            ← outcomes feed Memory + System Evolution (Phase 2)
```

| Stage | Who triggers | Mutates state? |
| ----- | ------------ | -------------- |
| **Recommendation** | Engine / department / CoS | No |
| **Simulation** | Steve (or CoS suggest → Steve confirm) | No — in-memory projection only |
| **Proposal** | Steve after simulation (or waive with ack) | Creates proposal record only |
| **Approval** | Steve | Enqueues approved action |
| **Execution** | System after approval | Yes — gated writes |
| **Verification** | System + Steve spot-check | Read-back confirm |
| **Learning** | System | Updates memory, ELS inputs, Evolution metrics |

**LB-OS-020** implements Recommendation → Simulation on consolidation cards. Proposal+ unchanged (LB-OS-010). Learning stubbed until Phase 2.

---

## Simulation engine (shared)

```txt
backend/src/simulation/
  simulationEngine.ts     — generic dry-run contract
  simulationRegistry.ts — domain adapters

Adapters (grow over time):
  ConsolidationSimulation   ✅ LB-OS-020
  WorkspaceReorgSimulation    📋 LB-OS-024
  ArchiveMoveSimulation       📋 migration arc
  CalendarScenarioSimulation  📋 Phase 3
  BudgetScenarioSimulation    📋 Finance dept
  OrgRestructureSimulation    📋 Phase 3
```

Each adapter: `simulate(proposalContext) → SimulationResult` with reversible projection, risk notes, and estimated benefit — **zero writes**.

Executive Intelligence Cards expose `simulation: available | completed | waived`.

---

## Future domains (same pipeline)

| Domain | Recommendation example | Simulation preview |
| ------ | ------------------------ | ------------------ |
| Workspaces | Merge sibling folders | Folder tree after merge |
| Archives | Move >18mo assets to cold storage | Paths affected, reclaim |
| Calendar | Block deep-work vs meeting load | Week view projection |
| Campaign travel | Route + lodging options | Cost/time tradeoffs |
| Budget | Reallocate line items | Scenario A vs B |
| Organization | Role/workload rebalance | Coverage gaps filled |

One pipeline → one trust model → one card UX.

---

## Card ↔ pipeline binding

[Executive Intelligence Cards](./LOCALBRAIN_EXECUTIVE_INTELLIGENCE_CARDS.md) display pipeline state on every card:

```txt
Recommendation   ✓
Simulation       Available | Completed | Waived
Proposal         Not generated | Draft | Submitted
Approval         Pending | Approved | Rejected
Execution        —
Verification     —
Learning         —
```

---

## Guardrails (unchanged)

```txt
No stage skips Approval for mutating actions
No Execution without Verification hook
No silent Learning writes — Steve can inspect outcome attribution
Simulation never writes to disk, registry, or cloud
```

---

## Slice mapping

| Slice | Pipeline depth |
| ----- | -------------- |
| LB-OS-010 | Approval · Execution (file actions) |
| LB-OS-020 | Recommendation · Simulation · EIC |
| LB-OS-020.5 | Cross-link cards → action routes |
| LB-OS-021–026 | Proposals for migration; simulation per action type |
| Phase 2 | Learning → Memory + System Evolution + ELS |

---

*Action Pipeline · binding from LB-OS-020 · 2026-06-29*
