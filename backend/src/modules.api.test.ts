import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { bootstrapApp } from "./bootstrap.js";
import { modulesRouter } from "./routes/modules.js";

test("modules API returns manifest-registered departments", async () => {
  bootstrapApp();

  const app = express();
  app.use("/api", modulesRouter);

  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/modules`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      modules: { module_id: string }[];
      department_modules: { module_id: string; name: string }[];
      load_order: string[];
    };
    assert.ok(data.modules.length >= 7);
    assert.ok(data.department_modules.some((m) => m.module_id === "engineering-studio"));
    assert.ok(data.load_order.includes("engineering-studio"));

    const one = await fetch(`http://127.0.0.1:${port}/api/modules/engineering-studio`);
    assert.equal(one.status, 200);
    const mod = (await one.json()) as { module: { lazy_load_boundary: string } };
    assert.ok(mod.module.lazy_load_boundary.includes("engineering-studio"));
  } finally {
    server.close();
  }
});
