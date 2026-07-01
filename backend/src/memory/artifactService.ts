import {
  ARTIFACT_INITIAL_LIFECYCLE,
  ARTIFACT_KIND,
  ARTIFACT_SCHEMA_VERSION,
  type CaptureMethod,
  type Artifact,
  type IdentityRef,
  type LifecycleState,
  type MemoryDomain,
  type TrustLevel,
} from "@localbrain/shared";
import { appendMemoryAuditEvent } from "./auditLog.js";
import {
  getArtifactById,
  insertArtifact,
  updateArtifactLifecycleState,
} from "./artifactStore.js";
import { assertArtifactSchemaVersion, validateArtifactRecord } from "./artifactValidator.js";
import {
  buildMemoryProvenanceEnvelope,
  MEMORY_AUDIT_OBJECT_ARTIFACT,
} from "./provenanceEnvelope.js";
import { recordInitialArtifactCustody } from "./artifactCustodyService.js";

export type CreateArtifactInput = {
  domain: MemoryDomain;
  mime_type: string;
  event_at: string;
  captured_by: IdentityRef;
  capture_method: CaptureMethod;
  source_ref: string;
  uri?: string;
  content_ref?: string;
  project_ref?: string;
  content_hash?: string;
  consent_ref?: string | null;
  trust_level?: TrustLevel;
};

export function createArtifact(input: CreateArtifactInput): Artifact {
  const createdAt = new Date().toISOString();
  const provenance = buildMemoryProvenanceEnvelope({
    captured_by: input.captured_by,
    capture_method: input.capture_method,
    source_ref: input.source_ref,
    consent_ref: input.consent_ref,
    trust_level: input.trust_level,
    recorded_at: createdAt,
  });

  const draft: Artifact = {
    artifact_id: crypto.randomUUID(),
    schema_version: ARTIFACT_SCHEMA_VERSION,
    domain: input.domain,
    uri: input.uri,
    content_ref: input.content_ref,
    mime_type: input.mime_type,
    project_ref: input.project_ref,
    content_hash: input.content_hash,
    lifecycle_state: ARTIFACT_INITIAL_LIFECYCLE,
    provenance,
    event_at: input.event_at,
    created_at: createdAt,
  };

  const artifact = validateArtifactRecord(draft);
  assertArtifactSchemaVersion(artifact);
  insertArtifact(artifact);

  appendMemoryAuditEvent({
    event_type: "memory.capture",
    object_type: MEMORY_AUDIT_OBJECT_ARTIFACT,
    object_id: artifact.artifact_id,
    to_state: artifact.lifecycle_state,
    actor_identity_id: input.captured_by.identity_id,
    detail: {
      domain: artifact.domain,
      mime_type: artifact.mime_type,
      engine: "ENG-MEM-001",
    },
  });

  recordInitialArtifactCustody(
    artifact.artifact_id,
    input.captured_by,
    input.event_at,
  );

  return artifact;
}

export function transitionArtifactLifecycle(
  artifactId: string,
  nextState: LifecycleState,
  actor: IdentityRef,
  eventType: string,
): Artifact {
  const before = getArtifactById(artifactId);
  if (!before) {
    throw new Error(`Artifact not found: ${artifactId}`);
  }

  const updated = updateArtifactLifecycleState(artifactId, nextState, new Date().toISOString());
  validateArtifactRecord(updated);

  appendMemoryAuditEvent({
    event_type: eventType,
    object_type: ARTIFACT_KIND,
    object_id: artifactId,
    from_state: before.lifecycle_state,
    to_state: nextState,
    actor_identity_id: actor.identity_id,
  });

  return updated;
}

export function verifyArtifact(artifactId: string, actor: IdentityRef): Artifact {
  return transitionArtifactLifecycle(artifactId, "Verified", actor, "memory.verify");
}
