/**
 * ENG-EO-001 — Executive Office structure (LB-OS-026.67)
 *
 * Organization (departments) ≠ Intelligence (cognitive domains) ≠ Execution (capabilities).
 *
 * Today:  Executive → Executive Office → Departments → Intelligence Domains → Capabilities → Providers
 * Reserved (post-Convention): Institution layer → Offices (with Teams) — see LOCALBRAIN_EXECUTIVE_INSTITUTION_MODEL.md
 */

import {
  CAPABILITY_REGISTRY,
  type CapabilityEntry,
  getLiveCapabilities,
  getPlannedCapabilities,
  isPlannedCapability,
} from "./capabilityRegistry.js";

export const EXECUTIVE_OFFICE_ENGINE_ID = "ENG-EO-001";

export type DepartmentLifecycle = "live" | "emerging" | "reserved";
export type IntelligenceDomainLifecycle = "live" | "emerging" | "reserved";
export type DepartmentAttentionLevel = "elevated" | "normal" | "monitoring" | "dormant";
export type DepartmentReadiness = "live" | "emerging" | "reserved" | "planned";

export interface ExecutiveCharter {
  purpose: string;
  authority: string[];
  cannot: string[];
  can: string[];
}

export interface DepartmentObjectives {
  mission: string;
  responsibilities: string[];
  measures_of_success: string[];
  current_readiness: DepartmentReadiness;
  attention_level: DepartmentAttentionLevel;
}

/** Standing doctrine — not workflows */
export interface DepartmentStandingOrders {
  orders: string[];
}

/** When to interrupt, notify CoS, monitor, or stay silent */
export interface DepartmentEscalationPolicy {
  interrupt_executive: string;
  notify_chief_of_staff: string;
  monitor_only: string;
  remain_silent: string;
}

/** Operating temperament — influences reasoning style, not a human personality */
export interface OperatingPersonality {
  traits: string[];
  influences_reasoning: string;
}

export interface IntelligenceDomain {
  domain_id: string;
  title: string;
  description: string;
  lifecycle: IntelligenceDomainLifecycle;
  /** Cognitive substrate — not an organizational role */
  world_model_aspect: string;
  slice_id: string;
}

export interface ExecutiveDepartment {
  department_id: string;
  title: string;
  description: string;
  lifecycle: DepartmentLifecycle;
  tier: "executive" | "operational";
  /** When true, synthesizes multi-department briefing (Chief of Staff) */
  synthesis_role?: boolean;
  intelligence_domain_ids: string[];
  /** Legacy capability.departments labels matched to this department */
  legacy_department_labels: string[];
  charter: ExecutiveCharter;
  objectives: DepartmentObjectives;
  standing_orders: DepartmentStandingOrders;
  escalation_policy: DepartmentEscalationPolicy;
  operating_personality: OperatingPersonality;
  slice_id: string;
}

export interface ExecutiveOfficeContainer {
  office_id: string;
  title: string;
  description: string;
  /** Allows multiple executives / organizations later */
  executive_label: string;
}

export interface DepartmentProjection extends ExecutiveDepartment {
  owned_domains: IntelligenceDomain[];
  capability_ids: string[];
  live_capability_count: number;
  reserved_capability_count: number;
}

export interface ExecutiveOfficeProjection {
  engine_id: typeof EXECUTIVE_OFFICE_ENGINE_ID;
  slice_id: "LB-OS-026.67";
  generated_at: string;
  executive_office: ExecutiveOfficeContainer;
  hierarchy: string[];
  departments: DepartmentProjection[];
  intelligence_domains: IntelligenceDomain[];
  executive_departments: DepartmentProjection[];
  operational_departments: DepartmentProjection[];
  synthesis_department_id: string;
  unassigned_capability_ids: string[];
}

export const EXECUTIVE_OFFICE: ExecutiveOfficeContainer = {
  office_id: "EO-001",
  title: "Executive Office",
  description:
    "Organizational container for executive departments. Departments own intelligence domains; capabilities execute.",
  executive_label: "Executive",
};

export const INTELLIGENCE_DOMAINS: IntelligenceDomain[] = [
  {
    domain_id: "IDN-IDENTITY-001",
    title: "Identity",
    description: "Communication identities across Gmail, Microsoft, Slack, CRM, banking connectors",
    lifecycle: "reserved",
    world_model_aspect: "Who speaks, on whose behalf, through which channels",
    slice_id: "LB-OS-090+",
  },
  {
    domain_id: "IDN-TIME-001",
    title: "Time",
    description: "Temporal World Model — calendars, commitments, conflicts, attention windows",
    lifecycle: "reserved",
    world_model_aspect: "When things happen and what competes for executive time",
    slice_id: "LB-OS-092+",
  },
  {
    domain_id: "IDN-FINANCIAL-001",
    title: "Financial",
    description: "Financial World Model — personal, campaign, nonprofit, business ledgers",
    lifecycle: "reserved",
    world_model_aspect: "Position, burn, constraints across all financial contexts",
    slice_id: "LB-OS-101+",
  },
  {
    domain_id: "IDN-FORECASTING-001",
    title: "Forecasting",
    description: "Cash flow, burn rate, runway, and scenario projections",
    lifecycle: "reserved",
    world_model_aspect: "What happens next financially",
    slice_id: "LB-OS-101+",
  },
  {
    domain_id: "IDN-ASSETS-001",
    title: "Assets",
    description: "Investments, property, debt, and balance-sheet intelligence",
    lifecycle: "reserved",
    world_model_aspect: "What the executive owns and owes",
    slice_id: "LB-OS-101+",
  },
  {
    domain_id: "IDN-KNOWLEDGE-001",
    title: "Knowledge",
    description: "Memory quality, provenance, contradictions, entropy, recall",
    lifecycle: "emerging",
    world_model_aspect: "What the platform knows and how trustworthy it is",
    slice_id: "LB-OS-026+",
  },
  {
    domain_id: "IDN-RELATIONSHIP-001",
    title: "Relationship",
    description: "People, obligations, follow-ups, network health",
    lifecycle: "emerging",
    world_model_aspect: "Who matters and what is owed",
    slice_id: "LB-OS-015+",
  },
  {
    domain_id: "IDN-PROJECTS-001",
    title: "Projects",
    description: "Initiatives, migrations, build state, delivery posture",
    lifecycle: "live",
    world_model_aspect: "What is being built and its status",
    slice_id: "LB-OS-026+",
  },
  {
    domain_id: "IDN-CAMPAIGN-001",
    title: "Campaign",
    description: "Electoral operations, volunteer recruitment, field metrics",
    lifecycle: "reserved",
    world_model_aspect: "Campaign health distinct from personal or nonprofit finance",
    slice_id: "LB-OS-100+",
  },
  {
    domain_id: "IDN-COMMUNICATIONS-001",
    title: "Communications",
    description: "Messages, media reach, narrative momentum",
    lifecycle: "reserved",
    world_model_aspect: "What is being said and heard",
    slice_id: "LB-OS-091+",
  },
  {
    domain_id: "IDN-OPERATIONS-001",
    title: "Operations",
    description: "Platform health, engineering delivery, system posture",
    lifecycle: "live",
    world_model_aspect: "How the executive machine runs",
    slice_id: "LB-OS-026+",
  },
  {
    domain_id: "IDN-HEALTH-001",
    title: "Health",
    description: "Personal health follow-ups and medical obligations",
    lifecycle: "reserved",
    world_model_aspect: "Body and care commitments",
    slice_id: "LB-OS-095+",
  },
  {
    domain_id: "IDN-LEGAL-001",
    title: "Legal",
    description: "Compliance, filings, contractual obligations",
    lifecycle: "reserved",
    world_model_aspect: "What must not be violated",
    slice_id: "LB-OS-102+",
  },
  {
    domain_id: "IDN-LEARNING-001",
    title: "Learning",
    description: "Skill acquisition, OJT progress, concept mastery",
    lifecycle: "emerging",
    world_model_aspect: "What the executive is becoming capable of",
    slice_id: "LB-OS-027+",
  },
  {
    domain_id: "IDN-SECURITY-001",
    title: "Security & Threat",
    description: "Cyber, privacy, credential exposure, brand, reputation, vendor and AI risks",
    lifecycle: "reserved",
    world_model_aspect: "What threatens the executive digitally",
    slice_id: "LB-OS-03X+",
  },
  {
    domain_id: "IDN-AI-INTEL-001",
    title: "AI Intelligence",
    description: "Model vendors, benchmarks, agents, research — what matters to LocalBrain",
    lifecycle: "reserved",
    world_model_aspect: "How the AI landscape affects executive capability",
    slice_id: "LB-OS-03X+",
  },
];

