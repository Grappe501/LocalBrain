# LocalBrain Model Router Strategy v1.0

> **Capability-first routing** — supersedes vendor-only routing at LB-OS-078.  
> Architecture: [AI Capability Architecture](./LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md) · Evolution: [AI Evolution Engine](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md)

---

## Purpose

Route work to the **right model on the right provider** — not always the biggest model, not always OpenAI.

---

## Routing Dimensions

```txt
1. Intent class     (from ENG-CM-001 command layer)
2. Job profile      (fast · deep · code · writing · local)
3. Provider health  (up, rate-limited, offline)
4. Cost budget      (ENG-TE-002)
5. Privacy mode     (force local when configured)
6. Outcome history  (ENG-PRV-007 — what worked before)
```

---

## Job Profiles

| Profile | Use when | Typical models (examples — registry-driven) |
|---------|----------|---------------------------------------------|
| **fast** | Summaries, quick Q&A, classification | OpenAI mini · Claude Haiku · local small |
| **deep** | Architecture, strategy, migration plans | OpenAI flagship · Claude Opus · Grok |
| **code** | Burt packets, refactors, audits | Code-tuned cloud · local code model on GPU |
| **writing** | Speeches, blogs, social, narrative | Writing-tuned cloud |
| **local** | Private, offline, high-repeat, budget=0 | Ollama on GPU server |

**Rule:** Profiles are **logical** — actual model IDs live in ENG-PRV-006 capability registry (LB-OS-061).

---

## Decision Flow

```txt
1. ENG-TE-004 pre-flight (Pillar 12)
2. ENG-MR-002 recall — answer without LLM?
3. ENG-CM-001 intent → job profile
4. ENG-PRV-007 outcome bias — same job succeeded with model X?
5. ENG-TE-002 budget — downgrade if over cap
6. ENG-CF-001 privacy_mode — force local?
7. ENG-PRV-001 select (provider, model)
8. ENG-AP-003 queue if provider rate-limited
9. Execute · log · ENG-PRV-007 record outcome
```

---

## Provider Selection Matrix (Initial)

| Profile | Primary (V1) | Fallback 1 | Fallback 2 |
|---------|--------------|------------|------------|
| fast | OpenAI | Claude | local |
| deep | OpenAI | Claude | Grok |
| code | OpenAI | Claude | local GPU |
| writing | OpenAI | Claude | — |
| local | Ollama | — | OpenAI (if allowed) |

Placeholders until adapters live (059–060, 063). Matrix is **config**, not hardcoded.

---

## Relationship to Pillar 11 ENG-AP-005

LB-OS-044 (Pillar 11) introduced intent → model within OpenAI.

Pillar 13 **extends** to intent → profile → **provider** + model:

```txt
ENG-AP-005  →  cloud model tier within one provider (deprecated as sole router)
ENG-PRV-001 →  canonical router (absorbs AP-005 responsibilities)
```

Migration: LB-OS-057 introduces interface · LB-OS-065 unifies selection.

---

## Model Capability Registry (LB-OS-061)

```txt
model_capabilities
- id, provider_id, model_id
- profiles_json: ["fast","code"]
- context_window, supports_tools, supports_vision
- input_cost_per_1k, output_cost_per_1k
- avg_latency_ms, enabled
```

Steve enables/disables models in settings without code changes.

---

## Smart Model Selection (LB-OS-065)

Learns from outcomes:

```txt
task_outcomes
- job_profile, provider_id, model_id
- accepted, burt_ok, validation_ok, steve_revised
- tokens, cost, latency_ms
```

Rolling win-rate per (profile, provider, model) → router weight adjustment.

---

## API

```txt
POST /api/ai/route          — preview route decision (debug)
GET  /api/ai/providers      — health + enabled
GET  /api/ai/models         — capability registry
PUT  /api/ai/routing-policy — profile → preference order
```

---

*Model router strategy v1.0 · Pillar 13 · 2026-06-28*
