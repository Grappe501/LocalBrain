import test from "node:test";
import assert from "node:assert/strict";
import {
  deserializeFact,
  FACT_SCHEMA_VERSION,
  factsEquivalent,
  isLifecycleTransitionAllowed,
  LifecycleTransitionError,
  serializeFact,
} from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { countAuditEventsForObject } from "./auditLog.js";
import { FactValidationError, validateFactRecord } from "./factValidator.js";
import {
  factContentFingerprint,
  getFactById,
  getFactPayloadRevisionCount,
} from "./factStore.js";
import {
  transitionFactLifecycle,
  verifyFact,
} from "./factService.js";
import { assertFactBodyUnchanged, FactContentMutationError } from "./factLineage.js";
import { writeFact, writeFactSupersession } from "./writePipeline.js";

function sampleCreateInput() {
  return {
    domain: "executive" as const,
    statement: "Volunteer training is complete.",
    subject_ref: { identity_id: "ID-org-volunteers", identity_kind: "organization" },
    predicate: "training_status",
    object_ref: "status:complete",
    event_at: "2026-07-01T14:00:00.000Z",
    valid_from: "2026-07-01T14:00:00.000Z",
    valid_until: "2027-07-01T14:00:00.000Z",
    source_ref: "source:training/volunteer-program",
    captured_by: { identity_id: "ID-executive-001", identity_kind: "executive" },
    capture_method: "direct" as const,
    confidence_level: "user_confirmed" as const,
  };
}

