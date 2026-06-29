# LocalBrain GPU Model Runtime Plan v1.0

> **Pillar 14 · GPU train + serve.**  
> Migration: [GPU Server Migration Plan](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md) · Local serve: [Local Model Fallback](./LOCALBRAIN_LOCAL_MODEL_FALLBACK_PLAN.md) · Slice: LB-OS-067

---

## Purpose

One GPU server supports **both**:

```txt
Inference (Level 1)  — Ollama serves models to LocalBrain daily use
Training (Levels 2–4) — LoRA jobs + small NN training when idle
```

---

## Environment Stack (LB-OS-067)

### Base (GPU server)

```txt
Windows 11
NVIDIA CUDA or AMD ROCm drivers
Python 3.11+ (venv for training — isolated from Node backend)
Node.js 20+ (LocalBrain backend)
Ollama (inference serving)
Git
```

### Training toolchain (installed on demand)

```txt
PyTorch (CUDA/ROCm build)
Hugging Face: transformers, datasets, peft, accelerate
Optional: bitsandbytes (QLoRA), scikit-learn (tiny classifiers)
```

**Rule:** Training scripts live in `backend/training/` or `tools/training/` — not in hot API path. Invoked manually or via ENG-NN-001 approved jobs.

---

## Runtime Modes

| Mode | GPU use | LocalBrain behavior |
|------|---------|---------------------|
| `inference_only` | Ollama active | Default daily use |
| `training_scheduled` | Train off-hours | Queue fine-tunes 2–6 AM |
| `lab_active` | Steve running experiment | Show warnings if VRAM contested |
| `hybrid` | Partition VRAM policy | Config: max_train_vram_gb |

ENG-CF-001: `gpu_lab_mode`

---

## Inference Path (Level 1)

```txt
LocalBrain → ENG-PRV-001 → ENG-PRV-005 (Ollama) → GPU
Fine-tuned adapters → imported as custom Ollama model or Modelfile
```

LB-OS-071 deploys artifacts:

```txt
1. Export merged or adapter bundle
2. ollama create steve-writing -f Modelfile
3. Register in ENG-PRV-006 as local model id
```

---

## Training Path (Levels 2–4)

```txt
1. ENG-NN-003 export dataset
2. Steve or automation starts experiment (070)
3. Python train script runs in venv on GPU
4. Metrics logged to SQLite + files in local_data/training/runs/
5. Eval gate → Steve approve
6. ENG-NN-006 deploy to Ollama
7. ENG-PRV-007 compares outcomes vs previous model
```

---

## VRAM Planning (Guidance)

| Task | VRAM (indicative) |
|------|-------------------|
| 7B inference Q4 | ~6–8 GB |
| 7B QLoRA train | ~10–16 GB |
| Small classifier | <2 GB |
| 13B QLoRA | 16–24 GB |

Steve's actual GPU dictates model size — registry marks `max_vram_gb` per model card.

---

## Health Checks

```txt
GET /api/lab/gpu/status
  - gpu_name, vram_total, vram_used
  - ollama_running, training_job_active
  - cuda/rocm available
```

Surfaces on **Neural Lab** dashboard card + System Admin Studio.

---

## Relationship to LB-OS-062

LB-OS-062 migrates **inference** stack. LB-OS-067 adds **training** stack on same box:

```txt
export-gpu-bundle includes:
  local_data/training/
  training venv requirements.txt
  Ollama model list manifest
```

---

## Safety

```txt
Training jobs do not bypass permission engine
Training scripts read only approved dataset exports
No auto-train without Steve enable + threshold met
Kill switch: gpu_lab_mode = off
```

---

*GPU model runtime plan v1.0 · Pillar 14 · 2026-06-28*
