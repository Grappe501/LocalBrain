import cors from "cors";
import express from "express";
import { bootstrapApp } from "./bootstrap.js";
import { isDatabaseConnected } from "./db/database.js";
import { commandRouter } from "./command.js";
import { healthRouter } from "./health.js";
import { safetyRouter } from "./routes/safety.js";
import { workspacesRouter } from "./routes/workspaces.js";

const port = Number(process.env.LOCALBRAIN_PORT ?? 4545);

bootstrapApp();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", healthRouter);
app.use("/api", commandRouter);
app.use("/api", safetyRouter);
app.use("/api", workspacesRouter);

app.listen(port, () => {
  const db = isDatabaseConnected();
  console.log(`LocalBrain backend listening on http://localhost:${port}`);
  console.log(`Permission engine v2 — database ${db ? "connected" : "FAILED"}`);
});
