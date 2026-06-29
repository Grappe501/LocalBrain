import fs from "node:fs";
import path from "node:path";
import type { ProposedActionType } from "@localbrain/shared";
import { getPermissionEngine } from "../safety/permissionEngine.js";
import type { PathCheckResult } from "../safety/types.js";
import { readFile } from "../files/readFile.js";
import { computeDiffPreview } from "./diffUtil.js";
import {
  getProposedAction,
  insertProposedAction,
  newActionId,
  updateProposedStatus,
  rowToProposedAction,
  type ProposedActionRow,
} from "./proposalStore.js";

export function checkWritePath(pathStr: string): PathCheckResult {
  return getPermissionEngine().checkPath({ path: pathStr, action: "write" });
}

export function checkDeletePath(pathStr: string): PathCheckResult {
  return getPermissionEngine().checkPath({ path: pathStr, action: "delete" });
}

function markBlocked(actionId: string, detail: string): ProposedActionRow {
  updateProposedStatus(actionId, "blocked", { execution_detail: detail });
  return getProposedAction(actionId)!;
}

function blockedProposal(
  actionType: ProposedActionType,
  title: string,
  reason: string,
  sourcePath: string | null,
): ProposedActionRow {
  const actionId = newActionId();
  insertProposedAction({
    action_id: actionId,
    action_type: actionType,
    title,
    description: `Blocked: ${reason}`,
    source_path: sourcePath,
    target_path: null,
    proposed_content: null,
  });
  return markBlocked(actionId, reason);
}

export function proposeCreateDraft(input: {
  target_path: string;
  content: string;
  title?: string;
  description?: string;
}): ProposedActionRow {
  const check = checkWritePath(input.target_path);
  if (!check.allowed) {
    return blockedProposal("create_draft", input.title ?? "Create file draft", check.reason, null);
  }

  const resolved = check.normalizedPath!;
  if (fs.existsSync(resolved)) {
    const row = insertProposedAction({
      action_id: newActionId(),
      action_type: "create_draft",
      title: input.title ?? `Create ${path.basename(resolved)}`,
      description: input.description ?? "Proposed new file draft",
      source_path: null,
      target_path: resolved,
      proposed_content: input.content,
    });
    return markBlocked(row.action_id, "Target already exists — use edit proposal instead");
  }

  return insertProposedAction({
    action_id: newActionId(),
    action_type: "create_draft",
    title: input.title ?? `Create ${path.basename(resolved)}`,
    description: input.description ?? "Proposed new file draft",
    source_path: null,
    target_path: resolved,
    proposed_content: input.content,
    diff_preview: computeDiffPreview("", input.content),
  });
}

export function proposeEditFile(input: {
  source_path: string;
  proposed_content: string;
  title?: string;
  description?: string;
}): ProposedActionRow {
  const check = checkWritePath(input.source_path);
  if (!check.allowed) {
    return blockedProposal("edit_file", input.title ?? "Edit file", check.reason, input.source_path);
  }

  const read = readFile(input.source_path);
  if (!read.allowed || read.content === null) {
    return blockedProposal("edit_file", input.title ?? "Edit file", read.reason, input.source_path);
  }

  return insertProposedAction({
    action_id: newActionId(),
    action_type: "edit_file",
    title: input.title ?? `Edit ${path.basename(read.normalized_path)}`,
    description: input.description ?? "Proposed file edit",
    source_path: read.normalized_path,
    target_path: read.normalized_path,
    proposed_content: input.proposed_content,
    original_content: read.content,
    diff_preview: computeDiffPreview(read.content, input.proposed_content),
  });
}

export function proposeMove(input: {
  source_path: string;
  target_path: string;
  title?: string;
  description?: string;
}): ProposedActionRow {
  const srcCheck = checkDeletePath(input.source_path);
  const dstCheck = checkWritePath(input.target_path);
  if (!srcCheck.allowed) {
    return blockedProposal("move", input.title ?? "Move file", srcCheck.reason, input.source_path);
  }
  if (!dstCheck.allowed) {
    return blockedProposal("move", input.title ?? "Move file", dstCheck.reason, input.source_path);
  }

  if (fs.existsSync(dstCheck.normalizedPath!)) {
    const row = insertProposedAction({
      action_id: newActionId(),
      action_type: "move",
      title: input.title ?? "Move file",
      description: input.description ?? "Proposed move/rename",
      source_path: srcCheck.normalizedPath!,
      target_path: dstCheck.normalizedPath!,
      proposed_content: null,
    });
    return markBlocked(row.action_id, "Target path already exists");
  }

  return insertProposedAction({
    action_id: newActionId(),
    action_type: "move",
    title: input.title ?? `Move to ${path.basename(dstCheck.normalizedPath!)}`,
    description: input.description ?? "Proposed move/rename",
    source_path: srcCheck.normalizedPath!,
    target_path: dstCheck.normalizedPath!,
    proposed_content: null,
    diff_preview: `--- move from\n${srcCheck.normalizedPath}\n+++ move to\n${dstCheck.normalizedPath}`,
  });
}

export function proposeQuarantineDelete(input: {
  source_path: string;
  title?: string;
  description?: string;
}): ProposedActionRow {
  const check = checkDeletePath(input.source_path);
  if (!check.allowed) {
    return blockedProposal(
      "quarantine_delete",
      input.title ?? "Delete to quarantine",
      check.reason,
      input.source_path,
    );
  }

  return insertProposedAction({
    action_id: newActionId(),
    action_type: "quarantine_delete",
    title: input.title ?? `Quarantine ${path.basename(check.normalizedPath!)}`,
    description: input.description ?? "Move to quarantine — no permanent delete",
    source_path: check.normalizedPath!,
    target_path: null,
    proposed_content: null,
    diff_preview: `Quarantine-only delete:\n${check.normalizedPath}\n→ local_data/quarantine/`,
  });
}

export { rowToProposedAction };
