# UCIE Architecture — Identity Acquisition Platform

> **Version:** v1.0 · **Certified** · 2026-07-05  
> **Contract:** `CONTACT-V3-100`  
> **Peer:** [Contact Management v3 Architecture v1.0](../contact-management/slices/CONTACT-V3-ARCHITECTURE.md) — **frozen**  
> **Constitution:** [UCIE Constitution](./UCIE-CONSTITUTION.md)

---

## Subsystem model

UCIE is **not** an eighth Contact Management engine. It is a **peer subsystem**:

```text
┌─────────────────────────────────────┐
│     Identity Acquisition (UCIE)      │
│  Intake → Stage → Match → Review     │
└─────────────────┬───────────────────┘
                  │ commit adapter
                  ▼
┌─────────────────────────────────────┐
│   Contact Management (Relationship)  │
│  Identity · Timeline · Context · …   │
└─────────────────────────────────────┘
```

---

## Pipeline stages

```text
1. Intake Gateway (UCIE-101)     — source → Import Session
2. Session Engine (UCIE-102)     — batch, file, row, artifact entities
3. Schema Discovery (UCIE-103)   — column mapping + confidence
4. Normalize                     — canonical field extraction per row
5. Identity Resolution (UCIE-105)— evidence-backed matching
6. Review / Work (UCIE-107)      — claimable work items
7. Provenance (UCIE-108)         — field-level source chain
8. Commit Gate                   — adapter → Contact Identity Engine
```

Specialized surfaces:

- **OCR Workspace (UCIE-104)** — one prospective contact at a time
- **Voter Assistant (UCIE-106)** — county narrowing + verification items
- **Connectors (UCIE-109)** — temporary authenticated import
- **Quality Dashboard (UCIE-110)** — ingestion operational intelligence

---

## Module map

| Module | Engine responsibility |
| ------ | --------------------- |
| UCIE-101 | Universal Intake Gateway |
| UCIE-102 | Import Session Engine |
| UCIE-103 | Schema Discovery |
| UCIE-104 | OCR Workspace |
| UCIE-105 | Identity Resolution |
| UCIE-106 | Voter Resolution Assistant |
| UCIE-107 | Work Marketplace |
| UCIE-108 | Provenance Engine |
| UCIE-109 | Connector Framework |
| UCIE-110 | Data Quality Dashboard |

---

## Data boundaries

| Data | Owner |
| ---- | ----- |
| Staged import rows, artifacts, match candidates | UCIE |
| Work items, claims, provenance records | UCIE |
| Canonical `contacts` table | Contact Identity Engine |
| Relationship engines (timeline, context, …) | Contact Management v3 |

**Rule:** UCIE reads canonical contacts for matching. UCIE writes contacts only through `ucieCommitService`.

---

## Implementation patterns (from Contact v3)

- Shared contracts + version constants
- Validator + RBAC
- Repository + append-only audit where applicable
- Compute/service layer for derived views
- Dedicated API router (`/api/ucie/...`)
- Focused UI module (`ingestion-studio`)
- Targeted isolated tests

---

*UCIE Architecture v1.0 · LocalBrain · 2026*
