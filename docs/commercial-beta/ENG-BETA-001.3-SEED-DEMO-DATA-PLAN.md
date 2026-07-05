# ENG-BETA-001.3 — Seed & Demo Data Plan

> **Type:** Release preparation evidence · not implementation · not readiness evaluation  
> **Status:** **DRAFT** — 2026-07-03  
> **Parent:** [ENG-BETA-001 Commercial Beta Preparation](./ENG-BETA-001-COMMERCIAL-BETA-PREPARATION.md)  
> **Prerequisite:** [ENG-BETA-001.1 Workflow Map](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md) · [Connector posture](./ENG-BETA-001.2-CONNECTOR-POSTURE-MATRIX.md)

---

## Purpose

Define what data exists in a beta instance, what beta users may create, and what must **never** enter the institutional store — so [W-001](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md) can run safely with Kelly, Chris, and trusted customers.

---

## Binding rules

| Rule | Rationale |
| ---- | --------- |
| **Beta uses workspace `localbrain`** until multi-workspace UI ships | Contact workbench hardcodes `localbrain` · [workflow map gaps](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md) |
| **No personal Steve data in permanent Memory OS** | [Launch criteria](../LOCALBRAIN_V1_LAUNCH_CRITERIA.md) · factory gate |
| **Synthetic or user-owned contacts only** | Beta users create/import their own people records |
| **No production connector ingestion** | [Connector matrix](./ENG-BETA-001.2-CONNECTOR-POSTURE-MATRIX.md) · reserved connectors stay off |
| **Contacts are workspace-scoped** | Canonical record model · ENG-CONTACT-001.1 |

---

## Seeded infrastructure (read-only for beta users)

| Asset | Source | Content | Beta user action |
| ----- | ------ | ------- | ---------------- |
| **Workspace `localbrain`** | `seedWorkspaces()` · [workspaceRegistry.ts](../../backend/src/workspaces/workspaceRegistry.ts) | Meta workspace · executive context · mission · completed slice history | Read · navigate · do not delete |
| **Stub workspaces** | Same seed | reddirt · countyworkbench · votematch · general (stubs) | Hidden or exploratory only · not W-001 |
| **Workspace events** | `seedLocalbrainEvents()` | Timeline of build milestones | Read-only context |
| **Program Office state** | Live from repo docs + build state engine | Module completion · launch score | Read via `/epo` |
| **Memory OS substrate** | Institutional Cognition Foundation · reference slices | Constitutional memory tests · not personal ingest | No beta user writes to substrate in W-001 |

**Not seeded for beta:** pre-populated real contacts · campaign voter files · Gmail/Calendar data · Steve personal files.

---

## Demo contact strategy

Beta users **create their own** contact records or import via CSV. Optional admin-provided **synthetic CSV template** for first-run:

| Field | Example (synthetic) | Notes |
| ----- | ------------------- | ----- |
| `display_name` | Alex Demo · Jordan Sample | Clearly fictional |
| `email` | alex.demo@example.com | Valid format · duplicate policy applies |
| `phone` | +1-555-0100 | Fictional 555 range |
| `tags` | beta-cohort · demo | Filterable |
| `notes` | Created during Commercial Beta prep | Human-authored |

**Admin may** import 3–5 synthetic rows before handoff so Kelly/Chris see a non-empty list — **must not** use real third-party PII without consent.

---

## CSV import/export discipline

| Action | Policy |
| ------ | ------ |
| Export | User-initiated · workspace-scoped · audit in session log |
| Import preview | Required before commit · errors block unsafe commit |
| Duplicate policy | Default skip/block per ENG-CONTACT-001.3 |
| Round-trip test | Admin runs once before cohort handoff |

Template headers align with [contact CSV contract](../../shared/src/contacts/contactCsv.ts): `display_name` required · structured email/phone fields.

---

## Data handling

| Data class | Storage | Retention | Deletion |
| ---------- | ------- | --------- | -------- |
| Contacts · orgs · draft links · outreach audit | SQLite `contacts` · `contact_draft_links` · `contact_outreach_audit` | Beta instance lifetime | Admin may reset DB for fresh cohort |
| COM draft bodies | COM artifact store + link JSON | Same | Cleared with contact/link purge |
| Provider credentials | Provider vault | Instance-local | Admin rotates via settings |
| Memory OS constitutional records | Separate substrate tables | **Not populated from beta workflows** | N/A for W-001 |

**Beta is not production.** Instance reset is acceptable between cohorts.

---

## Instance reset procedure (admin)

For a clean Kelly/Chris handoff:

```text
1. Stop backend
2. Backup or delete local SQLite DB (if full reset desired)
3. Restart backend — migrations + workspace seed re-run if fresh DB
4. Configure OpenAI at /settings/providers
5. Optionally import synthetic CSV (3–5 rows)
6. Verify W-001 smoke before user handoff
```

Document backup path for Steve · not automated in V1 beta prep.

---

## Verification before readiness evaluation

| Check | Pass criterion |
| ----- | -------------- |
| No real PII in seed scripts | Grep seed · no personal emails/phones |
| W-001 on empty contacts | User can create first contact |
| W-001 on synthetic CSV | Import preview + commit succeeds |
| Export round-trip | Required fields preserved |
| Memory OS | No beta workflow writes personal episodes/facts |

---

## Institutional posture

```text
Data plan:             ENG-BETA-001.3 DRAFT
Next preparation act:  Beta onboarding (ENG-BETA-001.4)
OPS sync:              Deferred until full prep evidence set
```

---

*ENG-BETA-001.3 · Seed & Demo Data Plan · DRAFT · 2026*
