import type { ExecuteResult, ProposedAction, ActionLogEntry, BackupRecord } from "@localbrain/shared";

export async function fetchProposedActions(status?: string): Promise<ProposedAction[]> {
  const url = status ? `/api/actions/proposed?status=${encodeURIComponent(status)}` : "/api/actions/proposed";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load proposed actions");
  const data = (await res.json()) as { actions: ProposedAction[] };
  return data.actions;
}

export async function proposeAction(body: Record<string, unknown>): Promise<ProposedAction> {
  const res = await fetch("/api/actions/propose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { action: ProposedAction; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Proposal failed");
  return data.action;
}

export async function approveActionApi(actionId: string): Promise<ProposedAction> {
  const res = await fetch(`/api/actions/${actionId}/approve`, { method: "POST" });
  const data = (await res.json()) as { action: ProposedAction; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Approve failed");
  return data.action;
}

export async function rejectActionApi(actionId: string, reason?: string): Promise<ProposedAction> {
  const res = await fetch(`/api/actions/${actionId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  const data = (await res.json()) as { action: ProposedAction; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Reject failed");
  return data.action;
}

export async function executeActionApi(actionId: string, dryRun = false): Promise<ExecuteResult> {
  const res = await fetch(`/api/actions/${actionId}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dry_run: dryRun }),
  });
  return (await res.json()) as ExecuteResult;
}

export async function fetchActionLog(): Promise<ActionLogEntry[]> {
  const res = await fetch("/api/actions/log");
  if (!res.ok) throw new Error("Failed to load action log");
  const data = (await res.json()) as { log: ActionLogEntry[] };
  return data.log;
}

export async function fetchBackups(): Promise<BackupRecord[]> {
  const res = await fetch("/api/actions/backups");
  if (!res.ok) throw new Error("Failed to load backups");
  const data = (await res.json()) as { backups: BackupRecord[] };
  return data.backups;
}

export async function restoreBackupApi(backupId: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/actions/restore/backup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ backup_id: backupId }),
  });
  return (await res.json()) as { success: boolean; message: string };
}
