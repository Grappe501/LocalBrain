# LB-OS-PROD-002–006 — Reserved Product Arc

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


> **Depends on:** LB-OS-PROD-001 ✅  
> **Rule:** Reserve only — no connectors, no license enforcement, no ingestion, no mobile shell in this pass  
> **Build order:** Empty brain → License → Provider vault → Ingestion planner → Memory OS

---

## Product sequence (binding)

```txt
Empty brain first (PROD-001)
  → License gate (PROD-002)
  → Provider vault (PROD-001 / 026.9)
  → Local drive scan (PROD-005)
  → Google Drive (PROD-005)
  → Gmail / Calendar / Contacts (PROD-005)
  → Mobile import (PROD-005 / PROD-006)
  → Memory OS builds user-specific structure
```

Social (PROD-003) and Media Studio (PROD-004) sit under Communications / Media Office / Chief of Staff — **ENC → DPEC → connector**.

---

## LB-OS-PROD-002 — License & Subscription Gate

**Capability:** `CAP-FUT-LIC-001`

### Expired license behavior

```txt
User CAN:
  · view existing local data
  · export existing local data

User CANNOT (until valid license):
  · AI calls
  · outbound communications
  · connector sync
  · new ingestion

Hard rule: no data deletion on expiry
```

### Forever entitlements

```txt
STEVE-LIFETIME
KELLY-LIFETIME
```

Stored as **signed license records bound to Executive Identity** — not hardware, not plain text in repo. Flow:

```txt
Steve Lifetime License → Steve Identity → current authority holder (primary server)
```

Hardware replacement re-binds the same identity — no re-purchase.

---

## LB-OS-PROD-003 — Social Media Connector Registry

**Capability:** `CAP-FUT-SMC-001`

**Owning departments:** Communications · Media Office · Chief of Staff

**Governance:** ENC → DPEC → connector

### Reserved platforms

```txt
Facebook Pages · Instagram · YouTube · TikTok · X · LinkedIn
BlueSky · Threads · Google Business · Campaign pages · Business pages
```

No OAuth, no posting, no sync in reserve pass.

---

## LB-OS-PROD-004 — Media Studio / Creative Workbench

**Capability:** `CAP-FUT-MST-001`

```txt
Images · Video · Captions · Clips · Brand kits
Plain-language editing instructions
Deployment checklist
Approval before posting
```

Tied to Communications / Media Office. Outbound posts require approval + valid license + DPEC tier.

---

## LB-OS-PROD-005 — Universal Device + Drive Ingestion Planner

**Capability:** `CAP-FUT-ING-001`

Planner only — execution remains `CAP-FUT-UDI-001` post–Memory OS gate.

```txt
Local drive scan
Google Drive
Gmail / Calendar / Contacts
Mobile device import
ChatGPT export (planner stage)
```

**Hard boundary:** no ingestion until empty brain + license gate pass. No person-specific Memory OS until packaging complete.

---

## LB-OS-PROD-006 — Mobile / Tablet Access Shell

**Capability:** `CAP-FUT-MOB-001`

```txt
Local web app / PWA served from user's LocalBrain machine
Accessible on same network (LAN)
Later: remote via VPN
```

**Doctrine:** Build privacy, encryption, redaction, and controlled disclosure — **not** evasion of platform rules or carrier/server infrastructure.

---

## Out of scope (all PROD-002–006)

- License verification implementation
- Social OAuth or posting
- Media editing UI
- Drive/Gmail sync
- PWA manifest / service worker
- Plain-text lifetime codes in repo

---

## Registry

| Slice | Capability ID | Route (future) |
| ----- | --------------- | -------------- |
| PROD-002 | CAP-FUT-LIC-001 | `/future/license` |
| PROD-003 | CAP-FUT-SMC-001 | `/future/social-connectors` |
| PROD-004 | CAP-FUT-MST-001 | `/future/media-studio` |
| PROD-005 | CAP-FUT-ING-001 | `/future/ingestion-planner` |
| PROD-006 | CAP-FUT-MOB-001 | `/future/mobile-access` |

See also: [LB-OS-PROD-007 — Instance Identity & Single-Primary](./LB-OS-PROD-007-reserved.md) · [LB-OS-PROD-008–009 — Authority & Passport](./LB-OS-PROD-008-009-reserved.md)
