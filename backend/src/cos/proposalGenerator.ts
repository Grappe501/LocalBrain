import crypto from "node:crypto";
import type { CosOrchestration, CosRecommendation } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import type { DigitalAssetRow } from "../digitalAssets/assetRegistry.js";
import { proposeQuarantineDelete } from "../actions/proposalService.js";
import { getProposedAction } from "../actions/proposalStore.js";

const MAX_PROPOSALS_PER_REC = 10;

function assetsForRecommendation(
  rec: CosRecommendation,
  workspaceId: string,
): DigitalAssetRow[] {
  const db = getDatabase();

  if (rec.category === "archive") {
    return db
      .prepare(
        `SELECT * FROM digital_assets
         WHERE workspace_id = ? AND is_directory = 0 AND lifecycle_stage = 'archive_candidate'
         ORDER BY size_bytes DESC LIMIT ?`,
      )
      .all(workspaceId, MAX_PROPOSALS_PER_REC) as DigitalAssetRow[];
  }

  if (rec.category === "dormant") {
    return db
      .prepare(
        `SELECT * FROM digital_assets
         WHERE workspace_id = ? AND is_directory = 0 AND lifecycle_stage = 'dormant'
         ORDER BY modified_at ASC LIMIT ?`,
      )
      .all(workspaceId, MAX_PROPOSALS_PER_REC) as DigitalAssetRow[];
  }

  if (rec.paths_sample.length === 1) {
    const row = db
      .prepare("SELECT * FROM digital_assets WHERE path = ?")
      .get(rec.paths_sample[0]) as DigitalAssetRow | undefined;
    return row ? [row] : [];
  }

  return [];
}

function insertCosProposedAction(input: {
  orchestration_id: string;
  cos_recommendation_id: string;
  source_path: string;
  title: string;
  description: string;
}): string | null {
  const check = proposeQuarantineDelete({
    source_path: input.source_path,
    title: input.title,
    description: input.description,
  });

  if (check.status === "blocked") return null;

  getDatabase()
    .prepare(
      `UPDATE proposed_actions SET
        requested_by = 'chief_of_staff',
        orchestration_id = @orchestration_id,
        cos_recommendation_id = @cos_recommendation_id
       WHERE action_id = @action_id`,
    )
    .run({
      action_id: check.action_id,
      orchestration_id: input.orchestration_id,
      cos_recommendation_id: input.cos_recommendation_id,
    });

  return check.action_id;
}

export function createProposalsFromRecommendations(input: {
  orchestration_id: string;
  workspace_id: string;
  recommendations: CosRecommendation[];
  recommendation_ids?: string[];
}): { action_ids: string[]; skipped: number } {
  const ids = new Set(input.recommendation_ids);
  const targets = input.recommendation_ids?.length
    ? input.recommendations.filter((r) => ids.has(r.id))
    : input.recommendations.filter((r) => r.proposal_eligible);

  const actionIds: string[] = [];
  let skipped = 0;

  for (const rec of targets) {
    if (!rec.proposal_eligible) {
      skipped++;
      continue;
    }

    const assets = assetsForRecommendation(rec, input.workspace_id);
    if (assets.length === 0 && rec.paths_sample.length === 1) {
      const id = insertCosProposedAction({
        orchestration_id: input.orchestration_id,
        cos_recommendation_id: rec.id,
        source_path: rec.paths_sample[0],
        title: `CoS: quarantine ${rec.category}`,
        description: `Chief of Staff proposal from ${rec.id}. ${rec.what}. Not executed — pending approval.`,
      });
      if (id) actionIds.push(id);
      else skipped++;
      continue;
    }

    for (const asset of assets) {
      const id = insertCosProposedAction({
        orchestration_id: input.orchestration_id,
        cos_recommendation_id: rec.id,
        source_path: asset.path,
        title: `CoS: quarantine ${asset.name}`,
        description: `Chief of Staff proposal from ${rec.id}. ${rec.what}. Pending user approval in Actions.`,
      });
      if (id) actionIds.push(id);
      else skipped++;
    }
  }

  return { action_ids: actionIds, skipped };
}

export function saveOrchestrationLog(entry: CosOrchestration & { user_message: string }): void {
  getDatabase()
    .prepare(
      `INSERT INTO cos_orchestration_log (
        orchestration_id, intent, workspace_id, user_message,
        capabilities_json, recommendations_json
      ) VALUES (
        @orchestration_id, @intent, @workspace_id, @user_message,
        @capabilities_json, @recommendations_json
      )`,
    )
    .run({
      orchestration_id: entry.orchestration_id,
      intent: entry.intent,
      workspace_id: entry.workspace_id,
      user_message: entry.user_message,
      capabilities_json: JSON.stringify(entry.capabilities_used),
      recommendations_json: JSON.stringify(entry.recommendations),
    });
}

export function loadOrchestration(orchestrationId: string): CosOrchestration | null {
  const row = getDatabase()
    .prepare("SELECT * FROM cos_orchestration_log WHERE orchestration_id = ?")
    .get(orchestrationId) as
    | {
        orchestration_id: string;
        intent: string;
        workspace_id: string;
        user_message: string;
        capabilities_json: string;
        recommendations_json: string;
        created_at: string;
      }
    | undefined;

  if (!row) return null;

  return {
    orchestration_id: row.orchestration_id,
    intent: row.intent,
    workspace_id: row.workspace_id,
    user_message: row.user_message,
    capabilities_used: JSON.parse(row.capabilities_json),
    recommendations: JSON.parse(row.recommendations_json),
    created_at: row.created_at,
  };
}

export function newOrchestrationId(): string {
  return crypto.randomUUID();
}
