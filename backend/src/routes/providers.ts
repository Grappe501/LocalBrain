import { Router } from "express";
import type { AICapability, AIProviderId, UpdateAIProviderRequest } from "@localbrain/shared";
import {
  getProviderAdapter,
  getProvidersOverview,
  revokeProviderCredential,
  storeProviderCredential,
  updateProvider,
  setWorkspaceProviderOverride,
} from "../providers/manager.js";
import { listFlightRecords } from "../providers/flightRecorder.js";
import { previewRouting } from "../providers/router.js";
import { updateProviderHealth } from "../providers/flightRecorder.js";

export const providersRouter = Router();

providersRouter.get("/providers", (_req, res) => {
  res.json(getProvidersOverview());
});

providersRouter.get("/providers/flight-log", (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 50), 200);
  res.json({ records: listFlightRecords(limit), read_only: true });
});

providersRouter.get("/providers/routing-preview", (req, res) => {
  const capability = (req.query.capability as AICapability) || "reasoning";
  const workspaceId = typeof req.query.workspace_id === "string" ? req.query.workspace_id : undefined;
  res.json(previewRouting(capability, workspaceId));
});

providersRouter.put("/providers/:id", (req, res) => {
  const id = req.params.id as AIProviderId;
  const body = req.body as UpdateAIProviderRequest;
  try {
    res.json(updateProvider(id, body));
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Update failed" });
  }
});

providersRouter.put("/providers/:id/credential", (req, res) => {
  const id = req.params.id as AIProviderId;
  const apiKey = typeof req.body?.api_key === "string" ? req.body.api_key.trim() : "";
  if (!apiKey) {
    res.status(400).json({ error: "api_key required" });
    return;
  }
  try {
    storeProviderCredential(id, apiKey);
    res.json({ provider_id: id, credential_status: "configured" as const });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Save failed" });
  }
});

providersRouter.delete("/providers/:id/credential", (req, res) => {
  const id = req.params.id as AIProviderId;
  revokeProviderCredential(id);
  res.json({ provider_id: id, credential_status: "missing" as const });
});

providersRouter.post("/providers/:id/verify", async (req, res) => {
  const id = req.params.id as AIProviderId;
  const adapter = getProviderAdapter(id);
  const result = await adapter.verifyConnection();
  updateProviderHealth(id, result.health, result.latency_ms, result.health === "healthy");
  res.json({
    provider_id: id,
    ok: result.health === "healthy",
    health: result.health,
    message: result.message,
    latency_ms: result.latency_ms,
  });
});

providersRouter.put("/providers/workspace-overrides/:workspaceId", (req, res) => {
  const workspaceId = req.params.workspaceId;
  const forceLocal = Boolean(req.body?.force_local);
  const preferred =
    typeof req.body?.preferred_provider_id === "string"
      ? (req.body.preferred_provider_id as AIProviderId)
      : null;
  res.json(
    setWorkspaceProviderOverride({
      workspace_id: workspaceId,
      force_local: forceLocal,
      preferred_provider_id: preferred,
    }),
  );
});
