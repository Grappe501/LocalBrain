# LB-OS-026.65 — Executive Intent Graph & Capability Atlas

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


> **Depends on:** LB-OS-026.6 (ENG-CAP-001)  
> **Next:** LB-OS-026.7 Executive Dashboard & Daily Briefing  
> **Gate:** [Graph Integrity](./LOCALBRAIN_GRAPH_INTEGRITY_CERTIFICATION.md) PASS · [Capability Atlas](./LOCALBRAIN_EXECUTIVE_CAPABILITY_ATLAS.md) generated

---

## Mission

Insert the **Executive Intent** semantic layer and make the platform **self-describing** before dashboard work. The dashboard becomes a projection of the atlas — not another independently maintained UI.

```txt
Intent → Question → Capability → Workflow → Route
```

---

## Deliverables

| Engine | Deliverable |
| ------ | ----------- |
| ENG-INT-001 | Executive Intent registry (7 intents) + intent graph + `resolveExecutiveIntentChain()` |
| ENG-COP-001 | Capability states, readiness, dependency health graph, recommendation graph |
| ENG-ATL-001 | Executive Capability Atlas (auto-generated markdown + JSON API) |

---

## APIs

```txt
GET  /api/integration/intent-graph
GET  /api/integration/intent?q=
GET  /api/integration/capability-states
GET  /api/integration/atlas
POST /api/integration/atlas/generate
```

---

## Generate atlas

```bash
npm run atlas:generate -w @localbrain/backend
```

---

## Acceptance

```txt
[ ] Seven intents registered with question + capability links
[ ] Intent chain resolves organize / plan / decide queries
[ ] Dependency health graph for WF-MIG-001
[ ] Recommendation graph produces highest-value action
[ ] Atlas covers all CAPABILITY_REGISTRY entries with identity four-tuple
[ ] Graph integrity certification still PASS
[ ] No new doctrine · no Phase 2 cognitive code
```

---

*Burt packet · LB-OS-026.65*
