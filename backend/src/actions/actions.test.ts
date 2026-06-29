import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { getRepoRoot } from "../db/repoRoot.js";
import {
  approveAction,
  executeApprovedAction,
  restoreFromBackup,
} from "../actions/executorService.js";
import { proposeEditFile, proposeQuarantineDelete } from "../actions/proposalService.js";
import { getProposedAction } from "../actions/proposalStore.js";
import { computeDiffPreview } from "../actions/diffUtil.js";

const TEST_FILE = path.join(getRepoRoot(), "local_data", "approval_test_lb010.txt");

test("computeDiffPreview shows line changes", () => {
  const diff = computeDiffPreview("a\nb", "a\nc");
  assert.ok(diff.includes("-b"));
  assert.ok(diff.includes("+c"));
});

test("propose edit requires permission and includes diff", () => {
  bootstrapApp();
  fs.mkdirSync(path.dirname(TEST_FILE), { recursive: true });
  fs.writeFileSync(TEST_FILE, "hello world\n", "utf8");

  const row = proposeEditFile({
    source_path: TEST_FILE,
    proposed_content: "hello LocalBrain\n",
  });
  assert.equal(row.status, "pending");
  assert.ok(row.diff_preview);
  assert.ok(row.source_path?.includes("approval_test_lb010"));
});

test("edit workflow: approve, dry-run, execute, restore", () => {
  bootstrapApp();
  fs.mkdirSync(path.dirname(TEST_FILE), { recursive: true });
  fs.writeFileSync(TEST_FILE, "version one\n", "utf8");

  const row = proposeEditFile({
    source_path: TEST_FILE,
    proposed_content: "version two\n",
  });
  assert.equal(row.status, "pending");

  const approved = approveAction(row.action_id);
  assert.ok(approved);
  assert.equal(approved?.status, "approved");

  const dry = executeApprovedAction(row.action_id, { dry_run: true });
  assert.equal(dry.success, true);
  assert.equal(dry.dry_run, true);
  assert.match(dry.message, /Would edit/);
  assert.equal(fs.readFileSync(TEST_FILE, "utf8"), "version one\n");

  const exec = executeApprovedAction(row.action_id, { dry_run: false });
  assert.equal(exec.success, true);
  assert.equal(fs.readFileSync(TEST_FILE, "utf8"), "version two\n");
  assert.ok(exec.backup_id);

  const restored = restoreFromBackup(exec.backup_id!);
  assert.equal(restored.success, true);
  assert.equal(fs.readFileSync(TEST_FILE, "utf8"), "version one\n");
});

test("quarantine proposal blocks secrets", () => {
  bootstrapApp();
  const row = proposeQuarantineDelete({ source_path: path.join(getRepoRoot(), ".env") });
  assert.equal(row.status, "blocked");
});

test("execute rejected without approval", () => {
  bootstrapApp();
  fs.writeFileSync(TEST_FILE, "x\n", "utf8");
  const row = proposeEditFile({ source_path: TEST_FILE, proposed_content: "y\n" });
  const result = executeApprovedAction(row.action_id);
  assert.equal(result.success, false);
  assert.match(result.message, /approved/i);
});

test.after(() => {
  try {
    if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
  } catch {
    /* ignore */
  }
  closeDatabase();
});
