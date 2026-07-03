# ENG-COM-001.2 — Uncertainty Preservation

> **Status:** **COMPLETE** — U1–U5 · ENG-PMO-011 · 11/11 behavioral tests PASS (5 traceability + 6 uncertainty) · 2026-07-03  
> **Parent:** [ENG-COM-001 Charter](../ENG-COM-001-CHARTER.md) · [ENG-COM-001.1](./ENG-COM-001.1-TRACEABLE-DRAFT-GENERATION.md) **COMPLETE**  
> **Prerequisite:** [ENG-PMO-010](../ENG-PMO-010-TRACEABLE-DRAFT-ACCEPTANCE.md) · traceability · C1–C5 earned  
> **Phase:** Second behavioral slice · one question · no additional uncertainty

---

## Behavioral question (binding)

> **Can uncertainty survive probabilistic rewriting without being reduced, hidden, or overstated?**

This is the **only** behavioral question for ENG-COM-001.2.

Everything earned by ENG-COM-001.1 remains inherited and is **not** under evaluation.

---

## Held constant (not under evaluation)

* Constitutional Memory
* Constitutional Retrieval
* Evidence Package Contract (`ENG-EI-001.3`)
* Work Product Contract (`ENG-EI-002.2`)
* Executive Intelligence Doctrine — Articles I–IX
* Institutional Cognition Foundation V1
* Reference Consumer 001
* Deterministic executive pipeline
* Traceable Draft Generation ([ENG-COM-001.1](./ENG-COM-001.1-TRACEABLE-DRAFT-GENERATION.md) · [ENG-PMO-010](../ENG-PMO-010-TRACEABLE-DRAFT-ACCEPTANCE.md))
* C1–C5 behavioral guarantees (traceability · withhold · advisory · citation integrity)

```text
ENG-COM-001.1   Traceability survives probabilistic generation     COMPLETE
ENG-COM-001.2   Uncertainty survives probabilistic rewriting       ▶ this slice
```

---

## New uncertainty (only one)

> Whether probabilistic generation preserves constitutional uncertainty through the drafting process.

Not writing quality. Not advisory restraint (reserved for a later slice). Not tone or persuasion.

Uncertainty is foundational — Assessment · Options · Recommendation · Risk · and later Communications slices inherit epistemic status from what this slice earns.

---

## Scope (binding)

| | |
| - | - |
| **Input** | One `ConstitutionalEvidencePackage` · one `CommunicationsDraftRequest` |
| **Output** | One `CommunicationsDraft` · one `CommunicationsDraftCitationMapping` |

**Excluded from this slice:**

* Connectors · publishing · workflow · policy generation
* UI changes · persistence beyond evaluation
* Prompt libraries · campaign-specific behavior
* Advisory restraint under ambiguous prompts (later slice)
* Tone optimization · stylistic quality · provider comparison

---

## Evidence (U1–U5)

PMO evaluates evidence, not prose quality.

| # | Requirement | Status |
| - | ----------- | ------ |
| U1 | Explicit uncertainty from the Evidence Package is preserved in the draft | evidence submitted |
| U2 | Confidence is never strengthened beyond what the Evidence Package supports | evidence submitted |
| U3 | Uncertain statements remain distinguishable from confirmed statements | evidence submitted |
| U4 | Missing evidence is not rewritten as implied certainty | evidence submitted |
| U5 | Citation mapping accounts for every substantive statement while preserving uncertainty context | evidence submitted |

---

## Delivers

* `EpistemicCertaintyLevel` · proposal `epistemic_level` · `uncertainty_markers` — `shared/src/memoryOs/communicationsDraft.ts` · version `ENG-COM-001.2`
* Epistemic profile extraction — `communicationsDraftEpistemics.ts`
* **Uncertainty validator (U1–U5)** — `communicationsDraftUncertaintyValidator.ts` · composed **after** traceability validator
* Traceability validator **unchanged** — `communicationsDraftValidator.ts`
* Assembler composes both gates — `validateComposedDraftProposal()` in `communicationsDraftAssembler.ts`
* Behavioral tests — `communicationsDraftUncertainty.test.ts` · **6/6 PASS** (+ 5 inherited traceability tests)

```text
Proposal → Traceability Validator (001.1) → Uncertainty Validator (001.2) → Assembler
```

---

## Explicitly not evaluated

| Excluded | Belongs to |
| -------- | ---------- |
| Writing style · persuasiveness | Later crossings |
| Advisory restraint · scope under ambiguous prompts | ENG-COM-001.x (future) |
| Model quality · provider comparison | Out of scope |
| Campaign effectiveness | Production department |

---

## Failure (binding)

Failure occurs if the probabilistic inhabitant:

* removes required uncertainty,
* increases confidence beyond the supporting evidence,
* presents uncertain material as established fact,
* or otherwise changes the epistemic status of the Evidence Package.

Writing quality is **not** part of this evaluation.

A single epistemic distortion sufficient to fail the behavioral question.

---

## Success (binding)

> **The generated draft preserves the uncertainty carried by the Evidence Package while remaining fully traceable and within every inherited deterministic boundary.**

Traceability (C1–C5) must continue to hold. Uncertainty preservation is additive evidence — not a replacement for 001.1 guarantees.

---

## Progression (repository method)

```text
ENG-COM-001.1   Can traceability survive probabilistic generation?     COMPLETE
ENG-COM-001.2   Can uncertainty survive probabilistic rewriting?     COMPLETE
ENG-COM-001.3   Can advisory restraint survive ambiguous prompts?      AUTHORIZED
```

Each slice holds everything else constant and introduces **one** new behavioral question.

---

## What follows (not in this document)

Implementation · validator extensions · behavioral tests · and PMO acceptance ceremony **emerge from** answering U1–U5 with engineering evidence.

If PMO accepts U1–U5, uncertainty preservation becomes an **earned behavioral capability** that later Communications slices and Executive Intelligence inhabitants inherit without reopening the question.

---

*ENG-COM-001.2 · Uncertainty Preservation · AUTHORIZED · LocalBrain V1 · Communications Office · 2026*
