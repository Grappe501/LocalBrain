import { Router } from "express";
import { APP_VERSION, type HealthResponse } from "@localbrain/shared";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  const response: HealthResponse = {
    ok: true,
    app: "LocalBrain",
    version: APP_VERSION,
    dbConnected: false,
    openaiKeyPresent: Boolean(process.env.OPENAI_API_KEY?.trim()),
  };

  res.json(response);
});
