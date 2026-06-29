# LocalBrain Engine Registry v1.0

> **Canonical catalog of every LocalBrain engine.**  
> Architecture: [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) · PSP: [Product Strategy Phase](./LOCALBRAIN_PRODUCT_STRATEGY_PHASE.md)

---

## Registry Rules

```txt
Every backend capability belongs to exactly one engine.
Every slice declares which engines it creates or extends.
Every API route maps to an engine ID.
Burt packets must list engines touched.
No studio calls another studio — studios call engines.
```

**ID format:** `ENG-{DOMAIN}-{###}`

**Status:** `PLANNED` | `BOOTSTRAP` | `PARTIAL` | `COMPLETE` | `DEFERRED`

---

## Layer 1 — Core OS Services

### ENG-ID-001 — Identity & User Profile

| Field | Value |
|-------|-------|
| **Responsibility** | Steve's profile, preferences, home studio, teach-toggle, UI density |
| **Depends on** | ENG-CF-001, ENG-LG-001 |
| **Exposes** | `GET/PUT /api/profile` · `user_preferences` table |
| **Consumed by** | All studios, ENG-AI-001 (personalization) |
| **Slices** | 002 stub · 005 settings |
| **Status** | PLANNED |

---

### ENG-AI-001 — AI Orchestration

| Field | Value |
|-------|-------|
| **Responsibility** | Tool loops, streaming UX, conversation state — calls **ENG-PRV-001**, not providers directly |
| **Depends on** | ENG-PRV-001, ENG-AG-001, ENG-TL-001, ENG-PM-001, ENG-LG-001 |
| **Exposes** | `POST /api/chat` · `chatOrchestrator.ts` |
| **Consumed by** | Command layer, all studios |
| **Slices** | 008 · refactor 057–058 |
| **Status** | PLANNED |
| **Docs** | [OpenAI Integration Plan](./LOCALBRAIN_OPENAI_INTEGRATION_PLAN.md) · [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) |

---

### ENG-AG-001 — Agent Registry

| Field | Value |
|-------|-------|
| **Responsibility** | Agent definitions, system prompts, tool allowlists, risk limits |
| **Depends on** | ENG-LG-001 |
| **Exposes** | `GET /api/agents` · `agents` table |
| **Consumed by** | ENG-AI-001, Command layer |
| **Slices** | 014 |
| **Status** | PLANNED |
| **Docs** | [Agent Registry](./LOCALBRAIN_AGENT_REGISTRY.md) |

---

### ENG-TL-001 — Tool Registry & Router

| Field | Value |
|-------|-------|
| **Responsibility** | Tool specs, dispatch, risk tier, agent intersection |
| **Depends on** | ENG-PM-001, ENG-LG-001 |
| **Exposes** | `toolRouter.ts` · internal tool invoke API |
| **Consumed by** | ENG-AI-001 |
| **Slices** | 009, 010 |
| **Status** | PLANNED |
| **Docs** | [Tool Registry](./LOCALBRAIN_TOOL_REGISTRY.md) |

---

### ENG-PM-001 — Permission Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Path validation, allowlist, ignore rules, approval gates, C:/H: rules |
| **Depends on** | ENG-CF-001, ENG-LG-001 |
| **Exposes** | `permissionEngine.ts` · `pathValidator.ts` · `GET /api/permissions` |
| **Consumed by** | **All mutating engines** |
| **Slices** | 003 |
| **Status** | PLANNED |
| **Docs** | [Safety Model](./LOCALBRAIN_SAFETY_MODEL.md) |

---

### ENG-FS-001 — Filesystem Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Read, write draft, move, quarantine, restore — always gated |
| **Depends on** | ENG-PM-001, ENG-BK-001, ENG-LG-001 |
| **Exposes** | `POST /api/files/read` · `write` · `move` · `quarantine` |
| **Consumed by** | ENG-EX-001, ENG-SR-001, studios |
| **Slices** | 003, 009, 010 |
| **Status** | PLANNED |

---

### ENG-SR-001 — Search & Index Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Index approved roots, full-text search, filters, reindex jobs |
| **Depends on** | ENG-PM-001, ENG-FS-001, ENG-LG-001 |
| **Exposes** | `GET /api/search` · `POST /api/index/run` |
| **Consumed by** | Explorer, Command layer, knowledge services |
| **Slices** | 005, 007 |
| **Status** | PLANNED |
| **Docs** | [Search Indexing Plan](./LOCALBRAIN_SEARCH_INDEXING_PLAN.md) |

