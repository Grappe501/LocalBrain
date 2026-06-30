/**
 * LB-OS-PROD-010 — Executive LocalBrain Factory (manufacturing pipeline)
 * Architecture for manufacturing LocalBrains — not just building one.
 * Reserve only — no factory implementation in this slice.
 */

export const PRODUCT_SLICE_FACTORY = "LB-OS-PROD-010";
export const FACTORY_ENGINE_ID = "ENG-FAC-001";

/** Commercial pipeline — source platform to retire. */
export const LOCALBRAIN_FACTORY_LIFECYCLE = [
  "source_platform",
  "package",
  "provision",
  "activate",
  "personalize",
  "operate",
  "upgrade",
  "transfer",
  "retire",
] as const;

export type LocalBrainFactoryStage = (typeof LOCALBRAIN_FACTORY_LIFECYCLE)[number];

export const FACTORY_LIFECYCLE_LABELS: Record<LocalBrainFactoryStage, string> = {
  source_platform: "Source Platform",
  package: "Package",
  provision: "Provision",
  activate: "Activate",
  personalize: "Personalize",
  operate: "Operate",
  upgrade: "Upgrade",
  transfer: "Transfer",
  retire: "Retire",
};

/**
 * Every LocalBrain is born empty — structure only, no personal data.
 * Installer creates framework; Executive Discovery teaches who the executive is.
 */
export const EMPTY_BRAIN_BIRTH_CONTENT = [
  "executive_office",
  "departments",
  "capability_graph",
  "constitution",
  "memory_os_framework",
  "provider_vault",
  "security_vault",
  "passport",
  "identity_certificate",
] as const;

export type EmptyBrainBirthContent = (typeof EMPTY_BRAIN_BIRTH_CONTENT)[number];

export const EMPTY_BRAIN_BIRTH_EXCLUSIONS = [
  "personal_data",
  "sample_memories",
  "fake_projects",
  "steve_specific_seeds",
  "hardcoded_paths",
] as const;

export const EMPTY_BRAIN_BIRTH_RULE =
  "Every LocalBrain installer creates structure only — Executive Office, departments, capability graph, constitution framework, Memory OS shell, vaults, passport, and identity certificate. Nothing else. Onboarding begins Executive Discovery.";

/**
 * Executive Discovery — onboarding reframed from setup wizard to institutional learning.
 * Each answer activates departments; no ingestion until factory + convention gates pass.
 */
export const EXECUTIVE_DISCOVERY_TOPICS = [
  "who_are_you",
  "organizations_you_run",
  "roles_you_hold",
  "calendars_that_matter",
  "communication_channels",
  "financial_entities",
  "workspaces_to_create",
  "offices_to_wake_first",
] as const;

export type ExecutiveDiscoveryTopic = (typeof EXECUTIVE_DISCOVERY_TOPICS)[number];

export const EXECUTIVE_DISCOVERY_DOCTRINE =
  "Onboarding is Executive Discovery — the system learns who the executive is and activates departments. Not a settings wizard.";

/**
 * Office-driven connectors — user connects Offices, not raw providers.
 * Communications Office decides Gmail, Outlook, Exchange, SendGrid, Twilio — like AI abstraction.
 */
export const OFFICE_CONNECTOR_DOCTRINE =
  "Users connect Offices (e.g. Connect Communications), not raw providers. The Office decides which connectors it needs — Gmail, Outlook, Exchange, SendGrid, Twilio — under ENC → DPEC → connector.";

export const OFFICE_CONNECTOR_EXAMPLES = {
  communications: ["gmail", "outlook", "exchange", "sendgrid", "twilio"],
  finance: ["quickbooks", "bank_feeds", "campaign_finance"],
  compliance: ["filing_systems", "document_retention"],
} as const;

/**
 * Versioned Constitutions — migration engine upgrades every brain safely.
 * Constitution 2.1 → Steve/Kelly/Chris/Campaign/Business brains → Constitution 2.2 migration.
 */
export const CONSTITUTION_VERSIONING_SLICE = "LB-OS-CON-003";

export const CONSTITUTION_MIGRATION_DOCTRINE =
  "Constitutions are versioned. A migration engine upgrades every installed LocalBrain safely across constitution versions — commercially valuable and sovereignty-preserving.";

