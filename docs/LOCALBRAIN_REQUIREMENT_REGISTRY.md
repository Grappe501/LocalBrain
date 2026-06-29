# LocalBrain Master Requirement Registry v1.0

> **Purpose:** Stable IDs for every feature before Burt writes code.  
> **Next doc:** [Build Slice Queue v1.0](./LOCALBRAIN_BUILD_SLICE_QUEUE.md)

---

## Registry Rules

```txt
MRID format:
LB-[DOMAIN]-[###]

Priority:
P0 = required for V1
P1 = needed soon after V1
P2 = future expansion

Status:
PLANNED | IN_PROGRESS | COMPLETE | DEFERRED | BLOCKED
```

### How to Use

1. Every build slice lists MRIDs it satisfies in its Burt packet.
2. No slice is **COMPLETE** until all listed P0 MRIDs pass validation.
3. New features get the next ID in their domain — never reuse IDs.
4. Update **Status** when Ernie/Burt completes work.

---

## Domain Index

| Prefix | Domain |
|--------|--------|
| LB-CORE | App foundation |
| LB-CHAT | Chat system |
| LB-AI | OpenAI integration |
| LB-DB | Local database |
| LB-CONFIG | Configuration |
| LB-SEARCH | Local search |
| LB-FILE | File tools |
| LB-SAFE | Safety & permissions |
| LB-TOOL | Tool router |
| LB-LOG | Action logging |
| LB-BACKUP | Backup & recovery |
| LB-MEM | Memory system |
| LB-PROJ | Project awareness |
| LB-AGENT | Agent modes |
| LB-BURT | Burt/Cursor pipeline |
| LB-UI | Interface |
| LB-TEST | Testing |
| LB-DOCS | Documentation |
| LB-API | API contract |
| LB-FIRST | First-run wizard |

---

## 1. Core Foundation

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-CORE-001 | Create LocalBrain repo scaffold | P0 | 001 | PLANNED |
| LB-CORE-002 | Add frontend/backend workspace structure | P0 | 001 | PLANNED |
| LB-CORE-003 | Add shared TypeScript types | P0 | 001 | PLANNED |
| LB-CORE-004 | Add root scripts for dev/build/check | P0 | 001 | PLANNED |
| LB-CORE-005 | Add `.env.example` | P0 | 001 | PLANNED |
| LB-CORE-006 | Add README setup guide | P0 | 001 | PLANNED |

---

## 2. Chat System

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-CHAT-001 | ChatGPT-style chat screen | P0 | 002 | PLANNED |
| LB-CHAT-002 | User message input | P0 | 002 | PLANNED |
| LB-CHAT-003 | Assistant response display | P0 | 002 | PLANNED |
| LB-CHAT-004 | Loading/working state | P0 | 002 | PLANNED |
| LB-CHAT-005 | Conversation list | P1 | 004 | PLANNED |
| LB-CHAT-006 | Conversation persistence | P0 | 004 | PLANNED |
| LB-CHAT-007 | Project-aware chat context | P1 | 012 | PLANNED |
| LB-CHAT-008 | Streaming response display | P1 | 003 | PLANNED |

---

## 3. OpenAI Integration

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-AI-001 | Secure OpenAI API key loading | P0 | 003 | PLANNED |
| LB-AI-002 | OpenAI backend client | P0 | 003 | PLANNED |
| LB-AI-003 | `/api/chat` endpoint | P0 | 003 | PLANNED |
| LB-AI-004 | Friendly missing-key error | P0 | 003 | PLANNED |
| LB-AI-005 | Model configuration setting | P1 | 003 | PLANNED |
| LB-AI-006 | Tool/function calling bridge | P0 | 009 | PLANNED |
| LB-AI-007 | Structured tool response handling | P0 | 009 | PLANNED |
| LB-AI-008 | Agent-specific system prompts | P1 | 014 | PLANNED |
| LB-AI-009 | Response streaming | P2 | FUTURE | DEFERRED |
| LB-AI-010 | Tool activity streaming | P2 | FUTURE | DEFERRED |
| LB-AI-011 | Structured output contracts | P1 | 009 | PLANNED |

