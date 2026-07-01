# Memory OS — Design Package

> **Status:** **FROZEN** — `memory-spec-v1.0` · MEM-009 authorized  
> **Engine:** ENG-MEM-001 · **Implementation:** MEM-009 Pass 1  
> **Authorized:** Post `v1.0.0-factory-certified` Factory lock  
> **Depends on:** [Factory Constitution v1.0](../factory/FACTORY_CONSTITUTION_v1.0.md) · [Convention Close](../convention/CONVENTION-CLOSE.md)  
> **Milestone:** [MILESTONE-MEMORY-OS](../burt_packets/MILESTONE-MEMORY-OS.md)

---

## Guiding principle (binding)

> **Memory records what happened. Intelligence interprets what happened. Policy decides what should happen.**

| Concern | Layer | Must not |
| ------- | ----- | -------- |
| **Memory** | What happened | Interpret, decide, or act |
| **Intelligence** | What it means | Store authoritative records |
| **Policy** | What should happen | Bypass audit or consent |

---

## MEM-009 Implementation (current phase)

ENG-MEM-001 Wave 1 — canonical storage slices. Reference implementation: [ENG-MEM-001.1 Episode](./slices/ENG-MEM-001.1-EPISODE.md).

| Document | Purpose |
| -------- | ------- |
| [Wave 1 Charter](./ENG-MEM-001-WAVE1-CHARTER.md) | MEM-009 Pass 1 scope |
| [Deterministic Foundation Doctrine](./DETERMINISTIC-FOUNDATION-DOCTRINE.md) | Constitutional substrate vs advisory Intelligence |
| [Engineering Discipline](./ENG-MEM-001-ENGINEERING_DISCIPLINE.md) | Spec-traceable commits · slice order |
| [Wave 1 Slices](./slices/README.md) | Episode · Fact · Artifact · Conversation · DecisionCitation |

---

## MAR-1 Architecture Review (complete — spec frozen)

| Document | Purpose |
| -------- | ------- |
| [MAR-1 Architecture Review](./MAR-1-ARCHITECTURE_REVIEW.md) | Master review — MAR-1.1 through MAR-1.7 |
| [CANONICAL_GLOSSARY](./CANONICAL_GLOSSARY.md) | Binding terminology — all volumes |
| [CANONICAL_OBJECT_REGISTRY](./CANONICAL_OBJECT_REGISTRY.md) | Single owner per object |
| [TIME_MODEL](./TIME_MODEL.md) | Event · observation · validity · supersession |
| [TRUST_PROVENANCE_MODEL](./TRUST_PROVENANCE_MODEL.md) | Frozen trust enum |
| [DELEGATION_MODEL](./DELEGATION_MODEL.md) | Grants · chaining · audit |
| [GRAPH_RELATIONSHIP_VOCABULARY](./GRAPH_RELATIONSHIP_VOCABULARY.md) | 14 edge types — frozen |
| [MEMORY_LIFECYCLE_MAP](./MEMORY_LIFECYCLE_MAP.md) | S2 normative lifecycle |
| [MEM-008 Exit Criteria](./MEM-008-EXIT_CRITERIA.md) | Freeze gate checklist |
| [MEM-008 Success Test Matrix](./MEM-008-SUCCESS_TEST_MATRIX.md) | 107 binary tests — PMO walkthrough |
| [MEMORY_OS_CONVENTION_MANIFEST.json](./MEMORY_OS_CONVENTION_MANIFEST.json) | Machine-readable spec contract |

---

## Design volumes

| Vol | Document | Milestone | Status |
| --- | -------- | --------- | ------ |
| 1 | [Memory Constitution](./VOLUME-1-MEMORY_CONSTITUTION.md) | MEM-001 | ✅ Frozen |
| 2 | [Memory Data Model](./VOLUME-2-MEMORY_DATA_MODEL.md) | MEM-002 | ✅ Frozen |
| 3 | [Memory Engine](./VOLUME-3-MEMORY_ENGINE.md) | MEM-003 | ✅ Frozen |
| 4 | [Identity Layer](./VOLUME-4-IDENTITY_LAYER.md) | MEM-005 | ✅ Frozen |
| 5 | [Knowledge Graph](./VOLUME-5-KNOWLEDGE_GRAPH.md) | MEM-004 | ✅ Frozen |
| 6 | [Executive Intelligence](./VOLUME-6-EXECUTIVE_INTELLIGENCE.md) | MEM-006 | ✅ Frozen |
| 7 | [Governance & Safety](./VOLUME-7-GOVERNANCE_AND_SAFETY.md) | MEM-007 | ✅ Frozen |

**Freeze:** [MEM-008](./MEM-008-EXIT_CRITERIA.md) — **declared 2026-07-01**  
**Implementation:** [MEM-009](../burt_packets/MILESTONE-MEMORY-OS.md) — **authorized** · [Wave 1 charter](./ENG-MEM-001-WAVE1-CHARTER.md)

**Interpretive canon:** [Architecture Book v1.0](../LOCALBRAIN_ARCHITECTURE_BOOK_v1.0.md) — why the system is shaped this way (non-normative)

---

## Critical path

```txt
✓ Factory certified & locked
✓ MAR-1 · MEM-008 Exit Criteria · Success Test Matrix
✓ MEMORY_OS_CONVENTION_MANIFEST.json (frozen)
✓ PMO walkthrough — 107/107 PASS
✓ MEM-008 Specification Freeze · memory-spec-v1.0
✓ ENG-MEM-001.1 Episode — Reference Slice 001 · 6/6 PASS
✓ ENG-MEM-001.2 Fact — Reference Slice 002 · 22/22 PASS
✓ ENG-MEM-001.3 Artifact — Reference Slice 003 · 17/17 PASS
✓ ENG-MEM-001.4 Conversation — Reference Slice 004 · 16/16 PASS
▶ ENG-MEM-001.5 DecisionCitation — Wave 1 slice 5/5 (**AUTHORIZED** · Reference Slice 005 · completes Institutional Cognition Foundation)
```

---

## Parent doctrine

- [Executive Memory OS](../LOCALBRAIN_EXECUTIVE_MEMORY_OS.md)
- [Memory Domains](../LOCALBRAIN_MEMORY_DOMAINS.md)
- [Executive Epistemology Convention](../LOCALBRAIN_EXECUTIVE_EPISTEMOLOGY_CONVENTION.md)
- [Constitution Article XIII](../LOCALBRAIN_CONSTITUTION.md)

---

*Memory OS Design Package · LocalBrain V1 · LB-OS-027*
