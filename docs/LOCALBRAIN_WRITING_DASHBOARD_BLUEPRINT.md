# LocalBrain Writing & Narrative Dashboard Blueprint v1.0

> **Pillar 4:** Creative cockpit.  
> Doctrine: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md)

---

## Vision

A dedicated writing surface inside LocalBrain — not generic chat with a long prompt. Steve's voices, templates, and active drafts live here.

---

## Writing Modes

| Mode | Use |
|------|-----|
| Blog writer | Investigative, civic, RedDirt-style posts |
| Speech writer | Rallies, events, debate prep |
| Grant writer | Narratives, budgets language, LOI drafts |
| Campaign message writer | Kelly voice, voter contact |
| Faith/Substack writer | Long-form faith + civic crossover |
| Historical novel writer | Period voice, character arcs |
| Debate prep writer | Q&A, rebuttals, fact blocks |
| Social media writer | Short-form (feeds Social pillar) |
| Email/text writer | Direct outreach drafts |
| Long-form strategy writer | Memos, plans, lane documents |

---

## Voice Library

```txt
Steve strategic voice
Kelly campaign voice
Jeb Crawse voice
Grant/professional voice
TV/debate voice
Investigative blog voice
Historical novel voice
```

Stored as agent `output_style` + prompt fragments in [Agent Registry](./LOCALBRAIN_AGENT_REGISTRY.md). Expand with `writing_voices` table in OS v3.

---

## Dashboard Layout (Future)

```txt
Left:   active projects + draft list
Center: editor (markdown) + AI assist panel
Right:  sources from Explorer · research pins · version history
Top:    mode selector · voice selector · word target
```

**Bootstrap:** `/chat` with writing-focused agents until `/write` route exists.

---

## Workflow

```txt
1. Select mode + voice
2. Pull context from Explorer (approved files only)
3. Draft in thread or dedicated editor
4. Save draft → create_file_draft (approval) or local drafts table
5. Export → Markdown, copy, future DOCX
```

---

## Integration

| Pillar | Link |
|--------|------|
| Explorer | Source files, research PDFs, prior posts |
| Social | Repurpose long draft → posts |
| Code Studio | Technical writing, README passes |
| SysAdmin | Archive published drafts |

---

## Safety

```txt
No posting to external APIs without approval gate (future)
Drafts stay in approved folders or local_data
No training on secrets — blocked paths apply
```

---

## Phases

| Phase | Deliverable |
|-------|-------------|
| V1 | Chat + agents for ad-hoc writing |
| OS v2 | `/write` route + draft list |
| OS v3 | Voice library UI + templates |
| OS v4 | Export + optional CMS connectors (approved) |

---

*Writing dashboard blueprint version 1.0 · 2026-06-28*
