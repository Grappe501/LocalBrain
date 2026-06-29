import cors from "cors";
import express from "express";
import { bootstrapApp } from "./bootstrap.js";
import { isDatabaseConnected } from "./db/database.js";
import { commandRouter } from "./command.js";
import { healthRouter } from "./health.js";
import { safetyRouter } from "./routes/safety.js";
import { workspacesRouter } from "./routes/workspaces.js";
import { modulesRouter } from "./routes/modules.js";
import { assetsRouter } from "./routes/assets.js";
import { actionsRouter } from "./routes/actions.js";
import { filesRouter } from "./routes/files.js";
import { knowledgeExplorerRouter } from "./routes/knowledgeExplorer.js";
import { getRegisteredModules } from "./core/moduleLoader.js";
import { runBackgroundIndex } from "./knowledgeExplorer/indexer.js";

const port = Number(process.env.LOCALBRAIN_PORT ?? 4545);

bootstrapApp();
runBackgroundIndex();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", healthRouter);
app.use("/api", commandRouter);
app.use("/api", safetyRouter);
app.use("/api", workspacesRouter);
app.use("/api", modulesRouter);
app.use("/api", assetsRouter);
app.use("/api", actionsRouter);
app.use("/api", filesRouter);
app.use("/api", knowledgeExplorerRouter);

app.listen(port, () => {
  const db = isDatabaseConnected();
  const modules = getRegisteredModules();
  console.log(`LocalBrain backend listening on http://localhost:${port}`);
  console.log(`Permission engine v2 — database ${db ? "connected" : "FAILED"}`);
  console.log(`Module loader — ${modules.length} manifests registered (LB-OS-106)`);
});