---

### ENG-KG-001 — Knowledge Graph

| Field | Value |
|-------|-------|
| **Responsibility** | Entities (project, file, req, slice, person), relations, cross-links |
| **Depends on** | ENG-SR-001, ENG-MM-001, ENG-PR-001 |
| **Exposes** | `GET /api/graph/entity/:id` · `GET /api/graph/related` |
| **Consumed by** | Knowledge services, Living Workspaces |
| **Slices** | Post-024 (full) · partial from 021 |
| **Status** | DEFERRED |

---

### ENG-MM-001 — Memory Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Conversations, closeouts, decisions, handoffs, session continuity |
| **Depends on** | ENG-LG-001 |
| **Exposes** | `conversations` · `memory_entries` · `GET /api/memory/project/:id` |
| **Consumed by** | ENG-KP-001, ENG-AI-001, Burt generator |
| **Slices** | 008 partial · 021 full |
| **Status** | PLANNED |

---

### ENG-AU-001 — Automation Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Triggers, schedules, workflow runs — approval-gated |
| **Depends on** | ENG-PM-001, ENG-LG-001, ENG-AI-001 |
| **Exposes** | `POST /api/automation/run` · `automations` table |
| **Consumed by** | Self-build loop (Cursor SDK), recurring index/backup |
| **Slices** | Post-038 |
| **Status** | DEFERRED |

---

### ENG-CF-001 — Settings & Configuration

| Field | Value |
|-------|-------|
| **Responsibility** | Feature flags, allowed roots, drive doctrine, env presence checks |
| **Depends on** | ENG-LG-001 |
| **Exposes** | `GET/PUT /api/settings` |
| **Consumed by** | All engines |
| **Slices** | 002 stub · 005 |
| **Status** | PLANNED |

---

### ENG-LG-001 — Logging & Audit

| Field | Value |
|-------|-------|
| **Responsibility** | Action log, tool log, audit trail, export |
| **Depends on** | — |
| **Exposes** | `GET /api/actions` · `action_log` table |
| **Consumed by** | Everything |
| **Slices** | 003+ |
| **Status** | BOOTSTRAP (health only in 001) |

---

## Layer 2 — System Services

### ENG-DV-001 — Drive Architecture

| Field | Value |
|-------|-------|
| **Responsibility** | C:/H: map, free space, misplacement detection |
| **Depends on** | ENG-PM-001, ENG-LG-001 |
| **Exposes** | `GET /api/system/drives` · `GET /api/system/drives/placement` |
| **Slices** | 016 bootstrap · 032 full |
| **Docs** | [Drive Architecture Plan](./LOCALBRAIN_DRIVE_ARCHITECTURE_PLAN.md) |

---

### ENG-EX-001 — Explorer Service

| Field | Value |
|-------|-------|
| **Responsibility** | Tree, metadata, breadcrumbs, selection — not the React view |
| **Depends on** | ENG-FS-001, ENG-PR-001, ENG-SR-001 |
| **Exposes** | `GET /api/explorer/tree` · `GET /api/explorer/metadata` |
| **Slices** | 005 |
| **Docs** | [Explorer Blueprint](./LOCALBRAIN_EXPLORER_SYSTEM_BLUEPRINT.md) |

---

### ENG-ST-001 — Storage Optimizer

| Field | Value |
|-------|-------|
| **Responsibility** | Large folders, duplicates, stale, bloat, cleanup proposals |
| **Depends on** | ENG-FS-001, ENG-SR-001, ENG-PM-001 |
| **Exposes** | `GET /api/storage/report` · `GET /api/storage/duplicates` |
| **Slices** | 006 · 033–034 · 037 execute |
| **Docs** | [Storage Cleanup Blueprint](./LOCALBRAIN_STORAGE_CLEANUP_BLUEPRINT.md) |

---

### ENG-PF-001 — Performance Monitor

| Field | Value |
|-------|-------|
| **Responsibility** | CPU, RAM, disk, uptime, process advisory |
| **Depends on** | ENG-LG-001 |
| **Exposes** | `GET /api/system/health` · `GET /api/system/processes` |
| **Slices** | 007 · 035–036 |
| **Docs** | [Performance Monitor Blueprint](./LOCALBRAIN_PERFORMANCE_MONITOR_BLUEPRINT.md) |