test("ENG-MEM-001.2.1 create Fact — schema, provenance, lifecycle Captured", () => {
  bootstrapApp();
  try {
    const { fact, engine_id } = writeFact(sampleCreateInput());
    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(fact.schema_version, FACT_SCHEMA_VERSION);
    assert.equal(fact.lifecycle_state, "Captured");
    assert.equal(fact.domain, "executive");
    assert.equal(fact.statement, "Volunteer training is complete.");
    assert.equal(fact.confidence.level, "user_confirmed");
    assert.equal(fact.provenance.convention_provenance_version, "CON-S4-2026-07");
    assert.ok(fact.provenance.provenance_id.startsWith("PRV-"));

    const loaded = getFactById(fact.fact_id);
    assert.ok(loaded);
    assert.ok(factsEquivalent(fact, loaded!));
    assert.equal(countAuditEventsForObject("Fact", fact.fact_id), 1);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.1 serialization round-trip", () => {
  bootstrapApp();
  try {
    const { fact } = writeFact(sampleCreateInput());
    const json = serializeFact(fact);
    const parsed = deserializeFact(json);
    assert.ok(factsEquivalent(fact, parsed));
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.1 validator rejects unknown fields", () => {
  bootstrapApp();
  try {
    const { fact } = writeFact(sampleCreateInput());
    const malformed = { ...fact, derived_from_episode: "EP-001" };
    assert.throws(
      () => validateFactRecord(malformed),
      (err: unknown) => err instanceof FactValidationError && err.field === "derived_from_episode",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.1 validity interval — valid_from and valid_until", () => {
  bootstrapApp();
  try {
    const { fact } = writeFact(sampleCreateInput());
    assert.equal(fact.valid_from, "2026-07-01T14:00:00.000Z");
    assert.equal(fact.valid_until, "2027-07-01T14:00:00.000Z");

    const createdAt = new Date().toISOString();
    assert.throws(
      () =>
        validateFactRecord({
          ...fact,
          fact_id: crypto.randomUUID(),
          valid_from: "2027-01-01T00:00:00.000Z",
          valid_until: "2026-01-01T00:00:00.000Z",
          created_at: createdAt,
          event_at: createdAt,
        }),
      (err: unknown) => err instanceof FactValidationError && err.field === "valid_from",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.1 S2 lifecycle — Captured to Verified", () => {
  bootstrapApp();
  try {
    const { fact } = writeFact(sampleCreateInput());
    const actor = { identity_id: "ID-executive-001", identity_kind: "executive" };

    const verified = verifyFact(fact.fact_id, actor);
    assert.equal(verified.lifecycle_state, "Verified");
    assert.equal(factContentFingerprint(fact), factContentFingerprint(verified));
    assert.equal(countAuditEventsForObject("Fact", fact.fact_id), 2);

    assert.equal(isLifecycleTransitionAllowed("Captured", "Referenced"), false);
    const { fact: fresh } = writeFact({
      ...sampleCreateInput(),
      statement: "Budget review scheduled.",
      source_ref: "source:calendar/budget",
    });
    assert.throws(
      () => transitionFactLifecycle(fresh.fact_id, "Referenced", actor, "memory.reference"),
      LifecycleTransitionError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.1 append-only — single payload row per fact_id", () => {
  bootstrapApp();
  try {
    const { fact } = writeFact(sampleCreateInput());
    assert.equal(getFactPayloadRevisionCount(fact.fact_id), 1);
    verifyFact(fact.fact_id, {
      identity_id: "ID-executive-001",
      identity_kind: "executive",
    });
    assert.equal(getFactPayloadRevisionCount(fact.fact_id), 1);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.1 time model — event_at, created_at, validity window", () => {
  bootstrapApp();
  try {
    const { fact } = writeFact(sampleCreateInput());
    assert.equal(fact.event_at, "2026-07-01T14:00:00.000Z");
    assert.ok(Date.parse(fact.created_at));
    assert.ok(Date.parse(fact.confidence.evaluated_at));
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.1 canonical Fact exists independently — lineage fields optional until supersession", () => {
  bootstrapApp();
  try {
    const { fact } = writeFact({
      domain: "workspace",
      statement: "Sprint goal locked.",
      subject_ref: { identity_id: "ID-project-alpha", identity_kind: "project" },
      predicate: "goal_status",
      event_at: "2026-07-01T08:00:00.000Z",
      source_ref: "source:manual/standup",
      captured_by: { identity_id: "ID-executive-001", identity_kind: "executive" },
      capture_method: "direct",
    });
    assert.ok(fact.fact_id);
    assert.equal(fact.object_ref, undefined);
    assert.equal(fact.supersedes, undefined);
    assert.throws(
      () => validateFactRecord({ ...fact, derived_from_episode: "EP-001" }),
      FactValidationError,
    );
    assert.throws(
      () => validateFactRecord({ ...fact, superseded_by: "other-fact" }),
      FactValidationError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.2 supersession — Fact A superseded_by Fact B, append-only correction", () => {
  bootstrapApp();
  try {
    const actor = { identity_id: "ID-executive-001", identity_kind: "executive" };
    const { fact: factA } = writeFact({
      ...sampleCreateInput(),
      statement: "Volunteer training is in progress.",
      object_ref: "status:in_progress",
    });
    verifyFact(factA.fact_id, actor);

    const { prior, successor } = writeFactSupersession({
      prior_fact_id: factA.fact_id,
      reason: "Training completion verified by program lead.",
      actor,
      correction: {
        ...sampleCreateInput(),
        statement: "Volunteer training is complete.",
        object_ref: "status:complete",
        event_at: "2026-07-02T16:00:00.000Z",
        valid_from: "2026-07-02T16:00:00.000Z",
      },
    });

    assert.equal(prior.fact_id, factA.fact_id);
    assert.equal(prior.lifecycle_state, "Superseded");
    assert.equal(prior.superseded_by, successor.fact_id);
    assert.ok(prior.superseded_at);
    assert.equal(successor.supersedes, factA.fact_id);
    assert.equal(successor.supersession_reason, "Training completion verified by program lead.");
    assert.equal(successor.statement, "Volunteer training is complete.");

    const loadedA = getFactById(factA.fact_id);
    const loadedB = getFactById(successor.fact_id);
    assert.ok(loadedA);
    assert.ok(loadedB);
    assert.equal(loadedA!.superseded_by, loadedB!.fact_id);
    assert.equal(loadedB!.supersedes, loadedA!.fact_id);
    assert.equal(getFactPayloadRevisionCount(factA.fact_id), 1);
    assert.equal(getFactPayloadRevisionCount(successor.fact_id), 1);
    assert.equal(countAuditEventsForObject("Fact", factA.fact_id), 3);
    assert.equal(countAuditEventsForObject("Fact", successor.fact_id), 1);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.2 rejects in-place statement mutation", () => {
  bootstrapApp();
  try {
    const { fact } = writeFact(sampleCreateInput());
    const mutated = { ...fact, statement: "Changed in place." };
    assert.throws(
      () => assertFactBodyUnchanged(fact, mutated),
      FactContentMutationError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.2 rejects supersession without reason", () => {
  bootstrapApp();
  try {
    const actor = { identity_id: "ID-executive-001", identity_kind: "executive" };
    const { fact } = writeFact(sampleCreateInput());
    verifyFact(fact.fact_id, actor);
    assert.throws(
      () =>
        writeFactSupersession({
          prior_fact_id: fact.fact_id,
          reason: "   ",
          actor,
          correction: sampleCreateInput(),
        }),
      FactValidationError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.2 rejects double supersession", () => {
  bootstrapApp();
  try {
    const actor = { identity_id: "ID-executive-001", identity_kind: "executive" };
    const { fact } = writeFact(sampleCreateInput());
    verifyFact(fact.fact_id, actor);
    writeFactSupersession({
      prior_fact_id: fact.fact_id,
      reason: "First correction.",
      actor,
      correction: { ...sampleCreateInput(), statement: "First correction fact." },
    });
    assert.throws(
      () =>
        writeFactSupersession({
          prior_fact_id: fact.fact_id,
          reason: "Second correction.",
          actor,
          correction: { ...sampleCreateInput(), statement: "Second correction fact." },
        }),
      FactValidationError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.2.2 requires Verified prior fact before supersession", () => {
  bootstrapApp();
  try {
    const actor = { identity_id: "ID-executive-001", identity_kind: "executive" };
    const { fact } = writeFact(sampleCreateInput());
    assert.throws(
      () =>
        writeFactSupersession({
          prior_fact_id: fact.fact_id,
          reason: "Too early.",
          actor,
          correction: sampleCreateInput(),
        }),
      FactValidationError,
    );
  } finally {
    shutdownApp();
  }
});
