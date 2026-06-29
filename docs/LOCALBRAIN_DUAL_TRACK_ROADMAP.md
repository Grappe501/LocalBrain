# LocalBrain Dual-Track Development Roadmap v1.0

> **Authoritative execution strategy** — CPU work proceeds now; GPU work stays interface-ready.  
> Queue: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) · Architecture: [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md)

---

## Strategy

```txt
Do NOT postpone LocalBrain until the GPU server arrives.
Do NOT build GPU implementations before hardware.
DO build GPU-ready interfaces now — swap implementation later, no OS redesign.
```

**Target:** Track A delivers **90–95% of LocalBrain functionality** before new hardware. Track B accelerates when the server lands.

---

## Track A — CPU-First (Active Immediately)

Everything that does not require a GPU **continues forward** on current hardware.

### Track A scope

```txt
OS shell · Explorer · Filesystem engine · Project intelligence
Knowledge graph · Memory engine · Search/indexing
Writing Studio · Code Studio · Campaign Studio
Provider/capability router (cloud APIs) · API orchestration
Automation engine (policy-gated) · OJT Academy · Migration tools
System optimization · Token economy · Self-measurement
Chief of Staff · Executive Office · Department chiefs · Executive briefings
Effectiveness metrics (meaningful work index)
```

### Track A slice bands

| Band | Slices | Notes |
|------|--------|-------|
| Bootstrap | 001–015 | V1 ship — CPU only |
| Migration | 016–024 | H: digital life |
| OJT | 025–030 | Teach while building |
| Optimization | 031–038 | Machine health |
| API performance | 039–046 | Cloud API path |
| Token economy | 047–055 | $ · memory · pace |
| Provider/capability | 056–058, 061, 064–065 | Cloud adapters + router — **no GPU train** |
| Evolution | 076–082 | Capability scorecard |
| Chief of Staff | 083–086 | CoS layer |
| Executive Office | 087–096 | AI Executive OS apex |

### Track A rule

```txt
If a slice can run on Steve's current machine with cloud API + SQLite + H: files → Track A.
Ship value every slice. Do not wait for GPU.
```

---

## Track B — GPU Expansion (Interface-Now, Implementation-Later)

GPU features are **not deferred as ideas** — they are **designed and stubbed** so implementation is a swap-in.

### Track B principle

Every GPU-related component ships with:

```txt
Interface          — TypeScript trait / API contract
Configuration      — settings keys, env vars, feature flags
Data structures    — tables, schemas, artifact paths
APIs               — routes return stub or health-only until hardware
Placeholder impl   — returns "not connected" with correct shape
```

When the server arrives: **replace placeholder body** — not redesign shell, router, or studios.

### Track B components

| Component | Interface ID | Slices | Until GPU |
|-----------|--------------|--------|-----------|
| Model runtime | `IModelRuntime` | 063, 067 | Ollama health stub |
| GPU scheduler | `IGpuScheduler` | 067 | Queue stub, no jobs |
| Training queue | `ITrainingQueue` | 070 | Empty queue API |
| Fine-tuning manager | `IFineTuneManager` | 070–071 | Experiment CRUD, no train |
| Embedding service | `IEmbeddingService` | 052, AP-008 | Cloud or stub vectors |
| Vector engine | `IVectorEngine` | 052, 066+ | Schema + stub search |
| Inference engine | `IInferenceEngine` | 063, 071 | Routes to cloud fallback |
| Neural lab | `INeuralLab` | 066–075 | UI + stubs |

**Doc:** [GPU Model Runtime Plan](./LOCALBRAIN_GPU_MODEL_RUNTIME_PLAN.md) · [Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md)

### Track B slice band

```txt
LB-OS-062–063  — migration bundle + Ollama adapter (stub OK)
LB-OS-066–075  — Neural lab arc (interfaces + placeholders until GPU)
```

### Track B activation gate

```txt
[ ] GPU server provisioned
[ ] Ollama + drivers verified (ENG-NN-002 green)
[ ] gpu_lab_mode enabled in ENG-CF-001
[ ] Swap placeholders → implementations per component checklist
[ ] No changes to capability router or shell layout required
```

---

## Combined timeline

```txt
NOW (Track A)     PSP approve → 002 → 015 → 024 → 055 → 065 → 082 → 086
                  Cloud APIs + local CPU + rich memory + Chief of Staff

GPU ARRIVES (B)   Activate 062–063 → 066–075 implementations
                  Fine-tune · classifiers · local inference

ONGOING           Track A never stops — evolution scorecard updates preferences
```

---

## Slice track labels (reference)

| Track | Slices |
|-------|--------|
| **A** | 001–061 (except GPU-heavy bodies), 064–065, 076–086 |
| **B (stub)** | 062–063, 066–075 |
| **A+B** | 061 registry includes local models as disabled until B |

---

## PSP / LB-OS-002 alignment

```txt
LB-OS-002 ships all context card stubs — including Neural Lab (Track B placeholder)
Track A cards wire to cloud partials as slices land (008, 040, 048, 058)
Chief of Staff briefing strip — Track A stub in 002, live 083+
```

---

## Decision log

| Date | Decision |
|------|----------|
| 2026-06-28 | Dual-track replaces "pause everything for GPU" |
| 2026-06-28 | Capability-first routing supersedes vendor-first (Pillar 15) |
| 2026-06-28 | GPU server = accelerator, not prerequisite for intelligence |

---

*Dual-track roadmap v1.0 · 2026-06-28*
