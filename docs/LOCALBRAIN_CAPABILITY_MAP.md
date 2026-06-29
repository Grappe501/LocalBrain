# LocalBrain Capability Map v1.0

> **Maps OS pillars to LB-OS-### slices.** Post–Pillar 17 planning uses [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) (LB-OS-097–105) — no Pillar 18+.  
> North star: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Migration: [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md) · Queue: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md)

---

## Foundation (Unified)

```txt
Project folders = filesystem folders.
Explorer · storage · projects · AI = ONE foundation on H:/.
C:/ = programs only — not project workspace.
```

| Foundation piece | Slice |
|------------------|-------|
| OS shell layout | LB-OS-002 |
| Permission engine | LB-OS-003 |
| Project folder registry | LB-OS-004 |
| Explorer tree + metadata | LB-OS-005 |
| Storage intelligence | LB-OS-006 |
| System health (CPU/RAM/disk) | LB-OS-007 |

---

## Overview (Ten Pillars)

```txt
                         ┌──────────────────────┐
                         │  AI Command Interface │
                         └──────────┬───────────┘
    ┌──────────┬─────────┼─────────┬──────────┬──────────────┬─────────────┐
    ▼          ▼         ▼         ▼          ▼              ▼             ▼
 Explorer  Code Studio Writing  Social    SysAdmin    Drive C:/H:   Optimization
 (=H: folders) Studio  Dashboard Interface  Partner   Knowledge      Command Center
    │            │                              │              │              │
    └────────────┴──── Storage + Health ───────┴──────────────┴──────────────┘
                              LB-OS-005–007        LB-OS-016–024    LB-OS-031–038
                                                                    LB-OS-039–046 (API perf)
                                                                    LB-OS-047–055 (token economy)
                                                                    LB-OS-056–065 (provider AI)
                                                                    LB-OS-066–075 (neural lab)
```

---

## 1. AI Command Interface

| Capability | Slice |
|------------|-------|
| OS shell + command bar | LB-OS-002 |
| OpenAI chat | LB-OS-008 |
| Tool router + read/summarize | LB-OS-009 |
| Right panel: AI actions, approvals | LB-OS-002, 010 |

---

## 2. Explorer (= Project Folders on H:)

| Capability | Slice |
|------------|-------|
| Project folder registry | LB-OS-004 |
| Tree browse + search | LB-OS-005 |
| File preview in center | LB-OS-002, 005 |
| Storage large/dup/stale | LB-OS-006 |

**Doc:** [Explorer System Blueprint](./LOCALBRAIN_EXPLORER_SYSTEM_BLUEPRINT.md)

---

## 3. Code Engineering Studio

| Capability | Slice |
|------------|-------|
| Burt script generation | LB-OS-011 |
| Repo context from explorer | LB-OS-005, 011 |

---

## 4. Writing Dashboard

| Capability | Slice |
|------------|-------|
| Write tab + modes + voices | LB-OS-012 |

---

## 5. Social Media Interface

| Capability | Slice |
|------------|-------|
| Social tab + drafts | LB-OS-013 |

---

## 6. System Administrator Partner

| Capability | Slice |
|------------|-------|
| CPU/RAM/disk monitor | LB-OS-007 |
| Storage advisor | LB-OS-006 |
| Optimization advisor | LB-OS-014 |
| Approval-gated moves/deletes | LB-OS-010 |

**Doc:** [System Admin Partner Model](./LOCALBRAIN_SYSTEM_ADMIN_PARTNER_MODEL.md)

---

## 7. Drive Separation (C:/H:)

**Job:** Enforce and explain two-drive doctrine.

| Capability | Slice |
|------------|-------|
| C: vs H: path rules in permission engine | LB-OS-003, 016 |
| Drive badges + warnings in UI | LB-OS-016 |
| H: default for project registration | LB-OS-004, 016 |
| C: disk pressure observe-only | LB-OS-007 |

```txt
C:/ = operating programs only
H:/ = work projects, data, archives, documents, repos, media, storage
```

