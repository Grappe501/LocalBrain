# Executive Experience Certification — LB-OS-026.6

> **Engine:** ENG-EEC-001 (audit) · ENG-EEX-001 (headline score)  
> **Parent:** [Phase 1 Certification](./LOCALBRAIN_PHASE1_CERTIFICATION.md) · [Platform Audit](./LOCALBRAIN_PLATFORM_AUDIT.md)  
> **Burt packet:** [LB-OS-026.6](./burt_packets/LB-OS-026.6.md)

---

## Purpose

Phase 1 certification (026.5) proved **engineering airworthiness**. Executive Experience Certification proves **executive usability**:

> A capability that cannot be found is functionally the same as one that does not exist.

This is the completion artifact for LB-OS-026.6. Re-run after LB-OS-026.7 (dashboard polish) before Peer Review Session 4.

---

## Certification report (template)

```txt
Executive Experience Certification
Slice                         LB-OS-026.6
Observed at                   <ISO timestamp>

Navigation                    PASS | FAIL
Cross-link Integrity          PASS | FAIL
Route Registry                PASS | FAIL
Capability Discovery          PASS | FAIL
Workflow Continuity           PASS | FAIL
Dead Ends                     <count>  (max 0)
Average Click Depth           <float>  (max 2.5)
Registry Drift                <count>  (max 0)
Broken Links                  <count>  (max 0)

Certified                     YES | NO
```

---

## Audit dimensions

### Navigation completeness

| Check | Pass condition |
| ----- | -------------- |
| Live routes ⊆ registered routes | 100% |
| Registered routes ⊆ live routes | 100% (no phantom registry entries) |
| Nav items → live destinations | 100% |
| Hidden production pages | 0 |

### Cross-link integrity

| Check | Pass condition |
| ----- | -------------- |
| Migration forward chain | Survey → Proof → Planning → Approval → Cutover linked |
| Migration reverse links | Each stage has ≥1 path to parent + adjacent stage |
| EQ cross-links resolve | All `buildCrossRouteLinks()` hrefs are live routes |
| Broken in-view links | 0 |

### Route registry

Canonical sources must agree:

```txt
frontend/src/router.tsx
backend/src/liveSurface/surfaceRegistry.ts
shared/src/executiveQuestion.ts (primary_route + summary_only_routes)
frontend/src/shell/DepartmentNav.tsx
module manifests (studio routes)
```

### Capability discovery

| Check | Pass condition |
| ----- | -------------- |
| Orphan capabilities | 0 |
| Max click depth from `/` | ≤ 3 for all live surfaces |
| Average click depth | ≤ 2.5 |
| EQ authoritative route reachable | 13/13 |

### Workflow continuity

| Check | Pass condition |
| ----- | -------------- |
| Dead ends (no outbound workflow link on migration stages) | 0 |
| Breadcrumb or lifecycle strip on migration views | 100% |
| ExecutiveQuestionShell on executive routes | Per EXECUTIVE_SHELL_ROUTES |

---

## Executive Experience score (user-facing)

Fifth platform headline — displayed in Program Office alongside Stability, Readiness, Maturity, Volatility.

| Component | Weight | Measures |
| --------- | -----: | -------- |
| **Findability** | 25% | Registry coverage · orphan count · EQ reachability |
| **Navigation** | 25% | Nav completeness · broken links · sidebar coverage |
| **Workflow Continuity** | 25% | Journey test pass · dead ends · migration chain |
| **Context Preservation** | 25% | Breadcrumbs · back links · EQ header presence |

**Example (target after 026.6):**

```txt
Executive Experience        96%
  Findability               97%
  Navigation                99%
  Workflow Continuity       95%
  Context Preservation      94%
  Dead Ends                 0
```

Labels: `needs_work` · `cohesive` · `certified` (≥ 95% + all dimension PASS)

---

## Automated audit report

`runExecutiveExperienceAudit()` output:

```txt
Live routes              N
Registered               N
Sidebar                  N
Dashboard                N
Search Index             N
Capability Matrix        N
Documentation            N
Broken                   0
```

**API:** `GET /api/integration/experience-audit` (planned — 026.6 implementation)

---

## Journey tests

### Executive Journey Test

From `/`, following only in-view links and shell nav, complete:

```txt
/migration/workspace-architecture
  → /migration/digital-land-survey
  → /migration/proof
  → /migration/planning
  → /migration/approval
  → /migration/cutover
```

### Reverse Journey Test

From `/migration/proof`, one-click reachability to:

```txt
/  (or briefing)
/migration/workspace-architecture
/migration/digital-land-survey
/migration/planning
```

Tests validate **link graph** extracted from view components + nav config.

---

## Gate sequence

```txt
LB-OS-026.5 Phase 1 Certification     ✅
LB-OS-026.6 Executive Experience Cert  ← this document
LB-OS-026.7 Dashboard polish           re-certify
Peer Review Session 4                  resume
```

---

## Relationship to theory (no new ontology)

Executive Experience Certification operationalizes **practitioner discoverability** — Session 4's lens. It does not add cognitive layers (Memory, Belief, Imagination, Restraint). Those remain Phase 2+ under frozen theory.

---

*Executive Experience Certification · LB-OS-026.6*