---

### ENG-BK-001 — Backup Manager

| Field | Value |
|-------|-------|
| **Responsibility** | Pre-write snapshots, restore, backup age |
| **Depends on** | ENG-FS-001, ENG-PM-001, ENG-LG-001 |
| **Exposes** | `POST /api/backups/create` · `GET /api/backups` |
| **Slices** | 010+ |
| **Status** | PLANNED |

---

### ENG-PR-001 — Project Registry

| Field | Value |
|-------|-------|
| **Responsibility** | Registered H: roots, workspace IDs, project types |
| **Depends on** | ENG-PM-001, ENG-CF-001 |
| **Exposes** | `GET/POST /api/projects` · `projects` table |
| **Consumed by** | Living Workspaces, all studios |
| **Slices** | 004 |
| **Status** | PLANNED |

---

### ENG-EN-001 — Environment Manager

| Field | Value |
|-------|-------|
| **Responsibility** | Node version, ports, `.env` present/missing (never values) |
| **Depends on** | ENG-LG-001 |
| **Exposes** | `GET /api/system/environment` |
| **Slices** | 014+ |
| **Status** | DEFERRED |

---

### ENG-VR-001 — Version Manager

| Field | Value |
|-------|-------|
| **Responsibility** | Git status per registered repo |
| **Depends on** | ENG-PR-001, ENG-PM-001 |
| **Exposes** | `GET /api/projects/:id/git` |
| **Slices** | 011 partial |
| **Status** | PLANNED |

---

### ENG-HL-001 — Health Monitor

| Field | Value |
|-------|-------|
| **Responsibility** | Composite app + system health score |
| **Depends on** | ENG-PF-001, ENG-ST-001, ENG-DV-001, ENG-BK-001 |
| **Exposes** | `GET /api/health` (extended) |
| **Slices** | 007 · 038 |
| **Status** | BOOTSTRAP (001 basic health) |

---

## Layer 3 — Knowledge Services

### ENG-KP-001 — Project Intelligence

| Field | Value |
|-------|-------|
| **Responsibility** | Living Workspace aggregate — health, signals, next actions |
| **Depends on** | ENG-PR-001, ENG-MM-001, ENG-VR-001, ENG-KD-001, ENG-KC-001 |
| **Exposes** | `GET /api/workspaces/:id` · `GET /api/workspaces/:id/signals` |
| **Slices** | 004 stub · 024 full |
| **Status** | PLANNED |

---

### ENG-KD-001 — Documentation Intelligence

| Field | Value |
|-------|-------|
| **Responsibility** | Spec freshness, closeout indexing, MRID linkage |
| **Depends on** | ENG-SR-001, ENG-MM-001 |
| **Exposes** | `GET /api/knowledge/docs/:projectId` |
| **Slices** | 011 (Burt context) · 021 |
| **Status** | PLANNED |

---

### ENG-KC-001 — Code Intelligence

| Field | Value |
|-------|-------|
| **Responsibility** | Repo map, slice progress, test status, Burt packet index |
| **Depends on** | ENG-VR-001, ENG-SR-001, ENG-KD-001 |
| **Exposes** | `GET /api/knowledge/code/:projectId` |
| **Slices** | 011 |
| **Status** | PLANNED |

---

### ENG-KW-001 — Writing Intelligence

| Field | Value |
|-------|-------|
| **Responsibility** | Drafts, voices, mode state |
| **Depends on** | ENG-SR-001, ENG-MM-001 |
| **Exposes** | `GET /api/knowledge/writing/:projectId` |
| **Slices** | 012 |
| **Docs** | [Writing Dashboard](./LOCALBRAIN_WRITING_DASHBOARD_BLUEPRINT.md) |

---

### ENG-KM-001 — Campaign Intelligence

| Field | Value |
|-------|-------|
| **Responsibility** | Campaign assets, calendar, claims gates |
| **Depends on** | ENG-KW-001, ENG-SR-001 |
| **Exposes** | `GET /api/knowledge/campaign/:projectId` |
| **Slices** | 013+ |
| **Status** | PLANNED |

---

### ENG-KR-001 — Research Intelligence

