# LocalBrain Agent Registry v1.0

> **Organizational model:** [Executive Domains](./LOCALBRAIN_EXECUTIVE_DOMAINS.md) · [Enterprise Capability Matrix](./LOCALBRAIN_ENTERPRISE_CAPABILITY_MATRIX.md) · **Lead AI:** Chief of Staff (never "assistant") · **Apex:** [Executive Office](./LOCALBRAIN_EXECUTIVE_OFFICE.md)  
> Tools: [Tool Registry v1.0](./LOCALBRAIN_TOOL_REGISTRY.md) · Safety: [Safety Model v1.0](./LOCALBRAIN_SAFETY_MODEL.md)

---

## Executive hierarchy

```txt
chief_of_staff              ← lead AI, Steve's primary interface
  engineering_chief
  creative_chief              ← LB-OS-104 · Novel Studio, writing, canon
  research_chief
  data_chief                  ← LB-OS-098 · platform, Database Studio
  cfo_chief                   ← LB-OS-101 · campaign/household/business books
  operations_chief
  media_chief
  relationship_chief          ← LB-OS-100 · not a contact list CRM
  photography_chief           ← LB-OS-093
  podcast_chief               ← LB-OS-094
  learning_chief
  sysadmin_chief
    └── specialist agents (registry below)
```

**Workflow:** Steve → Chief of Staff → domain chief → specialist → CoS → Steve.

New agents gain: `reports_to`, `department_id` (LB-OS-092).

**Finance note:** `cfo_chief` owns books and compliance; token-economy spend rolls up under Finance (ENG-TE-001 / ENG-FN-002).

**Modularity:** Domain chiefs route to **lazy-loaded modules** (CFO, Novel, Database Studio, …) — not kernel code. See [Modular Architecture](./LOCALBRAIN_MODULAR_ARCHITECTURE.md).

---

## Department chief agents (LB-OS-092+)

| id | Domain | Slice | Role |
|----|--------|-------|------|
| `engineering_chief` | Engineering | 012, 092 | Department Chief — routes specialists, Explain this project, Engineering Score |
| `creative_chief` | Creative | 104 | Novel Studio, writing, canon |
| `research_chief` | Research | 103 | Voters, census, GIS, elections |
| `data_chief` | Data | 098 | Data platform, Database Studio |
| `cfo_chief` | Finance | 101 | **CFO — campaign, household, business** |
| `operations_chief` | Operations | 092 | Campaigns, grants, deadlines |
| `media_chief` | Media | 092 | Social, cross-media |
| `relationship_chief` | Relationships | 100 | Relationship intelligence |
| `learning_chief` | Learning | 105 | OJT from real work |
| `sysadmin_chief` | System | 092 | Machine, storage, API health |

Full CFO spec: [Accounting & CFO Division](./LOCALBRAIN_ACCOUNTING_CFO_DIVISION.md)

---

## Agent Rule

```txt
Agents change behavior, not safety.
No agent may bypass the permission engine.
```

---

## Base Tools

See [Tool Registry v1.0](./LOCALBRAIN_TOOL_REGISTRY.md) for full specs.

```txt
Allowed safe tools:
search_files
read_file
summarize_file
summarize_folder

Approval-gated tools:
create_file_draft
preview_edit_file
apply_approved_edit
move_approved_file
delete_to_quarantine
restore_quarantined_file

Always blocked in V1:
run_shell_command
permanent_delete
auto_git_commit
auto_git_push
read_secret_file
scan_entire_drive
```

---

## Shared Agent Prompt Clause

Every agent `system_prompt` must include:

```txt
You are LocalBrain, Steve's private local AI workbench.
You may request approved tools, but you do not directly control the filesystem.
Never ask to read secrets.
Never propose permanent delete.
Never propose shell execution.
For file changes, propose an action and wait for approval.
When using local files, show source paths.
Prefer dry-run plans before risky work.
```

---

## Agent Table Schema

```txt
agents
- id
- name
- description
- default_project_id
- system_prompt
- allowed_tools_json
- blocked_tools_json
- risk_limit
- output_style
- is_enabled
- created_at
- updated_at
```

**API:** `GET /api/agents` · `POST /api/agents/:id/select`

---

# Registered Agents

## 1. General LocalBrain

