import { Router } from "express";
import type { FileSummarizeMode } from "@localbrain/shared";
import { readFile } from "../files/readFile.js";
import { buildFolderManifest } from "../files/folderManifest.js";
import {
  summarizeFile,
  summarizeFolder,
  summarizeSelectedAsset,
} from "../files/summarizeService.js";

export const filesRouter = Router();

filesRouter.post("/files/read", (req, res) => {
  const pathParam = typeof req.body?.path === "string" ? req.body.path : "";
  if (!pathParam) {
    res.status(400).json({ error: "path is required" });
    return;
  }
  const result = readFile(pathParam);
  res.status(result.allowed ? 200 : 403).json(result);
});

filesRouter.post("/files/summarize", async (req, res) => {
  const pathParam = typeof req.body?.path === "string" ? req.body.path : "";
  const mode = (typeof req.body?.mode === "string" ? req.body.mode : "file") as FileSummarizeMode;
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt : undefined;

  if (!pathParam) {
    res.status(400).json({ error: "path is required" });
    return;
  }

  try {
    let result;
    switch (mode) {
      case "asset":
        result = await summarizeSelectedAsset(pathParam, prompt);
        break;
      case "folder":
        result = await summarizeFolder(pathParam, prompt);
        break;
      case "file":
      default:
        result = await summarizeFile(pathParam, prompt);
        break;
    }
    res.status(result.allowed ? 200 : 403).json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Summarize failed";
    res.status(500).json({ error: msg });
  }
});

filesRouter.post("/files/folder-manifest", (req, res) => {
  const pathParam = typeof req.body?.path === "string" ? req.body.path : "";
  if (!pathParam) {
    res.status(400).json({ error: "path is required" });
    return;
  }
  const result = buildFolderManifest(pathParam);
  res.status(result.allowed ? 200 : 403).json(result);
});
