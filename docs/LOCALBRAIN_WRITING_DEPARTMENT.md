# LocalBrain Writing Department v1.0

> **Slice:** LB-OS-013 · **Narrative engine + voice library + project-aware drafting cockpit**  
> Doctrine: [Operating System Doctrine](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Departments: [Department Organization](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md) · Legacy: [Writing Dashboard Blueprint](./LOCALBRAIN_WRITING_DASHBOARD_BLUEPRINT.md) · Novel: [Novel Studio](./LOCALBRAIN_NOVEL_STUDIO.md)

---

## Principle

```txt
Writing Department = narrative engine + voice library + project-aware drafting cockpit.
Not a publisher. Not an email client. Not a social scheduler.
```

Steve talks to the **Writing Chief** (`writing_chief`). Work flows:

```txt
Observe → Understand → Plan → Recommend → Approve → Execute → Verify → Learn
```

V1 is **read / draft / preview** only — same discipline as Engineering Department bootstrap.

---

## Chief

| Role | Agent ID | Responsibility |
|------|----------|----------------|
| **Writing Chief** | `writing_chief` | Mode + voice selection, narrative synthesis, draft preview |

---

## High-value writing modes (V1 catalog)

| Mode | ID | Use |
|------|-----|-----|
| **Novel Studio** | `novel_studio` | Historical fiction, canon, scenes |
| **Campaign Writing** | `campaign_writing` | Kelly voice, field, fundraising |
| **Substack / Blog** | `substack_blog` | Long-form civic + faith crossover |
| **Speeches & Debate** | `speech_debate` | Stump, town hall, rebuttals |
| **Grant & Strategy** | `grant_strategy` | LOIs, memos, funder narratives |
| **Social Drafts** | `social_draft` | Short-form — draft only |

---

## Voice / style library

| Voice | ID |
|-------|-----|
| Steve — Strategic | `steve_strategic` |
| Kelly — Campaign | `kelly_campaign` |
| Jeb Crawse | `jeb_crawse` |
| Grant / Professional | `grant_professional` |
| TV / Debate | `tv_debate` |
| Investigative Blog | `investigative_blog` |
| Historical Novel | `historical_novel` |

Stored as department catalog in V1; migrates to `Memory` domain + agent `output_style` later.

---

## Guardrails (binding)

```txt
No auto-publishing
No social posting
No email sending
No file writes without approval (LB-OS-010)
Draft and preview only in V1
Source-aware when using files — permission engine enforced
```

---

## Department UI — six tabs

| Tab | Purpose |
|-----|---------|
| **Overview** | Writing Score, guardrails, Chief recommendation, narrative catalog summary |
| **Modes** | Six high-value writing modes with examples |
| **Projects** | Writing-relevant LivingWorkspaces + suggested modes |
| **Draft** | Mode + voice + topic → markdown preview (not saved) |
| **Voices** | Style library with tone notes |
| **Sources** | Approved writing files (metadata) per project |

Route: `/studio/writing`

---

## Writing Score (V1 stub)

| Factor | Signals |
|--------|---------|
| Writing Modes | Mode catalog completeness |
| Voice Library | Voice definitions |
| Project Linkage | Campaign/novel/personal workspaces |
| Source Awareness | Filesystem roots + Explorer |
| Draft Pipeline | Preview cockpit + focus set |
| Publish Safety | Guardrails enforced |

---

## Narrative catalog (internal)

Composed read model linking modes ↔ voices ↔ workspaces — not a foundational object. Expands with Novel Studio canon objects and saved drafts (approval-gated).

---

## LB-OS-013 bootstrap scope

**Build:**

```txt
Writing Department module (/studio/writing)
Writing modes + voice library
Draft preview cockpit (template-based, no OpenAI required)
Source-aware file listing (permission-gated metadata)
Writing Score stub
GET/POST /api/writing/* read and preview APIs
writing-studio manifest (replaces creative-studio stub)
```

**Do not build in 013:**

```txt
Auto-publish to Substack, social, or email
In-browser rich editor with silent saves
OpenAI-required generation (optional later)
Novel canon object model (later slice inside department)
```

---

## Related docs

| Doc | Role |
|-----|------|
| [Novel Studio](./LOCALBRAIN_NOVEL_STUDIO.md) | Novel mode deep spec |
| [Writing Dashboard Blueprint](./LOCALBRAIN_WRITING_DASHBOARD_BLUEPRINT.md) | Legacy layout reference |
| [Agent Registry](./LOCALBRAIN_AGENT_REGISTRY.md) | `writing_chief`, specialists |
| [Platform Separation Strategy](./LOCALBRAIN_PLATFORM_SEPARATION_STRATEGY.md) | Brain vs Platform boundary |

---

*Writing Department v1.0 · LB-OS-013 · 2026-06-29*
