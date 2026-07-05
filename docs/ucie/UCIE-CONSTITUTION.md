# UCIE-CONSTITUTION — Identity Acquisition Doctrine

> **Type:** UCIE design constitution  
> **Status:** **ACTIVE** · **Certified doctrine frozen** · 2026-07-05  
> **Scope:** Intake, staging, resolution, provenance, commit gate — not relationship cultivation  
> **Peers:** [UCIE Architecture](./UCIE-ARCHITECTURE.md) · [UCIE ADRs](./UCIE-DECISION-RECORDS.md) · [Contact v3 Constitution](../contact-management/slices/CONTACT-V3-CONSTITUTION.md) (relationship doctrine — separate)

---

## What this is

UCIE governs **how identities enter** LocalBrain. Contact Management governs **how relationships are cultivated** after identity exists.

When a proposal arrives, the first question is: *Does it uphold identity acquisition doctrine without disturbing the certified relationship core?*

---

## Core principles

### Principle 1 — Accuracy before volume

Import throughput is worthless if identity integrity fails. Staging, review, and resolution gates exist to protect trust.

---

### Principle 2 — Stage, don't commit

Nothing writes directly to canonical contact tables. Every import produces an **Import Session**. Rows remain staged until resolution completes.

---

### Principle 3 — Provenance, always

Every canonical field must know where it came from: source, uploader, timestamp, confirmation chain. No mystery data.

---

### Principle 4 — Evidence before merge

Identity matching cites evidence: phone, email, name, address, household, organization, voter record, historical aliases. No merge below approved confidence threshold.

---

### Principle 5 — Humans resolve ambiguity

Uncertain matches become **work items** — claimable, auditable, never silent failures. Volunteers and managers participate; the system does not guess.

---

### Principle 6 — Explainability by design

Every match decision, schema mapping, and commit action is traceable. Reviewers can answer *why* without opaque model output.

---

### Principle 7 — Respect the relationship core

UCIE consumes Contact Management Identity Engine through an explicit commit adapter. UCIE does not duplicate stewardship, context, timeline, or intelligence state.

---

## Alignment with Contact Management v3

| Contact v3 principle | UCIE posture |
| -------------------- | ------------ |
| Evidence before inference | Match evidence required; schema confidence explicit |
| Humans remain responsible | Work marketplace; no auto-merge below threshold |
| Relationships are the product | UCIE delivers **trusted identities** so relationship engines can operate |

---

## Certified implementation doctrine (2026-07-05)

| # | Principle | Meaning |
| - | --------- | ------- |
| 1 | **Stage, don't commit** | Session-first intake; canonical writes only through commit adapter |
| 2 | **Provenance, always** | Field-level source chain — no mystery data |
| 3 | **Review before merge** | Uncertain matches become work; no silent merges |

Clone UCIE conventions from [CONTACT-V3-100](./CONTACT-V3-100-IDENTITY-ACQUISITION-PLATFORM.md) unless an ADR documents deviation.

---

*UCIE Constitution · LocalBrain · 2026*
