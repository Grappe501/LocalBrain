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

## Corpus stability · cadence shift

Wave 1 required substantial constitutional writing because foundational concepts did not yet exist.

**From here:** let governance do its job. Highest-leverage activity is **implementation and validation** — not additional doctrine unless MAR-3 uncovers a genuine constitutional defect.

```text
MAR-3 PASS (assuming no Required amendment)
      ↓
EI-001 doctrine freeze
      ↓
Verification Framework already complete
      ↓
ENG-EI-001 · build · verify against lanes
      ↓
Future doctrine changes — demonstrated need only
```

Executive Intelligence should not repeat Wave 1's volume of governance work unless evidence requires it.

---

## Wave 1 milestone name

Wave 1 establishes the **Institutional Cognition Foundation** — the layer that preserves fundamental kinds of institutional information before any reasoning occurs.

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

**Post-foundation era:** **Executive Intelligence Era** — `ei-doctrine-v1.0` **FROZEN** · [ENG-EI-001](./ENG-EI-001-CHARTER.md) AUTHORIZED · fidelity-first engineering

---

*ENG-PMO Governance · LocalBrain V1 · 2026*
