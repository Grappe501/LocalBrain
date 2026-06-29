# LocalBrain Department Organization v1.0

> **Superseded for org chart by** [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) · **Planning by** [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md)  
> Executive Office: [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) · Agents: [Agent Registry](./LOCALBRAIN_AGENT_REGISTRY.md)

**Use Executive Domains** for all new planning. This doc remains as historical department reference.

---

## Principle

Stop thinking in **tools**. Think in **departments**.

Every department has:

```txt
A Chief AI
Specialist agents
Department memory
Dashboards / KPIs
Workflows · templates · automation opportunities
```

---

## Executive hierarchy

```txt
                           Steve (CEO)
                             │
              ┌──────────────┴──────────────┐
              │     EXECUTIVE OFFICE       │
              │     Chief of Staff AI      │
              └──────────────┬──────────────┘
                             │
     ┌───────────┬───────────┼───────────┬───────────┐
     ▼           ▼           ▼           ▼           ▼
Engineering  Writing    Operations   Media      Research
   Chief       Chief       Chief      Chief       Chief
     │           │           │           │           │
  agents      agents      agents      agents      agents
```

---

## Departments (V1 → expand)

| Department | Chief agent ID | Studio / surface | Primary KPIs |
|------------|----------------|------------------|--------------|
| **Executive Office** | `chief_of_staff` | Briefing home | Meaningful work index |
| **Engineering** | `engineering_chief` | Code Studio | Slices shipped, validation pass |
| **Writing** | `writing_chief` | Writing Studio | Accepted drafts, rewrite % |
| **Operations** | `operations_chief` | Campaign + grants | Deadlines met, claims gate |
| **Media** | `media_chief` | Social Studio | Published, engagement prep |
| **Research** | `research_chief` | Research Studio | Sources cited, debate ready |
| **Photography** | `photography_chief` | Photography division | Cull rate, delivery time |
| **Podcast** | `podcast_chief` | Podcast division | Episodes → deliverables ratio |
| **Learning** | `learning_chief` | OJT Academy | Concepts mastered |
| **Finance** | `cfo_chief` | CFO / Accounting | Books, compliance, budgets |
| **System Administration** | `sysadmin_chief` | System Admin Studio | Health, disk, uptime |

---

## Delegation flow

```txt
1. Steve speaks to Chief of Staff (voice, command, briefing action)
2. ENG-EO-002 classifies: which department(s)?
3. ENG-EO-003 invokes department chief with workspace context
4. Chief selects specialist agent(s) from registry
5. Work executes through capability router + permission engine
6. Results return to Chief of Staff for synthesis
7. Steve sees: outcome + recommended next action + approvals if needed
```

Steve does **not** need to pick "Code Studio" first — CoS routes.

---

## Engineering department (example)

```txt
Engineering Chief
├── burt_script_writer
├── codebase_auditor
├── general_localbrain (engineering mode)
└── deployment_checklist_agent
```

Maps to LB-OS-011 Code Studio — accessed via chief, not only via nav.

---

## Photography division

```txt
Photography Chief
├── Lightroom workflow advisor
├── Photo culling assistant
├── Metadata / lens correction guide
├── Batch export planner
├── Gallery publishing checklist
├── Client delivery tracker
└── Archive management
```

**Track A now:** workflow templates, checklists, file organization on H:  
**Track B GPU:** local enhancement, tagging, semantic search, face grouping (policy), duplicate detection, AI masking

**Doc:** [Photography Division](./LOCALBRAIN_PHOTOGRAPHY_DIVISION.md) · **Slice:** LB-OS-093

---

## Podcast division

```txt
Podcast Chief
Recording → noise cleanup → speaker separation → transcript
→ show notes → chapters → clips → blog → newsletter
→ social posts → YouTube description → publishing checklist
```

One recording → ten deliverables pipeline (propose → approve each).

**Doc:** [Podcast Division](./LOCALBRAIN_PODCAST_DIVISION.md) · **Slice:** LB-OS-094

---

## Department memory

Each chief maintains:

```txt
department_memory/{dept_id}/
  kpis.json · active_workflows · templates · recent_decisions
```

Feeds Living Workspace + Executive briefing.

---

## Agent registry evolution

Add to [Agent Registry](./LOCALBRAIN_AGENT_REGISTRY.md) (LB-OS-092):

```txt
agent_reports_to: chief_of_staff | engineering_chief | …
department_id: engineering | writing | …
```

Chiefs have `risk_limit: MEDIUM` for delegation; specialists stay `LOW` unless gated.

---

*Department organization v1.0 · Pillar 17 · 2026-06-28*