const charter = (
  purpose: string,
  authority: string[],
  cannot: string[],
  can: string[],
): ExecutiveCharter => ({ purpose, authority, cannot, can });

const objectives = (
  mission: string,
  responsibilities: string[],
  measures_of_success: string[],
  current_readiness: DepartmentReadiness,
  attention_level: DepartmentAttentionLevel = "normal",
): DepartmentObjectives => ({
  mission,
  responsibilities,
  measures_of_success,
  current_readiness,
  attention_level,
});

const standingOrders = (orders: string[]): DepartmentStandingOrders => ({ orders });

const escalationPolicy = (
  interrupt_executive: string,
  notify_chief_of_staff: string,
  monitor_only: string,
  remain_silent: string,
): DepartmentEscalationPolicy => ({
  interrupt_executive,
  notify_chief_of_staff,
  monitor_only,
  remain_silent,
});

const operatingPersonality = (
  traits: string[],
  influences_reasoning: string,
): OperatingPersonality => ({ traits, influences_reasoning });

/** Standing orders, escalation, and operating personality per department */
const DEPARTMENT_DOCTRINE: Record<
  string,
  Pick<ExecutiveDepartment, "standing_orders" | "escalation_policy" | "operating_personality">
> = {
  "DEPT-COS-001": {
    standing_orders: standingOrders([
      "Always protect executive attention.",
      "Prefer fewer, better recommendations.",
      "Never interrupt for low-value events.",
      "Surface cross-department conflicts.",
      "Escalate uncertainty before urgency.",
    ]),
    escalation_policy: escalationPolicy(
      "Irreversible deadline within 24h with no delegated owner",
      "Cross-department conflict, competing priorities, or synthesis gap",
      "Department contributions awaiting synthesis for briefing",
      "Routine status, unread counts, low-impact deltas",
    ),
    operating_personality: operatingPersonality(
      ["Restrained", "Synthesis-first", "Attention-protective"],
      "Filters noise aggressively; elevates only when multiple signals converge on executive relevance",
    ),
  },
  "DEPT-CKO-001": {
    standing_orders: standingOrders([
      "Never sacrifice provenance.",
      "Prefer uncertainty over fabricated certainty.",
      "Reduce cognitive entropy.",
      "Preserve institutional memory.",
      "Surface contradictions immediately.",
    ]),
    escalation_policy: escalationPolicy(
      "Provenance break threatens a pending executive decision",
      "Contradiction across departments or corrupted recall chain",
      "Entropy drift, duplicate understanding, knowledge debt accumulation",
      "Routine indexing, low-confidence gaps with no downstream consumer",
    ),
    operating_personality: operatingPersonality(
      ["Conservative", "Evidence-first", "Low speculation"],
      "Withholds recommendation until provenance is intact; flags uncertainty explicitly",
    ),
  },
  "DEPT-CFO-001": {
    standing_orders: standingOrders([
      "Protect liquidity.",
      "Prefer long-term sustainability.",
      "Never spend without authorization.",
      "Detect financial drift early.",
      "Flag unusual cash movement.",
    ]),
    escalation_policy: escalationPolicy(
      "Liquidity risk, missed payroll, or compliance filing deadline",
      "Burn rate exceeds forecast with campaign event imminent",
      "Variance from budget, runway changes, unusual transactions",
      "Routine ledger updates within expected bands",
    ),
    operating_personality: operatingPersonality(
      ["Conservative", "Variance-sensitive", "Long-horizon"],
      "Weights sustainability over opportunity; escalates drift before crisis",
    ),
  },
  "DEPT-COO-001": {
    standing_orders: standingOrders([
      "Never hide delivery posture.",
      "Prefer certifiable state over optimistic reporting.",
      "Surface blockers before they become outages.",
      "Protect graph integrity and migration continuity.",
      "Recommend — never execute without approval.",
    ]),
    escalation_policy: escalationPolicy(
      "Production outage or migration stage failure with no rollback path",
      "Graph integrity FAIL or certification regression blocking release",
      "Build state drift, degraded health signals, stalled migration",
      "Routine slice completion, passing certifications",
    ),
    operating_personality: operatingPersonality(
      ["Honest", "Process-rigorous", "Delivery-focused"],
      "Reports ground truth; avoids smoothing bad news",
    ),
  },
  "DEPT-COM-001": {
    standing_orders: standingOrders([
      "Read first — never send on the executive's behalf.",
      "Relationship cadence beats unread counts.",
      "Every interaction becomes executive memory.",
      "Elevate unusual silence, delay, and mission impact.",
      "Prefer draft over dispatch.",
    ]),
    escalation_policy: escalationPolicy(
      "High-impact external narrative with reputational risk (e.g. viral clip, press inquiry)",
      "County chairs or key stakeholders waiting with time-bound campaign impact",
      "Media reach spikes, narrative shifts, draft-ready responses needed",
      "Unread email volume, newsletters, routine CC traffic",
    ),
    operating_personality: operatingPersonality(
      ["Fast", "External", "Narrative-aware"],
      "Connects relationship history and mission impact — ignores inbox counts",
    ),
  },
  "DEPT-SEC-001": {
    standing_orders: standingOrders([
      "Assume breach is possible — minimize blast radius.",
      "Privacy is data sovereignty, not invisibility.",
      "Escalate credential exposure immediately.",
      "Monitor brand and reputation continuously.",
      "Vendor and AI risks require explicit classification.",
    ]),
    escalation_policy: escalationPolicy(
      "Active credential exposure or confirmed account compromise",
      "Dark-web mention of executive identity with exploit path",
      "Reputational crisis with verifiable external amplification",
      "Routine security news without Steve-specific relevance",
    ),
    operating_personality: operatingPersonality(
      ["Paranoid-prudent", "Evidence-first", "Classification-driven"],
      "Filters global threat noise to Steve-relevant risk only",
    ),
  },
  "DEPT-AII-001": {
    standing_orders: standingOrders([
      "Three developments per day — not three hundred.",
      "Tie every signal to LocalBrain capability impact.",
      "Prefer primary sources over hype cycles.",
      "Track open-source and local-model parity.",
      "Never recommend vendor lock-in as architecture.",
    ]),
    escalation_policy: escalationPolicy(
      "Breakthrough model or agent pattern that changes LocalBrain roadmap",
      "Provider policy change affecting data sovereignty or routing",
      "Benchmark shift making local-first strategy obsolete or urgent",
      "Routine model releases without executive relevance",
    ),
    operating_personality: operatingPersonality(
      ["Curatorial", "Skeptical-of-hype", "Architecture-aware"],
      "Surfaces only AI intelligence that changes executive decisions",
    ),
  },
  "DEPT-CAM-001": {
    standing_orders: standingOrders([
      "Protect field momentum.",
      "Surface recruitment gaps before events.",
      "Separate campaign ops from personal noise.",
      "Prefer relationship-aware escalation.",
      "Never conflate campaign finance with personal ledgers.",
    ]),
    escalation_policy: escalationPolicy(
      "Field failure before major event with volunteer gap below plan",
      "County-level stakeholder waiting with electoral consequence",
      "Recruitment vs plan variance, momentum shifts",
      "Routine field updates within expected range",
    ),
    operating_personality: operatingPersonality(
      ["Opportunity-seeking", "Momentum-focused", "Relationship-oriented"],
      "Weights timing and relationships; escalates when momentum is at risk",
    ),
  },
  "DEPT-FAM-001": {
    standing_orders: standingOrders([
      "Protect family commitments without noise.",
      "Elevate genuine obligations only.",
      "Prefer reminder over interruption.",
      "Respect private boundaries.",
      "Coordinate with Time Intelligence — never auto-book.",
    ]),
    escalation_policy: escalationPolicy(
      "Imminent family commitment at risk (anniversary, reservation deadline)",
      "Family calendar conflict affecting executive availability",
      "Upcoming family obligations within planning window",
      "Routine household logistics with flexible timing",
    ),
    operating_personality: operatingPersonality(
      ["Protective", "Low-noise", "Relationship-aware"],
      "Suppresses domestic trivia; elevates when family trust is on the line",
    ),
  },
  "DEPT-PER-001": {
    standing_orders: standingOrders([
      "Personal health outranks campaign noise.",
      "Surface overdue medical follow-ups.",
      "Never schedule without approval.",
      "Protect private affairs from briefing leakage.",
      "Prefer gentle elevation over alarm.",
    ]),
    escalation_policy: escalationPolicy(
      "Overdue critical health follow-up with documented prior commitment",
      "Personal obligation conflicting with executive calendar",
      "Health cadence drift, relationship maintenance due",
      "Routine wellness reminders without prior executive flag",
    ),
    operating_personality: operatingPersonality(
      ["Protective", "Private", "Cadence-aware"],
      "Elevates personal care quietly but persistently when executive has committed",
    ),
  },
  "DEPT-LEG-001": {
    standing_orders: standingOrders([
      "Deadlines are non-negotiable signals.",
      "Surface compliance risk early.",
      "Never provide legal advice — flag for counsel.",
      "Prefer prevention over reaction.",
      "Document provenance of legal artifacts.",
    ]),
    escalation_policy: escalationPolicy(
      "Filing or compliance deadline within statutory window",
      "Contractual breach risk or regulatory inquiry",
      "Approaching deadlines, compliance posture drift",
      "Routine contract storage without active obligation",
    ),
    operating_personality: operatingPersonality(
      ["Risk-averse", "Deadline-driven", "Precise"],
      "Escalates on calendar certainty; avoids speculative legal interpretation",
    ),
  },
  "DEPT-ACD-001": {
    standing_orders: standingOrders([
      "Teach while building — never skip the lesson.",
      "Match concept to current slice context.",
      "Prefer mastery signals over completion counts.",
      "Protect learning guardrails.",
      "Recommend next step — never auto-advance curriculum.",
    ]),
    escalation_policy: escalationPolicy(
      "Executive explicitly requested teach mode during active build",
      "Concept gap blocking current slice completion",
      "Progress milestones, skill map updates",
      "Background curriculum changes without active session",
    ),
    operating_personality: operatingPersonality(
      ["Patient", "Contextual", "Build-along"],
      "Anchors lessons to live work; avoids abstract teaching detached from task",
    ),
  },
  "DEPT-DAT-001": {
    standing_orders: standingOrders([
      "Read-only by default.",
      "Prefer legible insight over raw dumps.",
      "Surface anomalies — not every delta.",
      "Protect data provenance.",
      "Recommend analysis — never mutate source data.",
    ]),
    escalation_policy: escalationPolicy(
      "Data integrity failure affecting executive decision",
      "Anomaly correlating with financial or operational risk",
      "New analytical views, query performance drift",
      "Routine report generation within norms",
    ),
    operating_personality: operatingPersonality(
      ["Analytical", "Skeptical", "Legibility-first"],
      "Translates data into executive-readable signal; resists chart noise",
    ),
  },
  "DEPT-REL-001": {
    standing_orders: standingOrders([
      "Relationships decay silently — track cadence.",
      "Surface overdue follow-ups with context.",
      "Never send outreach autonomously.",
      "Prefer who matters over contact volume.",
      "Feed Chief of Staff — do not interrupt directly unless urgent.",
    ]),
    escalation_policy: escalationPolicy(
      "Critical relationship overdue with high-stakes pending decision",
      "Chris hasn't replied in nine days — pattern breach on committed follow-up",
      "Cadence drift, network health changes",
      "New contacts without executive context",
    ),
    operating_personality: operatingPersonality(
      ["Relationship-oriented", "Cadence-aware", "Context-rich"],
      "Weights relationship history and commitment over recency alone",
    ),
  },
  "DEPT-LWS-001": {
    standing_orders: standingOrders([
      "Workspace entropy is cognitive debt.",
      "Prefer consolidation recommendations over silent reorg.",
      "Surface architecture drift.",
      "Protect executive mental model of file layout.",
      "Dry-run before any structural change.",
    ]),
    escalation_policy: escalationPolicy(
      "Workspace state blocking migration or executive access",
      "Consolidation conflict across departments",
      "Architecture drift, duplicate workspace patterns",
      "Routine workspace health within norms",
    ),
    operating_personality: operatingPersonality(
      ["Organizing", "Architecture-minded", "Consolidation-biased"],
      "Elevates when physical or digital clutter threatens executive clarity",
    ),
  },
  "DEPT-ACT-001": {
    standing_orders: standingOrders([
      "Never execute without approval.",
      "Always dry-run first.",
      "Quarantine secrets and irreversible actions.",
      "Prefer propose over perform.",
      "Audit every execution path.",
    ]),
    escalation_policy: escalationPolicy(
      "Approved action awaiting execution past SLA",
      "Quarantine block on high-priority proposed action",
      "Pending approvals queue depth",
      "Routine proposal lifecycle without executive request",
    ),
    operating_personality: operatingPersonality(
      ["Gatekeeping", "Approval-rigid", "Audit-first"],
      "Blocks all autonomous action; surfaces only execution readiness",
    ),
  },
};

