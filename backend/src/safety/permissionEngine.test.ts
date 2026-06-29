import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { createPermissionEngine } from "./permissionEngine.js";

const ALLOWED = path.resolve("H:/localAgent");

function engine() {
  return createPermissionEngine({ allowedRoots: [ALLOWED] });
}

test("allowed path under H:/localAgent passes read", () => {
  const result = engine().checkPath({
    path: path.join(ALLOWED, "README.md"),
    action: "read",
  });
  assert.equal(result.allowed, true);
  assert.equal(result.level, "READ_ONLY");
});

test("C:/Windows is denied", () => {
  const result = engine().checkPath({ path: "C:/Windows", action: "read" });
  assert.equal(result.allowed, false);
  assert.match(result.reason, /forbidden/i);
});

test("C:/Program Files is denied", () => {
  const result = engine().checkPath({ path: "C:/Program Files", action: "read" });
  assert.equal(result.allowed, false);
});

test(".env path is denied", () => {
  const result = engine().checkPath({
    path: path.join(ALLOWED, ".env"),
    action: "read",
  });
  assert.equal(result.allowed, false);
  assert.match(result.reason, /secret|Forbidden/i);
});

test("node_modules segment is denied", () => {
  const result = engine().checkPath({
    path: path.join(ALLOWED, "node_modules", "pkg", "index.js"),
    action: "read",
  });
  assert.equal(result.allowed, false);
  assert.match(result.reason, /ignored segment/i);
});

test("write action denied until LB-OS-010", () => {
  const result = engine().checkPath({
    path: path.join(ALLOWED, "README.md"),
    action: "write",
  });
  assert.equal(result.allowed, false);
  assert.match(result.reason, /LB-OS-010/);
});

test("path outside allowed roots is denied", () => {
  const result = engine().checkPath({ path: "D:/other/project/file.txt", action: "read" });
  assert.equal(result.allowed, false);
  assert.match(result.reason, /outside all allowed/i);
});
