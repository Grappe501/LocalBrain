import cors from "cors";
import express from "express";
import { commandRouter } from "./command.js";
import { healthRouter } from "./health.js";

const port = Number(process.env.LOCALBRAIN_PORT ?? 4545);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", healthRouter);
app.use("/api", commandRouter);

app.listen(port, () => {
  console.log(`LocalBrain backend listening on http://localhost:${port}`);
});