---

## 4. Local Database

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-DB-001 | SQLite database setup | P0 | 004 | PLANNED |
| LB-DB-002 | Migration system | P0 | 004 | PLANNED |
| LB-DB-003 | Conversations table | P0 | 004 | PLANNED |
| LB-DB-004 | Messages table | P0 | 004 | PLANNED |
| LB-DB-005 | Settings table | P0 | 004 | PLANNED |
| LB-DB-006 | File index table | P0 | 006 | PLANNED |
| LB-DB-007 | Action log table | P0 | 011 | PLANNED |
| LB-DB-008 | Proposed actions table | P0 | 010 | PLANNED |
| LB-DB-009 | Project profiles table | P1 | 012 | PLANNED |
| LB-DB-010 | Agents table | P1 | 014 | PLANNED |
| LB-DB-011 | Tool calls table | P0 | 009 | PLANNED |
| LB-DB-012 | Backups table | P1 | 011 | PLANNED |
| LB-DB-013 | Quarantine table | P1 | 011 | PLANNED |
| LB-DB-014 | Index runs table | P0 | 006 | PLANNED |
| LB-DB-015 | Seed defaults | P1 | 008/012/014 | PLANNED |

---

## 5. Configuration

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-CONFIG-001 | Local config file | P0 | 005 | PLANNED |
| LB-CONFIG-002 | Allowed folder registry | P0 | 005 | PLANNED |
| LB-CONFIG-003 | Forbidden path registry | P0 | 005 | PLANNED |
| LB-CONFIG-004 | Settings UI | P0 | 005 | PLANNED |
| LB-CONFIG-005 | Default model setting | P1 | 003 | PLANNED |
| LB-CONFIG-006 | Default project setting | P1 | 012 | PLANNED |
| LB-CONFIG-007 | Tool permission settings | P1 | 010 | PLANNED |

---

## 6. Local Search

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-SEARCH-001 | Approved-folder scanner | P0 | 006 | PLANNED |
| LB-SEARCH-002 | File metadata extraction | P0 | 006 | PLANNED |
| LB-SEARCH-003 | Text content extraction | P0 | 006 | PLANNED |
| LB-SEARCH-004 | Ignored folder rules | P0 | 006 | PLANNED |
| LB-SEARCH-005 | Re-index command | P0 | 006 | PLANNED |
| LB-SEARCH-006 | `/api/search` endpoint | P0 | 007 | PLANNED |
| LB-SEARCH-007 | Search UI screen | P0 | 007 | PLANNED |
| LB-SEARCH-008 | Search result cards | P0 | 007 | PLANNED |
| LB-SEARCH-009 | Folder summary search | P1 | 008 | PLANNED |
| LB-SEARCH-010 | Project guessing | P0 | 006 | PLANNED |
| LB-SEARCH-011 | Search ranking | P0 | 007 | PLANNED |
| LB-SEARCH-012 | Index run logging | P0 | 006 | PLANNED |

---

## 7. File Tools

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-FILE-001 | Read approved files | P0 | 008 | PLANNED |
| LB-FILE-002 | Max file size guard | P0 | 008 | PLANNED |
| LB-FILE-003 | File source display | P0 | 008 | PLANNED |
| LB-FILE-004 | Summarize file tool | P0 | 008 | PLANNED |
| LB-FILE-005 | Summarize folder tool | P1 | 008 | PLANNED |
| LB-FILE-006 | Create file draft tool | P1 | 010 | PLANNED |
| LB-FILE-007 | Preview file edit tool | P1 | 010 | PLANNED |
| LB-FILE-008 | Apply approved edit | P1 | 011 | PLANNED |
| LB-FILE-009 | Move file with approval | P1 | 011 | PLANNED |
| LB-FILE-010 | Delete to quarantine only | P1 | 011 | PLANNED |
| LB-FILE-011 | Restore quarantined file | P1 | 011 | PLANNED |

---

