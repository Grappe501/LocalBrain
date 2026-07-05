# ENG-BETA-001.4 — Beta Onboarding

> **Type:** Release preparation evidence · not implementation · not readiness evaluation  
> **Status:** **DRAFT** — 2026-07-03  
> **Parent:** [ENG-BETA-001 Commercial Beta Preparation](./ENG-BETA-001-COMMERCIAL-BETA-PREPARATION.md)  
> **Prerequisite:** [Workflow map](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md) · [Connector posture](./ENG-BETA-001.2-CONNECTOR-POSTURE-MATRIX.md) · [Seed/data plan](./ENG-BETA-001.3-SEED-DEMO-DATA-PLAN.md)

---

## Purpose

The repository has crossed from **building the system** to **learning from the system**. The next value comes from watching someone use what was built — not from writing another document before anyone uses it.

Onboarding documentation supports **Phase B and C**. Phase A is deliberately **observational** with minimal orient.

---

## Reference operators (Phase A)

Kelly and Chris are **reference operators**, not generic beta testers.

Their job is not to test every feature. Their job is to answer one question:

> **Can a knowledgeable operator accomplish meaningful work without engineering intervention?**

That is a different objective than software testing.

| Role | Person | Responsibility |
| ---- | ------ | -------------- |
| **Reference operator** | Kelly · Chris | Complete W-001 · meaningful outcome · no feature sweep |
| **Observer** | Steve | Watch · [Evidence Ledger](../ops/beta-feedback/EVIDENCE-LEDGER.md) · resist instructing |
| **Admin** | Steve | Instance · W-A1 provider · handoff |

---

## Three pilot phases (binding)

Three increasingly difficult passes. Do not skip ahead.

### Phase A — Reference operators

