import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapApp } from "../bootstrap.js";
import { closeDatabase } from "../db/database.js";
import { computeWritingScore } from "./writingScore.js";
import { previewDraft } from "./draftPreview.js";
import { getWritingOverview } from "./writingService.js";
import { WRITING_MODES } from "./writingModes.js";
import { WRITING_VOICES } from "./voiceLibrary.js";
import { listWritingSources } from "./writingSources.js";

test("writing modes catalog covers six high-value modes", () => {
  assert.equal(WRITING_MODES.length, 6);
  assert.ok(WRITING_MODES.some((m) => m.id === "novel_studio"));
  assert.ok(WRITING_MODES.some((m) => m.id === "social_draft"));
});

test("voice library has seven voices", () => {
  assert.equal(WRITING_VOICES.length, 7);
});

test("computeWritingScore returns factors", () => {
  bootstrapApp();
  const score = computeWritingScore();
  assert.ok(score.score >= 0 && score.score <= 100);
  assert.ok(score.factors.length >= 5);
});

test("previewDraft is read-only and publish blocked", () => {
  bootstrapApp();
  const draft = previewDraft({
    mode_id: "campaign_writing",
    voice_id: "kelly_campaign",
    workspace_id: "localbrain",
    topic: "Volunteer recruitment",
  });
  assert.ok(draft);
  assert.equal(draft!.read_only, true);
  assert.equal(draft!.publish_blocked, true);
  assert.ok(draft!.markdown.includes("No auto-publish"));
});

test("getWritingOverview includes guardrails", () => {
  bootstrapApp();
  const ov = getWritingOverview();
  assert.equal(ov.read_only, true);
  assert.ok(ov.guardrails.some((g) => g.includes("No auto-publishing")));
  assert.equal(ov.modes.length, 6);
});

test("listWritingSources respects workspace", () => {
  bootstrapApp();
  const sources = listWritingSources("localbrain");
  assert.ok(Array.isArray(sources));
});

test.after(() => {
  closeDatabase();
});