| Field | Value |
|-------|-------|
| **Responsibility** | Sources, claims, debate prep materials |
| **Depends on** | ENG-SR-001, ENG-MM-001 |
| **Exposes** | `GET /api/knowledge/research/:projectId` |
| **Slices** | Post-015 |
| **Status** | DEFERRED |

---

### ENG-KL-001 — Learning Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Skill map, challenge state, progress |
| **Depends on** | ENG-MM-001, ENG-KC-001 |
| **Exposes** | `GET /api/learn/progress` |
| **Slices** | 027–029 |
| **Status** | PLANNED |

---

### ENG-OJ-001 — OJT Academy

| Field | Value |
|-------|-------|
| **Responsibility** | Teach toggle, closeout lesson blocks, curriculum |
| **Depends on** | ENG-KL-001, ENG-ID-001 |
| **Exposes** | `GET /api/learn/curriculum` |
| **Slices** | 025–030 |
| **Docs** | [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md) |

---

## Pillar 11 — Direct API Performance Engines

> Extends ENG-AI-001 — owns API path efficiency. Doc: [Direct API Performance Engine](./LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md)

### ENG-AP-001 — API Usage Monitor & Rate Limit Handler

| Field | Value |
|-------|-------|
| **Responsibility** | Token/request log, 429 tracking, tier headroom, burn rate |
| **Depends on** | ENG-AI-001, ENG-LG-001 |
| **Exposes** | `GET /api/openai/usage` · `api_usage_log` table |
| **Slices** | 040 |
| **Status** | PLANNED |

---

### ENG-AP-002 — Context Cache & Prompt Prefix Optimizer

| Field | Value |
|-------|-------|
| **Responsibility** | Stable prefix cache, project context blobs, invalidation, OpenAI prompt-cache ordering |
| **Depends on** | ENG-AP-001, ENG-SR-001, ENG-MM-001, ENG-KP-001 |
| **Exposes** | `contextCache.ts` · cache hit/miss metrics |
| **Slices** | 041 |
| **Status** | PLANNED |

---

### ENG-AP-003 — Request Queue & Retry Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Priority queue, backoff on rate limits, defer heavy tasks |
| **Depends on** | ENG-AP-001, ENG-LG-001 |
| **Exposes** | `requestQueue.ts` · `GET /api/openai/queue` |
| **Slices** | 042 |
| **Status** | PLANNED |

---

### ENG-AP-004 — Streaming Response Engine

| Field | Value |
|-------|-------|
| **Responsibility** | SSE/stream to UI, partial render, cancel in flight |
| **Depends on** | ENG-AI-001, ENG-AP-001 |
| **Exposes** | Stream on `POST /api/chat` · command stream |
| **Slices** | 008 partial · 043 full |
| **Status** | PLANNED |

---

### ENG-AP-005 — Model Router (Intent Tier)

| Field | Value |
|-------|-------|
| **Responsibility** | Intent → model tier within single provider — **superseded by ENG-PRV-001/007** at LB-OS-065 |
| **Depends on** | ENG-CM-001, ENG-CF-001 |
| **Exposes** | `modelRouter.ts` · settings override |
| **Slices** | 044 · merge into 065 |
| **Status** | PLANNED |
| **Note** | Pillar 13 extends to multi-provider selection |

---

### ENG-AP-006 — Context Compression Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Local summarize before API send; excerpts only |
| **Depends on** | ENG-AP-002, ENG-SR-001, ENG-AP-007 |
| **Exposes** | `contextCompressor.ts` |
| **Slices** | 045 |
| **Status** | PLANNED |

---

### ENG-AP-007 — Token Budget Manager

| Field | Value |
|-------|-------|
| **Responsibility** | Per-request and per-session token caps; pre-flight reject |
| **Depends on** | ENG-AP-001 |
| **Exposes** | Budget checks inside orchestrator |
| **Slices** | 040 · 041 |
| **Status** | PLANNED |

---

### ENG-AP-008 — Local Embeddings / Vector Index

| Field | Value |
|-------|-------|
| **Responsibility** | Semantic retrieval without full-file API sends |
| **Depends on** | ENG-SR-001, ENG-PM-001 |
| **Exposes** | `POST /api/search/semantic` |
| **Slices** | Post-046 |
| **Status** | DEFERRED |

---

### ENG-AP-009 — Local Model Fallback

