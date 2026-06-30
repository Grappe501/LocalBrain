# Executive Capability Atlas

> **Auto-generated** — do not edit by hand. Regenerate via `GET /api/integration/atlas` or `npm run atlas:generate`.
> **Engine:** ENG-ATL-001 · **Slice:** LB-OS-026.66 · **Generated:** 2026-06-30T07:00:59.268Z

22 live · 12 planned (infrastructure reserved) · 7 executive intents · 5 workflows

### Connector guardrail (Gmail, Calendar, finance)

```txt
Read first → Recommend second → Draft third → Act only with approval
No automatic sends · No automatic calendar changes · No automatic money movement
```

---

## Intent → Capability map

| Intent | Capabilities |
| ------ | ------------ |
| Organize | Executive Workspace Architecture · Executive Consolidation Briefing · Filesystem Mapping Audit · Knowledge Explorer · Digital Land Survey |
| Decide | Executive Approval · Actions · Executive Consolidation Briefing |
| Learn | Learn — OJT Academy · Executive Program Office |
| Review | Executive Briefing · Executive Program Office · Living Workspace |
| Build | Executive Program Office · Engineering Studio |
| Monitor | System Health · Relationship Network · Engineering Studio · Data Intelligence Studio |
| Plan | Migration Planner · Migration Planning · Migration Proof Engine · Executive Workspace Architecture · Digital Land Survey |

---

## Future / Planned — Infrastructure Reserved

> Not live routes. Reserved for Executive OS expansion (LB-OS-026.66).

## CAP-FUT-GAC-001 — Google Accounts & Calendar Intelligence

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Unify Google identities into governed, read-first knowledge sources. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/google-accounts` |
| **Workflows** | WF-FUT-COM-001 |
| **Slice** | LB-OS-090+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Connect multiple Google accounts for read-first executive intelligence
- **What outcome do I produce?** Unify Google identities into governed, read-first knowledge sources.
- **What do I depend on?** None
- **Who depends on me?** CAP-FUT-GML-001, CAP-FUT-CAL-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Unify Google identities into governed, read-first knowledge sources.
- Enables Gmail / Email Command Center
- Enables Calendar Intelligence

**Entry vectors:**
—

---

## CAP-FUT-GML-001 — Gmail / Email Command Center

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Surface email intelligence without sending on the executive's behalf. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/gmail` |
| **Workflows** | WF-FUT-COM-001 |
| **Slice** | LB-OS-091+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Read-first Gmail monitoring, triage, and draft recommendations
- **What outcome do I produce?** Surface email intelligence without sending on the executive's behalf.
- **What do I depend on?** CAP-FUT-GAC-001
- **Who depends on me?** CAP-FUT-GAC-001, CAP-FUT-KNO-001

### Inputs / Outputs

**Inputs:**

- CAP-FUT-GAC-001 (Google Accounts & Calendar Intelligence)

**Outputs:**

- Surface email intelligence without sending on the executive's behalf.
- Enables Communications Knowledge Sources
- Enables Executive Assistant Briefing Inbox

**Entry vectors:**
—

---

## CAP-FUT-CAL-001 — Calendar Intelligence

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Recommend calendar changes — never apply them automatically. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/calendar` |
| **Workflows** | WF-FUT-COM-001 |
| **Slice** | LB-OS-092+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Read-first calendar analysis and scheduling recommendations
- **What outcome do I produce?** Recommend calendar changes — never apply them automatically.
- **What do I depend on?** CAP-FUT-GAC-001
- **Who depends on me?** CAP-FUT-GAC-001, CAP-FUT-KNO-001

### Inputs / Outputs

**Inputs:**

- CAP-FUT-GAC-001 (Google Accounts & Calendar Intelligence)

**Outputs:**

- Recommend calendar changes — never apply them automatically.
- Enables Communications Knowledge Sources

**Entry vectors:**
—

---

## CAP-FUT-KNO-001 — Communications Knowledge Sources

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | Where is my information? |
| **Outcome** | Feed governed communications evidence into executive briefing. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/communications-knowledge` |
| **Workflows** | WF-FUT-COM-001 |
| **Slice** | LB-OS-093+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Knowledge layer from email and calendar connectors
- **What outcome do I produce?** Feed governed communications evidence into executive briefing.
- **What do I depend on?** CAP-FUT-GML-001, CAP-FUT-CAL-001
- **Who depends on me?** CAP-FUT-GML-001, CAP-FUT-CAL-001, CAP-FUT-INB-001

