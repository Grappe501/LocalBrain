import { Router } from "express";
import type { CommandResponse, CommandStatusResponse } from "@localbrain/shared";
import { executeCommand, getCommandStatus } from "./openai/commandOrchestrator.js";

export type { CommandResponse, CommandStatusResponse };

/** @deprecated LB-OS-002 stub shape */
export type CommandStubResponse = {
  intent: string;
  message: string;
};

export const commandRouter = Router();

commandRouter.get("/command/status", (_req, res) => {
  const status = getCommandStatus();
  res.json(status satisfies CommandStatusResponse);
});

commandRouter.post("/command", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message : "";
  const workspace_id =
    typeof req.body?.workspace_id === "string" ? req.body.workspace_id : undefined;
  const asset_path =
    typeof req.body?.asset_path === "string" ? req.body.asset_path : undefined;

  try {
    const response = await executeCommand({ message, workspace_id, asset_path });
    res.json(response);
  } catch {
    const fallback: CommandResponse = {
      intent: "ERROR",
      action_class: "general_query",
      message: "Chief of Staff command failed unexpectedly.",
      key_configured: getCommandStatus().key_configured,
      model: null,
      tokens_estimate: null,
      context_used: [],
      recommend_only: true,
      logged: false,
    };
    res.status(500).json(fallback);
  }
});
