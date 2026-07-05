# ILG-001 — Institutional Ledger (Reservation)

> **Slice:** `ILG-001`  
> **Status:** 🔒 **RESERVED** · Do not implement during PRL-4  
> **Vision:** [Digital Institution Charter](./DIGITAL-INSTITUTION-CHARTER.md)  
> **Trust domain:** **Governance Trust** (with EPO-001) — *What defines this institution?*

---

## Mission (reserved)

> Preserve the organization's memory — decisions, doctrine, evidence, and reasoning — as a searchable canonical ledger, without requiring institutional bureaucracy.

This is the **Institutional Ledger**: what defines the institution itself, distinct from personal brainstorming and project workspaces.

> **The institution owns the work; the ledger preserves the authorship.**

Authorship is **permanent** in the ledger. Access is **revocable** when sponsorship ends. Never conflate the two.

> **Contributions become institutional assets upon contribution unless explicitly designated as personal.**

---

## Scope — what belongs in the Institutional Ledger

| Category | Examples (exist today as docs · reserved as canonical ledger) |
| -------- | ------------------------------------------------------------- |
| Policies & constitutions | UCIE Constitution · Contact governance · VOP charter |
| Architectures | Governed Platform Architecture · trust domain definitions |
| Certified doctrine | Eleven frozen doctrines · CPAT · PRL gates |
| Major decisions | ADRs · disposition records · OEC outcomes |
| Approved releases | Reference pattern certifications · readiness levels |
| Operator evidence | Evidence packages · scoreboard · walkthrough records |
| Meeting outcomes | Governed decisions · not personal notes |

**Not in scope:** Kelly's debate prep (Personal Ledger) · County Fair Planning (Workspace Ledger) · live contact records (Campaign Services).

---

## GitHub as canonical ledger (reserved)

Same pattern as WSP-001, different scope:

| Role | Responsibility |
| ---- | -------------- |
| **GitHub** | Canonical institutional ledger — immutable commit chain · attribution · review · audit |
| **LocalBrain** | Living interface — AI orchestration · operator workflows · governance surfaces · EPO (when built) |

GitHub is **not merely storage**. It is the **proof layer** for institutional memory.

LocalBrain is how the institution **lives and operates** day to day.

---

## Institutional reasoning (future capability)

When implemented, the Institutional Ledger enables queries beyond keyword search:

- *"Show me every decision that led to this architecture."*
- *"When did we first adopt Protect the Evidence?"*
- *"What operator evidence caused this workflow to change?"*
- *"Which doctrines were active when VOP-001 was certified?"*

This requires governed linking between decisions, evidence, doctrine versions, and outcomes — not a single merged RAG index.

---

## Three-ledger placement

```text
Personal Ledger          Workspace Ledger         Institutional Ledger
(LocalBrain · private)   (WSP-001 · invited)      (ILG-001 · organization)
        │                        │                          │
        └────────────────────────┴──────────────────────────┘
                                 │
                    explicit export / promotion only
                                 │
                                 ▼
                    Campaign Services (UCIE · Contact · VOP)
```

Nothing promotes upward silently. Personal → workspace → institutional requires **explicit governed promotion**.

---

## Relationship to EPO-001

| Subsystem | Role |
| --------- | ---- |
| **ILG-001** | Canonical memory — what the institution decided and why |
| **EPO-001** | Governance operations — health, readiness, disposition, platform audit |

EPO **reads and governs** the Institutional Ledger. It does not replace it.

Much of today's institutional memory already lives in `docs/` — ILG-001 reserves making it **canonical, versioned, attributable, and searchable** via the GitHub ledger pattern.

---

## Dependencies (before build)

| Dependency | Status |
| ---------- | ------ |
| Three trust domains certified | ✅ |
| EDD · OEC · doctrine corpus established | ✅ |
| WSP-001 reservation understood | 🔒 Architecture only |
| EPO-001 reservation understood | 🔒 Architecture only |
| PRL-4 operator validation | ⏳ Current gate |
| Institutional memory retrieval evidence | 🔒 Future gate |

**Gate:** Do not start ILG-001 until operator evidence demonstrates need for institutional reasoning retrieval — *"why did we decide?"* · *"where is the evidence?"* — not speculative ledger infrastructure.

---

## Reservation record

| Date | Action |
| ---- | ------ |
| 2026-07-05 | Digital Institution vision articulated |
| 2026-07-05 | Three-ledger model: Personal · Workspace · Institutional |
| 2026-07-05 | GitHub as canonical ledger · LocalBrain as living interface |
| 2026-07-05 | ILG-001 reserved · PRL-4 freeze honored |
| 2026-07-05 | Access vs authorship · contribution doctrine · permanent provenance |

---

*ILG-001 Reservation · LocalBrain · 2026*