### Inputs / Outputs

**Inputs:**

- CAP-FUT-GML-001 (Gmail / Email Command Center)
- CAP-FUT-CAL-001 (Calendar Intelligence)

**Outputs:**

- Feed governed communications evidence into executive briefing.
- Enables Executive Assistant Briefing Inbox
- Enables Executive Briefing

**Entry vectors:**
—

---

## CAP-FUT-INB-001 — Executive Assistant Briefing Inbox

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | What should I do today? |
| **Outcome** | Deliver restraint-aware briefing inbox items only when they matter. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/briefing-inbox` |
| **Workflows** | WF-FUT-COM-001 |
| **Slice** | LB-OS-094+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Curated inbox of items deserving executive attention
- **What outcome do I produce?** Deliver restraint-aware briefing inbox items only when they matter.
- **What do I depend on?** CAP-FUT-KNO-001
- **Who depends on me?** CAP-FUT-GML-001, CAP-FUT-KNO-001

### Inputs / Outputs

**Inputs:**

- CAP-FUT-KNO-001 (Communications Knowledge Sources)

**Outputs:**

- Deliver restraint-aware briefing inbox items only when they matter.
- Enables Executive Briefing
- Enables Actions

**Entry vectors:**
—

---

## CAP-FUT-CFO-001 — CFO / Finance Department

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Provide CFO-grade financial intelligence and approval-gated recommendations. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/cfo` |
| **Workflows** | WF-FUT-FIN-001 |
| **Slice** | LB-OS-101+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** CFO intelligence across personal, nonprofit, campaign, and business budgets
- **What outcome do I produce?** Provide CFO-grade financial intelligence and approval-gated recommendations.
- **What do I depend on?** CAP-FUT-FKN-001
- **Who depends on me?** CAP-FUT-FKN-001

### Inputs / Outputs

**Inputs:**

- CAP-FUT-FKN-001 (Finance Knowledge Sources)

**Outputs:**

- Provide CFO-grade financial intelligence and approval-gated recommendations.
- Enables Executive Briefing
- Enables Actions

**Entry vectors:**
—

---

## CAP-FUT-PBN-001 — Personal Finance & Budget

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Make personal financial position legible for executive decisions. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/finance/personal` |
| **Workflows** | WF-FUT-FIN-001 |
| **Slice** | LB-OS-101+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Personal budget intelligence
- **What outcome do I produce?** Make personal financial position legible for executive decisions.
- **What do I depend on?** None
- **Who depends on me?** CAP-FUT-FKN-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Make personal financial position legible for executive decisions.
- Enables Finance Knowledge Sources

**Entry vectors:**
—

---

## CAP-FUT-NPB-001 — Nonprofit Finance & Budget

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Surface nonprofit financial health and constraint-aware recommendations. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/finance/nonprofit` |
| **Workflows** | WF-FUT-FIN-001 |
| **Slice** | LB-OS-101+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Nonprofit budget and grant-aware intelligence
- **What outcome do I produce?** Surface nonprofit financial health and constraint-aware recommendations.
- **What do I depend on?** None
- **Who depends on me?** CAP-FUT-FKN-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Surface nonprofit financial health and constraint-aware recommendations.
- Enables Finance Knowledge Sources

**Entry vectors:**
—

---

## CAP-FUT-CFB-001 — Campaign Finance & Budget

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Make campaign financial position legible for strategic decisions. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/finance/campaign` |
| **Workflows** | WF-FUT-FIN-001 |
| **Slice** | LB-OS-101+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Campaign budget and compliance-aware monitoring
- **What outcome do I produce?** Make campaign financial position legible for strategic decisions.
- **What do I depend on?** None
- **Who depends on me?** CAP-FUT-FKN-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Make campaign financial position legible for strategic decisions.
- Enables Finance Knowledge Sources

**Entry vectors:**
—

---

## CAP-FUT-BBN-001 — Business Budget

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Provide business budget visibility for allocation decisions. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/finance/business` |
| **Workflows** | WF-FUT-FIN-001 |
| **Slice** | LB-OS-101+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Business entity budget intelligence
- **What outcome do I produce?** Provide business budget visibility for allocation decisions.
- **What do I depend on?** None
- **Who depends on me?** CAP-FUT-FKN-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Provide business budget visibility for allocation decisions.
- Enables Finance Knowledge Sources

