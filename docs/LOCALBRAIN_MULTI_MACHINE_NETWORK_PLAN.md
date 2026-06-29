# LocalBrain Multi-Machine Network Plan

> **Future expansion arc** — documented 2026-06-28. **Not in V1 scope.**  
> Build local single-user first. Design for multi-machine later. Do not complicate V1 with networking.

---

## Vision

One **LocalBrain server brain** serves a network of machines. Each computer contributes drives, folders, usage signals, assets, and projects. The Chief of Staff sees the **whole network** — not one laptop in isolation.

```txt
One LocalBrain server brain
↓
Multiple computers connect
↓
Each computer contributes drives, folders, usage, assets, projects
↓
Chief of Staff sees the whole network
```

---

## Connection options

| Medium | Suitability |
|--------|-------------|
| Ethernet | Best — stable, fast, ideal for sync and indexing |
| Wi-Fi | Good — acceptable for metadata and light sync |
| Bluetooth | Possible — not ideal for file/data sync at scale |

---

## Target topology (future)

```txt
Linux GPU server  = brain + database + indexes + model runtime
Windows desktops  = clients + local drive agents
Laptops           = clients + offline-capable cache
```

The server holds authoritative registry, orchestration, and learning data. Clients run **drive agents** that report metadata and execute approval-gated actions locally.

---

## Operational loop (unchanged)

Every capability on every machine still follows:

```txt
Observe → Understand → Plan → Recommend → Approve → Execute → Verify → Learn
```

Network expansion adds **Observe** sources (remote drives, sync health) and **Verify** across devices — not a bypass of approval gates.

---

## Related future docs

| Doc | Focus |
|-----|--------|
| [Shared Server Brain](./LOCALBRAIN_SHARED_SERVER_BRAIN.md) | Server/client roles, APIs, sync doctrine |
| [Network Device Dashboard](./LOCALBRAIN_NETWORK_DEVICE_DASHBOARD.md) | UI for all machines and drives |
| [Google Drive Archive Plan](./LOCALBRAIN_GOOGLE_DRIVE_ARCHIVE_PLAN.md) | Cloud cold storage layer |
| [Team Workspace Model](./LOCALBRAIN_TEAM_WORKSPACE_MODEL.md) | Multi-user permissions and audit |

---

## Future slices (post–V1)

| Slice | Name |
|-------|------|
| LB-OS-107 | Multi-machine doctrine |
| LB-OS-108 | LocalBrain server/client topology |
| LB-OS-109 | Network device registry |
| LB-OS-110 | Remote drive knowledge source |
| LB-OS-111 | Google Drive archive connector |
| LB-OS-112 | Team workspace permissions |
| LB-OS-113 | Multi-user audit trail |
| LB-OS-114 | Network operations dashboard |

**Gate:** None until V1 ship (LB-OS-016) and personal OS cutover arc are stable.

---

## V1 rule

```txt
Build local single-user first.
Design for multi-machine later.
Do not complicate V1 with networking yet.
```

Current LB-OS-011 System Health dock monitors **this machine only**. Network sections are placeholders in the future dashboard spec.

---

*Future arc · Multi-Machine & Cloud Archive · Planning only*
