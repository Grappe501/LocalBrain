/** Chief of Staff command layer contracts — LB-OS-008 / 010.5 */

import type { CosOrchestration } from "./cosOrchestration.js";

export type CommandIntent =
  | "MISSING_KEY"
  | "FOCUS_NEXT"
  | "EXPLAIN_WORKSPACE"
  | "ASSET_INTELLIGENCE"
  | "WORKSPACE_CLEANUP"
  | "BRIEFING_SUMMARY"
  | "FILE_READ"
  | "FILE_SUMMARIZE"
  | "GENERAL"
  | "ERROR";

export type CommandActionClass =
  | "focus_priority"
  | "workspace_explain"
  | "asset_stale"
  | "workspace_cleanup"
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
  /** Read-only file tools in 009 — writes only via approval queue */
  recommend_only: true;
  logged: boolean;
  source_path?: string | null;
  file_read_logged?: boolean;
  /** LB-OS-010.5 orchestration payload when pipeline runs */
  orchestration?: CosOrchestration | null;
  /** Pending action IDs when proposals were created (never executed) */
  proposed_action_ids?: string[];
  /** Link target for Actions queue UI */
  actions_queue_path?: "/actions";
}

export interface CommandStatusResponse {
  key_configured: boolean;
  model: string;
  ready: boolean;
  provider: "openai";
}
