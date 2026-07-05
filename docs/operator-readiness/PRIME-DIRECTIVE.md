# Prime Directives

> **Status:** Cultural rules · PRL-3 closing · Effective PRL-4 · 2026-07-05  
> **Scope:** Every engineering meeting, session, and implementation decision until launch  
> **Not:** Another process document. These are the rules everything else serves.

---

## The rules

> **Protect the evidence.**

> **Protect the pace.**

Everything else follows from those two.

| Directive | Violated when |
| --------- | ------------- |
| **Protect the evidence** | Explaining too much · coaching · fixing during sessions |
| **Protect the pace** | Reacting too quickly · fixing after one operator · "we already know how to fix that" |

They work together. Many teams corrupt evidence by over-explaining. Many teams corrupt pace by over-reacting.

After Kelly's session there will be a strong temptation to say *"We already know how to fix that."* **Don't.** Wait. Chris may not experience it. The third operator may solve it without hesitation. Or all three may encounter the same issue for different reasons. You don't know yet.

**Evidence accumulates. Wisdom waits.**

---

## Why this matters

At PRL-4, the greatest risk is no longer bad code.

It is **corrupting the evidence**.

You can always fix software.  
You cannot recreate an unbiased first impression.

Kelly's first hesitation happens exactly once.  
Chris's first confusion happens exactly once.  
The first time someone doesn't know what to click — that is incredibly valuable.

Once you've explained it, it's gone forever.

---

## One-Way Door Principle

Every first operator experience is a **one-way door**.

Treat it as irreplaceable evidence. Never spend it casually.

| Spend carefully | Why |
| --------------- | --- |
| First operator on a walkthrough | Unbiased signal — gone after facilitation |
| First hesitation at a screen | UX truth — gone after explanation |
| First wrong turn | Workflow truth — gone after navigation hints |
| First confidence reading | Readiness truth — gone after coaching |

See [Facilitator Card](./OPERATOR-SESSION-FACILITATOR-CARD.md) · [Evidence Scribe Guide](./EVIDENCE-SCRIBE-GUIDE.md).

---

## How engineering celebrates success

**Old scoreboard:**

> "The build passed."

**New scoreboard:**

> **"We learned something true."**

Those are different.

### Great outcomes

**Operator finishes in 22 minutes.** No facilitator help. Confidence high. No OECs. Excellent.

**Operator struggles.** Creates three OECs. Finds one hidden workflow issue. Now you know exactly what to improve. Also success.

### Bad outcome

Facilitator explains everything. Operator finishes perfectly. Evidence worthless. Software appears better than it is.

**Protect the evidence** — even when the session feels harder.

---

## The evidence pipeline

Most products have engineering metrics, UX metrics, and business metrics that don't connect.

Here they converge:

```text
Operator Evidence
        ↓
Implementation Decisions
        ↓
Platform Readiness
        ↓
Launch Decision
```

From this point on, do not measure success by how many features get added.

Measure it by how much the platform improves while **preserving the integrity of the evidence** that drives those improvements.

See [Evidence-Driven Development](./EVIDENCE-DRIVEN-DEVELOPMENT.md) · [Evidence Scoreboard](./OPERATOR-EVIDENCE-SCOREBOARD.md).

---

## What this overrides

| Still required | No longer primary |
| -------------- | ----------------- |
| CPAT v1.0 passing | Feature completion % |
| Doctrine preservation | Sprint velocity as success signal |
| Signed evidence packages | "Green build" as celebration |
| OEC disposition before implementation | Speculative architecture |

When evidence integrity conflicts with speed, comfort, or demo polish — **evidence wins**.

When isolated observations conflict with batch discipline — **pace wins** until pattern review.

---

## Operator session cadence

**Avoid:**

```text
Session → Fix → Session → Fix
```

**Use:**

```text
Kelly
  ↓
Chris
  ↓
Third operator
  ↓
Evidence synthesis
  ↓
Disposition
  ↓
Implementation batch
  ↓
CPAT regression
  ↓
Next operator cycle
```

This cadence protects both the evidence and the engineering team from oscillating on isolated observations.

---

## What success looks like

Not that Kelly finds nothing. Not that every session is perfect.

Success is that, after three sessions, you can say:

> **"These are the five things we now know with confidence."**

That is a much higher standard than collecting three lists of comments.

---

## Evidence review pipeline (no shortcuts)

When operator evidence returns for review:

1. **Evidence** — What happened?
2. **Pattern** — Did multiple operators experience it?
3. **Interpretation** — What is the most likely explanation?
4. **Recommendation** — What is the smallest justified change?
5. **Regression check** — Does the change preserve certified doctrines and keep CPAT green?

No shortcuts. No redesigns. No "while we're here…" additions.

From here, the most valuable contribution is not another idea — **it's better evidence**.

---

## Meeting opener

Read this aloud at the start of every engineering meeting until PRL-6:

> **Protect the evidence.**  
> **Protect the pace.**

Then proceed.

---

*Prime Directives · PRL-3 closing statement · LocalBrain Governed Platform · 2026*
