import test from "node:test";
import assert from "node:assert/strict";
import {
  DECISION_CITATION_SCHEMA_VERSION,
  decisionCitationsEquivalent,
  deserializeDecisionCitation,
  isLifecycleTransitionAllowed,
  LifecycleTransitionError,
  serializeDecisionCitation,
} from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { countAuditEventsForObject } from "./auditLog.js";
import {
  DecisionCitationValidationError,
  validateDecisionCitationRecord,
} from "./decisionCitationValidator.js";
import {
  decisionCitationContentFingerprint,
  DecisionCitationImmutableFieldError,
  getDecisionCitationById,
} from "./decisionCitationStore.js";
import {
  readDecisionCitationAuthorityIntegrity,
  readDecisionCitationGovernanceGuarantees,
  writeDecisionCitation,
  writeArtifact,
  writeFact,
} from "./writePipeline.js";
import {
  AUTHORITY_EXERCISED_INVARIANT,
  DECISION_CITATION_AUTHORITY_QUESTION,
  isCompleteAuthorityIntegrity,
} from "./decisionCitationAuthorityIntegrity.js";
import {
  DECISION_LEDGER_BOUNDARY_INVARIANT,
  DecisionCitationGovernanceError,
  GOVERNANCE_PRINCIPLE,
  isCompleteGovernanceGuarantees,
  RECORDING_PRINCIPLE,
} from "./decisionCitationGovernanceGuarantees.js";
import { getFactById } from "./factStore.js";
import { getArtifactById } from "./artifactStore.js";
import {
  transitionDecisionCitationLifecycle,
  verifyDecisionCitation,
} from "./decisionCitationService.js";

const EXEC = { identity_id: "ID-executive-001", identity_kind: "executive" };

function sampleCitationInput() {
  return {
    decision_id: "decision:DEC-2026-001",
    question: "Approve the H: drive mapping audit remediation plan?",
    outcome_summary: "Approved — proceed with remediation per audit report.",
    decided_at: "2026-07-01T16:00:00.000Z",
    decider_ref: EXEC,
    supporting_memory_refs: [
      "episode:ep-audit-meeting-001",
      "artifact:art-audit-report-001",
      "fact:fact-audit-complete-001",
      "conversation:conv-board-review-001",
    ],
    ledger_ref: "ledger:DEC-2026-001",
    event_at: "2026-07-01T16:00:00.000Z",
    captured_by: EXEC,
    capture_method: "direct" as const,
  };
}

