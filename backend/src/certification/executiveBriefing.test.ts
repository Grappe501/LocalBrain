import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildExecutiveOfficeExperience,
  type ExecutiveBriefingSignals,
} from "@localbrain/shared";
import { getExecutiveOfficeExperience } from "../integration/executiveBriefingService.js";

describe("ENG-EOB-001 executive office experience", () => {
  it("defines four daily executive questions", () => {
    const exp = buildExecutiveOfficeExperience();
    assert.equal(exp.daily_questions.length, 4);
    assert.ok(exp.daily_questions[0].includes("attention"));
  });

  it("projects Chief of Staff narrative briefing — not widget grid", () => {
    const exp = buildExecutiveOfficeExperience();
    assert.equal(exp.experience_title, "Executive Office");
    assert.ok(exp.briefing.narrative.length > 50);
    assert.equal(exp.briefing.title, "Chief of Staff Briefing");
    assert.ok(exp.briefing.estimated_reading_minutes >= 1);
  });

  it("synthesizes CoS narrative from real signals only", () => {
    const signals: ExecutiveBriefingSignals = {
      v1_overall_pass: false,
      v1_failed_checks: ["Workspace registry"],
      consolidation_score: 72,
      consolidation_band: "High",
      graph_integrity_pass: true,
      workspace_focus: "LB-OS-026.7",
      current_build_slice: "LB-OS-026.7",
    };
    const exp = buildExecutiveOfficeExperience(signals);
    assert.ok(exp.briefing.narrative.includes("graph integrity"));
    assert.ok(exp.briefing.narrative.includes("72/100"));
    assert.ok(exp.briefing.narrative.includes("reserved"));
    assert.ok(!exp.briefing.narrative.toLowerCase().includes("gmail"));
    assert.ok(exp.briefing.top_priorities.some((p) => p.includes("V1 spine")));
  });

  it("department reports include what changed since yesterday", () => {
    const exp = buildExecutiveOfficeExperience();
    assert.ok(exp.department_reports.length >= 5);
    for (const report of exp.department_reports) {
      assert.ok(report.summary.length > 0);
      assert.ok(report.what_changed_since_yesterday.length > 0);
    }
  });

  it("Chief of Staff is synthesis — not duplicated as department report", () => {
    const exp = buildExecutiveOfficeExperience();
    assert.ok(
      !exp.department_reports.some((r) => r.department_id === exp.office.synthesis_department_id),
    );
  });

  it("zones follow briefing → workspace → office → operations order", () => {
    const exp = buildExecutiveOfficeExperience();
    assert.deepEqual(
      exp.zones.map((z) => z.zone_id),
      ["briefing", "workspace", "office", "operations"],
    );
  });

  it("zone links use UI routes not API paths", () => {
    const exp = buildExecutiveOfficeExperience();
    const workspace = exp.zones.find((z) => z.zone_id === "workspace");
    assert.ok(workspace?.items.some((i) => i.route.startsWith("/workspace")));
    assert.ok(!workspace?.items.some((i) => i.route.startsWith("/api")));
  });

  it("briefing archive schema ready — empty in scaffold mode", () => {
    const exp = buildExecutiveOfficeExperience();
    assert.equal(exp.projection_mode, "scaffold");
    assert.equal(exp.archive.length, 0);
  });
});

describe("Executive Office home API (LB-OS-026.7)", () => {
  it("returns experience with live briefing signals", () => {
    const { experience, signals } = getExecutiveOfficeExperience();
    assert.equal(experience.slice_id, "LB-OS-026.7");
    assert.equal(experience.projection_mode, "scaffold");
    assert.ok(experience.department_reports.length >= 5);
    assert.ok(typeof signals.graph_integrity_pass === "boolean");
    assert.ok(experience.briefing.narrative.length > 40);
  });
});
