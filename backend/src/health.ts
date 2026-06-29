import { Router } from "express";
import { APP_VERSION, type HealthResponse } from "@localbrain/shared";
import { isDatabaseConnected } from "./db/database.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  const response: HealthResponse = {
    ok: true,
    app: "LocalBrain",
    version: APP_VERSION,
    dbConnected: isDatabaseConnected(),
    openaiKeyPresent: Boolean(process.env.OPENAI_API_KEY?.trim()),
  };

  res.json(response);
});
