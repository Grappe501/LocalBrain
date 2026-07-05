# Executive Program Office (EPO) — Charter

> **Status:** **EPO-001 RESERVED** · Not implemented as governed subsystem · 2026-07-05  
> **Mission:** Govern the governed platforms.

---

## What EPO is

EPO is **not a dashboard**.

EPO is a **governing operating layer** — the fourth trust domain in the LocalBrain platform.

| | |
| - | - |
| **Responsibility** | Answer: *Is the organization healthy?* |
| **Not responsible for** | Doing identity, relationship, or operational work |

EPO sits **above** the three operational trust domains and provides one authoritative answer when someone asks:

> **"How is the entire platform doing?"**

---

## Relationship to existing Program Office

LocalBrain already ships **precursor capabilities** (LB-OS-012.5 construction EPO):

| Precursor | Route / engine | Role today |
| --------- | -------------- | ---------- |
| Program Office | `/program-office` | Build state, governed platform strip, roadmap |
| PSA-001 | `ENG-PSA-001` | Platform self-audit · coherence |
| Executive Briefing | `/` | Today's priorities · Prime Directive |
| Platform Health Score | Operator readiness docs | Readiness dimensions |
| PRL / CPAT | Operator readiness | Release gates |
| Evidence Scoreboard | Operator readiness | Evidence trends |
| OEC Register | Operator readiness | Operational evidence lifecycle |

**EPO-001** will intentionally **elevate** these from utilities into a **governed subsystem** with explicit contracts — not because more features are needed today, but because governance itself deserves the same discipline applied to UCIE, Contact, and VOP.

**Do not build EPO-001 until operator validation confirms the three trust domains under real use.**

---

## EPO-001 responsibilities (reserved scope)

### Cross-platform health

One view across UCIE · Contact · VOP — subsystem maturity, coherence, drift.

### Readiness

PRL · CPAT · operator evidence · OECs · release gates.

### Governance

Certified doctrine · ADR status · architecture versions · subsystem maturity.

### Execution

Current horizon · blocked work · velocity · evidence trends.

### Leadership

Executive briefing · program risks · launch readiness · today's priorities.

---

## Trust domain placement

```text
Governance Trust (EPO)          ← EPO-001 · RESERVED
        │
        ▼
Identity Trust (UCIE)           ← CERTIFIED
        │
        ▼
Relationship Trust (Contact v3) ← CERTIFIED
        │
        ▼
Operational Trust (VOP)       ← VOP-001 CERTIFIED
```

---

## Boundaries

EPO **must not:**

- Own identity, relationship, or operational state
- Modify UCIE, Contact, or VOP contracts
- Replace subsystem-specific work queues or engines

EPO **must:**

- Compose authoritative cross-platform state from subsystem signals
- Preserve Prime Directive evidence discipline
- Maintain platform coherence as the organization scales

---

## Related

- [EPO-001 Reservation](./EPO-001-RESERVATION.md)
- [Governed Platform Architecture](../platform/GOVERNED-PLATFORM-ARCHITECTURE.md)
- [Legacy construction EPO spec](../LOCALBRAIN_EXECUTIVE_PROGRAM_OFFICE.md) — LB-OS-012.5 precursor

---

*EPO Charter · LocalBrain · 2026*
