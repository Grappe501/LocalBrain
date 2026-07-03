import test from "node:test";
import assert from "node:assert/strict";
import { COMMUNICATIONS_DRAFT_VERSION } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { writeFact } from "../memory/writePipeline.js";
import { assembleConstitutionalEvidencePackage } from "../executiveIntelligence/constitutionalRetrievalService.js";
import { assembleTraceableCommunicationsDraft } from "./communicationsDraftAssembler.js";
import { CommunicationsDraftUncertaintyError } from "./communicationsDraftUncertaintyValidator.js";
import {
  proposeFixtureTraceableDraft,
  proposeStrengthenedDraftProposal,
} from "./fixtureTraceableDraftAdapter.js";
import { generateTraceableCommunicationsDraft } from "./traceableDraftGenerator.js";

const EXEC = { identity_id: "ID-executive-001", identity_kind: "executive" };

const COM_REQUEST = {
  request_id: "com-req-u1",
  intent_label: "Uncertainty preservation fixture",
};

function seedHypothesisFact() {
  const { fact } = writeFact({
    domain: "executive",
    statement: "The initiative may remain viable under current constraints.",
    subject_ref: { identity_id: "ID-initiative-u", identity_kind: "organization" },
    predicate: "viability",
    object_ref: "status:uncertain",
    event_at: "2026-07-01T10:00:00.000Z",
    valid_from: "2026-07-01T10:00:00.000Z",
    source_ref: "source:com-u/hypothesis",
    captured_by: EXEC,
    capture_method: "direct",
    confidence_level: "hypothesis",
  });
  return fact;
}

function seedObservedFact() {
  const { fact } = writeFact({
    domain: "executive",
    statement: "Q3 initiative remains on track.",
    subject_ref: { identity_id: "ID-initiative-o", identity_kind: "organization" },
    predicate: "status",
    object_ref: "status:on_track",
    event_at: "2026-07-01T10:00:00.000Z",
    valid_from: "2026-07-01T10:00:00.000Z",
    source_ref: "source:com-u/observed",
    captured_by: EXEC,
    capture_method: "direct",
    confidence_level: "observed",
  });
  return fact;
}

test("ENG-COM-001.2 U1 preserves explicit package uncertainty in draft", async () => {
  bootstrapApp();
  try {
    const fact = seedObservedFact();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-u1",
      scope_label: "U1 fixture",
      substrate_refs: { fact: [fact.fact_id] },
    });
    const result = await generateTraceableCommunicationsDraft(pkg, COM_REQUEST, {
      adapter: proposeFixtureTraceableDraft,
    });
    const stmt = result.draft.statements[0]!;
    assert.ok(stmt.text.toLowerCase().includes("suggests"));
    assert.equal(stmt.epistemic_level, "qualified");
    assert.ok(stmt.uncertainty_note?.includes("observed"));
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.2 U2 rejects declared epistemic strengthening", () => {
  bootstrapApp();
  try {
    const fact = seedHypothesisFact();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-u2a",
      scope_label: "U2 fixture",
      substrate_refs: { fact: [fact.fact_id] },
    });
    const ref = `fact:${fact.fact_id}`;
    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(
          pkg,
          COM_REQUEST,
          proposeStrengthenedDraftProposal(
            pkg,
            ref,
            "The initiative remains viable.",
          ),
        ),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftUncertaintyError);
        assert.equal(err.code, "U2_CONFIDENCE_STRENGTHENED");
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.2 U2 rejects lexical strengthening when implication increases confidence", () => {
  bootstrapApp();
  try {
    const fact = seedHypothesisFact();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-u2b",
      scope_label: "U2 lexical fixture",
      substrate_refs: { fact: [fact.fact_id] },
    });
    const ref = `fact:${fact.fact_id}`;
    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(pkg, COM_REQUEST, {
          statements: [
            {
              text: "It appears the initiative remains viable.",
              citation_refs: [ref],
              epistemic_level: "qualified",
              uncertainty_markers: [],
            },
          ],
          withheld: [],
        }),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftUncertaintyError);
        assert.equal(err.code, "U2_CONFIDENCE_STRENGTHENED");
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.2 U3 uncertain statements remain distinguishable from confirmed", async () => {
  bootstrapApp();
  try {
    const fact = seedHypothesisFact();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-u3",
      scope_label: "U3 fixture",
      substrate_refs: { fact: [fact.fact_id] },
    });
    const result = await generateTraceableCommunicationsDraft(pkg, COM_REQUEST, {
      adapter: proposeFixtureTraceableDraft,
    });
    assert.equal(result.draft.statements[0]!.epistemic_level, "hypothesis");
    assert.notEqual(result.draft.statements[0]!.epistemic_level, "established");
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.2 U4 rejects implied certainty from hypothesis evidence", () => {
  bootstrapApp();
  try {
    const fact = seedHypothesisFact();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-u4",
      scope_label: "U4 fixture",
      substrate_refs: { fact: [fact.fact_id] },
    });
    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(pkg, COM_REQUEST, {
          statements: [
            {
              text: "The initiative is viable.",
              citation_refs: [`fact:${fact.fact_id}`],
              epistemic_level: "established",
            },
          ],
          withheld: [],
        }),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftUncertaintyError);
        assert.ok(err.code === "U4_IMPLIED_CERTAINTY" || err.code === "U2_CONFIDENCE_STRENGTHENED");
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.2 U5 citation mapping preserves uncertainty context", async () => {
  bootstrapApp();
  try {
    const fact = seedObservedFact();
    const pkg = assembleConstitutionalEvidencePackage({
      request_id: "req-com-u5",
      scope_label: "U5 fixture",
      substrate_refs: { fact: [fact.fact_id] },
    });
    const result = await generateTraceableCommunicationsDraft(pkg, COM_REQUEST, {
      adapter: proposeFixtureTraceableDraft,
    });
    const entry = result.citation_mapping.entries.find(
      (e) => e.citation_ref === `fact:${fact.fact_id}`,
    );
    assert.ok(entry);
    assert.equal(entry!.source_epistemic_level, "qualified");
    assert.ok(entry!.uncertainty_context?.includes("observed"));
    assert.ok(entry!.statement_ids.includes(result.draft.statements[0]!.statement_id));
    assert.equal(result.draft.draft_version, COMMUNICATIONS_DRAFT_VERSION);
  } finally {
    shutdownApp();
  }
});
