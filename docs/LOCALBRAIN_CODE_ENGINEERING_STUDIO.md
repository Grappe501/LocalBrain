# LocalBrain Code Engineering Studio v1.0

> **Pillar 3:** Cursor replacement path.  
> Doctrine: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Roadmap: [Cursor Replacement Roadmap](./LOCALBRAIN_CURSOR_REPLACEMENT_ROADMAP.md)

---

## Vision

LocalBrain Code Studio manages the full loop:

```txt
Plan → Code → Validate → Repair → Document → Commit guidance → Next slice
```

Cursor remains available for edge cases. LocalBrain becomes the **default** for Steve's owned repos.

---

## Studio Capabilities

| Capability | V1 bootstrap | Full studio |
|------------|--------------|-------------|
| Read repo safely | Slice 008 | Scoped repo context |
| Architecture map | Slice 013 | Live diagram + drift detect |
| Find bugs / gaps | Agent: codebase_auditor | CI-style audit reports |
| Write code | Approval-gated writes 011 | In-studio editor + diff |
| Patch plans | Slice 010 preview | Multi-file plans |
| Generate files | create_file_draft | Template library |
| Preview diffs | Slice 010–011 | Side-by-side studio |
| Explain errors | Chat + read tools | Error → repair script |
| Repair passes | Burt repair mode | Auto-suggest fix slice |
| Commit summaries | LB-BURT-004 | Git-aware (read-only V1) |
| Slice build loop | LB-BURT-001–010 | MRID progress bars in UI |
| Requirement registry | docs + future UI | Editable MRID board |

---

## Agents

| Agent | Role |
|-------|------|
| `burt_script_writer` | Generate Cursor/Burt packets |
| `codebase_auditor` | Read-only repo audit |
| `general_localbrain` | Ad-hoc engineering questions |
| Project agents (ACU, etc.) | Domain-scoped engineering |

---

## Studio Layout (Future)

```txt
Left:   repo tree + MRID progress
Center: file / diff / chat
Right:  sources · tool calls · approvals · validation output
Bottom: terminal output (future gated) · test results
```

Bootstrap: chat + right panel (LB-UI-011) on `/chat`.

---

## Build Loop Integration

```txt
1. Steve or Burt identifies next slice (LB-BURT-010)
2. Studio generates BURT / CURSOR EXECUTION SCRIPT
3. Cursor or in-studio agent executes slice
4. Validation commands run (LB-BURT-006 library)
5. Closeout report filed (LB-BURT-007)
6. Registry + progress bar updated
```

Packets: [Burt Script Generator Plan](./LOCALBRAIN_BURT_SCRIPT_GENERATOR_PLAN.md)

---

## Safety

```txt
No auto_git_commit / auto_git_push in V1
No shell execution in V1
Writes only through approval engine
Repo scope: LocalBrain + approved project roots only
```

---

## Acceptance

```txt
[ ] V1: generate valid LB-SLICE packet from ACU closeout
[ ] V2: repo map for LocalBrain repo in UI
[ ] V3: preview multi-file patch before approve
[ ] V4: in-studio validate (typecheck/test) display
```

---

*Code engineering studio version 1.0 · 2026-06-28*
