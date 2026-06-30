# LB-OS-026.6 — Executive Discoverability & Route Cohesion

> **LOCALBRAIN V1 ROADMAP** · Architecture FROZEN · Implementation mode
>
> ```txt
> □ Executive Office Certification
> □ Session 4
> □ Session 5
> □ Theory Freeze
> □ Convention
> □ Empty Brain Factory
> □ Memory OS
> □ Communications Office
> □ Commercial Beta
>
> Everything else → VERSION2_BACKLOG.md
> ```


> **Depends on:** LB-OS-026.5 · [Platform Audit](../LOCALBRAIN_PLATFORM_AUDIT.md)  
> **Next:** LB-OS-026.7 Executive Dashboard & Daily Briefing  
> **Gate:** [Executive Experience Certification](../LOCALBRAIN_EXECUTIVE_EXPERIENCE_CERTIFICATION.md) must **PASS** before Peer Review Session 4  
> **Rule:** No new architectural concepts · no Phase 2 cognitive code · cohesion only  
> **Canonical metadata:** [ENG-CAP-001 Capability Registry](../LOCALBRAIN_CAPABILITY_REGISTRY.md)

---

## Mission

> **Executive Discoverability & Route Cohesion**

Navigation is one piece of discoverability, but not the whole thing. An executive should not have to remember where features live.

The limiting factor is not the language model — it is the architecture around it. A capability that cannot be found is functionally the same as one that does not exist.

---

## ENG-CAP-001 — Navigation Intelligence Layer

**Do not hardcode navigation relationships.** Build a capability graph; every UI element is a projection.

```txt
Capability → Executive Questions → Routes → Related Capabilities → Workflows → Navigation
```

| Deliverable | Location |
| ----------- | -------- |
| Capability registry | `shared/src/capabilityRegistry.ts` |
| Graph builders + intent routing | `shared/src/navigationIntelligence.ts` |
| Experience audit | `backend/src/integration/executiveExperienceAudit.ts` |
| Workflow nav UI | `frontend/src/components/WorkflowNavigation.tsx` |
| Migration pipeline strip | `frontend/src/components/MigrationPipelineStrip.tsx` |

**APIs:**

```txt
GET /api/integration/capabilities
GET /api/integration/capability-graph
GET /api/integration/intent?q=
GET /api/integration/navigation?route=
GET /api/integration/experience-audit
```

**Intent routing example:**

```txt
"I need to move my ContactList workspace"
  → CAP-PLN-001 Migration Planning
  → /migration/planning
```

---

## Six measurable objectives

### 1. Navigation completeness

```txt
Every live route appears somewhere intentional
No hidden production pages
Every navigation item points to a live destination
```

**Audit targets:**

| Source | Must match |
| ------ | ---------- |
| Live routes (`router.tsx`) | 24+ |
| `SURFACE_REGISTRY` | 100% of production routes |
| `DepartmentNav` / shell | Every live route reachable |
| Broken links | 0 |

**Known gaps (from platform audit):** `/learn`, `/system/providers` not in registry; consolidation not in sidebar.

---

### 2. Workflow cohesion

Every page answers:

```txt
Where did I come from?
Where am I?
What should I do next?
Where can I go back?
```

**Migration lifecycle (binding):**

```txt
Digital Land Survey → Proof → Planning → Approval → Cutover
```

No dead ends. Reverse paths required (see Journey Tests below).

---

### 3. Executive Question routing

Every Executive Question has **exactly one authoritative destination**.

| Question (example) | Authoritative surface |
| ------------------ | --------------------- |
| How healthy is my platform? | Program Office / System Health |
| How organized are my workspaces? | Workspace Architecture |
| Can I safely migrate? | Migration Proof |
| What should I approve? | Executive Approval |

No duplicate answers. Sub-routes may remain `summary_only` until LB-OS-033 deepens EQ split — but each must resolve unambiguously via router.

---

### 4. Capability discoverability

```txt
Every major capability reachable within 2–3 clicks from Executive Briefing
No orphan capabilities
Search registry matches navigation registry
Surface registry matches implementation
```

**Click-depth target:** average ≤ 2.5 from `/` to any live migration stage.

---

