import { Router } from "express";

export type CommandStubResponse = {
  intent: "STUB";
  message: string;
};

export const commandRouter = Router();

commandRouter.post("/command", (req, res) => {
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  const response: CommandStubResponse = {
    intent: "STUB",
    message: message || "No message provided",
  };

  res.json(response);
});
