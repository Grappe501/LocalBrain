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
**Slice:** LB-OS-010.5  
**Generated:** 2026-06-28  
**Depends on:** LB-OS-008, LB-OS-009, LB-OS-010  

---

## Mission

**Chief of Staff Integration Layer** — single orchestration entry point connecting workspace, registry, intelligence, and approval queue.

---

## Intent pipeline

```txt
Command → Intent → Capability Router → Recommendation Envelope
       → Proposal Generator (optional) → Actions queue → Learning outcomes
```

---

## Hard boundaries

```txt
No automatic execution · no silent writes
Proposals only · user approves in Actions
System confidence (high/medium/low) — not AI confidence
Every recommendation: What / Why / Confidence / If approved
```

---

## Exit criteria

```txt
[x] workspace_cleanup intent + orchestration pipeline
[x] CosRecommendation envelope with system confidence
[x] POST /api/cos/proposals — proposals only
[x] cos_outcomes on approve/reject
[x] CommandBar recommendations + link to /actions
[x] npm run check && npm run test pass
```

---

## Commit

`feat: add Chief of Staff orchestration pipeline`

---

*LB-OS-010.5 · Chief of Staff Integration Layer · ✅ Complete*
