# Convention Session 1 — Ontology Contract

> **Status:** **FROZEN** — engineering vocabulary for Memory OS and downstream systems  
> **Type:** Implementation contract — not theory · not storage schema · not UI  
> **Parent:** [Executive Epistemology Convention](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md) · [Theory v1.0 frozen](../LOCALBRAIN_COGNITIVE_EVIDENCE_BASE.md#theory-v10-freeze-peer-review-complete)  
> **Rule:** Convention may clarify · constrain · define — **may NOT invent**

---

## Success test (binding)

> **Could two independent teams implement Memory OS without talking to each other and still interoperate?**

Session 1 passes if every term below has exactly one normative definition and teams can map implementations to these contracts without reinterpretation.

---

## Epistemic stack (normative order)

```txt
Reality
  ↓
Executive Question          ← frames what is observed and recalled
  ↓
Observation (signal)        ← pre-memory; not a foundational object
  ↓
Memory                      ← durable capture with provenance
  ↓
Knowledge                   ← structured conclusion with evidence
  ↓
Belief                      ← actionable stance with strength + certainty
  ↓
Understanding               ← compressed relational model (additive)
  ↓
World Model                 ← composed governance representation
  ↓
Decision → Cognitive Trace → Action
```

**Wisdom** is explicitly **out of Session 1 scope** — post-action meta-cognitive product ([PR-S1-004](../LOCALBRAIN_COGNITIVE_EVIDENCE_BASE.md#peer-review-session-1-philosopher)); Session 1 diagram ends at Understanding → World Model.

---

## Contract template (per object)

Each row uses: **Definition** · **Invariants** · **Ownership** · **Inputs** · **Outputs** · **Lifecycle** · **Non-goals** · **Test obligations**

---

### Executive Question

| Field | Contract |
| ----- | -------- |
| **Definition** | First-class **information need** that frames observation, recall, and reasoning — not a UI route string. |
| **Invariants** | Every significant cognition pass names the question it serves · classes: Operational · Executive · Epistemic · Requested vs Emergent are orthogonal tags. |
| **Ownership** | [Executive Question Registry](../LOCALBRAIN_EXECUTIVE_QUESTION_REGISTRY.md) — one authoritative route per canonical question. |
| **Inputs** | User request · emergent tension signal · mission context. |
| **Outputs** | Scoped recall plan · reasoning context · trace anchor. |
| **Lifecycle** | Registered → Active → Answered → Superseded · half-life per [Decision Half-Life](../LOCALBRAIN_THEORY_OF_EXECUTIVE_COGNITION.md). |
| **Non-goals** | Not a chat prompt · not a dashboard title · not a feature name. |
| **Test obligations** | Two teams resolving the same EQ-ID must produce compatible recall scopes and trace question fields. |

**Convention resolution (PR-S2-002):** Question is a **primitive**, not merely an interface. Routes and cards **manifest** questions; they do not define them.

---

### Observation (boundary term)

| Field | Contract |
| ----- | -------- |
| **Definition** | Pre-memory **signal** that reality changed or tension exists — not yet captured with provenance. |
| **Invariants** | Observation ≠ Memory until capture · pattern/anomaly detection produces **candidate observations**, not beliefs. |
| **Ownership** | Agency / tension engines (System 3) surface; Memory OS captures. |
| **Inputs** | Events · metrics · schedules · file deltas. |
| **Outputs** | Capture candidates · emergent questions · tension scores. |
| **Lifecycle** | Detected → (capture) → Memory · or → Dismissed with reason. |
| **Non-goals** | Not a foundational object · not stored as conclusion. |
| **Test obligations** | No observation record without eventual Memory capture or explicit dismiss in trace. |

**Convention resolution (PR-S1-002):** Salience/threshold lives between Observation and Executive Question — detailed rules in Session 2 (Lifecycle).

---

### Memory

| Field | Contract |
| ----- | -------- |
| **Definition** | **Durable recall with provenance** — what the platform can cite as having been captured from reality. |
| **Invariants** | Axiom 4 ancestry · six domains never merge storage · verified memory is not overwritten by belief revision. |
| **Ownership** | [Memory OS](../LOCALBRAIN_EXECUTIVE_MEMORY_OS.md) / ENG-MEM-001 — domain-scoped stores. |
| **Inputs** | Observations · KnowledgeSource reads · action outcomes · user attestations. |
| **Outputs** | Recall bundles · provenance chains · domain queries for World Model. |
| **Lifecycle** | Session 2 owns state machine — Session 1 freezes: *must have* `created_at`, `source_ref`, `domain`, `kind`. |
| **Non-goals** | Not raw filesystem bytes · not LLM context window · not conclusions. |
| **Test obligations** | Cross-team: same `memory_id` + domain ⇒ same content hash; recall cites `memory_id` or rejects. |

---

### Knowledge

| Field | Contract |
| ----- | -------- |
| **Definition** | **Structured conclusion** derived from memories — assertable, evidence-linked, revisable. |
| **Invariants** | Knowledge strength and certainty are separate axes · three truth kinds (objective · relational · interpretive) must be tagged. |
| **Ownership** | Knowledge layer (System 2/3) — engines write; Memory OS stores derivation links. |
| **Inputs** | Memory recall · KnowledgeSource · synthesis. |
| **Outputs** | Belief inputs · Understanding compression inputs · recommendation evidence. |
| **Lifecycle** | Formed → Strengthened → Weakened → Superseded — never silent delete. |
| **Non-goals** | Not a chat answer · not un-sourced inference. |
| **Test obligations** | Knowledge records export `strength`, `certainty`, `truth_kind`, `evidence_refs[]`. |

---

### Belief

| Field | Contract |
| ----- | -------- |
| **Definition** | **Actionable cognitive stance** — what the platform acts as if true, with explicit confidence and conflict handling. |
| **Invariants** | May be wrong · must list supporting and contradicting evidence · belief revision ≠ verified memory mutation. |
| **Ownership** | Executive Intelligence (System 3) — CoS consumes; Meta-Cognition audits. |
| **Inputs** | Knowledge · competing hypotheses · falsification results. |
| **Outputs** | Recommendations · withhold signals · World Model updates. |
| **Lifecycle** | Proposed → Held → Challenged → Revised → Retired. |
| **Non-goals** | Not immutable fact · not user preference (that's Personal Memory). |
| **Test obligations** | Belief without `last_evaluated` fails certification; contradicting evidence must be present or marked absent. |

---

### Understanding

| Field | Contract |
| ----- | -------- |
| **Definition** | **Compressed relational model** — many memories/knowledge items represented as one usable structure without destroying sources (cognitive compression). |
| **Invariants** | Conservation: Understanding is **additive** — source memories remain · Axiom 7. |
| **Ownership** | Knowledge/Intelligence layer — compression engines; Memory OS retains lineage. |
| **Inputs** | Knowledge set · pattern detection · executive questions. |
| **Outputs** | World Model submodels · faster recall · prediction inputs. |
| **Lifecycle** | Compressed → Refined → Invalidated (sources remain). |
| **Non-goals** | Not a summary that replaces citations · not wisdom. |
| **Test obligations** | Compression record lists `source_memory_ids[]`; deleting sources fails validation. |

**Convention resolution (PR-S1-003):** Knowledge = assertable conclusion with evidence; Understanding = relational compression enabling prediction. Discriminant: if removing it still leaves a quotable conclusion → Knowledge; if it enables pattern/trajectory inference across items → Understanding.

---

### World Model

| Field | Contract |
| ----- | -------- |
| **Definition** | **Composed best-current representation of reality** shared by all engines — not one table, not the LLM weights. |
| **Invariants** | Plural partial submodels allowed · unknowns explicit · federated update boundaries (RO-S3-004). |
| **Ownership** | Cognitive Governance (System 2) — [Digital Twin](../LOCALBRAIN_DIGITAL_TWIN.md) is V1 composed view. |
| **Inputs** | Memory domains · beliefs · understanding · institutional memory · goals/commitments. |
| **Outputs** | CoS synthesis · WMA measurement · recommendation context. |
| **Lifecycle** | Versioned submodels · material-change events invalidate dependent recommendations. |
| **Non-goals** | Not a single prompt context · not ground truth oracle. |
| **Test obligations** | Point-in-time replay contract (RO-S3-006); two teams use same `world_model_version` at decision time. |

---

### Decision

| Field | Contract |
| ----- | -------- |
| **Definition** | **Binding executive choice** with rationale — foundational object per [Constitution Article II](../LOCALBRAIN_CONSTITUTION.md#article-ii--foundational-objects). |
| **Invariants** | Steve decides · `decided_by` required for binding status · supersede chain never deletes. |
| **Ownership** | [Decision Ledger](../LOCALBRAIN_DECISION_LEDGER.md) — executive authority. |
| **Inputs** | Recommendations · simulations · council synthesis. |
| **Outputs** | Approved actions · Cognitive Trace anchor · institutional memory. |
| **Lifecycle** | proposed → accepted → binding → superseded \| revoked. |
| **Non-goals** | Not department opinion · not model output without executive gate. |
| **Test obligations** | `decision_id` stable; trace links `decision_id`; supersede bidirectional. |

---

### Cognitive Trace

| Field | Contract |
| ----- | -------- |
| **Definition** | **Immutable reasoning genome** for important decisions — explainable intellectual history. |
| **Invariants** | Append-only · ancestry complete (Axiom 4) · bounded-depth default + drill-down (RO-S3-001). |
| **Ownership** | Executive Evolution (System 4) — ENG-CTR-001. |
| **Inputs** | Question · evidence · memories · beliefs · unknowns · council lenses · decision · outcome. |
| **Outputs** | JQ inputs · learning · institutional memory. |
| **Lifecycle** | Opened at decision time → closed at reflection · checkpoints at decision + reflection close. |
| **Non-goals** | Not a chat log · not optional for high-stakes paths. |
| **Test obligations** | Trace exports required fields per genome diagram; inter-rater JQ uses trace, not outcome alone. |

---

### Capability

| Field | Contract |
| ----- | -------- |
| **Definition** | **Registered skill** the platform can perform — maps to engines, routes, and approval policy. |
| **Invariants** | Capability ID immutable post-freeze · Five Gates admission · must declare owning Executive Question. |
| **Ownership** | [Capability Registry](../LOCALBRAIN_CAPABILITY_REGISTRY.md). |
| **Inputs** | Module manifests · department charters. |
| **Outputs** | Routable actions · certification targets. |
| **Lifecycle** | stub → partial → production · regression lock when certified. |
| **Non-goals** | Not a department · not a UI page. |
| **Test obligations** | `CAP-*` IDs resolve identically across services; orphan routes fail graph certification. |

---

### Office

| Field | Contract |
| ----- | -------- |
| **Definition** | **Institutional container** for executive function — owns departments, standing orders, and escalation policy. |
| **Invariants** | [Executive Office](../LOCALBRAIN_EXECUTIVE_OFFICE.md) apex · Steve sole decision authority · offices recommend, never bind. |
| **Ownership** | Institution model — [Executive Office Structure](../LOCALBRAIN_EXECUTIVE_OFFICE_STRUCTURE.md). |
| **Inputs** | Department reports · World Model · mission stack. |
| **Outputs** | CoS synthesis inputs · escalation events. |
| **Lifecycle** | Reserved → Active → Certified (module gate). |
| **Non-goals** | Not a chatbot persona · not autonomous executor. |
| **Test obligations** | Office charter exports `standing_orders[]` and `escalation_policy`; no capability executes without approval chain. |

---

### Department

| Field | Contract |
| ----- | -------- |
| **Definition** | **Specialized organizational unit** under the Executive Office — owns domain expertise and department-scoped capabilities. |
| **Invariants** | Reports to CoS, not directly to UI · one primary owner per Executive Question in registry. |
| **Ownership** | Department manifest + agent registry entry. |
| **Inputs** | Workspace/memory domain data · department EQ subset. |
| **Outputs** | Department daily report · recommendations · draft artifacts. |
| **Lifecycle** | seed → active → certified → regression-locked. |
| **Non-goals** | Not independent executive · not parallel decision authority. |
| **Test obligations** | Department ID stable; recommendations attribute `department_id` in trace. |

---

### Intelligence Domain

| Field | Contract |
| ----- | -------- |
| **Definition** | **Cross-cutting cognitive substrate** — shared reasoning lens or data class departments consume (not a department). |
| **Invariants** | Identity and Time are domains, not departments ([Office Structure](../LOCALBRAIN_EXECUTIVE_OFFICE_STRUCTURE.md)) · domains do not own approval gates. |
| **Ownership** | Platform kernel / governance — declared in registry, consumed by departments. |
| **Inputs** | Memory · Knowledge · Person/Organization objects. |
| **Outputs** | Domain-scoped queries · graph edges. |
| **Lifecycle** | Specified → Implemented → Certified. |
| **Non-goals** | Not user-facing office · not duplicate of Memory domain. |
| **Test obligations** | Domain schema versioned; consumers declare `requires_domains[]` in manifest. |

---

## Relationship matrix (normative)

| From | To | Relationship |
| ---- | -- | ------------ |
| Executive Question | Memory recall | frames |
| Memory | Knowledge | evidences |
| Knowledge | Belief | supports/challenges |
| Knowledge + Memory | Understanding | compresses (additive) |
| Belief + Understanding | World Model | composes |
| World Model | Decision | informs |
| Decision | Cognitive Trace | anchors |
| Department | Capability | owns/implements |
| Office | Department | contains |
| Intelligence Domain | Department | supplies substrate |

---

## Session 1 gate

- [x] Canonical vocabulary for 12 contract terms
- [x] PR-S1-002 · PR-S1-003 · PR-S2-002 resolved at ontology layer
- [x] No new foundational objects invented
- [x] Lifecycle detail deferred to Session 2 where specified
- [x] Success test: interoperable Memory OS vocabulary — **pass**

**Next:** [Convention Session 2 — Memory Lifecycle](./LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md#session-2--memory-lifecycle)

---

*Convention Session 1 · Ontology · frozen vocabulary · 2026*
