# Volume 7 — Governance & Safety

> **Milestone:** MEM-007  
> **Status:** Draft — **MAR-1 reviewed**  
> **Glossary:** [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md)  
> **Principle:** Memory records what happened. Intelligence interprets what happened. Policy decides what should happen.  
> **Delegation:** [DELEGATION_MODEL](./DELEGATION_MODEL.md)  
> **Implements:** [Convention S5 Ethics](../convention/CONVENTION-S5-ETHICS_CONTRACT.md)

---

## Success test (binding)

> **Could two independent Memory OS implementations behave identically when confronted with consent, deletion, export, and human-approval edge cases?**

---

## Policy layer

> **Policy decides what should happen.**

Governance sits above Memory and Intelligence:

```txt
Memory records what happened.
Intelligence interprets what happened.
Policy decides what should happen.
```

---

## Human approval workflows

| Action class | Default approval |
| ------------ | ---------------- |
| Capture personal inferred preference | Owner confirm |
| Cross-domain recall (personal → institutional) | Owner or policy |
| Forgotten transition | Owner or compliance officer |
| Bulk export | Owner + audit log |
| Intelligence recommendation → action | Executive confirm |
| Delegation grant | Grantor sign-off |

Approval requests are auditable events — not memory objects.

Workflow states: `proposed` → `approved` | `rejected` | `expired`

---

## Immutable audit logs

| Property | Rule |
| -------- | ---- |
| Append-only | No update or delete |
| Tamper-evident | Hash chain or signed entries |
| Scope | All lifecycle transitions · recall · policy decisions |
| Retention | Exceeds memory retention — compliance minimum |
| Access | Compliance role + owner export |

Audit logs are **not** in the recall index — separate query API.

---

## Consent boundaries

Per [S5 Ethics](../convention/CONVENTION-S5-ETHICS_CONTRACT.md):

| Consent type | Governs |
| ------------ | ------- |
| **Capture consent** | May this observation become memory? |
| **Recall consent** | May this memory appear in this context? |
| **Inference consent** | May patterns be inferred from stated memories? |
| **Export consent** | May this domain leave the instance? |
| **Delegation consent** | May this identity act on my behalf? |

Consent records are first-class — referenced by `consent_ref` on memories.

Revocation does not erase — triggers Forgotten or Archived per policy.

---

## Access control

| Model | Description |
| ----- | ----------- |
| **RBAC** | Role → domain permissions |
| **ABAC** | Attribute rules (privacy tier, department, time) |
| **Sovereign override** | Executive may access own personal — always logged |

Access denied events are audited — never silent failure.

---

## Deletion semantics

User-facing "delete" maps to:

```txt
Delete request
    → Policy check
    → Forgotten transition (with reason)
    → Excluded from default recall and export
    → Audit record retained
    → Graph edges archived
```

Physical erasure only for:

- Pre-capture dismissed observations (never memory)
- Compliance-mandated purge with certificate — rare, audited, separate process

---

## Export / import rules

| Operation | Rule |
| --------- | ---- |
| **Export** | Domain-scoped · provenance included · consent checked |
| **Import** | Schema validation · provenance preserved · never overwrites — supersedes |
| **Cross-instance** | Passport identity check · no implicit merge |
| **Factory reinstall** | Import into new instance — not Factory upgrade |

Export format carries Convention manifest versions for interoperability.

---

## Backup and recovery

| Tier | Contents | Frequency |
| ---- | -------- | --------- |
| **Primary backup** | Canonical store + audit log | Continuous / daily |
| **Snapshot** | Point-in-time ([Vol 3](./VOLUME-3-MEMORY_ENGINE.md)) | On demand |
| **Index rebuild** | Vector + graph from primary | After restore |

Recovery validates Convention compliance before serving recall.

---

## Compliance hooks

| Hook | Purpose |
| ---- | ------- |
| `compliance.export` | Regulated data export format |
| `compliance.purge` | Mandated erasure workflow |
| `compliance.hold` | Legal hold — blocks Forgotten |
| `compliance.report` | Activity summary for audit period |

Chief Compliance Officer capability (CAP-FUT-CCO-001) consumes these hooks — reserved for post-V1.

---

## Safety invariants

| ID | Invariant |
| -- | --------- |
| G1 | No memory without provenance |
| G2 | No recall without audit |
| G3 | No intelligence action without policy check |
| G4 | No silent erasure |
| G5 | No cross-instance merge without explicit import |
| G6 | Factory layer unreachable from Memory OS write path |
| G7 | Consent revocation honored within one recall cycle |

---

## Certification path (post-MEM-009)

Memory OS certification (future) mirrors Factory ten-gate model:

- Convention compliance (5 contracts)
- Lifecycle interoperability
- Recall determinism
- Ethics edge cases
- Empty-to-personal bootstrap (no Factory modification)

Defined at MEM-008 freeze — not implemented here.

---

*Volume 7 · Governance & Safety · MEM-007*
