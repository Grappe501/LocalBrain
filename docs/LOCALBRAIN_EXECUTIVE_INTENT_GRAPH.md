# Executive Intent Graph — ENG-INT-001

> **Slice:** LB-OS-026.65 · **Gate before:** LB-OS-026.7  
> **Parent:** [Capability Registry](./LOCALBRAIN_CAPABILITY_REGISTRY.md) · [Capability Atlas](./LOCALBRAIN_EXECUTIVE_CAPABILITY_ATLAS.md)

---

## Purpose

An **Executive Intent** is a goal. An **Executive Question** is an expression of that goal. This distinction lets the AI infer intent when wording changes.

```txt
Executive Intent
        ↓
Executive Question
        ↓
Capability
        ↓
Workflow
        ↓
Route
```

---

## Seven intents (frozen)

| Intent | ID | Example questions |
| ------ | -- | ----------------- |
| Organize | INT-ORGANIZE | How should I organize ContactList? What is fragmented? |
| Decide | INT-DECIDE | Should I approve this migration? |
| Learn | INT-LEARN | How does the migration pipeline work? |
| Review | INT-REVIEW | What changed since yesterday? |
| Build | INT-BUILD | What should Burt work on next? |
| Monitor | INT-MONITOR | Is anything unhealthy? |
| Plan | INT-PLAN | What's the next step? |

**Code:** `shared/src/executiveIntent.ts`

---

## Capability operations (ENG-COP-001)

| Layer | Function |
| ----- | -------- |
| **Operational state** | available · healthy · awaiting_prerequisite · degraded · blocked · failed · completed · stub |
| **Executive readiness** | ready % · blocking issues · dependencies satisfied · confidence |
| **Dependency health** | `buildDependencyHealthGraph()` — upstream failure propagates downstream |
| **Recommendations** | `buildRecommendationGraph()` — state → available → recommended → highest value |

**API:** `GET /api/integration/capability-states`

---

## Executive Capability Atlas (ENG-ATL-001)

Auto-generated encyclopedia of every capability:

* ID · Intents · Questions · Outcome · Inputs · Outputs · Dependencies · Dependents · Readiness · State · Entry vectors · Routes · Workflows · Identity four-tuple

**Generate:**

```txt
npm run atlas:generate -w @localbrain/backend
GET /api/integration/atlas
POST /api/integration/atlas/generate
```

**Output:** [`LOCALBRAIN_EXECUTIVE_CAPABILITY_ATLAS.md`](./LOCALBRAIN_EXECUTIVE_CAPABILITY_ATLAS.md) (auto-generated — do not edit by hand)

---

## Identity four-tuple (every capability)

```txt
Why do I exist?
What outcome do I produce?
What do I depend on?
Who depends on me?
```

---

## Sequence before 026.7

```txt
026.6  Capability Graph ✅
026.65 Intent Graph + Atlas + Operations ← this slice
       Graph Integrity PASS
026.7  Executive Dashboard (projection of atlas — not independent UI)
```

---

*Executive Intent Graph · LB-OS-026.65*
