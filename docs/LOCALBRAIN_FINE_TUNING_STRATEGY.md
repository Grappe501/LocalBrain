# LocalBrain Fine-Tuning Strategy v1.0

> **Pillar 14 · Levels 2–3.**  
> Lab: [Local Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md) · Data: [Training Data Pipeline](./LOCALBRAIN_TRAINING_DATA_PIPELINE.md)

---

## Strategy

Fine-tune **small open models** on Steve-specific data — not full-weight training.

```txt
Base model (open weights, 7B–13B class on GPU)
+ LoRA / QLoRA adapters (PEFT)
+ Steve-curated dataset from LocalBrain logs
= Specialized model for one job profile
```

[Hugging Face PEFT](https://huggingface.co/docs/peft/en/index): train a small number of extra parameters instead of the entire model — lower compute and storage.

---

## When to Fine-Tune vs API vs Tiny NN

| Approach | Best for |
|----------|----------|
| **Cloud API** | Hard reasoning, architecture, one-off deep work |
| **Local base (no tune)** | Summarize, classify drafts, repeat tasks |
| **LoRA fine-tune** | Steve voice, Burt format, coding tutor tone |
| **Small NN (Level 3)** | Scoring, ranking, binary classifiers, <1M params |

---

## Priority Fine-Tunes (V1 Lab)

### 1. Steve-style writing (LB-OS-073)

```txt
Data: approved writing drafts + voice guides + edited outputs
Base: general instruct 7B–8B
Method: QLoRA
Eval: Steve blind review · claims gate pass rate
Deploy: writing profile in ENG-PRV-006
```

### 2. Coding tutor (OJT-aligned)

```txt
Data: OJT closeouts + challenges + Steve questions/answers
Base: code-instruct model
Method: LoRA
Eval: challenge pass rate · concept retention
Deploy: /learn local assist mode
```

### 3. Burt format assistant (optional fine-tune before scorer NN)

```txt
Data: accepted Burt packets + closeouts
Base: code-instruct
Method: LoRA
Eval: packet validation script pass rate
Note: LB-OS-074 scorer may be separate small classifier
```

---

## Experiment Tracker (LB-OS-070)

```txt
fine_tune_experiments
- id, name, base_model, method (lora|qlora)
- dataset_id, hyperparams_json
- status, metrics_json, artifact_path
- deployed_model_id nullable
- created_at, completed_at
```

**Workflow:**

```txt
Create experiment → run on GPU box (manual or scripted) → log metrics
→ Steve approves deploy → ENG-NN-006 registers with Ollama + ENG-PRV-006
→ ENG-PRV-007 tracks outcome vs base model
```

---

## Hyperparameters (Starting Defaults)

```txt
LoRA rank: 8–16
Learning rate: 1e-4 – 2e-4
Epochs: 1–3 (watch overfit on small data)
Max seq length: 2048–4096 by job
Quantization: 4-bit for QLoRA on consumer GPU
```

Tuned per experiment in tracker — not global constants.

---

## Evaluation Gate (Before Deploy)

```txt
[ ] Holdout set not seen in training
[ ] No secrets in training set (ENG-NN-004)
[ ] Validation loss plateau
[ ] Steve approves sample outputs (minimum 10)
[ ] Router can fall back to cloud if local fails
[ ] Artifact size fits GPU VRAM
```

---

## Cost Discipline

```txt
Fine-tune on GPU server — zero API $ during training
Track GPU hours in neural lab dashboard
Do not fine-tune until N approved examples exist (config per model type)
Prefer scorer/ranker NN when fine-tune is overkill
```

---

## Out of Scope (Level 5)

```txt
Full foundation pretraining
Multi-node distributed training
100B+ parameter models
```

---

*Fine-tuning strategy v1.0 · Pillar 14 · 2026-06-28*
