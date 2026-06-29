# LocalBrain Migration & Drive Doctrine v1.0

> **Drive layout + knowledge migration north star.**  
> OS: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Queue: [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md) · Safety: [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md)

---

## New North Star Language

```txt
LocalBrain becomes the system that maps, reorganizes, and preserves Steve's digital life —
then becomes the primary interface for managing it going forward.
```

---

## 1. Drive Doctrine

Steve's machine uses a **strict two-drive separation**. LocalBrain must enforce, explain, and respect it in every scan, suggestion, and migration plan.

```txt
C:/ = operating programs only
H:/ = work projects, data, archives, documents, repos, media, storage
```

### C: drive — Operating system & programs

```txt
Windows · Program Files · installed apps · system caches
LocalBrain may: observe disk pressure on C: (LB-OS-007), advise cleanup of safe caches (future)
LocalBrain must NOT: index C: as project workspace · move project files to C:
  treat C: roots as project folders · auto-delete on C:
```

### H: drive — Steve's work world

```txt
All project folders · repos · documents · archives · media · LocalBrain itself
Default allowed-folder roots live on H:
Migration, filing, duplicate cleanup, and ChatGPT import target H:
```

### UI behavior

```txt
Explorer defaults to H: project roots
Selecting C: path triggers warning: "C: is for programs — use H: for projects"
Drive badge on every path: C: vs H:
Storage dashboard shows C: vs H: breakdown
```

**Slice:** LB-OS-016 (drive architecture) · enforced from LB-OS-003 onward for path validation

---

## 2. Final Migration Mission

The **last major build phase** (LB-OS-016–024) transfers as much useful knowledge as possible from Steve's ChatGPT/project systems into LocalBrain.

```txt
Transfer as much useful knowledge as possible from Steve's ChatGPT/project systems into LocalBrain.
```

### What gets imported / mapped

```txt
ChatGPT exports
project folders
Cursor reports
build docs
strategy docs
campaign files
writing voices
codebase histories
requirements
old plans
handoff notes
```

### What "transfer" means

```txt
NOT blind copy-everything
INVENTORY → MAP → RECOMMEND → APPROVE → MOVE/INDEX/IMPORT → VERIFY
```

LocalBrain builds a **living map** of Steve's digital life on H:, then becomes the primary interface.

---

## 3. Migration Safety Rule (Binding)

LocalBrain must **never** auto-delete or auto-move duplicates during migration.

**Required sequence before any cleanup or reorganization:**

```txt
1. inventory
2. map
3. duplicates report
4. latest-version recommendation
5. archive plan
6. move plan
7. delete-to-quarantine plan
8. approval checklist
```

Then Steve approves. Then — and only then — gated execution (LB-OS-010).