### 5. Registry consistency (automated test)

Validate in CI — not manual review:

```txt
SURFACE_REGISTRY
Navigation (DepartmentNav + module manifests)
Sidebar
Dashboard cards (Executive Briefing)
Search index (when present)
Capability Matrix (EQ registry)
Documentation route references
```

All reference the same canonical routes.

**Engine:** `ENG-EEC-001` — Executive Experience Cohesion  
**Test module:** `backend/src/certification/executiveExperienceAudit.ts`

---

### 6. Experience certification (completion artifact)

Produce **Executive Experience Certification** — not merely "navigation complete."

```txt
Executive Experience Certification
Navigation                    PASS
Cross-link Integrity          PASS
Route Registry                PASS
Capability Discovery          PASS
Workflow Continuity           PASS
Dead Ends                     0
Average Click Depth           ≤ 2.5
Certified                     YES
```

Spec: [LOCALBRAIN_EXECUTIVE_EXPERIENCE_CERTIFICATION.md](../LOCALBRAIN_EXECUTIVE_EXPERIENCE_CERTIFICATION.md)

---

## Automated navigation audit report

`runExecutiveExperienceAudit()` generates:

```txt
Live routes              24
Registered               24
Sidebar                  24
Dashboard                24
Search Index             24
Capability Matrix        24
Documentation            24
Broken                   0
```

Exposed via `GET /api/integration/experience-audit` (or extend `/api/integration/audit`).

---

## Engineering tests (binding)

### Executive Journey Test

Start from Dashboard (`/`). User can complete without search:

```txt
Workspace Architecture
  ↓
Digital Land Survey
  ↓
Migration Proof
  ↓
Planning
  ↓
Approval
  ↓
Cutover
```

**File:** `backend/src/certification/executiveJourney.test.ts`

### Reverse Journey Test

Open `Migration Proof`. User can reach in **one click** from in-view links:

```txt
Dashboard (or Executive Briefing)
Workspace Architecture
Digital Land Survey
Planning
```

**File:** `backend/src/certification/reverseJourney.test.ts`

Journey tests validate **link graph** from view source + nav config — not browser E2E in this slice.

---

## User-facing metric (fifth platform headline)

Add **Executive Experience** alongside Stability, Readiness, Maturity, Volatility:

```txt
Executive Experience        96%
  Findability               97%
  Navigation                99%
  Workflow Continuity       95%
  Context Preservation      94%
  Dead Ends                 0
```

Display in Program Office V1 Readiness Dashboard. Engine: `ENG-EEX-001`.

---

## Implementation scope (minimal diff)

```txt
Register /learn and /system/providers in SURFACE_REGISTRY
ENG-CAP-001 capability registry + derived navigation graphs
Intent routing API (Executive Intent → Capability → Route)
Migration pipeline strip + WorkflowNavigation from graph (not hardcoded)
DepartmentNav from getKernelNavItems()
Executive journey + reverse journey tests
Executive experience audit engine + certification report
Program Office Executive Experience card
Wire ExecutiveQuestionShell on /system/providers
```

**Out of scope:** EQ-016–019 split (LB-OS-033) · mock briefing replacement (026.7) · new cognitive features · Executive Imagination / restraint (Phase 2+).

---

## Acceptance criteria

```txt
[ ] All six objectives measurable via automated audit
[ ] Executive Journey Test PASS
[ ] Reverse Journey Test PASS
[ ] Registry consistency test PASS (0 drift)
[ ] Executive Experience Certification PASS
[ ] integration audit targets_met still true
[ ] platform readiness tests still pass
[ ] No new doctrine documents
```

---

## Post-026.6 sequence (binding)

```txt
1. LB-OS-026.6  Executive Discoverability & Route Cohesion
2. LB-OS-026.7  Executive Dashboard & Daily Briefing
3. Executive Experience Certification (artifact from 026.6 — re-run on 026.7)
4. Peer Review Session 4 — Executive Practitioner
5. Peer Review Session 5 — Skeptic
6. Freeze Theory v1.0
7. Executive Epistemology Convention
8. LB-OS-027     Executive Memory Bootstrap
```

---

*Burt packet · LB-OS-026.6*
