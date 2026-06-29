# LocalBrain Self-Measurement Model v1.0

> **Every AI interaction measured** — foundation for Pillar 15 + 16.  
> Evolution: [AI Evolution Engine](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md) · Chargeback: [Project Chargeback Model](./LOCALBRAIN_PROJECT_CHARGEBACK_MODEL.md)

---

## Why

ChatGPT, Cursor, and most tools do not systematically answer:

```txt
Was this useful?
Did Steve accept it?
Did Steve rewrite it?
How much did he rewrite?
How many minutes did it save?
What did it cost?
Could a cheaper model have done this?
Should this become reusable knowledge?
```

LocalBrain **does** — locally, per project, per capability.

---

## Measurement dimensions

| Field | Source | Used by |
|-------|--------|---------|
| `useful` | Steve 👍/👎 or implicit | EV-005 |
| `accepted` | Approve action / use output | EV-005, NN-003 |
| `steve_revised` | Edit diff after AI output | EV-005 |
| `rewrite_pct` | Levenshtein / line change % | Writing capability score |
| `minutes_saved` | Optional Steve estimate; infer from task type | Chief of Staff |
| `cost_usd` | ENG-TE-001 | Scorecard |
| `cheaper_viable` | Post-hoc: replay with fast model flag | EV-005 |
| `became_knowledge` | Promoted to memory chunk | ENG-MR-001 |
| `burt_ok` | Packet validation passed | Coding capability |
| `validation_ok` | npm run check etc. | Coding capability |

Extends `task_outcomes` (Pillar 13) and `openai_usage_log` (Pillar 12).

---

## Schema extension

```txt
ai_interaction_metrics
- id, conversation_id, message_id
- capability_id, provider_id, model_id, agent_id
- project_id, workspace_id, purpose
- useful nullable, accepted bool, steve_revised bool
- rewrite_pct nullable, minutes_saved nullable
- cost_usd, tokens_in, tokens_out
- cheaper_viable nullable
- became_knowledge bool
- burt_ok nullable, validation_ok nullable
- created_at
```

---

## Capture points

```txt
Chat message complete     → baseline log
Steve approves action     → accepted=true
Steve edits draft         → revised + rewrite_pct
Steve dismisses suggestion → useful=false
Burt closeout             → burt_ok, validation_ok
Slice commit success      → validation_ok for code tasks
Explicit "save to memory"   → became_knowledge
Session end prompt        → useful? minutes_saved? (optional, low friction)
```

**Slice:** LB-OS-079

---

## Cheaper-model analysis

Async job (Track A — CPU):

```txt
For accepted high-cost interactions:
  Flag if profile=fast + same capability might suffice
  Optional: shadow call to fast model on holdout (policy-gated, budget cap)
Store cheaper_viable suggestion — never auto-switch without scorecard confidence
```

---

## Privacy

```txt
Metrics local only in SQLite
No telemetry to vendors beyond API calls themselves
Rewrite diffs stored locally — permission-gated paths only
```

---

## Feeds

| Consumer | Use |
|----------|-----|
| ENG-EV-004 | Scorecard aggregates |
| ENG-EV-005 | Preference learning |
| ENG-CS-001 | "You rewrote 80% — want writing model tune?" |
| ENG-NN-003 | Gold training examples when accepted=true |
| ENG-TE-003 | Chargeback by capability |

---

*Self-measurement model v1.0 · 2026-06-28*
