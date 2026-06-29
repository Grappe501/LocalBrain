# LocalBrain Training Data Pipeline v1.0

> **Pillar 14 · Data for Levels 2–4.**  
> Lab: [Local Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md) · Privacy: LB-OS-069

---

## Principle

LocalBrain already generates **high-quality training signal** — if we capture it deliberately.

```txt
Only train on what Steve accepted, approved, or explicitly marked good.
Never auto-train on raw chat dumps without filter.
```

---

## Capture Sources

| Source | Data type | Slice |
|--------|-----------|-------|
| Accepted chat outputs | instruction / response pairs | 068 |
| Approved file writes | before/after edits | 068 |
| Burt packets + successful closeouts | build scripts | 068 |
| Writing drafts (approved) | voice examples | 068 |
| `task_outcomes` (Pillar 13) | model + accepted + revised | 068 |
| OJT challenges passed | tutor pairs | 068 |
| Memory decisions | structured events | 051+ |
| Steve explicit 👍 / mark-good | gold labels | 068 |

---

## Schema

```txt
training_examples
- id
- dataset_id
- source_type          burt | writing | chat | ojt | classifier_label
- project_id, workspace_id
- input_text
- output_text
- label_json optional    for classifiers
- quality_tier           gold | silver | bronze
- steve_approved         bool
- privacy_cleared        bool  (069)
- created_at
```

```txt
training_datasets
- id, name, purpose, example_count
- export_path
- created_at, frozen_at
```

---

## Pipeline Flow

```txt
1. ENG-NN-003 captures event on approval / outcome success
2. ENG-NN-004 privacy filter:
     - strip .env paths, secrets, API keys
     - block C: system paths
     - quarantine suspicious rows
3. Quality tier assignment (gold = explicit approve)
4. Dataset builder groups by purpose
5. Export JSONL / HuggingFace datasets format
6. Fine-tune or classifier train (070, 072)
```

---

## Dataset Quality Rules (LB-OS-069)

```txt
REJECT if contains:
  API keys, tokens, passwords
  full .env contents
  unrelated personal data
  unapproved AI hallucinations

REQUIRE for gold tier:
  steve_approved = true OR burt_ok + validation_ok

DEDUPE:
  near-duplicate inputs (hash + fuzzy)
```

---

## Privacy

```txt
Training data stays on H: / local_data/training/
Never upload dataset to cloud without explicit Steve action
OpenAI API calls do not use Steve's data for training (API policy) —
  LocalBrain local training is separate and controlled
Export bundles exclude raw secrets even if mistakenly captured
```

**Path:** `local_data/training/datasets/` · `local_data/training/exports/`

---

## Minimum Counts Before Train (Config)

```txt
writing fine-tune:     50+ gold examples
Burt scorer:           100+ labeled packets
project classifier:    200+ labeled files/folders
recall ranker:         500+ query-chunk relevance pairs
```

Lab dashboard shows progress toward thresholds.

---

## API (Target)

```txt
GET  /api/training/datasets
GET  /api/training/datasets/:id/examples
POST /api/training/examples/:id/approve
POST /api/training/datasets/:id/export
GET  /api/training/capture/stats
```

---

*Training data pipeline v1.0 · Pillar 14 · 2026-06-28*
