import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { parsePhaseChecklistSlices, parsePhaseSections, parsePeerReviewProgress } from "../epo/checklistParser.js";
import { explainBlocker } from "../epo/blockerExplainer.js";
import { getEpoOverview, getEpoSliceDetail, getProjectState, listDocumentationLibrary } from "../epo/epoService.js";
import { BUILD_STATE_ENGINE_ID, computeBuildState } from "./buildStateEngine.js";
import { certifyCurrentModule } from "./moduleCertificationEngine.js";
import { computeAdaptiveForecast } from "./v1ForecastEngine.js";
import { computeV1CommandCenter } from "./v1CommandCenterEngine.js";
import { getMemoryOsProgressSnapshot } from "./memoryOsSpecMetrics.js";
import { getCommunicationsOfficeSnapshot } from "./communicationsOfficeMetrics.js";
import { getExecutiveIntelligenceEraSnapshot } from "./executiveIntelligenceEraMetrics.js";
import { parseSliceRegistry } from "./sliceRegistry.js";

test("parsePhaseChecklistSlices reads all phase tables", () => {
  const slices = parsePhaseChecklistSlices();
  assert.ok(slices.length >= 25);
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-017" && s.status === "complete"));
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-019" && s.status === "complete"));
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-020" && s.status === "complete"));
  assert.ok(slices.some((s) => s.slice_id === "LB-OS-020.5" && s.status === "complete"));
});

test("memory OS progress reflects spec freeze and Wave 1 impl — 100% at foundation complete", () => {
  const snap = getMemoryOsProgressSnapshot();
  assert.equal(snap.spec_frozen, true);
  assert.equal(snap.mem008.passed, 107);
  assert.equal(snap.wave1_complete_count, 5);
  assert.equal(snap.module_progress_percent, 100);
  assert.ok(
    snap.building_today.includes("ENG-COM-001") ||
      snap.building_today.includes("Communications"),
  );

  const state = computeBuildState();
  const cc = computeV1CommandCenter(state);
  const memory = cc.modules.find((m) => m.module_id === "memory_os");
  assert.ok(memory);
  assert.equal(memory!.progress_percent, 100);
  assert.equal(cc.critical_path.find((n) => n.step_id === "memory_os")?.status, "complete");

  const memCert = certifyCurrentModule("memory_os");
  assert.ok(memCert);
  const testsDim = memCert!.dimensions.find((d) => d.dimension_id === "tests");
  assert.ok(testsDim?.evidence?.includes("decisionCitation"));
  assert.ok(memCert!.dimensions.find((d) => d.dimension_id === "experience")?.evidence?.includes("5/5"));
});

test("parseSliceRegistry loads dependencies from queue", () => {
  const { order, dependencies } = parseSliceRegistry();
  assert.ok(order.includes("LB-OS-020"));
  assert.ok(dependencies["LB-OS-020"]?.includes("LB-OS-019"));
  assert.ok(dependencies["LB-OS-016"]?.includes("LB-OS-015"));
});

test("parsePhaseSections derives phases from checklist", () => {
  const phases = parsePhaseSections();
  assert.ok(phases.length >= 3);
  const migration = phases.find((p) => p.label.toLowerCase().includes("migration"));
  assert.ok(migration);
  assert.ok(migration!.slice_ids.includes("LB-OS-020"));
});

test("Executive Intelligence Era metrics reflect ENG-EI-002 complete and deterministic pipeline closed", () => {
  const ei = getExecutiveIntelligenceEraSnapshot();
  assert.equal(ei.era_authorized, true);
  assert.equal(ei.doctrine_articles, 9);
  assert.equal(ei.mar3_complete, true);
  assert.equal(ei.mar3_questions_pending, 0);
  assert.equal(ei.doctrine_frozen, true);
  assert.equal(ei.pre_impl_progress_percent, 100);
  assert.equal(ei.retrieval_complete, true);
  assert.equal(ei.work_product_started, true);
  assert.equal(ei.work_product_complete, true);
  assert.equal(ei.implementation_phase, "work_product");
  assert.deepEqual(ei.work_product_slices_complete, ["ENG-EI-002.1", "ENG-EI-002.2"]);
  assert.equal(ei.work_product_progress_percent, 100);
  assert.equal(ei.work_product_contract_version, "ENG-EI-002.2");
  assert.equal(ei.reference_consumer_id, "Reference Consumer 001");
  assert.equal(ei.brief_tests_count, 7);
  assert.equal(ei.retrieval_contract_version, "ENG-EI-001.3");
  assert.equal(ei.retrieval_tests_count, 12);
  assert.ok(ei.building_today.includes("ENG-EI-002 COMPLETE"));
  assert.ok(ei.building_today.includes("Reference Consumer 001"));
  assert.ok(ei.summary.includes("ENG-PMO-009"));
  assert.ok(ei.smallest_next_slice.includes("Communications"));
});

