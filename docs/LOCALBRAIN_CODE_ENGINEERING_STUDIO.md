# LocalBrain Code Engineering Studio v1.0

> **⚠️ Scope moved:** This doc describes the **Code Studio workspace** inside the **[Engineering Department](./LOCALBRAIN_ENGINEERING_DEPARTMENT.md)** (LB-OS-012).  
> The department is **not** a code editor. Code Studio is one lens on repo-scoped engineering work.

> **Pillar 3:** Cursor replacement path.  
> Doctrine: [Operating System Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md) · Roadmap: [Cursor Replacement Roadmap](./LOCALBRAIN_CURSOR_REPLACEMENT_ROADMAP.md)

---

## Vision

Code Studio workspace manages the loop:

```txt
Plan → Code → Validate → Repair → Document → Commit guidance → Next slice
```

Engineering Chief routes here when work is repo-scoped. Cursor remains available for edge cases.

---

## Studio Capabilities

| Capability | LB-OS-012 bootstrap | Full department |
|------------|---------------------|-----------------|
| Read repo safely | ✅ via file tools 009 | Scoped repo context |
| Explain this project | ✅ Engineering Chief | Full graph |
| Architecture map | Module manifest graph | Live diagram + drift |
| Find bugs / gaps | Stub | codebase_auditor |
| Write code | Approval-gated 010 | In-studio diff |
| Burt packets | Generate → preview → export | Execute locally (later) |
| Engineering Score | Stub | Full factors |

---

## Agents (within department)

| Agent | Role |
|-------|------|
| `engineering_chief` | Routes, synthesizes, Explain this project |
| `burt_script_writer` | Burt packet generation |
| Specialists | See [Engineering Department](./LOCALBRAIN_ENGINEERING_DEPARTMENT.md) |

---

## Studio Layout (Future)

```txt
Left:   repo tree + MRID progress
Center: file / diff / chat
Right:  sources · tool calls · approvals · validation output
Bottom: terminal output (future gated) · test results
```

LB-OS-012 bootstrap: department dashboard + Code Studio tab (read + chat), not full IDE.

---

## Safety

```txt
No auto_git_commit / auto_git_push
No shell execution in V1
Writes only through approval engine
Repo scope: LocalBrain + approved project roots only
```

---

*Code Studio workspace · part of Engineering Department · 2026-06-28*
