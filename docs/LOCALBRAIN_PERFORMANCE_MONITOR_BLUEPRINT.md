# LocalBrain Performance Monitor Blueprint v1.0

> **Pillar 10 · Layer 4:** CPU, RAM, disk pressure, startup/load issues.  
> Doctrine: [System Optimization Doctrine](./LOCALBRAIN_SYSTEM_OPTIMIZATION_DOCTRINE.md) · SysAdmin: [System Admin Partner Model](./LOCALBRAIN_SYSTEM_ADMIN_PARTNER_MODEL.md) · Queue: [LB-OS-035–036](./LOCALBRAIN_BUILD_SLICE_QUEUE_V2.md#phase-5--system-optimization--performance-command-center-lb-os-031038)

---

## Purpose

LocalBrain monitors machine health so Steve sees **pressure before pain** — observe and advise first, act only with approval.

```txt
CPU · RAM · disk usage · disk pressure · system uptime · high-load processes · startup/load issues
```

---

## Metrics (Bootstrap → Full)

| Metric | Bootstrap (LB-OS-007) | Full (LB-OS-035) |
|--------|----------------------|------------------|
| CPU % | Snapshot | History + trends |
| RAM used / total | Snapshot | History + alerts |
| C: / H: disk % | Snapshot | Per-drive trends |
| System uptime | — | Yes |
| Top processes by CPU/RAM | — | LB-OS-036 |
| Startup program review | — | Advisory only (036) |

**Rule:** No process kill · no service disable · no registry edits in V1.

---

## Reports (Read-Only First)

```txt
RAM/CPU/disk health report
High-load process list (advisory)
Disk pressure warnings (especially C:)
Suggested actions: "close X", "review startup Y" — proposals only
Risk level per suggestion
```

Part of unified optimization flow — never the first destructive step.

---

## UI Surfaces

| Surface | Slice | Content |
|---------|-------|---------|
| **Performance Health** card | 002 stub · 007 partial · 035 live | CPU/RAM/disk gauges |
| System health (settings/sys) | 007 | Basic endpoint-driven view |
| Process advisor | 036 | Top processes, startup suggestions |
| System efficiency dashboard | 038 | All four optimization cards unified |

**LB-OS-002 placeholder:** **Performance Health** card — "Not connected" until LB-OS-007/035.

---

## Workflow Position

```txt
…
Large folder report
↓
C:/ vs H:/ placement report
↓
RAM/CPU/disk health report    ← this blueprint
↓
Optimization plan
↓
Approval-gated cleanup actions
```

Performance findings may **inform** cleanup priority (e.g. C: pressure) but do not bypass approval gates.

---

## API / Backend

```txt
backend/src/system/healthMonitor.ts   — LB-OS-007 bootstrap
backend/src/system/processAdvisor.ts — LB-OS-036 advisory
GET /api/system/health              — current snapshot
GET /api/system/health/history      — LB-OS-035
GET /api/system/processes           — LB-OS-036 read-only
```

Store history in SQLite `system_metrics` table · see [Database Schema](./LOCALBRAIN_DATABASE_SCHEMA.md).

---

## Advisory Examples (Not Auto-Actions)

```txt
"Chrome using 4.2 GB RAM — consider closing unused tabs"
"C: at 92% — review cache cleanup proposals in Storage Health"
"Node.exe × 3 — dev servers may be orphaned"
"5 startup items — review list (advisory)"
```

Each links to relevant optimization card or proposed action when available.

---

## Later (Post–038)

```txt
Service monitoring · cache cleanup automation · dev environment repair
Local model RAM budgeting · backup schedule under disk pressure
```

Advise and monitor first — automation only with explicit policy + approval.

---

*Performance monitor blueprint v1.0 · prerequisite for LB-OS-002 · 2026-06-28*
