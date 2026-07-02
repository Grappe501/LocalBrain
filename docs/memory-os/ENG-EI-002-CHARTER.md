# ENG-EI-002 — Executive Brief · Reference Consumer Candidate

> **Status:** **AUTHORIZED** — first work product consumer · [ENG-PMO-008](./ENG-PMO-008-CONSTITUTIONAL-RETRIEVAL-ACCEPTANCE.md) · [ENG-EI-DOC-003](./ENG-EI-DOC-003-CONSTITUTIONAL-RETRIEVAL-COMPLETE.md)  
> **Milestone name:** **Executive Brief** — Reference Consumer 001  
> **Prerequisite:** [ENG-EI-001](./ENG-EI-001-CHARTER.md) **COMPLETE** · Evidence Package Contract `ENG-EI-001.3`  
> **Specification:** Frozen [Executive Intelligence Doctrine](./EXECUTIVE-INTELLIGENCE-DOCTRINE.md) — fidelity-first  
> **Engineering discipline:** [ENG-EI Engineering Discipline](./ENG-EI-ENGINEERING-DISCIPLINE.md)  
> **Governance:** [ENG / OPS / ENG-PMO](./ENG-PMO-GOVERNANCE.md)

---

## Defining constraint (binding)

```text
Evidence Package in.
Doctrine-compliant Executive Brief out.
Nothing else.
```

---

## Engineering philosophy

> **The Executive Brief should not become smart. It should become faithful.**

A brilliant summary that silently drops a constitutional fact fails. A modest summary that preserves every required citation, every uncertainty, and every constitutional boundary succeeds.

**Lane 2** protects **consumption**, not preservation. Lane 1 proved the package is trustworthy. Lane 2 proves the package was consumed faithfully.

Interfaces are earned by implementation — the **Work Product Contract** is a candidate until ENG-EI-002 proves it.

---

## Mission

> Consume `ConstitutionalEvidencePackage` and produce a structured, doctrine-compliant Executive Brief — traceable · cited · uncertainty-preserving · omission-explicit.

ENG-EI-002 delivers the **first reference consumer** of the Evidence Package Contract. It does not deliver recommendations · options · prioritization · or risk assessment.

---

## Scope (binding)

| In scope | Out of scope |
| -------- | ------------ |
| Consume `ConstitutionalEvidencePackage` | Substrate fetches · package mutation |
| Preserve citations on every assertion | Recommendations · Executive Options |
| Preserve explicit uncertainty | Prioritization · planning |
| Produce structured Executive Brief | Risk assessment · course of action |
| Identify omissions explicitly | LLM calls (until a later slice authorizes) |
| Source mapping · section structure | Re-validating retrieval completeness |

```text
ConstitutionalEvidencePackage
        ↓
Executive Brief renderer
        ↓
Structured Executive Brief
        ↓
(No recommendations · No options · No prioritization · No risk assessment)
```

---

## Engineering constraints (binding)

| Constraint | Rule |
| ---------- | ---- |
| Input | `ConstitutionalEvidencePackage` only — no ad hoc substrate access |
| Output | Structured Executive Brief — sections · citations · uncertainty · omissions |
| Fidelity | Every assertion traceable to package citations |
| Uncertainty | Explicit — never collapsed into false confidence |
| Omissions | Package exclusions and status surfaced — not hidden |
| Mutation | Must not mutate the Evidence Package |
| Advisory | No recommendations · options · prioritization · risk assessment in this charter |

---

## Acceptance question (binding)

> **Did the brief consume the Evidence Package faithfully?**

---

## Acceptance criteria (planned)

| # | Criterion | Status |
| - | --------- | ------ |
| B1 | Brief consumes only `ConstitutionalEvidencePackage` — no substrate fetches | ⬜ |
| B2 | Every brief assertion cites one or more package `citation_ref` values | ⬜ |
| B3 | Uncertainty preserved where source records carry it | ⬜ |
| B4 | Package exclusions and non-complete status appear in `omission_notes` | ⬜ |
| B5 | No recommendations · options · prioritization · or risk fields emitted | ⬜ |
| B6 | Evidence Package not mutated by brief production | ⬜ |
| B7 | Deterministic render for identical package input | ⬜ |
| B8 | Doctrine Fidelity — applicable articles PASS at consumption boundary | ⬜ |
| B9 | PMO slice acceptance | ⬜ |

---

## Authorized sequence

```text
ENG-EI-001 COMPLETE · Evidence Package Contract accepted
        ↓
ENG-EI-002 Executive Brief     ← this charter
        ↓
Implementation slices
        ↓
PMO acceptance
        ↓
Later work products (Assessment · Options · Recommendation · Risk)
```

---

## Implementation slices

| Slice | Scope | Status |
| ----- | ----- | ------ |
| [ENG-EI-002.1](./slices/ENG-EI-002.1-EXECUTIVE-BRIEF-CONTRACT.md) | Executive Brief contract · deterministic renderer | ▶ **AUTHORIZED** |

---

*ENG-EI-002 · Executive Brief · Reference Consumer Candidate · AUTHORIZED · LocalBrain V1 · Executive Intelligence Era · 2026*
