import { Router } from "express";
import { getEpoOverview, getEpoSliceDetail, listDocumentationLibrary } from "../epo/epoService.js";
import { getPlatformReadinessReport } from "../certification/platformReadinessService.js";

export const epoRouter = Router();

epoRouter.get("/epo/readiness", (_req, res) => {
  res.json(getPlatformReadinessReport());
});

epoRouter.get("/epo/overview", (_req, res) => {
  res.json(getEpoOverview());
});

epoRouter.get("/epo/slices/:id", (req, res) => {
  const detail = getEpoSliceDetail(req.params.id);
  if (!detail) {
    res.status(404).json({ error: "Slice not found" });
    return;
  }
  res.json({ slice: detail });
});

epoRouter.get("/epo/docs", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  res.json({ docs: listDocumentationLibrary(q) });
});

epoRouter.get("/epo/why/:id", (req, res) => {
  const detail = getEpoSliceDetail(req.params.id);
  if (!detail) {
    res.status(404).json({ error: "Slice not found" });
    return;
  }
  res.json({
    slice_id: detail.slice_id,
    explanation: detail.blocker_explanation ?? "No blocker — slice may be complete or ready.",
    confidence: detail.blocker_explanation?.startsWith("Waiting") ? "high" : "medium",
    read_only: true,
  });
});
