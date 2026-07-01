# Burt Packet — Implementation Mode Header (required)

Copy this block to the **top of every Burt packet** during V1 implementation mode.

---

```txt
> **LOCALBRAIN V1 ROADMAP** · Architecture FROZEN · Implementation mode
>
> ✓ Executive Office Certification
> ✓ Session 4
> ✓ Session 5
> ✓ Theory Freeze
> ▶ Convention
> □ Empty Brain Factory
> □ Memory OS
> □ Communications Office
> □ Commercial Beta
>
> Everything else → VERSION2_BACKLOG.md
```

---

```txt
## PROJECT STATUS

Architecture Phase: COMPLETE
Doctrine: FROZEN
Reserved capability creation: DISABLED
Mission: Execute the existing roadmap.

If a new architectural idea is discovered, record it in VERSION2_BACKLOG.md
and continue implementation. Do not expand doctrine.
```

---

## Burt mission types (V1)

| Allowed | Not allowed |
| ------- | ----------- |
| Implementation steps for an existing slice | New architecture design |
| Bug fix / polish / certification tasks | New reserved capabilities |
| Test plan and validation for shipped scope | New offices or cognitive layers |
| Kelly Sandbox golden integration test | New doctrine documents |

**Design packets are frozen.** Burt writes **execution packets** only.

**Module complete when:** Does this work correctly against Kelly Sandbox? If yes, certify. If no, not complete.

**Burt mission:** Finish the current module. Review with [LOCALBRAIN_V1_MODULE_REVIEW.md](../LOCALBRAIN_V1_MODULE_REVIEW.md).

**Burt session start** (every work session — live from Program Office CEO Mode):

```txt
Current Critical Path
Current Module
Certification Status
Blocking Issues
Smallest Next Executable Slice
```

Do not ask *What should I build?* If the smallest next executable slice is unclear → stop and ask.

**V1 deferral rule:** If a proposed change does not shorten the critical path, improve certification quality, reduce launch risk, or fix a defect, it waits for V2.

**Work buckets (no fifth category):** critical path · certification · defect fix · everything else → VERSION2_BACKLOG.

**Reference:** [LOCALBRAIN_V1_CONSTRUCTION_PHASE.md](../LOCALBRAIN_V1_CONSTRUCTION_PHASE.md)
