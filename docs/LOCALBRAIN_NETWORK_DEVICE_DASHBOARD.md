# LocalBrain Network Device Dashboard

> **Future UI** — extends LB-OS-011 System Health & Operations Center to the full network.

---

## Purpose

When multi-machine mode ships (LB-OS-114), the dashboard becomes the **network operations view** — one place to see every machine, drive, sync path, and archive status.

Today (LB-OS-011): **this machine only** + status dock. Network sections below are **specified, not built**.

---

## Dashboard sections (future)

```txt
This machine
GPU server
Laptop
External drives
Shared folders
Network drives
Google Drive archive
Backup status
Sync health
```

---

## Section detail

### This machine

Current LB-OS-011 panels: Machine, Storage, AI, Operations, Executive stub.

### GPU server

- CPU/GPU utilization, VRAM, model runtime status
- Index master, database size, orchestration queue depth
- Link to Neural Lab when LB-OS-066+ ships

### Laptop / other clients

- Last seen, agent version, pending local proposals
- Drive roots registered, health ping latency

### External drives

- Mount status, free space, index coverage
- Local-only asset warnings

### Shared folders & network drives

- SMB/NFS path health, permission check results
- Read-only vs read-write scope (write always via approval)

### Google Drive archive

- Connector status, last metadata sync
- Archive vs local-only counts
- See [Google Drive Archive Plan](./LOCALBRAIN_GOOGLE_DRIVE_ARCHIVE_PLAN.md)

### Backup status

- `backup_records` across devices
- Quarantine inventory
- Failed backup alerts

### Sync health

- Index freshness per device
- Stale registry rows
- Verify failures (post-execution checks)

---

## UI rules (inherit from status dock)

```txt
Always visible summary (network dock evolution of SystemStatusDock)
Tiny when collapsed
Non-distracting
Expandable to full dashboard
Color-coded only when attention needed
Read-only in first network slice — no remote kill/restart
```

---

## Operational Health Score (network)

Future composite extends LB-OS-011 stub with:

- Worst machine health across fleet
- Sync staleness penalty
- Local-only asset risk
- Team approval backlog (when LB-OS-112 ships)

Executive Briefing morning number becomes **network Operational Health Score**.

---

## Slice

**LB-OS-114 — Network operations dashboard**

Depends on: LB-OS-109 (device registry), LB-OS-110 (remote drives), LB-OS-111 (Drive), LB-OS-011 (current ops center).

---

*Future arc · Network Device Dashboard · Planning only*
