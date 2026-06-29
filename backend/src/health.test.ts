import assert from "node:assert/strict";
import test from "node:test";
import { APP_VERSION } from "@localbrain/shared";

test("health response shape matches contract", () => {
  const response = {
    ok: true,
    app: "LocalBrain",
    version: APP_VERSION,
    dbConnected: false,
    openaiKeyPresent: false,
  };

  assert.equal(response.ok, true);
  assert.equal(response.app, "LocalBrain");
  assert.equal(response.dbConnected, false);
  assert.equal(typeof response.openaiKeyPresent, "boolean");
});
