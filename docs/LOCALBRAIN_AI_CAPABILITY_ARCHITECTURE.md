# LocalBrain AI Capability Architecture v1.0

> **Major architectural shift** — request capabilities, not vendors.  
> Evolution: [AI Evolution Engine](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md) · Router: [Model Router Strategy](./LOCALBRAIN_MODEL_ROUTER_STRATEGY.md) · Providers: [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md)

---

## Thesis

**Wrong (vendor-first):**

```txt
"Call OpenAI" · "Call Claude" · "Call local model"
```

**Right (capability-first):**

```txt
LocalBrain asks: I need Reasoning / Coding / Writing / Embedding / …
Router picks best provider+model for that capability right now.
```

Vendor-neutral for years — models and pricing change; capabilities endure.

---

## Core capabilities

| Capability | ID | Typical jobs |
|------------|-----|--------------|
| **Reasoning** | `reasoning` | Strategy, architecture, migration plans, complex Q&A |
| **Coding** | `coding` | Burt packets, refactors, audits, explain code |
| **Writing** | `writing` | Speeches, blogs, grants, social, narrative |
| **Vision** | `vision` | Image/diagram understanding (future) |
| **Speech** | `speech` | TTS/STT (future) |
| **Embedding** | `embedding` | Vectors, semantic search, recall ranker |
| **Classification** | `classification` | Project type, campaign message, quality score |
| **Translation** | `translation` | Localize content (future) |
| **Planning** | `planning` | Task breakdown, cutover plans, next actions |

Command layer and agents request **`capability` + `quality_tier` + `privacy_mode`** — not `openai-gpt-4`.

---

## Capability → provider map (example)

```txt
Reasoning
├── openai
├── anthropic
├── xai
└── local_gpu

Coding
├── openai
├── anthropic
└── local_gpu

Writing
├── openai
├── anthropic
└── local_gpu (fine-tuned — Track B)

Vision
├── openai
└── local_gpu

Embeddings
├── openai
├── local
└── future provider

Classification
├── local_nn (Track B — ENG-NN-007)
├── openai (small model)
└── local_gpu
```

Stored in **ENG-EV-001 AI Capability Registry** (LB-OS-077) — config, not code.

---

## Request flow

```txt
1. Intent → capability (ENG-CM-001 + ENG-EV-001)
2. ENG-TE-004 pre-flight + ENG-MR-002 recall
3. ENG-EV-004 scorecard: preferred provider for capability (measured, not hard-coded)
4. ENG-EV-002 capability router → provider adapter (ENG-PRV-002..005)
5. ENG-EV-003 self-measurement logs outcome
6. ENG-EV-005 updates preferences over time
```

---

## Performance scorecard (measured preferences)

| Capability | Preferred provider | Why (auto-generated) |
|------------|-------------------|----------------------|
| Code generation | *Configurable* | Highest burt_ok + validation rate |
| Long-form writing | *Configurable* | Best Steve acceptance, lowest rewrite % |
| Quick summaries | *Configurable* | Lowest $ above quality threshold |
| Local/private work | `local_gpu` | Privacy policy |
| Vision | *Configurable* | Best available + cost |
| Embedding | *Configurable* | Latency + recall hit rate |

**Never permanently hard-code one vendor.** Scorecard refreshes from [Self-Measurement Model](./LOCALBRAIN_SELF_MEASUREMENT_MODEL.md).

---

## Registry schema (target)

```txt
ai_capabilities
- id, name, description

capability_providers
- capability_id, provider_id, model_ids_json
- enabled, priority_default, min_quality_tier

capability_preferences  (learned — ENG-EV-005)
- capability_id, provider_id, model_id
- score, sample_count, last_updated
- reason_summary
```

---

## Migration from Pillar 13

| Pillar 13 | Capability architecture |
|-----------|-------------------------|
| ENG-PRV-001 provider router | Becomes **ENG-EV-002** capability router (orchestrates PRV adapters) |
| ENG-AP-005 intent model router | Merged into capability + profile mapping |
| Agent `model` hints | Agent requests `capability` + `quality_tier` |

LB-OS-078 refactors router — adapters unchanged.

---

## API

```txt
POST /api/ai/invoke
  { capability, qualityTier, privacyMode, messages, context }

GET  /api/ai/capabilities
GET  /api/ai/capabilities/:id/providers
GET  /api/ai/scorecard
```

---

## LB-OS-002

No new card — capability scorecard surfaces in **AI Provider** card teaser + Evolution dashboard (082).

---

*AI capability architecture v1.0 · 2026-06-28*
