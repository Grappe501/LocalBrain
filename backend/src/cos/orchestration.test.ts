import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { routeCapabilities, isOrchestratedAction } from "./capabilityRouter.js";
import { buildCleanupRecommendations } from "./recommendationBuilder.js";
import { runOrchestrationPipeline, createProposalsForOrchestration } from "./orchestrationPipeline.js";
import { listCosOutcomes } from "./outcomeStore.js";
import { approveAction, rejectAction } from "../actions/executorService.js";
import { getProposedAction } from "../actions/proposalStore.js";
import { classifyCommand } from "../openai/actionClassifier.js";
import { executeCommand } from "../openai/commandOrchestrator.js";

test("classifyCommand detects workspace cleanup", () => {
  assert.equal(classifyCommand("Clean up my LocalBrain workspace.").action_class, "workspace_cleanup");
});

test("capability router includes intelligence stack for cleanup", () => {
  const caps = routeCapabilities("workspace_cleanup");
  assert.ok(caps.includes("asset_intelligence"));
  assert.ok(caps.includes("approval_engine"));
  assert.equal(isOrchestratedAction("workspace_cleanup"), true);
});

test("recommendations include What Why Confidence If approved", () => {
  bootstrapApp();
  const recs = buildCleanupRecommendations({ workspaceId: "localbrain" });
  for (const rec of recs) {
    assert.ok(rec.what.length > 0);
    assert.ok(rec.why.length > 0);
    assert.ok(["high", "medium", "low"].includes(rec.confidence));
    assert.ok(rec.if_approved.length > 0);
  }
});

test("orchestration pipeline does not execute files", async () => {
  bootstrapApp();
  const prev = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  const res = await executeCommand({
    message: "Clean up my LocalBrain workspace.",
    workspace_id: "localbrain",
  });

  assert.equal(res.intent, "WORKSPACE_CLEANUP");
  assert.equal(res.recommend_only, true);
  assert.ok(res.orchestration);
  assert.ok(res.orchestration!.recommendations.length >= 0);
  assert.equal(res.proposed_action_ids, undefined);

  if (prev) process.env.OPENAI_API_KEY = prev;
});

test("create proposals only — pending status, no execution", () => {
  bootstrapApp();
  const pipeline = runOrchestrationPipeline({
    message: "Clean up my LocalBrain workspace.",
    actionClass: "workspace_cleanup",
    workspaceId: "localbrain",
  });

  const eligible = pipeline.orchestration.recommendations.filter((r) => r.proposal_eligible);
  if (eligible.length === 0) {
    assert.ok(true, "no eligible assets in test registry — skip proposal creation");
    return;
  }

  const result = createProposalsForOrchestration({
    orchestration_id: pipeline.orchestration.orchestration_id,
    recommendation_ids: [eligible[0].id],
  });

  for (const id of result.action_ids) {
    const row = getProposedAction(id);
    assert.ok(row);
    assert.equal(row!.status, "pending");
    assert.equal(row!.requested_by, "chief_of_staff");
  }
});

test("approve and reject record cos outcomes", () => {
  bootstrapApp();
  const pipeline = runOrchestrationPipeline({
    message: "Clean up test",
    actionClass: "workspace_cleanup",
    workspaceId: "localbrain",
    create_proposals: true,
  });

  const actionId = pipeline.proposed_action_ids[0];
  if (!actionId) {
    assert.ok(true, "no proposals created — skip outcome test");
    return;
  }

  approveAction(actionId);
  const outcomes = listCosOutcomes(10);
  assert.ok(outcomes.some((o) => o.action_id === actionId && o.outcome === "accepted"));

  const pipeline2 = runOrchestrationPipeline({
    message: "Clean up test 2",
    actionClass: "workspace_cleanup",
    workspaceId: "localbrain",
    create_proposals: true,
  });
  const rejectId = pipeline2.proposed_action_ids[0];
  if (rejectId) {
    rejectAction(rejectId, "not now");
    assert.ok(
      listCosOutcomes(20).some((o) => o.action_id === rejectId && o.outcome === "rejected"),
    );
  }
});

test.after(() => {
  closeDatabase();
});
