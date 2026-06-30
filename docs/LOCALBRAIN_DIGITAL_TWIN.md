# LocalBrain Digital Twin v1.0

> **The apex understanding object** — not a chat log, not a single table.  
> Parent: [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md) · Consumer: [Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md)

---

## What it is

Your **Digital Twin** is the AI's continuously updated understanding of Steve's world — the primary **World Model** cognition operates on (see [Cognitive Governance](./LOCALBRAIN_COGNITIVE_GOVERNANCE.md#world-model)). Composed from foundational objects and engines, refreshed incrementally — not reconstructed from scratch each session.

```txt
LivingWorkspace + Memory + Knowledge Sources + System health + Decision Ledger
+ Unknowns + Commitments + (Phase 3+) Organizational structure
= World Model / Digital Twin (composed view)
```

It may become the most valuable artifact in the entire system.

---

## Three domains

### 1. You

```txt
Goals · priorities · working style · coding knowledge · writing voices
Strengths · bottlenecks · schedule · energy patterns (optional)
Preferred workflows · teach-toggle preferences · learning pace
```

**Primary feeds:** Personal Memory · Learning Memory · Executive Memory · ENG-ID-001

### 2. Your company

```txt
Every workspace · every department · every project · every relationship
Every knowledge source · every codebase · every campaign · every manuscript
```

**Primary feeds:** LivingWorkspace registry · WorkspaceEvents · WorkspaceLinks · **Digital Asset Registry** · Relationship Memory · Workspace Memory · Knowledge Sources

### 3. Your machine

```txt
Storage · RAM · GPU · CPU · health · backups · deployment readiness
Host platform · drive doctrine (C:/ vs H:/) · permission boundaries
Digital Asset Registry — health, lifecycle, dormant counts (LB-OS-006+)
```

**Primary feeds:** System Memory · ENG-ST-001 · ENG-PH-001 · **ENG-DAR-001** · Host Platform telemetry

---

## How Chief of Staff uses it

```txt
Morning briefing  → read twin snapshot, not re-scan everything
"What changed?"   → WorkspaceEvents + Decision Ledger + health deltas
"Should we…?"     → twin + binding Decisions ("we chose X because…")
Route command     → twin knows active workspace, focus, success_definition
```

**Binding rule:**

```txt
Chief of Staff consults the Digital Twin.
It does not reconstruct Steve's world from scratch each session.
```

Implementation: ENG-DT-001 (Digital Twin Composer) — planned; initially satisfied by workspace registry + briefing mocks, growing with memory and health slices.

---

## What Digital Twin is NOT

```txt
Not a replacement for raw audit logs (ENG-LG-001)
Not a duplicate of every file on disk (indexed via Knowledge Sources)
Not a new foundational object (composed from the ten frozen objects)
Not sent wholesale to the LLM every call (compressed recall via Memory domains)
```

---

## Refresh model

```txt
Event-driven updates:
  workspace_created · focus_updated · slice_completed · decision_recorded
  memory_chunk_written · knowledge_source_synced · health_alert

Periodic synthesis (later):
  CoS summary blocks · executive_context refresh · twin health score
```

Twin state is **derived** and **versioned** — source of truth remains in foundational objects.

---

## Related docs

| Doc | Role |
|-----|------|
| [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md) | Ten frozen objects |
| [Memory Domains](./LOCALBRAIN_MEMORY_DOMAINS.md) | Recall inputs |
| [Knowledge Sources](./LOCALBRAIN_KNOWLEDGE_SOURCES.md) | External data inputs |
| [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) | Binding "why" |
| [Living Workspace Model](./LOCALBRAIN_LIVING_WORKSPACE_MODEL.md) | Company domain core |

---

*Digital Twin v1.0 · 2026-06-28*
