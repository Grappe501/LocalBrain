# CONTACT-V3 — Technical Review Guide

> **Audience:** Technical reviewers (not architects)  
> **Phase:** [Implementation Phase 1](#project-phases) — Reference Implementations  
> **Builder guide:** [Implementation guide](./CONTACT-V3-IMPLEMENTATION-GUIDE.md) · [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md)  
> **Charter:** [Execution Charter](./CONTACT-V3-EXECUTION-CHARTER.md) — formal planning → implementation handoff  
> **Architecture version:** **v1.0 — immutable** for normal development ([ADR-006](./CONTACT-V3-DECISION-RECORDS.md#adr-006-foundation-documents-protected-during-implementation))

---

## Governance transition — complete

Contact Management v3 is a **governed implementation project**. Frozen artifacts are governing specifications — not drafts.

### Future conversation categories

| Category | When |
| -------- | ---- |
| **Implementation review** | Default — code vs frozen contracts |
| **Operator evidence review** | User demonstrations; iterative improvement |
| **Infrastructure review** | Build, test reliability, performance, security, deployment |
| **Architecture review** | Exception only — explicit reopen · ADR · version increment (v1.1+) |

Architecture v1.0 is not expanded unless category 4 is explicitly invoked.

---

Architecture **constrains** implementation — it does not evolve with it.

Every future discussion begins with:

> **Does the implementation satisfy the contract?**

—not—

> Should we redesign the architecture?

Unless a slice **violates** a frozen contract, default posture:

> **Approve implementation and iterate.**

Not: **Redesign.**

Foundation changes require explicit architecture review ([ADR-006](./CONTACT-V3-DECISION-RECORDS.md#adr-006-foundation-documents-protected-during-implementation)).

**Architecture is complete.** Reviewer role — not architect.

Frozen artifacts are the **governing specification** — not drafts.

Unless architecture is explicitly reopened, do **not** propose structural redesigns. Focus:

- Contract compliance  
- Pattern consistency  
- Production readiness  
- Maintainability  
- Testability  
- Operator usability  
- Evidence-driven iteration  

---

## Implementation Phase 1 mission

Every reference implementation answers one question:

> **Can another engineer implement the remaining engines by following this pattern?**

If yes, the reference implementation succeeded.

Objective: **prove** the frozen architecture in software — not refine it.

---

## Project phases

```
Phase 0   ✓ Vision
Phase 1   ✓ Doctrine              (Constitution)
Phase 2   ✓ Architecture          (Seven engines)
Phase 3   ✓ Vocabulary              (V3-000 Lifecycle)
Phase 4   ✓ Contracts             (Slice specs, ADR, Done contract)
────────────────────────────────
Phase 5   ▶ Reference Implementations   ← CURRENT (V3-016.1 first)
────────────────────────────────
Phase 6     Operator Validation
Phase 7     Production Hardening
```

**Contact Management v3 = Implementation Phase 1** (within Phase 5 above: reference implementations).

Project success depends on **disciplined execution**, not new ideas.

---

## Slice review — two independent questions

When a completed slice is submitted (starting with **CONTACT-V3-016.1**):

### 1. Is the slice complete?

Measured against: Constitution · ADRs · Architecture v1.0 · V3-000 · Slice contract · Done contract

| Result | Meaning |
| ------ | ------- |
| ✅ **Complete** | Satisfies frozen specifications |
| 🟡 **Complete with Iteration** | Correct; improvements schedulable without blocking |
| 🔴 **Not Complete** | Violates frozen contract |

### 2. Is the slice the canonical implementation?

Measured against: pattern consistency · reusability · clarity · testability · maintainability

| Result | Meaning |
| ------ | ------- |
| **Reference Pattern Certified** | Benchmark for all remaining v3 slices |
| **Reference Pattern Pending** | Complete but patterns not yet canonical |

**Separate decisions.** Complete ≠ certified. V3-016.1 must earn both to become the implementation template.

### Operating mode (until Architecture v1.1 explicitly opened)

- Architecture is fixed  
- ADRs are authoritative  
- Slice contracts are binding  
- Operator evidence drives iteration  
- Implementation quality — not new design — is the primary concern  

Architectural change → exception: recommend ADR + version review — not inline redesign.

---

## Review dimensions (detail)

For every implementation slice, evaluate:

### 1. Contract compliance

Does the implementation match the slice contract (shared types, API, acceptance criteria)?

### 2. Constitutional compliance

Does it uphold the [Relationship Doctrine](./CONTACT-V3-CONSTITUTION.md)?

### 3. Architectural compliance

Does it stay within its assigned [engine](./CONTACT-V3-ARCHITECTURE.md)?

### 4. ADR compliance

Does it accidentally violate a recorded [architectural decision](./CONTACT-V3-DECISION-RECORDS.md)?

### 5. Operational quality

| Check | Question |
| ----- | -------- |
| Production-ready | Safe defaults, no debug leakage |
| Maintainable | Clear module boundaries |
| Testable | Targeted tests; isolated DB pattern |
| Observable | Errors and audit trail visible |
| Auditable | Append-only history where required |

### 6. Implementation quality

Simplicity · cohesion · low coupling · clear naming · upgrade path · migration safety.

### 7. Pattern conformity *(after Reference Pattern Certified)*

Does this slice follow the [V3-016.1 reference patterns](./CONTACT-V3-016.1-RELATIONSHIP-CONTEXT.md#reference-implementation-pattern), or introduce a new pattern that needs explicit justification?

---

## Review contract (every slice)

Review in this order:

1. [Constitution](./CONTACT-V3-CONSTITUTION.md)
2. [ADRs](./CONTACT-V3-DECISION-RECORDS.md)
3. [Architecture v1.0](./CONTACT-V3-ARCHITECTURE.md)
4. [V3-000 Lifecycle](./CONTACT-V3-000-RELATIONSHIP-LIFECYCLE.md)
5. Slice contract
6. [Done contract](./CONTACT-V3-SLICE-DONE-CONTRACT.md)
7. Targeted test results
8. Operator evidence (when available)

Outcomes limited to: ✅ **Approve** · 🟡 **Approve with Iteration** · 🔴 **Block**

**Block** is reserved for frozen contract violations — not stylistic preference or enhancement opportunities.

---

## V3-016.1 success — five reusable patterns

V3-016.1 succeeds only if it establishes patterns reused downstream — not merely "shipping Context."

| Pattern | Reused by |
| ------- | --------- |
| Data model | Stewardship, Action, Intelligence |
| Service layer | Every future engine |
| UI components | Timeline, Dashboard, AI Briefs |
| Permission model | Entire CRM |
| Test convention | Every future slice |

---

## Milestone: Reference Pattern Certified

After V3-016.1 is implemented, evaluate **two independent outcomes**:

| Outcome | Question | If pass |
| ------- | -------- | ------- |
| **Contract compliance** | Does it satisfy frozen specifications? | Slice is **complete** |
| **Reference Pattern Certified** | Does it establish reusable patterns future slices should follow? | Becomes **canonical implementation example** for rest of v3 |

Related but **distinct** decisions. A slice can be complete without certification; certification requires contract compliance plus demonstrated patterns:

- Data model  
- Service layer  
- UI component conventions  
- Permission model  
- Testing strategy  

Record in V3-016.1 validation note. After certification, **pattern conformity** is required on subsequent slice reviews.

---

## Review verdicts

Default to one of three outcomes — not redesign:

| Verdict | Meaning |
| ------- | ------- |
| ✅ **Approve** | Satisfies contracts and established patterns |
| 🟡 **Approve with Iteration** | Correct; improvements schedulable without blocking progress |
| 🔴 **Block** | Violates Constitution, accepted ADR, Architecture, V3-000, slice contract, or Done Contract |

Anything else is **iterative enhancement**, not a redesign or architecture change.

---

**CONTACT-V3-016.1 — Relationship Context Engine** (reference implementation)

When implemented, review using the artifact order above. Additional checks for 016.1:

- Reusable UI pattern established (cards, chips, selector, filter drawer)
- Permission matrix documented and tested
- Test layers: unit · repository · service · API · permissions · targeted slice
- Pattern reusable by V3-016 Stewardship without one-off duplication

Verdict template:

```md
## V3-016.1 Review — [date]
- Constitution: pass / fail — [note]
- ADR: pass / fail — [note]
- Architecture (Context engine): pass / fail — [note]
- V3-000: pass / n/a — [note]
- Slice contract: pass / fail — [note]
- Done contract: N/M items — [note]
- Tests: [command] — [result]
- Operator evidence: pending / [summary]
- Verdict: ✅ Approve | 🟡 Approve with Iteration | 🔴 Block — [reason]
- Reference Pattern Certified: yes / no / n/a (first review)
- Pattern conformity: pass / fail / n/a — [note]
```

---

## When to block vs iterate

| Block | Iterate |
| ----- | ------- |
| Violates Constitution or ADR | Naming or structure improvement |
| Wrong engine / orphan model | Missing test coverage — add tests |
| Auto-promote lifecycle or silent AI facts | UI polish after core contract met |
| Overwrites history | Performance follow-up |
| Foundation doc change without review | V3-015 full-suite debt (parallel track) |

---

*CONTACT-V3 Technical Review · Implementation Phase 1 · LocalBrain · 2026*
