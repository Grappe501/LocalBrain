# LB-OS-017 — AI Provider Management

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


> **Type:** Infrastructure / operating environment (not a department feature slice)  
> **Priority:** Immediately post-V1 — **before** migration, GPU, and multi-provider expansion  
> **Spec:** [AI Provider Management](../LOCALBRAIN_AI_PROVIDER_MANAGEMENT.md)

---

## Goal

Elevate AI providers from a single `.env` key to a **first-class subsystem**: registry, credential vault, capability routing, health, spend, and flight recorder — with a System UI and dock integration.

---

## Binding rule

```txt
Nothing in LocalBrain calls OpenAI (or any vendor) directly.
CoS → Capability Router → AI Provider Manager → Provider Adapter → vendor
```

---

## Build map

### Shared

- `shared/src/aiProviders.ts` — provider, capability, health, flight record types

### Backend

```txt
backend/src/providers/
  manager.ts           — registry CRUD, enable/disable
  router.ts            — capability → (provider, model)
  vault.ts             — encrypted credential storage v1
  flightRecorder.ts    — append + query flight log
  adapters/
    openaiAdapter.ts   — wrap existing openai/*
    anthropicAdapter.ts
    geminiAdapter.ts
    grokAdapter.ts
    openrouterAdapter.ts
    ollamaAdapter.ts   — stub
backend/src/routes/providers.ts
```

### Refactor

- `commandOrchestrator.ts` → `router.complete()` not `openaiClient`
- `usageService` → multi-provider summary for dock

### Frontend

```txt
frontend/src/views/AiProviders.tsx       — /system/providers
frontend/src/components/ProviderCard.tsx
frontend/src/api/providers.ts
SystemStatusDock — API segment (status · spend · tokens)
DepartmentNav / System nav — link to AI Providers
```

### Database

```txt
ai_providers
ai_provider_credentials   — encrypted blob, never returned to client
ai_flight_log             — extends usage attribution
model_catalog             — enabled models + capability tags
workspace_provider_overrides
```

---

## UI surfaces

1. **System → AI Providers** — control center
2. **System dock** — `API 🟢 OpenAI · $X today · N tokens`
3. **Executive Office** — link + EPO spend-by-department (read-only)

---

## V1 credential path

- Bootstrap: read `OPENAI_API_KEY` from env if vault empty
- UI save → vault encrypt → env optional
- Verify connection → minimal models.list or chat ping

---

## Tests

- Router selects OpenAI when only provider configured
- No direct openai import from `cos/` or `command.ts` after refactor
- Flight recorder writes on completion
- Vault round-trip; key never in API response body
- Dock API line when provider healthy

---

## Exit criteria

Same as [AI Provider Management spec](../LOCALBRAIN_AI_PROVIDER_MANAGEMENT.md#exit-criteria).

---

## Commit

```txt
feat: add AI Provider Management foundation
```

---

## Note on slice ID

Steve suggested **LB-OS-026** for this work. **LB-OS-026** is reserved for OJT Build-along teaching mode. **LB-OS-017** is the correct insertion point: immediately after V1 (016), before migration — matching the architectural intent to land the provider spine before H:/ migration and GPU phases.
