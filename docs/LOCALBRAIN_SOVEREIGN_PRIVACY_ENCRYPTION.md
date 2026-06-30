# Sovereign Privacy & Encryption Layer (LB-OS-03X — reserved)

> **Status:** Future / Planned · Infrastructure Reserved · **Build encryption in from the start**  
> **Framing:** Data Sovereignty & Exposure Control — **not** invisibility  
> **Capabilities:** `CAP-FUT-ENC-001` · `CAP-FUT-PRV-001`  
> **Slices:** `LB-OS-03X-ENC` · `LB-OS-03X-DPEC`

## Hard boundary

LocalBrain must **not** be designed to bypass lawful networks or evade security systems.

We build:

```txt
Privacy · Encryption · Least disclosure · User-controlled exposure
```

---

## LocalBrain Privacy Core

Reserved infrastructure (LB-OS-03X-ENC):

```txt
Encryption at rest
Encrypted SQLite / Postgres fields
Encrypted local file vault
Encrypted credential vault
Per-workspace encryption keys
Encrypted backups
```

Reserved exposure control (LB-OS-03X-DPEC):

```txt
AI disclosure ledger
Sensitive-context classifier
Redaction before provider calls
Provider routing by privacy tier
Local-first model routing
Audit log of every external disclosure
```

---

## Core rule (binding)

```txt
LocalBrain never sends whole-world context externally.
External AI sees only the smallest approved packet needed for the task.
```

Operational principle:

> Send less, sanitize more, log everything, keep sensitive reasoning local.

Provider-splitting across vendors can reduce full-picture exposure to any one provider, but **increases attack surface**. Prefer minimum packets over multi-provider context scattering.

---

## External AI packet path

NOT:

```txt
Full project → OpenAI
```

LocalBrain path:

```txt
Local memory / search first
        ↓
Extract minimum needed context
        ↓
Redact identity / secrets
        ↓
Send only small task-specific packets
        ↓
Log exactly what left the machine
```

---

## Privacy tiers

| Tier | Label | Routing | Examples |
| --- | --- | --- | --- |
| **0** | Never leaves machine | Local only · no external API | Health, finance, passwords, private family, raw strategy |
| **1** | Local model only | On-prem / local LLM | Sensitive drafts, internal campaign strategy, private memory |
| **2** | Redacted external AI allowed | Sanitized packet · logged disclosure | Generic coding, sanitized summaries, non-sensitive analysis |
| **3** | Public-safe | External OK · still logged | Published content, press releases, public docs |

CoS and the sensitive-context classifier assign tier before any provider call.

---

## LB-OS-03X-ENC — Encryption, Key Vault, and Sovereign Routing

**Capability:** `CAP-FUT-ENC-001`

Foundation for all sovereign storage and key material. Gates every connector and provider integration.

```txt
Per-workspace keys · Credential vault · Encrypted fields · Encrypted file vault · Encrypted backups
```

---

## LB-OS-03X-DPEC — Digital Privacy & External Exposure Control

**Capability:** `CAP-FUT-PRV-001`

Policy and routing layer atop ENC — classifies, redacts, routes, and logs.

Depends on `CAP-FUT-ENC-001` for vault and key material.

---

## GPU server launch posture (reserved)

When the hardened local server arrives:

```txt
Hardened Linux server
Full-disk encryption
Local network only by default
Firewall deny-by-default
VPN-only remote access
Encrypted backups
No exposed admin panels
Provider keys stored in vault
Local model routing for Tier 0–1 work
```

---

## Staging rule

```txt
ENC before DPEC enforcement · DPEC before any external connector goes live
Every provider call passes: classify → tier → redact → minimum packet → log
No Phase 2 cognitive code until Convention gate — doctrine and registry only now
```

---

*Doctrine · LB-OS-03X family · complements [Executive North Star](./LOCALBRAIN_EXECUTIVE_NORTH_STAR.md)*
