import { Router } from "express";
import type { WritingModeId, WritingVoiceId } from "@localbrain/shared";
import {
  getWritingOverview,
  previewDraft,
  listWritingSources,
  computeWritingScore,
} from "../writing/writingService.js";
import { routeWritingSpecialist } from "../writing/specialistRegistry.js";

export const writingRouter = Router();

writingRouter.get("/writing/overview", (_req, res) => {
  res.json(getWritingOverview());
});

writingRouter.get("/writing/score", (_req, res) => {
  res.json(computeWritingScore());
});

writingRouter.get("/writing/sources", (req, res) => {
  const workspaceId =
    typeof req.query.workspace_id === "string" ? req.query.workspace_id : "localbrain";
  res.json({ sources: listWritingSources(workspaceId), read_only: true });
});

writingRouter.post("/writing/draft/preview", (req, res) => {
  const body = req.body as {
    mode_id?: WritingModeId;
    voice_id?: WritingVoiceId;
    workspace_id?: string;
    topic?: string;
  };
  const preview = previewDraft({
    mode_id: body.mode_id ?? "substack_blog",
    voice_id: body.voice_id ?? "steve_strategic",
    workspace_id: body.workspace_id ?? "localbrain",
    topic: body.topic ?? "",
  });
  if (!preview) {
    res.status(400).json({ error: "Invalid mode, voice, or workspace" });
    return;
  }
  res.json(preview);
});

writingRouter.post("/writing/route", (req, res) => {
  const intent = typeof req.body?.intent === "string" ? req.body.intent : "";
  res.json({ specialist_id: routeWritingSpecialist(intent), read_only: true });
});
