import type { CommandResponse, CommandStatusResponse } from "@localbrain/shared";

export type { CommandResponse, CommandStatusResponse };

export async function fetchCommandStatus(): Promise<CommandStatusResponse> {
  const res = await fetch("/api/command/status");
  if (!res.ok) throw new Error("Command status fetch failed");
  return (await res.json()) as CommandStatusResponse;
}

export async function sendCommand(options: {
  message: string;
  workspace_id?: string;
  asset_path?: string;
  file_path?: string;
  tool?: "read_file" | "summarize_file" | "summarize_asset" | "summarize_folder";
  create_proposals?: boolean;
  orchestration_id?: string;
  recommendation_ids?: string[];
}): Promise<CommandResponse> {
  const res = await fetch("/api/command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  const data = (await res.json()) as CommandResponse;
  if (!res.ok && res.status >= 500) {
    throw new Error(data.message || "Command failed");
  }
  return data;
}

export async function createCosProposals(input: {
  orchestration_id: string;
  recommendation_ids?: string[];
}): Promise<{ action_ids: string[]; skipped: number; actions_queue_path: string | null }> {
  const res = await fetch("/api/cos/proposals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = (await res.json()) as { error?: string };
    throw new Error(err.error ?? "Failed to create proposals");
  }
  return (await res.json()) as {
    action_ids: string[];
    skipped: number;
    actions_queue_path: string | null;
  };
}