function doctrineFor(departmentId: string): Pick<
  ExecutiveDepartment,
  "standing_orders" | "escalation_policy" | "operating_personality"
> {
  const d = DEPARTMENT_DOCTRINE[departmentId];
  if (!d) {
    throw new Error(`Missing department doctrine for ${departmentId}`);
  }
  return d;
}

export const EXECUTIVE_DEPARTMENTS: ExecutiveDepartment[] = [
  {
    department_id: "DEPT-COS-001",
    title: "Chief of Staff",
    description: "Synthesizes executive briefing from all departments; elevates what deserves attention",
    lifecycle: "live",
    tier: "executive",
    synthesis_role: true,
    intelligence_domain_ids: [
      "IDN-IDENTITY-001",
      "IDN-TIME-001",
      "IDN-RELATIONSHIP-001",
      "IDN-PROJECTS-001",
    ],
    legacy_department_labels: ["Chief of Staff", "Executive Office"],
    charter: charter(
      "Decide what deserves the executive's attention right now.",
      ["Briefing synthesis", "Cross-department elevation", "Attention prioritization"],
      ["Send email", "Move money", "Schedule meetings without approval"],
      ["Recommend", "Draft", "Synthesize", "Elevate"],
    ),
    objectives: objectives(
      "Answer: what deserves Steve's attention right now?",
      [
        "Synthesize department contributions into Chief of Staff Morning Briefing",
        "Suppress noise — unread counts are not signals",
        "Route approval-gated recommendations",
      ],
      ["Low false-positive elevation", "Timely follow-up surfacing", "Coherent daily narrative"],
      "live",
      "elevated",
    ),
    ...doctrineFor("DEPT-COS-001"),
    slice_id: "LB-OS-026+",
  },
  {
    department_id: "DEPT-CKO-001",
    title: "Chief Knowledge Officer",
    description: "Steward of executive cognition — memory, provenance, contradictions, entropy",
    lifecycle: "reserved",
    tier: "executive",
    intelligence_domain_ids: ["IDN-KNOWLEDGE-001"],
    legacy_department_labels: ["Knowledge Explorer"],
    charter: charter(
      "Protect the quality of executive cognition.",
      ["Memory", "Knowledge", "Provenance", "Contradiction detection"],
      ["Approve spending", "Schedule meetings", "Send communications"],
      ["Recommend knowledge repairs", "Flag entropy and duplicate understanding"],
    ),
    objectives: objectives(
      "Maintain the integrity of the Executive Memory.",
      [
        "Memory quality and provenance",
        "Contradiction and duplicate detection",
        "Knowledge debt and cognitive entropy",
      ],
      ["High provenance", "Low contradiction", "Low entropy", "High recall quality"],
      "reserved",
      "monitoring",
    ),
    ...doctrineFor("DEPT-CKO-001"),
    slice_id: "LB-OS-096+",
  },
  {
    department_id: "DEPT-CFO-001",
    title: "CFO",
    description: "Financial intelligence across personal, campaign, nonprofit, and business contexts",
    lifecycle: "reserved",
    tier: "executive",
    intelligence_domain_ids: ["IDN-FINANCIAL-001", "IDN-FORECASTING-001", "IDN-ASSETS-001"],
    legacy_department_labels: ["Accounting & CFO"],
    charter: charter(
      "Make financial position legible for executive decisions.",
      ["Financial World Model", "Burn rate", "Budget intelligence", "Forecasting"],
      ["Move money", "Authorize payments", "File taxes autonomously"],
      ["Recommend", "Draft financial briefings", "Flag variance from forecast"],
    ),
    objectives: objectives(
      "Provide CFO-grade financial intelligence with approval-gated recommendations.",
      [
        "Unify personal, campaign, nonprofit, and business finance into Financial Intelligence",
        "Surface burn rate and runway",
        "Feed Executive Briefing with financial elevation",
      ],
      ["Accurate position", "Timely variance alerts", "Zero autonomous money movement"],
      "reserved",
      "monitoring",
    ),
    ...doctrineFor("DEPT-CFO-001"),
    slice_id: "LB-OS-101+",
  },
  {
    department_id: "DEPT-COO-001",
    title: "COO",
    description: "Operations, platform health, engineering delivery, migration execution",
    lifecycle: "emerging",
    tier: "executive",
    intelligence_domain_ids: ["IDN-OPERATIONS-001", "IDN-PROJECTS-001"],
    legacy_department_labels: [
      "Migration",
      "Kernel",
      "System Health",
      "Engineering",
      "Program Office",
      "Consolidation",
      "Architecture",
    ],
    charter: charter(
      "Keep the executive machine running and deliveries on track.",
      ["Platform health", "Migration execution", "Build state", "Engineering studio"],
      ["Reorganize filesystem without approval", "Execute cutover without approval"],
      ["Recommend operational actions", "Report completion status"],
    ),
    objectives: objectives(
      "Ensure operational continuity and honest delivery posture.",
      ["Migration pipeline health", "System health monitoring", "Build state accuracy"],
      ["Graph integrity PASS", "Migration stages certifiable", "No silent failures"],
      "emerging",
      "normal",
    ),
    ...doctrineFor("DEPT-COO-001"),
    slice_id: "LB-OS-026+",
  },
  {
    department_id: "DEPT-COM-001",
    title: "Chief of Communications",
    description:
      "Executive Communications Department — contacts, organizations, relationships, email, SMS, voice, meetings, history, network graph; contact→conversation→memory→relationship→CoS",
    lifecycle: "reserved",
    tier: "executive",
    intelligence_domain_ids: ["IDN-COMMUNICATIONS-001", "IDN-IDENTITY-001"],
    legacy_department_labels: ["Communications", "Writing"],
    charter: charter(
      "Own the executive communications world model — every interaction becomes memory, not inbox noise.",
      [
        "Contact and relationship cadence",
        "Conversation history across channels",
        "Unusual silence or delay vs historical cadence",
        "Stakeholder impact on missions",
      ],
      ["Send email", "Post to social", "Reply autonomously", "Place calls without approval"],
      ["Recommend", "Draft", "Elevate relationship and mission impact"],
    ),
    objectives: objectives(
      "Reason across contacts and relationships — not unread counts.",
      [
        "Executive Communications as first production department post–Memory OS",
        "Provider-abstracted connectors (Google first, then Microsoft/IMAP/SMTP)",
        "Contact → conversation → memory → relationship → CoS path",
      ],
      ["Read-first compliance", "No automatic sends", "Timely narrative elevation"],
      "reserved",
      "dormant",
    ),
    ...doctrineFor("DEPT-COM-001"),
    slice_id: "LB-OS-091+",
  },
  {
    department_id: "DEPT-SEC-001",
    title: "Chief Security Officer",
    description:
      "Digital Threat Department — cyber, privacy, identity, brand, reputation, monitoring, threat intelligence",
    lifecycle: "reserved",
    tier: "executive",
    intelligence_domain_ids: ["IDN-SECURITY-001", "IDN-IDENTITY-001"],
    legacy_department_labels: [],
    charter: charter(
      "Protect executive digital posture — classify, monitor, escalate; never promise invisibility.",
      [
        "Credential exposure",
        "Reputation and brand monitoring",
        "Vendor and AI risk",
        "Privacy posture advisory",
      ],
      ["Autonomous takedowns", "Unauthorized scanning of third parties"],
      ["Recommend", "Classify", "Escalate verified threats"],
    ),
    objectives: objectives(
      "Reports to CoS with Steve-relevant threat and privacy intelligence only.",
      ["Digital Threat Department capacity", "Tie to DPEC data sovereignty layer"],
      ["Zero unreported credential exposure", "Governed external monitoring"],
      "reserved",
      "dormant",
    ),
    ...doctrineFor("DEPT-SEC-001"),
    slice_id: "LB-OS-03X+",
  },
  {
    department_id: "DEPT-AII-001",
    title: "AI Intelligence",
    description:
      "Monitors AI landscape — vendors, models, agents, benchmarks, research — curates what matters to LocalBrain",
    lifecycle: "reserved",
    tier: "executive",
    intelligence_domain_ids: ["IDN-AI-INTEL-001", "IDN-KNOWLEDGE-001"],
    legacy_department_labels: [],
    charter: charter(
      "Curate AI developments that change LocalBrain capability — three per day, not three hundred.",
      [
        "OpenAI, Anthropic, Google, Meta, xAI, Mistral, Hugging Face",
        "Open-source models and local-first parity",
        "Agents, benchmarks, research papers",
      ],
      ["Recommend vendor lock-in", "Auto-switch providers without approval"],
      ["Recommend", "Summarize", "Flag architecture impact"],
    ),
    objectives: objectives(
      "Every morning: three AI developments that matter to LocalBrain today.",
      ["AI Intelligence Department", "Feed Digital World Monitor and provider spine"],
      ["Curated signal only", "Architecture-aware summaries"],
      "reserved",
      "dormant",
    ),
    ...doctrineFor("DEPT-AII-001"),
    slice_id: "LB-OS-03X+",
  },
  {
    department_id: "DEPT-CAM-001",
    title: "Campaign Director",
    description: "Electoral operations — distinct from CFO though sharing Financial Intelligence substrate",
    lifecycle: "reserved",
    tier: "executive",
    intelligence_domain_ids: ["IDN-CAMPAIGN-001", "IDN-FINANCIAL-001"],
    legacy_department_labels: [],
    charter: charter(
      "Monitor campaign health and field operations.",
      ["Volunteer recruitment", "Field metrics", "Campaign-specific elevation"],
      ["Spend campaign funds", "Authorize vendor payments"],
      ["Recommend", "Draft", "Elevate campaign priorities"],
    ),
    objectives: objectives(
      "Keep campaign operations legible without conflating personal or nonprofit finance.",
      ["Recruitment vs plan", "Field momentum", "Campaign-specific briefing items"],
      ["Accurate field picture", "Timely recruitment alerts"],
      "reserved",
      "dormant",
    ),
    ...doctrineFor("DEPT-CAM-001"),
    slice_id: "LB-OS-100+",
  },
  {
    department_id: "DEPT-FAM-001",
    title: "Family Office",
    description: "Household and family logistics — coordination without autonomous action",
    lifecycle: "reserved",
    tier: "executive",
    intelligence_domain_ids: ["IDN-RELATIONSHIP-001", "IDN-TIME-001"],
    legacy_department_labels: ["Household"],
    charter: charter(
      "Coordinate family obligations into briefing when they genuinely matter.",
      ["Household operations", "Family calendar conflicts", "Family follow-ups"],
      ["Book reservations without approval", "Send family communications autonomously"],
      ["Recommend", "Draft", "Elevate family items"],
    ),
    objectives: objectives(
      "Protect family commitments without noise.",
      ["Anniversary and obligation tracking", "Household logistics elevation"],
      ["Low noise", "High signal on genuine family obligations"],
      "reserved",
      "dormant",
    ),
    ...doctrineFor("DEPT-FAM-001"),
    slice_id: "LB-OS-095+",
  },
  {
    department_id: "DEPT-PER-001",
    title: "Personal Office",
    description: "Personal health, private obligations, non-campaign personal affairs",
    lifecycle: "reserved",
    tier: "executive",
    intelligence_domain_ids: ["IDN-HEALTH-001", "IDN-RELATIONSHIP-001"],
    legacy_department_labels: [],
    charter: charter(
      "Surface personal obligations that deserve executive attention.",
      ["Health follow-ups", "Personal relationships", "Private commitments"],
      ["Schedule medical appointments without approval", "Send personal messages autonomously"],
      ["Recommend", "Draft", "Elevate personal follow-ups"],
    ),
    objectives: objectives(
      "Ensure personal care and obligations are not lost in campaign noise.",
      ["Medical follow-up tracking", "Personal relationship cadence"],
      ["Timely health elevation", "No autonomous scheduling"],
      "reserved",
      "dormant",
    ),
    ...doctrineFor("DEPT-PER-001"),
    slice_id: "LB-OS-095+",
  },
  {
    department_id: "DEPT-LEG-001",
    title: "Legal",
    description: "Compliance, filings, contractual obligations",
    lifecycle: "reserved",
    tier: "executive",
    intelligence_domain_ids: ["IDN-LEGAL-001"],
    legacy_department_labels: [],
    charter: charter(
      "Protect the executive from compliance and contractual risk.",
      ["Filing deadlines", "Contract review flags", "Compliance monitoring"],
      ["Provide legal advice autonomously", "Sign documents"],
      ["Recommend", "Flag deadlines", "Elevate legal risk"],
    ),
    objectives: objectives(
      "Make legal obligations visible before they become crises.",
      ["Deadline tracking", "Compliance posture"],
      ["Zero missed filing deadlines", "Early risk elevation"],
      "reserved",
      "dormant",
    ),
    ...doctrineFor("DEPT-LEG-001"),
    slice_id: "LB-OS-102+",
  },
  {
    department_id: "DEPT-ACD-001",
    title: "Academy",
    description: "OJT coding academy and executive learning",
    lifecycle: "emerging",
    tier: "operational",
    intelligence_domain_ids: ["IDN-LEARNING-001"],
    legacy_department_labels: ["Academy"],
    charter: charter(
      "Teach the executive while building the platform.",
      ["OJT lessons", "Skill map", "Concept ladder"],
      ["Skip learning guardrails"],
      ["Recommend next lesson", "Track progress"],
    ),
    objectives: objectives(
      "Build executive technical fluency through build-along teaching.",
      ["OJT lesson delivery", "Progress tracking"],
      ["Measurable skill growth"],
      "emerging",
      "monitoring",
    ),
    ...doctrineFor("DEPT-ACD-001"),
    slice_id: "LB-OS-027+",
  },
  {
    department_id: "DEPT-DAT-001",
    title: "Data Intelligence",
    description: "Data studio and analytical capabilities",
    lifecycle: "emerging",
    tier: "operational",
    intelligence_domain_ids: ["IDN-KNOWLEDGE-001", "IDN-OPERATIONS-001"],
    legacy_department_labels: ["Data & Intelligence"],
    charter: charter(
      "Turn data into legible executive intelligence.",
      ["Data studio", "Analytical views"],
      ["Alter production data without approval"],
      ["Recommend analyses", "Surface data insights"],
    ),
    objectives: objectives(
      "Make data legible for decisions.",
      ["Studio availability", "Query safety"],
      ["Read-only default", "Useful analytical elevation"],
      "emerging",
      "monitoring",
    ),
    ...doctrineFor("DEPT-DAT-001"),
    slice_id: "LB-OS-020+",
  },
  {
    department_id: "DEPT-REL-001",
    title: "Relationship Office",
    description: "CRM and relationship network — feeds Chief of Staff",
    lifecycle: "emerging",
    tier: "operational",
    intelligence_domain_ids: ["IDN-RELATIONSHIP-001"],
    legacy_department_labels: ["Relationships"],
    charter: charter(
      "Track who matters and what follow-ups are overdue.",
      ["Relationship network", "Contact intelligence"],
      ["Send outreach autonomously"],
      ["Recommend follow-ups", "Elevate relationship debt"],
    ),
    objectives: objectives(
      "Prevent relationship decay through timely elevation.",
      ["Overdue follow-up detection", "Network health"],
      ["Timely relationship elevation"],
      "emerging",
      "normal",
    ),
    ...doctrineFor("DEPT-REL-001"),
    slice_id: "LB-OS-015+",
  },
  {
    department_id: "DEPT-LWS-001",
    title: "Living Workspaces",
    description: "Workspace architecture and living workspace capabilities",
    lifecycle: "live",
    tier: "operational",
    intelligence_domain_ids: ["IDN-PROJECTS-001", "IDN-KNOWLEDGE-001"],
    legacy_department_labels: ["Living Workspaces"],
    charter: charter(
      "Keep workspaces organized and legible.",
      ["Workspace architecture", "Living workspace views"],
      ["Reorganize files without approval"],
      ["Recommend consolidation", "Surface workspace health"],
    ),
    objectives: objectives(
      "Maintain workspace coherence for executive clarity.",
      ["Architecture legibility", "Consolidation readiness"],
      ["Low workspace entropy"],
      "live",
      "normal",
    ),
    ...doctrineFor("DEPT-LWS-001"),
    slice_id: "LB-OS-012+",
  },
  {
    department_id: "DEPT-ACT-001",
    title: "Actions",
    description: "Approval-gated action execution",
    lifecycle: "live",
    tier: "operational",
    intelligence_domain_ids: ["IDN-OPERATIONS-001"],
    legacy_department_labels: ["Actions"],
    charter: charter(
      "Execute only what the executive has approved.",
      ["Approved action execution", "Dry-run preview"],
      ["Execute without approval", "Bypass quarantine"],
      ["Propose", "Dry-run", "Execute after approval"],
    ),
    objectives: objectives(
      "Never act without explicit executive approval.",
      ["Approval workflow", "Quarantine for secrets"],
      ["Zero unapproved executions"],
      "live",
      "normal",
    ),
    ...doctrineFor("DEPT-ACT-001"),
    slice_id: "LB-OS-008+",
  },
];

