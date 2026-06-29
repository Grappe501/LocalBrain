# Executive Intent

> **Phase:** 2 — Teach the Brain (first intelligence feature after Personal OS cutover)  
> **Engine:** ENG-EI-001 (planned) · **Companion:** Attention Budget (ENG-AB-001)  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) · [Three-Phase Roadmap](./LOCALBRAIN_THREE_PHASE_ROADMAP.md) · [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md) · [Executive Leverage Score](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md)

---

## Principle

Phase 1 gives LocalBrain a complete understanding of Steve's digital world.  
Phase 2 teaches it **what matters most today**.

```txt
Today:   What workspace is active?
Phase 2: What is my Executive Intent?
```

**Executive Briefing** answers: *What is happening?*  
**Executive Intent** answers: *What matters most today?*

**Do not build in Phase 1.** Reserve for first Phase 2 arc after LB-OS-026.

---

## Definition

**Executive Intent** is Steve's declared focus for the session/day — one primary outcome that aligns CoS, questions, cards, departments, workspaces, and assets.

Examples:

```txt
Finish ContactListSOS MVP
Prepare Secretary of State debate
Write Novel Chapter 12
Organize H: drive
Prepare Benton County immersion
Launch ACU
```

Everything else **aligns behind** intent — prioritized, not hidden.

---

## Alignment stack

```txt
Executive Intent
        ↓
Chief of Staff
        ↓
Relevant Executive Questions (EQ-* filtered by intent)
        ↓
Executive Intelligence Cards (ranked · deemphasized if unrelated)
        ↓
Departments
        ↓
Living Workspaces
        ↓
Digital Assets
```

If intent is **Finish ContactListSOS MVP**, the system prioritizes:

- Engineering · Writing (docs) · Data & Intelligence · Program Office
- Consolidation opportunities affecting that project
- Deemphasizes unrelated items (still accessible, not chatty)

---

## Attention Budget (ENG-AB-001)

Prevents an capable system from becoming **too chatty**. CoS gets a daily **attention budget**:

```txt
Executive Intent              1   (required)
Priority Recommendations      5
Warnings                      3
Watch Items                   5
Everything Else               Quiet
```

CoS must **prioritize ruthlessly** — surface only what fits the budget unless Steve drills down.

---

## Relationship to Executive Leverage Score

ELS measures outcomes **against intent**, not activity:

```txt
Intent Completed?           80%
        ↓
Leverage                    7.8 / 10
        ↓
Time Saved                  4.2 hours
        ↓
Recommendations Accepted    12
        ↓
Decision Friction Removed   18
```

See [Executive Leverage Score](./LOCALBRAIN_EXECUTIVE_LEVERAGE_SCORE.md).

---

## Phase 2 build order (binding direction)

```txt
Phase 2 — Teach the Brain
  ↓
Executive Intent Engine       (ENG-EI-001)
  ↓
Attention Budget              (ENG-AB-001)
  ↓
Executive Question Router     (EQ filtered by intent)
  ↓
Adaptive Prioritization       (EIC rank · deemphasis)
  ↓
Executive Leverage optimization
```

**Prerequisite:** Phase 1 complete (026) · Question Registry (020.5) · EIC + Simulation pipeline (020).

---

## Contract (planned)

```txt
ExecutiveIntent {
  intent_id
  label                    — "Finish ContactListSOS MVP"
  workspace_ids[]          — linked LivingWorkspaces
  active_from / active_until
  declared_by              — steve | cos_suggested
  completion_percent       — 0–100 (Phase 2)
}
```

Not a foundational object — composes LivingWorkspace + CoS session state.

---

## Session start (Phase 2 UX)

```txt
Good morning, Steve.

Executive Intent
  Finish ContactListSOS MVP        [ Change ]

Today's Executive Questions (intent-filtered)
  …

Attention remaining: 4 priority slots · 2 warnings
```

---

*Executive Intent · ENG-EI-001 · Phase 2 cornerstone · 2026-06-29*
