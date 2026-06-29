# Proof and Certification

> **Status:** Architecture lock — platform lifecycle pattern  
> **Slice:** LB-OS-023 (Migration Proof Engine) · **Engine:** ENG-PRF-001  
> **Parent:** [Three Worlds & Projection](./LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md) · [Five Gates](./LOCALBRAIN_FIVE_GATES_RULE.md) · [Safety Model](./LOCALBRAIN_SAFETY_MODEL.md)

---

## Core rule

```txt
Evidence tells us what we know.
Proof tells us whether it is safe to act.
Certification decides whether 024 may generate proposals.
```

---

## Non-overlapping responsibilities

| Stage | Question | Phase 1 |
| ----- | -------- | ------- |
| **Evidence** | What do we know? | 019 audit · 020 providers · 022 survey |
| **Proof** | Can we safely act? | **023 — deterministic checks only** |
| **Proposal** | What exactly should we do? | 024 |
| **Approval** | Has a human authorized it? | LB-OS-010 |
| **Execution** | What actually changed? | Post-026 executors |
| **Verification** | Did it work? | Future |
| **Learning** | What did we learn? | Future |

**Proof Score is never LLM-generated.** Every point comes from measurable checks.

---

## Evidence vs Proof vs Confidence

```txt
Evidence Confidence        98   ← map quality (019/022)
Proof Score                94   ← engineering validation (023 providers)
Recommendation Confidence  High ← executive synthesis (024 assistant copy only)
```

Do not mix evidence quality with engineering validation.

---

## Proof dimensions (023)

Each dimension: **max 20 points** · six providers · **120 raw max** · normalized to **0–100** for display.

| Provider | Question |
| -------- | -------- |
| **Structural** | Do paths, blueprints, and projections align? |
| **Reference** | Are workspace refs and index consistency intact? |
| **Recovery** | Is rollback preview documented? Zero destructive ops? |
| **Performance** | Are batch sizes and drive headroom acceptable? |
| **Executive** | EQ linkage · mission fit · complexity within tolerance? |
| **Policy** | Should LocalBrain **allow** this under current doctrine? |

### Policy Proof

Not *"Can this be done?"* — *"Should LocalBrain allow this?"*

```txt
Permission Engine    PASS
Five Gates           PASS
Workspace Ownership  PASS
Safety Rules         PASS
Constitution         PASS
```

Increasingly valuable for: Drive sync · multi-machine · team workspaces · AI proposals · DB migrations · financial actions.

---

## ProofProvider pattern

Mirrors [EvidenceProvider](../backend/src/consolidation/types.ts) aggregation:

```txt
EvidenceProvider.collect()  → ConsolidationFinding
ProofProvider.evaluate()    → ProofDimensionResult
Proof Engine                → ProofScore → ProofCertificate
```

Phase 1 migration providers live under `backend/src/migration/proof/providers/`.

Future platform providers reuse the same interface (not migration-specific).

---

## Proof Certificate (immutable)

```txt
Certificate:     CERT-000184
Simulation:      SIM-000042
Created:         2026-07-01
Proof Score:     96
Evidence Version audit run_id (019)
Survey Version   observed_at (022)
Blueprint refs   workspace_id + confidence snapshot (021)
Result:          Certified | Conditional | Rejected
Proposal eligible: true only when Certified
```

When survey or audit changes, certificates retain frozen provenance — 024 must re-proof if evidence drifted.

---

## Universal lifecycle (not migration-only)

```txt
Question → Evidence → Proof → Certification → Proposal → Approval → Execution → Verification → Learning
```

Reusable for: migration · consolidation · CRM import · DB change · Drive sync · GPU cutover · org-wide ops.

---

## LB-OS-023 scope

```txt
IN:  ProofProvider interface · 6 providers · Proof Score · Proof Certificate
IN:  Migration simulation (dry-run batches · rollback preview · zero mutations)
IN:  GET /api/migration/proof · POST /api/migration/proof/simulate
IN:  Certificate UI · EQ-014 shell
OUT: Proposals (024) · execution · LLM proof scoring · cloud sync
```

---

## Executive Program Office (future)

```txt
Current Certifications
Migration           Certified
Knowledge Cleanup   Awaiting Proof
Workspace Merge     Simulation Complete
GPU Migration       Evidence In Progress
Google Drive Archive Policy Review Required
```

---

## Amendment

- ProofProvider contract changes: update this doc + `shared/src/proofAndCertification.ts`
- LLM scoring in Proof layer: **rejected** — requires architecture review
- Proposals without certificate: **rejected** in 024+

---

*Architecture lock · Proof & Certification · ENG-PRF-001*
