export type FoundryProductKind = "software" | "platform" | "book" | "service" | "component";
export type FoundryPhaseStatus = "planned" | "active" | "submitted" | "accepted" | "rework" | "blocked";

export type CompetitorEvidence = {
  name: string;
  category: string;
  pricing_note?: string;
  source_url?: string;
  evidence_status: "market_anchor" | "needs_refresh" | "internal_substitute";
};

export type MasterBuildPlan = {
  id: string;
  productId: string;
  title: string;
  status: "draft" | "accepted" | "active" | "complete" | "hold";
  purpose: string;
  remainingReadinessPct: number;
  budgetUsd: number;
  capstoneEligible: boolean;
};

export type PhaseValueRecord = {
  phaseId: string;
  masterPlanId: string;
  productId: string;
  title: string;
  budgetUsd: number;
  phaseClass: string;
  status: FoundryPhaseStatus;
  acceptanceCriteria: string[];
  evidenceRequired: string[];
  acceptedEvidence: string[];
};

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
  competitors: CompetitorEvidence[];
  advantages: string[];
  disadvantages: string[];
  notes?: string;
};

export type CompanyFoundrySnapshot = {
  meta: { schemaVersion: string; slice: string; mode: "read-first"; updated: string; cashForecastUntilPaidValidationUsd: number };
  products: FoundryProduct[];
  masterPlans: MasterBuildPlan[];
  phases: PhaseValueRecord[];
  builders: unknown[];
  capstones: unknown[];
  economicRules: {
    companyResidualFloorPct: number;
    capstoneLeadResidualCeilingPct: number;
    apprenticeHourlyRateUsd: number;
    defaultSettlementCadence: "monthly";
    equityIssuanceEnabled: false;
    payrollEnabled: false;
    moneyMovementEnabled: false;
  };
};

const competitors = {
  souschef: [
    { name: "Samsung Food+", category: "meal planning / recipe", pricing_note: "$6.99 monthly / $59.99 annual market anchor captured in CF-006 research", evidence_status: "market_anchor" as const },
    { name: "Mealime", category: "meal planning", evidence_status: "needs_refresh" as const },
    { name: "SideChef", category: "meal planning / cooking", evidence_status: "needs_refresh" as const },
  ],
  campaignos: [
    { name: "NationBuilder", category: "political/community CRM", pricing_note: "Starter/Pro market anchor captured in CF-006 research", evidence_status: "market_anchor" as const },
    { name: "Ecanvasser", category: "field organizing", pricing_note: "tiered market anchor captured in CF-006 research", evidence_status: "market_anchor" as const },
  ],
  localbrain: [
    { name: "Mem", category: "AI knowledge workspace", pricing_note: "professional subscription market anchor captured in CF-006 research", evidence_status: "market_anchor" as const },
    { name: "Notion AI", category: "AI workspace", evidence_status: "needs_refresh" as const },
  ],
  canonforge: [
    { name: "Scrivener", category: "authoring", evidence_status: "needs_refresh" as const },
    { name: "NovelCrafter", category: "AI writing / story planning", evidence_status: "needs_refresh" as const },
    { name: "Sudowrite", category: "AI writing", evidence_status: "market_anchor" as const },
  ],
  bookfoundry: [
    { name: "Atticus", category: "authoring / formatting", evidence_status: "market_anchor" as const },
    { name: "Campfire", category: "writing / worldbuilding", evidence_status: "market_anchor" as const },
  ],
};

function p(partial: Omit<FoundryProduct, "competitors" | "advantages" | "disadvantages"> & { competitors?: CompetitorEvidence[]; advantages?: string[]; disadvantages?: string[] }): FoundryProduct {
  return { competitors: [], advantages: [], disadvantages: [], ...partial };
}

