import type { CosOutcomeType } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";

export function recordCosOutcome(input: {
  orchestration_id?: string | null;
  recommendation_id: string;
  action_id?: string | null;
  outcome: CosOutcomeType;
  detail?: string;
}): void {
  getDatabase()
    .prepare(
      `INSERT INTO cos_outcomes (orchestration_id, recommendation_id, action_id, outcome, detail)
       VALUES (@orchestration_id, @recommendation_id, @action_id, @outcome, @detail)`,
    )
    .run({
      orchestration_id: input.orchestration_id ?? null,
      recommendation_id: input.recommendation_id,
      action_id: input.action_id ?? null,
      outcome: input.outcome,
      detail: input.detail ?? "",
    });
}

export function listCosOutcomes(limit = 100): {
  id: number;
  orchestration_id: string | null;
  recommendation_id: string;
  action_id: string | null;
  outcome: CosOutcomeType;
  detail: string;
  created_at: string;
}[] {
  return getDatabase()
    .prepare("SELECT * FROM cos_outcomes ORDER BY id DESC LIMIT ?")
    .all(limit) as {
    id: number;
    orchestration_id: string | null;
    recommendation_id: string;
    action_id: string | null;
    outcome: CosOutcomeType;
    detail: string;
    created_at: string;
  }[];
}

export function getOutcomeCountsForRecommendation(recommendationId: string): {
  accepted: number;
  rejected: number;
  modified: number;
} {
  const rows = getDatabase()
    .prepare(
      "SELECT outcome, COUNT(*) AS c FROM cos_outcomes WHERE recommendation_id = ? GROUP BY outcome",
    )
    .all(recommendationId) as { outcome: CosOutcomeType; c: number }[];

  const counts = { accepted: 0, rejected: 0, modified: 0 };
  for (const row of rows) {
    counts[row.outcome] = row.c;
  }
  return counts;
}

export function recordOutcomeFromAction(
  actionId: string,
  outcome: "accepted" | "rejected",
  detail?: string,
): void {
  const row = getDatabase()
    .prepare(
      "SELECT cos_recommendation_id, orchestration_id FROM proposed_actions WHERE action_id = ?",
    )
    .get(actionId) as
    | { cos_recommendation_id: string | null; orchestration_id: string | null }
    | undefined;

  if (!row?.cos_recommendation_id) return;

  recordCosOutcome({
    orchestration_id: row.orchestration_id,
    recommendation_id: row.cos_recommendation_id,
    action_id: actionId,
    outcome,
    detail,
  });
}
