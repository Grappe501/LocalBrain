export type FoundryProductKind = "software" | "platform" | "book" | "service" | "component";

export type FoundryProduct = {
  id: string;
  name: string;
  kind: FoundryProductKind;
  readiness: number;
  disposition: string;
  annualLow: number;
  annualHigh: number;
  training: boolean;
  capstoneCandidate: boolean;
  sourceRepos: string[];
  notes?: string;
};

export type FoundryPhase = {
  id: string;
  productId: string;
  title: string;
  budget: number;
  phaseClass: string;
  status: "planned" | "active" | "submitted" | "accepted" | "rework" | "blocked";
};

export type FoundryBuilder = {
  id: string;
  displayName: string;
  level: "L0" | "L1" | "L2" | "L3" | "L4" | "L5";
  status: "candidate" | "apprentice" | "active" | "proof_period" | "alumni";
  phaseValuePoints: number;
  acceptedPhases: number;
  capstoneId?: string;
};

export type FoundryCapstone = {
  id: string;
  name: string;
  productId?: string;
  leadBuilderId?: string;
  status: "candidate" | "master_plan_review" | "approved" | "building" | "launched" | "hold" | "killed";
  companyResidualPct: number;
  leadResidualPct: number;
  teamResidualPct: number;
};

export type FoundryEconomicRules = {
  companyResidualFloorPct: number;
  capstoneLeadResidualCeilingPct: number;
  apprenticeHourlyRateUsd: number;
  defaultSettlementCadence: "monthly";
  equityIssuanceEnabled: boolean;
  payrollEnabled: boolean;
  moneyMovementEnabled: boolean;
};

