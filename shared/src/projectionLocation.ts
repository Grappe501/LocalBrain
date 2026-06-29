/**
 * Projection Location — Projection Layer refinement (not a foundational object).
 * LB-OS-022 lock · see LOCALBRAIN_THREE_WORLDS_AND_PROJECTION.md
 *
 * Location = semantic slot that stays stable when storage provider or physical path changes.
 */

export type LocationRole =
  | "primary"
  | "documentation"
  | "media"
  | "database"
  | "backup"
  | "archive"
  | "training"
  | "sync"
  | "general";

/** Stable location identity within a logical workspace footprint. */
export interface ProjectionLocationRef {
  location_id: string;
  location_label: string;
  location_role: LocationRole;
}

export const PRIMARY_LOCATION_ID = "loc-primary-development";
export const PRIMARY_LOCATION_LABEL = "Primary Development";

/** Default location for filesystem_root projections in Phase 1 migration arc. */
export const DEFAULT_PRIMARY_LOCATION: ProjectionLocationRef = {
  location_id: PRIMARY_LOCATION_ID,
  location_label: PRIMARY_LOCATION_LABEL,
  location_role: "primary",
};

/** Canonical location roles a workspace may eventually bind (multi-projection future). */
export const STANDARD_WORKSPACE_LOCATION_ROLES: LocationRole[] = [
  "primary",
  "documentation",
  "media",
  "database",
  "backup",
  "archive",
];
