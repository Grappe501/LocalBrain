# LocalBrain Cursor Replacement Roadmap v1.0

> **How LocalBrain replaces daily Cursor use** for Steve's owned repos.  
> Studio: [Code Engineering Studio](./LOCALBRAIN_CODE_ENGINEERING_STUDIO.md) · Doctrine: [OS Doctrine v2.0](./LOCALBRAIN_OPERATING_SYSTEM_DOCTRINE.md)

---

## Goal

```txt
Cursor becomes optional.
LocalBrain Code Studio becomes the default for plan → build → validate → repair on approved repos.
```

Cursor remains for: novel debugging, unfamiliar stacks, pair sessions when desired.

---

## Replacement Matrix

| Cursor today | LocalBrain path | When |
|--------------|-----------------|------|
| Chat + codebase | Chat + repo map + read tools | V1 (008–009) |
| Composer / agent | Tool router + approval writes | V1 full (011) |
| Burt build slices | Burt Script Writer + packets | V1 (015) |
| Audit repo | codebase_auditor agent | V1 (014) |
| Multi-file edit | Diff preview + approved apply | V1 (010–011) |
| Terminal | **Not V1** — future gated | OS v4+ |
| Git commit/push | Commit **guidance** only V1 | OS v3 read-only git status |
| Rules / .cursorrules | Agent prompts + MRID registry | V1 (014) |

---

## Phases

### Phase A — Bootstrap (V1 slices 001–015)

```txt
✅ Repo scaffold
⬜ UI shell · OpenAI chat · SQLite
⬜ Safe search + read + summarize
⬜ Tool router + approvals + writes
⬜ Agents + Burt pipeline
```

**Steve can:** find files, read, summarize, generate Burt scripts, approve safe writes in LocalBrain repo.

### Phase B — Studio shell (OS v2)

```txt
/explorer + /code routes
Repo map UI · MRID progress board
In-app diff viewer · validation output panel
```

### Phase C — Loop closure (OS v3)

```txt
Repair mode → auto-suggest fix slices
Test runner display (approved commands only)
Commit message + closeout automation
```

### Phase D — Parity (OS v4+)

```txt
Gated terminal for npm test/build in sandbox
Read-only git integration
Optional: in-studio file editor
```

---

## What We Will Not Copy Blindly

```txt
Unrestricted agent filesystem access
Auto-commit without Steve
Background agents without visibility
Shell on entire machine
```

---

## Success Metrics

```txt
[ ] 80% of LocalBrain slice work done without opening Cursor
[ ] Every code change has diff preview + approval + log
[ ] Burt packets generated from last closeout in < 2 minutes
[ ] Steve trusts Code Studio for ACU + LocalBrain repos
```

---

*Cursor replacement roadmap version 1.0 · 2026-06-28*
