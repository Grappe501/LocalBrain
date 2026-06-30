import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  runExecutiveExperienceAudit,
  runExecutiveJourneyTest,
  runGraphIntegrityCertification,
  runReverseJourneyTest,
} from "../integration/executiveExperienceAudit.js";
import {
  CAPABILITY_REGISTRY,
  getAuthoritativeCapabilityForQuestion,
  PHASE_1_EXECUTIVE_QUESTIONS,
  resolveExecutiveIntent,
  resolveRouteForQuestion,
} from "@localbrain/shared";

describe("ENG-CAP-001 capability registry", () => {
  it("registers every live production capability", () => {
    assert.ok(CAPABILITY_REGISTRY.length >= 22);
  });

  it("resolves authoritative route per executive question", () => {
    for (const q of PHASE_1_EXECUTIVE_QUESTIONS) {
      const route = resolveRouteForQuestion(q.question_id);
      assert.ok(route, `missing route for ${q.question_id}`);
      const auth = getAuthoritativeCapabilityForQuestion(q.question_id);
      assert.ok(auth, `missing authoritative capability for ${q.question_id}`);
    }
  });

  it("resolves migration planning intent", () => {
    const res = resolveExecutiveIntent("I need to move my ContactList workspace");
    assert.ok(res);
    assert.equal(res?.matched_capability_id, "CAP-PLN-001");
    assert.equal(res?.authoritative_route, "/migration/planning");
  });
});

describe("executive journey tests", () => {
  it("forward migration journey from architecture to cutover", () => {
    const result = runExecutiveJourneyTest();
    assert.equal(result.pass, true, result.missing_steps.join(", "));
  });

  it("reverse journey from proof reaches dashboard and adjacent stages", () => {
    const result = runReverseJourneyTest();
    assert.equal(result.pass, true, result.missing_steps.join(", "));
  });
});

describe("executive experience certification", () => {
  it("produces certification report with cohesion dimensions", () => {
    const report = runExecutiveExperienceAudit();
    assert.equal(report.slice_id, "LB-OS-026.6");
    assert.ok(report.metrics.registered_capabilities >= 22);
    assert.equal(report.workflow_continuity_pass, true);
    assert.equal(report.cross_link_integrity_pass, true);
  });
});

describe("graph integrity certification", () => {
  it("passes platform consistency sweep for LB-OS-026.6", () => {
    const report = runGraphIntegrityCertification();
    assert.equal(report.certified, true, report.violations.map((v) => v.message).join("; "));
    assert.equal(report.checks_passed, report.checks_total);
  });
});
