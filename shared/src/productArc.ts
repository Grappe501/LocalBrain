/**
 * LB-OS-PROD-002–006 — Reserved product arc (no implementation in this slice)
 * Package-first sequence before Memory OS ingestion.
 */

export const PRODUCT_SLICE_LICENSE = "LB-OS-PROD-002";
export const PRODUCT_SLICE_SOCIAL = "LB-OS-PROD-003";
export const PRODUCT_SLICE_MEDIA_STUDIO = "LB-OS-PROD-004";
export const PRODUCT_SLICE_INGESTION_PLANNER = "LB-OS-PROD-005";
export const PRODUCT_SLICE_MOBILE = "LB-OS-PROD-006";

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
