# Five Gates Rule

> **Status:** Binding architectural constraint — applies to **every** new capability  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) Article XI · [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md)

---

## Rule

Before **any** new capability enters LocalBrain — slice, feature, department, engine, or UI surface — it must pass **five gates**. If it fails any gate, **do not build it** (or amend the Constitution first).

This is the transition from ambitious design to **long-lived platform**: constraints, not new pillars.

---

## The five gates

```txt
1. SYSTEM
   Which of the Four Systems owns it?
   (Executive OS · Memory OS · Intelligence · Evolution)
   ────────────────────────────────────────────────────
2. OBJECT
   Which foundational object does it extend?
   Never invent a new one unless the Constitution changes.
   ────────────────────────────────────────────────────
3. MODULE
   Which module owns it?
   Never the kernel.
   ────────────────────────────────────────────────────
4. EXECUTIVE QUESTION
   Which Executive Question does it answer?
   If none → don't build it.
   ────────────────────────────────────────────────────
5. EXECUTIVE LEVERAGE
   Does this increase Steve's leverage?
   If not → it probably shouldn't exist.
```

---

## Gate details

### Gate 1 — System

Exactly **one** primary owner among:

| System | Question |
| ------ | -------- |
| Executive OS | Where am I working? |
| Executive Memory OS | What do we know? |
| Executive Intelligence | What should I do? |
| Executive Evolution | How do we improve? |

See [Four Platform Systems](./LOCALBRAIN_FOUR_SYSTEMS.md). Organization OS (System 5) is not a bypass — defer until Phase 4.

### Gate 2 — Object

Must extend one of the ten frozen objects — [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md):

```txt
LivingWorkspace · DigitalAsset · Decision · Memory · KnowledgeSource
Module · Engine · Action · Person · Organization
```

New object type = **Constitution Article II amendment** + Decision Ledger record.

### Gate 3 — Module

Implementation lives in a **registered module** (LB-OS-106). Kernel changes are limited to loader, safety, and shared spine — never business features.

### Gate 4 — Executive Question

Must map to an existing **EQ-*** in [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md), or add EQ via registry amendment (not a new gate bypass).

Mission-scoped question variants (Phase 2) filter through active mission — still grounded in EQ.

**If no executive question:** the capability is likely internal plumbing (Evolution metrics, index run) or **mis-scoped UX** that should link to an authoritative EQ route.

### Gate 5 — Executive Leverage

Must articulate how it increases [Executive Leverage](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md) — time saved, better decisions, friction removed, mission progress, or cognitive load reduced ([ECL](./LOCALBRAIN_EXECUTIVE_COGNITIVE_LOAD.md)).

Pure construction visibility (EPO internals) passes via Gate 4 as EQ-002 — not every line of code must move ELS, but every **user-facing capability** must justify leverage.

---

## Checklist (copy for Burt packets)

```txt
[ ] Gate 1 — System owner: _______________
[ ] Gate 2 — Foundational object: _______________
[ ] Gate 3 — Module: _______________ (not kernel)
[ ] Gate 4 — Executive Question: EQ-___ / _______________
[ ] Gate 5 — Leverage hypothesis: _______________
```

---

## Relationship to other constraints

| Constraint | Role |
| ---------- | ---- |
| Five Gates | **Admission** — may this exist? |
| Four Systems | **Placement** — where does it live? |
| Action Pipeline | **Execution** — how does it change the world? |
| Assumption Ledger | **Premises** — what assumptions does it rely on? |
| Architecture Debt | **Platform health** — does the codebase stay clean? |

---

## Phase 1 focus (binding)

**No new top-level concepts** until LB-OS-026 closes. Apply Five Gates to **021–026** slices only. Tighten integration · UX · H: filing · migration · Personal OS cutover · GPU prep **without** architecture churn.

---

*Five Gates Rule · Constitution Article XI · 2026-06-29*
