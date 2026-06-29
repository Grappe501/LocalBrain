# Assumption Ledger

> **Status:** Constitutional — peer to [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md)  
> **Parent:** [Constitution](./LOCALBRAIN_CONSTITUTION.md) Article XII · [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md)

---

## Principle

The **Decision Ledger** records **binding choices**.  
The **Assumption Ledger** records **premises behind design** — even when choices are reversible.

```txt
Decision:   "We chose LivingWorkspace over Project Registry."
Assumption: "Single-user first is sufficient until Phase 4."
```

CoS and Engineering check both before recommending architectural reversal.

---

## Assumption object (binding shape)

| Field | Purpose |
| ----- | ------- |
| `assumption_id` | Stable slug — `ASM-PLAT-001-single-user` |
| `assumption` | Short statement |
| `why` | Rationale when adopted |
| `status` | active · under_review · validated · invalidated · retired |
| `evidence` | successful · mixed · failing · unknown |
| `review_trigger` | Phase gate · slice · event — "Phase 4", "GPU migration", "Multi-user" |
| `related_decision_ids` | Optional Decision Ledger links |
| `related_assumption_ids` | Dependencies |
| `recorded_at` | ISO date |
| `recorded_by` | Default `steve` |
| `tags` | platform · infra · product · safety · … |
| `doc_links` | Implementation guides |

**Not a foundational object** — ledger record type alongside Decision. May share storage patterns when implemented.

---

## Example records (seed)

### ASM-PLAT-001 — Single-user first

```txt
Assumption:  Single-user first
Why:         Speed of development; one real executive to optimize for
Status:      Active
Evidence:    Successful (V1)
Review:      Phase 4 · Executive Organization OS
Tags:        platform · commercialization
```

### ASM-PLAT-002 — Windows desktop primary client

```txt
Assumption:  Windows desktop is primary client
Why:         Steve's daily environment; Electron/shell targets Win32
Status:      Active
Evidence:    Successful
Review:      GPU migration · optional web client
Tags:        platform · client
```

### ASM-DATA-001 — SQLite sufficient for V1

```txt
Assumption:  SQLite is sufficient for V1 personal OS
Why:         Local single-user; no concurrent writers at scale
Status:      Active
Evidence:    Successful
Review:      Multi-user · server brain · LB-OS-107+
Tags:        data · infra
```

### ASM-ARCH-001 — Four Systems feature-complete through Phase 4

```txt
Assumption:  Four Platform Systems are sufficient through Phase 4
Why:         Mature architecture; expansion via modules not pillars
Status:      Active
Evidence:    Successful (architecture lock 2026-06)
Review:      Only via Constitution amendment
Related:     LOCALBRAIN_FOUR_SYSTEMS.md
```

### ASM-AI-001 — Provider abstraction before vendor spread

```txt
Assumption:  All LLM access via LB-OS-017 provider spine
Why:         No OpenAI/Claude/Ollama in business logic
Status:      Active
Evidence:    Successful
Review:      New provider classes only via Evolution
Tags:        ai · safety
```

---

## Decision vs Assumption

| Ledger | Captures | Example |
| ------ | -------- | ------- |
| **Decision** | What we **chose** (binding) | "Digital Asset Registry replaces Storage Intelligence" |
| **Assumption** | What we **assumed** (premise) | "SQLite is enough until multi-user" |

Invalidating an assumption may trigger a **new Decision** — not silent drift.

---

## Surfaces (planned)

```txt
Engineering Studio     — assumption review before major refactors
Program Office         — link assumptions to slice risk
Decision Ledger UI     — sibling tab (LB-OS-035+)
CoS                    — "This recommendation assumes ASM-… still holds"
```

---

## Amendment & review

1. New platform assumption → record in Assumption Ledger + link in Burt packet  
2. Review trigger fires → `status: under_review` before large slice  
3. Invalidated → update evidence · optionally supersede with Decision  

---

## Related docs

| Doc | Role |
| --- | ---- |
| [Decision Ledger](./LOCALBRAIN_DECISION_LEDGER.md) | Binding choices |
| [Five Gates Rule](./LOCALBRAIN_FIVE_GATES_RULE.md) | Admission constraints |
| [Platform Separation](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md) | Platform vs Brain assumptions |

---

*Assumption Ledger · Constitution Article XII · 2026-06-29*
