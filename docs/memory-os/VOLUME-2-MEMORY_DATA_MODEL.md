# Volume 2 — Memory Data Model

> **Milestone:** MEM-002  
> **Status:** Draft — **MAR-1 reviewed**  
> **Glossary:** [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md)  
> **Principle:** Memory records what happened. Intelligence interprets what happened. Policy decides what should happen.  
> **Registry:** [CANONICAL_OBJECT_REGISTRY](./CANONICAL_OBJECT_REGISTRY.md)  
> **Time model:** [TIME_MODEL](./TIME_MODEL.md)  
> **Parent:** [Memory OS Design Package](./README.md) · [Volume 1](./VOLUME-1-MEMORY_CONSTITUTION.md)  
> **Extends:** [Memory Domains v1.0](../LOCALBRAIN_MEMORY_DOMAINS.md)

---

## Success test (binding)

> **Could two independent implementations serialize, exchange, and evolve the same canonical memory objects without schema collision?**

---

## Design rules

| Rule | Description |
| ---- | ----------- |
| **Versioned schemas** | Every object type carries `schema_version` |
| **Additive evolution** | New fields optional; removed fields deprecated — never deleted in v1 |
| **Domain partition** | Objects declare `domain` — no undifferentiated storage |
| **Provenance required** | No anonymous memory objects |
| **Identity by reference** | `subject_id` / `actor_id` — not embedded identity |

---

## Canonical object types

### Episodes

Time-bounded sequences of observations — meetings, sessions, work blocks.

| Field | Type | Required |
| ----- | ---- | -------- |
| `episode_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `domain` | domain enum | Yes |
| `title` | string | No |
| `started_at` | ISO-8601 | Yes |
| `ended_at` | ISO-8601 | No |
| `participants` | `identity_ref[]` | No |
| `source_ref` | string | Yes |
| `lifecycle_state` | S2 state | Yes |
| `provenance` | S4 envelope | Yes |
| `event_at` | ISO-8601 | Yes |
| `created_at` | ISO-8601 | Yes |

**Evolution:** Episodes may be merged into summaries — originals archived, not deleted.

---

### Facts

Atomic attestable statements — the smallest durable memory unit.

| Field | Type | Required |
| ----- | ---- | -------- |
| `fact_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `domain` | domain enum | Yes |
| `statement` | string | Yes |
| `subject_ref` | identity_ref | Yes |
| `predicate` | string | Yes |
| `object_ref` | ref | No |
| `confidence` | trust envelope | Yes |
| `valid_from` | ISO-8601 | No |
| `valid_until` | ISO-8601 | No |
| `lifecycle_state` | S2 state | Yes |
| `provenance` | S4 envelope | Yes |
| `event_at` | ISO-8601 | Yes |
| `created_at` | ISO-8601 | Yes |

Facts supersede — they do not update in place.

---

### Skills

Learning domain — demonstrated capability with evidence ladder.

| Field | Type | Required |
| ----- | ---- | -------- |
| `skill_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `name` | string | Yes |
| `mastery_level` | enum | Yes |
| `evidence_refs` | `memory_ref[]` | Yes |
| `last_demonstrated_at` | ISO-8601 | No |
| `curriculum_ref` | string | No |

Ties to LB-OS-027 learning arc — separate from executive facts.

---

### Relationships

People, organizations, and institutional connections.

| Field | Type | Required |
| ----- | ---- | -------- |
| `relationship_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `party_a` | identity_ref | Yes |
| `party_b` | identity_ref | Yes |
| `relationship_type` | enum | Yes |
| `strength` | float 0–1 | No |
| `first_observed_at` | ISO-8601 | Yes |
| `last_interaction_at` | ISO-8601 | No |
| `lifecycle_state` | S2 state | Yes |

---

### Preferences

Personal domain — owner-stated or inferred-with-consent preferences.

| Field | Type | Required |
| ----- | ---- | -------- |
| `preference_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `category` | string | Yes |
| `key` | string | Yes |
| `value` | JSON | Yes |
| `source` | `stated` \| `inferred` | Yes |
| `consent_ref` | string | If inferred |
| `lifecycle_state` | S2 state | Yes |

Inferred preferences require explicit consent per [S5](../convention/CONVENTION-S5-ETHICS_CONTRACT.md).

---

### Projects

Workspace domain — bounded work with goals and artifacts.

| Field | Type | Required |
| ----- | ---- | -------- |
| `project_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `workspace_id` | UUID | Yes |
| `name` | string | Yes |
| `status` | enum | Yes |
| `goal_refs` | `goal_ref[]` | No |
| `artifact_refs` | `ref[]` | No |
| `lifecycle_state` | S2 state | Yes |

