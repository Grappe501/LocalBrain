import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { bootstrapSafety } from "./bootstrap.js";
import { getRepoRoot } from "./db/repoRoot.js";
import { safetyRouter } from "./routes/safety.js";

test("safety API integration", async () => {
  bootstrapSafety();

  const app = express();
  app.use(express.json());
  app.use("/api", safetyRouter);

  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;

  try {
    const statusRes = await fetch(`http://127.0.0.1:${port}/api/safety/status`);
    assert.equal(statusRes.status, 200);
    const status = (await statusRes.json()) as { engine: string; dbConnected: boolean };
    assert.equal(status.engine, "v2");
    assert.equal(status.dbConnected, true);

    const denyRes = await fetch(`http://127.0.0.1:${port}/api/safety/test-path`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "C:/Windows", action: "read" }),
    });
    const deny = (await denyRes.json()) as { allowed: boolean };
    assert.equal(deny.allowed, false);

    const allowRes = await fetch(`http://127.0.0.1:${port}/api/safety/test-path`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: `${getRepoRoot()}/README.md`,
        action: "read",
      }),
    });
    const allow = (await allowRes.json()) as { allowed: boolean };
    assert.equal(allow.allowed, true);
  } finally {
    server.close();
  }
});
