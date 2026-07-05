# OPS-012 — Workbench Roadmap & Capability Crawl

> **Date:** 2026-07-05  
> **Scope:** Full workbench sync — phase markers · pathways · capability categories · 15-step roadmap

---

## Where you are (dashboard truth)

| Layer | Status |
| ----- | ------ |
| **Architecture** | ✅ Complete · doctrine frozen |
| **Implementation Phase 1** | ✅ Complete (Contact v3 + UCIE reference patterns) |
| **PRL** | **PRL-3** achieved · **PRL-4** current gate |
| **Phase** | Evidence-Driven Development |
| **Prime Directive** | Protect the evidence. |
| **Active milestone** | PRL-4 — Internal Operator Validated (OPERATOR-WALKTHROUGH-001) |
| **Next milestone** | PRL-4 Exit Contract Assessment |

---

## Surfaces synced

| Surface | Now shows |
| ------- | ----------- |
| **Program Office** | Governed platform strip · 15-step roadmap · 8 capability categories |
| **EPO phase/slice** | PRL-4 / PRL-4-EXIT-CONTRACT (not LB-OS queue) |
| **Launch countdown** | EDD · PRL-4 gate (not Construction) |
| **V1 critical path** | Operator validation step before Commercial Beta |
| **Home banner** | Prime Directive · PRL level · current gate |
| **Home briefing priorities** | Governed era priorities when active |
| **Workspace localbrain** | EDD focus · PRL-4 active slice |
| **Module table** | Operator Validation & Beta · PRL-4 blocker |

---

## Live capability categories (production)

1. **Executive OS** — Home · EPO · Workspaces (partial · 72%)
2. **Institutional Cognition** — Memory OS · EI pipeline (production · 100%)
3. **Communications Office** — COM module certified (production · 100%)
4. **Identity Acquisition (UCIE)** — `/studio/ingestion` (production · 94%)
5. **Relationship Platform** — Contact v3 · `/studio/contacts` (production · 94%)
6. **Migration & Personal OS** — Full lifecycle (production · 100%)
7. **Operations & Safety** — System · Actions · Settings · Providers (production · 88%)
8. **Department Studios** — Engineering · Writing · Data (partial · 75%)

---

## Roadmap — next 15 steps

See `shared/src/operatorReadiness/platformRoadmap.ts` · rendered in Program Office.

1. Kelly operator session *(in progress)*
2. Chris operator session
3. Third internal operator session
4. OEC disposition review
5. PRL-4 Exit Contract Assessment
6. Advance to PRL-4 certified
7. Freeze Walkthrough #1
8. Bounded EDD hardening
9. Commercial Beta preparation
10. Kelly sandbox golden test
11. External pilot planning (PRL-5)
12. Walkthrough #2 design
13. Walkthrough #3 design
14. External pilot execution
15. Production readiness / launch decision (PRL-6)

---

## Verification

```bash
npm run build -w shared
npm run typecheck
cd backend
node --import tsx --test-concurrency=1 --test \
  src/buildState/buildState.test.ts \
  src/liveSurface/liveSurface.test.ts \
  src/workspaces/workspaceRegistry.test.ts
```

---

*OPS-012 · Workbench roadmap crawl · 2026-07-05*
