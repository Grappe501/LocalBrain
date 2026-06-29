# LocalBrain Relationship Intelligence Engine v1.0

> **Relationships Domain** — not a contact manager.  
> Matrix: [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) · Data: [Data Platform](./LOCALBRAIN_DATA_PLATFORM.md)

---

## Mission

Every contact is a **relationship object** — the Chief of Staff remembers people, not rows.

---

## Contact object model

```txt
RelationshipObject
├── person (name, roles)
├── organizations
├── projects (RedDirt, ACU, …)
├── meetings · emails · texts (where connected)
├── notes · tags · introductions
├── follow_up_history
├── photographs · documents
├── donations (→ Finance domain)
├── events attended
└── AI summaries · last_touch · relationship_strength
```

---

## Chief of Staff signals

```txt
"You haven't talked to Chris in three weeks."
"Kelly has met this donor twice."
"Intro promised to Sarah — still open."
"This contact appears in voter file and campaign finance — link?"
```

---

## Engines

| Engine | ID | Job |
|--------|-----|-----|
| Relationship graph | ENG-RL-001 | People ↔ orgs ↔ projects |
| Touch tracker | ENG-RL-002 | Last contact, cadence rules |
| Introduction ledger | ENG-RL-003 | Who introduced whom |
| NL relationship query | ENG-RL-004 | Cross-source contact queries |

Chief: `relationship_chief`

---

## Example NL queries

```txt
"Find donors in Faulkner County who attended a fundraiser but haven't given this cycle."
"Who introduced me to everyone on the county committee?"
```

---

## Slice

LB-OS-100 · depends 098

---

*Relationship intelligence v1.0 · 2026-06-28*
