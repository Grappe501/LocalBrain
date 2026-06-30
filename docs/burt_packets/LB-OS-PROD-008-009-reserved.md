# LB-OS-PROD-008–009 — Executive Authority & Passport

> **Depends on:** LB-OS-PROD-007 (single-primary / transfer — reserved)  
> **Evolution:** One server → **one authority** — enterprise reliability without breaking single-primary  
> **Rule:** Reserve only — no authority election, snapshot automation, or passport handshake in this pass

---

## From "one server" to "one authority"

```txt
Old framing:  One LocalBrain = One Server
New framing:  One LocalBrain = One Authoritative Identity
```

The primary server is simply the **current authority holder** for that identity. Authority may move via controlled transfer or disaster recovery — no duplicated brains, no divergence.

---

## Authority hierarchy

```txt
Executive Identity
        │
        ▼
Identity Certificate
        │
        ▼
Authoritative Brain  (one ACTIVE_PRIMARY at a time)
        │
 ┌──────┼──────────┐
 │      │          │
Laptop  Phone     iPad
(client devices — never authorities)
```

Nothing requires authority to stay on the same hardware forever.

---

## LB-OS-PROD-008 — Executive Identity Authority

**Capability:** `CAP-FUT-EIA-001`  
**Route (future):** `/future/executive-authority`

### Owns (everything else depends on it)

```txt
Identity certificates
Authority election
Transfer authority
Disaster recovery
Automatic encrypted snapshots
Cryptographic signing root
```

### Encrypted snapshot chain

```txt
Active Brain
  → Encrypted Snapshot
  → Encrypted Backup
  → Optional Offline Copy
```

**Snapshot rule (binding):**

```txt
Snapshots are NEVER active.
They cannot answer questions.
They cannot generate AI.
They cannot communicate.
They are insurance only.
```

### Disaster recovery

```txt
Server dies
  → Restore encrypted snapshot
  → Verify integrity + signatures
  → Activate authority
  → Resume working
```

No duplicated brains. No divergence. Just a new authority holder for the same identity.

### License binding (identity, not hardware)

```txt
Steve Lifetime License
  → Steve Identity
  → Current Primary Server (authority holder)
```

Not: `Steve Lifetime License → Dell Server #4`

Hardware replacement re-binds the same identity — no re-purchase pain.

---

## LB-OS-PROD-009 — Executive Passport

**Capability:** `CAP-FUT-PSP-001`  
**Route (future):** `/future/executive-passport`

Every LocalBrain carries a passport containing:

```txt
Identity · public certificate · capabilities · version
Trust level · office structure · permissions
```

### Inter-brain handshake

```txt
Brain A
  → Handshake
  → Passport exchange
  → Trust verification
  → Workspace permissions
  → Encrypted session
```

Scales multi-brain collaboration without custom integrations per connection.

Ties to **CAP-FUT-MBS-001** (Multi-Brain Workspace Sharing · LB-OS-027.1):

```txt
Steve Brain ──┐
Kelly Brain ──┼── Campaign Workspace ── Chris Brain
              │
Each brain: private memory (never leaks)
Workspace: project objects only — approved sync
```

---

## Long-term architecture stack

```txt
Executive Identity
        │
Executive Passport
        │
Authority Certificate
        │
Authoritative Brain
        │
Executive Office
        │
Institution
        │
Memory OS
        │
World Model
        │
Chief of Staff
        │
Departments
        │
Providers  ← replaceable infrastructure, not the center
```

LocalBrain becomes a **personal operating system for executive institutions** — AI models, email, calendars, and voice engines are plugins beneath the institution.

---

## Signed object doctrine (implementation gate)

When PROD-008+ is built, **every object** is cryptographically signed:

```txt
Memories · decisions · messages · workspace updates · transfers
Snapshots · passport packets · license records
```

Enables end-to-end integrity verification, strong audits, and trusted sync between separate identities without blind trust.

---

## Product sequence

```txt
PROD-001 Empty brain ✅
PROD-002 License (identity-bound) — reserved
PROD-007 Single-primary + transfer — reserved
PROD-008 Executive Identity Authority — reserved  ← foundational
PROD-009 Executive Passport — reserved
PROD-006 Mobile clients — reserved (clients to authority)
027.1 Multi-brain workspace — reserved (passport + workspace sync)
```

---

## Registry

| Slice | Capability ID | Route (future) |
| ----- | --------------- | -------------- |
| PROD-008 | CAP-FUT-EIA-001 | `/future/executive-authority` |
| PROD-009 | CAP-FUT-PSP-001 | `/future/executive-passport` |

See also: [LB-OS-PROD-007 — Single-Primary](./LB-OS-PROD-007-reserved.md)