/** Explicit capability → department mapping (LB-OS-026.67) */
export const CAPABILITY_DEPARTMENT_MAP: Record<string, string[]> = {
  "CAP-FUT-GAC-001": ["DEPT-COM-001", "DEPT-COS-001"],
  "CAP-FUT-GML-001": ["DEPT-COM-001"],
  "CAP-FUT-CAL-001": ["DEPT-COS-001"],
  "CAP-FUT-KNO-001": ["DEPT-COM-001", "DEPT-CKO-001"],
  "CAP-FUT-INB-001": ["DEPT-COS-001"],
  "CAP-FUT-CFO-001": ["DEPT-CFO-001"],
  "CAP-FUT-PBN-001": ["DEPT-CFO-001", "DEPT-PER-001"],
  "CAP-FUT-NPB-001": ["DEPT-CFO-001"],
  "CAP-FUT-CFB-001": ["DEPT-CFO-001", "DEPT-CAM-001"],
  "CAP-FUT-BBN-001": ["DEPT-CFO-001"],
  "CAP-FUT-FKN-001": ["DEPT-CFO-001", "DEPT-CKO-001"],
  "CAP-FUT-HHD-001": ["DEPT-FAM-001"],
  "CAP-FUT-ECD-001": ["DEPT-COM-001", "DEPT-COS-001"],
  "CAP-FUT-VOI-001": ["DEPT-COS-001"],
  "CAP-FUT-MED-001": ["DEPT-COS-001", "DEPT-COM-001"],
  "CAP-FUT-PVO-001": ["DEPT-COS-001"],
  "CAP-FUT-PRV-001": ["DEPT-COS-001", "DEPT-COO-001", "DEPT-SEC-001"],
  "CAP-FUT-ENC-001": ["DEPT-COS-001", "DEPT-COO-001", "DEPT-SEC-001"],
  "CAP-FUT-SOVDASH-001": ["DEPT-COS-001", "DEPT-SEC-001"],
  "CAP-FUT-TRUST-001": ["DEPT-COS-001"],
  "CAP-FUT-MEMLED-001": ["DEPT-COS-001", "DEPT-CKO-001"],
  "CAP-FUT-EXCAP-001": ["DEPT-COS-001"],
  "CAP-FUT-DEPTMAT-001": ["DEPT-COS-001"],
  "CAP-FUT-INSTMEM-001": ["DEPT-COS-001", "DEPT-CKO-001"],
  "CAP-FUT-DECEVO-001": ["DEPT-COS-001", "DEPT-ACT-001"],
  "CAP-FUT-EEM-001": ["DEPT-COO-001", "DEPT-COS-001"],
};

