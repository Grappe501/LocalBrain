# CONTACT-V3-100 — UCIE Charter (Identity Acquisition Platform)

> **Status:** **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
> **Contract:** `CONTACT-V3-100`  
> **Peer:** [ENG-CONTACT-001 Contact Management](../contact-management/ENG-CONTACT-001-CHARTER.md)  
> **Does not modify:** [Contact Management v3 Architecture v1.0](../contact-management/slices/CONTACT-V3-ARCHITECTURE.md)

---

## What UCIE is

**Universal Contact Ingestion Engine (UCIE)** is the **Identity Acquisition Platform** — a peer subsystem to Contact Management.

Contact Management answers: *How do we cultivate relationships?*  
UCIE answers: *How does a trusted identity enter the platform?*

---

## Binding architectural question

> **Can LocalBrain acquire identities from every supported source with accuracy before volume — preserving provenance, explainability, and human review — without corrupting the certified relationship core?**

---

## Success criterion

A user can bring contacts from **any supported source** into the platform while preserving:

- Identity accuracy
- Provenance
- Explainability
- Human review where needed
- Volunteer-assisted resolution
- Canonical relationship integrity

The outcome is **trusted identities**, not imported rows.

---

## In scope

- Universal intake gateway (manual, CSV, Excel, OCR, PDF, voter files, connector exports, event/petition exports)
- Import sessions with full provenance — nothing anonymous
- Schema discovery with confidence + human approval
- OCR workspace (accuracy over speed — one contact at a time)
- Identity resolution with evidence-backed matching
- Voter resolution assistant + verification work items
- Work marketplace for claimable resolution tasks
- Field-level provenance engine
- Temporary connector framework (import · disconnect · no permanent sync in v1.0)
- Data quality dashboard for ingestion operations

---

## Out of scope (v1.0)

- Modifying Contact Management v3 frozen architecture
- Permanent bi-directional connector synchronization
- Automatic merge below approved confidence threshold
- Batch OCR insertion
- Replacing ENG-CONTACT-001.3 CSV (UCIE wraps and extends with staging + provenance)

---

## Relationship to Contact Management

```text
External sources
      ↓
UCIE (stage · normalize · match · review)
      ↓
Commit adapter → Contact Identity Engine (ENG-CONTACT-001.1)
      ↓
Certified relationship engines (Timeline · Context · Stewardship · …)
```

---

## Governance review (2026-07-05)

| Decision | Result |
| -------- | ------ |
| Implementation Status | ✅ **APPROVE** |
| Pattern Status | 🏆 **REFERENCE PATTERN CERTIFIED** |

Reviewed against **UCIE governance artifacts** — not Contact Management v3 Architecture v1.0. UCIE responsibility ends at delivering trusted identities into the certified relationship platform.

---

*CONTACT-V3-100 · UCIE Charter · LocalBrain · 2026*
