import { Router } from "express";
import { runV1Acceptance } from "../v1/v1SpineVerifier.js";

export const v1Router = Router();

v1Router.get("/v1/acceptance", (_req, res) => {
  res.json(runV1Acceptance());
});