**Doc:** [Migration & Drive Doctrine §1](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md#1-drive-doctrine)

---

## 8. Knowledge Migration

**Job:** Map, reorganize, preserve Steve's digital life — then cut over.

| Capability | Slice |
|------------|-------|
| Migration planner | LB-OS-016 |
| Full H: filesystem audit | LB-OS-017 |
| Duplicate/version planner (dry-run) | LB-OS-018 |
| H: filing system builder | LB-OS-019 |
| ChatGPT export import | LB-OS-020 |
| Project memory transfer | LB-OS-021 |
| Legacy reorg assistant | LB-OS-022 |
| Personal cutover plan | LB-OS-023 |
| Personal OS launch | LB-OS-024 |

**Imports/maps:** ChatGPT exports, Cursor reports, build docs, voices, requirements, handoffs.

**Rule:** inventory → map → report → plan → approve → act. **No auto cleanup.**

**Doc:** [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md)

---

## Ship Gates

| Gate | Slice |
|------|-------|
| V1 ship | LB-OS-015 |
| Migration arc | LB-OS-016–023 |
| Personal OS launch | LB-OS-024 |
| OJT academy | LB-OS-025–030 |
| Optimization command | LB-OS-031–038 |
| API performance | LB-OS-039–046 |
| Token economy & memory | LB-OS-047–055 |
| Provider-neutral AI | LB-OS-056–065 |
| Neural network lab | LB-OS-066–075 (Track B stubs) |
| AI evolution | LB-OS-076–082 (Track A) |
| AI Chief of Staff | LB-OS-083–086 (Track A) |
| Executive Office | LB-OS-087–096 (Track A) |

**Dual-track:** [Dual-Track Roadmap](./LOCALBRAIN_DUAL_TRACK_ROADMAP.md)

---

## 9. OJT Coding Academy

| Capability | Slice |
|------------|-------|
| Academy doctrine embedded | LB-OS-025 |
| Build-along teaching mode | LB-OS-026 |
| Concept ladder + skill map | LB-OS-027 |
| Interactive challenges | LB-OS-028 |
| Progress dashboard | LB-OS-029 |
| Certification / portfolio | LB-OS-030 |

**Doc:** [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md)

---

## 10. System Optimization & Performance Command Center

**Job:** Organized, fast, lean — C:/ programs, H:/ work.

| Layer | Slice |
|-------|-------|
| Doctrine embedded | LB-OS-031 |
| C:/H: drive mapper | LB-OS-032 |
| Storage cleanup intelligence | LB-OS-033 |
| Duplicate/version planner | LB-OS-034 |
| CPU/RAM/disk monitor (full) | LB-OS-035 |
| Process/startup advisor | LB-OS-036 |
| Safe cleanup execution | LB-OS-037 |
| System efficiency dashboard | LB-OS-038 |

**Dashboard (LB-OS-002 placeholders):** Storage · Performance · Drive · Cleanup · **API Performance**

**Doc:** [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md)

---

## 11. Direct API Performance Engine

**Job:** Own the OpenAI API path — fast, cheap, queued, cached.

| Capability | Slice |
|------------|-------|
| Doctrine embedded | LB-OS-039 |
| API usage + rate-limit monitor | LB-OS-040 |
| Context cache + prompt prefix | LB-OS-041 |
| Request queue + retry | LB-OS-042 |
| Streaming engine (full) | LB-OS-043 |
| Model router (fast/deep/code/writing) | LB-OS-044 |
| Context compression | LB-OS-045 |
| API performance dashboard | LB-OS-046 |

**Dashboard (LB-OS-002):** API Performance card — key status, Direct API, streaming/cache/monitor planned

**Doc:** [Direct API Performance Engine](./LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md)

---

## 12. Token Economy, Memory Recall & Learning Pace

**Job:** Visible $ · smart recall · adaptive teaching.

| Capability | Slice |
|------------|-------|
| Token economy doctrine | LB-OS-047 |
| Token usage logger | LB-OS-048 |
| Estimated cost monitor | LB-OS-049 |
| Project/client chargeback | LB-OS-050 |
| Memory compression pipeline | LB-OS-051 |
| Chunked recall engine | LB-OS-052 |
| Style learning | LB-OS-053 |
| Learning pace + OJT adaptation | LB-OS-054 |
| Token/Memory/Learning dashboard | LB-OS-055 |

**Dashboard (LB-OS-002):** Token Economy placeholder · **055 full:** Token Usage · Estimated Spend · Memory Efficiency · Learning Pace

**Docs:** [Token Economy](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md) · [Memory Recall](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md) · [Learning Pace](./LOCALBRAIN_LEARNING_PACE_ENGINE.md) · [Chargeback](./LOCALBRAIN_PROJECT_CHARGEBACK_MODEL.md)

---

## 13. Provider-Neutral AI + GPU-Ready Intelligence

**Job:** Router + adapters · GPU-ready · smarter over time.

| Capability | Slice |
|------------|-------|
| Provider-neutral doctrine | LB-OS-056 |
| AI provider router interface | LB-OS-057 |
| OpenAI provider adapter | LB-OS-058 |
| Claude adapter placeholder | LB-OS-059 |
| Grok adapter placeholder | LB-OS-060 |
| Model capability registry | LB-OS-061 |
| GPU server migration plan | LB-OS-062 |
| Local model runtime (Ollama) | LB-OS-063 |
| Provider cost/performance dashboard | LB-OS-064 |
| Smart model selection engine | LB-OS-065 |

**Dashboard (LB-OS-002):** AI Provider card · **064:** provider comparison

**Docs:** [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) · [Model Router](./LOCALBRAIN_MODEL_ROUTER_STRATEGY.md) · [GPU Migration](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md) · [Local Fallback](./LOCALBRAIN_LOCAL_MODEL_FALLBACK_PLAN.md)

---

## 14. Local Neural Network Lab

**Job:** Train · fine-tune · deploy narrow models (Levels 1–4).

| Capability | Slice |
|------------|-------|
| Neural lab doctrine | LB-OS-066 |
| GPU runtime environment | LB-OS-067 |
| Training data capture | LB-OS-068 |
| Dataset quality / privacy filter | LB-OS-069 |
| Fine-tuning experiment tracker | LB-OS-070 |
| Local model adapter (train → serve) | LB-OS-071 |
| Small classifier training lab | LB-OS-072 |
| Steve-style writing fine-tune | LB-OS-073 |
| Burt script scoring model | LB-OS-074 |
| Local Neural Lab dashboard | LB-OS-075 |

**Dashboard (LB-OS-002):** Neural Lab card · **075:** full lab UI

**Docs:** [Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md) · [Fine-Tuning](./LOCALBRAIN_FINE_TUNING_STRATEGY.md) · [Training Data](./LOCALBRAIN_TRAINING_DATA_PIPELINE.md) · [GPU Runtime](./LOCALBRAIN_GPU_MODEL_RUNTIME_PLAN.md) · **Track B**

---

## 15. AI Evolution Engine

**Job:** Capability-first routing · self-measure · scorecard · preferences.

| Capability | Slice |
|------------|-------|
| Evolution + dual-track doctrine | LB-OS-076 |
| AI capability registry | LB-OS-077 |
| Capability router | LB-OS-078 |
| Self-measurement pipeline | LB-OS-079 |
| Outcome scorecard | LB-OS-080 |
| Preference learner | LB-OS-081 |
| Evolution dashboard | LB-OS-082 |

**Docs:** [AI Evolution](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md) · [Capability Architecture](./LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md) · [Self-Measurement](./LOCALBRAIN_SELF_MEASUREMENT_MODEL.md)

---

## 16. AI Chief of Staff

**Job:** Proactive briefings · conflicts · stale · versions · coaching nudges.

| Capability | Slice |
|------------|-------|
| Chief of Staff doctrine | LB-OS-083 |
| Proactive signal engine | LB-OS-084 |
| Conflict/stale/version detectors | LB-OS-085 |
| Briefing UI | LB-OS-086 |

**UX:** Briefing strip in CommandBar + Living Workspace — not a context card.

**Doc:** [AI Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md)

---

## 17. Executive Office

**Job:** AI Executive OS — above all studios · departments · meaningful work.

| Capability | Slice |
|------------|-------|
| Executive Office doctrine | LB-OS-087 |
| Chief of Staff orchestrator + dept routing | LB-OS-088 |
| Executive briefing (default home) | LB-OS-089 |
| Calendar intelligence | LB-OS-090 |
| Email intelligence (approval-gated) | LB-OS-091 |
| Department chief framework | LB-OS-092 |
| Photography division | LB-OS-093 |
| Podcast division | LB-OS-094 |
| Effectiveness metrics (MWI) | LB-OS-095 |
| Executive Office home | LB-OS-096 |

**Boot:** Executive Briefing — not dashboard-first · **Never** label lead AI "assistant"

**Docs:** [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) · [Briefing](./LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md) · [Departments](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md) · [Effectiveness](./LOCALBRAIN_EFFECTIVENESS_METRICS.md)

---

*Capability map v1.0 · seventeen pillars · AI Executive OS · 2026-06-28*