test("Communications Office metrics reflect ENG-COM-001.3 complete", () => {
  const com = getCommunicationsOfficeSnapshot();
  assert.equal(com.charter_authorized, true);
  assert.equal(com.office_started, true);
  assert.equal(com.slice_001_1_complete, true);
  assert.equal(com.slice_001_2_complete, true);
  assert.equal(com.slice_001_3_authorized, true);
  assert.equal(com.slice_001_3_complete, true);
  assert.equal(com.baseline_stable, false);
  assert.equal(com.slice_active, null);
  assert.equal(com.module_progress_percent, 90);
  assert.ok(com.building_today.includes("ENG-COM-001.3"));
  assert.ok(com.building_today.includes("COMPLETE"));
  assert.ok(com.smallest_next_slice.includes("module evaluation"));
  assert.equal(com.contract_version, "ENG-COM-001.3");
});

test("V1 command center reflects ENG-COM-001.3 complete", () => {
  const state = computeBuildState();
  const cc = computeV1CommandCenter(state);
  assert.ok(cc.building_today?.includes("ENG-COM-001.3"));
  assert.ok(cc.building_today?.includes("COMPLETE"));
  const comms = cc.modules.find((m) => m.module_id === "communications");
  assert.ok(comms);
  assert.equal(comms!.progress_percent, 90);
  assert.equal(comms!.version, "ENG-COM-001.3");
  assert.equal(comms!.status, "in_progress");
});

test("computeBuildState projects current sprint and velocity", () => {
  const state = computeBuildState();
  const cc = computeV1CommandCenter(state);
  assert.ok(state.current_slice_id);
  assert.ok(
    cc.building_today?.includes("ENG-COM-001") ||
      cc.building_today?.includes("Communications"),
  );
  assert.ok(
    state.current_phase_label.toLowerCase().includes("memory") ||
      state.current_phase_label.includes("Executive Memory") ||
      state.current_phase_label.includes("Executive Intelligence") ||
      state.current_phase_label.includes("Communications") ||
      cc.building_today?.includes("ENG-COM-001") ||
      cc.building_today?.includes("ENG-EI-002"),
  );
  assert.ok(
    state.build_graph.some((n) => n.slice_id === "LB-OS-020" && n.status === "released"),
  );
  assert.ok(
    state.build_graph.some((n) => n.slice_id === "LB-OS-020.5" && n.status === "released"),
  );
  assert.ok(state.build_velocity.commits_count >= 0);
  assert.ok(state.build_graph.some((n) => n.slice_id === "LB-OS-019" && n.status === "released"));
  assert.notEqual(state.current_slice_id, "LB-OS-027.0");
});

test("getEpoOverview exposes build state engine fields", () => {
  const overview = getEpoOverview();
  assert.equal(overview.read_only, true);
  assert.equal(overview.build_state_engine_id, BUILD_STATE_ENGINE_ID);
  assert.ok(overview.current_slice_id);
  assert.ok(
    overview.current_phase_label.toLowerCase().includes("memory") ||
      overview.current_phase_label.includes("Executive Memory") ||
      overview.current_phase_label.includes("Executive Intelligence") ||
      overview.current_phase_label.includes("Communications") ||
      overview.v1_command_center?.building_today?.includes("ENG-COM-001") ||
      overview.v1_command_center?.building_today?.includes("ENG-EI-002"),
  );
  assert.ok(overview.phases.length >= 4);
  assert.ok(overview.commit_timeline.length > 0);
  assert.ok(overview.experience_maturity.length >= 10);
  assert.equal(overview.experience_maturity_engine_id, "ENG-EXP-001");
  assert.ok(overview.v1_command_center);
  assert.equal(overview.v1_command_center.engine_id, "ENG-BLD-001-V1CC");
  assert.ok(overview.v1_command_center.modules.length >= 6);
  assert.ok(overview.v1_command_center.v1_launch_score_percent >= 0);
  assert.ok(overview.project_state);
  assert.equal(overview.project_state.engine_id, "ENG-BLD-001-PSTATE");
  assert.equal(
    overview.metrics.overall_progress_percent,
    overview.project_state.launch_score_percent,
  );
  assert.ok(overview.project_state.build_history.length > 0);
  assert.ok(overview.project_state.launch_countdown);
  assert.ok(overview.project_state.ceo_mode);
  assert.ok(overview.project_state.ceo_mode.v1_roadmap.length === 9);
  assert.ok(overview.project_state.ceo_mode.current_module_certification);
  assert.ok(overview.project_state.ceo_mode.phase_forecast);
  assert.equal(overview.project_state.ceo_mode.phase_forecast.engine_id, "ENG-BLD-001-PFCST");
  assert.ok(overview.project_state.ceo_mode.phase_forecast.phases.length === 9);
  assert.ok(overview.project_state.ceo_mode.phase_forecast.current_mega_phase.label.includes("Phase"));
  assert.ok(overview.project_state.ceo_mode.burt_session_start);
  assert.ok(overview.project_state.ceo_mode.burt_session_start.current_critical_path);
  const roadmap = overview.project_state.ceo_mode.v1_roadmap;
  assert.equal(roadmap.find((r) => r.id === "session_4")?.status, "complete");
  assert.equal(roadmap.find((r) => r.id === "session_5")?.status, "complete");
  assert.equal(roadmap.find((r) => r.id === "theory_freeze")?.status, "complete");
  assert.equal(roadmap.find((r) => r.id === "convention")?.status, "complete");
  assert.ok(overview.project_state.ceo_mode.theory_status.frozen);
  assert.equal(overview.project_state.ceo_mode.theory_status.remaining_risk, "IMPLEMENTATION");
  assert.equal(overview.project_state.launch_countdown.current_phase, "Construction");
});

