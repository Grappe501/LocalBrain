# LocalBrain Direct API Performance Engine v1.0

> **Pillar 11:** Direct API Performance Engine.  
> North star: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Queue: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) · OpenAI: [OpenAI Integration Plan](./LOCALBRAIN_OPENAI_INTEGRATION_PLAN.md)

---

## Honest Technical Frame

```txt
LocalBrain still needs internet for OpenAI API calls.
But it can remove ChatGPT/Cursor UI overhead, reduce repeated context transfer,
cache local context, pre-index files, batch work, stream responses, and avoid
re-uploading the same project knowledge over and over.
```

**What changes:** processor, RAM, disk speed, and **OpenAI API tier** become the primary limits — not browser UI friction, ChatGPT message caps, Cursor workflow throttling, or repeated manual context loading.

**What does not change:** LocalBrain is not offline-first for reasoning in V1. Internet is required for OpenAI. API [rate limits](https://developers.openai.com/api/docs/guides/rate-limits) (requests/tokens over time) replace ChatGPT/Cursor product limits — LocalBrain must monitor usage and queue work intelligently.

---

## Mission

```txt
Make processor speed, RAM, disk speed, and OpenAI API tier the primary limits —
not browser UI friction, ChatGPT message caps, Cursor workflow throttling,
or repeated manual context loading.
```

LocalBrain exists partly because Steve should **own the API path** — direct, measurable, optimizable.

---

## Core Capabilities

| Capability | Slice | Notes |
|------------|-------|-------|
| Direct OpenAI API connection | 008 bootstrap · 039 doctrine | Backend-only key; no ChatGPT UI |
| Streaming responses | 008 partial · 043 full | First token fast; studio UX |
| Local context cache | 041 | Stable prefixes + project blobs |
| Prompt-prefix optimization | 041 | [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) — stable system/project first |
| Project context compression | 045 | Summaries over raw dumps |
| Background indexing | 005 · 041 | Pre-index before AI needs files |
| Token budget manager | 040 · 041 | Per-request and per-session caps |
| Request queue | 042 | Heavy tasks batched, not blasted |
| Retry / rate-limit handler | 042 | Respect 429, exponential backoff |
| Model router | 044 | fast / deep / code / writing |
| Local embeddings / vector index | Post-046 | Semantic retrieval without full-file sends |
| Local model fallback | Post-046 | Optional offline advisory (not V1) |

---

## Architecture Principle — Do Not Re-Upload the Project

LocalBrain must **avoid sending full project files to OpenAI repeatedly**.

```txt
Index locally
Summarize locally
Cache stable project context
Send only relevant excerpts
Use tool calls to fetch exact files
Reuse stable prompt prefixes
Stream results back immediately
Log token usage
Queue heavy tasks
```

### Prompt structure (prompt caching)

Per [OpenAI prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching):

```txt
[STABLE — cacheable prefix]
  System doctrine · safety rules · agent prompt
  Project profile · workspace summary · engine registry excerpt
[SEMI-STABLE]
  Recent memory · slice context · MRID subset
[VARIABLE — user turn]
  Current command · selected file excerpts · tool results
```

Stable blocks first → changing user request last → lower latency and input cost on repeated work.

---

## Rate Limits & Queueing

OpenAI API rate limits restrict **requests and tokens per minute** (tier-dependent). LocalBrain behavior:

```txt
ENG-AP-001 monitors usage (tokens in/out, request count, 429 events)
ENG-AP-003 queues non-urgent work when near limit
ENG-AP-003 retries with backoff on rate_limit errors
User sees: queue position, estimated wait, "deferred heavy task" — not silent failure
```

**Not V1:** Auto-tier upgrade; multi-key rotation (policy-defined later).

---

## Engines (Pillar 11)

| Engine | ID | Job |
|--------|-----|-----|
| API usage monitor | ENG-AP-001 | Token log, rate-limit awareness, tier display |
| Context cache | ENG-AP-002 | Prefix cache, project context blobs, invalidation |
| Request queue & retry | ENG-AP-003 | Queue, backoff, priority lanes |
| Streaming engine | ENG-AP-004 | SSE/stream to UI, partial render |
| Model router | ENG-AP-005 | Route by intent: fast / deep / code / writing |
| Context compression | ENG-AP-006 | Local summarize before send |
| Token budget manager | ENG-AP-007 | Session + request budgets |
| Vector index (later) | ENG-AP-008 | Local embeddings retrieval |
| Local model fallback (later) | ENG-AP-009 | Optional non-OpenAI path |

Full registry: [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md)

**Extends:** ENG-AI-001 (orchestration) — not a replacement.

---

## Queue Arc (LB-OS-039–046)

| Slice | Focus |
|-------|-------|
| 039 | Direct API performance doctrine embedded |
| 040 | API usage monitor + rate-limit awareness |
| 041 | Context cache + prompt-prefix strategy |
| 042 | Request queue + retry engine |
| 043 | Streaming response engine (full) |
| 044 | Model router: fast / deep / code / writing |
| 045 | Local context compression engine |
| 046 | API performance dashboard |

**Depends on:** LB-OS-015 minimum; meaningful value after LB-OS-008 (API wired).

**Gate:** **API PERFORMANCE COMMAND** = LB-OS-046

---

## OS Shell Integration (LB-OS-002)

Fifth context card — **one of the main reasons LocalBrain exists:**

```txt
API Performance
  OpenAI key status:        configured / missing
  Request mode:             Direct API
  Streaming:                planned
  Context cache:            planned
  Rate-limit monitor:       planned
```

Stub in 002 · partial from 008 (key status) · live 040–046.

---

## Relationship to Other Pillars

| Pillar | Relationship |
|--------|--------------|
| **1 — AI Command** | Command layer routes through model router |
| **2 — Explorer** | Index feeds compression; tools fetch files on demand |
| **10 — System Optimization** | Machine perf (CPU/RAM/disk) vs API perf (tokens/queue) — complementary |
| **PSP engines** | ENG-AI-001 + ENG-SR-001 + ENG-MM-001 feed context cache |
| **12 — Token Economy** | ENG-TE-004 pre-flight; ENG-TE-001 extends usage log with $ attribution |
| **13 — Provider-neutral** | ENG-PRV-001 router; per-provider cache and queue |

```txt
Pillar 10 = make the machine fast
Pillar 11 = make the API path fast and cheap
Pillar 12 = make spend visible + recall smart + teach at the right pace
Pillar 13 = not locked to OpenAI + GPU-ready + learn best provider per job
```

---

## Self-Build Impact

Burt packet generation benefits immediately from 041+:

```txt
Cache: Safety Model + Engine Registry + Slice Queue as stable prefix
Send: only delta (slice spec, recent closeout) per request
Queue: large audit packets when rate limit headroom low
```

**Self-build v2 gate:** LB-OS-041+ (context cache) on top of LB-OS-011.

---

## Later (Post–046)

```txt
Local embeddings + vector index (ENG-AP-008)
Local model fallback for summarize/index (ENG-AP-009)
Multi-model providers (policy gate)
Cost dashboards · monthly burn projections
Prompt A/B metrics per agent
```

---

## Foundation Rule (Before LB-OS-002)

```txt
This doctrine must exist before LB-OS-002 code.
LB-OS-002 includes API Performance placeholder card (fifth context card).
```

---

## References

- [OpenAI API rate limits](https://developers.openai.com/api/docs/guides/rate-limits)
- [OpenAI prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)
- [OpenAI Integration Plan](./LOCALBRAIN_OPENAI_INTEGRATION_PLAN.md)

---

*Direct API performance engine v1.0 · Pillar 11 · 2026-06-28*
