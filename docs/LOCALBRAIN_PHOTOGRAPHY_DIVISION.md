# LocalBrain Photography Division v1.0

> **Pillar 17 · Media department — Photography Chief.**  
> Organization: [Department Organization](./LOCALBRAIN_DEPARTMENT_ORGANIZATION.md)

---

## Mission

Photography workflow as a **department** under Media / alongside Podcast — not a loose folder of tools.

```txt
Photography Chief → specialists → deliverables → Chief of Staff → Steve
```

---

## Workflow map

```txt
Photography Chief
├── Lightroom workflow
├── Photo culling
├── Metadata & keywords
├── Lens corrections
├── Batch exports
├── Gallery publishing
├── Client delivery
└── Archive management (H:)
```

---

## Track A (now — CPU)

```txt
H: folder structure · project registry entry per shoot/client
Cull lists (AI-suggested from filenames/dates — cloud vision optional)
Metadata checklists · export presets documented
Delivery manifest templates · client handoff approval
Integration with Living Workspace (shoot = workspace type)
```

**Slice:** LB-OS-093 stub — routes, chief agent, workflow templates.

---

## Track B (GPU — later)

```txt
Local image enhancement · semantic image search
AI tagging · duplicate detection
Face grouping (policy-gated, opt-in)
Editing presets · AI-assisted masking
Batch inference on GPU server
```

Swap implementations behind `IPhotographyPipeline` interface — no studio redesign.

---

## Chief agent

```txt
id: photography_chief
reports_to: chief_of_staff
department: photography
capabilities: classification, vision (when live), planning
```

---

*Photography division v1.0 · Pillar 17 · 2026-06-28*
