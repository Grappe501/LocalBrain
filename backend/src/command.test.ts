import assert from "node:assert/strict";
import test from "node:test";
import type { CommandStubResponse } from "./command.js";

test("command stub response shape", () => {
  const response: CommandStubResponse = {
    intent: "STUB",
    message: "test",
  };

  assert.equal(response.intent, "STUB");
  assert.equal(response.message, "test");
});
