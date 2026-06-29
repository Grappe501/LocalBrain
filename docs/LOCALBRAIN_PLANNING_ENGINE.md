# Planning Engine

> **Engine:** ENG-PLN-001 (generic) · **First implementation:** ENG-MPL-001 (Migration)  
> **Slice:** LB-OS-024  
> **Parent:** [Proof & Certification](./LOCALBRAIN_PROOF_AND_CERTIFICATION.md) · [Migration Plan](./LOCALBRAIN_MIGRATION_PLAN.md)

---

## Principle

Treat high-impact operations as an **engineering control system** — not a filesystem tool.

```txt
Evidence  →  What do we know?
Proof     →  Can we safely act?
Planner   →  What is the sequence — within constraints?
Plan      →  Immutable execution blueprint
Proposal  →  Please approve (references plan_id)
```

Migration is the **first planner**. The interface is platform-generic.

---

## Platform lifecycle (reusable)

```txt
Question → Evidence → Proof → Certification → Planning → Proposal
→ Approval → Execution → Verification → Learning
```

Not migration-specific. Reusable for consolidation, CRM import, Drive sync, GPU cutover, calendar, campaigns, travel, novel planning, etc.

---

## Generic interface

```txt
Evidence
    ↓
Proof
    ↓
Planner        (ENG-PLN-001 contract)
    ↓
Plan
```

Future planners (Phase 2+):

```txt
Calendar Planner · Campaign Planner · Workspace Planner
Contact Merge Planner · Storage Planner · Novel Planner · Travel Planner · Project Planner
```

Same contracts: constraints · objectives · quality score · variants · provenance.

---

## Constraint-aware planning

A plan answers **what rules must be obeyed**, not only what happens.

```txt
✓ Maximum downtime: 0
✓ Maximum simultaneous moves bounded
✓ Preserve workspace identity
✓ Preserve projection integrity
✓ Preserve backups · rollback
✓ Never cross forbidden roots
✓ Respect Five Gates
```

The planner **optimizes within constraints** — never unconstrained optimization.

---

## Plan objectives

Every plan states what it optimizes (deterministic scoring):

```txt
Primary:   Reduce fragmentation
Secondary: Reduce duplicate storage · Shorten paths · Improve archive structure
           Minimize operations · Preserve rollback
```

Enables CoS to explain why one variant was recommended.

---

## Plan variants (executive choice)

One certificate → multiple certified plans:

| Variant | Goal |
| ------- | ---- |
| Conservative | Lowest risk |
| Balanced | Best overall |
| Aggressive | Maximum cleanup |

All variants share the same Proof Certificate. **Only one** becomes a Proposal (025).

---

## Three scores (never mixed)

```txt
Evidence Confidence   98   ← map quality (019/022)
Proof Score           96   ← engineering validation (023)
Plan Quality          93   ← deterministic planner score (024)
```

Plan Quality components: efficiency · risk · rollback simplicity · operation count · duration · objective fulfillment.

**No LLM scoring** in Proof or Plan Quality layers.

---

## Immutable provenance chain

```txt
Evidence Run   AUD-* (019 run_id)
      ↓
Survey         SUR-* (022 observed_at / lineage)
      ↓
Certificate    CERT-*
      ↓
Plan           PLAN-*
      ↓
Proposal       PROP-* (025)
```

Complete audit trail for every operation.

---

## Executive UI (024)

Decision support — not another data table:

```txt
Migration Plan — Balanced Strategy
Quality 93 · Risk Low · Duration 12 min · Rollback 4 min · Operations 143
Ready for Proposal: YES

Alternatives: Conservative · Aggressive
```

---

## Phase 1 discipline

**Constraint-aware planning** is the only architectural addition before Personal OS launch. Slices 024–026 **execute** established contracts — no new foundational objects.

---

## Amendment

- New planner: implement `Planner` contract + module — not kernel
- LLM plan scoring: **rejected**
- Proposals without immutable plan: **rejected** (025)

---

*Architecture lock · ENG-PLN-001 · Migration first implementation ENG-MPL-001*