**Entry vectors:**
—

---

## CAP-FUT-FKN-001 — Finance Knowledge Sources

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Normalize budget signals into governed finance knowledge. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/finance/knowledge` |
| **Workflows** | WF-FUT-FIN-001 |
| **Slice** | LB-OS-101+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Finance knowledge layer feeding CFO intelligence
- **What outcome do I produce?** Normalize budget signals into governed finance knowledge.
- **What do I depend on?** CAP-FUT-PBN-001, CAP-FUT-NPB-001, CAP-FUT-CFB-001, CAP-FUT-BBN-001
- **Who depends on me?** CAP-FUT-CFO-001, CAP-FUT-PBN-001, CAP-FUT-NPB-001, CAP-FUT-CFB-001, CAP-FUT-BBN-001

### Inputs / Outputs

**Inputs:**

- CAP-FUT-PBN-001 (Personal Finance & Budget)
- CAP-FUT-NPB-001 (Nonprofit Finance & Budget)
- CAP-FUT-CFB-001 (Campaign Finance & Budget)
- CAP-FUT-BBN-001 (Business Budget)

**Outputs:**

- Normalize budget signals into governed finance knowledge.
- Enables CFO / Finance Department

**Entry vectors:**
—

---

## CAP-FUT-HHD-001 — Household / Family Operations

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Coordinate household operations into briefing without autonomous action. |
| **State** | planned |
| **Readiness** | 0% (low) |
| **Route** | `/future/household` |
| **Workflows** | WF-FUT-HHD-001 |
| **Slice** | LB-OS-095+ |
| **Atlas status** | Future / Planned · Not Live · Infrastructure Reserved |
| **Governance** | Read-first · approval-gated actions |

### Identity

- **Why do I exist?** Family logistics and household executive coordination
- **What outcome do I produce?** Coordinate household operations into briefing without autonomous action.
- **What do I depend on?** None
- **Who depends on me?** None

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Coordinate household operations into briefing without autonomous action.
- Enables Executive Briefing
- Enables Actions

**Entry vectors:**
—

---


---

## Live capabilities

## CAP-EO-001 — Executive Briefing

| Field | Value |
| ----- | ----- |
| **Intents** | Review |
| **Executive Questions** | What should I do today? |
| **Outcome** | Orient the executive on daily priorities, risks, and highest-leverage next actions. |
| **State** | degraded |
| **Readiness** | 55% (low) |
| **Route** | `/` |
| **Workflows** | — |
| **Slice** | LB-OS-002 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Daily executive orientation and priority surfacing
- **What outcome do I produce?** Orient the executive on daily priorities, risks, and highest-leverage next actions.
- **What do I depend on?** None
- **Who depends on me?** CAP-FUT-KNO-001, CAP-FUT-INB-001, CAP-FUT-CFO-001, CAP-FUT-HHD-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Orient the executive on daily priorities, risks, and highest-leverage next actions.
- Enables Executive Program Office
- Enables Executive Consolidation Briefing

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-EPO-001 — Executive Program Office

| Field | Value |
| ----- | ----- |
| **Intents** | Learn, Review, Build |
| **Executive Questions** | How is the build progressing? |
| **Outcome** | Make build progress, platform readiness, and certification status legible at a glance. |
| **State** | healthy |
| **Readiness** | 92% (high) |
| **Route** | `/program-office` |
| **Workflows** | — |
| **Slice** | LB-OS-012.5 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Build progress, readiness, and platform certification
- **What outcome do I produce?** Make build progress, platform readiness, and certification status legible at a glance.
- **What do I depend on?** None
- **Who depends on me?** CAP-EO-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Make build progress, platform readiness, and certification status legible at a glance.
- Enables Migration Planner

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-WS-001 — Living Workspace

| Field | Value |
| ----- | ----- |
| **Intents** | Review |
| **Executive Questions** | What projects are drifting? |
| **Outcome** | Surface project drift, focus, and momentum for each living workspace. |
| **State** | healthy |
| **Readiness** | 60% (medium) |
| **Route** | `/workspace/localbrain` |
| **Workflows** | — |
| **Slice** | LB-OS-004 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Per-project drift, focus, and workspace momentum
- **What outcome do I produce?** Surface project drift, focus, and momentum for each living workspace.
- **What do I depend on?** None
- **Who depends on me?** None

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Surface project drift, focus, and momentum for each living workspace.
- Enables Engineering Studio

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-KX-001 — Knowledge Explorer

| Field | Value |
| ----- | ----- |
| **Intents** | Organize |
| **Executive Questions** | Where is my information? |
| **Outcome** | Locate information across approved filesystem and workspace roots. |
| **State** | healthy |
| **Readiness** | 85% (high) |
| **Route** | `/explorer` |
| **Workflows** | — |
| **Slice** | LB-OS-005 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Locate information across approved filesystem roots
- **What outcome do I produce?** Locate information across approved filesystem and workspace roots.
- **What do I depend on?** None
- **Who depends on me?** None

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Locate information across approved filesystem and workspace roots.
- Enables Executive Consolidation Briefing

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-ACT-001 — Actions

| Field | Value |
| ----- | ----- |
| **Intents** | Decide |
| **Executive Questions** | What actions need my approval? |
| **Outcome** | Queue approval-gated actions and preserve an auditable execution trail. |
| **State** | healthy |
| **Readiness** | 95% (high) |
| **Route** | `/actions` |
| **Workflows** | — |
| **Slice** | LB-OS-010 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Approval-gated proposed actions and execution log
- **What outcome do I produce?** Queue approval-gated actions and preserve an auditable execution trail.
- **What do I depend on?** None
- **Who depends on me?** CAP-FUT-INB-001, CAP-FUT-CFO-001, CAP-FUT-HHD-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Queue approval-gated actions and preserve an auditable execution trail.

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-SYS-001 — System Health

| Field | Value |
| ----- | ----- |
| **Intents** | Monitor |
| **Executive Questions** | How healthy is my system? |
| **Outcome** | Report machine, storage, and operational health for daily executive decisions. |
| **State** | available |
| **Readiness** | 88% (high) |
| **Route** | `/system` |
| **Workflows** | — |
| **Slice** | LB-OS-011 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** CPU, RAM, disk, and operations health dashboard
- **What outcome do I produce?** Report machine, storage, and operational health for daily executive decisions.
- **What do I depend on?** None
- **Who depends on me?** CAP-EPO-001, CAP-AI-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Report machine, storage, and operational health for daily executive decisions.
- Enables AI Provider Management

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-AI-001 — AI Provider Management

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | How healthy is my system? |
| **Outcome** | Manage AI providers, credentials, routing, and flight-recorder observability. |
| **State** | healthy |
| **Readiness** | 90% (high) |
| **Route** | `/system/providers` |
| **Workflows** | — |
| **Slice** | LB-OS-017 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Provider registry, credentials, routing, and flight recorder
- **What outcome do I produce?** Manage AI providers, credentials, routing, and flight-recorder observability.
- **What do I depend on?** CAP-SYS-001
- **Who depends on me?** CAP-SYS-001, CAP-SET-001

### Inputs / Outputs

**Inputs:**

- CAP-SYS-001 (System Health)

**Outputs:**

- Manage AI providers, credentials, routing, and flight-recorder observability.

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-LRN-001 — Learn — OJT Academy

| Field | Value |
| ----- | ----- |
| **Intents** | Learn |
| **Executive Questions** | — |
| **Outcome** | Deliver on-the-job training tied to real build slices and platform growth. |
| **State** | stub |
| **Readiness** | 10% (low) |
| **Route** | `/learn` |
| **Workflows** | — |
| **Slice** | LB-OS-026 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** On-the-job training tied to real build slices
- **What outcome do I produce?** Deliver on-the-job training tied to real build slices and platform growth.
- **What do I depend on?** None
- **Who depends on me?** None

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Deliver on-the-job training tied to real build slices and platform growth.

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-SET-001 — Settings

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | — |
| **Outcome** | Configure safety policy, permissions, and executive preferences. |
| **State** | degraded |
| **Readiness** | 40% (low) |
| **Route** | `/settings` |
| **Workflows** | — |
| **Slice** | LB-OS-002 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Safety policy, permissions, and preferences
- **What outcome do I produce?** Configure safety policy, permissions, and executive preferences.
- **What do I depend on?** None
- **Who depends on me?** None

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Configure safety policy, permissions, and executive preferences.

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-MIG-001 — Migration Planner

| Field | Value |
| ----- | ----- |
| **Intents** | Plan |
| **Executive Questions** | How should I migrate my world? |
| **Outcome** | Frame the migration strategy, inventory gate, and lifecycle entry point. |
| **State** | healthy |
| **Readiness** | 88% (high) |
| **Route** | `/migration` |
| **Workflows** | WF-MIG-001, WF-MIG-002 |
| **Slice** | LB-OS-018 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Drive doctrine, inventory gate, and migration hub
- **What outcome do I produce?** Frame the migration strategy, inventory gate, and lifecycle entry point.
- **What do I depend on?** CAP-MIG-002
- **Who depends on me?** CAP-EPO-001, CAP-MIG-002, CAP-CNS-001, CAP-EWA-001

### Inputs / Outputs

**Inputs:**

- CAP-MIG-002 (Filesystem Mapping Audit)

**Outputs:**

- Frame the migration strategy, inventory gate, and lifecycle entry point.
- Enables Executive Workspace Architecture

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-MIG-002 — Filesystem Mapping Audit

| Field | Value |
| ----- | ----- |
| **Intents** | Organize |
| **Executive Questions** | What is on my H: drive? |
| **Outcome** | Produce a confident filesystem mapping and inventory of the physical estate. |
| **State** | healthy |
| **Readiness** | 90% (high) |
| **Route** | `/migration/audit` |
| **Workflows** | WF-MIG-002 |
| **Slice** | LB-OS-019 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** H: drive inventory and mapping confidence
- **What outcome do I produce?** Produce a confident filesystem mapping and inventory of the physical estate.
- **What do I depend on?** None
- **Who depends on me?** CAP-MIG-001, CAP-CNS-001, CAP-EWA-001, CAP-DLS-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Produce a confident filesystem mapping and inventory of the physical estate.
- Enables Executive Consolidation Briefing
- Enables Digital Land Survey

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-CNS-001 — Executive Consolidation Briefing

| Field | Value |
| ----- | ----- |
| **Intents** | Organize, Decide |
| **Executive Questions** | What should I consolidate? |
| **Outcome** | Quantify consolidation opportunity with evidence-backed executive intelligence. |
| **State** | healthy |
| **Readiness** | 90% (high) |
| **Route** | `/migration/consolidation` |
| **Workflows** | WF-MIG-002 |
| **Slice** | LB-OS-020 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Consolidation score, evidence stack, and simulation
- **What outcome do I produce?** Quantify consolidation opportunity with evidence-backed executive intelligence.
- **What do I depend on?** CAP-MIG-002
- **Who depends on me?** CAP-EO-001, CAP-KX-001, CAP-MIG-001, CAP-MIG-002, CAP-EWA-001

### Inputs / Outputs

**Inputs:**

- CAP-MIG-002 (Filesystem Mapping Audit)

**Outputs:**

- Quantify consolidation opportunity with evidence-backed executive intelligence.
- Enables Executive Workspace Architecture

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-EWA-001 — Executive Workspace Architecture

| Field | Value |
| ----- | ----- |
| **Intents** | Organize, Plan |
| **Executive Questions** | How should I migrate my world? |
| **Outcome** | Produce a logical workspace architecture and blueprint for the target estate. |
| **State** | healthy |
| **Readiness** | 85% (high) |
| **Route** | `/migration/workspace-architecture` |
| **Workflows** | WF-MIG-001, WF-MIG-002 |
| **Slice** | LB-OS-021 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Workspace DNA, org tree, and architecture blueprints
- **What outcome do I produce?** Produce a logical workspace architecture and blueprint for the target estate.
- **What do I depend on?** CAP-MIG-002, CAP-CNS-001
- **Who depends on me?** CAP-WS-001, CAP-MIG-001, CAP-CNS-001, CAP-DLS-001, CAP-PRF-001

### Inputs / Outputs

**Inputs:**

- CAP-MIG-002 (Filesystem Mapping Audit)
- CAP-CNS-001 (Executive Consolidation Briefing)

**Outputs:**

- Produce a logical workspace architecture and blueprint for the target estate.
- Enables Digital Land Survey

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-DLS-001 — Digital Land Survey

| Field | Value |
| ----- | ----- |
| **Intents** | Organize, Plan |
| **Executive Questions** | What is on my H: drive? |
| **Outcome** | Produce an accurate map of the physical digital estate, boundaries, and orphans. |
| **State** | healthy |
| **Readiness** | 85% (high) |
| **Route** | `/migration/digital-land-survey` |
| **Workflows** | WF-MIG-001 |
| **Slice** | LB-OS-022 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Orphans, boundaries, volume health, migration complexity
- **What outcome do I produce?** Produce an accurate map of the physical digital estate, boundaries, and orphans.
- **What do I depend on?** CAP-EWA-001, CAP-MIG-002
- **Who depends on me?** CAP-MIG-002, CAP-EWA-001, CAP-PRF-001, CAP-PLN-001

### Inputs / Outputs

**Inputs:**

- CAP-EWA-001 (Executive Workspace Architecture)
- CAP-MIG-002 (Filesystem Mapping Audit)

**Outputs:**

- Produce an accurate map of the physical digital estate, boundaries, and orphans.
- Enables Migration Proof Engine

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-PRF-001 — Migration Proof Engine

| Field | Value |
| ----- | ----- |
| **Intents** | Plan |
| **Executive Questions** | How should I migrate my world? |
| **Outcome** | Certify that a proposed migration is safe to plan and execute. |
| **State** | completed |
| **Readiness** | 88% (high) |
| **Route** | `/migration/proof` |
| **Workflows** | WF-MIG-001 |
| **Slice** | LB-OS-023 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Safety certification and proof simulation
- **What outcome do I produce?** Certify that a proposed migration is safe to plan and execute.
- **What do I depend on?** CAP-DLS-001
- **Who depends on me?** CAP-DLS-001, CAP-PLN-001

### Inputs / Outputs

**Inputs:**

- CAP-DLS-001 (Digital Land Survey)

**Outputs:**

- Certify that a proposed migration is safe to plan and execute.
- Enables Migration Planning

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-PLN-001 — Migration Planning

| Field | Value |
| ----- | ----- |
| **Intents** | Plan |
| **Executive Questions** | How should I migrate my world? |
| **Outcome** | Produce an approved migration plan that is safe to execute. |
| **State** | healthy |
| **Readiness** | 90% (high) |
| **Route** | `/migration/planning` |
| **Workflows** | WF-MIG-001 |
| **Slice** | LB-OS-024 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Constraint-aware migration plans from certified proof
- **What outcome do I produce?** Produce an approved migration plan that is safe to execute.
- **What do I depend on?** CAP-PRF-001
- **Who depends on me?** CAP-PRF-001, CAP-APP-001, CAP-CTO-001

### Inputs / Outputs

**Inputs:**

- CAP-PRF-001 (Migration Proof Engine)

**Outputs:**

- Produce an approved migration plan that is safe to execute.
- Enables Executive Approval

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-APP-001 — Executive Approval

| Field | Value |
| ----- | ----- |
| **Intents** | Decide |
| **Executive Questions** | How should I migrate my world? |
| **Outcome** | Obtain executive authorization before cutover execution. |
| **State** | completed |
| **Readiness** | 92% (high) |
| **Route** | `/migration/approval` |
| **Workflows** | WF-MIG-001 |
| **Slice** | LB-OS-025 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Executive sign-off on migration plans
- **What outcome do I produce?** Obtain executive authorization before cutover execution.
- **What do I depend on?** CAP-PLN-001
- **Who depends on me?** CAP-PLN-001, CAP-CTO-001

### Inputs / Outputs

**Inputs:**

- CAP-PLN-001 (Migration Planning)

**Outputs:**

- Obtain executive authorization before cutover execution.
- Enables Migration Cutover

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-CTO-001 — Migration Cutover

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | How should I migrate my world? |
| **Outcome** | Execute and verify an approved migration cutover with rollback guardrails. |
| **State** | completed |
| **Readiness** | 95% (high) |
| **Route** | `/migration/cutover` |
| **Workflows** | WF-MIG-001 |
| **Slice** | LB-OS-026 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Controlled execution and verification of approved cutover
- **What outcome do I produce?** Execute and verify an approved migration cutover with rollback guardrails.
- **What do I depend on?** CAP-APP-001
- **Who depends on me?** CAP-APP-001

### Inputs / Outputs

**Inputs:**

- CAP-APP-001 (Executive Approval)

**Outputs:**

- Execute and verify an approved migration cutover with rollback guardrails.

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-ENG-001 — Engineering Studio

| Field | Value |
| ----- | ----- |
| **Intents** | Build, Monitor |
| **Executive Questions** | How healthy is my engineering work? |
| **Outcome** | Assess engineering workspace health, repo state, and delivery readiness. |
| **State** | available |
| **Readiness** | 75% (medium) |
| **Route** | `/studio/engineering` |
| **Workflows** | — |
| **Slice** | LB-OS-012 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Repo scan, checklist, test inventory, specialist routing
- **What outcome do I produce?** Assess engineering workspace health, repo state, and delivery readiness.
- **What do I depend on?** None
- **Who depends on me?** CAP-WS-001

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Assess engineering workspace health, repo state, and delivery readiness.

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-WRT-001 — Writing Studio

| Field | Value |
| ----- | ----- |
| **Intents** | — |
| **Executive Questions** | What is my writing pipeline? |
| **Outcome** | Make the writing pipeline, sources, and draft path visible. |
| **State** | degraded |
| **Readiness** | 50% (low) |
| **Route** | `/studio/writing` |
| **Workflows** | — |
| **Slice** | LB-OS-013 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Writing pipeline, templates, and draft assembly
- **What outcome do I produce?** Make the writing pipeline, sources, and draft path visible.
- **What do I depend on?** None
- **Who depends on me?** None

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Make the writing pipeline, sources, and draft path visible.

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-DAT-001 — Data Intelligence Studio

| Field | Value |
| ----- | ----- |
| **Intents** | Monitor |
| **Executive Questions** | What data sources am I missing? |
| **Outcome** | Expose data source gaps, catalog coverage, and query readiness. |
| **State** | degraded |
| **Readiness** | 55% (low) |
| **Route** | `/studio/data` |
| **Workflows** | — |
| **Slice** | LB-OS-014 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Source catalog, query plans, and data gaps
- **What outcome do I produce?** Expose data source gaps, catalog coverage, and query readiness.
- **What do I depend on?** None
- **Who depends on me?** None

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Expose data source gaps, catalog coverage, and query readiness.

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---

## CAP-REL-001 — Relationship Network

| Field | Value |
| ----- | ----- |
| **Intents** | Monitor |
| **Executive Questions** | What relationships need attention? |
| **Outcome** | Highlight relationships and engagements that need executive attention. |
| **State** | degraded |
| **Readiness** | 45% (low) |
| **Route** | `/studio/relationships` |
| **Workflows** | — |
| **Slice** | LB-OS-015 |
| **Atlas status** | Live |

### Identity

- **Why do I exist?** Contacts, engagement heuristics, and network intelligence
- **What outcome do I produce?** Highlight relationships and engagements that need executive attention.
- **What do I depend on?** None
- **Who depends on me?** None

### Inputs / Outputs

**Inputs:**

- —

**Outputs:**

- Highlight relationships and engagements that need executive attention.

**Entry vectors:**
dashboard, executive_question, workflow, search, bookmark

---
