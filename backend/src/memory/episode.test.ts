import test from "node:test";
import assert from "node:assert/strict";
import {
  deserializeEpisode,
  EPISODE_SCHEMA_VERSION,
  episodesEquivalent,
  isLifecycleTransitionAllowed,
  LifecycleTransitionError,
  serializeEpisode,
} from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { countAuditEventsForObject } from "./auditLog.js";
import { EpisodeValidationError, validateEpisodeRecord } from "./episodeValidator.js";
import {
  episodeContentFingerprint,
  getEpisodeById,
  getEpisodePayloadRevisionCount,
} from "./episodeStore.js";
import {
  createEpisode,
  transitionEpisodeLifecycle,
  verifyEpisode,
} from "./episodeService.js";
import { writeEpisode } from "./writePipeline.js";

function sampleCreateInput() {
  return {
    domain: "executive" as const,
    started_at: "2026-07-01T09:00:00.000Z",
    ended_at: "2026-07-01T10:00:00.000Z",
    source_ref: "source:calendar/campaign-meeting",
    event_at: "2026-07-01T09:00:00.000Z",
    captured_by: { identity_id: "ID-executive-001", identity_kind: "executive" },
    capture_method: "direct" as const,
    title: "Campaign meeting",
    trust_level: "observed" as const,
  };
}

test("ENG-MEM-001.1 create Episode — schema, provenance, lifecycle Captured", () => {
  bootstrapApp();
  try {
    const { episode, engine_id } = writeEpisode(sampleCreateInput());
    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(episode.schema_version, EPISODE_SCHEMA_VERSION);
    assert.equal(episode.lifecycle_state, "Captured");
    assert.equal(episode.domain, "executive");
    assert.equal(episode.provenance.convention_provenance_version, "CON-S4-2026-07");
    assert.equal(episode.provenance.trust.level, "observed");
    assert.ok(episode.provenance.provenance_id.startsWith("PRV-"));

    const loaded = getEpisodeById(episode.episode_id);
    assert.ok(loaded);
    assert.ok(episodesEquivalent(episode, loaded!));
    assert.equal(countAuditEventsForObject("Episode", episode.episode_id), 1);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.1 serialization round-trip", () => {
  bootstrapApp();
  try {
    const { episode } = writeEpisode(sampleCreateInput());
    const json = serializeEpisode(episode);
    const parsed = deserializeEpisode(json);
    assert.ok(episodesEquivalent(episode, parsed));
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.1 validator rejects unknown fields", () => {
  bootstrapApp();
  try {
    const { episode } = writeEpisode(sampleCreateInput());
    const malformed = { ...episode, extra_field: true };
    assert.throws(
      () => validateEpisodeRecord(malformed),
      (err: unknown) => err instanceof EpisodeValidationError && err.field === "extra_field",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.1 S2 lifecycle — Captured to Verified, forbidden Captured to Referenced", () => {
  bootstrapApp();
  try {
    const { episode } = writeEpisode(sampleCreateInput());
    const actor = { identity_id: "ID-executive-001", identity_kind: "executive" };

    const verified = verifyEpisode(episode.episode_id, actor);
    assert.equal(verified.lifecycle_state, "Verified");
    assert.equal(
      episodeContentFingerprint(episode),
      episodeContentFingerprint(verified),
    );
    assert.equal(countAuditEventsForObject("Episode", episode.episode_id), 2);

    assert.equal(isLifecycleTransitionAllowed("Captured", "Referenced"), false);
    const { episode: fresh } = writeEpisode({
      ...sampleCreateInput(),
      source_ref: "source:calendar/volunteer-call",
      title: "Volunteer call",
    });
    assert.throws(
      () => transitionEpisodeLifecycle(fresh.episode_id, "Referenced", actor, "memory.reference"),
      LifecycleTransitionError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.1 append-only — single payload row per episode_id", () => {
  bootstrapApp();
  try {
    const { episode } = writeEpisode(sampleCreateInput());
    assert.equal(getEpisodePayloadRevisionCount(episode.episode_id), 1);
    verifyEpisode(episode.episode_id, {
      identity_id: "ID-executive-001",
      identity_kind: "executive",
    });
    assert.equal(getEpisodePayloadRevisionCount(episode.episode_id), 1);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.1 time model — started_at, ended_at, event_at, created_at", () => {
  bootstrapApp();
  try {
    const { episode } = writeEpisode(sampleCreateInput());
    assert.equal(episode.started_at, "2026-07-01T09:00:00.000Z");
    assert.equal(episode.ended_at, "2026-07-01T10:00:00.000Z");
    assert.equal(episode.event_at, "2026-07-01T09:00:00.000Z");
    assert.ok(Date.parse(episode.created_at));
  } finally {
    shutdownApp();
  }
});
