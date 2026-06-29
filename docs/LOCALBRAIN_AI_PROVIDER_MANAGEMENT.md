# LocalBrain AI Provider Management v1.0

> **First-class operating-environment subsystem** — not an `.env` file.  
> **Slice:** LB-OS-017 (accelerates Pillar 13 · consolidates LB-OS-056–065)  
> **Doctrine:** [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) · [Model Router](./LOCALBRAIN_MODEL_ROUTER_STRATEGY.md) · [Capability Architecture](./LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md)

---

## Why this exists

LocalBrain is an **AI Executive Operating System**. AI providers are part of the **operating environment** — the same class of infrastructure as permissions, workspaces, and system health.

```txt
Today (V1):     OPENAI_API_KEY in .env  →  acceptable for dev bootstrap
Target (017+):  AI Provider Manager      →  registry, routing, vault, flight recorder
```

Nothing in LocalBrain should call OpenAI (or any vendor) directly from business logic. Every LLM request flows through one spine.

---

## Binding architecture rule

```txt
Chief of Staff (or department agent)
        ↓
Capability Router          ← "Need: Reasoning" not "Use OpenAI"
        ↓
AI Provider Manager        ← registry, health, credentials, spend caps
        ↓
Provider Adapter           ← transport only (OpenAI · Claude · Gemini · Grok · Ollama · …)
        ↓
Vendor API or local runtime
```

**Departments, studios, command tools, and Burt never import vendor SDKs.** They request a **capability**; the manager returns a normalized response.

Refactor path from V1:

```txt
backend/src/openai/*  →  wrapped by openaiAdapter  →  called only via providers/router.ts
```

---

## UI placement

Primary surface under **System** (ops + infrastructure). Secondary link from **Executive Office** when Steve is configuring strategy.

```txt
System
    System Health          ← existing LB-OS-011
    AI Providers           ← LB-OS-017  (/system/providers)

Executive Office
    …
    AI Providers (link)    ← same route; EPO shows spend attribution by department
```

**System Status Dock** (global, every view):

```txt
CPU 12% · RAM 34% · API 🟢 OpenAI · $1.82 today · 42k tokens
```

Click **API** → AI Providers dashboard (providers, spend, latency, rate limits, models, recent routing decisions).

---

## AI Provider Registry

Each provider is a first-class record — not a single env var.

| Field | Purpose |
|-------|---------|
| `id` | `openai` · `anthropic` · `google` · `xai` · `openrouter` · `ollama` · `local_gpu` |
| `enabled` | Steve toggle |
| `credential_status` | `configured` · `missing` · `invalid` · `expired` |
| `default_models` | Per-capability defaults (see routing) |
| `health` | `healthy` · `degraded` · `rate_limited` · `offline` |
| `latency_p50_ms` | Rolling window |
| `last_success_at` | Last successful request |
| `monthly_spend_usd` | Aggregated from flight recorder |
| `capabilities` | `chat` · `embeddings` · `vision` · `tools` · `streaming` |

### Bootstrap providers (017)

```txt
OpenAI          ← live (wraps existing client)
Anthropic       ← adapter + UI; disabled until key
Google Gemini   ← placeholder
xAI Grok        ← placeholder
OpenRouter      ← optional aggregator
Ollama          ← future local (stub health)
Local GPU       ← future LM Studio / custom endpoint stub
```

---

## Capability routing

Callers declare **need**, not vendor.

```txt
Need: Reasoning     →  Capability Router  →  best (provider, model)
Need: Code          →  e.g. Claude if configured, else OpenAI code model
Need: Fast summary  →  e.g. GPT-4.1-mini class
Need: Local private →  Ollama when privacy_mode or policy forces local
Need: Embeddings    →  local embedding model or cloud embedding adapter
```

Router inputs (from [Model Router Strategy](./LOCALBRAIN_MODEL_ROUTER_STRATEGY.md)):

```txt
capability_class · job_profile · provider_health · cost_budget · privacy_mode · outcome_history
```

The rest of LocalBrain receives a **normalized** `AICompletionResult` — provider-agnostic.

---

## Secure credential storage

