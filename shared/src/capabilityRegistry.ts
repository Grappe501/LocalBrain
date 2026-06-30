/**
 * ENG-CAP-001 — Canonical Capability Registry (LB-OS-026.6)
 * Single metadata layer: navigation, workflows, EQ routing, and intent derive from here.
 *
 * Admission gate — every new capability must answer:
 * 1. Which Office owns it?  2. Which Department executes it?
 * 3. Which Intelligence Domain supplies it?  4. Which Capability implements it?
 * 5. Which Executive Outcome improves?  — if any is unanswered, do not build.
 *
 * Commercial gate (LB-OS-PROD-010) — production readiness; complements admission gate:
 * 1. Executive judgment?  2. Sovereignty?  3. Institutional memory?
 * 4. Manufacturing of future LocalBrains?  5. Provider-independent?
 */

/** Permanent five-question admission gate for new capabilities (architecture) */
export const CAPABILITY_ADMISSION_QUESTIONS = [
  "Which Office owns it?",
  "Which Department executes it?",
  "Which Intelligence Domain supplies it?",
  "Which Capability implements it?",
  "Which Executive Outcome improves?",
] as const;

/** Commercial capability gate — production readiness (LB-OS-PROD-010). Complements admission gate. */
export const COMMERCIAL_CAPABILITY_GATE_QUESTIONS = [
  "Does it improve executive judgment?",
  "Does it preserve sovereignty?",
  "Does it strengthen institutional memory?",
  "Does it improve manufacturing of future LocalBrains?",
  "Does it remain provider-independent?",
] as const;

import {
  EXECUTIVE_CONNECTOR_GOVERNANCE,
  EXECUTIVE_MEDIA_GOVERNANCE,
  PERSONAL_VOICE_GOVERNANCE,
  PRIVACY_EXPOSURE_GOVERNANCE,
  SOVEREIGN_ENCRYPTION_POLICY,
  type CapabilityGovernancePolicy,
  type PersonalVoiceGovernancePolicy,
  type PrivacyExposureGovernancePolicy,
  type SovereignEncryptionPolicy,
} from "./capabilityGovernance.js";

export type { CapabilityGovernancePolicy } from "./capabilityGovernance.js";
export {
  EXECUTIVE_CONNECTOR_GOVERNANCE,
  EXECUTIVE_MEDIA_GOVERNANCE,
  PERSONAL_VOICE_GOVERNANCE,
  PRIVACY_EXPOSURE_GOVERNANCE,
  SOVEREIGN_ENCRYPTION_POLICY,
  PRIVACY_TIER_DEFINITIONS,
  SOVEREIGN_PRIVACY_CORE_RULE,
  SOVEREIGN_PRIVACY_OPERATIONAL_RULE,
} from "./capabilityGovernance.js";
export type {
  PersonalVoiceGovernancePolicy,
  PrivacyExposureGovernancePolicy,
  PrivacyTier,
  SovereignEncryptionPolicy,
} from "./capabilityGovernance.js";

export type CapabilityRelationType =
  | "supports"
  | "feeds"
  | "certifies"
  | "produces"
  | "enables"
  | "informs"
  | "related";

export type CapabilityCompletionStatus = "production" | "partial" | "stub" | "planned";

export type CapabilityAuthorityLevel = "authoritative" | "summary" | "supporting";

export type CapabilityNavPlacement =
  | "briefing"
  | "kernel"
  | "department"
  | "migration"
  | "settings"
  | "hidden"
  | "future";

export type CapabilityHealth = "healthy" | "degraded" | "stub";

/** How users may arrive at a capability — analytics + routing (LB-OS-026.6) */
export type CapabilityEntryVector =
  | "dashboard"
  | "executive_question"
  | "workflow"
  | "search"
  | "notification"
  | "recommendation"
  | "bookmark"
  | "api";

export const DEFAULT_CAPABILITY_ENTRY_VECTORS: CapabilityEntryVector[] = [
  "dashboard",
  "executive_question",
  "workflow",
  "search",
  "bookmark",
];

export const CAPABILITY_REGISTRY_ENGINE_ID = "ENG-CAP-001";

/** Future metric — null until utilization instrumentation ships */
export interface CapabilityUtilization {
  utilization_percent: number | null;
}

export interface CapabilityRelation {
  target_capability_id: string;
  relation_type: CapabilityRelationType;
  label?: string;
}

export interface CapabilityMaturity {
  completion_percent: number;
  health: CapabilityHealth;
  last_verified_slice: string;
  dependency_capability_ids: string[];
}

export interface CapabilityEntry {
  /** Permanent identity — frozen at LB-OS-026.6; never rename */
  capability_id: string;
  title: string;
  description: string;
  /** What this capability must accomplish for the executive */
  executive_outcome: string;
  executive_question_ids: string[];
  primary_route: string;
  secondary_routes: string[];
  prerequisites: string[];
  next_recommended_steps: string[];
  related_capabilities: CapabilityRelation[];
  departments: string[];
  workflows: string[];
  keywords: string[];
  search_terms: string[];
  authority_level: CapabilityAuthorityLevel;
  completion_status: CapabilityCompletionStatus;
  maturity: CapabilityMaturity;
  slice_id: string;
  nav_placement: CapabilityNavPlacement;
  nav_label?: string;
  nav_order?: number;
  entry_vectors: CapabilityEntryVector[];
  utilization: CapabilityUtilization;
  /** LB-OS-026.66 — reserved in atlas; not a live route */
  infrastructure_reserved?: boolean;
  governance_policy?: CapabilityGovernancePolicy;
  personal_voice_governance?: PersonalVoiceGovernancePolicy;
  privacy_exposure_governance?: PrivacyExposureGovernancePolicy;
  sovereign_encryption_policy?: SovereignEncryptionPolicy;
}

export interface WorkflowDefinition {
  workflow_id: string;
  title: string;
  description: string;
  /** Ordered capability_ids — defines forward journey */
  capability_ids: string[];
}

/** Migration execution pipeline — binding for journey tests */
export const WF_MIGRATION_EXECUTION: WorkflowDefinition = {
  workflow_id: "WF-MIG-001",
  title: "Migration Execution",
  description: "Architecture → survey → proof → planning → approval → cutover",
  capability_ids: [
    "CAP-EWA-001",
    "CAP-DLS-001",
    "CAP-PRF-001",
    "CAP-PLN-001",
    "CAP-APP-001",
    "CAP-CTO-001",
  ],
};

export const WF_MIGRATION_EVIDENCE: WorkflowDefinition = {
  workflow_id: "WF-MIG-002",
  title: "Migration Evidence",
  description: "Audit → consolidation → architecture",
  capability_ids: ["CAP-MIG-002", "CAP-CNS-001", "CAP-EWA-001"],
};

export const WF_FUTURE_COMMUNICATIONS: WorkflowDefinition = {
  workflow_id: "WF-FUT-COM-001",
  title: "Communications & Briefing Pipeline (planned)",
  description:
    "Google Accounts → Email + Calendar → Knowledge Sources → Briefing → CoS → Approval-gated actions",
  capability_ids: [
    "CAP-FUT-GAC-001",
    "CAP-FUT-GML-001",
    "CAP-FUT-CAL-001",
    "CAP-FUT-KNO-001",
    "CAP-FUT-INB-001",
    "CAP-EO-001",
    "CAP-ACT-001",
  ],
};

export const WF_FUTURE_FINANCE: WorkflowDefinition = {
  workflow_id: "WF-FUT-FIN-001",
  title: "CFO / Finance Pipeline (planned)",
  description: "Budgets → Finance knowledge → CFO → Briefing → Approval-gated recommendations",
  capability_ids: [
    "CAP-FUT-PBN-001",
    "CAP-FUT-NPB-001",
    "CAP-FUT-CFB-001",
    "CAP-FUT-BBN-001",
    "CAP-FUT-FKN-001",
    "CAP-FUT-CFO-001",
    "CAP-EO-001",
    "CAP-ACT-001",
  ],
};

export const WF_FUTURE_HOUSEHOLD: WorkflowDefinition = {
  workflow_id: "WF-FUT-HHD-001",
  title: "Household Operations (planned)",
  description: "Family operations → briefing → approvals",
  capability_ids: ["CAP-FUT-HHD-001", "CAP-EO-001", "CAP-ACT-001"],
};

export const WF_FUTURE_MEDIA: WorkflowDefinition = {
  workflow_id: "WF-FUT-MED-001",
  title: "Executive Digital World Monitor (planned)",
  description:
    "Sources → scan → Steve relevance filter → threat/opportunity score → briefing → Media tab → CoS recommendation",
  capability_ids: ["CAP-FUT-MED-001", "CAP-EO-001", "CAP-ACT-001"],
};

export const WF_FUTURE_PRIVACY: WorkflowDefinition = {
  workflow_id: "WF-FUT-PRV-001",
  title: "Sovereign Privacy & Exposure Control (planned)",
  description:
    "ENC vault → classify tier → local search → minimum packet → redact → route by tier → log disclosure",
  capability_ids: ["CAP-FUT-ENC-001", "CAP-FUT-PRV-001", "CAP-EO-001"],
};

export const WF_FUTURE_EXECUTIVE_COMMUNICATIONS: WorkflowDefinition = {
  workflow_id: "WF-FUT-ECD-001",
  title: "Executive Communications Department (planned)",
  description:
    "Contact → conversation → memory → relationship → CoS; provider-abstracted Google/Microsoft/IMAP/SMTP; approval-gated outbound via SendGrid/Twilio",
  capability_ids: [
    "CAP-FUT-ECD-001",
    "CAP-FUT-GAC-001",
    "CAP-FUT-GML-001",
    "CAP-FUT-CAL-001",
    "CAP-FUT-KNO-001",
    "CAP-EO-001",
    "CAP-ACT-001",
  ],
};

export const WORKFLOW_REGISTRY: WorkflowDefinition[] = [
  WF_MIGRATION_EXECUTION,
  WF_MIGRATION_EVIDENCE,
  WF_FUTURE_COMMUNICATIONS,
  WF_FUTURE_FINANCE,
  WF_FUTURE_HOUSEHOLD,
  WF_FUTURE_MEDIA,
  WF_FUTURE_PRIVACY,
  WF_FUTURE_EXECUTIVE_COMMUNICATIONS,
];

