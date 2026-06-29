# LocalBrain Shared Server Brain

> **Future architecture** — one authoritative brain, many connected machines. Planning only.

---

## Role split

### Server brain (authoritative)

- SQLite/Postgres registry and decision data
- Digital Asset Registry master index
- Chief of Staff orchestration pipeline
- Approval queue and action log (network-wide)
- Intelligence refresh and duplicate detection
- Model routing (GPU server when available)
- Learning outcomes (`cos_outcomes`, future verify records)

### Client agents (contributors)

- Local permission engine for **that machine's** allowed roots
- Drive metadata reporter (paths, sizes, mtimes — no bulk upload without approval)
- Executes approved actions only on local filesystem
- Caches read-only summaries for offline CommandBar
- Reports machine health to server (`/api/system/health` equivalent)

---

## Connection model

```txt
Client                          Server brain
──────                          ────────────
Drive agent  ──metadata/sync──►  Registry merge
Health ping  ──every N sec────►  Network device registry
CoS command  ──REST/WebSocket─►  Orchestration pipeline
Approved act ◄──proposal id────  Actions queue (user approves on any client)
```

Preferred transport: **HTTPS on LAN** (Ethernet). TLS optional on trusted home network; required if exposed beyond LAN.

---

## Best future setup

```txt
Linux GPU server  = brain + database + indexes + Ollama/vLLM
Windows desktop   = primary UI + H:/ drive agent
Laptop            = mobile UI + selective sync
```

Aligns with Phase 8 GPU migration (LB-OS-062) and Neural Lab (LB-OS-066+).

---

## What the server must never do

- Silent writes on any client filesystem
- Permanent deletes without quarantine + backup
- Auto-sync without user-visible proposals
- Bypass per-machine permission roots

Same guardrails as LB-OS-010 — extended with **device_id** on every proposal.

---

## Slice mapping

| Slice | Deliverable |
|-------|-------------|
| LB-OS-107 | Doctrine + threat model (this doc formalized) |
| LB-OS-108 | Server binary, client agent, handshake, auth stub |

---

## Dependencies

- LB-OS-106 module loader (complete)
- LB-OS-010 approval engine (complete)
- LB-OS-011 operations observability (complete — per-machine today)

---

*Future arc · Shared Server Brain · Planning only*
