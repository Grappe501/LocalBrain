# Graph Integrity Certification — LB-OS-026.6

> **Engine:** ENG-CAP-001 · **Gate before:** LB-OS-026.7  
> **API:** `GET /api/integration/graph-integrity`

---

## Purpose

Before Executive Dashboard polish (026.7) and before Memory OS work, certify that the **capability graph is internally complete**. This graph becomes long-term cognitive substrate — memories, plans, and AI recommendations will reference capability IDs, not pages.

---

## Binding checks

| # | Check | Pass condition |
| - | ----- | -------------- |
| 1 | **Route coverage** | Every live production route has a capability |
| 2 | **Question coverage** | Every non-stub capability has ≥1 Executive Question (supporting surfaces exempt) |
| 3 | **Authoritative uniqueness** | Every EQ has exactly one authoritative capability |
| 4 | **Workflow continuity** | Migration execution workflow connected end-to-end |
| 5 | **No orphans** | No production capability without a live route |
| 6 | **Outcome completeness** | Every capability declares `executive_outcome` |
| 7 | **Graph participation** | Every capability has workflow, relationship, prerequisite, or nav placement |

---

## Permanent capability identity

Capability IDs are **frozen at LB-OS-026.6** (`CAPABILITY_ID_FREEZE_SLICE`). Examples:

```txt
CAP-MIG-001   Migration Planner
CAP-DLS-001   Digital Land Survey
CAP-PRF-001   Migration Proof
CAP-PLN-001   Migration Planning
```

**Never rename.** Routes, docs, AI, and Memory OS reference capability IDs.

---

## Schema extensions (026.6)

| Field | Purpose |
| ----- | ------- |
| `executive_outcome` | What the capability must accomplish |
| `entry_vectors` | Valid arrival paths (dashboard, workflow, search, …) |
| `utilization.utilization_percent` | Future metric — `null` until instrumented |

---

## Sequence

```txt
026.6 Capability Graph + Experience Cert
  → Graph Integrity Certification PASS
  → 026.7 Executive Dashboard & Daily Briefing
  → Peer Review Session 4
```

---

*Graph Integrity Certification · LB-OS-026.6*