## 8. Safety & Permissions

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-SAFE-001 | Permission classifier | P0 | 005 | PLANNED |
| LB-SAFE-002 | Block forbidden paths | P0 | 005 | PLANNED |
| LB-SAFE-003 | Action risk levels | P0 | 010 | PLANNED |
| LB-SAFE-004 | Approval UI for risky actions | P0 | 010 | PLANNED |
| LB-SAFE-005 | Diff preview before edits | P1 | 010 | PLANNED |
| LB-SAFE-006 | Backup before write | P1 | 011 | PLANNED |
| LB-SAFE-007 | Quarantine instead of permanent delete | P1 | 011 | PLANNED |
| LB-SAFE-008 | Dry-run mode for bulk actions | P1 | 011 | PLANNED |
| LB-SAFE-009 | No shell command execution in V1 | P0 | 001 | PLANNED |
| LB-SAFE-010 | Secret-file block | P0 | 005 | PLANNED |
| LB-SAFE-011 | Path normalization | P0 | 005 | PLANNED |
| LB-SAFE-012 | Action logging | P0 | 011 | PLANNED |
| LB-SAFE-013 | Restore support | P1 | 011 | PLANNED |
| LB-SAFE-014 | Bulk action cap | P1 | 011 | PLANNED |
| LB-SAFE-015 | Dry-run report required before reorg/cleanup | P0 | 016 | PLANNED |
| LB-SAFE-016 | C:/H: drive separation enforcement | P0 | 016 | PLANNED |
| LB-SAFE-017 | No cleanup without optimization plan | P0 | 031 | PLANNED |

---

## 9. Tool Router

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-TOOL-001 | Tool schema registry | P0 | 009 | PLANNED |
| LB-TOOL-002 | Tool router backend | P0 | 009 | PLANNED |
| LB-TOOL-003 | `search_files` tool | P0 | 009 | PLANNED |
| LB-TOOL-004 | `read_file` tool | P0 | 009 | PLANNED |
| LB-TOOL-005 | `summarize_file` tool | P0 | 009 | PLANNED |
| LB-TOOL-006 | `summarize_folder` tool | P0 | 009 | PLANNED |
| LB-TOOL-007 | `create_file_draft` tool | P1 | 011 | PLANNED |
| LB-TOOL-008 | `preview_edit_file` tool | P1 | 011 | PLANNED |
| LB-TOOL-009 | `apply_approved_edit` tool | P1 | 011 | PLANNED |
| LB-TOOL-010 | `move_approved_file` tool | P1 | 011 | PLANNED |
| LB-TOOL-011 | `delete_to_quarantine` tool | P1 | 011 | PLANNED |
| LB-TOOL-012 | `restore_quarantined_file` tool | P1 | 011 | PLANNED |
| LB-TOOL-013 | Forbidden tool handler | P0 | 009 | PLANNED |
| LB-TOOL-014 | Tool call logging | P0 | 009 | PLANNED |

---

## 10. Action Logging

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-LOG-001 | Log every tool call | P0 | 011 | PLANNED |
| LB-LOG-002 | Log file reads | P0 | 011 | PLANNED |
| LB-LOG-003 | Log proposed write actions | P0 | 010 | PLANNED |
| LB-LOG-004 | Log approved/rejected actions | P0 | 010 | PLANNED |
| LB-LOG-005 | Action history screen | P1 | 011 | PLANNED |
| LB-LOG-006 | Export action log | P2 | FUTURE | DEFERRED |

---

## 11. Backup & Recovery

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-BACKUP-001 | Backup folder structure | P1 | 011 | PLANNED |
| LB-BACKUP-002 | Backup before edit | P1 | 011 | PLANNED |
| LB-BACKUP-003 | Backup before move | P1 | 011 | PLANNED |
| LB-BACKUP-004 | Quarantine deleted files | P1 | 011 | PLANNED |
| LB-BACKUP-005 | Restore action | P1 | 011 | PLANNED |
| LB-BACKUP-006 | Backup history screen | P2 | FUTURE | DEFERRED |

---

## 12. Memory System

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-MEM-001 | Local memory table | P1 | 012 | PLANNED |
| LB-MEM-002 | Project profile memory | P1 | 012 | PLANNED |
| LB-MEM-003 | User preference memory | P1 | 012 | PLANNED |
| LB-MEM-004 | Repo map memory | P1 | 012 | PLANNED |
| LB-MEM-005 | Conversation summary memory | P2 | FUTURE | DEFERRED |
| LB-MEM-006 | Memory search | P2 | FUTURE | DEFERRED |