---

### Organizations

Institutional entities — departments, vendors, campaigns.

| Field | Type | Required |
| ----- | ---- | -------- |
| `organization_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `name` | string | Yes |
| `org_type` | enum | Yes |
| `parent_org_ref` | ref | No |
| `member_refs` | `identity_ref[]` | No |

---

### Conversations

Captured dialogue with provenance — not raw chat logs as undifferentiated blobs.

| Field | Type | Required |
| ----- | ---- | -------- |
| `conversation_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `channel` | enum | Yes |
| `participants` | `identity_ref[]` | Yes |
| `started_at` | ISO-8601 | Yes |
| `turn_refs` | `turn_ref[]` | Yes |
| `summary_ref` | `memory_ref` | No |
| `lifecycle_state` | S2 state | Yes |

---

### Tasks

Actionable items with accountability.

| Field | Type | Required |
| ----- | ---- | -------- |
| `task_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `title` | string | Yes |
| `assignee_ref` | identity_ref | No |
| `due_at` | ISO-8601 | No |
| `status` | enum | Yes |
| `source_memory_refs` | `memory_ref[]` | No |

---

### DecisionCitation

Cites [Decision Ledger](../LOCALBRAIN_DECISION_LEDGER.md) — **binding decision authority remains in ledger** (MAR-1).

| Field | Type | Required |
| ----- | ---- | -------- |
| `citation_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `decision_id` | string | Yes — ledger FK |
| `question` | string | Yes |
| `outcome_summary` | string | Yes |
| `decided_at` | ISO-8601 | Yes — event time |
| `decider_ref` | identity_ref | Yes |
| `supporting_memory_refs` | `memory_ref[]` | Yes |
| `ledger_ref` | string | Yes |
| `lifecycle_state` | S2 state | Yes |
| `provenance` | S4 envelope | Yes |
| `event_at` | ISO-8601 | Yes |
| `created_at` | ISO-8601 | Yes |

---

### Artifacts

Files and structured deliverables — workspace domain.

| Field | Type | Required |
| ----- | ---- | -------- |
| `artifact_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `domain` | domain enum | Yes |
| `uri` or `content_ref` | string | Yes |
| `mime_type` | string | Yes |
| `project_ref` | ref | No |
| `lifecycle_state` | S2 state | Yes |
| `provenance` | S4 envelope | Yes |
| `event_at` | ISO-8601 | Yes |
| `created_at` | ISO-8601 | Yes |

---

### Goals

Mission-level objectives — executive and workspace scoped.

| Field | Type | Required |
| ----- | ---- | -------- |
| `goal_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `domain` | domain enum | Yes |
| `statement` | string | Yes |
| `horizon` | enum | Yes |
| `status` | enum | Yes |
| `parent_goal_ref` | ref | No |
| `progress_refs` | `memory_ref[]` | No |

---

## Shared primitives

```typescript
// Specification types — not implementation

type domain =
  | "personal" | "workspace" | "system"
  | "relationship" | "learning" | "executive";

type identity_ref = { identity_id: string; identity_kind: string };
type memory_ref = { memory_id: string; object_type: string };
type trust_envelope = {
  level: "system" | "verified" | "user_confirmed" | "observed" | "imported" | "derived" | "hypothesis";
  evaluated_at: string;
};
type ref = { id: string; type: string };
```

**Not stored by Memory OS:** Knowledge, Belief, Understanding — Intelligence-layer; `derivation_link` edges only ([MAR-1](./MAR-1-ARCHITECTURE_REVIEW.md)).

**Not a canonical object:** Observation — pre-memory boundary ([Glossary](./CANONICAL_GLOSSARY.md)).

---

## Schema evolution rules

| Change type | v1 policy |
| ----------- | --------- |
| Add optional field | Permitted — bump minor `schema_version` |
| Add required field | New object type or major version |
| Rename field | Deprecated alias retained one major version |
| Remove field | Forbidden in v1 — mark deprecated |
| Change semantics | New `schema_version` — old records unchanged |

Migration engine (post-MEM-009) reads `schema_version` and transforms on read — never silent in-place mutation.

---

## Factory interface

Memory OS receives from Factory at install:

| Factory delivers | Memory OS fills |
| ---------------- | --------------- |
| Empty vault schemas | Personal + workspace content |
| Domain slot definitions | Domain records |
| Convention bundle refs | Live convention compliance |
| Birth certificate `instance_id` | All memory scoped to instance |

Memory OS **never** modifies Factory birth certificate or structural hash.

---

*Volume 2 · Memory Data Model · MEM-002*
