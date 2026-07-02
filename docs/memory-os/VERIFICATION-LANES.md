# Verification Lanes — Three Correctness Model

> **Status:** **COMPLETE** — binding governance · corpus stable · amend only on demonstrated need  
> **Type:** Platform governance — not merely a testing document  
> **Prerequisite for EI-001:** Frozen alongside [Executive Intelligence Doctrine](./EXECUTIVE-INTELLIGENCE-DOCTRINE.md)  
> **Governance:** [ENG / OPS / ENG-PMO](./ENG-PMO-GOVERNANCE.md) · [OPS reviews](../ops/README.md)

**Corpus rule:** Do not expand this framework unless a genuinely new constitutional concern emerges. Future changes are driven by demonstrated need — not anticipation.

The platform separates **three independent notions of correctness**. Verification lanes exist to validate each one without conflating them.

---

## Three correctness types

| Correctness | Governed by | Failure means |
| ----------- | ----------- | ------------- |
| **Constitutional correctness** | Constitution · Convention · Memory Specification · PMO | The platform violated its architectural or governance contract. |
| **Behavioral correctness** | [Executive Intelligence Doctrine](./EXECUTIVE-INTELLIGENCE-DOCTRINE.md) and its engineering specifications | The system reasoned or advised in a way that violated doctrine (missing citations · hidden uncertainty · unsupported recommendation · etc.). |
| **Operational correctness** | OPS · runtime infrastructure · databases · networking · dashboards | The platform failed to execute reliably despite correct architecture and behavior. |

```text
Constitutional correctness     ≠     Behavioral correctness     ≠     Operational correctness
```

A Lane 1 failure is fundamentally different from a Lane 3 failure. They must never be averaged into a single "health score."

---

## Verification lanes

| Lane | Name | Validates | Promise |
| ---- | ---- | --------- | ------- |
| **Lane 1** | **Constitutional Verification** | Memory is constitutionally sound | **Protects the institution** |
| **Lane 2** | **Behavioral Verification** | Reasoning respects the doctrine | **Protects leadership** |
| **Lane 3** | **Operational Verification** | Runtime delivers capabilities reliably | **Protects availability** |

Three different promises — never averaged into one health score.

Executive Intelligence Doctrine:

> **Intelligence reasons over constitutional memory.**

Verification extends that philosophy:

```text
Lane 1  →  proves the memory is constitutionally sound
Lane 2  →  proves the reasoning respects the doctrine
Lane 3  →  proves the runtime can deliver those capabilities reliably
```

---

## Lane 1 — Constitutional Verification

**Must always be deterministic.**

```text
Episode
Artifact
Fact
Conversation
DecisionCitation
100%
Repeatable
No parallel dependency
```

The **constitutional certification suite**.

| Property | Rule |
| -------- | ---- |
| Determinism | Same input → same substrate output |
| Isolation | No shared mutable DB state across parallel workers |
| Failure meaning | **Constitutional regression** — blocks ENG-PMO acceptance |
| Examples | `episode.test.ts` · `fact.test.ts` · `artifact.test.ts` · `conversation.test.ts` · `decisionCitation.test.ts` |

The Constitution should never fail because SQLite had a lock.

---

## Lane 2 — Behavioral Verification

**May be probabilistic — assert behavior, not exact wording.**

When ENG-EI slices ship, tests assert doctrine compliance:

| Assertion | Article / principle |
| --------- | ------------------- |
| Citations present | Article IV · burden of proof (IX) |
| Uncertainty surfaced | Article VI |
| Recommendation withheld when evidence insufficient | Article VIII · IX |
| No substrate mutation | Article II |
| Advisory ≠ authority | Article VII |
| Doctrine honored | Frozen `ei-doctrine-v1.0` |

Failure means **behavioral regression** — advisory layer violated doctrine, not that substrates changed.

---

## Lane 3 — Operational Verification

**Runtime · infrastructure · observability:**

```text
SQLite · Postgres · APIs · networking
dashboards · UI · projections · workspace live sync
```

| Property | Rule |
| -------- | ---- |
| Environmental tolerance | Retries acceptable · isolate when flaky |
| Failure meaning | **Operational regression** — not constitutional or behavioral interpretation |
| Parallel execution | May contend on shared SQLite — record under OPS-TEST, not ENG |
| Examples | `liveSurface.test.ts` · EPO build-state · workspace registry |

See [OPS-TEST-002](../ops/OPS-TEST-002-LIVESURFACE-PARALLEL-SQLITE.md) — Lane 3 · PASS (isolated) · non-blocking.

---

## PMO reporting (planned)

Three dimensions — **reported independently, never averaged:**

```text
Constitutional Integrity
██████████ 100%

Behavioral Integrity
████████░░ 82%

Operational Reliability
█████████░ 94%
```

A platform with **100% constitutional integrity** and a flaky SQLite test is very different from one with runtime reliability but governance violations. PMO must not collapse these into one score.

---

## Failure disposition

When verification fails:

1. **Identify the lane.**
2. **Lane 1** — blocking · constitutional regression · ENG-PMO cannot accept.
3. **Lane 2** — evaluate against frozen doctrine · not model phrasing.
4. **Lane 3** — OPS review · isolate · OPS-TEST record · do not conflate with Lane 1 or 2.

---

## Future — Institutional Audit (reserved)

Not a verification lane. A **governance and accountability function over time** — the fourth constitutional domain.

| Domain | Governs | Status |
| ------ | ------- | ------ |
| **Constitution** | What the institution is allowed to preserve | Complete |
| **Executive Intelligence Doctrine** | How reasoning may interact with preserved records | Ready for MAR-3 / EI-001 freeze |
| **Verification Framework** | How correctness is evaluated | **Complete** |
| **Institutional Audit** | How accountability is reconstructed over time | Reserved |

Institutional Audit would answer:

- Why was this recommendation made?
- Which constitutional records were cited?
- Which policy approved the action?
- Which Decision Ledger entry authorized it?
- What changed between two executive briefs?

That is not testing — it is **institutional accountability**. Reserved for post–ENG-EI implementation; does not block EI-001 or MAR-3.

---

## Platform clarity (binding summary)

The project distinguishes:

```text
deterministic memory          from          probabilistic intelligence
constitutional validity       from          behavioral validity       from          operational reliability
```

Keeping them separate makes engineering and governance tractable as Executive Intelligence grows.

---

## Institutional accountability (architecture center)

The architecture is not centered on AI. It is centered on **institutional accountability**:

```text
Institution
      ↓
Preserve correctly          (Constitution)
      ↓
Reason responsibly          (EI Doctrine)
      ↓
Verify independently        (Verification Framework)
      ↓
Audit historically          (Institutional Audit · reserved)
      ↓
Govern responsibly          (Policy + Decision Ledger)
      ↓
Institution
```

Intelligence sits inside a governance cycle — it does not replace one.

---

*Verification Lanes · Three Correctness Model · LocalBrain V1 · Executive Intelligence Era · 2026*