---

## 13. Project Awareness

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-PROJ-001 | Project registry | P1 | 012 | PLANNED |
| LB-PROJ-002 | Project selector UI | P1 | 012 | PLANNED |
| LB-PROJ-003 | Project folder mapping | P1 | 012 | PLANNED |
| LB-PROJ-004 | Project profile summary | P1 | 012 | PLANNED |
| LB-PROJ-005 | Detect package.json/repos | P1 | 013 | PLANNED |
| LB-PROJ-006 | Detect docs/readme files | P1 | 013 | PLANNED |
| LB-PROJ-007 | Build project map | P1 | 013 | PLANNED |

---

## 14. Agent Modes

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-AGENT-001 | Agent registry | P1 | 014 | PLANNED |
| LB-AGENT-002 | Agent selector UI | P1 | 014 | PLANNED |
| LB-AGENT-003 | General LocalBrain mode | P0 | 014 | PLANNED |
| LB-AGENT-004 | Burt Script Writer mode | P1 | 014 | PLANNED |
| LB-AGENT-005 | Codebase Auditor mode | P1 | 014 | PLANNED |
| LB-AGENT-006 | CampaignOS Agent mode | P1 | 014 | PLANNED |
| LB-AGENT-007 | ACU Agent mode | P1 | 014 | PLANNED |
| LB-AGENT-008 | CountyWorkbench Agent mode | P1 | 014 | PLANNED |
| LB-AGENT-009 | VoteMatch Agent mode | P1 | 014 | PLANNED |
| LB-AGENT-010 | Document Organizer mode | P1 | 014 | PLANNED |
| LB-AGENT-011 | Deployment Checklist Agent mode | P1 | 014 | PLANNED |
| LB-AGENT-012 | Debate Prep Agent mode | P1 | 014 | PLANNED |

---

## 15. Burt/Cursor Pipeline

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-BURT-001 | Burt script template | P1 | 015 | PLANNED |
| LB-BURT-002 | Build-mode generator | P1 | 015 | PLANNED |
| LB-BURT-003 | Audit-mode generator | P1 | 015 | PLANNED |
| LB-BURT-004 | Repair-mode generator | P1 | 015 | PLANNED |
| LB-BURT-005 | Deployment-mode generator | P1 | 015 | PLANNED |
| LB-BURT-006 | Validation command library | P1 | 015 | PLANNED |
| LB-BURT-007 | Closeout template | P1 | 015 | PLANNED |
| LB-BURT-008 | Project-aware boundary injector | P1 | 015 | PLANNED |
| LB-BURT-009 | Requirement ID injector | P1 | 015 | PLANNED |
| LB-BURT-010 | Next-slice recommendation | P1 | 015 | PLANNED |

---

## 16. UI Requirements

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-UI-001 | App shell | P0 | 002 | PLANNED |
| LB-UI-002 | Sidebar navigation | P0 | 002 | PLANNED |
| LB-UI-003 | Chat screen | P0 | 002 | PLANNED |
| LB-UI-004 | Search screen | P0 | 007 | PLANNED |
| LB-UI-005 | Settings screen | P0 | 005 | PLANNED |
| LB-UI-006 | Project screen | P1 | 012 | PLANNED |
| LB-UI-007 | Agent screen | P1 | 014 | PLANNED |
| LB-UI-008 | Action approval panel | P0 | 010 | PLANNED |
| LB-UI-009 | Action history screen | P1 | 011 | PLANNED |
| LB-UI-010 | Backup screen | P1 | 011 | PLANNED |
| LB-UI-011 | Right context panel | P0 | 002 | PLANNED |
| LB-UI-012 | First-run wizard | P1 | 017 | PLANNED |
| LB-UI-013 | Responsive iPad layout | P1 | 002 | PLANNED |

---

