# LocalBrain Local Model Fallback Plan v1.0

> **Pillar 13 · Offline / private / GPU path.**  
> Architecture: [Provider-Neutral AI Architecture](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) · GPU: [GPU Server Migration Plan](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md)

---

## Purpose

Run models **locally** via Ollama or LM Studio — especially after GPU server arrives — for:

```txt
Private / sensitive drafts (policy-gated)
Offline or degraded internet
High-repeat tasks (classification, chunk summary, index assist)
Budget preservation (zero API $)
Latency-sensitive small jobs on GPU
```

Extends ENG-AP-009 (deferred in Pillar 11) with concrete adapter design.

---

## Supported Runtimes (Target)

| Runtime | Protocol | Slice |
|---------|----------|-------|
| **Ollama** | HTTP `localhost:11434` | 063 |
| **LM Studio** | OpenAI-compatible local server | post-063 |
| **Future** | vLLM, llama.cpp server | deferred |

[Ollama](https://ollama.com) — Windows, NVIDIA + AMD GPU support.

---

## Local Provider Adapter (LB-OS-063)

```txt
backend/src/providers/localOllamaAdapter.ts
id: local_ollama
```

```txt
chat()           → Ollama /api/chat (stream supported)
listModels()     → Ollama /api/tags
healthCheck()    → GET /api/tags or /api/ps
estimateCost()   → 0 USD (optional electricity note — display only)
```

**Placeholder slice:** adapter interface + health stub + settings UI — full GPU routing in 065.

---

## When to Use Local vs Cloud

| Scenario | Route |
|----------|-------|
| Burt packet for LB-OS-### | cloud code model (quality) — local optional for draft |
| Chunk summarization for index | **local fast** |
| Pre-flight classification | **local fast** |
| Debate prep / claims | cloud (quality + tools) |
| Steve sets `privacy_mode` | **local only** for session |
| API budget exhausted | downgrade to local where profile allows |

ENG-TE-004 + ENG-PRV-001 enforce policy.

---

## Capability Limits (Honest)

Local models in V1 fallback:

```txt
✓ Summarize, classify, short Q&A, draft outlines
✓ Simple code explanation
△ Burt packets — review before use
✗ Tool loops requiring cloud-only features (until local supports tools)
✗ Largest context windows vs cloud flagship
```

UI must show **"Local model — verify output"** badge when `provider_id=local_ollama`.

---

## Model Recommendations (Starting Set)

Registry entries (Steve pulls via Ollama):

```txt
fast profile:    small instruct model (8B class)
code profile:    code-tuned model
writing profile: general instruct (optional — cloud often better)
```

Exact IDs in ENG-PRV-006 — not hardcoded in repo.

---

## Integration

| Engine | Role |
|--------|------|
| ENG-PRV-001 | Routes to local adapter |
| ENG-PRV-006 | Registry marks `provider_id=local_ollama` |
| ENG-TE-001 | Log with `provider_id`, `estimated_cost=0` |
| ENG-PRV-007 | Track local vs cloud acceptance rates |
| ENG-PF-001 | GPU RAM advisory (optional) |

---

## LB-OS-002 Card Copy

```txt
Local model fallback: planned
```

Live from 063: Ollama health dot green/red when `OLLAMA_BASE_URL` configured.

---

## Safety

```txt
Local models run on Steve's hardware — no data leaves machine
Same permission engine — tools still gated
Local does not bypass approval for filesystem writes
Secrets never in local model fine-tuning V1
```

---

*Local model fallback plan v1.0 · Pillar 13 · 2026-06-28*