/** Explicit capability → intelligence domain mapping */
export const CAPABILITY_DOMAIN_MAP: Record<string, string[]> = {
  "CAP-FUT-GAC-001": ["IDN-IDENTITY-001"],
  "CAP-FUT-GML-001": ["IDN-IDENTITY-001", "IDN-COMMUNICATIONS-001"],
  "CAP-FUT-CAL-001": ["IDN-TIME-001"],
  "CAP-FUT-KNO-001": ["IDN-KNOWLEDGE-001", "IDN-COMMUNICATIONS-001"],
  "CAP-FUT-INB-001": ["IDN-COMMUNICATIONS-001"],
  "CAP-FUT-CFO-001": ["IDN-FINANCIAL-001", "IDN-FORECASTING-001"],
  "CAP-FUT-PBN-001": ["IDN-FINANCIAL-001"],
  "CAP-FUT-NPB-001": ["IDN-FINANCIAL-001"],
  "CAP-FUT-CFB-001": ["IDN-FINANCIAL-001", "IDN-CAMPAIGN-001"],
  "CAP-FUT-BBN-001": ["IDN-FINANCIAL-001"],
  "CAP-FUT-FKN-001": ["IDN-FINANCIAL-001", "IDN-KNOWLEDGE-001"],
  "CAP-FUT-HHD-001": ["IDN-RELATIONSHIP-001", "IDN-TIME-001"],
  "CAP-FUT-ECD-001": ["IDN-COMMUNICATIONS-001", "IDN-RELATIONSHIP-001", "IDN-IDENTITY-001"],
  "CAP-FUT-VOI-001": ["IDN-COMMUNICATIONS-001"],
  "CAP-FUT-MED-001": ["IDN-COMMUNICATIONS-001", "IDN-KNOWLEDGE-001"],
  "CAP-FUT-PVO-001": ["IDN-IDENTITY-001"],
  "CAP-FUT-PRV-001": ["IDN-IDENTITY-001", "IDN-KNOWLEDGE-001", "IDN-SECURITY-001"],
  "CAP-FUT-ENC-001": ["IDN-SECURITY-001", "IDN-OPERATIONS-001"],
  "CAP-FUT-SOVDASH-001": ["IDN-SECURITY-001", "IDN-KNOWLEDGE-001"],
  "CAP-FUT-TRUST-001": ["IDN-OPERATIONS-001", "IDN-PROJECTS-001"],
  "CAP-FUT-MEMLED-001": ["IDN-KNOWLEDGE-001"],
  "CAP-FUT-EXCAP-001": ["IDN-RELATIONSHIP-001", "IDN-FINANCIAL-001", "IDN-CAMPAIGN-001"],
  "CAP-FUT-DEPTMAT-001": ["IDN-PROJECTS-001", "IDN-OPERATIONS-001"],
  "CAP-FUT-INSTMEM-001": ["IDN-KNOWLEDGE-001"],
  "CAP-FUT-DECEVO-001": ["IDN-KNOWLEDGE-001", "IDN-PROJECTS-001"],
  "CAP-FUT-EEM-001": ["IDN-KNOWLEDGE-001", "IDN-PROJECTS-001", "IDN-OPERATIONS-001"],
  "CAP-EO-001": ["IDN-PROJECTS-001"],
  "CAP-REL-001": ["IDN-RELATIONSHIP-001"],
};

