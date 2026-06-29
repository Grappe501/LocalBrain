import test from "node:test";
import assert from "node:assert/strict";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { clearProviderCredential, saveProviderCredential } from "./vault.js";
import { getProvidersOverview, updateProvider } from "./manager.js";
import {
  isProviderCredentialConfigured,
  getOpenAiApiKeyForAdapter,
} from "./credentials.js";
import { previewRouting, selectProviderForCapability } from "./router.js";
import { appendFlightRecord, listFlightRecords } from "./flightRecorder.js";

test("vault stores credential without exposing in overview API shape", () => {
  bootstrapApp();
  try {
    const prev = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    clearProviderCredential("openai");

    saveProviderCredential("openai", "sk-test-vault-key-12345");
    assert.equal(getOpenAiApiKeyForAdapter(), "sk-test-vault-key-12345");
    assert.equal(isProviderCredentialConfigured("openai"), true);

    const overview = getProvidersOverview();
    const openai = overview.providers.find((p) => p.id === "openai");
    assert.ok(openai);
    assert.equal(openai.credential_status, "configured");
    assert.ok(!JSON.stringify(overview).includes("sk-test"));

    clearProviderCredential("openai");
    if (prev) process.env.OPENAI_API_KEY = prev;
  } finally {
    shutdownApp();
  }
});

test("router selects OpenAI when only provider configured", () => {
  bootstrapApp();
  try {
    const prev = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "sk-env-bootstrap";
    clearProviderCredential("openai");
    updateProvider("openai", { enabled: true });

    const selection = selectProviderForCapability("reasoning");
    assert.ok(selection);
    assert.equal(selection.providerId, "openai");
    assert.ok(selection.routingReason.includes("reasoning"));

    const preview = previewRouting("fast_summary");
    assert.equal(preview.provider_id, "openai");
    assert.ok(preview.routing_reason.length > 0);

    if (prev) process.env.OPENAI_API_KEY = prev;
    else delete process.env.OPENAI_API_KEY;
  } finally {
    shutdownApp();
  }
});

test("flight recorder appends records with routing reason", () => {
  bootstrapApp();
  try {
    appendFlightRecord({
      capability: "reasoning",
      job_profile: "deep",
      routing_reason: "test route",
      provider_id: "openai",
      model_id: "gpt-4.1-mini",
      total_tokens: 120,
      latency_ms: 42,
      success: true,
    });

    const records = listFlightRecords(5);
    assert.ok(records.length >= 1);
    assert.equal(records[0].routing_reason, "test route");
    assert.equal(records[0].success, true);
  } finally {
    shutdownApp();
  }
});
