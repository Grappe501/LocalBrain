# LocalBrain Local Neural Network Lab v1.0

> **Pillar 14 · Main doctrine doc.**  
> North star: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · GPU: [GPU Server Migration Plan](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md) · Providers: [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md)

---

## Mission

LocalBrain becomes Steve's **AI lab** — not just an AI interface.

```txt
Use powerful API models for hard reasoning.
Use local GPU models for private, repeated, lower-cost tasks.
Fine-tune small models on Steve's style and workflows.
Train narrow neural networks that make LocalBrain smarter over time.
```

**Not the goal:** Train a ChatGPT-scale foundation model from scratch (Level 5 — out of scope).

**In range:** Levels 1–4 on a GPU server.

---

## Five Levels (Realistic Target: 1–4)

| Level | What | LocalBrain scope |
|-------|------|------------------|
| **1** | Run local AI models | Ollama / LM Studio · Pillar 13 LB-OS-063 |
| **2** | Fine-tune existing models | LoRA/QLoRA on open weights · LB-OS-070–073 |
| **3** | Train small specialized NNs | Classifiers, rankers, scorers · LB-OS-072–074 |
| **4** | Build custom model pipelines | Data → train → evaluate → deploy to router · LB-OS-066–075 |
| **5** | Train large foundation from scratch | **Deferred** — massive data + many GPUs |

Level 5 requires infrastructure far beyond Steve's GPU server — document as north-star boundary only.

---

## What LocalBrain Could Build

Specialized models that improve **LocalBrain itself**:

```txt
Steve-style writing model          → fine-tune (073)
Burt-script quality scorer         → small NN / classifier (074)
Project classifier                 → classifier (072)
File importance ranker             → ranker (072)
Duplicate/version detector         → complements ENG-ST-001 (072)
Coding tutor model                 → fine-tune + OJT (073)
Memory recall ranker               → ranker (072) · feeds ENG-MR-002
Task-priority recommender          → ranker (072)
Campaign-message classifier        → classifier (072)
Codebase health predictor          → small NN (072)
```

Each model registers in ENG-PRV-006 and routes via ENG-PRV-001 when deployed.

---

## Best Path (Roadmap)

```txt
Run local models (Ollama / LM Studio / local runtime)     ← Pillar 13
↓
Provider router + local GPU adapter                       ← LB-OS-057–063
↓
Collect high-quality LocalBrain training data             ← LB-OS-068
↓
Dataset quality + privacy filter                          ← LB-OS-069
↓
Fine-tune small open models (LoRA/QLoRA)                  ← LB-OS-070–073
↓
Train small neural networks for specific jobs             ← LB-OS-072–074
↓
Deploy to router · track experiments · Neural Lab UI      ← LB-OS-071, 075
```

[PEFT / LoRA](https://huggingface.co/docs/peft/en/index) adapts models by training a small set of extra parameters — feasible on a single GPU. [Ollama on Windows](https://docs.ollama.com/windows) serves models with NVIDIA and AMD GPU support.

---

## Simple Answer

```txt
Yes — LocalBrain can tool neural network work on a GPU server.
No — we do not train "our own ChatGPT."
Yes — we fine-tune, classify, rank, and score to make LocalBrain smarter without overbuilding.
```

---

## Engines

| Engine | ID | Job |
|--------|-----|-----|
| Neural lab orchestrator | ENG-NN-001 | Lab workflows, experiment lifecycle |
| GPU training runtime | ENG-NN-002 | Train env, CUDA/ROCm checks |
| Training data capture | ENG-NN-003 | Log accepted outputs, style pairs |
| Dataset privacy filter | ENG-NN-004 | Strip secrets, PII, quarantine |
| Fine-tune experiment tracker | ENG-NN-005 | LoRA runs, metrics, artifacts |
| Trained model deployer | ENG-NN-006 | Register fine-tuned model → Ollama/router |
| Small classifier trainer | ENG-NN-007 | sklearn/PyTorch tiny models |
| Neural lab metrics | ENG-NN-008 | Dashboard, model cards |

---

## Queue Arc (LB-OS-066–075)

| Slice | Focus |
|-------|-------|
| 066 | Local Neural Network Lab doctrine |
| 067 | GPU runtime environment plan |
| 068 | Training data capture pipeline |
| 069 | Dataset quality / privacy filter |
| 070 | Fine-tuning experiment tracker |
| 071 | Local model adapter (train → serve) |
| 072 | Small classifier training lab |
| 073 | Steve-style writing fine-tune plan |
| 074 | Burt script scoring model |
| 075 | Local Neural Lab dashboard |

**Depends on:** LB-OS-063 minimum (local runtime); full lab after LB-OS-065.

**Track:** B — interfaces + stubs until GPU · [Dual-Track Roadmap](./LOCALBRAIN_DUAL_TRACK_ROADMAP.md)

**Gate:** **NEURAL LAB** = LB-OS-075

---

## LB-OS-002 Placeholder Card

```txt
Neural Lab
  Local training:     planned
  Fine-tune (LoRA):   planned
  Classifiers:        planned
  GPU lab mode:       planned
```

Eighth context card — designs the lab before GPU arrives.

---

## Relationship to Other Pillars

| Pillar | Relationship |
|--------|--------------|
| **13 — Provider-neutral** | Serves trained models; Ollama adapter |
| **12 — Token economy** | Training data from accepted outcomes |
| **12 — Memory** | Recall ranker training data |
| **9 — OJT** | Coding tutor model |
| **10 — Storage** | Duplicate detector ML complement |

```txt
Pillar 13 = run models
Pillar 14 = train and improve models
```

---

## Supporting Docs

| Doc | Role |
|-----|------|
| [Fine-Tuning Strategy](./LOCALBRAIN_FINE_TUNING_STRATEGY.md) | LoRA/QLoRA, models, eval |
| [Training Data Pipeline](./LOCALBRAIN_TRAINING_DATA_PIPELINE.md) | Capture, schema, export |
| [GPU Model Runtime Plan](./LOCALBRAIN_GPU_MODEL_RUNTIME_PLAN.md) | Train + serve on GPU box |

---

*Local neural network lab v1.0 · Pillar 14 · 2026-06-28*