export function getIntelligenceDomain(id: string): IntelligenceDomain | undefined {
  return INTELLIGENCE_DOMAINS.find((d) => d.domain_id === id);
}

export function getExecutiveDepartment(id: string): ExecutiveDepartment | undefined {
  return EXECUTIVE_DEPARTMENTS.find((d) => d.department_id === id);
}

export function getDepartmentsForDomain(domainId: string): ExecutiveDepartment[] {
  return EXECUTIVE_DEPARTMENTS.filter((d) => d.intelligence_domain_ids.includes(domainId));
}

export function resolveDepartmentsForCapability(cap: CapabilityEntry): string[] {
  if (CAPABILITY_DEPARTMENT_MAP[cap.capability_id]) {
    return CAPABILITY_DEPARTMENT_MAP[cap.capability_id];
  }
  const matched = new Set<string>();
  for (const label of cap.departments) {
    for (const dept of EXECUTIVE_DEPARTMENTS) {
      if (dept.legacy_department_labels.includes(label)) {
        matched.add(dept.department_id);
      }
    }
  }
  return [...matched];
}

export function resolveDomainsForCapability(cap: CapabilityEntry): string[] {
  if (CAPABILITY_DOMAIN_MAP[cap.capability_id]) {
    return CAPABILITY_DOMAIN_MAP[cap.capability_id];
  }
  const deptIds = resolveDepartmentsForCapability(cap);
  const domains = new Set<string>();
  for (const deptId of deptIds) {
    const dept = getExecutiveDepartment(deptId);
    if (dept) {
      for (const domainId of dept.intelligence_domain_ids) {
        domains.add(domainId);
      }
    }
  }
  return [...domains];
}

