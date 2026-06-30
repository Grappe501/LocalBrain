# LB-OS-PROD-007 — Instance Identity, Transfer, and Single-Primary Enforcement

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


> **Depends on:** LB-OS-PROD-001 ✅ · LB-OS-PROD-002 (license — reserved)  
> **Evolution:** [PROD-008](./LB-OS-PROD-008-009-reserved.md) elevates this to **one authority** — primary server = current authority holder  
> **Blocks:** Multi-primary same identity · uncontrolled server duplication  
> **Rule:** Reserve only — no identity certificate, transfer bundle, or session registry in this pass

---

## Mission

Enforce **one authoritative identity** with **one ACTIVE_PRIMARY authority** at a time until multi-instance behavior is intentionally designed. The primary server is the current authority holder — not permanent hardware lock-in. Protects licensing, memory integrity, and data sovereignty.

Kelly and Chris each get their own LocalBrain identity — **one authority, many client devices**.

**Capability:** `CAP-FUT-IDT-001`  
**Route (future):** `/future/instance-identity`

---

## Single-primary rule

```txt
One person / organization = one active primary LocalBrain.
Multiple devices may access it.
Multiple primary servers may not run independently.
```

### Allowed

```txt
Steve's LocalBrain server + Steve laptop / iPad / phone as clients
```

### Not allowed yet

```txt
Steve LocalBrain server A and Steve LocalBrain server B both acting as primaries
```

**Core lock:**

```txt
Only one instance can hold ACTIVE_PRIMARY at a time for a given identity.
```

Multi-brain **sharing** (`CAP-FUT-MBS-001` · LB-OS-027.1) is governed packets between **distinct identities** — not two primaries for the same person.

---

## License / identity states

| State | Meaning |
| ----- | ------- |
| `ACTIVE_PRIMARY` | Sole live primary for this identity — full entitled operations |
| `TRANSFER_PENDING` | Old server mid-transfer; new server not yet activated |
| `READ_ONLY_ARCHIVE` | Former primary after successful transfer — view/export only |
| `REVOKED` | License or identity revoked — gated per `EXPIRED_LICENSE_POLICY` |
| `RECOVERY_MODE` | Break-glass recovery path — audit-heavy, limited writes |

---

## Remote login (distant devices)

Require a **fresh encrypted session** every time a distant device connects.

```txt
Device registration
Encrypted session
Short-lived access token
Refresh token rotation
Device fingerprint
Remote logout
Session audit log
```

### Eventual posture

```txt
Trusted LAN access
VPN-only remote access
No public admin panel by default
```

Ties to **PROD-006** (Mobile PWA) — clients connect to the single primary; they do not become primaries.

---

## Primary Instance Transfer workflow

```txt
Old server
  → create signed transfer bundle
  → export encrypted brain snapshot
  → mark old instance as TRANSFER_PENDING
  → import on new server
  → verify integrity
  → activate new primary (ACTIVE_PRIMARY)
  → old primary becomes READ_ONLY_ARCHIVE
```

Transfer bundles are **signed and encrypted** — same posture as license records (no plain-text secrets in repo).

---

## Builds (when slice is earned)

```txt
Instance identity certificate
Device / session registry
Primary-instance lock
Encrypted transfer bundle
Read-only old instance mode
Activation challenge
Transfer audit log
```

---

## Product sequence placement

```txt
PROD-001 Empty brain onboarding ✅
PROD-002 License gate (reserved)
PROD-007 Instance identity + single-primary (reserved)  ← operational enforcement
PROD-008 Executive Identity Authority (reserved)        ← certificates, recovery, snapshots, signing root
PROD-009 Executive Passport (reserved)                    ← inter-brain trust handshake
PROD-006 Mobile PWA clients (reserved)                  ← consumes PROD-007 sessions
PROD-005 Ingestion planner (reserved)
```

---

## Out of scope

- Identity certificate implementation
- Primary lock enforcement in runtime
- Transfer bundle crypto
- Device registry database
- Session token issuance
- Automatic retirement of duplicate primaries

---

## Registry

| Slice | Capability ID | Route (future) |
| ----- | --------------- | -------------- |
| PROD-007 | CAP-FUT-IDT-001 | `/future/instance-identity` |
