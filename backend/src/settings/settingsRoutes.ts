import { Router } from "express";
import type { BrainInstanceExportBundle, UpdateBrainInstanceProfileRequest } from "@localbrain/shared";
import {
  completeOnboarding,
  exportBrainInstanceConfig,
  getBrainInstanceOverview,
  getBrainInstanceProfile,
  getOnboardingState,
  importBrainInstanceConfig,
  resetOnboarding,
  saveOnboardingProgress,
  updateBrainInstanceProfile,
} from "../settings/brainInstanceService.js";
import { getConnectorReadinessReport } from "../settings/connectorReadinessService.js";
import { getProvidersOverview } from "../providers/manager.js";

export const settingsRouter = Router();

settingsRouter.get("/settings/instance", (_req, res) => {
  res.json(getBrainInstanceOverview());
});

settingsRouter.put("/settings/instance", (req, res) => {
  try {
    const body = req.body as UpdateBrainInstanceProfileRequest;
    const profile = updateBrainInstanceProfile(body);
    res.json({ profile, observed_at: new Date().toISOString() });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Update failed" });
  }
});

settingsRouter.get("/settings/onboarding", (_req, res) => {
  res.json({
    onboarding: getOnboardingState(),
    profile: getBrainInstanceProfile(),
    observed_at: new Date().toISOString(),
  });
});

settingsRouter.put("/settings/onboarding/step", (req, res) => {
  const step = Number(req.body?.step ?? 0);
  res.json({ onboarding: saveOnboardingProgress(step) });
});

settingsRouter.post("/settings/onboarding/complete", (req, res) => {
  try {
    const profilePatch = req.body?.profile as UpdateBrainInstanceProfileRequest | undefined;
    const onboarding = completeOnboarding(profilePatch);
    res.json({ onboarding, profile: getBrainInstanceProfile() });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Complete failed" });
  }
});

settingsRouter.post("/settings/onboarding/reset", (_req, res) => {
  res.json({ onboarding: resetOnboarding() });
});

settingsRouter.get("/settings/providers", (_req, res) => {
  res.json({
    readiness: getConnectorReadinessReport(),
    ai_providers: getProvidersOverview(),
    observed_at: new Date().toISOString(),
  });
});

settingsRouter.get("/settings/instance/export", (_req, res) => {
  res.json(exportBrainInstanceConfig());
});

settingsRouter.post("/settings/instance/import", (req, res) => {
  try {
    const bundle = req.body as BrainInstanceExportBundle;
    const profile = importBrainInstanceConfig(bundle);
    res.json({ profile, imported_at: new Date().toISOString() });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Import failed" });
  }
});
