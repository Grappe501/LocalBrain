# LocalBrain Operating System Doctrine v2.0

> **The north star.** Supersedes [Product Doctrine v1.0](./LOCALBRAIN_PRODUCT_DOCTRINE.md) for product identity and long-range direction.  
> V1 safety rules in Product Doctrine v1.0 and [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md) remain binding until explicitly revised.

---

## Product Category

**Old:**

```txt
Local AI chatbot with file tools
```

**New:**

```txt
AI Executive Operating System — second brain and operating company
```

LocalBrain is Steve's **personal executive operating system** — not a chatbot with file tools.

**Four modes (everything fits one):**

```txt
1. Remember for me     — memory, data, contacts, canon, books
2. Think with me       — Chief of Staff, research, planning, decisions
3. Do work with me     — engineering, creative, media, production
4. Run my business with me — CFO, compliance, campaigns, operations
```

**Planning apex:** [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) · [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md)

**Coherence rule (permanent):**

> LocalBrain never becomes a collection of disconnected features. Every new capability must strengthen an existing engine, executive domain, or enterprise capability cell.

**Pillar freeze:** Seventeen pillars map LB-OS-001–096. New work uses domains + matrix + slices — not Pillar 18+ without Steve approval.

**Modularity rule (permanent):**

```txt
MODULARITY GATE = LB-OS-106 (after 004, before 005).
No department/studio expansion before 106.
Large product · small core — departments ship as lazy-loaded modules.
Data indexed, not duplicated. AI context compressed, not resent.
```

Full spec: [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md)

---

## What LocalBrain Is

**LocalBrain is Steve's Personal Operating System.**

Not a chatbot.  
Not a file search tool.  
Not a Cursor helper.

```txt
LocalBrain becomes the main interface between Steve and his computer.
```

**North star (full arc):**

```txt
LocalBrain becomes the system that maps, reorganizes, and preserves Steve's digital life —
then becomes the primary interface for managing it going forward.

LocalBrain is the control layer that helps Steve keep his machine organized, fast, lean,
backed up, and purpose-built around C:/ as the program drive and H:/ as the work/data drive.
```

See [Migration & Drive Doctrine v1.0](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md).

---

## Product Mission

```txt
LocalBrain is Steve's full system administrator, creative partner, code engineer,
file explorer, writing dashboard, campaign command center, and local AI operating system.
```

---

## Core Identity

```txt
LocalBrain is not an app inside the computer.
LocalBrain becomes the executive operating shell — the interface Steve lives in daily.
```

The AI reasons. The OS shell executes — through permission gates, previews, logs, and undo.

**Important:** LocalBrain can replace Windows as Steve's **main working interface**, but it does **not** replace the host operating system. Hardware, drivers, networking, GPU, file permissions, USB, and display still require an OS underneath.

---

## Host Platform (Layer 0)

```txt
Layer 0 — Host Platform
  Windows · Linux · macOS · future server · cloud node

Layer 1 — LocalBrain Kernel (permissions, registry, engines, memory, agents)

Layers 2–5 — Executive operating shell (everything above the kernel is yours)
```

LocalBrain sits **above** the host platform — portable for the next decade, not Windows-specific.

We do **not** bypass the host platform at first. We **sit on top of it** and make Steve rarely need to touch it directly.

### What LocalBrain becomes the default interface for

```txt
Files and folders · search · projects/workspaces · writing · coding
Email/calendar · system health · storage cleanup · AI command center
Photo/podcast workflows · database work
```

### What LocalBrain cannot safely do early

```txt
Replace the host platform kernel
Bypass host platform drivers
Directly control GPU outside OS/runtime
Manage hardware without OS permissions
Ignore the host security model (ACLs, UAC, sandboxing, etc.)
```

LocalBrain **respects** the permission engine and host platform boundaries — it orchestrates work; it does not become a hypervisor.

