# LocalBrain Studio Blueprint v1.0

> **Every user-facing workspace as a lens on shared engines.**  
> Architecture: [Master System Architecture](./LOCALBRAIN_MASTER_SYSTEM_ARCHITECTURE.md) · Engines: [Engine Registry](./LOCALBRAIN_ENGINE_REGISTRY.md)

---

## Studio Doctrine

```txt
A studio is not a separate app.
A studio is a composed view over engines + Living Workspace context.
A studio is a lazy-loaded module — not kernel code.
The command layer works inside every studio.
Files are one tab — not the project.
```

**Modularity:** [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md) — studios load on open; kernel stays thin.

---

## Shell Navigation (Post-PSP)

```txt
LocalBrain
├── Home / Projects          → Living Workspace picker
├── Explorer                 → ENG-EX-001 lens
├── Studios
│   ├── Code Engineering
│   ├── Writing
│   ├── Campaign
│   ├── Research
│   ├── Social Media
│   └── System Admin
├── Learn (OJT)              → ENG-OJ-001
├── Actions                  → approvals cockpit
├── Agents                   → agent picker admin
└── Settings
```

**Persistent chrome:** CommandBar · ContextPanel · project pill

---

## Living Workspace Dashboard

**Route:** `/project/:workspaceId` · **Primary home candidate**

The **Project Dashboard** is the flagship studio — every project type uses this shell with different signal emphasis.

### Layout

```txt
┌─────────────────────────────────────────────────────────────┐
│ RedDirt · campaign · H:/RedDirt          [Open in Explorer] │
├─────────────────────────────────────────────────────────────┤
│ Health 72% │ Git main │ Deploy 6/9 │ 14 open reqs │ Risks 2│
├──────────────────────────────┬──────────────────────────────┤
│ Tabs:                        │ ContextPanel (persistent)    │
│  Overview · Files · Build    │ Next actions                 │
│  Writing · Deploy · Memory     │ Approvals                    │
│  Architecture · Conversations  │ Optimization cards           │
└──────────────────────────────┴──────────────────────────────┘
```

### Tab → Engine mapping

| Tab | Engines | Content |
|-----|---------|---------|
| **Overview** | KP, HL | Signal cards, next actions, risks |
| **Files** | EX, FS, SR | Explorer embedded (not full-screen tree) |
| **Build** | KC, KD | Slice progress, Burt packets, MRIDs |
| **Writing** | KW | Drafts, voices linked to project |
| **Deploy** | KC, HL | Checklists, env status |
| **Memory** | MM | Conversations, decisions, closeouts |
| **Architecture** | KD, KC, KG | Maps, dependencies (KG later) |
| **Conversations** | MM, AI | Thread list + resume |

### Workspace types

| Type | Extra emphasis |
|------|----------------|
| `codebase` | Build, git, tests, Burt |
| `campaign` | Writing, deploy, claims |
| `grant` | Documentation, deadlines, compliance |
| `novel` | Writing, research, versions |
| `hybrid` | All tabs, configurable priority |
| `meta` | LocalBrain self — engine registry, queue |

### Slice mapping

```txt
004 — project registry + workspace stub
024 — full Living Workspace
002 — single mock workspace (RedDirt or LocalBrain)
```

---

## Explorer View

**Route:** `/explorer` · **Not the app spine**

Classic spatial file browsing — one lens among many.

| Feature | Engine | Slice |
|---------|--------|-------|
| Project tree | EX, PR | 005 |
| Rich file cards | EX, SR | 005+ |
| Preview | FS, EX | 005 |
| AI folder summary | AI, SR | 008+ |
| Drive badges | DV | 016 |

**Doc:** [Explorer System Blueprint](./LOCALBRAIN_EXPLORER_SYSTEM_BLUEPRINT.md)

Opening a folder **does not replace** the Living Workspace — explorer can deep-link into workspace Files tab.

---

## Code Engineering Studio

**Route:** `/studio/code` · **Replaces "Cursor as default" for owned repos**

| Zone | Purpose |
|------|---------|
| Repo selector | Registered projects with git |
| Editor / preview | File read + propose edit (gated) |
| Build panel | Slice queue, MRIDs, Burt generator |
| Terminal stub | No shell in V1 — checklist only |
| Chat | Command layer in code context |

| Capability | Engine | Slice |
|------------|--------|-------|
| Burt packet generation | AI, AG, KD, KC | 011 |
| Repo context | VR, SR, FS | 011 |
| Propose edits | TL, PM, FS | 010+ |
| Slice progress | KC, KD | 011 |

**Doc:** [Code Engineering Studio](./LOCALBRAIN_CODE_ENGINEERING_STUDIO.md)

**Self-build home:** When workspace = `localbrain`, Build panel is primary.

---

## Writing Studio

