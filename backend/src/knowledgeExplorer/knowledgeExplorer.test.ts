import assert from "node:assert/strict";
import test from "node:test";
import { parseSearchQuery } from "./searchParser.js";
import { resolveWorkspaceForPath, getExplorerRootPaths } from "./pathWorkspace.js";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { getRepoRoot } from "../db/repoRoot.js";
import { executeSearch } from "./searchService.js";
import { listTreeChildren } from "./treeService.js";
import { explainFolder } from "./explainService.js";

test("parseSearchQuery handles file and action prefixes", () => {
  assert.deepEqual(parseSearchQuery("file: budget.xlsx"), { type: "file", term: "budget.xlsx" });
  assert.deepEqual(parseSearchQuery("focus:"), { type: "focus" });
  assert.deepEqual(parseSearchQuery("duplicate:"), { type: "duplicate" });
  assert.deepEqual(parseSearchQuery("workspace: localbrain"), {
    type: "workspace",
    term: "localbrain",
  });
});

test("resolveWorkspaceForPath maps repo root to localbrain", () => {
  bootstrapApp();
  const root = getRepoRoot();
  const ws = resolveWorkspaceForPath(root);
  assert.equal(ws?.workspace_id, "localbrain");
});

test("getExplorerRootPaths includes localbrain root", () => {
  bootstrapApp();
  const root = getRepoRoot();
  const paths = getExplorerRootPaths();
  assert.ok(paths.some((p) => p.toLowerCase() === root.toLowerCase()));
});

test("tree lists workspace roots without scanning full drive", () => {
  bootstrapApp();
  const roots = listTreeChildren();
  assert.ok(roots.length >= 1);
  assert.ok(roots.every((n) => n.is_directory));
});

test("focus search returns workspaces with current_focus", () => {
  bootstrapApp();
  const results = executeSearch("focus:");
  assert.ok(results.some((r) => r.workspace_id === "localbrain"));
});

test("explain folder returns workspace context for repo root", () => {
  bootstrapApp();
  const root = getRepoRoot();
  const ex = explainFolder(root);
  assert.ok(ex);
  assert.equal(ex?.workspace?.workspace_id, "localbrain");
  assert.ok(ex?.purpose.length > 10);
});

test.after(() => {
  closeDatabase();
});