/** Example constitution lineage — illustrative, not hardcoded runtime state. */
export const CONSTITUTION_VERSION_EXAMPLE = {
  current: "2.1",
  next: "2.2",
  applies_to: ["steve_brain", "kelly_brain", "chris_brain", "campaign_brain", "business_brain"],
} as const;

/**
 * Chief Compliance Officer — beyond legal compliance.
 * Campaign finance · nonprofit reporting · business filings · retention · privacy · licensing · records.
 * Different LocalBrains enable different compliance packs.
 */
export const CHIEF_COMPLIANCE_OFFICE_SLICE = "LB-OS-PROD-011";

export const COMPLIANCE_OFFICE_DOMAINS = [
  "campaign_finance",
  "nonprofit_reporting",
  "business_filings",
  "document_retention",
  "privacy",
  "licensing",
  "records_policies",
] as const;

export type ComplianceOfficeDomain = (typeof COMPLIANCE_OFFICE_DOMAINS)[number];

/** Distinct brain instances that collaborate via workspaces — not one omniscient brain. */
export const MULTI_INSTITUTION_BRAIN_EXAMPLES = [
  "steve_brain",
  "kelly_brain",
  "campaign_brain",
  "stand_up_arkansas_brain",
  "business_brain",
] as const;

export const MULTI_INSTITUTION_DOCTRINE =
  "Each brain has its own authority, passport, memory, offices, and institutional judgment — collaborating through workspaces, not merged into one omniscient brain.";

/**
 * Pre-ingestion build order (binding priority through Convention + Factory).
 * Memory OS and personal ingestion only after Empty Brain Factory ships.
 */
export const PRE_INGESTION_BUILD_ORDER = [
  "executive_office_ux_experience_certification",
  "peer_review_session_4",
  "peer_review_session_5",
  "theory_v1_freeze",
  "executive_epistemology_convention",
  "empty_brain_factory",
  "memory_os",
  "personal_information_ingestion",
] as const;

export type PreIngestionBuildStage = (typeof PRE_INGESTION_BUILD_ORDER)[number];

export const COMMERCIAL_FIRST_RELEASE_RULE =
  "First commercial release: customers receive the same empty sovereign platform. Every installed LocalBrain grows into a unique executive institution from owner data — never inheriting assumptions from the builder.";

/**
 * Brain Birth Certificate — every manufactured LocalBrain must answer these at provision time.
 * Permanent manufacturing rule: every brain knows exactly where it came from.
 */
export const BRAIN_BIRTH_CERTIFICATE_FIELDS = [
  "manufacturer",
  "constitution_version",
  "office_pack",
  "capability_pack",
  "factory_version",
  "migration_version",
  "identity",
  "authority",
  "passport",
  "license",
] as const;

export type BrainBirthCertificateField = (typeof BRAIN_BIRTH_CERTIFICATE_FIELDS)[number];

export const BRAIN_BIRTH_CERTIFICATE_RULE =
  "Every LocalBrain carries a birth certificate answering: who made me, which Constitution, Office Pack, Capability Pack, Factory version, Migration version, Identity, Authority, Passport, and License.";

/** Five parallel production tracks — keep separate through commercial release. */
export const PRODUCTION_READINESS_TRACKS = [
  "executive_theory",
  "product_manufacturing",
  "memory_os",
  "executive_offices",
  "commercial_release",
] as const;

export type ProductionReadinessTrack = (typeof PRODUCTION_READINESS_TRACKS)[number];

export const PRODUCTION_READINESS_TRACK_LABELS: Record<ProductionReadinessTrack, string> = {
  executive_theory: "Track A — Executive Theory (Sessions 4–5 → Convention)",
  product_manufacturing: "Track B — Product Manufacturing (Factory)",
  memory_os: "Track C — Memory OS",
  executive_offices: "Track D — Executive Offices",
  commercial_release: "Track E — Commercial Release",
};

/** Value stack — product value compounds toward executive legacy, not model version. */
export const EXECUTIVE_VALUE_STACK = [
  "localbrain_factory",
  "executive_institution",
  "executive_cognition",
  "executive_judgment",
  "executive_legacy",
] as const;

export type ExecutiveValueLayer = (typeof EXECUTIVE_VALUE_STACK)[number];
