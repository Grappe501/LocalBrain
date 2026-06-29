import { randomUUID } from "node:crypto";
import path from "node:path";
import type {
  FilesystemMappingAudit,
  LivingWorkspace,
  Projection,
  WorkspaceBlueprint,
  WorkspaceDNA,
} from "@localbrain/shared";
import {
  missionCategoryForWorkspace,
  primaryDepartmentForWorkspace,
} from "./organizationTree.js";

function normalizeWin(p: string): string {
  return path.normalize(p).replace(/\//g, "\\").toLowerCase();
}

export function recommendedFilesystemRoot(ws: LivingWorkspace): string {
  const category = missionCategoryForWorkspace(ws);
  const folderName =
    ws.workspace_id === "localbrain"
      ? "LocalBrain"
      : ws.title.replace(/[^\w\s-]/g, "").trim() || ws.workspace_id;
  return path.win32.join("H:\\Projects", category, folderName);
}

export function buildProjection(
  ws: LivingWorkspace,
  physicalRef: string,
  status: Projection["status"],
  storageProviderId: string | null = "primary",
): Projection {
  return {
    projection_id: randomUUID(),
    logical_type: "living_workspace",
    logical_id: ws.workspace_id,
    projection_kind: "filesystem_root",
    physical_ref: physicalRef,
    storage_provider_id: storageProviderId,
    status,
    observed_at: new Date().toISOString(),
  };
}

export function buildWorkspaceDNA(ws: LivingWorkspace): WorkspaceDNA {
  const projections = ws.filesystem_roots.map((root) =>
    buildProjection(ws, root, root ? "active" : "missing"),
  );

  return {
    workspace_id: ws.workspace_id,
    title: ws.title,
    mission: ws.profile.mission ?? (ws.executive_context || null),
    owner: ws.owner,
    created_at: ws.created_at,
    purpose: ws.description || ws.executive_context,
    success_definition: ws.success_definition,
    primary_department: primaryDepartmentForWorkspace(ws),
    mission_category: missionCategoryForWorkspace(ws),
    lifecycle: ws.status,
    health: ws.health_score,
    knowledge_source_ids: [],
    projections,
  };
}

function confidenceForRoots(
  current: string[],
  recommended: string,
): { percent: number; label: string; why: string[] } {
  const why: string[] = [];
  if (current.length === 0) {
    why.push("No filesystem projection registered — workspace exists only in Logical World");
    why.push(`Recommended projection: ${recommended}`);
    return { percent: 40, label: "planned", why };
  }

  const normRec = normalizeWin(recommended);
  const exact = current.some((c) => normalizeWin(c) === normRec);
  if (exact) {
    why.push("Current projection matches recommended path");
    why.push("Matches drive doctrine and organization tree");
    return { percent: 98, label: "excellent", why };
  }

  const onH = current.every((c) => /^h:/i.test(c));
  if (onH) {
    why.push("Projection on H: work drive but path differs from recommended layout");
    why.push(`Recommended: ${recommended}`);
    return { percent: 72, label: "good", why };
  }

  why.push("Projection outside recommended H:\\Projects hierarchy");
  why.push(`Recommended: ${recommended}`);
  return { percent: 55, label: "fair", why };
}

function impactForWorkspace(
  ws: LivingWorkspace,
  audit: FilesystemMappingAudit | null,
): WorkspaceBlueprint["migration_impact"] {
  if (!audit) {
    return { folder_count: 0, file_count: 0, broken_workspace_refs: 0 };
  }

  const coverage = audit.workspace_coverage.find((c) => c.workspace_id === ws.workspace_id);
  const roots = ws.filesystem_roots;
  let folder_count = 0;
  let file_count = coverage?.indexed_asset_count ?? 0;

  for (const root of roots) {
    const prefix = normalizeWin(root);
    for (const stat of audit.folder_stats ?? []) {
      if (normalizeWin(stat.folder_path).startsWith(prefix)) {
        folder_count += 1;
        if (!coverage) file_count += stat.file_count;
      }
    }
  }

  if (folder_count === 0 && roots.length > 0) folder_count = roots.length;

  const broken = roots.length === 0 && ws.status === "active" ? 1 : 0;

  return {
    folder_count,
    file_count,
    broken_workspace_refs: broken,
  };
}

export function buildWorkspaceBlueprint(
  ws: LivingWorkspace,
  audit: FilesystemMappingAudit | null,
): WorkspaceBlueprint {
  const recommendedPath = recommendedFilesystemRoot(ws);
  const current = ws.filesystem_roots;
  const { percent, label, why } = confidenceForRoots(current, recommendedPath);

  const current_projections =
    current.length > 0
      ? current.map((r) => buildProjection(ws, r, "active"))
      : [];

  const recommended_projections = [
    buildProjection(ws, recommendedPath, "planned", "primary"),
  ];

  return {
    workspace_id: ws.workspace_id,
    title: ws.title,
    logical_id: ws.workspace_id,
    current_projections,
    recommended_projections,
    confidence_percent: percent,
    confidence_label: label,
    why,
    migration_impact: impactForWorkspace(ws, audit),
    simulation_available: current.length > 0 || audit !== null,
  };
}