| Field | Value |
|-------|-------|
| **Responsibility** | Optional non-OpenAI path for summarize/index advisory |
| **Depends on** | ENG-CF-001, ENG-PM-001 |
| **Exposes** | TBD |
| **Slices** | Post-046 |
| **Status** | DEFERRED |

---

## Pillar 12 — Token Economy, Memory & Learning Pace Engines

> Doc: [Token Economy Engine](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md) · [Memory Recall](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md) · [Learning Pace](./LOCALBRAIN_LEARNING_PACE_ENGINE.md)

### ENG-TE-001 — Token Usage Logger (Attributed)

| Field | Value |
|-------|-------|
| **Responsibility** | Per-call log with project/client/agent/purpose; extends ENG-AP-001 |
| **Depends on** | ENG-AP-001, ENG-PR-001, ENG-LG-001 |
| **Exposes** | `openai_usage_log` · `GET /api/billing/usage` |
| **Slices** | 048 |
| **Status** | PLANNED |

---

### ENG-TE-002 — Cost Estimator & Budget Monitor

| Field | Value |
|-------|-------|
| **Responsibility** | USD estimates, pricing table, budget warnings |
| **Depends on** | ENG-TE-001 |
| **Exposes** | `costEstimator.ts` · budget alerts |
| **Slices** | 049 |
| **Status** | PLANNED |

---

### ENG-TE-003 — Chargeback Reporter

| Field | Value |
|-------|-------|
| **Responsibility** | Reports by project, client, agent, model, purpose; export |
| **Depends on** | ENG-TE-001, ENG-TE-002 |
| **Exposes** | `GET /api/billing/*` |
| **Slices** | 050 |
| **Status** | PLANNED |

---

### ENG-TE-004 — Pre-Flight Optimizer

| Field | Value |
|-------|-------|
| **Responsibility** | Five-question gate before API send; route to recall/cache/cheap model |
| **Depends on** | ENG-MR-002, ENG-AP-002, ENG-AP-005, ENG-TE-001 |
| **Exposes** | `preFlightOptimizer.ts` |
| **Slices** | 047 · 052 |
| **Status** | PLANNED |

---

### ENG-MR-001 — Memory Compression Pipeline

| Field | Value |
|-------|-------|
| **Responsibility** | Raw → summary → decision → chunk layers |
| **Depends on** | ENG-MM-001, ENG-LG-001 |
| **Exposes** | `memoryCompressor.ts` · `POST /api/memory/compress` |
| **Slices** | 051 |
| **Status** | PLANNED |

---

### ENG-MR-002 — Chunked Recall Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Top-k chunk retrieval before API; tokens-saved metrics |
| **Depends on** | ENG-MR-001, ENG-SR-001, ENG-AP-008 |
| **Exposes** | `GET /api/memory/recall` |
| **Slices** | 052 |
| **Status** | PLANNED |

---

### ENG-MR-003 — Project Memory Graph

| Field | Value |
|-------|-------|
| **Responsibility** | Per-workspace memory graph nodes/edges |
| **Depends on** | ENG-MR-002, ENG-KG-001 |
| **Exposes** | `GET /api/memory/graph/:workspaceId` |
| **Slices** | 052 partial · post-024 full |
| **Status** | PLANNED |

---

### ENG-LP-001 — Style Learning Engine

| Field | Value |
|-------|-------|
| **Responsibility** | User style patterns for prompts and routing |
| **Depends on** | ENG-MM-001, ENG-ID-001 |
| **Exposes** | `user_style_patterns` |
| **Slices** | 053 |
| **Status** | PLANNED |

---

### ENG-LP-002 — Learning Pace & OJT Adaptation

| Field | Value |
|-------|-------|
| **Responsibility** | Teach more/less, confidence, concept introduced/mastered |
| **Depends on** | ENG-OJ-001, ENG-KL-001, ENG-TE-001 |
| **Exposes** | `GET/PUT /api/learn/pace` |
| **Slices** | 054 |
| **Status** | PLANNED |

---

---

## Pillar 13 — Provider-Neutral AI Engines

> Doc: [Provider-Neutral AI Architecture](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md)

### ENG-PRV-001 — AI Provider Router

