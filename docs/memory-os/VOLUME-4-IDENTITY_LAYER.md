# Volume 4 — Identity Layer

> **Milestone:** MEM-005  
> **Status:** Draft — **MAR-1 reviewed**  
> **Delegation:** [DELEGATION_MODEL](./DELEGATION_MODEL.md)  
> **Glossary:** [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md)  
> **Principle:** Memory records what happened. Intelligence interprets what happened. Policy decides what should happen.

---

## Success test (binding)

> **Could two independent teams attribute memory records to the correct identities without conflating executive, institutional, and assistant personas?**

---

## Core separation

> **Identity is who. Memory is what happened to whom.**

Identity Layer defines **who exists** in the institution. Memory Layer records **what happened** — attributed by reference, not embedded definition.

---

## Identity kinds

| Kind | Description | Example |
| ---- | ----------- | ------- |
| **Executive identity** | Sovereign owner of the institution | Primary human operator |
| **Institutional identity** | The organization as entity | "LocalBrain Executive Office" |
| **Department identity** | Department as actor | Strategy Office |
| **Assistant persona** | AI agent operating under delegation | Chief of Staff voice |
| **External identity** | People/orgs outside the institution | Contacts, vendors |
| **System identity** | Automated actors | Ingestion pipeline, health monitor |

Each identity has stable `identity_id` — immutable across renames.

---

## Executive identity

| Field | Source |
| ----- | ------ |
| `instance_id` | Factory birth certificate |
| `passport_id` | Factory birth certificate |
| `display_name` | Executive Discovery (post-install) |
| `authority_stack` | PROD-008/009 (reserved) |

Executive identity is established at Factory install — **personalized** at Executive Discovery. Memory OS does not manufacture identity; it records against it.

---

## Institutional identity

The empty institution Factory manufactures becomes **this institution** at activation:

```txt
Factory empty institution → Executive Discovery → Institutional identity live
```

Institutional identity owns workspace-scoped memory defaults and department boundaries.

---

## Department identities

Departments from Executive Office projection act as **memory scopes**:

| Property | Rule |
| -------- | ---- |
| Capture scope | Department may capture within its domain |
| Recall scope | Department recall policy filters by `department_id` |
| Synthesis | Synthesis department may read cross-department — not write |

Department identity ≠ department memory — identity is the actor; memory is the record.

---

## Assistant personas

| Rule | Description |
| ---- | ----------- |
| **Delegation required** | Persona acts under explicit grant |
| **No sovereign memory** | Persona memories are institutional — not personal |
| **Voice ≠ identity** | Communication style is Intelligence — `identity_id` is the actor |
| **Audit** | Every persona action carries `actor_id` = persona + `on_behalf_of` |

Chief of Staff, department agents, and ingestion assistants are personas — not separate executives.

---

## Capability ownership

Capabilities from [Capability Registry](../LOCALBRAIN_CAPABILITY_REGISTRY.md) declare **which department owns authoritative answers**:

```txt
Executive Question → Authoritative Capability → Department Identity → Memory Domain
```

Memory attributed to a capability includes `capability_id` and `department_id` for recall routing.

---

## Delegation

Full schema: [DELEGATION_MODEL](./DELEGATION_MODEL.md)

| Grant type | Permits |
| ---------- | ------- |
| **Read delegation** | Recall memory in grant scope |
| **Capture delegation** | Write memory on behalf of grantor |
| **Act delegation** | Intelligence action — requires Policy approval |

Delegation grants are time-bounded, scope-bounded, revocable, auditable, chainable (max depth 3) — never implicit from role alone.

---

## Permission boundaries

```txt
Executive (sovereign)
    ├── Personal domain: full
    ├── Executive domain: full
    ├── Workspace: per-workspace policy
    └── System: read-only default

Department
    ├── Own domain: capture + recall
    ├── Other departments: read if policy allows
    └── Personal: never

Assistant persona
    ├── Delegated scope only
    └── Never personal sovereign tier

External identity
    └── Relationship domain only — no institutional write
```

---

## Factory interface

| Factory provides | Identity Layer consumes |
| ---------------- | ----------------------- |
| `instance_id` | Root institutional scope |
| `passport_id` | Sovereign reference |
| Empty profile template | Executive Discovery fills |
| Department template | Department identities instantiated |

Identity Layer **never** modifies birth certificate or Factory install record.

---

*Volume 4 · Identity Layer · MEM-005*
