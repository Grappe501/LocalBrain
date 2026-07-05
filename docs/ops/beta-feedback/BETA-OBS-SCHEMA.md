# BETA-OBS — Beta Evidence Session Schema

> **Type:** Canonical beta evidence · institutional knowledge · not meeting notes  
> **Authority:** [ENG-BETA-001.5](../../commercial-beta/ENG-BETA-001.5-FEEDBACK-ISSUE-TRIAGE.md) · [ENG-BETA-001.4](../../commercial-beta/ENG-BETA-001.4-BETA-ONBOARDING.md)  
> **Registry:** [Evidence Ledger](./EVIDENCE-LEDGER.md)  
> **Status:** Binding for all pilot phases A–C

---

## Purpose

The repository originally produced evidence about **software**. During Commercial Beta preparation it produces evidence about **people interacting with software**.

That is a fundamentally different kind of institutional knowledge. Preserve it with the same care as engineering evidence.

**BETA-OBS** session records are the **canonical beta evidence artifact**. They complement engineering history — together they tell the complete V1 story: not only that LocalBrain worked as designed, but that real users could discover and use what the architecture made possible.

Organize by **evidence**, not by bug. Not every important finding is a difficulty — capture **positive evidence** when the architecture succeeds.

---

## Think in hypotheses

The session does not test software. It tests **hypotheses**.

Each W-001 journey step carries a hypothesis (H-001 … H-007). Evidence either **supports** or **weakens** it.

| ID | Journey step | Hypothesis |
| -- | ------------ | ---------- |
| **H-001** | Welcome | User understands purpose and where to begin without architecture explanation |
| **H-002** | Workspace | User enters workspace without assistance |
| **H-003** | Contacts | User recognizes **Contacts** as the place to create a person |
| **H-004** | Communications | User generates an evidence-backed draft linked to the contact |
| **H-005** | Review | User understands advisory posture without being taught architecture |
| **H-006** | Follow-up | User records outreach without expecting automated send |
| **H-007** | Return | Work persists · user resumes without re-creating data |

---

## Keep architecture out of the room

During Phase A, **do not explain**:

* Memory OS · Executive Intelligence · Evidence Packages
* Constitutional Retrieval · PMO · Contracts · subsystem names

The operator should experience:

> *"I can accomplish my work."*

Not:

> *"I understand the architecture."*

If architecture concepts must be explained — **that is evidence**. Log as **Architecture exposure** disposition.

---

## Naming convention

```text
BETA-OBS-NNN — {Operator} {Role} Session
Evidence NNN   — numbered entry within a session
H-NNN          — workflow hypothesis (cross-session)
```

Register every session in the [Evidence Ledger](./EVIDENCE-LEDGER.md).

---

## Session record structure

1. **Session metadata** — provenance · metrics
2. **Hypothesis register** — support/weaken tally per H-001–H-007
3. **Evidence entries** — numbered · positive and negative
4. **Vocabulary log** — words operators use vs product labels
5. **Unexpected behavior** — what surprised us
6. **End-of-session questions** — mental model
7. **Final question** — core value perceived
8. **Session summary** — recommendations after observation

---

## Session metadata (required)

| Field | Example |
| ----- | ------- |
| **Session ID** | BETA-OBS-001 |
| **Date / time** | 2026-07-03 · 14:00 local |
| **Phase** | A · B · C |
| **Operator** | Kelly |
| **Role** | Reference operator |
| **Build / commit** | `git rev-parse --short HEAD` at session start |
| **Observer** | Steve |
| **Workflow version** | ENG-BETA-001.1 · W-001 reference journey |
| **Duration** | (record at end) |
| **W-001 complete** | Yes / No |

### Readiness metrics (record at end)

| Metric | Definition |
| ------ | ---------- |
| **Human-help count** | Times operator asked another human what to do (Prompt + Demonstration + Engineering) |
| **Self-recovery count** | Times operator paused · looked · found the path · continued **without** human help |
| **Architecture exposure count** | Times observer had to explain internal architecture concepts |

