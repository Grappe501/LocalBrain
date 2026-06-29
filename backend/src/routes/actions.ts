import { Router } from "express";
import {
  approveAction,
  dryRunBatch,
  executeApprovedAction,
  rejectAction,
  restoreFromBackup,
  restoreFromQuarantine,
} from "../actions/executorService.js";
import {
  listActionLog,
  listBackupRecords,
  listProposedActions,
  getProposedAction,
  rowToProposedAction,
} from "../actions/proposalStore.js";
import {
  proposeCreateDraft,
  proposeEditFile,
  proposeMove,
  proposeQuarantineDelete,
} from "../actions/proposalService.js";

export const actionsRouter = Router();

actionsRouter.get("/actions/proposed", (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const rows = listProposedActions(status);
  res.json({ actions: rows.map(rowToProposedAction) });
});

actionsRouter.get("/actions/proposed/:id", (req, res) => {
  const row = getProposedAction(req.params.id);
  if (!row) {
    res.status(404).json({ error: "Action not found" });
    return;
  }
  res.json({ action: rowToProposedAction(row) });
});

actionsRouter.post("/actions/propose", (req, res) => {
  const actionType = req.body?.action_type;
  try {
    let row;
    switch (actionType) {
      case "create_draft":
        row = proposeCreateDraft({
          target_path: req.body.target_path,
          content: req.body.content ?? "",
          title: req.body.title,
          description: req.body.description,
        });
        break;
      case "edit_file":
        row = proposeEditFile({
          source_path: req.body.source_path,
          proposed_content: req.body.proposed_content ?? "",
          title: req.body.title,
          description: req.body.description,
        });
        break;
      case "move":
        row = proposeMove({
          source_path: req.body.source_path,
          target_path: req.body.target_path,
          title: req.body.title,
          description: req.body.description,
        });
        break;
      case "quarantine_delete":
        row = proposeQuarantineDelete({
          source_path: req.body.source_path,
          title: req.body.title,
          description: req.body.description,
        });
        break;
      default:
        res.status(400).json({ error: "Invalid action_type" });
        return;
    }
    res.status(201).json({ action: rowToProposedAction(row) });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Proposal failed" });
  }
});

actionsRouter.post("/actions/:id/approve", (req, res) => {
  const row = approveAction(req.params.id);
  if (!row) {
    res.status(400).json({ error: "Cannot approve — not pending or not found" });
    return;
  }
  res.json({ action: rowToProposedAction(row) });
});

actionsRouter.post("/actions/:id/reject", (req, res) => {
  const reason = typeof req.body?.reason === "string" ? req.body.reason : undefined;
  const row = rejectAction(req.params.id, reason);
  if (!row) {
    res.status(400).json({ error: "Cannot reject — not pending or not found" });
    return;
  }
  res.json({ action: rowToProposedAction(row) });
});

actionsRouter.post("/actions/:id/execute", (req, res) => {
  const dryRun = req.body?.dry_run === true || req.query.dry_run === "true";
  const result = executeApprovedAction(req.params.id, { dry_run: dryRun });
  res.status(result.success ? 200 : 400).json(result);
});

actionsRouter.post("/actions/dry-run-batch", (req, res) => {
  const ids = Array.isArray(req.body?.action_ids) ? (req.body.action_ids as string[]) : [];
  if (ids.length === 0) {
    res.status(400).json({ error: "action_ids array required" });
    return;
  }
  res.json({ results: dryRunBatch(ids) });
});

actionsRouter.get("/actions/log", (_req, res) => {
  res.json({ log: listActionLog(100) });
});

actionsRouter.get("/actions/backups", (_req, res) => {
  res.json({ backups: listBackupRecords(100) });
});

actionsRouter.post("/actions/restore/backup", (req, res) => {
  const backupId = typeof req.body?.backup_id === "string" ? req.body.backup_id : "";
  if (!backupId) {
    res.status(400).json({ error: "backup_id required" });
    return;
  }
  const result = restoreFromBackup(backupId);
  res.status(result.success ? 200 : 400).json(result);
});

actionsRouter.post("/actions/restore/quarantine", (req, res) => {
  const quarantine_path = typeof req.body?.quarantine_path === "string" ? req.body.quarantine_path : "";
  const restore_path = typeof req.body?.restore_path === "string" ? req.body.restore_path : "";
  if (!quarantine_path || !restore_path) {
    res.status(400).json({ error: "quarantine_path and restore_path required" });
    return;
  }
  const result = restoreFromQuarantine({ quarantine_path, restore_path });
  res.status(result.success ? 200 : 400).json(result);
});
