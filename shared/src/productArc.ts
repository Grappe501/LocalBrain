/**
 * LB-OS-PROD-002–009 — Reserved product arc (no implementation in these slices)
 * Package-first sequence before Memory OS ingestion.
 */

export const PRODUCT_SLICE_LICENSE = "LB-OS-PROD-002";
export const PRODUCT_SLICE_SOCIAL = "LB-OS-PROD-003";
export const PRODUCT_SLICE_MEDIA_STUDIO = "LB-OS-PROD-004";
export const PRODUCT_SLICE_INGESTION_PLANNER = "LB-OS-PROD-005";
export const PRODUCT_SLICE_MOBILE = "LB-OS-PROD-006";
export const PRODUCT_SLICE_INSTANCE_IDENTITY = "LB-OS-PROD-007";
export const PRODUCT_SLICE_EXECUTIVE_AUTHORITY = "LB-OS-PROD-008";
export const PRODUCT_SLICE_EXECUTIVE_PASSPORT = "LB-OS-PROD-009";

/** Signed license records only — no plain-text codes in source, commits, or settings exports. */
export const LICENSE_STORAGE_RULE =
  "License entitlements are stored as signed license records verified locally — never as hardcoded plain-text codes in the repository.";

/**
 * License binds to Executive Identity — not hardware.
 * Steve Lifetime License → Steve Identity → current authority holder (primary server).
 */
export const LICENSE_IDENTITY_BINDING_RULE =
  "License entitlements attach to Executive Identity, not to a physical machine. Hardware replacement re-binds the same identity to a new authority — no re-purchase.";

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
 * LB-OS-PROD-007 — One authoritative identity; one ACTIVE_PRIMARY authority at a time.
 * Evolved framing: One LocalBrain = One Authoritative Identity (not "one server forever").
 * The primary server is the current authority holder — it may move via controlled transfer or recovery.
 */
export const SINGLE_PRIMARY_RULE =
  "One Executive Identity = one authoritative brain at a time. Multiple client devices may access it. Multiple independent authorities for the same identity may not run concurrently.";

/** Alias doctrine — authority over hardware. */
export const ONE_AUTHORITY_RULE =
  "One LocalBrain = one authoritative identity. The primary server is simply the current authority for that identity — it need not stay on the same hardware forever.";

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

/**
 * LB-OS-PROD-008 — Executive Identity Authority.
 * Foundational layer: identity certificates, authority election, transfer/recovery, backups, signing root.
 */
export const EXECUTIVE_AUTHORITY_BUILDS = [
  "identity_certificates",
  "authority_election",
  "transfer_authority",
  "disaster_recovery",
  "encrypted_automatic_snapshots",
  "cryptographic_signing_root",
  "authority_audit_log",
] as const;

export type ExecutiveAuthorityBuild = (typeof EXECUTIVE_AUTHORITY_BUILDS)[number];

/**
 * Encrypted snapshot chain — snapshots are insurance, never active authorities.
 * An inactive snapshot cannot answer questions, generate AI, or communicate.
 */
export const ENCRYPTED_SNAPSHOT_CHAIN = [
  "active_brain",
  "encrypted_snapshot",
  "encrypted_backup",
  "optional_offline_copy",
] as const;

export type EncryptedSnapshotStage = (typeof ENCRYPTED_SNAPSHOT_CHAIN)[number];

export const SNAPSHOT_INACTIVE_RULE =
  "Encrypted snapshots and backups are never active authorities — they cannot answer questions, invoke AI, or communicate. Insurance only.";

/** Disaster recovery without divergence — new authority from encrypted snapshot. */
export const DISASTER_RECOVERY_STEPS = [
  "restore_encrypted_snapshot",
  "verify_integrity_and_signatures",
  "activate_authority",
  "resume_working",
] as const;

export type DisasterRecoveryStep = (typeof DISASTER_RECOVERY_STEPS)[number];

/**
 * LB-OS-PROD-009 — Executive Passport for inter-brain trust.
 * Scalable handshake between distinct LocalBrain identities.
 */
export const EXECUTIVE_PASSPORT_FIELDS = [
  "identity",
  "public_certificate",
  "capabilities",
  "version",
  "trust_level",
  "office_structure",
  "permissions",
] as const;

export type ExecutivePassportField = (typeof EXECUTIVE_PASSPORT_FIELDS)[number];

export const PASSPORT_HANDSHAKE_STEPS = [
  "brain_a_initiates",
  "handshake",
  "passport_exchange",
  "trust_verification",
  "workspace_permissions",
  "encrypted_session",
] as const;

export type PassportHandshakeStep = (typeof PASSPORT_HANDSHAKE_STEPS)[number];

/**
 * Multi-brain collaboration model — each brain owns private memory;
 * shared workspace owns project objects; only approved workspace objects sync.
 */
export const MULTI_BRAIN_WORKSPACE_RULE =
  "Each brain owns its own memories. A shared workspace owns the project. No private memory leaks — only approved workspace objects synchronize.";

/** Long-term LocalBrain architecture stack (personal OS for executive institutions). */
export const EXECUTIVE_ARCHITECTURE_STACK = [
  "executive_identity",
  "executive_passport",
  "authority_certificate",
  "authoritative_brain",
  "executive_office",
  "institution",
  "memory_os",
  "world_model",
  "chief_of_staff",
  "departments",
  "providers",
] as const;

export type ExecutiveArchitectureLayer = (typeof EXECUTIVE_ARCHITECTURE_STACK)[number];

/**
 * Implementation doctrine — every LocalBrain object cryptographically signed at rest and on sync.
 * Enables end-to-end integrity, strong audits, and trusted inter-brain sync without blind trust.
 */
export const SIGNED_OBJECT_DOCTRINE =
  "Every LocalBrain object — memories, decisions, messages, workspace updates, transfers — is cryptographically signed for integrity verification and trusted synchronization.";

/** Object classes subject to SIGNED_OBJECT_DOCTRINE when implemented. */
export const SIGNED_OBJECT_CLASSES = [
  "memories",
  "decisions",
  "messages",
  "workspace_updates",
  "transfers",
  "snapshots",
  "passport_packets",
  "license_records",
] as const;

export type SignedObjectClass = (typeof SIGNED_OBJECT_CLASSES)[number];
