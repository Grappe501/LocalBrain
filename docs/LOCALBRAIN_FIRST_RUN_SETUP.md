# LocalBrain First-Run Setup Plan v1.0

> **Slice:** LB-SLICE-017 implements wizard UI · This doc is the spec.  
> Doctrine: [Product Doctrine v1.0](./LOCALBRAIN_PRODUCT_DOCTRINE.md) · Agents: [Agent Registry v1.0](./LOCALBRAIN_AGENT_REGISTRY.md)

---

## Purpose

The first-run setup must make LocalBrain usable without exposing secrets or scanning anything unsafe.

```txt
No API key in frontend.
No folder scan before approval.
No write tools before safety setup.
No indexing secrets.
```

**Prerequisites:** LB-SLICE-001 through 016 (wizard ships at 017). Manual partial setup possible earlier — see [slice mapping](#slice-mapping).

---

# Setup Wizard Flow

## Step 1 — Welcome

**Message:**

```txt
Welcome to LocalBrain.
This is your private local AI command center.
Before it can search or read files, you choose exactly what folders it may access.
```

**MRID:** LB-FIRST-001

---

## Step 2 — API Key Status

Check backend-only `.env.local`.

```txt
OPENAI_API_KEY=present/missing
```

**If missing:**

```txt
OpenAI API key not found.
Add it to backend/.env.local or root .env.local.
Do not paste it into the browser.
```

**MRID:** LB-FIRST-002

---

## Step 3 — Choose Allowed Folders

**Suggested starter folders:**

```txt
H:\SOSWebsite
C:\Users\User\Desktop
C:\Users\User\Documents
```

But **nothing is scanned** until Steve approves and completes Step 6.

**MRID:** LB-FIRST-003

---

## Step 4 — Confirm Forbidden Rules

**Show blocked categories:**

```txt
System folders
AppData
.env files
private keys
credentials
.git
node_modules
build outputs
```

**User must confirm:**

```txt
I understand LocalBrain will not read secrets or system folders.
```

**MRID:** LB-FIRST-004

---

## Step 5 — Choose Default Project

**Options:**

```txt
General Files
RedDirt
ACU
CountyWorkbench
VoteMatch
SOS Public
AJAX
Phatlip
```

**MRID:** LB-FIRST-005

---

## Step 6 — Run First Index

Index **only** approved folders.

**Show:**

```txt
Files scanned
Files indexed
Files skipped
Forbidden files blocked
Large files skipped
Errors
```

**MRID:** LB-FIRST-006

---

## Step 7 — Run First Search

**Suggested test query:**

```txt
ACU latest Cursor report
```

**Expected result:**

```txt
Search returns local matching files with path, excerpt, modified date, and project guess.
```

**MRID:** LB-FIRST-007

---

## Step 8 — First Chat Test

**Prompt:**

```txt
Search my approved folders for the latest ACU Cursor report and summarize it.
```

**This proves:**

```txt
Chat works
Tool router works
Search works
Read file works
Source display works
Logging works
```

**MRID:** LB-FIRST-008

---

## Step 9 — Safety Confirmation

**Show safety status:**

```txt
API key backend-only: PASS
Allowed folders configured: PASS
Forbidden paths active: PASS
Secret patterns blocked: PASS
Write approval required: PASS
Permanent delete disabled: PASS
Shell execution disabled: PASS
Action logging active: PASS
```

**MRID:** LB-FIRST-009

---

# First-Run Completion Criteria

```txt
[ ] API key status checked
[ ] At least one allowed folder added
[ ] Forbidden rules confirmed
[ ] Default project selected
[ ] First index completed
[ ] First search completed
[ ] First chat test completed
[ ] Safety status displayed
```

**MRID:** LB-FIRST-010

---

# Database Settings

After setup completes, persist in SQLite `settings`:

```txt
settings.first_run_completed = true
settings.default_project_id = selected project
settings.openai_key_status = present/missing
settings.safety_acknowledged = true
settings.last_index_completed_at = timestamp
```

Never store `OPENAI_API_KEY` value in SQLite.

---

# Reset Setup Option

Settings should include:

```txt
Reset First-Run Wizard
Clear Indexed Files
Clear Allowed Folders
Clear Conversations
```

Dangerous reset actions require confirmation.

| Reset action | Risk | Confirm |
|--------------|------|---------|
| Reset First-Run Wizard | Low | Single confirm |
| Clear Indexed Files | Medium | Confirm + explain |
| Clear Allowed Folders | High | Confirm + type "RESET" |
| Clear Conversations | Medium | Confirm |

---

# First-Run MRIDs

| MRID | Requirement | Slice |
|------|-------------|-------|
| LB-FIRST-001 | Welcome screen | 017 |
| LB-FIRST-002 | Backend API key status check | 017 |
| LB-FIRST-003 | Allowed folder picker | 017 |
| LB-FIRST-004 | Forbidden rules confirmation | 017 |
| LB-FIRST-005 | Default project selection | 017 |
| LB-FIRST-006 | First index runner | 017 |
| LB-FIRST-007 | First search test | 017 |
| LB-FIRST-008 | First chat test | 017 |
| LB-FIRST-009 | Safety status screen | 017 |
| LB-FIRST-010 | First-run completion flag | 017 |

---

# Manual Setup (Pre-Wizard)

Until slice 017, use phased manual setup:

| Phase | Steps | Min slice |
|-------|-------|-----------|
| Install | `npm install`, `.env.local`, `npm run dev` | 001 |
| Chat | API key check, first message | 003 |
| Folders | Allowed folders in Settings | 005 |
| Index | Rebuild index | 006 |
| Search | Test query | 007 |
| Tools | Chat search+summarize test | 009 |

Ports (default): frontend `5174`, backend `4545`.

---

# Troubleshooting

| Problem | Fix |
|---------|-----|
| API key missing | Add to root or `backend/.env.local`; restart backend |
| Wizard blocks index | Complete Step 3 (allowed folders) first |
| Search empty | Complete Step 6; verify folder paths exist |
| Chat test fails | Confirm key present; slice 009+ for tools |
| Safety status FAIL | Complete slices 005, 010, 011 as needed |

---

# Slice Mapping

| Component | Slice |
|-----------|-------|
| Wizard UI (all LB-FIRST-*) | 017 |
| Settings reset options | 017–018 |
| Operator manual reference | 018 |

---

# V1 Alignment

First-run success supports [V1 North Star](./LOCALBRAIN_PRODUCT_DOCTRINE.md#v1-north-star):

```txt
Find the latest Cursor report for ACU, summarize it, identify what changed, and write the next Burt script.
```

Step 8 proves search + read + summarize; full north star requires slices 014–015 (agents + Burt pipeline).

---

*First-run setup plan version 1.0 · 2026-06-28*