Full layer stack + frozen objects: [Foundational Object Model](./LOCALBRAIN_FOUNDATIONAL_OBJECT_MODEL.md)

### Future server topology (when GPU server arrives)

```txt
Windows Server / Windows Pro — easiest continuity with current desktop
Linux                    — best for AI/GPU/server workloads
Dual machine             — Windows desktop + Linux GPU server
```

**Binding recommendation:**

```txt
Keep the daily machine on Windows.
Run LocalBrain UI locally on that machine.
Move heavy AI/GPU/backend services to the new server later — likely Linux.
```

Familiar Windows desktop + LocalBrain as control shell + GPU server as power engine. See [GPU Server Migration Plan](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md).

---

## Prime Directive (Unchanged)

```txt
Think freely.
Preview clearly.
Ask approval.
Act safely.
Log everything.
Undo when possible.
```

Steve is always the final authority.

---

## Drive Doctrine

```txt
C:/ = operating programs only
H:/ = work projects, data, archives, documents, repos, media, storage
```

LocalBrain enforces and explains this separation in explorer, permissions, storage, and migration. Full spec: [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md).

---

## Final Migration Mission

The last major build phase (LB-OS-016–024) transfers useful knowledge from ChatGPT/project systems into LocalBrain:

```txt
ChatGPT exports · project folders · Cursor reports · build docs · strategy docs
campaign files · writing voices · codebase histories · requirements · handoffs
```

**Never auto-delete or auto-move duplicates.** Inventory → map → report → plan → approve → act.

---

## What LocalBrain Eventually Replaces or Reduces

| Today | LocalBrain becomes |
|-------|-------------------|
| **ChatGPT** | Reasoning, writing, planning, research, narrative building |
| **Cursor** | Code writing, repo auditing, refactors, build scripts |
| **Windows Explorer** | Finding, organizing, moving, understanding files |
| **Notion/Docs** | Writing dashboards and project knowledge |
| **Social tools** | Drafting, scheduling, repurposing, managing content |

LocalBrain does not need to clone every feature on day one. It must **win the daily workflow** — the place Steve opens first.

---

## Seventeen Capability Pillars