**Route:** `/studio/writing`

| Zone | Purpose |
|------|---------|
| Mode selector | Op-ed, speech, social-long, narrative |
| Voice picker | Project voices |
| Draft editor | Create/read drafts (gated write) |
| Source panel | Indexed references |
| Claims gate stub | Campaign-linked |

| Engine | Slice |
|--------|-------|
| KW, AI, FS | 012 |

**Doc:** [Writing Dashboard Blueprint](./LOCALBRAIN_WRITING_DASHBOARD_BLUEPRINT.md)

---

## Campaign Studio

**Route:** `/studio/campaign`

Campaign command center — RedDirt, SOS Public, etc.

| Zone | Purpose |
|------|---------|
| Campaign picker | KM |
| Asset board | Files + drafts |
| Calendar stub | Future |
| Claims / debate prep | KR, KM |
| Deploy readiness | HL, KC |

| Engine | Slice |
|--------|-------|
| KM, KW, KR, AI | 013+ |

---

## Research Studio

**Route:** `/studio/research` · **Deferred UI — route stub in 002**

| Zone | Purpose |
|------|---------|
| Source library | SR, KR |
| Claims board | KR |
| Debate prep | KR, AI |
| Export to writing | KW |

| Engine | Slice |
|--------|-------|
| KR, SR, AI | Post-015 |

---

## Social Media Studio

**Route:** `/studio/social`

| Zone | Purpose |
|------|---------|
| Platform picker | KW, KM |
| Draft queue | KW |
| Preview cards | UI only |
| Schedule stub | Future |

| Engine | Slice |
|--------|-------|
| KW, KM, AI | 013 |

**Doc:** [Social Media Interface](./LOCALBRAIN_SOCIAL_MEDIA_INTERFACE.md)

---

## System Admin Studio

**Route:** `/studio/system`

Unified system lens — optimization command center lives here.

| Zone | Purpose |
|------|---------|
| **Storage Health** card | ST, DV |
| **Performance Health** card | PF |
| **Drive Architecture** card | DV |
| **Cleanup Recommendations** | ST |
| Actions / backups | BK, LG |
| Environment | EN |
| Migration status | DV, KD (016+) |

| Engine | Slice |
|--------|-------|
| DV, ST, PF, BK, HL | 006–007, 031–038 |

**Doc:** [System Admin Partner](./LOCALBRAIN_SYSTEM_ADMIN_PARTNER_MODEL.md)

Context panel duplicates optimization cards when another studio is active — System Admin is the **full-screen** version.

---

## OJT Academy Studio

**Route:** `/learn`

| Zone | Purpose |
|------|---------|
| Teach toggle | OJ, ID |
| Concept ladder | KL |
| Challenges | KL, KC |
| Progress | KL |
| Portfolio / certs | OJ |

| Engine | Slice |
|--------|-------|
| OJ, KL | 025–030 |

**Doc:** [OJT Coding Academy](./LOCALBRAIN_OJT_CODING_ACADEMY.md)

---

## Actions Cockpit

**Route:** `/actions`

Cross-studio approval surface — not a studio but essential chrome.

```txt
Pending proposed_actions
Preview diff / move plan / quarantine list
Approve · Reject · Defer
Audit link
```

**Engine:** TL, PM, FS, BK, LG · **Slice:** 010

---

## Context Panel (Shared)

Right column in every studio:

```txt
1. Project signals (compact Living Workspace)
2. Context cards: Storage · Performance · Drive · Cleanup · API Performance · Token Economy · AI Provider · Neural Lab
3. Pending approvals count
4. Active sources / tool activity
5. Command history (last 3 intents)
```

**Slice 002:** placeholders only.

---

## Studio ↔ Slice Roadmap

| Studio | V1 bootstrap | Full |
|--------|--------------|------|
| Living Workspace | 002 mock · 004 stub | 024 |
| Explorer | 005 | OS v2 views |
| Code | 011 | ongoing |
| Writing | 012 | voices expand |
| Social | 013 | schedule later |
| Campaign | 013 partial | post-015 |
| Research | route stub | post-015 |
| System Admin | 006–007 cards | 038 |
| OJT | 002 route stub | 025–030 |

---

## LB-OS-002 Studio Deliverables (Post-PSP)

```txt
[ ] Studio router with nav to all studios (empty states OK)
[ ] Living Workspace mock page (LocalBrain or RedDirt sample data)
[ ] CommandBar persistent + Chief of Staff signals pill stub
[ ] ContextPanel with eight placeholder cards (incl. Neural Lab Track B stub)
[ ] Explorer as /explorer route — NOT left spine of entire app
[ ] /learn route stub
[ ] No OpenAI · no filesystem · no live metrics
```

---

*Studio blueprint v1.0 · PSP deliverable · 2026-06-28*
