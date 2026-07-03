# Engineering Governance — Parallel Commit Histories

> **Status:** Binding for repository hygiene · LocalBrain V1  
> **Symmetry:** Runtime Memory → Intelligence → Policy mirrors Development Engineering → Operations → PMO

Three parallel histories keep Git legible five years from now:

| Prefix | Role | Purpose | Question answered |
| ------ | ---- | ------- | ----------------- |
| **ENG** | Implements specifications | Builds capability — substrate behavior | *What does the platform do?* |
| **OPS** | Measures implementations | Observes capability — metrics · dashboards · snapshots | *What is the platform doing?* |
| **ENG-PMO** | Accepts implementations | Certifies capability — closeouts · acceptance · ceremony | *Was it accepted?* |

```text
ENG     added behavior
OPS     added visibility
ENG-PMO accepted behavior
```

Do not mix histories in a single commit. Implementation fidelity and observability drift belong in separate reviews.

---

## Three correctness model

The platform validates three **independent** qualities:

| Correctness | Governed by | Failure means |
| ----------- | ----------- | ------------- |
| **Constitutional** | Constitution · Convention · Memory Specification · PMO | Architectural or governance contract violated |
| **Behavioral** | Executive Intelligence Doctrine · ENG-EI specifications | Reasoning or advice violated doctrine |
| **Operational** | OPS · runtime · infrastructure · dashboards | Unreliable execution despite correct architecture and behavior |

**Verification lanes:** [Verification Lanes — Three Correctness Model](./VERIFICATION-LANES.md) · [OPS reviews](../ops/README.md)

Lane 1 failure ≠ Lane 3 failure. PMO must not average them into a single health score.

---

## Four constitutional domains

| Domain | Governs | Status |
| ------ | ------- | ------ |
| **Constitution** | What the institution is allowed to preserve | Complete |
| **Executive Intelligence Doctrine** | How reasoning may interact with preserved records | **Frozen** · `ei-doctrine-v1.0` |
| **Verification Framework** | How correctness is evaluated | **Complete** |
| **Institutional Audit** | How accountability is reconstructed over time | Reserved |

These are distinct responsibilities. **Do not introduce another governance document** unless it governs something fundamentally different.

---

## Terminology (binding)

Use **constitutional era names** — not wave numbers — in current engineering and PMO records:

| Historical (archive) | Constitutional name (use) |
| -------------------- | ------------------------- |
| Wave 1 | **Institutional Cognition Foundation** |
| Wave 2 | **Executive Intelligence Era** |

Wave labels remain valid in historical commits and closeouts only.

---

## Engineering fidelity metrics

| Era | Metric | Question |
| --- | ------ | -------- |
| **Institutional Cognition Foundation** | **Specification Fidelity** | Did we implement `memory-spec-v1.0` faithfully? |
| **Executive Intelligence Era** | **Doctrine Fidelity** | Did we implement `ei-doctrine-v1.0` faithfully? |

Every ENG-EI slice reports **Doctrine Fidelity** — Articles I–IX PASS · 100% required for acceptance.

**Commit format:** Every ENG-EI commit begins with a Doctrine Fidelity block — see [ENG-EI Engineering Discipline](./ENG-EI-ENGINEERING-DISCIPLINE.md).

---

## Three constitutional eras (complete)

| Era | Result |
| --- | ------ |
| **Factory** | Institutions can be manufactured deterministically. |
| **Institutional Cognition Foundation** | Institutions can preserve trustworthy records. |
| **Executive Intelligence Era** | Institutions can reason over those records without replacing them. |

---

## Corpus stability · cadence shift

The **Institutional Cognition Foundation** required substantial constitutional writing because foundational concepts did not yet exist.

**Constitutional design phase: COMPLETE.** Highest-leverage activity is **implementation and validation** — not additional doctrine unless demonstrated need requires it.

```text
ei-doctrine-v1.0 FROZEN                         ✓
        ↓
ENG-EI-001 · Constitutional Retrieval           ▶
        ↓
Citation Engine · Executive work products
        ↓
Doctrine Fidelity verification · PMO acceptance
```

---

## Institutional Cognition Foundation (complete)

**Status:** **COMPLETE** — all five substrates · Reference Slices 001–005 · [ENG-PMO-005](./ENG-PMO-005-CONSTITUTIONAL-COMPLETION.md)

Foundational substrates:

```text
Episode          → History
Artifact         → Evidence
Fact             → Knowledge
Conversation     → Interpretation
DecisionCitation → Authority
```

Deterministic substrate doctrine: [DETERMINISTIC-FOUNDATION-DOCTRINE.md](./DETERMINISTIC-FOUNDATION-DOCTRINE.md) — **CLOSED** at substrate layer

**Constitutional doctrine:** [The Five Constitutional Substrates](./THE-FIVE-CONSTITUTIONAL-SUBSTRATES.md)

**Post-foundation era:** **Executive Intelligence Era** — deterministic pipeline **COMPLETE** · ENG-EI-002 **COMPLETE** · Reference Consumer 001 · [ENG-PMO-009](./ENG-PMO-009-EXECUTIVE-BRIEF-ACCEPTANCE.md)

**Active gate:** Contact Management **COMPLETE** · [ENG-PMO-014](../contact-management/ENG-PMO-014-CONTACT-MANAGEMENT-MODULE-EVALUATION.md) · Commercial Beta preparation next · engineering **closed**

---

*ENG-PMO Governance · LocalBrain V1 · 2026*
