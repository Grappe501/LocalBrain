# LocalBrain Kernel (`backend/src/core/`)

> **MODULARITY GATE — LB-OS-106**  
> Layer 1 LocalBrain Kernel only. Hard LOC budget: **~20k–40k** lines across this tree.

## What belongs here

```txt
Module loader and kernel bootstrap hooks
Identity / settings kernel hooks
Permission engine integration (not domain rules)
Command routing stubs (intent only — no studio logic)
Audit logging hooks
```

## What does NOT belong here

```txt
Department or studio domain logic
Campaign, novel, CFO, or engineering-specific code
Hard-coded studio routes or nav entries
Duplicate data indexes owned by modules
```

Domain code lives in `backend/src/modules/<module-id>/` and registers via **manifest**.

Shared services live in `backend/src/engines/` (migration in progress — workspace registry colocated until moved).

## Rule

If a Burt slice adds **>500 LOC** to `core/`, the packet must justify why it cannot be a module or engine.

See [Modular Architecture](../../docs/LOCALBRAIN_MODULAR_ARCHITECTURE.md).
