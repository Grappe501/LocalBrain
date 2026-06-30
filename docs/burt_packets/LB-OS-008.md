# BURT / CURSOR EXECUTION SCRIPT

> **LOCALBRAIN V1 ROADMAP** · Architecture FROZEN · Implementation mode
>
> ```txt
> □ Executive Office Certification
> □ Session 4
> □ Session 5
> □ Theory Freeze
> □ Convention
> □ Empty Brain Factory
> □ Memory OS
> □ Communications Office
> □ Commercial Beta
>
> Everything else → VERSION2_BACKLOG.md
> ```


**Project:** LocalBrain  
**Slice:** LB-OS-008  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-004, LB-OS-007  
**Authoritative spec:** [Build Slice Queue v2](../LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md)

---

## Mission

**OpenAI Command Layer** — Chief of Staff reasoning via direct API, backend-only key, registry context injection. No tools, no filesystem reads.

---

## Hard boundaries

```txt
Direct OpenAI API only (no provider sprawl)
Backend-only OPENAI_API_KEY
No file writes / moves / deletes / cleanup execution
No unrestricted tools (LB-OS-010+)
No secret exposure to frontend
Command layer only — not file read/summarize (009)
```

---

## Exit criteria

```txt
[x] POST /api/command real path with CoS orchestrator
[x] OpenAI provider adapter (direct fetch)
[x] Model config from env
[x] Missing-key friendly offline answers
[x] Workspace + asset intelligence context injection
[x] Token estimate stub
[x] Action classification
[x] Safe command logging (no secrets)
[x] Chief of Staff command bar wired
[x] npm run check && npm run test pass
```

---

## Commit

`feat: add OpenAI command layer with Chief of Staff context`

**Next:** LB-OS-009 / LB-OS-010 File Read / Summarize Tools

---

*LB-OS-008 · OpenAI Command Layer · ✅ Complete*