## 17. Testing

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-TEST-001 | Typecheck script | P0 | 001 | PLANNED |
| LB-TEST-002 | Backend health test | P0 | 001 | PLANNED |
| LB-TEST-003 | API endpoint smoke tests | P0 | 003 | PLANNED |
| LB-TEST-004 | Permission engine tests | P0 | 005 | PLANNED |
| LB-TEST-005 | File scanner tests | P0 | 006 | PLANNED |
| LB-TEST-006 | Search tests | P0 | 007 | PLANNED |
| LB-TEST-007 | Tool router tests | P0 | 009 | PLANNED |
| LB-TEST-008 | Approval flow tests | P0 | 010 | PLANNED |
| LB-TEST-009 | Backup/restore tests | P1 | 011 | PLANNED |

---

## 18. Documentation

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-DOCS-001 | Product doctrine doc | P0 | 000 | COMPLETE |
| LB-DOCS-002 | Architecture doc | P0 | 000 | COMPLETE |
| LB-DOCS-003 | Safety model doc | P0 | 000 | COMPLETE |
| LB-DOCS-004 | Requirement registry doc | P0 | 000 | COMPLETE |
| LB-DOCS-005 | Build slice queue doc | P0 | 000 | COMPLETE |
| LB-DOCS-006 | Burt/Cursor protocol doc | P0 | 000 | COMPLETE |
| LB-DOCS-007 | First-run setup doc | P1 | 001 | COMPLETE |
| LB-DOCS-008 | User manual | P2 | FUTURE | DEFERRED |
| LB-DOCS-009 | API contract doc | P0 | 000 | COMPLETE |
| LB-DOCS-010 | Database schema doc | P0 | 000 | COMPLETE |
| LB-DOCS-011 | UI/UX blueprint doc | P0 | 000 | COMPLETE |
| LB-DOCS-012 | OpenAI integration plan doc | P0 | 000 | COMPLETE |
| LB-DOCS-013 | Search & indexing plan doc | P0 | 000 | COMPLETE |
| LB-DOCS-014 | Burt script generator plan doc | P0 | 000 | COMPLETE |
| LB-DOCS-015 | V1 execution package doc | P0 | 000 | COMPLETE |
| LB-DOCS-016 | Operating System Doctrine v2.0 | P0 | 000 | COMPLETE |
| LB-DOCS-017 | Capability map doc | P0 | 000 | COMPLETE |
| LB-DOCS-018 | Explorer system blueprint | P0 | 000 | COMPLETE |
| LB-DOCS-019 | Code engineering studio doc | P0 | 000 | COMPLETE |
| LB-DOCS-020 | Writing dashboard blueprint | P0 | 000 | COMPLETE |
| LB-DOCS-021 | Social media interface doc | P0 | 000 | COMPLETE |
| LB-DOCS-022 | System admin partner model | P0 | 000 | COMPLETE |
| LB-DOCS-023 | Cursor replacement roadmap | P0 | 000 | COMPLETE |
| LB-DOCS-024 | ChatGPT replacement roadmap | P0 | 000 | COMPLETE |
| LB-DOCS-025 | Build slice queue v2 doc | P0 | 000 | COMPLETE |
| LB-DOCS-026 | Migration and drive doctrine doc | P0 | 000 | COMPLETE |
| LB-DOCS-027 | OJT coding academy doc | P0 | 000 | COMPLETE |
| LB-DOCS-028 | System optimization doctrine doc | P0 | 000 | COMPLETE |
| LB-DOCS-029 | Drive architecture plan doc | P0 | 000 | COMPLETE |
| LB-DOCS-030 | Storage cleanup blueprint doc | P0 | 000 | COMPLETE |
| LB-DOCS-031 | Performance monitor blueprint doc | P0 | 000 | COMPLETE |

---

