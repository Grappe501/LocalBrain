# LocalBrain Memory Domains v1.0

> **Split memory model** — six domains that evolve independently.  
> Foundational object: **Memory** · Pipeline detail: [Memory Recall Architecture](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md)  
> Parent: [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md)

---

## Principle

Do not store everything in one giant memory engine. **Memory** is one foundational object with **six domains** — each has its own tables, retention rules, and recall policies.

```txt
Memory
├── Personal Memory      — Steve: style, goals, preferences, energy, workflows
├── Workspace Memory     — per LivingWorkspace: chunks, graph, slice history
├── System Memory        — machine: drives, health, backups, deployment state
├── Relationship Memory  — people, orgs, contacts, campaign relationships
├── Learning Memory      — OJT progress, skill map, repeated concepts, certifications
└── Executive Memory     — CoS: briefings, priorities, cross-workspace decisions
```

---

## Domain definitions

| Domain | Scope | Examples | Primary engine |
|--------|-------|----------|----------------|
| **Personal** | Steve globally | Writing voices, coding level, teach toggle, goals | ENG-ID-001 · ENG-MM-001 |
| **Workspace** | One `workspace_id` | Project chunks, Burt outcomes, canon, campaign intel | ENG-MR-003 · ENG-KP-001 |
| **System** | Host + LocalBrain install | Disk alerts, backup status, GPU mode, permission changes | ENG-ST-001 · ENG-PH-001 |
| **Relationship** | Cross-workspace people/orgs | Donors, vendors, team, voter contacts | ENG-KG-001 · CRM modules |
| **Learning** | OJT Academy | Lesson progress, quiz scores, "came up 5 times" patterns | ENG-OJ-001 · ENG-LP-002 |
| **Executive** | CoS layer | Briefing snapshots, priority stack, dismissed signals | ENG-CS-001 · ENG-EO-001 |

---

## Memory record shape (shared across domains)

| Field | Purpose |
|-------|---------|
| `memory_id` | Stable id |
| `domain` | personal · workspace · system · relationship · learning · executive |
| `workspace_id` | Required for workspace domain; optional elsewhere |
| `kind` | chunk · summary · pattern · decision_ref · health_snapshot · … |
| `content` | Text or structured JSON |
| `source_ref` | KnowledgeSource, file path, conversation id, … |
| `created_at` · `updated_at` | Lifecycle |
| `embedding_ref` | Optional vector index pointer |

Domains share the **object model** — not necessarily one physical table (implementation may partition by domain).

---

## Independence rules

```txt
Personal Memory does not overwrite Workspace Memory
System health snapshots do not pollute Novel canon chunks
Relationship Memory is queryable without loading full workspace graphs
Executive Memory is short-lived synthesis + pointers — not a duplicate of everything
```

Recall pipeline ([Memory Recall](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md)) selects domains by intent before pre-flight. **Phase 2+:** [Executive Memory OS](./LOCALBRAIN_EXECUTIVE_MEMORY_OS.md) operates this layer at runtime — Memory Confidence, Context Window, domain-scoped recall before CoS reasoning.

---

## Digital Twin connection

```txt
You       ← Personal + Learning + Executive (priorities)
Company   ← Workspace + Relationship
Machine   ← System
```

CoS composes twin views from domain queries — never merges domains into one undifferentiated blob for storage.

---

## Relationship to Decision Ledger

Binding **Decisions** live in the Decision Ledger. **Executive Memory** may cache decision summaries and CoS interpretations — ledger remains source of truth for status `binding`.

---

## Slices (planned)

| Slice | Deliverable |
|-------|-------------|
| LB-OS-008 | Raw messages (feeds pipeline) |
| LB-OS-051–052 | Summaries, workspace chunks, recall |
| LB-OS-053–054 | Personal patterns, learning memory |
| Post-024 | Relationship graph + memory integration |

---

## Related docs

| Doc | Role |
|-----|------|
| [Memory Recall Architecture](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md) | Layered pipeline (raw → embedding) |
| [Executive Memory OS](./LOCALBRAIN_EXECUTIVE_MEMORY_OS.md) | Memory-before-reasoning layer · Memory Confidence · Context Window |
| [Digital Twin](./LOCALBRAIN_DIGITAL_TWIN.md) | Composed consumer |
| [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) | Binding choices |

---

*Memory Domains v1.0 · 2026-06-28*