| Field | Value |
|-------|-------|
| **Responsibility** | Single LLM entry; select provider+model; normalize stream/response |
| **Depends on** | ENG-PRV-006, ENG-PRV-007, ENG-TE-004, ENG-AP-003 |
| **Exposes** | `providers/router.ts` · `POST /api/ai/complete` (internal) |
| **Slices** | 057 |
| **Status** | PLANNED |

---

### ENG-PRV-002 — OpenAI Provider Adapter

| Field | Value |
|-------|-------|
| **Responsibility** | OpenAI API transport; Responses/chat; streaming |
| **Depends on** | ENG-CF-001, ENG-LG-001 |
| **Exposes** | `providers/openaiAdapter.ts` |
| **Slices** | 058 |
| **Status** | PLANNED |

---

### ENG-PRV-003 — Anthropic (Claude) Adapter

| Field | Value |
|-------|-------|
| **Responsibility** | Claude API placeholder → full later |
| **Slices** | 059 |
| **Status** | PLANNED |

---

### ENG-PRV-004 — xAI (Grok) Adapter

| Field | Value |
|-------|-------|
| **Responsibility** | Grok API placeholder → full later |
| **Slices** | 060 |
| **Status** | PLANNED |

---

### ENG-PRV-005 — Local Model Runtime Adapter

| Field | Value |
|-------|-------|
| **Responsibility** | Ollama / LM Studio HTTP; GPU local inference |
| **Depends on** | ENG-CF-001 |
| **Exposes** | `providers/localOllamaAdapter.ts` |
| **Slices** | 063 |
| **Status** | PLANNED |

---

### ENG-PRV-006 — Model Capability Registry

| Field | Value |
|-------|-------|
| **Responsibility** | Models, profiles, costs, enabled flags per provider |
| **Exposes** | `model_capabilities` · `GET /api/ai/models` |
| **Slices** | 061 |
| **Status** | PLANNED |

---

### ENG-PRV-007 — Smart Model Selection & Outcome Learning

| Field | Value |
|-------|-------|
| **Responsibility** | Job profile routing; learn from acceptance/validation/revision |
| **Depends on** | ENG-PRV-001, ENG-PRV-006, ENG-TE-001 |
| **Exposes** | `task_outcomes` · `smartModelSelector.ts` |
| **Slices** | 065 · extends 044 |
| **Status** | PLANNED |

---

### ENG-PRV-008 — Provider Comparison Metrics

| Field | Value |
|-------|-------|
| **Responsibility** | Cost/latency/acceptance dashboards across providers |
| **Depends on** | ENG-TE-001, ENG-PRV-007 |
| **Exposes** | `GET /api/ai/providers/comparison` |
| **Slices** | 064 |
| **Status** | PLANNED |

---

---

## Pillar 14 — Local Neural Network Lab Engines

> Doc: [Local Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md)

### ENG-NN-001 — Neural Lab Orchestrator

| Field | Value |
|-------|-------|
| **Responsibility** | Lab workflow, experiment lifecycle, job approval |
| **Slices** | 066, 075 |
| **Status** | PLANNED |

---

### ENG-NN-002 — GPU Training Runtime Environment

| Field | Value |
|-------|-------|
| **Responsibility** | CUDA/ROCm checks, venv, training toolchain health |
| **Slices** | 067 |
| **Status** | PLANNED |

---

### ENG-NN-003 — Training Data Capture Pipeline

| Field | Value |
|-------|-------|
| **Responsibility** | Capture approved outputs → training_examples |
| **Depends on** | ENG-LG-001, ENG-TE-001 (outcomes) |
| **Slices** | 068 |
| **Status** | PLANNED |

---

### ENG-NN-004 — Dataset Quality & Privacy Filter

| Field | Value |
|-------|-------|
| **Responsibility** | Secret strip, quality tiers, dedupe |
| **Slices** | 069 |
| **Status** | PLANNED |

---

### ENG-NN-005 — Fine-Tuning Experiment Tracker

| Field | Value |
|-------|-------|
| **Responsibility** | LoRA/QLoRA runs, metrics, artifacts |
| **Slices** | 070 |
| **Status** | PLANNED |

---

### ENG-NN-006 — Trained Model Deployer

| Field | Value |
|-------|-------|
| **Responsibility** | Artifact → Ollama → ENG-PRV-006 registry |
| **Depends on** | ENG-PRV-005 |
| **Slices** | 071 |
| **Status** | PLANNED |

---