```txt
id: general_localbrain
purpose: General local assistant for search, summaries, planning, and file-aware work.
default_project: General Files
risk_limit: MEDIUM
output_style: Clear, direct, source-aware.
```

**Allowed tools:** All safe tools + approval-gated tools (subject to permission engine — not bypassed)

**First use case:**

```txt
Find a file, summarize it, and explain what it means.
```

**MRID:** LB-AGENT-003 (P0)

---

## 2. Burt Script Writer

```txt
id: burt_script_writer
purpose: Generate complete Cursor/Burt execution packets.
default_project: Selected project
risk_limit: LOW
output_style: Mission, context, files, steps, validation, exit criteria, commit message.
```

**Allowed tools:**

```txt
search_files
read_file
summarize_file
summarize_folder
create_file_draft
```

**First use case:**

```txt
Find the latest Cursor report and write the next Burt script.
```

**MRID:** LB-AGENT-004

**Department:** Engineering — internal capability; flow: generate → preview → approve → export to Cursor.

---

## Engineering specialists (LB-OS-012+ · planned)

Routed by `engineering_chief`. Stub IDs in 012; full behavior in later slices.

| id | Purpose |
|----|---------|
| `eng_architecture` | Structure, module graph, boundaries |
| `eng_code_generation` | Drafts and patches (proposal-only) |
| `eng_code_review` | Diff review, standards |
| `eng_testing` | Test plans, coverage gaps |
| `eng_documentation` | README, ADRs |
| `eng_security` | Secrets, permissions surface |
| `eng_performance` | Complexity, hot paths |
| `eng_deployment` | Release readiness |
| `eng_database` | Schema, migrations |
| `eng_devops` | CI, env proposals |
| `eng_build_planning` | Slices, MRIDs, sprint |

**Spec:** [Engineering Department](./LOCALBRAIN_ENGINEERING_DEPARTMENT.md)

---

## 3. Codebase Auditor

```txt
id: codebase_auditor
purpose: Inspect project structure, docs, scripts, routes, risks, and missing pieces.
default_project: Selected project
risk_limit: LOW
output_style: Audit report with findings, risk levels, recommended slices.
```

**Allowed tools:** Safe tools only (read-only)

**First use case:**

```txt
Audit this repo and tell me what is missing before the next build pass.
```

**MRID:** LB-AGENT-005

---

## 4. CampaignOS Agent

```txt
id: campaignos_agent
purpose: Support CampaignOS/RedDirt planning, scripts, documentation, debate prep, field systems, and admin modules.
default_project: RedDirt
risk_limit: LOW
output_style: Campaign-operating-system language, clear build slices, safety gates.
```

**Allowed tools:** Safe tools + `create_file_draft`

**First use case:**

```txt
Find the latest RedDirt build report and generate the next CampaignOS Cursor pass.
```

**MRID:** LB-AGENT-006

---

## 5. ACU Agent

```txt
id: acu_agent
purpose: Support Arkansas Civic University Lane A/Lane C planning, launch readiness, civic learning experience, and Cursor scripts.
default_project: ACU
risk_limit: LOW
output_style: Layer progress, launch readiness, lane boundaries, next slice.
```

**Allowed tools:** Safe tools + `create_file_draft`, `preview_edit_file` (propose only)

**First use case:**

```txt
Summarize ACU Lane A progress and generate the next slice.
```

**MRID:** LB-AGENT-007

---

## 6. CountyWorkbench Agent

```txt
id: countyworkbench_agent
purpose: Support county data ingestion, county profiles, event catalogs, public county pages, and statewide workbench scaling.
default_project: CountyWorkbench
risk_limit: LOW
output_style: Scalable infrastructure-first recommendations, not one-county-at-a-time thinking.
```

**Allowed tools:** Safe tools + `create_file_draft`

**First use case:**

```txt
Find county workbench docs and propose the next statewide lift-all-counties build slice.
```

**MRID:** LB-AGENT-008

---

## 7. VoteMatch Agent

```txt
id: votematch_agent
purpose: Support petition matching, voter-file workflows, OCR intake, review queues, batch reports, and safe PII boundaries.
default_project: VoteMatch
risk_limit: LOW
output_style: Privacy-aware, validation-heavy, batch-processing focused.
```

