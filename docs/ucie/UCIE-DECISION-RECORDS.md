# UCIE-DECISION-RECORDS (ADR)

> **Type:** Architecture Decision Records — UCIE subsystem  
> **Status:** Active · append over time  
> **Peers:** [UCIE Constitution](./UCIE-CONSTITUTION.md) · [Contact v3 ADRs](../contact-management/slices/CONTACT-V3-DECISION-RECORDS.md)

---

## ADR-UCIE-001 — UCIE as peer subsystem, not Contact Management engine

**Status:** Accepted · 2026-07-05

**Context:** Contact Management v3 Architecture v1.0 is frozen with seven relationship engines. Ingestion spans intake, staging, matching, and provenance — concerns distinct from relationship cultivation.

**Decision:** UCIE (`CONTACT-V3-100`) is the **Identity Acquisition Platform** — a peer subsystem with independent governance. It does not appear as an eighth engine in Contact Management architecture.

**Consequences:** Separate docs track (`docs/ucie/`). Commit adapter is the only write path to canonical contacts. Contact v3 frozen artifacts remain untouched.

---

## ADR-UCIE-002 — Stage, don't commit

**Status:** Accepted · 2026-07-05

**Decision:** No intake source writes directly to `contacts`. Every import creates an `ImportSession`; rows remain staged until identity resolution completes and commit is explicit.

---

## ADR-UCIE-003 — Review before merge

**Status:** Accepted · 2026-07-05

**Decision:** Identity resolution produces `exact_match`, `high_confidence`, `review_required`, or `new_identity`. Automatic merge occurs only at `exact_match` threshold (normalized email or phone). All lower confidence routes to work marketplace.

---

## ADR-UCIE-004 — Connectors are temporary in v1.0

**Status:** Accepted · 2026-07-05

**Decision:** Google, Apple, Outlook, Gmail connectors import once and disconnect. No permanent synchronization in UCIE v1.0.

---

## ADR-UCIE-005 — OCR accuracy over speed

**Status:** Accepted · 2026-07-05

**Decision:** OCR workspace processes one prospective contact at a time. No batch insertion from OCR.

---

## ADR-UCIE-006 — UCIE Reference Pattern Certified

**Status:** Accepted · 2026-07-05

**Context:** Initial vertical implementation of CONTACT-V3-100 completed with targeted tests 2/2 and commit adapter boundary verified.

**Decision:** UCIE is **Reference Pattern Certified** as the canonical Identity Acquisition Platform. Certified doctrine: Stage, don't commit · Provenance, always · Review before merge.

**Consequences:** Future acquisition sources, connectors, and operator workflows extend UCIE without modifying Contact Management v3 frozen architecture.

---

*UCIE ADR index · LocalBrain · 2026*
