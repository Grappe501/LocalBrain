# LB-OS-026.67 — Executive Office Structure (Organization ≠ Intelligence)

> **Depends on:** LB-OS-026.66 (reserved capabilities)  
> **Next:** LB-OS-026.7 Executive Dashboard & Daily Briefing  
> **Rule:** Metadata and doctrine only — no connectors, no agents, no dashboard UI

---

## Mission

Separate **organizational structure** (who is responsible) from **cognitive structure** (what the platform knows) from **execution structure** (what the platform can do). The dashboard projects **Executive Office**, not a feature list.

```txt
Executive
        ↓
Executive Office
        ↓
Departments
        ↓
Intelligence Domains
        ↓
Capabilities
        ↓
Executive Questions
        ↓
Workflows
        ↓
Recommendations
```

---

## Deliverables

| Engine | Deliverable |
| ------ | ----------- |
| ENG-EO-001 | Executive Office container, department registry, intelligence domain registry |
| ENG-EO-001 | Executive Charter + Department Objectives per department |
| ENG-EO-001 | `buildExecutiveOfficeProjection()` + `GET /api/integration/office` |
| ENG-EO-001 | Auto-generated [Office Structure](./LOCALBRAIN_EXECUTIVE_OFFICE_STRUCTURE.md) |

---

## Key separation

| Layer | Examples | What it is |
| ----- | -------- | ---------- |
| **Departments** | Chief of Staff, CFO, CKO, Campaign Director | Organizational roles — become agents later |
| **Intelligence Domains** | Identity, Time, Financial, Knowledge | Cognitive substrates — World Model aspects |
| **Capabilities** | CAP-EO-001, CAP-FUT-GML-001 | Execution — what the platform can do today or reserve |

Each department also carries **Standing Orders** (doctrine), **Escalation Policy** (when to interrupt / notify CoS / monitor / stay silent), and **Operating Personality** (reasoning temperament — not a human personality).

**Rule:** A department **owns** one or more intelligence domains. Multiple departments may share a domain (e.g. CFO + Campaign Director both use Financial Intelligence).

---

## Chief of Staff synthesis

The briefing is not "Morning Briefing" — it is **Chief of Staff Morning Briefing**. Each department contributes; Chief of Staff synthesizes and elevates what deserves attention.

---

## APIs

```txt
GET /api/integration/office
```

```bash
npm run office:generate -w @localbrain/backend
```

---

## Acceptance

```txt
[ ] Executive Office container distinct from departments
[ ] 14 intelligence domains registered (Identity, Time, Financial, …)
[ ] 14 departments with charter + objectives
[ ] Chief Knowledge Officer reserved with knowledge domain
[ ] CFO and Campaign Director share Financial domain
[ ] Future capabilities map to departments AND domains
[ ] Chief of Staff has synthesis_role
[ ] Dashboard gate (026.7) projects office JSON — not capability list alone
[ ] No new doctrine beyond organizational metadata · no Phase 2 cognitive code
```

---

*Burt packet · LB-OS-026.67*