/** Frozen capability IDs — LB-OS-026.6 checkpoint */
export const CAPABILITY_ID_FREEZE_SLICE = "LB-OS-026.6";

const CAPABILITY_EXECUTIVE_OUTCOMES: Record<string, string> = {
  "CAP-EO-001":
    "Orient the executive on daily priorities, risks, and highest-leverage next actions.",
  "CAP-EPO-001":
    "Make build progress, platform readiness, and certification status legible at a glance.",
  "CAP-WS-001":
    "Surface project drift, focus, and momentum for each living workspace.",
  "CAP-KX-001": "Locate information across approved filesystem and workspace roots.",
  "CAP-ACT-001":
    "Queue approval-gated actions and preserve an auditable execution trail.",
  "CAP-SYS-001":
    "Report machine, storage, and operational health for daily executive decisions.",
  "CAP-AI-001":
    "Manage AI providers, credentials, routing, and flight-recorder observability.",
  "CAP-LRN-001":
    "Deliver on-the-job training tied to real build slices and platform growth.",
  "CAP-SET-001": "Configure safety policy, permissions, and executive preferences.",
  "CAP-PROD-001":
    "Onboard a new empty LocalBrain instance — owner, office profile, and product boundary before any ingestion.",
  "CAP-PROD-002":
    "Store and test provider credentials in an encrypted vault with connector readiness visibility.",
  "CAP-PROD-003":
    "Manage instance profile, package mode, and config export/import without secrets or personal data.",
  "CAP-MIG-001":
    "Frame the migration strategy, inventory gate, and lifecycle entry point.",
  "CAP-MIG-002":
    "Produce a confident filesystem mapping and inventory of the physical estate.",
  "CAP-CNS-001":
    "Quantify consolidation opportunity with evidence-backed executive intelligence.",
  "CAP-EWA-001":
    "Produce a logical workspace architecture and blueprint for the target estate.",
  "CAP-DLS-001":
    "Produce an accurate map of the physical digital estate, boundaries, and orphans.",
  "CAP-PRF-001":
    "Certify that a proposed migration is safe to plan and execute.",
  "CAP-PLN-001":
    "Produce an approved migration plan that is safe to execute.",
  "CAP-APP-001":
    "Obtain executive authorization before cutover execution.",
  "CAP-CTO-001":
    "Execute and verify an approved migration cutover with rollback guardrails.",
  "CAP-ENG-001":
    "Assess engineering workspace health, repo state, and delivery readiness.",
  "CAP-WRT-001": "Make the writing pipeline, sources, and draft path visible.",
  "CAP-DAT-001": "Expose data source gaps, catalog coverage, and query readiness.",
  "CAP-REL-001":
    "Highlight relationships and engagements that need executive attention.",
};

function cap(
  partial: Omit<
    CapabilityEntry,
    "related_capabilities" | "executive_outcome" | "entry_vectors" | "utilization"
  > & {
    related_capabilities?: CapabilityRelation[];
    executive_outcome?: string;
    entry_vectors?: CapabilityEntryVector[];
    utilization?: CapabilityUtilization;
    infrastructure_reserved?: boolean;
    governance_policy?: CapabilityGovernancePolicy;
  },
): CapabilityEntry {
  const executive_outcome =
    partial.executive_outcome ?? CAPABILITY_EXECUTIVE_OUTCOMES[partial.capability_id];
  if (!executive_outcome) {
    throw new Error(`ENG-CAP-001: missing executive_outcome for ${partial.capability_id}`);
  }
  return {
    related_capabilities: [],
    ...partial,
    executive_outcome,
    entry_vectors: partial.entry_vectors ?? DEFAULT_CAPABILITY_ENTRY_VECTORS,
    utilization: partial.utilization ?? { utilization_percent: null },
  };
}

function futureCap(
  partial: Omit<
    CapabilityEntry,
    | "related_capabilities"
    | "executive_outcome"
    | "entry_vectors"
    | "utilization"
    | "completion_status"
    | "infrastructure_reserved"
    | "maturity"
  > & {
    related_capabilities?: CapabilityRelation[];
    executive_outcome: string;
    governance_policy?: CapabilityGovernancePolicy;
    maturity?: CapabilityMaturity;
  },
): CapabilityEntry {
  return cap({
    ...partial,
    completion_status: "planned",
    infrastructure_reserved: true,
    entry_vectors: [],
    utilization: { utilization_percent: null },
    maturity: partial.maturity ?? {
      completion_percent: 0,
      health: "stub",
      last_verified_slice: "LB-OS-026.66",
      dependency_capability_ids: partial.prerequisites,
    },
  });
}

