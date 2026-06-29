/** Chief of Staff command layer contracts — LB-OS-008 */

export type CommandIntent =
  | "MISSING_KEY"
  | "FOCUS_NEXT"
  | "EXPLAIN_WORKSPACE"
  | "ASSET_INTELLIGENCE"
  | "BRIEFING_SUMMARY"
  | "FILE_READ"
  | "FILE_SUMMARIZE"
  | "GENERAL"
  | "ERROR";

export type CommandActionClass =
  | "focus_priority"
  | "workspace_explain"
  | "asset_stale"
  | "briefing_summary"
  | "file_read"
  | "file_summarize"
  | "general_query";

export interface CommandResponse {
  intent: CommandIntent;
  action_class: CommandActionClass;
  message: string;
  key_configured: boolean;
  model: string | null;
  tokens_estimate: number | null;
  context_used: string[];
  /** Read-only file tools in 009 — still no writes */
  recommend_only: true;
  logged: boolean;
  source_path?: string | null;
  file_read_logged?: boolean;
}

export interface CommandStatusResponse {
  key_configured: boolean;
  model: string;
  ready: boolean;
  provider: "openai";
}
