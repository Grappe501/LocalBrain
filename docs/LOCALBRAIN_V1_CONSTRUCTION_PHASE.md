# LocalBrain V1 — Construction Phase

> **Phase 2 (Current):** Construction  
> Everything from here is measurable. Success = **modules certified**, not documents produced.

---

## Project phases

| Phase | Name | Status |
| ----- | ---- | ------ |
| 0 | Vision | ✅ Complete |
| 1 | Architecture | ✅ Complete |
| 1.9 | Productization | ✅ Complete |
| **2** | **Construction** | **▶ Current** |

LocalBrain is a **sovereign executive operating system** that manufactures independent executive institutions. The design is frozen. The job is delivery — one certified module at a time.

---

## Roles (from here)

| Role | Responsibility |
| ---- | -------------- |
| **PMO / Chief Architect** (Steve) | Critical path · V1 scope · module review · quality challenge · drift prevention · V2 triage |
| **Engineering** | Finish the current module |
| **Burt** | Execution packets only — **Finish the current module** |
| **Program Office** | CEO mode · certification status · Days to Beta |

---

## Burt mission (Phase 2)

```txt
Finish the current module.

Not: improve the architecture.
Not: find opportunities.
Not: expand the vision.
```

Every Burt return asks:

> **Review this module.**

Not: *What should we build next?*

Template: [LOCALBRAIN_V1_MODULE_REVIEW.md](./LOCALBRAIN_V1_MODULE_REVIEW.md)

---

## Certification, not percentages

Track **PASS / NEEDS WORK / CERTIFIED** — not "94%."

Example:

```txt
Executive Office
  Navigation     PASS
  Experience     PASS
  Tests          PASS
  Security       PASS
  Kelly Sandbox  PASS
  Launch         CERTIFIED
```

Live in Program Office CEO mode · engine `moduleCertificationEngine`.

---

## V1 Definition of Done

> Every module in V1 has been independently certified before becoming part of the product.

That is a stronger launch statement than *We think it's finished.*

Criteria: [LOCALBRAIN_V1_LAUNCH_CRITERIA.md](./LOCALBRAIN_V1_LAUNCH_CRITERIA.md)

---

## PMO discipline

If it doesn't help launch V1 → recommend against it.  
If it belongs in V2 → [VERSION2_BACKLOG.md](./VERSION2_BACKLOG.md).  
If it isn't on the critical path → ask why we're spending time on it.

**V1 deferral rule:** If a proposed change does not shorten the critical path, improve certification quality, reduce launch risk, or fix a defect, it waits for V2.

**Work buckets (no fifth category):**

| Bucket | Allowed? |
| ------ | -------- |
| Advances the critical path | ✅ |
| Required for module certification | ✅ |
| Fixes a defect/regression | ✅ |
| Everything else | ➜ `VERSION2_BACKLOG` |

**PMO frozen until Commercial Beta** unless: certification gate can't be evaluated · forecast bug · missing launch decision info.

**Burt session start** (every work session — not "What should I build?"):

```txt
Current Critical Path
Current Module
Certification Status
Blocking Issues
Smallest Next Executable Slice
```

If the smallest next executable slice is unclear → stop and ask.

**Morning KPIs:** Days to Beta · Forecast Confidence · Critical Path Velocity · Finishability by phase.

**Heartbeat:** Days to Beta — *Does this shorten the path to beta?*

**Golden test:** Kelly Sandbox — *Does this work correctly against Kelly Sandbox?*

---

## Related

* [LOCALBRAIN_V1_IMPLEMENTATION_MODE.md](./LOCALBRAIN_V1_IMPLEMENTATION_MODE.md)
* [LOCALBRAIN_V1_MODULE_REVIEW.md](./LOCALBRAIN_V1_MODULE_REVIEW.md)
* [LOCALBRAIN_V1_BUILD_COMMAND_CENTER.md](./LOCALBRAIN_V1_BUILD_COMMAND_CENTER.md)