See [Safety Model § Migration & Reorganization](./LOCALBRAIN_SAFETY_MODEL.md#15-migration--reorganization-safety).

---

## 4. Migration Arc (LB-OS-018–026)

| Slice | Name |
|-------|------|
| LB-OS-018 | Drive architecture & migration planner |
| LB-OS-019 | Full filesystem mapping audit |
| LB-OS-020 | Executive consolidation briefing (first Executive Intelligence) |
| LB-OS-020.5 | Phase 1 integration pass |
| LB-OS-021 | Executive workspace architecture builder |
| LB-OS-022 | Digital land survey |
| LB-OS-023 | Migration simulation |
| LB-OS-024 | Migration proposal builder |
| LB-OS-025 | Cutover planner |
| LB-OS-026 | LocalBrain Personal OS launch |

**Depends on:** LB-OS-016 (V1) and LB-OS-017 (AI provider spine) complete.

**Consolidation spec:** [Consolidation Planner](./LOCALBRAIN_CONSOLIDATION_PLANNER.md)

---

## 5. Phase Goals (Migration Arc)

### LB-OS-018 — Drive Architecture & Migration Planner

```txt
Codify C:/H: rules in permission engine
Migration planner UI: phases, checklist, dry-run status
```

### LB-OS-019 — Full Filesystem Mapping Audit

```txt
Read-only inventory of approved H: trees
File counts, types, ages, project guesses
Export: migration_inventory.json
No moves
```

### LB-OS-020 — Executive Consolidation Briefing (Executive Intelligence)

**Phase shift:** first slice where LocalBrain **reasons** about the environment — not only inventories it.

```txt
Executive Consolidation Briefing — opportunity · priorities · risk · Consolidation Score
Pipeline: Registry → Evidence → Consolidation → Simulation → EIC Briefing → Proposals
Introduces: Executive Intelligence Cards (ENG-EIC-001) · universal 7-score standard · [Action Pipeline](./LOCALBRAIN_ACTION_PIPELINE.md)
Decision-friction narratives · evidence scores · simulate dry-run
Recommendation → Simulation → Proposal → Approval only — zero auto-execution
```

Spec: [Consolidation Planner](./LOCALBRAIN_CONSOLIDATION_PLANNER.md)

### LB-OS-020.5 — Phase 1 Integration Pass

```txt
Executive Question Registry — one authoritative answer per question
Measurable cohesion: cross-links ≥90 · orphans 0 · duplicate summaries 0 · EIC everywhere · shell 100%
Do not rush 021 until metric gate passes
```

Spec: [Phase 1 Integration Pass](./LOCALBRAIN_PHASE1_INTEGRATION_PASS.md) · [Executive Question Registry](./LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md)

### LB-OS-021 — Executive Workspace Architecture Builder

**Logical World + Projection Layer.** Not a folder builder.

```txt
Three Worlds: Executive · Logical · Physical — Projection between Logical and Physical
Workspace DNA · Organization Tree · Blueprints (projection translation preview)
Physical World survey seed · StorageProvider types stub only
Spec: LOCALBRAIN_EXECUTIVE_WORKSPACE_ARCHITECTURE.md · LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md
```

### LB-OS-022 — Digital Land Survey

```txt
Physical World survey (H · C · future providers) + logical projection bindings
Orphans · boundaries · naming · empty namespace · expansion capacity
Read-only · precedes any move
```

### LB-OS-023 — Migration Simulation

```txt
Dry-run batches from blueprints · impact · rollback preview · zero execution
```

### LB-OS-024 — Migration Proposal Builder

```txt
proposed_actions from approved simulations · LB-OS-010 approval gate
Traceable: workspace → blueprint → simulation
```

### LB-OS-025 — Cutover Planner

```txt
Sign-off checklist · domain replacements (ChatGPT/Cursor/Explorer) · rollback plan
```

### LB-OS-026 — Personal OS Launch

```txt
LocalBrain primary · execute approved proposals only · workspace-first acceptance
```

**Deferred (Phase 2 import arc):** ChatGPT knowledge import · project memory transfer — not blocking Personal OS launch.

---

## 6. Relationship to V1 (LB-OS-002–016)

```txt
V1 (002–016): Build the OS shell — browse, chat, approve, advise
Migration (018–026): Fill it with Steve's life and cut over

Do not start migration arc until V1 ship gate (016) passes.
Do not skip dry-run reports in any migration slice.
```

---

## 7. Burt Instructions

```txt
Before LB-OS-002 code: this doctrine + queue 016–024 must exist ✅
LB-OS-002 does NOT implement migration — only OS shell
C:/H: warnings may appear in UI from OS-002 but full drive doctrine lands in OS-016
All migration slices produce reports before actions
```

---

## Document Hierarchy

```txt
LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md     — identity
LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md — drive + migration (this file)
LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md         — LB-OS-001–024
LOCALBRAIN_SAFETY_MODEL.md                 — dry-run + approval rules
```

---

*Migration & drive doctrine version 1.0 · 2026-06-28*
