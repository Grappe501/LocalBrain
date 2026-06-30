# LocalBrain Executive OS V1 — Release Candidate

> **Slice:** LB-OS-016 · **Hardening, not features**  
> **Milestone:** First usable Executive OS loop for Steve Brain  
> **Status (2026-06-29):** System 1 feature complete for v1 after LB-OS-026.5 — polish and bug fixes only; architecture frozen.  
> **Verify:** `GET /api/v1/acceptance`

---

## What V1 is

Executive OS V1 is Steve's **local, approval-gated command center** with four foundational departments orchestrated by the Chief of Staff:

```txt
Engineering      → builds and understands systems
Writing          → creates and manages narratives
Data & Intelligence → understands information
Relationship & Network → social knowledge (not CRM)
```

Plus Executive Office infrastructure: Briefing, Program Office, System Health, LivingWorkspace, Knowledge Explorer, Digital Assets, Command layer, Actions queue.

---

## Operational loop (locked)

```txt
Observe → Understand → Plan → Recommend → Approve → Execute → Verify → Learn
```

V1 implements **Observe through Recommend** reliably. **Execute** is approval-gated. **Verify** and **Learn** are partial (stubs + OJT hooks).

---

## V1 acceptance checklist

| Surface | Route | Status |
|---------|-------|--------|
| Executive Briefing | `/` | ✅ |
| Program Office | `/program-office` | ✅ |
| System Health + dock | `/system` + bottom dock | ✅ |
| LivingWorkspace | `/workspace/:id` | ✅ |
| Knowledge Explorer | `/explorer` | ✅ |
| Digital Asset Registry + intelligence | `/explorer` + APIs | ✅ |
| Command layer (CoS) | Command bar | ✅ |
| File read/summarize | Permission-gated | ✅ |
| Approval actions | `/actions` | ✅ |
| Engineering Department | `/studio/engineering` | ✅ read-only |
| Writing Department | `/studio/writing` | ✅ draft/preview |
| Data & Intelligence | `/studio/data` | ✅ plan-only |
| Relationship & Network | `/studio/relationships` | ✅ recommendations only |

Automated verification: `backend/src/v1/v1SpineVerifier.ts`

---

## What V1 can do

```txt
Navigate the full executive shell
See build truth in Program Office
Monitor machine + ops health globally
Manage LivingWorkspaces
Browse and understand indexed files
Registry + intelligence on digital assets
Ask Chief of Staff (command layer) with proposals
Read/summarize approved files
Propose file changes via approval queue
Use four departments for intelligence, drafts, query plans, relationship recommendations
```

---

## What V1 cannot do

```txt
Silent file writes or deletes
Auto-publish (Substack, social, email)
External sync (Google, Gmail, Calendar, CRM)
Arbitrary SQL execution
Shell commands or auto-deployment
Automated relationship outreach
Full NL→SQL with live cross-source results
Novel canon object model (stub only)
Live voter file / Census imports
Multi-brain / commercial packaging
```

---

## Safety gates (binding)

```txt
Permission engine on every path
Approval queue for writes
Quarantine for deletes
Action log
No silent execution
Department guardrails enforced in UI + API
```

---

## Navigation (LB-OS-016)

```txt
Briefing → 4 active departments → Program Office → Workspace → Explorer → Actions → System → Learn → Settings
```

Stub departments (finance, media, research, system) hidden from nav until they ship.

---

## After V1

```txt
LB-OS-017 — AI Provider Management (provider spine — before migration)
Phase 2 — Migration & Personal OS (LB-OS-018+)
Relationship imports · ChatGPT archive · drive mapping
Phase 3+ — Verify/Learn depth · OJT Academy · multi-machine arc
```

Spec: [AI Provider Management](./LOCALBRAIN_AI_PROVIDER_MANAGEMENT.md)

---

*Executive OS V1 · LB-OS-016 · 2026-06-29*
