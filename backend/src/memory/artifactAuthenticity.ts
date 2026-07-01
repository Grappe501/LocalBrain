import type { Artifact } from "@localbrain/shared";
import { ArtifactImmutableFieldError } from "./artifactStore.js";

const IMMUTABLE_BODY_FIELDS = [
  "uri",
  "content_ref",
  "mime_type",
  "project_ref",
  "content_hash",
  "domain",
  "event_at",
  "provenance",
] as const;

export function assertArtifactBodyUnchanged(before: Artifact, after: Artifact): void {
  for (const field of IMMUTABLE_BODY_FIELDS) {
    const beforeVal = JSON.stringify(before[field]);
    const afterVal = JSON.stringify(after[field]);
    if (beforeVal !== afterVal) {
      throw new ArtifactImmutableFieldError(field);
    }
  }
}
