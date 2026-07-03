# ENG-EI — Work Product Contract

> **Status:** Binding engineering contract · not constitutional governance  
> **Parent:** [ENG-EI-002 Charter](./ENG-EI-002-CHARTER.md) · [Engineering Discipline](./ENG-EI-ENGINEERING-DISCIPLINE.md)  
> **Canonical types:** `shared/src/memoryOs/executiveBrief.ts`  
> **Version:** `ENG-EI-002.2` (behavioral fidelity) · **ACCEPTED** · [ENG-PMO-009](./ENG-PMO-009-EXECUTIVE-BRIEF-ACCEPTANCE.md)  
> **Reference consumer:** **Reference Consumer 001** — Executive Brief · PMO designated

---

## Purpose

Downstream Executive Intelligence must not depend on *how* the Executive Brief is rendered. It consumes a **stable, versioned Work Product Contract**.

This is the same decoupling Evidence Package provides between Retrieval and consumption.

```text
ConstitutionalEvidencePackage
        ↓
Work Product Contract
        ├── Sections · statements
        ├── Citation refs · citation groups
        ├── Source mapping
        ├── Evidence boundaries
        ├── Omission notes
        └── Deterministic version
        ↓
Executive Brief
```

---

## Contract surface

| Field | Contract obligation |
| ----- | ------------------- |
| `brief_id` · `package_id` · `request_id` · `scope_label` | Traceability to source package |
| `brief_version` · `rendered_at` · `source_package_fingerprint` | Versioned, auditable render |
| `source_package_status` | Inherited package outcome — complete · withheld · insufficient_evidence |
| `sections` · `statements` | Structured brief body — every assertion cites package evidence |
| `citation_refs` (per statement) | One or more package `citation_ref` values |
| `citation_groups` | Section-level assertion ↔ evidence mapping |
| `source_mapping` | Citation ref → substrate summary |
| `evidence_boundaries` | Reported · excluded · absent · withheld |
| `omission_notes` | Package exclusions · completeness gaps · explicit boundaries |
| `uncertainty_note` (per statement) | Preserved where source records carry confidence |

**Out of contract:** recommendations · options · prioritization · risk assessment · substrate fetches · package mutation · model judgment.

---

## Lane 2 verification

| Metric | Question |
| ------ | ---------- |
| **Consumption fidelity** | Did the brief consume only the Evidence Package? |
| **Citation preservation** | Is every assertion traceable to package citations? |
| **Uncertainty preservation** | Is source confidence surfaced — never collapsed? |
| **Omission explicitness** | Are exclusions and non-complete status visible? |
| **Determinism** | Is identical package input → identical brief structure? |

**Engineering heuristic:** *Does this make the Executive Brief more faithful without making it more opinionated?*

---

## Consumer rule (binding)

| Allowed | Forbidden |
| ------- | --------- |
| Consume `ExecutiveBrief` as work product input | Re-fetch substrates to fill gaps |
| Extend with probabilistic reasoning in later charters | Mutate the Evidence Package |
| Emit downstream work products (Assessment · Options · etc.) | Emit recommendations from the brief renderer |

Replaceability (Article V) depends on this boundary.

---

## Reference Consumer 001

The **Executive Brief** is PMO-designated **Reference Consumer 001** — the first implementation that demonstrated stable, repeatable behavioral guarantees against this contract.

Future work products inherit the contract; they do not redefine it without a charter amendment.

---

*ENG-EI Work Product Contract · LocalBrain V1 · Executive Intelligence Era · 2026*
