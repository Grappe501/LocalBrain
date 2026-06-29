import type { CommandActionClass, CosCapability } from "@localbrain/shared";

const ROUTES: Partial<Record<CommandActionClass, CosCapability[]>> = {
  workspace_cleanup: [
    "living_workspace",
    "digital_asset_registry",
    "asset_intelligence",
    "knowledge_explorer",
    "decision_ledger",
    "approval_engine",
  ],
  asset_stale: [
    "digital_asset_registry",
    "asset_intelligence",
    "knowledge_explorer",
    "approval_engine",
  ],
  focus_priority: ["living_workspace", "decision_ledger", "asset_intelligence"],
  workspace_explain: ["living_workspace", "knowledge_explorer"],
  briefing_summary: ["living_workspace", "decision_ledger"],
};

export function routeCapabilities(actionClass: CommandActionClass): CosCapability[] {
  return ROUTES[actionClass] ?? ["living_workspace", "asset_intelligence"];
}

export function isOrchestratedAction(actionClass: CommandActionClass): boolean {
  return actionClass === "workspace_cleanup" || actionClass === "asset_stale";
}
