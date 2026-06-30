/**
 * LB-OS-PROD-002–007 — Reserved product arc (no implementation in these slices)
 * Package-first sequence before Memory OS ingestion.
 */

export const PRODUCT_SLICE_LICENSE = "LB-OS-PROD-002";
export const PRODUCT_SLICE_SOCIAL = "LB-OS-PROD-003";
export const PRODUCT_SLICE_MEDIA_STUDIO = "LB-OS-PROD-004";
export const PRODUCT_SLICE_INGESTION_PLANNER = "LB-OS-PROD-005";
export const PRODUCT_SLICE_MOBILE = "LB-OS-PROD-006";
export const PRODUCT_SLICE_INSTANCE_IDENTITY = "LB-OS-PROD-007";

/** Signed license records only — no plain-text codes in source, commits, or settings exports. */
export const LICENSE_STORAGE_RULE =
  "License entitlements are stored as signed license records verified locally — never as hardcoded plain-text codes in the repository.";

/**
 * Forever entitlements (e.g. STEVE-LIFETIME, KELLY-LIFETIME) are issued at activation as
 * cryptographically signed records bound to instance_id. Redemption labels are not persisted as plain strings.
 */
export const LICENSE_FOREVER_ENTITLEMENT_KIND = "lifetime" as const;

/** When license is expired or invalid — local data preserved; outbound/active features gated. */
export const EXPIRED_LICENSE_POLICY = {
  view_local_data: true,
  export_local_data: true,
  ai_calls: false,
  outbound_communications: false,
  connector_sync: false,
  new_ingestion: false,
  delete_data: false,
} as const;

export type ExpiredLicenseRestriction = keyof typeof EXPIRED_LICENSE_POLICY;

/** Product build order after empty brain (LB-OS-PROD-001). */
export const PRODUCT_INGESTION_SEQUENCE = [
  "empty_brain",
  "license_gate",
  "provider_vault",
  "local_drive_scan",
  "google_drive",
  "gmail_calendar_contacts",
  "mobile_import",
  "memory_os_user_structure",
] as const;

export type ProductIngestionStage = (typeof PRODUCT_INGESTION_SEQUENCE)[number];

/** Offices that own social + media connectors — ENC → DPEC → connector. */
export const SOCIAL_MEDIA_OWNING_DEPARTMENTS = [
  "Communications",
  "Media Office",
  "Chief of Staff",
] as const;

/** Reserved social / business page connectors (LB-OS-PROD-003). */
export const SOCIAL_CONNECTOR_PLATFORMS = [
  "facebook_pages",
  "instagram",
  "youtube",
  "tiktok",
  "x",
  "linkedin",
  "bluesky",
  "threads",
  "google_business",
  "campaign_pages",
  "business_pages",
] as const;

export type SocialConnectorPlatform = (typeof SOCIAL_CONNECTOR_PLATFORMS)[number];

export const SOCIAL_CONNECTOR_PLATFORM_LABELS: Record<SocialConnectorPlatform, string> = {
  facebook_pages: "Facebook Pages",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
  linkedin: "LinkedIn",
  bluesky: "BlueSky",
  threads: "Threads",
  google_business: "Google Business",
  campaign_pages: "Campaign pages",
  business_pages: "Business pages",
};

/** Media Studio / Creative Workbench surfaces (LB-OS-PROD-004). */
export const MEDIA_STUDIO_SURFACES = [
  "images",
  "video",
  "captions",
  "clips",
  "brand_kits",
  "plain_language_editing",
  "deployment_checklist",
  "approval_before_posting",
] as const;

export type MediaStudioSurface = (typeof MEDIA_STUDIO_SURFACES)[number];

/**
 * Mobile / tablet access (LB-OS-PROD-006).
 * Local web app / PWA served from user's LocalBrain machine — same network first, VPN later.
 */
export const MOBILE_ACCESS_DOCTRINE =
  "Local PWA served from the user's LocalBrain host — LAN first, remote via VPN later. Build privacy, encryption, redaction, and controlled disclosure — not evasion of platform rules or carrier/server infrastructure.";

export const CONNECTOR_GOVERNANCE_CHAIN = "ENC → DPEC → connector" as const;

/**
 * LB-OS-PROD-007 — One person/organization = one active primary LocalBrain.
 * Multiple devices may access it; multiple independent primary servers may not.
 */
export const SINGLE_PRIMARY_RULE =
  "One person or organization = one active primary LocalBrain. Multiple devices may access it. Multiple primary servers may not run independently for the same identity.";

export const SINGLE_PRIMARY_ALLOWED = [
  "one_primary_server_per_identity",
  "many_client_devices_laptop_ipad_phone",
  "device_clients_to_same_primary",
] as const;

export const SINGLE_PRIMARY_NOT_ALLOWED_YET = [
  "two_independent_primary_servers_same_identity",
  "server_a_and_server_b_both_active_primary",
] as const;

/** License / identity posture for a LocalBrain instance (LB-OS-PROD-007). */
export const INSTANCE_IDENTITY_STATES = [
  "ACTIVE_PRIMARY",
  "TRANSFER_PENDING",
  "READ_ONLY_ARCHIVE",
  "REVOKED",
  "RECOVERY_MODE",
] as const;

export type InstanceIdentityState = (typeof INSTANCE_IDENTITY_STATES)[number];

/** Only one instance may hold ACTIVE_PRIMARY for a given identity at a time. */
export const ACTIVE_PRIMARY_LOCK_RULE =
  "Only one instance can hold ACTIVE_PRIMARY at a time for a given LocalBrain identity.";

/** Remote device login — fresh encrypted session every distant connect (LB-OS-PROD-007). */
export const REMOTE_SESSION_REQUIREMENTS = [
  "device_registration",
  "encrypted_session",
  "short_lived_access_token",
  "refresh_token_rotation",
  "device_fingerprint",
  "remote_logout",
  "session_audit_log",
] as const;

export type RemoteSessionRequirement = (typeof REMOTE_SESSION_REQUIREMENTS)[number];

/** Eventual remote access posture — not public admin by default. */
export const REMOTE_ACCESS_POSTURE = [
  "trusted_lan_access",
  "vpn_only_remote_access",
  "no_public_admin_panel_by_default",
] as const;

/** Primary Instance Transfer workflow (LB-OS-PROD-007). */
export const PRIMARY_TRANSFER_STEPS = [
  "old_server_create_signed_transfer_bundle",
  "export_encrypted_brain_snapshot",
  "mark_old_instance_transfer_pending",
  "import_on_new_server",
  "verify_integrity",
  "activate_new_primary",
  "old_primary_read_only_archive",
] as const;

export type PrimaryTransferStep = (typeof PRIMARY_TRANSFER_STEPS)[number];

/** Surfaces to build when PROD-007 is earned — reserve only. */
export const INSTANCE_IDENTITY_BUILDS = [
  "instance_identity_certificate",
  "device_session_registry",
  "primary_instance_lock",
  "encrypted_transfer_bundle",
  "read_only_old_instance_mode",
  "activation_challenge",
  "transfer_audit_log",
] as const;

export type InstanceIdentityBuild = (typeof INSTANCE_IDENTITY_BUILDS)[number];
