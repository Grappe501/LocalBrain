# LocalBrain Project Chargeback Model v1.0

> **Pillar 12 · Billing attribution.**  
> Token economy: [Token Economy Engine](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md) · Registry: ENG-TE-001–003

---

## Purpose

Every OpenAI call is **billable intelligence** — attribute it to project, workspace, client, and purpose so Steve can charge back, budget, and optimize.

---

## Log Schema (Every API Call)

**Table:** `openai_usage_log` · **Slice:** LB-OS-048

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | yes | Primary key |
| `provider_id` | text | yes | openai · anthropic · xai · local_ollama · … |
| `project_id` | text | yes | Registry project |
| `workspace_id` | text | yes | Living workspace ID |
| `client_id` | text | no | Chargeback client/workstream |
| `agent_id` | text | yes | e.g. `burt_script_writer` |
| `model` | text | yes | e.g. `gpt-4.1` |
| `input_tokens` | int | yes | |
| `output_tokens` | int | yes | |
| `cached_tokens` | int | no | From OpenAI usage response when available |
| `estimated_cost` | decimal | yes | USD · ENG-TE-002 |
| `purpose` | text | yes | See purpose taxonomy |
| `conversation_id` | text | no | |
| `tool_calls_used` | json | no | Tool names + counts |
| `recall_hit` | bool | no | Local memory avoided send |
| `tokens_saved_estimate` | int | no | From compression/recall |
| `timestamp` | datetime | yes | UTC |

**Indexes:** `(provider_id, timestamp)`, `(project_id, timestamp)`, `(client_id, timestamp)`, `(agent_id, timestamp)`, `(purpose, timestamp)`

---

## Purpose Taxonomy

```txt
chat_general
command_routed
file_summarize
file_read_context
burt_packet_generate
code_audit
writing_draft
campaign_draft
ojt_teaching
memory_compress
embedding_index
migration_import
system_health
other
```

Enables: *"Burt packet generation average cost: $0.19."*

---

## Client / Workstream Mapping

```txt
clients
- id, name, billing_code optional
- default_project_ids json

project_client_map
- project_id, client_id, allocation_pct optional
```

Example:

```txt
RedDirt     → client_id: reddirt_campaign
ACU         → client_id: acu_contract
LocalBrain  → client_id: internal_os
```

Unmapped projects → `client_id: internal` · still visible in reports.

---

## Cost Estimation (LB-OS-049)

**Engine:** ENG-TE-002

```txt
pricing_table: model → input_per_1k, output_per_1k, cached_per_1k
estimated_cost = f(input, output, cached, model)
```

Refresh pricing from config (not hardcoded secrets). Version pricing for historical accuracy.

**Budget warnings:**

```txt
project_monthly_budget_usd optional per project
workspace_soft_cap optional
alert at 80% · 100% · block deep model at 110% (policy)
```

---

## Reports (LB-OS-050)

### Standard reports

```txt
GET /api/billing/summary?period=month
GET /api/billing/by-project?period=month
GET /api/billing/by-client?period=month
GET /api/billing/by-agent?period=month
GET /api/billing/by-provider?period=month
GET /api/billing/by-model?period=month
GET /api/billing/by-purpose?period=month
```

### Example outputs

```txt
"RedDirt used $14.82 this month."           → by client
"ACU code generation used 61% of tokens."   → by project + purpose filter
"Writing work cost $3.12."                  → purpose=writing_*
"Burt packet generation average: $0.19."  → purpose=burt_packet_generate
```

### Export

```txt
CSV / Markdown for client chargeback packets
PDF later — not V1
```

---

## Dashboard Wiring (LB-OS-055)

| Card | Data source |
|------|-------------|
| **Token Usage** | ENG-TE-001 aggregates |
| **Estimated Spend** | ENG-TE-002 + budgets |
| **Memory Efficiency** | recall hits, tokens_saved |
| **Learning Pace** | ENG-LP-002 |

**LB-OS-002:** Token Economy placeholder summarizes planned monitors.

---

## Privacy & Safety

```txt
Log metadata and token counts — not full prompts in usage_log
Full prompts in conversations table — permission-gated
No client billing export includes .env or secrets
Steve is sole user V1 — chargeback is for Steve's planning, not invoicing automation
```

---

## Integration with Pillar 11

| Pillar 11 | Pillar 12 |
|-----------|-----------|
| ENG-AP-001 rate limits | ENG-TE-001 adds attribution columns |
| ENG-AP-007 token budget | ENG-TE-002 adds $ budget |
| Cached tokens metric | `cached_tokens` in log |

Single hook in `chatOrchestrator.ts` — one write per API response.

---

*Project chargeback model v1.0 · Pillar 12 · 2026-06-28*
