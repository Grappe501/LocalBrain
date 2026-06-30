# ENG-CAP-001 — Capability Registry

> **Engine:** ENG-CAP-001 · **Navigation Intelligence:** ENG-NAV-001  
> **Slice:** LB-OS-026.6 · **Burt packet:** [LB-OS-026.6](./burt_packets/LB-OS-026.6.md)

---

## Purpose

One canonical metadata layer. Every navigation surface, workflow, dashboard, search feature, and AI route projection derives from the **capability graph** — not hardcoded links.

```txt
Capability
      ↓
Executive Questions
      ↓
Routes
      ↓
Related Capabilities
      ↓
Workflows
      ↓
Navigation
```

This is platform GPS — part of the world model, not UI polish.

---

## Capability record schema

| Field | Purpose |
| ----- | ------- |
| `capability_id` | Stable ID (e.g. `CAP-PLN-001`) |
| `title` | Human label |
| `description` | What this capability does |
| `executive_question_ids` | EQs this surface answers |
| `primary_route` | Authoritative URL |
| `secondary_routes` | Aliases / redirects |
| `prerequisites` | Capability IDs that should precede |
| `next_recommended_steps` | Forward workflow hints |
| `related_capabilities` | Typed edges (`supports`, `feeds`, `certifies`, …) |
| `departments` | Owning departments |
| `workflows` | Workflow membership |
| `keywords` / `search_terms` | Intent routing |
| `authority_level` | `authoritative` · `summary` · `supporting` |
| `completion_status` | `production` · `partial` · `stub` |
| `maturity` | Completion %, health, dependencies, last slice |
| `nav_placement` | Shell placement |
| `slice_id` | Build slice |
| `executive_outcome` | What this capability must accomplish (required) |
| `entry_vectors` | Valid user arrival paths for analytics |
| `utilization.utilization_percent` | Future utilization metric (`null` until measured) |

---

## Permanent capability identity (frozen)

Capability IDs are **immutable** from LB-OS-026.6 forward. See `CAPABILITY_ID_FREEZE_SLICE` in code.

```txt
CAP-MIG-001   CAP-PLN-001   CAP-PRF-001   CAP-DLS-001   …
```

Everything references capabilities — not pages. Routes may change; capability IDs do not.

---

## Graph integrity gate

Before LB-OS-026.7: [Graph Integrity Certification](./LOCALBRAIN_GRAPH_INTEGRITY_CERTIFICATION.md) must **PASS**.

`GET /api/integration/graph-integrity`

## Relationship types

```txt
Workspace Architecture  —supports→  Digital Land Survey
Digital Land Survey     —feeds→     Migration Proof
Migration Proof         —certifies→ Migration Planning
Migration Planning      —produces→  Executive Approval
Executive Approval      —enables→  Migration Cutover
```

---

## Derived graphs (single source)

| Graph | Builder |
| ----- | ------- |
| Capability dependency | `buildCapabilityDependencyGraph()` |
| Workflow | `buildWorkflowGraph()` |
| Executive Question | `buildExecutiveQuestionGraph()` |
| Route | `buildRouteGraph()` |
| Navigation (union) | `buildNavigationGraph()` |

**Code:** `shared/src/capabilityRegistry.ts` · `shared/src/navigationIntelligence.ts`

---

## Intent routing

```txt
Intent  →  Executive Question  →  Capability  →  Route
```

**API:** `GET /api/integration/intent?q=...`  
**Example:** `"I need to move my ContactList workspace"` → `CAP-PLN-001` → `/migration/planning`

---

## UI projections

| Surface | Source |
| ------- | ------ |
| Sidebar (`DepartmentNav`) | `getKernelNavItems()` |
| Migration pipeline strip | `getMigrationPipelineStrip()` |
| Breadcrumbs + workflow links | `getWorkflowNavigation(route)` |
| EQ cross-links | `executiveQuestion.ts` + capability graph |
| Program Office experience cert | `runExecutiveExperienceAudit()` |

---

## Validation

- Executive Journey Test (forward migration arc)
- Reverse Journey Test (from Proof)
- Registry consistency (`ENG-EEC-001`)
- [Executive Experience Certification](./LOCALBRAIN_EXECUTIVE_EXPERIENCE_CERTIFICATION.md)

---

## Doctrine boundary

ENG-CAP-001 is **metadata infrastructure** — not a new cognitive layer. It operationalizes discoverability for Session 4 (Executive Practitioner) without expanding Theory v1.0 ontology.

Future Phase 2+: capability graph feeds Digital Twin / World Model routing.

---

*ENG-CAP-001 · LB-OS-026.6*