| | |
| - | - |
| **Who** | Kelly · then Chris (individually) |
| **Goal** | Does the product match the engineering model? |
| **Method** | Test hypotheses [H-001–H-007](../ops/beta-feedback/BETA-OBS-SCHEMA.md#think-in-hypotheses) · not feature checklist |
| **Documentation** | Minimal — evidence matters more than orient |
| **Evidence** | [BETA-OBS-001 Kelly](../ops/beta-feedback/BETA-OBS-001-KELLY-REFERENCE-OPERATOR-SESSION.md) · [Evidence Ledger](../ops/beta-feedback/EVIDENCE-LEDGER.md) |

Every hesitation matters. So does every **self-recovery** and every **positive evidence** entry.

**Keep architecture out of the room** — do not explain Memory OS · EI · PMO · contracts · evidence packages. If you must, log **Architecture exposure**.

### Phase B — Trusted internal users

| | |
| - | - |
| **Who** | People who know the campaign · not Kelly/Chris |
| **Goal** | Can someone **learn** the product? |
| **Question** | Can documentation and limited orient replace engineering? |
| **Documentation** | **Important** — reference card · limitations · fallback orient |
| **Gate** | Phase A smooth for both reference operators · human-help trending down |

### Phase C — Outside beta

| | |
| - | - |
| **Who** | People unfamiliar with the architecture |
| **Goal** | Can the product **teach itself**? |
| **Question** | Can users discover the architecture without being taught it? |
| **Documentation** | Onboarding succeeds or fails here |
| **Gate** | Phase B learners complete W-001 with acceptable human-help count |

```text
Phase 0 (admin smoke) → Phase A (Kelly · Chris) → Phase B (internal) → Phase C (outside)
```

**Do not** run a large cohort in Phase A. Expand only when evidence supports the next question.

---

## The question that changed

Early in the project the binding question was architecture and evidence:

> Can the architecture support users?

Today the binding question is experiential:

> **Can users discover the architecture without being taught it?**

Phase A tests model fidelity. Phase B tests learnability. Phase C tests self-teaching. Only real users can answer.

If V1 translates internal architecture into external experience, that is a larger accomplishment than implementing features.

---

## W-001 reference journey

[ENG-BETA-001.1](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md#w-001--reference-beta-journey) — benchmark for all phases.

| Step | Route / surface | Success evidence |
| ---- | --------------- | ---------------- |
| **Welcome** | `/` · context panel | Understands purpose · knows where to begin |
| **Workspace** | `/workspace/localbrain` | Enters workspace without assistance |
| **Contacts** | `/studio/contacts` | Real contact · searchable · editable |
| **Communications** | Contact detail · generate draft | Evidence-backed draft · linked correctly |
| **Review** | Draft preview | Understands why draft was produced |
| **Follow-up** | Outreach + audit note | Audit recorded · no send expected |
| **Return** | Reload · return | Work resumes seamlessly |

Use this table as **expected behavior** in the ledger — not as a script to read aloud in Phase A.

---

## Phase A observer protocol (binding)

During Kelly's session (and Chris's):

1. **Do not explain** anything at open
2. Share URL · state beta is draft-only · no email send · step back
3. When they pause, ask only: **"What would you do next?"**
4. **Watch · take notes · resist helping** unless P0/P1
5. After **each workflow step**, ask: **"What surprised you?"** — not "Did it work?"
6. Record **Evidence NNN** in [BETA-OBS-001](../ops/beta-feedback/BETA-OBS-001-KELLY-REFERENCE-OPERATOR-SESSION.md) — positive and negative
7. Log **vocabulary** · count **self-recovery** when Kelly finds her own path

8. Ask **final question** last: *"If this disappeared tomorrow, what would you miss most?"*

Surprises reveal mismatches between the mental model the software presents and the mental model the operator brought.

---

## Primary readiness metrics

| Metric | Target |
| ------ | ------ |
| **Human-help count** | → zero (asked another human what to do) |
| **Self-recovery count** | ↑ (paused · looked · continued alone) |
| **Architecture exposure** | → zero (had to explain internal concepts) |

Self-recovery is discoverability success — not failure.

---

## Pre-handoff checklist (admin — before Phase A)

- [ ] Backend + frontend running · URL documented
- [ ] OpenAI configured · W-A1 pass ([workflow map](./ENG-BETA-001.1-BETA-WORKFLOW-MAP.md#admin-workflow-w-a1--provider-setup))
- [ ] [Connector posture](./ENG-BETA-001.2-CONNECTOR-POSTURE-MATRIX.md) — no email send
- [ ] Phase 0 admin W-001 smoke completed
- [ ] [BETA-OBS-001](../ops/beta-feedback/BETA-OBS-001-KELLY-REFERENCE-OPERATOR-SESSION.md) open · commit hash ready to record

---

## Fallback orient (Phase A — only if P0/P1 blocker)

Not the default opening. Use only when the operator cannot proceed and asks for help:

> LocalBrain V1 subsystems are complete. Commercial Beta preparation — not production. Drafts are advisory only. Nothing sends email or SMS.

Do not click for them unless data loss or send-path risk.

---

## Documentation for Phase B / C

| Artifact | Phase |
| -------- | ----- |
| Known limitations table (below) | B · C |
| Quick reference card | B · C |
| [Feedback & triage](./ENG-BETA-001.5-FEEDBACK-ISSUE-TRIAGE.md) | All |

### Known limitations

| Limitation | User expectation |
| ---------- | ---------------- |
| No login gate | Trust-based instance access |
| Workspace fixed to `localbrain` | No multi-workspace contact UI |
| No email/SMS send | Outreach is human record only |
| Draft preview only | Full citation UI limited in beta |
| Relationship studio | Exploratory · not W-001 |

### Quick reference card (Phase B+)

```text
Executive Office     /
Workspace            /workspace/localbrain
Contacts             /studio/contacts

W-001: Reference journey — ENG-BETA-001.1
Evidence: docs/ops/beta-feedback/EVIDENCE-LEDGER.md
```

---

## Institutional posture

```text
Mode:                  Observational · deliberately slowed
Active phase:          0 admin smoke → Phase A (Kelly)
Evidence surface:      BETA-OBS session records (canonical)
Next act:              BETA-OBS-001 · Kelly · observe · do not explain
```

---

*ENG-BETA-001.4 · Beta Onboarding · DRAFT · 2026*