export function getCapabilitiesForDepartment(departmentId: string): CapabilityEntry[] {
  return CAPABILITY_REGISTRY.filter((cap) =>
    resolveDepartmentsForCapability(cap).includes(departmentId),
  );
}

export function getCapabilitiesForDomain(domainId: string): CapabilityEntry[] {
  return CAPABILITY_REGISTRY.filter((cap) =>
    resolveDomainsForCapability(cap).includes(domainId),
  );
}

export function buildExecutiveOfficeProjection(): ExecutiveOfficeProjection {
  const departments: DepartmentProjection[] = EXECUTIVE_DEPARTMENTS.map((dept) => {
    const caps = getCapabilitiesForDepartment(dept.department_id);
    const live = caps.filter((c) => !isPlannedCapability(c));
    const reserved = caps.filter((c) => isPlannedCapability(c));
    return {
      ...dept,
      owned_domains: dept.intelligence_domain_ids
        .map((id) => getIntelligenceDomain(id))
        .filter((d): d is IntelligenceDomain => d !== undefined),
      capability_ids: caps.map((c) => c.capability_id),
      live_capability_count: live.length,
      reserved_capability_count: reserved.length,
    };
  });

  const assigned = new Set<string>();
  for (const dept of departments) {
    for (const id of dept.capability_ids) {
      assigned.add(id);
    }
  }
  const unassigned = CAPABILITY_REGISTRY.filter((c) => !assigned.has(c.capability_id)).map(
    (c) => c.capability_id,
  );

  const synthesis = EXECUTIVE_DEPARTMENTS.find((d) => d.synthesis_role);

  return {
    engine_id: EXECUTIVE_OFFICE_ENGINE_ID,
    slice_id: "LB-OS-026.67",
    generated_at: new Date().toISOString(),
    executive_office: EXECUTIVE_OFFICE,
    hierarchy: [
      "Executive",
      "Executive Office",
      "Departments",
      "Intelligence Domains",
      "Capabilities",
      "Executive Questions",
      "Workflows",
      "Recommendations",
    ],
    departments,
    intelligence_domains: INTELLIGENCE_DOMAINS,
    executive_departments: departments.filter((d) => d.tier === "executive"),
    operational_departments: departments.filter((d) => d.tier === "operational"),
    synthesis_department_id: synthesis?.department_id ?? "DEPT-COS-001",
    unassigned_capability_ids: unassigned,
  };
}