export const foundryProducts: FoundryProduct[] = [
  { id: "souschef", name: "SousChef / HomeChef AI", kind: "software", readiness: 90, disposition: "ACCELERATE · TRAINING PRODUCT", annualLow: 150000, annualHigh: 600000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/HomeChefAi"], notes: "Cohort 1 completion environment; pre-existing company product, not trainee Capstone." },
  { id: "localbrain", name: "LocalBrain", kind: "platform", readiness: 85, disposition: "ACCELERATE · NARROW ICP", annualLow: 180000, annualHigh: 900000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/LocalBrain"] },
  { id: "campaignos", name: "CampaignOS", kind: "software", readiness: 80, disposition: "ACCELERATE · CLEAN EXTRACTION", annualLow: 240000, annualHigh: 1200000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/CampaignOS", "Grappe501/reddirt"] },
  { id: "votematch", name: "VoteMatch", kind: "software", readiness: 76, disposition: "ACCELERATE · HARDEN AUTH/PRIVACY", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/VoteMatch"] },
  { id: "bidassembly", name: "Bid Assembly", kind: "software", readiness: 65, disposition: "ACCELERATE · B2B VALIDATION", annualLow: 120000, annualHigh: 720000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/bidapp"] },
  { id: "canonforge", name: "CanonForge Knowledge OS", kind: "platform", readiness: 70, disposition: "VALIDATE + EXTRACT", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/CanonForge"] },
  { id: "peoplebase", name: "PeopleBase / ContactList", kind: "software", readiness: 70, disposition: "INCUBATE", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/PeopleBaseII", "Grappe501/ContactList", "Grappe501/people"] },
  { id: "eventops", name: "Event Operations", kind: "software", readiness: 58, disposition: "INCUBATE", annualLow: 90000, annualHigh: 450000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/reddirt", "Grappe501/kelly-calendar"] },
  { id: "fieldspark", name: "FieldSpark / Field Command", kind: "software", readiness: 50, disposition: "INCUBATE · CAMPAIGNOS MODULE FIRST", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/FieldSpark", "Grappe501/field-structure", "Grappe501/regnat-populus-field", "Grappe501/kelly-field-operations"] },
  { id: "bookfoundry", name: "Writers Dashboard / Book Foundry", kind: "platform", readiness: 45, disposition: "INCUBATE · PRODUCTIZE", annualLow: 60000, annualHigh: 300000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/writers_dashboard", "Grappe501/WRITERS_DASHBOARD_M2"] },
  { id: "constitutional-capitalism", name: "Constitutional Capitalism", kind: "book", readiness: 45, disposition: "BOOK PRODUCT", annualLow: 10000, annualHigh: 75000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/constitutional-capitalism"] },
  { id: "mercy-protocol", name: "The Mercy Protocol", kind: "book", readiness: 85, disposition: "BOOK PRODUCT · PUBLICATION TRACK", annualLow: 5000, annualHigh: 50000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/Mercy_Protocol"] },
  { id: "campti", name: "Campti / Grappe Historical Novel", kind: "book", readiness: 30, disposition: "BOOK PRODUCT · AUDIT", annualLow: 5000, annualHigh: 40000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/campti"] },
  { id: "arkansas-history", name: "Arkansas Political History", kind: "book", readiness: 25, disposition: "BOOK PRODUCT · AUDIT", annualLow: 5000, annualHigh: 30000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/arkansas-political-history"] },
  { id: "arkansas-galaxy", name: "Arkansas Galaxy", kind: "book", readiness: 20, disposition: "BOOK PRODUCT · IP REVIEW", annualLow: 0, annualHigh: 40000, training: false, capstoneCandidate: false, sourceRepos: ["Grappe501/Star_Wars"] },
  { id: "elvestribal", name: "Elvestribal", kind: "book", readiness: 15, disposition: "BOOK PRODUCT · CONTENT AUDIT", annualLow: 0, annualHigh: 0, training: false, capstoneCandidate: false, sourceRepos: ["Grappe501/Elvestribal", "Grappe501/elvestribal-monrepo"] },
  { id: "county-intelligence", name: "County Intelligence / Workbench", kind: "software", readiness: 60, disposition: "INCUBATE", annualLow: 60000, annualHigh: 300000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/county-workbench"] },
  { id: "civic-university", name: "Civic University Technology", kind: "platform", readiness: 70, disposition: "HOLD · OWNERSHIP/PRIVACY REVIEW", annualLow: 60000, annualHigh: 300000, training: false, capstoneCandidate: false, sourceRepos: ["Grappe501/arkansas-civic-university", "Grappe501/ARKANSAS_CIVICS"] },
  { id: "block-street", name: "Block Street", kind: "platform", readiness: 30, disposition: "PROVING GROUND", annualLow: 30000, annualHigh: 180000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/Block-Street"] },
  { id: "news-intelligence", name: "Signal / News Command Center", kind: "software", readiness: 30, disposition: "INCUBATE · CONTENT AUDIT", annualLow: 60000, annualHigh: 300000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/signal", "Grappe501/News-command-center"] },
  { id: "campaign-compliance", name: "Campaign Compliance", kind: "software", readiness: 35, disposition: "INCUBATE · LEGAL ACCURACY GATE", annualLow: 60000, annualHigh: 300000, training: false, capstoneCandidate: true, sourceRepos: ["Grappe501/campaign_compliance", "Grappe501/Compliance"] }
];

export const foundryPhases: FoundryPhase[] = [
  { id: "SC-01", productId: "souschef", title: "Production & security audit", budget: 900, phaseClass: "Audit", status: "planned" },
  { id: "SC-02", productId: "souschef", title: "Billing + entitlement rail", budget: 1400, phaseClass: "Build", status: "planned" },
  { id: "SC-03", productId: "souschef", title: "Paid onboarding funnel", budget: 1200, phaseClass: "Build", status: "planned" },
  { id: "SC-04", productId: "souschef", title: "AI cost telemetry", budget: 900, phaseClass: "Build", status: "planned" },
  { id: "SC-05", productId: "souschef", title: "Mobile UX hardening", budget: 1200, phaseClass: "Polish", status: "planned" },
  { id: "SC-06", productId: "souschef", title: "Privacy & data controls", budget: 1100, phaseClass: "Governance", status: "planned" },
  { id: "SC-07", productId: "souschef", title: "Beta feedback loop", budget: 900, phaseClass: "Product", status: "planned" },
  { id: "SC-08", productId: "souschef", title: "Paid beta instrumentation", budget: 1200, phaseClass: "Commercial", status: "planned" },
  { id: "SC-09", productId: "souschef", title: "Stabilization & rework", budget: 1000, phaseClass: "QA", status: "planned" },
  { id: "SC-10", productId: "souschef", title: "V1 acceptance + launch evidence", budget: 1000, phaseClass: "Acceptance", status: "planned" }
];

export const foundryBuilders: FoundryBuilder[] = [];
export const foundryCapstones: FoundryCapstone[] = [];

export const foundryEconomicRules: FoundryEconomicRules = {
  companyResidualFloorPct: 25,
  capstoneLeadResidualCeilingPct: 51,
  apprenticeHourlyRateUsd: 20,
  defaultSettlementCadence: "monthly",
  equityIssuanceEnabled: false,
  payrollEnabled: false,
  moneyMovementEnabled: false
};

export const foundryRegistryMeta = {
  schemaVersion: "1.0",
  slice: "CF-007",
  mode: "read-first",
  updated: "2026-08-28",
  cashForecastUntilPaidValidationUsd: 0
} as const;
