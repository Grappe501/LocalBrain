# MAR-3 — Executive Intelligence Architecture Review

> **Status:** **COMPLETE** — all questions PASS · gates [EI-001 Doctrine Freeze](./EI-001-DOCTRINE-FREEZE.md)  
> **Scope:** Executive Intelligence Doctrine only · advisory layer · Executive Intelligence Era  
> **Prerequisite:** [ENG-PMO-005](./ENG-PMO-005-CONSTITUTIONAL-COMPLETION.md) · [Executive Intelligence Doctrine](./EXECUTIVE-INTELLIGENCE-DOCTRINE.md)  
> **Gate:** [EI-001 Doctrine Freeze](./EI-001-DOCTRINE-FREEZE.md) may proceed  
> **Analog:** MAR-2 validated the last substrate; MAR-3 validates the first advisory layer

**Context:** Governance architecture is **feature-complete** pending this review — not another Constitutional Completion Milestone, but validation that the EI Doctrine is ready to freeze. No further governance documents before EI-001.

---

## Purpose

Validate the **Executive Intelligence Doctrine** against questions that are hardest to change after implementation begins.

MAR-1 validated the full Memory OS specification. MAR-2 validated authority preservation. MAR-3 validates **probabilistic reasoning over deterministic memory** — the bridge from constitutional records to advisory leadership products.

MAR-3 reviews **capabilities and failure modes**. The Memory OS process validated boundaries, not only the happy path. MAR-3 applies the same discipline: every positive review question has a corresponding **negative test** — a "cannot happen" check that must also PASS.

**Guiding principle (binding throughout MAR-3):**

> **Intelligence reasons over institutional memory. It does not replace it.**

---

## Verdict discipline (binding)

MAR-3 outcomes are **binary**. Each question receives exactly one of:

| Verdict | Meaning |
| ------- | ------- |
| **PASS** | Doctrine is constitutionally ready on this question — positive and negative tests satisfied |
| **FAIL** | Doctrine or design is not ready — EI-001 may not proceed |
| **Required amendment** | A constitutional change to the doctrine is needed before re-review |

**Not permitted:** "PASS with comments" · conditional PASS · deferred findings without verdict.

Either the doctrine is constitutionally ready, or it enters another revision cycle. MAR-3 **COMPLETE** requires every question **PASS** — no FAIL · no unresolved Required amendment.

---

## Constitutional bridge (context)

Wave 1 closed the governance loop at authority **recording**:

```text
Authority is exercised. It is never inferred.
Authority is recorded. It is never reconstructed.
```

Wave 2 must close the loop at authority **transition**:

```text
Memory preserves.
      ↓
Executive Intelligence recommends.
      ↓
Policy decides.
      ↓
Decision Ledger records.
```

MAR-3 verifies that no implementation path collapses recommendation into decision — and that no failure path bypasses safe degradation or burden of proof.

---

## Review questions (positive and negative)

| # | Positive review | Negative review (failure mode) | Verdict | Finding |
| - | --------------- | ------------------------------ | ------- | ------- |
| Q1 | Can Executive Intelligence ever mutate constitutional substrates? | Is there *any* code path that could **indirectly** mutate a substrate? | **PASS** | Article II · ENG-EI-001 read-only · no shared write pipeline · negative guards documented §1 |
| Q2 | Can recommendations ever become decisions automatically? | Can a recommendation accidentally be **interpreted as institutional approval**? | **PASS** | Article VII · distinct advisory types · no auto-approval path · negative guards §2 |
| Q3 | Is every work product traceable to constitutional records? | Can a work product ever be produced **without citations**? | **PASS** | Article IV · five products only · evidence threshold · negative guards §3 |
| Q4 | Can one reasoning engine be replaced without changing institutional memory? | Does any constitutional record **depend on a specific model implementation**? | **PASS** | Article V · substrates model-agnostic · replaceability test · negative guards §4 |
| Q5 | Is uncertainty always distinguishable from constitutional record? | Can uncertainty ever appear **visually or semantically** as institutional fact? | **PASS** | Article VI · record vs assessment · negative guards §5 |
| Q6 | Does Executive Intelligence degrade safely when evidence is insufficient? | Can EI ever **fabricate continuity**, infer missing substrates, or proceed without disclosing insufficient evidence? | **PASS** | Article VIII · withhold · insufficient evidence · negative guards §6 |
| Q7 | Does Executive Intelligence bear the burden of proof? | Can a recommendation proceed **without earning** sufficient cited constitutional evidence? | **PASS** | Article IX · evidence threshold model · absence ≠ support · negative guards §7 |