### ENG-NN-007 — Small Classifier Training Lab

| Field | Value |
|-------|-------|
| **Responsibility** | Train rankers, classifiers, scorers (Level 3) |
| **Slices** | 072, 074 |
| **Status** | PLANNED |

---

### ENG-NN-008 — Neural Lab Dashboard Metrics

| Field | Value |
|-------|-------|
| **Responsibility** | Lab UI data, GPU hours, dataset counts |
| **Slices** | 075 |
| **Status** | PLANNED |

---

---

## Pillar 15 — AI Evolution Engines

> Doc: [AI Evolution Engine](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md) · [Capability Architecture](./LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md)

### ENG-EV-001 — AI Capability Registry

| Field | Value |
|-------|-------|
| **Responsibility** | Capabilities (reasoning, coding, …) + provider map |
| **Slices** | 077 |
| **Status** | PLANNED |

### ENG-EV-002 — Capability Router

| Field | Value |
|-------|-------|
| **Responsibility** | Invoke by capability; delegates to ENG-PRV adapters |
| **Depends on** | ENG-EV-001, ENG-PRV-001, ENG-EV-005 |
| **Slices** | 078 |
| **Status** | PLANNED |

### ENG-EV-003 — Self-Measurement Pipeline

| Field | Value |
|-------|-------|
| **Responsibility** | `ai_interaction_metrics` capture |
| **Slices** | 079 |
| **Status** | PLANNED |

### ENG-EV-004 — Outcome Scorecard

| Field | Value |
|-------|-------|
| **Responsibility** | Per-capability performance aggregates |
| **Slices** | 080, 082 |
| **Status** | PLANNED |

### ENG-EV-005 — Preference Learner

| Field | Value |
|-------|-------|
| **Responsibility** | Update capability_preferences from outcomes |
| **Slices** | 081 |
| **Status** | PLANNED |

### ENG-EV-006 — Evolution Dashboard

| Field | Value |
|-------|-------|
| **Responsibility** | Scorecard UI, overrides, trends |
| **Slices** | 082 |
| **Status** | PLANNED |

---

## Pillar 16 — AI Chief of Staff Engines

> Doc: [AI Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md)

### ENG-CS-001 — Proactive Signal Engine

| Field | Value |
|-------|-------|
| **Responsibility** | Rank and surface signals across engines |
| **Slices** | 084 |
| **Status** | PLANNED |

### ENG-CS-002 — Conflict & Stale Detector

| Field | Value |
|-------|-------|
| **Responsibility** | Doc conflicts, stale projects, version clusters, Burt gaps |
| **Slices** | 085 |
| **Status** | PLANNED |

### ENG-CS-003 — Briefing Composer

| Field | Value |
|-------|-------|
| **Responsibility** | Daily/weekly brief from ranked signals |
| **Slices** | 086 |
| **Status** | PLANNED |

### ENG-CS-004 — Briefing UI Feed

| Field | Value |
|-------|-------|
| **Responsibility** | CommandBar pill + workspace strip |
| **Slices** | 002 stub · 086 |
| **Status** | PLANNED |

---

---

## Pillar 17 — Executive Office Engines

> Doc: [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md)

### ENG-EO-001 — Executive Office Orchestrator

| Field | Value |
|-------|-------|
| **Responsibility** | Apex routing, goals, long-term priorities |
| **Slices** | 087, 096 |
| **Status** | PLANNED |

### ENG-EO-002 — Chief of Staff Lead

| Field | Value |
|-------|-------|
| **Responsibility** | Steve interface, delegation, synthesis — **not assistant** |
| **Depends on** | ENG-EO-003, ENG-CS-001 |
| **Slices** | 088 |
| **Status** | PLANNED |

### ENG-EO-003 — Department Chief Router

| Field | Value |
|-------|-------|
| **Responsibility** | Route to engineering_chief, writing_chief, … |
| **Slices** | 088, 092 |
| **Status** | PLANNED |

### ENG-EO-004 — Executive Briefing Composer

| Field | Value |
|-------|-------|
| **Responsibility** | Morning brief sections — extends ENG-CS-003 |
| **Slices** | 089, 096 |
| **Status** | PLANNED |

### ENG-EO-005 — Calendar Intelligence

| Field | Value |
|-------|-------|
| **Responsibility** | Time leverage, meeting prep, deep-work blocks |
| **Slices** | 090 |
| **Status** | PLANNED |

