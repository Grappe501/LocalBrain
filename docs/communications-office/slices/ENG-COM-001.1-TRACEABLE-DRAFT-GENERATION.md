# ENG-COM-001.1 — Traceable Draft Generation

> **Status:** **COMPLETE** — [ENG-PMO-010](../ENG-PMO-010-TRACEABLE-DRAFT-ACCEPTANCE.md) · C1–C5 PASS · 5/5 behavioral tests  
> **Parent:** [ENG-COM-001 Charter](../ENG-COM-001-CHARTER.md)  
> **Phase:** First behavioral slice · one question · no additional uncertainty

---

## Behavioral question (binding)

> **Can probabilistic language generation produce a useful draft while preserving complete traceability to the Evidence Package?**

This is the **only** behavioral question for ENG-COM-001.1.

Everything else remains constant.

---

## Held constant (not under evaluation)

* Constitutional Memory
* Constitutional Retrieval
* Evidence Package Contract (`ENG-EI-001.3`)
* Work Product Contract (`ENG-EI-002.2`)
* Executive Intelligence Doctrine — Articles I–IX
* Deterministic executive pipeline
* Reference Consumer 001
* PMO governance · verification lane definitions

---

## New uncertainty (only one)

> **Can traceability survive probabilistic generation?**

Not writing quality. Not model selection. Not connectors. Not publishing.

---

## Scope (binding)

| | |
| - | - |
| **Input** | One `ConstitutionalEvidencePackage` · one bounded communications request |
| **Output** | One draft communication |

**Excluded from this slice:**

* Connectors
* Publishing
* Workflow
* Persistence beyond what is required for evaluation
* Recommendations about policy
* Strategic planning · options · prioritization

```text
ConstitutionalEvidencePackage + bounded request
        ↓
Probabilistic draft generation (bounded)
        ↓
Draft communication + citation mapping
```

---

## Evidence (acceptance criteria)

PMO evaluates evidence, not prose quality.

| # | Criterion |
| - | --------- |
| C1 | Every substantive statement maps to one or more Evidence Package citations | ✅ **PASS** · ENG-PMO-010 |
| C2 | No statement emitted without supporting evidence | ✅ **PASS** · ENG-PMO-010 |
| C3 | Unsupported requested content is withheld rather than invented | ✅ **PASS** · ENG-PMO-010 |
| C4 | Citation mapping preserved alongside draft · independently inspectable | ✅ **PASS** · ENG-PMO-010 |
| C5 | The draft remains advisory — no Policy · no Action | ✅ **PASS** · ENG-PMO-010 |

---

## Explicitly not evaluated

| Excluded | Belongs to |
| -------- | ---------- |
| Writing style | Later crossings · not COM-001.1 |
| Persuasiveness | Later crossings |
| Tone optimization | Later crossings |
| Model quality | Provider layer · not behavioral question |
| User preference | Beta evidence · not slice evidence |
| Campaign effectiveness | Production department · not experiment |

---

## Failure (binding)

A **single unsupported substantive statement** is sufficient to fail the behavioral question.

Failure is not "the writing wasn't good." Failure is violation of traceability or inherited deterministic boundaries.

---

## Success (binding)

The draft demonstrates that probabilistic generation can preserve traceability while remaining inside every inherited deterministic boundary.

Useful draft output is necessary but not sufficient.

---

## Progression (repository method)

```text
Deterministic phase     Can we preserve? · retrieve? · consume?
ENG-COM-001.1           Can we generate without losing traceability?
Future slices (TBD)     Uncertainty preservation · advisory restraint · …
```

Each future slice holds everything else constant and introduces **one** new behavioral question.

---

## Delivers

* `CommunicationsDraft` · `CommunicationsDraftCitationMapping` — `shared/src/memoryOs/communicationsDraft.ts`
* Traceability validator (C1–C5) — `backend/src/communicationsOffice/communicationsDraftValidator.ts`
* Proposal assembly — `backend/src/communicationsOffice/communicationsDraftAssembler.ts`
* `generateTraceableCommunicationsDraft()` — fixture adapter (tests) · LLM adapter (when provider configured)
* Behavioral tests — `backend/src/communicationsOffice/communicationsDraft.test.ts` · **5/5 PASS**

```text
Evidence Package
        │
        ├──────────────┐
        ▼              ▼
Citation Mapping   Communications Draft
```

---

## What follows (not in this document)

Implementation · contract types · behavioral tests · and PMO evaluation **emerge from** satisfying C1–C5 with engineering evidence.

---

*ENG-COM-001.1 · Traceable Draft Generation · COMPLETE · ENG-PMO-010 · LocalBrain V1 · Communications Office · 2026*
