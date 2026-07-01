import test from "node:test";
import assert from "node:assert/strict";
import {
  ARTIFACT_SCHEMA_VERSION,
  artifactsEquivalent,
  deserializeArtifact,
  isLifecycleTransitionAllowed,
  LifecycleTransitionError,
  serializeArtifact,
} from "@localbrain/shared";
import { bootstrapApp, shutdownApp } from "../bootstrap.js";
import { countAuditEventsForObject } from "./auditLog.js";
import { assertArtifactBodyUnchanged } from "./artifactAuthenticity.js";
import { ArtifactValidationError, validateArtifactRecord } from "./artifactValidator.js";
import {
  artifactContentFingerprint,
  ArtifactImmutableFieldError,
  getArtifactById,
  getArtifactPayloadRevisionCount,
} from "./artifactStore.js";
import {
  transitionArtifactLifecycle,
  verifyArtifact,
} from "./artifactService.js";
import { writeArtifact } from "./writePipeline.js";

const SAMPLE_HASH =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

function sampleUriInput() {
  return {
    domain: "workspace" as const,
    uri: "https://archive.example.org/docs/campaign-brief.pdf",
    mime_type: "application/pdf",
    event_at: "2026-07-01T12:00:00.000Z",
    captured_by: { identity_id: "ID-executive-001", identity_kind: "executive" },
    capture_method: "import" as const,
    source_ref: "source:email/inbox-2026-07-01",
    trust_level: "imported" as const,
  };
}

function sampleContentRefInput() {
  return {
    domain: "workspace" as const,
    content_ref: "content://blob/scan-001",
    content_hash: SAMPLE_HASH,
    mime_type: "image/png",
    event_at: "2026-07-01T12:30:00.000Z",
    captured_by: { identity_id: "ID-executive-001", identity_kind: "executive" },
    capture_method: "direct" as const,
    source_ref: "source:scanner/office-a",
    project_ref: "project:campaign-2026",
  };
}

