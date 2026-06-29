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
