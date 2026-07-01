# ENG-MEM-001.1 — Episode (Slice 1)

> **Status:** **COMPLETE** — PMO accepted · Reference Slice 001  
> **Wave:** 1 · Canonical Storage  
> **Designation:** **Reference Slice 001** — when asked how to implement a slice, follow Episode  
> **Blocks:** ENG-MEM-001.2 (Fact) — authorized

---

## Mission

Implement **Episode** canonical persistence completely — schema, validation, serialization, lifecycle, provenance, trust envelope, and audit hooks.

**Excluded from this slice:** graph edges · retrieval · intelligence · summarization · merge-into-summary behavior (Vol 3 consolidation is later wave).

> Episode is the atom of institutional memory — meetings, calls, decisions, and future **Institution Timeline** entries are Episodes before Intelligence interprets them.

---

## Slice structure (gold standard template)

| Artifact | Location |
| -------- | -------- |
| Charter | This document |
| Specification references | § below |
| Engineering Decision Record | [ENG-MEM-001.1-EDR.md](./ENG-MEM-001.1-EDR.md) |
| Acceptance checklist | § Engineering acceptance |
| Implementation | `backend/src/memory/` · `shared/src/memoryOs/` |
| Tests | `backend/src/memory/episode.test.ts` |
| Close-out report | [ENG-MEM-001.1-SLICE_CLOSEOUT.md](./ENG-MEM-001.1-SLICE_CLOSEOUT.md) |

---

## Specification anchors

| Anchor | Document |
| ------ | -------- |
| `Vol2-Episode` | [Volume 2 § Episodes](../VOLUME-2-MEMORY_DATA_MODEL.md) |
| `Registry-Episode` | [Object Registry — Episode](../CANONICAL_OBJECT_REGISTRY.md) |
| `S2-Lifecycle` | [Convention S2](../convention/CONVENTION-S2-MEMORY_LIFECYCLE_CONTRACT.md) |
| `S4-Provenance` | [Convention S4](../convention/CONVENTION-S4-PROVENANCE_CONTRACT.md) |
| `TIME_MODEL` | [Time Model § Episode](../TIME_MODEL.md) |
| `TRUST` | [Trust & Provenance Model](../TRUST_PROVENANCE_MODEL.md) |
| `Vol3-WritePipeline` | [Volume 3](../VOLUME-3-MEMORY_ENGINE.md) — write path (persistence only) |

---

## Required fields (Vol 2)

| Field | Required |
| ----- | -------- |
| `episode_id` | Yes |
| `schema_version` | Yes |
| `domain` | Yes |
| `title` | No |
| `started_at` | Yes |
| `ended_at` | No |
| `participants` | No |
| `source_ref` | Yes |
| `lifecycle_state` | Yes |
| `provenance` | Yes |
| `event_at` | Yes |
| `created_at` | Yes |

---

## Deliverables

- [x] Episode schema definition aligned to Vol 2 (`shared/src/memoryOs/episode.ts`)  
- [x] Validator — reject unknown fields · enforce required set  
- [x] Domain enum validation (six domains)  
- [x] Lifecycle transition enforcement (S2)  
- [x] S4 provenance envelope on create  
- [x] Trust metadata per TRUST model  
- [x] Persistence adapter (append-oriented writes)  
- [x] Serialization round-trip tests  
- [x] Audit hook on create and lifecycle transition  

---

## Engineering acceptance

| # | Check | Result | Notes |
| - | ----- | ------ | ----- |
| A1 | Schema matches Volume 2 | **PASS** | `shared/src/memoryOs/episode.ts` |
| A2 | Registry fields complete | **PASS** | All required Vol 2 fields |
| A3 | S2 lifecycle implemented | **PASS** | `lifecycle.ts` + store transition guard |
| A4 | S4 provenance envelope | **PASS** | `provenanceEnvelope.ts` · CON-S4-2026-07 |
| A5 | Time model | **PASS** | started/ended/event/created |
| A6 | Trust metadata implemented | **PASS** | trust envelope in provenance |
| A7 | Serialization round-trip passes | **PASS** | `episode.test.ts` |
| A8 | Append-only invariant holds | **PASS** | single row · content fingerprint |
| A9 | Factory boundary respected | **PASS** | no factory/ imports |
| A10 | No retrieval logic | **PASS** | no recall module |
| A11 | No intelligence logic | **PASS** | no LLM |

**Slice result:** **PASS** — closeout recorded · [ENG-MEM-001.2](./ENG-MEM-001.2-FACT.md) may begin.

---

## Example commit message

```text
ENG-MEM-001.1
Canonical Episode storage

Implements:
Vol2-Episode
Registry-Episode
S2-Lifecycle
S4-Provenance
TIME_MODEL
TRUST
Vol3-WritePipeline
```

---

*ENG-MEM-001.1 Episode · Gold standard slice · LocalBrain V1*