| Phase | Storage |
|-------|---------|
| V1 bootstrap | `.env` / `OPENAI_API_KEY` — read at startup |
| LB-OS-017 | Credential vault v1 — encrypted at rest in LocalBrain data dir |
| Later | OS keychain integration · export only via explicit backup |

Vault rules:

```txt
Keys encrypted at rest
Never displayed after entry (mask + "configured" badge only)
"Verify connection" per provider
Replaceable without restart when possible
No keys in logs, flight recorder, or client bundles
```

UI: **AI Credentials** panel per provider — save · verify · revoke.

---

## AI Flight Recorder

Every routed request appends one row (extends `openai_usage_log` → `ai_flight_log`):

```txt
timestamp · request_id
capability · job_profile · routing_reason
provider_id · model_id
prompt_tokens · context_tokens · completion_tokens · estimated_cost_usd
latency_ms · success · error_class
workspace_id · department_id · agent_id
```

Enables questions like:

```txt
"How much did Engineering cost last month?"
"How much did Novel writing consume?"
"Would Claude have been cheaper for this job profile?"
```

EPO and department scoreboards can surface **attributed spend** without parsing vendor dashboards.

---

## LB-OS-017 deliverables

| # | Deliverable |
|---|-------------|
| 1 | `shared` types: `AIProvider`, `AICapability`, `AIProviderHealth`, `AIFlightRecord` |
| 2 | `backend/src/providers/` — `manager.ts`, `router.ts`, `vault.ts`, `flightRecorder.ts` |
| 3 | `openaiAdapter.ts` — wraps `backend/src/openai/*`; sole OpenAI entry |
| 4 | Placeholder adapters: Anthropic, Gemini, Grok, OpenRouter, Ollama |
| 5 | APIs: `GET/PUT /api/providers`, `POST /api/providers/:id/verify`, `GET /api/providers/flight-log` |
| 6 | UI: `/system/providers` — registry, credentials, model catalog, routing preview |
| 7 | System dock: API line (status · today spend · tokens) |
| 8 | Refactor: `commandOrchestrator` → router (no direct `openaiClient` from CoS path) |
| 9 | Per-workspace provider override (optional model / force-local flag) |
| 10 | Docs + EPO slice registration + V1 spine check: `no_direct_vendor_calls` |

**Commit:** `feat: add AI Provider Management foundation`

**Depends on:** LB-OS-016 (V1 ship) · LB-OS-008 (OpenAI command layer to wrap)

**Gate:** No new feature slices that add direct OpenAI imports until 017 router is live.

---

## Relationship to later slices

LB-OS-017 delivers the **foundation**. These deepen without changing the spine:

| Former slice | Absorbed into 017 or follow-on |
|--------------|--------------------------------|
| LB-OS-056 | Doctrine embedded in 017 + this doc |
| LB-OS-057 | Router interface — **017 core** |
| LB-OS-058 | OpenAI adapter — **017 core** |
| LB-OS-059–060 | Claude/Grok placeholders — **017** |
| LB-OS-061 | Model capability registry — **017 catalog** |
| LB-OS-063 | Ollama adapter stub — **017** |
| LB-OS-064 | Cost/performance dashboard — **017 UI** |
| LB-OS-065 | Smart selection + outcome learning — **017.5 or 040+** |

Token economy (047–055) and neural lab (066+) **consume** flight recorder data; they do not bypass the manager.

---

## Exit criteria

```txt
[ ] No business logic imports openai SDK or calls openaiClient directly
[ ] CoS command path uses Capability Router → Provider Manager
[ ] Provider registry visible at /system/providers
[ ] Dock shows API status + today spend when configured
[ ] Flight recorder row per completion
[ ] Verify connection works for OpenAI
[ ] Placeholder providers show disabled + configure prompt
[ ] .env key still works as bootstrap; vault can override
[ ] Per-workspace override stored and honored by router
```

---

## Current code (pre-017)

```txt
backend/src/openai/          ← to become adapter internals only
.env OPENAI_API_KEY          ← bootstrap credential source
usageService / systemHealth  ← openai_configured flag (extends to multi-provider)
```

See [OpenAI Integration](./LOCALBRAIN_OPENAI_INTEGRATION.md) for V1 behavior superseded by this subsystem.