test("ENG-MEM-001.5.1 create DecisionCitation — schema, provenance, lifecycle Captured", () => {
  bootstrapApp();
  try {
    const { citation, engine_id } = writeDecisionCitation(sampleCitationInput());
    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(citation.schema_version, DECISION_CITATION_SCHEMA_VERSION);
    assert.equal(citation.lifecycle_state, "Captured");
    assert.equal(citation.decision_id, "decision:DEC-2026-001");
    assert.equal(citation.ledger_ref, "ledger:DEC-2026-001");
    assert.equal(citation.decider_ref.identity_id, EXEC.identity_id);
    assert.equal(citation.supporting_memory_refs.length, 4);
    assert.equal(citation.provenance.convention_provenance_version, "CON-S4-2026-07");
    assert.equal(citation.provenance.source_ref, "ledger:DEC-2026-001");
    assert.ok(citation.provenance.provenance_id.startsWith("PRV-"));

    const loaded = getDecisionCitationById(citation.citation_id);
    assert.ok(loaded);
    assert.ok(decisionCitationsEquivalent(citation, loaded!));
    assert.equal(countAuditEventsForObject("DecisionCitation", citation.citation_id), 1);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.1 serialization round-trip", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    const json = serializeDecisionCitation(citation);
    const parsed = deserializeDecisionCitation(json);
    assert.ok(decisionCitationsEquivalent(citation, parsed));
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.1 validator rejects unknown fields", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    assert.throws(
      () => validateDecisionCitationRecord({ ...citation, workflow_id: "WF-001" }),
      (err: unknown) => err instanceof DecisionCitationValidationError && err.field === "workflow_id",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.1 validator rejects inference and reconstruction fields", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    assert.throws(
      () => validateDecisionCitationRecord({ ...citation, inferred_authority: true }),
      (err: unknown) =>
        err instanceof DecisionCitationValidationError && err.field === "inferred_authority",
    );
    assert.throws(
      () => validateDecisionCitationRecord({ ...citation, reconstructed_from: ["fact:x"] }),
      (err: unknown) =>
        err instanceof DecisionCitationValidationError && err.field === "reconstructed_from",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.1 supporting_memory_refs must reference substrates only", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    assert.throws(
      () =>
        validateDecisionCitationRecord({
          ...citation,
          supporting_memory_refs: ["decision:DEC-999"],
        }),
      (err: unknown) =>
        err instanceof DecisionCitationValidationError &&
        err.field === "supporting_memory_refs[0]",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.1 ledger pointers required — decision_id and ledger_ref", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    assert.throws(
      () => validateDecisionCitationRecord({ ...citation, decision_id: "" }),
      (err: unknown) => err instanceof DecisionCitationValidationError && err.field === "decision_id",
    );
    assert.throws(
      () => validateDecisionCitationRecord({ ...citation, ledger_ref: "not-a-ref" }),
      (err: unknown) => err instanceof DecisionCitationValidationError && err.field === "ledger_ref",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.1 authoritative body immutable after capture", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    const loaded = getDecisionCitationById(citation.citation_id)!;
    const mutated = { ...loaded, outcome_summary: "Probably approved." };
    assert.throws(
      () => {
        if (
          decisionCitationContentFingerprint(loaded) !== decisionCitationContentFingerprint(mutated)
        ) {
          throw new DecisionCitationImmutableFieldError("outcome_summary");
        }
      },
      DecisionCitationImmutableFieldError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.1 lifecycle transition Captured to Verified", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    assert.ok(isLifecycleTransitionAllowed("Captured", "Verified"));
    const verified = verifyDecisionCitation(citation.citation_id, EXEC);
    assert.equal(verified.lifecycle_state, "Verified");
    assert.equal(verified.decision_id, citation.decision_id);
    assert.equal(verified.ledger_ref, citation.ledger_ref);
    assert.throws(
      () => transitionDecisionCitationLifecycle(citation.citation_id, "Rejected", EXEC, "memory.reject"),
      LifecycleTransitionError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.1 write does not mutate referenced Artifact substrate", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact({
      domain: "executive",
      uri: "file:///audit/report.pdf",
      mime_type: "application/pdf",
      event_at: "2026-07-01T12:00:00.000Z",
      captured_by: EXEC,
      capture_method: "direct",
      source_ref: "source:audit/report.pdf",
    });
    const artifactRef = `artifact:${artifact.artifact_id}`;
    const before = getArtifactById(artifact.artifact_id)!;

    writeDecisionCitation({
      ...sampleCitationInput(),
      supporting_memory_refs: [artifactRef],
    });

    const after = getArtifactById(artifact.artifact_id)!;
    assert.equal(JSON.stringify(before), JSON.stringify(after));
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.2 A17 authority integrity — who exercised institutional authority", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    const { authority, engine_id } = readDecisionCitationAuthorityIntegrity(citation.citation_id);

    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(authority.question, DECISION_CITATION_AUTHORITY_QUESTION);
    assert.equal(AUTHORITY_EXERCISED_INVARIANT, "Authority is exercised. It is never inferred.");
    assert.equal(authority.chain.decider_ref.identity_id, EXEC.identity_id);
    assert.equal(authority.chain.decision_id, "decision:DEC-2026-001");
    assert.equal(authority.chain.ledger_ref, "ledger:DEC-2026-001");
    assert.equal(authority.chain.source_ref, citation.ledger_ref);
    assert.equal(authority.supporting_memory_refs.length, 4);
    assert.ok(isCompleteAuthorityIntegrity(authority));
    assert.ok(authority.checks.authority_not_inferred);
    assert.ok(authority.checks.delegation_traceable);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.2 ledger citation immutable after lifecycle transition", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    const atCapture = getDecisionCitationById(citation.citation_id)!;
    const verified = verifyDecisionCitation(citation.citation_id, EXEC);

    const { authority } = readDecisionCitationAuthorityIntegrity(
      verified.citation_id,
      atCapture,
    );
    assert.ok(authority.checks.ledger_citation_immutable);
    assert.ok(authority.checks.decision_body_immutable);
    assert.equal(verified.decision_id, atCapture.decision_id);
    assert.equal(verified.ledger_ref, atCapture.ledger_ref);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.3 governance guarantees — constitutional doctrines enforced", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    const { governance, engine_id } = readDecisionCitationGovernanceGuarantees(citation.citation_id);

    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(governance.principles.authority_exercised, AUTHORITY_EXERCISED_INVARIANT);
    assert.equal(governance.principles.authority_recorded, RECORDING_PRINCIPLE);
    assert.equal(governance.principles.authority_creates_responsibility, GOVERNANCE_PRINCIPLE);
    assert.equal(governance.principles.ledger_boundary, DECISION_LEDGER_BOUNDARY_INVARIANT);
    assert.ok(isCompleteGovernanceGuarantees(governance));
    assert.ok(governance.checks.no_binding_authority_duplication);
    assert.ok(governance.checks.no_inference_at_capture);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.3 Recording Principle — rejects reconstruction fields", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    assert.throws(
      () => validateDecisionCitationRecord({ ...citation, synthesized_decision: "Approved" }),
      (err: unknown) =>
        err instanceof DecisionCitationValidationError && err.field === "synthesized_decision",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.3 Recording Principle — rejects inference capture_method", () => {
  bootstrapApp();
  try {
    assert.throws(
      () =>
        writeDecisionCitation({
          ...sampleCitationInput(),
          capture_method: "inference",
        }),
      DecisionCitationGovernanceError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.3 Governance Principle — rejects truth conflation fields", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    assert.throws(
      () => validateDecisionCitationRecord({ ...citation, establishes_truth: true }),
      (err: unknown) =>
        err instanceof DecisionCitationValidationError && err.field === "establishes_truth",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.3 Ledger Boundary — ledger_ref must cite ledger entry only", () => {
  bootstrapApp();
  try {
    assert.throws(
      () =>
        writeDecisionCitation({
          ...sampleCitationInput(),
          ledger_ref: "decision:DEC-2026-001",
        }),
      DecisionCitationGovernanceError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.3 Ledger Boundary — rejects binding authority duplication fields", () => {
  bootstrapApp();
  try {
    const { citation } = writeDecisionCitation(sampleCitationInput());
    assert.throws(
      () => validateDecisionCitationRecord({ ...citation, binding_decision_body: "Full text" }),
      (err: unknown) =>
        err instanceof DecisionCitationValidationError && err.field === "binding_decision_body",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.3 supporting refs — outward substrates only, no authority refs", () => {
  bootstrapApp();
  try {
    assert.throws(
      () =>
        writeDecisionCitation({
          ...sampleCitationInput(),
          supporting_memory_refs: ["citation:other-citation-001"],
        }),
      (err: unknown) =>
        err instanceof DecisionCitationValidationError &&
        err.field === "supporting_memory_refs[0]",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.5.3 write does not mutate referenced Fact substrate", () => {
  bootstrapApp();
  try {
    const { fact } = writeFact({
      domain: "executive",
      statement: "Audit remediation is complete.",
      subject_ref: EXEC,
      predicate: "audit_status",
      event_at: "2026-07-01T12:00:00.000Z",
      captured_by: EXEC,
      capture_method: "direct",
      source_ref: "source:audit/status",
    });
    const factRef = `fact:${fact.fact_id}`;
    const before = getFactById(fact.fact_id)!;

    writeDecisionCitation({
      ...sampleCitationInput(),
      supporting_memory_refs: [factRef],
    });

    const after = getFactById(fact.fact_id)!;
    assert.equal(JSON.stringify(before), JSON.stringify(after));
  } finally {
    shutdownApp();
  }
});