export function renderExecutiveOfficeMarkdown(projection: ExecutiveOfficeProjection): string {
  const lines: string[] = [
    "# Executive Office Structure",
    "",
    `> **Engine:** ${projection.engine_id} · **Slice:** ${projection.slice_id} · **Generated:** ${projection.generated_at}`,
    "",
    "## Hierarchy",
    "",
    "```txt",
    "Executive",
    "        ↓",
    "Executive Office",
    "        ↓",
    "Departments",
    "        ↓",
    "Intelligence Domains",
    "        ↓",
    "Capabilities",
    "        ↓",
    "Executive Questions",
    "        ↓",
    "Workflows",
    "        ↓",
    "Recommendations",
    "```",
    "",
    "> **Rule:** Organization (departments) ≠ Intelligence (domains) ≠ Execution (capabilities).",
    "",
    "---",
    "",
    "## Executive Departments",
    "",
  ];

  for (const dept of projection.executive_departments) {
    const status =
      dept.lifecycle === "live"
        ? "Live"
        : dept.lifecycle === "emerging"
          ? "Emerging"
          : "Reserved";
    lines.push(`### ${dept.department_id} — ${dept.title} [${status}]`);
    if (dept.synthesis_role) {
      lines.push("", "> **Synthesis role:** elevates multi-department briefing");
    }
    lines.push(
      "",
      "**Mission:**",
      dept.objectives.mission,
      "",
      "**Intelligence domains owned:**",
      dept.owned_domains.map((d) => `- ${d.domain_id} — ${d.title} (${d.lifecycle})`).join("\n") ||
        "—",
      "",
      "**Charter — Purpose:**",
      dept.charter.purpose,
      "",
      "| Can | Cannot |",
      "| --- | ------ |",
      `| ${dept.charter.can.join(" · ")} | ${dept.charter.cannot.join(" · ")} |`,
      "",
      "**Standing orders:**",
      ...dept.standing_orders.orders.map((o) => `- ${o}`),
      "",
      "**Escalation policy:**",
      `- **Interrupt executive:** ${dept.escalation_policy.interrupt_executive}`,
      `- **Notify Chief of Staff:** ${dept.escalation_policy.notify_chief_of_staff}`,
      `- **Monitor only:** ${dept.escalation_policy.monitor_only}`,
      `- **Remain silent:** ${dept.escalation_policy.remain_silent}`,
      "",
      `**Operating personality:** ${dept.operating_personality.traits.join(" · ")}`,
      "",
      dept.operating_personality.influences_reasoning,
      "",
      `Capabilities: ${dept.live_capability_count} live · ${dept.reserved_capability_count} reserved`,
      "",
      "---",
      "",
    );
  }

  lines.push("## Intelligence Domains", "", "| Domain | Lifecycle | World Model aspect |", "| ------ | --------- | ------------------ |");
  for (const domain of projection.intelligence_domains) {
    lines.push(`| ${domain.title} | ${domain.lifecycle} | ${domain.world_model_aspect} |`);
  }

  lines.push(
    "",
    "---",
    "",
    "## Operational Departments",
    "",
  );
  for (const dept of projection.operational_departments) {
    lines.push(
      `- **${dept.title}** (${dept.lifecycle}) — ${dept.live_capability_count} live · ${dept.reserved_capability_count} reserved capabilities`,
    );
  }

  if (projection.unassigned_capability_ids.length > 0) {
    lines.push(
      "",
      "## Unassigned capabilities",
      "",
      projection.unassigned_capability_ids.map((id) => `- ${id}`).join("\n"),
    );
  }

  return lines.join("\n");
}

export function getExecutiveOfficeSummary(): {
  live_departments: number;
  reserved_departments: number;
  live_domains: number;
  reserved_domains: number;
  live_capabilities: number;
  reserved_capabilities: number;
} {
  return {
    live_departments: EXECUTIVE_DEPARTMENTS.filter((d) => d.lifecycle === "live").length,
    reserved_departments: EXECUTIVE_DEPARTMENTS.filter((d) => d.lifecycle === "reserved").length,
    live_domains: INTELLIGENCE_DOMAINS.filter((d) => d.lifecycle === "live").length,
    reserved_domains: INTELLIGENCE_DOMAINS.filter((d) => d.lifecycle === "reserved").length,
    live_capabilities: getLiveCapabilities().length,
    reserved_capabilities: getPlannedCapabilities().length,
  };
}
