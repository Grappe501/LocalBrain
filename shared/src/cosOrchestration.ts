/** Chief of Staff orchestration contracts — LB-OS-010.5 */

export type SystemConfidence = "high" | "medium" | "low";

export type CosCapability =
  | "living_workspace"
  | "digital_asset_registry"
  | "asset_intelligence"
  | "knowledge_explorer"
  | "decision_ledger"
  | "approval_engine";

export type CosRecommendationCategory =
  | "duplicate"
  | "dormant"
  | "archive"
  | "large"
  | "workspace_storage";

/** Every CoS recommendation answers What / Why / Confidence / If approved */
export interface CosRecommendation {
  id: string;
  category: CosRecommendationCategory;
  what: string;
  why: string[];
  confidence: SystemConfidence;
  if_approved: string;
  asset_count: number;
  paths_sample: string[];
  /** When true, user may generate quarantine proposals for this recommendation */
  proposal_eligible: boolean;
  workspace_id?: string;
}

export type CosOutcomeType = "accepted" | "rejected" | "modified";

export interface CosOutcome {
  id: number;
  orchestration_id: string | null;
  recommendation_id: string;
  action_id: string | null;
  outcome: CosOutcomeType;
  detail: string;
  created_at: string;
}

export interface CosOrchestration {
  orchestration_id: string;
  intent: string;
  capabilities_used: CosCapability[];
  recommendations: CosRecommendation[];
  workspace_id: string;
  user_message: string;
  created_at: string;
}
