import test from "node:test";
import assert from "node:assert/strict";
import { COMMUNICATIONS_DRAFT_VERSION } from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { writeFact } from "../memory/writePipeline.js";
import { assembleConstitutionalEvidencePackage } from "../executiveIntelligence/constitutionalRetrievalService.js";
import { assembleTraceableCommunicationsDraft } from "./communicationsDraftAssembler.js";
import { CommunicationsDraftAdvisoryRestraintError } from "./communicationsDraftAdvisoryRestraintValidator.js";
import { CommunicationsDraftTraceabilityError } from "./communicationsDraftValidator.js";
import { CommunicationsDraftUncertaintyError } from "./communicationsDraftUncertaintyValidator.js";
import {
  proposeDecisionAuthorityDraft,
  proposeFixtureTraceableDraft,
  proposePolicyViolationDraft,
  proposeRecommendationViolationDraft,
  proposeWithheldDecisionRequest,
} from "./fixtureTraceableDraftAdapter.js";
import { generateTraceableCommunicationsDraft } from "./traceableDraftGenerator.js";

const EXEC = { identity_id: "ID-executive-001", identity_kind: "executive" };

function seedObservedFact() {
  const { fact } = writeFact({
    domain: "executive",
    statement: "Q3 initiative remains on track.",
    subject_ref: { identity_id: "ID-initiative-a", identity_kind: "organization" },
    predicate: "status",
    object_ref: "status:on_track",
    event_at: "2026-07-01T10:00:00.000Z",
    valid_from: "2026-07-01T10:00:00.000Z",
    source_ref: "source:com-a/observed",
    captured_by: EXEC,
    capture_method: "direct",
    confidence_level: "observed",
  });
  return fact;
}

function packageForFact(factId: string, requestId: string) {
  return assembleConstitutionalEvidencePackage({
    request_id: requestId,
    scope_label: "Advisory restraint fixture",
    substrate_refs: { fact: [factId] },
  });
}

test("ENG-COM-001.3 A1 rejects policy statements under ambiguous policy prompts", () => {
  bootstrapApp();
  try {
    const fact = seedObservedFact();
    const pkg = packageForFact(fact.fact_id, "req-com-a1");
    const request = {
      request_id: "com-req-a1",
      intent_label: "What should our policy be on the initiative?",
    };
    const ref = `fact:${fact.fact_id}`;
    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(
          pkg,
          request,
          proposePolicyViolationDraft(ref),
        ),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftAdvisoryRestraintError);
        assert.equal(err.code, "A1_POLICY_STATEMENT");
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.3 A2 rejects recommendations under ambiguous prioritization prompts", () => {
  bootstrapApp();
  try {
    const fact = seedObservedFact();
    const pkg = packageForFact(fact.fact_id, "req-com-a2");
    const request = {
      request_id: "com-req-a2",
      intent_label: "What should we prioritize for the board?",
    };
    const ref = `fact:${fact.fact_id}`;
    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(
          pkg,
          request,
          proposeRecommendationViolationDraft(ref),
        ),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftAdvisoryRestraintError);
        assert.equal(err.code, "A2_RECOMMENDATION_OR_PRIORITIZATION");
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.3 A3 rejects boundary collapse under pressuring prompts", () => {
  bootstrapApp();
  try {
    const fact = seedObservedFact();
    const pkg = packageForFact(fact.fact_id, "req-com-a3");
    const request = {
      request_id: "com-req-a3",
      intent_label: "Urgent — just tell us what to do immediately, no hedging",
    };
    const ref = `fact:${fact.fact_id}`;
    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(
          pkg,
          request,
          proposeRecommendationViolationDraft(ref),
        ),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftAdvisoryRestraintError);
        assert.equal(err.code, "A3_PRESSURE_BOUNDARY_COLLAPSE");
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.3 A4 withholds decision-making requests without fabricated authority", () => {
  bootstrapApp();
  try {
    const fact = seedObservedFact();
    const pkg = packageForFact(fact.fact_id, "req-com-a4a");
    const request = {
      request_id: "com-req-a4a",
      intent_label: "Decide for us whether to proceed",
    };
    const result = assembleTraceableCommunicationsDraft(
      pkg,
      request,
      proposeWithheldDecisionRequest("proceed with initiative"),
    );
    assert.equal(result.draft.statements.length, 0);
    assert.equal(result.draft.withheld.length, 1);
    assert.equal(result.draft.withheld[0]!.kind, "unsupported_request");

    const ref = `fact:${fact.fact_id}`;
    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(
          pkg,
          request,
          proposeDecisionAuthorityDraft(ref),
        ),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftAdvisoryRestraintError);
        assert.equal(err.code, "A4_DECISION_AUTHORITY_FABRICATED");
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.3 A5 preserves inherited traceability and uncertainty through composed validation", async () => {
  bootstrapApp();
  try {
    const fact = seedObservedFact();
    const pkg = packageForFact(fact.fact_id, "req-com-a5");
    const request = {
      request_id: "com-req-a5",
      intent_label: "Ambiguous update — recommend a policy and decide for us urgently",
      audience_label: "Board observers",
    };
    const result = await generateTraceableCommunicationsDraft(pkg, request, {
      adapter: proposeFixtureTraceableDraft,
    });
    assert.equal(result.draft.draft_version, COMMUNICATIONS_DRAFT_VERSION);
    assert.ok(result.draft.statements.length > 0);
    assert.ok(result.citation_mapping.entries.length > 0);
    assert.equal(result.citation_mapping.unmapped_statement_ids.length, 0);
    const stmt = result.draft.statements[0]!;
    assert.equal(stmt.epistemic_level, "qualified");
    assert.ok(stmt.uncertainty_note?.includes("observed"));
    assert.ok(!/recommend|policy is|decided/i.test(stmt.text));
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.3 composed pipeline still rejects inherited traceability violations", () => {
  bootstrapApp();
  try {
    const fact = seedObservedFact();
    const pkg = packageForFact(fact.fact_id, "req-com-a5b");
    const request = {
      request_id: "com-req-a5b",
      intent_label: "Status update",
    };
    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(pkg, request, {
          statements: [
            {
              text: "Unsupported claim without evidence.",
              citation_refs: [],
              epistemic_level: "established",
            },
          ],
          withheld: [],
        }),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftTraceabilityError);
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-COM-001.3 composed pipeline still rejects inherited uncertainty violations", () => {
  bootstrapApp();
  try {
    const fact = seedObservedFact();
    const pkg = packageForFact(fact.fact_id, "req-com-a5c");
    const request = {
      request_id: "com-req-a5c",
      intent_label: "Status update",
    };
    const ref = `fact:${fact.fact_id}`;
    assert.throws(
      () =>
        assembleTraceableCommunicationsDraft(pkg, request, {
          statements: [
            {
              text: "The initiative is definitely on track.",
              citation_refs: [ref],
              epistemic_level: "established",
              uncertainty_markers: [],
            },
          ],
          withheld: [],
        }),
      (err: unknown) => {
        assert.ok(err instanceof CommunicationsDraftUncertaintyError);
        return true;
      },
    );
  } finally {
    shutdownApp();
  }
});
