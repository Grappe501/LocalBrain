import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { getRepoRoot } from "../db/repoRoot.js";
import { buildFolderManifest } from "../files/folderManifest.js";
import { readFile } from "../files/readFile.js";
import { resolveFileToolRequest } from "../files/fileToolResolver.js";
import { executeCommand } from "../openai/commandOrchestrator.js";
import path from "node:path";

test("readFile allows text file under repo root", () => {
  bootstrapApp();
  const root = getRepoRoot();
  const pkg = path.join(root, "package.json");
  const result = readFile(pkg);
  assert.equal(result.allowed, true);
  assert.equal(result.logged, true);
  assert.ok(result.content?.includes("localbrain"));
  assert.equal(result.normalized_path, result.normalized_path);
});

test("readFile denies secret .env pattern", () => {
  bootstrapApp();
  const root = getRepoRoot();
  const result = readFile(path.join(root, ".env"));
  assert.equal(result.allowed, false);
  assert.equal(result.logged, true);
});

test("readFile denies paths outside allowed roots", () => {
  bootstrapApp();
  const result = readFile("C:/Windows/System32/drivers/etc/hosts");
  assert.equal(result.allowed, false);
});

test("buildFolderManifest returns metadata only manifest", () => {
  bootstrapApp();
  const root = getRepoRoot();
  const manifest = buildFolderManifest(path.join(root, "backend", "src"));
  assert.equal(manifest.manifest_only, true);
  assert.equal(manifest.logged, true);
  if (manifest.allowed) {
    assert.ok(manifest.entries.length >= 1);
    assert.ok(manifest.entries.every((e) => e.path));
  }
});

test("resolveFileToolRequest detects summarize asset from explorer", () => {
  const req = resolveFileToolRequest({
    message: "Summarize this selected asset (read-only, permission-gated).",
    asset_path: "H:/localAgent/package.json",
    tool: "summarize_asset",
  });
  assert.ok(req);
  assert.equal(req?.kind, "summarize_asset");
});

test("executeCommand file read via asset_path", async () => {
  bootstrapApp();
  const prev = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const root = getRepoRoot();
  const res = await executeCommand({
    message: "Read this file content",
    asset_path: path.join(root, "package.json"),
    tool: "read_file",
  });
  assert.equal(res.intent, "FILE_READ");
  assert.ok(res.source_path);
  assert.equal(res.file_read_logged, true);
  assert.ok(res.message.includes("Source:"));
  if (prev) process.env.OPENAI_API_KEY = prev;
});

test("executeCommand summarize asset works offline", async () => {
  bootstrapApp();
  const prev = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const root = getRepoRoot();
  const res = await executeCommand({
    message: "Summarize this selected asset",
    asset_path: path.join(root, "README.md"),
    tool: "summarize_asset",
  });
  assert.equal(res.intent, "FILE_SUMMARIZE");
  assert.ok(res.source_path);
  assert.equal(res.recommend_only, true);
  if (prev) process.env.OPENAI_API_KEY = prev;
});

test.after(() => {
  closeDatabase();
});
