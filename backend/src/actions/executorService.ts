import { recordOutcomeFromAction } from "../cos/outcomeStore.js";
import fs from "node:fs";
import path from "node:path";
import type { ExecuteResult } from "@localbrain/shared";
import { getQuarantineDir } from "./actionPaths.js";
import {
  appendActionLog,
  createBackupRecord,
  getBackupRecord,
  getProposedAction,
  updateProposedStatus,
  type ProposedActionRow,
} from "./proposalStore.js";
import { checkDeletePath, checkWritePath } from "./proposalService.js";

export function approveAction(actionId: string): ProposedActionRow | null {
  const row = getProposedAction(actionId);
  if (!row || row.status !== "pending") return null;
  updateProposedStatus(actionId, "approved");
  appendActionLog(actionId, "approved", "User approved action");
  recordOutcomeFromAction(actionId, "accepted", "User approved proposal");
  return getProposedAction(actionId);
}

export function rejectAction(actionId: string, reason?: string): ProposedActionRow | null {
  const row = getProposedAction(actionId);
  if (!row || row.status !== "pending") return null;
  updateProposedStatus(actionId, "rejected", {
    execution_detail: reason ?? "User rejected",
  });
  appendActionLog(actionId, "rejected", reason ?? "User rejected");
  recordOutcomeFromAction(actionId, "rejected", reason ?? "User rejected");
  return getProposedAction(actionId);
}

function dryRunMessage(row: ProposedActionRow, backupPath: string | null): string {
  switch (row.action_type) {
    case "create_draft":
      return `Would create ${row.target_path} (${row.proposed_content?.length ?? 0} chars)`;
    case "edit_file":
      return `Would edit ${row.source_path} · backup → ${backupPath ?? "n/a"}`;
    case "move":
      return `Would move ${row.source_path} → ${row.target_path} · backup first`;
    case "quarantine_delete":
      return `Would quarantine ${row.source_path} → ${getQuarantineDir()} · backup first · no permanent delete`;
    default:
      return "Unknown action";
  }
}

