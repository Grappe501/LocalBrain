/** Chief of Staff command layer contracts — LB-OS-008 */

export type CommandIntent =
  | "MISSING_KEY"
  | "FOCUS_NEXT"
  | "EXPLAIN_WORKSPACE"
  | "ASSET_INTELLIGENCE"
  | "BRIEFING_SUMMARY"
  | "GENERAL"
  | "ERROR";

export type CommandActionClass =
  | "focus_priority"
  | "workspace_explain"
  | "asset_stale"
  | "briefing_summary"
  | "general_query";

export interface CommandResponse {
  intent: CommandIntent;
  action_class: CommandActionClass;
  message: string;
  key_configured: boolean;
  model: string | null;
  tokens_estimate: number | null;
  context_used: string[];
  /** Always true in LB-OS-008 — no tools or file ops */
  recommend_only: true;
  logged: boolean;
}

export interface CommandStatusResponse {
  key_configured: boolean;
  model: string;
  ready: boolean;
  provider: "openai";
}