### ENG-EO-006 — Email Intelligence

| Field | Value |
|-------|-------|
| **Responsibility** | Classify, summarize, suggest reply — gated send |
| **Slices** | 091 |
| **Status** | PLANNED |

### ENG-EO-007 — Workload Prioritization

| Field | Value |
|-------|-------|
| **Responsibility** | Highest leverage recommendation |
| **Slices** | 088, 089 |
| **Status** | PLANNED |

### ENG-EO-008 — Effectiveness Metrics (MWI)

| Field | Value |
|-------|-------|
| **Responsibility** | Meaningful work index, compounding scorecard |
| **Slices** | 095, 096 |
| **Status** | PLANNED |

---

## Layer 5 — Command (Cross-Cutting)

### ENG-CM-001 — Command Layer Router

| Field | Value |
|-------|-------|
| **Responsibility** | Intent parse, context attach, engine dispatch, result unify |
| **Depends on** | ENG-AI-001, all engines (dispatch targets) |
| **Exposes** | `POST /api/command` · global UI shortcut handler |
| **Slices** | 002 stub · 008 wire · full post-015 |
| **Docs** | [Command Layer](./LOCALBRAIN_COMMAND_LAYER.md) |

---

## Engine Dependency Graph (Simplified)

```txt
ENG-CM-001 (Command)
    → ENG-EO-002 (Chief of Staff) → ENG-EO-003 (Dept Chiefs) → agents
    → ENG-EV-002 (Capability Router) → ENG-PRV-001 → adapters
    → ENG-AP-001..007 (API performance)
    → ENG-TE-004 (pre-flight) → ENG-MR-002 (recall) → ENG-TE-001 (log $)
    → ENG-AG-001 + ENG-TL-001
            → ENG-PM-001 (Permission) → ENG-FS-001 / ENG-SR-001 / ...
                → ENG-LG-001 (Audit)

ENG-KP-001 (Living Workspace)
    → ENG-PR-001 + ENG-MM-001 + ENG-VR-001 + ENG-KD-001 + ENG-KC-001 + ...

ENG-HL-001 (Health)
    → ENG-PF-001 + ENG-ST-001 + ENG-DV-001
```

---

## Slice → Engine Matrix (Bootstrap)

| Slice | Engines created/extended |
|-------|--------------------------|
| 002 | CM stub, ID stub, CF stub, HL stub UI |
| 003 | PM, LG |
| 004 | PR, KP stub |
| 005 | EX, SR, FS read |
| 006 | ST partial |
| 007 | PF, HL |
| 008 | AI, CM wire, MM partial |
| 009 | TL, FS read tools |
| 010 | FS write path, BK, TL approve flow |
| 011 | KC, KD, VR, Burt gen |
| 012 | KW |
| 013 | KM |
| 014 | AG, EN partial |
| 015 | Studio integration gate |
| 016–024 | DV, KG partial, KP full, MM full |
| 025–030 | OJ, KL |
| 031–038 | ST, PF, DV full |
| 039–046 | AP-001..007 |
| 047–055 | TE, MR, LP |
| 056–065 | PRV |
| 066–075 | NN |
| 076–082 | EV-001..006 |
| 083–086 | CS |
| 087–096 | EO-001..008 |

---

## Self-Build: Engines Burt Must Read

```txt
ENG-KD-001  — queue, specs, closeouts
ENG-KC-001  — repo state, slice progress
ENG-KP-001  — LocalBrain workspace signals
ENG-PM-001  — safety boundaries in every packet
ENG-AG-001  — burt_script_writer config
This registry — engines that exist vs PLANNED
```

---

## Backend Module Layout (Target)

```txt
backend/src/engines/
  identity/
  orchestration/
  agents/
  tools/
  permissions/
  filesystem/
  search/
  knowledge-graph/
  memory/
  automation/
  settings/
  logging/
  drive/
  explorer/
  storage/
  performance/
  backup/
  projects/
  environment/
  version/
  health/
  knowledge/
    project/
    documentation/
    code/
    writing/
    campaign/
    research/
    learning/
    ojt/
  command/
```

Slices create folders incrementally — do not scaffold all at LB-OS-002.

---

*Engine registry v1.0 · 2026-06-28 · 80 engines*
