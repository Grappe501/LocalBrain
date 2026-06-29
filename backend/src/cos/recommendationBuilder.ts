import type { CosRecommendation, SystemConfidence } from "@localbrain/shared";
import { getDatabase } from "../db/database.js";
import {
  detectDuplicateCandidates,
  getIntelligenceSummary,
  getWorkspaceStorageSummaries,
} from "../digitalAssets/intelligenceEngine.js";
import type { DigitalAssetRow } from "../digitalAssets/assetRegistry.js";
import { listWorkspaces } from "../workspaces/workspaceRegistry.js";

const MAX_SAMPLE_PATHS = 5;

const ROUTE_BY_CATEGORY: Record<
  CosRecommendation["category"],
  { primary_route: string; question_id: string }
> = {
  duplicate: { primary_route: "/migration/consolidation", question_id: "EQ-005" },
  dormant: { primary_route: "/explorer", question_id: "EQ-004" },
  archive: { primary_route: "/explorer", question_id: "EQ-004" },
  large: { primary_route: "/explorer", question_id: "EQ-004" },
  workspace_storage: { primary_route: "/workspace/localbrain", question_id: "EQ-007" },
};

function withExecutiveRoute(rec: CosRecommendation): CosRecommendation {
  const route = ROUTE_BY_CATEGORY[rec.category];
  return { ...rec, primary_route: route.primary_route, question_id: route.question_id };
}

function samplePaths(paths: string[]): string[] {
  return paths.slice(0, MAX_SAMPLE_PATHS);
}

function buildDuplicateRecommendation(
  workspaceId: string | undefined,
  assets?: DigitalAssetRow[],
): CosRecommendation | null {
  const groups = detectDuplicateCandidates(assets);
  if (groups.length === 0) return null;

  const totalAssets = groups.reduce((s, g) => s + g.assets.length, 0);
  const paths = groups.flatMap((g) => g.assets.map((a) => a.path));

  return {
    id: "rec-cos-duplicates",
    category: "duplicate",
    what: `${totalAssets} assets in ${groups.length} duplicate candidate groups`,
    why: [
      "Same filename and size in Digital Asset Registry",
      "Hash-equivalent fingerprint not required for high-confidence name+size match",
      "Candidate only — no automatic dedupe",
    ],
    confidence: "high",
    if_approved:
      "Review duplicate groups in Knowledge Explorer; CoS will not auto-quarantine duplicates — manual selection required",
    asset_count: totalAssets,
    paths_sample: samplePaths(paths),
    proposal_eligible: false,
    workspace_id: workspaceId,
  };
}

function buildDormantRecommendation(
  count: number,
  bytes: number,
  paths: string[],
  workspaceId?: string,
  title?: string,
): CosRecommendation | null {
  if (count === 0) return null;

  const scope = title ? `${title} workspace` : "registry";
  let confidence: SystemConfidence = "medium";
  const why = [
    "Lifecycle stage dormant from registry mtime heuristics",
    "Not referenced in active workspace focus",
  ];
  if (count >= 10) {
    why.push(`${count} assets exceed review threshold`);
  } else {
    confidence = "low";
    why.push("Small dormant set — verify before quarantine");
  }

  return {
    id: workspaceId ? `rec-cos-dormant-${workspaceId}` : "rec-cos-dormant",
    category: "dormant",
    what: `${count} dormant assets in ${scope} (${formatBytes(bytes)})`,
    why,
    confidence,
    if_approved: `Creates up to 10 quarantine proposals for dormant assets — you approve each in Actions before any file moves`,
    asset_count: count,
    paths_sample: samplePaths(paths),
    proposal_eligible: true,
    workspace_id: workspaceId,
  };
}

function buildArchiveRecommendation(
  count: number,
  bytes: number,
  paths: string[],
  workspaceId?: string,
): CosRecommendation | null {
  if (count === 0) return null;

  return {
    id: workspaceId ? `rec-cos-archive-${workspaceId}` : "rec-cos-archive",
    category: "archive",
    what: `${count} archive candidates (${formatBytes(bytes)})`,
    why: [
      "Lifecycle stage archive_candidate from registry",
      "Directories stale 90+ days or assets matching archive heuristics",
      "No references in current workspace activity",
    ],
    confidence: "medium",
    if_approved: `Creates quarantine proposals for archive candidates (max 10) — review diff and approve in Actions queue`,
    asset_count: count,
    paths_sample: samplePaths(paths),
    proposal_eligible: true,
    workspace_id: workspaceId,
  };
}

