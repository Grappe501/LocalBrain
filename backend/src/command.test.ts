import assert from "node:assert/strict";
import test from "node:test";
import {
  actionClassToIntent,
  classifyCommand,
  estimateTokens,
} from "./openai/actionClassifier.js";
import { buildCommandContext, buildOfflineAnswer } from "./openai/contextBuilder.js";
import { executeCommand, getCommandStatus } from "./openai/commandOrchestrator.js";
import { bootstrapApp } from "./bootstrap.js";
import { closeDatabase } from "./db/database.js";

test("classifyCommand detects focus and briefing intents", () => {
  assert.equal(classifyCommand("What should I focus on next in LocalBrain?").action_class, "focus_priority");
  assert.equal(classifyCommand("Summarize my Executive Briefing mock").action_class, "briefing_summary");
  assert.equal(classifyCommand("Why is this asset flagged stale?").action_class, "asset_stale");
  assert.equal(classifyCommand("Explain the current workspace").action_class, "workspace_explain");
});

test("actionClassToIntent maps to command intents", () => {
  assert.equal(actionClassToIntent("focus_priority"), "FOCUS_NEXT");
  assert.equal(actionClassToIntent("briefing_summary"), "BRIEFING_SUMMARY");
});

test("estimateTokens returns positive stub", () => {
  assert.ok(estimateTokens("hello world") > 0);
});

test("buildCommandContext includes workspace and asset intelligence", () => {
  bootstrapApp();
  const ctx = buildCommandContext({ actionClass: "focus_priority" });
  assert.ok(ctx.contextUsed.includes("living_workspace"));
  assert.ok(ctx.contextUsed.includes("asset_intelligence"));
  assert.ok(ctx.systemPrompt.includes("Chief of Staff"));
});

test("buildOfflineAnswer works without API key", () => {
  bootstrapApp();
  const prev = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const msg = buildOfflineAnswer({ actionClass: "focus_priority", workspaceId: "localbrain" });
  assert.ok(msg.includes("localbrain") || msg.includes("OpenAI"));
  if (prev) process.env.OPENAI_API_KEY = prev;
});

test("executeCommand returns MISSING_KEY when key absent", async () => {
  bootstrapApp();
  const prev = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const res = await executeCommand({
    message: "What should I focus on next in LocalBrain?",
    workspace_id: "localbrain",
  });
  assert.equal(res.intent, "MISSING_KEY");
  assert.equal(res.recommend_only, true);
  assert.ok(res.message.length > 10);
  assert.ok(res.context_used.length > 0);
  if (prev) process.env.OPENAI_API_KEY = prev;
});

test("getCommandStatus reflects key configuration", () => {
  bootstrapApp();
  const prev = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  assert.equal(getCommandStatus().key_configured, false);
  process.env.OPENAI_API_KEY = "test-key";
  assert.equal(getCommandStatus().key_configured, true);
  if (prev) process.env.OPENAI_API_KEY = prev;
  else delete process.env.OPENAI_API_KEY;
});

test("command response shape contract", async () => {
  bootstrapApp();
  const prev = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const res = await executeCommand({ message: "Explain the current workspace" });
  assert.ok(res.intent);
  assert.ok(typeof res.message === "string");
  assert.equal(res.recommend_only, true);
  if (prev) process.env.OPENAI_API_KEY = prev;
});

test.after(() => {
  closeDatabase();
});
