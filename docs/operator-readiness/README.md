# Operator Readiness & Evidence-Driven Development

> **Prime Directive:** [**Protect the evidence.**](./PRIME-DIRECTIVE.md)  
> **Phase:** **Evidence-Driven Development (EDD)** — entered at PRL-3 · 2026-07-05  
> **Platform level:** **PRL-3** · next gate **PRL-4**  
> **Engineering question:** *What did the operators teach us today?*  
> **Success signal:** *We learned something true.* — not merely *the build passed*

The platform is no longer waiting on engineering to define what to build. It is waiting on **operators to tell us how well it works**.

---

## Platform lifecycle

```text
Architecture → Implementation → Certification → Automated Acceptance
        → Evidence-Driven Development  ← YOU ARE HERE
        → Production
```

Full declaration: [Evidence-Driven Development](./EVIDENCE-DRIVEN-DEVELOPMENT.md)

---

## Governance (authoritative)

| Document | Purpose |
| -------- | ------- |
| [**Prime Directive**](./PRIME-DIRECTIVE.md) | **Protect the evidence.** — cultural rule for every meeting until launch |
| [Operator Evidence Scoreboard](./OPERATOR-EVIDENCE-SCOREBOARD.md) | Primary dashboard — not feature completion |
| [Evidence-Driven Development](./EVIDENCE-DRIVEN-DEVELOPMENT.md) | Current phase — engineering role shift |
| [Certified Implementation Doctrine](../platform/CERTIFIED-IMPLEMENTATION-DOCTRINE.md) | ✅ Frozen — eleven doctrines, active review check |
| [Governed Platform Architecture](../platform/GOVERNED-PLATFORM-ARCHITECTURE.md) | Three trust domains · EPO-001 · WSP-001 reserved |
| [Engineering Philosophy v1.0](../platform/ENGINEERING-PHILOSOPHY-V1.md) | ✅ Complete — how we build software here |
| [EPO-001 Reservation](../epo/EPO-001-RESERVATION.md) | Governance Trust — platform governance (not built) |
| [Executive Navigation Model](../platform/EXECUTIVE-NAVIGATION-MODEL.md) | Questions, not modules · institution cockpit |
| [Platform Constitution](../platform/PLATFORM-CONSTITUTION.md) | Six articles · complete · amendment discipline only |
| [First Principles Stack](../platform/FIRST-PRINCIPLES-STACK.md) | Conceptual capstone · sovereignty before synchronization |
| [Institution Root Concept](../institution/INSTITUTION-ROOT-CONCEPT.md) | Institution Operating System · root abstraction |
| [Digital Institution Charter](../institution/DIGITAL-INSTITUTION-CHARTER.md) | Three ledgers · organization that remembers |
| [WSP-001 Reservation](../collaboration/WSP-001-RESERVATION.md) | Workspace Ledger — GitHub-backed sovereign workspace (not built) |
| [ILG-001 Reservation](../institution/ILG-001-RESERVATION.md) | Institutional Ledger — organization memory (not built) |
| [Canonical Platform Acceptance Test v1.0](./CANONICAL-PLATFORM-ACCEPTANCE-TEST-v1.0.md) | Permanent regression benchmark |
| [Platform Readiness Levels](./PLATFORM-READINESS-LEVELS.md) | PRL-1 … PRL-6 |
| [PRL-4 Exit Contract](./PRL-4-EXIT-CONTRACT.md) | Evidence-based PRL-4 completion |
| [Platform Health Score](./PLATFORM-HEALTH-SCORE.md) | Longitudinal governance metric |
| [Operational Evidence Register](./OPERATIONAL-EVIDENCE-REGISTER.md) | OEC lifecycle — observations before bugs |

---

## PRL-4 session kit (print before Kelly sits down)

| Document | Audience |
| -------- | -------- |
| [Operator Briefing Frame](./OPERATOR-BRIEFING-FRAME.md) | What to tell the operator |
| [Facilitator Card](./OPERATOR-SESSION-FACILITATOR-CARD.md) | Observer — one page |
| [Evidence Scribe Guide](./EVIDENCE-SCRIBE-GUIDE.md) | Scribe — capture only |
| [Evidence Template](./WALKTHROUGH-001-EVIDENCE-TEMPLATE.md) | Completed per session |
| [Walkthrough Scenario](./WALKTHROUGH-001-SCENARIO.md) | County Fair Return |

---

## Walkthroughs

| ID | Title | Status |
| -- | ----- | ------ |
| [OPERATOR-WALKTHROUGH-001](./WALKTHROUGH-001-SCENARIO.md) | Unknown Person → Trusted Relationship | ✅ Canonical acceptance test |

---

## Quick reference

**Automated acceptance (PRL-3 floor):**

```bash
cd backend
node --import tsx --test src/operatorWalkthrough/walkthrough001.test.ts
```

**PRL-4 gate:** ≥ 3 internal operators · signed evidence · readiness ≥ 90% · OECs dispositioned

---

## Related

- [Execution Charter](../contact-management/slices/CONTACT-V3-EXECUTION-CHARTER.md)
- [UCIE README](../ucie/UCIE-README.md)
- [Contact Management v3](../contact-management/slices/CONTACT-V3-IMPLEMENTATION-GUIDE.md)
