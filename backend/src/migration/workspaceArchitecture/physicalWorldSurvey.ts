import { randomUUID } from "node:crypto";
import type {
  DiskVolumeHealth,
  FilesystemMappingAudit,
  LivingWorkspace,
  PhysicalWorldBindingIssue,
  PhysicalWorldSurvey,
  StorageProviderStub,
} from "@localbrain/shared";
import { getDriveLetter } from "../driveDoctrine.js";

function volumeToProvider(vol: DiskVolumeHealth): StorageProviderStub {
  const isH = vol.label.toUpperCase().startsWith("H");
  return {
    provider_id: isH ? "primary" : vol.label === "C:" ? "c_system" : vol.label.toLowerCase().replace(":", ""),
    label: vol.label.replace(":", ""),
    provider_type: "local_volume",
    health: vol.available ? "healthy" : "offline",
    capacity_bytes: vol.total_bytes,
    free_bytes: vol.free_bytes,
    role: isH ? "primary" : "system",
    runtime_enabled: false,
  };
}

export function buildPhysicalWorldSurvey(
  volumes: DiskVolumeHealth[],
  workspaces: LivingWorkspace[],
  audit: FilesystemMappingAudit | null,
): PhysicalWorldSurvey {
  const observed_at = new Date().toISOString();
  const storage_providers = volumes.map(volumeToProvider);

  const binding_issues: PhysicalWorldBindingIssue[] = [];

  for (const ws of workspaces) {
    if (!ws.flags.hidden && ws.filesystem_roots.length === 0 && ws.status !== "archived") {
      binding_issues.push({
        issue_id: randomUUID(),
        kind: "orphan_workspace",
        path: null,
        workspace_id: ws.workspace_id,
        summary: `Living Workspace "${ws.title}" has no filesystem projection`,
      });
    }
  }

  if (audit) {
    for (const u of audit.unclaimed_folders ?? []) {
      binding_issues.push({
        issue_id: randomUUID(),
        kind: "orphan_folder",
        path: u.path,
        workspace_id: null,
        summary: u.reason || "Folder not claimed by any Living Workspace",
      });
    }

    for (const d of audit.duplicate_workspace_candidates ?? []) {
      binding_issues.push({
        issue_id: randomUUID(),
        kind: "boundary_conflict",
        path: d.overlapping_paths[0] ?? null,
        workspace_id: d.workspace_ids[0] ?? null,
        summary: d.reason || `Overlapping paths: ${d.overlapping_paths.join(", ")}`,
      });
    }

    for (const entry of audit.top_level_inventory ?? []) {
      if (entry.asset_count === 0 && entry.directory_count === 0) {
        binding_issues.push({
          issue_id: randomUUID(),
          kind: "empty_namespace",
          path: entry.path,
          workspace_id: entry.claiming_workspace_id,
          summary: "Empty namespace on H: — future expansion capacity",
        });
      }
    }
  }

  for (const ws of workspaces) {
    for (const root of ws.filesystem_roots) {
      const drive = getDriveLetter(root);
      if (drive === "C" && ws.workspace_type !== "meta") {
        binding_issues.push({
          issue_id: randomUUID(),
          kind: "naming_inconsistency",
          path: root,
          workspace_id: ws.workspace_id,
          summary: "Work workspace projected onto C: — doctrine prefers H: primary storage",
        });
      }
    }
  }

  return {
    volumes: volumes.map((v) => ({
      provider_id: volumeToProvider(v).provider_id,
      label: v.label,
      mount: v.mount,
      health: v.available ? "healthy" : "offline",
      total_bytes: v.total_bytes,
      free_bytes: v.free_bytes,
      role: v.label.toUpperCase().startsWith("H") ? "primary" : "system",
      provider_type: "local_volume",
      available: v.available,
    })),
    storage_providers,
    binding_issues,
    observed_at,
  };
}