**MAR-3 COMPLETE** — all seven questions **PASS** · no FAIL · no Required amendment · EI-001 authorized to proceed.

---

## §1 Substrate immutability (Q1)

### Positive test

Executive Intelligence **must not**:

- write to Episode · Artifact · Fact · Conversation · DecisionCitation stores,
- create substrate-shaped fields in advisory artifacts that imply ownership,
- silently promote assessment to knowledge or authority.

Executive Intelligence **must**:

- read substrates through defined retrieval and citation interfaces only,
- treat all substrate mutation as out-of-scope — Memory OS and Policy domains.

### Negative test — indirect mutation paths

The following **cannot happen**:

| Failure mode | Guard |
| ------------ | ----- |
| Advisory artifact write triggers substrate side-effect | Read-only retrieval boundary · no shared write pipeline with Memory OS |
| Citation assembly mutates source record metadata | Citations are pointers · substrates immutable after capture |
| "Sync" or "refresh" path rewrites canonical fields | No reconciliation · no LLM-driven substrate repair |
| Assessment promoted to Fact without acceptance workflow | Interpretation Independence · Fact acceptance required |
| Recommendation stored as DecisionCitation without Policy | Article VII · Policy gate before ledger citation |

**Q1 verdict:** **PASS**

---

## §2 Recommendation vs decision (Q2)

```text
Executive Intelligence  →  recommends
Policy                  →  decides
Decision Ledger         →  records binding authority
DecisionCitation        →  cites ledger in memory
```

No auto-approval path. No "execute recommendation" without Policy gate. No Intelligence output that constitutes institutional approval, authorization, or execution.

### Negative test — accidental authority

The following **cannot happen**:

| Failure mode | Guard |
| ------------ | ----- |
| UI presents Recommendation with approval affordance | Visual separation · no approve/execute on advisory products |
| API response shape mirrors DecisionCitation without Policy gate | Distinct schemas · advisory ≠ authority types |
| Default action on Recommendation is "accept" | No implicit acceptance · explicit Policy transition required |
| Recommendation language uses binding verbs ("approved", "authorized", "executed") | Article VII · advisory vocabulary enforced |
| Downstream automation treats Recommendation as ledger event | No webhook/auto-record path from Intelligence to Decision Ledger |

**Q2 verdict:** **PASS**

---

## §3 Work product traceability (Q3)

Constitutional work products (doctrine-defined):

```text
Executive Brief
Executive Assessment
Executive Options
Executive Recommendation
Executive Risk Assessment
```

Each product must declare substrate citations. **Executive Options** is mandatory — Intelligence must surface alternatives, not premature convergence.

### Negative test — uncited output

The following **cannot happen**:

| Failure mode | Guard |
| ------------ | ----- |
| Work product emitted with empty citation set | Validator rejects · Article IV · Article VIII withhold |
| Partial citations presented as complete traceability | Citation completeness check before product release |
| Free-form LLM response bypasses product schema | Only five constitutional products · no arbitrary output types |
| Citations to non-existent substrate IDs silently dropped | Citation integrity validation · fail closed |
| "Internal reasoning" cited instead of constitutional substrates | Citations must reference Episode · Artifact · Fact · Conversation · DecisionCitation only |

**Q3 verdict:** **PASS**

---

## §4 Engine replaceability (Q4)

Replaceability test:

```text
Change reasoning engine
        ↓
Substrates unchanged
Policy gates unchanged
Decision Ledger unchanged
Work product schema unchanged
Only assessment content changes
```

### Negative test — model coupling

The following **cannot happen**:

| Failure mode | Guard |
| ------------ | ----- |
| Substrate schema embeds model version or embedding signature | Article V · substrates model-agnostic |
| Fact or Episode content includes model-specific inference artifacts as canonical fields | No LLM output in substrate stores |
| Work product schema requires model-specific fields | Schema is engine-neutral · assessment content only varies |
| Retrieval ranking depends on unreproducible model state as institutional record | Ranking is advisory layer only · not persisted as substrate |
| Migration required to swap reasoning engine | Replaceability test must pass without substrate migration |

**Q4 verdict:** **PASS**

---

## §5 Uncertainty discipline (Q5)

Every work product must visibly separate:

| Label | Nature |
| ----- | ------ |
| **Institutional Record** | Cited constitutional substrates · deterministic |
| **Executive Assessment** | Probabilistic judgment · advisory |

UI, API, and storage representations must preserve this distinction.

### Negative test — blended presentation

The following **cannot happen**:

| Failure mode | Guard |
| ------------ | ----- |
| Assessment rendered in same visual treatment as cited record | Distinct labels · typography · API fields |
| Confidence score presented without "assessment" qualifier | Article VI · uncertainty is visible |
| Synthesis paragraph mixes cited fact and inference without markers | Inline attribution · record vs assessment boundaries |
| Executive Brief omits assessment disclaimer | Every product carries epistemic classification |
| Storage serializes assessment into substrate-shaped JSON | Advisory artifacts use distinct types · not substrate aliases |

**Q5 verdict:** **PASS**

---

## §6 Safe degradation (Q6)

Article VIII — **Executive Intelligence must degrade safely.**

When Executive Intelligence cannot responsibly advise, it must report insufficient evidence, withhold recommendations, state low confidence explicitly, and never fabricate continuity.

### Negative test — failure path bypass

The following **cannot happen**:

| Failure mode | Guard |
| ------------ | ----- |
| Retrieval failure produces synthesized "best guess" context | Report insufficient evidence · Article VIII |
| Incomplete citations still emit Recommendation | Withhold recommendation · partial traceability fails closed |
| Missing substrate filled with LLM-generated placeholder | Do not fabricate continuity |
| Low confidence hidden to preserve user experience | Explicit uncertainty disclosure |
| Empty result set triggers generic advisory template | No template without citations · safe empty state |

**Q6 verdict:** **PASS**

---

## §7 Burden of proof (Q7)

Article IX — **Executive Intelligence bears the burden of proof.**

Recommendations are presumed unsupported until sufficient constitutional evidence is assembled. The absence of evidence is not evidence of support.

The [Evidence threshold model](./EXECUTIVE-INTELLIGENCE-DOCTRINE.md#evidence-threshold-model) defines minimum constitutional basis per work product. If the threshold is not met, the product is withheld.

### Negative test — unearned recommendations

The following **cannot happen**:

| Failure mode | Guard |
| ------------ | ----- |
| Executive Recommendation emitted below evidence threshold | Article IX · withhold until earned |
| Single weak citation treated as sufficient for Recommendation | Structural minimum per work product type |
| Absence of contradicting evidence interpreted as support | Absence ≠ support · Article IX |
| Executive Options with one alternative and no cited support per option | Each option requires cited support |
| Executive Assessment without explicit uncertainty disclosure | Multiple cited substrates + uncertainty required |

**Q7 verdict:** **PASS**

---

## Recommended sequence after MAR-3

```text
MAR-3 COMPLETE (all questions PASS)
      ↓
EI-001 Doctrine Freeze (ei-doctrine-v1.0)
      ↓
ENG-EI-001 Constitutional Retrieval
      ↓
First implementation slice authorized
      ↓
PMO acceptance (Executive Intelligence Era)
```

---

## PMO signoff

```text
MAR-3
Executive Intelligence Architecture Review
Questions reviewed:
7
PASS:
7
FAIL:
0
Required amendments:
0
Constitutional defects:
0
Status:
READY FOR EI-001 DOCTRINE FREEZE
```

| Reviewer | Date | Verdict |
| -------- | ---- | ------- |
| Engineering | 2026-07-02 | PASS — Q1–Q7 |
| PMO | 2026-07-02 | EI-001 declared · [ENG-PMO-006](./ENG-PMO-006-EI-DOCTRINE-FREEZE.md) |

---

*MAR-3 · Executive Intelligence Architecture Review · LocalBrain V1 · 2026*
