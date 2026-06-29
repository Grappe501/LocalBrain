# Product Naming Evolution

> **Planning only** — no rebrand in V1  
> **Status:** Architectural note — June 2026  
> Parent: [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md) · [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md)

---

## Observation

As the architecture matures, **LocalBrain** is becoming one component inside a larger product — not the whole public identity.

```text
Executive Operating System          ← product (what Steve / customers use)
├── Chief of Staff
├── Executive Office
│     ├── Executive Briefing
│     ├── Program Office          ← construction
│     └── System Evolution        ← intelligence
├── Departments (studios)
├── Knowledge Explorer
├── Digital Twin
└── LocalBrain                    ← cognitive engine
        reasoning + memory + orchestration
```

---

## Proposed separation

| Name | Role |
| ---- | ---- |
| **Executive Operating System (EOS)** | The product — shell, offices, departments, approvals, workspaces |
| **LocalBrain** | The engine — reasoning, memory domains, CoS orchestration, provider routing |

Customers may connect more readily with an **Executive OS** powered by **LocalBrain** than with a product named after the engine alone.

---

## What stays the same (for now)

- Repo path `localAgent`, package `@localbrain/shared`, workspace id `localbrain`
- Docs prefix `LOCALBRAIN_*.md` until a deliberate rename slice
- UI strings may still say "LocalBrain" in V1

---

## What to design for now

1. **Platform / Brain boundary** — already in [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md)
2. **Engine registry** — LocalBrain listed as engine `ENG-COG-001` (or similar), not as the whole stack
3. **Marketing flexibility** — EOS as product name, LocalBrain as "powered by" line
4. **Reuse** — LocalBrain engine could power non-EOS products later

---

## When to rename

Not before:

- Phase 1 complete (Personal OS launch)
- Phase 2 proves intelligence (System Evolution shows learning)
- Commercial packaging decision

Suggested slice: **LB-OS-0XX — Product identity & packaging** (Phase 3 or commercial prep).

---

## Binding rule (interim)

In architecture docs and new specs:

- Say **Executive Operating System** when describing the whole product Steve uses daily
- Say **LocalBrain** when describing reasoning, memory, orchestration, or the cognitive spine
- Program Office measures EOS **construction**; System Evolution measures LocalBrain **learning**
