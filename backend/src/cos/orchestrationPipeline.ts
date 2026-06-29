import type {
  CommandActionClass,
  CommandIntent,
  CosOrchestration,
  CosRecommendation,
} from "@localbrain/shared";
import { routeCapabilities } from "./capabilityRouter.js";
import {
  buildAssetStaleRecommendations,
  buildCleanupRecommendations,
  formatRecommendationsMessage,
} from "./recommendationBuilder.js";
import {
  createProposalsFromRecommendations,
  loadOrchestration,
  newOrchestrationId,
  saveOrchestrationLog,
} from "./proposalGenerator.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";
import { actionClassToIntent } from "../openai/actionClassifier.js";

export type OrchestrationPipelineInput = {
  message: string;
  actionClass: CommandActionClass;
  workspaceId?: string;
  assetPath?: string;
  create_proposals?: boolean;
  orchestration_id?: string;
  recommendation_ids?: string[];
};

export type OrchestrationPipelineResult = {
  intent: CommandIntent;
  action_class: CommandActionClass;
  message: string;
  context_used: string[];
  orchestration: CosOrchestration;
  proposed_action_ids: string[];
};

export function runOrchestrationPipeline(
  input: OrchestrationPipelineInput,
): OrchestrationPipelineResult {
  const workspaceId = input.workspaceId ?? "localbrain";
  const ws =
    listWorkspaces().find((w) => w.workspace_id === workspaceId) ??
    listWorkspaces()[0];
  const capabilities = routeCapabilities(input.actionClass);
  const contextUsed: string[] = [];

  for (const cap of capabilities) {
    contextUsed.push(cap);
  }

  let recommendations: CosRecommendation[];
  if (input.actionClass === "workspace_cleanup") {
    recommendations = buildCleanupRecommendations({ workspaceId, scope: "workspace" });
  } else {
    recommendations = buildAssetStaleRecommendations(input.assetPath);
  }

  const orchestrationId = input.orchestration_id ?? newOrchestrationId();
  const intent =
    input.actionClass === "workspace_cleanup"
      ? "WORKSPACE_CLEANUP"
      : actionClassToIntent(input.actionClass);

  const orchestration: CosOrchestration = {
    orchestration_id: orchestrationId,
    intent,
    capabilities_used: capabilities,
    recommendations,
    workspace_id: workspaceId,
    user_message: input.message,
    created_at: new Date().toISOString(),
  };

  if (!input.orchestration_id) {
    saveOrchestrationLog(orchestration);
  }

  let proposedActionIds: string[] = [];
  if (input.create_proposals) {
    const stored = input.orchestration_id
      ? loadOrchestration(input.orchestration_id)
      : orchestration;
    if (stored) {
      const result = createProposalsFromRecommendations({
        orchestration_id: stored.orchestration_id,
        workspace_id: workspaceId,
        recommendations: stored.recommendations,
        recommendation_ids: input.recommendation_ids,
      });
      proposedActionIds = result.action_ids;
      contextUsed.push("approval_engine");
    }
  }

  const title = ws?.title ?? workspaceId;
  let message = formatRecommendationsMessage(title, recommendations);

  if (input.create_proposals) {
    if (proposedActionIds.length > 0) {
      message += `\n\n**${proposedActionIds.length} proposal(s)** added to Actions queue — review and approve before any file operations.`;
    } else {
      message +=
        "\n\nNo proposals were created (ineligible recommendations or permission blocks).";
    }
  }

  return {
    intent,
    action_class: input.actionClass,
    message,
    context_used: contextUsed,
    orchestration,
    proposed_action_ids: proposedActionIds,
  };
}

export function createProposalsForOrchestration(input: {
  orchestration_id: string;
  recommendation_ids?: string[];
}): { action_ids: string[]; skipped: number } {
  const stored = loadOrchestration(input.orchestration_id);
  if (!stored) {
    return { action_ids: [], skipped: 0 };
  }

  return createProposalsFromRecommendations({
    orchestration_id: stored.orchestration_id,
    workspace_id: stored.workspace_id,
    recommendations: stored.recommendations,
    recommendation_ids: input.recommendation_ids,
  });
}
