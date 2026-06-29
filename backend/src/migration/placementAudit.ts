import { getAllowedFoldersFromDb } from "../db/database.js";
import { getDatabase } from "../db/database.js";
import type { DigitalAssetRow } from "../digitalAssets/assetRegistry.js";
import { getMachineMetrics } from "../system/healthMonitor.js";
import type { DrivePlacementAudit, DriveVolumeSummary, PlacementAuditRow } from "@localbrain/shared";
import {
  assessMisplacement,
  classifyDataAsset,
  getDriveLetter,
} from "./driveDoctrine.js";

type AssetLite = Pick<
  DigitalAssetRow,
  "path" | "kind" | "size_bytes" | "workspace_id" | "is_directory"
>;

function loadIndexedAssets(limit = 5000): AssetLite[] {
  return getDatabase()
    .prepare(
      `SELECT path, kind, size_bytes, workspace_id, is_directory
       FROM digital_assets
       ORDER BY modified_at DESC
       LIMIT ?`,
    )
    .all(limit) as AssetLite[];
}

export function runPlacementAudit(): DrivePlacementAudit {
  const assets = loadIndexedAssets();
  const allowed = getAllowedFoldersFromDb();

  const byDrive = new Map<string, { count: number; bytes: number }>();
  const byClass = new Map<string, number>();
  const candidates: PlacementAuditRow[] = [];

  for (const asset of assets) {
    const drive = getDriveLetter(asset.path);
    const classification = classifyDataAsset({
      path: asset.path,
      kind: asset.kind,
      is_directory: asset.is_directory === 1,
    });
    const placement = assessMisplacement({
      path: asset.path,
      classification,
      drive,
    });

    const driveKey = drive;
    const d = byDrive.get(driveKey) ?? { count: 0, bytes: 0 };
    d.count += 1;
    d.bytes += asset.size_bytes ?? 0;
    byDrive.set(driveKey, d);

    byClass.set(classification, (byClass.get(classification) ?? 0) + 1);

    if (placement.misplaced) {
      candidates.push({
        path: asset.path,
        drive,
        classification,
        expected_drive: classification === "program" ? "C" : "H",
        misplaced: true,
        risk: placement.risk,
        reason: placement.reason,
        size_bytes: asset.size_bytes,
        workspace_id: asset.workspace_id,
      });
    }
  }

  for (const folder of allowed) {
    const drive = getDriveLetter(folder.path);
    if (drive === "C") {
      candidates.push({
        path: folder.path,
        drive: "C",
        classification: "work_project",
        expected_drive: "H",
        misplaced: true,
        risk: "critical",
        reason: "Allowed folder registered on C: — project roots belong on H:",
        size_bytes: null,
        workspace_id: null,
      });
    }
  }

  candidates.sort((a, b) => {
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return riskOrder[a.risk] - riskOrder[b.risk];
  });

  return {
    total_indexed: assets.length,
    misplaced_count: candidates.length,
    by_drive: [...byDrive.entries()].map(([drive, stats]) => ({
      drive: drive as PlacementAuditRow["drive"],
      count: stats.count,
      bytes: stats.bytes,
    })),
    by_classification: [...byClass.entries()].map(([classification, count]) => ({
      classification: classification as PlacementAuditRow["classification"],
      count,
    })),
    candidates: candidates.slice(0, 100),
  };
}

export function buildVolumeSummaries(audit: DrivePlacementAudit): DriveVolumeSummary[] {
  const disks = getMachineMetrics().disks;
  const allowed = getAllowedFoldersFromDb();

  return disks.map((disk) => {
    const drive =
      disk.label === "C:" ? "C" : disk.label === "H:" ? "H" : ("OTHER" as const);
    const driveStats = audit.by_drive.find((d) => d.drive === drive);
    const folderCount = allowed.filter((f) => getDriveLetter(f.path) === drive).length;

    return {
      drive,
      label: disk.label,
      used_percent: disk.used_percent,
      free_bytes: disk.free_bytes,
      total_bytes: disk.total_bytes,
      indexed_asset_count: driveStats?.count ?? 0,
      indexed_bytes: driveStats?.bytes ?? 0,
      allowed_folder_count: folderCount,
    };
  });
}
