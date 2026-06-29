import type { FilesystemMappingAudit } from "@localbrain/shared";
import type { DigitalAssetRow } from "../digitalAssets/assetRegistry.js";

export interface ConsolidationContext {
  assets: DigitalAssetRow[];
  audit: FilesystemMappingAudit | null;
  dismissed_ids: Set<string>;
  observed_at: string;
}

export interface EvidenceSignal {
  signal: string;
  weight: "low" | "medium" | "high";
  detail?: string;
}

export interface ConsolidationFinding {
  finding_id: string;
  category: "duplicate_file" | "version_chain" | "folder_consolidation" | "archive_opportunity" | "workspace_orphan";
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  evidence_percent: number;
  evidence_signals: EvidenceSignal[];
  executive_impact: string;
  decision_friction: string;
  estimated_review_minutes: number;
  estimated_benefit: string;
  reclaimable_bytes: number;
  decision_points_eliminated: number;
  risk: "low" | "medium" | "high";
  related_paths: string[];
  source: string;
}

export interface EvidenceProvider {
  id: string;
  category: ConsolidationFinding["category"];
  collect(ctx: ConsolidationContext): ConsolidationFinding[];
}