function workspaceAssets(workspaceId: string): DigitalAssetRow[] {
  return getDatabase()
    .prepare("SELECT * FROM digital_assets WHERE workspace_id = ? AND is_directory = 0")
    .all(workspaceId) as DigitalAssetRow[];
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function buildCleanupRecommendations(options: {
  workspaceId: string;
  scope?: "workspace" | "global";
}): CosRecommendation[] {
  const { workspaceId, scope = "workspace" } = options;
  const recs: CosRecommendation[] = [];

  if (scope === "workspace") {
    const ws = listWorkspaces().find((w) => w.workspace_id === workspaceId);
    const assets = workspaceAssets(workspaceId);
    const dormant = assets.filter((a) => a.lifecycle_stage === "dormant");
    const archive = assets.filter((a) => a.lifecycle_stage === "archive_candidate");

    const dup = buildDuplicateRecommendation(workspaceId, assets);
    if (dup) recs.push(dup);

    const dormantRec = buildDormantRecommendation(
      dormant.length,
      dormant.reduce((s, a) => s + (a.size_bytes ?? 0), 0),
      dormant.map((a) => a.path),
      workspaceId,
      ws?.title,
    );
    if (dormantRec) recs.push(dormantRec);

    const archiveRec = buildArchiveRecommendation(
      archive.length,
      archive.reduce((s, a) => s + (a.size_bytes ?? 0), 0),
      archive.map((a) => a.path),
      workspaceId,
    );
    if (archiveRec) recs.push(archiveRec);

    const summary = getWorkspaceStorageSummaries().find((s) => s.workspace_id === workspaceId);
    if (summary && summary.dormant_count > 0) {
      recs.push({
        id: `rec-cos-ws-storage-${workspaceId}`,
        category: "workspace_storage",
        what: `${summary.title}: ${summary.file_count} files · ${formatBytes(summary.bytes_total)} total`,
        why: [
          `${summary.dormant_count} dormant files (${formatBytes(summary.dormant_bytes)}) in workspace storage summary`,
          "LivingWorkspace context: review before archive operations",
        ],
        confidence: summary.dormant_bytes > 500 * 1024 * 1024 ? "medium" : "low",
        if_approved: "Use dormant/archive recommendations above to generate quarantine proposals",
        asset_count: summary.file_count,
        paths_sample: [],
        proposal_eligible: false,
        workspace_id: workspaceId,
      });
    }
  } else {
    const intel = getIntelligenceSummary();
    const dup = buildDuplicateRecommendation(undefined);
    if (dup) recs.push(dup);

    const dormantRec = buildDormantRecommendation(
      intel.dormant.count,
      intel.dormant.bytes,
      [],
    );
    if (dormantRec) recs.push(dormantRec);

    const archiveRec = buildArchiveRecommendation(
      intel.archive_candidates.count,
      intel.archive_candidates.bytes,
      [],
    );
    if (archiveRec) recs.push(archiveRec);
  }

  return recs.map(withExecutiveRoute);
}

export function formatRecommendationsMessage(
  workspaceTitle: string,
  recommendations: CosRecommendation[],
): string {
  if (recommendations.length === 0) {
    return `Chief of Staff reviewed **${workspaceTitle}** — no duplicate, dormant, or archive candidates in the registry.`;
  }

  const lines = [
    `Chief of Staff cleanup review for **${workspaceTitle}**:`,
    "",
  ];

  for (const rec of recommendations) {
    lines.push(
      `**${rec.what}**`,
      `Confidence: ${rec.confidence.toUpperCase()}`,
      `Why: ${rec.why.join("; ")}`,
      `If approved: ${rec.if_approved}`,
      "",
    );
  }

  lines.push(
    "No files were moved or deleted. Click **Create proposals** to add items to the Actions queue for your approval.",
  );

  return lines.join("\n");
}

export function buildAssetStaleRecommendations(assetPath?: string): CosRecommendation[] {
  if (!assetPath) {
    return buildCleanupRecommendations({ workspaceId: "localbrain", scope: "global" });
  }

  const row = getDatabase()
    .prepare("SELECT * FROM digital_assets WHERE path = ?")
    .get(assetPath) as DigitalAssetRow | undefined;

  if (!row) {
    return [withExecutiveRoute({
        id: "rec-cos-asset-unknown",
        category: "dormant",
        what: `Asset not in registry: ${assetPath}`,
        why: ["Path not indexed in Digital Asset Registry", "Run indexer or browse Knowledge Explorer"],
        confidence: "low",
        if_approved: "Index asset first, then re-run asset intelligence",
        asset_count: 0,
        paths_sample: [assetPath],
        proposal_eligible: false,
      })];
  }

  const recs: CosRecommendation[] = [];
  if (row.duplicate_group_id) {
    recs.push({
      id: `rec-cos-asset-dup-${row.asset_id}`,
      category: "duplicate",
      what: `"${row.name}" is a duplicate candidate`,
      why: ["Same filename and size as other registry assets", "Duplicate group assigned during intelligence refresh"],
      confidence: "high",
      if_approved: "Review duplicate group manually — no auto-quarantine for duplicates",
      asset_count: 1,
      paths_sample: [row.path],
      proposal_eligible: false,
      workspace_id: row.workspace_id ?? undefined,
    });
  }

  if (row.lifecycle_stage === "dormant" || row.lifecycle_stage === "archive_candidate") {
    recs.push({
      id: `rec-cos-asset-stale-${row.asset_id}`,
      category: row.lifecycle_stage === "archive_candidate" ? "archive" : "dormant",
      what: `"${row.name}" flagged ${row.lifecycle_stage}`,
      why: [
        `Modified ${row.modified_at ?? "unknown"}`,
        "Registry lifecycle heuristics — not AI inference",
      ],
      confidence: row.lifecycle_stage === "archive_candidate" ? "medium" : "low",
      if_approved: "Creates one quarantine proposal in Actions queue — you must approve before any move",
      asset_count: 1,
      paths_sample: [row.path],
      proposal_eligible: true,
      workspace_id: row.workspace_id ?? undefined,
    });
  }

  const result = recs.length > 0 ? recs : buildCleanupRecommendations({ workspaceId: row.workspace_id ?? "localbrain" });
  return result.map(withExecutiveRoute);
}
