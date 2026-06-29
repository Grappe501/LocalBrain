# LocalBrain GPU Server Migration Plan v1.0

> **Pillar 13 · Hardware cutover.**  
> Architecture: [Provider-Neutral AI Architecture](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) · Slice: LB-OS-062

---

## Purpose

When Steve's **GPU server** arrives, LocalBrain moves without re-architecting — runtime config + portable `local_data` + indexes.

Target: NVIDIA or AMD Radeon GPU on Windows with [Ollama](https://ollama.com) or LM Studio for local inference.

---

## What Moves

```txt
AI runtime config          provider keys, routing policy, model registry
local_data/                entire tree (authoritative local state)
  indexes/                 search + drive snapshots
  vector store/            embeddings (when ENG-AP-008 live)
  project_profiles/        Living Workspace JSON
  backups/                 pre-write snapshots
  quarantine/              soft deletes
  logs/                    audit
SQLite database            agents, memory, usage_log, outcomes
Model cache/               Ollama pulled models (optional re-pull)
H:/ project roots          unchanged — still source of truth for files
```

**Does not move:** `C:/` program installs · node_modules (reinstall) · `.env` (reconfigure securely)

---

## Pre-Migration Checklist (Before GPU Arrives)

```txt
[ ] LB-OS-057 provider router — no direct OpenAI in business logic
[ ] LB-OS-061 model capability registry
[ ] LB-OS-063 local adapter stub tested against Ollama on dev machine
[ ] Export script: local_data + sqlite → portable bundle
[ ] Document H: paths in project registry (no hardcoded machine paths in DB)
[ ] Usage logs + outcome history included in bundle
[ ] Backup full local_data before cutover
```

**Slice LB-OS-062** ships: `scripts/export-gpu-bundle.ts` + runbook doc in repo.

---

## Cutover Procedure

### Phase A — Prepare GPU box

```txt
1. Install Windows + GPU drivers (NVIDIA or AMD)
2. Install Node.js, Git, Ollama (or LM Studio)
3. Clone H:\localAgent (or restore from bundle)
4. npm install
5. Copy local_data + SQLite from bundle
6. Configure .env (OpenAI key + LOCAL_OLLAMA_URL etc.)
7. Pull local models: ollama pull <code-model> <fast-model>
```

### Phase B — Point LocalBrain

```txt
1. ENG-CF-001: ai_runtime_mode = hybrid | local_primary | cloud_primary
2. ENG-PRV-001: enable local provider, set profile fallbacks
3. Verify GET /api/ai/providers — openai + local healthy
4. Run routing policy: code + repeat → local GPU
```

### Phase C — Validate

```txt
[ ] Index run on H: roots completes
[ ] Burt packet generates (cloud or local per policy)
[ ] Recall + compression still work
[ ] Usage log attributes local tokens (zero $ or local tariff)
[ ] GPU utilization visible in Performance Health (advisory)
```

### Phase D — Decommission old machine (optional)

```txt
Archive old local_data backup · update DNS/bookmarks · H: drive may move or stay network-mounted
```

---

## Runtime Modes

| Mode | Behavior |
|------|----------|
| `cloud_primary` | Default today — OpenAI first, local fallback |
| `hybrid` | Route by profile — code/repeat local, deep cloud |
| `local_primary` | GPU handles most; cloud for overflow only |
| `local_only` | No cloud calls — air-gap / privacy |

---

## Network Topology Options

```txt
Option A: GPU server IS the LocalBrain host (H: local or mapped)
Option B: GPU server = inference box; LocalBrain on laptop calls http://gpu:11434
Option C: Both on same machine after desk upgrade
```

ENG-PRV-003 local adapter reads `OLLAMA_BASE_URL` from ENG-CF-001.

---

## Rollback

```txt
1. Set ai_runtime_mode = cloud_primary
2. Disable local provider in registry
3. Restore SQLite + local_data from pre-cutover backup if corrupted
```

---

## Dashboard (LB-OS-064 / AI Provider card)

```txt
GPU server mode:     not connected | connected | local_primary
Local models loaded: 2/5
Last inference:      local · 1.2s · llama3.1:8b
```

---

*GPU server migration plan v1.0 · Pillar 13 · 2026-06-28*