test("ENG-MEM-001.3.1 create Artifact — schema, provenance, lifecycle Captured", () => {
  bootstrapApp();
  try {
    const { artifact, engine_id } = writeArtifact(sampleUriInput());
    assert.equal(engine_id, "ENG-MEM-001");
    assert.equal(artifact.schema_version, ARTIFACT_SCHEMA_VERSION);
    assert.equal(artifact.lifecycle_state, "Captured");
    assert.equal(artifact.domain, "workspace");
    assert.equal(artifact.uri, sampleUriInput().uri);
    assert.equal(artifact.content_ref, undefined);
    assert.equal(artifact.provenance.convention_provenance_version, "CON-S4-2026-07");
    assert.ok(artifact.artifact_id.length > 0);
    assert.notEqual(artifact.artifact_id, sampleUriInput().uri);

    const loaded = getArtifactById(artifact.artifact_id);
    assert.ok(loaded);
    assert.ok(artifactsEquivalent(artifact, loaded!));
    assert.equal(countAuditEventsForObject("Artifact", artifact.artifact_id), 1);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 serialization round-trip", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact(sampleContentRefInput());
    const json = serializeArtifact(artifact);
    const parsed = deserializeArtifact(json);
    assert.ok(artifactsEquivalent(artifact, parsed));
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 validator rejects unknown fields", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact(sampleUriInput());
    const malformed = { ...artifact, extra_field: true };
    assert.throws(
      () => validateArtifactRecord(malformed),
      (err: unknown) => err instanceof ArtifactValidationError && err.field === "extra_field",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 validator rejects conclusion fields", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact(sampleUriInput());
    const withStatement = { ...artifact, statement: "Therefore we accept..." };
    assert.throws(
      () => validateArtifactRecord(withStatement),
      (err: unknown) => err instanceof ArtifactValidationError && err.field === "statement",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 uri xor content_ref — both, neither, one each", () => {
  bootstrapApp();
  try {
    const base = writeArtifact(sampleUriInput()).artifact;

    assert.throws(
      () =>
        validateArtifactRecord({
          ...base,
          uri: "https://example.com/a.pdf",
          content_ref: "content://blob/a",
          content_hash: SAMPLE_HASH,
        }),
      (err: unknown) => err instanceof ArtifactValidationError && err.field === "uri",
    );

    const noAnchor = { ...base };
    delete noAnchor.uri;
    delete noAnchor.content_ref;
    assert.throws(
      () => validateArtifactRecord(noAnchor),
      (err: unknown) => err instanceof ArtifactValidationError && err.field === "uri",
    );

    assert.doesNotThrow(() => validateArtifactRecord(base));
    assert.doesNotThrow(() => validateArtifactRecord(writeArtifact(sampleContentRefInput()).artifact));
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 A13 content_hash required when content_ref present", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact(sampleContentRefInput());
    assert.equal(artifact.content_hash, SAMPLE_HASH);

    const withoutHash = { ...artifact, content_hash: undefined };
    assert.throws(
      () => validateArtifactRecord(withoutHash),
      (err: unknown) => err instanceof ArtifactValidationError && err.field === "content_hash",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 mime_type required", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact(sampleUriInput());
    assert.throws(
      () => validateArtifactRecord({ ...artifact, mime_type: "" }),
      (err: unknown) => err instanceof ArtifactValidationError && err.field === "mime_type",
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 S2 lifecycle — Captured to Verified, forbidden Captured to Referenced", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact(sampleContentRefInput());
    const actor = { identity_id: "ID-executive-001", identity_kind: "executive" };

    const verified = verifyArtifact(artifact.artifact_id, actor);
    assert.equal(verified.lifecycle_state, "Verified");
    assert.equal(
      artifactContentFingerprint(artifact),
      artifactContentFingerprint(verified),
    );
    assert.equal(countAuditEventsForObject("Artifact", artifact.artifact_id), 2);

    assert.equal(isLifecycleTransitionAllowed("Captured", "Referenced"), false);
    const { artifact: fresh } = writeArtifact({
      ...sampleUriInput(),
      uri: "https://archive.example.org/docs/revised-scan.pdf",
    });
    assert.throws(
      () => transitionArtifactLifecycle(fresh.artifact_id, "Referenced", actor, "memory.reference"),
      LifecycleTransitionError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 append-only — single payload row per artifact_id", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact(sampleUriInput());
    assert.equal(getArtifactPayloadRevisionCount(artifact.artifact_id), 1);
    verifyArtifact(artifact.artifact_id, {
      identity_id: "ID-executive-001",
      identity_kind: "executive",
    });
    assert.equal(getArtifactPayloadRevisionCount(artifact.artifact_id), 1);
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 time model — event_at, created_at", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact(sampleUriInput());
    assert.equal(artifact.event_at, "2026-07-01T12:00:00.000Z");
    assert.ok(Date.parse(artifact.created_at));
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 authenticity — body fields immutable after capture", () => {
  bootstrapApp();
  try {
    const { artifact } = writeArtifact(sampleContentRefInput());
    const verified = verifyArtifact(artifact.artifact_id, {
      identity_id: "ID-executive-001",
      identity_kind: "executive",
    });
    assert.doesNotThrow(() => assertArtifactBodyUnchanged(artifact, verified));

    const mutated = { ...verified, uri: "https://migrated.example/new-path.pdf" };
    assert.throws(
      () => assertArtifactBodyUnchanged(artifact, mutated),
      ArtifactImmutableFieldError,
    );
  } finally {
    shutdownApp();
  }
});

test("ENG-MEM-001.3.1 artifact_id identity survives uri change concept — id not derived from path", () => {
  bootstrapApp();
  try {
    const first = writeArtifact(sampleUriInput()).artifact;
    const second = writeArtifact({
      ...sampleUriInput(),
      uri: "file:///mnt/archive/same-bytes-different-path.pdf",
    }).artifact;
    assert.notEqual(first.artifact_id, second.artifact_id);
    assert.notEqual(first.artifact_id, first.uri);
    assert.notEqual(second.artifact_id, second.uri);
  } finally {
    shutdownApp();
  }
});