test("parsePeerReviewProgress reads Evidence Base automatically", () => {
  const pr = parsePeerReviewProgress();
  assert.equal(pr.source, "evidence_base");
  assert.equal(pr.s4, "complete");
  assert.equal(pr.s5, "complete");
  assert.equal(pr.theory_frozen, true);
  assert.equal(pr.convention, "complete");
});

test("certifyCurrentModule produces dimension rows for Executive Office", () => {
  const card = certifyCurrentModule("executive_office");
  assert.ok(card);
  assert.equal(card!.module_id, "executive_office");
  assert.equal(card!.dimensions.length, 6);
  assert.ok(card!.dimensions.some((d) => d.dimension_id === "navigation"));
  assert.equal(card!.launch_status, "certified", card!.dimensions.map((d) => `${d.dimension_id}:${d.status}`).join(", "));
  assert.equal(card!.review_verdict, "PASS");
  assert.equal(card!.certification_locked, true);
});

test("computeAdaptiveForecast produces predicted launch with confidence", () => {
  const state = computeBuildState();
  const cc = computeV1CommandCenter(state);
  const fc = computeAdaptiveForecast(state, cc, cc.v1_launch_score_percent);
  assert.equal(fc.engine_id, "ENG-BLD-001-FCST");
  assert.ok(fc.prediction_confidence_percent >= 22);
  assert.ok(fc.today.predicted_launch_date);
  assert.ok(fc.schedule_drift.length >= 1);
  assert.ok(fc.pmo_reasoning.length >= 1);
});

test("phase forecast produces module ETAs and finishability", () => {
  const ps = getProjectState();
  const pf = ps.ceo_mode.phase_forecast;
  assert.ok(pf.days_to_commercial_beta != null);
  assert.ok(pf.phases.some((p) => p.phase_id === "executive_office_cert"));
  assert.ok(pf.phases.some((p) => p.phase_id === "session_4"));
  const s4 = pf.phases.find((p) => p.phase_id === "session_4");
  assert.ok(s4);
  assert.ok(s4!.finishability_percent >= 80);
  assert.ok(pf.reasons.length >= 1);
});

test("getProjectState includes adaptive forecast", () => {
  const ps = getProjectState();
  assert.ok(ps.adaptive_forecast);
  assert.equal(ps.adaptive_forecast.engine_id, "ENG-BLD-001-FCST");
});

test("getProjectState is single source of truth for launch metrics", () => {
  const ps = getProjectState();
  assert.equal(ps.engine_id, "ENG-BLD-001-PSTATE");
  assert.ok(ps.launch_score_percent >= 0);
  assert.ok(ps.launch_countdown.modules_remaining >= 0);
  assert.equal(ps.command_center.v1_launch_score_percent, ps.launch_score_percent);
});

test("computeV1CommandCenter projects critical path and weighted score", () => {
  const state = computeBuildState();
  const cc = computeV1CommandCenter(state);
  assert.equal(cc.critical_path.length, 9);
  assert.ok(cc.modules.some((m) => m.module_id === "executive_office"));
  assert.ok(cc.launch_breakdown.reduce((s, r) => s + r.weight_percent, 0) === 100);
  assert.ok(cc.product_version.includes("V1-implement"));
});

test("blocker explanation for planned slice with deps", () => {
  const slices = parsePhaseChecklistSlices();
  const map = new Map(slices.map((s) => [s.slice_id, s]));
  const { dependencies } = parseSliceRegistry();
  const planned = map.get("LB-OS-028");
  assert.ok(planned);
  assert.equal(planned!.status, "planned");
  const exp = explainBlocker(planned!, map, dependencies);
  assert.ok(exp);
});

test("getEpoSliceDetail returns coverage and mission", () => {
  try {
    bootstrapApp();
  } catch {
    /* db may be busy in parallel test runs */
  }
  const detail = getEpoSliceDetail("LB-OS-011");
  assert.ok(detail);
  assert.equal(detail!.slice_id, "LB-OS-011");
  assert.ok(detail!.coverage.implementation >= 90);
});

test("docs library is searchable", () => {
  const docs = listDocumentationLibrary();
  assert.ok(docs.length > 10);
  const filtered = listDocumentationLibrary("Engineering");
  assert.ok(filtered.length >= 1);
});

test.after(() => {
  closeDatabase();
});