## 19a. API Contract

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-API-001 | Health endpoint | P0 | 001 | PLANNED |
| LB-API-002 | Chat endpoint | P0 | 003 | PLANNED |
| LB-API-003 | Conversations endpoints | P0 | 004 | PLANNED |
| LB-API-004 | Settings endpoints | P0 | 004 | PLANNED |
| LB-API-005 | Allowed folders endpoints | P0 | 005 | PLANNED |
| LB-API-006 | Indexing endpoints | P0 | 006 | PLANNED |
| LB-API-007 | Search endpoint | P0 | 007 | PLANNED |
| LB-API-008 | File read/summarize endpoints | P0 | 008 | PLANNED |
| LB-API-009 | Tool runner endpoint | P0 | 009 | PLANNED |
| LB-API-010 | Proposed action endpoints | P0 | 010 | PLANNED |
| LB-API-011 | Project endpoints | P1 | 012 | PLANNED |
| LB-API-012 | Agent endpoints | P1 | 014 | PLANNED |
| LB-API-013 | Backup/quarantine endpoints | P1 | 011 | PLANNED |
| LB-API-014 | Log endpoints | P1 | 011 | PLANNED |

---

## 19. First-Run Wizard

| MRID | Requirement | Priority | Slice | Status |
|------|-------------|----------|-------|--------|
| LB-FIRST-001 | Welcome screen | P1 | 017 | PLANNED |
| LB-FIRST-002 | Backend API key status check | P1 | 017 | PLANNED |
| LB-FIRST-003 | Allowed folder picker | P1 | 017 | PLANNED |
| LB-FIRST-004 | Forbidden rules confirmation | P1 | 017 | PLANNED |
| LB-FIRST-005 | Default project selection | P1 | 017 | PLANNED |
| LB-FIRST-006 | First index runner | P1 | 017 | PLANNED |
| LB-FIRST-007 | First search test | P1 | 017 | PLANNED |
| LB-FIRST-008 | First chat test | P1 | 017 | PLANNED |
| LB-FIRST-009 | Safety status screen | P1 | 017 | PLANNED |
| LB-FIRST-010 | First-run completion flag | P1 | 017 | PLANNED |

---

## 20. V1 Requirement Bar Graph

```txt
Core Foundation        [██████████] 100% required for V1
Chat System            [██████████] 100% required for V1
OpenAI Integration     [██████████] 100% required for V1
SQLite Persistence     [██████████] 100% required for V1
Folder Allowlist       [██████████] 100% required for V1
Local Search           [██████████] 100% required for V1
Read File Tools        [██████████] 100% required for V1
Safety System          [██████████] 100% required for V1
Tool Router            [██████████] 100% required for V1
Approval System        [████████░░] 80% required for V1
Backup/Recovery        [██████░░░░] 60% required for V1
Memory                 [████░░░░░░] 40% required for V1
Agent Modes            [████░░░░░░] 40% required for V1
Burt Pipeline          [████░░░░░░] 40% required for V1
```

---

## 21. V1 Must-Have MRIDs

All **P0** requirements through slice **010**, plus agent baseline:

```txt
LB-CORE-001 through LB-CORE-006
LB-CHAT-001 through LB-CHAT-006
LB-AI-001 through LB-AI-007
LB-DB-001 through LB-DB-008
LB-CONFIG-001 through LB-CONFIG-004
LB-SEARCH-001 through LB-SEARCH-008
LB-SEARCH-010 through LB-SEARCH-012
LB-FILE-001 through LB-FILE-004
LB-SAFE-001 through LB-SAFE-004
LB-SAFE-009 through LB-SAFE-010
LB-TOOL-001 through LB-TOOL-006
LB-TOOL-013
LB-TOOL-014
LB-LOG-003 through LB-LOG-004
LB-UI-001 through LB-UI-005
LB-UI-008
LB-TEST-001 through LB-TEST-008
LB-DOCS-001 through LB-DOCS-007
```

**V1 core complete at LB-OS-010.** Ship at **LB-OS-015**. See [Build Slice Queue v2.0](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md).

---

## Summary Counts

| Priority | Count | Complete |
|----------|------:|---------:|
| P0 | 122 | 31 |
| P1 | 94 | 1 |
| P2 | 6 | 0 (DEFERRED) |
| **Total** | **213** | **32** |

---

## Change Log

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-06-28 | Official registry — Steve/Ernie spec adopted |

---

*Registry version 1.0 · Build queue: slices 000–019 · See LOCALBRAIN_BUILD_SLICE_QUEUE.md*
