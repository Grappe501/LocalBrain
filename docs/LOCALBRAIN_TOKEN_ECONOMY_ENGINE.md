# LocalBrain Token Economy Engine v1.0

> **Pillar 12 · Token economy pillar doc.**  
> North star: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Queue: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) · Chargeback: [Project Chargeback Model](./LOCALBRAIN_PROJECT_CHARGEBACK_MODEL.md)

---

## Mission

Make every OpenAI dollar **visible, attributable, and optimizable** — by project, client, agent, and purpose.

```txt
Visible token monitor
Estimated dollar spend monitor
Project-level token billing
Client/project chargeback reports
```

Steve should always know: *what did this cost, who was it for, and was it worth it?*

---

## Design Rule (Pre-Flight — Every API Call)

Before any OpenAI request, LocalBrain asks:

```txt
Can I answer from local memory first?
Can I send a smaller excerpt?
Can I use a cheaper model?
Can I reuse cached context?
Is this worth a deep model call?
```

If all five favor a cheaper path → take it. Log the decision in `purpose` + audit.

Binding with Pillar 11: [Direct API Performance Engine](./LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md)

---

## Core Dashboard Surfaces

### Token Usage (LB-OS-055)

```txt
Current request tokens
Today tokens
This month tokens
By project
By agent
By model
```

### Estimated Spend (LB-OS-055)

```txt
Current request estimate
Today
Month
By project
By client/workstream
Budget warning
```

**LB-OS-002 placeholder:** single **Token Economy** card (see below). Full cards live in 055.

---

## Charge-Out Logging

Every OpenAI call logs — see [Project Chargeback Model](./LOCALBRAIN_PROJECT_CHARGEBACK_MODEL.md):

```txt
project_id · workspace_id · client_id (optional)
agent_id · model
input_tokens · output_tokens · cached_tokens (if available)
estimated_cost · purpose
conversation_id · tool_calls_used · timestamp
```

Example reports:

```txt
"RedDirt used $14.82 this month."
"ACU code generation used 61% of tokens."
"Writing work cost $3.12."
"Burt packet generation average cost: $0.19."
```

---

## Engines

| Engine | ID | Job |
|--------|-----|-----|
| Token usage logger | ENG-TE-001 | Per-call log, aggregates |
| Cost estimator | ENG-TE-002 | Model pricing → estimated_cost |
| Chargeback reporter | ENG-TE-003 | Project/client/workstream reports |
| Pre-flight optimizer | ENG-TE-004 | Five-question gate before send |

**Extends:** ENG-AP-001 (API usage monitor from Pillar 11) — TE layer adds billing attribution.

---

## Queue Arc (LB-OS-047–055)

| Slice | Focus |
|-------|-------|
| 047 | Token economy doctrine embedded |
| 048 | Token usage logger |
| 049 | Estimated cost monitor |
| 050 | Project/client chargeback reports |
| 051 | Memory compression pipeline |
| 052 | Chunked recall engine |
| 053 | Style learning engine |
| 054 | Learning pace + OJT adaptation |
| 055 | Token/Memory/Learning dashboard |

**Depends on:** LB-OS-040 minimum (usage logging); full value with 041+ and 051+.

**Gate:** **TOKEN ECONOMY COMMAND** = LB-OS-055

---

## OS Shell Integration (LB-OS-002)

Sixth context card:

```txt
Token Economy
  Token monitor:        planned
  Cost estimate:        planned
  Project chargeback:   planned
  Memory compression:   planned
```

This is how the system works **to Steve's advantage** — cost visibility from day one in the shell design.

---

## Relationship to Other Pillars

| Pillar | Relationship |
|--------|--------------|
| **11 — API Performance** | Rate limits, cache, queue — TE adds $ attribution |
| **12 — Memory recall** | [Memory Recall Architecture](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md) — avoid re-send |
| **12 — Learning pace** | [Learning Pace Engine](./LOCALBRAIN_LEARNING_PACE_ENGINE.md) — OJT throttle |
| **9 — OJT Academy** | Pace control feeds ENG-LP-002 |
| **13 — Provider-neutral** | `provider_id` in usage log; outcome learning |

```txt
Pillar 11 = API path fast
Pillar 12 = API spend smart + memory smart + learn at the right pace
Pillar 13 = multi-provider + GPU + route by outcome history
```

---

## Supporting Docs

| Doc | Role |
|-----|------|
| [Memory Recall Architecture](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md) | Layered memory, chunking, recall |
| [Learning Pace Engine](./LOCALBRAIN_LEARNING_PACE_ENGINE.md) | Teach more/less, OJT tracker |
| [Project Chargeback Model](./LOCALBRAIN_PROJECT_CHARGEBACK_MODEL.md) | Schema, reports, client mapping |

---

*Token economy engine v1.0 · Pillar 12 · 2026-06-28*