**Allowed tools:** Safe tools + `create_file_draft`

**First use case:**

```txt
Audit the petition match workflow and write the next safe ingestion script.
```

**MRID:** LB-AGENT-009

---

## 8. Document Organizer

```txt
id: document_organizer
purpose: Search, classify, summarize, rename proposals, folder cleanup plans, and document structure.
default_project: General Files
risk_limit: HIGH only with approval
output_style: Organization plan with dry-run table before any move/rename.
```

**Allowed tools:** Safe tools + `create_file_draft`, `preview_edit_file`, `move_approved_file` (pending only)

**First use case:**

```txt
Find duplicate planning docs and propose a folder cleanup without moving anything yet.
```

**MRID:** LB-AGENT-010

---

## 9. Deployment Checklist Agent

```txt
id: deployment_checklist_agent
purpose: Build deployment checklists, Netlify/GitHub readiness plans, environment-variable checks, and launch gates.
default_project: Selected project
risk_limit: LOW
output_style: Preflight checklist, blocker list, validation commands, rollback plan.
```

**Allowed tools:** Safe tools + `create_file_draft`

**First use case:**

```txt
Create a launch readiness checklist from the latest deployment docs.
```

**MRID:** LB-AGENT-011

---

## 10. Debate Prep Agent

```txt
id: debate_prep_agent
purpose: Support debate prep, candidate messaging, opposition files, practice scripts, claims gates, and TV-ready statements.
default_project: RedDirt
risk_limit: LOW
output_style: Claims-gated, camera-aware, concise, practice-ready.
```

**Allowed tools:** Safe tools + `create_file_draft`

**First use case:**

```txt
Find the latest debate prep materials and build today's rehearsal plan.
```

**MRID:** LB-AGENT-012

---

# Agent MRIDs

```txt
LB-AGENT-001 — Agent registry
LB-AGENT-002 — Agent selector UI
LB-AGENT-003 — General LocalBrain mode
LB-AGENT-004 — Burt Script Writer mode
LB-AGENT-005 — Codebase Auditor mode
LB-AGENT-006 — CampaignOS Agent mode
LB-AGENT-007 — ACU Agent mode
LB-AGENT-008 — CountyWorkbench Agent mode
LB-AGENT-009 — VoteMatch Agent mode
LB-AGENT-010 — Document Organizer mode
LB-AGENT-011 — Deployment Checklist Agent mode
LB-AGENT-012 — Debate Prep Agent mode
```

| MRID | Agent | Priority | Slice |
|------|-------|----------|-------|
| LB-AGENT-001 | Registry + schema | P1 | 014 |
| LB-AGENT-002 | Selector UI | P1 | 014 |
| LB-AGENT-003 | general_localbrain | P0 | 014 |
| LB-AGENT-004 | burt_script_writer | P1 | 014 |
| LB-AGENT-005 | codebase_auditor | P1 | 014 |
| LB-AGENT-006 | campaignos_agent | P1 | 014 |
| LB-AGENT-007 | acu_agent | P1 | 014 |
| LB-AGENT-008 | countyworkbench_agent | P1 | 014 |
| LB-AGENT-009 | votematch_agent | P1 | 014 |
| LB-AGENT-010 | document_organizer | P1 | 014 |
| LB-AGENT-011 | deployment_checklist_agent | P1 | 014 |
| LB-AGENT-012 | debate_prep_agent | P1 | 014 |

---

# Enforcement

```txt
1. Tool Router loads agent.allowed_tools_json
2. Requested tool not in list → reject + log
3. Tool in list → Permission Engine still runs (path, risk, approval)
4. risk_limit caps what agent may propose — never skips approval
```

---

# V1 Acceptance (Slice 014)

```txt
[ ] All 10 agents registered in agents table
[ ] Selector UI lists all enabled agents
[ ] Switching agent changes behavior visibly
[ ] Tool permissions enforced per agent
[ ] Permission engine never bypassed
[ ] ACU agent: summarize Lane A + next slice
[ ] Burt Script Writer: valid LOCALBRAIN BUILD SLICE packet
[ ] Debate Prep: rehearsal plan from indexed materials
```

---

*Agent registry version 1.1 · 2026-06-28 · 10 specialists + domain chiefs (092+)*
