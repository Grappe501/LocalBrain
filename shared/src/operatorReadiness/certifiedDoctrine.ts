/** Certified Implementation Doctrine — frozen engineering constitution (2026-07-05). */

export const RELATIONSHIP_PLATFORM_DOCTRINES = [
  { id: "promote_dont_duplicate", label: "Promote, don't duplicate" },
  { id: "reference_dont_replicate", label: "Reference, don't replicate" },
  { id: "group_dont_duplicate", label: "Group, don't duplicate" },
  { id: "belong_dont_flatten", label: "Belong, don't flatten" },
  { id: "summarize_dont_speculate", label: "Summarize, don't speculate" },
  { id: "aggregate_dont_centralize", label: "Aggregate, don't centralize" },
] as const;

export const IDENTITY_PLATFORM_DOCTRINES = [
  { id: "stage_dont_commit", label: "Stage, don't commit" },
  { id: "provenance_always", label: "Provenance, always" },
  { id: "review_before_merge", label: "Review before merge" },
] as const;

export const VOLUNTEER_OPERATIONS_DOCTRINES = [
  { id: "coordinate_dont_assign", label: "Coordinate people, don't just assign tasks" },
  { id: "expose_dont_obscure", label: "Expose, don't obscure" },
] as const;

export const CERTIFIED_IMPLEMENTATION_DOCTRINES = [
  ...RELATIONSHIP_PLATFORM_DOCTRINES,
  ...IDENTITY_PLATFORM_DOCTRINES,
  ...VOLUNTEER_OPERATIONS_DOCTRINES,
] as const;

export type CertifiedDoctrineId = (typeof CERTIFIED_IMPLEMENTATION_DOCTRINES)[number]["id"];

export const DOCTRINE_REVIEW_QUESTION =
  "Does this change preserve every certified doctrine?" as const;

export type DoctrinePreservationReview = {
  change_summary: string;
  reviewed_at: string;
  reviewer_id: string;
  preserves_all_doctrines: boolean;
  violations?: readonly { doctrine_id: CertifiedDoctrineId; note: string }[];
};
