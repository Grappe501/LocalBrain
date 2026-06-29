/** Approval-gated file action contracts — LB-OS-010 */

export type ProposedActionType =
  | "create_draft"
  | "edit_file"
  | "move"
  | "quarantine_delete"
  | "migration_cutover";

export type ProposedActionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executed"
  | "failed"
  | "blocked";

export type ActionLogEventType =
  | "proposed"
  | "approved"
  | "rejected"
  | "executed"
  | "failed"
  | "restored"
  | "dry_run";

export interface ProposedAction {
  action_id: string;
  action_type: ProposedActionType;
  status: ProposedActionStatus;
  title: string;
  description: string;
  source_path: string | null;
  target_path: string | null;
  proposed_content: string | null;
  diff_preview: string | null;
  backup_id: string | null;
  requested_by: string;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  executed_at: string | null;
  execution_detail: string | null;
}

export interface ActionLogEntry {
  id: number;
  action_id: string;
  event_type: ActionLogEventType;
  detail: string;
  created_at: string;
}

export interface BackupRecord {
  backup_id: string;
  action_id: string | null;
  source_path: string;
  backup_path: string;
  created_at: string;
}

export interface ExecuteResult {
  action_id: string;
  dry_run: boolean;
  success: boolean;
  message: string;
  backup_id: string | null;
  source_path: string | null;
  target_path: string | null;
}