| # | Pillar | Doc |
|---|--------|-----|
| 1 | AI Command Interface | [Capability Map](./LOCALBRAIN_CAPABILITY_MAP.md#1-ai-command-interface) |
| 2 | Next-Generation File Explorer | [Explorer Blueprint](./LOCALBRAIN_EXPLORER_SYSTEM_BLUEPRINT.md) |
| 3 | Code Engineering Studio | [Code Engineering Studio](./LOCALBRAIN_CODE_ENGINEERING_STUDIO.md) |
| 4 | Writing & Narrative Dashboard | [Writing Dashboard](./LOCALBRAIN_WRITING_DASHBOARD_BLUEPRINT.md) |
| 5 | Social Media Interface | [Social Interface](./LOCALBRAIN_SOCIAL_MEDIA_INTERFACE.md) |
| 6 | System Administrator Partner | [SysAdmin Model](./LOCALBRAIN_SYSTEM_ADMIN_PARTNER_MODEL.md) |
| 7 | Drive Separation (C:/H:) | [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md#1-drive-doctrine) |
| 8 | Knowledge Migration | [Migration & Drive Doctrine](./LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md#2-final-migration-mission) |
| 9 | OJT Coding Academy | [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md) |
| 10 | System Optimization & Performance | [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md) |
| 11 | Direct API Performance Engine | [Direct API Performance Engine](./LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md) |
| 12 | Token Economy, Memory Recall & Learning Pace | [Token Economy Engine](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md) |
| 13 | Provider-Neutral AI + GPU-Ready Intelligence | [Provider-Neutral AI Architecture](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) |
| 14 | Local Neural Network Lab | [Local Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md) |
| 15 | AI Evolution Engine | [AI Evolution Engine](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md) |
| 16 | AI Chief of Staff | [AI Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md) |
| 17 | Executive Office | [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) |

**Product:** AI Executive Operating System · **Org:** [Department Organization](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md)

Master map: [Capability Map v1.0](./LOCALBRAIN_CAPABILITY_MAP.md)

---

## Pillar 1 — AI Command Interface

Steve talks naturally:

```txt
Find the latest ACU report.
Write the next Cursor script.
Audit RedDirt.
Clean up this folder.
Draft a Facebook post.
Build a grant narrative.
Explain this codebase.
Move these files into a cleaner structure.
```

One shell. Many modes. Same safety model.

---

## Pillar 2 — Next-Generation File Explorer

Better than Windows Explorer for Steve's work:

```txt
Project-based view
Timeline view
Recent work view
AI summaries of folders
Duplicate detection
Smart tagging
Related files
"Why this matters" summaries
File lineage/history
Search by meaning, not filename
Drag/drop + AI organization
```

**Views beyond folders:**

```txt
Projects · Workstreams · Documents · Codebases · Reports · Drafts
Media · Social posts · Campaign assets · Build history
```

Blueprint: [Explorer System Blueprint](./LOCALBRAIN_EXPLORER_SYSTEM_BLUEPRINT.md)

---

## Pillar 3 — Code Engineering Studio

Cursor replacement path:

```txt
Read entire repo safely
Map architecture
Find bugs
Write code
Create patch plans
Generate files
Preview diffs
Run validation later
Explain errors
Write repair passes
Generate commit summaries
Build complex systems through slices
Maintain requirement registry
Track progress bars
```

**Full build loop:**

```txt
Plan → Code → Validate → Repair → Document → Commit guidance → Next slice
```

Roadmap: [Cursor Replacement Roadmap](./LOCALBRAIN_CURSOR_REPLACEMENT_ROADMAP.md)

---

## Pillar 4 — Writing & Narrative Dashboard

Creative cockpit — modes:

```txt
Blog · Speech · Grant · Campaign message · Faith/Substack
Historical novel · Debate prep · Social · Email/text · Long-form strategy
```

**Voice library:**

```txt
Steve strategic · Kelly campaign · Jeb Crawse · Grant/professional
TV/debate · Investigative blog · Historical novel
```

Blueprint: [Writing Dashboard Blueprint](./LOCALBRAIN_WRITING_DASHBOARD_BLUEPRINT.md)

---

## Pillar 5 — Social Media Interface

Eventually:

```txt
Draft posts · Repurpose long → short · Content calendars · Captions
Threads · Theme tracking · Reusable messaging · Graphics prompts
Schedule later with approval
```

Blueprint: [Social Media Interface](./LOCALBRAIN_SOCIAL_MEDIA_INTERFACE.md)

---

## Pillar 6 — System Administrator Partner

Help manage:

```txt
Folders · Files · Projects · Repos · Local dev environments
Env setup checklists · Backups · Disk organization · Duplicate cleanup
Archive systems · Project health · Build status · Deployment readiness
```

Always with safety gates (see below).

Model: [System Admin Partner Model](./LOCALBRAIN_SYSTEM_ADMIN_PARTNER_MODEL.md)

---

## Pillar 9 — OJT Coding Academy

Teach Steve coding **while building real systems** — embedded in the OS, not a separate course site.

```txt
Teach Me While We Build: ON/OFF
Broad concepts (React, API, SQLite…) + narrow lessons (this file, this error, this commit)
Challenges from real LocalBrain code · progress dashboard · portfolio evidence
```

Inspired by freeCodeCamp (challenges, projects, certifications) and Codecademy (guided paths, gamified progress).

Doc: [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md) · Slices: LB-OS-025–030

---

## Pillar 10 — System Optimization & Performance Command Center

Keep Steve's machine **organized, fast, lean, backed up** — C:/ programs, H:/ work.

**Four layers:**

```txt
1. Folder/file cleanup
2. Drive architecture (C:/ vs H:/)
3. Storage optimization (duplicates, stale, bloat)
4. Performance (CPU, RAM, disk, startup advisory)
```

**Never clean first** — inventory → map → reports → plan → approve → act.

Dashboard from LB-OS-002: **Storage · Performance · Drive · Cleanup · API Performance · Token Economy · AI Provider · Neural Lab**

Docs: [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md) · Slices: LB-OS-031–038

---

## Pillar 11 — Direct API Performance Engine

Remove ChatGPT/Cursor UI overhead — **own the API path**.

```txt
Direct API · streaming · local context cache · prompt-prefix optimization
Token budget · request queue · rate-limit handler · model router
Index locally · send excerpts · tool-fetch exact files — never re-upload the project
```

Dashboard from LB-OS-002: **API Performance** card (key status, Direct API mode, streaming/cache/monitor planned).

Docs: [Direct API Performance Engine](./LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md) · Slices: LB-OS-039–046

```txt
Pillar 10 = machine fast (CPU, RAM, disk)
Pillar 11 = API path fast (tokens, queue, cache)
Pillar 12 = spend smart + recall smart + learn at the right pace
```

---

## Pillar 12 — Token Economy, Memory Recall & Learning Pace

**Visible economics + infinite recall without infinite cost.**

```txt
Token monitor · dollar estimates · project/client chargeback
Memory compression · chunked recall · project memory graph
Style learning · OJT pace · teach more/less
```

Pre-flight before every API call: local memory? smaller excerpt? cheaper model? cached context? worth deep call?

Dashboard LB-OS-002: **Token Economy** card. Full dashboard LB-OS-055: Token Usage · Estimated Spend · Memory Efficiency · Learning Pace.

Docs: [Token Economy Engine](./LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md) · [Memory Recall](./LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md) · [Learning Pace](./LOCALBRAIN_LEARNING_PACE_ENGINE.md) · [Chargeback Model](./LOCALBRAIN_PROJECT_CHARGEBACK_MODEL.md) · Slices: LB-OS-047–055

---

## Pillar 13 — Provider-Neutral AI + GPU-Ready Intelligence Layer

**Not locked to OpenAI forever** — router + adapters + GPU-ready local runtime.

```txt
Rule: business logic → AI Provider Router → adapter (OpenAI · Claude · Grok · local · future)
Route: fast / deep / code / writing / local GPU
Learn: which provider+model wins per job from outcomes
GPU cutover: portable local_data + indexes + memory + usage logs
```

Dashboard LB-OS-002: **AI Provider** card. Comparison dashboard LB-OS-064.

Docs: [Provider-Neutral AI](./LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md) · [Model Router](./LOCALBRAIN_MODEL_ROUTER_STRATEGY.md) · [GPU Migration](./LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md) · [Local Fallback](./LOCALBRAIN_LOCAL_MODEL_FALLBACK_PLAN.md) · Slices: LB-OS-056–065

```txt
Pillar 13 = switch providers · add GPU box · get smarter over time
```

---

## Pillar 14 — Local Neural Network Lab

**AI lab, not just AI UI** — Levels 1–4 on GPU server; Level 5 (foundation from scratch) out of scope.

```txt
Level 1: Run local models · Level 2: Fine-tune (LoRA/QLoRA)
Level 3: Small NNs · Level 4: Custom pipelines · Level 5: Deferred
```

Target: writing model · Burt scorer · classifiers · rankers · coding tutor · campaign classifier.

Dashboard LB-OS-002: **Neural Lab** card. Full lab LB-OS-075.

Docs: [Neural Network Lab](./LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md) · [Fine-Tuning](./LOCALBRAIN_FINE_TUNING_STRATEGY.md) · [Training Data](./LOCALBRAIN_TRAINING_DATA_PIPELINE.md) · [GPU Runtime](./LOCALBRAIN_GPU_MODEL_RUNTIME_PLAN.md) · Slices: LB-OS-066–075

```txt
Pillar 13 = run models · Pillar 14 = train models (Track B)
Pillar 15 = measure preferences · Pillar 16 = Chief of Staff (lead AI)
Pillar 17 = Executive Office — apex above all studios
```

---

## Pillar 15 — AI Evolution Engine

**Continuously improve** — scorecard per capability, not hard-coded vendors.

```txt
Self-measure every interaction · learn best provider per capability
Capability-first routing (Reasoning, Coding, Writing, …)
Preference table updates from outcomes — models and pricing change
```

Docs: [AI Evolution](./LOCALBRAIN_AI_EVOLUTION_ENGINE.md) · [Capability Architecture](./LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md) · [Self-Measurement](./LOCALBRAIN_SELF_MEASUREMENT_MODEL.md) · Slices: LB-OS-076–082

---

## Pillar 16 — AI Chief of Staff

**The lead AI — never call it an "assistant."** Reports into Pillar 17 Executive Office.

Proactive signals, detectors, briefing components — see [Chief of Staff](./LOCALBRAIN_AI_CHIEF_OF_STAFF.md). Slices: LB-OS-083–086

---

## Pillar 17 — Executive Office

**Sits above every studio.** Owns Chief of Staff, briefings, calendar, email, prioritization, effectiveness.

```txt
Steve → Chief of Staff → Department Chiefs → specialists → CoS → Steve
Monday boot: Executive Briefing (not dashboard-first)
Success: meaningful work accomplished — see Effectiveness Metrics
```

Docs: [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md) · [Briefing](./LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md) · [Departments](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md) · [Effectiveness](./LOCALBRAIN_EFFECTIVENESS_METRICS.md) · Slices: LB-OS-087–096

---

## Safety Is Non-Negotiable

The OS shell is powerful; the permission engine is permanent.

```txt
No unrestricted filesystem access
No secret reads
No shell execution without explicit future gate
No permanent delete in V1 — quarantine only
No silent writes — preview + approval + backup + log
No whole-drive scan — approved folders only
OpenAI key backend-only
```

[Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md) applies to every pillar.

---

## Replacement Roadmaps

| Target | Roadmap |
|--------|---------|
| ChatGPT daily use | [ChatGPT Replacement Roadmap](./LOCALBRAIN_CHATGPT_REPLACEMENT_ROADMAP.md) |
| Cursor daily use | [Cursor Replacement Roadmap](./LOCALBRAIN_CURSOR_REPLACEMENT_ROADMAP.md) |

V1 scaffold (slice 001) is foundation only — not the finished OS shell.

---

## Build Direction (Current)

```txt
✅ System Optimization pillar docs (four blueprints)
✅ queue LB-OS-001–038 documented
✅ LB-OS-001 scaffold complete
⏭ Next: LB-OS-002 — OS Shell Dashboard (Burt packet)
⛔ Do not start LB-OS-016 until LB-OS-015 ship gate
```

**Queue:** [LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md)

**Foundation:** Project folders = filesystem folders. Explorer, storage, projects, and AI share one permission-gated foundation.

---

## Success Definition

Steve opens LocalBrain first.

```txt
[ ] One place to ask, find, write, build, organize, and govern local work
[ ] C:/H: separation enforced — H: is Steve's work world
[ ] Explorer beats Explorer.exe for Steve's projects on H:
[ ] Chat + agents replace daily ChatGPT for local work
[ ] Code studio replaces most Cursor sessions for owned repos
[ ] Writing dashboard holds active drafts and voices
[ ] Every risky action: preview, approve, log, undo path
[ ] Migration arc (016–024): digital life mapped and preserved
[ ] LB-OS-024: LocalBrain is primary interface for managing digital life
```

---

## Document Hierarchy

```txt
LOCALBRAIN_PRODUCT_STRATEGY_PHASE.md        ← PSP gate (blocks 002)
LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md    ← five layers, Living Workspaces
LOCALBRAIN_ENGINE_REGISTRY.md
LOCALBRAIN_STUDIO_BLUEPRINT.md
LOCALBRAIN_COMMAND_LAYER.md
LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md   ← YOU ARE HERE (v2.0 north star)
LOCALBRAIN_MIGRATION_AND_DRIVE_DOCTRINE.md  ← C:/H: + migration arc
LOCALBRAIN_OJT_CODING_ACADEMY.md            ← teach while building
LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md  ← pillar 10
LOCALBRAIN_DRIVE_ARCHITECTURE_PLAN.md
LOCALBRAIN_STORAGE_CLEANUP_BLUEPRINT.md
LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md  ← pillar 11
LOCALBRAIN_TOKEN_ECONOMY_ENGINE.md           ← pillar 12
LOCALBRAIN_MEMORY_RECALL_ARCHITECTURE.md
LOCALBRAIN_LEARNING_PACE_ENGINE.md
LOCALBRAIN_PROJECT_CHARGEBACK_MODEL.md
LOCALBRAIN_PROVIDER_NEUTRAL_AI_ARCHITECTURE.md  ← pillar 13
LOCALBRAIN_MODEL_ROUTER_STRATEGY.md
LOCALBRAIN_GPU_SERVER_MIGRATION_PLAN.md
LOCALBRAIN_LOCAL_MODEL_FALLBACK_PLAN.md
LOCALBRAIN_LOCAL_NEURAL_NETWORK_LAB.md       ← pillar 14
LOCALBRAIN_FINE_TUNING_STRATEGY.md
LOCALBRAIN_TRAINING_DATA_PIPELINE.md
LOCALBRAIN_GPU_MODEL_RUNTIME_PLAN.md
LOCALBRAIN_DUAL_TRACK_ROADMAP.md
LOCALBRAIN_AI_CAPABILITY_ARCHITECTURE.md
LOCALBRAIN_AI_EVOLUTION_ENGINE.md          ← pillar 15
LOCALBRAIN_AI_CHIEF_OF_STAFF.md            ← pillar 16 (lead AI — not assistant)
LOCALBRAIN_EXECUTIVE_OFFICE.md             ← pillar 17
LOCALBRAIN_DEPARTMENT_ORGANIZATION.md
LOCALBRAIN_EXECUTIVE_BRIEFING_MODEL.md
LOCALBRAIN_EFFECTIVENESS_METRICS.md
LOCALBRAIN_PHOTOGRAPHY_DIVISION.md
LOCALBRAIN_PODCAST_DIVISION.md
LOCALBRAIN_SELF_MEASUREMENT_MODEL.md
LOCALBRAIN_CAPABILITY_MAP.md
LOCALBRAIN_EXPLORER_SYSTEM_BLUEPRINT.md
LOCALBRAIN_CODE_ENGINEERING_STUDIO.md
LOCALBRAIN_WRITING_DASHBOARD_BLUEPRINT.md
LOCALBRAIN_SOCIAL_MEDIA_INTERFACE.md
LOCALBRAIN_SYSTEM_ADMIN_PARTNER_MODEL.md
LOCALBRAIN_CURSOR_REPLACEMENT_ROADMAP.md
LOCALBRAIN_CHATGPT_REPLACEMENT_ROADMAP.md

Supporting (V1 bootstrap, still valid):
LOCALBRAIN_PRODUCT_DOCTRINE.md (v1.0 — safety + V1 scope)
LOCALBRAIN_SAFETY_MODEL.md
LOCALBRAIN_DIRECT_API_PERFORMANCE_ENGINE.md
LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md   ← execution map (authoritative)
LOCALBRAIN_BUILD_SLICE_QUEUE.md      ← v1 archive (superseded)
```

---

*Operating System Doctrine version 2.0 · 2026-06-28 · Steve/Ernie vision*
