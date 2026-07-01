# ENG-MEM-001.1 — Episode (Slice 1)

> **Status:** Ready — not started  
> **Wave:** 1 · Canonical Storage  
> **Object:** Episode — core temporal memory unit  
> **Blocks:** ENG-MEM-001.2 (Fact)

---

## Mission

Implement **Episode** canonical persistence completely — schema, validation, serialization, lifecycle, provenance, trust envelope, and audit hooks.

**Excluded from this slice:** graph edges · retrieval · intelligence · summarization · merge-into-summary behavior (Vol 3 consolidation is later wave).

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

- [ ] Episode JSON/schema definition aligned to Vol 2  
- [ ] Validator — reject unknown fields · enforce required set  
- [ ] Domain enum validation (six domains)  
- [ ] Lifecycle transition enforcement (S2)  
- [ ] S4 provenance envelope on create  
- [ ] Trust metadata per TRUST model where applicable  
- [ ] Persistence adapter (append-oriented writes)  
- [ ] Serialization round-trip tests  
- [ ] Audit hook on create and lifecycle transition  

---

## Engineering acceptance

| # | Check | Result | Notes |
| - | ----- | ------ | ----- |
| A1 | Schema matches Volume 2 | Pending | |
| A2 | Registry fields complete | Pending | |
| A3 | S2 lifecycle implemented | Pending | |
| A4 | S4 provenance envelope | Pending | |
| A5 | Time model (`started_at`/`ended_at`/`event_at`/`created_at`) | Pending | |
| A6 | Trust metadata implemented | Pending | |
| A7 | Serialization round-trip passes | Pending | |
| A8 | Append-only invariant holds | Pending | |
| A9 | Factory boundary respected | Pending | |
| A10 | No retrieval logic | Pending | |
| A11 | No intelligence logic | Pending | |

**Slice result:** `Pending` — all eleven must be **PASS** before ENG-MEM-001.2.

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
```

---

*ENG-MEM-001.1 Episode · Wave 1 Slice 1 · LocalBrain V1*