**Self-recovery is success** — discoverability and resilience. Trend human-help down · self-recovery up.

---

## Evidence block (repeat per moment)

Use **Evidence NNN** — not only for problems.

```markdown
## Evidence NNN

### Journey step
(Welcome | Workspace | Contacts | Communications | Review | Follow-up | Return)

### Hypothesis
(H-001 … H-007)

### Expected
(From hypothesis / workflow map.)

### Observed
(Record what happened. Verbatim where possible.)

### Pause?
Yes | No

If yes:
* **Duration:**
* **What did they do?**
* **Recovered on own?** Yes | No  ← count in self-recovery if Yes
* **Question asked?**

### Intervention required?
None | Prompt only | Demonstration | Engineering intervention

### Disposition
**Positive evidence** | **Weakens hypothesis** | **Neutral** | **Architecture exposure**

### Supports / weakens
(e.g. ENG-BETA-001 Product Readiness · H-003 Contacts discoverability)

### Root cause
(if applicable) ENG | UX | OPS | Documentation | Training | V2 | —

### Journey severity
J0 | J1 | J2 | J3 | J4

### Recommendation
*(Blank during session. Complete afterward.)*
```

### Positive evidence example

```markdown
## Evidence 014

### Journey step
Communications

### Hypothesis
H-004

### Expected
User generates an evidence-backed draft.

### Observed
Kelly generated the draft, opened the citation panel without prompting,
and independently explained why the advisory notice was present.

### Pause?
No

### Intervention required?
None

### Disposition
Positive evidence

### Supports / weakens
Supports H-004 · ENG-BETA-001 Product Readiness

### Journey severity
J0

### Recommendation
(none)
```

---

## Vocabulary log (required)

Watch the words operators use naturally. Vocabulary mismatch is cheap to fix and valuable to observe.

| Operator said | Product label | Surface | Match? | Evidence ID |
| ------------- | ------------- | ------- | ------ | ----------- |
| "looking for people" | Contacts | `/studio/contacts` | | |
| "relationships" | Contacts | | | |

If everyone says *"I'm looking for people"* and navigation says **Contacts** — probably fine.  
If everyone says *"Where do I keep my relationships?"* while clicking Contacts — mental model differs.

---

## Unexpected behavior (required)

> **What surprised us?**

Sometimes the biggest improvements come from users doing something nobody anticipated.

---

## End-of-session questions (required)

Do not ask: *"Did you like it?"*

| Question | Response |
| -------- | -------- |
| What did you expect to happen next? | |
| What felt obvious? | |
| What felt uncertain? | |
| Where did you stop trusting yourself? | |
| If you came back tomorrow, what would you remember? | |

---

## Final question (required — ask last)

> **If this disappeared tomorrow, what would you miss most?**

Not marketing — reveals what the operator perceived as **core value**. Often not what engineers expected.

---

## Journey severity

| Level | Meaning |
| ----- | ------- |
| **J0** | Completed naturally |
| **J1** | Brief hesitation |
| **J2** | Needed clarification |
| **J3** | Needed demonstration |
| **J4** | Could not continue |

Not software P0–P3 — **journey** severity.

---

## Relationship to triage

| BETA-OBS evidence | Issue tracker |
| ----------------- | ------------- |
| All evidence · positive and negative | P0/P1 only · root cause = ENG |
| Hypothesis support/weaken | Subsystem reopening forbidden |
| Recommendations after session | ENG · OPS · UX · doc update |

Do not convert every evidence entry into a ticket.

---

## Observer protocol (Phase A)

1. **Do not explain** · keep architecture out of the room
2. Share URL · draft-only · no send · step back
3. On pause: **"What would you do next?"**
4. If they recover alone — log **self-recovery** · disposition may be Positive evidence
5. Record **Evidence NNN** for every meaningful moment — including successes
6. Log **vocabulary** as operators speak
7. Complete **Recommendation** fields after session ends
8. Ask **final question** last

---

*BETA-OBS schema · ENG-BETA-001 · LocalBrain V1 · 2026*