export const products: FoundryProduct[] = [
  p({ id: "souschef", name: "SousChef / HomeChef AI", kind: "software", readiness: 90, disposition: "ACCELERATE · TRAINING PRODUCT", annualLow: 150000, annualHigh: 600000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/HomeChefAi"], competitors: competitors.souschef, advantages: ["Persistent household food memory", "Pantry + receipt/photo + planning + learning", "568k+ structured recipe corpus"], disadvantages: ["Crowded consumer market", "Mobile expectations", "Customer acquisition cost risk"], notes: "Cohort 1 completion environment; pre-existing company product, not trainee Capstone." }),
  p({ id: "localbrain", name: "LocalBrain", kind: "platform", readiness: 85, disposition: "ACCELERATE · NARROW ICP", annualLow: 180000, annualHigh: 900000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/LocalBrain"], competitors: competitors.localbrain, advantages: ["Private/local-first executive OS", "Departmental operational memory", "GPU/on-prem path"], disadvantages: ["Very broad scope", "Enterprise security/support burden"] }),
  p({ id: "campaignos", name: "CampaignOS", kind: "software", readiness: 80, disposition: "ACCELERATE · CLEAN EXTRACTION", annualLow: 240000, annualHigh: 1200000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/CampaignOS", "Grappe501/reddirt"], competitors: competitors.campaignos, advantages: ["Integrated campaign operating model", "Real campaign proving ground", "Founder domain expertise"], disadvantages: ["Multi-tenancy extraction", "Political compliance/security", "Seasonality"] }),
  p({ id: "votematch", name: "VoteMatch", kind: "software", readiness: 76, disposition: "ACCELERATE · HARDEN AUTH/PRIVACY", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/VoteMatch"], advantages: ["Confidence-aware matching", "OCR + mandatory human review", "Clear expensive workflow"], disadvantages: ["Jurisdiction variability", "Sensitive voter/signature data"] }),
  p({ id: "bidassembly", name: "Bid Assembly", kind: "software", readiness: 65, disposition: "ACCELERATE · B2B VALIDATION", annualLow: 120000, annualHigh: 720000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/bidapp"], advantages: ["Grounded drafting", "Requirement/evidence/vendor workflow", "High-value B2B use case"], disadvantages: ["ICP and pricing still need customer validation", "Enterprise procurement competitors"] }),
  p({ id: "canonforge", name: "CanonForge Knowledge OS", kind: "platform", readiness: 70, disposition: "VALIDATE + EXTRACT", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/CanonForge"], competitors: competitors.canonforge, advantages: ["Provenance + canon + contradiction + decision history", "Complex-project continuity"], disadvantages: ["Category education required", "Founder-heavy proof today"] }),
  p({ id: "peoplebase", name: "PeopleBase / ContactList", kind: "software", readiness: 70, disposition: "INCUBATE", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/PeopleBaseII", "Grappe501/ContactList", "Grappe501/people"] }),
  p({ id: "eventops", name: "Event Operations", kind: "software", readiness: 58, disposition: "INCUBATE", annualLow: 90000, annualHigh: 450000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/reddirt", "Grappe501/kelly-calendar"] }),
  p({ id: "fieldspark", name: "FieldSpark / Field Command", kind: "software", readiness: 50, disposition: "INCUBATE · CAMPAIGNOS MODULE FIRST", annualLow: 120000, annualHigh: 600000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/FieldSpark", "Grappe501/field-structure", "Grappe501/regnat-populus-field", "Grappe501/kelly-field-operations"] }),
  p({ id: "bookfoundry", name: "Writers Dashboard / Book Foundry", kind: "platform", readiness: 45, disposition: "INCUBATE · PRODUCTIZE", annualLow: 60000, annualHigh: 300000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/writers_dashboard", "Grappe501/WRITERS_DASHBOARD_M2"], competitors: competitors.bookfoundry }),
  p({ id: "constitutional-capitalism", name: "Constitutional Capitalism", kind: "book", readiness: 45, disposition: "BOOK PRODUCT", annualLow: 10000, annualHigh: 75000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/constitutional-capitalism"] }),
  p({ id: "mercy-protocol", name: "The Mercy Protocol", kind: "book", readiness: 85, disposition: "BOOK PRODUCT · PUBLICATION TRACK", annualLow: 5000, annualHigh: 50000, training: true, capstoneCandidate: false, sourceRepos: ["Grappe501/Mercy_Protocol"] }),
  p({ id: "campti", name: "Campti / Grappe Historical Novel", kind: "book", readiness: 30, disposition: "BOOK PRODUCT · AUDIT", annualLow: 5000, annualHigh: 40000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/campti"] }),
  p({ id: "arkansas-history", name: "Arkansas Political History", kind: "book", readiness: 25, disposition: "BOOK PRODUCT · AUDIT", annualLow: 5000, annualHigh: 30000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/arkansas-political-history"] }),
  p({ id: "arkansas-galaxy", name: "Arkansas Galaxy", kind: "book", readiness: 20, disposition: "BOOK PRODUCT · IP REVIEW", annualLow: 0, annualHigh: 40000, training: false, capstoneCandidate: false, sourceRepos: ["Grappe501/Star_Wars"] }),
  p({ id: "elvestribal", name: "Elvestribal", kind: "book", readiness: 15, disposition: "BOOK PRODUCT · CONTENT AUDIT", annualLow: 0, annualHigh: 0, training: false, capstoneCandidate: false, sourceRepos: ["Grappe501/Elvestribal", "Grappe501/elvestribal-monrepo"] }),
  p({ id: "county-intelligence", name: "County Intelligence / Workbench", kind: "software", readiness: 60, disposition: "INCUBATE", annualLow: 60000, annualHigh: 300000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/county-workbench"] }),
  p({ id: "civic-university", name: "Civic University Technology", kind: "platform", readiness: 70, disposition: "HOLD · OWNERSHIP/PRIVACY REVIEW", annualLow: 60000, annualHigh: 300000, training: false, capstoneCandidate: false, sourceRepos: ["Grappe501/arkansas-civic-university", "Grappe501/ARKANSAS_CIVICS"] }),
  p({ id: "block-street", name: "Block Street", kind: "platform", readiness: 30, disposition: "PROVING GROUND", annualLow: 30000, annualHigh: 180000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/Block-Street"] }),
  p({ id: "news-intelligence", name: "Signal / News Command Center", kind: "software", readiness: 30, disposition: "INCUBATE · CONTENT AUDIT", annualLow: 60000, annualHigh: 300000, training: true, capstoneCandidate: true, sourceRepos: ["Grappe501/signal", "Grappe501/News-command-center"] }),
  p({ id: "campaign-compliance", name: "Campaign Compliance", kind: "software", readiness: 35, disposition: "INCUBATE · LEGAL ACCURACY GATE", annualLow: 60000, annualHigh: 300000, training: false, capstoneCandidate: true, sourceRepos: ["Grappe501/campaign_compliance", "Grappe501/Compliance"] }),
];

export const masterPlans: MasterBuildPlan[] = [
  { id: "MBP-SOUSCHEF-V1", productId: "souschef", title: "SousChef V1 Paid Beta Completion", status: "accepted", purpose: "Use Cohort 1 to finish the remaining launch-critical 10% of a pre-existing product and measure Academy production economics.", remainingReadinessPct: 10, budgetUsd: 12000, capstoneEligible: false },
];

const phaseSpecs: Array<[string,string,number,string,string[],string[]]> = [
  ["SC-01","Production & security audit",900,"Audit",["Document launch blockers","Identify security/privacy risks","No critical issue left unclassified"],["audit report","risk register"]],
  ["SC-02","Billing + entitlement rail",1400,"Build",["Paid plan state represented","Entitlement checks documented/tested","Failure state handled"],["tests","build proof","billing flow evidence"]],
  ["SC-03","Paid onboarding funnel",1200,"Build",["New user reaches first-value state","Paid/free state is explicit","Drop-off points instrumented"],["flow proof","analytics events","tests"]],
  ["SC-04","AI cost telemetry",900,"Build",["AI usage can be attributed","Cost-risk thresholds documented"],["telemetry proof","cost report"]],
  ["SC-05","Mobile UX hardening",1200,"Polish",["Core launch flows usable on mobile","No known blocking overflow/navigation defects"],["viewport review","build proof"]],
  ["SC-06","Privacy & data controls",1100,"Governance",["User data controls documented","Retention/deletion gaps classified"],["privacy checklist","data-flow evidence"]],
  ["SC-07","Beta feedback loop",900,"Product",["Feedback intake exists","Issue triage links to product work"],["feedback workflow","triage proof"]],
  ["SC-08","Paid beta instrumentation",1200,"Commercial",["Conversion and activation metrics captured","Paid cohort can be measured"],["analytics proof","metric definitions"]],
  ["SC-09","Stabilization & rework",1000,"QA",["Launch-critical defects resolved or accepted as known risk"],["test run","defect ledger"]],
  ["SC-10","V1 acceptance + launch evidence",1000,"Acceptance",["Master Plan acceptance criteria reviewed","V1 evidence bundle complete"],["acceptance report","build proof","release checklist"]],
];

export const phases: PhaseValueRecord[] = phaseSpecs.map(([phaseId,title,budgetUsd,phaseClass,acceptanceCriteria,evidenceRequired]) => ({ phaseId, masterPlanId: "MBP-SOUSCHEF-V1", productId: "souschef", title, budgetUsd, phaseClass, status: "planned", acceptanceCriteria, evidenceRequired, acceptedEvidence: [] }));

export const snapshot: CompanyFoundrySnapshot = {
  meta: { schemaVersion: "2.0", slice: "CF-008", mode: "read-first", updated: "2026-08-28", cashForecastUntilPaidValidationUsd: 0 },
  products,
  masterPlans,
  phases,
  builders: [],
  capstones: [],
  economicRules: { companyResidualFloorPct: 25, capstoneLeadResidualCeilingPct: 51, apprenticeHourlyRateUsd: 20, defaultSettlementCadence: "monthly", equityIssuanceEnabled: false, payrollEnabled: false, moneyMovementEnabled: false },
};

export function validateSnapshot(value: CompanyFoundrySnapshot): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const product of value.products) {
    if (!product.id || !product.name) errors.push("product missing id/name");
    if (ids.has(product.id)) errors.push(`duplicate product id: ${product.id}`);
    ids.add(product.id);
    if (product.readiness < 0 || product.readiness > 100) errors.push(`invalid readiness: ${product.id}`);
    if (product.annualLow < 0 || product.annualHigh < product.annualLow) errors.push(`invalid revenue band: ${product.id}`);
  }
  for (const plan of value.masterPlans) {
    if (!ids.has(plan.productId)) errors.push(`master plan references unknown product: ${plan.id}`);
  }
  for (const phase of value.phases) {
    if (!ids.has(phase.productId)) errors.push(`phase references unknown product: ${phase.phaseId}`);
    if (phase.budgetUsd < 0) errors.push(`negative phase budget: ${phase.phaseId}`);
  }
  if (value.economicRules.companyResidualFloorPct < 25) errors.push("company residual floor below doctrine");
  if (value.economicRules.capstoneLeadResidualCeilingPct > 51) errors.push("lead residual ceiling above doctrine");
  if (value.economicRules.equityIssuanceEnabled || value.economicRules.payrollEnabled || value.economicRules.moneyMovementEnabled) errors.push("CF-008 must remain read-only financially");
  return errors;
}