export function executeApprovedAction(
  actionId: string,
  options?: { dry_run?: boolean },
): ExecuteResult {
  const dryRun = options?.dry_run ?? false;
  const row = getProposedAction(actionId);
  if (!row) {
    return {
      action_id: actionId,
      dry_run: dryRun,
      success: false,
      message: "Action not found",
      backup_id: null,
      source_path: null,
      target_path: null,
    };
  }

  if (row.status !== "approved") {
    return {
      action_id: actionId,
      dry_run: dryRun,
      success: false,
      message: `Action must be approved before execution (status: ${row.status})`,
      backup_id: null,
      source_path: row.source_path,
      target_path: row.target_path,
    };
  }

  const wouldBackup =
    row.action_type !== "create_draft" && row.source_path
      ? path.join("local_data/backups/", path.basename(row.source_path))
      : null;

  if (dryRun) {
    const msg = dryRunMessage(row, wouldBackup);
    appendActionLog(actionId, "dry_run", msg);
    return {
      action_id: actionId,
      dry_run: true,
      success: true,
      message: msg,
      backup_id: null,
      source_path: row.source_path,
      target_path: row.target_path,
    };
  }

  try {
    let backupId: string | null = null;
    let detail = "";

    switch (row.action_type) {
      case "create_draft":
        detail = executeCreateDraft(row);
        break;
      case "edit_file":
        ({ backupId, detail } = executeEdit(row));
        break;
      case "move":
        ({ backupId, detail } = executeMove(row));
        break;
      case "quarantine_delete":
        ({ backupId, detail } = executeQuarantine(row));
        break;
      default:
        throw new Error(`Unsupported action type: ${row.action_type}`);
    }

    updateProposedStatus(actionId, "executed", { execution_detail: detail, backup_id: backupId ?? undefined });
    appendActionLog(actionId, "executed", detail);

    return {
      action_id: actionId,
      dry_run: false,
      success: true,
      message: detail,
      backup_id: backupId,
      source_path: row.source_path,
      target_path: row.target_path,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Execution failed";
    updateProposedStatus(actionId, "failed", { execution_detail: msg });
    appendActionLog(actionId, "failed", msg);
    return {
      action_id: actionId,
      dry_run: false,
      success: false,
      message: msg,
      backup_id: null,
      source_path: row.source_path,
      target_path: row.target_path,
    };
  }
}

function executeCreateDraft(row: ProposedActionRow): string {
  const target = row.target_path!;
  const check = checkWritePath(target);
  if (!check.allowed) throw new Error(check.reason);
  if (fs.existsSync(check.normalizedPath!)) throw new Error("Target already exists");

  fs.mkdirSync(path.dirname(check.normalizedPath!), { recursive: true });
  fs.writeFileSync(check.normalizedPath!, row.proposed_content ?? "", "utf8");
  return `Created ${check.normalizedPath}`;
}

function executeEdit(row: ProposedActionRow): { backupId: string | null; detail: string } {
  const target = row.source_path!;
  const check = checkWritePath(target);
  if (!check.allowed) throw new Error(check.reason);
  const resolved = check.normalizedPath!;
  if (!fs.existsSync(resolved)) throw new Error("Source file missing");

  const backup = createBackupRecord({
    actionId: row.action_id,
    sourcePath: resolved,
    sourceFilePath: resolved,
  });
  fs.writeFileSync(resolved, row.proposed_content ?? "", "utf8");
  return {
    backupId: backup?.backup_id ?? null,
    detail: `Edited ${resolved} · backup ${backup?.backup_path ?? "none"}`,
  };
}

function executeMove(row: ProposedActionRow): { backupId: string | null; detail: string } {
  const src = row.source_path!;
  const dst = row.target_path!;
  const srcCheck = checkDeletePath(src);
  const dstCheck = checkWritePath(dst);
  if (!srcCheck.allowed) throw new Error(srcCheck.reason);
  if (!dstCheck.allowed) throw new Error(dstCheck.reason);
  const from = srcCheck.normalizedPath!;
  const to = dstCheck.normalizedPath!;
  if (!fs.existsSync(from)) throw new Error("Source missing");
  if (fs.existsSync(to)) throw new Error("Target exists");

  const backup = createBackupRecord({
    actionId: row.action_id,
    sourcePath: from,
    sourceFilePath: from,
  });
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
  return {
    backupId: backup?.backup_id ?? null,
    detail: `Moved ${from} → ${to}`,
  };
}

function executeQuarantine(row: ProposedActionRow): { backupId: string | null; detail: string } {
  const src = row.source_path!;
  const check = checkDeletePath(src);
  if (!check.allowed) throw new Error(check.reason);
  const resolved = check.normalizedPath!;
  if (!fs.existsSync(resolved)) throw new Error("Source missing");

  const backup = createBackupRecord({
    actionId: row.action_id,
    sourcePath: resolved,
    sourceFilePath: resolved,
  });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const qPath = path.join(getQuarantineDir(), `${stamp}_${path.basename(resolved)}`);
  fs.renameSync(resolved, qPath);

  return {
    backupId: backup?.backup_id ?? null,
    detail: `Quarantined ${resolved} → ${qPath} (no permanent delete)`,
  };
}

export function restoreFromBackup(backupId: string): { success: boolean; message: string } {
  const record = getBackupRecord(backupId);
  if (!record) return { success: false, message: "Backup not found" };
  if (!fs.existsSync(record.backup_path)) {
    return { success: false, message: "Backup file missing on disk" };
  }

  const check = checkWritePath(record.source_path);
  if (!check.allowed) return { success: false, message: check.reason };

  const resolved = check.normalizedPath!;
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.copyFileSync(record.backup_path, resolved);

  appendActionLog(record.action_id ?? backupId, "restored", `Restored ${resolved} from backup`);
  return { success: true, message: `Restored ${resolved} from backup ${backupId}` };
}

export function restoreFromQuarantine(input: {
  quarantine_path: string;
  restore_path: string;
}): { success: boolean; message: string } {
  const qCheck = checkWritePath(input.quarantine_path);
  const rCheck = checkWritePath(input.restore_path);
  if (!qCheck.allowed) return { success: false, message: qCheck.reason };
  if (!rCheck.allowed) return { success: false, message: rCheck.reason };

  const qPath = qCheck.normalizedPath!;
  const rPath = rCheck.normalizedPath!;
  if (!fs.existsSync(qPath)) return { success: false, message: "Quarantine file not found" };
  if (fs.existsSync(rPath)) return { success: false, message: "Restore target already exists" };

  fs.mkdirSync(path.dirname(rPath), { recursive: true });
  fs.renameSync(qPath, rPath);
  appendActionLog("restore", "restored", `Restored ${rPath} from quarantine ${qPath}`);
  return { success: true, message: `Restored ${rPath} from quarantine` };
}

export function dryRunBatch(actionIds: string[]): ExecuteResult[] {
  return actionIds.map((id) => executeApprovedAction(id, { dry_run: true }));
}
