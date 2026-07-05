# ENG-BETA-001.2 — Connector Posture Matrix

> **Type:** Release preparation evidence · not implementation · not readiness evaluation  
> **Status:** **DRAFT** — 2026-07-03  
> **Parent:** [ENG-BETA-001 Commercial Beta Preparation](./ENG-BETA-001-COMMERCIAL-BETA-PREPARATION.md)  
> **Prerequisite:** [ENG-BETA-001.1 Beta Workflow Map](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md)  
> **Source of truth (runtime):** `GET /api/settings/providers` · [connectorReadinessService.ts](../../backend/src/settings/connectorReadinessService.ts)

---

## Purpose

Declare which integrations are **enabled**, **disabled**, or **deferred** for Commercial Beta — aligned to [W-001](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md) (contact → draft → outreach).

**Binding rule:** No connector may be silently activated. Posture here overrides informal expectation.

---

## AI providers (probabilistic generation)

| Connector | Beta state | Reason | W-001 dependency |
| --------- | ---------- | ------ | ---------------- |
| **OpenAI** | **Enabled** (credential required) | Core COM draft generation · primary provider | **Required** — step 5 |
| Anthropic | Disabled (default) | Optional alternate · not beta-critical | None |
| Google (AI) | Disabled (default) | Optional alternate | None |
| xAI | Disabled (default) | Optional alternate | None |
| OpenRouter | Disabled (default) | Optional routing · not beta script | None |
| Ollama | Enabled (local only) | Private/local inference when configured | Optional offline path |
| Local GPU | Disabled (default) | Infrastructure-dependent | None |

**Admin action:** Configure OpenAI at `/settings/providers` before Kelly/Chris run W-001.

---

## Communications connectors (outbound)

| Connector | Beta state | Reason | W-001 dependency |
| --------- | ---------- | ------ | ---------------- |
| **Email sending (SendGrid)** | **Disabled** | Prevent accidental outbound mail · no approval-gated send path in V1 | **Explicitly excluded** |
| **Twilio (SMS · Voice)** | **Disabled** | Outbound communications reserved · CAP-FUT | **Explicitly excluded** |
| **Google Gmail send** | **Disabled** | Part of reserved Google workspace connector | **Explicitly excluded** |

COM drafts are **advisory only** — link layer + preview. Outreach status is **human-recorded** — not sent.

---

## Ingestion · calendar · storage

| Connector | Beta state | Reason | W-001 dependency |
| --------- | ---------- | ------ | ---------------- |
| **Google Workspace (Gmail · Calendar · Drive)** | **Disabled / reserved** | Infrastructure reserved · post-Convention ingestion gate | None for W-001 |
| **Calendar read** | **Disabled** | Safety · no calendar sync in beta script | None |
| ChatGPT export import | **Deferred** | Ingestion not on critical beta path | None |
| Local filesystem (allowed folders) | **Enabled (read)** | Workspace roots · engineering studio | Optional |
| US Census API | **Deferred** | Data intelligence · not contact workflow | None |
| BLS API | **Deferred** | Data intelligence | None |
| Reputation monitor | **Deferred** | Post-V1 ingestion | None |

---

## Contact · data movement (non-connector)

| Capability | Beta state | Reason | W-001 dependency |
| ---------- | ---------- | ------ | ---------------- |
| **CSV import/export** | **Enabled** | ENG-CONTACT-001.3 · tested · human-initiated | Optional step 4b |
| Contact CRUD API | **Enabled** | ENG-CONTACT-001.2 · workbench live | **Required** — step 4 |
| COM draft link API | **Enabled** | ENG-CONTACT-001.4 · no send path | **Required** — step 5 |

These are **subsystem capabilities**, not external connectors — listed because beta users encounter them as “integrations” with their data.

---

## Department · module surfaces

| Surface | Beta state | Reason |
| ------- | ---------- | ------ |
| Contact Management (`/studio/contacts`) | **Enabled** | W-001 primary |
| Executive Office · Program Office | **Enabled** | Orientation W-003 |
| Living Workspace | **Enabled** | Context W-001 step 3 |
| AI Provider Management | **Enabled (admin)** | W-002 |
| Relationship studio | **Read-only / exploratory** | Not wired to canonical contacts · not W-001 |
| Volunteer Management | **Deferred** | ENG-VOL-001 post-beta |
| Knowledge Explorer | **Stub** | Not beta-critical |
| Communications workbench (standalone) | **Deferred** | Draft UX on contact detail for beta |

---

## Posture summary

```text
ENABLED for beta     OpenAI (configured) · Contact CSV · CRUD · COM link · local filesystem read
DISABLED for safety  Email send · SMS · calendar sync · outbound Google
DEFERRED post-beta   Volunteer · ChatGPT import · census/BLS · reputation · standalone COM UI
```

---

## Verification (pre-readiness)

Before OPS preparation sync or ENG-PMO-015:

| Check | Method |
| ----- | ------ |
| OpenAI posture matches matrix | Settings UI + `GET /api/settings/providers` |
| Reserved connectors show `reserved` | Connector readiness report |
| No send path in W-001 | Contact workbench + route audit — no outbound mail routes |
| CSV posture matches matrix | Workbench import/export smoke on localbrain |

---

## Institutional posture

```text
Matrix:                ENG-BETA-001.2 DRAFT · aligned to W-001
Next preparation act:  Beta feedback + triage process · onboarding script
OPS sync:              After feedback process + remaining prep evidence
Readiness gate:        ENG-PMO-015 (not opened)
```

---

*ENG-BETA-001.2 · Connector Posture Matrix · DRAFT · LocalBrain V1 · 2026*