const FUTURE_EXECUTIVE_CAPABILITIES: CapabilityEntry[] = [
  futureCap({
    capability_id: "CAP-FUT-GAC-001",
    title: "Google Accounts & Calendar Intelligence",
    description: "Connect multiple Google accounts for read-first executive intelligence",
    executive_outcome: "Unify Google identities into governed, read-first knowledge sources.",
    executive_question_ids: [],
    primary_route: "/future/google-accounts",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-FUT-GML-001", "CAP-FUT-CAL-001"],
    departments: ["Chief of Staff", "Communications"],
    workflows: ["WF-FUT-COM-001"],
    keywords: ["google", "accounts"],
    search_terms: ["google accounts", "multiple google accounts"],
    authority_level: "supporting",
    slice_id: "LB-OS-090+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
    related_capabilities: [
      { target_capability_id: "CAP-FUT-GML-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-CAL-001", relation_type: "feeds" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-GML-001",
    title: "Gmail / Email Command Center",
    description: "Read-first Gmail monitoring, triage, and draft recommendations",
    executive_outcome: "Surface email intelligence without sending on the executive's behalf.",
    executive_question_ids: [],
    primary_route: "/future/gmail",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-GAC-001"],
    next_recommended_steps: ["CAP-FUT-KNO-001", "CAP-FUT-INB-001"],
    departments: ["Communications"],
    workflows: ["WF-FUT-COM-001"],
    keywords: ["gmail", "email"],
    search_terms: ["gmail monitoring", "email command center"],
    authority_level: "supporting",
    slice_id: "LB-OS-091+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-CAL-001",
    title: "Calendar Intelligence",
    description: "Read-first calendar analysis and scheduling recommendations",
    executive_outcome: "Recommend calendar changes — never apply them automatically.",
    executive_question_ids: [],
    primary_route: "/future/calendar",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-GAC-001"],
    next_recommended_steps: ["CAP-FUT-KNO-001"],
    departments: ["Chief of Staff"],
    workflows: ["WF-FUT-COM-001"],
    keywords: ["calendar"],
    search_terms: ["calendar intelligence"],
    authority_level: "supporting",
    slice_id: "LB-OS-092+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-KNO-001",
    title: "Communications Knowledge Sources",
    description: "Knowledge layer from email and calendar connectors",
    executive_outcome: "Feed governed communications evidence into executive briefing.",
    executive_question_ids: ["EQ-004"],
    primary_route: "/future/communications-knowledge",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-GML-001", "CAP-FUT-CAL-001"],
    next_recommended_steps: ["CAP-FUT-INB-001", "CAP-EO-001"],
    departments: ["Knowledge Explorer"],
    workflows: ["WF-FUT-COM-001"],
    keywords: ["knowledge", "communications"],
    search_terms: ["communications knowledge"],
    authority_level: "supporting",
    slice_id: "LB-OS-093+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-INB-001",
    title: "Executive Assistant Briefing Inbox",
    description: "Curated inbox of items deserving executive attention",
    executive_outcome: "Deliver restraint-aware briefing inbox items only when they matter.",
    executive_question_ids: ["EQ-001"],
    primary_route: "/future/briefing-inbox",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-KNO-001"],
    next_recommended_steps: ["CAP-EO-001", "CAP-ACT-001"],
    departments: ["Chief of Staff"],
    workflows: ["WF-FUT-COM-001"],
    keywords: ["briefing inbox"],
    search_terms: ["executive briefing inbox"],
    authority_level: "supporting",
    slice_id: "LB-OS-094+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-CFO-001",
    title: "CFO / Finance Department",
    description: "CFO intelligence across personal, nonprofit, campaign, and business budgets",
    executive_outcome: "Provide CFO-grade financial intelligence and approval-gated recommendations.",
    executive_question_ids: [],
    primary_route: "/future/cfo",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-FKN-001"],
    next_recommended_steps: ["CAP-EO-001", "CAP-ACT-001"],
    departments: ["Accounting & CFO"],
    workflows: ["WF-FUT-FIN-001"],
    keywords: ["cfo", "finance"],
    search_terms: ["cfo intelligence"],
    authority_level: "supporting",
    slice_id: "LB-OS-101+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-PBN-001",
    title: "Personal Finance & Budget",
    description: "Personal budget intelligence",
    executive_outcome: "Make personal financial position legible for executive decisions.",
    executive_question_ids: [],
    primary_route: "/future/finance/personal",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-FUT-FKN-001"],
    departments: ["Accounting & CFO"],
    workflows: ["WF-FUT-FIN-001"],
    keywords: ["personal finance"],
    search_terms: ["personal budget"],
    authority_level: "supporting",
    slice_id: "LB-OS-101+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-NPB-001",
    title: "Nonprofit Finance & Budget",
    description: "Nonprofit budget and grant-aware intelligence",
    executive_outcome: "Surface nonprofit financial health and constraint-aware recommendations.",
    executive_question_ids: [],
    primary_route: "/future/finance/nonprofit",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-FUT-FKN-001"],
    departments: ["Accounting & CFO"],
    workflows: ["WF-FUT-FIN-001"],
    keywords: ["nonprofit finance"],
    search_terms: ["nonprofit budget"],
    authority_level: "supporting",
    slice_id: "LB-OS-101+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-CFB-001",
    title: "Campaign Finance & Budget",
    description: "Campaign budget and compliance-aware monitoring",
    executive_outcome: "Make campaign financial position legible for strategic decisions.",
    executive_question_ids: [],
    primary_route: "/future/finance/campaign",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-FUT-FKN-001"],
    departments: ["Accounting & CFO"],
    workflows: ["WF-FUT-FIN-001"],
    keywords: ["campaign finance"],
    search_terms: ["campaign budget"],
    authority_level: "supporting",
    slice_id: "LB-OS-101+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-BBN-001",
    title: "Business Budget",
    description: "Business entity budget intelligence",
    executive_outcome: "Provide business budget visibility for allocation decisions.",
    executive_question_ids: [],
    primary_route: "/future/finance/business",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-FUT-FKN-001"],
    departments: ["Accounting & CFO"],
    workflows: ["WF-FUT-FIN-001"],
    keywords: ["business budget"],
    search_terms: ["business finance"],
    authority_level: "supporting",
    slice_id: "LB-OS-101+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-FKN-001",
    title: "Finance Knowledge Sources",
    description: "Finance knowledge layer feeding CFO intelligence",
    executive_outcome: "Normalize budget signals into governed finance knowledge.",
    executive_question_ids: [],
    primary_route: "/future/finance/knowledge",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-PBN-001", "CAP-FUT-NPB-001", "CAP-FUT-CFB-001", "CAP-FUT-BBN-001"],
    next_recommended_steps: ["CAP-FUT-CFO-001"],
    departments: ["Accounting & CFO"],
    workflows: ["WF-FUT-FIN-001"],
    keywords: ["finance knowledge"],
    search_terms: ["finance knowledge sources"],
    authority_level: "supporting",
    slice_id: "LB-OS-101+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-HHD-001",
    title: "Household / Family Operations",
    description: "Family logistics and household executive coordination",
    executive_outcome: "Coordinate household operations into briefing without autonomous action.",
    executive_question_ids: [],
    primary_route: "/future/household",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-EO-001", "CAP-ACT-001"],
    departments: ["Household"],
    workflows: ["WF-FUT-HHD-001"],
    keywords: ["household", "family"],
    search_terms: ["household operations"],
    authority_level: "supporting",
    slice_id: "LB-OS-095+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-ECD-001",
    title: "Executive Communications Department",
    description:
      "First production department post–Memory OS — contacts, organizations, relationships, email, SMS, voice, meetings, notes, follow-ups, network graph; not a contact manager module",
    executive_outcome:
      "CoS reasons across relationship cadence and mission impact — e.g. unusual silence from a key contact, not unread email counts.",
    executive_question_ids: [],
    primary_route: "/future/communications",
    secondary_routes: [],
    prerequisites: ["CAP-EO-001", "CAP-FUT-PRV-001"],
    next_recommended_steps: ["CAP-FUT-GAC-001", "CAP-FUT-GML-001", "CAP-EO-001"],
    departments: ["Chief of Staff", "Communications"],
    workflows: ["WF-FUT-ECD-001"],
    keywords: [
      "communications department",
      "contacts",
      "relationships",
      "email",
      "sms",
      "voice",
      "meetings",
      "network graph",
    ],
    search_terms: [
      "executive communications",
      "relationship cadence",
      "contact manager",
      "communications stack",
    ],
    authority_level: "supporting",
    slice_id: "LB-OS-091+",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
    related_capabilities: [
      { target_capability_id: "CAP-FUT-GAC-001", relation_type: "enables" },
      { target_capability_id: "CAP-FUT-PRV-001", relation_type: "feeds", label: "Data sovereignty" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-VOI-001",
    title: "Executive Voice Interface",
    description:
      "Voice-to-text and text-to-voice for the Executive Office — wake or push-to-talk",
    executive_outcome:
      "Structured voice path: transcript → intent → Executive Question → capability → Chief of Staff response → optional spoken answer → approval-gated action.",
    executive_question_ids: [],
    primary_route: "/future/voice",
    secondary_routes: [],
    prerequisites: ["CAP-EO-001"],
    next_recommended_steps: ["CAP-EO-001", "CAP-ACT-001"],
    departments: ["Chief of Staff"],
    workflows: [],
    keywords: ["voice", "speech", "push-to-talk", "wake word"],
    search_terms: ["executive voice interface", "voice input", "spoken briefing"],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-VOI",
    nav_placement: "future",
    governance_policy: EXECUTIVE_CONNECTOR_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-MED-001",
    title: "Executive Digital World Monitor",
    description:
      "Media intelligence: local/national/global news, RSS and trusted feeds, AI development watch, reputation and competitive monitoring, digital risk alerts",
    executive_outcome:
      "Governed interface to the digital world — scan sources, filter by Steve relevance, score threats and opportunities, surface in Media tab with CoS recommendations.",
    executive_question_ids: [],
    primary_route: "/future/media",
    secondary_routes: ["/future/media-monitor"],
    prerequisites: ["CAP-EO-001", "CAP-FUT-PRV-001"],
    next_recommended_steps: ["CAP-EO-001", "CAP-ACT-001"],
    departments: ["Chief of Staff", "Communications"],
    workflows: ["WF-FUT-MED-001"],
    keywords: [
      "media",
      "news",
      "rss",
      "reputation",
      "competitive",
      "ai watch",
      "digital risk",
      "headlines",
    ],
    search_terms: [
      "media intelligence",
      "news monitor",
      "reputation monitoring",
      "competitive threat",
      "ai developments",
    ],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-DWM",
    nav_placement: "future",
    governance_policy: EXECUTIVE_MEDIA_GOVERNANCE,
    related_capabilities: [
      { target_capability_id: "CAP-FUT-PRV-001", relation_type: "feeds", label: "Privacy posture" },
      { target_capability_id: "CAP-EO-001", relation_type: "feeds" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-PVO-001",
    title: "Personal Voice Interface",
    description:
      "Steve-approved voice cloning — local-first storage, synthetic indicator, approval before outbound audio",
    executive_outcome:
      "Personal synthetic voice only with explicit consent; never impersonate without indicator; outbound voice requires approval.",
    executive_question_ids: [],
    primary_route: "/future/personal-voice",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-VOI-001", "CAP-EO-001"],
    next_recommended_steps: ["CAP-EO-001", "CAP-ACT-001"],
    departments: ["Chief of Staff"],
    workflows: [],
    keywords: ["voice clone", "personal voice", "synthetic voice", "tts"],
    search_terms: ["personal voice interface", "voice cloning", "synthetic speech"],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-PVI",
    nav_placement: "future",
    personal_voice_governance: PERSONAL_VOICE_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-ENC-001",
    title: "Encryption, Key Vault, and Sovereign Routing",
    description:
      "LocalBrain Privacy Core — encryption at rest, encrypted DB fields, file vault, credential vault, per-workspace keys, encrypted backups",
    executive_outcome:
      "All executive data and keys are encrypted by default; sovereign storage gates every connector and provider integration.",
    executive_question_ids: [],
    primary_route: "/future/privacy-core",
    secondary_routes: ["/future/vault"],
    prerequisites: ["CAP-EO-001"],
    next_recommended_steps: ["CAP-FUT-PRV-001"],
    departments: ["Chief of Staff", "Migration"],
    workflows: ["WF-FUT-PRV-001"],
    keywords: [
      "encryption",
      "key vault",
      "credential vault",
      "encryption at rest",
      "workspace keys",
      "encrypted backup",
    ],
    search_terms: [
      "sovereign encryption",
      "privacy core",
      "encrypted vault",
      "per-workspace encryption",
    ],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-ENC",
    nav_placement: "future",
    sovereign_encryption_policy: SOVEREIGN_ENCRYPTION_POLICY,
    related_capabilities: [
      { target_capability_id: "CAP-FUT-PRV-001", relation_type: "enables" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-PRV-001",
    title: "Data Sovereignty & Exposure Control",
    description:
      "AI disclosure ledger, sensitive-context classifier, redaction before provider calls, routing by privacy tier, local-first model routing, audit log of every external disclosure",
    executive_outcome:
      "LocalBrain never sends whole-world context externally — external AI sees only the smallest approved packet, fully logged.",
    executive_question_ids: [],
    primary_route: "/future/privacy",
    secondary_routes: [],
    prerequisites: ["CAP-EO-001", "CAP-FUT-ENC-001"],
    next_recommended_steps: ["CAP-FUT-MED-001", "CAP-FUT-GAC-001", "CAP-FUT-ECD-001"],
    departments: ["Chief of Staff", "Migration"],
    workflows: ["WF-FUT-PRV-001"],
    keywords: [
      "privacy",
      "data sovereignty",
      "disclosure ledger",
      "redaction",
      "local-first",
      "identity masking",
      "privacy tier",
    ],
    search_terms: [
      "digital privacy",
      "external exposure control",
      "ai disclosure",
      "minimum packet",
    ],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-DPEC",
    nav_placement: "future",
    privacy_exposure_governance: PRIVACY_EXPOSURE_GOVERNANCE,
    related_capabilities: [
      { target_capability_id: "CAP-FUT-ENC-001", relation_type: "feeds" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-SOVDASH-001",
    title: "Sovereignty Dashboard",
    description:
      "Executive-visible privacy status — encryption, tier leaks, external AI calls, data sent, identity exposure, approval violations",
    executive_outcome:
      "CoS gives Steve confidence in sovereignty daily — rules are visible, not hidden diagnostics.",
    executive_question_ids: [],
    primary_route: "/future/sovereignty",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-ENC-001", "CAP-FUT-PRV-001", "CAP-EO-001"],
    next_recommended_steps: ["CAP-EO-001"],
    departments: ["Chief of Staff"],
    workflows: ["WF-FUT-PRV-001"],
    keywords: ["sovereignty", "privacy status", "disclosure", "tier leaks"],
    search_terms: ["sovereignty dashboard", "privacy status", "external ai calls today"],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-SOVDASH",
    nav_placement: "future",
    privacy_exposure_governance: PRIVACY_EXPOSURE_GOVERNANCE,
  }),
  futureCap({
    capability_id: "CAP-FUT-TRUST-001",
    title: "Department Trust Score",
    description:
      "Operational trust per department — knowledge freshness, provider health, latency, coverage, confidence",
    executive_outcome:
      "Steve sees which departments are operationally reliable — not reputation, but execution trust.",
    executive_question_ids: [],
    primary_route: "/future/trust",
    secondary_routes: [],
    prerequisites: ["CAP-EO-001"],
    next_recommended_steps: ["CAP-FUT-DEPTMAT-001"],
    departments: ["Chief of Staff"],
    workflows: [],
    keywords: ["trust score", "department health", "operational trust"],
    search_terms: ["department trust", "provider health", "knowledge freshness"],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-TRUST",
    nav_placement: "future",
  }),
  futureCap({
    capability_id: "CAP-FUT-MEMLED-001",
    title: "Executive Memory Ledger",
    description:
      "Memory ledger — created, promoted, knowledge/understanding/wisdom, beliefs revised, recommendations accepted/rejected",
    executive_outcome:
      "Track how executive memory compounds over years — not an audit log, a cognition ledger.",
    executive_question_ids: [],
    primary_route: "/future/memory-ledger",
    secondary_routes: [],
    prerequisites: ["CAP-EO-001"],
    next_recommended_steps: ["CAP-FUT-INSTMEM-001"],
    departments: ["Chief of Staff", "Knowledge Explorer"],
    workflows: [],
    keywords: ["memory ledger", "memories", "promoted", "beliefs"],
    search_terms: ["executive memory ledger", "memories created today"],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-MEMLED",
    nav_placement: "future",
  }),
  futureCap({
    capability_id: "CAP-FUT-EXCAP-001",
    title: "Executive Capital Dashboard",
    description:
      "Knowledge, relationship, political, campaign, financial, reputation, attention, time, and trust capital",
    executive_outcome:
      "Make long-term organizational assets legible — executive capital, not raw data volume.",
    executive_question_ids: [],
    primary_route: "/future/executive-capital",
    secondary_routes: [],
    prerequisites: ["CAP-EO-001"],
    next_recommended_steps: ["CAP-FUT-MEMLED-001"],
    departments: ["Chief of Staff"],
    workflows: [],
    keywords: ["executive capital", "relationship capital", "attention capital"],
    search_terms: ["executive capital dashboard", "trust capital", "political capital"],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-EXCAP",
    nav_placement: "future",
  }),
  futureCap({
    capability_id: "CAP-FUT-DEPTMAT-001",
    title: "Department Maturity",
    description: "Independent maturity level per executive department — organic evolution",
    executive_outcome:
      "Departments mature at different rates; Steve sees who is Level 7 vs Reserved without forced uniformity.",
    executive_question_ids: [],
    primary_route: "/future/department-maturity",
    secondary_routes: [],
    prerequisites: ["CAP-EO-001"],
    next_recommended_steps: ["CAP-FUT-TRUST-001"],
    departments: ["Chief of Staff"],
    workflows: [],
    keywords: ["department maturity", "level", "evolution"],
    search_terms: ["department maturity level", "chief of staff level"],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-DEPTMAT",
    nav_placement: "future",
  }),
  futureCap({
    capability_id: "CAP-FUT-INSTMEM-001",
    title: "Institutional Memory",
    description:
      "Why we decided — options, assumptions, tradeoffs, agreement, outcomes, whether decisions aged well",
    executive_outcome:
      "Answer 'why did we choose SendGrid over Mailgun?' years later — organizational memory, not static docs.",
    executive_question_ids: [],
    primary_route: "/future/institutional-memory",
    secondary_routes: [],
    prerequisites: ["CAP-EO-001"],
    next_recommended_steps: ["CAP-FUT-DECEVO-001"],
    departments: ["Chief of Staff", "Knowledge Explorer"],
    workflows: [],
    keywords: ["institutional memory", "why we decided", "decision rationale"],
    search_terms: ["why did we decide", "institutional memory", "decision history"],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-INSTMEM",
    nav_placement: "future",
  }),
  futureCap({
    capability_id: "CAP-FUT-DECEVO-001",
    title: "Decision Evolution",
    description:
      "Living decision objects — created, discussed, alternatives, chosen, implemented, outcome, lessons, superseded",
    executive_outcome:
      "Major decisions accumulate history instead of rotting in notes — decisions as evolving institutional objects.",
    executive_question_ids: [],
    primary_route: "/future/decisions",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-INSTMEM-001"],
    next_recommended_steps: ["CAP-EO-001", "CAP-ACT-001"],
    departments: ["Chief of Staff"],
    workflows: [],
    keywords: ["decision evolution", "alternatives", "lessons", "superseded"],
    search_terms: ["decision evolution", "living decision", "decision outcome"],
    authority_level: "supporting",
    slice_id: "LB-OS-03X-DECEVO",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-INSTMEM-001", relation_type: "feeds" },
      { target_capability_id: "CAP-ACT-001", relation_type: "related" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-EEM-001",
    title: "Executive Engineering Memory",
    description:
      "Engineering judgment with provenance — architecture decisions, coding standards, rejected approaches, performance and security lessons, deployment history, technical debt, bug patterns, release outcomes. Pre-slice gate: executive outcome, owning office, affected departments, existing capabilities, relevant memories/decisions, workflows, governance, privacy tier, connectors, acceptance criteria — then engineering slices.",
    executive_outcome:
      "Primary product is engineering judgment, not code. Accumulate why approaches succeeded or failed so the Technology Office knows what held up over years.",
    executive_question_ids: [],
    primary_route: "/future/engineering-memory",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-INSTMEM-001", "CAP-FUT-DECEVO-001", "CAP-ENG-001"],
    next_recommended_steps: ["CAP-EO-001"],
    departments: ["Chief of Staff", "Engineering"],
    workflows: [],
    keywords: [
      "engineering memory",
      "technical debt",
      "architecture decisions",
      "engineering judgment",
      "release outcomes",
    ],
    search_terms: [
      "executive engineering memory",
      "why we tried this approach",
      "engineering provenance",
    ],
    authority_level: "supporting",
    slice_id: "LB-OS-TECH-EEM",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-ENG-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-INSTMEM-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-DECEVO-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-PRV-001", relation_type: "feeds", label: "Privacy tier gate" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-MBS-001",
    title: "Multi-Brain Workspace Sharing",
    description:
      "Steve · Kelly · Chris · Campaign workspace — each brain owns private memory; shared workspace owns project objects; passport handshake · approved sync only — never one giant shared database",
    executive_outcome:
      "Multi-brain collaboration without private memory leakage — workspace objects sync with passport trust, not whole-brain dumps.",
    executive_question_ids: [],
    primary_route: "/future/multi-brain-sharing",
    secondary_routes: [],
    prerequisites: [
      "CAP-PROD-003",
      "CAP-FUT-PRV-001",
      "CAP-FUT-ENC-001",
      "CAP-FUT-IDT-001",
      "CAP-FUT-EIA-001",
      "CAP-FUT-PSP-001",
    ],
    next_recommended_steps: ["CAP-FUT-UDI-001"],
    departments: ["Chief of Staff"],
    workflows: [],
    keywords: ["multi-brain", "spoke", "workspace sharing", "cos packets", "campaign workspace"],
    search_terms: ["multi brain sharing", "localbrain to localbrain", "shared workspace sync"],
    authority_level: "supporting",
    slice_id: "LB-OS-027.1",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-PSP-001", relation_type: "feeds", label: "Passport handshake" },
      { target_capability_id: "CAP-FUT-IDT-001", relation_type: "feeds", label: "Distinct identities" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-UDI-001",
    title: "Universal Digital Ingestion",
    description:
      "Ingest from Google Drive, ChatGPT export, email, Google Calendar, local filesystem — map digital estate into LocalBrain after empty brain ships",
    executive_outcome:
      "Every piece of digital information for the user is discoverable, mapped, and governed — without contaminating the sellable empty brain package.",
    executive_question_ids: [],
    primary_route: "/future/digital-ingestion",
    secondary_routes: [],
    prerequisites: [
      "CAP-PROD-001",
      "CAP-PROD-002",
      "CAP-FUT-LIC-001",
      "CAP-FUT-ING-001",
      "CAP-FUT-ENC-001",
      "CAP-FUT-PRV-001",
    ],
    next_recommended_steps: ["CAP-FUT-MED-001"],
    departments: ["Chief of Staff", "Knowledge Explorer"],
    workflows: [],
    keywords: ["ingestion", "google drive", "chatgpt export", "email", "calendar", "filesystem"],
    search_terms: ["upload memory", "digital ingestion", "import chatgpt", "google drive sync"],
    authority_level: "supporting",
    slice_id: "LB-OS-028+",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-GAC-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-GML-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-MED-001", relation_type: "related", label: "Reputation monitor" },
      { target_capability_id: "CAP-FUT-ING-001", relation_type: "feeds", label: "Ingestion planner" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-LIC-001",
    title: "License & Subscription Gate",
    description:
      "Signed license records bound to Executive Identity (not hardware) · expired = view/export only · AI, outbound comms, sync, and new ingestion disabled · no data deletion",
    executive_outcome:
      "Sellable LocalBrain instances enforce subscription posture without destroying user data — export and read always available locally.",
    executive_question_ids: [],
    primary_route: "/future/license",
    secondary_routes: [],
    prerequisites: ["CAP-PROD-003", "CAP-FUT-ENC-001", "CAP-FUT-IDT-001"],
    next_recommended_steps: ["CAP-FUT-ING-001"],
    departments: ["Kernel"],
    workflows: [],
    keywords: ["license", "subscription", "entitlement", "expired", "lifetime"],
    search_terms: ["license expired", "subscription gate", "localbrain license"],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-002",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-PROD-003", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-IDT-001", relation_type: "feeds", label: "Identity states" },
      { target_capability_id: "CAP-FUT-EIA-001", relation_type: "feeds", label: "Identity-bound license" },
      { target_capability_id: "CAP-AI-001", relation_type: "related", label: "AI gate" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-SMC-001",
    title: "Social Media Connector Registry",
    description:
      "Facebook Pages · Instagram · YouTube · TikTok · X · LinkedIn · BlueSky · Threads · Google Business · campaign and business pages — ENC → DPEC → connector",
    executive_outcome:
      "Communications and Media Office govern social presence through approved connectors — never whole-account dumps or rule evasion.",
    executive_question_ids: [],
    primary_route: "/future/social-connectors",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-LIC-001", "CAP-FUT-ENC-001", "CAP-FUT-PRV-001", "CAP-FUT-ECD-001"],
    next_recommended_steps: ["CAP-FUT-MST-001"],
    departments: ["Communications", "Chief of Staff"],
    workflows: [],
    keywords: [
      "social media",
      "facebook",
      "instagram",
      "youtube",
      "tiktok",
      "linkedin",
      "bluesky",
      "threads",
    ],
    search_terms: ["social connectors", "facebook pages", "instagram connector"],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-003",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-MST-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-PRV-001", relation_type: "feeds", label: "DPEC" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-MST-001",
    title: "Media Studio / Creative Workbench",
    description:
      "Images · video · captions · clips · brand kits · plain-language editing · deployment checklist · approval before posting",
    executive_outcome:
      "Executive media production with brand governance and CoS approval before anything goes outbound.",
    executive_question_ids: [],
    primary_route: "/future/media-studio",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-SMC-001", "CAP-FUT-LIC-001", "CAP-FUT-PRV-001"],
    next_recommended_steps: ["CAP-FUT-ECD-001"],
    departments: ["Communications", "Chief of Staff"],
    workflows: [],
    keywords: ["media studio", "creative workbench", "brand kit", "video", "captions", "approval"],
    search_terms: ["media studio", "creative workbench", "approval before posting"],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-004",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-SMC-001", relation_type: "feeds" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-ING-001",
    title: "Universal Device + Drive Ingestion Planner",
    description:
      "Plan local drive scan · Google Drive · Gmail · Calendar · Contacts · mobile import — after empty brain and license gate; execution via CAP-FUT-UDI-001 post–Memory OS",
    executive_outcome:
      "Map every digital surface the user owns before Memory OS builds person-specific structure — without contaminating the sellable empty brain package.",
    executive_question_ids: [],
    primary_route: "/future/ingestion-planner",
    secondary_routes: [],
    prerequisites: [
      "CAP-PROD-001",
      "CAP-PROD-002",
      "CAP-FUT-LIC-001",
      "CAP-FUT-IDT-001",
      "CAP-FUT-ENC-001",
      "CAP-FUT-PRV-001",
    ],
    next_recommended_steps: ["CAP-FUT-UDI-001"],
    departments: ["Chief of Staff", "Knowledge Explorer"],
    workflows: [],
    keywords: [
      "ingestion planner",
      "google drive",
      "gmail",
      "calendar",
      "contacts",
      "mobile import",
      "local drive",
    ],
    search_terms: ["ingestion planner", "import google drive", "mobile import localbrain"],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-005",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-UDI-001", relation_type: "enables" },
      { target_capability_id: "CAP-FUT-MOB-001", relation_type: "related" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-MOB-001",
    title: "Mobile / Tablet Access Shell",
    description:
      "Local web app / PWA served from user's LocalBrain host — LAN first · remote via VPN later · privacy and controlled disclosure not infrastructure evasion",
    executive_outcome:
      "Executive access from phone or tablet to their own LocalBrain without cloud dependency or platform-rule bypass.",
    executive_question_ids: [],
    primary_route: "/future/mobile-access",
    secondary_routes: [],
    prerequisites: ["CAP-PROD-001", "CAP-FUT-LIC-001", "CAP-FUT-ENC-001", "CAP-FUT-IDT-001"],
    next_recommended_steps: ["CAP-FUT-ING-001"],
    departments: ["Kernel", "Chief of Staff"],
    workflows: [],
    keywords: ["mobile", "tablet", "pwa", "ipad", "lan", "vpn"],
    search_terms: ["localbrain mobile", "ipad access", "pwa localbrain"],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-006",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-ING-001", relation_type: "related", label: "Mobile import" },
      { target_capability_id: "CAP-FUT-IDT-001", relation_type: "feeds", label: "Device sessions" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-IDT-001",
    title: "Instance Identity, Transfer, and Single-Primary Enforcement",
    description:
      "One identity = one ACTIVE_PRIMARY · device/session registry · encrypted transfer bundle · READ_ONLY_ARCHIVE old server · activation challenge · transfer audit — not two independent primaries for same person",
    executive_outcome:
      "Licensing, memory integrity, and sovereignty hold: Steve/Kelly/Chris each run one primary server with many client devices — never duplicate active primaries.",
    executive_question_ids: [],
    primary_route: "/future/instance-identity",
    secondary_routes: [],
    prerequisites: ["CAP-PROD-001", "CAP-PROD-003", "CAP-FUT-LIC-001", "CAP-FUT-ENC-001"],
    next_recommended_steps: ["CAP-FUT-EIA-001", "CAP-FUT-MOB-001", "CAP-FUT-ING-001"],
    departments: ["Kernel", "Chief of Staff"],
    workflows: [],
    keywords: [
      "instance identity",
      "single primary",
      "one authority",
      "transfer",
      "device registration",
      "session",
      "ACTIVE_PRIMARY",
    ],
    search_terms: [
      "transfer localbrain server",
      "single primary instance",
      "device registration localbrain",
    ],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-007",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-LIC-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-EIA-001", relation_type: "enables", label: "Authority layer" },
      { target_capability_id: "CAP-FUT-MOB-001", relation_type: "enables" },
      { target_capability_id: "CAP-FUT-MBS-001", relation_type: "related", label: "Distinct identities only" },
      { target_capability_id: "CAP-PROD-003", relation_type: "feeds" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-EIA-001",
    title: "Executive Identity Authority",
    description:
      "One authoritative identity — identity certificates · authority election · transfer/recovery authority · automatic encrypted snapshots (inactive insurance) · cryptographic signing root · license binds to identity not hardware",
    executive_outcome:
      "Enterprise-grade reliability: one authority per identity, disaster recovery without divergence, and hardware replacement without license pain.",
    executive_question_ids: [],
    primary_route: "/future/executive-authority",
    secondary_routes: [],
    prerequisites: ["CAP-PROD-001", "CAP-PROD-003", "CAP-FUT-IDT-001", "CAP-FUT-LIC-001", "CAP-FUT-ENC-001"],
    next_recommended_steps: ["CAP-FUT-PSP-001", "CAP-FUT-MBS-001"],
    departments: ["Kernel", "Chief of Staff"],
    workflows: [],
    keywords: [
      "executive authority",
      "identity certificate",
      "disaster recovery",
      "encrypted snapshot",
      "signing root",
      "authority election",
    ],
    search_terms: [
      "executive identity authority",
      "disaster recovery localbrain",
      "encrypted brain backup",
    ],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-008",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-IDT-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-LIC-001", relation_type: "feeds", label: "Identity-bound license" },
      { target_capability_id: "CAP-FUT-PSP-001", relation_type: "enables" },
      { target_capability_id: "CAP-FUT-ENC-001", relation_type: "feeds" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-PSP-001",
    title: "Executive Passport",
    description:
      "Inter-brain trust document — identity · public cert · capabilities · version · trust level · office structure · permissions · handshake → passport exchange → trust verification → workspace permissions → encrypted session",
    executive_outcome:
      "Scalable trust between LocalBrain identities without custom integration per connection — foundation for multi-brain workspace sync.",
    executive_question_ids: [],
    primary_route: "/future/executive-passport",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-EIA-001", "CAP-FUT-ENC-001", "CAP-FUT-PRV-001"],
    next_recommended_steps: ["CAP-FUT-MBS-001"],
    departments: ["Chief of Staff", "Kernel"],
    workflows: [],
    keywords: ["executive passport", "handshake", "trust verification", "inter-brain", "passport exchange"],
    search_terms: ["executive passport localbrain", "brain handshake", "trust between localbrains"],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-009",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-EIA-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-MBS-001", relation_type: "enables" },
      { target_capability_id: "CAP-FUT-PRV-001", relation_type: "feeds", label: "DPEC" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-FAC-001",
    title: "Executive LocalBrain Factory",
    description:
      "Manufacturing pipeline — source platform · package · provision · activate · personalize · operate · upgrade · transfer · retire · every brain born empty with structure only",
    executive_outcome:
      "Ship LocalBrains repeatedly — same empty sovereign platform for every customer, assembly line not one-off builds.",
    executive_question_ids: [],
    primary_route: "/future/localbrain-factory",
    secondary_routes: [],
    prerequisites: ["CAP-PROD-001", "CAP-PROD-003", "CAP-FUT-EIA-001", "CAP-FUT-PSP-001", "CAP-FUT-LIC-001"],
    next_recommended_steps: ["CAP-FUT-EDG-001", "CAP-FUT-CON-VER-001"],
    departments: ["Kernel", "Chief of Staff"],
    workflows: [],
    keywords: ["factory", "manufacturing", "empty brain", "package", "provision", "assembly line"],
    search_terms: ["localbrain factory", "empty brain installer", "manufacturing localbrains"],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-010",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-PROD-001", relation_type: "feeds" },
      { target_capability_id: "CAP-FUT-EDG-001", relation_type: "enables" },
      { target_capability_id: "CAP-FUT-EIA-001", relation_type: "feeds" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-EDG-001",
    title: "Executive Discovery",
    description:
      "Onboarding as institutional learning — who you are · organizations · roles · calendars · channels · financial entities · workspaces · which offices wake first — each answer activates departments",
    executive_outcome:
      "The brain learns who its executive is before any personal data enters — departments activate from discovery, not from seeded samples.",
    executive_question_ids: [],
    primary_route: "/settings/onboarding",
    secondary_routes: [],
    prerequisites: ["CAP-PROD-001", "CAP-FUT-FAC-001"],
    next_recommended_steps: ["CAP-FUT-OCON-001", "CAP-FUT-ING-001"],
    departments: ["Chief of Staff", "Kernel"],
    workflows: [],
    keywords: ["executive discovery", "onboarding", "department activation", "institutional learning"],
    search_terms: ["executive discovery", "who are you onboarding", "activate departments"],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-010",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-PROD-001", relation_type: "related", label: "Wizard shell today" },
      { target_capability_id: "CAP-FUT-FAC-001", relation_type: "feeds" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-OCON-001",
    title: "Office-Driven Connectors",
    description:
      "Connect Communications (not Gmail) — Office decides Gmail · Outlook · Exchange · SendGrid · Twilio · user never picks raw providers · same abstraction as AI routing",
    executive_outcome:
      "Executives connect Offices; departments choose governed connectors under ENC → DPEC — providers remain replaceable infrastructure.",
    executive_question_ids: [],
    primary_route: "/future/office-connectors",
    secondary_routes: ["/settings/providers"],
    prerequisites: ["CAP-FUT-ECD-001", "CAP-FUT-ENC-001", "CAP-FUT-PRV-001", "CAP-PROD-002"],
    next_recommended_steps: ["CAP-FUT-SMC-001"],
    departments: ["Communications", "Chief of Staff"],
    workflows: [],
    keywords: ["office connectors", "connect communications", "provider abstraction", "department connectors"],
    search_terms: ["connect communications office", "office driven connectors"],
    authority_level: "supporting",
    slice_id: "LB-OS-091+",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-ECD-001", relation_type: "feeds" },
      { target_capability_id: "CAP-PROD-002", relation_type: "related", label: "Provider vault" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-CON-VER-001",
    title: "Versioned Constitution Migration",
    description:
      "Constitution 2.1 → all brain instances → Constitution 2.2 via safe migration engine — Steve · Kelly · Chris · Campaign · Business brains upgrade without memory divergence",
    executive_outcome:
      "Commercially valuable safe upgrades — every installed LocalBrain migrates constitution versions without losing institutional judgment or sovereignty.",
    executive_question_ids: [],
    primary_route: "/future/constitution-migration",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-FAC-001", "CAP-FUT-EIA-001"],
    next_recommended_steps: ["CAP-FUT-FAC-001"],
    departments: ["Chief of Staff", "Kernel"],
    workflows: [],
    keywords: ["constitution version", "migration engine", "doctrine upgrade", "LB-OS-CON-003"],
    search_terms: ["constitution migration", "upgrade localbrain constitution"],
    authority_level: "supporting",
    slice_id: "LB-OS-CON-003",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-FAC-001", relation_type: "feeds" },
    ],
  }),
  futureCap({
    capability_id: "CAP-FUT-CCO-001",
    title: "Chief Compliance Officer",
    description:
      "Campaign finance · nonprofit reporting · business filings · document retention · privacy · licensing · records policies — compliance packs per LocalBrain instance",
    executive_outcome:
      "Each executive institution governs its compliance domain — campaign, nonprofit, or business packs — without one-size-fits-all legal tooling.",
    executive_question_ids: [],
    primary_route: "/future/chief-compliance-officer",
    secondary_routes: [],
    prerequisites: ["CAP-FUT-LIC-001", "CAP-FUT-FAC-001", "CAP-FUT-PRV-001"],
    next_recommended_steps: [],
    departments: ["Legal", "Chief of Staff"],
    workflows: [],
    keywords: [
      "chief compliance officer",
      "campaign finance",
      "nonprofit reporting",
      "document retention",
      "compliance pack",
    ],
    search_terms: ["chief compliance officer localbrain", "campaign finance compliance", "compliance pack"],
    authority_level: "supporting",
    slice_id: "LB-OS-PROD-011",
    nav_placement: "future",
    related_capabilities: [
      { target_capability_id: "CAP-FUT-LIC-001", relation_type: "feeds", label: "Licensing" },
      { target_capability_id: "CAP-FUT-PRV-001", relation_type: "feeds", label: "Privacy" },
    ],
  }),
];

/** Canonical capability graph — do not duplicate routes in nav without deriving from here */
export const CAPABILITY_REGISTRY: CapabilityEntry[] = [
  cap({
    capability_id: "CAP-EO-001",
    title: "Executive Office",
    description: "Chief of Staff briefing and executive operating environment home",
    executive_question_ids: ["EQ-001"],
    primary_route: "/",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-EPO-001", "CAP-CNS-001"],
    departments: ["Chief of Staff"],
    workflows: [],
    keywords: ["briefing", "today", "priorities", "home", "dashboard"],
    search_terms: ["what should I do today", "executive briefing", "good morning"],
    authority_level: "authoritative",
    completion_status: "partial",
    maturity: {
      completion_percent: 55,
      health: "degraded",
      last_verified_slice: "LB-OS-026.67",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-002",
    nav_placement: "briefing",
    nav_label: "Office",
    nav_order: 0,
    related_capabilities: [
      { target_capability_id: "CAP-EPO-001", relation_type: "related" },
      { target_capability_id: "CAP-CNS-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-EPO-001",
    title: "Executive Program Office",
    description: "Build progress, readiness, and platform certification",
    executive_question_ids: ["EQ-002"],
    primary_route: "/program-office",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-MIG-001"],
    departments: ["Program Office"],
    workflows: [],
    keywords: ["build", "progress", "readiness", "program office", "epo"],
    search_terms: ["how is the build progressing", "platform health", "certification"],
    authority_level: "authoritative",
    completion_status: "production",
    maturity: {
      completion_percent: 92,
      health: "healthy",
      last_verified_slice: "LB-OS-026.6",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-012.5",
    nav_placement: "kernel",
    nav_label: "Program Office",
    nav_order: 10,
    related_capabilities: [
      { target_capability_id: "CAP-MIG-001", relation_type: "related" },
      { target_capability_id: "CAP-SYS-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-WS-001",
    title: "Living Workspace",
    description: "Per-project drift, focus, and workspace momentum",
    executive_question_ids: ["EQ-007"],
    primary_route: "/workspace/:workspaceId",
    secondary_routes: ["/project/:workspaceId"],
    prerequisites: [],
    next_recommended_steps: ["CAP-ENG-001"],
    departments: ["Living Workspaces"],
    workflows: [],
    keywords: ["workspace", "project", "drift", "focus"],
    search_terms: ["what projects are drifting", "manage workspaces", "living workspace"],
    authority_level: "authoritative",
    completion_status: "production",
    maturity: {
      completion_percent: 60,
      health: "healthy",
      last_verified_slice: "LB-OS-004",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-004",
    nav_placement: "kernel",
    nav_label: "Workspace",
    nav_order: 11,
    related_capabilities: [{ target_capability_id: "CAP-EWA-001", relation_type: "related" }],
  }),
  cap({
    capability_id: "CAP-KX-001",
    title: "Knowledge Explorer",
    description: "Locate information across approved filesystem roots",
    executive_question_ids: ["EQ-004"],
    primary_route: "/explorer",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-CNS-001"],
    departments: ["Knowledge Explorer"],
    workflows: [],
    keywords: ["explorer", "search", "files", "information", "where"],
    search_terms: ["where is my information", "find files", "knowledge explorer"],
    authority_level: "authoritative",
    completion_status: "production",
    maturity: {
      completion_percent: 85,
      health: "healthy",
      last_verified_slice: "LB-OS-005",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-005",
    nav_placement: "kernel",
    nav_label: "Explorer",
    nav_order: 12,
  }),
  cap({
    capability_id: "CAP-ACT-001",
    title: "Actions",
    description: "Approval-gated proposed actions and execution log",
    executive_question_ids: ["EQ-013"],
    primary_route: "/actions",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: [],
    departments: ["Actions"],
    workflows: [],
    keywords: ["actions", "approval", "proposed", "execute"],
    search_terms: ["what actions need my approval", "approve file", "action queue"],
    authority_level: "authoritative",
    completion_status: "production",
    maturity: {
      completion_percent: 95,
      health: "healthy",
      last_verified_slice: "LB-OS-010",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-010",
    nav_placement: "kernel",
    nav_label: "Actions",
    nav_order: 13,
  }),
  cap({
    capability_id: "CAP-SYS-001",
    title: "System Health",
    description: "CPU, RAM, disk, and operations health dashboard",
    executive_question_ids: ["EQ-003"],
    primary_route: "/system",
    secondary_routes: ["/system/providers"],
    prerequisites: [],
    next_recommended_steps: ["CAP-AI-001"],
    departments: ["System Health"],
    workflows: [],
    keywords: ["system", "health", "cpu", "ram", "disk"],
    search_terms: ["how healthy is my system", "system health", "machine metrics"],
    authority_level: "authoritative",
    completion_status: "partial",
    maturity: {
      completion_percent: 88,
      health: "healthy",
      last_verified_slice: "LB-OS-011",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-011",
    nav_placement: "kernel",
    nav_label: "System",
    nav_order: 14,
    related_capabilities: [
      { target_capability_id: "CAP-AI-001", relation_type: "related", label: "AI Providers" },
    ],
  }),
  cap({
    capability_id: "CAP-AI-001",
    title: "AI Provider Management",
    description: "Provider registry, credentials, routing, and flight recorder",
    executive_question_ids: ["EQ-003"],
    primary_route: "/system/providers",
    secondary_routes: [],
    prerequisites: ["CAP-SYS-001"],
    next_recommended_steps: [],
    departments: ["System Health", "AI"],
    workflows: [],
    keywords: ["ai", "providers", "openai", "api", "credentials"],
    search_terms: ["ai providers", "manage api keys", "provider management"],
    authority_level: "summary",
    completion_status: "production",
    maturity: {
      completion_percent: 90,
      health: "healthy",
      last_verified_slice: "LB-OS-017",
      dependency_capability_ids: ["CAP-SYS-001"],
    },
    slice_id: "LB-OS-017",
    nav_placement: "hidden",
    related_capabilities: [{ target_capability_id: "CAP-SYS-001", relation_type: "related" }],
  }),
  cap({
    capability_id: "CAP-LRN-001",
    title: "Learn — OJT Academy",
    description: "On-the-job training tied to real build slices",
    executive_question_ids: [],
    primary_route: "/learn",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: [],
    departments: ["Academy"],
    workflows: [],
    keywords: ["learn", "ojt", "academy", "teaching"],
    search_terms: ["teach me while we build", "coding academy", "learn"],
    authority_level: "supporting",
    completion_status: "stub",
    maturity: {
      completion_percent: 10,
      health: "stub",
      last_verified_slice: "LB-OS-026",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-026",
    nav_placement: "kernel",
    nav_label: "Learn",
    nav_order: 16,
  }),
  cap({
    capability_id: "CAP-SET-001",
    title: "Settings",
    description: "Safety policy, permissions, and preferences",
    executive_question_ids: [],
    primary_route: "/settings",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: [],
    departments: ["Kernel"],
    workflows: [],
    keywords: ["settings", "preferences", "safety"],
    search_terms: ["settings", "permissions", "safety policy"],
    authority_level: "supporting",
    completion_status: "partial",
    maturity: {
      completion_percent: 55,
      health: "degraded",
      last_verified_slice: "LB-OS-PROD-001",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-002",
    nav_placement: "settings",
    nav_label: "Settings",
    nav_order: 99,
    related_capabilities: [
      { target_capability_id: "CAP-PROD-001", relation_type: "related", label: "Setup wizard" },
      { target_capability_id: "CAP-PROD-002", relation_type: "related", label: "Provider vault" },
      { target_capability_id: "CAP-PROD-003", relation_type: "related", label: "Instance profile" },
      { target_capability_id: "CAP-AI-001", relation_type: "related", label: "AI Providers (system)" },
    ],
  }),
  cap({
    capability_id: "CAP-PROD-001",
    title: "Instance Setup Wizard",
    description: "Empty brain onboarding shell — evolves to Executive Discovery (CAP-FUT-EDG-001) after Factory ships",
    executive_question_ids: [],
    primary_route: "/settings/onboarding",
    secondary_routes: [],
    prerequisites: ["CAP-SET-001"],
    next_recommended_steps: ["CAP-PROD-002", "CAP-PROD-003"],
    departments: ["Kernel"],
    workflows: [],
    keywords: ["onboarding", "setup", "empty brain", "instance"],
    search_terms: ["setup wizard", "new localbrain", "onboard instance"],
    authority_level: "authoritative",
    completion_status: "partial",
    maturity: {
      completion_percent: 70,
      health: "healthy",
      last_verified_slice: "LB-OS-PROD-001",
      dependency_capability_ids: ["CAP-SET-001"],
    },
    slice_id: "LB-OS-PROD-001",
    nav_placement: "settings",
    nav_label: "Setup wizard",
    nav_order: 100,
    related_capabilities: [
      { target_capability_id: "CAP-PROD-002", relation_type: "enables" },
      { target_capability_id: "CAP-PROD-003", relation_type: "enables" },
      { target_capability_id: "CAP-FUT-EDG-001", relation_type: "related", label: "Executive Discovery" },
      { target_capability_id: "CAP-FUT-FAC-001", relation_type: "related", label: "Factory" },
    ],
  }),
  cap({
    capability_id: "CAP-PROD-002",
    title: "Provider Vault & Connectors",
    description: "Encrypted API key vault, provider tests, and connector readiness screen",
    executive_question_ids: [],
    primary_route: "/settings/providers",
    secondary_routes: ["/system/providers"],
    prerequisites: ["CAP-AI-001"],
    next_recommended_steps: [],
    departments: ["Kernel", "System Health"],
    workflows: [],
    keywords: ["providers", "vault", "connectors", "api keys", "openai"],
    search_terms: ["provider vault", "connector readiness", "api key settings"],
    authority_level: "authoritative",
    completion_status: "partial",
    maturity: {
      completion_percent: 75,
      health: "healthy",
      last_verified_slice: "LB-OS-PROD-001",
      dependency_capability_ids: ["CAP-AI-001"],
    },
    slice_id: "LB-OS-PROD-001",
    nav_placement: "settings",
    nav_label: "Providers",
    nav_order: 101,
    related_capabilities: [
      { target_capability_id: "CAP-AI-001", relation_type: "related" },
      { target_capability_id: "CAP-PROD-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-PROD-003",
    title: "Instance Profile & Package",
    description: "Executive office profile, package mode, config export/import — no secrets",
    executive_question_ids: [],
    primary_route: "/settings/instance",
    secondary_routes: [],
    prerequisites: ["CAP-PROD-001"],
    next_recommended_steps: [],
    departments: ["Kernel", "Chief of Staff"],
    workflows: [],
    keywords: ["instance", "profile", "export", "import", "empty brain"],
    search_terms: ["instance settings", "export config", "package mode"],
    authority_level: "authoritative",
    completion_status: "partial",
    maturity: {
      completion_percent: 65,
      health: "healthy",
      last_verified_slice: "LB-OS-PROD-001",
      dependency_capability_ids: ["CAP-PROD-001"],
    },
    slice_id: "LB-OS-PROD-001",
    nav_placement: "settings",
    nav_label: "Instance",
    nav_order: 102,
  }),
  cap({
    capability_id: "CAP-MIG-001",
    title: "Migration Planner",
    description: "Drive doctrine, inventory gate, and migration hub",
    executive_question_ids: ["EQ-014"],
    primary_route: "/migration",
    secondary_routes: [],
    prerequisites: ["CAP-MIG-002"],
    next_recommended_steps: ["CAP-EWA-001"],
    departments: ["Migration"],
    workflows: ["WF-MIG-001", "WF-MIG-002"],
    keywords: ["migration", "planner", "drive", "relocate"],
    search_terms: ["how should I migrate my world", "migration planner", "move to h drive"],
    authority_level: "authoritative",
    completion_status: "production",
    maturity: {
      completion_percent: 88,
      health: "healthy",
      last_verified_slice: "LB-OS-018",
      dependency_capability_ids: ["CAP-MIG-002"],
    },
    slice_id: "LB-OS-018",
    nav_placement: "migration",
    nav_label: "Migration",
    nav_order: 15,
    related_capabilities: [
      { target_capability_id: "CAP-MIG-002", relation_type: "informs" },
      { target_capability_id: "CAP-CNS-001", relation_type: "related" },
      { target_capability_id: "CAP-EWA-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-MIG-002",
    title: "Filesystem Mapping Audit",
    description: "H: drive inventory and mapping confidence",
    executive_question_ids: ["EQ-015"],
    primary_route: "/migration/audit",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: ["CAP-CNS-001", "CAP-DLS-001"],
    departments: ["Migration"],
    workflows: ["WF-MIG-002"],
    keywords: ["audit", "filesystem", "h drive", "mapping"],
    search_terms: ["what is on my h drive", "filesystem audit", "mapping audit"],
    authority_level: "authoritative",
    completion_status: "production",
    maturity: {
      completion_percent: 90,
      health: "healthy",
      last_verified_slice: "LB-OS-019",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-019",
    nav_placement: "migration",
    nav_order: 20,
    related_capabilities: [
      { target_capability_id: "CAP-CNS-001", relation_type: "feeds" },
      { target_capability_id: "CAP-DLS-001", relation_type: "feeds" },
      { target_capability_id: "CAP-MIG-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-CNS-001",
    title: "Executive Consolidation Briefing",
    description: "Consolidation score, evidence stack, and simulation",
    executive_question_ids: ["EQ-005"],
    primary_route: "/migration/consolidation",
    secondary_routes: [],
    prerequisites: ["CAP-MIG-002"],
    next_recommended_steps: ["CAP-EWA-001"],
    departments: ["Consolidation"],
    workflows: ["WF-MIG-002"],
    keywords: ["consolidation", "reclaim", "duplicate", "simplify"],
    search_terms: ["what should I consolidate", "consolidation briefing", "reclaim storage"],
    authority_level: "authoritative",
    completion_status: "production",
    maturity: {
      completion_percent: 90,
      health: "healthy",
      last_verified_slice: "LB-OS-020",
      dependency_capability_ids: ["CAP-MIG-002"],
    },
    slice_id: "LB-OS-020",
    nav_placement: "migration",
    nav_order: 21,
    related_capabilities: [
      { target_capability_id: "CAP-MIG-002", relation_type: "related" },
      { target_capability_id: "CAP-EWA-001", relation_type: "related" },
      { target_capability_id: "CAP-MIG-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-EWA-001",
    title: "Executive Workspace Architecture",
    description: "Workspace DNA, org tree, and architecture blueprints",
    executive_question_ids: ["EQ-014"],
    primary_route: "/migration/workspace-architecture",
    secondary_routes: [],
    prerequisites: ["CAP-MIG-002", "CAP-CNS-001"],
    next_recommended_steps: ["CAP-DLS-001"],
    departments: ["Migration", "Architecture"],
    workflows: ["WF-MIG-001", "WF-MIG-002"],
    keywords: ["workspace architecture", "blueprint", "org tree", "organized"],
    search_terms: [
      "how organized are my workspaces",
      "workspace architecture",
      "organize workspaces",
    ],
    authority_level: "summary",
    completion_status: "production",
    maturity: {
      completion_percent: 85,
      health: "healthy",
      last_verified_slice: "LB-OS-021",
      dependency_capability_ids: ["CAP-MIG-002"],
    },
    slice_id: "LB-OS-021",
    nav_placement: "migration",
    nav_order: 22,
    related_capabilities: [
      { target_capability_id: "CAP-DLS-001", relation_type: "supports" },
      { target_capability_id: "CAP-MIG-002", relation_type: "related" },
      { target_capability_id: "CAP-CNS-001", relation_type: "related" },
      { target_capability_id: "CAP-MIG-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-DLS-001",
    title: "Digital Land Survey",
    description: "Orphans, boundaries, volume health, migration complexity",
    executive_question_ids: ["EQ-015"],
    primary_route: "/migration/digital-land-survey",
    secondary_routes: [],
    prerequisites: ["CAP-EWA-001", "CAP-MIG-002"],
    next_recommended_steps: ["CAP-PRF-001"],
    departments: ["Migration"],
    workflows: ["WF-MIG-001"],
    keywords: ["land survey", "orphans", "boundaries", "survey"],
    search_terms: ["digital land survey", "storage topology", "orphan folders"],
    authority_level: "summary",
    completion_status: "production",
    maturity: {
      completion_percent: 85,
      health: "healthy",
      last_verified_slice: "LB-OS-022",
      dependency_capability_ids: ["CAP-EWA-001", "CAP-MIG-002"],
    },
    slice_id: "LB-OS-022",
    nav_placement: "migration",
    nav_order: 23,
    related_capabilities: [
      { target_capability_id: "CAP-PRF-001", relation_type: "feeds" },
      { target_capability_id: "CAP-EWA-001", relation_type: "related" },
      { target_capability_id: "CAP-MIG-002", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-PRF-001",
    title: "Migration Proof Engine",
    description: "Safety certification and proof simulation",
    executive_question_ids: ["EQ-014"],
    primary_route: "/migration/proof",
    secondary_routes: [],
    prerequisites: ["CAP-DLS-001"],
    next_recommended_steps: ["CAP-PLN-001"],
    departments: ["Migration"],
    workflows: ["WF-MIG-001"],
    keywords: ["proof", "certification", "safety", "certified"],
    search_terms: ["can I safely migrate", "migration proof", "proof engine", "certified"],
    authority_level: "summary",
    completion_status: "production",
    maturity: {
      completion_percent: 88,
      health: "healthy",
      last_verified_slice: "LB-OS-023",
      dependency_capability_ids: ["CAP-DLS-001"],
    },
    slice_id: "LB-OS-023",
    nav_placement: "migration",
    nav_order: 24,
    related_capabilities: [
      { target_capability_id: "CAP-PLN-001", relation_type: "certifies" },
      { target_capability_id: "CAP-DLS-001", relation_type: "related" },
      { target_capability_id: "CAP-EWA-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-PLN-001",
    title: "Migration Planning",
    description: "Constraint-aware migration plans from certified proof",
    executive_question_ids: ["EQ-014"],
    primary_route: "/migration/planning",
    secondary_routes: [],
    prerequisites: ["CAP-PRF-001"],
    next_recommended_steps: ["CAP-APP-001"],
    departments: ["Migration"],
    workflows: ["WF-MIG-001"],
    keywords: ["planning", "migration plan", "move workspace", "contactlist"],
    search_terms: [
      "migration planning",
      "move my workspace",
      "move contactlist",
      "I need to move my ContactList workspace",
    ],
    authority_level: "summary",
    completion_status: "production",
    maturity: {
      completion_percent: 90,
      health: "healthy",
      last_verified_slice: "LB-OS-024",
      dependency_capability_ids: ["CAP-PRF-001"],
    },
    slice_id: "LB-OS-024",
    nav_placement: "migration",
    nav_order: 25,
    related_capabilities: [
      { target_capability_id: "CAP-APP-001", relation_type: "produces" },
      { target_capability_id: "CAP-PRF-001", relation_type: "related" },
      { target_capability_id: "CAP-DLS-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-APP-001",
    title: "Executive Approval",
    description: "Executive sign-off on migration plans",
    executive_question_ids: ["EQ-014"],
    primary_route: "/migration/approval",
    secondary_routes: [],
    prerequisites: ["CAP-PLN-001"],
    next_recommended_steps: ["CAP-CTO-001"],
    departments: ["Migration", "Executive Office"],
    workflows: ["WF-MIG-001"],
    keywords: ["approval", "sign-off", "authorize"],
    search_terms: ["what should I approve", "executive approval", "sign migration plan"],
    authority_level: "summary",
    completion_status: "production",
    maturity: {
      completion_percent: 92,
      health: "healthy",
      last_verified_slice: "LB-OS-025",
      dependency_capability_ids: ["CAP-PLN-001"],
    },
    slice_id: "LB-OS-025",
    nav_placement: "migration",
    nav_order: 26,
    related_capabilities: [
      { target_capability_id: "CAP-CTO-001", relation_type: "enables" },
      { target_capability_id: "CAP-PLN-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-CTO-001",
    title: "Migration Cutover",
    description: "Controlled execution and verification of approved cutover",
    executive_question_ids: ["EQ-014"],
    primary_route: "/migration/cutover",
    secondary_routes: [],
    prerequisites: ["CAP-APP-001"],
    next_recommended_steps: [],
    departments: ["Migration"],
    workflows: ["WF-MIG-001"],
    keywords: ["cutover", "execution", "migrate", "launch"],
    search_terms: ["run migration", "cutover", "execute migration"],
    authority_level: "summary",
    completion_status: "production",
    maturity: {
      completion_percent: 95,
      health: "healthy",
      last_verified_slice: "LB-OS-026",
      dependency_capability_ids: ["CAP-APP-001"],
    },
    slice_id: "LB-OS-026",
    nav_placement: "migration",
    nav_order: 27,
    related_capabilities: [
      { target_capability_id: "CAP-APP-001", relation_type: "related" },
      { target_capability_id: "CAP-PLN-001", relation_type: "related" },
    ],
  }),
  cap({
    capability_id: "CAP-ENG-001",
    title: "Engineering Studio",
    description: "Repo scan, checklist, test inventory, specialist routing",
    executive_question_ids: ["EQ-010"],
    primary_route: "/studio/engineering",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: [],
    departments: ["Engineering"],
    workflows: [],
    keywords: ["engineering", "code", "repo", "tests"],
    search_terms: ["how healthy is my engineering work", "engineering studio"],
    authority_level: "authoritative",
    completion_status: "partial",
    maturity: {
      completion_percent: 75,
      health: "healthy",
      last_verified_slice: "LB-OS-012",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-012",
    nav_placement: "department",
    nav_order: 1,
  }),
  cap({
    capability_id: "CAP-WRT-001",
    title: "Writing Studio",
    description: "Writing pipeline, templates, and draft assembly",
    executive_question_ids: ["EQ-011"],
    primary_route: "/studio/writing",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: [],
    departments: ["Writing"],
    workflows: [],
    keywords: ["writing", "draft", "pipeline"],
    search_terms: ["what is my writing pipeline", "writing studio"],
    authority_level: "authoritative",
    completion_status: "partial",
    maturity: {
      completion_percent: 50,
      health: "degraded",
      last_verified_slice: "LB-OS-013",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-013",
    nav_placement: "department",
    nav_order: 2,
  }),
  cap({
    capability_id: "CAP-DAT-001",
    title: "Data Intelligence Studio",
    description: "Source catalog, query plans, and data gaps",
    executive_question_ids: ["EQ-012"],
    primary_route: "/studio/data",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: [],
    departments: ["Data & Intelligence"],
    workflows: [],
    keywords: ["data", "sources", "sql", "intelligence"],
    search_terms: ["what data sources am I missing", "data studio"],
    authority_level: "authoritative",
    completion_status: "partial",
    maturity: {
      completion_percent: 55,
      health: "degraded",
      last_verified_slice: "LB-OS-014",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-014",
    nav_placement: "department",
    nav_order: 3,
  }),
  cap({
    capability_id: "CAP-REL-001",
    title: "Relationship Network",
    description: "Contacts, engagement heuristics, and network intelligence",
    executive_question_ids: ["EQ-006"],
    primary_route: "/studio/relationships",
    secondary_routes: [],
    prerequisites: [],
    next_recommended_steps: [],
    departments: ["Relationships"],
    workflows: [],
    keywords: ["relationships", "crm", "contacts", "network"],
    search_terms: ["what relationships need attention", "relationship network"],
    authority_level: "authoritative",
    completion_status: "partial",
    maturity: {
      completion_percent: 45,
      health: "degraded",
      last_verified_slice: "LB-OS-015",
      dependency_capability_ids: [],
    },
    slice_id: "LB-OS-015",
    nav_placement: "department",
    nav_order: 4,
  }),
  ...FUTURE_EXECUTIVE_CAPABILITIES,
];

export function isPlannedCapability(cap: CapabilityEntry): boolean {
  return cap.completion_status === "planned" || cap.infrastructure_reserved === true;
}

export function getLiveCapabilities(): CapabilityEntry[] {
  return CAPABILITY_REGISTRY.filter((c) => !isPlannedCapability(c));
}

export function getPlannedCapabilities(): CapabilityEntry[] {
  return CAPABILITY_REGISTRY.filter((c) => isPlannedCapability(c));
}

export function getCapabilityById(id: string): CapabilityEntry | undefined {
  return CAPABILITY_REGISTRY.find((c) => c.capability_id === id);
}

export function normalizeRoutePath(route: string): string {
  return route.split("?")[0].replace(/\/$/, "") || "/";
}

export function matchCapabilityForRoute(route: string): CapabilityEntry | null {
  const normalized = normalizeRoutePath(route);
  for (const cap of CAPABILITY_REGISTRY) {
    if (cap.primary_route.includes(":")) {
      const prefix = cap.primary_route.split(":")[0];
      if (normalized.startsWith(prefix)) return cap;
    } else if (normalized === cap.primary_route) {
      return cap;
    } else if (cap.secondary_routes.some((r) => normalized.startsWith(r.split(":")[0]))) {
      return cap;
    }
  }
  return null;
}

export function getAuthoritativeCapabilityForQuestion(
  questionId: string,
): CapabilityEntry | null {
  return (
    CAPABILITY_REGISTRY.find(
      (c) =>
        c.executive_question_ids.includes(questionId) &&
        c.authority_level === "authoritative",
    ) ?? null
  );
}

export interface KernelNavItem {
  label: string;
  path: string;
  capability_id: string;
}

export function getKernelNavItems(): KernelNavItem[] {
  return CAPABILITY_REGISTRY.filter(
    (c) => c.nav_placement === "briefing" || c.nav_placement === "kernel",
  )
    .sort((a, b) => (a.nav_order ?? 50) - (b.nav_order ?? 50))
    .map((c) => ({
      label: c.nav_label ?? c.title,
      path: c.primary_route.replace(":workspaceId", "localbrain"),
      capability_id: c.capability_id,
    }));
}

export function getMigrationNavItems(): KernelNavItem[] {
  return CAPABILITY_REGISTRY.filter((c) => c.nav_placement === "migration")
    .sort((a, b) => (a.nav_order ?? 50) - (b.nav_order ?? 50))
    .map((c) => ({
      label: c.nav_label ?? c.title,
      path: c.primary_route,
      capability_id: c.capability_id,
    }));
}
