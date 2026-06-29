# LocalBrain Provider-Neutral AI Architecture v1.0

> **Pillar 13 · Main doctrine doc.**  
> North star: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Queue: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md)

---

## Mission

LocalBrain starts with **OpenAI** (Steve's first API key) but must **never** be locked to one vendor.

```txt
OpenAI              ← bootstrap provider (LB-OS-058)
Anthropic / Claude  ← adapter placeholder (LB-OS-059)
xAI / Grok          ← adapter placeholder (LB-OS-060)
Google Gemini       ← future adapter
local GPU models    ← Ollama / LM Studio (LB-OS-063)
future providers    ← plugin interface
```

OpenAI, Anthropic, and xAI expose developer APIs. [Ollama](https://ollama.com) supports local models with GPU on Windows (NVIDIA and AMD Radeon).

---

## Core Rule

```txt
LocalBrain does not call "OpenAI" directly from business logic.
LocalBrain requests a CAPABILITY (Reasoning, Coding, Writing, …).
ENG-EV-002 Capability Router picks provider+model via ENG-PRV adapters.
```

**Capability-first (Pillar 15):** [AI Capability Architecture](./LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md) — supersedes vendor-first mental model.

**Legacy provider adapters (Pillar 13):** still required behind capabilities.

```txt
Studio / Command / Agent
        ↓
ENG-AI-001 Orchestration (tool loops, streaming UX)
        ↓
ENG-PRV-001 AI Provider Router  ← single entry for all LLM calls
        ↓
Provider adapter (OpenAI · Claude · Grok · Local · …)
        ↓
ENG-TE-001 usage log · ENG-TE-004 pre-flight · ENG-PRV-007 outcome learning
```

**Refactor path:** LB-OS-008 direct OpenAI → LB-OS-057 router interface → LB-OS-058 OpenAI adapter behind router.

---

## Provider Adapter Interface

Every provider implements:

```txt
interface AIProviderAdapter {
  id: string                    // openai | anthropic | xai | local_ollama | ...
  chat(params): Stream | Response
  embeddings?(params): Vector[]  // optional
  listModels(): ModelInfo[]
  healthCheck(): ProviderHealth
  estimateCost(usage): number  // ENG-TE-002 compatible
}
```

Adapters live in `backend/src/providers/`. **No business logic** in adapters — transport + auth + response normalization only.

---

## Smart Routing (Summary)

| Job class | Typical route | Doc |
|-----------|---------------|-----|
| Fast summary | Small/fast cloud model | [Model Router Strategy](./LOCALBRAIN_MODEL_ROUTER_STRATEGY.md) |
| Deep architecture | Deep cloud model | ↑ |
| Code / Burt | Code-optimized model | ↑ |
| Writing / voice | Writing-tuned model | ↑ |
| Private / offline / repeat | Local GPU model | [Local Model Fallback](./LOCALBRAIN_LOCAL_MODEL_FALLBACK_PLAN.md) |

**Slice:** LB-OS-065 Smart Model Selection · extends LB-OS-044 (Pillar 11 intent router) with **provider** dimension.

---

## Memory Graph (Intelligence Layer)

System gets smarter by remembering **structure**, not just text:

```txt
Projects · Files · Decisions · Requirements · Burt reports
Code changes · Writing voices · People · Campaign plans · Lessons learned
```

**Engines:** ENG-KG-001 (global) · ENG-MR-003 (per workspace) · fed by Pillar 12 compression pipeline.

Provider-neutral: graph retrieval happens **before** router call (local) — any provider receives smaller, structured context.

---

## Compress Before Ask (Cross-Pillar)

```txt
Raw file → chunk → summary → decision record → project context card → send only what matters
```

Pillar 12 owns pipeline · Pillar 13 ensures **any** provider benefits.

---

## Outcome Learning

Every task logs:

```txt
provider_id · model_id
input/output/cached tokens · estimated_cost
purpose · agent_id · project_id
result_accepted · burt_succeeded · validation_passed · steve_revised
```

**Engine:** ENG-PRV-007 · **Slice:** LB-OS-065

LocalBrain learns which provider/model wins per job class over time.

---

## GPU-Ready

When GPU server arrives → [GPU Server Migration Plan](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md)

Portable bundle:

```txt
AI runtime config · local_data · indexes · vector store
project memory · file maps · usage logs · model cache · backup/quarantine
```

---

## Queue Arc (LB-OS-056–065)

| Slice | Focus |
|-------|-------|
| 056 | Provider-neutral doctrine embedded |
| 057 | AI Provider Router interface |
| 058 | OpenAI provider adapter (refactor) |
| 059 | Claude adapter placeholder |
| 060 | Grok adapter placeholder |
| 061 | Model capability registry |
| 062 | GPU server migration plan (executable) |
| 063 | Local model runtime placeholder (Ollama) |
| 064 | Provider cost/performance comparison dashboard |
| 065 | Smart model selection engine |

**Depends on:** LB-OS-015 minimum; router refactor after LB-OS-057.

**Gate:** **PROVIDER-NEUTRAL AI** = LB-OS-065

---

## LB-OS-002 Placeholder Card

```txt
AI Provider
  Active provider:     OpenAI
  Provider router:     planned
  Claude/Grok adapters: planned
  GPU server mode:     planned
  Local model fallback: planned
```

Seventh context card — designs multi-provider from day one.

---

## Relationship to Other Pillars

| Pillar | Relationship |
|--------|--------------|
| **11 — API Performance** | Queue, cache, stream — per provider |
| **12 — Token Economy** | Cost log includes `provider_id` |
| **13 — Provider-neutral** | Serves trained models from Pillar 14 via ENG-NN-006 |
| **14 — Neural lab** | Trains/fine-tunes → deploys to ENG-PRV-005/006 |

```txt
Pillar 13 = run models
Pillar 14 = train and deploy models (Levels 1–4)
```

---

## Supporting Docs

| Doc | Role |
|-----|------|
| [Model Router Strategy](./LOCALBRAIN_MODEL_ROUTER_STRATEGY.md) | Job → model → provider matrix |
| [GPU Server Migration Plan](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md) | Cutover checklist |
| [Local Model Fallback Plan](./LOCALBRAIN_LOCAL_MODEL_FALLBACK_PLAN.md) | Ollama/LM Studio |

---

*Provider-neutral AI architecture v1.0 · Pillar 13 · 2026-06-28*
