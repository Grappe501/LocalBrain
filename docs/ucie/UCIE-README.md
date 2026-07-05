# Universal Contact Ingestion Engine (UCIE) — Roadmap

> **Contract:** `CONTACT-V3-100`  
> **Status:** **COMPLETE** · ✅ Approved · 🏆 Reference Pattern Certified · 2026-07-05  
> **Phase:** [Evidence-Driven Development](../operator-readiness/EVIDENCE-DRIVEN-DEVELOPMENT.md) · PRL-3  
> **Doctrine:** [Certified Implementation Doctrine](../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md) — frozen  
> **Subsystem:** **Identity Acquisition Platform** — peer to Contact Management, not an engine inside it  
> **Foundation:** [UCIE Charter](./UCIE-CHARTER.md) · [Constitution](./UCIE-CONSTITUTION.md) · [Architecture](./UCIE-ARCHITECTURE.md) · [ADRs](./UCIE-DECISION-RECORDS.md)  
> **Slice:** [CONTACT-V3-100](./CONTACT-V3-100-IDENTITY-ACQUISITION-PLATFORM.md)  
> **Contact Management v3:** [Certified relationship core](../contact-management/slices/CONTACT-V3-README.md) — **frozen** · UCIE consumes, never modifies

---

## Architectural question

> **How does a trusted identity enter the platform?**

Every certified Contact Management engine assumes a contact already exists. UCIE acquires identities from supported sources, normalizes them, resolves duplicates through evidence-backed matching, preserves provenance, and routes uncertain records into human work queues.

**Outcome:** trusted identities — not anonymous imports.

---

## Overall architecture (three governed platforms)

```text
External Sources
        │
        ▼
UCIE — Identity trust
(Stage → Resolve → Review → Commit)
        │
        ▼
Canonical Contact Identity
        │
        ▼
Contact Management v3 — Relationship trust
(Context → Stewardship → Action →
 Household → Organizations → Intelligence)
        │
        ▼
VOP — Operational trust
(Marketplace → Queue → Supervision → Execution)
```

| Platform | Responsibility | Certified doctrine |
| -------- | -------------- | ------------------ |
| **UCIE** | Identity trust | Stage, don't commit · Provenance, always · Review before merge |
| **Contact Management v3** | Relationship trust | Promote · Reference · Group · Belong · Summarize · Aggregate |
| **VOP** | Operational trust | Coordinate people, don't just assign tasks · Expose, don't obscure |

See [VOP README](../vop/VOP-README.md) for operational subsystem details.

---

## Peer subsystem boundary

| Subsystem | Owns |
| --------- | ---- |
| **UCIE (Identity Acquisition)** | Intake, staging, schema discovery, identity resolution, provenance, work marketplace, commit gate |
| **Contact Management (Relationship OS)** | Canonical contact record + seven relationship engines |

UCIE **never writes directly** to canonical contact tables. Commit passes through an explicit adapter after resolution.

---

## Implementation modules (one epic)

| Module | Responsibility |
| ------ | -------------- |
| UCIE-101 | Universal intake gateway — all sources → Import Session |
| UCIE-102 | Import Session, Batch, File, Row, Artifact entities |
| UCIE-103 | Column mapping with confidence + human approval |
| UCIE-104 | One-at-a-time OCR review workspace |
| UCIE-105 | Evidence-backed identity matching |
| UCIE-106 | County voter lookup + verification work items |
| UCIE-107 | Claimable volunteer/manager work |
| UCIE-108 | Field-level provenance on every canonical value |
| UCIE-109 | Temporary authenticated import connections |
| UCIE-110 | Ingestion operational intelligence |

See [Implementation Package](./CONTACT-V3-100-IMPLEMENTATION-PACKAGE.md) for build increments and acceptance criteria.

---

## Certified UCIE doctrine

1. **Stage, don't commit** — nothing enters canonical storage without explicit resolution
2. **Provenance, always** — every field knows its source
3. **Review before merge** — no automatic merge below approved confidence threshold

---

## Status

| Area | Status |
| ---- | ------ |
| UCIE-101 – UCIE-110 | 🏆 Certified · tests 2/2 |
| Governance | ✅ Approved 2026-07-05 |
**Next phase:** [Operator Readiness](../contact-management/slices/CONTACT-V3-EXECUTION-CHARTER.md#operator-readiness-phase-current) — connector hardening, queue optimization, identity confidence (within certified contracts).

---
