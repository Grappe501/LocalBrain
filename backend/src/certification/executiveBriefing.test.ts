import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  COS_EDITORIAL_ACTIONS,
  EXECUTIVE_BRIEFING_ENGINE_ID,
  EXECUTIVE_DAILY_QUESTIONS,
  buildExecutiveOfficeExperience,
} from "@localbrain/shared";

describe("ENG-EOB-001 executive office experience", () => {
  it("defines four daily executive questions", () => {
    assert.equal(EXECUTIVE_DAILY_QUESTIONS.length, 4);
    assert.ok(EXECUTIVE_DAILY_QUESTIONS[0].includes("attention"));
  });

  it("projects Chief of Staff narrative briefing — not widget grid", () => {
    const exp = buildExecutiveOfficeExperience();
    assert.equal(exp.engine_id, EXECUTIVE_BRIEFING_ENGINE_ID);
    assert.equal(exp.experience_title, "Executive Office");
    assert.ok(exp.briefing.narrative.length > 50);
    assert.equal(exp.briefing.title, "Chief of Staff Briefing");
    assert.ok(exp.briefing.estimated_reading_minutes >= 1);
  });

  it("department reports include what changed since yesterday", () => {
    const exp = buildExecutiveOfficeExperience();
    assert.ok(exp.department_reports.length >= 5);
    for (const report of exp.department_reports) {
      assert.ok(report.summary.length > 0);
      assert.ok(report.what_changed_since_yesterday.length > 0);
      assert.ok(COS_EDITORIAL_ACTIONS.includes(report.editorial_action));
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

  it("defines CoS editorial actions", () => {
    assert.deepEqual(COS_EDITORIAL_ACTIONS, [
      "include",
      "merge",
      "suppress",
      "escalate",
      "delay",
    ]);
  });

  it("briefing archive schema ready — empty in scaffold mode", () => {
    const exp = buildExecutiveOfficeExperience();
    assert.equal(exp.projection_mode, "scaffold");
    assert.equal(exp.archive.length, 0);
  });
});
