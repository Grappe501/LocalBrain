# LB-OS-PROD-001 — Productization & Empty Brain Onboarding

> **Engine:** ENG-INST-001  
> **Depends on:** LB-OS-026.7 (Executive Office) · LB-OS-017 (Provider vault spine)  
> **Blocks:** Memory OS ingestion · Steve/Kelly/Chris personal data  
> **Rule:** Package-first LocalBrain — no person-specific data until empty installable brain ships

---

## Mission

Ship the **sellable product boundary** before any Memory OS ingestion:

```txt
Package-first LocalBrain
  → Onboard keys
  → Create empty brain
  → Then ingest Steve / Kelly / Chris data (post-gate)
```

**Product rule (binding):**

```txt
No Steve-specific information enters the permanent Memory OS until LocalBrain
can be packaged as an empty installable brain.
```

Kelly and Chris each get isolated instances — memory, keys, office, permissions.

---

## Deliverables

| Surface | Route / API | Status |
| ------- | ----------- | ------ |
| Instance Setup Wizard | `/settings/onboarding` · `GET/PUT/POST /api/settings/onboarding/*` | ✅ Shell |
| Provider Vault & Connectors | `/settings/providers` · `GET /api/settings/providers` | ✅ Live |
| Instance Profile & Package | `/settings/instance` · `GET/PUT /api/settings/instance` | ✅ Live |
| Config export (no secrets) | `GET /api/settings/instance/export` | ✅ |
| Config import shell | `POST /api/settings/instance/import` | ✅ |
| Connector readiness | Embedded in providers settings | ✅ |
| Multi-brain sharing | Reserved · LB-OS-027.1 · CAP-FUT-MBS-001 | 🔒 |
| Universal digital ingestion | Reserved · post-Memory OS gate · CAP-FUT-UDI-001 | 🔒 |

---

## Wizard steps

1. **Who is this brain for?** — Steve / Kelly / Chris / Organization / Custom
2. **Provider keys** — link to encrypted vault
3. **Connector readiness** — Connected / Missing / Invalid / Needs test / Reserved
4. **Profile & office** — name, role, mission, office type, departments, privacy tier
5. **Package & finish** — empty brain confirmation · export/import pointers

---

## Provider vault

**Live (LB-OS-017 spine):** OpenAI · Anthropic · Google AI — encrypted AES-256-GCM · test buttons

**Reserved (readiness table only):**

```txt
Google Workspace (Gmail · Calendar · Drive)
Twilio · SendGrid
Census · BLS
ChatGPT export · Local filesystem
Online reputation monitor
```

All future connectors: **ENC → DPEC → connector** — no ingestion in this slice.

---

## Export bundle (v1)

```json
{
  "export_version": 1,
  "profile": { "owner_type", "display_name", "role", ... },
  "departments_enabled": [],
  "provider_flags": [{ "provider_id", "enabled" }],
  "onboarding_completed": true
}
```

Never includes API keys, credential blobs, or personal memory.

---

## Verification

```txt
npm run dev
→ http://localhost:5174/settings/onboarding
→ http://localhost:5174/settings/providers
→ http://localhost:5174/settings/instance
```

```txt
GET /api/settings/instance
GET /api/settings/providers
GET /api/settings/instance/export
```

---

## Post-PROD sequence (unchanged gate)

```txt
026.8 Productization (this slice)
026.9 Provider Vault polish
027.0 Empty Brain Packaging
027.1 Multi-Brain Sharing (reserved)
→ Session 4 / 5 → Convention → Memory OS → Communications
→ CAP-FUT-UDI-001 ingestion (Drive · ChatGPT · email · calendar · filesystem · reputation)
```

---

## Out of scope

- Personal data ingestion
- Multi-brain sync implementation
- Google OAuth / Twilio / SendGrid live connectors
- Hardcoded paths or Steve-specific seeds in permanent storage
